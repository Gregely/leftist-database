import type { Metadata } from "next";
import Link from "next/link";
import { Container, lifespan } from "@/components/editorial/primitives";
import { AtlasMap, type AtlasMapState } from "@/components/map/AtlasMap";
import { KindSwatch, MAP_KINDS } from "@/components/map/style";
import { KINDS, type EntityKind } from "@/lib/content/model";
import { getAtlasGraph } from "@/lib/data";
import { buildAtlas } from "@/lib/graph/atlas";

export const metadata: Metadata = {
  title: "The Theory Map",
  description: "Thinkers, ideas, texts, tendencies and events, connected by influence, critique, response and affinity, across time.",
};

type Props = { searchParams: Promise<Record<string, string | undefined>> };

/** Map state from the address, so a view can be shared or bookmarked. */
function parseState(sp: Record<string, string | undefined>): AtlasMapState {
  const kinds = sp.kinds
    ?.split(",")
    .filter((k): k is EntityKind => (MAP_KINDS as string[]).includes(k));
  const from = Number(sp.from);
  const to = Number(sp.to);
  return {
    kinds: kinds?.length ? kinds : undefined,
    period: Number.isFinite(from) && Number.isFinite(to) && from < to ? [from, to] : null,
    arrange: sp.arrange === "links" ? "links" : "time",
    focus: sp.focus ?? null,
    view: sp.view ?? null,
    isolate: sp.isolate ? Math.min(2, Math.max(0, Number(sp.isolate) || 0)) : 0,
  };
}

/**
 * The Theory Map: the whole collection as an explorable plate. It opens on a
 * sparse overview (the most connected names, the strongest lines) and adds
 * detail as the reader zooms, hovers and selects.
 */
export default async function MapPage({ searchParams }: Props) {
  const initial = parseState(await searchParams);
  const data = buildAtlas(await getAtlasGraph());
  const hubs = [...data.nodes].sort((a, b) => b.importance - a.importance).slice(0, 10);
  const counts = MAP_KINDS.map((k) => [k, data.nodes.filter((n) => n.kind === k).length] as const).filter(([, n]) => n);

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
            <span aria-hidden="true" className="inline-block h-2 w-2 bg-ink" />
            <span className="text-ink">Theory Map</span>
          </p>
          <p className="label-mono text-faint">
            {data.nodes.length} entries · {data.edges.length} relations
          </p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-2 pb-4 pt-4 sm:pb-5 sm:pt-8">
          <h1 className="display text-[2.8rem] sm:text-[3.8rem]">
            The Theory Map<span className="text-red">.</span>
          </h1>
          <p className="hidden max-w-[30rem] pb-2 font-serif sm:block text-[1.05rem] italic leading-snug text-muted">
            The collection as one plate. Zoom in for more names; select an entry to follow its connections.
          </p>
        </div>
      </Container>

      <Container>
        <AtlasMap data={data} initial={initial} />

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <section aria-labelledby="reading-h" className="lg:col-span-7">
            <h2 id="reading-h" className="label border-t-[3px] border-ink pt-3 font-sans">
              Notes on the map
            </h2>
            <div className="prose-atlas mt-5 max-w-[40rem] !text-[1.08rem]">
              <p>
                By time, entries run left to right: thinkers at the height of their working lives (about thirty-five), texts
                and events at their date, tendencies where they emerged. Ideas and debates without a date sit at the
                median date of the entries they connect to. The axis is stretched where the collection is dense, so the
                decades that hold most entries get most of the room; the years marked on it are exact. Events run along
                the top, then tendencies, thinkers, texts, and ideas at the foot.
              </p>
              <p>
                By connection, there is no axis: entries settle near those they are related to. In both, the larger and
                darker a mark, the more connected the entry. Each line is an editorial reading of the record, open to
                question; the note and source behind it are on the entries it joins.
              </p>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2" aria-label="Entries on the map">
              {counts.map(([k, n]) => (
                <li key={k} className="label inline-flex items-center gap-2 text-muted">
                  <KindSwatch kind={k} size={11} />
                  {n} {n === 1 ? KINDS[k].label.toLowerCase() : KINDS[k].plural.toLowerCase()}
                </li>
              ))}
            </ul>
          </section>
          <aside aria-labelledby="hubs-h" className="lg:col-span-4 lg:col-start-9">
            <h2 id="hubs-h" className="label border-t-[3px] border-ink pt-3 font-sans">
              Most connected
            </h2>
            <ol className="mt-3">
              {hubs.map((h, i) => (
                <li key={h.id} className="border-b border-rule">
                  <Link href={h.href} className="group grid grid-cols-[1.75rem_1fr_auto] items-baseline gap-2 py-2.5">
                    <span className="label-mono text-faint">{i + 1}</span>
                    <span>
                      <span className="font-serif text-[1.15rem] leading-tight group-hover:text-red">{h.title}</span>
                      <span className="label ml-2 text-faint">{h.kind === "thinker" ? lifespan(h.yearStart, h.yearEnd, "thinker") : KINDS[h.kind].label}</span>
                    </span>
                    <span className="numeral text-red">{h.degree}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </Container>
    </>
  );
}
