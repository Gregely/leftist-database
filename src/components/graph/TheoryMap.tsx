"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useId, useMemo, useState } from "react";
import { KINDS, RELATIONSHIP_TYPES, TENDENCY_COLOR_VALUES, type RelationshipFamily, type TendencyColor } from "@/lib/content/model";
import type { Layout, LayoutNode } from "@/lib/graph/layout";
import type { GraphEdge } from "@/lib/data/types";

const FAMILY_STYLE: Record<RelationshipFamily, { stroke: string; dash?: string; label: string }> = {
  influence: { stroke: "#202020", label: "Influenced / developed" },
  critique: { stroke: "#B51F2A", dash: "5 4", label: "Critiqued / rejected" },
  response: { stroke: "#5C574F", dash: "1.5 3.5", label: "Responded to" },
  affinity: { stroke: "#53624B", label: "Associated / related" },
  structure: { stroke: "#A79F8E", dash: "2 2", label: "Belongs to" },
};

function lifespan(n: LayoutNode) {
  if (n.yearStart == null) return null;
  if (n.kind === "thinker") return n.yearEnd ? `${n.yearStart}–${n.yearEnd}` : `b. ${n.yearStart}`;
  return n.yearEnd && n.yearEnd !== n.yearStart ? `${n.yearStart}–${n.yearEnd}` : `${n.yearStart}`;
}

/** A gently curved path between two points; curvature alternates for readability. */
function arc(a: LayoutNode, b: LayoutNode, seed: string) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) | 0;
  const bend = (h % 2 === 0 ? 1 : -1) * Math.min(42, len * 0.14);
  const mx = (a.x + b.x) / 2 - (dy / len) * bend;
  const my = (a.y + b.y) / 2 + (dx / len) * bend;
  // End slightly short of the target node so the arrowhead sits on its rim.
  const ex = b.x - ((b.x - mx) / Math.hypot(b.x - mx, b.y - my)) * (b.r + 3);
  const ey = b.y - ((b.y - my) / Math.hypot(b.x - mx, b.y - my)) * (b.r + 3);
  return `M${a.x},${a.y} Q${mx.toFixed(1)},${my.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`;
}

function NodeMark({ n, focus, active }: { n: LayoutNode; focus: boolean; active: boolean }) {
  const fillDot = n.color ? TENDENCY_COLOR_VALUES[n.color as TendencyColor] ?? "#202020" : null;
  const r = n.r;
  const base = focus ? "#B51F2A" : active ? "#B51F2A" : "#FAF9F5";
  const stroke = focus || active ? "#B51F2A" : "#171717";
  if (n.kind === "concept") {
    return (
      <rect
        x={-r}
        y={-r}
        width={r * 2}
        height={r * 2}
        transform="rotate(45)"
        fill={focus || active ? "#B51F2A" : "#FAF9F5"}
        stroke={focus || active ? "#B51F2A" : "#53624B"}
        strokeWidth={1.3}
      />
    );
  }
  if (n.kind === "tendency") {
    return <rect x={-r} y={-r} width={r * 2} height={r * 2} fill={base} stroke={stroke} strokeWidth={1.3} />;
  }
  if (n.kind !== "thinker") {
    return <rect x={-r * 0.8} y={-r * 1.1} width={r * 1.6} height={r * 2.2} fill={base} stroke={stroke} strokeWidth={1.2} />;
  }
  return (
    <>
      <circle r={r} fill={base} stroke={stroke} strokeWidth={1.3} />
      {fillDot && !focus && !active && <circle r={Math.max(1.8, r * 0.5)} fill={fillDot} />}
    </>
  );
}

function MapSvg({
  layout,
  hover,
  selected,
  setHover,
  select,
  className,
  titleId,
}: {
  layout: Layout;
  hover: string | null;
  selected: string | null;
  setHover: (id: string | null) => void;
  select: (id: string) => void;
  className: string;
  titleId: string;
}) {
  const byId = useMemo(() => new Map(layout.nodes.map((n) => [n.id, n])), [layout.nodes]);
  const focusId = hover ?? selected;
  const neighbours = useMemo(() => {
    if (!focusId) return null;
    const s = new Set([focusId]);
    for (const e of layout.edges) {
      if (e.source === focusId) s.add(e.target);
      if (e.target === focusId) s.add(e.source);
    }
    return s;
  }, [focusId, layout.edges]);

  const horizontal = layout.orientation === "landscape";
  const fontSize = horizontal ? 15 : 12.5;
  const order = useMemo(
    () => [...layout.nodes].sort((a, b) => (a.yearStart ?? 0) - (b.yearStart ?? 0)).map((n) => n.id),
    [layout.nodes],
  );
  const families = [...new Set(layout.edges.map((e) => e.family))];

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      className={className}
      role="group"
      aria-labelledby={titleId}
      onMouseLeave={() => setHover(null)}
    >
      <defs>
        {families.map((f) => (
          <marker
            key={f}
            id={`arrow-${titleId}-${f}`}
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0.8 L7,4 L0,7.2" fill="none" stroke={FAMILY_STYLE[f].stroke} strokeWidth="1.2" />
          </marker>
        ))}
      </defs>

      {/* Time axis */}
      {layout.axis.map((t) =>
        horizontal ? (
          <g key={t.year} aria-hidden="true">
            <line x1={t.at} x2={t.at} y1={18} y2={layout.height - 30} stroke="#C8C0B0" strokeDasharray="1 5" />
            <text x={t.at} y={layout.height - 12} textAnchor="middle" className="fill-faint font-mono" fontSize="11">
              {t.year}
            </text>
          </g>
        ) : (
          <g key={t.year} aria-hidden="true">
            <line x1={34} x2={layout.width - 8} y1={t.at} y2={t.at} stroke="#C8C0B0" strokeDasharray="1 5" />
            <text x={4} y={t.at + 3.5} className="fill-faint font-mono" fontSize="10">
              {t.year}
            </text>
          </g>
        ),
      )}

      {/* Edges */}
      <g fill="none" style={{ animation: "fade 1.2s .35s both" }}>
        {layout.edges.map((e) => {
          const a = byId.get(e.source);
          const b = byId.get(e.target);
          if (!a || !b) return null;
          const style = FAMILY_STYLE[e.family];
          const on = neighbours ? e.source === focusId || e.target === focusId : false;
          const dim = neighbours && !on;
          const symmetric = RELATIONSHIP_TYPES[e.type].symmetric;
          return (
            <path
              key={e.id}
              d={arc(a, b, e.id)}
              stroke={style.stroke}
              strokeWidth={(on ? 1.8 : 0.9) + (e.weight - 2) * 0.35}
              strokeDasharray={on && e.family === "influence" ? "6 4" : style.dash}
              markerEnd={symmetric ? undefined : `url(#arrow-${titleId}-${e.family})`}
              style={{
                opacity: dim ? 0.07 : on ? 0.95 : e.family === "critique" ? 0.5 : 0.32,
                transition: "opacity .35s, stroke-width .35s",
                animation: on ? "dash-flow 1.2s linear infinite" : undefined,
              }}
            />
          );
        })}
      </g>

      {/* Nodes */}
      {layout.nodes.map((n) => {
        const isFocus = n.id === layout.focusId;
        const active = n.id === focusId || n.id === selected;
        const dim = neighbours ? !neighbours.has(n.id) : false;
        const label = n.label;
        const tx = label === "below" ? 0 : label === "right" ? n.r + 6 : -(n.r + 6);
        const ty = label === "below" ? n.r + fontSize + 2 : fontSize * 0.35;
        const anchor = label === "below" ? "middle" : label === "right" ? "start" : "end";
        const years = lifespan(n);
        return (
          <g key={n.id} style={{ animation: `fade .6s ${0.05 + order.indexOf(n.id) * 0.045}s both` }}>
          <g
            transform={`translate(${n.x},${n.y})`}
            role="button"
            tabIndex={0}
            aria-label={`${n.title}${years ? `, ${years}` : ""}${n.group ? `, ${n.group}` : ""}. ${n.degree} connections. ${n.id === selected ? "Selected." : "Press Enter to preview."}`}
            aria-pressed={n.id === selected}
            onMouseEnter={() => setHover(n.id)}
            onFocus={() => setHover(n.id)}
            onBlur={() => setHover(null)}
            onClick={() => select(n.id)}
            onKeyDown={(ev) => {
              if (ev.key === "Enter" || ev.key === " ") {
                ev.preventDefault();
                select(n.id);
              }
            }}
            className="cursor-pointer outline-none focus-visible:[&_.ring]:opacity-100"
            style={{ opacity: dim ? 0.22 : 1, transition: "opacity .35s" }}
          >
            <circle className="ring" r={n.r + 6} fill="none" stroke="#B51F2A" strokeWidth="1" opacity="0" />
            <circle r={Math.max(n.r + 10, 18)} fill="transparent" />
            <g
              style={{
                transform: active ? "scale(1.4)" : "scale(1)",
                transformBox: "fill-box",
                transformOrigin: "center",
                transition: "transform .3s cubic-bezier(.22,.61,.36,1)",
              }}
            >
              <NodeMark n={n} focus={isFocus} active={active && !isFocus} />
            </g>
            <text
              x={tx}
              y={ty}
              textAnchor={anchor}
              fontSize={isFocus ? fontSize * 1.15 : fontSize}
              className="font-serif"
              fill={active || isFocus ? "#B51F2A" : "#171717"}
              stroke="#F3F0E8"
              strokeWidth="4"
              strokeLinejoin="round"
              paintOrder="stroke"
              style={{ transition: "fill .2s" }}
            >
              {n.title.replace(/^G\. W\. F\. /, "")}
            </text>
          </g>
          </g>
        );
      })}
    </svg>
  );
}

export interface TheoryMapProps {
  landscape: Layout;
  portrait: Layout;
  title: string;
  /** Short instruction set beside the map. */
  caption?: string;
  height?: "tall" | "medium";
  showLegend?: boolean;
}

export function TheoryMap({ landscape, portrait, title, caption, showLegend = true }: TheoryMapProps) {
  const router = useRouter();
  const titleId = useId().replace(/:/g, "");
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const nodes = landscape.nodes;
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const current = byId.get(selected ?? hover ?? "") ?? null;

  const select = useCallback(
    (id: string) => {
      if (id === selected) {
        const n = byId.get(id);
        if (n) router.push(n.href);
      } else setSelected(id);
    },
    [selected, byId, router],
  );

  const connections = (id: string) =>
    landscape.edges
      .filter((e) => e.source === id || e.target === id)
      .map((e) => {
        const out = e.source === id;
        const other = byId.get(out ? e.target : e.source);
        const meta = RELATIONSHIP_TYPES[e.type];
        return { e, other, label: out || meta.symmetric ? meta.label : meta.inverseLabel };
      })
      .filter((c): c is { e: GraphEdge; other: LayoutNode; label: string } => !!c.other)
      .sort((a, b) => b.e.weight - a.e.weight);

  const families = [...new Set(landscape.edges.map((e) => e.family))];

  return (
    <figure className="relative" onKeyDown={(e) => e.key === "Escape" && setSelected(null)}>
      <figcaption id={titleId} className="sr-only">
        {title}. {caption}
      </figcaption>

      <div className="relative">
        <MapSvg
          layout={landscape}
          hover={hover}
          selected={selected}
          setHover={setHover}
          select={select}
          className="hidden h-auto w-full select-none md:block"
          titleId={`${titleId}l`}
        />
        <MapSvg
          layout={portrait}
          hover={hover}
          selected={selected}
          setHover={setHover}
          select={select}
          className="block h-auto w-full select-none md:hidden"
          titleId={`${titleId}p`}
        />

        {/* Hover card (desktop) */}
        {hover && hover !== selected && byId.get(hover) && (
          <HoverCard node={byId.get(hover)!} layout={landscape} />
        )}
      </div>

      {/* Preview panel */}
      <div aria-live="polite" className="mt-4 md:absolute md:right-0 md:top-0 md:mt-0 md:w-[19rem]">
        {selected && current && current.id === selected ? (
          <div className="border border-ink bg-paper-warm p-5 shadow-[6px_6px_0_0_rgba(23,23,23,0.08)] animate-enter">
            <div className="flex items-start justify-between gap-3">
              <p className="label text-red">{KINDS[current.kind].label}{current.group ? ` · ${current.group}` : ""}</p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="label -mr-1 -mt-1 px-1 text-faint hover:text-ink"
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>
            <h3 className="mt-2 font-serif text-[1.7rem] leading-none">{current.title}</h3>
            {lifespan(current) && <p className="label-mono mt-1.5 text-muted">{lifespan(current)}</p>}
            <p className="mt-3 text-[0.9rem] leading-snug text-ink-warm">{current.summary}</p>
            <ul className="mt-4 max-h-44 space-y-1 overflow-y-auto border-t border-rule pt-3 scrollbar-thin">
              {connections(current.id).map(({ e, other, label }) => (
                <li key={e.id} className="text-[0.85rem] leading-snug">
                  <span className="text-faint">{label} </span>
                  <button type="button" onClick={() => setSelected(other.id)} className="link-inline">
                    {other.title}
                  </button>
                </li>
              ))}
            </ul>
            <Link href={current.href} className="btn btn-red mt-4 w-full justify-between">
              Open {KINDS[current.kind].label.toLowerCase()} <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : (
          caption && (
            <p className="hidden max-w-[16rem] text-[0.82rem] leading-snug text-muted md:block md:ml-auto md:text-right">
              {caption}
            </p>
          )
        )}
      </div>

      {showLegend && (
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-rule pt-3">
          {families.map((f) => (
            <span key={f} className="label inline-flex items-center gap-2 text-muted">
              <svg width="26" height="8" aria-hidden="true">
                <line x1="0" y1="4" x2="26" y2="4" stroke={FAMILY_STYLE[f].stroke} strokeDasharray={FAMILY_STYLE[f].dash} strokeWidth="1.4" />
              </svg>
              {FAMILY_STYLE[f].label}
            </span>
          ))}
          <details className="ml-auto">
            <summary className="label cursor-pointer text-muted hover:text-ink">Read as a list</summary>
            <ul className="mt-3 columns-1 gap-8 text-sm sm:columns-2">
              {landscape.edges.map((e) => {
                const a = byId.get(e.source);
                const b = byId.get(e.target);
                if (!a || !b) return null;
                return (
                  <li key={e.id} className="break-inside-avoid py-0.5">
                    <Link href={a.href} className="link-inline">{a.title}</Link>{" "}
                    <span className="text-faint">{e.label}</span>{" "}
                    <Link href={b.href} className="link-inline">{b.title}</Link>
                  </li>
                );
              })}
            </ul>
          </details>
        </div>
      )}
    </figure>
  );
}

function HoverCard({ node, layout }: { node: LayoutNode; layout: Layout }) {
  const left = (node.x / layout.width) * 100;
  const top = (node.y / layout.height) * 100;
  const flip = left > 70;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-10 hidden w-56 border border-ink bg-paper-warm px-3 py-2.5 text-left md:block animate-fade"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        transform: `translate(${flip ? "calc(-100% - 18px)" : "18px"}, -50%)`,
      }}
    >
      <p className="font-serif text-lg leading-tight">{node.title}</p>
      <p className="label-mono mt-0.5 text-muted">
        {lifespan(node)}
        {node.group ? ` · ${node.group}` : ""}
      </p>
      <p className="mt-1.5 line-clamp-3 text-xs leading-snug text-ink-warm">{node.summary}</p>
      <p className="label mt-2 text-red">{node.degree} connections · click to preview</p>
    </div>
  );
}
