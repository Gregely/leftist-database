import "server-only";
import { and, inArray, like, or, sql } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import { entities } from "@/lib/db/schema";
import { ENTITY_KINDS, type EntityKind } from "@/lib/content/model";
import { getRelations, isPublic, toSummary } from "./core";
import type { EntitySummary, RelatedEntity } from "./types";

export interface SearchHit extends EntitySummary {
  snippet: string;
  score: number;
}

export interface SearchResults {
  query: string;
  total: number;
  groups: { kind: EntityKind; hits: SearchHit[] }[];
  /** Entries connected to the best matches but not matched themselves. */
  related: RelatedEntity[];
}

/** Turn user input into a safe FTS5 query with prefix matching on each term. */
export function toFtsQuery(input: string): string | null {
  const terms = input
    .normalize("NFKC")
    .toLowerCase()
    .replace(/["'’]/g, " ")
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length > 0)
    .slice(0, 8);
  if (!terms.length) return null;
  return terms.map((t) => `"${t}"*`).join(" ");
}

export async function search(
  query: string,
  opts: { kinds?: EntityKind[]; limit?: number; related?: boolean } = {},
): Promise<SearchResults> {
  const q = query.trim();
  const empty: SearchResults = { query: q, total: 0, groups: [], related: [] };
  const fts = toFtsQuery(q);
  if (!fts) return empty;
  const db = await ready();
  const limit = opts.limit ?? 40;
  const kinds = opts.kinds?.length ? opts.kinds : [...ENTITY_KINDS];

  type Row = { id: string; score: number; snippet: string };
  let rows: Row[] = [];
  try {
    rows = (await db.all(sql`
      SELECT s.entity_id AS id,
             bm25(search_index, 0, 0, 12.0, 6.0, 1.0) AS score,
             snippet(search_index, 4, '⟦', '⟧', '…', 18) AS snippet
      FROM search_index s
      WHERE search_index MATCH ${fts}
      ORDER BY score
      LIMIT ${limit * 2}
    `)) as Row[];
  } catch {
    // Fall back to a simple substring search if the FTS query is rejected.
    const likeQ = `%${q.replace(/[%_]/g, "")}%`;
    const fallback = await db
      .select()
      .from(entities)
      .where(and(isPublic(), or(like(entities.title, likeQ), like(entities.summary, likeQ))))
      .limit(limit);
    rows = fallback.map((r, i) => ({ id: r.id, score: i, snippet: r.summary }));
  }
  if (!rows.length) return empty;

  const ents = await db
    .select()
    .from(entities)
    .where(and(inArray(entities.id, rows.map((r) => r.id)), inArray(entities.kind, kinds), isPublic()));
  const byId = new Map(ents.map((e) => [e.id, e]));
  const hits: SearchHit[] = rows
    .filter((r) => byId.has(r.id))
    .slice(0, limit)
    .map((r) => {
      const e = byId.get(r.id)!;
      // Exact title matches always lead.
      const exact = e.title.toLowerCase() === q.toLowerCase() ? -1000 : 0;
      return { ...toSummary(e), snippet: r.snippet, score: Number(r.score) + exact };
    })
    .sort((a, b) => a.score - b.score);

  const order = [...new Set(hits.map((h) => h.kind))];
  const groups = order.map((kind) => ({ kind, hits: hits.filter((h) => h.kind === kind) }));

  let related: RelatedEntity[] = [];
  if (opts.related !== false && hits.length) {
    const found = new Set(hits.map((h) => h.id));
    const rel = (await Promise.all(hits.slice(0, 2).map((h) => getRelations(h.id)))).flat();
    const seen = new Set<string>();
    related = rel
      .filter((r) => !found.has(r.id) && r.kind !== "path" && !seen.has(r.id) && (seen.add(r.id), true))
      .slice(0, 10);
  }
  return { query: q, total: hits.length, groups, related };
}

/** Lightweight lookup for pickers (admin, compare). */
export async function lookupEntities(q: string, kinds?: EntityKind[], limit = 12) {
  const res = await search(q, { kinds, limit, related: false });
  return res.groups.flatMap((g) => g.hits).map(({ id, kind, title, subtitle, href }) => ({ id, kind, title, subtitle, href }));
}
