import "server-only";
/**
 * Editorial collections: internal labels on entries (`entities.editorial_tags`)
 * such as "Initial Marx Corpus". They group work for review and preview and
 * are never shown on the public site.
 */
import { eq, sql } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { audit } from "./audit";
import { gateOf, requireEntity } from "./content";
import { assertCan, type Actor } from "./permissions";

export function parseTags(json: string | null | undefined): string[] {
  try {
    const v = JSON.parse(json ?? "[]");
    return Array.isArray(v) ? v.map(String).filter(Boolean) : [];
  } catch {
    return [];
  }
}

/** SQL condition: the entry carries `tag`. */
export const hasTag = (tag: string) => sql`EXISTS (SELECT 1 FROM json_each(${s.entities.editorialTags}) WHERE json_each.value = ${tag})`;

export async function idsInCollection(tag: string): Promise<string[]> {
  const db = await ready();
  return (await db.select({ id: s.entities.id }).from(s.entities).where(hasTag(tag))).map((r) => r.id);
}

/** The collections a path's stops belong to (staged and released steps), so a preview of the path can include them. */
export async function stepCollections(pathId: string): Promise<string[]> {
  const db = await ready();
  const rows = await db
    .select({ tags: s.entities.editorialTags })
    .from(s.pathSteps)
    .innerJoin(s.entities, eq(s.entities.id, s.pathSteps.entityId))
    .where(eq(s.pathSteps.pathId, pathId));
  return [...new Set(rows.flatMap((r) => parseTags(r.tags)))].sort();
}

export async function listCollections(): Promise<{ tag: string; count: number }[]> {
  const db = await ready();
  const rows = (await db.all(sql`SELECT j.value AS tag, count(*) AS n FROM entities, json_each(entities.editorial_tags) j GROUP BY j.value ORDER BY j.value`)) as {
    tag: string;
    n: number;
  }[];
  return rows.map((r) => ({ tag: r.tag, count: Number(r.n) }));
}

/** Replace an entry's collection labels (editors; recorded in the audit log). */
export async function setTags(actor: Actor, entityId: string, tags: string[]) {
  const row = await requireEntity(entityId);
  assertCan(actor, "entity.edit", gateOf(row));
  const clean = [...new Set(tags.map((t) => t.trim()).filter(Boolean))].sort();
  const db = await ready();
  await db.update(s.entities).set({ editorialTags: JSON.stringify(clean) }).where(eq(s.entities.id, entityId));
  await audit(actor.id, "tags_set", { type: "entity", id: entityId, label: row.title }, { tags: clean });
}
