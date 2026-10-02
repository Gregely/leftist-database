import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import { debatePositions, entities, relationships, thinkerDetails } from "@/lib/db/schema";
import { stagedVisible, structureVisible } from "./scope";
import { entityHref } from "@/lib/content/model";
import { buildProse, getEntityRow, getExcerpts, getMediaFor, getRelations, isPublic, pick, toSummary, uniqueById, withPreview } from "./core";
import type { PreviewSpec } from "./types";
import { getNeighborhood } from "./graph";

export async function getThinker(slug: string, preview?: PreviewSpec) {
  const row = await getEntityRow("thinker", slug, preview);
  if (!row) return null;
  const db = await ready();
  const details = withPreview(
    (await db.select().from(thinkerDetails).where(eq(thinkerDetails.entityId, row.id)).get()) ?? {
      roles: "",
      birthPlace: null,
      deathPlace: null,
      context: "",
      legacy: "",
    },
    preview,
  );

  const [relations, positions, excerpts, network, prose, media] = await Promise.all([
    getRelations(row.id),
    db
      .select({ position: debatePositions, debate: entities })
      .from(debatePositions)
      .innerJoin(entities, eq(entities.id, debatePositions.debateId))
      .where(and(eq(debatePositions.holderId, row.id), isPublic(), structureVisible(debatePositions.stagedFor, debatePositions.debateId))),
    getExcerpts({ entityId: row.id }),
    getNeighborhood(row.id, { depth: 1, kinds: ["thinker"], limit: 24, includeIds: preview ? [row.id] : [] }),
    buildProse(row.id, [row.body, details.context, details.legacy]),
    getMediaFor(row.id),
  ]);

  const tendencies = pick(relations, "MEMBER_OF", "out", "tendency");
  const ideas = uniqueById([
    ...pick(relations, "DEVELOPED", "out", "concept"),
    ...pick(relations, "ASSOCIATED_WITH", undefined, "concept"),
  ]);
  const works = pick(relations, "WROTE", "out", "text").sort((a, b) => (a.yearStart ?? 0) - (b.yearStart ?? 0));
  const influencedBy = relations.filter(
    (r) => r.kind === "thinker" && r.direction === "in" && (r.type === "INFLUENCED" || r.type === "DEVELOPED"),
  );
  const influenced = relations.filter((r) => r.kind === "thinker" && r.direction === "out" && r.type === "INFLUENCED");
  const collaborators = pick(relations, "ASSOCIATED_WITH", undefined, "thinker");
  const disagreements = relations.filter((r) => r.family === "critique" || r.type === "RESPONDED_TO");
  const events = relations.filter((r) => r.kind === "event");
  const relatedThinkers = uniqueById(relations.filter((r) => r.kind === "thinker")).slice(0, 8);

  const timeline = [
    ...(row.yearStart ? [{ year: row.yearStart, title: "Born" + (details.birthPlace ? `, ${details.birthPlace}` : ""), href: null as string | null, kind: "life" as const }] : []),
    ...works.filter((w) => w.yearStart).map((w) => ({ year: w.yearStart!, title: w.title, href: w.href, kind: "text" as const })),
    ...events.filter((e) => e.yearStart).map((e) => ({ year: e.yearStart!, title: e.title, href: e.href, kind: "event" as const })),
    ...(row.yearEnd ? [{ year: row.yearEnd, title: "Died" + (details.deathPlace ? `, ${details.deathPlace}` : ""), href: null, kind: "life" as const }] : []),
  ].sort((a, b) => a.year - b.year);

  return {
    entity: toSummary(row),
    body: row.body,
    aliases: row.aliases,
    sortOrder: row.sortOrder,
    details,
    tendencies,
    ideas,
    works,
    influencedBy,
    influenced,
    collaborators,
    disagreements,
    debates: positions.map((p) => ({
      debate: toSummary(p.debate),
      positionLabel: p.position.label,
      centralClaim: p.position.centralClaim,
      href: `${entityHref("debate", p.debate.slug)}#position-${p.position.id}`,
    })),
    events,
    relatedThinkers,
    timeline,
    excerpts,
    network,
    prose,
    media,
  };
}

export type ThinkerAggregate = NonNullable<Awaited<ReturnType<typeof getThinker>>>;

/** Attach tendency memberships to a page of thinkers. */
export async function withTendencies<T extends { id: string }>(items: T[]) {
  const db = await ready();
  const ids = items.map((i) => i.id);
  const memberships = ids.length
    ? await db
        .select()
        .from(relationships)
        .where(and(eq(relationships.type, "MEMBER_OF"), inArray(relationships.fromId, ids), stagedVisible(relationships.stagedFor)))
    : [];
  const tendencyIds = [...new Set(memberships.map((m) => m.toId))];
  const tendencies = tendencyIds.length ? await db.select().from(entities).where(and(inArray(entities.id, tendencyIds), isPublic())) : [];
  const tById = new Map(tendencies.map((t) => [t.id, toSummary(t)]));
  return items.map((r) => ({
    ...r,
    tendencies: memberships
      .filter((m) => m.fromId === r.id)
      .map((m) => tById.get(m.toId))
      .filter((x): x is NonNullable<typeof x> => !!x),
  }));
}
