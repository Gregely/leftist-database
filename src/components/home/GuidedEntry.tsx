import Link from "next/link";
import type { GuidedListing } from "@/lib/data";
import { RouteGlyph } from "@/components/layout/NavLinks";

/**
 * Beside the hero: Guided as one way in among several. A compact block on ink,
 * so it is easy to find without outweighing search or the collection. The
 * featured journey is the first published one, from the same loader as /guided.
 */
export function GuidedEntry({ journeys }: { journeys: GuidedListing[] }) {
  const lead = journeys[0];
  return (
    <section aria-labelledby="guided-heading" className="bg-ink px-5 pb-5 pt-4 text-paper sm:px-6" data-home-guided>
      <h2 id="guided-heading" className="label flex items-center gap-2 font-sans text-red-bright">
        <RouteGlyph />
        Guided
      </h2>
      <p className="mt-2 font-serif text-[1.55rem] leading-[1.12] sm:text-[1.8rem]">Structured routes through the collection.</p>
      {lead && (
        <div className="mt-4 border-t border-white/20 pt-3" data-home-journey={lead.slug}>
          <p className="label text-ink-muted">Featured journey</p>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-3">
            <Link href={`/guided/${lead.slug}`} className="font-serif text-[1.2rem] italic underline decoration-white/30 underline-offset-4 hover:decoration-red-bright">
              {lead.title}
            </Link>
            <span className="label-mono text-ink-muted">{lead.steps.length} steps</span>
          </p>
          {lead.steps.length > 1 && (
            <ol aria-hidden="true" className="mt-3 flex items-center">
              {lead.steps.map((s, i) => (
                <li key={i} className="flex flex-1 items-center last:flex-none" title={s.title}>
                  <span className={`block h-2 w-2 shrink-0 rounded-full border ${i === 0 ? "border-red-bright bg-red-bright" : "border-paper/70"}`} />
                  {i < lead.steps.length - 1 && <span className="h-px flex-1 bg-paper/40" />}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
      <Link href="/guided" className="group mt-5 inline-flex items-center gap-2 border-b border-red-bright pb-0.5 label text-paper">
        Explore Guided <span aria-hidden="true" className="text-red-bright transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </section>
  );
}
