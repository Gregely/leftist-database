import Link from "next/link";
import { ArrowLink } from "@/components/editorial/primitives";
import { JourneyActions } from "@/components/guided/JourneyProgress";
import type { GuidedListing, PathListing } from "@/lib/data";

/**
 * The homepage's Guided panel. It lists the published Guided journeys (the
 * same records as /guided), leading with the first in editorial order, and
 * the published learning paths as shorter structured routes. With no journey
 * published it says so and offers the learning paths instead.
 */
export function GuidedFeature({ journeys, paths }: { journeys: GuidedListing[]; paths: PathListing[] }) {
  const [lead, ...others] = journeys;
  return (
    <section aria-labelledby="guided-heading" className="border-t-2 border-ink bg-paper-warm" data-home-guided>
      <div className="px-5 pb-6 pt-4 sm:px-7 sm:pb-7">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="guided-heading" className="label font-sans">
            <span className="text-red">↘</span> Guided
          </h2>
          <ArrowLink href="/guided">{journeys.length > 1 ? `All ${journeys.length} journeys` : "Guided journeys"}</ArrowLink>
        </div>

        {lead ? (
          <article className="mt-5" data-home-journey={lead.slug}>
            <p className="label-mono text-faint">
              Journey · {lead.steps.length} steps{lead.level ? ` · ${lead.level}` : ""}
            </p>
            <h3 className="display mt-2 text-[2.3rem] leading-[0.95] sm:text-[2.9rem]">
              <Link href={`/guided/${lead.slug}`} className="hover:text-red">
                {lead.title}
              </Link>
            </h3>
            {lead.summary && <p className="mt-3 text-[1.02rem] leading-snug text-ink-warm">{lead.summary}</p>}
            {lead.steps.length > 0 && (
              <p className="mt-3 text-sm leading-snug text-muted">
                <span className="label mr-2 text-faint">Covers</span>
                {lead.steps
                  .slice(0, 6)
                  .map((s) => s.title)
                  .join(" · ")}
                {lead.steps.length > 6 ? ` · and ${lead.steps.length - 6} more` : ""}
              </p>
            )}
            <div className="mt-5 border-t border-rule pt-4">
              <JourneyActions slug={lead.slug} titles={lead.steps.map((s) => s.title)} stepHrefPrefix={`/guided/${lead.slug}?step=`} compact />
            </div>
            <p className="mt-4 hidden text-[0.82rem] leading-snug text-faint sm:block">
              Each step explains one idea, shows why it matters for the next, and links to the full entries. The sequence can
              be followed in order or left at any point.
            </p>
          </article>
        ) : (
          <div className="mt-5">
            <h3 className="display text-[2.1rem] leading-none sm:text-[2.5rem]">Guided journeys</h3>
            <p className="mt-3 text-[1.02rem] leading-snug text-ink-warm">
              Structured introductions that take a subject one step at a time. Each step explains an idea, shows why it
              matters for what follows, and links to the full entries.
            </p>
            <p className="mt-3 text-sm text-muted">No journey has been published yet. The learning paths below are shorter routes through the collection.</p>
          </div>
        )}

        {others.length > 0 && (
          <ul className="mt-5 border-t border-ink">
            {others.map((j) => (
              <li key={j.id} className="border-b border-rule">
                <Link href={`/guided/${j.slug}`} className="group grid grid-cols-[1fr_auto] items-baseline gap-4 py-3">
                  <span>
                    <span className="font-serif text-xl leading-tight group-hover:text-red">{j.title}</span>
                    <span className="label ml-3 text-faint">{j.steps.length} steps</span>
                  </span>
                  <span aria-hidden="true" className="text-red transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {paths.length > 0 && (
          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-1.5">
              <h3 className="label font-sans text-muted">Learning paths</h3>
              <ArrowLink href="/paths" className="text-[0.66rem]">
                All {paths.length}
              </ArrowLink>
            </div>
            <ul>
              {paths.slice(0, lead ? 3 : 6).map((p, i) => (
                // Phones show the first three; the full list is one tap away under "All".
                <li key={p.id} className={`border-b border-rule ${i >= 3 ? "hidden sm:block" : ""}`}>
                  <Link href={p.href} className="group grid grid-cols-[1fr_auto] items-center gap-4 py-2.5">
                    <span>
                      <span className="font-serif text-[1.15rem] leading-tight group-hover:text-red">{p.title}</span>
                      <span className="mt-0.5 flex items-center gap-3">
                        <span className="label text-faint">
                          {p.steps.length} stops{p.level ? ` · ${p.level}` : ""}
                        </span>
                        <RouteGlyph steps={p.steps.length} />
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-red transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

/** A path drawn as its stops on a line: the first filled red. */
function RouteGlyph({ steps }: { steps: number }) {
  if (steps < 2) return null;
  const w = Math.min(120, steps * 12);
  return (
    <svg width={w} height="10" className="hidden shrink-0 sm:block" aria-hidden="true">
      <line x1="3" y1="5" x2={w - 3} y2="5" className="stroke-ink" strokeWidth="1" />
      {Array.from({ length: steps }).map((_, i) => (
        <circle
          key={i}
          cx={3 + (i * (w - 6)) / (steps - 1)}
          cy="5"
          r={i === 0 ? 3 : 1.9}
          className={i === 0 ? "fill-red stroke-red" : "fill-paper-warm stroke-ink"}
        />
      ))}
    </svg>
  );
}
