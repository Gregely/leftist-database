"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

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

/** Remember the step being read (the route component records it as visited). */
export function RecordStep({ slug, position }: { slug: string; position: number }) {
  useEffect(() => {
    try {
      window.localStorage.setItem(lastKey(slug), String(position));
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }, [slug, position]);
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
  const pct = total ? Math.round((visited.length / total) * 100) : 0;
  if (!total) return null;
  return (
    <div className={compact ? "" : "border border-ink bg-paper-warm p-4 sm:p-5"} data-journey-progress={slug}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="label text-faint">Your progress</p>
        <p className="label-mono text-faint" aria-live="polite">
          {visited.length} of {total} steps read
        </p>
      </div>
      <div className="mt-2 h-[3px] w-full bg-rule" aria-hidden="true">
        <div className="h-full bg-red transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      {last ? (
        <p className="mt-3 text-sm text-muted">
          You were last at step {last}: <span className="font-serif text-base text-ink">{titles[last - 1]}</span>
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted">You have not started this journey yet. Begin at step 1, or open any step.</p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {last ? (
          <>
            <Link href={`${stepHrefPrefix}${last}`} className="btn btn-red" data-journey-continue>
              Continue <span aria-hidden="true">→</span>
            </Link>
            <Link href={`${stepHrefPrefix}1`} className="label text-muted hover:text-red">
              Start from the beginning
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
