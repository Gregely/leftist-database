import Link from "next/link";
import { DepthReader } from "@/components/concept/DepthReader";
import { Container, EmptyNote, Label, SampleMark } from "@/components/editorial/primitives";
import { Notes } from "@/components/editorial/Notes";
import { Prose } from "@/components/editorial/Prose";
import { Excerpts } from "@/components/entity/Excerpts";
import { JourneyActions, RecordStep } from "@/components/guided/JourneyProgress";
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
    <Link href={href} className="group block border-t border-rule py-4">
      <span className="label block text-faint">
        {kicker} · {KINDS[step.entity.kind].label}
      </span>
      <span className="font-serif text-2xl leading-tight group-hover:text-red">{step.entity.title}</span>
      {step.framing && <span className="mt-1 block text-muted">{step.framing}</span>}
    </Link>
  );
}

/**
 * A Guided journey: an overview, then one step at a time. Each step points at
 * an existing entry and shows that entry's own progressive explanation,
 * excerpt and connections, framed by a few lines of journey copy.
 */
export async function GuidedView({ journey, step: stepParam, depth, links }: { journey: GuidedJourney; step?: string; depth?: string; links: GuidedLinks }) {
  const n = journey.steps.length;
  const current = Math.min(n, Math.max(0, Number(stepParam) || 0));
  const step = current ? journey.steps[current - 1] : null;
  const stops = journey.steps.map((s) => ({ position: s.position, title: s.entity.title, kind: s.entity.kind }));
  const slug = journey.entity.slug;

  const header = (
    <Container className="pt-6 sm:pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-2">
        <Label className="text-muted">
          <Link href="/guided" className="hover:text-red">
            Guided
          </Link>{" "}
          <span className="text-red">/</span>{" "}
          <Link href={links.overview} className="hover:text-red">
            {journey.entity.title}
          </Link>
        </Label>
        <SampleMark sample={journey.entity.sample} />
      </div>
    </Container>
  );

  if (!step) {
    return (
      <article data-guided-journey={slug}>
        {header}
        <Container>
          <header className="grid gap-8 pb-10 pt-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="label text-red">Guided journey{journey.level ? ` · ${journey.level}` : ""}</p>
              <h1 className="display mt-3 text-[2.8rem] sm:text-[4.6rem]">{journey.entity.title}</h1>
              {journey.entryLine && <p className="serif-italic mt-4 text-2xl text-red">“{journey.entryLine}”</p>}
              <p className="lede mt-6 max-w-2xl">{journey.entity.summary}</p>
              {journey.overview && (
                <div className="mt-6 max-w-2xl">
                  <p className="label mb-2 text-faint">What this journey covers</p>
                  <Prose text={journey.overview} context={journey.prose.context} />
                </div>
              )}
            </div>
            <aside className="space-y-6 lg:col-span-5 lg:pt-10">
              <p className="label-mono text-faint">
                {n} steps{journey.estimatedTime ? ` · ${journey.estimatedTime}` : ""}
              </p>
              <JourneyActions slug={slug} titles={journey.steps.map((s) => s.entity.title)} stepHrefPrefix={links.stepPrefix} />
              {journey.prerequisites && (
                <div className="border-l-2 border-red pl-4">
                  <p className="label mb-2 text-faint">Before you start</p>
                  <Prose text={journey.prerequisites} context={journey.prose.context} className="!text-[0.95rem]" />
                </div>
              )}
              <p className="text-sm text-muted">
                Nothing is locked: open any step, go back, skip ahead, or leave for the full Atlas at any point. Your place is
                remembered in this browser only.
              </p>
            </aside>
          </header>
          <div className="border-y border-ink py-5">
            <PathRoute slug={slug} stops={stops} current={0} hrefPrefix={links.stepPrefix} label="The journey" unit="steps" />
          </div>
          <section aria-labelledby="journey-steps" className="py-10">
            <h2 id="journey-steps" className="label mb-4 text-faint">
              The whole journey
            </h2>
            {n ? (
              <ol>
                {journey.steps.map((s) => (
                  <li key={s.id} className="border-t border-rule">
                    <Link href={`${links.stepPrefix}${s.position}`} className="group grid grid-cols-[3rem_1fr] gap-4 py-5">
                      <span className="numeral text-3xl text-red">{String(s.position).padStart(2, "0")}</span>
                      <span>
                        <span className="label block text-faint">{KINDS[s.entity.kind].label}</span>
                        <span className="font-serif text-2xl group-hover:text-red">{s.entity.title}</span>
                        {s.framing && <span className="mt-1 block text-muted">{s.framing}</span>}
                      </span>
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
  const isConcept = step.entity.kind === "concept";
  const initial = depth === "standard" || depth === "deep" ? depth : "brief";

  return (
    <article data-guided-journey={slug} data-guided-step={current}>
      <RecordStep slug={slug} position={current} />
      {header}
      <Container className="pt-4">
        <div className="border-b border-ink pb-4">
          <PathRoute slug={slug} stops={stops} current={current} hrefPrefix={links.stepPrefix} label="The journey" unit="steps" />
        </div>
      </Container>

      <Container className="py-10">
        <div key={step.id} className="grid gap-12 lg:grid-cols-12 animate-enter">
          <div className="min-w-0 lg:col-span-8">
            <p className="label-mono text-red">
              Step {String(current).padStart(2, "0")} of {String(n).padStart(2, "0")}
            </p>

            {step.orientation && (
              <section aria-labelledby="g-where" className="mt-5 border-l-2 border-red bg-paper-warm px-5 py-4">
                <h2 id="g-where" className="label mb-2 text-faint">
                  Where you are
                </h2>
                <Prose text={step.orientation} context={c.prose.context} className="!text-[1.05rem]" />
              </section>
            )}

            <section aria-labelledby="g-idea" className="mt-10">
              <p className="label text-faint">The idea · {KINDS[step.entity.kind].label}</p>
              <h1 id="g-idea" className="display mt-3 text-[2.6rem] sm:text-[4rem]">
                <Link href={step.entity.href} className="hover:text-red">
                  {step.entity.title}
                </Link>
              </h1>
              {step.framing && <p className="mt-4 max-w-2xl text-lg leading-snug text-muted">{step.framing}</p>}
              <div className="mt-8">
                <DepthReader
                  initial={initial}
                  levels={c.levels.map((l, i) => ({
                    key: l.key,
                    label: l.label,
                    duration: isConcept ? ["~ 80 words", "~ 400 words", "Theory & interpretation"][i] : ["Overview", "The entry", "Further"][i],
                    available: l.texts.length > 0,
                    content: (
                      <div className="space-y-6">
                        {l.texts.map((t, k) => (
                          <Prose key={k} text={t} context={c.prose.context} className={l.key === "brief" ? "font-serif !text-[1.35rem] !leading-snug" : ""} />
                        ))}
                      </div>
                    ),
                  }))}
                />
              </div>
            </section>

            {step.whyItMatters && (
              <section aria-labelledby="g-why" className="mt-10 max-w-2xl">
                <h2 id="g-why" className="label mb-2 text-red">
                  Why it matters
                </h2>
                <Prose text={step.whyItMatters} context={c.prose.context} />
              </section>
            )}

            {c.featured && (
              <section aria-labelledby="g-source" className="mt-10">
                <h2 id="g-source" className="label mb-4 text-faint">
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

            <section aria-labelledby="g-next" className="mt-12 border border-ink">
              <div className="p-5 sm:p-6">
                <h2 id="g-next" className="label mb-2 text-faint">
                  {next ? "Continue" : "End of the journey"}
                </h2>
                {next ? (
                  <>
                    {step.nextReason && <Prose text={step.nextReason} context={c.prose.context} className="max-w-2xl" />}
                    <StepCard step={next} href={`${links.stepPrefix}${current + 1}`} kicker={`Next · step ${current + 1}`} />
                  </>
                ) : (
                  <div className="max-w-2xl space-y-3">
                    {step.nextReason && <Prose text={step.nextReason} context={c.prose.context} />}
                    <p>
                      You have reached the end of this journey — and of what the Atlas covers on it so far. Everything you met is
                      still one click away: return to the overview, or keep exploring the Atlas on your own.
                    </p>
                  </div>
                )}
              </div>
              <nav aria-label="Journey navigation" className="grid grid-cols-3 border-t border-ink">
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

          <aside className="min-w-0 space-y-10 lg:col-span-4" aria-label="Explore from this step">
            <section>
              <h2 className="label mb-3 text-red">Go deeper</h2>
              <ul className="border-t border-ink">
                <li className="border-b border-rule">
                  <Link href={step.entity.href} className="group block py-3" data-guided-entry>
                    <span className="label block text-faint">The full entry</span>
                    <span className="font-serif text-lg group-hover:text-red">{step.entity.title} →</span>
                  </Link>
                </li>
                {step.entity.yearStart && step.entity.kind !== "concept" && (
                  <li className="border-b border-rule">
                    <Link href={`/timeline?focus=${step.entity.yearStart}`} className="group block py-3">
                      <span className="label block text-faint">On the timeline</span>
                      <span className="font-serif text-lg group-hover:text-red">Around {step.entity.yearStart} →</span>
                    </Link>
                  </li>
                )}
              </ul>
            </section>

            {c.along.length > 0 && (
              <section>
                <h2 className="label mb-1 text-faint">Connections on this journey</h2>
                <p className="mb-3 text-sm text-muted">Other steps this one is linked to in the Atlas.</p>
                <ul className="border-t border-rule">
                  {c.along.slice(0, 8).map((r) => (
                    <li key={r.relationshipId} className="border-b border-rule">
                      <Link href={`${links.stepPrefix}${r.stepPosition}`} className="group grid grid-cols-[2.5rem_1fr] gap-2 py-3">
                        <span className="numeral text-xl text-red">{String(r.stepPosition).padStart(2, "0")}</span>
                        <span>
                          <span className="label block text-faint">{r.label}</span>
                          <span className="font-serif text-lg leading-tight group-hover:text-red">{r.title}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {step.branches.length > 0 && (
              <section>
                <h2 className="label mb-3 text-faint">Side routes</h2>
                <ul className="border-t border-rule">
                  {step.branches.map((b) => (
                    <li key={b.id} className="border-b border-rule">
                      <Link href={b.entity.href} className="group block py-3">
                        <span className="label block text-faint">
                          {b.track === "alternative" ? "Alternative" : "Branch"} · {KINDS[b.entity.kind].label}
                        </span>
                        <span className="font-serif text-lg group-hover:text-red">{b.entity.title}</span>
                        {b.framing && <span className="mt-1 block text-sm text-muted">{b.framing}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {c.beyond.length > 0 && (
              <section>
                <h2 className="label mb-1 text-faint">Explore beyond the journey</h2>
                <p className="mb-3 text-sm text-muted">Related entries this journey does not stop at.</p>
                <ul className="border-t border-rule">
                  {c.beyond.map((r) => (
                    <li key={r.relationshipId} className="border-b border-rule">
                      <Link href={r.href} className="group block py-3">
                        <span className="label block text-faint">
                          {r.label} · {KINDS[r.kind].label}
                        </span>
                        <span className="font-serif text-lg group-hover:text-red">{r.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <p className="text-xs text-muted">Leave whenever you like — the journey will be here when you come back.</p>
          </aside>
        </div>
      </Container>
    </article>
  );
}
