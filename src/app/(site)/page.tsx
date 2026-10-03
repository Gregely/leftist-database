import Link from "next/link";
import { MapFigure } from "@/components/graph/MapFigure";
import { ArrowLink, Container, Label, SectionHead, lifespan } from "@/components/editorial/primitives";
import { CollectionIndex, type CollectionGroup } from "@/components/home/CollectionIndex";
import { GuidedFeature } from "@/components/home/GuidedFeature";
import { HomeSearch } from "@/components/search/HomeSearch";
import { MiniTimeline } from "@/components/timeline/MiniTimeline";
import { getHomeData } from "@/lib/data";
import { PERIODS, SITE } from "@/lib/site";

export default async function HomePage() {
  const d = await getHomeData();
  const [lead, ...concepts] = d.concepts;

  const titles = (items: { title: string }[], n = 4) => items.slice(0, n).map((t) => t.title).join(" · ");
  const collection: CollectionGroup[] = [
    {
      title: "People and ideas",
      items: [
        { label: "Thinkers", href: "/thinkers", count: d.counts.thinker, description: "Lives, works and intellectual relationships", examples: d.thinkers.map((t) => t.title.split(" ").pop()).join(" · ") },
        { label: "Concepts", href: "/concepts", count: d.counts.concept, description: "Key terms, each explained at three depths", examples: titles(d.concepts) },
        { label: "Tendencies", href: "/tendencies", count: d.counts.tendency, description: "Schools, currents and movements", examples: titles(d.tendencies, 3) },
      ],
    },
    {
      title: "Works and arguments",
      items: [
        { label: "Texts", href: "/texts", count: d.counts.text, description: "Primary and foundational works", examples: titles(d.texts, 2) },
        { label: "Debates", href: "/debates", count: d.counts.debate, description: "Open questions and the positions taken on them", examples: titles(d.debates, 2) },
      ],
    },
    {
      title: "History and connections",
      items: [
        { label: "Timeline", href: "/timeline", count: d.counts.event, description: "Events and periods in sequence", examples: `${PERIODS[0].from} to the present, in ${PERIODS.length} periods` },
        { label: "Explore", href: "/explore", count: d.stats.entities, description: "The whole library, with the full Theory Map", examples: `${d.stats.relationships} relationships · ${d.stats.sources} sources` },
        { label: "Search", href: "/search", description: "Find an entry by name, term or alias" },
      ],
    },
  ];

  return (
    <>
      {/* ——— Masthead ——————————————————————————————————————————————— */}
      <Container className="pt-6 sm:pt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule pb-2">
          <Label className="text-muted">
            No. 01 <span className="text-red">/</span> {SITE.edition}
          </Label>
          <Label className="text-faint">
            {d.stats.entities} entries · {d.stats.relationships} relationships · {d.stats.sources} sources
          </Label>
        </div>

        <div className="grid gap-10 pb-10 pt-10 sm:pb-12 sm:pt-14 lg:grid-cols-12 lg:gap-8 lg:pb-16">
          <div className="lg:col-span-7">
            <h1 className="display text-balance text-[3.4rem] sm:text-[5.2rem] xl:text-[6.6rem]">
              A map of <span className="serif-italic">socialist</span> thought<span className="text-red">.</span>
            </h1>
            <p className="lede mt-7 max-w-xl text-ink-warm">
              A reference work on the socialist tradition: its thinkers, concepts, texts, tendencies and debates, and the
              connections between them.
            </p>
            <p className="mt-4 max-w-xl text-muted">
              {d.guided.length
                ? "For a structured introduction, follow a Guided journey. Every part of the collection can also be opened directly."
                : "For a structured introduction, follow a learning path. Every part of the collection can also be opened directly."}
            </p>
            <HomeSearch label="Search thinkers, concepts, texts and debates" hint="Press / to search from any page." />
          </div>

          <div className="lg:col-span-5 lg:col-start-8 lg:pt-3">
            <GuidedFeature journeys={d.guided} paths={d.paths} />
          </div>
        </div>
      </Container>

      {/* ——— 01 The collection ——————————————————————————————————————— */}
      <div className="border-t border-ink">
        <CollectionIndex number="01" groups={collection} />
      </div>

      {/* ——— 02–04 Featured: chosen by the editors (entities.featured) ———————— */}
      <Container className="py-16 sm:py-24">
        <SectionHead
          number="02"
          label="Featured concepts"
          title={
            <>
              The vocabulary of the left, from the elementary to the contested<span className="text-red">.</span>
            </>
          }
          aside={<ArrowLink href="/concepts">All concepts</ArrowLink>}
        />
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          {lead && (
            <article className="lg:col-span-5">
              <Label className="text-red">Concept of the issue</Label>
              <h3 className="display mt-3 text-[3.6rem] sm:text-[5rem]">
                <Link href={lead.href} className="hover:text-red">
                  {lead.title}
                </Link>
              </h3>
              <p className="lede mt-5 text-ink-warm">{lead.summary}</p>
              <ol className="mt-7 grid grid-cols-3 border-y border-ink">
                {[
                  ["30 seconds", "brief"],
                  ["5 minutes", "standard"],
                  ["Deep dive", "deep"],
                ].map(([l, depth], i) => (
                  <li key={depth} className={i ? "border-l border-rule" : ""}>
                    <Link href={`${lead.href}?depth=${depth}`} className="group block px-3 py-3 hover:bg-paper-warm">
                      <span className="label-mono block text-faint">{String(i + 1).padStart(2, "0")}</span>
                      <span className="label mt-1 block group-hover:text-red">{l}</span>
                    </Link>
                  </li>
                ))}
              </ol>
              {d.leadRelated.length > 0 && (
                <p className="mt-5 text-sm text-muted">
                  <span className="label mr-2 text-faint">Connected to</span>
                  {d.leadRelated.map((r, i) => (
                    <span key={r.id}>
                      <Link href={r.href} className="link-inline text-ink">
                        {r.title}
                      </Link>
                      {i < d.leadRelated.length - 1 && " · "}
                    </span>
                  ))}
                </p>
              )}
            </article>
          )}
          <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {concepts.map((c, i) => (
              <li key={c.id} className={`border-t border-rule py-5 ${i >= 4 ? "hidden sm:block" : ""}`}>
                <Link href={c.href} className="group block">
                  <span className="flex items-baseline gap-3">
                    <span className="label-mono text-faint">{String(i + 2).padStart(2, "0")}</span>
                    <span className="font-serif text-[1.65rem] leading-tight group-hover:text-red">{c.title}</span>
                    <span className="serif-italic text-faint">n.</span>
                  </span>
                  <span className="mt-2 block text-[0.92rem] leading-snug text-muted">{c.brief || c.summary}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Container>

      {/* ——— 03 Debates ———————————————————————————————————————————— */}
      <section aria-labelledby="debates-heading" className="bg-ink text-paper">
        <Container className="py-16 sm:py-24">
          <SectionHead
            tone="ink"
            number="03"
            id="debates-heading"
            label="Featured debates"
            title={
              <>
                The open questions — and how the traditions answer them<span className="text-red">.</span>
              </>
            }
            aside={<ArrowLink href="/debates" tone="paper">All debates</ArrowLink>}
          />
          <ol className="mt-12">
            {d.debates.map((q, i) => (
              <li key={q.id} className="border-t border-white/20 last:border-b">
                <Link
                  href={q.href}
                  className="group grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[3rem_1fr_16rem] sm:items-baseline sm:py-7"
                >
                  <span className="label-mono text-ink-muted">Q.{String(i + 1).padStart(2, "0")}</span>
                  <span className="display text-[2.2rem] transition-transform duration-500 group-hover:translate-x-2 sm:text-[3.4rem]">
                    {q.title.replace(/\?$/, "")}
                    <span className="text-red">?</span>
                  </span>
                  <span className="text-[0.85rem] leading-snug text-ink-muted">
                    <span className="label mb-1 block text-paper">{q.positions.length} positions</span>
                    {q.positions.join(" · ")}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ——— 04 Texts and thinkers ——————————————————————————————————————— */}
      <Container className="pb-16 pt-16 sm:pb-24 sm:pt-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHead number="04" label="From the shelves" aside={<ArrowLink href="/texts">All texts</ArrowLink>} />
            <ol className="mt-6">
              {d.texts.map((t) => (
                <li key={t.id} className="border-b border-rule">
                  <Link href={t.href} className="group grid grid-cols-[4rem_1fr] gap-4 py-4">
                    <span className="numeral text-2xl text-red">{t.yearStart}</span>
                    <span>
                      <span className="font-serif text-xl italic leading-tight group-hover:text-red">{t.title}</span>
                      <span className="mt-1 block text-sm text-muted">{t.summary}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
          {/* On phones the collection index already leads to Thinkers; this list is for wider screens. */}
          <div className="hidden sm:block lg:col-span-4 lg:col-start-9">
            <SectionHead label="Featured thinkers" aside={<ArrowLink href="/thinkers">All</ArrowLink>} />
            <ul className="mt-6">
              {d.thinkers.map((t) => (
                <li key={t.id} className="border-b border-rule">
                  <Link href={t.href} className="group flex items-baseline justify-between gap-4 py-3.5">
                    <span className="font-serif text-xl group-hover:text-red">{t.title}</span>
                    <span className="label-mono text-faint">{lifespan(t.yearStart, t.yearEnd, "thinker")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {/* ——— 05 The Theory Map ——————————————————————————————————————— */}
      <section aria-labelledby="map-heading" className="border-y border-ink bg-paper-warm">
        <Container className="py-12 sm:py-16">
          <SectionHead
            number="05"
            id="map-heading"
            label="The Theory Map"
            title={
              <>
                Connections between thinkers: influence, critique, response and affinity<span className="text-red">.</span>
              </>
            }
            aside={<ArrowLink href="/explore#map">Open the full map</ArrowLink>}
          />
          <p className="mt-4 max-w-2xl text-muted">
            Who drew on whom, who argued against whom, and how ideas passed from one generation to the next. Thinkers are
            placed by year of birth, left to right (top to bottom on a phone). Hover or focus a name to trace its
            connections; select it for a summary, and select it again to open the entry.
          </p>
          <div className="mt-8">
            <MapFigure
              graph={d.graph}
              mode="chronological"
              title="The Theory Map: thinkers arranged by year of birth, connected by influence, critique and response"
              caption={`Fig. 1 — The ${d.graph.nodes.length} featured thinkers. Each line is an editorial claim, with a note and, in time, a source.`}
            />
          </div>
        </Container>
      </section>

      {/* ——— 06 Timeline —————————————————————————————————————————————— */}
      <Container className="py-16 sm:py-24">
        <SectionHead
          number="06"
          label="Timeline"
          title={
            <>
              Two and a half centuries of revolution, organisation and argument<span className="text-red">.</span>
            </>
          }
          aside={<ArrowLink href="/timeline">Enter the timeline</ArrowLink>}
        />
        <div className="mt-12">
          <MiniTimeline items={d.markers} />
        </div>
      </Container>

      {/* ——— 07 About this edition ————————————————————————————————————— */}
      <section aria-labelledby="method-heading" className="border-t border-ink">
        <Container className="py-14 sm:py-20">
          <SectionHead number="07" id="method-heading" label="About this edition" aside={<ArrowLink href="/about">Read more</ArrowLink>} />
          <div className="mt-8 grid gap-10 lg:grid-cols-12">
            <div className="max-w-[40rem] space-y-4 text-[1.02rem] leading-relaxed text-ink-warm lg:col-span-7">
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
              <dl className="divide-y divide-rule border-y border-ink">
                {(
                  [
                    ["Entries", d.stats.entities],
                    ["Relationships", d.stats.relationships],
                    ["Sources", d.stats.sources],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between py-3">
                    <dt className="label text-faint">{k}</dt>
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
