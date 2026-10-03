import "server-only";
/**
 * Guided journeys: learning paths offered step by step, with a little
 * orientation copy at each stop (path_details.guided). A journey stores no
 * content of its own beyond that copy — every step points at an existing
 * entry, and the step page reads that entry's own fields, excerpts and
 * relationships through the same helpers as the public entry pages.
 */
import { and, asc, eq, inArray } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import {
  conceptDetails,
  debateDetails,
  entities,
  eventDetails,
  pathDetails,
  pathSteps,
  tendencyDetails,
  textDetails,
  thinkerDetails,
} from "@/lib/db/schema";
import type { EntityKind } from "@/lib/content/model";
import { buildProse, getEntitiesByIds, getEntityRow, getExcerpts, getRelations, isPublic, toSummary, withPreview } from "./core";
import { structureVisible } from "./scope";
import type { EntitySummary, ExcerptRecord, PreviewSpec, RelatedEntity } from "./types";

export interface GuidedStep {
  id: string;
  position: number;
  entity: EntitySummary;
  framing: string;
  orientation: string;
  whyItMatters: string;
  nextReason: string;
  excerptId: string | null;
  /** Optional side routes the editor attached to this stop. */
  branches: { id: string; track: "branch" | "alternative"; framing: string; entity: EntitySummary }[];
}

/** A journey, or null if the path does not exist, is not visible, or is not offered as Guided. */
export async function getGuidedJourney(slug: string, preview?: PreviewSpec) {
  const row = await getEntityRow("path", slug, preview);
  if (!row) return null;
  const db = await ready();
  const [stored, stepRows] = await Promise.all([
    db.select().from(pathDetails).where(eq(pathDetails.entityId, row.id)).get(),
    db
      .select()
      .from(pathSteps)
      .where(and(eq(pathSteps.pathId, row.id), structureVisible(pathSteps.stagedFor, pathSteps.pathId)))
      .orderBy(asc(pathSteps.position)),
  ]);
  const details = stored ? withPreview(stored, preview) : null;
  if (!details?.guided) return null;
  // Only entries visible to this reader become stops: a draft entry never leaks into a public journey.
  const byId = new Map((await getEntitiesByIds(stepRows.map((s) => s.entityId))).map((e) => [e.id, e]));
  const steps: GuidedStep[] = stepRows
    .filter((s) => s.track === "main" && byId.has(s.entityId))
    .map((s, i) => ({
      id: s.id,
      position: i + 1,
      entity: byId.get(s.entityId)!,
      framing: s.framing,
      orientation: s.orientation,
      whyItMatters: s.whyItMatters,
      nextReason: s.nextReason,
      excerptId: s.excerptId,
      branches: stepRows
        .filter((b) => b.parentStepId === s.id && b.track !== "main" && byId.has(b.entityId))
        .map((b) => ({ id: b.id, track: b.track as "branch" | "alternative", framing: b.framing, entity: byId.get(b.entityId)! })),
    }));
  const prose = await buildProse(row.id, [details.overview, details.prerequisites]);
  return {
    entity: toSummary(row),
    entryLine: details.entryLine,
    level: details.level,
    estimatedTime: details.estimatedTime,
    overview: details.overview,
    prerequisites: details.prerequisites,
    steps,
    prose,
  };
}

export type GuidedJourney = NonNullable<Awaited<ReturnType<typeof getGuidedJourney>>>;

/**
 * The progressive explanation for each kind of entry: which of its existing
 * fields serve as the short, medium and long reading. Nothing is copied.
 */
const LEVELS: Record<Exclude<EntityKind, "path">, { table: typeof conceptDetails | typeof thinkerDetails | typeof textDetails | typeof tendencyDetails | typeof debateDetails | typeof eventDetails; brief: string; standard: string; deep: string[]; labels: [string, string, string] }> = {
  concept: { table: conceptDetails, brief: "brief", standard: "standard", deep: ["deep"], labels: ["30 seconds", "5 minutes", "Deep dive"] },
  thinker: { table: thinkerDetails, brief: "summary", standard: "body", deep: ["context", "legacy"], labels: ["In brief", "Life and work", "Context and legacy"] },
  text: { table: textDetails, brief: "summary", standard: "body", deep: ["context"], labels: ["In brief", "About the text", "Context and reception"] },
  tendency: { table: tendencyDetails, brief: "summary", standard: "body", deep: ["context", "legacy"], labels: ["In brief", "The tradition", "Context and legacy"] },
  debate: { table: debateDetails, brief: "intro", standard: "body", deep: ["context"], labels: ["The question", "Background", "Historical context"] },
  event: { table: eventDetails, brief: "summary", standard: "body", deep: ["significance"], labels: ["In brief", "What happened", "Why it mattered"] },
};

export interface GuidedLevel {
  key: "brief" | "standard" | "deep";
  label: string;
  texts: string[];
}

/** Everything the step page shows beyond the journey itself, read from the step's entry. */
export async function getGuidedStepContent(journey: GuidedJourney, step: GuidedStep) {
  const db = await ready();
  const kind = step.entity.kind;
  const row = await db.select().from(entities).where(and(eq(entities.id, step.entity.id), isPublic())).get();
  const spec = kind === "path" ? null : LEVELS[kind];
  const details = row && spec ? (((await db.select().from(spec.table).where(eq(spec.table.entityId, row.id)).get()) ?? {}) as Record<string, unknown>) : {};
  const field = (name: string) => String((name in details ? details[name] : row ? (row as Record<string, unknown>)[name] : "") ?? "").trim();
  const levels: GuidedLevel[] = spec
    ? [
        { key: "brief", label: spec.labels[0], texts: [field(spec.brief) || step.entity.summary] },
        { key: "standard", label: spec.labels[1], texts: [field(spec.standard)] },
        { key: "deep", label: spec.labels[2], texts: spec.deep.map(field) },
      ]
    : [{ key: "brief", label: "In brief", texts: [step.entity.summary] }];
  for (const l of levels) l.texts = l.texts.filter(Boolean);

  const [excerpts, relations] = await Promise.all([getExcerpts({ entityId: step.entity.id }), getRelations(step.entity.id)]);
  const featured: ExcerptRecord | null = (step.excerptId && excerpts.find((x) => x.id === step.excerptId)) || excerpts.find((x) => x.body) || null;

  // The knowledge graph around this stop, split into what the journey will (or did) meet and what lies beyond it.
  const onJourney = new Map(journey.steps.map((s) => [s.entity.id, s.position]));
  const seen = new Set<string>();
  const along: (RelatedEntity & { stepPosition: number })[] = [];
  const beyond: RelatedEntity[] = [];
  for (const r of relations) {
    if (r.id === step.entity.id || r.kind === "path" || seen.has(r.id)) continue;
    seen.add(r.id);
    const pos = onJourney.get(r.id);
    if (pos) along.push({ ...r, stepPosition: pos });
    else beyond.push(r);
  }
  along.sort((a, b) => a.stepPosition - b.stepPosition);

  const prose = await buildProse(step.entity.id, [step.orientation, step.whyItMatters, step.nextReason, ...levels.flatMap((l) => l.texts)]);
  return { levels, featured, moreExcerpts: Math.max(0, excerpts.filter((x) => x.body).length - (featured ? 1 : 0)), along, beyond: beyond.slice(0, 8), prose };
}

export type GuidedStepContent = Awaited<ReturnType<typeof getGuidedStepContent>>;

/** Published Guided journeys, for the Guided landing page. */
export async function listGuidedJourneys() {
  const db = await ready();
  const rows = await db
    .select({ e: entities, d: pathDetails })
    .from(entities)
    .innerJoin(pathDetails, eq(pathDetails.entityId, entities.id))
    .where(and(eq(entities.kind, "path"), eq(pathDetails.guided, true), isPublic()))
    .orderBy(asc(entities.sortOrder), asc(entities.title));
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
    steps: steps.filter((s) => s.pathId === r.e.id).map((s) => ({ title: s.title, kind: s.kind as EntityKind })),
  }));
}

export type GuidedListing = Awaited<ReturnType<typeof listGuidedJourneys>>[number];

/** Is this path offered as a Guided journey? (Used to send /paths/<slug> readers to the Guided view.) */
export async function isGuidedPath(pathId: string) {
  const db = await ready();
  return !!(await db.select({ g: pathDetails.guided }).from(pathDetails).where(eq(pathDetails.entityId, pathId)).get())?.g;
}
