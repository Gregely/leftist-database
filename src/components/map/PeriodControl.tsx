"use client";

import { useEffect, useMemo, useState } from "react";
import type { AtlasNode } from "@/lib/graph/atlas";
import { PERIODS } from "@/lib/site";
import { C } from "./style";

/**
 * Narrow the map to a period: a two-handled range over the years the
 * collection covers, with the density of dated entries drawn beneath it, and
 * the site's periods as quick choices. The map follows when a handle is let
 * go, not on every step of a drag.
 */
export function PeriodControl({
  years,
  nodes,
  period,
  onChange,
}: {
  years: [number, number];
  nodes: AtlasNode[];
  period: [number, number] | null;
  onChange: (p: [number, number] | null) => void;
}) {
  const [y0, y1] = years;
  const [draft, setDraft] = useState<[number, number]>(period ?? years);
  useEffect(() => setDraft(period ?? years), [period, years]);

  const bins = useMemo(() => {
    const out = new Array(Math.ceil((y1 - y0) / 10)).fill(0);
    for (const n of nodes) if (n.dated) out[Math.min(out.length - 1, Math.floor((n.year - y0) / 10))]++;
    const max = Math.max(1, ...out);
    return out.map((c) => c / max);
  }, [nodes, y0, y1]);

  const commit = (p: [number, number]) => onChange(p[0] <= y0 && p[1] >= y1 ? null : p);
  const pct = (y: number) => ((y - y0) / (y1 - y0)) * 100;
  const presets = PERIODS.filter((p) => p.to > y0 && p.from < y1);
  const active = (p: { from: number; to: number }) => !!period && period[0] === Math.max(y0, p.from) && period[1] === Math.min(y1, p.to);

  return (
    <div className="mt-4 grid gap-y-2.5" role="group" aria-label="Period">
      <div className="flex items-center gap-4">
        <span className="label w-12 shrink-0 text-faint">Period</span>
        <span className="label-mono w-10 shrink-0 text-right text-ink">{draft[0]}</span>
        <div className="relative h-9 min-w-0 flex-1">
          <svg className="absolute inset-x-0 bottom-[13px] h-5 w-full" preserveAspectRatio="none" viewBox={`0 0 ${bins.length} 1`} aria-hidden="true">
            {bins.map((b, i) => {
              const inside = y0 + i * 10 + 10 > draft[0] && y0 + i * 10 < draft[1];
              return <rect key={i} x={i + 0.12} width={0.76} y={1 - Math.max(0.04, b)} height={Math.max(0.04, b)} fill={inside ? C.ink : C.rule} opacity={inside ? 0.55 : 0.6} />;
            })}
          </svg>
          <div className="absolute inset-x-0 bottom-[11px] h-px bg-ink/60" aria-hidden="true" />
          <div className="absolute bottom-[10px] h-[3px] bg-red" style={{ left: `${pct(draft[0])}%`, right: `${100 - pct(draft[1])}%` }} aria-hidden="true" />
          {([0, 1] as const).map((i) => (
            <input
              key={i}
              type="range"
              min={y0}
              max={y1}
              step={1}
              value={draft[i]}
              aria-label={i === 0 ? "From year" : "To year"}
              onChange={(e) => {
                const v = Number(e.target.value);
                setDraft((d) => (i === 0 ? [Math.min(v, d[1] - 5), d[1]] : [d[0], Math.max(v, d[0] + 5)]));
              }}
              onPointerUp={() => commit(draft)}
              onKeyUp={() => commit(draft)}
              onBlur={() => (draft[0] !== (period ?? years)[0] || draft[1] !== (period ?? years)[1]) && commit(draft)}
              className="period-thumb absolute inset-x-0 bottom-0 h-6 w-full appearance-none bg-transparent"
            />
          ))}
        </div>
        <span className="label-mono w-10 shrink-0 text-ink">{draft[1]}</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 sm:pl-16">
        <button type="button" aria-pressed={!period} onClick={() => onChange(null)} className={`label border px-2 py-1 ${!period ? "border-ink bg-ink text-paper" : "border-rule text-muted hover:border-ink"}`}>
          All
        </button>
        {presets.map((p) => (
          <button
            key={p.slug}
            type="button"
            aria-pressed={active(p)}
            title={`${p.label}, ${p.from}–${p.to}`}
            onClick={() => onChange([Math.max(y0, p.from), Math.min(y1, p.to)])}
            className={`label border px-2 py-1 ${active(p) ? "border-ink bg-ink text-paper" : "border-rule text-muted hover:border-ink"}`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
