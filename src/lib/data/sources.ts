import "server-only";
import { and, asc, eq, sql } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import { citations, entities, excerpts, relationships, sources } from "@/lib/db/schema";
import type { SourceType } from "@/lib/content/model";
import { isPublic, toSource, toSummary } from "./core";

export async function listSources(opts: { type?: SourceType } = {}) {
  const db = await ready();
  const rows = await db
    .select({
      s: sources,
      cited: sql<number>`(SELECT count(*) FROM ${citations} WHERE ${citations.sourceId} = ${sources.id})
        + (SELECT count(*) FROM ${excerpts} WHERE ${excerpts.sourceId} = ${sources.id})
        + (SELECT count(*) FROM ${relationships} WHERE ${relationships.sourceId} = ${sources.id})`,
    })
    .from(sources)
    .where(opts.type ? eq(sources.sourceType, opts.type) : undefined)
    .orderBy(asc(sources.author), asc(sources.title));
  return rows.map((r) => ({ ...toSource(r.s), cited: Number(r.cited) }));
}

export async function getSource(id: string) {
  const db = await ready();
  const row = await db.select().from(sources).where(eq(sources.id, id)).get();
  if (!row) return null;
  const [cites, quoted] = await Promise.all([
    db
      .select({ c: citations, e: entities })
      .from(citations)
      .innerJoin(entities, eq(entities.id, citations.entityId))
      .where(and(eq(citations.sourceId, id), isPublic())),
    db
      .select({ x: excerpts, e: entities })
      .from(excerpts)
      .innerJoin(entities, eq(entities.id, excerpts.entityId))
      .where(and(eq(excerpts.sourceId, id), isPublic())),
  ]);
  return {
    source: toSource(row),
    citedBy: cites.map((r) => ({ entity: toSummary(r.e), locator: r.c.locator, field: r.c.field, note: r.c.note })),
    excerpts: quoted.map((r) => ({ entity: toSummary(r.e), body: r.x.body, locator: r.x.locator })),
  };
}
