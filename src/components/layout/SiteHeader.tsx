import { BookmarkCount } from "@/components/bookmarks/BookmarkCount";
import { SearchTrigger } from "@/components/search/SearchProvider";
import { NavLinks } from "./NavLinks";
import { RunningHead } from "./MobileDock";
import { Wordmark } from "./Wordmark";

/**
 * The masthead. Desktop: wordmark, Guided set apart, the collection in reading
 * order, and a search field that is always one keystroke away ("/").
 * Phones: wordmark and a running head naming the current section; search and
 * the rest of the navigation live in the dock at the foot of the screen.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink bg-paper/95 backdrop-blur-[3px]">
      <a
        href="#main"
        className="label sr-only z-50 bg-ink px-3 py-2 text-paper focus:not-sr-only focus:absolute focus:left-4 focus:top-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-[1440px] items-stretch justify-between gap-5 px-4 sm:px-8 lg:h-[60px] lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <Wordmark className="text-[1.15rem] lg:text-[1.3rem]" />
          <RunningHead />
        </div>
        <nav aria-label="Primary" className="hidden lg:flex lg:items-stretch">
          <NavLinks />
        </nav>
        <div className="hidden items-center gap-5 lg:flex">
          <SearchTrigger className="group flex w-[3rem] items-center justify-between gap-3 border-b border-ink pb-1 text-left transition-colors hover:border-red xl:w-[12.5rem]">
            <span className="flex items-center gap-2">
              <SearchGlyph />
              <span className="hidden font-serif text-[0.98rem] italic text-faint group-hover:text-ink xl:inline">Search the Atlas</span>
              <span className="sr-only xl:hidden">Search</span>
            </span>
            <kbd className="label-mono hidden border border-rule px-1.5 leading-[1.35] text-faint xl:inline">/</kbd>
          </SearchTrigger>
          <BookmarkCount />
        </div>
      </div>
    </header>
  );
}

export function SearchGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true" className="shrink-0">
      <circle cx="6" cy="6" r="4.8" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9.6 9.6L13 13" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
