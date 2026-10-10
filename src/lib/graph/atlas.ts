/**
 * The Theory Map's data and layout, computed once on the server.
 *
 * Every public entry of the mapped kinds is placed in two stable
 * arrangements (by time and by connection), so filters, views and zoom only
 * change what is shown, never where things are. The client decides what to
 * show at each zoom level from the importance rank computed here.
 *
 * Time: thinkers sit at the height of their working lives (about thirty-five),
 * texts and events at their date, tendencies at their emergence. Concepts and
 * debates without a date sit at the median date of the entries they connect
 * to. The axis is stretched where the record is dense, so the decades that
 * hold most of the collection get most of the room; the years marked on it
 * stay exact.
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
import type { EntityKind, RelationshipFamily, RelationshipType } from "@/lib/content/model";
import type { Graph } from "@/lib/data/types";

export type Arrangement = "time" | "links";

export interface AtlasNode {
  id: string;
  /** `kind:slug`, the stable public address used in map URLs. */
  key: string;
  kind: EntityKind;
  title: string;
  summary: string;
  href: string;
  yearStart: number | null;
  yearEnd: number | null;
  /** The thinker's tendency, if any. */
  group: string | null;
  /** Placement year on the time axis. */
  year: number;
  /** Whether `year` comes from the record (false: derived from connections). */
  dated: boolean;
  /** The years in which the entry was active, for narrowing by period. */
  span: [number, number];
  /** 0–1, the most connected and editorially central entries highest. */
  importance: number;
  degree: number;
  /** World coordinates in each arrangement. */
  at: Record<Arrangement, [number, number]>;
}

export interface AtlasEdge {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  family: RelationshipFamily;
  weight: number;
  note: string;
}

export interface AtlasView {
  id: string;
  label: string;
  note: string;
  /** Node ids the view grows from. */
  anchors: string[];
  /** How many steps out from the anchors the view reaches. */
  depth: number;
  kinds: EntityKind[];
  from?: number;
  to?: number;
  /** Node id to select when the view opens. */
  select?: string;
}

export interface AtlasData {
  nodes: AtlasNode[];
  edges: AtlasEdge[];
  views: AtlasView[];
  extent: Record<Arrangement, { width: number; height: number }>;
  /** First and last year of the time axis. */
  years: [number, number];
  /** x position of every year on the time axis, from `years[0]`. */
  timeX: number[];
}

/** Curated starting points, defined by real entries; a view whose first anchor is not public is left out. */
const VIEW_DEFS: (Omit<AtlasView, "anchors" | "select"> & { anchors: string[]; select?: string })[] = [
  {
    id: "marx",
    label: "Marx and his influences",
    note: "Marx's sources, allies and adversaries, and the ideas he developed: one step out from his entry.",
    anchors: ["thinker:marx"],
    depth: 1,
    kinds: ["thinker", "concept", "tendency", "text"],
    select: "thinker:marx",
  },
  {
    id: "before-marx",
    label: "Before Marx",
    note: "Hegel, the political economists and the early socialists, to 1850.",
    anchors: ["thinker:hegel", "tendency:classical-political-economy", "tendency:early-socialism"],
    depth: 1,
    kinds: ["thinker", "tendency", "concept", "text"],
    to: 1850,
  },
  {
    id: "second-international",
    label: "The Second International",
    note: "The mass parties of 1889–1914 and their arguments over reform, revolution and war.",
    anchors: ["event:second-international"],
    depth: 2,
    kinds: ["thinker", "tendency", "event", "text"],
    from: 1880,
    to: 1917,
    select: "event:second-international",
  },
  {
    id: "revolutionary-marxism",
    label: "Revolutionary Marxism to 1917",
    note: "Lenin, Luxemburg and Trotsky, their texts and their critics, from the 1890s to October.",
    anchors: ["thinker:lenin", "thinker:luxemburg", "thinker:trotsky"],
    depth: 1,
    kinds: ["thinker", "text", "concept", "event"],
    from: 1880,
    to: 1917,
    select: "thinker:lenin",
  },
  {
    id: "anarchism",
    label: "Anarchism and Marxism",
    note: "Proudhon, Bakunin and Kropotkin, and where they met and broke with the Marxists.",
    anchors: ["tendency:anarchism", "thinker:proudhon", "thinker:bakunin", "thinker:kropotkin"],
    depth: 1,
    kinds: ["thinker", "tendency", "concept", "text", "event"],
    select: "tendency:anarchism",
  },
];

/** Horizontal bands for the time arrangement: context above, people in the middle, ideas below. */
const LANE: Record<EntityKind, number> = {
  event: 0.04,
  tendency: 0.2,
  thinker: 0.4,
  text: 0.6,
  concept: 0.8,
  debate: 0.96,
  path: 0.5,
};

const FAMILY_WEIGHT: Record<RelationshipFamily, number> = { influence: 1.25, critique: 1.15, response: 1, affinity: 0.8, structure: 0.5 };
const KIND_WEIGHT: Partial<Record<EntityKind, number>> = { thinker: 1.25, tendency: 1.1, concept: 1, text: 0.85, event: 0.85, debate: 0.9 };

const TIME_WIDTH = 2800;
const TIME_HEIGHT = 2300;
const LINKS_SIZE = 2000;

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : null;
};

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).replace(/\s+\S*$/, "")}…` : s);

interface Sim extends SimulationNodeDatum {
  id: string;
  r: number;
  lane: number;
  tx?: number;
}

/** The last layout, reused while the graph is unchanged (it changes only when entries or relations are published). */
let cached: { key: string; data: AtlasData } | null = null;

export function buildAtlas(graph: Graph): AtlasData {
  const key = JSON.stringify([graph.nodes.map((n) => [n.id, n.title, n.summary, n.href, n.yearStart, n.yearEnd, n.group, n.featured]), graph.edges.map((e) => [e.id, e.source, e.target, e.type, e.weight, e.note])]);
  if (cached?.key === key) return cached.data;
  const data = layoutAtlas(graph);
  cached = { key, data };
  return data;
}

function layoutAtlas(graph: Graph): AtlasData {
  const ids = new Set(graph.nodes.map((n) => n.id));
  const edges: AtlasEdge[] = graph.edges
    .filter((e) => ids.has(e.source) && ids.has(e.target) && e.source !== e.target)
    .map((e) => ({ id: e.id, source: e.source, target: e.target, type: e.type, family: e.family, weight: e.weight, note: clip(e.note ?? "", 200) }));
  const adj = new Map<string, string[]>();
  for (const e of edges) {
    adj.set(e.source, [...(adj.get(e.source) ?? []), e.target]);
    adj.set(e.target, [...(adj.get(e.target) ?? []), e.source]);
  }

  // Placement years: dated entries first, then undated ones from their dated neighbours (two passes, so a concept
  // linked only to other concepts still finds a date).
  const year = new Map<string, number>();
  for (const n of graph.nodes) {
    if (n.yearStart == null) continue;
    year.set(n.id, n.kind === "thinker" ? Math.min(n.yearStart + 35, n.yearEnd ?? Infinity) : n.yearStart);
  }
  const dated = new Set(year.keys());
  for (let pass = 0; pass < 2; pass++) {
    for (const n of graph.nodes) {
      if (dated.has(n.id)) continue;
      const m = median((adj.get(n.id) ?? []).map((x) => year.get(x)).filter((y): y is number => y != null));
      if (m != null) year.set(n.id, m);
    }
  }
  const known = [...year.values()];
  const fallback = median(known) ?? 1880;
  for (const n of graph.nodes) if (!year.has(n.id)) year.set(n.id, fallback);

  const allYears = [...year.values()];
  const y0 = Math.floor((Math.min(...allYears) - 8) / 10) * 10;
  const y1 = Math.ceil((Math.max(...allYears) + 8) / 10) * 10;

  // Time warp: a blend of linear time and the distribution of entries, so dense decades get more room.
  const counts = new Array(y1 - y0 + 1).fill(0.35);
  for (const y of allYears) counts[Math.round(y) - y0] += 1;
  // Smooth over a decade either side.
  const smooth = counts.map((_, i) => {
    let s = 0;
    let w = 0;
    for (let d = -10; d <= 10; d++) {
      const c = counts[i + d];
      if (c == null) continue;
      const k = 1 - Math.abs(d) / 11;
      s += c * k;
      w += k;
    }
    return s / w;
  });
  const cdf: number[] = [];
  let acc = 0;
  for (const c of smooth) cdf.push((acc += c));
  const total = acc;
  const margin = 80;
  const inner = TIME_WIDTH - margin * 2;
  const timeX = cdf.map((c, i) => Math.round((margin + inner * (0.4 * (i / (cdf.length - 1)) + 0.6 * (c / total))) * 10) / 10);
  const xOf = (y: number) => {
    const i = Math.max(0, Math.min(timeX.length - 1, y - y0));
    const lo = Math.floor(i);
    const hi = Math.min(timeX.length - 1, lo + 1);
    return timeX[lo] + (timeX[hi] - timeX[lo]) * (i - lo);
  };

  // Importance: weighted connections, editorial emphasis, and a preference for people and traditions.
  const raw = new Map<string, number>();
  for (const e of edges) {
    const w = e.weight * FAMILY_WEIGHT[e.family];
    raw.set(e.source, (raw.get(e.source) ?? 0) + w);
    raw.set(e.target, (raw.get(e.target) ?? 0) + w);
  }
  const score = new Map(graph.nodes.map((n) => [n.id, ((raw.get(n.id) ?? 0) + (n.featured ? 6 : 0)) * (KIND_WEIGHT[n.kind] ?? 1)]));
  const maxScore = Math.max(1, ...score.values());
  const importance = new Map([...score].map(([id, s]) => [id, Math.sqrt(s / maxScore)]));

  const radius = (id: string) => 9 + 16 * (importance.get(id) ?? 0);
  // Fewer iterations for large graphs: the layouts settle well before the default count.
  const ticks = Math.round(Math.max(150, Math.min(300, 60000 / Math.max(1, graph.nodes.length))));

  /* By time ------------------------------------------------------------- */
  const timeNodes: Sim[] = graph.nodes.map((n, i) => {
    const x = xOf(year.get(n.id)!);
    const lane = LANE[n.kind] * TIME_HEIGHT;
    return { id: n.id, r: radius(n.id), lane, x, fx: x, y: lane + ((i * 97) % 120) - 60 };
  });
  const links = edges.map((e) => ({ source: e.source, target: e.target, weight: e.weight }));
  const timeSim = forceSimulation(timeNodes)
    .force(
      "link",
      forceLink<Sim, SimulationLinkDatum<Sim> & { weight: number }>(links.map((l) => ({ ...l })))
        .id((d) => d.id)
        .distance(70)
        .strength((l) => 0.03 * l.weight),
    )
    .force("charge", forceManyBody<Sim>().strength(-70).distanceMax(260))
    .force("collide", forceCollide<Sim>((d) => d.r + 6).strength(1))
    .force("lane", forceY<Sim>((d) => d.lane).strength(0.12))
    .stop();
  for (let i = 0; i < ticks; i++) timeSim.tick();
  const ty = timeNodes.map((n) => n.y ?? 0);
  const tMin = Math.min(...ty);
  const tMax = Math.max(...ty);
  const timeHeight = Math.round(tMax - tMin + 160);

  /* By connection ------------------------------------------------------- */
  const linkNodes: Sim[] = graph.nodes.map((n, i) => {
    const a = i * 2.399963;
    const d = 40 + 22 * Math.sqrt(i);
    return { id: n.id, r: radius(n.id), lane: 0, x: LINKS_SIZE / 2 + Math.cos(a) * d, y: LINKS_SIZE / 2 + Math.sin(a) * d };
  });
  const linkSim = forceSimulation(linkNodes)
    .force(
      "link",
      forceLink<Sim, SimulationLinkDatum<Sim> & { weight: number }>(links.map((l) => ({ ...l })))
        .id((d) => d.id)
        .distance((l) => 110 - l.weight * 15)
        .strength((l) => 0.12 + l.weight * 0.08),
    )
    .force("charge", forceManyBody<Sim>().strength(-240).distanceMax(700))
    .force("collide", forceCollide<Sim>((d) => d.r + 10).strength(1))
    .force("x", forceX<Sim>(LINKS_SIZE / 2).strength(0.045))
    .force("y", forceY<Sim>(LINKS_SIZE / 2).strength(0.045))
    .stop();
  for (let i = 0; i < ticks; i++) linkSim.tick();
  const lx = linkNodes.map((n) => n.x ?? 0);
  const ly = linkNodes.map((n) => n.y ?? 0);
  const [lxMin, lyMin] = [Math.min(...lx), Math.min(...ly)];
  const linksExtent = { width: Math.round(Math.max(...lx) - lxMin + 160), height: Math.round(Math.max(...ly) - lyMin + 160) };

  const round = (v: number) => Math.round(v * 10) / 10;
  const span = (n: Graph["nodes"][number]): [number, number] => {
    if (n.kind === "thinker" && n.yearStart != null) return [n.yearStart + 18, n.yearEnd ?? n.yearStart + 75];
    if (n.yearStart != null) return [n.yearStart, n.yearEnd ?? (n.kind === "tendency" ? y1 : n.yearStart)];
    const y = year.get(n.id)!;
    return [y, y];
  };

  const nodes: AtlasNode[] = graph.nodes.map((n, i) => ({
    id: n.id,
    key: `${n.kind}:${n.slug ?? n.id}`,
    kind: n.kind,
    title: n.title,
    summary: clip(n.summary ?? "", 260),
    href: n.href,
    yearStart: n.yearStart,
    yearEnd: n.yearEnd,
    group: n.group,
    year: Math.round(year.get(n.id)!),
    dated: dated.has(n.id),
    span: span(n),
    importance: Math.round((importance.get(n.id) ?? 0) * 1000) / 1000,
    degree: (adj.get(n.id) ?? []).length,
    at: {
      time: [round(timeNodes[i].x ?? 0), round((timeNodes[i].y ?? 0) - tMin + 80)],
      links: [round((linkNodes[i].x ?? 0) - lxMin + 80), round((linkNodes[i].y ?? 0) - lyMin + 80)],
    },
  }));

  const byKey = new Map(nodes.map((n) => [n.key, n.id]));
  const views: AtlasView[] = VIEW_DEFS.flatMap((v) => {
    const anchors = v.anchors.map((k) => byKey.get(k)).filter((x): x is string => !!x);
    if (!byKey.has(v.anchors[0])) return [];
    return [{ ...v, anchors, select: v.select ? byKey.get(v.select) : undefined }];
  });

  return {
    nodes,
    edges,
    views,
    extent: { time: { width: TIME_WIDTH, height: timeHeight }, links: linksExtent },
    years: [y0, y1],
    timeX,
  };
}
