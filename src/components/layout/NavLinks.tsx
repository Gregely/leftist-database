"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { COLLECTION, EXPLORE, EXPLORE_GROUPS, EXPLORE_MORE, SECTIONS } from "@/lib/site";
import { useActiveRoute } from "@/lib/client/route";

export function isActive(pathname: string, href: string) {
  if (href === "/explore") return pathname === "/explore" || pathname.startsWith("/paths") || pathname.startsWith("/sources");
  if (href === "/guided") return pathname.startsWith("/guided");
  return pathname === href || pathname.startsWith(href + "/");
}

/** The section of the collection a path belongs to, for the running head. */
export function sectionFor(pathname: string) {
  if (pathname.startsWith("/guided")) return "Guided";
  if (pathname.startsWith("/search")) return "Search";
  if (pathname.startsWith("/bookmarks")) return "Saved";
  if (pathname.startsWith("/about")) return "About";
  return SECTIONS.find((s) => isActive(pathname, s.href))?.label ?? null;
}

/** Where a page sits inside Explore (a section, or a reference page), if it is not Explore's own page. */
export function placeInExplore(pathname: string): string | null {
  const s = COLLECTION.find((c) => isActive(pathname, c.href));
  if (s) return s.label;
  return EXPLORE_MORE.find((m) => isActive(pathname, m.href))?.label ?? null;
}

/** A route drawn as three stations on a line; the first one filled. */
export function RouteGlyph({ className = "" }: { className?: string }) {
  return (
    <svg width="22" height="8" viewBox="0 0 22 8" aria-hidden="true" className={className}>
      <line x1="3" y1="4" x2="19" y2="4" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="3.5" cy="4" r="2.6" fill="currentColor" />
      <circle cx="11" cy="4" r="2.1" fill="var(--color-paper)" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="18.5" cy="4" r="2.1" fill="var(--color-paper)" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** The red bar under the current page; an ink hairline marks the family a page belongs to. */
const bar = (state: "page" | "family" | null) =>
  `after:absolute after:inset-x-0 after:bottom-0 after:origin-left after:transition-transform after:duration-300 ${
    state === "page" ? "after:h-[3px] after:scale-x-100 after:bg-red" : state === "family" ? "after:h-px after:scale-x-100 after:bg-ink" : "after:h-[3px] after:scale-x-0 after:bg-red hover:after:scale-x-100"
  }`;

/**
 * Desktop primary navigation: Guided on its own, then Explore, the parent of
 * the collection. Explore is a link to its own page; the chevron beside it
 * (or hovering with a mouse, or ArrowDown) opens the collection's sections.
 * The page's place in the collection is named beside Explore.
 */
export function NavLinks() {
  const pathname = usePathname() ?? "/";
  const route = useActiveRoute();
  const guided = isActive(pathname, "/guided");
  const explorePage = pathname === EXPLORE.href;
  const within = placeInExplore(pathname);
  return (
    <ul className="flex h-full items-stretch">
      <li className="flex items-stretch">
        <Link
          href="/guided"
          aria-current={guided ? "page" : undefined}
          className={`label relative flex h-full items-center gap-2 whitespace-nowrap transition-colors hover:text-red ${guided ? "text-red" : "text-ink"} ${bar(guided ? "page" : null)}`}
        >
          <RouteGlyph className="text-red" />
          Guided
          {route && !guided && (
            <span className="label-mono text-faint" title={`You are on step ${route.step} of ${route.title}`}>
              {route.step}/{route.total}
            </span>
          )}
        </Link>
      </li>
      <li aria-hidden="true" className="mx-5 my-[18px] w-px bg-ink/60 xl:mx-7" />
      <ExploreMenu pathname={pathname} explorePage={explorePage} within={within} />
    </ul>
  );
}

function ExploreMenu({ pathname, explorePage, within }: { pathname: string; explorePage: boolean; within: string | null }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLLIElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  // Opened by a click or a key, the menu stays open until dismissed; opened by hovering, it closes when the mouse leaves.
  const pinned = useRef(false);

  const items = () => [...(panel.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? [])];
  // An explicit open or close (click, key, Escape) cancels any pending hover change.
  const show = useCallback((focus?: "first" | "last") => {
    window.clearTimeout(hoverTimer.current);
    pinned.current = true;
    setOpen(true);
    if (focus) window.requestAnimationFrame(() => (focus === "first" ? items()[0] : items().at(-1))?.focus());
  }, []);
  const hide = useCallback((returnFocus = false) => {
    window.clearTimeout(hoverTimer.current);
    setOpen(false);
    if (returnFocus) toggle.current?.focus();
  }, []);

  // Close on navigation, on a click or tap elsewhere, and when focus leaves the menu.
  useEffect(() => {
    window.clearTimeout(hoverTimer.current);
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) hide();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide(true);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, hide]);
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  // A mouse opens the menu on hover, with a short grace period on the way out; touch and pen use the chevron.
  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      if (!open) pinned.current = false;
      setOpen(true);
    }, 90);
  };
  const onLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(hoverTimer.current);
    if (pinned.current) return;
    hoverTimer.current = window.setTimeout(() => setOpen(false), 220);
  };

  const onPanelKey = (e: React.KeyboardEvent) => {
    const list = items();
    const i = list.indexOf(document.activeElement as HTMLAnchorElement);
    const go = (n: number) => {
      e.preventDefault();
      list[(n + list.length) % list.length]?.focus();
    };
    if (e.key === "ArrowDown") go(i + 1);
    else if (e.key === "ArrowUp") go(i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(list.length - 1);
  };

  const inCollection = explorePage || !!within;

  return (
    <li
      ref={root}
      className="relative flex items-stretch"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node | null)) hide();
      }}
    >
      <Link
        href={EXPLORE.href}
        aria-current={explorePage ? "page" : undefined}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            show("first");
          }
        }}
        className={`label relative flex h-full items-center whitespace-nowrap font-semibold tracking-[0.16em] transition-colors hover:text-red ${explorePage ? "text-red" : "text-ink"} ${bar(explorePage ? "page" : inCollection ? "family" : null)}`}
      >
        {EXPLORE.label}
      </Link>
      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        aria-label="The collection's sections"
        onClick={() => (open && pinned.current ? hide() : show())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            show("first");
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            show("last");
          }
        }}
        className="group -mr-1 flex h-full items-center px-1.5 text-ink transition-colors hover:text-red"
      >
        <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true" className={`transition-transform duration-200 ${open ? "rotate-180 text-red" : ""}`}>
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>
      {within && (
        <span className="flex items-center whitespace-nowrap pl-3 font-serif text-[0.98rem] italic text-ink-warm">
          <span aria-hidden="true" className="mr-3 h-px w-3 bg-rule" />
          <span className="sr-only">Current section: </span>
          {within}
        </span>
      )}

      <div
        ref={panel}
        id={`${id}-menu`}
        hidden={!open}
        onKeyDown={onPanelKey}
        // Following a link closes the menu, including a link to the page already open.
        onClick={(e) => (e.target as Element).closest("a") && hide()}
        className="absolute left-0 top-full z-50 w-[27rem] border-t-[3px] border-ink bg-paper-warm px-6 pb-4 pt-4 shadow-[0_10px_24px_-14px_rgba(22,22,26,0.35)]"
      >
        <Link
          href={EXPLORE.href}
          aria-current={explorePage ? "page" : undefined}
          className={`group flex items-baseline justify-between border-b border-ink pb-2 outline-none hover:text-red focus-visible:[&>span:first-child]:underline focus-visible:[&>span:first-child]:underline-offset-[5px] ${explorePage ? "text-red" : ""}`}
        >
          <span className="label font-semibold tracking-[0.16em]">The whole collection</span>
          <span aria-hidden="true" className="text-red transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
        <div className="mt-3 grid grid-cols-[1.15fr_1fr] gap-x-6">
          {EXPLORE_GROUPS.map((g, gi) => (
            <div key={g.key} className={gi > 0 ? "border-l border-rule pl-6" : ""}>
              <p id={`${id}-${g.key}`} className="label pb-1 text-faint">
                {g.label}
              </p>
              <ul aria-labelledby={`${id}-${g.key}`}>
                {g.items.map((s) => {
                  const active = isActive(pathname, s.href);
                  return (
                    <li key={s.href}>
                      <Link
                        href={s.href}
                        aria-current={active ? "page" : undefined}
                        className={`group flex items-center gap-2.5 py-[5px] font-serif text-[1.08rem] leading-tight outline-none transition-colors hover:text-red [&:focus-visible>span:last-child]:underline [&:focus-visible>span:last-child]:decoration-ink [&:focus-visible>span:last-child]:decoration-1 [&:focus-visible>span:last-child]:underline-offset-[5px] ${active ? "text-red" : "text-ink"}`}
                      >
                        <span aria-hidden="true" className="h-2 w-2 shrink-0" style={{ background: s.tone }} />
                        <span className={active ? "underline decoration-red decoration-2 underline-offset-[5px]" : ""}>{s.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <ul className="mt-3 flex gap-x-5 border-t border-rule pt-2.5">
          {EXPLORE_MORE.map((m) => {
            const active = isActive(pathname, m.href);
            return (
              <li key={m.href}>
                <Link href={m.href} aria-current={active ? "page" : undefined} className={`label underline-offset-[5px] outline-none hover:text-red focus-visible:underline focus-visible:decoration-ink ${active ? "text-red underline decoration-red decoration-2" : "text-muted"}`}>
                  {m.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}
