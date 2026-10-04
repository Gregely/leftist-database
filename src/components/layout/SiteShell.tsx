import type { ReactNode } from "react";
import { RouteRibbon } from "@/components/guided/RouteRibbon";
import { SearchProvider } from "@/components/search/SearchProvider";
import { MobileDock } from "./MobileDock";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/** Public-site chrome: masthead, Guided way-back ribbon, search overlay, footer and the phone dock. */
export function SiteShell({ children, banner }: { children: ReactNode; banner?: ReactNode }) {
  return (
    <SearchProvider>
      {banner}
      <SiteHeader />
      <RouteRibbon />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <SiteFooter />
      {/* Room for the dock at the foot of the screen on phones and tablets. */}
      <div aria-hidden="true" className="h-14 bg-ink lg:hidden" />
      <MobileDock />
    </SearchProvider>
  );
}
