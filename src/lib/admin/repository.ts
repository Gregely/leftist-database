import "server-only";
/**
 * Editorial reads and writes. Unlike the public content API (lib/data), these
 * see every status, and every write keeps the search index in sync.
 */
import { and, asc, desc, eq, inArray, like, or, sql } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { indexEntity, removeFromIndex } from "@/lib/db/search-index";
import {
  KINDS,
  normaliseRelationship,
  type AnyRelationshipType,
  type EntityKind,
  type SourceType,
  type Stance,
} from "@/lib/content/model";
import { newId, slugify } from "@/lib/util/id";
import { fieldsFor, type FieldDef } from "./fields";

const DETAIL_TABLES = {
  thinker: s.thinkerDetails,
  concept: s.conceptDetails,
  text: s.textDetails,
  tendency: s.tendencyDetails,
  debate: s.debateDetails,
  event: s.eventDetails,
  path: s.pathDetails,
} as const;

export class ValidationError extends Error {
  constructor(public fields: Record<string, string>) {
    super(Object.values(fields).join(" "));
  }
}

/* -------------------------------------------------------------------------- */
/* Reads                                                                       */
/* -------------------------------------------------------------------------- */

export async function adminCounts() {
  const db = await ready();
  const rows = await db
    .select({ kind: s.entities.kind, status: s.entities.status, n: sql<number>`count(*)` })
    .from(s.entities)
    .groupBy(s.entities.kind, s.entities.status);
  const [rels, srcs] = await Promise.all([
    db.select({ n: sql<number>`count(*)` }).from(s.relationships).get(),
    db.select({ n: sql<number>`count(*)` }).from(s.sources).get(),
  ]);
  return { rows: rows.map((r) => ({ ...r, n: Number(r.n) })), relationships: Number(rels?.n ?? 0), sources: Number(srcs?.n ?? 0) };
}

export async function recentEntities(limit = 10) {
  const db = await ready();
  return db.select().from(s.entities).orderBy(desc(s.entities.updatedAt), asc(s.entities.title)).limit(limit);
}

export async function adminList(kind: EntityKind, q?: string) {
  const db = await ready();
  return db
    .select()
    .from(s.entities)
    .where(and(eq(s.entities.kind, kind), q ? or(like(s.entities.title, `%${q}%`), like(s.entities.slug, `%${q}%`)) : undefined))
    .orderBy(asc(s.entities.sortOrder), asc(s.entities.title))
    .limit(500);
}

export async function getForEdit(kind: EntityKind, id: string) {
  const db = await ready();
  const entity = await db.select().from(s.entities).where(and(eq(s.entities.id, id), eq(s.entities.kind, kind))).get();
  if (!entity) return null;
  const table = DETAIL_TABLES[kind];
  const details = ((await db.select().from(table).where(eq(table.entityId, id)).get()) ?? {}) as Record<string, unknown>;

  const [outRels, inRels, cites, excerptRows] = await Promise.all([
    db
      .select({ r: s.relationships, other: s.entities })
      .from(s.relationships)
      .innerJoin(s.entities, eq(s.entities.id, s.relationships.toId))
      .where(eq(s.relationships.fromId, id)),
    db
      .select({ r: s.relationships, other: s.entities })
      .from(s.relationships)
      .innerJoin(s.entities, eq(s.entities.id, s.relationships.fromId))
      .where(eq(s.relationships.toId, id)),
    db
      .select({ c: s.citations, src: s.sources })
      .from(s.citations)
      .innerJoin(s.sources, eq(s.sources.id, s.citations.sourceId))
      .where(eq(s.citations.entityId, id))
      .orderBy(asc(s.citations.position)),
    db.select().from(s.excerpts).where(eq(s.excerpts.entityId, id)).orderBy(asc(s.excerpts.position)),
  ]);

  return {
    entity,
    details,
    relationships: [
      ...outRels.map((x) => ({ ...x.r, direction: "out" as const, other: x.other })),
      ...inRels.map((x) => ({ ...x.r, direction: "in" as const, other: x.other })),
    ],
    citations: cites.map((x) => ({ ...x.c, source: x.src })),
    excerpts: excerptRows,
  };
}

export async function getDebateStructure(debateId: string) {
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

export async function getPathSteps(pathId: string) {
  const db = await ready();
  return db
    .select({ step: s.pathSteps, e: s.entities })
    .from(s.pathSteps)
    .innerJoin(s.entities, eq(s.entities.id, s.pathSteps.entityId))
    .where(eq(s.pathSteps.pathId, pathId))
    .orderBy(asc(s.pathSteps.position));
}

export async function listAllRelationships(filter: { type?: string; q?: string } = {}) {
  const db = await ready();
  const rows = await db
    .select({
      r: s.relationships,
      fromTitle: sql<string>`(SELECT title FROM entities WHERE id = ${s.relationships.fromId})`,
      fromKind: sql<string>`(SELECT kind FROM entities WHERE id = ${s.relationships.fromId})`,
      toTitle: sql<string>`(SELECT title FROM entities WHERE id = ${s.relationships.toId})`,
      toKind: sql<string>`(SELECT kind FROM entities WHERE id = ${s.relationships.toId})`,
    })
    .from(s.relationships)
    .where(filter.type ? eq(s.relationships.type, filter.type) : undefined)
    .orderBy(desc(s.relationships.createdAt), asc(s.relationships.id))
    .limit(2000);
  const q = filter.q?.toLowerCase();
  return q ? rows.filter((r) => r.fromTitle.toLowerCase().includes(q) || r.toTitle.toLowerCase().includes(q)) : rows;
}

export async function listSourcesAdmin() {
  const db = await ready();
  return db.select().from(s.sources).orderBy(asc(s.sources.author), asc(s.sources.title));
}

export async function getSourceAdmin(id: string) {
  const db = await ready();
  return (await db.select().from(s.sources).where(eq(s.sources.id, id)).get()) ?? null;
}

/* -------------------------------------------------------------------------- */
/* Entity writes                                                               */
/* -------------------------------------------------------------------------- */

function coerce(field: FieldDef, raw: FormDataEntryValue | null): unknown {
  const v = typeof raw === "string" ? raw.trim() : "";
  switch (field.type) {
    case "checkbox":
      return raw === "on" || raw === "true";
    case "number":
      if (!v) return null;
      if (!/^-?\d+$/.test(v)) throw new ValidationError({ [field.name]: `${field.label} must be a whole number.` });
      return Number(v);
    case "list":
      return JSON.stringify(
        v
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean),
      );
    case "select":
      if (field.options && v && !field.options.includes(v)) throw new ValidationError({ [field.name]: `Invalid ${field.label}.` });
      return field.name === "difficulty" ? Number(v || 2) : v || null;
    case "url":
      if (v && !/^https?:\/\//.test(v)) throw new ValidationError({ [field.name]: "Must be an http(s) URL." });
      return v || null;
    default:
      return v;
  }
}

export async function saveEntity(kind: EntityKind, id: string | null, form: FormData): Promise<string> {
  const db = await ready();
  const entityValues: Record<string, unknown> = {};
  const detailValues: Record<string, unknown> = {};
  const errors: Record<string, string> = {};
  for (const f of fieldsFor(kind)) {
    try {
      const value = coerce(f, form.get(f.name));
      if (f.required && (value === "" || value == null)) errors[f.name] = `${f.label} is required.`;
      (f.store === "entity" ? entityValues : detailValues)[f.name] = value;
    } catch (e) {
      if (e instanceof ValidationError) Object.assign(errors, e.fields);
      else throw e;
    }
  }
  entityValues.slug = slugify(String(entityValues.slug || entityValues.title || ""));
  if (!entityValues.slug) errors.slug = "A slug is required.";
  if (entityValues.sortOrder == null) entityValues.sortOrder = 1000;
  if (!entityValues.status) entityValues.status = "draft";
  // Nullable text columns: store empty strings as null.
  for (const k of ["subtitle"]) if (entityValues[k] === "") entityValues[k] = null;
  for (const [k, v] of Object.entries(detailValues)) if (v === "" && !["brief", "standard", "deep", "legacy", "roles", "intro", "entryLine"].includes(k)) detailValues[k] = null;

  const clash = await db
    .select({ id: s.entities.id })
    .from(s.entities)
    .where(and(eq(s.entities.kind, kind), eq(s.entities.slug, String(entityValues.slug))))
    .get();
  if (clash && clash.id !== id) errors.slug = `Another ${KINDS[kind].label.toLowerCase()} already uses this slug.`;
  if (Object.keys(errors).length) throw new ValidationError(errors);

  const now = sql`(CURRENT_TIMESTAMP)`;
  const entityId = id ?? newId(KINDS[kind].idPrefix);
  if (id) {
    await db.update(s.entities).set({ ...entityValues, updatedAt: now } as never).where(eq(s.entities.id, id));
  } else {
    await db.insert(s.entities).values({ ...(entityValues as typeof s.entities.$inferInsert), id: entityId, kind });
  }
  const table = DETAIL_TABLES[kind];
  await db
    .insert(table)
    .values({ entityId, ...detailValues } as never)
    .onConflictDoUpdate({ target: table.entityId, set: detailValues as never });
  await indexEntity(db, entityId);
  return entityId;
}

export async function deleteEntity(id: string) {
  const db = await ready();
  await db.delete(s.entities).where(eq(s.entities.id, id));
  await removeFromIndex(db, id);
}

/* -------------------------------------------------------------------------- */
/* Relationships, citations, excerpts                                          */
/* -------------------------------------------------------------------------- */

export async function createRelationship(input: {
  fromId: string;
  type: AnyRelationshipType;
  toId: string;
  note?: string;
  weight?: number;
  sourceId?: string | null;
  locator?: string | null;
}) {
  if (!input.fromId || !input.toId) throw new ValidationError({ relationship: "Choose both ends of the relationship." });
  if (input.fromId === input.toId) throw new ValidationError({ relationship: "An entry cannot relate to itself." });
  const db = await ready();
  const rel = normaliseRelationship(input.fromId, input.type, input.toId);
  const res = await db
    .insert(s.relationships)
    .values({
      id: newId("rel"),
      ...rel,
      note: input.note ?? "",
      weight: Math.min(3, Math.max(1, input.weight ?? 2)),
      sourceId: input.sourceId || null,
      locator: input.locator || null,
    })
    .onConflictDoUpdate({
      target: [s.relationships.fromId, s.relationships.type, s.relationships.toId],
      set: { note: input.note ?? "", weight: input.weight ?? 2, sourceId: input.sourceId || null, locator: input.locator || null, updatedAt: sql`(CURRENT_TIMESTAMP)` },
    });
  return res.rowsAffected;
}

export async function deleteRelationship(id: string) {
  const db = await ready();
  await db.delete(s.relationships).where(eq(s.relationships.id, id));
}

export async function addCitation(entityId: string, sourceId: string, locator: string, field: string, note: string) {
  if (!sourceId) throw new ValidationError({ citation: "Choose a source." });
  const db = await ready();
  const max = await db.select({ n: sql<number>`coalesce(max(position), -1)` }).from(s.citations).where(eq(s.citations.entityId, entityId)).get();
  await db.insert(s.citations).values({ id: newId("cite"), entityId, sourceId, locator: locator || null, field: field || null, note, position: Number(max?.n ?? -1) + 1 });
}

export async function deleteCitation(id: string) {
  const db = await ready();
  await db.delete(s.citations).where(eq(s.citations.id, id));
}

export async function addExcerpt(input: { entityId: string; textId?: string; sourceId?: string; body: string; locator?: string; note?: string; verified?: boolean }) {
  const db = await ready();
  const max = await db.select({ n: sql<number>`coalesce(max(position), -1)` }).from(s.excerpts).where(eq(s.excerpts.entityId, input.entityId)).get();
  await db.insert(s.excerpts).values({
    id: newId("ex"),
    entityId: input.entityId,
    textId: input.textId || null,
    sourceId: input.sourceId || null,
    body: input.body,
    locator: input.locator || null,
    note: input.note ?? "",
    verified: !!input.verified,
    position: Number(max?.n ?? -1) + 1,
  });
}

export async function deleteExcerpt(id: string) {
  const db = await ready();
  await db.delete(s.excerpts).where(eq(s.excerpts.id, id));
}

/* -------------------------------------------------------------------------- */
/* Debates                                                                     */
/* -------------------------------------------------------------------------- */

const lines = (v: string) => JSON.stringify(v.split("\n").map((x) => x.trim()).filter(Boolean));

export async function savePosition(debateId: string, id: string | null, f: { label: string; holderId?: string; centralClaim: string; summary: string; assumptions: string; criticisms: string }) {
  if (!f.label.trim()) throw new ValidationError({ position: "A position needs a label." });
  const db = await ready();
  const values = {
    label: f.label.trim(),
    holderId: f.holderId || null,
    centralClaim: f.centralClaim,
    summary: f.summary,
    assumptions: lines(f.assumptions),
    criticisms: lines(f.criticisms),
  };
  if (id) await db.update(s.debatePositions).set(values).where(eq(s.debatePositions.id, id));
  else {
    const max = await db.select({ n: sql<number>`coalesce(max(position), -1)` }).from(s.debatePositions).where(eq(s.debatePositions.debateId, debateId)).get();
    await db.insert(s.debatePositions).values({ id: newId("pos"), debateId, position: Number(max?.n ?? -1) + 1, ...values });
  }
  await indexEntity(db, debateId);
}

export async function deletePosition(id: string, debateId: string) {
  const db = await ready();
  await db.delete(s.debatePositions).where(eq(s.debatePositions.id, id));
  await indexEntity(db, debateId);
}

export async function addProposition(debateId: string, statement: string) {
  if (!statement.trim()) throw new ValidationError({ proposition: "Write the proposition." });
  const db = await ready();
  const max = await db.select({ n: sql<number>`coalesce(max(position), -1)` }).from(s.debatePropositions).where(eq(s.debatePropositions.debateId, debateId)).get();
  await db.insert(s.debatePropositions).values({ id: newId("prop"), debateId, statement: statement.trim(), position: Number(max?.n ?? -1) + 1 });
}

export async function deleteProposition(id: string) {
  const db = await ready();
  await db.delete(s.debatePropositions).where(eq(s.debatePropositions.id, id));
}

export async function setStances(entries: { positionId: string; propositionId: string; stance: Stance | ""; note: string }[]) {
  const db = await ready();
  for (const e of entries) {
    if (!e.stance) {
      await db.delete(s.positionStances).where(and(eq(s.positionStances.positionId, e.positionId), eq(s.positionStances.propositionId, e.propositionId)));
      continue;
    }
    await db
      .insert(s.positionStances)
      .values({ positionId: e.positionId, propositionId: e.propositionId, stance: e.stance, note: e.note })
      .onConflictDoUpdate({ target: [s.positionStances.positionId, s.positionStances.propositionId], set: { stance: e.stance, note: e.note } });
  }
}

export async function addPositionLink(positionId: string, entityId: string) {
  if (!entityId) throw new ValidationError({ link: "Choose an entry." });
  const db = await ready();
  await db.insert(s.positionLinks).values({ positionId, entityId }).onConflictDoNothing();
}

export async function removePositionLink(positionId: string, entityId: string) {
  const db = await ready();
  await db.delete(s.positionLinks).where(and(eq(s.positionLinks.positionId, positionId), eq(s.positionLinks.entityId, entityId)));
}

export async function addArgument(debateId: string, f: { positionId?: string; kind: "argument" | "counterargument"; respondsToId?: string; body: string }) {
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
}

export async function deleteArgument(id: string) {
  const db = await ready();
  await db.update(s.debateArguments).set({ respondsToId: null }).where(eq(s.debateArguments.respondsToId, id));
  await db.delete(s.debateArguments).where(eq(s.debateArguments.id, id));
}

/* -------------------------------------------------------------------------- */
/* Paths                                                                       */
/* -------------------------------------------------------------------------- */

async function renumber(pathId: string, orderedIds: string[]) {
  const db = await ready();
  for (const [i, id] of orderedIds.entries()) {
    await db.update(s.pathSteps).set({ position: i + 1 }).where(and(eq(s.pathSteps.id, id), eq(s.pathSteps.pathId, pathId)));
  }
}

export async function addStep(pathId: string, entityId: string, framing: string) {
  if (!entityId) throw new ValidationError({ step: "Choose an entry for this stop." });
  const db = await ready();
  const max = await db.select({ n: sql<number>`coalesce(max(position), 0)` }).from(s.pathSteps).where(eq(s.pathSteps.pathId, pathId)).get();
  await db.insert(s.pathSteps).values({ id: newId("step"), pathId, entityId, framing, position: Number(max?.n ?? 0) + 1 });
}

export async function updateStep(id: string, framing: string) {
  const db = await ready();
  await db.update(s.pathSteps).set({ framing }).where(eq(s.pathSteps.id, id));
}

export async function moveStep(pathId: string, id: string, delta: -1 | 1) {
  const steps = (await getPathSteps(pathId)).map((x) => x.step.id);
  const i = steps.indexOf(id);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= steps.length) return;
  [steps[i], steps[j]] = [steps[j], steps[i]];
  await renumber(pathId, steps);
}

export async function deleteStep(pathId: string, id: string) {
  const db = await ready();
  await db.delete(s.pathSteps).where(eq(s.pathSteps.id, id));
  await renumber(pathId, (await getPathSteps(pathId)).map((x) => x.step.id));
}

/* -------------------------------------------------------------------------- */
/* Sources                                                                     */
/* -------------------------------------------------------------------------- */

export async function saveSource(
  id: string | null,
  f: { title: string; author: string; publicationDate: string; publisher: string; url: string; sourceType: SourceType; locator: string; notes: string },
) {
  const errors: Record<string, string> = {};
  if (!f.title.trim()) errors.title = "Title is required.";
  if (f.url && !/^https?:\/\//.test(f.url)) errors.url = "Must be an http(s) URL.";
  if (Object.keys(errors).length) throw new ValidationError(errors);
  const db = await ready();
  const values = {
    title: f.title.trim(),
    author: f.author.trim(),
    publicationDate: f.publicationDate || null,
    publisher: f.publisher || null,
    url: f.url || null,
    sourceType: f.sourceType,
    locator: f.locator || null,
    notes: f.notes,
  };
  if (id) {
    await db.update(s.sources).set({ ...values, updatedAt: sql`(CURRENT_TIMESTAMP)` }).where(eq(s.sources.id, id));
    return id;
  }
  const newSourceId = newId("src");
  await db.insert(s.sources).values({ id: newSourceId, ...values });
  return newSourceId;
}

export async function deleteSource(id: string) {
  const db = await ready();
  await db.delete(s.sources).where(eq(s.sources.id, id));
}
