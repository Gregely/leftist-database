import type { Metadata } from "next";
import Link from "next/link";
import { IndexHeader } from "@/components/editorial/IndexHeader";
import { ArrowLink, Container, lifespan, SectionHead } from "@/components/editorial/primitives";
import { MapFigure } from "@/components/graph/MapFigure";
import {
  getArchiveStats,
  getDebatePositionLabels,
  getGraph,
  getTendencyColors,
  getTimeline,
  listEntities,
  listPaths,
  withTendencies,
} from "@/lib/data";
import { TENDENCY_COLOR_VALUES, type TendencyColor } from "@/lib/content/model";
import { PERIODS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Explore the library",
  description: "Thinkers, concepts, tendencies, debates, texts and periods — the whole Atlas in one place.",
};

/** Book spines in the bookcloth colours. */
const SPINE_TONES = ["bg-ink text-paper", "bg-red-deep text-paper", "bg-blue text-paper", "bg-beige text-ink", "bg-olive text-paper", "bg-paper-warm text-ink", "bg-umber text-paper", "bg-red text-paper"];

export default async function ExplorePage() {
  const [stats, thinkersList, concepts, tendencies, debates, texts, graph, events, paths] = await Promise.all([
    getArchiveStats(),
    listEntities({ kind: "thinker", order: "year", limit: 24 }),
    listEntities({ kind: "concept", order: "title", limit: 80 }),
    listEntities({ kind: "tendency", order: "year" }),
    listEntities({ kind: "debate" }),
    listEntities({ kind: "text", order: "year", limit: 40 }),
    getGraph({ kinds: ["thinker"] }),
    getTimeline({ lanes: ["event"] }),
    listPaths(),
  ]);
  const [thinkers, colors, positions] = await Promise.all([
    withTendencies(thinkersList.items),
    getTendencyColors(tendencies.items.map((t) => t.id)),
    getDebatePositionLabels(debates.items.map((d) => d.id)),
  ]);

  return (
    <>
      <IndexHeader
        crumb="Explore"
        tally={`${stats.entities} entries · ${stats.relationships} relationships`}
        tone="var(--color-faint)"
        title={
          <>
            The library<span className="text-red">.</span>
          </>
        }
        lede="The whole collection on one page, each kind of entry in its own form. Every entry is a node, and every line between two of them is a claim you can follow."
      >
        <nav aria-label="Library sections" className="flex flex-wrap gap-x-6 gap-y-2 border-y-[3px] border-y-ink py-3">
          {[
            ["map", "Map"],
            ["thinkers", "Thinkers"],
            ["concepts", "Concepts"],
            ["tendencies", "Tendencies"],
            ["debates", "Debates"],
            ["texts", "Texts"],
            ["periods", "Periods"],
            ["paths", "Paths"],
          ].map(([id, l], i) => (
            <a key={id} href={`#${id}`} className="label hover:text-red">
              <span className="label-mono mr-1.5 text-red">{String(i).padStart(2, "0")}</span>
              {l}
            </a>
          ))}
        </nav>
      </IndexHeader>

      <section id="map" aria-labelledby="map-h" className="scroll-mt-28">
        <Container className="py-12">
          <SectionHead number="00" id="map-h" label="The whole map" aside={<ArrowLink href="/map">Open the Theory Map</ArrowLink>} />
          <div className="mt-6">
            <MapFigure
              graph={graph}
              mode="chronological"
              plate="Plate I"
              heading="Every thinker, by year of birth"
              title="Every thinker in the Atlas, by year of birth"
              caption="All thinkers in the Atlas. Select a name for its connections."
            />
          </div>
        </Container>
      </section>

      <Container>
        {/* Thinkers — catalogue cards */}
        <section id="thinkers" aria-labelledby="thinkers-h" className="scroll-mt-28 py-16">
          <SectionHead number="01" id="thinkers-h" label="Thinkers" title="Lives, in order of birth." aside={<ArrowLink href="/thinkers">All {thinkersList.total}</ArrowLink>} />
          <ul className="mt-10 grid grid-cols-2 border-l border-t border-ink sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {thinkers.map((t) => {
              const surname = t.title.split(" ").pop() ?? t.title;
              return (
                <li key={t.id} className="border-b border-r border-ink">
                  <Link href={t.href} className="group flex h-full flex-col justify-between gap-6 p-4 transition-colors hover:bg-ink hover:text-paper">
                    <span className="flex items-start justify-between">
                      <span className="display text-[3.4rem] leading-none text-red group-hover:text-red-bright">{surname[0]}</span>
                      <span className="label-mono text-faint group-hover:text-ink-muted">{lifespan(t.yearStart, t.yearEnd, "thinker")}</span>
                    </span>
                    <span>
                      <span className="block font-serif text-xl leading-tight">{t.title}</span>
                      <span className="label mt-1 block text-faint group-hover:text-ink-muted">{t.tendencies[t.tendencies.length - 1]?.title ?? ""}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Concepts — set in type */}
        <section id="concepts" aria-labelledby="concepts-h" className="scroll-mt-28 border-t border-ink py-16">
          <SectionHead number="02" id="concepts-h" label="Concepts" title="A vocabulary, set in type." aside={<ArrowLink href="/concepts">Glossary</ArrowLink>} />
          <p className="mt-10 max-w-6xl font-serif leading-[1.35]">
            {concepts.items.map((c, i) => (
              <span key={c.id}>
                <Link
                  href={c.href}
                  className={`transition-colors hover:text-red ${i % 5 === 0 ? "text-[2.6rem] sm:text-[3.4rem]" : i % 3 === 0 ? "serif-italic text-[2rem] sm:text-[2.6rem]" : "text-[1.7rem] sm:text-[2.1rem]"}`}
                >
                  {c.title}
                </Link>
                {i < concepts.items.length - 1 && <span aria-hidden="true" className="mx-2 text-rule sm:mx-3">·</span>}{" "}
              </span>
            ))}
          </p>
        </section>

        {/* Tendencies — stripes */}
        <section id="tendencies" aria-labelledby="tendencies-h" className="scroll-mt-28 border-t border-ink py-16">
          <SectionHead number="03" id="tendencies-h" label="Tendencies" title="Traditions and their splits." aside={<ArrowLink href="/tendencies">All tendencies</ArrowLink>} />
          <ul className="mt-10 grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3">
            {tendencies.items.map((t) => (
              <li key={t.id} className="bg-paper">
                <Link href={t.href} className="group flex h-full gap-4 p-5 hover:bg-paper-warm">
                  <span aria-hidden="true" className="w-1 shrink-0 transition-all group-hover:w-2" style={{ background: TENDENCY_COLOR_VALUES[(colors[t.id] as TendencyColor) ?? "ink"] }} />
                  <span>
                    <span className="label-mono text-faint">{t.yearStart}{t.yearEnd ? `–${t.yearEnd}` : "–"}</span>
                    <span className="mt-1 block font-serif text-2xl leading-tight group-hover:text-red">{t.title}</span>
                    <span className="mt-2 block text-sm leading-snug text-muted">{t.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>

      {/* Debates — on ink */}
      <section id="debates" aria-labelledby="debates-h" className="scroll-mt-28 bg-ink text-paper">
        <Container className="py-16">
          <SectionHead tone="ink" number="04" id="debates-h" label="Debates" aside={<ArrowLink href="/debates" tone="paper">All debates</ArrowLink>} />
          <ul className="mt-8 grid gap-x-12 md:grid-cols-2">
            {debates.items.map((d) => (
              <li key={d.id} className="border-t border-white/20">
                <Link href={d.href} className="group block py-6">
                  <span className="display block text-[2.2rem] group-hover:underline group-hover:decoration-red group-hover:decoration-2 group-hover:underline-offset-8">
                    {d.title.replace(/\?$/, "")}
                    <span className="text-red">?</span>
                  </span>
                  <span className="label mt-3 block text-ink-muted">{(positions[d.id] ?? []).join(" · ")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container>
        {/* Texts — a shelf of spines */}
        <section id="texts" aria-labelledby="texts-h" className="scroll-mt-28 py-16">
          <SectionHead number="05" id="texts-h" label="Texts" title="The shelf, in order of publication." aside={<ArrowLink href="/texts">Catalogue</ArrowLink>} />
          <ul className="scrollbar-thin -mx-4 mt-10 flex items-end gap-1 overflow-x-auto border-b-4 border-ink px-4 pb-0 sm:mx-0 sm:px-0">
            {texts.items.map((t, i) => (
              <li key={t.id} className="shrink-0">
                <Link
                  href={t.href}
                  title={`${t.title} (${t.yearStart})`}
                  className={`group flex w-12 flex-col items-center justify-between border border-ink py-3 transition-transform duration-300 hover:-translate-y-3 sm:w-14 ${SPINE_TONES[i % SPINE_TONES.length]}`}
                  style={{ height: 230 + ((t.title.length * 7) % 90) }}
                >
                  <span className="font-serif text-[0.95rem] italic leading-none [writing-mode:vertical-rl] rotate-180 overflow-hidden whitespace-nowrap" style={{ maxHeight: 180 + ((t.title.length * 7) % 90) }}>
                    {t.title}
                  </span>
                  <span className="label-mono text-[0.6rem] opacity-80">{t.yearStart}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Periods */}
        <section id="periods" aria-labelledby="periods-h" className="scroll-mt-28 border-t border-ink py-16">
          <SectionHead number="06" id="periods-h" label="Historical periods" title="Browse by time." aside={<ArrowLink href="/timeline">Timeline</ArrowLink>} />
          <ol className="mt-10 grid gap-px bg-ink sm:grid-cols-2 lg:grid-cols-3">
            {PERIODS.map((p, i) => {
              const n = events.filter((e) => e.year >= p.from && e.year <= p.to);
              return (
                <li key={p.slug} className="bg-paper">
                  <Link href={`/timeline?from=${p.from}&to=${Math.min(p.to, 2026)}`} className="group block h-full p-6 hover:bg-paper-warm">
                    <span className="flex items-baseline justify-between">
                      <span className="label-mono text-red">{String(i + 1).padStart(2, "0")}</span>
                      <span className="label-mono text-faint">{n.length} events</span>
                    </span>
                    <span className="numeral mt-4 block text-4xl">
                      {p.from}
                      <span className="text-red">–</span>
                      {p.to > 2025 ? "" : p.to}
                    </span>
                    <span className="mt-2 block font-serif text-2xl group-hover:text-red">{p.label}</span>
                    <span className="mt-2 block text-sm text-muted">{p.note}</span>
                    <span className="mt-3 block text-xs text-faint">{n.slice(0, 3).map((e) => e.title).join(" · ")}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Paths */}
        <section id="paths" aria-labelledby="paths-h" className="scroll-mt-28 border-t border-ink py-16">
          <SectionHead number="07" id="paths-h" label="Learning paths" aside={<ArrowLink href="/paths">All paths</ArrowLink>} />
          <ul className="mt-8 grid gap-x-10 md:grid-cols-3">
            {paths.map((p) => (
              <li key={p.id} className="border-t border-rule">
                <Link href={p.href} className="group block py-5">
                  <span className="serif-italic block text-2xl group-hover:text-red">“{p.entryLine}”</span>
                  <span className="label mt-2 block text-faint">
                    {p.title} · {p.steps.length} stops
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
