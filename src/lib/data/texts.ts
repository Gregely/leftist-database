import "server-only";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import { entities, relationships, textDetails } from "@/lib/db/schema";
import { buildProse, getEntityRow, getExcerpts, getMediaFor, getRelations, isPublic, pick, toSummary, withPreview } from "./core";
import { stagedVisible } from "./scope";
import type { PreviewSpec } from "./types";

export async function getText(slug: string, preview?: PreviewSpec) {
  const row = await getEntityRow("text", slug, preview);
  if (!row) return null;
  const db = await ready();
  const stored = (await db.select().from(textDetails).where(eq(textDetails.entityId, row.id)).get()) ?? null;
  const details = stored ? withPreview(stored, preview) : null;
  const [relations, excerpts, prose, media] = await Promise.all([
    getRelations(row.id),
    getExcerpts({ textId: row.id }),
    buildProse(row.id, [row.body, details?.context]),
    getMediaFor(row.id),
  ]);
  return {
    entity: toSummary(row),
    body: row.body,
    aliases: row.aliases,
    details,
    authors: pick(relations, "WROTE", "in", "thinker"),
    concepts: pick(relations, "DISCUSSES", "out"),
    responses: relations.filter((r) => r.type === "RESPONDED_TO" || r.family === "critique"),
    influences: relations.filter((r) => r.type === "INFLUENCED"),
    events: relations.filter((r) => r.kind === "event" && r.type !== "RESPONDED_TO"),
    paths: relations.filter((r) => r.kind === "path"),
    excerpts,
    prose,
    media,
  };
}

export type TextAggregate = NonNullable<Awaited<ReturnType<typeof getText>>>;

/** Catalogue listing with authors and bibliographic fields. */
export async function listTexts(opts: { form?: string; order?: "year" | "title"; limit?: number; offset?: number } = {}) {
  const db = await ready();
  const where = and(eq(entities.kind, "text"), isPublic(), opts.form ? eq(textDetails.form, opts.form) : undefined);
  const [rows, count, forms] = await Promise.all([
    db
      .select({ e: entities, d: textDetails })
      .from(entities)
      .innerJoin(textDetails, eq(textDetails.entityId, entities.id))
      .where(where)
      .orderBy(...(opts.order === "title" ? [asc(entities.title)] : [asc(entities.yearStart), asc(entities.title)]))
      .limit(opts.limit ?? 100)
      .offset(opts.offset ?? 0),
    db.select({ n: sql<number>`count(*)` }).from(entities).innerJoin(textDetails, eq(textDetails.entityId, entities.id)).where(where).get(),
    db.selectDistinct({ form: textDetails.form }).from(textDetails),
  ]);
  const ids = rows.map((r) => r.e.id);
  const authors = ids.length
    ? await db
        .select({ textId: relationships.toId, name: entities.title })
        .from(relationships)
        .innerJoin(entities, eq(entities.id, relationships.fromId))
        .where(and(eq(relationships.type, "WROTE"), inArray(relationships.toId, ids), isPublic(), stagedVisible(relationships.stagedFor)))
    : [];
  return {
    total: Number(count?.n ?? 0),
    forms: forms.map((f) => f.form).sort(),
    items: rows.map((r) => ({
      ...toSummary(r.e),
      form: r.d.form,
      difficulty: r.d.difficulty,
      authors: authors.filter((a) => a.textId === r.e.id).map((a) => a.name),
    })),
  };
}
