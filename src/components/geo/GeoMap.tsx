"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { KINDS, PLACE_KIND_LABELS, PLACE_ROLE_META, PLACE_ROLES, type EntityKind, type PlaceRole } from "@/lib/content/model";
import { placeLabels, measure, type LabelCandidate } from "@/components/map/labels";
import { PeriodControl } from "@/components/map/PeriodControl";
import { C, KindSwatch } from "@/components/map/style";
import { useViewport, type Transform } from "@/components/map/useViewport";
import { GeoSearch } from "./GeoSearch";
import type { GeoData, GeoEntry, GeoLink, GeoPoint, GeoState } from "./types";

/** The kinds of entry that have places, in the order the filters list them. */
const GEO_KINDS: EntityKind[] = ["thinker", "text", "event", "tendency"];

/** Associations grouped as the filters present them: a life, a body of work, events, reach. */
export const ROLE_GROUPS: { label: string; roles: PlaceRole[] }[] = [
  { label: "Lives", roles: ["birth", "residence", "exile", "death"] },
  { label: "Work", roles: ["activity", "writing", "publication"] },
  { label: "Events", roles: ["event"] },
  { label: "Reach", roles: ["influence"] },
];

const isPoint = (p: GeoPoint) => p.kind === "settlement" || p.kind === "site";
const CLUSTER_R = 24;
const SERIF = "var(--font-serif)";

export function years(l: Pick<GeoLink, "yearStart" | "yearEnd">) {
  if (l.yearStart == null) return "";
  if (l.yearEnd == null || l.yearEnd === l.yearStart) return String(l.yearStart);
  return `${l.yearStart}–${l.yearEnd}`;
}

const markR = (w: number) => Math.min(9.5, 2.6 + 1.45 * Math.sqrt(w));

interface Cluster {
  id: string;
  lead: GeoPoint;
  members: GeoPoint[];
  weight: number;
}

export function GeoMap({ data, initial }: { data: GeoData; initial: GeoState }) {
  const uid = useId().replace(/:/g, "");
  const placeById = useMemo(() => new Map(data.places.map((p) => [p.id, p])), [data.places]);
  const placeBySlug = useMemo(() => new Map(data.places.map((p) => [p.slug, p])), [data.places]);
  const entryById = useMemo(() => new Map(data.entries.map((e) => [e.id, e])), [data.entries]);
  const entryByKey = useMemo(() => new Map(data.entries.map((e) => [e.key, e])), [data.entries]);
  const kindsPresent = useMemo(() => GEO_KINDS.filter((k) => data.entries.some((e) => e.kind === k)), [data.entries]);
  const rolesPresent = useMemo(() => new Set(data.links.map((l) => l.role)), [data.links]);

  /* ——— State: this page's own, not shared with the Theory Map ——— */
  const [kinds, setKinds] = useState<EntityKind[]>(() => {
    const k = (initial.kinds ?? []).filter((x): x is EntityKind => (kindsPresent as string[]).includes(x));
    return k.length ? k : kindsPresent;
  });
  const [roles, setRoles] = useState<PlaceRole[]>(() => {
    const r = (initial.roles ?? []).filter((x): x is PlaceRole => (PLACE_ROLES as readonly string[]).includes(x));
    return r.length ? r : [...PLACE_ROLES];
  });
  const [period, setPeriod] = useState<[number, number] | null>(initial.period);
  const [place, setPlace] = useState<string | null>(() => (initial.place ? (placeBySlug.get(initial.place)?.id ?? null) : null));
  const [trace, setTrace] = useState<string | null>(() => (initial.trace ? (entryByKey.get(initial.trace)?.id ?? null) : null));
  const [hover, setHover] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 900, height: 620 });
  const [narrow, setNarrow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [serif, setSerif] = useState("Georgia, serif");
  const [land, setLand] = useState({ land: data.basemap.land, detail: data.basemap.detail });

  const frame = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const world = useRef<SVGGElement>(null);
  const noAxis = useRef<SVGGElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const zoomBox = useRef<HTMLDivElement>(null);

  /* ——— What is shown ——— */
  const inPeriod = useCallback(
    (l: GeoLink) => {
      if (!period) return true;
      if (l.yearStart == null) return false;
      return (l.yearEnd ?? l.yearStart) >= period[0] && l.yearStart <= period[1];
    },
    [period],
  );
  const kindOf = useCallback((l: GeoLink) => entryById.get(l.entry)!.kind, [entryById]);
  const active = useMemo(
    () => data.links.filter((l) => kinds.includes(kindOf(l)) && roles.includes(l.role) && inPeriod(l)),
    [data.links, kinds, roles, inPeriod, kindOf],
  );
  const byPlace = useMemo(() => {
    const m = new Map<string, GeoLink[]>();
    for (const l of active) m.set(l.place, [...(m.get(l.place) ?? []), l]);
    return m;
  }, [active]);
  // Weight: how many distinct entries a place holds under the current filters.
  const weightOf = useCallback((id: string) => new Set((byPlace.get(id) ?? []).map((l) => l.entry)).size, [byPlace]);
  // A traced entry's places are drawn whatever the filters, so its route never runs to an empty spot.
  const tracedPlaces = useMemo(() => new Set(trace ? data.links.filter((l) => l.entry === trace).map((l) => l.place) : []), [data.links, trace]);
  const points = useMemo(() => data.places.filter((p) => isPoint(p) && (byPlace.has(p.id) || tracedPlaces.has(p.id))), [data.places, byPlace, tracedPlaces]);
  const regions = useMemo(() => data.places.filter((p) => p.kind === "region" && byPlace.has(p.id)), [data.places, byPlace]);
  const areas = useMemo(() => data.places.filter((p) => !isPoint(p) && byPlace.has(p.id)).sort((a, b) => weightOf(b.id) - weightOf(a.id)), [data.places, byPlace, weightOf]);

  // Counts for the filters, each under the other filters.
  const kindCount = useMemo(() => {
    const m = new Map<EntityKind, Set<string>>();
    for (const l of data.links) if (roles.includes(l.role) && inPeriod(l)) m.set(kindOf(l), (m.get(kindOf(l)) ?? new Set()).add(l.entry));
    return m;
  }, [data.links, roles, inPeriod, kindOf]);
  const roleCount = useMemo(() => {
    const m = new Map<PlaceRole, number>();
    for (const l of data.links) if (kinds.includes(kindOf(l)) && inPeriod(l)) m.set(l.role, (m.get(l.role) ?? 0) + 1);
    return m;
  }, [data.links, kinds, inPeriod, kindOf]);
  const datedYears = useMemo(() => data.links.filter((l) => kinds.includes(kindOf(l)) && roles.includes(l.role) && l.yearStart != null).map((l) => l.yearStart!), [data.links, kinds, roles, kindOf]);

  /* ——— A traced entry: its places in order ——— */
  const traced = trace ? entryById.get(trace) : undefined;
  const stations = useMemo(() => {
    if (!trace) return [];
    const order = (r: PlaceRole) => (r === "birth" ? -1 : r === "death" ? 1 : 0);
    return data.links
      .filter((l) => l.entry === trace)
      .sort((a, b) => (a.yearStart ?? 9999) - (b.yearStart ?? 9999) || order(a.role) - order(b.role) || (a.yearEnd ?? 0) - (b.yearEnd ?? 0));
  }, [data.links, trace]);
  const route = useMemo(() => {
    const out: GeoPoint[] = [];
    for (const s of stations) {
      const p = placeById.get(s.place);
      if (p && isPoint(p) && out.at(-1)?.id !== p.id) out.push(p);
    }
    return out;
  }, [stations, placeById]);
  const stationNumbers = useMemo(() => {
    const m = new Map<string, number[]>();
    stations.forEach((s, i) => m.set(s.place, [...(m.get(s.place) ?? []), i + 1]));
    return m;
  }, [stations]);
  const pinned = useMemo(() => new Set<string>([...(place ? [place] : []), ...route.map((p) => p.id)]), [place, route]);

  /* ——— Viewport ——— */
  const fitBox = useCallback(
    (x0: number, y0: number, x1: number, y1: number, w = size.width, h = size.height): Transform => {
      const pad = { l: 36, r: 36, t: 36, b: 48 };
      const bw = Math.max(x1 - x0, 4);
      const bh = Math.max(y1 - y0, 4);
      const k = Math.min((w - pad.l - pad.r) / bw, (h - pad.t - pad.b) / bh);
      return { k, x: pad.l + (w - pad.l - pad.r) / 2 - ((x0 + x1) / 2) * k, y: pad.t + (h - pad.t - pad.b) / 2 - ((y0 + y1) / 2) * k };
    },
    [size],
  );
  const fitPoints = useCallback(
    (pts: GeoPoint[], maxK?: number) => {
      if (!pts.length) return fitBox(0, 0, data.basemap.width, data.basemap.height);
      const xs = pts.map((p) => p.at[0]);
      const ys = pts.map((p) => p.at[1]);
      const t = fitBox(Math.min(...xs) - 6, Math.min(...ys) - 6, Math.max(...xs) + 6, Math.max(...ys) + 6);
      if (maxK && t.k > maxK) {
        const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
        const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
        return { k: maxK, x: size.width / 2 - cx * maxK, y: (size.height - 12) / 2 - cy * maxK };
      }
      return t;
    },
    [fitBox, data.basemap, size],
  );
  const allPoints = useMemo(() => data.places.filter(isPoint), [data.places]);
  const wholeMap = useMemo(() => fitPoints(allPoints), [fitPoints, allPoints]);
  // Open where most of the places are: Europe, when it holds most of them; otherwise the whole map.
  const core = useMemo(() => {
    const [x0, y0, x1, y1] = data.basemap.detailBox;
    return allPoints.filter((p) => p.at[0] >= x0 && p.at[0] <= x1 && p.at[1] >= y0 && p.at[1] <= y1);
  }, [allPoints, data.basemap.detailBox]);
  const europe = useMemo(() => (core.length > 1 ? fitPoints(core) : wholeMap), [core, fitPoints, wholeMap]);
  const home = core.length >= allPoints.length * 0.6 ? europe : wholeMap;
  const minK = Math.min(home.k, wholeMap.k) * 0.7;
  const maxK = home.k * 40;
  const [initialT] = useState(() => home);
  const { view, moving, current, animateTo, zoomBy, panBy, set } = useViewport({ svg, world, axis: noAxis, minK, maxK });

  useEffect(() => {
    if (land.land) return;
    let live = true;
    fetch("/geography/land")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { land: string; detail: string } | null) => live && j && setLand(j))
      .catch(() => {});
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setNarrow(width < 640);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // First fit once the frame is measured: the traced route, the chosen place, or every place.
  const fitted = useRef("");
  useEffect(() => {
    if (!mounted) return;
    const key = `${size.width}x${size.height}`;
    if (fitted.current === key) return;
    const firstFit = !fitted.current;
    fitted.current = key;
    const p = place ? placeById.get(place) : undefined;
    const target = route.length ? fitPoints(route, home.k * 8) : p && isPoint(p) ? centreOn(p, 6) : home;
    set(target);
    if (firstFit) setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, size]);

  const centreOn = useCallback(
    (p: GeoPoint, minLevel = 4): Transform => {
      const k = Math.max(current.current.k, home.k * minLevel);
      return { k, x: size.width / 2 - p.at[0] * k, y: (size.height - 12) / 2 - p.at[1] * k };
    },
    [current, home.k, size],
  );

  /* ——— URL: this page's own address ——— */
  useEffect(() => {
    if (!mounted) return;
    const q = new URLSearchParams();
    if (kinds.length !== kindsPresent.length) q.set("kinds", kinds.join(","));
    if (roles.length !== PLACE_ROLES.length) q.set("roles", roles.join(","));
    if (period) {
      q.set("from", String(period[0]));
      q.set("to", String(period[1]));
    }
    const p = place ? placeById.get(place) : undefined;
    if (p) q.set("place", p.slug);
    if (traced) q.set("trace", traced.key);
    const s = q.toString();
    const url = `${window.location.pathname}${s ? `?${s}` : ""}`;
    if (url !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(window.history.state, "", url);
  }, [mounted, kinds, roles, period, place, traced, kindsPresent.length, placeById]);

  /* ——— Actions ——— */
  const showPanel = () => {
    if (narrow) window.setTimeout(() => panel.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };
  const selectPlace = useCallback(
    (id: string | null, opts: { centre?: boolean } = {}) => {
      setPlace(id);
      setTrace(null);
      const p = id ? placeById.get(id) : undefined;
      if (p && opts.centre && isPoint(p)) animateTo(centreOn(p, 2.5), 520);
    },
    [placeById, animateTo, centreOn],
  );
  const traceEntry = useCallback(
    (id: string | null) => {
      setTrace(id);
      if (!id) return;
      // Show every association of the traced entry, whatever the filters hid.
      const e = entryById.get(id);
      if (e && !kinds.includes(e.kind)) setKinds((k) => [...k, e.kind]);
      const pts: GeoPoint[] = [];
      for (const l of data.links) if (l.entry === id) {
        const p = placeById.get(l.place);
        if (p && isPoint(p)) pts.push(p);
      }
      if (pts.length) animateTo(fitPoints(pts, home.k * 8), 600);
    },
    [entryById, kinds, data.links, placeById, animateTo, fitPoints, home.k],
  );
  const clearAll = useCallback(() => {
    setPlace(null);
    setTrace(null);
  }, []);
  const reset = () => {
    setKinds(kindsPresent);
    setRoles([...PLACE_ROLES]);
    setPeriod(null);
    clearAll();
    animateTo(home, 520);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (place || trace) && !(e.target as Element)?.closest?.("input")) clearAll();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [place, trace, clearAll]);

  const onKey = (e: React.KeyboardEvent) => {
    if ((e.target as Element).closest("input,button,a,[role=button]") && e.target !== frame.current) return;
    const step = 80;
    const map: Record<string, () => void> = {
      "+": () => zoomBy(1.6, undefined, true),
      "=": () => zoomBy(1.6, undefined, true),
      "-": () => zoomBy(1 / 1.6, undefined, true),
      "0": () => animateTo(home, 520),
      ArrowLeft: () => panBy(step, 0, true),
      ArrowRight: () => panBy(-step, 0, true),
      ArrowUp: () => panBy(0, step, true),
      ArrowDown: () => panBy(0, -step, true),
    };
    const f = map[e.key];
    if (f) {
      e.preventDefault();
      f();
    }
  };

  /* ——— Clustering, in screen space at the current zoom ——— */
  const clusterR = (c: Pick<Cluster, "members" | "weight">) => (c.members.length > 1 ? Math.min(15, 8.5 + 1.2 * Math.sqrt(c.members.length)) : markR(c.weight));
  const clusters = useMemo(() => {
    const sorted = [...points].sort((a, b) => weightOf(b.id) - weightOf(a.id) || a.name.localeCompare(b.name));
    const scr = (p: GeoPoint) => [p.at[0] * view.k + view.x, p.at[1] * view.k + view.y] as const;
    let out: Cluster[] = [];
    // Greedy: the heaviest places lead, and lighter ones within reach join them.
    for (const p of sorted) {
      const w = weightOf(p.id);
      if (pinned.has(p.id)) {
        out.push({ id: p.id, lead: p, members: [p], weight: w });
        continue;
      }
      const [sx, sy] = scr(p);
      const host = out.find((c) => {
        if (pinned.has(c.lead.id)) return false;
        const [cx, cy] = scr(c.lead);
        return Math.hypot(cx - sx, cy - sy) < Math.max(CLUSTER_R, clusterR(c) + markR(w) + 5);
      });
      if (host) {
        host.members.push(p);
        host.weight += w;
      } else out.push({ id: p.id, lead: p, members: [p], weight: w });
    }
    // Then merge groups whose circles overlap, until none do.
    for (let changed = true; changed; ) {
      changed = false;
      outer: for (let i = 0; i < out.length; i++)
        for (let j = i + 1; j < out.length; j++) {
          const a = out[i];
          const b = out[j];
          if (pinned.has(a.lead.id) || pinned.has(b.lead.id)) continue;
          const [ax, ay] = scr(a.lead);
          const [bx, by] = scr(b.lead);
          if (Math.hypot(ax - bx, ay - by) < clusterR(a) + clusterR(b) - 1) {
            const [lead, other] = a.weight >= b.weight ? [a, b] : [b, a];
            lead.members.push(...other.members);
            lead.weight += other.weight;
            out = out.filter((c) => c !== other);
            changed = true;
            break outer;
          }
        }
    }
    return out;
  }, [points, weightOf, view, pinned]);


  /* ——— Labels ——— */
  const level = view.k / Math.max(1e-6, home.k);
  const labels = useMemo(() => {
    // Text is measured in the browser; nothing is labelled in the server render.
    if (!mounted) return new Map<string, { side: string; box: [number, number, number, number]; text: string; size: number; italic?: boolean }>();
    const cands: (LabelCandidate & { text: string; size: number; italic?: boolean; area?: boolean })[] = [];
    const sized = (text: string, size: number, italic = false) => ({ text, size, width: measure(text, size, serif, italic ? 400 : 400) * (italic ? 1.02 : 1), height: size * 1.15 });
    const ranked = [...clusters].sort((a, b) => Number(pinned.has(b.lead.id)) - Number(pinned.has(a.lead.id)) || b.weight - a.weight);
    for (const c of ranked) {
      const sx = c.lead.at[0] * view.k + view.x;
      const sy = c.lead.at[1] * view.k + view.y;
      const sel = c.lead.id === place || c.lead.id === hover;
      const text = c.members.length > 1 ? `${c.lead.name} +${c.members.length - 1}` : c.lead.name;
      const size = sel || pinned.has(c.lead.id) ? 15 : c.weight >= 6 ? 14 : 13;
      cands.push({ id: c.id, x: sx, y: sy, r: clusterR(c), ...sized(text, size, c.lead.kind === "site"), italic: c.lead.kind === "site", force: sel || route.some((p) => p.id === c.lead.id) });
    }
    for (const r of regions) {
      const text = r.name.toUpperCase();
      cands.push({ id: r.id, x: r.at[0] * view.k + view.x, y: r.at[1] * view.k + view.y, r: 0, text, size: 10.5, width: measure(text, 10.5, "ui-sans-serif, system-ui") * 1.25 + 4, height: 13, centred: true, area: true, force: r.id === place });
    }
    const obstacles = clusters.map((c) => ({ x: c.lead.at[0] * view.k + view.x, y: c.lead.at[1] * view.k + view.y, r: clusterR(c) }));
    const blocked: [number, number, number, number][] = [];
    const zb = zoomBox.current;
    if (zb) blocked.push([size.width - zb.offsetWidth - 20, size.height - zb.offsetHeight - 20, size.width, size.height]);
    const limit = Math.round(18 + 16 * Math.log2(Math.max(1, level)));
    const placed = placeLabels(cands, obstacles, { width: size.width, height: size.height }, limit, blocked);
    return new Map([...placed].map(([id, p]) => [id, { ...p, ...cands.find((c) => c.id === id)! }]));
  }, [mounted, clusters, regions, view, size, serif, place, hover, pinned, route, level]);

  const dim = !!trace;
  const selPlace = place ? placeById.get(place) : undefined;
  const total = new Set(active.map((l) => l.entry)).size;

  /* ——— Render ——— */
  const toggleKind = (k: EntityKind) => setKinds((ks) => (ks.includes(k) ? (ks.length > 1 ? ks.filter((x) => x !== k) : ks) : [...ks, k]));
  const toggleRole = (r: PlaceRole) => setRoles((rs) => (rs.includes(r) ? (rs.length > 1 ? rs.filter((x) => x !== r) : rs) : [...rs, r]));
  const onlyGroup = (g: PlaceRole[]) => setRoles((rs) => (rs.length === g.length && g.every((r) => rs.includes(r)) ? [...PLACE_ROLES] : g));

  const arc = (a: GeoPoint, b: GeoPoint, i: number) => {
    const [x0, y0] = a.at;
    const [x1, y1] = b.at;
    const dx = x1 - x0;
    const dy = y1 - y0;
    const bend = (i % 2 ? -1 : 1) * 0.2;
    const cx = (x0 + x1) / 2 - dy * bend;
    const cy = (y0 + y1) / 2 + dx * bend;
    return { d: `M${x0},${y0} Q${cx},${cy} ${x1},${y1}`, mid: [0.25 * x0 + 0.5 * cx + 0.25 * x1, 0.25 * y0 + 0.5 * cy + 0.25 * y1] as [number, number], angle: (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI };
  };

  const [dx0, dy0, dx1, dy1] = data.basemap.detailBox;

  return (
    <div className="grid gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0">
        {/* Filters: this page's own controls */}
        <div className="grid gap-y-3 border-y border-ink py-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="label w-12 shrink-0 text-faint max-sm:hidden">Show</span>
            <div className="-mr-4 flex gap-1 overflow-x-auto pr-4 sm:mr-0 sm:flex-wrap sm:overflow-visible sm:pr-0" role="group" aria-label="Kinds of entry">
              {kindsPresent.map((k) => {
                const on = kinds.includes(k);
                return (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleKind(k)}
                    className={`label inline-flex shrink-0 items-center gap-1.5 border px-2 py-1 ${on ? "border-ink bg-ink text-paper" : "border-rule text-muted hover:border-ink"}`}
                  >
                    <span className={on ? "[&_*]:!fill-paper [&_*]:!stroke-paper" : ""}>
                      <KindSwatch kind={k} size={10} />
                    </span>
                    {KINDS[k].plural}
                    <span className={`label-mono ${on ? "text-paper/70" : "text-faint"}`}>{kindCount.get(k)?.size ?? 0}</span>
                  </button>
                );
              })}
            </div>
            <div className="w-full sm:ml-auto sm:w-64">
              <GeoSearch
                places={data.places}
                entries={data.entries}
                onPlace={(id) => {
                  const p = placeById.get(id)!;
                  selectPlace(id, { centre: true });
                  if (!byPlace.has(id)) {
                    setPeriod(null);
                    setRoles([...PLACE_ROLES]);
                    setKinds(kindsPresent);
                  }
                  if (!isPoint(p)) showPanel();
                }}
                onEntry={(id) => {
                  setPlace(null);
                  traceEntry(id);
                  showPanel();
                }}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
            <span className="label w-12 shrink-0 pt-1 text-faint max-sm:w-full max-sm:pt-0">Places</span>
            <div className="-mr-4 flex min-w-0 flex-1 gap-x-4 gap-y-2 overflow-x-auto pb-1 pr-4 sm:mr-0 sm:flex-wrap sm:overflow-visible sm:pb-0 sm:pr-0" role="group" aria-label="Kinds of association">
              {ROLE_GROUPS.map((g) => ({ ...g, roles: g.roles.filter((r) => rolesPresent.has(r)) }))
                .filter((g) => g.roles.length)
                .map((g) => (
                <div key={g.label} className="flex shrink-0 items-center gap-1 sm:flex-wrap">
                  <button type="button" onClick={() => onlyGroup(g.roles)} className="label-mono mr-0.5 text-faint hover:text-red" title={`Show only: ${g.label.toLowerCase()}`}>
                    {g.label}
                  </button>
                  {g.roles.map((r) => {
                    const on = roles.includes(r);
                    return (
                      <button
                        key={r}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleRole(r)}
                        className={`label border px-2 py-1 ${on ? "border-ink text-ink" : "border-rule text-faint line-through decoration-rule hover:border-ink"}`}
                      >
                        {PLACE_ROLE_META[r].plural} <span className="label-mono text-faint">{roleCount.get(r) ?? 0}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <PeriodControl years={data.years} dates={datedYears} period={period} onChange={setPeriod} scrollPresets />
        </div>

        {/* The map */}
        <div
          ref={frame}
          tabIndex={0}
          role="region"
          aria-label="Geography map. Use plus and minus to zoom, arrow keys to move, 0 to show every place, Escape to clear the selection."
          aria-describedby={`${uid}-status`}
          data-ready={ready || undefined}
          onKeyDown={onKey}
          className="relative mt-4 h-[62svh] min-h-[380px] overflow-hidden border border-ink/50 bg-paper outline-none focus-visible:ring-2 focus-visible:ring-red sm:h-[min(70svh,720px)] sm:min-h-[500px]"
        >
          <p id={`${uid}-status`} className="sr-only" aria-live="polite">
            {points.length + areas.length} places, {total} entries{period ? `, ${period[0]} to ${period[1]}` : ""}.
            {selPlace ? ` ${selPlace.name} selected.` : ""}
            {traced ? ` Tracing ${traced.title}.` : ""}
          </p>
          <svg
            ref={svg}
            width={size.width}
            height={size.height}
            className={`absolute inset-0 h-full w-full touch-none select-none ${moving ? "cursor-grabbing" : "cursor-grab"}`}
            style={{ ["--inv" as string]: String(1 / initialT.k) }}
            role="group"
            aria-label={`${points.length} located places`}
            onClick={(e) => {
              if (svg.current?.dataset.dragging) return;
              if (!(e.target as Element).closest("[data-id]")) clearAll();
            }}
            onPointerLeave={() => setHover(null)}
          >
            <defs>
              {/* The coarse world map everywhere except where the detailed one is drawn. */}
              <clipPath id={`${uid}-outside`} clipPathUnits="userSpaceOnUse">
                <path clipRule="evenodd" d={`M-10,-10H${data.basemap.width + 10}V${data.basemap.height + 10}H-10Z M${dx0},${dy0}H${dx1}V${dy1}H${dx0}Z`} />
              </clipPath>
            </defs>
            <g ref={world} transform={`matrix(${initialT.k} 0 0 ${initialT.k} ${initialT.x} ${initialT.y})`}>
              {/* Base map: the sea, a graticule, the land. No modern borders. */}
              <g aria-hidden="true">
                <path d={data.basemap.sphere} fill={C.sheet} stroke={C.rule} vectorEffect="non-scaling-stroke" />
                <path d={data.basemap.graticule} fill="none" stroke={C.ruleSoft} strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
                <path d={land.land} fill="#E5DED0" clipPath={`url(#${uid}-outside)`} />
                <path d={land.detail} fill="#E5DED0" />
              </g>

              {/* Regions: a name across the area, never a point */}
              <g>
                {regions.map((r) => {
                  const lab = labels.get(r.id);
                  if (!lab) return null;
                  const on = r.id === place;
                  return (
                    <text
                      key={r.id}
                      data-id={r.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={on}
                      aria-label={`${r.name}, region. ${weightOf(r.id)} entries.`}
                      onClick={(ev) => {
                        if (svg.current?.dataset.dragging) return;
                        ev.stopPropagation();
                        selectPlace(on ? null : r.id);
                        if (!on) showPanel();
                      }}
                      onKeyDown={(ev) => {
                        if (ev.key === "Enter" || ev.key === " ") {
                          ev.preventDefault();
                          selectPlace(on ? null : r.id);
                        }
                      }}
                      className="cursor-pointer font-sans outline-none focus-visible:underline"
                      fontSize={10.5}
                      letterSpacing="0.22em"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={on ? C.red : C.muted}
                      opacity={dim ? 0.3 : 0.9}
                      style={{ transform: `translate(${r.at[0]}px, ${r.at[1]}px) scale(var(--inv))` }}
                    >
                      {r.name.toUpperCase()}
                    </text>
                  );
                })}
              </g>

              {/* A traced entry's route, in date order */}
              {route.length > 1 && (
                <g aria-hidden="true" fill="none">
                  {route.slice(1).map((b, i) => {
                    const a = route[i];
                    const { d, mid, angle } = arc(a, b, i);
                    return (
                      <g key={`${a.id}-${b.id}-${i}`}>
                        <path d={d} stroke={C.red} strokeWidth={1.5} strokeOpacity={0.85} vectorEffect="non-scaling-stroke" />
                        <path d="M-4.5,-3.4 L0,0 L-4.5,3.4" stroke={C.red} strokeWidth={1.4} style={{ transform: `translate(${mid[0]}px, ${mid[1]}px) scale(var(--inv)) rotate(${angle}deg)` }} />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Places and clusters */}
              <g>
                {[...clusters]
                  // Lightest first; groups above single places; the selection and a traced route on top.
                  .sort((a, b) => Number(pinned.has(a.lead.id)) - Number(pinned.has(b.lead.id)) || Number(a.members.length > 1) - Number(b.members.length > 1) || a.weight - b.weight)
                  .map((c) => {
                    const [x, y] = c.lead.at;
                    const many = c.members.length > 1;
                    const r = clusterR(c);
                    const isSel = c.lead.id === place;
                    const onRoute = stationNumbers.has(c.lead.id);
                    const faded = dim && !onRoute;
                    const isHover = hover === c.id;
                    const names = c.members.map((m) => m.name);
                    return (
                      <g
                        key={c.id}
                        data-id={c.id}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSel}
                        aria-label={many ? `${names.length} places: ${names.slice(0, 6).join(", ")}${names.length > 6 ? "…" : ""}. Zoom in.` : `${c.lead.name}, ${c.weight} ${c.weight === 1 ? "entry" : "entries"}.`}
                        onPointerEnter={(ev) => ev.pointerType === "mouse" && setHover(c.id)}
                        onPointerLeave={(ev) => ev.pointerType === "mouse" && setHover((h) => (h === c.id ? null : h))}
                        onFocus={() => setHover(c.id)}
                        onBlur={() => setHover((h) => (h === c.id ? null : h))}
                        onClick={(ev) => {
                          if (svg.current?.dataset.dragging) return;
                          ev.stopPropagation();
                          if (many) animateTo(fitPoints(c.members, current.current.k * 6), 520);
                          else {
                            selectPlace(isSel ? null : c.lead.id);
                            if (!isSel) showPanel();
                          }
                        }}
                        onKeyDown={(ev) => {
                          if (ev.key === "Enter" || ev.key === " ") {
                            ev.preventDefault();
                            ev.stopPropagation();
                            if (many) animateTo(fitPoints(c.members, current.current.k * 6), 520);
                            else selectPlace(isSel ? null : c.lead.id);
                          }
                        }}
                        className="cursor-pointer outline-none [&:focus-visible_.ring]:opacity-100"
                        style={{ transform: `translate(${x}px, ${y}px) scale(var(--inv))`, opacity: faded ? 0.22 : 1, transition: "opacity .25s" }}
                      >
                        <circle r={many ? r + 3 : Math.max(9, r + 4)} fill="transparent" />
                        <circle className="ring" r={r + 5} fill="none" stroke={C.red} strokeWidth={1.2} opacity={isSel ? 1 : 0} />
                        {many ? (
                          <>
                            <circle r={r} fill={C.sheet} stroke={isHover ? C.red : C.ink} strokeWidth={1.3} />
                            <circle r={r - 3} fill="none" stroke={C.ink} strokeOpacity={0.35} strokeWidth={0.8} />
                            <text className="font-sans" fontSize={10} fontWeight={600} textAnchor="middle" dominantBaseline="central" fill={C.ink}>
                              {c.members.length}
                            </text>
                          </>
                        ) : c.lead.kind === "site" ? (
                          <rect x={-r * 0.8} y={-r * 0.8} width={r * 1.6} height={r * 1.6} transform="rotate(45)" fill={isSel || onRoute ? C.red : C.sheet} stroke={isSel || isHover || onRoute ? C.red : C.ink} strokeWidth={1.4} />
                        ) : (
                          <circle r={r} fill={isSel || onRoute ? C.red : C.ink} fillOpacity={isSel || onRoute ? 1 : 0.86} stroke={isHover ? C.red : C.sheet} strokeWidth={1.3} />
                        )}
                        {onRoute && (
                          <text x={r + 4} y={-r - 2} className="font-sans" fontSize={10} fontWeight={600} fill={C.red} stroke={C.sheet} strokeWidth={3} paintOrder="stroke">
                            {stationNumbers.get(c.lead.id)!.join(", ")}
                          </text>
                        )}
                      </g>
                    );
                  })}
              </g>

              {/* Place names */}
              <g aria-hidden="true" className="pointer-events-none">
                {clusters.map((c) => {
                  const p = labels.get(c.id);
                  if (!p) return null;
                  const [x, y] = c.lead.at;
                  const sx = x * view.k + view.x;
                  const sy = y * view.k + view.y;
                  const anchor = p.side === "right" ? "start" : p.side === "left" ? "end" : "middle";
                  const lx = p.side === "right" ? p.box[0] - sx : p.side === "left" ? p.box[2] - sx : (p.box[0] + p.box[2]) / 2 - sx;
                  const ly = p.box[1] - sy + p.size * 0.86;
                  const on = c.lead.id === place || pinned.has(c.lead.id);
                  return (
                    <g key={c.id} style={{ transform: `translate(${x}px, ${y}px) scale(var(--inv))`, opacity: moving && !on ? 0 : dim && !stationNumbers.has(c.lead.id) ? 0.25 : 1, transition: "opacity .2s" }}>
                      <text
                        x={lx}
                        y={ly}
                        textAnchor={anchor}
                        fontSize={p.size}
                        fontFamily={SERIF}
                        fontStyle={p.italic ? "italic" : undefined}
                        fill={c.lead.id === place ? C.red : C.ink}
                        stroke={C.sheet}
                        strokeWidth={4}
                        strokeLinejoin="round"
                        paintOrder="stroke"
                      >
                        {p.text}
                      </text>
                    </g>
                  );
                })}
              </g>
            </g>
          </svg>

          {points.length + areas.length === 0 && (
            <p className="absolute inset-0 grid place-items-center p-8 text-center font-serif text-lg italic text-muted">No places match these filters. Widen the period or show more kinds of association.</p>
          )}

          {/* Zoom */}
          <div ref={zoomBox} role="group" aria-label="Zoom" className="absolute bottom-3 right-3 z-10 flex flex-col border border-ink bg-paper-warm">
            <ZoomButton label="Zoom in" onClick={() => zoomBy(1.6, undefined, true)}>
              <path d="M7 2v10M2 7h10" />
            </ZoomButton>
            <ZoomButton label="Zoom out" onClick={() => zoomBy(1 / 1.6, undefined, true)}>
              <path d="M2 7h10" />
            </ZoomButton>
            <ZoomButton label="Show every place" onClick={() => animateTo(wholeMap, 520)}>
              <circle cx="7" cy="7" r="5.2" />
              <path d="M1.8 7h10.4M7 1.8c2.2 2.6 2.2 7.8 0 10.4M7 1.8c-2.2 2.6-2.2 7.8 0 10.4" />
            </ZoomButton>
          </div>
          <div className="absolute left-3 top-3 z-10 flex gap-1">
            <button type="button" onClick={() => animateTo(europe, 520)} className="label border border-ink/60 bg-paper-warm/90 px-2 py-1 text-muted hover:border-ink hover:text-ink">
              Europe
            </button>
            <button type="button" onClick={() => animateTo(wholeMap, 520)} className="label border border-ink/60 bg-paper-warm/90 px-2 py-1 text-muted hover:border-ink hover:text-ink">
              World
            </button>
            <button type="button" onClick={reset} className="label border border-transparent px-2 py-1 text-faint hover:text-red">
              Reset
            </button>
          </div>
          <p className="label-mono pointer-events-none absolute bottom-3 left-3 z-10 hidden bg-paper/85 px-1.5 text-faint sm:block" aria-hidden="true">
            Scroll or pinch to zoom · drag to move · numbers mark groups of places
          </p>
        </div>
        <p className="mt-2 font-sans text-[0.8rem] leading-snug text-faint">
          Coastlines from Natural Earth. Present-day borders are not drawn: they would be wrong for most of the period. Each place notes the state it lay in at the time.
        </p>
      </div>

      {/* The gazetteer panel */}
      <aside ref={panel} aria-label="Places and entries" className="scroll-mt-24 lg:max-h-[calc(min(70svh,720px)+11rem)] lg:overflow-y-auto">
        {traced ? (
          <TracePanel entry={traced} stations={stations} placeById={placeById} onPlace={(id) => selectPlace(id, { centre: true })} onClose={() => setTrace(null)} />
        ) : selPlace ? (
          <PlacePanel place={selPlace} links={byPlace.get(selPlace.id) ?? []} allLinks={data.links.filter((l) => l.place === selPlace.id)} entryById={entryById} onTrace={traceEntry} onClose={() => setPlace(null)} />
        ) : (
          <IndexPanel
            points={points}
            areas={areas}
            weightOf={weightOf}
            byPlace={byPlace}
            unlocated={data.unlocated}
            onPlace={(id) => {
              selectPlace(id, { centre: true });
            }}
          />
        )}
      </aside>
    </div>
  );
}

function ZoomButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="grid h-9 w-9 place-items-center border-b border-rule last:border-b-0 hover:bg-paper-deep">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}

function PanelHead({ kicker, onClose }: { kicker: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between border-t-[3px] border-ink pt-2.5">
      <p className="label text-faint">{kicker}</p>
      <button type="button" onClick={onClose} className="label text-faint hover:text-red" aria-label="Close">
        Close ×
      </button>
    </div>
  );
}

function IndexPanel({
  points,
  areas,
  weightOf,
  byPlace,
  unlocated,
  onPlace,
}: {
  points: GeoPoint[];
  areas: GeoPoint[];
  weightOf: (id: string) => number;
  byPlace: Map<string, GeoLink[]>;
  unlocated: number;
  onPlace: (id: string) => void;
}) {
  const top = [...points].sort((a, b) => weightOf(b.id) - weightOf(a.id) || a.name.localeCompare(b.name)).slice(0, 14);
  const summary = (id: string) => {
    const rs = new Set((byPlace.get(id) ?? []).map((l) => l.role));
    return PLACE_ROLES.filter((r) => rs.has(r))
      .map((r) => PLACE_ROLE_META[r].plural.toLowerCase())
      .join(", ");
  };
  return (
    <div>
      <h2 className="label border-t-[3px] border-ink pt-2.5 font-sans">Most associated places</h2>
      <ol className="mt-2">
        {top.map((p, i) => (
          <li key={p.id} className="border-b border-rule">
            <button type="button" onClick={() => onPlace(p.id)} className="group grid w-full grid-cols-[1.5rem_1fr_auto] items-baseline gap-2 py-2 text-left">
              <span className="label-mono text-faint">{i + 1}</span>
              <span className="min-w-0">
                <span className="font-serif text-[1.1rem] leading-tight group-hover:text-red">{p.name}</span>
                <span className="block truncate font-sans text-[0.78rem] text-faint">{summary(p.id)}</span>
              </span>
              <span className="numeral text-red">{weightOf(p.id)}</span>
            </button>
          </li>
        ))}
      </ol>
      {areas.length > 0 && (
        <>
          <h2 className="label mt-7 border-t border-ink pt-2.5 font-sans">Regions and states</h2>
          <p className="mt-1 font-sans text-[0.8rem] leading-snug text-faint">Associations with a whole area. Regions are named on the map; states are not drawn, since their borders changed.</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {areas.map((a) => (
              <li key={a.id}>
                <button type="button" onClick={() => onPlace(a.id)} className="label border border-rule px-2 py-1 text-muted hover:border-ink hover:text-ink">
                  {a.name} <span className="label-mono text-faint">{weightOf(a.id)}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="mt-7 border-t border-rule pt-3 font-sans text-[0.8rem] leading-snug text-faint">
        Select a place for the people, texts and events associated with it, or search for an entry to trace its places in order.
        {unlocated > 0 && ` ${unlocated} place ${unlocated === 1 ? "wording" : "wordings"} in published entries ${unlocated === 1 ? "is" : "are"} not on the map: they name no single place, or the gazetteer does not hold them yet.`}
      </p>
    </div>
  );
}

function PlacePanel({
  place,
  links,
  allLinks,
  entryById,
  onTrace,
  onClose,
}: {
  place: GeoPoint;
  links: GeoLink[];
  allLinks: GeoLink[];
  entryById: Map<string, GeoEntry>;
  onTrace: (id: string) => void;
  onClose: () => void;
}) {
  const hidden = allLinks.length - links.length;
  const groups = PLACE_ROLES.map((r) => ({ role: r, links: links.filter((l) => l.role === r).sort((a, b) => (a.yearStart ?? 0) - (b.yearStart ?? 0)) })).filter((g) => g.links.length);
  const now = place.modernName ? `Now ${place.modernName}${place.country ? `, ${place.country}` : ""}` : place.country;
  return (
    <div>
      <PanelHead kicker={PLACE_KIND_LABELS[place.kind]} onClose={onClose} />
      <h2 className="display mt-2 text-[2rem] leading-none">{place.name}</h2>
      {now && <p className="label mt-2 text-muted">{now}</p>}
      {place.historicalNote && <p className="mt-3 font-serif text-[1.02rem] leading-snug text-ink-warm">{place.historicalNote}</p>}
      {place.aliases.length > 0 && <p className="mt-2 font-sans text-[0.8rem] text-faint">Also: {place.aliases.join(" · ")}</p>}
      {groups.map((g) => (
        <section key={g.role} className="mt-5">
          <h3 className="label border-b border-ink pb-1 text-ink">{PLACE_ROLE_META[g.role].label}</h3>
          <ul>
            {g.links.map((l) => (
              <LinkRow key={l.id} link={l} entry={entryById.get(l.entry)!} onTrace={onTrace} />
            ))}
          </ul>
        </section>
      ))}
      {hidden > 0 && <p className="mt-4 font-sans text-[0.8rem] text-faint">{hidden} more {hidden === 1 ? "association is" : "associations are"} hidden by the filters.</p>}
      {place.wikidataId && (
        <p className="mt-6 border-t border-rule pt-2 font-sans text-[0.75rem] text-faint">
          Location:{" "}
          <a className="underline decoration-rule underline-offset-2 hover:text-red" href={`https://www.wikidata.org/wiki/${place.wikidataId}`} rel="noreferrer" target="_blank">
            Wikidata {place.wikidataId}
          </a>
        </p>
      )}
    </div>
  );
}

function LinkRow({ link, entry, onTrace }: { link: GeoLink; entry: GeoEntry; onTrace: (id: string) => void }) {
  return (
    <li className="border-b border-rule py-2.5">
      <div className="flex items-baseline gap-2">
        <span className="translate-y-[1px]">
          <KindSwatch kind={entry.kind} size={10} />
        </span>
        <Link href={entry.href} className="min-w-0 flex-1 font-serif text-[1.05rem] leading-tight hover:text-red">
          {entry.title}
        </Link>
        <span className="label-mono shrink-0 text-faint">{years(link)}</span>
      </div>
      {link.derived && link.wording && <p className="mt-1 pl-[18px] font-sans text-[0.78rem] text-faint">From the entry: “{link.wording}”</p>}
      {link.note && <p className="mt-1 pl-[18px] font-serif text-[0.95rem] leading-snug text-muted">{link.note}</p>}
      <div className="mt-1 flex flex-wrap gap-x-3 pl-[18px]">
        {link.source && (
          <Link href={link.source.href} className="font-sans text-[0.75rem] text-faint underline decoration-rule underline-offset-2 hover:text-red">
            {link.source.title}
            {link.source.locator ? `, ${link.source.locator}` : ""}
          </Link>
        )}
        <button type="button" onClick={() => onTrace(entry.id)} className="label text-faint hover:text-red">
          Trace on map →
        </button>
      </div>
    </li>
  );
}

function TracePanel({
  entry,
  stations,
  placeById,
  onPlace,
  onClose,
}: {
  entry: GeoEntry;
  stations: GeoLink[];
  placeById: Map<string, GeoPoint>;
  onPlace: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div>
      <PanelHead kicker={`${KINDS[entry.kind].label} · places in order`} onClose={onClose} />
      <h2 className="display mt-2 text-[1.9rem] leading-none">
        <Link href={entry.href} className="hover:text-red">
          {entry.title}
        </Link>
      </h2>
      {entry.subtitle && <p className="mt-2 font-serif italic text-muted">{entry.subtitle}</p>}
      <ol className="mt-4">
        {stations.map((s, i) => {
          const p = placeById.get(s.place)!;
          return (
            <li key={s.id} className="grid grid-cols-[1.6rem_1fr] gap-x-2 border-b border-rule py-2.5">
              <span className="numeral text-red">{i + 1}</span>
              <div className="min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <button type="button" onClick={() => onPlace(p.id)} className="text-left font-serif text-[1.08rem] leading-tight hover:text-red">
                    {p.name}
                  </button>
                  <span className="label-mono shrink-0 text-faint">{years(s)}</span>
                </div>
                <p className="label mt-0.5 text-muted">{PLACE_ROLE_META[s.role].label}</p>
                {s.derived && s.wording && <p className="mt-1 font-sans text-[0.78rem] text-faint">From the entry: “{s.wording}”</p>}
                {s.note && <p className="mt-1 font-serif text-[0.95rem] leading-snug text-muted">{s.note}</p>}
                {s.source && (
                  <Link href={s.source.href} className="mt-1 inline-block font-sans text-[0.75rem] text-faint underline decoration-rule underline-offset-2 hover:text-red">
                    {s.source.title}
                    {s.source.locator ? `, ${s.source.locator}` : ""}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-4">
        <Link href={entry.href} className="label text-red hover:underline">
          Read the entry →
        </Link>
      </p>
    </div>
  );
}


