"use client";

import Link from "next/link";
import { useState } from "react";
import type { TimelineItem } from "@/lib/data/events";

/**
 * A strip from FROM to TO: the periods as alternating bands, representative
 * events as ticks above the axis. Hovering or focusing an event sets it in the
 * caption below; selecting it opens the full timeline at that moment.
 */
export function MiniTimeline({
  items,
  periods = [],
  from = 1780,
  to = 2020,
}: {
  items: TimelineItem[];
  periods?: readonly { slug: string; label: string; from: number; to: number }[];
  from?: number;
  to?: number;
}) {
  const [active, setActive] = useState<string | null>(items.find((i) => i.year === 1871)?.id ?? items[0]?.id ?? null);
  const pos = (y: number) => ((Math.min(Math.max(y, from), to) - from) / (to - from)) * 100;
  const ticks: number[] = [];
  for (let y = from; y <= to; y += 20) ticks.push(y);
  const current = items.find((i) => i.id === active) ?? null;

  return (
    <div>
      <div className="scrollbar-thin -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="relative h-52 min-w-[880px]">
          {/* Period bands */}
          <div className="absolute inset-x-0 bottom-9 top-[120px]" aria-hidden="true">
            {periods.map((p, i) => (
              <div
                key={p.slug}
                className={`absolute inset-y-0 border-l border-ink/60 ${i % 2 ? "bg-paper-deep" : "bg-beige/60"}`}
                style={{ left: `${pos(p.from)}%`, width: `${pos(p.to + 1) - pos(p.from)}%` }}
              >
                <span className="label absolute left-1.5 top-1 truncate pr-2 text-[0.66rem] text-muted" style={{ maxWidth: "100%" }}>
                  {p.label}
                </span>
              </div>
            ))}
          </div>
          {/* Axis */}
          <div className="absolute inset-x-0 top-[120px] h-px bg-ink" aria-hidden="true" />
          {ticks.map((y) => (
            <div key={y} className="absolute bottom-0" style={{ left: `${pos(y)}%` }} aria-hidden="true">
              <span className="label-mono absolute bottom-2 left-0 -translate-x-1/2 text-faint">{y}</span>
            </div>
          ))}
          {/* Events */}
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
                    style={{ top: high ? 6 : 42 }}
                    aria-describedby="mini-timeline-caption"
                  >
                    <span className={`label-mono block transition-colors ${on ? "font-semibold text-red" : "text-muted group-hover:text-ink"}`}>{it.year}</span>
                    <span
                      aria-hidden="true"
                      className={`mx-auto mt-1 block w-px transition-colors duration-300 ${on ? "bg-red" : "bg-rule group-hover:bg-ink"}`}
                      style={{ height: high ? 88 : 52 }}
                    />
                    <span
                      aria-hidden="true"
                      className={`absolute left-1/2 block h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rotate-45 border transition-colors ${on ? "border-red bg-red" : "border-ink bg-paper-warm"}`}
                      style={{ top: high ? 114 : 78 }}
                    />
                    <span className="sr-only">{it.title}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <div id="mini-timeline-caption" aria-live="polite" className="mt-6 min-h-[7rem] border-t border-ink pt-5">
        {current && (
          <div key={current.id} className="grid gap-2 animate-fade sm:grid-cols-[9rem_1fr] sm:gap-8">
            <p className="numeral text-[3.2rem] leading-none text-red">{current.year}</p>
            <div>
              <p className="font-serif text-[1.7rem] leading-tight">
                <Link href={current.href} className="hover:text-red">
                  {current.title}
                </Link>
              </p>
              {current.dateLabel && <p className="label mt-1 text-faint">{current.dateLabel}</p>}
              <p className="mt-2 max-w-2xl font-serif text-[1.05rem] leading-snug text-muted">{current.summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
