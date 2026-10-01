import Link from "next/link";
import { SITE } from "@/lib/site";
import { Wordmark } from "./Wordmark";

const COLUMNS = [
  {
    title: "The Atlas",
    links: [
      { label: "Explore the library", href: "/explore" },
      { label: "Thinkers", href: "/thinkers" },
      { label: "Concepts", href: "/concepts" },
      { label: "Tendencies", href: "/tendencies" },
      { label: "Texts", href: "/texts" },
    ],
  },
  {
    title: "Ways in",
    links: [
      { label: "Debates", href: "/debates" },
      { label: "Timeline", href: "/timeline" },
      { label: "Learning paths", href: "/paths" },
      { label: "Search", href: "/search" },
      { label: "Your bookmarks", href: "/bookmarks" },
    ],
  },
  {
    title: "Method",
    links: [
      { label: "Sources & bibliography", href: "/sources" },
      { label: "About this edition", href: "/about" },
      { label: "Editorial desk", href: "/admin" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-14 sm:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark variant="stacked" className="text-[2rem] tracking-[0.16em] text-paper sm:text-[2.6rem]" />
            <p className="mt-6 max-w-sm font-serif text-lg leading-snug text-ink-muted">
              {SITE.tagline} — ideas, thinkers, texts, tendencies and debates, and the relations between them.
            </p>
          </div>
          {COLUMNS.map((c) => (
            <div key={c.title} className="md:col-span-2">
              <h2 className="label mb-4 font-sans text-ink-muted">{c.title}</h2>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-sweep text-[0.95rem] text-paper">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/15 pt-5 text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="label">
            {SITE.edition} · {SITE.year}
          </p>
          <p className="max-w-xl text-xs leading-relaxed">
            Entries marked <span className="text-paper">Sample</span> are placeholders demonstrating the system. They are
            not finished scholarship; quotations are flagged until verified against a cited edition.
          </p>
        </div>
      </div>
    </footer>
  );
}
