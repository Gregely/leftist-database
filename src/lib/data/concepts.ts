import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import { conceptDetails, entities } from "@/lib/db/schema";
import { buildProse, getEntityRow, getExcerpts, getMediaFor, getRelations, isPublic, pick, toSummary, uniqueById, withPreview } from "./core";
import type { PreviewSpec } from "./types";
import { getNeighborhood } from "./graph";

export async function getConcept(slug: string, preview?: PreviewSpec) {
  const row = await getEntityRow("concept", slug, preview);
  if (!row) return null;
  const db = await ready();
  const details = withPreview(
    (await db.select().from(conceptDetails).where(eq(conceptDetails.entityId, row.id)).get()) ?? {
      brief: "",
      standard: "",
      deep: "",
      history: "",
      interpretations: "",
      criticisms: "",
    },
    preview,
  );
  const [relations, excerpts, constellation, prose, media] = await Promise.all([
    getRelations(row.id),
    getExcerpts({ entityId: row.id }),
    getNeighborhood(row.id, { depth: 2, kinds: ["concept"], limit: 16, includeIds: preview ? [row.id] : [] }),
    buildProse(row.id, [details.brief, details.standard, details.deep, details.history, details.interpretations, details.criticisms, row.body]),
    getMediaFor(row.id),
  ]);

  const thinkers = relations.filter((r) => r.kind === "thinker");
  const interpretations = thinkers.filter((r) => r.note || r.family === "critique");
  return {
    entity: toSummary(row),
    aliases: row.aliases,
    details,
    thinkers,
    interpretations,
    texts: pick(relations, "DISCUSSES", "in", "text"),
    debates: relations.filter((r) => r.kind === "debate"),
    related: getRelatedConceptsFrom(relations),
    paths: relations.filter((r) => r.kind === "path"),
    excerpts,
    constellation,
    prose,
    media,
  };
}

function getRelatedConceptsFrom(relations: Awaited<ReturnType<typeof getRelations>>) {
  return uniqueById(relations.filter((r) => r.kind === "concept"));
}

export async function getRelatedConcepts(conceptId: string) {
  return getRelatedConceptsFrom(await getRelations(conceptId, { kinds: ["concept"] }));
}

export type ConceptAggregate = NonNullable<Awaited<ReturnType<typeof getConcept>>>;

/** Concept briefs for a set of concept ids (used by paths, home and previews). */
export async function getConceptBriefs(ids: string[]): Promise<Record<string, string>> {
  if (!ids.length) return {};
  const db = await ready();
  const rows = await db
    .select({ id: conceptDetails.entityId, brief: conceptDetails.brief })
    .from(conceptDetails)
    .innerJoin(entities, eq(entities.id, conceptDetails.entityId))
    .where(and(inArray(conceptDetails.entityId, ids), isPublic()));
  return Object.fromEntries(rows.map((r) => [r.id, r.brief]));
}
