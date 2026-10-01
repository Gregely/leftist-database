"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export interface DepthLevel {
  key: "brief" | "standard" | "deep";
  label: string;
  duration: string;
  content: ReactNode;
  available: boolean;
}

const TONES = ["bg-paper-warm", "bg-paper", "bg-beige/45"];

/**
 * Progressive depth: the reader descends from a 30-second explanation to a
 * deep dive. Deeper levels are revealed below the shallower ones, so the
 * page reads as a descent rather than a set of interchangeable tabs.
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
      <div role="group" aria-label="Choose a depth" className="grid grid-cols-3 border border-ink">
        {levels.map((l, i) => (
          <button
            key={l.key}
            type="button"
            onClick={() => goTo(i)}
            aria-pressed={i <= depth}
            className={`group relative px-3 py-3 text-left transition-colors sm:px-5 sm:py-4 ${i ? "border-l border-ink" : ""} ${i <= depth ? "bg-ink text-paper" : "hover:bg-paper-warm"}`}
          >
            <span className={`label-mono block ${i <= depth ? "text-ink-muted" : "text-faint"}`}>Level {String(i + 1).padStart(2, "0")}</span>
            <span className="label mt-1 block sm:text-[0.8rem]">{l.label}</span>
            <span aria-hidden="true" className={`absolute bottom-0 left-0 h-[3px] bg-red transition-all duration-500 ${i <= depth ? "w-full" : "w-0"}`} />
          </button>
        ))}
      </div>

      <div className="mt-0 border-x border-b border-ink">
        {levels.map((l, i) =>
          i <= depth ? (
            <section
              key={l.key}
              ref={(el) => {
                refs.current[i] = el;
              }}
              tabIndex={-1}
              aria-label={`${l.label} explanation`}
              className={`scroll-mt-32 px-5 py-8 outline-none sm:px-10 sm:py-12 ${TONES[i]} ${i ? "border-t border-ink animate-enter" : ""}`}
            >
              <div className="grid gap-6 md:grid-cols-[9rem_1fr]">
                <div>
                  <p className="label text-red">{l.label}</p>
                  <p className="label-mono mt-1 text-faint">{l.duration}</p>
                  <svg width="40" height={28 + i * 18} className="mt-3 hidden md:block" aria-hidden="true">
                    <line x1="6" y1="0" x2="6" y2={28 + i * 18} stroke="#171717" />
                    {Array.from({ length: i + 1 }).map((_, k) => (
                      <circle key={k} cx="6" cy={6 + k * 18} r="3.5" fill={k === i ? "#B51F2A" : "#F3F0E8"} stroke={k === i ? "#B51F2A" : "#171717"} />
                    ))}
                  </svg>
                </div>
                <div className="max-w-[42rem]">
                  {l.available ? (
                    l.content
                  ) : (
                    <p className="text-muted italic">
                      This level has not been written yet. The Atlas is built to hold it — editors can add it from the
                      editorial desk.
                    </p>
                  )}
                </div>
              </div>
              {i === depth && i < levels.length - 1 && (
                <div className="mt-8 md:pl-[9rem]">
                  <button type="button" onClick={() => goTo(i + 1)} className="btn group">
                    Go deeper: {levels[i + 1].label}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">↓</span>
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
