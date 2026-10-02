import "server-only";
import { and, asc, eq, inArray } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import {
  debateArguments,
  debateDetails,
  debatePositions,
  debatePropositions,
  positionLinks,
  positionStances,
} from "@/lib/db/schema";
import type { Stance } from "@/lib/content/model";
import { buildProse, getEntitiesByIds, getEntityRow, getMediaFor, getRelations, parseJsonArray, toSummary, uniqueById, withPreview } from "./core";
import { structureVisible } from "./scope";
import type { EntitySummary, PreviewSpec, StanceCell } from "./types";

export interface DebatePosition {
  id: string;
  label: string;
  holder: EntitySummary | null;
  centralClaim: string;
  summary: string;
  assumptions: string[];
  criticisms: string[];
  texts: EntitySummary[];
  concepts: EntitySummary[];
  other: EntitySummary[];
  /** propositionId → stance */
  stances: Record<string, StanceCell>;
}

export interface DebateArgument {
  id: string;
  kind: "argument" | "counterargument";
  body: string;
  positionId: string | null;
  respondsToId: string | null;
  replies: DebateArgument[];
}

export async function getDebate(slug: string, preview?: PreviewSpec) {
  const row = await getEntityRow("debate", slug, preview);
  if (!row) return null;
  const db = await ready();
  const [storedDetails, propositions, positions, args, relations, media] = await Promise.all([
    db.select().from(debateDetails).where(eq(debateDetails.entityId, row.id)).get(),
    db
      .select()
      .from(debatePropositions)
      .where(and(eq(debatePropositions.debateId, row.id), structureVisible(debatePropositions.stagedFor, debatePropositions.debateId)))
      .orderBy(asc(debatePropositions.position)),
    db
      .select()
      .from(debatePositions)
      .where(and(eq(debatePositions.debateId, row.id), structureVisible(debatePositions.stagedFor, debatePositions.debateId)))
      .orderBy(asc(debatePositions.position)),
    db
      .select()
      .from(debateArguments)
      .where(and(eq(debateArguments.debateId, row.id), structureVisible(debateArguments.stagedFor, debateArguments.debateId)))
      .orderBy(asc(debateArguments.position)),
    getRelations(row.id),
    getMediaFor(row.id),
  ]);
  const details = withPreview(storedDetails ?? { entityId: row.id, intro: "", context: "" }, preview);
  const prose = await buildProse(row.id, [row.body, details.context]);
  const positionIds = positions.map((p) => p.id);
  const [stances, links] = positionIds.length
    ? await Promise.all([
        db.select().from(positionStances).where(inArray(positionStances.positionId, positionIds)),
        db.select().from(positionLinks).where(inArray(positionLinks.positionId, positionIds)),
      ])
    : [[], []];

  const linked = await getEntitiesByIds([
    ...new Set([...links.map((l) => l.entityId), ...positions.map((p) => p.holderId).filter((x): x is string => !!x)]),
  ]);
  const byId = new Map(linked.map((e) => [e.id, e]));

  const outPositions: DebatePosition[] = positions.map((p) => {
    const ls = links.filter((l) => l.positionId === p.id).map((l) => byId.get(l.entityId)).filter((x): x is EntitySummary => !!x);
    return {
      id: p.id,
      label: p.label,
      holder: p.holderId ? byId.get(p.holderId) ?? null : null,
      centralClaim: p.centralClaim,
      summary: p.summary,
      assumptions: parseJsonArray(p.assumptions),
      criticisms: parseJsonArray(p.criticisms),
      texts: ls.filter((e) => e.kind === "text"),
      concepts: ls.filter((e) => e.kind === "concept"),
      other: ls.filter((e) => e.kind !== "text" && e.kind !== "concept"),
      stances: Object.fromEntries(
        stances.filter((s) => s.positionId === p.id).map((s) => [s.propositionId, { stance: s.stance as Stance, note: s.note }]),
      ),
    };
  });

  const nodes = new Map<string, DebateArgument>(
    args.map((a) => [
      a.id,
      { id: a.id, kind: a.kind as DebateArgument["kind"], body: a.body, positionId: a.positionId, respondsToId: a.respondsToId, replies: [] },
    ]),
  );
  const roots: DebateArgument[] = [];
  for (const a of nodes.values()) {
    const parent = a.respondsToId ? nodes.get(a.respondsToId) : undefined;
    if (parent) parent.replies.push(a);
    else roots.push(a);
  }

  return {
    entity: toSummary(row),
    intro: details.intro ?? "",
    context: details.context ?? "",
    body: row.body,
    propositions: propositions.map((p) => ({ id: p.id, statement: p.statement })),
    positions: outPositions,
    arguments: roots,
    texts: uniqueById(outPositions.flatMap((p) => p.texts)).sort((a, b) => (a.yearStart ?? 0) - (b.yearStart ?? 0)),
    concepts: uniqueById([...relations.filter((r) => r.kind === "concept"), ...outPositions.flatMap((p) => p.concepts)]),
    events: relations.filter((r) => r.kind === "event"),
    related: relations.filter((r) => r.kind === "debate"),
    prose,
    media,
  };
}

export type DebateAggregate = NonNullable<Awaited<ReturnType<typeof getDebate>>>;

/** Position labels per debate, for index and home views. */
export async function getDebatePositionLabels(debateIds: string[]): Promise<Record<string, string[]>> {
  if (!debateIds.length) return {};
  const db = await ready();
  const rows = await db
    .select({ debateId: debatePositions.debateId, label: debatePositions.label })
    .from(debatePositions)
    .where(and(inArray(debatePositions.debateId, debateIds), structureVisible(debatePositions.stagedFor, debatePositions.debateId)))
    .orderBy(asc(debatePositions.position));
  const out: Record<string, string[]> = {};
  for (const r of rows) (out[r.debateId] ??= []).push(r.label);
  return out;
}
