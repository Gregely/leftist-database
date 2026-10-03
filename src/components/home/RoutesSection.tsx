import Link from "next/link";
import { ArrowLink, Container, SectionHead } from "@/components/editorial/primitives";
import type { GuidedListing, PathListing } from "@/lib/data";

/**
 * Routes through the collection: the published Guided journeys, then the
 * learning paths. Both are read from the database; nothing here names a
 * particular journey.
 */
export function RoutesSection({ number, journeys, paths }: { number: string; journeys: GuidedListing[]; paths: PathListing[] }) {
  if (!journeys.length && !paths.length) return null;
  const routes = [
    ...journeys.map((j) => ({ id: j.id, kind: "Guided journey", title: j.title, href: `/guided/${j.slug}`, steps: j.steps.length, unit: "steps", level: j.level, slug: j.slug })),
    ...paths.map((p) => ({ id: p.id, kind: "Learning path", title: p.title, href: p.href, steps: p.steps.length, unit: "stops", level: p.level, slug: null as string | null })),
  ];
  return (
    <section aria-labelledby="routes-heading" className="border-t border-ink bg-beige/45">
      <Container className="py-14 sm:py-20">
        <SectionHead
          number={number}
          id="routes-heading"
          label="Routes through the collection"
          aside={
            <span className="flex gap-6">
              <ArrowLink href="/guided">Guided</ArrowLink>
              <ArrowLink href="/paths">All paths</ArrowLink>
            </span>
          }
        />
        <p className="mt-4 max-w-2xl text-muted">
          Guided journeys and learning paths take a subject in order. Every stop is a full entry, and any of them can be left
          for the rest of the collection.
        </p>
        <ul className="mt-8 grid gap-x-12 md:grid-cols-2">
          {routes.map((r) => (
            <li key={r.id} className="border-t border-ink/70" data-home-route={r.slug ?? undefined}>
              <Link href={r.href} className="group grid grid-cols-[1fr_auto] items-end gap-6 py-5">
                <span>
                  <span className={`label block ${r.slug ? "text-red" : "text-faint"}`}>{r.kind}</span>
                  <span className="mt-1 block font-serif text-[1.55rem] leading-tight transition-colors group-hover:text-red sm:text-[1.8rem]">{r.title}</span>
                  <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="label text-faint">
                      {r.steps} {r.unit}
                      {r.level ? ` · ${r.level}` : ""}
                    </span>
                    <RouteGlyph steps={r.steps} />
                  </span>
                </span>
                <span aria-hidden="true" className="pb-1 text-2xl text-red transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** A route drawn as its stops on a line: the first filled red. */
function RouteGlyph({ steps }: { steps: number }) {
  if (steps < 2) return null;
  const w = Math.min(200, steps * 18);
  return (
    <svg width={w} height="12" className="hidden shrink-0 sm:block" aria-hidden="true">
      <line x1="4" y1="6" x2={w - 4} y2="6" className="stroke-ink" strokeWidth="1" />
      {Array.from({ length: steps }).map((_, i) => (
        <circle
          key={i}
          cx={4 + (i * (w - 8)) / (steps - 1)}
          cy="6"
          r={i === 0 ? 3.5 : 2.3}
          className={i === 0 ? "fill-red stroke-red" : "fill-paper stroke-ink"}
        />
      ))}
    </svg>
  );
}
