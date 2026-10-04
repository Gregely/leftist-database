"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { setActiveRoute, type ActiveRoute } from "@/lib/client/route";

/**
 * Reading progress for a Guided journey, kept in this browser only. Visited
 * steps share the store used by the learning-path route (PathRoute), so a
 * journey and its route display always agree; the last step read is what
 * "Continue" returns to. Nothing is locked: progress only informs.
 */
const visitedKey = (slug: string) => `atlas:path:${slug}`;
const lastKey = (slug: string) => `atlas:guided:last:${slug}`;
const EVENT = "atlas:path";

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Raw snapshot strings, so React can compare them cheaply. */
function useStored(key: string) {
  return useSyncExternalStore(subscribe, () => read(key), () => null);
}

export function useJourneyProgress(slug: string, total: number) {
  const rawVisited = useStored(visitedKey(slug));
  const rawLast = useStored(lastKey(slug));
  let visited: number[] = [];
  try {
    visited = (JSON.parse(rawVisited ?? "[]") as number[]).filter((n) => Number.isInteger(n) && n >= 1 && n <= total);
  } catch {}
  const last = Number(rawLast);
  return { visited: [...new Set(visited)], last: Number.isInteger(last) && last >= 1 && last <= total ? last : null };
}

/**
 * Remember the step being read (the route component records it as visited).
 * With `route`, also mark this journey as the one the reader is following, so
 * the rest of the site can offer the way back to it.
 */
export function RecordStep({ slug, position, route }: { slug: string; position: number; route?: Omit<ActiveRoute, "slug" | "step"> }) {
  const routeKey = route ? JSON.stringify(route) : "";
  useEffect(() => {
    try {
      window.localStorage.setItem(lastKey(slug), String(position));
    } catch {}
    window.dispatchEvent(new Event(EVENT));
    if (routeKey) setActiveRoute({ slug, step: position, ...(JSON.parse(routeKey) as Omit<ActiveRoute, "slug" | "step">) });
  }, [slug, position, routeKey]);
  return null;
}

/** Progress summary with Start / Continue, for the Guided landing page and a journey's overview. */
export function JourneyActions({
  slug,
  titles,
  stepHrefPrefix,
  compact = false,
}: {
  slug: string;
  /** Step titles in order. */
  titles: string[];
  stepHrefPrefix: string;
  compact?: boolean;
}) {
  const total = titles.length;
  const { visited, last } = useJourneyProgress(slug, total);
  if (!total) return null;
  return (
    <div className={compact ? "" : "border-t-[3px] border-ink pt-3"} data-journey-progress={slug}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="label text-faint">Progress</p>
        <p className="label-mono text-faint" aria-live="polite">
          {visited.length} of {total} steps read
        </p>
      </div>
      <div className="mt-2 flex gap-[3px]" aria-hidden="true">
        {titles.map((t, i) => (
          <span key={i} title={t} className={`h-[5px] flex-1 transition-colors duration-500 ${visited.includes(i + 1) ? "bg-red" : "bg-paper-deep"}`} />
        ))}
      </div>
      {last && (
        <p className="mt-3 text-sm text-muted">
          <span className="label mr-2 text-faint">Last read</span>
          Step {last}: <span className="font-serif text-[1.05rem] italic text-ink">{titles[last - 1]}</span>
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {last ? (
          <>
            <Link href={`${stepHrefPrefix}${last}`} className="btn btn-red" data-journey-continue>
              Continue <span aria-hidden="true">→</span>
            </Link>
            <Link href={`${stepHrefPrefix}1`} className="label text-muted hover:text-red">
              Start again
            </Link>
          </>
        ) : (
          <Link href={`${stepHrefPrefix}1`} className="btn btn-red" data-journey-start>
            Start the journey <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
