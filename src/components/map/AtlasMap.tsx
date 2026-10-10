"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { RELATIONSHIP_TYPES, type EntityKind, type RelationshipFamily } from "@/lib/content/model";
import type { Arrangement, AtlasData, AtlasEdge, AtlasNode, AtlasView } from "@/lib/graph/atlas";
import { C, FAMILIES, FAMILY, FamilySwatch, Glyph, KIND_COLOR, KindSwatch, MAP_KINDS, kindLabel } from "./style";
import { measure, placeLabels, type LabelCandidate, type Placement } from "./labels";
import { useViewport, type Transform } from "./useViewport";
import { MapSearch } from "./MapSearch";
import { PeriodControl } from "./PeriodControl";

export interface AtlasMapState {
  kinds?: EntityKind[];
  period?: [number, number] | null;
  arrange?: Arrangement;
  focus?: string | null;
  view?: string | null;
  isolate?: number;
}

export const DEFAULT_KINDS: EntityKind[] = ["thinker", "concept"];

type Scope = { anchors: string[]; depth: number; source: "view" | "isolate"; viewId?: string };

const SERIF = "var(--font-serif)";
const AXIS_H = 34;

function lifespan(n: AtlasNode) {
  if (n.yearStart == null) return n.dated ? null : null;
  if (n.kind === "thinker") return n.yearEnd ? `${n.yearStart}–${n.yearEnd}` : `b. ${n.yearStart}`;
  return n.yearEnd && n.yearEnd !== n.yearStart ? `${n.yearStart}–${n.yearEnd}` : `${n.yearStart}`;
}

const shortTitle = (t: string) => t.replace(/^G\. W\. F\. /, "");

/** A quadratic arc between two points; the bend alternates so parallel lines separate. */
function arcPoints(a: [number, number], b: [number, number], seed: string) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const bend = (h % 2 === 0 ? 1 : -1) * Math.min(90, len * 0.13);
  const c: [number, number] = [(a[0] + b[0]) / 2 - (dy / len) * bend, (a[1] + b[1]) / 2 + (dx / len) * bend];
  return { a, b, c };
}
const quad = (p: { a: number[]; b: number[]; c: number[] }, t: number): [number, number] => [
  (1 - t) * (1 - t) * p.a[0] + 2 * (1 - t) * t * p.c[0] + t * t * p.b[0],
  (1 - t) * (1 - t) * p.a[1] + 2 * (1 - t) * t * p.c[1] + t * t * p.b[1],
];
const quadAngle = (p: { a: number[]; b: number[]; c: number[] }, t: number) => {
  const x = 2 * (1 - t) * (p.c[0] - p.a[0]) + 2 * t * (p.b[0] - p.c[0]);
  const y = 2 * (1 - t) * (p.c[1] - p.a[1]) + 2 * t * (p.b[1] - p.c[1]);
  return (Math.atan2(y, x) * 180) / Math.PI;
};

/** Mark radius in screen px. */
const markR = (n: AtlasNode) => 2.6 + 5.2 * n.importance + (n.kind === "tendency" ? 0.6 : 0);

export function AtlasMap({ data, initial }: { data: AtlasData; initial: AtlasMapState }) {
  const uid = useId().replace(/:/g, "");
  const byId = useMemo(() => new Map(data.nodes.map((n) => [n.id, n])), [data.nodes]);
  const byKey = useMemo(() => new Map(data.nodes.map((n) => [n.key, n])), [data.nodes]);
  const incident = useMemo(() => {
    const m = new Map<string, AtlasEdge[]>();
    for (const e of data.edges) {
      m.set(e.source, [...(m.get(e.source) ?? []), e]);
      m.set(e.target, [...(m.get(e.target) ?? []), e]);
    }
    return m;
  }, [data.edges]);
  const viewById = useMemo(() => new Map(data.views.map((v) => [v.id, v])), [data.views]);

  /* ——— State ——— */
  const initView = initial.view ? viewById.get(initial.view) : undefined;
  const [arrange, setArrange] = useState<Arrangement>(initial.arrange ?? "time");
  const [kinds, setKinds] = useState<EntityKind[]>(initView?.kinds ?? initial.kinds ?? DEFAULT_KINDS);
  const [families, setFamilies] = useState<RelationshipFamily[]>(FAMILIES);
  const [period, setPeriod] = useState<[number, number] | null>(
    initView && (initView.from || initView.to) ? [initView.from ?? data.years[0], initView.to ?? data.years[1]] : (initial.period ?? null),
  );
  const focusNode = initial.focus ? byKey.get(initial.focus) : undefined;
  const [selected, setSelected] = useState<string | null>(focusNode?.id ?? initView?.select ?? null);
  const [scope, setScope] = useState<Scope | null>(
    initView
      ? { anchors: initView.anchors, depth: initView.depth, source: "view", viewId: initView.id }
      : focusNode && initial.isolate
        ? { anchors: [focusNode.id], depth: Math.min(2, initial.isolate), source: "isolate" }
        : null,
  );
  const [hover, setHover] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 1200, height: 760 });
  const [mounted, setMounted] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [relationsOpen, setRelationsOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [serif, setSerif] = useState("Georgia, serif");

  const frame = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const world = useRef<SVGGElement>(null);
  const axis = useRef<SVGGElement>(null);
  const keyBox = useRef<HTMLDivElement>(null);
  const zoomBox = useRef<HTMLDivElement>(null);

  /* ——— What is shown ——— */
  const inPeriod = useCallback(
    (n: AtlasNode) => {
      if (!period) return true;
      const [from, to] = period;
      if (n.dated || n.kind === "thinker") return n.span[1] >= from && n.span[0] <= to;
      // An undated idea belongs to a period if it is placed there, or connected to an entry active in it.
      if (n.year >= from && n.year <= to) return true;
      return (incident.get(n.id) ?? []).some((e) => {
        const o = byId.get(e.source === n.id ? e.target : e.source);
        return !!o && o.dated && o.span[1] >= from && o.span[0] <= to;
      });
    },
    [period, incident, byId],
  );

  const visible = useMemo(() => {
    const base = new Set(data.nodes.filter((n) => kinds.includes(n.kind) && inPeriod(n)).map((n) => n.id));
    if (!scope) return base;
    const reached = new Set(scope.anchors.filter((a) => byId.has(a)));
    let frontier = [...reached];
    for (let d = 0; d < scope.depth; d++) {
      const next: string[] = [];
      for (const id of frontier)
        for (const e of incident.get(id) ?? []) {
          if (!families.includes(e.family)) continue;
          const o = e.source === id ? e.target : e.source;
          if (base.has(o) && !reached.has(o)) {
            reached.add(o);
            next.push(o);
          }
        }
      frontier = next;
    }
    return reached;
  }, [data.nodes, kinds, inPeriod, scope, byId, incident, families]);

  const visibleEdges = useMemo(
    () => data.edges.filter((e) => visible.has(e.source) && visible.has(e.target) && families.includes(e.family)),
    [data.edges, visible, families],
  );

  // Importance order among what is shown: the top of this list is labelled first.
  const ranked = useMemo(() => [...visible].map((id) => byId.get(id)!).sort((a, b) => b.importance - a.importance), [visible, byId]);
  const rankOf = useMemo(() => new Map(ranked.map((n, i) => [n.id, i])), [ranked]);

  const pos = useCallback((id: string) => byId.get(id)!.at[arrange], [byId, arrange]);
  const extent = data.extent[arrange];

  /* ——— Viewport ——— */
  const panelOpen = !!selected && visible.has(selected);
  const padFor = useCallback(
    (w: number, h: number) => ({
      left: 40,
      right: !narrow && panelOpen ? Math.min(380, w * 0.35) + 30 : 40,
      top: 30,
      bottom: (arrange === "time" ? AXIS_H : 0) + (narrow && panelOpen ? h * 0.48 : 30),
    }),
    [narrow, panelOpen, arrange],
  );
  const fitTo = useCallback(
    (ids: Iterable<string>, w = size.width, h = size.height, maxLevelK?: number): Transform => {
      const pts = [...ids].map((id) => byId.get(id)?.at[arrange]).filter(Boolean) as [number, number][];
      if (!pts.length) return { k: 1, x: 0, y: 0 };
      const xs = pts.map((p) => p[0]);
      const ys = pts.map((p) => p[1]);
      const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
      const pad = padFor(w, h);
      const bw = Math.max(x1 - x0, 1);
      const bh = Math.max(y1 - y0, 1);
      const availW = Math.max(80, w - pad.left - pad.right - 120);
      const availH = Math.max(80, h - pad.top - pad.bottom - 40);
      let k = Math.min(availW / bw, availH / bh);
      if (maxLevelK) k = Math.min(k, maxLevelK);
      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;
      return { k, x: pad.left + (w - pad.left - pad.right) / 2 - cx * k, y: pad.top + (h - pad.top - pad.bottom) / 2 - cy * k };
    },
    [byId, arrange, size, padFor],
  );

  // The overview zoom for what is shown: the reference for semantic zoom levels.
  // On a phone the time axis is far longer than the screen is wide: the overview fills the height instead and opens
  // on the centre of gravity of what is shown; the reader pans through time (and Fit still shows everything).
  const home = useMemo(() => {
    const all = fitTo(visible);
    if (!narrow || arrange !== "time" || visible.size < 2) return all;
    const nodes = [...visible].map((id) => byId.get(id)!);
    const ys = nodes.map((n) => n.at.time[1]);
    const pad = padFor(size.width, size.height);
    const k = Math.max(all.k, Math.min(all.k * 6, (size.height - pad.top - pad.bottom - 40) / Math.max(1, Math.max(...ys) - Math.min(...ys))));
    let wx = 0;
    let wsum = 0;
    for (const n of nodes) {
      const w = n.importance * n.importance + 0.01;
      wx += n.at.time[0] * w;
      wsum += w;
    }
    const cy = (Math.max(...ys) + Math.min(...ys)) / 2;
    return { k, x: size.width / 2 - (wx / wsum) * k, y: pad.top + (size.height - pad.top - pad.bottom) / 2 - cy * k };
  }, [fitTo, visible, narrow, arrange, byId, padFor, size]);
  const fullHome = useMemo(() => fitTo(data.nodes.map((n) => n.id)), [fitTo, data.nodes]);
  const minK = Math.min(home.k, fullHome.k) * 0.55;
  const maxK = Math.max(home.k, fullHome.k) * 14;
  const [initialT] = useState(() => home);
  const { view, moving, current, animateTo, zoomBy, panBy, set } = useViewport({ svg, world, axis, minK, maxK });
  const level = view.k / Math.max(1e-6, home.k);

  /* ——— Measure, and fit when what is shown changes ——— */
  useEffect(() => {
    setMounted(true);
    const probe = document.createElement("span");
    probe.className = "font-serif";
    document.body.appendChild(probe);
    setSerif(getComputedStyle(probe).fontFamily);
    probe.remove();
    const el = frame.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.round(width), height: Math.round(height) });
      setNarrow(width < 720);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const first = useRef(true);
  const fitKey = `${arrange}|${[...visible].sort().join(",")}|${size.width}x${size.height}|${narrow}`;
  const lastFitKey = useRef("");
  const skipFit = useRef(false);
  useEffect(() => {
    if (!mounted) return;
    if (lastFitKey.current === fitKey) return;
    lastFitKey.current = fitKey;
    if (skipFit.current) {
      skipFit.current = false;
      return;
    }
    const target = first.current && focusNode && !scope ? centreOn(focusNode.id, 2.4) : home;
    if (first.current) set(target);
    else animateTo(target, 520);
    first.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, fitKey]);

  const centreOn = useCallback(
    (id: string, minLevel = 2): Transform => {
      const [x, y] = pos(id);
      const k = Math.max(current.current.k, home.k * minLevel);
      const pad = padFor(size.width, size.height);
      return { k, x: pad.left + (size.width - pad.left - pad.right) / 2 - x * k, y: pad.top + (size.height - pad.top - pad.bottom) / 2 - y * k };
    },
    [pos, current, home.k, padFor, size],
  );

  /* ——— URL ——— */
  useEffect(() => {
    if (!mounted) return;
    const q = new URLSearchParams();
    if (scope?.source === "view" && scope.viewId) q.set("view", scope.viewId);
    else {
      if (kinds.join(",") !== DEFAULT_KINDS.join(",")) q.set("kinds", kinds.join(","));
      if (period) {
        q.set("from", String(period[0]));
        q.set("to", String(period[1]));
      }
    }
    if (arrange !== "time") q.set("arrange", arrange);
    const sel = selected ? byId.get(selected) : null;
    if (sel && !(scope?.source === "view" && viewById.get(scope.viewId!)?.select === sel.id)) q.set("focus", sel.key);
    if (scope?.source === "isolate") q.set("isolate", String(scope.depth));
    const s = q.toString();
    const url = `${window.location.pathname}${s ? `?${s}` : ""}`;
    if (url !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(window.history.state, "", url);
  }, [mounted, kinds, period, arrange, selected, scope, byId, viewById]);

  /* ——— Actions ——— */
  const select = useCallback(
    (id: string | null, opts: { centre?: boolean } = {}) => {
      setSelected(id);
      if (id && opts.centre) animateTo(centreOn(id), 520);
      else if (id) {
        // Keep a newly selected entry clear of the panel and the edges of the view.
        const [wx, wy] = pos(id);
        const { k, x, y } = current.current;
        const sx = wx * k + x;
        const sy = wy * k + y;
        const pad = { ...padFor(size.width, size.height), right: narrow ? 40 : Math.min(380, size.width * 0.35) + 40, bottom: narrow ? size.height * 0.5 : AXIS_H + 30 };
        const dx = sx > size.width - pad.right ? size.width - pad.right - 60 - sx : sx < pad.left ? pad.left + 60 - sx : 0;
        const dy = sy > size.height - pad.bottom ? size.height - pad.bottom - 60 - sy : sy < pad.top ? pad.top + 60 - sy : 0;
        if (dx || dy) animateTo({ k, x: x + dx, y: y + dy }, 420);
      }
      if (!id && scope?.source === "isolate") setScope(null);
    },
    [animateTo, centreOn, scope, pos, current, padFor, size, narrow],
  );

  /** Bring an entry into view from search or a link, widening filters as needed. */
  const reveal = useCallback(
    (id: string) => {
      const n = byId.get(id);
      if (!n) return;
      const needsKind = !kinds.includes(n.kind);
      const needsPeriod = !!period && !inPeriod(n);
      const needsScope = !!scope && !visible.has(id);
      if (needsKind) setKinds((k) => MAP_KINDS.filter((x) => k.includes(x) || x === n.kind));
      if (needsPeriod) setPeriod(null);
      if (needsScope) setScope(null);
      setSelected(id);
      if (needsKind || needsPeriod || needsScope) skipFit.current = true;
      animateTo(centreOn(id, 2.4), 600);
    },
    [byId, kinds, period, inPeriod, scope, visible, animateTo, centreOn],
  );

  const applyView = useCallback(
    (v: AtlasView | null) => {
      if (!v) {
        setScope(null);
        setPeriod(null);
        setSelected(null);
        setKinds(DEFAULT_KINDS);
        return;
      }
      setKinds(v.kinds);
      setPeriod(v.from || v.to ? [v.from ?? data.years[0], v.to ?? data.years[1]] : null);
      setScope({ anchors: v.anchors, depth: v.depth, source: "view", viewId: v.id });
      setSelected(v.select ?? null);
      setFiltersOpen(false);
    },
    [data.years],
  );

  const toggleKind = (k: EntityKind) =>
    setKinds((cur) => {
      if (cur.includes(k)) return cur.length > 1 ? cur.filter((x) => x !== k) : cur;
      return MAP_KINDS.filter((x) => cur.includes(x) || x === k);
    });

  const reset = () => {
    setKinds(DEFAULT_KINDS);
    setFamilies(FAMILIES);
    setPeriod(null);
    setScope(null);
    setSelected(null);
    setArrange("time");
    lastFitKey.current = "";
  };

  const fitNow = () => {
    if (selected && visible.has(selected)) {
      const ids = [selected, ...(incident.get(selected) ?? []).map((e) => (e.source === selected ? e.target : e.source)).filter((x) => visible.has(x))];
      animateTo(fitTo(ids, size.width, size.height, home.k * 6), 480);
    } else animateTo(fitTo(visible), 480);
  };

  /* ——— Focus: the selection, else the hovered mark ——— */
  const focus = selected && visible.has(selected) ? selected : hover;
  const neighbours = useMemo(() => {
    if (!focus) return null;
    const s = new Set<string>([focus]);
    for (const e of incident.get(focus) ?? []) {
      if (!families.includes(e.family)) continue;
      const o = e.source === focus ? e.target : e.source;
      if (visible.has(o)) s.add(o);
    }
    return s;
  }, [focus, incident, visible, families]);
  const hoverNeighbours = useMemo(() => {
    if (!hover || hover === selected) return null;
    const s = new Set<string>([hover]);
    for (const e of incident.get(hover) ?? []) if (families.includes(e.family)) s.add(e.source === hover ? e.target : e.source);
    return s;
  }, [hover, selected, incident, families]);

  /* ——— Level of detail ——— */
  // Marks outside the top of the ranking are drawn small and pale at the overview.
  const majorCount = Math.max(12, Math.round(visible.size * Math.min(1, 0.22 * Math.pow(level, 1.3))));

  /* ——— Labels ——— */
  const labels = useMemo(() => {
    const out = new Map<string, Placement & { size: number; sub?: string; text: string }>();
    if (!mounted) return { nodes: out, edges: new Map<string, Placement & { text: string }>(), inView: new Set<string>() };
    const { k, x: tx, y: ty } = view;
    const screen = (id: string) => {
      const p = pos(id);
      return { x: p[0] * k + tx, y: p[1] * k + ty };
    };
    const budget = Math.max(Math.min(visible.size, 10), Math.round(visible.size * Math.min(1, 0.09 * Math.pow(level, 1.8))));
    const order: string[] = [];
    const seen = new Set<string>();
    const push = (id: string | null | undefined) => {
      if (id && visible.has(id) && !seen.has(id)) {
        seen.add(id);
        order.push(id);
      }
    };
    push(selected);
    push(hover);
    if (neighbours) [...neighbours].sort((a, b) => (rankOf.get(a) ?? 0) - (rankOf.get(b) ?? 0)).forEach(push);
    if (hoverNeighbours) [...hoverNeighbours].sort((a, b) => (rankOf.get(a) ?? 0) - (rankOf.get(b) ?? 0)).forEach(push);
    scope?.anchors.forEach(push);
    const forced = new Set([selected, hover].filter(Boolean) as string[]);
    ranked.slice(0, budget).forEach((n) => push(n.id));
    const deep = level > 3.2;
    const cands: LabelCandidate[] = order.map((id) => {
      const n = byId.get(id)!;
      const s = screen(id);
      const isSel = id === selected || id === hover;
      const top = (rankOf.get(id) ?? 99) < Math.max(5, visible.size * 0.06);
      const size = isSel ? 16.5 : top ? 15 : 13.5;
      const text = isSel || deep || n.title.length < 34 ? shortTitle(n.title) : `${shortTitle(n.title).slice(0, 31).trim()}…`;
      const sub = isSel || (deep && n.kind === "thinker") ? (lifespan(n) ?? undefined) : undefined;
      const w = Math.max(measure(text, size, serif, isSel ? 500 : 400), sub ? sub.length * 6.4 : 0);
      out.set(id, { side: "right", box: [0, 0, 0, 0], size, sub, text });
      return { id, x: s.x, y: s.y, r: markR(n) * (isSel ? 1.35 : 1) + 1, width: w, height: size * 1.15 + (sub ? 12 : 0), force: forced.has(id), overMarks: (rankOf.get(id) ?? 99) < 6 || isSel };
    });
    // Marks are obstacles: the labelled and major ones fully, pale minor ones only at their centre.
    const obstacles = ranked.map((n) => {
      const s = screen(n.id);
      return { x: s.x, y: s.y, r: seen.has(n.id) ? markR(n) : 1.2 };
    });
    // The key and the zoom buttons sit over the map: keep names out from under them.
    const blocked: [number, number, number, number][] = [];
    const fr = frame.current?.getBoundingClientRect();
    for (const el of [keyBox.current, zoomBox.current]) {
      const r = el?.getBoundingClientRect();
      if (fr && r && r.width) blocked.push([r.left - fr.left - 6, r.top - fr.top - 6, r.right - fr.left + 6, r.bottom - fr.top + 6]);
    }
    const bounds = { width: size.width, height: size.height, bottom: arrange === "time" ? AXIS_H + 4 : 6, right: !narrow && panelOpen ? Math.min(380, size.width * 0.35) + 24 : 0 };
    const placedNodes = placeLabels(cands, obstacles, bounds, Infinity, blocked);
    const nodes = new Map<string, Placement & { size: number; sub?: string; text: string }>();
    for (const [id, p] of placedNodes) nodes.set(id, { ...p, ...out.get(id)!, side: p.side, box: p.box });

    // Relationship names on the selection's lines, where there is room.
    const edgeLabels = new Map<string, Placement & { text: string }>();
    if (selected && visible.has(selected)) {
      const mine = visibleEdges.filter((e) => e.source === selected || e.target === selected);
      if (level > 1.7 || mine.length <= 10) {
        const ecands: LabelCandidate[] = [];
        const texts = new Map<string, string>();
        for (const e of mine) {
          const pts = arcPoints(pos(e.source), pos(e.target), e.id);
          const m = quad(pts, 0.5);
          const text = RELATIONSHIP_TYPES[e.type].label;
          texts.set(e.id, text);
          ecands.push({ id: e.id, x: m[0] * k + tx, y: m[1] * k + ty, r: 0, width: text.length * 5.6 + 6, height: 12, centred: true });
        }
        // Reserve the node labels first, then fit relationship names around them.
        const all = placeLabels(
          [...[...placedNodes].map(([id, p]) => ({ id: `n:${id}`, x: (p.box[0] + p.box[2]) / 2, y: (p.box[1] + p.box[3]) / 2, r: 0, width: p.box[2] - p.box[0], height: p.box[3] - p.box[1], centred: true, force: true })), ...ecands],
          obstacles.filter((o) => o.r > 1.2),
          bounds,
          Infinity,
          blocked,
        );
        // One of each relationship name per neighbourhood is enough: skip repeats within 140 px.
        for (const [id, p] of all) {
          if (id.startsWith("n:")) continue;
          const text = texts.get(id)!;
          const cx = (p.box[0] + p.box[2]) / 2;
          const cy = (p.box[1] + p.box[3]) / 2;
          const near = [...edgeLabels.values()].some((o) => o.text === text && Math.hypot((o.box[0] + o.box[2]) / 2 - cx, (o.box[1] + o.box[3]) / 2 - cy) < 140);
          if (!near) edgeLabels.set(id, { ...p, text });
        }
      }
    }
    const inView = new Set<string>();
    for (const n of ranked) {
      const p = screen(n.id);
      if (p.x > -20 && p.x < size.width + 20 && p.y > -20 && p.y < size.height + 20) inView.add(n.id);
    }
    return { nodes, edges: edgeLabels, inView };
  }, [mounted, view, pos, visible, level, selected, hover, neighbours, hoverNeighbours, scope, ranked, rankOf, byId, serif, majorCount, size, arrange, narrow, panelOpen, visibleEdges]);

  const small = visible.size <= 45;
  const edgeShown = useCallback(
    (e: AtlasEdge) => {
      if (focus && (e.source === focus || e.target === focus)) return true;
      if (hover && (e.source === hover || e.target === hover)) return true;
      if (small) return e.family !== "structure" || e.weight >= 2 || level > 1.8;
      if (level < 1.5) return e.weight >= 3 && e.family !== "structure" && e.family !== "affinity";
      // Closer in, relations appear where they touch the names on the map: between two named entries, or the
      // strongest ones from a named entry. Lines between unnamed marks stay hidden until those are named too.
      const a = labels.nodes.has(e.source);
      const b = labels.nodes.has(e.target);
      if (a && b) return e.family !== "structure" || e.weight >= 3 || level >= 2.6;
      // A strong relation from a named entry, to a mark that is itself in view.
      return ((a && labels.inView.has(e.target)) || (b && labels.inView.has(e.source))) && e.weight >= 3 && e.family !== "structure";
    },
    [focus, hover, small, level, labels],
  );

  /* ——— Time axis ticks, adapting to the zoom ——— */
  const ticks = useMemo(() => {
    if (arrange !== "time") return [];
    const [y0, y1] = data.years;
    const xOf = (y: number) => data.timeX[y - y0];
    const { k, x } = view;
    const lo = Math.max(y0, y0);
    const cands: number[] = [];
    for (let y = Math.ceil(lo / 5) * 5; y <= y1; y += 5) cands.push(y);
    const rank = (y: number) => (y % 100 === 0 ? 0 : y % 50 === 0 ? 1 : y % 25 === 0 ? 2 : y % 10 === 0 ? 3 : 4);
    const kept: number[] = [];
    const sx = (y: number) => xOf(y) * k + x;
    for (const r of [0, 1, 2, 3, 4])
      for (const y of cands)
        if (rank(y) === r && kept.every((o) => Math.abs(sx(o) - sx(y)) >= 58)) kept.push(y);
    return kept.sort((a, b) => a - b).map((y) => ({ year: y, x: xOf(y), major: rank(y) <= 1 }));
  }, [arrange, data.years, data.timeX, view]);

  /* ——— Keyboard ——— */
  // Escape clears the selection from anywhere on the page (focus may have left the map with a removed button).
  useEffect(() => {
    if (!selected) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [role=dialog]") || frame.current?.contains(t)) return;
      select(null);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [selected, select]);

  const onKey = (e: ReactKeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("input, textarea, select")) return;
    if (target.closest("[data-map-panel]") && e.key !== "Escape") return;
    const step = 80;
    const handled = (() => {
      switch (e.key) {
        case "+":
        case "=":
          zoomBy(1.5, undefined, true);
          return true;
        case "-":
        case "_":
          zoomBy(1 / 1.5, undefined, true);
          return true;
        case "0":
          fitNow();
          return true;
        case "ArrowLeft":
          panBy(step, 0, true);
          return true;
        case "ArrowRight":
          panBy(-step, 0, true);
          return true;
        case "ArrowUp":
          panBy(0, step, true);
          return true;
        case "ArrowDown":
          panBy(0, -step, true);
          return true;
        case "Escape":
          if (selected) select(null);
          else if (scope) setScope(null);
          return true;
      }
      return false;
    })();
    if (handled) e.preventDefault();
  };

  /* ——— Rendering ——— */
  const sel = selected && visible.has(selected) ? byId.get(selected)! : null;
  const dimOthers = !!neighbours && !!selected && visible.has(selected);
  // A selection with many lines draws them finer, so the bundle stays readable.
  const crowded = (neighbours?.size ?? 0) > 14;
  const drawOrder = useMemo(() => [...ranked].reverse(), [ranked]);
  const viewActive = scope?.source === "view" ? viewById.get(scope.viewId!) : null;
  const kindCounts = useMemo(() => {
    const m = new Map<EntityKind, number>();
    for (const n of data.nodes) if (inPeriod(n)) m.set(n.kind, (m.get(n.kind) ?? 0) + 1);
    return m;
  }, [data.nodes, inPeriod]);
  const filtersChanged = kinds.join(",") !== DEFAULT_KINDS.join(",") || !!period || !!scope || families.length !== FAMILIES.length || arrange !== "time";

  const toolbar = (
    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-6">
      <div role="group" aria-label="Show" className="flex flex-wrap items-center gap-1.5">
        <span className="label mr-1 text-faint">Show</span>
        {MAP_KINDS.map((k) => {
          const on = kinds.includes(k);
          return (
            <button
              key={k}
              type="button"
              aria-pressed={on}
              onClick={() => {
                if (scope?.source === "view") setScope(null);
                toggleKind(k);
              }}
              className={`label inline-flex items-center gap-1.5 border px-2 py-1 transition-colors ${on ? "border-ink bg-paper-warm text-ink" : "border-rule-soft text-faint hover:border-rule hover:text-ink"}`}
            >
              <span className={on ? "" : "opacity-40 grayscale"}>
                <KindSwatch kind={k} size={11} />
              </span>
              {kindLabel(k, 2)}
              <span className="label-mono text-faint">{kindCounts.get(k) ?? 0}</span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div
          className="relative"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setRelationsOpen(false);
          }}
          onKeyDown={(e) => e.key === "Escape" && setRelationsOpen(false)}
        >
          <button type="button" aria-expanded={relationsOpen} aria-label={`Relations: ${families.length} of ${FAMILIES.length} kinds drawn`} onClick={() => setRelationsOpen((o) => !o)} className="label inline-flex items-center gap-1.5 text-muted hover:text-ink">
            Relations
            <span className="label-mono text-faint">
              {families.length}/{FAMILIES.length}
            </span>
            <span aria-hidden="true" className={`transition-transform ${relationsOpen ? "rotate-180" : ""}`}>
              ▾
            </span>
          </button>
          {relationsOpen && (
            <fieldset className="absolute left-0 top-full z-30 mt-2 w-64 border border-ink bg-paper-warm p-3 shadow-[4px_4px_0_0_rgba(22,22,26,0.08)]">
              <legend className="sr-only">Relations to draw</legend>
              {FAMILIES.map((f) => (
                <label key={f} className="flex cursor-pointer items-center gap-2.5 py-1 text-[0.92rem]">
                  <input
                    type="checkbox"
                    className="accent-[var(--color-red)]"
                    checked={families.includes(f)}
                    onChange={() => setFamilies((cur) => (cur.includes(f) ? (cur.length > 1 ? cur.filter((x) => x !== f) : cur) : FAMILIES.filter((x) => cur.includes(x) || x === f)))}
                  />
                  <FamilySwatch family={f} />
                  <span className="font-serif">{FAMILY[f].label}</span>
                </label>
              ))}
            </fieldset>
          )}
        </div>
        <div role="group" aria-label="Arrange" className="inline-flex border border-rule">
          {(["time", "links"] as Arrangement[]).map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={arrange === a}
              onClick={() => setArrange(a)}
              className={`label px-2.5 py-1 transition-colors ${arrange === a ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
            >
              {a === "time" ? "By time" : "By connection"}
            </button>
          ))}
        </div>
        {filtersChanged && (
          <button type="button" onClick={reset} className="label text-red hover:text-red-deep">
            Reset map
          </button>
        )}
      </div>
    </div>
  );

  const views = (
    <div role="group" aria-label="Starting points" className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
      <span className="label text-faint">Start from</span>
      {data.views.map((v) => {
        const on = viewActive?.id === v.id;
        return (
          <button
            key={v.id}
            type="button"
            aria-pressed={on}
            onClick={() => applyView(on ? null : v)}
            className={`font-serif text-[1.02rem] leading-tight transition-colors ${on ? "text-red underline decoration-red underline-offset-4" : "text-ink hover:text-red"}`}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="map-tool" data-atlas-map>
      {/* Controls */}
      <div className="border-y border-ink py-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <MapSearch nodes={data.nodes} onPick={reveal} />
          <div className="hidden min-w-0 flex-1 lg:block">{views}</div>
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls={`${uid}-filters`}
            onClick={() => setFiltersOpen((o) => !o)}
            className="label ml-auto inline-flex items-center gap-1.5 border border-ink px-2.5 py-1.5 lg:hidden"
          >
            Filters & views {filtersChanged && <span className="h-1.5 w-1.5 bg-red" aria-hidden="true" />}
          </button>
        </div>
        <div id={`${uid}-filters`} className={`${filtersOpen ? "mt-4 flex" : "hidden"} flex-col gap-4 lg:mt-3 lg:flex`}>
          <div className="lg:hidden">{views}</div>
          {toolbar}
        </div>
      </div>
      {viewActive && (
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-3 font-serif text-[1rem] italic text-muted">
          <span className="label not-italic text-red">{viewActive.label}</span>
          <span>{viewActive.note}</span>
          <button type="button" onClick={() => applyView(null)} className="label not-italic text-faint hover:text-ink">
            Show the whole map ✕
          </button>
        </p>
      )}

      {/* The plate */}
      <section aria-labelledby="map-heading" className="mt-4 border border-ink p-[5px]">
        <h2 id="map-heading" className="sr-only">
          The map
        </h2>
        <div
          ref={frame}
          tabIndex={0}
          role="region"
          aria-label="Theory Map. Use plus and minus to zoom, arrow keys to move, 0 to fit, Escape to clear the selection."
          aria-describedby={`${uid}-status`}
          onKeyDown={onKey}
          className="relative h-[68svh] min-h-[420px] overflow-hidden border border-ink/50 bg-paper-warm outline-none focus-visible:ring-2 focus-visible:ring-red sm:h-[min(72svh,780px)] sm:min-h-[540px]"
        >
          <p id={`${uid}-status`} className="sr-only" aria-live="polite">
            {visible.size} entries shown{viewActive ? `, ${viewActive.label}` : ""}
            {period ? `, ${period[0]} to ${period[1]}` : ""}.{sel ? ` ${sel.title} selected.` : ""}
          </p>
          <svg
            ref={svg}
            width={size.width}
            height={size.height}
            className={`absolute inset-0 h-full w-full touch-none select-none ${moving ? "cursor-grabbing" : "cursor-grab"}`}
            style={{ ["--inv" as string]: String(1 / initialT.k) }}
            role="group"
            aria-label={`${visible.size} entries and ${visibleEdges.length} relations`}
            onClick={(e) => {
              if (svg.current?.dataset.dragging) return;
              if (!(e.target as Element).closest("[data-id]")) select(null);
            }}
            onPointerLeave={() => setHover(null)}
          >
            {/* Time axis: gridlines and years, behind everything */}
            {arrange === "time" && (
              <g ref={axis} transform={`matrix(${initialT.k} 0 0 1 ${initialT.x} 0)`} aria-hidden="true">
                {period && (
                  <rect
                    x={data.timeX[Math.max(0, period[0] - data.years[0])]}
                    width={Math.max(1, data.timeX[Math.min(data.timeX.length - 1, period[1] - data.years[0])] - data.timeX[Math.max(0, period[0] - data.years[0])])}
                    y={size.height - AXIS_H}
                    height={3}
                    fill={C.red}
                    opacity={0.5}
                  />
                )}
                {ticks.map((t) => (
                  <g key={t.year}>
                    <line x1={t.x} x2={t.x} y1={0} y2={size.height - AXIS_H} stroke={t.major ? C.rule : C.ruleSoft} strokeDasharray={t.major ? undefined : "1 4"} vectorEffect="non-scaling-stroke" />
                    <text
                      className="font-sans"
                      fontSize={11}
                      letterSpacing="0.04em"
                      fill={C.faint}
                      textAnchor="middle"
                      style={{ transform: `translate(${t.x}px, ${size.height - 12}px) scale(var(--inv), 1)` }}
                    >
                      {t.year}
                    </text>
                  </g>
                ))}
                <line x1={0} x2={extent.width} y1={size.height - AXIS_H} y2={size.height - AXIS_H} stroke={C.ink} strokeOpacity={0.5} vectorEffect="non-scaling-stroke" />
              </g>
            )}

            <defs>
              <clipPath id={`${uid}-clip`}>
                <rect x={0} y={0} width={size.width} height={size.height - (arrange === "time" ? AXIS_H : 0)} />
              </clipPath>
            </defs>
            <g clipPath={`url(#${uid}-clip)`}>
            <g ref={world} transform={`matrix(${initialT.k} 0 0 ${initialT.k} ${initialT.x} ${initialT.y})`}>
              {/* Relations */}
              <g fill="none" aria-hidden="true">
                {visibleEdges.map((e) => {
                  if (!edgeShown(e)) return null;
                  const p = arcPoints(pos(e.source), pos(e.target), e.id);
                  const lit = !!focus && (e.source === focus || e.target === focus);
                  const hoverLit = !!hover && (e.source === hover || e.target === hover);
                  const on = lit || hoverLit;
                  const f = FAMILY[e.family];
                  const opacity = on ? 0.9 : dimOthers || hover ? 0.05 : e.family === "structure" ? 0.16 : e.family === "critique" ? 0.34 : 0.24;
                  return (
                    <path
                      key={e.id}
                      d={`M${p.a[0]},${p.a[1]} Q${p.c[0]},${p.c[1]} ${p.b[0]},${p.b[1]}`}
                      stroke={on ? f.stroke : e.family === "critique" ? C.red : C.ink}
                      strokeWidth={on ? (crowded ? 0.9 + (e.weight - 1) * 0.3 : 1.4 + (e.weight - 1) * 0.45) : 0.7 + (e.weight - 1) * 0.3}
                      strokeDasharray={f.dash}
                      strokeOpacity={opacity}
                      vectorEffect="non-scaling-stroke"
                      style={{ transition: "stroke-opacity .25s" }}
                    />
                  );
                })}
              </g>
              {/* Direction of the selection's relations */}
              {focus && (
                <g aria-hidden="true">
                  {visibleEdges
                    .filter((e) => (e.source === focus || e.target === focus) && !RELATIONSHIP_TYPES[e.type].symmetric)
                    .map((e) => {
                      const p = arcPoints(pos(e.source), pos(e.target), e.id);
                      // Place the arrowhead just short of the target mark.
                      const tgt = byId.get(e.target)!;
                      const len = Math.hypot(p.b[0] - p.a[0], p.b[1] - p.a[1]) * view.k;
                      const t = Math.max(0.55, 1 - (markR(tgt) + 7) / Math.max(1, len));
                      const [x, y] = quad(p, t);
                      return (
                        <path
                          key={e.id}
                          d="M-5,-3.6 L0,0 L-5,3.6"
                          fill="none"
                          stroke={FAMILY[e.family].stroke}
                          strokeWidth={1.4}
                          style={{ transform: `translate(${x}px, ${y}px) scale(var(--inv)) rotate(${quadAngle(p, t)}deg)` }}
                        />
                      );
                    })}
                </g>
              )}
              {/* Marks */}
              <g>
                {drawOrder.map((n) => {
                  const [x, y] = n.at[arrange];
                  const rank = rankOf.get(n.id) ?? 0;
                  const isSel = n.id === selected;
                  const isHover = n.id === hover;
                  const near = neighbours?.has(n.id) || hoverNeighbours?.has(n.id);
                  const major = rank < majorCount || isSel || near || scope?.anchors.includes(n.id);
                  const dim = (dimOthers && !neighbours!.has(n.id)) || (!!hoverNeighbours && !dimOthers && !hoverNeighbours.has(n.id));
                  const r = markR(n) * (isSel ? 1.35 : major ? 1 : 0.8);
                  const labelled = labels.nodes.has(n.id);
                  const years = lifespan(n);
                  return (
                    <g
                      key={n.id}
                      data-id={n.id}
                      role="button"
                      tabIndex={labelled || isSel || near ? 0 : -1}
                      aria-pressed={isSel}
                      aria-label={`${n.title}, ${kindLabel(n.kind).toLowerCase()}${years ? `, ${years}` : ""}${n.group ? `, ${n.group}` : ""}. ${n.degree} connections.`}
                      onPointerEnter={(ev) => ev.pointerType === "mouse" && setHover(n.id)}
                      onPointerLeave={(ev) => ev.pointerType === "mouse" && setHover((h) => (h === n.id ? null : h))}
                      onFocus={() => setHover(n.id)}
                      onBlur={() => setHover((h) => (h === n.id ? null : h))}
                      onClick={(ev) => {
                        if (svg.current?.dataset.dragging) return;
                        ev.stopPropagation();
                        select(isSel ? null : n.id);
                      }}
                      onKeyDown={(ev) => {
                        if (ev.key === "Enter" || ev.key === " ") {
                          ev.preventDefault();
                          ev.stopPropagation();
                          select(isSel ? null : n.id);
                        }
                      }}
                      className="cursor-pointer outline-none [&:focus-visible_.ring]:opacity-100"
                      style={{ transform: `translate(${x}px, ${y}px) scale(var(--inv))`, opacity: dim ? 0.16 : major ? 1 : 0.62, transition: "opacity .25s" }}
                    >
                      <circle r={Math.max(11, r + 6)} fill="transparent" />
                      <circle className="ring" r={r + 6} fill="none" stroke={C.red} strokeWidth={1.2} opacity={isSel ? 1 : 0} />
                      <Glyph kind={n.kind} r={r} fill={major || isHover ? KIND_COLOR[n.kind] : C.sheet} stroke={isHover ? C.red : KIND_COLOR[n.kind]} strokeWidth={major ? 1 : 1.2} />
                    </g>
                  );
                })}
              </g>
              {/* Labels, above every mark and line */}
              <g aria-hidden="true" className="pointer-events-none">
                {[...labels.edges].map(([id, p]) => {
                  const cx = (p.box[0] + p.box[2]) / 2;
                  const cy = (p.box[1] + p.box[3]) / 2;
                  const wx = (cx - view.x) / view.k;
                  const wy = (cy - view.y) / view.k;
                  return (
                    <text
                      key={id}
                      className="font-sans uppercase"
                      fontSize={9.5}
                      letterSpacing="0.06em"
                      fill={C.muted}
                      textAnchor="middle"
                      dominantBaseline="central"
                      stroke={C.sheet}
                      strokeWidth={3.5}
                      paintOrder="stroke"
                      strokeLinejoin="round"
                      style={{ transform: `translate(${wx}px, ${wy}px) scale(var(--inv))`, opacity: moving ? 0 : 1, transition: "opacity .15s" }}
                    >
                      {p.text}
                    </text>
                  );
                })}
                {[...labels.nodes].map(([id, p]) => {
                  const n = byId.get(id)!;
                  const [x, y] = n.at[arrange];
                  const isSel = id === selected || id === hover;
                  const dim = (dimOthers && !neighbours!.has(id)) || (!!hoverNeighbours && !dimOthers && !hoverNeighbours.has(id));
                  // Offsets relative to the mark, in screen px.
                  const sx = x * view.k + view.x;
                  const sy = y * view.k + view.y;
                  const anchor = p.side === "right" ? "start" : p.side === "left" ? "end" : "middle";
                  const lx = p.side === "right" ? p.box[0] - sx : p.side === "left" ? p.box[2] - sx : (p.box[0] + p.box[2]) / 2 - sx;
                  const ly = p.box[1] - sy + p.size * 0.92;
                  return (
                    <g key={id} style={{ transform: `translate(${x}px, ${y}px) scale(var(--inv))`, opacity: dim ? 0.25 : 1, transition: "opacity .25s" }}>
                      <text
                        x={lx}
                        y={ly}
                        textAnchor={anchor}
                        fontSize={p.size}
                        fontFamily={SERIF}
                        fontWeight={isSel ? 500 : 400}
                        fill={id === selected ? C.red : C.ink}
                        stroke={C.sheet}
                        strokeWidth={4}
                        strokeLinejoin="round"
                        paintOrder="stroke"
                      >
                        {p.text}
                      </text>
                      {p.sub && (
                        <text x={lx} y={ly + 13} textAnchor={anchor} fontSize={10.5} className="font-sans" letterSpacing="0.05em" fill={C.faint} stroke={C.sheet} strokeWidth={3} paintOrder="stroke">
                          {p.sub}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </g>
            </g>
          </svg>

          {visible.size === 0 && (
            <p className="absolute inset-0 grid place-items-center p-8 text-center font-serif text-lg italic text-muted">Nothing matches these filters. Widen the period or show more kinds of entry.</p>
          )}

          {/* Zoom controls */}
          <div ref={zoomBox} role="group" aria-label="Zoom" className={`absolute right-3 z-10 flex flex-col border border-ink bg-paper-warm ${narrow && panelOpen ? "top-3" : arrange === "time" ? "bottom-[46px]" : "bottom-3"} ${!narrow && panelOpen ? "right-[calc(min(380px,35%)+24px)]" : ""}`}>
            <ZoomButton label="Zoom in" onClick={() => zoomBy(1.6, undefined, true)}>
              <path d="M7 2v10M2 7h10" />
            </ZoomButton>
            <ZoomButton label="Zoom out" onClick={() => zoomBy(1 / 1.6, undefined, true)}>
              <path d="M2 7h10" />
            </ZoomButton>
            <ZoomButton label={selected ? "Fit the selection" : "Fit to view"} onClick={fitNow}>
              <path d="M1.5 5V1.5H5M9 1.5h3.5V5M12.5 9v3.5H9M5 12.5H1.5V9" />
            </ZoomButton>
            <ZoomButton label="Reset the map" onClick={reset}>
              <path d="M2.2 6.2A5 5 0 1 0 4 2.8M2 1v3.2h3.2" />
            </ZoomButton>
          </div>

          {/* Key */}
          <div ref={keyBox} className={`pointer-events-none absolute left-3 z-10 hidden flex-col gap-1 sm:flex ${arrange === "time" ? "bottom-[46px]" : "bottom-3"}`} aria-hidden="true">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-paper-warm/85 px-1.5 py-1">
              {kinds.map((k) => (
                <span key={k} className="label inline-flex items-center gap-1.5 text-muted">
                  <KindSwatch kind={k} size={10} />
                  {kindLabel(k, 2)}
                </span>
              ))}
            </div>
            <p className="label-mono bg-paper-warm/85 px-1.5 text-faint">Scroll or pinch to zoom · drag to move</p>
          </div>

          {sel && (
            <MapPanel
              node={sel}
              edges={(incident.get(sel.id) ?? []).filter((e) => families.includes(e.family))}
              byId={byId}
              visible={visible}
              kinds={kinds}
              scope={scope}
              narrow={narrow}
              onClose={() => select(null)}
              onPick={(id) => select(id, { centre: true })}
              onShowKind={(k) => setKinds((cur) => MAP_KINDS.filter((x) => cur.includes(x) || x === k))}
              onIsolate={(depth) => setScope(depth ? { anchors: [sel.id], depth, source: "isolate" } : null)}
            />
          )}
        </div>
      </section>

      <PeriodControl years={data.years} nodes={data.nodes} period={period} onChange={(p) => {
        if (scope?.source === "view") setScope((s) => (s ? { ...s, viewId: undefined, source: "isolate" as const } : s));
        setPeriod(p);
      }} />

      <details className="mt-6 border-t border-ink pt-3" onToggle={(e) => setListOpen((e.target as HTMLDetailsElement).open)}>
        <summary className="label cursor-pointer text-muted hover:text-ink">Read the map as a list</summary>
        {listOpen && (
          <ul className="mt-4 columns-1 gap-10 font-serif text-[0.98rem] md:columns-2">
            {ranked
              .slice()
              .sort((a, b) => a.year - b.year || a.title.localeCompare(b.title))
              .map((n) => (
                <li key={n.id} className="break-inside-avoid pb-3">
                  <Link href={n.href} className="link-inline font-medium">
                    {n.title}
                  </Link>{" "}
                  <span className="label text-faint">{kindLabel(n.kind)}</span>
                  <ul className="mt-0.5 text-[0.92rem] text-ink-warm">
                    {visibleEdges
                      .filter((e) => e.source === n.id)
                      .map((e) => (
                        <li key={e.id}>
                          <span className="rel">{RELATIONSHIP_TYPES[e.type].label}</span>{" "}
                          <Link href={byId.get(e.target)!.href} className="link-inline">
                            {byId.get(e.target)!.title}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
          </ul>
        )}
      </details>
    </div>
  );
}

function ZoomButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="grid h-9 w-9 place-items-center border-b border-rule text-ink transition-colors last:border-b-0 hover:bg-ink hover:text-paper">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}

/* ——— The selection ——— */

function MapPanel({
  node,
  edges,
  byId,
  visible,
  kinds,
  scope,
  narrow,
  onClose,
  onPick,
  onShowKind,
  onIsolate,
}: {
  node: AtlasNode;
  edges: AtlasEdge[];
  byId: Map<string, AtlasNode>;
  visible: Set<string>;
  kinds: EntityKind[];
  scope: Scope | null;
  narrow: boolean;
  onClose: () => void;
  onPick: (id: string) => void;
  onShowKind: (k: EntityKind) => void;
  onIsolate: (depth: number) => void;
}) {
  // Group connections by how they read from this entry ("influenced", "criticised by", …).
  const rows = edges
    .map((e) => {
      const out = e.source === node.id;
      const other = byId.get(out ? e.target : e.source);
      const meta = RELATIONSHIP_TYPES[e.type];
      return other ? { e, other, label: out || meta.symmetric ? meta.label : meta.inverseLabel } : null;
    })
    .filter((x): x is { e: AtlasEdge; other: AtlasNode; label: string } => !!x);
  const shown = rows.filter((r) => visible.has(r.other.id));
  const hiddenKinds = new Map<EntityKind, number>();
  for (const r of rows) if (!kinds.includes(r.other.kind)) hiddenKinds.set(r.other.kind, (hiddenKinds.get(r.other.kind) ?? 0) + 1);
  const groups = new Map<string, typeof rows>();
  for (const r of shown.sort((a, b) => b.e.weight - a.e.weight || b.other.importance - a.other.importance)) groups.set(r.label, [...(groups.get(r.label) ?? []), r]);
  const isolated = scope?.source === "isolate" && scope.anchors[0] === node.id ? scope.depth : 0;
  const years = lifespan(node);

  return (
    <aside
      data-map-panel
      aria-label={`${node.title}: summary and connections`}
      className={`absolute z-20 flex flex-col border border-ink bg-paper-warm animate-enter ${
        narrow ? "inset-x-2 bottom-2 max-h-[46%]" : "bottom-3 right-3 top-3 w-[min(380px,35%)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3 px-5 pt-4">
        <p className="label inline-flex items-center gap-2 text-faint">
          <KindSwatch kind={node.kind} size={11} />
          {kindLabel(node.kind)}
          {node.group ? ` · ${node.group}` : ""}
        </p>
        <button type="button" onClick={onClose} className="label -mr-1 -mt-1 px-1 text-faint hover:text-ink" aria-label="Close">
          ✕
        </button>
      </div>
      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-5 pb-4">
        <h3 className="mt-1.5 font-serif text-[1.65rem] leading-[1.05]">{node.title}</h3>
        {years && <p className="label-mono mt-1 text-muted">{years}</p>}
        <p className="mt-2.5 line-clamp-4 font-serif text-[0.97rem] leading-snug text-ink-warm">{node.summary}</p>
        <Link href={node.href} className="label mt-3 inline-flex items-center gap-1.5 text-red hover:text-red-deep">
          Open the {kindLabel(node.kind).toLowerCase()} <span aria-hidden="true">→</span>
        </Link>

        <div className="mt-4 border-t border-ink pt-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="label text-ink">
              {shown.length} connection{shown.length === 1 ? "" : "s"} shown
            </p>
            <div className="flex gap-3">
              {isolated === 0 && shown.length > 0 && (
                <button type="button" className="label text-red hover:text-red-deep" onClick={() => onIsolate(1)}>
                  Show only these
                </button>
              )}
              {isolated === 1 && (
                <button type="button" className="label text-red hover:text-red-deep" onClick={() => onIsolate(2)}>
                  One step further
                </button>
              )}
              {isolated > 0 && (
                <button type="button" className="label text-faint hover:text-ink" onClick={() => onIsolate(0)}>
                  Whole map
                </button>
              )}
            </div>
          </div>
          {[...groups].map(([label, list]) => (
            <div key={label} className="mt-3">
              <p className="rel">{label}</p>
              <ul className="mt-1 space-y-1.5">
                {list.map(({ e, other }) => (
                  <li key={e.id} className="text-[0.95rem] leading-snug">
                    <button type="button" onClick={() => onPick(other.id)} className="group inline-flex items-baseline gap-2 text-left">
                      <span className="translate-y-[1px]">
                        <KindSwatch kind={other.kind} size={9} />
                      </span>
                      <span className="font-serif group-hover:text-red">{other.title}</span>
                    </button>
                    {e.note && <p className="ml-[17px] line-clamp-2 font-serif text-[0.84rem] italic leading-snug text-muted">{e.note}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {hiddenKinds.size > 0 && (
            <p className="mt-4 text-[0.9rem] leading-snug text-muted">
              Not shown:{" "}
              {[...hiddenKinds].map(([k, n], i) => (
                <span key={k}>
                  {i > 0 && ", "}
                  <button type="button" className="link-inline" onClick={() => onShowKind(k)}>
                    {n} {kindLabel(k, n).toLowerCase()}
                  </button>
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
