import "server-only";
/**
 * Structural records around an entry: relationships, citations, excerpts,
 * media attachments, debate structure and path routes.
 *
 * These take effect immediately, so the rule is: you may change the structure
 * of an entry you may edit, and on a *live* entry only editors may (see
 * `entity.editStructure`). Contributors' connections therefore always hang
 * off an unpublished entry and only become public when it is published.
 */
import { and, asc, eq, inArray, or, sql } from "drizzle-orm";
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
import { assertCan, atLeast, can, ForbiddenError, type Actor } from "./permissions";

async function structureGate(actor: Actor, entityId: string) {
  const row = await requireEntity(entityId);
  assertCan(actor, "entity.editStructure", gateOf(row));
  return row;
}

async function touch(entityId: string, actor: Actor) {
  const db = await ready();
  await db
    .update(s.entities)
    .set({ lockVersion: sql`${s.entities.lockVersion} + 1`, lastEditedBy: actor.id, updatedAt: sql`(CURRENT_TIMESTAMP)` })
    .where(eq(s.entities.id, entityId));
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
  if (contextId) {
    if (contextId !== input.fromId && contextId !== input.toId) throw new ForbiddenError();
    await structureGate(actor, contextId);
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
  const id = newId("rel");
  await db
    .insert(s.relationships)
    .values({ id, ...rel, ...values, createdBy: actor.id })
    .onConflictDoUpdate({
      target: [s.relationships.fromId, s.relationships.type, s.relationships.toId],
      set: { ...values, updatedAt: sql`(CURRENT_TIMESTAMP)` },
    });
  const title = (eid: string) => ends.find((e) => e.id === eid)?.title ?? eid;
  await audit(actor.id, "relationship_create", { type: "relationship", id: `${rel.fromId}:${rel.type}:${rel.toId}`, label: `${title(rel.fromId)} ${rel.type} ${title(rel.toId)}` }, { ...rel, note: values.note, sourceId: values.sourceId });
  if (contextId) await touch(contextId, actor);
}

async function relationshipGate(actor: Actor, id: string) {
  const db = await ready();
  const rel = await db.select().from(s.relationships).where(eq(s.relationships.id, id)).get();
  if (!rel) throw new NotFoundError("Relationship not found.");
  if (!atLeast(actor, "editor")) {
    const ends = await Promise.all([requireEntity(rel.fromId), requireEntity(rel.toId)]);
    if (!ends.some((e) => can(actor, "entity.editStructure", gateOf(e)))) throw new ForbiddenError();
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
  await db.insert(s.citations).values({
    id: newId("cite"),
    entityId,
    sourceId: input.sourceId,
    locator: input.locator?.trim() || null,
    field: input.field?.trim() || null,
    note: input.note?.trim() ?? "",
    position: Number(max?.n ?? -1) + 1,
  });
  await audit(actor.id, "source_attach", { type: "entity", id: entityId, label: row.title }, { sourceId: src.id, source: src.title, locator: input.locator });
  await touch(entityId, actor);
}

export async function removeCitation(actor: Actor, citationId: string) {
  const db = await ready();
  const c = await db.select().from(s.citations).where(eq(s.citations.id, citationId)).get();
  if (!c) return;
  const row = await structureGate(actor, c.entityId);
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
  await db.insert(s.excerpts).values({
    id,
    entityId,
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
  await audit(actor.id, "excerpt_add", { type: "entity", id: entityId, label: row.title }, { excerptId: id, verification: input.verification ?? "unverified" });
  await touch(entityId, actor);
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
  await db
    .insert(s.entityMedia)
    .values({ id: newId("em"), entityId, mediaId, role, caption: caption.trim(), position: Number(max?.n ?? -1) + 1 })
    .onConflictDoUpdate({ target: [s.entityMedia.entityId, s.entityMedia.mediaId, s.entityMedia.role], set: { caption: caption.trim() } });
  await audit(actor.id, "media_attach", { type: "entity", id: entityId, label: row.title }, { mediaId, role, media: m.title });
  await touch(entityId, actor);
}

export async function detachMedia(actor: Actor, attachmentId: string) {
  const db = await ready();
  const a = await db.select().from(s.entityMedia).where(eq(s.entityMedia.id, attachmentId)).get();
  if (!a) return;
  const row = await structureGate(actor, a.entityId);
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

async function structureAudit(actor: Actor, debateId: string, what: string) {
  const row = await requireEntity(debateId);
  await audit(actor.id, "structure_edit", { type: "entity", id: debateId, label: row.title }, { what });
  await touch(debateId, actor);
}

export async function savePosition(
  actor: Actor,
  debateId: string,
  id: string | null,
  f: { label: string; holderId?: string; centralClaim: string; summary: string; assumptions: string; criticisms: string },
) {
  await structureGate(actor, debateId);
  if (!f.label.trim()) throw new ValidationError({ position: "A position needs a label." });
  const db = await ready();
  const values = {
    label: f.label.trim(),
    holderId: f.holderId || null,
    centralClaim: f.centralClaim.trim(),
    summary: f.summary.trim(),
    assumptions: lines(f.assumptions),
    criticisms: lines(f.criticisms),
  };
  if (id) await db.update(s.debatePositions).set(values).where(and(eq(s.debatePositions.id, id), eq(s.debatePositions.debateId, debateId)));
  else {
    const max = await db.select({ n: sql<number>`coalesce(max(position), -1)` }).from(s.debatePositions).where(eq(s.debatePositions.debateId, debateId)).get();
    await db.insert(s.debatePositions).values({ id: newId("pos"), debateId, position: Number(max?.n ?? -1) + 1, ...values });
  }
  await indexEntity(db, debateId);
  await structureAudit(actor, debateId, id ? `position updated: ${values.label}` : `position added: ${values.label}`);
}

export async function deletePosition(actor: Actor, debateId: string, id: string) {
  await structureGate(actor, debateId);
  const db = await ready();
  await db.delete(s.debatePositions).where(and(eq(s.debatePositions.id, id), eq(s.debatePositions.debateId, debateId)));
  await indexEntity(db, debateId);
  await structureAudit(actor, debateId, "position removed");
}

export async function addProposition(actor: Actor, debateId: string, statement: string) {
  await structureGate(actor, debateId);
  if (!statement.trim()) throw new ValidationError({ proposition: "Write the proposition." });
  const db = await ready();
  const max = await db.select({ n: sql<number>`coalesce(max(position), -1)` }).from(s.debatePropositions).where(eq(s.debatePropositions.debateId, debateId)).get();
  await db.insert(s.debatePropositions).values({ id: newId("prop"), debateId, statement: statement.trim(), position: Number(max?.n ?? -1) + 1 });
  await structureAudit(actor, debateId, "proposition added");
}

export async function deleteProposition(actor: Actor, debateId: string, id: string) {
  await structureGate(actor, debateId);
  const db = await ready();
  await db.delete(s.debatePropositions).where(and(eq(s.debatePropositions.id, id), eq(s.debatePropositions.debateId, debateId)));
  await structureAudit(actor, debateId, "proposition removed");
}

export async function setStances(actor: Actor, debateId: string, entries: { positionId: string; propositionId: string; stance: Stance | ""; note: string }[]) {
  await structureGate(actor, debateId);
  const db = await ready();
  const own = new Set((await db.select({ id: s.debatePositions.id }).from(s.debatePositions).where(eq(s.debatePositions.debateId, debateId))).map((p) => p.id));
  for (const e of entries) {
    if (!own.has(e.positionId)) continue;
    if (!e.stance) {
      await db.delete(s.positionStances).where(and(eq(s.positionStances.positionId, e.positionId), eq(s.positionStances.propositionId, e.propositionId)));
      continue;
    }
    if (!STANCES.includes(e.stance)) continue;
    await db
      .insert(s.positionStances)
      .values({ positionId: e.positionId, propositionId: e.propositionId, stance: e.stance, note: e.note.trim() })
      .onConflictDoUpdate({ target: [s.positionStances.positionId, s.positionStances.propositionId], set: { stance: e.stance, note: e.note.trim() } });
  }
  await structureAudit(actor, debateId, "stances updated");
}

export async function linkPosition(actor: Actor, debateId: string, positionId: string, entityId: string, remove = false) {
  await structureGate(actor, debateId);
  const db = await ready();
  const pos = await db.select().from(s.debatePositions).where(and(eq(s.debatePositions.id, positionId), eq(s.debatePositions.debateId, debateId))).get();
  if (!pos) throw new NotFoundError("Position not found.");
  if (remove) await db.delete(s.positionLinks).where(and(eq(s.positionLinks.positionId, positionId), eq(s.positionLinks.entityId, entityId)));
  else {
    if (!entityId) throw new ValidationError({ link: "Choose an entry." });
    await db.insert(s.positionLinks).values({ positionId, entityId }).onConflictDoNothing();
  }
  await structureAudit(actor, debateId, remove ? "position link removed" : "position link added");
}

export async function addArgument(actor: Actor, debateId: string, f: { positionId?: string; kind: "argument" | "counterargument"; respondsToId?: string; body: string }) {
  await structureGate(actor, debateId);
  if (!f.body.trim()) throw new ValidationError({ argument: "Write the argument." });
  const db = await ready();
  const max = await db.select({ n: sql<number>`coalesce(max(position), -1)` }).from(s.debateArguments).where(eq(s.debateArguments.debateId, debateId)).get();
  await db.insert(s.debateArguments).values({
    id: newId("arg"),
    debateId,
    positionId: f.positionId || null,
    kind: f.kind,
    respondsToId: f.respondsToId || null,
    body: f.body.trim(),
    position: Number(max?.n ?? -1) + 1,
  });
  await structureAudit(actor, debateId, `${f.kind} added`);
}

export async function deleteArgument(actor: Actor, debateId: string, id: string) {
  await structureGate(actor, debateId);
  const db = await ready();
  await db.update(s.debateArguments).set({ respondsToId: null }).where(eq(s.debateArguments.respondsToId, id));
  await db.delete(s.debateArguments).where(and(eq(s.debateArguments.id, id), eq(s.debateArguments.debateId, debateId)));
  await structureAudit(actor, debateId, "argument removed");
}

export async function debateStructure(debateId: string) {
  const db = await ready();
  const [propositions, positions, args] = await Promise.all([
    db.select().from(s.debatePropositions).where(eq(s.debatePropositions.debateId, debateId)).orderBy(asc(s.debatePropositions.position)),
    db.select().from(s.debatePositions).where(eq(s.debatePositions.debateId, debateId)).orderBy(asc(s.debatePositions.position)),
    db.select().from(s.debateArguments).where(eq(s.debateArguments.debateId, debateId)).orderBy(asc(s.debateArguments.position)),
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
  return { propositions, positions, args, stances, links: links.map((x) => ({ ...x.l, entity: x.e })), holders: holderRows };
}

/* -------------------------------------------------------------------------- */
/* Learning paths                                                              */
/* -------------------------------------------------------------------------- */

export async function pathSteps(pathId: string) {
  const db = await ready();
  return db
    .select({ step: s.pathSteps, e: s.entities })
    .from(s.pathSteps)
    .innerJoin(s.entities, eq(s.entities.id, s.pathSteps.entityId))
    .where(eq(s.pathSteps.pathId, pathId))
    .orderBy(asc(s.pathSteps.position));
}

async function renumber(pathId: string) {
  const db = await ready();
  const steps = (await pathSteps(pathId)).filter((x) => x.step.track === "main");
  for (const [i, x] of steps.entries()) await db.update(s.pathSteps).set({ position: i + 1 }).where(eq(s.pathSteps.id, x.step.id));
}

export async function addStep(actor: Actor, pathId: string, f: { entityId: string; framing: string; track?: string; parentStepId?: string }) {
  await structureGate(actor, pathId);
  if (!f.entityId) throw new ValidationError({ step: "Choose an entry for this stop." });
  const track = f.track === "branch" || f.track === "alternative" ? f.track : "main";
  if (track !== "main" && !f.parentStepId) throw new ValidationError({ step: "Choose the stop this branch leaves from." });
  const db = await ready();
  const max = await db.select({ n: sql<number>`coalesce(max(position), 0)` }).from(s.pathSteps).where(eq(s.pathSteps.pathId, pathId)).get();
  await db.insert(s.pathSteps).values({
    id: newId("step"),
    pathId,
    entityId: f.entityId,
    framing: f.framing.trim(),
    track,
    parentStepId: track === "main" ? null : f.parentStepId,
    position: track === "main" ? Number(max?.n ?? 0) + 1 : 0,
  });
  await renumber(pathId);
  await structureAudit(actor, pathId, `${track} stop added`);
}

export async function updateStep(actor: Actor, pathId: string, id: string, framing: string) {
  await structureGate(actor, pathId);
  const db = await ready();
  await db.update(s.pathSteps).set({ framing: framing.trim() }).where(and(eq(s.pathSteps.id, id), eq(s.pathSteps.pathId, pathId)));
  await structureAudit(actor, pathId, "stop framing edited");
}

export async function moveStep(actor: Actor, pathId: string, id: string, delta: -1 | 1) {
  await structureGate(actor, pathId);
  const db = await ready();
  const steps = (await pathSteps(pathId)).filter((x) => x.step.track === "main").map((x) => x.step.id);
  const i = steps.indexOf(id);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= steps.length) return;
  [steps[i], steps[j]] = [steps[j], steps[i]];
  for (const [n, sid] of steps.entries()) await db.update(s.pathSteps).set({ position: n + 1 }).where(eq(s.pathSteps.id, sid));
  await structureAudit(actor, pathId, "stops reordered");
}

export async function deleteStep(actor: Actor, pathId: string, id: string) {
  await structureGate(actor, pathId);
  const db = await ready();
  await db.delete(s.pathSteps).where(and(eq(s.pathSteps.pathId, pathId), or(eq(s.pathSteps.id, id), eq(s.pathSteps.parentStepId, id))));
  await renumber(pathId);
  await structureAudit(actor, pathId, "stop removed");
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
