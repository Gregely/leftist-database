"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COLLECTION, EXPLORE, SECTIONS } from "@/lib/site";
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

const linkCls = (active: boolean) =>
  `label relative flex h-full items-center whitespace-nowrap transition-colors hover:text-red ${active ? "text-red" : "text-ink"} ${bar(active ? "page" : null)}`;

/**
 * Desktop primary navigation. Guided stands on its own. Explore leads the
 * collection: set heavier, then a short rule and its contents in a quieter
 * serif, like a running table of contents.
 */
export function NavLinks() {
  const pathname = usePathname() ?? "/";
  const route = useActiveRoute();
  const guided = isActive(pathname, "/guided");
  const explore = isActive(pathname, EXPLORE.href);
  const inCollection = explore || COLLECTION.some((s) => isActive(pathname, s.href));
  return (
    <ul className="flex h-full items-stretch">
      <li className="flex items-stretch border-r border-ink/70 pr-3 xl:pr-5">
        <Link href="/guided" aria-current={guided ? "page" : undefined} className={`${linkCls(guided)} gap-2`}>
          <RouteGlyph className="text-red" />
          Guided
          {route && !guided && (
            <span className="label-mono text-faint" title={`You are on step ${route.step} of ${route.title}`}>
              {route.step}/{route.total}
            </span>
          )}
        </Link>
      </li>
      <li className="flex items-stretch pl-3 xl:pl-5">
        <Link
          href={EXPLORE.href}
          aria-current={explore ? "page" : undefined}
          className={`label relative flex h-full items-center whitespace-nowrap font-semibold tracking-[0.16em] transition-colors hover:text-red ${explore ? "text-red" : "text-ink"} ${bar(explore ? "page" : inCollection ? "family" : null)}`}
        >
          {EXPLORE.label}
        </Link>
        <span aria-hidden="true" className="mx-2 h-px w-3 self-center bg-ink xl:mx-3 xl:w-5" />
        <ul aria-label="The collection" className="flex items-stretch">
          {COLLECTION.map((item, i) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href} className="flex items-stretch">
                {i > 0 && (
                  <span aria-hidden="true" className="self-center px-[3px] text-faint xl:px-1.5">
                    ·
                  </span>
                )}
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex h-full items-center whitespace-nowrap font-serif text-[0.86rem] transition-colors hover:text-red xl:text-[1.02rem] ${active ? "text-red" : "text-ink-warm"} ${bar(active ? "page" : null)}`}
                >
                  {item.short === item.label ? (
                    item.label
                  ) : (
                    <>
                      <span className="xl:hidden">{item.short}</span>
                      <span className="hidden xl:inline">{item.label}</span>
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </li>
    </ul>
  );
}
