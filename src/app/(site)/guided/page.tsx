import type { Metadata } from "next";
import Link from "next/link";
import { IndexHeader } from "@/components/editorial/IndexHeader";
import { ArrowLink, Container, EmptyNote } from "@/components/editorial/primitives";
import { JourneyActions } from "@/components/guided/JourneyProgress";
import { listGuidedJourneys } from "@/lib/data";

export const metadata: Metadata = {
  title: "Guided",
  description: "Not sure where to start? Guided journeys walk you through the Atlas one idea at a time.",
};

export default async function GuidedIndex() {
  const journeys = await listGuidedJourneys();
  return (
    <>
      <IndexHeader
        crumb="Guided"
        tally={journeys.length ? `${journeys.length} ${journeys.length === 1 ? "journey" : "journeys"}` : undefined}
        title={
          <>
            Where should I start<span className="text-red">?</span>
          </>
        }
        lede="Guided journeys take you through the Atlas one idea at a time: where you are, what the idea is, why it matters, and where it leads next. Every step opens onto the full entries, so you can leave the route whenever something catches your eye — and pick it up again later."
      />
      <Container>
        {journeys.length ? (
          <ol className="border-t border-ink">
            {journeys.map((j) => {
              const titles = j.steps.map((s) => s.title);
              return (
                <li key={j.id} className="border-b border-rule" data-guided-card={j.slug}>
                  <div className="grid gap-8 py-10 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                      <p className="label text-red">Guided journey{j.level ? ` · ${j.level}` : ""}</p>
                      <h2 className="display mt-3 text-[2.4rem] leading-none sm:text-[3.6rem]">
                        <Link href={`/guided/${j.slug}`} className="hover:text-red">
                          {j.title}
                        </Link>
                      </h2>
                      {j.entryLine && <p className="serif-italic mt-3 text-xl text-red">“{j.entryLine}”</p>}
                      <p className="lede mt-5 max-w-2xl">{j.summary}</p>
                      <p className="label-mono mt-5 text-faint">
                        {titles.length} steps{j.estimatedTime ? ` · ${j.estimatedTime}` : ""}
                      </p>
                      {titles.length > 0 && (
                        <p className="mt-3 max-w-2xl text-sm text-muted">
                          <span className="label mr-2 text-faint">Covers</span>
                          {titles.slice(0, 8).join(" · ")}
                          {titles.length > 8 ? ` · and ${titles.length - 8} more` : ""}
                        </p>
                      )}
                      <ArrowLink href={`/guided/${j.slug}`} className="mt-6">
                        See the whole journey
                      </ArrowLink>
                    </div>
                    <div className="lg:col-span-5 lg:pt-12">
                      <JourneyActions slug={j.slug} titles={titles} stepHrefPrefix={`/guided/${j.slug}?step=`} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="border-t border-ink py-10">
            <EmptyNote>No Guided journeys have been published yet. In the meantime, the Atlas can be explored freely.</EmptyNote>
          </div>
        )}
        <section className="my-16 grid gap-6 border-t border-ink pt-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Explore on your own">
          <p className="label text-faint sm:col-span-2 lg:col-span-4">Prefer to find your own way?</p>
          <ArrowLink href="/explore">Explore the Atlas</ArrowLink>
          <ArrowLink href="/concepts">Concepts, A–Z</ArrowLink>
          <ArrowLink href="/timeline">The timeline</ArrowLink>
          <ArrowLink href="/paths">Learning paths</ArrowLink>
        </section>
      </Container>
    </>
  );
}
