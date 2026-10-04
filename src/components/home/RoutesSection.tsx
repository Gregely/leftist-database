import Link from "next/link";
import { ArrowLink, Container, SectionHead } from "@/components/editorial/primitives";
import type { GuidedListing, PathListing } from "@/lib/data";

/**
 * Routes through the collection: the published Guided journeys, then the
 * learning paths, each drawn as a line of stations naming its real stops.
 * Both are read from the database; nothing here names a particular journey.
 */
export function RoutesSection({ number, journeys, paths }: { number?: string; journeys: GuidedListing[]; paths: PathListing[] }) {
  if (!journeys.length && !paths.length) return null;
  const routes = [
    ...journeys.map((j) => ({ id: j.id, kind: "Guided journey", title: j.title, entry: j.entryLine, href: `/guided/${j.slug}`, stops: j.steps.map((s) => s.title), unit: "steps", level: j.level, slug: j.slug as string | null })),
    ...paths.map((p) => ({ id: p.id, kind: "Learning path", title: p.title, entry: p.entryLine, href: p.href, stops: p.steps.map((s) => s.title), unit: "stops", level: p.level, slug: null as string | null })),
  ];
  return (
    <section aria-labelledby="routes-heading" className="bg-paper-deep">
      <Container className="py-14 sm:py-20">
        <SectionHead
          number={number}
          id="routes-heading"
          label="Routes through the collection"
          title="For readers who want an order to follow."
          aside={
            <span className="flex gap-5">
              <ArrowLink href="/guided">Guided</ArrowLink>
              <ArrowLink href="/paths">All paths</ArrowLink>
            </span>
          }
        />
        <p className="mt-4 max-w-2xl text-muted">
          Guided journeys and learning paths take a subject in order. Every stop is a full entry, and any of them can be left
          for the rest of the collection.
        </p>
        <ul className="mt-10 grid gap-x-14 gap-y-2 lg:grid-cols-2">
          {routes.map((r) => (
            <li key={r.id} className="border-t border-ink" data-home-route={r.slug ?? undefined}>
              <Link href={r.href} className="group block py-5">
                <span className="flex items-baseline justify-between gap-4">
                  <span className={`label ${r.slug ? "text-red" : "text-faint"}`}>{r.kind}</span>
                  <span className="label-mono text-faint">
                    {r.stops.length} {r.unit}
                    {r.level ? ` · ${r.level}` : ""}
                  </span>
                </span>
                <span className="mt-1.5 block font-serif text-[1.65rem] leading-tight transition-colors group-hover:text-red sm:text-[1.9rem]">{r.title}</span>
                {r.entry && <span className="mt-1 block font-serif text-[1.05rem] italic text-muted">“{r.entry}”</span>}
                <RouteLine stops={r.stops} />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** The stops on a line; the first filled red. Names are shown where there is room. */
function RouteLine({ stops }: { stops: string[] }) {
  if (stops.length < 2) return null;
  const shown = stops.slice(0, 7);
  return (
    <span aria-hidden="true" className="mt-4 hidden sm:block">
      <span className="relative flex justify-between">
        <span className="absolute inset-x-1 top-[5px] h-px bg-ink" />
        {shown.map((s, i) => (
          <span key={i} className="relative flex w-0 flex-col items-center">
            <span className={`block h-[11px] w-[11px] rounded-full border ${i === 0 ? "border-red bg-red" : "border-ink bg-paper-deep"}`} />
          </span>
        ))}
      </span>
      <span className="mt-2 flex justify-between gap-2 text-[0.75rem] leading-tight text-faint">
        {shown.map((s, i) => (
          <span key={i} className={`line-clamp-2 max-w-[6.5rem] ${i === 0 ? "text-left" : i === shown.length - 1 ? "text-right" : "text-center"} ${i % 2 && shown.length > 5 ? "invisible lg:visible" : ""}`}>
            {s}
          </span>
        ))}
      </span>
      {stops.length > shown.length && <span className="label-mono mt-1 block text-right text-faint">+ {stops.length - shown.length} more</span>}
    </span>
  );
}
