import "server-only";
import { and, asc, eq, inArray } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import { entities, pathDetails, pathSteps } from "@/lib/db/schema";
import { getEntitiesByIds, getEntityRow, getRelations, isPublic, toSummary } from "./core";
import { getConceptBriefs } from "./concepts";
import type { EntitySummary } from "./types";

export interface PathStep {
  id: string;
  position: number;
  framing: string;
  entity: EntitySummary;
  /** Plain-language brief for concept steps. */
  brief: string | null;
}

export async function getPath(slug: string) {
  const row = await getEntityRow("path", slug);
  if (!row) return null;
  const db = await ready();
  const [details, stepRows] = await Promise.all([
    db.select().from(pathDetails).where(eq(pathDetails.entityId, row.id)).get(),
    db.select().from(pathSteps).where(eq(pathSteps.pathId, row.id)).orderBy(asc(pathSteps.position)),
  ]);
  const ents = await getEntitiesByIds(stepRows.map((s) => s.entityId));
  const byId = new Map(ents.map((e) => [e.id, e]));
  const briefs = await getConceptBriefs(ents.filter((e) => e.kind === "concept").map((e) => e.id));
  const steps: PathStep[] = stepRows
    .filter((s) => byId.has(s.entityId))
    .map((s, i) => ({
      id: s.id,
      position: i + 1,
      framing: s.framing,
      entity: byId.get(s.entityId)!,
      brief: briefs[s.entityId] ?? null,
    }));
  return {
    entity: toSummary(row),
    entryLine: details?.entryLine ?? "",
    level: details?.level ?? "introductory",
    estimatedTime: details?.estimatedTime ?? null,
    steps,
  };
}

export type PathAggregate = NonNullable<Awaited<ReturnType<typeof getPath>>>;

/** Side paths from a step: related entries not already on the route. */
export async function getStepDetours(entityId: string, onPath: string[]) {
  const rel = await getRelations(entityId);
  const skip = new Set(onPath);
  return rel.filter((r) => !skip.has(r.id) && r.kind !== "path").slice(0, 6);
}

export async function listPaths() {
  const db = await ready();
  const rows = await db
    .select({ e: entities, d: pathDetails })
    .from(entities)
    .innerJoin(pathDetails, eq(pathDetails.entityId, entities.id))
    .where(and(eq(entities.kind, "path"), isPublic()))
    .orderBy(asc(entities.sortOrder));
  const ids = rows.map((r) => r.e.id);
  const steps = ids.length
    ? await db
        .select({ pathId: pathSteps.pathId, title: entities.title, kind: entities.kind })
        .from(pathSteps)
        .innerJoin(entities, eq(entities.id, pathSteps.entityId))
        .where(inArray(pathSteps.pathId, ids))
        .orderBy(asc(pathSteps.position))
    : [];
  return rows.map((r) => ({
    ...toSummary(r.e),
    entryLine: r.d.entryLine,
    level: r.d.level,
    estimatedTime: r.d.estimatedTime,
    steps: steps.filter((s) => s.pathId === r.e.id).map((s) => ({ title: s.title, kind: s.kind })),
  }));
}

export type PathListing = Awaited<ReturnType<typeof listPaths>>[number];
