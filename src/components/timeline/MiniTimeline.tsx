"use client";

import Link from "next/link";
import { useState } from "react";
import type { TimelineItem } from "@/lib/data/events";

/** A horizontal strip from FROM to TO with representative events. */
export function MiniTimeline({ items, from = 1780, to = 2020 }: { items: TimelineItem[]; from?: number; to?: number }) {
  const [active, setActive] = useState<string | null>(items.find((i) => i.year === 1871)?.id ?? items[0]?.id ?? null);
  const pos = (y: number) => ((y - from) / (to - from)) * 100;
  const ticks: number[] = [];
  for (let y = from; y <= to; y += 20) ticks.push(y);
  const current = items.find((i) => i.id === active) ?? null;

  return (
    <div>
      <div className="scrollbar-thin -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="relative h-44 min-w-[860px]">
          {/* Axis */}
          <div className="absolute inset-x-0 top-[104px] h-px bg-ink" aria-hidden="true" />
          {ticks.map((y) => (
            <div key={y} className="absolute top-[104px]" style={{ left: `${pos(y)}%` }} aria-hidden="true">
              <div className="h-2 w-px bg-ink" />
              <span className="label-mono absolute left-0 top-3 -translate-x-1/2 text-faint">{y}</span>
            </div>
          ))}
          {/* Markers */}
          <ol>
            {items.map((it, i) => {
              const on = it.id === active;
              const high = i % 2 === 0;
              return (
                <li key={it.id} className="absolute top-0" style={{ left: `${pos(it.year)}%` }}>
                  <Link
                    href={`/timeline?focus=${it.year}&item=${it.slug}`}
                    onMouseEnter={() => setActive(it.id)}
                    onFocus={() => setActive(it.id)}
                    className="group absolute -translate-x-1/2 text-center"
                    style={{ top: high ? 8 : 40 }}
                    aria-describedby="mini-timeline-caption"
                  >
                    <span className={`label-mono block transition-colors ${on ? "text-red" : "text-muted group-hover:text-ink"}`}>
                      {it.year}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`mx-auto mt-1 block w-px origin-bottom transition-all duration-300 ${on ? "bg-red" : "bg-rule group-hover:bg-ink"}`}
                      style={{ height: high ? 74 : 42 }}
                    />
                    <span
                      aria-hidden="true"
                      className={`absolute left-1/2 block h-2.5 w-2.5 -translate-x-1/2 rotate-45 border transition-colors ${on ? "border-red bg-red" : "border-ink bg-paper"}`}
                      style={{ top: high ? 92 : 60 }}
                    />
                    <span className="sr-only">{it.title}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <div id="mini-timeline-caption" aria-live="polite" className="mt-2 min-h-[6.5rem] border-t border-rule pt-4">
        {current && (
          <div key={current.id} className="grid gap-2 animate-fade sm:grid-cols-[8rem_1fr] sm:gap-6">
            <p className="numeral text-4xl text-red">{current.year}</p>
            <div>
              <p className="font-serif text-2xl leading-tight">{current.title}</p>
              {current.dateLabel && <p className="label mt-1 text-faint">{current.dateLabel}</p>}
              <p className="mt-1.5 max-w-2xl text-[0.95rem] leading-snug text-muted">{current.summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
