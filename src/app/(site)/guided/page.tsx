import type { Metadata } from "next";
import Link from "next/link";
import { IndexHeader } from "@/components/editorial/IndexHeader";
import { ArrowLink, Container, EmptyNote, Swatch } from "@/components/editorial/primitives";
import { JourneyActions } from "@/components/guided/JourneyProgress";
import { listGuidedJourneys, listPaths } from "@/lib/data";
import { SECTIONS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guided",
  description: "Guided journeys: structured routes through the Atlas, one idea at a time.",
};

export default async function GuidedIndex() {
  const [journeys, paths] = await Promise.all([listGuidedJourneys(), listPaths()]);
  return (
    <>
      <IndexHeader
        crumb="Guided"
        tone="var(--color-red)"
        title={
          <>
            Guided<span className="text-red">.</span>
          </>
        }
        count={journeys.length || undefined}
      />
      <Container>
        {journeys.length ? (
          <ol className="border-t-[3px] border-ink">
            {journeys.map((j) => {
              const titles = j.steps.map((s) => s.title);
              return (
                <li key={j.id} className="border-b border-ink" data-guided-card={j.slug}>
                  <div className="grid gap-10 py-10 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                      <p className="kicker text-red">Guided journey{j.level ? ` · ${j.level}` : ""}</p>
                      <h2 className="display mt-3 text-[2.6rem] leading-none sm:text-[3.8rem]">
                        <Link href={`/guided/${j.slug}`} className="hover:text-red">
                          {j.title}
                        </Link>
                      </h2>
                      {j.entryLine && <p className="mt-3 font-serif text-[1.4rem] italic text-red">“{j.entryLine}”</p>}
                      <p className="lede mt-5 max-w-2xl">{j.summary}</p>
                      <p className="label-mono mt-5 text-faint">
                        {titles.length} steps{j.estimatedTime ? ` · ${j.estimatedTime}` : ""}
                      </p>
                      <ArrowLink href={`/guided/${j.slug}`} className="mt-5">
                        All steps
                      </ArrowLink>
                    </div>
                    <div className="space-y-8 lg:col-span-5">
                      <JourneyActions slug={j.slug} titles={titles} stepHrefPrefix={`/guided/${j.slug}?step=`} />
                      {titles.length > 0 && (
                        <div>
                          <p className="label text-faint">Covers</p>
                          <ol className="mt-2 border-l border-ink pl-4">
                            {j.steps.slice(0, 8).map((s, n) => (
                              <li key={n} className="relative flex items-baseline gap-2 py-0.5 font-serif text-[1.02rem]">
                                <span aria-hidden="true" className={`absolute -left-[20.5px] top-[0.6rem] h-2 w-2 rounded-full border ${n === 0 ? "border-red bg-red" : "border-ink bg-paper"}`} />
                                <span className="label-mono w-5 shrink-0 text-faint">{n + 1}</span>
                                {s.title}
                              </li>
                            ))}
                            {titles.length > 8 && <li className="py-0.5 pl-7 font-serif italic text-faint">and {titles.length - 8} more</li>}
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="border-t-[3px] border-ink py-8">
            <EmptyNote>No Guided journeys have been published yet.</EmptyNote>
          </div>
        )}

        {paths.length > 0 && (
          <section aria-labelledby="paths-h" className="mt-16">
            <div className="flex items-baseline justify-between border-t-[3px] border-ink pt-3">
              <h2 id="paths-h" className="label font-sans">
                Learning paths
              </h2>
              <ArrowLink href="/paths">All paths</ArrowLink>
            </div>
            <ul className="mt-2 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
              {paths.map((p) => (
                <li key={p.id} className="border-b border-rule">
                  <Link href={p.href} className="group block py-4">
                    <span className="font-serif text-[1.35rem] italic leading-tight group-hover:text-red">“{p.entryLine}”</span>
                    <span className="label mt-1.5 block text-faint">
                      {p.title} · {p.steps.length} stops
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-16" aria-labelledby="own-h">
          <h2 id="own-h" className="label border-t-[3px] border-ink pt-3 font-sans">
            The collection
          </h2>
          <ul className="mt-2 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
            {SECTIONS.map((s) => (
              <li key={s.href} className="border-b border-rule">
                <Link href={s.href} className="group flex items-center gap-2.5 py-3">
                  <Swatch tone={s.tone} />
                  <span className="font-serif text-[1.25rem] group-hover:text-red">{s.label}</span>
                  <span aria-hidden="true" className="ml-auto text-red transition-transform group-hover:translate-x-1">
                    →
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
