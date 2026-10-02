import "server-only";
import { and, asc, eq, like, or, sql } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { SOURCE_TYPES, type SourceType } from "@/lib/content/model";
import { newId } from "@/lib/util/id";
import { audit } from "./audit";
import { NotFoundError, ValidationError } from "./content";
import { assertCan, type Actor } from "./permissions";

export const SOURCE_FIELDS = [
  "title",
  "author",
  "sourceType",
  "publicationDate",
  "publisher",
  "place",
  "edition",
  "translator",
  "editors",
  "containerTitle",
  "locator",
  "isbn",
  "url",
  "notes",
] as const;
export type SourceInput = Partial<Record<(typeof SOURCE_FIELDS)[number], string>>;

function clean(f: SourceInput) {
  const errors: Record<string, string> = {};
  const title = f.title?.trim() ?? "";
  if (!title) errors.title = "A title is required.";
  const sourceType = (f.sourceType ?? "SECONDARY") as SourceType;
  if (!SOURCE_TYPES.includes(sourceType)) errors.sourceType = "Choose a source type.";
  const url = f.url?.trim() ?? "";
  if (url && !/^https?:\/\/\S+$/.test(url)) errors.url = "Use a full http(s) address.";
  if (Object.keys(errors).length) throw new ValidationError(errors);
  const opt = (k: keyof SourceInput) => f[k]?.trim() || null;
  return {
    title,
    author: f.author?.trim() ?? "",
    sourceType,
    publicationDate: opt("publicationDate"),
    publisher: opt("publisher"),
    place: opt("place"),
    edition: opt("edition"),
    translator: opt("translator"),
    editors: opt("editors"),
    containerTitle: opt("containerTitle"),
    locator: opt("locator"),
    isbn: opt("isbn"),
    url: url || null,
    notes: f.notes?.trim() ?? "",
  };
}

/**
 * Catalogue a source. `opts.id` gives it a stable id (used by imports whose
 * prose cites sources as [cite:src_…]); it must be unused.
 */
export async function createSource(actor: Actor, f: SourceInput, opts: { id?: string } = {}) {
  assertCan(actor, "source.create");
  const values = clean(f);
  const db = await ready();
  if (opts.id && !/^src_[a-z0-9_-]{2,80}$/.test(opts.id)) throw new ValidationError({ id: "Source ids look like src_name_of_work." });
  if (opts.id && (await db.select({ id: s.sources.id }).from(s.sources).where(eq(s.sources.id, opts.id)).get())) {
    throw new ValidationError({ id: `A source with id ${opts.id} already exists.` });
  }
  const id = opts.id ?? newId("src");
  await db.insert(s.sources).values({ id, ...values, createdBy: actor.id });
  await audit(actor.id, "source_create", { type: "source", id, label: values.title }, { sourceType: values.sourceType });
  return id;
}

export async function updateSource(actor: Actor, id: string, f: SourceInput) {
  const db = await ready();
  const src = await db.select().from(s.sources).where(eq(s.sources.id, id)).get();
  if (!src) throw new NotFoundError("Source not found.");
  assertCan(actor, "source.edit", undefined, src.createdBy);
  const values = clean(f);
  await db.update(s.sources).set({ ...values, updatedAt: sql`(CURRENT_TIMESTAMP)` }).where(eq(s.sources.id, id));
  await audit(actor.id, "source_edit", { type: "source", id, label: values.title });
}

export async function deleteSource(actor: Actor, id: string) {
  const db = await ready();
  const src = await db.select().from(s.sources).where(eq(s.sources.id, id)).get();
  if (!src) return;
  assertCan(actor, "source.edit", undefined, null); // editors only
  const usage = await sourceUsage(id);
  if (usage.total) throw new ValidationError({ source: `This source is still used ${usage.total} time(s). Detach it first.` });
  await db.delete(s.sources).where(eq(s.sources.id, id));
  await audit(actor.id, "source_edit", { type: "source", id, label: src.title }, { deleted: true });
}

export async function sourceUsage(id: string) {
  const db = await ready();
  const [c, x, r, m] = await Promise.all([
    db.select({ n: sql<number>`count(*)` }).from(s.citations).where(eq(s.citations.sourceId, id)).get(),
    db.select({ n: sql<number>`count(*)` }).from(s.excerpts).where(eq(s.excerpts.sourceId, id)).get(),
    db.select({ n: sql<number>`count(*)` }).from(s.relationships).where(eq(s.relationships.sourceId, id)).get(),
    db.select({ n: sql<number>`count(*)` }).from(s.media).where(eq(s.media.sourceId, id)).get(),
  ]);
  const counts = { citations: Number(c?.n ?? 0), excerpts: Number(x?.n ?? 0), relationships: Number(r?.n ?? 0), media: Number(m?.n ?? 0) };
  return { ...counts, total: counts.citations + counts.excerpts + counts.relationships + counts.media };
}

export async function searchSources(q: string, limit = 20) {
  const db = await ready();
  const term = `%${q.trim()}%`;
  return db
    .select()
    .from(s.sources)
    .where(q.trim() ? or(like(s.sources.title, term), like(s.sources.author, term), like(s.sources.id, term)) : undefined)
    .orderBy(asc(s.sources.author), asc(s.sources.title))
    .limit(limit);
}

export async function listSourcesForDesk(opts: { q?: string; type?: string } = {}) {
  const db = await ready();
  const term = `%${opts.q?.trim() ?? ""}%`;
  return db
    .select({
      src: s.sources,
      uses: sql<number>`(SELECT count(*) FROM citations WHERE source_id = sources.id) + (SELECT count(*) FROM excerpts WHERE source_id = sources.id)`,
      creator: s.users.name,
    })
    .from(s.sources)
    .leftJoin(s.users, eq(s.users.id, s.sources.createdBy))
    .where(
      and(
        opts.q?.trim() ? or(like(s.sources.title, term), like(s.sources.author, term)) : undefined,
        opts.type ? eq(s.sources.sourceType, opts.type) : undefined,
      ),
    )
    .orderBy(asc(s.sources.author), asc(s.sources.title));
}

export async function getSourceForDesk(id: string) {
  const db = await ready();
  return (await db.select().from(s.sources).where(eq(s.sources.id, id)).get()) ?? null;
}

/** Bibliographic completeness — informs validation; never blocks saving. */
export function sourceGaps(src: Pick<s.SourceRow, "author" | "publicationDate" | "publisher" | "url" | "sourceType">): string[] {
  const gaps: string[] = [];
  if (!src.author.trim()) gaps.push("author");
  if (!src.publicationDate) gaps.push("date");
  if (!src.publisher && !src.url) gaps.push("publisher or URL");
  return gaps;
}

/** Entries that cite or quote a source (every status). */
export async function sourceCitedBy(id: string) {
  const db = await ready();
  const [c, x] = await Promise.all([
    db
      .select({ id: s.entities.id, title: s.entities.title, kind: s.entities.kind, locator: s.citations.locator })
      .from(s.citations)
      .innerJoin(s.entities, eq(s.entities.id, s.citations.entityId))
      .where(eq(s.citations.sourceId, id)),
    db
      .select({ id: s.entities.id, title: s.entities.title, kind: s.entities.kind, locator: s.excerpts.locator })
      .from(s.excerpts)
      .innerJoin(s.entities, eq(s.entities.id, s.excerpts.entityId))
      .where(eq(s.excerpts.sourceId, id)),
  ]);
  return [...c.map((r) => ({ ...r, how: "cited" })), ...x.map((r) => ({ ...r, how: "quoted" }))];
}
