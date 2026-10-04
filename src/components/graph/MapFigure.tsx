import { layoutGraph } from "@/lib/graph/layout";
import type { Graph } from "@/lib/data/types";
import { TheoryMap } from "./TheoryMap";

/**
 * Server wrapper: computes landscape (desktop/tablet) and portrait (phone)
 * layouts, then hands coordinates to the interactive client map.
 */
export function MapFigure({
  graph,
  mode,
  focusId,
  title,
  caption,
  size = "large",
  showLegend = true,
  plate,
  heading,
}: {
  graph: Graph;
  mode: "chronological" | "radial";
  focusId?: string;
  title: string;
  caption?: string;
  size?: "large" | "medium";
  showLegend?: boolean;
  /** Frame the map as a numbered atlas plate. */
  plate?: string;
  heading?: string;
}) {
  if (!graph.nodes.length) return null;
  const landscape = layoutGraph(graph, {
    mode,
    focusId,
    orientation: "landscape",
    width: 1200,
    height: size === "large" ? 640 : 520,
  });
  const portrait = layoutGraph(graph, {
    mode,
    focusId,
    orientation: "portrait",
    width: 420,
    height: mode === "chronological" ? 820 : 560,
  });
  return <TheoryMap landscape={landscape} portrait={portrait} title={title} caption={caption} showLegend={showLegend} plate={plate} heading={heading} />;
}
