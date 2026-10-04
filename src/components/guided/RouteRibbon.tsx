"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clearActiveRoute, useActiveRoute } from "@/lib/client/route";
import { RouteGlyph } from "@/components/layout/NavLinks";

/**
 * A slim line under the masthead while a reader is following a Guided
 * journey and has stepped out of it: where they were, and the way back. On an
 * entry that is itself a stop on the journey it says which step it is.
 * Kept in this browser only; dismissing it forgets the route (not the progress).
 */
export function RouteRibbon() {
  const pathname = usePathname() ?? "/";
  const route = useActiveRoute();
  if (!route || pathname.startsWith("/guided") || pathname.startsWith("/preview") || pathname === "/") return null;
  const here = route.stops.findIndex((s) => s.href === pathname);
  const stepHref = (n: number) => route.href.replace(/step=\d+/, `step=${n}`);
  return (
    <div className="border-b border-ink bg-paper-deep" data-route-ribbon={route.slug}>
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-2 sm:px-8 lg:px-10">
        <RouteGlyph className="hidden shrink-0 text-red sm:block" />
        <p className="min-w-0 flex-1 truncate text-[0.9rem]">
          <span className="label mr-2 text-red">Guided</span>
          {here >= 0 ? (
            <>
              This entry is step {here + 1} of <span className="font-serif italic">{route.title}</span>
            </>
          ) : (
            <>
              You left <span className="font-serif italic">{route.title}</span> at step {route.step} of {route.total}
            </>
          )}
        </p>
        <Link href={here >= 0 ? stepHref(here + 1) : route.href} className="group label inline-flex shrink-0 items-center gap-1.5 text-red">
          <span className="link-sweep">{here >= 0 ? `Back to step ${here + 1}` : "Return to the route"}</span>
          <span aria-hidden="true">→</span>
        </Link>
        <button type="button" onClick={clearActiveRoute} className="label shrink-0 px-1 text-faint hover:text-ink" aria-label="Leave the Guided route">
          ✕
        </button>
      </div>
    </div>
  );
}
