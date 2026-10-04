import Link from "next/link";
import { DepthReader } from "@/components/concept/DepthReader";
import { Container, EmptyNote, SampleMark, Swatch } from "@/components/editorial/primitives";
import { Notes } from "@/components/editorial/Notes";
import { Prose } from "@/components/editorial/Prose";
import { Excerpts } from "@/components/entity/Excerpts";
import { JourneyActions, RecordStep } from "@/components/guided/JourneyProgress";
import { RouteGlyph } from "@/components/layout/NavLinks";
import { PathRoute } from "@/components/path/PathRoute";
import { getGuidedStepContent, type GuidedJourney, type GuidedStep } from "@/lib/data";
import { KINDS } from "@/lib/content/model";

/** Where a journey's links lead: the public /guided pages, or the same pages inside a preview. */
export interface GuidedLinks {
  /** The journey overview. */
  overview: string;
  /** Prefix for step links: `${stepPrefix}${n}`. */
  stepPrefix: string;
}

function StepCard({ step, href, kicker }: { step: GuidedStep; href: string; kicker: string }) {
  return (
    <Link href={href} className="group mt-4 block border-t border-ink pt-3">
      <span className="label flex items-center gap-1.5 text-faint">
        {kicker} · <Swatch kind={step.entity.kind} /> {KINDS[step.entity.kind].label}
      </span>
      <span className="mt-1 block font-serif text-[1.6rem] leading-tight group-hover:text-red">{step.entity.title} →</span>
      {step.framing && <span className="mt-1 block font-serif italic text-muted">{step.framing}</span>}
    </Link>
  );
}

/** A list of links in the step's margin. */
function Leave({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="label border-t border-ink pt-2.5 text-faint">{title}</h2>
      <ul className="mt-1">{children}</ul>
    </section>
  );
}

/**
 * A Guided journey: an overview, then one step at a time. Each step points at
 * an existing entry and shows that entry's own progressive explanation,
 * excerpt and connections, framed by a few lines of journey copy. The margin
 * is a standing invitation to leave the route; the masthead and ribbon bring
 * the reader back to it.
 */
export async function GuidedView({ journey, step: stepParam, depth, links }: { journey: GuidedJourney; step?: string; depth?: string; links: GuidedLinks }) {
  const n = journey.steps.length;
  const current = Math.min(n, Math.max(0, Number(stepParam) || 0));
  const step = current ? journey.steps[current - 1] : null;
  const stops = journey.steps.map((s) => ({ position: s.position, title: s.entity.title, kind: s.entity.kind }));
  const slug = journey.entity.slug;
  const isPublic = links.overview.startsWith("/guided");

  const header = (
    <Container className="pt-5 sm:pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink pb-2">
        <p className="label flex items-center gap-2 text-muted">
          <RouteGlyph className="text-red" />
          <Link href="/guided" className="hover:text-red">
            Guided
          </Link>
          <span aria-hidden="true" className="text-rule">
            /
          </span>
          <Link href={links.overview} className="text-ink hover:text-red">
            {journey.entity.title}
          </Link>
        </p>
        <SampleMark sample={journey.entity.sample} />
      </div>
    </Container>
  );

  if (!step) {
    return (
      <article data-guided-journey={slug}>
        {header}
        <Container>
          <header className="grid gap-10 pb-10 pt-9 sm:pt-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="kicker text-red">Guided journey{journey.level ? ` · ${journey.level}` : ""}</p>
              <h1 className="display mt-4 text-[3rem] sm:text-[4.8rem]">{journey.entity.title}</h1>
              {journey.entryLine && <p className="mt-4 font-serif text-[1.6rem] italic leading-snug text-red">“{journey.entryLine}”</p>}
              <p className="lede mt-6 max-w-2xl">{journey.entity.summary}</p>
              {journey.overview && (
                <div className="mt-8 max-w-2xl">
                  <p className="label mb-2 border-t border-ink pt-2.5 text-faint">Overview</p>
                  <Prose text={journey.overview} context={journey.prose.context} />
                </div>
              )}
            </div>
            <aside className="space-y-7 lg:col-span-5 lg:pt-12">
              <p className="flex items-baseline gap-3">
                <span className="numeral text-[2.6rem] leading-none text-red">{n}</span>
                <span className="label text-faint">steps{journey.estimatedTime ? ` · ${journey.estimatedTime}` : ""}</span>
              </p>
              <JourneyActions slug={slug} titles={journey.steps.map((s) => s.entity.title)} stepHrefPrefix={links.stepPrefix} />
              {journey.prerequisites && (
                <div className="border-l-2 border-red pl-4">
                  <p className="label mb-2 text-faint">Before you start</p>
                  <Prose text={journey.prerequisites} context={journey.prose.context} className="!text-[1rem]" />
                </div>
              )}
            </aside>
          </header>
          <div className="border-y-[3px] border-ink py-5">
            <PathRoute slug={slug} stops={stops} current={0} hrefPrefix={links.stepPrefix} label="The journey" unit="steps" />
          </div>
          <section aria-labelledby="journey-steps" className="py-10">
            <h2 id="journey-steps" className="label mb-4 text-faint">
              The whole journey
            </h2>
            {n ? (
              <ol className="relative">
                {journey.steps.map((s, i) => (
                  <li key={s.id} className="relative border-t border-rule">
                    {i < n - 1 && <span aria-hidden="true" className="absolute left-[1.05rem] top-10 h-full w-px bg-ink" />}
                    <Link href={`${links.stepPrefix}${s.position}`} className="group relative grid grid-cols-[2.2rem_1fr] gap-5 py-5 sm:grid-cols-[2.2rem_1fr_16rem]">
                      <span className="label-mono z-[1] flex h-[2.1rem] w-[2.1rem] items-center justify-center rounded-full border border-ink bg-paper group-hover:bg-ink group-hover:text-paper">
                        {String(s.position).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="label flex items-center gap-1.5 text-faint">
                          <Swatch kind={s.entity.kind} />
                          {KINDS[s.entity.kind].label}
                        </span>
                        <span className="mt-0.5 block font-serif text-[1.6rem] leading-tight group-hover:text-red">{s.entity.title}</span>
                      </span>
                      {s.framing && <span className="col-start-2 font-serif italic text-muted sm:col-start-3 sm:pt-5">{s.framing}</span>}
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyNote>This journey has no steps yet.</EmptyNote>
            )}
          </section>
        </Container>
      </article>
    );
  }

  const c = await getGuidedStepContent(journey, step);
  const prev = current > 1 ? journey.steps[current - 2] : null;
  const next = current < n ? journey.steps[current] : null;
  const initial = depth === "standard" || depth === "deep" ? depth : "brief";

  return (
    <article data-guided-journey={slug} data-guided-step={current}>
      <RecordStep
        slug={slug}
        position={current}
        route={
          isPublic
            ? {
                title: journey.entity.title,
                total: n,
                href: `${links.stepPrefix}${current}`,
                stops: journey.steps.map((s) => ({ href: s.entity.href, title: s.entity.title })),
              }
            : undefined
        }
      />
      {header}
      <Container className="pt-4">
        <div className="border-b-[3px] border-ink pb-4">
          <PathRoute slug={slug} stops={stops} current={current} hrefPrefix={links.stepPrefix} label="The journey" unit="steps" />
        </div>
      </Container>

      <Container className="py-10">
        <div key={step.id} className="grid gap-12 animate-enter lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <p className="flex items-baseline gap-3">
              <span className="numeral text-[2.4rem] leading-none text-red">{String(current).padStart(2, "0")}</span>
              <span className="label text-faint">Step {current} of {n}</span>
            </p>

            {step.orientation && (
              <section aria-labelledby="g-where" className="mt-6 border-l-[3px] border-red bg-paper-warm px-5 py-4">
                <h2 id="g-where" className="label mb-2 text-red">
                  Where you are
                </h2>
                <Prose text={step.orientation} context={c.prose.context} className="!text-[1.1rem]" />
              </section>
            )}

            <section aria-labelledby="g-idea" className="mt-10">
              <p className="kicker flex items-center gap-2">
                <Swatch kind={step.entity.kind} />
                {KINDS[step.entity.kind].label}
              </p>
              <h1 id="g-idea" className="display mt-3 text-[2.8rem] sm:text-[4.4rem]">
                <Link href={step.entity.href} className="hover:text-red">
                  {step.entity.title}
                </Link>
              </h1>
              {step.framing && <p className="mt-4 max-w-2xl font-serif text-[1.3rem] italic leading-snug text-muted">{step.framing}</p>}
              <div className="mt-8">
                <DepthReader
                  initial={initial}
                  levels={c.levels.map((l, i) => ({
                    key: l.key,
                    label: l.label,
                    available: l.texts.length > 0,
                    content: (
                      <div className="space-y-6">
                        {l.texts.map((t, k) => (
                          <Prose key={k} text={t} context={c.prose.context} className={l.key === "brief" ? "!text-[1.4rem] !leading-[1.4]" : ""} />
                        ))}
                      </div>
                    ),
                  }))}
                />
              </div>
            </section>

            {step.whyItMatters && (
              <section aria-labelledby="g-why" className="mt-12 max-w-2xl">
                <h2 id="g-why" className="label mb-2 border-t-[3px] border-ink pt-3 text-red">
                  Why it matters
                </h2>
                <Prose text={step.whyItMatters} context={c.prose.context} />
              </section>
            )}

            {c.featured && (
              <section aria-labelledby="g-source" className="mt-12">
                <h2 id="g-source" className="label mb-5 border-t border-ink pt-2.5 text-faint">
                  From the source
                </h2>
                <Excerpts items={[c.featured]} />
                {c.moreExcerpts > 0 && (
                  <p className="mt-4 text-sm text-muted">
                    {c.moreExcerpts} more passage{c.moreExcerpts > 1 ? "s" : ""} in{" "}
                    <Link href={step.entity.href} className="link-inline">
                      the full entry
                    </Link>
                    .
                  </p>
                )}
              </section>
            )}

            <section aria-labelledby="g-next" className="mt-14 border-t-[3px] border-ink">
              <div className="py-5">
                <h2 id="g-next" className="label mb-2 text-faint">
                  {next ? "Continue" : "End of the journey"}
                </h2>
                {next ? (
                  <>
                    {step.nextReason && <Prose text={step.nextReason} context={c.prose.context} className="max-w-2xl" />}
                    <StepCard step={next} href={`${links.stepPrefix}${current + 1}`} kicker={`Next · step ${current + 1}`} />
                  </>
                ) : (
                  step.nextReason && <Prose text={step.nextReason} context={c.prose.context} className="max-w-2xl" />
                )}
              </div>
              <nav aria-label="Journey navigation" className="grid grid-cols-3 border border-ink">
                {prev ? (
                  <Link href={`${links.stepPrefix}${current - 1}`} className="group p-4 hover:bg-paper-warm" rel="prev">
                    <span className="label block text-faint">← Back</span>
                    <span className="mt-1 hidden font-serif text-lg leading-tight group-hover:text-red sm:block">{prev.entity.title}</span>
                  </Link>
                ) : (
                  <Link href={links.overview} className="group p-4 hover:bg-paper-warm">
                    <span className="label block text-faint">← Overview</span>
                  </Link>
                )}
                <Link href={links.overview} className="group border-x border-ink p-4 text-center hover:bg-ink hover:text-paper">
                  <span className="label block">All steps</span>
                  <span className="mt-1 hidden text-sm text-muted group-hover:text-ink-muted sm:block">See the whole journey</span>
                </Link>
                {next ? (
                  <Link href={`${links.stepPrefix}${current + 1}`} className="group bg-red p-4 text-right text-paper-warm hover:bg-red-deep" rel="next">
                    <span className="label block">Next →</span>
                    <span className="mt-1 hidden font-serif text-lg leading-tight sm:block">{next.entity.title}</span>
                  </Link>
                ) : (
                  <Link href="/explore" className="group bg-ink p-4 text-right text-paper">
                    <span className="label block">Explore →</span>
                    <span className="mt-1 hidden text-sm text-ink-muted sm:block">The whole Atlas</span>
                  </Link>
                )}
              </nav>
            </section>
            <Notes notes={c.prose.notes} className="mt-12 max-w-3xl" />
          </div>

          <aside className="min-w-0 space-y-9 lg:col-span-4" aria-label="Explore from this step">
            <Leave title="Go deeper">
              <li className="border-b border-rule">
                <Link href={step.entity.href} className="group block py-3" data-guided-entry>
                  <span className="label block text-faint">The full entry</span>
                  <span className="font-serif text-[1.2rem] group-hover:text-red">{step.entity.title} →</span>
                </Link>
              </li>
              {step.entity.yearStart && step.entity.kind !== "concept" && (
                <li className="border-b border-rule">
                  <Link href={`/timeline?focus=${step.entity.yearStart}`} className="group block py-3">
                    <span className="label block text-faint">On the timeline</span>
                    <span className="font-serif text-[1.2rem] group-hover:text-red">Around {step.entity.yearStart} →</span>
                  </Link>
                </li>
              )}
            </Leave>

            {c.along.length > 0 && (
              <Leave title="Connections on this journey">
                {c.along.slice(0, 8).map((r) => (
                  <li key={r.relationshipId} className="border-b border-rule">
                    <Link href={`${links.stepPrefix}${r.stepPosition}`} className="group grid grid-cols-[2.25rem_1fr] gap-2 py-3">
                      <span className="numeral text-[1.2rem] text-red">{String(r.stepPosition).padStart(2, "0")}</span>
                      <span>
                        <span className="rel block">{r.label}</span>
                        <span className="font-serif text-[1.15rem] leading-tight group-hover:text-red">{r.title}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </Leave>
            )}

            {step.branches.length > 0 && (
              <Leave title="Side routes">
                {step.branches.map((b) => (
                  <li key={b.id} className="border-b border-rule">
                    <Link href={b.entity.href} className="group block py-3">
                      <span className="label block text-faint">
                        {b.track === "alternative" ? "Alternative" : "Branch"} · {KINDS[b.entity.kind].label}
                      </span>
                      <span className="font-serif text-[1.15rem] group-hover:text-red">{b.entity.title}</span>
                      {b.framing && <span className="mt-1 block text-sm text-muted">{b.framing}</span>}
                    </Link>
                  </li>
                ))}
              </Leave>
            )}

            {c.beyond.length > 0 && (
              <Leave title="Beyond the journey">
                {c.beyond.map((r) => (
                  <li key={r.relationshipId} className="border-b border-rule">
                    <Link href={r.href} className="group block py-3">
                      <span className="label flex items-center gap-1.5 text-faint">
                        <Swatch kind={r.kind} /> {KINDS[r.kind].label}
                        <span className="rel ml-1 normal-case tracking-normal">{r.label}</span>
                      </span>
                      <span className="font-serif text-[1.15rem] group-hover:text-red">{r.title}</span>
                    </Link>
                  </li>
                ))}
              </Leave>
            )}
          </aside>
        </div>
      </Container>
    </article>
  );
}
