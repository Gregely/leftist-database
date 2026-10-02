/**
 * Maintenance of the FTS5 `search_index` table.
 *
 * Each entity contributes one row: its title, its aliases, and a body built
 * from every human-readable field (summary, long-form text, kind-specific
 * fields). Call `indexEntity` after any write that touches an entity.
 */
import { sql } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { stripMarkup } from "@/lib/content/markup";
import type * as schema from "./schema";

type Db = LibSQLDatabase<typeof schema>;

interface Row {
  id: string;
  kind: string;
  title: string;
  subtitle: string | null;
  summary: string;
  body: string;
  aliases: string;
  extra: string | null;
}

const SELECT_DOCUMENTS = sql`
  SELECT e.id, e.kind, e.title, e.subtitle, e.summary, e.body, e.aliases,
    COALESCE(
      (SELECT roles || ' ' || COALESCE(birth_place,'') || ' ' || legacy FROM thinker_details WHERE entity_id = e.id),
      (SELECT brief || ' ' || standard || ' ' || deep FROM concept_details WHERE entity_id = e.id),
      (SELECT COALESCE(original_title,'') || ' ' || COALESCE(publication_note,'') || ' ' || form FROM text_details WHERE entity_id = e.id),
      (SELECT COALESCE(period_label,'') FROM tendency_details WHERE entity_id = e.id),
      (SELECT intro || ' ' || COALESCE((SELECT group_concat(label || ' ' || central_claim || ' ' || summary, ' ') FROM debate_positions WHERE debate_id = e.id AND staged_for IS NULL), '') FROM debate_details WHERE entity_id = e.id),
      (SELECT COALESCE(date_label,'') || ' ' || COALESCE(place,'') || ' ' || event_type FROM event_details WHERE entity_id = e.id),
      (SELECT entry_line || ' ' || level FROM path_details WHERE entity_id = e.id)
    ) AS extra
  FROM entities e`;

function toDocument(r: Row) {
  let aliases: string[] = [];
  try {
    aliases = JSON.parse(r.aliases);
  } catch {
    /* ignore malformed alias JSON */
  }
  return {
    id: r.id,
    kind: r.kind,
    title: r.title,
    aliases: aliases.join(" · "),
    body: stripMarkup([r.subtitle, r.summary, r.body, r.extra].filter(Boolean).join(" ")),
  };
}

export async function indexEntity(db: Db, id: string): Promise<void> {
  await db.run(sql`DELETE FROM search_index WHERE entity_id = ${id}`);
  // Only public entries are indexed; drafts and withdrawn entries never enter the public search index.
  const rows = (await db.all(sql`${SELECT_DOCUMENTS} WHERE e.id = ${id} AND e.live = 1`)) as Row[];
  for (const r of rows) {
    const d = toDocument(r);
    await db.run(
      sql`INSERT INTO search_index (entity_id, kind, title, aliases, body) VALUES (${d.id}, ${d.kind}, ${d.title}, ${d.aliases}, ${d.body})`,
    );
  }
}

export async function removeFromIndex(db: Db, id: string): Promise<void> {
  await db.run(sql`DELETE FROM search_index WHERE entity_id = ${id}`);
}

export async function rebuildSearchIndex(db: Db): Promise<number> {
  await db.run(sql`DELETE FROM search_index`);
  const rows = (await db.all(sql`${SELECT_DOCUMENTS} WHERE e.live = 1`)) as Row[];
  for (const r of rows) {
    const d = toDocument(r);
    await db.run(
      sql`INSERT INTO search_index (entity_id, kind, title, aliases, body) VALUES (${d.id}, ${d.kind}, ${d.title}, ${d.aliases}, ${d.body})`,
    );
  }
  return rows.length;
}
