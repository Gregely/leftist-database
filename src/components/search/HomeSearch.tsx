import Link from "next/link";

/**
 * The front door's search: a plain GET form into /search, so it works without
 * JavaScript. Set large, as the first thing a reader who knows what they want
 * can use. `suggestions` are real entry titles passed in by the page.
 */
export function HomeSearch({
  className = "",
  label = "Search the Atlas",
  hint,
  suggestions = [],
}: {
  className?: string;
  label?: string;
  /** A short note under the field, e.g. the keyboard shortcut. */
  hint?: string;
  suggestions?: string[];
}) {
  return (
    <form action="/search" role="search" className={`group ${className}`}>
      <label htmlFor="home-search" className="label text-faint">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-3 border-b-2 border-ink pb-2 transition-colors focus-within:border-red">
        <svg width="22" height="22" viewBox="0 0 14 14" aria-hidden="true" className="hidden shrink-0 text-faint sm:block">
          <circle cx="6" cy="6" r="4.8" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <path d="M9.6 9.6L13 13" stroke="currentColor" strokeWidth="1.1" />
        </svg>
        <input
          id="home-search"
          name="q"
          type="search"
          placeholder="Thinkers, concepts, texts, debates…"
          autoComplete="off"
          className="w-full min-w-0 bg-transparent py-1 font-serif text-[1.3rem] text-ink placeholder:italic placeholder:text-faint focus:outline-none sm:text-[1.9rem]"
        />
        <button type="submit" className="btn btn-red shrink-0">
          Search
        </button>
      </div>
      {(suggestions.length > 0 || hint) && (
        <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          {suggestions.length > 0 && (
            <p className="text-[0.95rem]">
              <span className="label mr-2 text-faint">Try</span>
              {suggestions.map((s, i) => (
                <span key={s}>
                  <Link href={`/search?q=${encodeURIComponent(s)}`} className="link-inline font-serif italic">
                    {s}
                  </Link>
                  {i < suggestions.length - 1 && <span className="text-faint"> · </span>}
                </span>
              ))}
            </p>
          )}
          {hint && <p className="hidden text-[0.8rem] text-faint lg:block">{hint}</p>}
        </div>
      )}
    </form>
  );
}
