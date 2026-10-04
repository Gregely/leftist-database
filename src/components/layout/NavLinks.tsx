"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS } from "@/lib/site";
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

const linkCls = (active: boolean) =>
  `label relative flex h-full items-center whitespace-nowrap transition-colors hover:text-red ${active ? "text-red" : "text-ink"} after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:origin-left after:bg-red after:transition-transform after:duration-300 ${active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`;

/** Desktop primary navigation: Guided, set apart, then the collection in reading order. */
export function NavLinks() {
  const pathname = usePathname() ?? "/";
  const route = useActiveRoute();
  const guided = isActive(pathname, "/guided");
  return (
    <ul className="flex h-full items-stretch">
      <li className="flex items-stretch border-r border-rule pr-5 xl:pr-6">
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
      {SECTIONS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href} className="flex items-stretch pl-4 xl:pl-5">
            <Link href={item.href} aria-current={active ? "page" : undefined} className={linkCls(active)}>
              {item.short}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
