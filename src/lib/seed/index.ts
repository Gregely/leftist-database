/**
 * Loads the sample records into an empty database.
 * Run with `npm run db:seed` (or `npm run db:reset` to start over).
 */
import { sql } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import * as s from "@/lib/db/schema";
import { KINDS, normaliseRelationship, type EntityKind } from "@/lib/content/model";
import { rebuildSearchIndex } from "@/lib/db/search-index";
import { concepts } from "./concepts";
import { debates } from "./debates";
import { paths } from "./paths";
import { excerpts, relationships } from "./relationships";
import { sources } from "./sources";
import { events, tendencies } from "./tendencies-events";
import { texts } from "./texts";
import { thinkers } from "./thinkers";
import type { Ref, SeedCitation } from "./types";

type Db = LibSQLDatabase<typeof s>;

export const seedId = (kind: EntityKind, slug: string) => `${KINDS[kind].idPrefix}_${slug}`;

function refId(ref: Ref | string): string {
  const [kind, slug] = ref.split(":") as [EntityKind, string];
  if (!KINDS[kind]) throw new Error(`Unknown kind in reference ${ref}`);
  return seedId(kind, slug);
}

export async function seedDatabase(db: Db, log: (m: string) => void = console.log) {
  const known = new Set<string>();
  const counts: Record<string, number> = {};

  async function entity(
    kind: EntityKind,
    r: {
      slug: string;
      title: string;
      subtitle?: string;
      summary: string;
      body?: string;
      aliases?: string[];
      yearStart?: number | null;
      yearEnd?: number | null;
      featured?: boolean;
      sortOrder?: number;
      citations?: SeedCitation[];
    },
    i: number,
  ) {
    const id = seedId(kind, r.slug);
    await db.insert(s.entities).values({
      id,
      kind,
      slug: r.slug,
      title: r.title,
      subtitle: r.subtitle ?? null,
      summary: r.summary,
      body: r.body ?? "",
      aliases: JSON.stringify(r.aliases ?? []),
      yearStart: r.yearStart ?? null,
      yearEnd: r.yearEnd ?? null,
      featured: r.featured ?? false,
      sortOrder: r.sortOrder ?? (i + 1) * 10,
      status: "published",
      live: true,
      isSample: true,
      publishedRevision: 0,
      publishedAt: new Date().toISOString(),
    });
    for (const [n, c] of (r.citations ?? []).entries()) {
      await db.insert(s.citations).values({
        id: `${id}_cite_${n}`,
        entityId: id,
        sourceId: c.source,
        locator: c.locator ?? null,
        field: c.field ?? null,
        note: c.note ?? "",
        position: n,
      });
    }
    known.add(id);
    counts[kind] = (counts[kind] ?? 0) + 1;
    return id;
  }

  for (const src of sources) {
    await db.insert(s.sources).values({
      id: src.id,
      title: src.title,
      author: src.author,
      publicationDate: src.publicationDate ?? null,
      publisher: src.publisher ?? null,
      url: src.url ?? null,
      sourceType: src.sourceType,
      locator: src.locator ?? null,
      notes: src.notes ?? "",
    });
  }

  for (const [i, t] of thinkers.entries()) {
    const id = await entity("thinker", t, i);
    await db.insert(s.thinkerDetails).values({
      entityId: id,
      roles: t.roles,
      birthPlace: t.birthPlace ?? null,
      deathPlace: t.deathPlace ?? null,
      legacy: t.legacy ?? "",
    });
  }
  for (const [i, c] of concepts.entries()) {
    const id = await entity("concept", c, i);
    await db.insert(s.conceptDetails).values({
      entityId: id,
      brief: c.brief,
      standard: c.standard ?? "",
      deep: c.deep ?? "",
    });
  }
  for (const [i, t] of texts.entries()) {
    const id = await entity("text", t, i);
    await db.insert(s.textDetails).values({
      entityId: id,
      originalTitle: t.originalTitle ?? null,
      language: t.language ?? null,
      form: t.form,
      publicationNote: t.publicationNote ?? null,
      difficulty: t.difficulty ?? 2,
      readingUrl: t.readingUrl ?? null,
    });
  }
  for (const [i, t] of tendencies.entries()) {
    const id = await entity("tendency", t, i);
    await db.insert(s.tendencyDetails).values({ entityId: id, color: t.color, periodLabel: t.periodLabel ?? null });
  }
  for (const [i, e] of events.entries()) {
    const id = await entity("event", e, i);
    await db.insert(s.eventDetails).values({
      entityId: id,
      dateLabel: e.dateLabel ?? null,
      place: e.place ?? null,
      eventType: e.eventType,
    });
  }

  for (const [i, d] of debates.entries()) {
    const id = await entity("debate", d, i);
    await db.insert(s.debateDetails).values({ entityId: id, intro: d.intro });
    const propIds = new Map<string, string>();
    for (const [n, p] of d.propositions.entries()) {
      const pid = `${id}_prop_${p.key}`;
      propIds.set(p.key, pid);
      await db.insert(s.debatePropositions).values({ id: pid, debateId: id, statement: p.statement, position: n });
    }
    const posIds = new Map<string, string>();
    for (const [n, p] of d.positions.entries()) {
      const pid = `${id}_pos_${p.key}`;
      posIds.set(p.key, pid);
      await db.insert(s.debatePositions).values({
        id: pid,
        debateId: id,
        holderId: p.holder ? refId(p.holder) : null,
        label: p.label,
        centralClaim: p.centralClaim,
        summary: p.summary,
        assumptions: JSON.stringify(p.assumptions ?? []),
        criticisms: JSON.stringify(p.criticisms ?? []),
        position: n,
      });
      for (const [propKey, value] of Object.entries(p.stances ?? {})) {
        const [stance, note] = Array.isArray(value) ? value : [value, ""];
        const propositionId = propIds.get(propKey);
        if (!propositionId) throw new Error(`Unknown proposition ${propKey} in ${d.slug}`);
        await db.insert(s.positionStances).values({ positionId: pid, propositionId, stance, note });
      }
    }
    // Links resolved after all entities exist (below).
    for (const [n, a] of (d.arguments ?? []).entries()) {
      await db.insert(s.debateArguments).values({
        id: `${id}_arg_${a.key}`,
        debateId: id,
        positionId: a.position ? posIds.get(a.position) ?? null : null,
        kind: a.kind,
        respondsToId: a.respondsTo ? `${id}_arg_${a.respondsTo}` : null,
        body: a.body,
        position: n,
      });
    }
  }

  for (const [i, p] of paths.entries()) {
    const id = await entity("path", p, i);
    await db.insert(s.pathDetails).values({
      entityId: id,
      entryLine: p.entryLine,
      level: p.level,
      estimatedTime: p.estimatedTime ?? null,
    });
  }

  // Second pass: anything that references other entities.
  for (const d of debates) {
    const id = seedId("debate", d.slug);
    for (const p of d.positions) {
      for (const link of p.links ?? []) {
        const target = refId(link);
        if (!known.has(target)) throw new Error(`Debate ${d.slug}: unknown link ${link}`);
        await db.insert(s.positionLinks).values({ positionId: `${id}_pos_${p.key}`, entityId: target });
      }
    }
  }
  for (const p of paths) {
    const id = seedId("path", p.slug);
    for (const [n, step] of p.steps.entries()) {
      const target = refId(step.ref);
      if (!known.has(target)) throw new Error(`Path ${p.slug}: unknown step ${step.ref}`);
      await db.insert(s.pathSteps).values({
        id: `${id}_step_${n + 1}`,
        pathId: id,
        entityId: target,
        position: n + 1,
        framing: step.framing,
      });
    }
  }

  let relCount = 0;
  for (const [n, [from, type, to, note, weight]] of relationships.entries()) {
    const a = refId(from);
    const b = refId(to);
    if (!known.has(a) || !known.has(b)) throw new Error(`Relationship ${from} ${type} ${to}: unknown endpoint`);
    const rel = normaliseRelationship(a, type, b);
    const res = await db
      .insert(s.relationships)
      .values({ id: `rel_${String(n).padStart(4, "0")}`, ...rel, note: note ?? "", weight: weight ?? 2 })
      .onConflictDoNothing();
    relCount += res.rowsAffected;
  }

  for (const [n, x] of excerpts.entries()) {
    await db.insert(s.excerpts).values({
      id: `ex_${String(n).padStart(3, "0")}`,
      entityId: refId(x.entity),
      textId: x.text ? refId(x.text) : null,
      sourceId: x.source ?? null,
      body: x.body,
      locator: x.locator ?? null,
      note: x.note ?? "Sample excerpt — verify wording against the cited edition.",
      verification: x.verified ? "verified" : "unverified",
      position: n,
    });
  }

  const indexed = await rebuildSearchIndex(db);
  await db.run(sql`PRAGMA optimize`);
  log(
    `Seeded ${Object.entries(counts)
      .map(([k, v]) => `${v} ${k}`)
      .join(", ")}, ${sources.length} sources, ${relCount} relationships, ${excerpts.length} excerpts; indexed ${indexed}.`,
  );
}
