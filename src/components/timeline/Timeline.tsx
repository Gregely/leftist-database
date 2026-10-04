"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KINDS, TENDENCY_COLOR_VALUES, type TendencyColor } from "@/lib/content/model";
import type { Preview, TimelineItem, TimelineLane } from "@/lib/data/events";

const ZOOMS = [
  { key: "century", label: "Century", px: 5, major: 50, minor: 10 },
  { key: "half", label: "Half-century", px: 11, major: 10, minor: 5 },
  { key: "decade", label: "Decade", px: 30, major: 5, minor: 1 },
] as const;
type ZoomKey = (typeof ZOOMS)[number]["key"];

const LANES: { key: TimelineLane; label: string }[] = [
  { key: "event", label: "Events" },
  { key: "text", label: "Texts" },
  { key: "thinker", label: "Thinkers" },
  { key: "tendency", label: "Tendencies" },
];

/** Lane colours: the bookcloth of each area. */
const LANE_TONE: Record<TimelineLane, string> = {
  event: "var(--color-umber)",
  text: "var(--color-blue)",
  thinker: "var(--color-ink)",
  tendency: "var(--color-olive)",
};

const FROM = 1770;
const TO = 2030;
const ROW = 30;
const LABEL_W = 116;

/** Greedy row packing so labels never overlap. */
function pack(items: TimelineItem[], x: (y: number) => number, widthOf: (i: TimelineItem) => number) {
  const rowsEnd: number[] = [];
  const placed = new Map<string, number>();
  for (const it of items) {
    const start = x(it.year);
    const end = start + widthOf(it);
    let row = rowsEnd.findIndex((e) => e + 10 < start);
    if (row === -1) {
      row = rowsEnd.length;
      rowsEnd.push(end);
    } else rowsEnd[row] = end;
    placed.set(it.id, row);
  }
  return { rows: Math.max(1, rowsEnd.length), placed };
}

export interface TimelineProps {
  items: TimelineItem[];
  periods: readonly { slug: string; label: string; from: number; to: number }[];
  initial: { zoom?: string; focus?: number; item?: string; from?: number; to?: number };
}

export function Timeline({ items, periods, initial }: TimelineProps) {
  const fitZoom: ZoomKey | undefined =
    initial.from != null && initial.to != null ? (initial.to - initial.from > 60 ? "half" : "decade") : undefined;
  const [zoom, setZoom] = useState<ZoomKey>(
    (ZOOMS.find((z) => z.key === initial.zoom)?.key as ZoomKey) ?? fitZoom ?? "half",
  );
  const [lanes, setLanes] = useState<TimelineLane[]>(LANES.map((l) => l.key));
  const [selected, setSelected] = useState<TimelineItem | null>(
    items.find((i) => i.slug === initial.item) ?? null,
  );
  const [preview, setPreview] = useState<Preview | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const z = ZOOMS.find((x) => x.key === zoom)!;
  const x = useCallback((year: number) => LABEL_W + (year - FROM) * z.px, [z.px]);
  const width = x(TO) + 40;

  const scrollToYear = useCallback(
    (year: number, smooth = true) => {
      const el = scroller.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: Math.max(0, x(year) - el.clientWidth / 2), behavior: smooth && !reduce ? "smooth" : "auto" });
    },
    [x],
  );

  // Initial position.
  useEffect(() => {
    const year =
      initial.from != null && initial.to != null
        ? (initial.from + initial.to) / 2
        : initial.focus ?? items.find((i) => i.slug === initial.item)?.year ?? 1848;
    scrollToYear(year, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the centre year stable when zooming.
  const centreYear = useRef<number | null>(null);
  function changeZoom(next: ZoomKey) {
    const el = scroller.current;
    if (el) centreYear.current = FROM + (el.scrollLeft + el.clientWidth / 2 - LABEL_W) / z.px;
    setZoom(next);
  }
  useEffect(() => {
    if (centreYear.current != null) {
      scrollToYear(centreYear.current, false);
      centreYear.current = null;
    }
  }, [zoom, scrollToYear]);

  // Load context for the selected item.
  useEffect(() => {
    if (!selected) {
      setPreview(null);
      return;
    }
    const ctrl = new AbortController();
    fetch(`/api/preview/${selected.id}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => setPreview(p))
      .catch(() => {});
    const url = new URL(window.location.href);
    url.searchParams.set("item", selected.slug);
    url.searchParams.set("focus", String(selected.year));
    window.history.replaceState(null, "", url);
    return () => ctrl.abort();
  }, [selected]);

  const visible = useMemo(() => items.filter((i) => lanes.includes(i.lane)), [items, lanes]);

  const laneLayouts = useMemo(
    () =>
      LANES.filter((l) => lanes.includes(l.key)).map((l) => {
        const laneItems = visible.filter((i) => i.lane === l.key);
        const widthOf = (i: TimelineItem) => {
          const label = Math.min(300, i.title.length * (i.lane === "text" ? 7.4 : 7.2) + 28);
          if (i.lane === "thinker" || i.lane === "tendency") {
            const span = ((i.yearEnd ?? 2026) - i.year) * z.px;
            return Math.max(span, label);
          }
          return label;
        };
        const { rows, placed } = pack(laneItems, x, widthOf);
        return { lane: l, items: laneItems, rows, placed };
      }),
    [visible, lanes, x, z.px],
  );

  const ticks = useMemo(() => {
    const out: { year: number; major: boolean }[] = [];
    for (let y = FROM; y <= TO; y += z.minor) out.push({ year: y, major: y % z.major === 0 });
    return out;
  }, [z]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setSelected(null);
  }

  return (
    <div onKeyDown={onKeyDown}>
      {/* Controls */}
      <div className="sticky top-14 z-30 border-y border-ink bg-paper/95 backdrop-blur-[3px] lg:top-[60px]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-8 gap-y-2 px-4 py-2.5 sm:px-8 lg:px-10">
          <div role="group" aria-label="Zoom" className="hidden items-center gap-1 md:flex">
            <span className="label mr-2 text-faint">Zoom</span>
            {ZOOMS.map((zz) => (
              <button
                key={zz.key}
                type="button"
                aria-pressed={zoom === zz.key}
                onClick={() => changeZoom(zz.key)}
                className={`label border px-2 py-1 transition-colors ${zoom === zz.key ? "border-ink bg-ink text-paper" : "border-rule hover:border-ink"}`}
              >
                {zz.label}
              </button>
            ))}
          </div>
          <div role="group" aria-label="Show lanes" className="flex flex-wrap items-center gap-1">
            <span className="label mr-2 text-faint">Show</span>
            {LANES.map((l) => {
              const on = lanes.includes(l.key);
              return (
                <button
                  key={l.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setLanes((ls) => (on ? ls.filter((k) => k !== l.key) : [...ls, l.key]))}
                  className={`label inline-flex items-center gap-1.5 border px-2 py-1 transition-colors ${on ? "border-ink text-ink" : "border-rule text-faint hover:border-ink"}`}
                >
                  <span aria-hidden="true" className="inline-block h-2 w-2" style={{ background: on ? LANE_TONE[l.key] : "transparent", outline: `1px solid ${LANE_TONE[l.key]}` }} />
                  {l.label}
                </button>
              );
            })}
          </div>
          <div className="hidden items-center gap-1 xl:flex">
            <span className="label mr-2 text-faint">Jump</span>
            {periods.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => scrollToYear((p.from + Math.min(p.to, 2026)) / 2)}
                className="label-mono border border-transparent px-1.5 py-1 text-muted hover:border-rule hover:text-red"
                title={p.label}
              >
                {p.from}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal track (tablet & desktop) */}
      <div className="relative hidden md:block">
        <div
          ref={scroller}
          className="scrollbar-thin overflow-x-auto border-b border-ink"
          tabIndex={0}
          aria-label="Timeline track. Scroll horizontally; use Tab to move between entries."
        >
          <div className="relative" style={{ width }}>
            {/* Ruler */}
            <div className="relative h-14 border-b border-ink">
              {ticks.map((t) => (
                <div key={t.year} className="absolute bottom-0" style={{ left: x(t.year) }} aria-hidden="true">
                  <div className={`w-px ${t.major ? "h-4 bg-ink" : "h-2 bg-rule"}`} />
                  {t.major && (
                    <span className="label-mono absolute bottom-5 left-0 -translate-x-1/2 text-muted">{t.year}</span>
                  )}
                </div>
              ))}
            </div>
            {/* Period bands */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 top-14" aria-hidden="true">
              {periods.map((p, i) => (
                <div
                  key={p.slug}
                  className={`absolute inset-y-0 border-l border-dashed border-rule ${i % 2 ? "bg-beige/20" : ""}`}
                  style={{ left: x(p.from), width: (Math.min(p.to, TO) - p.from + 1) * z.px }}
                >
                  <span className="label absolute bottom-2 left-2 whitespace-nowrap text-faint/80">{p.label}</span>
                </div>
              ))}
            </div>

            {laneLayouts.map(({ lane, items: laneItems, rows, placed }) => (
              <section key={lane.key} aria-label={lane.label} className="relative border-b border-rule" style={{ height: rows * ROW + 26 }}>
                <h3
                  className="label sticky left-0 z-10 inline-flex items-center gap-1.5 bg-paper px-4 py-1.5 font-sans text-faint sm:px-8 lg:px-10"
                  style={{ width: LABEL_W }}
                >
                  <span aria-hidden="true" className="inline-block h-2 w-2" style={{ background: LANE_TONE[lane.key] }} />
                  {lane.label}
                </h3>
                {laneItems.map((it) => {
                  const row = placed.get(it.id) ?? 0;
                  const top = 18 + row * ROW;
                  const on = selected?.id === it.id;
                  const spanW = ((it.yearEnd ?? (it.lane === "thinker" ? it.year : 2026)) - it.year) * z.px;
                  return (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => setSelected(it)}
                      aria-pressed={on}
                      aria-label={`${it.year}${it.yearEnd ? `–${it.yearEnd}` : ""}: ${it.title} (${KINDS[it.kind].label})`}
                      className="group absolute flex h-6 items-center text-left"
                      style={{ left: x(it.year), top }}
                    >
                      {it.lane === "thinker" || it.lane === "tendency" ? (
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-1/2 h-[7px] -translate-y-1/2 transition-colors"
                          style={{
                            width: Math.max(4, spanW),
                            background:
                              it.lane === "tendency"
                                ? `${TENDENCY_COLOR_VALUES[(it.tag as TendencyColor) ?? "ink"] ?? "#16161A"}${on ? "" : "33"}`
                                : on
                                  ? "#BC2B1C"
                                  : "#DDD5C4",
                            borderLeft: `2px solid ${on ? "#BC2B1C" : "#16161A"}`,
                          }}
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className={`absolute left-0 top-1/2 block -translate-x-1/2 -translate-y-1/2 transition-colors ${it.lane === "event" ? "h-2.5 w-2.5 rotate-45 border-umber" : "h-3 w-2 border-blue"} border ${on ? "!border-red bg-red" : it.featured ? (it.lane === "event" ? "bg-umber" : "bg-blue") : "bg-paper group-hover:bg-ink"}`}
                        />
                      )}
                      <span
                        className={`relative ml-2 whitespace-nowrap ${it.lane === "thinker" || it.lane === "tendency" ? "-mt-[22px] ml-0.5 text-[0.82rem]" : "pl-1.5 text-[0.86rem]"} ${it.lane === "text" ? "font-serif italic" : it.lane === "event" ? "font-serif" : "font-sans"} ${on ? "text-red" : "text-ink group-hover:text-red"}`}
                      >
                        {it.title}
                      </span>
                    </button>
                  );
                })}
              </section>
            ))}
          </div>
        </div>
        <p className="label mt-2 px-4 text-faint sm:px-8 lg:px-10">
          Scroll the track sideways · select any entry for its context · Esc closes the panel
        </p>
      </div>

      {/* Vertical list (phones) */}
      <ol className="px-4 md:hidden">
        {visible
          .filter((i) => i.lane !== "tendency")
          .map((it, idx, arr) => {
            const decade = Math.floor(it.year / 10) * 10;
            const newDecade = idx === 0 || Math.floor(arr[idx - 1].year / 10) * 10 !== decade;
            return (
              <li key={it.id}>
                {newDecade && <p className="numeral mt-8 border-b border-ink pb-1 text-3xl text-red">{decade}s</p>}
                <button
                  type="button"
                  onClick={() => setSelected(it)}
                  className="grid w-full grid-cols-[3.2rem_1fr] gap-3 border-b border-rule py-3 text-left"
                >
                  <span className="label-mono pt-1 text-muted">{it.year}</span>
                  <span>
                    <span className="label flex items-center gap-1.5 text-faint">
                      <span aria-hidden="true" className="inline-block h-1.5 w-1.5" style={{ background: LANE_TONE[it.lane] }} />
                      {KINDS[it.kind].label}
                    </span>
                    <span className={`text-lg leading-snug ${it.lane === "text" ? "font-serif italic" : "font-serif"} ${selected?.id === it.id ? "text-red" : ""}`}>
                      {it.title}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
      </ol>

      {/* Context panel */}
      {selected && (
        <aside
          aria-label={`Context: ${selected.title}`}
          className="fixed inset-x-0 bottom-14 z-40 max-h-[65vh] overflow-y-auto border-t-[3px] border-ink bg-paper-warm p-5 shadow-[0_-8px_0_0_rgba(22,22,26,0.06)] animate-enter md:inset-x-auto md:bottom-20 md:right-6 md:top-auto md:max-h-[calc(100vh-12rem)] md:w-[24rem] md:border md:border-t-[3px] lg:bottom-6"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="label text-red">
              {KINDS[selected.kind].label}
              {selected.tag && selected.lane === "event" ? ` · ${selected.tag}` : ""}
            </p>
            <button type="button" onClick={() => setSelected(null)} className="label text-faint hover:text-ink" aria-label="Close panel">
              ✕
            </button>
          </div>
          <p className="numeral mt-2 text-[2.6rem] leading-none text-red">
            {selected.year}
            {selected.yearEnd && selected.yearEnd !== selected.year ? `–${selected.yearEnd}` : ""}
          </p>
          <h2 className="mt-1 font-serif text-[1.8rem] leading-tight">{selected.title}</h2>
          {preview?.detail && <p className="label mt-2 text-faint">{preview.detail}</p>}
          <p className="mt-3 font-serif text-[1.02rem] leading-snug text-ink-warm">{selected.summary}</p>
          {preview && Object.keys(preview.groups).length > 0 && (
            <div className="mt-4 space-y-3 border-t border-rule pt-3">
              {Object.entries(preview.groups).map(([kind, rels]) => (
                <div key={kind}>
                  <p className="label text-faint">{KINDS[kind as keyof typeof KINDS].plural}</p>
                  <ul className="mt-1 space-y-0.5">
                    {rels.map((r) => (
                      <li key={r.relationshipId} className="text-sm">
                        <span className="rel">{r.label} </span>
                        <Link href={r.href} className="link-inline">
                          {r.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <Link href={selected.href} className="btn btn-red mt-5 w-full justify-between">
            Open entry <span aria-hidden="true">→</span>
          </Link>
        </aside>
      )}
    </div>
  );
}
