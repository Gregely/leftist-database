import Link from "next/link";
import { MapFigure } from "@/components/graph/MapFigure";
import { ArrowLink, Container, Label, SectionHead, Swatch, lifespan } from "@/components/editorial/primitives";
import { CollectionIndex, type CollectionItem } from "@/components/home/CollectionIndex";
import { GuidedEntry } from "@/components/home/GuidedEntry";
import { RoutesSection } from "@/components/home/RoutesSection";
import { HomeSearch } from "@/components/search/HomeSearch";
import { MiniTimeline } from "@/components/timeline/MiniTimeline";
import { getHomeData } from "@/lib/data";
import { PERIODS, SECTIONS, SITE } from "@/lib/site";

const AXIS_FROM = 1760;
const AXIS_TO = 2030;
const pct = (y: number) => ((y - AXIS_FROM) / (AXIS_TO - AXIS_FROM)) * 100;

export default async function HomePage() {
  const d = await getHomeData();
  const [lead, ...concepts] = d.concepts;

  const titles = (items: { title: string }[], n = 4) => items.slice(0, n).map((t) => t.title).join(" · ");
  const section = (key: (typeof SECTIONS)[number]["key"]) => SECTIONS.find((s) => s.key === key)!;
  // Every area of the site at equal weight, in reading order.
  const collection: CollectionItem[] = [
    { ...section("thinkers"), count: d.counts.thinker, examples: d.thinkers.slice(0, 6).map((t) => t.title.split(" ").pop()).join(" · ") },
    { ...section("concepts"), count: d.counts.concept, examples: titles(d.concepts) },
    { ...section("texts"), count: d.counts.text, examples: titles(d.texts, 2) },
    { ...section("debates"), count: d.counts.debate, examples: titles(d.debates, 2) },
    { ...section("tendencies"), count: d.counts.tendency, examples: titles(d.tendencies, 3) },
    { ...section("timeline"), count: d.counts.event, examples: PERIODS.map((p) => p.label).join(" · ") },
    { ...section("map"), count: d.stats.relationships, unit: "links", examples: [...d.graph.nodes].sort((a, b) => b.degree - a.degree).slice(0, 4).map((n) => n.title.split(" ").pop()).join(" · ") },
    { ...section("explore"), count: d.stats.entities, unit: "entries", examples: `${d.stats.sources} sources in the bibliography` },
  ];
  // Beside Guided: other places to begin, each a real destination.
  const waysIn = [
    lead && { label: "Concept · 30 seconds", title: lead.title, href: `${lead.href}?depth=brief` },
    d.paths[0] && { label: "Learning path", title: d.paths[0].title, href: d.paths[0].href },
    { label: "Theory Map", title: `${d.stats.relationships} relations`, href: "/map" },
    { label: "Timeline", title: `${PERIODS[0].from} to the present`, href: "/timeline" },
  ].filter((w): w is { label: string; title: string; href: string } => !!w);
  // Search suggestions are real entries: a concept, an event, a thinker, a text.
  const suggestions = [lead?.title, d.markers[0]?.title, d.thinkers[3]?.title.split(" ").pop(), d.texts[0]?.title]
    .filter((s): s is string => !!s)
    .slice(0, 4);

  return (
    <>
      {/* ——— Opening: what this is, search, Guided ——————————————————————— */}
      <Container className="pt-5 sm:pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-ink pb-2">
          <Label className="text-muted">
            {SITE.edition} · {SITE.year}
          </Label>
          <p className="label-mono text-faint">
            {d.stats.entities} entries · {d.stats.relationships} relationships · {d.stats.sources} sources
          </p>
        </div>

        <div className="grid gap-10 pb-8 pt-8 sm:pt-12 lg:grid-cols-12 lg:gap-10 lg:pb-10">
          <div className="lg:col-span-8">
            <h1 className="display text-balance text-[3.3rem] sm:text-[5.4rem] xl:text-[6.6rem]">
              A map of <span className="italic">socialist</span> thought<span className="text-red">.</span>
            </h1>
            <p className="lede mt-6 max-w-[38rem] text-ink-warm">
              A reference work on the socialist tradition, from its forerunners to its later critics: its thinkers,
              concepts, texts, tendencies and debates, and how they connect. Who influenced whom, who answered whom,
              where they disagreed.
            </p>
            <HomeSearch
              className="mt-9 max-w-[44rem]"
              label="Search the collection"
              suggestions={suggestions}
            />
          </div>
          <div className="lg:col-span-4 lg:pt-3">
            <GuidedEntry journeys={d.guided} />
            <nav aria-label="Other ways in" className="mt-7">
              <p className="label text-faint">Other ways in</p>
              <ul className="mt-2 border-t border-ink">
                {waysIn.map((w) => (
                  <li key={w.href} className="border-b border-rule">
                    <Link href={w.href} className="group grid grid-cols-[1fr_auto] items-baseline gap-3 py-2.5">
                      <span>
                        <span className="label block text-faint">{w.label}</span>
                        <span className="font-serif text-[1.12rem] leading-tight group-hover:text-red">{w.title}</span>
                      </span>
                      <span aria-hidden="true" className="text-red transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </Container>

      {/* ——— 01 The collection, as a table of contents ———————————————————— */}
      <CollectionIndex number="01" items={collection} />

      {/* ——— 02 Concepts: the lead concept and its three depths ———————————— */}
      <Container className="pb-16 sm:pb-24">
        <SectionHead
          number="02"
          label="Concepts"
          aside={<ArrowLink href="/concepts">All concepts</ArrowLink>}
        />
        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          {lead && (
            <article className="lg:col-span-6">
              <p className="kicker flex items-center gap-2 text-red">
                <Swatch kind="concept" /> In focus
              </p>
              <h3 className="display mt-3 text-[3.6rem] sm:text-[5rem]">
                <Link href={lead.href} className="transition-colors hover:text-red">
                  {lead.title}
                </Link>
              </h3>
              <p className="lede mt-4 text-ink-warm">{lead.summary}</p>
              <ol className="mt-8 grid grid-cols-3 border-t-[3px] border-ink">
                {[
                  ["30 seconds", "brief"],
                  ["5 minutes", "standard"],
                  ["Deep dive", "deep"],
                ].map(([l, depth], i) => (
                  <li key={depth} className={`border-b border-ink ${i ? "border-l border-l-rule" : ""}`}>
                    <Link href={`${lead.href}?depth=${depth}`} className="group flex items-baseline gap-2 px-2 py-3 hover:bg-paper-warm sm:px-3">
                      <span className="numeral text-[1.4rem] leading-none text-red">{["I", "II", "III"][i]}</span>
                      <span className="label group-hover:text-red">{l}</span>
                    </Link>
                  </li>
                ))}
              </ol>
              {d.leadRelated.length > 0 && (
                <p className="mt-5 text-[0.95rem] text-muted">
                  <span className="rel mr-2">connected to</span>
                  {d.leadRelated.map((r, i) => (
                    <span key={r.id}>
                      <Link href={r.href} className="link-inline font-serif text-ink">
                        {r.title}
                      </Link>
                      {i < d.leadRelated.length - 1 && " · "}
                    </span>
                  ))}
                </p>
              )}
            </article>
          )}
          <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-6">
            {concepts.map((c, i) => (
              <li key={c.id} className={`border-t border-rule py-5 ${i >= 4 ? "hidden sm:block" : ""}`}>
                <Link href={c.href} className="group block">
                  <span className="flex items-baseline gap-2">
                    <span className="font-serif text-[1.6rem] leading-tight group-hover:text-red">{c.title}</span>
                    <span className="serif-italic text-faint">n.</span>
                  </span>
                  <span className="mt-2 line-clamp-4 block font-serif text-[1rem] leading-snug text-muted">{c.brief || c.summary}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Container>

      {/* ——— 03 Debates: open questions, on ink —————————————————————————— */}
      <section aria-labelledby="debates-heading" className="bg-ink text-paper">
        <Container className="py-16 sm:py-24">
          <SectionHead
            tone="ink"
            number="03"
            id="debates-heading"
            label="Debates"
            aside={<ArrowLink href="/debates" tone="paper">All debates</ArrowLink>}
          />
          <ol className="mt-12">
            {d.debates.map((q, i) => (
              <li key={q.id} className="border-t border-white/20 last:border-b">
                <Link href={q.href} className="group grid gap-x-10 gap-y-4 py-7 lg:grid-cols-[3rem_1fr_24rem] lg:items-center">
                  <span className="label-mono text-ink-muted">Q.{String(i + 1).padStart(2, "0")}</span>
                  <span className="display text-[2.1rem] transition-transform duration-500 group-hover:translate-x-1.5 sm:text-[3.2rem]">
                    {q.title.replace(/\?$/, "")}
                    <span className="text-red-bright">?</span>
                  </span>
                  <PositionLine positions={q.positions} />
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ——— 04 Texts and lives ———————————————————————————————————————— */}
      <Container className="py-16 sm:py-24">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionHead number="04" label="Texts" aside={<ArrowLink href="/texts">All texts</ArrowLink>} />
            <ol className="mt-4">
              {d.texts.map((t) => (
                <li key={t.id} className="border-b border-rule">
                  <Link href={t.href} className="group grid grid-cols-[4.2rem_1fr] gap-4 py-4">
                    <span className="numeral pt-0.5 text-[1.6rem] leading-none text-blue">{t.yearStart}</span>
                    <span>
                      <span className="font-serif text-[1.3rem] italic leading-tight group-hover:text-red">{t.title}</span>
                      <span className="mt-1 line-clamp-2 block text-[0.9rem] leading-snug text-muted">{t.summary}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-7">
            <SectionHead number="05" label="Lives" aside={<ArrowLink href="/thinkers">All thinkers</ArrowLink>} />
            <div className="relative mt-4 hidden h-5 sm:ml-[42%] sm:block" aria-hidden="true">
              {[1800, 1850, 1900, 1950, 2000].map((y) => (
                <span key={y} className="label-mono absolute -translate-x-1/2 text-faint" style={{ left: `${pct(y)}%` }}>
                  {y}
                </span>
              ))}
            </div>
            <ol className="border-t border-ink">
              {d.thinkers.map((t) => (
                <li key={t.id} className="border-b border-rule">
                  <Link href={t.href} className="group grid items-center gap-x-4 py-2.5 sm:grid-cols-[42%_1fr]">
                    <span className="flex min-w-0 items-baseline justify-between gap-3">
                      <span className="truncate font-serif text-[1.25rem] leading-tight group-hover:text-red">{t.title}</span>
                      <span className="label-mono shrink-0 text-faint sm:hidden">{lifespan(t.yearStart, t.yearEnd, "thinker")}</span>
                    </span>
                    <span className="relative hidden h-6 sm:block" aria-hidden="true">
                      <span className="absolute inset-x-0 top-1/2 h-px bg-rule-soft" />
                      {t.yearStart != null && (
                        <span
                          className="absolute top-1/2 flex h-[7px] -translate-y-1/2 items-center border-l-2 border-ink bg-beige transition-colors group-hover:border-red group-hover:bg-red"
                          style={{ left: `${pct(t.yearStart)}%`, width: `${pct(t.yearEnd ?? 2026) - pct(t.yearStart)}%` }}
                        />
                      )}
                      {t.yearStart != null && (
                        <span
                          className="label-mono absolute top-1/2 -translate-y-1/2 whitespace-nowrap px-2 text-faint"
                          style={pct(t.yearEnd ?? 2026) > 78 ? { right: `${100 - pct(t.yearStart)}%` } : { left: `${pct(t.yearEnd ?? 2026)}%` }}
                        >
                          {lifespan(t.yearStart, t.yearEnd, "thinker")}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>

      {/* ——— 06 Routes: Guided journeys and learning paths ————————————————— */}
      <RoutesSection number="06" journeys={d.guided} paths={d.paths} />

      {/* ——— 07 The Theory Map, as a plate ———————————————————————————————— */}
      <section aria-labelledby="map-heading">
        <Container className="py-16 sm:py-24">
          <SectionHead
            number="07"
            id="map-heading"
            label="The Theory Map"
            aside={<ArrowLink href="/map">Open the full map</ArrowLink>}
          />
          <div className="mt-6">
            <MapFigure
              graph={d.graph}
              mode="chronological"
              plate="Plate I"
              heading="Featured thinkers, by year of birth"
              title="The Theory Map: thinkers arranged by year of birth, connected by influence, critique and response"
            />
          </div>
        </Container>
      </section>

      {/* ——— 08 Historical moments ———————————————————————————————————————— */}
      <section aria-labelledby="moments-heading" className="border-t border-ink bg-paper-warm">
        <Container className="py-16 sm:py-20">
          <SectionHead
            number="08"
            id="moments-heading"
            label="Historical moments"
            aside={<ArrowLink href="/timeline">Enter the timeline</ArrowLink>}
          />
          <div className="mt-10">
            <MiniTimeline items={d.markers} periods={PERIODS} />
          </div>
        </Container>
      </section>

      {/* ——— 09 About this edition ———————————————————————————————————————— */}
      <section aria-labelledby="method-heading">
        <Container className="pt-16 sm:pt-20">
          <SectionHead number="09" id="method-heading" label="About this edition" aside={<ArrowLink href="/about">Read more</ArrowLink>} />
          <div className="mt-8 grid gap-10 lg:grid-cols-12">
            <div className="prose-atlas max-w-[40rem] !text-[1.08rem] lg:col-span-7">
              <p>
                This is a working edition. Entries marked <strong className="font-medium text-red">Sample</strong> demonstrate the
                structure of the collection and are not finished scholarship.
              </p>
              <p>
                Each connection between entries (<em>influenced</em>, <em>critiqued</em>, <em>developed</em>,{" "}
                <em>responded to</em>) is an editorial claim that can carry a note and a source. Quotations appear only
                where they can be traced to a cited edition, and stay flagged until their wording has been checked.
              </p>
              <p>Debates are presented descriptively: positions are summarised so they can be compared, not judged.</p>
            </div>
            <aside className="lg:col-span-4 lg:col-start-9">
              <dl className="border-t border-ink">
                {(
                  [
                    ["Entries", d.stats.entities],
                    ["Relationships", d.stats.relationships],
                    ["Sources", d.stats.sources],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="flex items-baseline border-b border-rule py-3">
                    <dt className="label text-faint">{k}</dt>
                    <span aria-hidden="true" className="leaders" />
                    <dd className="numeral text-3xl text-red">{v}</dd>
                  </div>
                ))}
              </dl>
              <ArrowLink href="/sources" className="mt-5">
                Sources and bibliography
              </ArrowLink>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}

/** The positions in a debate, each marked with a short red rule: how many answers there are, and whose. */
function PositionLine({ positions }: { positions: string[] }) {
  if (!positions.length) return null;
  return (
    <span className="block">
      <span className="label mb-2 block text-ink-muted">{positions.length} positions</span>
      <span className="flex flex-wrap gap-x-4 gap-y-1.5 font-serif text-[1.02rem] italic text-paper/90">
        {positions.map((p) => (
          <span key={p} className="border-l-2 border-red-bright pl-2 leading-tight">
            {p}
          </span>
        ))}
      </span>
    </span>
  );
}
