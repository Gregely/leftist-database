"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MORE, SECTIONS } from "@/lib/site";
import { useSearch } from "@/components/search/SearchProvider";
import { useBookmarks } from "@/lib/client/bookmarks";
import { useActiveRoute } from "@/lib/client/route";
import { isActive, RouteGlyph, sectionFor } from "./NavLinks";

/** Phones: the current section beside the wordmark, as a book's running head. */
export function RunningHead() {
  const pathname = usePathname() ?? "/";
  const section = sectionFor(pathname);
  if (!section) return null;
  return (
    <span className="label flex min-w-0 items-center gap-3 truncate text-faint lg:hidden">
      <span aria-hidden="true" className="h-4 w-px bg-rule" />
      {section}
    </span>
  );
}

/**
 * The reading dock: a fixed bar at the foot of the screen on phones and
 * tablets, within reach of the thumb. Index opens the whole collection as a
 * sheet; Guided, Search and Saved are one tap away. It slides out of the way
 * while reading down a page and returns on the way back up.
 */
export function MobileDock() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname() ?? "/";
  const { open: openSearch } = useSearch();
  const { items } = useBookmarks();
  const route = useActiveRoute();
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 8) return;
      setHidden(y > last && y > 240);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const guided = isActive(pathname, "/guided");
  const cell = "flex h-14 flex-1 flex-col items-center justify-center gap-1 transition-colors";

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-ink/30 animate-fade lg:hidden" aria-hidden="true" onClick={() => setOpen(false)} />
      )}
      {open && (
        <nav
          id="site-index"
          aria-label="Site index"
          className="fixed inset-x-0 bottom-14 z-50 max-h-[calc(100dvh-7.5rem)] overflow-y-auto border-t-[3px] border-ink bg-paper px-4 pb-6 pt-4 animate-rise sm:px-8 lg:hidden"
        >
          <form action="/search" role="search" className="flex items-end gap-3 border-b border-ink pb-1.5">
            <label htmlFor="dock-search" className="sr-only">
              Search thinkers, concepts, texts and debates
            </label>
            <input
              id="dock-search"
              name="q"
              type="search"
              placeholder="Search the Atlas…"
              className="w-full bg-transparent font-serif text-[1.35rem] italic placeholder:text-faint focus:outline-none"
            />
            <button type="submit" className="label pb-1.5 text-red">
              Go
            </button>
          </form>

          <Link
            href={route && !guided ? route.href : "/guided"}
            className="mt-4 flex items-center justify-between gap-4 bg-ink px-4 py-3 text-paper"
          >
            <span>
              <span className="label flex items-center gap-2 text-red-bright">
                <RouteGlyph /> Guided
              </span>
              <span className="mt-1 block font-serif text-[1.15rem] leading-tight">
                {route && !guided ? `Return to step ${route.step} of ${route.title}` : "Structured routes through the collection"}
              </span>
            </span>
            <span aria-hidden="true" className="text-xl text-red-bright">→</span>
          </Link>

          <p className="label mt-6 text-faint">The collection</p>
          <ol className="mt-1 border-t border-ink">
            {SECTIONS.map((l, i) => {
              const active = isActive(pathname, l.href);
              return (
                <li key={l.href} className="border-b border-rule">
                  <Link href={l.href} aria-current={active ? "page" : undefined} className="flex items-baseline gap-3 py-2.5">
                    <span className="label-mono w-5 text-faint">{String(i + 1).padStart(2, "0")}</span>
                    <span aria-hidden="true" className="h-2 w-2 shrink-0 self-center" style={{ background: l.tone }} />
                    <span className={`font-serif text-[1.55rem] leading-none ${active ? "text-red" : ""}`}>{l.label}</span>
                    <span className="ml-auto hidden text-right text-[0.78rem] leading-tight text-faint sm:block">{l.description}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {MORE.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="label text-muted hover:text-red">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-ink bg-paper/97 backdrop-blur-[3px] transition-transform duration-300 lg:hidden ${hidden && !open ? "translate-y-full" : ""}`}
      >
        <div className="mx-auto flex max-w-xl items-stretch divide-x divide-rule">
          <button
            ref={btn}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-index"
            className={`${cell} ${open ? "bg-ink text-paper" : ""}`}
          >
            <span aria-hidden="true" className="relative block h-2.5 w-4">
              <span className={`absolute left-0 top-0 h-[1.5px] w-4 bg-current transition-transform ${open ? "translate-y-[4.5px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-[4.5px] h-[1.5px] w-3 bg-red transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-[9px] h-[1.5px] w-4 bg-current transition-transform ${open ? "-translate-y-[4.5px] -rotate-45" : ""}`} />
            </span>
            <span className="label">{open ? "Close" : "Index"}</span>
          </button>
          <Link href={route && !guided ? route.href : "/guided"} className={`${cell} ${guided ? "text-red" : ""}`}>
            <RouteGlyph className="text-red" />
            <span className="label">{route && !guided ? `Step ${route.step}` : "Guided"}</span>
          </Link>
          <button type="button" onClick={() => openSearch()} className={cell} aria-haspopup="dialog">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <circle cx="6" cy="6" r="4.8" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M9.6 9.6L13 13" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <span className="label">Search</span>
          </button>
          <Link href="/bookmarks" className={`${cell} ${isActive(pathname, "/bookmarks") ? "text-red" : ""}`}>
            <span className="label-mono leading-none">{items.length}</span>
            <span className="label">Saved</span>
          </Link>
        </div>
      </div>
    </>
  );
}
