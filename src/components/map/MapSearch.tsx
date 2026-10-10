"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { AtlasNode } from "@/lib/graph/atlas";
import { KindSwatch, kindLabel } from "./style";

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");

/**
 * Find an entry on the map. Matches the start of any word of the title
 * first, then anywhere in it; picking a result focuses the map on it (and
 * widens the filters if they were hiding it).
 */
export function MapSearch({ nodes, onPick }: { nodes: AtlasNode[]; onPick: (id: string) => void }) {
  const id = useId();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const index = useMemo(() => nodes.map((n) => ({ n, t: fold(n.title) })), [nodes]);
  const results = useMemo(() => {
    const f = fold(q.trim());
    if (!f) return [];
    const scored = index
      .map(({ n, t }) => {
        const words = t.split(/[^a-z0-9]+/);
        const s = t.startsWith(f) ? 3 : words.some((w) => w.startsWith(f)) ? 2 : t.includes(f) ? 1 : 0;
        return { n, s };
      })
      .filter((x) => x.s > 0);
    return scored.sort((a, b) => b.s - a.s || b.n.importance - a.n.importance).slice(0, 8).map((x) => x.n);
  }, [q, index]);

  const pick = (n: AtlasNode) => {
    onPick(n.id);
    setQ("");
    setOpen(false);
    input.current?.blur();
  };

  return (
    <div className="relative w-full sm:w-72">
      <label htmlFor={`${id}-q`} className="sr-only">
        Find on the map
      </label>
      <div className="flex items-center gap-2 border-b border-ink pb-1">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="shrink-0 text-faint">
          <circle cx="6" cy="6" r="4.5" />
          <path d="M9.5 9.5L13 13" />
        </svg>
        <input
          ref={input}
          id={`${id}-q`}
          type="search"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && results[active] ? `${id}-o${active}` : undefined}
          autoComplete="off"
          placeholder="Find a thinker, idea, text…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(results.length - 1, a + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(0, a - 1));
            } else if (e.key === "Enter" && results[active]) {
              e.preventDefault();
              pick(results[active]);
            } else if (e.key === "Escape") {
              setQ("");
              setOpen(false);
            }
          }}
          className="w-full bg-transparent font-serif text-[1.05rem] placeholder:italic placeholder:text-faint focus:outline-none"
        />
      </div>
      {open && results.length > 0 && (
        <ul id={`${id}-list`} role="listbox" aria-label="Entries on the map" className="absolute left-0 right-0 top-full z-40 mt-1 border border-ink bg-paper-warm py-1 shadow-[4px_4px_0_0_rgba(22,22,26,0.08)]">
          {results.map((n, i) => (
            <li
              key={n.id}
              id={`${id}-o${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(n);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-baseline gap-2 px-3 py-1.5 ${i === active ? "bg-paper-deep" : ""}`}
            >
              <span className="translate-y-[1px]">
                <KindSwatch kind={n.kind} size={10} />
              </span>
              <span className="min-w-0 flex-1 truncate font-serif text-[1rem]">{n.title}</span>
              <span className="label shrink-0 text-faint">
                {kindLabel(n.kind)}
                {n.yearStart ? ` · ${n.yearStart}` : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
