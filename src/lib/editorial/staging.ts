import "server-only";
/**
 * Staged structure.
 *
 * Text edits to a live entry already wait in revisions until publication.
 * This module gives its *structure* the same guarantee:
 *
 *  - Additive records — relationships, citations, excerpts and media
 *    attachments — made in the context of a live entry are written with
 *    `staged_for = <entry id>`. Public queries ignore them; the entry's
 *    preview shows them; publishing the entry releases them. A staged
 *    relationship replaces a released one with the same (from, type, to).
 *
 *  - Replaceable structure — a debate's propositions, positions, stances,
 *    links and arguments, a path's steps — is edited as a whole: the first
 *    change to a live debate or path copies its structure into a staged
 *    working set (`entities.staged_structure`), later changes go to that copy,
 *    and publishing swaps the copy in for the released set.
 *
 * Entries that are not live are not public at all, so their structure is
 * written directly.
 */
import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import type { Db } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { newId } from "@/lib/util/id";

type Row = Pick<s.EntityRow, "id" | "kind" | "live" | "stagedStructure">;

/** The `staged_for` value for an additive record made in the context of `row`. */
export const stageFor = (row: Pick<s.EntityRow, "id" | "live">) => (row.live ? row.id : null);

/** Note that a live entry now has staged changes waiting for publication. */
export async function markStaged(db: Db, entityId: string) {
  await db.update(s.entities).set({ stagedChanges: true }).where(and(eq(s.entities.id, entityId), eq(s.entities.live, true)));
}

/**
 * The set of debate/path rows that edits should touch: `null` means the
 * released rows (the entry is not live), otherwise the entry's staged copy —
 * created from the released rows on first use.
 */
export async function workingSet(db: Db, row: Row): Promise<string | null> {
  if (row.stagedStructure) return row.id;
  if (!row.live) return null;
  if (row.kind === "debate") await forkDebate(db, row.id);
  else if (row.kind === "path") await forkPath(db, row.id);
  else return null;
  await db.update(s.entities).set({ stagedStructure: true, stagedChanges: true }).where(eq(s.entities.id, row.id));
  return row.id;
}

/**
 * Begin replacing an entry's debate/path structure wholesale (used by
 * imports): for a live entry, an empty staged copy; otherwise the released
 * rows are removed.
 */
export async function replaceStructure(db: Db, row: Row): Promise<string | null> {
  const tables = row.kind === "debate" ? [s.debateArguments, s.debatePositions, s.debatePropositions] : row.kind === "path" ? [s.pathSteps] : [];
  const owner = (t: (typeof tables)[number]) => ("debateId" in t ? t.debateId : (t as typeof s.pathSteps).pathId);
  if (!row.live && !row.stagedStructure) {
    for (const t of tables) await db.delete(t).where(eq(owner(t), row.id));
    return null;
  }
  for (const t of tables) await db.delete(t).where(and(eq(owner(t), row.id), eq(t.stagedFor, row.id)));
  await db.update(s.entities).set({ stagedStructure: true, stagedChanges: true }).where(eq(s.entities.id, row.id));
  return row.id;
}

/** Map a row id from the released set to its staged copy, if there is one. */
export async function resolveStaged<T extends typeof s.debatePositions | typeof s.debatePropositions | typeof s.debateArguments | typeof s.pathSteps>(
  db: Db,
  table: T,
  id: string,
  staged: string | null,
): Promise<string> {
  if (!staged || !id) return id;
  const own = await db.select({ id: table.id }).from(table).where(and(eq(table.id, id), eq(table.stagedFor, staged))).get();
  if (own) return id;
  const copy = await db.select({ id: table.id }).from(table).where(and(eq(table.originId, id), eq(table.stagedFor, staged))).get();
  return copy?.id ?? id;
}

async function forkDebate(db: Db, debateId: string) {
  const released = <T extends typeof s.debatePositions | typeof s.debatePropositions | typeof s.debateArguments>(t: T) =>
    db.select().from(t).where(and(eq(t.debateId, debateId), isNull(t.stagedFor)));
  const [props, positions, args] = await Promise.all([released(s.debatePropositions), released(s.debatePositions), released(s.debateArguments)]);
  const map = new Map<string, string>();
  for (const p of props) {
    const id = newId("prop");
    map.set(p.id, id);
    await db.insert(s.debatePropositions).values({ ...p, id, stagedFor: debateId, originId: p.id });
  }
  for (const p of positions) {
    const id = newId("pos");
    map.set(p.id, id);
    await db.insert(s.debatePositions).values({ ...p, id, stagedFor: debateId, originId: p.id });
  }
  const ids = positions.map((p) => p.id);
  if (ids.length) {
    const [stances, links] = await Promise.all([
      db.select().from(s.positionStances).where(inArray(s.positionStances.positionId, ids)),
      db.select().from(s.positionLinks).where(inArray(s.positionLinks.positionId, ids)),
    ]);
    for (const st of stances) {
      if (map.has(st.positionId) && map.has(st.propositionId)) {
        await db.insert(s.positionStances).values({ ...st, positionId: map.get(st.positionId)!, propositionId: map.get(st.propositionId)! });
      }
    }
    for (const l of links) await db.insert(s.positionLinks).values({ positionId: map.get(l.positionId)!, entityId: l.entityId }).onConflictDoNothing();
  }
  for (const a of args) map.set(a.id, newId("arg"));
  for (const a of args) {
    await db.insert(s.debateArguments).values({
      ...a,
      id: map.get(a.id)!,
      positionId: a.positionId ? map.get(a.positionId) ?? null : null,
      respondsToId: a.respondsToId ? map.get(a.respondsToId) ?? null : null,
      stagedFor: debateId,
      originId: a.id,
    });
  }
}

async function forkPath(db: Db, pathId: string) {
  const steps = await db.select().from(s.pathSteps).where(and(eq(s.pathSteps.pathId, pathId), isNull(s.pathSteps.stagedFor)));
  const map = new Map(steps.map((st) => [st.id, newId("step")]));
  for (const st of steps) {
    await db.insert(s.pathSteps).values({
      ...st,
      id: map.get(st.id)!,
      parentStepId: st.parentStepId ? map.get(st.parentStepId) ?? null : null,
      stagedFor: pathId,
      originId: st.id,
    });
  }
}

/** Publication: release everything staged for the entry. */
export async function releaseStaged(db: Db, row: Row) {
  // Staged relationships replace released ones with the same (from, type, to).
  const staged = await db.select().from(s.relationships).where(eq(s.relationships.stagedFor, row.id));
  for (const r of staged) {
    await db
      .delete(s.relationships)
      .where(and(eq(s.relationships.fromId, r.fromId), eq(s.relationships.type, r.type), eq(s.relationships.toId, r.toId), isNull(s.relationships.stagedFor)));
  }
  await db.update(s.relationships).set({ stagedFor: null }).where(eq(s.relationships.stagedFor, row.id));
  await db.update(s.citations).set({ stagedFor: null }).where(eq(s.citations.stagedFor, row.id));
  await db.update(s.excerpts).set({ stagedFor: null }).where(eq(s.excerpts.stagedFor, row.id));
  // A staged attachment of an image already attached in the same role only updates its caption.
  const media = await db.select().from(s.entityMedia).where(eq(s.entityMedia.stagedFor, row.id));
  for (const m of media) {
    const existing = await db
      .select()
      .from(s.entityMedia)
      .where(and(eq(s.entityMedia.entityId, m.entityId), eq(s.entityMedia.mediaId, m.mediaId), eq(s.entityMedia.role, m.role), isNull(s.entityMedia.stagedFor)))
      .get();
    if (existing) {
      await db.update(s.entityMedia).set({ caption: m.caption }).where(eq(s.entityMedia.id, existing.id));
      await db.delete(s.entityMedia).where(eq(s.entityMedia.id, m.id));
    } else await db.update(s.entityMedia).set({ stagedFor: null }).where(eq(s.entityMedia.id, m.id));
  }

  if (row.stagedStructure) {
    if (row.kind === "debate") {
      for (const t of [s.debateArguments, s.debatePositions, s.debatePropositions]) {
        await db.delete(t).where(and(eq(t.debateId, row.id), isNull(t.stagedFor)));
        await db.update(t).set({ stagedFor: null, originId: null }).where(eq(t.stagedFor, row.id));
      }
    } else if (row.kind === "path") {
      await db.delete(s.pathSteps).where(and(eq(s.pathSteps.pathId, row.id), isNull(s.pathSteps.stagedFor)));
      await db.update(s.pathSteps).set({ stagedFor: null, originId: null }).where(eq(s.pathSteps.stagedFor, row.id));
    }
  }
  await db.update(s.entities).set({ stagedChanges: false, stagedStructure: false }).where(eq(s.entities.id, row.id));
}

/** How much is waiting for an entry's publication (for the desk). */
export async function stagedSummary(db: Db, entityId: string) {
  const count = async (t: typeof s.relationships | typeof s.citations | typeof s.excerpts | typeof s.entityMedia) =>
    Number((await db.select({ n: sql<number>`count(*)` }).from(t).where(eq(t.stagedFor, entityId)).get())?.n ?? 0);
  const [relationships, citations, excerpts, media] = await Promise.all([count(s.relationships), count(s.citations), count(s.excerpts), count(s.entityMedia)]);
  return { relationships, citations, excerpts, media };
}

