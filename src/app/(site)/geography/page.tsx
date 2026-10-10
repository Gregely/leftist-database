import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/editorial/primitives";
import { GeoMap } from "@/components/geo/GeoMap";
import type { GeoData, GeoState } from "@/components/geo/types";
import { PLACE_ROLE_META, PLACE_ROLES } from "@/lib/content/model";
import { getGeography } from "@/lib/data";
import { basemap, project } from "@/lib/geo/basemap";

export const metadata: Metadata = {
  title: "Geography",
  description: "Where socialist thinkers were born, lived, organised, wrote and went into exile; where movements formed and events took place.",
};

type Props = { searchParams: Promise<Record<string, string | undefined>> };

/** Map state from the address, so a view can be shared or bookmarked. */
function parseState(sp: Record<string, string | undefined>): GeoState {
  const from = Number(sp.from);
  const to = Number(sp.to);
  return {
    kinds: sp.kinds?.split(",").filter(Boolean),
    roles: sp.roles?.split(",").filter(Boolean),
    period: Number.isFinite(from) && Number.isFinite(to) && from < to ? [from, to] : null,
    place: sp.place ?? null,
    trace: sp.trace ?? null,
  };
}

/**
 * Geography: the collection on a world map. A separate way into the
 * collection from the Theory Map: that one arranges entries by their
 * intellectual relations, this one by where things happened.
 */
export default async function GeographyPage({ searchParams }: Props) {
  const initial = parseState(await searchParams);
  const geo = await getGeography();
  const data: GeoData = {
    // The land itself is fetched from /geography/land; the page carries only the frame.
    basemap: { ...basemap(), land: "", detail: "" },
    places: geo.places.map((p) => ({ ...p, at: project(p.lon, p.lat) })),
    entries: geo.entries,
    links: geo.links,
    years: [Math.floor(geo.years[0] / 10) * 10, Math.ceil((geo.years[1] + 1) / 10) * 10],
    unlocated: geo.unlocated,
  };
  const counts = PLACE_ROLES.map((r) => [r, geo.links.filter((l) => l.role === r).length] as const).filter(([, n]) => n);

  return (
    <>
      <Container className="pt-5 sm:pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink pb-2">
          <p className="label flex items-center gap-2 text-muted">
            <Link href="/explore" className="hover:text-red">
              Atlas
            </Link>
            <span aria-hidden="true" className="text-rule">
              /
            </span>
            <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-blue" />
            <span className="text-ink">Geography</span>
          </p>
          <p className="label-mono text-faint">
            {geo.places.length} places · {geo.entries.length} entries
          </p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-2 pb-4 pt-4 sm:pb-5 sm:pt-8">
          <h1 className="display text-[2.8rem] sm:text-[3.8rem]">
            Geography<span className="text-red">.</span>
          </h1>
          <p className="hidden max-w-[30rem] pb-2 font-serif text-[1.05rem] italic leading-snug text-muted sm:block">
            Where the tradition was born, organised, published and went into exile. Select a place, or trace a life across the map.
          </p>
        </div>
      </Container>

      <Container>
        {data.places.length ? (
          <GeoMap data={data} initial={initial} />
        ) : (
          <p className="border-y border-ink py-10 text-center font-serif text-lg italic text-muted">No places are recorded for published entries yet.</p>
        )}

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <section aria-labelledby="geo-notes-h" className="lg:col-span-7">
            <h2 id="geo-notes-h" className="label border-t-[3px] border-ink pt-3 font-sans">
              Notes on the map
            </h2>
            <div className="prose-atlas mt-5 max-w-[40rem] !text-[1.08rem]">
              <p>
                A place appears here because an entry ties it to someone or something in the collection. Birthplaces, places
                of death and the locations of events come from the entries themselves. Other associations are recorded
                separately, each with its dates, a note and a source: where people lived, worked politically and went into
                exile, and where texts were written and first published.
              </p>
              <p>
                These are different kinds of fact, and the filters keep them apart. Living in London in exile is not the same
                as being born there, and a pamphlet printed in Zurich was not necessarily written there. A movement&rsquo;s
                influence over a whole region is shown as a name across the area, not as a point.
              </p>
              <p>
                Places carry the names of their time, with the present-day name alongside: Petrograd, Breslau, Simbirsk.
                No modern borders are drawn, because almost none of them held for the whole period; each place notes the
                state it belonged to. Coordinates are taken from Wikidata. A wording that names no single place, such as
                &ldquo;Global&rdquo;, is left off the map.
              </p>
              <p>
                For how ideas relate to one another rather than where they happened, see{" "}
                <Link href="/map" className="underline decoration-rule underline-offset-2 hover:text-red">
                  the Theory Map
                </Link>
                .
              </p>
            </div>
          </section>
          <aside aria-labelledby="geo-kinds-h" className="lg:col-span-4 lg:col-start-9">
            <h2 id="geo-kinds-h" className="label border-t-[3px] border-ink pt-3 font-sans">
              Associations on the map
            </h2>
            <ul className="mt-3">
              {counts.map(([r, n]) => (
                <li key={r} className="flex items-baseline justify-between border-b border-rule py-2">
                  <span className="font-serif text-[1.08rem]">{PLACE_ROLE_META[r].label}</span>
                  <span className="numeral text-red">{n}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </>
  );
}
