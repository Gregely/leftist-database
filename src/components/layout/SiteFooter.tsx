import Link from "next/link";
import { MORE, SECTIONS, SITE } from "@/lib/site";
import { Wordmark } from "./Wordmark";

const WAYS_IN = [
  { label: "Guided journeys", href: "/guided" },
  { label: "Learning paths", href: "/paths" },
  { label: "Search", href: "/search" },
  { label: "Saved entries", href: "/bookmarks" },
];

/** Back matter: the collection's index, ways in, the apparatus, and the edition note. */
export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-12 sm:px-8 lg:px-10">
        <div className="grid gap-12 border-t-[3px] border-paper/80 pt-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark variant="stacked" className="text-[2.6rem] text-paper sm:text-[3.4rem]" />
            <p className="mt-6 max-w-sm font-serif text-[1.15rem] leading-snug text-ink-muted">
              {SITE.tagline}: ideas, thinkers, texts, tendencies and debates, and the relations between them.
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7">
            <div>
              <h2 className="label mb-3 border-b border-white/20 pb-2 font-sans text-ink-muted">The collection</h2>
              <ul className="space-y-1.5">
                {SECTIONS.map((l) => (
                  <li key={l.href} className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 opacity-80" style={{ background: l.tone === "var(--color-ink)" ? "var(--color-paper)" : l.tone }} />
                    <Link href={l.href} className="link-sweep font-serif text-[1.05rem]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="label mb-3 border-b border-white/20 pb-2 font-sans text-ink-muted">Ways in</h2>
              <ul className="space-y-1.5">
                {WAYS_IN.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-sweep font-serif text-[1.05rem]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="label mb-3 border-b border-white/20 pb-2 font-sans text-ink-muted">Apparatus</h2>
              <ul className="space-y-1.5">
                {[...MORE.filter((m) => m.href !== "/paths"), { label: "Editorial desk", href: "/admin" }].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-sweep font-serif text-[1.05rem]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/20 pt-5 text-ink-muted sm:flex-row sm:items-baseline sm:justify-between">
          <p className="label">
            {SITE.edition} · {SITE.year}
          </p>
          <p className="max-w-xl text-[0.8rem] leading-relaxed">
            Entries marked <span className="text-paper">Sample</span> are placeholders demonstrating the system. They are
            not finished scholarship; quotations are flagged until verified against a cited edition.
          </p>
        </div>
      </div>
    </footer>
  );
}
