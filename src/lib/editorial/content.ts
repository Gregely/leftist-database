import "server-only";
/**
 * Entry content, revisions and the publishing workflow.
 *
 * The entity tables are the single canonical store and always hold the
 * content the public sees for live entries. Versioning works like this:
 *
 * - Every substantive save records a revision snapshot of the entry's content
 *   fields. Autosaves by the same person within a short window amend the open
 *   revision instead of piling up versions; submitting, publishing, restoring
 *   or saving with a message seals it.
 * - For entries that are not live, saves also write straight to the tables
 *   (nobody outside the desk can see them).
 * - For live entries, saves go only into revisions — the "working copy" — so
 *   the public keeps reading the published content until an editor publishes
 *   the new version, which copies the working copy into the tables.
 * - Every write bumps `lock_version`; saves carry the version they started
 *   from and fail with a ConflictError instead of overwriting someone else.
 */
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { indexEntity, removeFromIndex } from "@/lib/db/search-index";
import { KINDS, type EntityKind, type WorkflowStatus } from "@/lib/content/model";
import { extractCites, extractFigures } from "@/lib/content/markup";
import { newId, slugify } from "@/lib/util/id";
import { audit } from "./audit";
import { fieldsFor, KIND_DEFAULTS, type FieldDef, type FieldValues } from "./fields";
import { assertCan, type Actor, type EntityGate } from "./permissions";
import { nextStatus, statusAfterEdit, TRANSITION_AUDIT, TRANSITION_PERMISSION, type Transition } from "./workflow";

type Db = Awaited<ReturnType<typeof ready>>;

export const DETAIL_TABLES = {
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
    this.name = "ValidationError";
  }
}

export class ConflictError extends Error {
  constructor(
    public current: { lockVersion: number; updatedAt: string; editor: string | null },
  ) {
    super("This entry was changed by someone else since you opened it.");
    this.name = "ConflictError";
  }
}

export class NotFoundError extends Error {}

/** SQLite CURRENT_TIMESTAMP ("YYYY-MM-DD HH:MM:SS", UTC) or ISO → epoch ms. */
export function parseDbDate(v: string): number {
  return new Date(v.includes("T") ? v : v.replace(" ", "T") + "Z").getTime();
}

/** Autosaves by the same person within this window amend the open revision. */
const COALESCE_MINUTES = 30;

/* -------------------------------------------------------------------------- */
/* Reading                                                                     */
/* -------------------------------------------------------------------------- */

export async function loadEntity(id: string) {
  const db = await ready();
  return (await db.select().from(s.entities).where(eq(s.entities.id, id)).get()) ?? null;
}

export async function requireEntity(id: string) {
  const row = await loadEntity(id);
  if (!row) throw new NotFoundError("Entry not found.");
  return row;
}

export function gateOf(row: s.EntityRow): EntityGate {
  return {
    authorId: row.authorId,
    reviewerId: row.reviewerId,
    status: row.status as WorkflowStatus,
    live: row.live,
    publishedRevision: row.publishedRevision,
  };
}

export const hasPendingChanges = (row: Pick<s.EntityRow, "live" | "revision" | "publishedRevision">) =>
  row.live && row.revision > (row.publishedRevision ?? 0);

function aliasesToText(json: string) {
  try {
    const a = JSON.parse(json);
    return Array.isArray(a) ? a.join("\n") : "";
  } catch {
    return "";
  }
}

/** Field values as currently stored in the entity tables. */
export async function readTableFields(row: s.EntityRow): Promise<FieldValues> {
  const db = await ready();
  const kind = row.kind as EntityKind;
  const table = DETAIL_TABLES[kind];
  const details = ((await db.select().from(table).where(eq(table.entityId, row.id)).get()) ?? {}) as Record<string, unknown>;
  const out: FieldValues = {};
  for (const f of fieldsFor(kind)) {
    const raw = f.store === "entity" ? (row as Record<string, unknown>)[f.name] : details[f.name];
    out[f.name] = f.name === "aliases" ? aliasesToText(String(raw ?? "[]")) : ((raw ?? null) as FieldValues[string]);
  }
  return out;
}

export async function getRevision(entityId: string, version: number) {
  const db = await ready();
  return (await db.select().from(s.revisions).where(and(eq(s.revisions.entityId, entityId), eq(s.revisions.version, version))).get()) ?? null;
}

export function snapshotFields(rev: { snapshot: string }): FieldValues {
  try {
    return (JSON.parse(rev.snapshot).fields ?? {}) as FieldValues;
  } catch {
    return {};
  }
}

/** The editable working copy: the pending revision for live entries, otherwise the tables. */
export async function readWorkingFields(row: s.EntityRow): Promise<FieldValues> {
  if (hasPendingChanges(row)) {
    const rev = await getRevision(row.id, row.revision);
    if (rev) return { ...(await readTableFields(row)), ...snapshotFields(rev) };
  }
  return readTableFields(row);
}

/** Split field values into entity-row and detail-row overlays (used by preview). */
export function splitFields(kind: EntityKind, values: FieldValues) {
  const entity: Record<string, unknown> = {};
  const details: Record<string, unknown> = {};
  for (const f of fieldsFor(kind)) {
    if (!(f.name in values)) continue;
    let v: unknown = values[f.name];
    if (f.name === "aliases") v = JSON.stringify(String(v ?? "").split("\n").map((x) => x.trim()).filter(Boolean));
    (f.store === "entity" ? entity : details)[f.name] = v;
  }
  return { entity, details };
}

/* -------------------------------------------------------------------------- */
/* Coercion                                                                    */
/* -------------------------------------------------------------------------- */

function coerceField(f: FieldDef, raw: unknown): string | number | boolean | null {
  if (f.type === "checkbox") return raw === true || raw === "on" || raw === "true";
  const v = typeof raw === "number" ? String(raw) : typeof raw === "string" ? raw : raw == null ? "" : String(raw);
  const t = f.type === "richtext" || f.type === "textarea" || f.type === "list" ? v.replace(/\r\n/g, "\n").trim() : v.trim();
  switch (f.type) {
    case "number":
      if (!t) return null;
      if (!/^-?\d{1,4}$/.test(t)) throw new ValidationError({ [f.name]: `${f.label} must be a year or whole number.` });
      return Number(t);
    case "select":
      if (t && f.options && !f.options.includes(t)) throw new ValidationError({ [f.name]: `Choose a valid ${f.label.toLowerCase()}.` });
      if (f.name === "difficulty") return Number(t || 2);
      return t || null;
    case "url":
      if (t && !/^https?:\/\/\S+$/.test(t)) throw new ValidationError({ [f.name]: "Use a full http(s) address." });
      return t || null;
    case "slug":
      return slugify(t);
    default:
      return t;
  }
}

/** Validate and normalise submitted values. Only the title is required to save a draft. */
export function coerceValues(kind: EntityKind, input: Record<string, unknown>, base: FieldValues): FieldValues {
  const out: FieldValues = { ...base };
  const errors: Record<string, string> = {};
  for (const f of fieldsFor(kind)) {
    if (!(f.name in input)) continue;
    try {
      out[f.name] = coerceField(f, input[f.name]);
    } catch (e) {
      if (e instanceof ValidationError) Object.assign(errors, e.fields);
      else throw e;
    }
  }
  if (!String(out.title ?? "").trim()) errors.title = "A title is required.";
  if (!out.slug) out.slug = slugify(String(out.title ?? ""));
  if (!out.slug) errors.slug = "Choose a slug.";
  if (Object.keys(errors).length) throw new ValidationError(errors);
  return out;
}

function changedKeys(a: FieldValues, b: FieldValues): string[] {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].filter((k) => (a[k] ?? null) !== (b[k] ?? null) && !(a[k] == null && b[k] === "") && !(a[k] === "" && b[k] == null));
}

/* -------------------------------------------------------------------------- */
/* Writing                                                                     */
/* -------------------------------------------------------------------------- */

async function assertSlugFree(db: Db, kind: string, slug: string, selfId: string) {
  const clash = await db
    .select({ id: s.entities.id })
    .from(s.entities)
    .where(and(eq(s.entities.kind, kind), eq(s.entities.slug, slug)))
    .get();
  if (clash && clash.id !== selfId) throw new ValidationError({ slug: `Another ${KINDS[kind as EntityKind].label.toLowerCase()} already uses “${slug}”.` });
}

/** Copy field values into the canonical tables and refresh everything derived from them. */
async function writeTables(db: Db, row: s.EntityRow, values: FieldValues) {
  const kind = row.kind as EntityKind;
  const { entity, details } = splitFields(kind, values);
  const newSlug = String(entity.slug ?? row.slug);
  if (newSlug !== row.slug) {
    await assertSlugFree(db, kind, newSlug, row.id);
    // Keep old public addresses working.
    if (row.publishedRevision != null) {
      await db.insert(s.slugHistory).values({ kind, slug: row.slug, entityId: row.id }).onConflictDoUpdate({
        target: [s.slugHistory.kind, s.slugHistory.slug],
        set: { entityId: row.id },
      });
    }
    await db.delete(s.slugHistory).where(and(eq(s.slugHistory.kind, kind), eq(s.slugHistory.slug, newSlug)));
  }
  for (const k of ["subtitle"]) if (entity[k] === "") entity[k] = null;
  await db.update(s.entities).set(entity as never).where(eq(s.entities.id, row.id));
  const table = DETAIL_TABLES[kind];
  await db
    .insert(table)
    .values({ entityId: row.id, ...details } as never)
    .onConflictDoUpdate({ target: table.entityId, set: details as never });
  await syncDerived(db, row.id, kind, values);
  await indexEntity(db, row.id);
}

/**
 * Rows derived from prose: sources cited inline become citations (field
 * "inline"), and figures placed in prose are attached to the entry.
 */
async function syncDerived(db: Db, entityId: string, kind: EntityKind, values: FieldValues) {
  const texts = fieldsFor(kind)
    .filter((f) => f.type === "richtext")
    .map((f) => String(values[f.name] ?? ""));
  const cited = [...new Set(extractCites(...texts).map((c) => c.source))];
  const known = cited.length ? (await db.select({ id: s.sources.id }).from(s.sources).where(inArray(s.sources.id, cited))).map((r) => r.id) : [];
  const existing = await db
    .select({ id: s.citations.id, sourceId: s.citations.sourceId })
    .from(s.citations)
    .where(and(eq(s.citations.entityId, entityId), eq(s.citations.field, "inline")));
  for (const c of existing) if (!known.includes(c.sourceId)) await db.delete(s.citations).where(eq(s.citations.id, c.id));
  for (const src of known) {
    if (existing.some((c) => c.sourceId === src)) continue;
    await db.insert(s.citations).values({ id: newId("cite"), entityId, sourceId: src, field: "inline", position: 1000 });
  }
  const figures = extractFigures(...texts);
  if (figures.length) {
    const media = await db.select({ id: s.media.id }).from(s.media).where(inArray(s.media.id, figures));
    for (const m of media) {
      await db.insert(s.entityMedia).values({ id: newId("em"), entityId, mediaId: m.id, role: "figure", position: 100 }).onConflictDoNothing();
    }
  }
}

/** A short, human-readable inventory of an entry's connections, kept with each revision. */
async function structureSummary(db: Db, entityId: string): Promise<string[]> {
  const [out, inc, cites, ex, med] = await Promise.all([
    db
      .select({ type: s.relationships.type, title: s.entities.title })
      .from(s.relationships)
      .innerJoin(s.entities, eq(s.entities.id, s.relationships.toId))
      .where(eq(s.relationships.fromId, entityId)),
    db
      .select({ type: s.relationships.type, title: s.entities.title })
      .from(s.relationships)
      .innerJoin(s.entities, eq(s.entities.id, s.relationships.fromId))
      .where(eq(s.relationships.toId, entityId)),
    db
      .select({ title: s.sources.title, locator: s.citations.locator })
      .from(s.citations)
      .innerJoin(s.sources, eq(s.sources.id, s.citations.sourceId))
      .where(eq(s.citations.entityId, entityId)),
    db.select({ body: s.excerpts.body, locator: s.excerpts.locator }).from(s.excerpts).where(eq(s.excerpts.entityId, entityId)),
    db
      .select({ title: s.media.title, role: s.entityMedia.role })
      .from(s.entityMedia)
      .innerJoin(s.media, eq(s.media.id, s.entityMedia.mediaId))
      .where(eq(s.entityMedia.entityId, entityId)),
  ]);
  return [
    ...out.map((r) => `→ ${r.type} ${r.title}`),
    ...inc.map((r) => `← ${r.type} ${r.title}`),
    ...cites.map((c) => `source: ${c.title}${c.locator ? `, ${c.locator}` : ""}`),
    ...ex.map((x) => `excerpt: ${x.body ? `“${x.body.slice(0, 60)}”` : "(reference)"} ${x.locator ?? ""}`.trim()),
    ...med.map((m) => `media (${m.role}): ${m.title || "untitled"}`),
  ].sort();
}

/** Seeded or imported entries get a first, sealed revision the first time they are touched. */
async function ensureBaseline(db: Db, row: s.EntityRow): Promise<s.EntityRow> {
  if (row.revision > 0) return row;
  const fields = await readTableFields(row);
  await db.insert(s.revisions).values({
    id: newId("rev"),
    entityId: row.id,
    version: 1,
    snapshot: JSON.stringify({ fields, structure: await structureSummary(db, row.id) }),
    changedFields: "[]",
    message: row.isSample ? "Baseline: seeded sample entry" : "Baseline",
    status: row.status,
    authorId: row.authorId,
    sealed: true,
  });
  const publishedRevision = row.live ? 1 : row.publishedRevision;
  await db.update(s.entities).set({ revision: 1, publishedRevision }).where(eq(s.entities.id, row.id));
  return { ...row, revision: 1, publishedRevision };
}

/** Optimistic-concurrency update: succeeds only if nobody else wrote since `baseLock`. */
async function compareAndSet(db: Db, row: s.EntityRow, baseLock: number, set: Partial<s.EntityRow>) {
  const res = await db
    .update(s.entities)
    .set({ ...set, lockVersion: sql`${s.entities.lockVersion} + 1`, updatedAt: sql`(CURRENT_TIMESTAMP)` } as never)
    .where(and(eq(s.entities.id, row.id), eq(s.entities.lockVersion, baseLock)));
  if (res.rowsAffected !== 1) {
    const now = (await loadEntity(row.id))!;
    throw new ConflictError({ lockVersion: now.lockVersion, updatedAt: now.updatedAt, editor: now.lastEditedBy });
  }
}

export interface SaveResult {
  lockVersion: number;
  revision: number;
  status: WorkflowStatus;
  savedAt: string;
  changed: string[];
  newRevision: boolean;
}

export async function createEntity(actor: Actor, kind: EntityKind, input: { title: string }) {
  assertCan(actor, "entity.create");
  const db = await ready();
  const title = input.title.trim();
  if (!title) throw new ValidationError({ title: "A title is required." });
  let slug = slugify(title) || newId("entry").toLowerCase();
  const taken = await db.select({ id: s.entities.id }).from(s.entities).where(and(eq(s.entities.kind, kind), eq(s.entities.slug, slug))).get();
  if (taken) slug = `${slug}-${newId("x").slice(2, 6)}`;
  const id = newId(KINDS[kind].idPrefix);
  await db.insert(s.entities).values({ id, kind, slug, title, status: "draft", authorId: actor.id, lastEditedBy: actor.id, revision: 1 });
  const table = DETAIL_TABLES[kind];
  await db.insert(table).values({ entityId: id, ...(KIND_DEFAULTS[kind] ?? {}) } as never);
  const row = (await loadEntity(id))!;
  await db.insert(s.revisions).values({
    id: newId("rev"),
    entityId: id,
    version: 1,
    snapshot: JSON.stringify({ fields: await readTableFields(row), structure: [] }),
    changedFields: JSON.stringify(["title"]),
    message: "Created",
    status: "draft",
    authorId: actor.id,
  });
  await indexEntity(db, id);
  await audit(actor.id, "create", { type: "entity", id, label: title }, { kind });
  return id;
}

/**
 * Save content fields. `baseLock` is the lock version the editor loaded;
 * a mismatch raises ConflictError. With `message`, the revision is sealed
 * as a named checkpoint.
 */
export async function saveContent(
  actor: Actor,
  id: string,
  baseLock: number,
  input: Record<string, unknown>,
  opts: { message?: string } = {},
): Promise<SaveResult> {
  const db = await ready();
  let row = await requireEntity(id);
  assertCan(actor, "entity.edit", gateOf(row));
  if (row.lockVersion !== baseLock) {
    throw new ConflictError({ lockVersion: row.lockVersion, updatedAt: row.updatedAt, editor: row.lastEditedBy });
  }
  const kind = row.kind as EntityKind;
  const before = await readWorkingFields(row);
  const values = coerceValues(kind, input, before);
  const changed = changedKeys(before, values);
  const message = opts.message?.trim() ?? "";
  if (!changed.length && !message) {
    return { lockVersion: row.lockVersion, revision: row.revision, status: row.status as WorkflowStatus, savedAt: row.updatedAt, changed, newRevision: false };
  }
  if (values.slug !== before.slug) await assertSlugFree(db, kind, String(values.slug), id);

  row = await ensureBaseline(db, row);
  const status = changed.length ? statusAfterEdit(row.status as WorkflowStatus) : (row.status as WorkflowStatus);
  const live = row.live;

  // 1. Decide whether to amend the open revision or start a new version.
  const latest = await getRevision(id, row.revision);
  const fresh =
    !!latest &&
    !latest.sealed &&
    !message &&
    latest.authorId === actor.id &&
    latest.version > (row.publishedRevision ?? 0) &&
    Date.now() - parseDbDate(latest.updatedAt) < COALESCE_MINUTES * 60_000;
  const newRevision = !fresh;
  const revision = newRevision ? row.revision + 1 : row.revision;

  // 2. Claim the write (fails with ConflictError if someone else saved meanwhile).
  await compareAndSet(db, row, baseLock, { status, revision, lastEditedBy: actor.id });

  // 3. Record the revision, and write the tables if the entry is not live.
  const snapshot = JSON.stringify({ fields: values, structure: await structureSummary(db, id) });
  if (!newRevision && latest) {
    const merged = [...new Set([...(JSON.parse(latest.changedFields) as string[]), ...changed])];
    await db
      .update(s.revisions)
      .set({ snapshot, changedFields: JSON.stringify(merged), status, updatedAt: sql`(CURRENT_TIMESTAMP)` })
      .where(eq(s.revisions.id, latest.id));
  } else {
    await db.insert(s.revisions).values({
      id: newId("rev"),
      entityId: id,
      version: revision,
      snapshot,
      changedFields: JSON.stringify(changed),
      message,
      status,
      authorId: actor.id,
      sealed: !!message,
    });
  }
  if (!live) await writeTables(db, row, values);

  if (newRevision) {
    await audit(actor.id, "edit", { type: "entity", id, label: String(values.title) }, { revision, fields: changed, message: message || undefined });
  }
  const after = (await loadEntity(id))!;
  return { lockVersion: after.lockVersion, revision, status, savedAt: after.updatedAt, changed, newRevision };
}

/** Move an entry through the workflow. Reasons are required for revision requests and rejections. */
export async function transition(
  actor: Actor,
  id: string,
  t: Transition,
  opts: { note?: string; validate?: (row: s.EntityRow) => Promise<{ level: string; message: string }[]> } = {},
) {
  const db = await ready();
  let row = await requireEntity(id);
  const gate = gateOf(row);
  assertCan(actor, TRANSITION_PERMISSION[t], gate);
  const note = opts.note?.trim() ?? "";
  if ((t === "requestRevision" || t === "reject") && !note) {
    throw new ValidationError({ note: "Explain what needs to change — the contributor will see this note." });
  }
  if (t === "publish" && opts.validate) {
    const errors = (await opts.validate(row)).filter((i) => i.level === "error");
    if (errors.length) throw new ValidationError({ publish: `Fix ${errors.length} error${errors.length > 1 ? "s" : ""} before publishing: ${errors.map((e) => e.message).join("; ")}` });
  }
  row = await ensureBaseline(db, row);
  const pending = hasPendingChanges(row);
  const status = nextStatus(t, row.status as WorkflowStatus, { live: row.live, publishedRevision: row.publishedRevision, hasPendingChanges: pending });
  const set: Partial<s.EntityRow> = { status, lastEditedBy: actor.id };

  if (t === "submit") set.submittedAt = new Date().toISOString();
  if (t === "startReview" || t === "approve" || t === "requestRevision" || t === "reject") set.reviewerId = actor.id;
  if (t === "unpublish" || t === "archive") set.live = false;

  if (t === "publish") {
    const working = await readWorkingFields(row);
    await writeTables(db, row, working);
    set.live = true;
    set.publishedRevision = row.revision;
    set.publishedAt = new Date().toISOString();
  }

  await compareAndSet(db, row, row.lockVersion, set);

  // Record the workflow moment on the current revision.
  if (["submit", "approve", "publish"].includes(t)) {
    await db
      .update(s.revisions)
      .set({ sealed: true, status })
      .where(and(eq(s.revisions.entityId, id), eq(s.revisions.version, row.revision)));
  }
  if (note) {
    const kind = t === "requestRevision" ? "revision_request" : t === "reject" ? "rejection" : t === "approve" ? "approval" : "note";
    await db.insert(s.editorialNotes).values({ id: newId("note"), entityId: id, authorId: actor.id, kind, body: note, revision: row.revision });
  }
  if (t === "publish" || t === "unpublish" || t === "archive") await indexEntity(db, id);
  await audit(actor.id, TRANSITION_AUDIT[t], { type: "entity", id, label: row.title }, { from: row.status, to: status, revision: row.revision, note: note || undefined });
  return status;
}

/** Restore an earlier version as a new revision (history is never rewritten). */
export async function restoreRevision(actor: Actor, id: string, version: number, baseLock: number) {
  const row = await requireEntity(id);
  assertCan(actor, "entity.restoreRevision", gateOf(row));
  const rev = await getRevision(id, version);
  if (!rev) throw new NotFoundError("That version does not exist.");
  const result = await saveContent(actor, id, baseLock, snapshotFields(rev), { message: `Restored version ${version}` });
  await audit(actor.id, "restore_revision", { type: "entity", id, label: row.title }, { restored: version, revision: result.revision });
  return result;
}

/** Remove an entry that was never published. Published material is archived instead. */
export async function deleteEntity(actor: Actor, id: string) {
  const db = await ready();
  const row = await requireEntity(id);
  assertCan(actor, "entity.delete", gateOf(row));
  await db.delete(s.entities).where(eq(s.entities.id, id));
  await removeFromIndex(db, id);
  await audit(actor.id, "delete", { type: "entity", id, label: row.title }, { kind: row.kind });
}

export async function listRevisions(entityId: string) {
  const db = await ready();
  return db
    .select({ rev: s.revisions, author: s.users.name })
    .from(s.revisions)
    .leftJoin(s.users, eq(s.users.id, s.revisions.authorId))
    .where(eq(s.revisions.entityId, entityId))
    .orderBy(desc(s.revisions.version));
}

/** Overlay used to render a secure preview of the working copy with the public components. */
export async function previewOverlay(row: s.EntityRow) {
  const fields = await readWorkingFields(row);
  return { fields, ...splitFields(row.kind as EntityKind, fields) };
}
