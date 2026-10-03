import Link from "next/link";
import { ArrowLink } from "@/components/editorial/primitives";
import type { GuidedListing } from "@/lib/data";

/**
 * Beside the hero's search: the two ways of reading the collection at equal
 * weight, a Guided route or the library itself. The featured journey is the
 * first published one, from the same loader as /guided.
 */
export function WaysIn({ journeys }: { journeys: GuidedListing[] }) {
  const lead = journeys[0];
  return (
    <div className="border-t-2 border-ink" data-home-ways>
      <section aria-labelledby="guided-heading" className="border-b border-rule py-4 sm:py-5" data-home-guided>
        <h2 id="guided-heading" className="label font-sans text-red">
          Guided
        </h2>
        <p className="mt-1.5 font-serif text-[1.3rem] leading-tight sm:mt-2 sm:text-[1.85rem]">Structured routes through the collection.</p>
        <p className="mt-2 hidden text-[0.92rem] leading-snug text-muted sm:block">
          Step-by-step introductions: each step explains one idea, shows why it matters for the next, and links to the full
          entries.
        </p>
        {lead && (
          <p className="mt-3 text-sm text-muted" data-home-journey={lead.slug}>
            <span className="label mr-2 text-faint">Featured</span>
            <Link href={`/guided/${lead.slug}`} className="link-inline font-serif text-[1.05rem] text-ink">
              {lead.title}
            </Link>
            <span className="label-mono ml-2 text-faint">{lead.steps.length} steps</span>
          </p>
        )}
        <Link href="/guided" className="btn btn-red mt-3 sm:mt-4">
          Explore Guided <span aria-hidden="true">→</span>
        </Link>
      </section>
      <section aria-labelledby="explore-heading" className="py-4 sm:py-5">
        <h2 id="explore-heading" className="label font-sans">
          Explore
        </h2>
        <p className="mt-1.5 font-serif text-[1.3rem] leading-tight sm:mt-2 sm:text-[1.85rem]">The whole collection, by kind, period and connection.</p>
        <div className="mt-3 flex flex-wrap gap-x-7 gap-y-2">
          <ArrowLink href="/explore">Open the library</ArrowLink>
          <ArrowLink href="/explore#map">The Theory Map</ArrowLink>
        </div>
      </section>
    </div>
  );
}
