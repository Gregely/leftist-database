"use client";

import { useId, useMemo, useRef, useState } from "react";
import { PLACE_KIND_LABELS } from "@/lib/content/model";
import { KindSwatch, kindLabel } from "@/components/map/style";
import type { GeoEntry, GeoPoint } from "./types";

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");

type Result = { type: "place"; p: GeoPoint; via?: string } | { type: "entry"; e: GeoEntry };

/**
 * Find a place (by its name, a former or present-day name) or an entry. A
 * place is selected on the map; an entry has its places traced in order.
 */
export function GeoSearch({ places, entries, onPlace, onEntry }: { places: GeoPoint[]; entries: GeoEntry[]; onPlace: (id: string) => void; onEntry: (id: string) => void }) {
  const id = useId();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const index = useMemo(
    () => [
      ...places.map((p) => ({ r: { type: "place", p } as Result, names: [p.name, ...p.aliases, p.modernName].filter(Boolean).map((n) => [n, fold(n)] as const) })),
      ...entries.map((e) => ({ r: { type: "entry", e } as Result, names: [[e.title, fold(e.title)] as const] })),
    ],
    [places, entries],
  );
  const results = useMemo(() => {
    const f = fold(q.trim());
    if (!f) return [];
    const scored: { r: Result; s: number }[] = [];
    for (const { r, names } of index) {
      let best = -Infinity;
      let via: string | undefined;
      names.forEach(([n, t], i) => {
        // A match on a former or present-day name ranks a little below a match on the name itself.
        const s = (t.startsWith(f) ? 3 : t.split(/[^a-z0-9]+/).some((w) => w.startsWith(f)) ? 2 : t.includes(f) ? 1 : 0) - (i > 0 ? 1.5 : 0);
        if (s > best) {
          best = s;
          via = i > 0 ? n : undefined;
        }
      });
      if (best > 0) scored.push({ r: r.type === "place" ? { ...r, via } : r, s: best });
    }
    return scored.sort((a, b) => b.s - a.s).slice(0, 9).map((x) => x.r);
  }, [q, index]);

  const pick = (r: Result) => {
    if (r.type === "place") onPlace(r.p.id);
    else onEntry(r.e.id);
    setQ("");
    setOpen(false);
    input.current?.blur();
  };

  return (
    <div className="relative w-full">
      <label htmlFor={`${id}-q`} className="sr-only">
        Find a place or an entry
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
          placeholder="Find a place or a person…"
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
        <ul id={`${id}-list`} role="listbox" aria-label="Places and entries" className="absolute left-0 right-0 top-full z-40 mt-1 border border-ink bg-paper-warm py-1 shadow-[4px_4px_0_0_rgba(22,22,26,0.08)]">
          {results.map((r, i) => (
            <li
              key={r.type === "place" ? r.p.id : r.e.id}
              id={`${id}-o${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(r);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-baseline gap-2 px-3 py-1.5 ${i === active ? "bg-paper-deep" : ""}`}
            >
              {r.type === "place" ? (
                <>
                  <span aria-hidden="true" className="inline-block h-2 w-2 translate-y-[-1px] rounded-full bg-ink" />
                  <span className="min-w-0 flex-1 truncate font-serif text-[1rem]">
                    {r.p.name}
                    {r.via && <span className="font-sans text-[0.78rem] text-faint"> ({r.via})</span>}
                  </span>
                  <span className="label shrink-0 text-faint">{PLACE_KIND_LABELS[r.p.kind].split(" ")[0]}</span>
                </>
              ) : (
                <>
                  <span className="translate-y-[1px]">
                    <KindSwatch kind={r.e.kind} size={10} />
                  </span>
                  <span className="min-w-0 flex-1 truncate font-serif text-[1rem]">{r.e.title}</span>
                  <span className="label shrink-0 text-faint">{kindLabel(r.e.kind)}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
