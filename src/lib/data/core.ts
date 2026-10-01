import "server-only";
import { and, asc, eq, inArray, or, sql, type SQL } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import { citations, entities, entityMedia, excerpts, media, relationships, slugHistory, sources, type EntityRow } from "@/lib/db/schema";
import {
  entityHref,
  isEntityKind,
  RELATIONSHIP_TYPES,
  relationshipLabel,
  type EntityKind,
  type ExcerptVerification,
  type MediaRole,
  type RelationshipType,
  type WorkflowStatus,
  type SourceType,
} from "@/lib/content/model";
import { citeKey, extractExcerptIds, extractFigures, extractNotes, extractRefs, footnoteKey } from "@/lib/content/markup";
import type {
  EntitySummary,
  ExcerptRecord,
  Note,
  PreviewSpec,
  ProseContext,
  PublicMedia,
  RelatedEntity,
  SourceRecord,
} from "./types";

/**
 * The one public-visibility rule: an entry is public when it is live
 * (published and neither unpublished nor archived). Drafts, entries in review
 * and pending changes to live entries never pass this filter.
 */
export const isPublic = () => eq(entities.live, true);

export function toSummary(row: EntityRow): EntitySummary {
  const kind = row.kind as EntityKind;
  return {
    id: row.id,
    kind,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    summary: row.summary,
    yearStart: row.yearStart,
    yearEnd: row.yearEnd,
    status: row.status as WorkflowStatus,
    sample: row.isSample,
    href: entityHref(kind, row.slug),
  };
}

export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function toSource(row: typeof sources.$inferSelect): SourceRecord {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    publicationDate: row.publicationDate,
    publisher: row.publisher,
    url: row.url,
    sourceType: row.sourceType as SourceType,
    locator: row.locator,
    notes: row.notes,
  };
}

/* -------------------------------------------------------------------------- */
/* Entities                                                                    */
/* -------------------------------------------------------------------------- */

export async function getEntityRow(kind: EntityKind, slug: string, preview?: PreviewSpec): Promise<EntityRow | null> {
  const db = await ready();
  if (preview) {
    // Authenticated preview: the working copy, whatever its status.
    const row = await db.select().from(entities).where(and(eq(entities.id, preview.entityId), eq(entities.kind, kind))).get();
    return row ? ({ ...row, ...preview.entity } as EntityRow) : null;
  }
  const row = await db
    .select()
    .from(entities)
    .where(and(eq(entities.kind, kind), eq(entities.slug, slug), isPublic()))
    .get();
  return row ?? null;
}

/** Overlay preview values on a detail record. */
export function withPreview<T extends object>(details: T, preview?: PreviewSpec): T {
  return preview ? ({ ...details, ...preview.details } as T) : details;
}

/** If `slug` is an old address of a live entry, its current slug. */
export async function resolveMovedSlug(kind: EntityKind, slug: string): Promise<string | null> {
  const db = await ready();
  const row = await db
    .select({ slug: entities.slug })
    .from(slugHistory)
    .innerJoin(entities, eq(entities.id, slugHistory.entityId))
    .where(and(eq(slugHistory.kind, kind), eq(slugHistory.slug, slug), isPublic()))
    .get();
  return row?.slug ?? null;
}

export async function getEntitiesByIds(ids: string[]): Promise<EntitySummary[]> {
  if (!ids.length) return [];
  const db = await ready();
  const rows = await db.select().from(entities).where(and(inArray(entities.id, ids), isPublic()));
  const byId = new Map(rows.map((r) => [r.id, toSummary(r)]));
  return ids.map((id) => byId.get(id)).filter((x): x is EntitySummary => Boolean(x));
}

export interface ListOptions {
  kind: EntityKind;
  limit?: number;
  offset?: number;
  featured?: boolean;
  order?: "editorial" | "title" | "year";
  letter?: string;
  yearFrom?: number;
  yearTo?: number;
  ids?: string[];
}

export async function listEntities(opts: ListOptions): Promise<{ items: EntitySummary[]; total: number }> {
  const db = await ready();
  const where: SQL[] = [eq(entities.kind, opts.kind), isPublic()];
  if (opts.featured) where.push(eq(entities.featured, true));
  if (opts.letter) where.push(sql`upper(substr(${entities.title}, 1, 1)) = ${opts.letter.toUpperCase()}`);
  if (opts.yearFrom != null) where.push(sql`coalesce(${entities.yearEnd}, ${entities.yearStart}, 9999) >= ${opts.yearFrom}`);
  if (opts.yearTo != null) where.push(sql`coalesce(${entities.yearStart}, -9999) <= ${opts.yearTo}`);
  if (opts.ids) where.push(opts.ids.length ? inArray(entities.id, opts.ids) : sql`0`);
  const order =
    opts.order === "title"
      ? [asc(entities.title)]
      : opts.order === "year"
        ? [sql`${entities.yearStart} IS NULL`, asc(entities.yearStart), asc(entities.title)]
        : [asc(entities.sortOrder), asc(entities.title)];

  const [rows, count] = await Promise.all([
    db
      .select()
      .from(entities)
      .where(and(...where))
      .orderBy(...order)
      .limit(opts.limit ?? 500)
      .offset(opts.offset ?? 0),
    db
      .select({ n: sql<number>`count(*)` })
      .from(entities)
      .where(and(...where))
      .get(),
  ]);
  return { items: rows.map(toSummary), total: Number(count?.n ?? 0) };
}

export async function countByKind(): Promise<Record<EntityKind, number>> {
  const db = await ready();
  const rows = await db
    .select({ kind: entities.kind, n: sql<number>`count(*)` })
    .from(entities)
    .where(isPublic())
    .groupBy(entities.kind);
  const out = { thinker: 0, concept: 0, text: 0, tendency: 0, debate: 0, event: 0, path: 0 } as Record<EntityKind, number>;
  for (const r of rows) if (isEntityKind(r.kind)) out[r.kind] = Number(r.n);
  return out;
}

/** Initial letters present for a kind, for A–Z indexes. */
export async function lettersFor(kind: EntityKind): Promise<string[]> {
  const db = await ready();
  const rows = await db
    .selectDistinct({ l: sql<string>`upper(substr(${entities.title}, 1, 1))` })
    .from(entities)
    .where(and(eq(entities.kind, kind), isPublic()));
  return rows.map((r) => r.l).sort();
}

/* -------------------------------------------------------------------------- */
/* Relationships                                                               */
/* -------------------------------------------------------------------------- */

export interface RelationFilter {
  types?: RelationshipType[];
  kinds?: EntityKind[];
  direction?: "out" | "in";
}

/**
 * All relationships touching an entity, from its point of view: each result is
 * the *other* endpoint, labelled as the viewed entity would read it.
 */
export async function getRelations(entityId: string, filter: RelationFilter = {}): Promise<RelatedEntity[]> {
  const db = await ready();
  const typeWhere = filter.types?.length ? inArray(relationships.type, filter.types) : undefined;
  const kindWhere = filter.kinds?.length ? inArray(entities.kind, filter.kinds) : undefined;

  const [outRows, inRows] = await Promise.all([
    filter.direction === "in"
      ? []
      : db
          .select({ rel: relationships, other: entities })
          .from(relationships)
          .innerJoin(entities, eq(entities.id, relationships.toId))
          .where(and(eq(relationships.fromId, entityId), isPublic(), typeWhere, kindWhere)),
    filter.direction === "out"
      ? []
      : db
          .select({ rel: relationships, other: entities })
          .from(relationships)
          .innerJoin(entities, eq(entities.id, relationships.fromId))
          .where(and(eq(relationships.toId, entityId), isPublic(), typeWhere, kindWhere)),
  ]);

  const toRelated = (r: { rel: typeof relationships.$inferSelect; other: EntityRow }, direction: "out" | "in"): RelatedEntity => {
    const type = r.rel.type as RelationshipType;
    return {
      ...toSummary(r.other),
      relationshipId: r.rel.id,
      type,
      direction,
      label: relationshipLabel(type, direction),
      family: RELATIONSHIP_TYPES[type]?.family ?? "affinity",
      note: r.rel.note,
      weight: r.rel.weight,
    };
  };

  return [...outRows.map((r) => toRelated(r, "out")), ...inRows.map((r) => toRelated(r, "in"))].sort(
    (a, b) => b.weight - a.weight || (a.yearStart ?? 9999) - (b.yearStart ?? 9999) || a.title.localeCompare(b.title),
  );
}

export function pick(rel: RelatedEntity[], type: RelationshipType, direction?: "out" | "in", kind?: EntityKind) {
  return rel.filter(
    (r) => r.type === type && (!direction || r.direction === direction) && (!kind || r.kind === kind),
  );
}

export function uniqueById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((i) => (seen.has(i.id) ? false : (seen.add(i.id), true)));
}

/* -------------------------------------------------------------------------- */
/* Prose context: cross-references and footnotes                               */
/* -------------------------------------------------------------------------- */

export async function resolveRefs(refs: { kind: string; slug: string }[]): Promise<ProseContext["refs"]> {
  const valid = refs.filter((r) => isEntityKind(r.kind));
  if (!valid.length) return {};
  const db = await ready();
  const rows = await db
    .select({ kind: entities.kind, slug: entities.slug, title: entities.title })
    .from(entities)
    .where(and(isPublic(), or(...valid.map((r) => and(eq(entities.kind, r.kind), eq(entities.slug, r.slug))))));
  const out: ProseContext["refs"] = {};
  for (const r of rows) {
    const kind = r.kind as EntityKind;
    out[`${kind}:${r.slug}`] = { title: r.title, href: entityHref(kind, r.slug), kind };
  }
  return out;
}

export async function getCitations(entityId: string) {
  const db = await ready();
  const rows = await db
    .select({ c: citations, s: sources })
    .from(citations)
    .innerJoin(sources, eq(sources.id, citations.sourceId))
    .where(eq(citations.entityId, entityId))
    .orderBy(asc(citations.position));
  return rows.map((r) => ({ ...r.c, source: toSource(r.s) }));
}

/**
 * Build the apparatus for an entry's prose: notes (source citations and
 * explanatory footnotes) numbered in reading order, followed by entry-level
 * citations not cited inline; resolved cross-references; and the figures and
 * excerpts embedded in the text.
 */
export async function buildProse(
  entityId: string,
  fields: (string | null | undefined)[],
): Promise<{ context: ProseContext; notes: Note[] }> {
  const db = await ready();
  const inline = extractNotes(...fields);
  const entryCitations = await getCitations(entityId);
  const sourceIds = [...new Set(inline.flatMap((c) => (c.t === "cite" ? [c.source] : [])))];
  const inlineSources = sourceIds.length
    ? (await db.select().from(sources).where(inArray(sources.id, sourceIds))).map(toSource)
    : [];
  const byId = new Map(inlineSources.map((s) => [s.id, s]));

  const notes: Note[] = [];
  const numbers: Record<string, number> = {};
  for (const c of inline) {
    if (c.t === "footnote") {
      const key = footnoteKey(c.text);
      if (numbers[key]) continue;
      numbers[key] = notes.length + 1;
      notes.push({ n: notes.length + 1, source: null, text: c.text, locator: null, note: "", inline: true });
      continue;
    }
    const key = citeKey(c.source, c.locator);
    const source = byId.get(c.source);
    if (!source || numbers[key]) continue;
    numbers[key] = notes.length + 1;
    notes.push({ n: notes.length + 1, source, text: null, locator: c.locator ?? null, note: "", inline: true });
  }
  for (const c of entryCitations) {
    if (c.field === "inline") continue;
    const alreadyInline = notes.some((n) => n.source?.id === c.sourceId && (!c.locator || n.locator === c.locator));
    if (alreadyInline) continue;
    notes.push({ n: notes.length + 1, source: c.source, text: null, locator: c.locator, note: c.note, inline: false });
  }

  const [refs, figures, embedded] = await Promise.all([
    resolveRefs(extractRefs(...fields)),
    getMediaByIds(extractFigures(...fields)),
    getExcerptsByIds(entityId, extractExcerptIds(...fields)),
  ]);
  return {
    context: {
      refs,
      notes: numbers,
      media: Object.fromEntries(figures.map((m) => [m.id, m])),
      excerpts: Object.fromEntries(embedded.map((x) => [x.id, x])),
    },
    notes,
  };
}

/* -------------------------------------------------------------------------- */
/* Media                                                                       */
/* -------------------------------------------------------------------------- */

function toPublicMedia(m: typeof media.$inferSelect, role: MediaRole = "figure", caption = ""): PublicMedia {
  return {
    id: m.id,
    url: `/media/${m.id}`,
    role,
    title: m.title,
    alt: m.altText,
    caption: caption || m.caption,
    credit: m.credit,
    creator: m.creator,
    license: m.license,
    rights: m.rights,
    year: m.year,
    width: m.width,
    height: m.height,
  };
}

async function getMediaByIds(ids: string[]): Promise<PublicMedia[]> {
  if (!ids.length) return [];
  const db = await ready();
  return (await db.select().from(media).where(inArray(media.id, ids))).map((m) => toPublicMedia(m));
}

/** Images attached to an entry, in editorial order. */
export async function getMediaFor(entityId: string): Promise<PublicMedia[]> {
  const db = await ready();
  const rows = await db
    .select({ a: entityMedia, m: media })
    .from(entityMedia)
    .innerJoin(media, eq(media.id, entityMedia.mediaId))
    .where(eq(entityMedia.entityId, entityId))
    .orderBy(asc(entityMedia.position));
  return rows.map((r) => toPublicMedia(r.m, r.a.role as MediaRole, r.a.caption));
}

/* -------------------------------------------------------------------------- */
/* Excerpts                                                                    */
/* -------------------------------------------------------------------------- */

async function hydrateExcerpts(rows: (typeof excerpts.$inferSelect)[]): Promise<ExcerptRecord[]> {
  if (!rows.length) return [];
  const db = await ready();
  const ents = await getEntitiesByIds([...new Set(rows.flatMap((r) => [r.textId, r.speakerId]).filter((x): x is string => !!x))]);
  const srcIds = [...new Set(rows.map((r) => r.sourceId).filter((x): x is string => !!x))];
  const srcRows = srcIds.length ? await db.select().from(sources).where(inArray(sources.id, srcIds)) : [];
  const entById = new Map(ents.map((t) => [t.id, t]));
  const srcById = new Map(srcRows.map((s) => [s.id, toSource(s)]));
  return rows.map((r) => ({
    id: r.id,
    body: r.body,
    locator: r.locator,
    note: r.note,
    verification: r.verification as ExcerptVerification,
    verified: r.verification === "verified",
    text: r.textId ? entById.get(r.textId) ?? null : null,
    speaker: r.speakerId ? entById.get(r.speakerId) ?? null : null,
    source: r.sourceId ? srcById.get(r.sourceId) ?? null : null,
  }));
}

export async function getExcerpts(where: { entityId?: string; textId?: string }): Promise<ExcerptRecord[]> {
  const db = await ready();
  const cond = where.entityId ? eq(excerpts.entityId, where.entityId) : eq(excerpts.textId, where.textId!);
  const rows = await db.select().from(excerpts).where(cond).orderBy(asc(excerpts.position));
  if (where.entityId) return hydrateExcerpts(rows);
  // Passages from a text, gathered across entries: only those on live entries.
  const liveIds = new Set((await getEntitiesByIds([...new Set(rows.map((r) => r.entityId))])).map((e) => e.id));
  return hydrateExcerpts(rows.filter((r) => liveIds.has(r.entityId)));
}

async function getExcerptsByIds(entityId: string, ids: string[]): Promise<ExcerptRecord[]> {
  if (!ids.length) return [];
  const db = await ready();
  return hydrateExcerpts(await db.select().from(excerpts).where(and(eq(excerpts.entityId, entityId), inArray(excerpts.id, ids))));
}

/** Totals shown in mastheads. */
export async function getArchiveStats() {
  const db = await ready();
  const [e, r, s] = await Promise.all([
    db.select({ n: sql<number>`count(*)` }).from(entities).where(isPublic()).get(),
    db
      .select({ n: sql<number>`count(*)` })
      .from(relationships)
      .where(sql`EXISTS (SELECT 1 FROM entities a WHERE a.id = ${relationships.fromId} AND a.live = 1) AND EXISTS (SELECT 1 FROM entities b WHERE b.id = ${relationships.toId} AND b.live = 1)`)
      .get(),
    db.select({ n: sql<number>`count(*)` }).from(sources).where(sql`${PUBLIC_SOURCE}`).get(),
  ]);
  return { entities: Number(e?.n ?? 0), relationships: Number(r?.n ?? 0), sources: Number(s?.n ?? 0) };
}

/** A source is public once something live cites, quotes or relies on it. */
export const PUBLIC_SOURCE = sql`(
  EXISTS (SELECT 1 FROM citations c JOIN entities e ON e.id = c.entity_id WHERE c.source_id = sources.id AND e.live = 1)
  OR EXISTS (SELECT 1 FROM excerpts x JOIN entities e ON e.id = x.entity_id WHERE x.source_id = sources.id AND e.live = 1)
  OR EXISTS (SELECT 1 FROM relationships r JOIN entities a ON a.id = r.from_id JOIN entities b ON b.id = r.to_id WHERE r.source_id = sources.id AND a.live = 1 AND b.live = 1)
)`;
