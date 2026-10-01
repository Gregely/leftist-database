/**
 * Server-side graph layout.
 *
 * Layouts are computed once on the server with d3-force and shipped as
 * coordinates, so the map renders immediately as SVG (no layout shift, no
 * physics on the client) and the client bundle carries no simulation code.
 *
 * Two modes:
 *   chronological — time runs along one axis (birth / start year), relations
 *                   pull nodes together on the other. "Theory as a landscape."
 *   radial        — a focus entity at the centre, its neighbourhood around it.
 */
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";
import type { Graph, GraphEdge, GraphNode } from "@/lib/data/types";

export interface LayoutNode extends GraphNode {
  x: number;
  y: number;
  r: number;
  /** Where the label sits relative to the node. */
  label: "right" | "left" | "below";
}

export interface Layout {
  nodes: LayoutNode[];
  edges: GraphEdge[];
  width: number;
  height: number;
  orientation: "landscape" | "portrait";
  mode: "chronological" | "radial";
  focusId?: string;
  /** Tick marks for the time axis (chronological mode). */
  axis: { year: number; at: number }[];
}

interface SimNode extends SimulationNodeDatum {
  id: string;
  target?: number;
  r: number;
}

export interface LayoutOptions {
  mode: "chronological" | "radial";
  orientation?: "landscape" | "portrait";
  width?: number;
  height?: number;
  focusId?: string;
  padding?: number;
}

function radius(n: GraphNode, focusId?: string) {
  if (n.id === focusId) return 11;
  return 4.5 + Math.min(n.degree, 8) * 0.75;
}

export function layoutGraph(graph: Graph, opts: LayoutOptions): Layout {
  const orientation = opts.orientation ?? "landscape";
  const width = opts.width ?? (orientation === "landscape" ? 1200 : 420);
  const height = opts.height ?? (orientation === "landscape" ? 640 : 760);
  const pad = opts.padding ?? (orientation === "landscape" ? 70 : 36);
  const chrono = opts.mode === "chronological";
  const horizontal = orientation === "landscape";

  const years = graph.nodes.map((n) => n.yearStart).filter((y): y is number => y != null);
  const minYear = years.length ? Math.floor((Math.min(...years) - 5) / 10) * 10 : 1800;
  const maxYear = years.length ? Math.ceil((Math.max(...years) + 5) / 10) * 10 : 2000;
  const span = Math.max(1, maxYear - minYear);
  const timeLength = horizontal ? width - pad * 2 : height - pad * 2;
  const timeAt = (year: number) => pad + ((year - minYear) / span) * timeLength;

  const nodes: SimNode[] = graph.nodes.map((n, i) => {
    const r = radius(n, opts.focusId);
    const t = chrono && n.yearStart != null ? timeAt(n.yearStart) : undefined;
    // Deterministic initial placement keeps layouts stable between builds.
    const angle = i * 2.399963;
    const dist = 30 + 12 * Math.sqrt(i);
    const node: SimNode = {
      id: n.id,
      r,
      target: t,
      x: width / 2 + Math.cos(angle) * dist,
      y: height / 2 + Math.sin(angle) * dist,
    };
    // In chronological mode time is a fixed coordinate: only the cross axis is free.
    if (t != null) {
      if (horizontal) node.x = node.fx = t;
      else node.y = node.fy = t;
    }
    if (!chrono && n.id === opts.focusId) {
      node.fx = width / 2;
      node.fy = height / 2;
    }
    return node;
  });

  const links: SimulationLinkDatum<SimNode>[] = graph.edges.map((e) => ({ source: e.source, target: e.target }));

  const sim = forceSimulation(nodes)
    .force(
      "link",
      forceLink<SimNode, SimulationLinkDatum<SimNode>>(links)
        .id((d) => d.id)
        .distance(chrono ? 80 : 120)
        .strength(chrono ? 0.12 : 0.35),
    )
    .force("charge", forceManyBody().strength(chrono ? -260 : -520))
    .force(
      "collide",
      forceCollide<SimNode>((d) => d.r + (chrono ? (horizontal ? 36 : 20) : 34)).strength(0.9),
    )
    .stop();

  if (chrono) {
    if (horizontal) {
      sim.force("x", forceX<SimNode>((d) => d.target ?? width / 2).strength((d) => (d.target != null ? 0.9 : 0.05)));
      sim.force("y", forceY<SimNode>(height / 2).strength(0.06));
    } else {
      sim.force("y", forceY<SimNode>((d) => d.target ?? height / 2).strength((d) => (d.target != null ? 0.9 : 0.05)));
      sim.force("x", forceX<SimNode>(width / 2).strength(0.08));
    }
  } else {
    sim.force("x", forceX<SimNode>(width / 2).strength(0.05));
    sim.force("y", forceY<SimNode>(height / 2).strength(horizontal ? 0.09 : 0.05));
  }

  for (let i = 0; i < 400; i++) sim.tick();

  // Fit the cross axis (and both axes in radial mode) into the frame.
  const fit = (values: number[], lo: number, hi: number, maxScale = 2.2) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const scale = Math.min(maxScale, (hi - lo) / range);
    const offset = lo + (hi - lo - range * scale) / 2;
    return (v: number) => offset + (v - min) * scale;
  };
  const xs = nodes.map((n) => n.x ?? 0);
  const ys = nodes.map((n) => n.y ?? 0);
  const labelRoom = horizontal ? 24 : 0;
  const fx = chrono && horizontal ? (v: number) => v : fit(xs, pad, width - pad - (horizontal ? 0 : 70));
  const fy = chrono && !horizontal ? (v: number) => v : fit(ys, pad - 10, height - pad - labelRoom);

  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const placed: LayoutNode[] = nodes.map((sn) => {
    const n = byId.get(sn.id)!;
    const x = Math.round(fx(sn.x ?? 0) * 10) / 10;
    const y = Math.round(fy(sn.y ?? 0) * 10) / 10;
    const label: LayoutNode["label"] = horizontal ? "below" : x > width - 140 ? "left" : "right";
    return { ...n, x, y, r: sn.r, label };
  });

  const axis: Layout["axis"] = [];
  if (chrono) {
    const step = span > 150 ? 25 : span > 80 ? 20 : 10;
    for (let y = Math.ceil(minYear / step) * step; y <= maxYear; y += step) axis.push({ year: y, at: timeAt(y) });
  }

  return {
    nodes: placed,
    edges: graph.edges,
    width,
    height,
    orientation,
    mode: opts.mode,
    focusId: opts.focusId,
    axis,
  };
}
