"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

interface Stop {
  position: number;
  title: string;
  kind: string;
}

const key = (slug: string) => `atlas:path:${slug}`;

function readVisited(slug: string): number[] {
  try {
    return JSON.parse(window.localStorage.getItem(key(slug)) ?? "[]");
  } catch {
    return [];
  }
}

const NONE: number[] = [];
const cache = new Map<string, { raw: string | null; value: number[] }>();
function useVisited(slug: string) {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("atlas:path", cb);
      return () => window.removeEventListener("atlas:path", cb);
    },
    () => {
      let raw: string | null = null;
      try {
        raw = window.localStorage.getItem(key(slug));
      } catch {}
      const c = cache.get(slug);
      if (c && c.raw === raw) return c.value;
      const value = readVisited(slug);
      cache.set(slug, { raw, value });
      return value;
    },
    () => NONE,
  );
}

/**
 * The path drawn as a route: stations along a line. Every station is a link,
 * so the reader can jump anywhere; visited stops (kept in this browser) fill in.
 */
export function PathRoute({
  slug,
  stops,
  current,
  hrefPrefix = "?step=",
  label = "The route",
  unit = "stops",
}: {
  slug: string;
  stops: Stop[];
  current: number;
  /** Links are `${hrefPrefix}${position}`; a preview passes its own prefix so links stay in the preview. */
  hrefPrefix?: string;
  label?: string;
  unit?: string;
}) {
  const visited = useVisited(slug);

  useEffect(() => {
    if (!current) return;
    const v = readVisited(slug);
    if (!v.includes(current)) {
      try {
        window.localStorage.setItem(key(slug), JSON.stringify([...v, current]));
      } catch {}
      window.dispatchEvent(new Event("atlas:path"));
    }
  }, [slug, current]);

  const n = stops.length;
  const W = 1000;
  const H = 120;
  const xAt = (i: number) => 30 + (i * (W - 60)) / Math.max(1, n - 1);
  const yAt = (i: number) => H / 2 + Math.sin(i * 1.15) * 22;
  const d = stops.map((_, i) => `${i ? "L" : "M"}${xAt(i).toFixed(1)},${yAt(i).toFixed(1)}`).join(" ");
  const progress = Math.round((visited.filter((v) => v <= n).length / n) * 100);

  return (
    <nav aria-label="Path stops">
      <div className="flex items-baseline justify-between gap-4">
        <p className="label text-faint">
          {label} · {n} {unit}
        </p>
        <p className="label-mono text-faint" aria-live="polite">
          {progress}% visited
        </p>
      </div>
      {/* Desktop route */}
      <div className="mt-3 hidden md:block">
        <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
          <path d={d} fill="none" stroke="#C8C0B0" strokeWidth="1.5" />
          {current > 0 && (
            <path
              d={stops.slice(0, current).map((_, i) => `${i ? "L" : "M"}${xAt(i)},${yAt(i)}`).join(" ")}
              fill="none"
              stroke="#B51F2A"
              strokeWidth="2"
            />
          )}
        </svg>
        <ol className="absolute inset-0">
          {stops.map((s, i) => {
            const on = s.position === current;
            const seen = visited.includes(s.position);
            return (
              <li key={s.position} className="absolute" style={{ left: `${(xAt(i) / W) * 100}%`, top: `${(yAt(i) / H) * 100}%` }}>
                <Link
                  href={`${hrefPrefix}${s.position}`}
                  scroll={false}
                  aria-current={on ? "step" : undefined}
                  className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                >
                  <span
                    className={`label-mono flex h-7 w-7 items-center justify-center rounded-full border text-[0.68rem] transition-all ${on ? "scale-125 border-red bg-red text-paper-warm" : seen ? "border-ink bg-ink text-paper" : "border-ink bg-paper group-hover:bg-ink group-hover:text-paper"}`}
                  >
                    {String(s.position).padStart(2, "0")}
                  </span>
                  <span
                    className={`absolute top-9 w-28 text-center text-[0.75rem] leading-tight ${on ? "text-red" : "text-muted group-hover:text-ink"} ${i % 2 ? "" : ""}`}
                  >
                    {s.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
        </div>
        <div className="h-12" />
      </div>
      {/* Mobile route */}
      <ol className="mt-3 flex gap-1 overflow-x-auto pb-2 md:hidden">
        {stops.map((s) => {
          const on = s.position === current;
          const seen = visited.includes(s.position);
          return (
            <li key={s.position}>
              <Link
                href={`${hrefPrefix}${s.position}`}
                scroll={false}
                aria-current={on ? "step" : undefined}
                aria-label={`Stop ${s.position}: ${s.title}`}
                className={`label-mono flex h-9 w-9 items-center justify-center rounded-full border ${on ? "border-red bg-red text-paper-warm" : seen ? "border-ink bg-ink text-paper" : "border-ink"}`}
              >
                {String(s.position).padStart(2, "0")}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
