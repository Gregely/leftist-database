import { BookmarkCount } from "@/components/bookmarks/BookmarkCount";
import { SearchTrigger } from "@/components/search/SearchProvider";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { Wordmark } from "./Wordmark";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink bg-paper/95 backdrop-blur-[2px]">
      <a
        href="#main"
        className="label sr-only z-50 bg-ink px-3 py-2 text-paper focus:not-sr-only focus:absolute focus:left-4 focus:top-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-8">
        <Wordmark className="text-[0.8rem]" />
        <nav aria-label="Primary" className="hidden lg:block">
          <NavLinks />
        </nav>
        <div className="hidden items-center gap-6 lg:flex">
          <SearchTrigger className="hover:text-red" />
          <BookmarkCount />
        </div>
        <div className="flex items-center gap-4 lg:hidden">
          <SearchTrigger className="hover:text-red">
            <span className="label inline-flex h-10 items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 13 13" aria-hidden="true">
                <circle cx="5.5" cy="5.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                <path d="M9 9l3.5 3.5" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              <span className="sr-only sm:not-sr-only">Search</span>
            </span>
          </SearchTrigger>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
