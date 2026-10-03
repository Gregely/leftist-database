/** A plain GET form into the archive: works without JavaScript. */
export function HomeSearch({
  className = "",
  label = "Search the archive",
  hint,
}: {
  className?: string;
  label?: string;
  /** A short note under the field, e.g. the keyboard shortcut. */
  hint?: string;
}) {
  return (
    <form action="/search" role="search" className={`group mt-10 max-w-xl ${className}`}>
      <label htmlFor="home-search" className="label text-muted">
        {label}
      </label>
      <div className="mt-2 flex items-end gap-3 border-b border-ink pb-1 transition-colors focus-within:border-red">
        <input
          id="home-search"
          name="q"
          type="search"
          placeholder="alienation, the Commune, Luxemburg…"
          autoComplete="off"
          className="w-full bg-transparent py-1 font-serif text-2xl text-ink placeholder:text-faint/70 focus:outline-none"
        />
        <button type="submit" className="label shrink-0 pb-2 text-red hover:text-red-deep">
          Search →
        </button>
      </div>
      {hint && <p className="mt-2 hidden text-[0.8rem] text-faint sm:block">{hint}</p>}
    </form>
  );
}
