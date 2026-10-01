import Link from "next/link";
import { MapFigure } from "@/components/graph/MapFigure";
import { ArrowLink, Container, Label, SectionHead } from "@/components/editorial/primitives";
import { HomeSearch } from "@/components/search/HomeSearch";
import { MiniTimeline } from "@/components/timeline/MiniTimeline";
import { getHomeData } from "@/lib/data";
import { KINDS } from "@/lib/content/model";
import { PERIODS, SITE } from "@/lib/site";

export default async function HomePage() {
  const d = await getHomeData();
  const [lead, ...concepts] = d.concepts;

  const entries = [
    { n: "01", label: "Thinker", href: "/thinkers", count: d.counts.thinker, teaser: d.thinkers.map((t) => t.title.split(" ").pop()).join(" · ") },
    { n: "02", label: "Concept", href: "/concepts", count: d.counts.concept, teaser: d.concepts.slice(0, 4).map((c) => c.title).join(" · ") },
    { n: "03", label: "Tendency", href: "/tendencies", count: d.counts.tendency, teaser: d.tendencies.map((t) => t.title).slice(0, 3).join(" · ") },
    { n: "04", label: "Debate", href: "/debates", count: d.counts.debate, teaser: d.debates.slice(0, 2).map((t) => t.title).join(" ") },
    { n: "05", label: "Period", href: "/explore#periods", count: PERIODS.length, teaser: `${PERIODS[0].from} → today, in ${PERIODS.length} movements` },
    { n: "06", label: "Text", href: "/texts", count: d.counts.text, teaser: d.texts.map((t) => t.title).slice(0, 2).join(" · ") },
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

        <div className="grid gap-12 pb-16 pt-10 sm:pt-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <h1 className="display text-balance text-[3.4rem] sm:text-[5.2rem] xl:text-[6.6rem]">
              A map of <span className="serif-italic">socialist</span> thought<span className="text-red">.</span>
            </h1>
            <p className="lede mt-7 max-w-xl text-ink-warm">
              Explore the ideas, thinkers, texts and debates that shaped the modern left — and follow the lines that connect
              them.
            </p>
            <HomeSearch />
          </div>

          <nav aria-labelledby="explore-by" className="lg:col-span-5 lg:col-start-8 lg:pt-3">
            <h2 id="explore-by" className="label mb-1 flex items-center justify-between font-sans">
              <span>
                <span className="text-red">↘</span> Explore by
              </span>
              <span className="text-faint">Index</span>
            </h2>
            <ul className="border-t border-ink">
              {entries.map((e) => (
                <li key={e.n} className="border-b border-rule">
                  <Link
                    href={e.href}
                    className="group grid grid-cols-[2.2rem_1fr_auto] items-baseline gap-x-3 py-3 transition-colors hover:bg-paper-warm sm:py-3.5"
                  >
                    <span className="label-mono text-red">{e.n}</span>
                    <span>
                      <span className="font-serif text-[1.65rem] leading-none transition-colors group-hover:text-red sm:text-[1.9rem]">
                        {e.label}
                      </span>
                      <span className="mt-1 block truncate text-[0.8rem] text-faint">{e.teaser}</span>
                    </span>
                    <span className="flex items-baseline gap-3">
                      <span className="label-mono text-muted">{String(e.count).padStart(2, "0")}</span>
                      <span aria-hidden="true" className="text-red transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>

      {/* ——— 01 The Theory Map ——————————————————————————————————————— */}
      <section aria-labelledby="map-heading" className="border-y border-ink bg-paper-warm">
        <Container className="py-12 sm:py-16">
          <SectionHead
            number="01"
            id="map-heading"
            label="The Theory Map"
            title={
              <>
                Who read whom, who argued with whom<span className="text-red">.</span>
              </>
            }
            aside={<ArrowLink href="/explore#map">Full library</ArrowLink>}
          />
          <p className="mt-4 max-w-2xl text-muted">
            Time runs along the axis by year of birth — left to right, or top to bottom on a phone. Hover a name to trace its relations; select it to read more; select
            again to open the entry.
          </p>
          <div className="mt-8">
            <MapFigure
              graph={d.graph}
              mode="chronological"
              title="The Theory Map: thinkers arranged by year of birth, connected by influence, critique and response"
              caption="Fig. 1 — Sample network of fourteen thinkers. Lines are editorial claims, each with a note and, in time, a source."
            />
          </div>
        </Container>
      </section>

      {/* ——— 02 Concepts ———————————————————————————————————————————— */}
      <Container className="py-16 sm:py-24">
        <SectionHead
          number="02"
          label="Concepts"
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
              <li key={c.id} className="border-t border-rule py-5">
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
            label="Debates"
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

      {/* ——— 04 Timeline —————————————————————————————————————————————— */}
      <Container className="py-16 sm:py-24">
        <SectionHead
          number="04"
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

      {/* ——— 05 Learning paths ————————————————————————————————————————— */}
      <section aria-labelledby="paths-heading" className="border-t border-ink bg-beige/45">
        <Container className="py-16 sm:py-24">
          <SectionHead
            number="05"
            id="paths-heading"
            label="Start learning"
            title={
              <>
                Where would you like to begin<span className="text-red">?</span>
              </>
            }
            aside={<ArrowLink href="/paths">All paths</ArrowLink>}
          />
          <ul className="mt-12 grid gap-x-12 md:grid-cols-2">
            {d.paths.map((p) => (
              <li key={p.id} className="border-t border-ink/70">
                <Link href={p.href} className="group grid grid-cols-[1fr_auto] items-end gap-6 py-6">
                  <span>
                    <span className="serif-italic block text-[1.9rem] leading-tight transition-colors group-hover:text-red sm:text-[2.3rem]">
                      “{p.entryLine}”
                    </span>
                    <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="label">{p.title}</span>
                      <span className="label text-faint">
                        {p.steps.length} stops · {p.level}
                      </span>
                    </span>
                    <RouteGlyph steps={p.steps.length} />
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

      {/* ——— 06 Shelves ————————————————————————————————————————————— */}
      <Container className="py-16 sm:py-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHead number="06" label="From the shelves" aside={<ArrowLink href="/texts">All texts</ArrowLink>} />
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
          <div className="lg:col-span-4 lg:col-start-9">
            <SectionHead number="07" label="Tendencies" aside={<ArrowLink href="/tendencies">All</ArrowLink>} />
            <ul className="mt-6 space-y-0">
              {d.tendencies.map((t) => (
                <li key={t.id} className="border-b border-rule">
                  <Link href={t.href} className="group flex items-baseline justify-between gap-4 py-3.5">
                    <span className="font-serif text-xl group-hover:text-red">{t.title}</span>
                    <span className="label-mono text-faint">{t.yearStart}{t.yearEnd ? `–${t.yearEnd}` : "–"}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted">
              {KINDS.tendency.blurb}
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}

function RouteGlyph({ steps }: { steps: number }) {
  const w = Math.min(260, steps * 26);
  return (
    <svg width={w} height="14" className="mt-3 block" aria-hidden="true">
      <line x1="4" y1="7" x2={w - 4} y2="7" stroke="#171717" strokeWidth="1" />
      {Array.from({ length: steps }).map((_, i) => (
        <circle
          key={i}
          cx={4 + (i * (w - 8)) / Math.max(1, steps - 1)}
          cy="7"
          r={i === 0 ? 4 : 2.6}
          fill={i === 0 ? "#B51F2A" : "#F3F0E8"}
          stroke={i === 0 ? "#B51F2A" : "#171717"}
        />
      ))}
    </svg>
  );
}
