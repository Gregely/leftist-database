import "server-only";
import { and, asc, eq, inArray, or, sql, type SQL } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import { citations, entities, excerpts, relationships, sources, type EntityRow } from "@/lib/db/schema";
import {
  entityHref,
  isEntityKind,
  RELATIONSHIP_TYPES,
  relationshipLabel,
  type EntityKind,
  type EntryStatus,
  type RelationshipType,
  type SourceType,
} from "@/lib/content/model";
import { citeKey, extractCites, extractRefs } from "@/lib/content/markup";
import type {
  EntitySummary,
  ExcerptRecord,
  Note,
  ProseContext,
  RelatedEntity,
  SourceRecord,
} from "./types";

/** Statuses visible on the public site. Drafts and entries in review are admin-only. */
export const PUBLIC_STATUSES: EntryStatus[] = ["sample", "published"];
export const isPublic = () => inArray(entities.status, PUBLIC_STATUSES);

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
    status: row.status as EntryStatus,
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

export async function getEntityRow(kind: EntityKind, slug: string): Promise<EntityRow | null> {
  const db = await ready();
  const row = await db
    .select()
    .from(entities)
    .where(and(eq(entities.kind, kind), eq(entities.slug, slug), isPublic()))
    .get();
  return row ?? null;
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
 * Build the footnote apparatus for an entry: inline [cite:…] markers are
 * numbered in reading order, then entry-level citations that were not cited
 * inline are appended.
 */
export async function buildProse(
  entityId: string,
  fields: (string | null | undefined)[],
): Promise<{ context: ProseContext; notes: Note[] }> {
  const db = await ready();
  const inline = extractCites(...fields);
  const entryCitations = await getCitations(entityId);
  const sourceIds = [...new Set(inline.map((c) => c.source))];
  const inlineSources = sourceIds.length
    ? (await db.select().from(sources).where(inArray(sources.id, sourceIds))).map(toSource)
    : [];
  const byId = new Map(inlineSources.map((s) => [s.id, s]));

  const notes: Note[] = [];
  const numbers: Record<string, number> = {};
  for (const c of inline) {
    const key = citeKey(c.source, c.locator);
    const source = byId.get(c.source);
    if (!source || numbers[key]) continue;
    numbers[key] = notes.length + 1;
    notes.push({ n: notes.length + 1, source, locator: c.locator ?? null, note: "", inline: true });
  }
  for (const c of entryCitations) {
    const alreadyInline = notes.some((n) => n.source.id === c.sourceId && (!c.locator || n.locator === c.locator));
    if (alreadyInline) continue;
    notes.push({ n: notes.length + 1, source: c.source, locator: c.locator, note: c.note, inline: false });
  }

  const refs = await resolveRefs(extractRefs(...fields));
  return { context: { refs, notes: numbers }, notes };
}

/* -------------------------------------------------------------------------- */
/* Excerpts                                                                    */
/* -------------------------------------------------------------------------- */

export async function getExcerpts(where: { entityId?: string; textId?: string }): Promise<ExcerptRecord[]> {
  const db = await ready();
  const cond = where.entityId ? eq(excerpts.entityId, where.entityId) : eq(excerpts.textId, where.textId!);
  const rows = await db.select().from(excerpts).where(cond).orderBy(asc(excerpts.position));
  if (!rows.length) return [];
  const texts = await getEntitiesByIds([...new Set(rows.map((r) => r.textId).filter((x): x is string => !!x))]);
  const srcIds = [...new Set(rows.map((r) => r.sourceId).filter((x): x is string => !!x))];
  const srcRows = srcIds.length ? await db.select().from(sources).where(inArray(sources.id, srcIds)) : [];
  const textById = new Map(texts.map((t) => [t.id, t]));
  const srcById = new Map(srcRows.map((s) => [s.id, toSource(s)]));
  return rows.map((r) => ({
    id: r.id,
    body: r.body,
    locator: r.locator,
    note: r.note,
    verified: r.verified,
    text: r.textId ? textById.get(r.textId) ?? null : null,
    source: r.sourceId ? srcById.get(r.sourceId) ?? null : null,
  }));
}

/** Totals shown in mastheads. */
export async function getArchiveStats() {
  const db = await ready();
  const [e, r, s] = await Promise.all([
    db.select({ n: sql<number>`count(*)` }).from(entities).where(isPublic()).get(),
    db.select({ n: sql<number>`count(*)` }).from(relationships).get(),
    db.select({ n: sql<number>`count(*)` }).from(sources).get(),
  ]);
  return { entities: Number(e?.n ?? 0), relationships: Number(r?.n ?? 0), sources: Number(s?.n ?? 0) };
}
