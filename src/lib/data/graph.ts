import "server-only";
import { and, eq, inArray, or } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import { entities, relationships, tendencyDetails } from "@/lib/db/schema";
import {
  entityHref,
  RELATIONSHIP_TYPES,
  type EntityKind,
  type RelationshipFamily,
  type RelationshipType,
} from "@/lib/content/model";
import { isPublic } from "./core";
import type { Graph, GraphEdge, GraphNode } from "./types";

const DEFAULT_FAMILIES: RelationshipFamily[] = ["influence", "critique", "response", "affinity"];

/** Tendency colour and name for each thinker, choosing the most specific tendency. */
async function tendencyFor(ids: string[]): Promise<Map<string, { color: string; group: string }>> {
  if (!ids.length) return new Map();
  const db = await ready();
  const rows = await db
    .select({ thinker: relationships.fromId, title: entities.title, sort: entities.sortOrder, color: tendencyDetails.color })
    .from(relationships)
    .innerJoin(entities, eq(entities.id, relationships.toId))
    .innerJoin(tendencyDetails, eq(tendencyDetails.entityId, entities.id))
    .where(and(eq(relationships.type, "MEMBER_OF"), inArray(relationships.fromId, ids)));
  const out = new Map<string, { color: string; group: string; sort: number }>();
  for (const r of rows) {
    const prev = out.get(r.thinker);
    if (!prev || r.sort > prev.sort) out.set(r.thinker, { color: r.color, group: r.title, sort: r.sort });
  }
  return out;
}

async function buildGraph(nodeIds: string[], families: RelationshipFamily[], includeIds: string[] = []): Promise<Graph> {
  if (!nodeIds.length) return { nodes: [], edges: [] };
  const db = await ready();
  const [rows, rels] = await Promise.all([
    db.select().from(entities).where(and(inArray(entities.id, nodeIds), includeIds.length ? or(isPublic(), inArray(entities.id, includeIds)) : isPublic())),
    db
      .select()
      .from(relationships)
      .where(and(inArray(relationships.fromId, nodeIds), inArray(relationships.toId, nodeIds))),
  ]);
  const present = new Set(rows.map((r) => r.id));
  const edges: GraphEdge[] = rels
    .filter((r) => present.has(r.fromId) && present.has(r.toId))
    .filter((r) => families.includes(RELATIONSHIP_TYPES[r.type as RelationshipType]?.family))
    .map((r) => {
      const type = r.type as RelationshipType;
      return {
        id: r.id,
        source: r.fromId,
        target: r.toId,
        type,
        family: RELATIONSHIP_TYPES[type].family,
        label: RELATIONSHIP_TYPES[type].label,
        note: r.note,
        weight: r.weight,
      };
    });
  const degree = new Map<string, number>();
  for (const e of edges) {
    degree.set(e.source, (degree.get(e.source) ?? 0) + 1);
    degree.set(e.target, (degree.get(e.target) ?? 0) + 1);
  }
  const tendencies = await tendencyFor(rows.filter((r) => r.kind === "thinker").map((r) => r.id));
  const nodes: GraphNode[] = rows.map((r) => ({
    id: r.id,
    kind: r.kind as EntityKind,
    title: r.title,
    subtitle: r.subtitle,
    summary: r.summary,
    href: entityHref(r.kind as EntityKind, r.slug),
    yearStart: r.yearStart,
    yearEnd: r.yearEnd,
    color: tendencies.get(r.id)?.color ?? null,
    group: tendencies.get(r.id)?.group ?? null,
    degree: degree.get(r.id) ?? 0,
  }));
  return { nodes, edges };
}

/** A whole-kind graph, e.g. every featured thinker and the relations among them. */
export async function getGraph(opts: {
  kinds: EntityKind[];
  featuredOnly?: boolean;
  families?: RelationshipFamily[];
  limit?: number;
}): Promise<Graph> {
  const db = await ready();
  const rows = await db
    .select({ id: entities.id })
    .from(entities)
    .where(
      and(inArray(entities.kind, opts.kinds), isPublic(), opts.featuredOnly ? eq(entities.featured, true) : undefined),
    )
    .orderBy(entities.sortOrder)
    .limit(opts.limit ?? 250);
  return buildGraph(
    rows.map((r) => r.id),
    opts.families ?? DEFAULT_FAMILIES,
  );
}

/**
 * The neighbourhood of an entity: everything within `depth` hops (restricted
 * to `kinds`), plus the relationships among those neighbours.
 */
export async function getNeighborhood(
  id: string,
  opts: { depth?: number; kinds?: EntityKind[]; families?: RelationshipFamily[]; limit?: number; includeIds?: string[] } = {},
): Promise<Graph> {
  const db = await ready();
  const depth = opts.depth ?? 1;
  const limit = opts.limit ?? 40;
  const families = opts.families ?? DEFAULT_FAMILIES;
  const allowedTypes = (Object.keys(RELATIONSHIP_TYPES) as RelationshipType[]).filter((t) =>
    families.includes(RELATIONSHIP_TYPES[t].family),
  );
  const seen = new Set([id]);
  let frontier = [id];
  for (let d = 0; d < depth && frontier.length && seen.size < limit; d++) {
    const rels = await db
      .select({ a: relationships.fromId, b: relationships.toId, w: relationships.weight })
      .from(relationships)
      .where(
        and(
          inArray(relationships.type, allowedTypes),
          or(inArray(relationships.fromId, frontier), inArray(relationships.toId, frontier)),
        ),
      );
    const candidates = rels
      .sort((x, y) => y.w - x.w)
      .flatMap((r) => [r.a, r.b])
      .filter((x) => !seen.has(x));
    let allowed = [...new Set(candidates)];
    if (opts.kinds?.length && allowed.length) {
      const kinds = await db
        .select({ id: entities.id })
        .from(entities)
        .where(and(inArray(entities.id, allowed), inArray(entities.kind, opts.kinds), isPublic()));
      const ok = new Set(kinds.map((k) => k.id));
      allowed = allowed.filter((x) => ok.has(x));
    }
    frontier = [];
    for (const x of allowed) {
      if (seen.size >= limit) break;
      seen.add(x);
      frontier.push(x);
    }
  }
  return buildGraph([...seen], families, opts.includeIds);
}
