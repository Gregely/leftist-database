import type { ReactNode } from "react";
import { SearchProvider } from "@/components/search/SearchProvider";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/** Public-site chrome: header, search overlay, footer. */
export function SiteShell({ children, banner }: { children: ReactNode; banner?: ReactNode }) {
  return (
    <SearchProvider>
      {banner}
      <SiteHeader />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <SiteFooter />
    </SearchProvider>
  );
}
