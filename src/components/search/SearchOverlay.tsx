"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { KINDS } from "@/lib/content/model";
import { SECTIONS } from "@/lib/site";
import type { SearchResults } from "@/lib/data/search";
import { Highlight } from "./Highlight";

const SUGGESTIONS = ["alienation", "Paris Commune", "hegemony", "the state", "mutual aid", "Fanon", "1917", "Capital"];

function years(a: number | null, b: number | null) {
  if (!a) return null;
  return b ? `${a}–${b}` : `${a}`;
}

export function SearchOverlay({ initialQuery, onClose }: { initialQuery: string; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [res, setRes] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const flat = useMemo(() => res?.groups.flatMap((g) => g.hits) ?? [], [res]);

  useEffect(() => {
    inputRef.current?.focus();
    const prev = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, []);

  useEffect(() => {
    const term = q.trim();
    if (!term) {
      setRes(null);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        if (r.ok) {
          setRes(await r.json());
          setActive(-1);
        }
      } catch {
        /* aborted */
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 140);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [q]);

  function go(href: string) {
    onClose();
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(flat.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(-1, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && flat[active]) go(flat[active].href);
      else if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
    } else if (e.key === "Tab") {
      // Keep focus inside the dialog.
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("a[href], button, input");
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  useEffect(() => {
    if (active < 0) return;
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, listId]);

  let index = -1;
  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Search the archive"
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[60] flex flex-col bg-paper-warm/[0.985] animate-fade"
    >
      <div className="mx-auto flex w-full max-w-[1320px] flex-1 flex-col overflow-hidden px-4 sm:px-8">
        <div className="flex items-center justify-between border-b-[3px] border-ink py-4">
          <p className="label">Search the Atlas</p>
          <button type="button" onClick={onClose} className="label inline-flex items-center gap-2 hover:text-red">
            Close <kbd className="label-mono border border-rule px-1 text-faint">Esc</kbd>
          </button>
        </div>

        <div className="relative border-b border-rule py-6 sm:py-10">
          <label htmlFor={`${listId}-input`} className="sr-only">
            Search thinkers, concepts, texts, debates, tendencies and events
          </label>
          <input
            id={`${listId}-input`}
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            role="combobox"
            aria-expanded={flat.length > 0}
            aria-controls={listId}
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            placeholder="A thinker, a concept, a year…"
            className="display w-full bg-transparent text-[2.3rem] leading-tight text-ink placeholder:italic placeholder:text-faint/70 focus:outline-none sm:text-[4rem]"
          />
          <span
            aria-hidden="true"
            className={`absolute bottom-0 left-0 h-[2px] bg-red transition-all duration-500 ${loading ? "w-1/3" : q ? "w-full" : "w-10"}`}
          />
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto pb-16 pt-6">
          {!q.trim() && (
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-7">
                <p className="label mb-4 text-muted">Try</p>
                <ul className="flex flex-wrap gap-x-6 gap-y-3">
                  {SUGGESTIONS.map((s) => (
                    <li key={s}>
                      <button type="button" onClick={() => setQ(s)} className="serif-italic text-2xl text-ink hover:text-red">
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-4 md:col-start-9">
                <p className="label mb-4 text-muted">Browse</p>
                <ul className="divide-y divide-rule border-y border-ink">
                  {SECTIONS.map((sec) => (
                    <li key={sec.href}>
                      <Link href={sec.href} onClick={onClose} className="group flex items-center gap-3 py-2.5">
                        <span aria-hidden="true" className="h-2 w-2 shrink-0" style={{ background: sec.tone }} />
                        <span className="font-serif text-[1.2rem] leading-none group-hover:text-red">{sec.label}</span>
                        <span aria-hidden="true" className="ml-auto text-red transition-transform group-hover:translate-x-1">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {q.trim() && res && res.total === 0 && !loading && (
            <p className="lede text-muted">
              No entries match <em>“{res.query}”</em>.
            </p>
          )}

          {res && res.total > 0 && (
            <div className="grid gap-10 lg:grid-cols-12">
              <div id={listId} role="listbox" aria-label="Results" className="space-y-10 lg:col-span-8">
                {res.groups.map((g) => (
                  <section key={g.kind} aria-label={KINDS[g.kind].plural}>
                    <h2 className="label mb-3 flex items-baseline justify-between border-b border-ink pb-2 font-sans">
                      <span>{KINDS[g.kind].label}</span>
                      <span className="label-mono text-faint">{g.hits.length}</span>
                    </h2>
                    <ul>
                      {g.hits.map((h) => {
                        index++;
                        const i = index;
                        const isActive = i === active;
                        return (
                          <li key={h.id} id={`${listId}-${i}`} role="option" aria-selected={isActive}>
                            <Link
                              href={h.href}
                              onClick={onClose}
                              onMouseEnter={() => setActive(i)}
                              tabIndex={-1}
                              className={`grid grid-cols-[1fr_auto] gap-x-6 border-b border-rule-soft py-3 transition-colors ${isActive ? "bg-paper" : ""}`}
                            >
                              <span>
                                <span className={`font-serif text-xl ${isActive ? "text-red" : ""}`}>{h.title}</span>
                                <span className="mt-1 block text-sm leading-snug text-muted">
                                  <Highlight text={h.snippet || h.summary} />
                                </span>
                              </span>
                              <span className="label-mono self-start pt-1.5 text-faint">{years(h.yearStart, h.yearEnd)}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
                <Link
                  href={`/search?q=${encodeURIComponent(res.query)}`}
                  onClick={onClose}
                  className="label inline-flex items-center gap-2 text-red"
                >
                  All results for “{res.query}” <span aria-hidden="true">→</span>
                </Link>
              </div>
              {res.related.length > 0 && (
                <aside className="lg:col-span-4">
                  <h2 className="label mb-3 border-b border-ink pb-2 font-sans">Connected</h2>
                  <ul className="space-y-2">
                    {res.related.map((r) => (
                      <li key={r.id} className="flex items-baseline justify-between gap-4">
                        <Link href={r.href} onClick={onClose} className="link-sweep font-serif text-lg">
                          {r.title}
                        </Link>
                        <span className="label text-faint">{KINDS[r.kind].label}</span>
                      </li>
                    ))}
                  </ul>
                </aside>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
