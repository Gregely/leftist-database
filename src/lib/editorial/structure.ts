import "server-only";
/**
 * Structural records around an entry: relationships, citations, excerpts,
 * media attachments, debate structure and path routes.
 *
 * Whoever may edit an entry may change its structure. On an unpublished entry
 * changes are written directly (nothing about it is public); on a live entry
 * they are staged and reach the public site when the entry is next published
 * (see ./staging). Removing an already-public record is immediate and
 * reserved for editors.
 */
import { and, asc, eq, inArray, isNull, or, sql } from "drizzle-orm";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";
import { ready } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { indexEntity } from "@/lib/db/search-index";
import {
  ALL_RELATIONSHIP_TYPES,
  EXCERPT_VERIFICATION,
  MEDIA_ROLES,
  normaliseRelationship,
  STANCES,
  type AnyRelationshipType,
  type ExcerptVerification,
  type MediaRole,
  type Stance,
} from "@/lib/content/model";
import { newId } from "@/lib/util/id";
import { audit } from "./audit";
import { gateOf, NotFoundError, requireEntity, ValidationError } from "./content";
import { markStaged, replaceStructure, resolveStaged, stageFor, workingSet } from "./staging";
import { statusAfterEdit } from "./workflow";
import type { WorkflowStatus } from "@/lib/content/model";
import { assertCan, atLeast, can, ForbiddenError, type Actor } from "./permissions";

async function structureGate(actor: Actor, entityId: string) {
  const row = await requireEntity(entityId);
  assertCan(actor, "entity.editStructure", gateOf(row));
  return row;
}

/**
 * Record a structural change: the entry was edited (a published entry starts a
 * new cycle, as with text edits), and staged changes are flagged on live entries.
 */
async function touch(entityId: string, actor: Actor, staged = false) {
  const db = await ready();
  const row = await requireEntity(entityId);
  await db
    .update(s.entities)
    .set({
      lockVersion: sql`${s.entities.lockVersion} + 1`,
      lastEditedBy: actor.id,
      status: statusAfterEdit(row.status as WorkflowStatus),
      updatedAt: sql`(CURRENT_TIMESTAMP)`,
    })
    .where(eq(s.entities.id, entityId));
  if (staged) await markStaged(db, entityId);
}

/** Removing a record that is already public is immediate, so it is an editor's call. */
function assertMayRemove(actor: Actor, row: s.EntityRow, stagedFor: string | null) {
  if (row.live && !stagedFor && !atLeast(actor, "editor")) {
    throw new ForbiddenError("This is already on the public site; ask an editor to remove it.");
  }
}

const int = (v: unknown) => (v === "" || v == null ? null : /^-?\d{1,4}$/.test(String(v)) ? Number(v) : NaN);

/* -------------------------------------------------------------------------- */
/* Relationships                                                               */
/* -------------------------------------------------------------------------- */

export interface RelationshipInput {
  fromId: string;
  type: AnyRelationshipType;
  toId: string;
  note?: string;
  weight?: number;
  sourceId?: string | null;
  locator?: string | null;
  yearStart?: string | number | null;
  yearEnd?: string | number | null;
  context?: string;
}

/**
 * Create (or update) a relationship. With `contextId`, the actor must be able
 * to edit that entry's structure and it must be one of the endpoints; without
 * it, only editors may draw relationships between arbitrary entries.
 */
export async function upsertRelationship(actor: Actor, contextId: string | null, input: RelationshipInput) {
  if (!ALL_RELATIONSHIP_TYPES.includes(input.type)) throw new ValidationError({ type: "Choose a relationship type." });
  if (!input.fromId || !input.toId) throw new ValidationError({ relationship: "Choose both ends of the relationship." });
  if (input.fromId === input.toId) throw new ValidationError({ relationship: "An entry cannot be related to itself." });
  let stagedFor: string | null = null;
  if (contextId) {
    if (contextId !== input.fromId && contextId !== input.toId) throw new ForbiddenError();
    stagedFor = stageFor(await structureGate(actor, contextId));
  } else {
    assertCan(actor, "relationship.global");
  }
  const ys = int(input.yearStart);
  const ye = int(input.yearEnd);
  if (Number.isNaN(ys) || Number.isNaN(ye)) throw new ValidationError({ years: "Years must be whole numbers." });
  const db = await ready();
  const ends = await db.select({ id: s.entities.id, title: s.entities.title }).from(s.entities).where(inArray(s.entities.id, [input.fromId, input.toId]));
  if (ends.length !== 2) throw new ValidationError({ relationship: "One of the entries no longer exists." });
  const rel = normaliseRelationship(input.fromId, input.type, input.toId);
  const values = {
    note: input.note?.trim() ?? "",
    weight: Math.min(3, Math.max(1, Number(input.weight) || 2)),
    sourceId: input.sourceId || null,
    locator: input.locator?.trim() || null,
    yearStart: ys,
    yearEnd: ye,
    context: input.context?.trim() ?? "",
  };
  const sameStage = stagedFor ? eq(s.relationships.stagedFor, stagedFor) : isNull(s.relationships.stagedFor);
  const existing = await db
    .select({ id: s.relationships.id })
    .from(s.relationships)
    .where(and(eq(s.relationships.fromId, rel.fromId), eq(s.relationships.type, rel.type), eq(s.relationships.toId, rel.toId), sameStage))
    .get();
  if (existing) await db.update(s.relationships).set({ ...values, updatedAt: sql`(CURRENT_TIMESTAMP)` }).where(eq(s.relationships.id, existing.id));
  else await db.insert(s.relationships).values({ id: newId("rel"), ...rel, ...values, stagedFor, createdBy: actor.id });
  const title = (eid: string) => ends.find((e) => e.id === eid)?.title ?? eid;
  await audit(actor.id, "relationship_create", { type: "relationship", id: `${rel.fromId}:${rel.type}:${rel.toId}`, label: `${title(rel.fromId)} ${rel.type} ${title(rel.toId)}` }, { ...rel, note: values.note, sourceId: values.sourceId });
  if (contextId) await touch(contextId, actor, !!stagedFor);
}

async function relationshipGate(actor: Actor, id: string) {
  const db = await ready();
  const rel = await db.select().from(s.relationships).where(eq(s.relationships.id, id)).get();
  if (!rel) throw new NotFoundError("Relationship not found.");
  if (!atLeast(actor, "editor")) {
    const ends = await Promise.all([requireEntity(rel.fromId), requireEntity(rel.toId)]);
    if (!ends.some((e) => can(actor, "entity.editStructure", gateOf(e)))) throw new ForbiddenError();
    // A released relationship between public entries is public: only editors remove it.
    if (!rel.stagedFor && ends.every((e) => e.live)) throw new ForbiddenError("This relationship is on the public site; ask an editor to remove it.");
  }
  return rel;
}

export async function deleteRelationship(actor: Actor, id: string) {
  const rel = await relationshipGate(actor, id);
  const db = await ready();
  await db.delete(s.relationships).where(eq(s.relationships.id, id));
  await audit(actor.id, "relationship_delete", { type: "relationship", id, label: `${rel.fromId} ${rel.type} ${rel.toId}` }, { fromId: rel.fromId, toId: rel.toId, type: rel.type });
}

/** Relationships touching an entry, for the editor (all statuses). */
export async function relationshipsFor(entityId: string) {
  const db = await ready();
  const [out, inc] = await Promise.all([
    db
      .select({ r: s.relationships, other: s.entities, source: s.sources.title })
      .from(s.relationships)
      .innerJoin(s.entities, eq(s.entities.id, s.relationships.toId))
      .leftJoin(s.sources, eq(s.sources.id, s.relationships.sourceId))
      .where(eq(s.relationships.fromId, entityId)),
    db
      .select({ r: s.relationships, other: s.entities, source: s.sources.title })
      .from(s.relationships)
      .innerJoin(s.entities, eq(s.entities.id, s.relationships.fromId))
      .leftJoin(s.sources, eq(s.sources.id, s.relationships.sourceId))
      .where(eq(s.relationships.toId, entityId)),
  ]);
  return [
    ...out.map((x) => ({ ...x.r, direction: "out" as const, other: x.other, sourceTitle: x.source })),
    ...inc.map((x) => ({ ...x.r, direction: "in" as const, other: x.other, sourceTitle: x.source })),
  ].sort((a, b) => a.type.localeCompare(b.type) || a.other.title.localeCompare(b.other.title));
}

/* -------------------------------------------------------------------------- */
/* Citations                                                                   */
/* -------------------------------------------------------------------------- */

export async function addCitation(actor: Actor, entityId: string, input: { sourceId: string; locator?: string; field?: string; note?: string }) {
  const row = await structureGate(actor, entityId);
  if (!input.sourceId) throw new ValidationError({ citation: "Choose a source." });
  const db = await ready();
  const src = await db.select().from(s.sources).where(eq(s.sources.id, input.sourceId)).get();
  if (!src) throw new ValidationError({ citation: "That source does not exist." });
  const max = await db.select({ n: sql<number>`coalesce(max(position), -1)` }).from(s.citations).where(eq(s.citations.entityId, entityId)).get();
  const stagedFor = stageFor(row);
  await db.insert(s.citations).values({
    id: newId("cite"),
    entityId,
    stagedFor,
    sourceId: input.sourceId,
    locator: input.locator?.trim() || null,
    field: input.field?.trim() || null,
    note: input.note?.trim() ?? "",
    position: Number(max?.n ?? -1) + 1,
  });
  await audit(actor.id, "source_attach", { type: "entity", id: entityId, label: row.title }, { sourceId: src.id, source: src.title, locator: input.locator, staged: !!stagedFor });
  await touch(entityId, actor, !!stagedFor);
}

export async function removeCitation(actor: Actor, citationId: string) {
  const db = await ready();
  const c = await db.select().from(s.citations).where(eq(s.citations.id, citationId)).get();
  if (!c) return;
  const row = await structureGate(actor, c.entityId);
  assertMayRemove(actor, row, c.stagedFor);
  await db.delete(s.citations).where(eq(s.citations.id, citationId));
  await audit(actor.id, "source_detach", { type: "entity", id: c.entityId, label: row.title }, { sourceId: c.sourceId });
  await touch(c.entityId, actor);
}

export async function citationsFor(entityId: string) {
  const db = await ready();
  return db
    .select({ c: s.citations, src: s.sources })
    .from(s.citations)
    .innerJoin(s.sources, eq(s.sources.id, s.citations.sourceId))
    .where(eq(s.citations.entityId, entityId))
    .orderBy(asc(s.citations.position));
}

/* -------------------------------------------------------------------------- */
/* Excerpts                                                                    */
/* -------------------------------------------------------------------------- */

export interface ExcerptInput {
  body: string;
  textId?: string | null;
  sourceId?: string | null;
  speakerId?: string | null;
  locator?: string;
  note?: string;
  verification?: ExcerptVerification;
}

function checkVerification(actor: Actor, v: ExcerptVerification | undefined) {
  if (v && !EXCERPT_VERIFICATION.includes(v)) throw new ValidationError({ verification: "Unknown verification status." });
  // Marking a quotation verified is a reviewer's judgement.
  if (v === "verified" && !atLeast(actor, "reviewer")) {
    throw new ValidationError({ verification: "Only reviewers and editors can mark a quotation verified. Use “Needs review”." });
  }
}

export async function addExcerpt(actor: Actor, entityId: string, input: ExcerptInput) {
  const row = await structureGate(actor, entityId);
  checkVerification(actor, input.verification);
  if (input.body.trim() && !input.sourceId && !input.textId) {
    throw new ValidationError({ excerpt: "A quotation needs a text or an edition it comes from." });
  }
  const db = await ready();
  const max = await db.select({ n: sql<number>`coalesce(max(position), -1)` }).from(s.excerpts).where(eq(s.excerpts.entityId, entityId)).get();
  const id = newId("ex");
  const stagedFor = stageFor(row);
  await db.insert(s.excerpts).values({
    id,
    entityId,
    stagedFor,
    body: input.body.trim(),
    textId: input.textId || null,
    sourceId: input.sourceId || null,
    speakerId: input.speakerId || null,
    locator: input.locator?.trim() || null,
    note: input.note?.trim() ?? "",
    verification: input.verification ?? "unverified",
    position: Number(max?.n ?? -1) + 1,
    createdBy: actor.id,
  });
  await audit(actor.id, "excerpt_add", { type: "entity", id: entityId, label: row.title }, { excerptId: id, verification: input.verification ?? "unverified", staged: !!stagedFor });
  await touch(entityId, actor, !!stagedFor);
  return id;
}

export async function updateExcerpt(actor: Actor, excerptId: string, input: Partial<ExcerptInput>) {
  const db = await ready();
  const x = await db.select().from(s.excerpts).where(eq(s.excerpts.id, excerptId)).get();
  if (!x) throw new NotFoundError("Excerpt not found.");
  const row = await requireEntity(x.entityId);
  // Reviewers may change verification on any entry; other edits need structure rights.
  const onlyVerification = Object.keys(input).every((k) => k === "verification");
  if (!(onlyVerification && atLeast(actor, "reviewer"))) assertCan(actor, "entity.editStructure", gateOf(row));
  checkVerification(actor, input.verification);
  const set: Partial<s.ExcerptRow> = {};
  if (input.body != null) set.body = input.body.trim();
  if (input.locator != null) set.locator = input.locator.trim() || null;
  if (input.note != null) set.note = input.note.trim();
  if (input.verification) set.verification = input.verification;
  if (input.textId !== undefined) set.textId = input.textId || null;
  if (input.sourceId !== undefined) set.sourceId = input.sourceId || null;
  if (input.speakerId !== undefined) set.speakerId = input.speakerId || null;
  await db.update(s.excerpts).set(set).where(eq(s.excerpts.id, excerptId));
  await audit(actor.id, "excerpt_edit", { type: "entity", id: x.entityId, label: row.title }, { excerptId, ...("verification" in set ? { verification: set.verification } : {}) });
  await touch(x.entityId, actor);
}

export async function removeExcerpt(actor: Actor, excerptId: string) {
  const db = await ready();
  const x = await db.select().from(s.excerpts).where(eq(s.excerpts.id, excerptId)).get();
  if (!x) return;
  const row = await structureGate(actor, x.entityId);
  assertMayRemove(actor, row, x.stagedFor);
  await db.delete(s.excerpts).where(eq(s.excerpts.id, excerptId));
  await audit(actor.id, "excerpt_remove", { type: "entity", id: x.entityId, label: row.title }, { excerptId });
  await touch(x.entityId, actor);
}

export async function excerptsFor(entityId: string) {
  const db = await ready();
  const rows = await db.select().from(s.excerpts).where(eq(s.excerpts.entityId, entityId)).orderBy(asc(s.excerpts.position));
  const refIds = [...new Set(rows.flatMap((r) => [r.textId, r.speakerId]).filter((x): x is string => !!x))];
  const srcIds = [...new Set(rows.map((r) => r.sourceId).filter((x): x is string => !!x))];
  const [ents, srcs] = await Promise.all([
    refIds.length ? db.select({ id: s.entities.id, title: s.entities.title, kind: s.entities.kind }).from(s.entities).where(inArray(s.entities.id, refIds)) : [],
    srcIds.length ? db.select().from(s.sources).where(inArray(s.sources.id, srcIds)) : [],
  ]);
  return rows.map((r) => ({
    ...r,
    text: ents.find((e) => e.id === r.textId) ?? null,
    speaker: ents.find((e) => e.id === r.speakerId) ?? null,
    source: srcs.find((x) => x.id === r.sourceId) ?? null,
  }));
}

/* -------------------------------------------------------------------------- */
/* Media attachments                                                           */
/* -------------------------------------------------------------------------- */

export async function attachMedia(actor: Actor, entityId: string, mediaId: string, role: MediaRole, caption = "") {
  if (!MEDIA_ROLES.includes(role)) throw new ValidationError({ role: "Choose a role for the image." });
  const row = await structureGate(actor, entityId);
  const db = await ready();
  const m = await db.select().from(s.media).where(eq(s.media.id, mediaId)).get();
  if (!m) throw new ValidationError({ media: "That image no longer exists." });
  const max = await db.select({ n: sql<number>`coalesce(max(position), -1)` }).from(s.entityMedia).where(eq(s.entityMedia.entityId, entityId)).get();
  const stagedFor = stageFor(row);
  const existing = await db
    .select()
    .from(s.entityMedia)
    .where(and(eq(s.entityMedia.entityId, entityId), eq(s.entityMedia.mediaId, mediaId), eq(s.entityMedia.role, role)))
    .get();
  if (existing) {
    // Already attached in this role: on a live entry the attachment is public, so only staged ones are edited here.
    if (!existing.stagedFor && stagedFor) return;
    await db.update(s.entityMedia).set({ caption: caption.trim() }).where(eq(s.entityMedia.id, existing.id));
  } else {
    await db.insert(s.entityMedia).values({ id: newId("em"), entityId, mediaId, role, caption: caption.trim(), position: Number(max?.n ?? -1) + 1, stagedFor });
  }
  await audit(actor.id, "media_attach", { type: "entity", id: entityId, label: row.title }, { mediaId, role, media: m.title, staged: !!stagedFor });
  await touch(entityId, actor, !!stagedFor);
}

export async function detachMedia(actor: Actor, attachmentId: string) {
  const db = await ready();
  const a = await db.select().from(s.entityMedia).where(eq(s.entityMedia.id, attachmentId)).get();
  if (!a) return;
  const row = await structureGate(actor, a.entityId);
  assertMayRemove(actor, row, a.stagedFor);
  await db.delete(s.entityMedia).where(eq(s.entityMedia.id, attachmentId));
  await audit(actor.id, "media_detach", { type: "entity", id: a.entityId, label: row.title }, { mediaId: a.mediaId, role: a.role });
  await touch(a.entityId, actor);
}

export async function mediaFor(entityId: string) {
  const db = await ready();
  return db
    .select({ a: s.entityMedia, m: s.media })
    .from(s.entityMedia)
    .innerJoin(s.media, eq(s.media.id, s.entityMedia.mediaId))
    .where(eq(s.entityMedia.entityId, entityId))
    .orderBy(asc(s.entityMedia.position));
}

/* -------------------------------------------------------------------------- */
/* Debates                                                                     */
/* -------------------------------------------------------------------------- */

const lines = (v: string) => JSON.stringify(v.split("\n").map((x) => x.trim()).filter(Boolean));

/** Gate a debate/path edit and return the row set to edit (null = released rows). */
async function structureSet(actor: Actor, ownerId: string) {
  const row = await structureGate(actor, ownerId);
  const db = await ready();
  return { row, db, staged: await workingSet(db, row) };
}

const inSet = (column: SQLiteColumn, staged: string | null) => (staged ? eq(column, staged) : isNull(column));

async function structureAudit(actor: Actor, ownerId: string, what: string, staged: string | null) {
  const row = await requireEntity(ownerId);
  await audit(actor.id, "structure_edit", { type: "entity", id: ownerId, label: row.title }, { what, staged: !!staged });
  await touch(ownerId, actor, !!staged);
}

export async function savePosition(
  actor: Actor,
  debateId: string,
  id: string | null,
  f: { label: string; holderId?: string; centralClaim: string; summary: string; assumptions: string; criticisms: string },
) {
  if (!f.label.trim()) throw new ValidationError({ position: "A position needs a label." });
  const { db, staged } = await structureSet(actor, debateId);
  const values = {
    label: f.label.trim(),
    holderId: f.holderId || null,
    centralClaim: f.centralClaim.trim(),
    summary: f.summary.trim(),
    assumptions: lines(f.assumptions),
    criticisms: lines(f.criticisms),
  };
  let positionId = id;
  if (id) {
    positionId = await resolveStaged(db, s.debatePositions, id, staged);
    await db
      .update(s.debatePositions)
      .set(values)
      .where(and(eq(s.debatePositions.id, positionId), eq(s.debatePositions.debateId, debateId), inSet(s.debatePositions.stagedFor, staged)));
  } else {
    const max = await db
      .select({ n: sql<number>`coalesce(max(position), -1)` })
      .from(s.debatePositions)
      .where(and(eq(s.debatePositions.debateId, debateId), inSet(s.debatePositions.stagedFor, staged)))
      .get();
    positionId = newId("pos");
    await db.insert(s.debatePositions).values({ id: positionId, debateId, position: Number(max?.n ?? -1) + 1, stagedFor: staged, ...values });
  }
  if (!staged) await indexEntity(db, debateId);
  await structureAudit(actor, debateId, id ? `position updated: ${values.label}` : `position added: ${values.label}`, staged);
  return positionId;
}

export async function deletePosition(actor: Actor, debateId: string, id: string) {
  const { db, staged } = await structureSet(actor, debateId);
  const target = await resolveStaged(db, s.debatePositions, id, staged);
  await db.delete(s.debatePositions).where(and(eq(s.debatePositions.id, target), eq(s.debatePositions.debateId, debateId), inSet(s.debatePositions.stagedFor, staged)));
  if (!staged) await indexEntity(db, debateId);
  await structureAudit(actor, debateId, "position removed", staged);
}

export async function addProposition(actor: Actor, debateId: string, statement: string) {
  if (!statement.trim()) throw new ValidationError({ proposition: "Write the proposition." });
  const { db, staged } = await structureSet(actor, debateId);
  const max = await db
    .select({ n: sql<number>`coalesce(max(position), -1)` })
    .from(s.debatePropositions)
    .where(and(eq(s.debatePropositions.debateId, debateId), inSet(s.debatePropositions.stagedFor, staged)))
    .get();
  const id = newId("prop");
  await db.insert(s.debatePropositions).values({ id, debateId, statement: statement.trim(), position: Number(max?.n ?? -1) + 1, stagedFor: staged });
  await structureAudit(actor, debateId, "proposition added", staged);
  return id;
}

export async function deleteProposition(actor: Actor, debateId: string, id: string) {
  const { db, staged } = await structureSet(actor, debateId);
  const target = await resolveStaged(db, s.debatePropositions, id, staged);
  await db
    .delete(s.debatePropositions)
    .where(and(eq(s.debatePropositions.id, target), eq(s.debatePropositions.debateId, debateId), inSet(s.debatePropositions.stagedFor, staged)));
  await structureAudit(actor, debateId, "proposition removed", staged);
}

export async function setStances(actor: Actor, debateId: string, entries: { positionId: string; propositionId: string; stance: Stance | ""; note: string }[]) {
  const { db, staged } = await structureSet(actor, debateId);
  const own = (t: typeof s.debatePositions | typeof s.debatePropositions) =>
    db.select({ id: t.id }).from(t).where(and(eq(t.debateId, debateId), inSet(t.stagedFor, staged)));
  const positions = new Set((await own(s.debatePositions)).map((p) => p.id));
  const propositions = new Set((await own(s.debatePropositions)).map((p) => p.id));
  for (const e of entries) {
    const positionId = await resolveStaged(db, s.debatePositions, e.positionId, staged);
    const propositionId = await resolveStaged(db, s.debatePropositions, e.propositionId, staged);
    if (!positions.has(positionId) || !propositions.has(propositionId)) continue;
    if (!e.stance) {
      await db.delete(s.positionStances).where(and(eq(s.positionStances.positionId, positionId), eq(s.positionStances.propositionId, propositionId)));
      continue;
    }
    if (!STANCES.includes(e.stance)) continue;
    await db
      .insert(s.positionStances)
      .values({ positionId, propositionId, stance: e.stance, note: e.note.trim() })
      .onConflictDoUpdate({ target: [s.positionStances.positionId, s.positionStances.propositionId], set: { stance: e.stance, note: e.note.trim() } });
  }
  await structureAudit(actor, debateId, "stances updated", staged);
}

export async function linkPosition(actor: Actor, debateId: string, positionId: string, entityId: string, remove = false) {
  const { db, staged } = await structureSet(actor, debateId);
  const target = await resolveStaged(db, s.debatePositions, positionId, staged);
  const pos = await db
    .select()
    .from(s.debatePositions)
    .where(and(eq(s.debatePositions.id, target), eq(s.debatePositions.debateId, debateId), inSet(s.debatePositions.stagedFor, staged)))
    .get();
  if (!pos) throw new NotFoundError("Position not found.");
  if (remove) await db.delete(s.positionLinks).where(and(eq(s.positionLinks.positionId, target), eq(s.positionLinks.entityId, entityId)));
  else {
    if (!entityId) throw new ValidationError({ link: "Choose an entry." });
    await db.insert(s.positionLinks).values({ positionId: target, entityId }).onConflictDoNothing();
  }
  await structureAudit(actor, debateId, remove ? "position link removed" : "position link added", staged);
}

export async function addArgument(actor: Actor, debateId: string, f: { positionId?: string; kind: "argument" | "counterargument"; respondsToId?: string; body: string }) {
  if (!f.body.trim()) throw new ValidationError({ argument: "Write the argument." });
  const { db, staged } = await structureSet(actor, debateId);
  const max = await db
    .select({ n: sql<number>`coalesce(max(position), -1)` })
    .from(s.debateArguments)
    .where(and(eq(s.debateArguments.debateId, debateId), inSet(s.debateArguments.stagedFor, staged)))
    .get();
  const id = newId("arg");
  await db.insert(s.debateArguments).values({
    id,
    debateId,
    positionId: f.positionId ? await resolveStaged(db, s.debatePositions, f.positionId, staged) : null,
    kind: f.kind,
    respondsToId: f.respondsToId ? await resolveStaged(db, s.debateArguments, f.respondsToId, staged) : null,
    body: f.body.trim(),
    position: Number(max?.n ?? -1) + 1,
    stagedFor: staged,
  });
  await structureAudit(actor, debateId, `${f.kind} added`, staged);
  return id;
}

export async function deleteArgument(actor: Actor, debateId: string, id: string) {
  const { db, staged } = await structureSet(actor, debateId);
  const target = await resolveStaged(db, s.debateArguments, id, staged);
  await db.update(s.debateArguments).set({ respondsToId: null }).where(and(eq(s.debateArguments.respondsToId, target), inSet(s.debateArguments.stagedFor, staged)));
  await db.delete(s.debateArguments).where(and(eq(s.debateArguments.id, target), eq(s.debateArguments.debateId, debateId), inSet(s.debateArguments.stagedFor, staged)));
  await structureAudit(actor, debateId, "argument removed", staged);
}

/**
 * Start a debate's or path's structure afresh (used by imports that supply
 * the whole structure). On a live entry this begins an empty staged copy, so
 * the public structure stays until the entry is next published.
 */
export async function resetStructure(actor: Actor, ownerId: string) {
  const row = await structureGate(actor, ownerId);
  if (row.kind !== "debate" && row.kind !== "path") throw new ValidationError({ structure: "Only debates and paths have a replaceable structure." });
  const db = await ready();
  const staged = await replaceStructure(db, row);
  if (!staged) await indexEntity(db, ownerId);
  await structureAudit(actor, ownerId, "structure reset for replacement", staged);
}

/** A debate's editable structure: its staged copy while one exists, otherwise the released rows. */
export async function debateStructure(debateId: string) {
  const db = await ready();
  const row = await requireEntity(debateId);
  const staged = row.stagedStructure ? debateId : null;
  const [propositions, positions, args] = await Promise.all([
    db.select().from(s.debatePropositions).where(and(eq(s.debatePropositions.debateId, debateId), inSet(s.debatePropositions.stagedFor, staged))).orderBy(asc(s.debatePropositions.position)),
    db.select().from(s.debatePositions).where(and(eq(s.debatePositions.debateId, debateId), inSet(s.debatePositions.stagedFor, staged))).orderBy(asc(s.debatePositions.position)),
    db.select().from(s.debateArguments).where(and(eq(s.debateArguments.debateId, debateId), inSet(s.debateArguments.stagedFor, staged))).orderBy(asc(s.debateArguments.position)),
  ]);
  const ids = positions.map((p) => p.id);
  const [stances, links] = ids.length
    ? await Promise.all([
        db.select().from(s.positionStances).where(inArray(s.positionStances.positionId, ids)),
        db
          .select({ l: s.positionLinks, e: s.entities })
          .from(s.positionLinks)
          .innerJoin(s.entities, eq(s.entities.id, s.positionLinks.entityId))
          .where(inArray(s.positionLinks.positionId, ids)),
      ])
    : [[], []];
  const holders = positions.map((p) => p.holderId).filter((x): x is string => !!x);
  const holderRows = holders.length ? await db.select().from(s.entities).where(inArray(s.entities.id, holders)) : [];
  return { staged: !!staged, propositions, positions, args, stances, links: links.map((x) => ({ ...x.l, entity: x.e })), holders: holderRows };
}

/* -------------------------------------------------------------------------- */
/* Learning paths                                                              */
/* -------------------------------------------------------------------------- */

/** A path's editable route: its staged copy while one exists, otherwise the released steps. */
export async function pathSteps(pathId: string, staged?: string | null) {
  const db = await ready();
  const set = staged === undefined ? ((await requireEntity(pathId)).stagedStructure ? pathId : null) : staged;
  return db
    .select({ step: s.pathSteps, e: s.entities })
    .from(s.pathSteps)
    .innerJoin(s.entities, eq(s.entities.id, s.pathSteps.entityId))
    .where(and(eq(s.pathSteps.pathId, pathId), inSet(s.pathSteps.stagedFor, set)))
    .orderBy(asc(s.pathSteps.position));
}

async function renumber(pathId: string, staged: string | null) {
  const db = await ready();
  const steps = (await pathSteps(pathId, staged)).filter((x) => x.step.track === "main");
  for (const [i, x] of steps.entries()) await db.update(s.pathSteps).set({ position: i + 1 }).where(eq(s.pathSteps.id, x.step.id));
}

export async function addStep(
  actor: Actor,
  pathId: string,
  f: { entityId: string; framing: string; track?: string; parentStepId?: string; orientation?: string; whyItMatters?: string; nextReason?: string; excerptId?: string | null },
) {
  if (!f.entityId) throw new ValidationError({ step: "Choose an entry for this stop." });
  const track = f.track === "branch" || f.track === "alternative" ? f.track : "main";
  if (track !== "main" && !f.parentStepId) throw new ValidationError({ step: "Choose the stop this branch leaves from." });
  const { db, staged } = await structureSet(actor, pathId);
  const max = await db
    .select({ n: sql<number>`coalesce(max(position), 0)` })
    .from(s.pathSteps)
    .where(and(eq(s.pathSteps.pathId, pathId), inSet(s.pathSteps.stagedFor, staged)))
    .get();
  if (f.excerptId) {
    const ex = await db.select({ entityId: s.excerpts.entityId }).from(s.excerpts).where(eq(s.excerpts.id, f.excerptId)).get();
    if (!ex || ex.entityId !== f.entityId) throw new ValidationError({ excerptId: "Choose an excerpt of this stop's entry." });
  }
  const id = newId("step");
  await db.insert(s.pathSteps).values({
    id,
    pathId,
    entityId: f.entityId,
    framing: f.framing.trim(),
    orientation: (f.orientation ?? "").trim(),
    whyItMatters: (f.whyItMatters ?? "").trim(),
    nextReason: (f.nextReason ?? "").trim(),
    excerptId: f.excerptId || null,
    track,
    parentStepId: track === "main" ? null : await resolveStaged(db, s.pathSteps, f.parentStepId!, staged),
    position: track === "main" ? Number(max?.n ?? 0) + 1 : 0,
    stagedFor: staged,
  });
  await renumber(pathId, staged);
  await structureAudit(actor, pathId, `${track} stop added`, staged);
  return id;
}

/** What can be changed on a stop: its framing, the Guided copy, its featured excerpt and the entry it points to. */
export interface StepPatch {
  framing?: string;
  orientation?: string;
  whyItMatters?: string;
  nextReason?: string;
  /** An excerpt of the stop's entry, or null for none. */
  excerptId?: string | null;
  /** Point the stop at a different entry (its featured excerpt is cleared unless it belongs to the new one). */
  entityId?: string;
}

const STEP_TEXT_LIMIT = 4000;

export async function updateStep(actor: Actor, pathId: string, id: string, patchIn: string | StepPatch) {
  const patch: StepPatch = typeof patchIn === "string" ? { framing: patchIn } : patchIn;
  const { db, staged } = await structureSet(actor, pathId);
  const target = await resolveStaged(db, s.pathSteps, id, staged);
  const where = and(eq(s.pathSteps.id, target), eq(s.pathSteps.pathId, pathId), inSet(s.pathSteps.stagedFor, staged));
  const current = await db.select().from(s.pathSteps).where(where).get();
  if (!current) throw new NotFoundError("That stop no longer exists.");

  const set: Partial<typeof s.pathSteps.$inferInsert> = {};
  for (const key of ["framing", "orientation", "whyItMatters", "nextReason"] as const) {
    const v = patch[key];
    if (v === undefined) continue;
    if (v.length > STEP_TEXT_LIMIT) throw new ValidationError({ [key]: "Keep this to a few sentences." });
    set[key] = v.trim();
  }
  let entityId = current.entityId;
  if (patch.entityId !== undefined && patch.entityId !== current.entityId) {
    const next = await db.select({ id: s.entities.id, status: s.entities.status }).from(s.entities).where(eq(s.entities.id, patch.entityId)).get();
    if (!next || patch.entityId === pathId) throw new ValidationError({ step: "Choose an existing entry for this stop." });
    entityId = next.id;
    set.entityId = entityId;
  }
  let excerptId = patch.excerptId === undefined ? current.excerptId : patch.excerptId;
  if (excerptId) {
    const ex = await db.select({ entityId: s.excerpts.entityId }).from(s.excerpts).where(eq(s.excerpts.id, excerptId)).get();
    if (!ex || ex.entityId !== entityId) {
      if (patch.excerptId) throw new ValidationError({ excerptId: "Choose an excerpt of this stop's entry." });
      excerptId = null; // the stop now points at another entry
    }
  }
  if (excerptId !== current.excerptId) set.excerptId = excerptId ?? null;
  if (!Object.keys(set).length) return;
  await db.update(s.pathSteps).set(set).where(where);
  const what = Object.keys(set).map((k) => ({ framing: "framing", orientation: "where you are", whyItMatters: "why it matters", nextReason: "continue", excerptId: "featured excerpt", entityId: "entry" })[k] ?? k);
  await structureAudit(actor, pathId, `stop edited (${what.join(", ")})`, staged);
}

export async function moveStep(actor: Actor, pathId: string, id: string, delta: -1 | 1) {
  const { db, staged } = await structureSet(actor, pathId);
  const target = await resolveStaged(db, s.pathSteps, id, staged);
  const steps = (await pathSteps(pathId, staged)).filter((x) => x.step.track === "main").map((x) => x.step.id);
  const i = steps.indexOf(target);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= steps.length) return;
  [steps[i], steps[j]] = [steps[j], steps[i]];
  for (const [n, sid] of steps.entries()) await db.update(s.pathSteps).set({ position: n + 1 }).where(eq(s.pathSteps.id, sid));
  await structureAudit(actor, pathId, "stops reordered", staged);
}

export async function deleteStep(actor: Actor, pathId: string, id: string) {
  const { db, staged } = await structureSet(actor, pathId);
  const target = await resolveStaged(db, s.pathSteps, id, staged);
  await db
    .delete(s.pathSteps)
    .where(and(eq(s.pathSteps.pathId, pathId), inSet(s.pathSteps.stagedFor, staged), or(eq(s.pathSteps.id, target), eq(s.pathSteps.parentStepId, target))));
  await renumber(pathId, staged);
  await structureAudit(actor, pathId, "stop removed", staged);
}

/** All relationships, for the desk's relationship index. */
export async function listRelationships(q: { type?: string; q?: string; page?: number; perPage?: number }) {
  const db = await ready();
  const perPage = q.perPage ?? 60;
  const page = Math.max(1, q.page ?? 1);
  const term = q.q?.trim() ? `%${q.q.trim()}%` : null;
  const where = sql`1 = 1 ${q.type ? sql`AND r.type = ${q.type}` : sql``} ${term ? sql`AND (a.title LIKE ${term} OR b.title LIKE ${term})` : sql``}`;
  const rows = (await db.all(sql`
    SELECT r.id, r.type, r.note, r.from_id AS fromId, r.to_id AS toId, a.title AS fromTitle, a.kind AS fromKind,
           b.title AS toTitle, b.kind AS toKind, src.title AS sourceTitle
    FROM relationships r
    JOIN entities a ON a.id = r.from_id
    JOIN entities b ON b.id = r.to_id
    LEFT JOIN sources src ON src.id = r.source_id
    WHERE ${where}
    ORDER BY r.created_at DESC, r.id
    LIMIT ${perPage} OFFSET ${(page - 1) * perPage}
  `)) as { id: string; type: string; note: string; fromId: string; toId: string; fromTitle: string; fromKind: string; toTitle: string; toKind: string; sourceTitle: string | null }[];
  const count = (await db.get(sql`
    SELECT count(*) AS n FROM relationships r JOIN entities a ON a.id = r.from_id JOIN entities b ON b.id = r.to_id WHERE ${where}
  `)) as { n: number };
  return { items: rows, total: Number(count.n) };
}

/** Excerpts of the given entries, for choosing a Guided stop's featured passage. */
export async function excerptOptions(entityIds: string[]) {
  if (!entityIds.length) return [];
  const db = await ready();
  return db
    .select({ id: s.excerpts.id, entityId: s.excerpts.entityId, body: s.excerpts.body, locator: s.excerpts.locator, verification: s.excerpts.verification })
    .from(s.excerpts)
    .where(inArray(s.excerpts.entityId, entityIds))
    .orderBy(asc(s.excerpts.position));
}
