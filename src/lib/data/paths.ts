import "server-only";
import { and, asc, eq, inArray } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import { entities, pathDetails, pathSteps } from "@/lib/db/schema";
import { buildProse, getEntitiesByIds, getEntityRow, getRelations, isPublic, toSummary, withPreview } from "./core";
import { getConceptBriefs } from "./concepts";
import { structureVisible } from "./scope";
import type { EntitySummary, PreviewSpec } from "./types";

export interface PathStep {
  id: string;
  position: number;
  framing: string;
  entity: EntitySummary;
  /** Plain-language brief for concept steps. */
  brief: string | null;
  /** Branches and alternatives leaving from this stop. */
  branches: { id: string; track: "branch" | "alternative"; framing: string; entity: EntitySummary }[];
}

export async function getPath(slug: string, preview?: PreviewSpec) {
  const row = await getEntityRow("path", slug, preview);
  if (!row) return null;
  const db = await ready();
  const [storedDetails, stepRows] = await Promise.all([
    db.select().from(pathDetails).where(eq(pathDetails.entityId, row.id)).get(),
    db
      .select()
      .from(pathSteps)
      .where(and(eq(pathSteps.pathId, row.id), structureVisible(pathSteps.stagedFor, pathSteps.pathId)))
      .orderBy(asc(pathSteps.position)),
  ]);
  const details = storedDetails ? withPreview(storedDetails, preview) : null;
  const ents = await getEntitiesByIds(stepRows.map((s) => s.entityId));
  const byId = new Map(ents.map((e) => [e.id, e]));
  const briefs = await getConceptBriefs(ents.filter((e) => e.kind === "concept").map((e) => e.id));
  const steps: PathStep[] = stepRows
    .filter((s) => s.track === "main" && byId.has(s.entityId))
    .map((s, i) => ({
      id: s.id,
      position: i + 1,
      framing: s.framing,
      entity: byId.get(s.entityId)!,
      brief: briefs[s.entityId] ?? null,
      branches: stepRows
        .filter((b) => b.parentStepId === s.id && b.track !== "main" && byId.has(b.entityId))
        .map((b) => ({ id: b.id, track: b.track as "branch" | "alternative", framing: b.framing, entity: byId.get(b.entityId)! })),
    }));
  const prose = await buildProse(row.id, [details?.prerequisites]);
  return {
    entity: toSummary(row),
    entryLine: details?.entryLine ?? "",
    level: details?.level ?? "introductory",
    estimatedTime: details?.estimatedTime ?? null,
    prerequisites: details?.prerequisites ?? "",
    steps,
    prose,
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
        .where(and(inArray(pathSteps.pathId, ids), eq(pathSteps.track, "main"), isPublic(), structureVisible(pathSteps.stagedFor, pathSteps.pathId)))
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
