import "server-only";
import { countByKind, getArchiveStats, listEntities } from "./core";
import { getConceptBriefs, getRelatedConcepts } from "./concepts";
import { getDebatePositionLabels } from "./debates";
import { getTimeline } from "./events";
import { getGraph } from "./graph";
import { listPaths } from "./paths";

export async function getHomeData() {
  const [stats, counts, concepts, debates, thinkers, tendencies, texts, markers, graph, paths] = await Promise.all([
    getArchiveStats(),
    countByKind(),
    listEntities({ kind: "concept", featured: true, limit: 7 }),
    listEntities({ kind: "debate", featured: true, limit: 5 }),
    listEntities({ kind: "thinker", featured: true, limit: 6, order: "year" }),
    listEntities({ kind: "tendency", limit: 5 }),
    listEntities({ kind: "text", featured: true, limit: 5, order: "year" }),
    getTimeline({ lanes: ["event"], featuredOnly: true }),
    getGraph({ kinds: ["thinker"], featuredOnly: true }),
    listPaths(),
  ]);
  const conceptIds = concepts.items.map((c) => c.id);
  const [briefs, positions, leadRelated] = await Promise.all([
    getConceptBriefs(conceptIds),
    getDebatePositionLabels(debates.items.map((d) => d.id)),
    conceptIds[0] ? getRelatedConcepts(conceptIds[0]) : Promise.resolve([]),
  ]);
  return {
    stats,
    counts,
    concepts: concepts.items.map((c) => ({ ...c, brief: briefs[c.id] ?? "" })),
    leadRelated: leadRelated.slice(0, 6),
    debates: debates.items.map((d) => ({ ...d, positions: positions[d.id] ?? [] })),
    thinkers: thinkers.items,
    tendencies: tendencies.items,
    texts: texts.items,
    markers,
    graph,
    paths,
  };
}
