"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export interface DepthLevel {
  key: "brief" | "standard" | "deep";
  label: string;
  duration: string;
  content: ReactNode;
  available: boolean;
}

const NUMERALS = ["I", "II", "III"];
/** Each level sits a little deeper: the ground darkens one step per level. */
const STRATA = ["bg-paper-warm", "bg-paper-deep/45", "bg-paper-deep"];

/**
 * Progressive depth: the reader descends from a 30-second explanation to a
 * deep dive. Deeper levels open beneath the shallower ones, so the page reads
 * as one descent rather than as interchangeable tabs; the gauge above shows
 * how far down the reader is and lets them go straight to any level.
 */
export function DepthReader({ levels, initial = "brief" }: { levels: DepthLevel[]; initial?: DepthLevel["key"] }) {
  const initialIndex = Math.max(0, levels.findIndex((l) => l.key === initial));
  const [depth, setDepth] = useState(initialIndex);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [scrollTo, setScrollTo] = useState<number | null>(initialIndex > 0 ? initialIndex : null);

  useEffect(() => {
    if (scrollTo == null) return;
    const el = refs.current[scrollTo];
    if (el) {
      el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      el.focus({ preventScroll: true });
    }
    setScrollTo(null);
  }, [scrollTo, depth]);

  function goTo(i: number) {
    setDepth((d) => Math.max(d, i));
    setScrollTo(i);
    const url = new URL(window.location.href);
    url.searchParams.set("depth", levels[i].key);
    window.history.replaceState(null, "", url);
  }

  return (
    <div>
      {/* The gauge */}
      <div role="group" aria-label="Choose a depth" className="grid grid-cols-3 border-t-[3px] border-ink">
        {levels.map((l, i) => {
          const reached = i <= depth;
          return (
            <button
              key={l.key}
              type="button"
              onClick={() => goTo(i)}
              aria-pressed={reached}
              className={`group relative border-b border-ink px-2 pb-3 pt-3 text-left transition-colors sm:px-4 ${i ? "border-l border-l-rule" : ""} ${reached ? "" : "hover:bg-paper-warm"}`}
            >
              <span className="flex items-baseline gap-2">
                <span className={`numeral text-[1.5rem] leading-none sm:text-[1.9rem] ${reached ? "text-red" : "text-faint group-hover:text-ink"}`}>{NUMERALS[i]}</span>
                <span className={`label sm:text-[0.82rem] ${reached ? "text-ink" : "text-muted"}`}>{l.label}</span>
              </span>
              <span className="mt-1 hidden font-serif text-[0.95rem] italic text-faint sm:block">{l.duration}</span>
              {/* Depth bar: fills as the reader descends. */}
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[5px] bg-paper-deep">
                <span className={`block h-full bg-red transition-[width] duration-500 ${reached ? "w-full" : "w-0"}`} />
              </span>
            </button>
          );
        })}
      </div>

      <div>
        {levels.map((l, i) =>
          i <= depth ? (
            <section
              key={l.key}
              ref={(el) => {
                refs.current[i] = el;
              }}
              tabIndex={-1}
              aria-label={`${l.label} explanation`}
              className={`scroll-mt-36 border-b border-ink px-4 py-8 outline-none sm:px-8 sm:py-11 ${STRATA[i]} ${i ? "animate-enter" : ""}`}
            >
              <div className="grid gap-5 md:grid-cols-[8.5rem_1fr] md:gap-8">
                <div className="flex items-baseline gap-3 md:block">
                  <p className="numeral text-[2.2rem] leading-none text-red md:text-[3.2rem]" aria-hidden="true">
                    {NUMERALS[i]}
                  </p>
                  <p className="label md:mt-2">{l.label}</p>
                  <p className="font-serif text-[0.95rem] italic text-faint md:mt-0.5">{l.duration}</p>
                </div>
                <div className="max-w-[42rem]">
                  {l.available ? (
                    l.content
                  ) : (
                    <p className="font-serif italic text-muted">
                      This level has not been written yet. The Atlas is built to hold it, and editors can add it from the
                      editorial desk.
                    </p>
                  )}
                </div>
              </div>
              {i === depth && i < levels.length - 1 && (
                <div className="mt-9 md:pl-[10.5rem]">
                  <button
                    type="button"
                    onClick={() => goTo(i + 1)}
                    className="group flex w-full max-w-[42rem] items-center justify-between gap-4 border-y border-ink py-3 text-left transition-colors hover:bg-ink hover:px-4 hover:text-paper"
                  >
                    <span>
                      <span className="label block">Go deeper: {levels[i + 1].label}</span>
                      <span className="mt-0.5 block font-serif text-[1rem] italic text-muted group-hover:text-ink-muted">{levels[i + 1].duration}</span>
                    </span>
                    <span aria-hidden="true" className="text-[1.4rem] text-red transition-transform group-hover:translate-y-1 group-hover:text-red-bright">
                      ↓
                    </span>
                  </button>
                </div>
              )}
            </section>
          ) : null,
        )}
      </div>
    </div>
  );
}
