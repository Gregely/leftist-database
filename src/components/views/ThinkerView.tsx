import Link from "next/link";
import type { ReactNode } from "react";
import { MapFigure } from "@/components/graph/MapFigure";
import { Container, EmptyNote, entityLinks, MetaList, Question } from "@/components/editorial/primitives";
import { Notes } from "@/components/editorial/Notes";
import { Prose } from "@/components/editorial/Prose";
import { Figure } from "@/components/editorial/Figure";
import { EntryHeader } from "@/components/entity/EntryHeader";
import { EntrySection } from "@/components/entity/EntrySection";
import { RelationList } from "@/components/entity/RelationList";
import { SectionNav } from "@/components/entity/SectionNav";
import { PeriodStrip } from "@/components/timeline/PeriodStrip";
import { type ThinkerAggregate } from "@/lib/data";
import { activePeriods } from "@/lib/periods";

/** One column of the "at a glance" band. */
function Glance({ label, href, children }: { label: string; href: string; children: ReactNode }) {
  return (
    <div className="border-t border-ink pt-2.5">
      <a href={href} className="label text-faint hover:text-red">
        {label}
      </a>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function GlanceList({ items, italic = false }: { items: { id: string; title: string; href: string }[]; italic?: boolean }) {
  if (!items.length) return <p className="font-serif italic text-faint">None recorded yet</p>;
  return (
    <ul className="space-y-1">
      {items.map((i) => (
        <li key={i.id} className="leading-snug">
          <Link href={i.href} className={`link-inline font-serif text-[1.08rem] ${italic ? "italic" : ""}`}>
            {i.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** One line per entry, however many relationships connect it. */
const unique = <T extends { id: string }>(items: T[]) => items.filter((x, i) => items.findIndex((y) => y.id === x.id) === i);

/**
 * A thinker as an editorial profile: who they were (title block and lifeline),
 * why they matter (at a glance), then the long view — overview, context,
 * ideas and network, works, influences, disagreements, legacy and a chronology.
 */
export function ThinkerView({ t }: { t: ThinkerAggregate }) {
  const { entity, details } = t;
  const periods = activePeriods(entity.yearStart, entity.yearEnd);

  const portrait = t.media.find((m) => m.role === "portrait");
  const gallery = t.media.filter((m) => m !== portrait && m.role !== "figure");
  const sections = [
    { id: "overview", label: "Overview" },
    ...(details.context ? [{ id: "context", label: "Context" }] : []),
    { id: "ideas", label: "Ideas" },
    { id: "works", label: "Works" },
    { id: "influences", label: "Influences" },
    { id: "disagreements", label: "Disagreements" },
    { id: "legacy", label: "Legacy" },
    { id: "timeline", label: "Timeline" },
  ];
  const n = (id: string) => String(sections.findIndex((s) => s.id === id) + 1);
  const quotes = t.excerpts.filter((x) => x.body);
  const drewOn = [...t.influencedBy, ...t.collaborators];

  return (
    <article>
      <EntryHeader
        entity={entity}
        number={t.sortOrder / 5}
        meta={
          <p className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            {entity.subtitle && <span className="numeral text-[2rem] leading-none text-red sm:text-[2.4rem]">{entity.subtitle}</span>}
            {details.roles && <span className="font-serif text-[1.25rem] italic text-muted">{details.roles}</span>}
          </p>
        }
        standfirst={entity.summary}
        aside={
          <>
            {portrait && <Figure media={portrait} size="portrait" className="mb-6 max-w-[15rem]" />}
            <MetaList
              items={[
                { label: "Tendency", value: entityLinks(t.tendencies) },
                {
                  label: "Period",
                  value: periods.length ? (
                    <span>
                      {periods.map((p, i) => (
                        <span key={p.slug}>
                          <Link href={`/timeline?from=${p.from}&to=${p.to}`} className="link-inline">
                            {p.label}
                          </Link>
                          {i < periods.length - 1 && <span className="text-faint"> · </span>}
                        </span>
                      ))}
                    </span>
                  ) : null,
                },
                { label: "Born", value: details.birthPlace ? `${entity.yearStart}, ${details.birthPlace}` : entity.yearStart },
                { label: "Died", value: entity.yearEnd ? `${entity.yearEnd}${details.deathPlace ? `, ${details.deathPlace}` : ""}` : null },
                { label: "Related", value: entityLinks(t.relatedThinkers.slice(0, 6)) },
              ]}
            />
          </>
        }
        band={
          <div className="pb-10">
            {entity.yearStart != null && (
              <PeriodStrip
                from={entity.yearStart}
                to={entity.yearEnd}
                ongoing={entity.yearEnd == null}
                label="Life"
                marks={t.timeline.filter((e) => e.kind !== "life").map((e) => ({ year: e.year, title: e.title, href: e.href, kind: e.kind }))}
                className="mb-10"
              />
            )}
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="At a glance" role="group">
              <Glance label="Major ideas" href="#ideas">
                <GlanceList items={t.ideas.slice(0, 5)} />
              </Glance>
              <Glance label="Key texts" href="#works">
                <GlanceList items={t.works.slice(0, 4)} italic />
              </Glance>
              <Glance label="Drew on" href="#influences">
                <GlanceList items={unique(drewOn).slice(0, 4)} />
              </Glance>
              <Glance label="Argued with" href="#disagreements">
                <GlanceList items={unique(t.disagreements).slice(0, 4)} />
              </Glance>
            </div>
          </div>
        }
      />

      <SectionNav sections={sections} title={entity.title} label="Sections of this profile" />

      <Container>
        <EntrySection id="overview" number={n("overview")} label="Overview">
          <div className="grid gap-10 xl:grid-cols-9">
            <div className="xl:col-span-6">
              <Prose text={t.body} context={t.prose.context} dropcap className="max-w-[40rem]" />
            </div>
            {quotes.length > 0 && (
              <aside className="xl:col-span-3">
                <p className="label mb-3 text-faint">In their words</p>
                {quotes.map((x) => (
                  <figure key={x.id} className="mb-6 border-t border-ink pt-3">
                    <blockquote className="font-serif text-[1.3rem] italic leading-snug">
                      <span aria-hidden="true" className="mr-0.5 not-italic text-red">
                        “
                      </span>
                      {x.body}
                    </blockquote>
                    <figcaption className="mt-2 text-[0.8rem] text-muted">
                      {x.text && (
                        <Link href={x.text.href} className="link-inline font-serif italic">
                          {x.text.title}
                        </Link>
                      )}
                      {x.locator && `, ${x.locator}`}
                      {!x.verified && <span className="label ml-2 text-red">Unverified</span>}
                    </figcaption>
                  </figure>
                ))}
              </aside>
            )}
          </div>
          {gallery.length > 0 && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((m) => (
                <Figure key={m.id} media={m} size="portrait" />
              ))}
            </div>
          )}
        </EntrySection>

        {details.context && (
          <EntrySection id="context" number={n("context")} label="Historical context">
            <Prose text={details.context} context={t.prose.context} className="max-w-[40rem]" />
          </EntrySection>
        )}

        <EntrySection id="ideas" number={n("ideas")} label="Core ideas" title="The concepts this thinker developed or is associated with.">
          {t.ideas.length ? (
            <ol className="grid gap-x-10 sm:grid-cols-2">
              {t.ideas.map((c, i) => (
                <li key={c.id} className="border-t border-rule py-4">
                  <Link href={c.href} className="group grid grid-cols-[2.25rem_1fr] gap-2">
                    <span className="numeral text-[1.4rem] leading-tight text-red">{i + 1}</span>
                    <span>
                      <span className="font-serif text-[1.5rem] leading-tight group-hover:text-red">{c.title}</span>
                      <span className="mt-1 block text-[0.92rem] leading-snug text-muted">{c.note || c.summary}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyNote>No concepts linked yet.</EmptyNote>
          )}
          {t.network.nodes.length > 1 && (
            <div className="mt-14">
              <MapFigure
                graph={t.network}
                mode="radial"
                focusId={entity.id}
                size="medium"
                plate="Network"
                heading={`${entity.title} and those one step away`}
                title={`Intellectual network of ${entity.title}`}
              />
            </div>
          )}
        </EntrySection>

        <EntrySection id="works" number={n("works")} label="Major works">
          {t.works.length ? (
            <ol className="border-t border-ink">
              {t.works.map((w) => (
                <li key={w.id} className="border-b border-rule">
                  <Link href={w.href} className="group grid grid-cols-[4.5rem_1fr] gap-4 py-4 md:grid-cols-[5rem_1fr_16rem]">
                    <span className="numeral text-[1.6rem] leading-tight text-blue">{w.yearStart}</span>
                    <span>
                      <span className="font-serif text-[1.5rem] italic leading-tight group-hover:text-red">{w.title}</span>
                      <span className="mt-1 block text-[0.9rem] text-muted md:hidden">{w.summary}</span>
                    </span>
                    <span className="hidden text-[0.9rem] leading-snug text-muted md:block">{w.summary}</span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyNote>No works catalogued yet.</EmptyNote>
          )}
        </EntrySection>

        <EntrySection id="influences" number={n("influences")} label="Influences" title="Where the thinking came from, and where it went.">
          <div className="grid gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-8">
            <div>
              <p className="label mb-3 text-faint">← Drew on</p>
              <RelationList items={drewOn} empty="No recorded influences yet." />
            </div>
            <div aria-hidden="true" className="hidden md:flex md:flex-col md:items-center">
              <span className="w-px flex-1 bg-ink" />
              <span className="py-3 font-serif text-[1.05rem] italic [writing-mode:vertical-rl]">{entity.title}</span>
              <span className="w-px flex-1 bg-ink" />
            </div>
            <div>
              <p className="label mb-3 text-faint">Went on to shape →</p>
              <RelationList items={t.influenced} empty="No recorded successors yet." />
            </div>
          </div>
        </EntrySection>

        <EntrySection id="disagreements" number={n("disagreements")} label="Disagreements" title="Who they argued with, and where the arguments are staged.">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="label mb-3 text-faint">Critiques &amp; responses</p>
              <RelationList items={t.disagreements} showKind empty="No recorded disagreements yet." />
            </div>
            <div>
              <p className="label mb-3 text-faint">Positions in debates</p>
              {t.debates.length ? (
                <ul className="border-t border-ink">
                  {t.debates.map((d) => (
                    <li key={d.href} className="border-b border-rule">
                      <Link href={d.href} className="group block py-4">
                        <span className="font-serif text-[1.45rem] leading-tight group-hover:text-red">
                          <Question title={d.debate.title} />
                        </span>
                        <span className="mt-1.5 block text-[0.92rem] leading-snug text-muted">
                          <span className="rel mr-1">argues</span>
                          {d.centralClaim}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyNote>Not yet placed in a debate.</EmptyNote>
              )}
            </div>
          </div>
        </EntrySection>

        <EntrySection id="legacy" number={n("legacy")} label="Legacy">
          {details.legacy ? <Prose text={details.legacy} context={t.prose.context} className="max-w-[40rem]" /> : <EmptyNote>Legacy not yet written.</EmptyNote>}
        </EntrySection>

        <EntrySection id="timeline" number={n("timeline")} label="Timeline">
          <ol className="relative ml-1 border-l border-ink">
            {t.timeline.map((ev, i) => (
              <li key={i} className="relative grid grid-cols-[4.5rem_1fr] gap-4 py-2.5 pl-6">
                <span
                  aria-hidden="true"
                  className={`absolute -left-[5px] top-[1.05rem] h-[9px] w-[9px] rotate-45 border ${ev.kind === "life" ? "border-ink bg-ink" : ev.kind === "event" ? "border-umber bg-umber" : "border-blue bg-paper"}`}
                />
                <span className="numeral text-[1.25rem] text-red">{ev.year}</span>
                <span>
                  {ev.href ? (
                    <Link href={ev.href} className={`link-inline font-serif text-[1.15rem] ${ev.kind === "text" ? "italic" : ""}`}>
                      {ev.title}
                    </Link>
                  ) : (
                    <span className="font-serif text-[1.15rem]">{ev.title}</span>
                  )}
                  <span className="label ml-3 text-faint">{ev.kind === "text" ? "Work" : ev.kind === "event" ? "Event" : "Life"}</span>
                </span>
              </li>
            ))}
          </ol>
          <Link href={`/timeline?focus=${entity.yearStart}&item=${entity.slug}`} className="group label mt-6 inline-flex items-center gap-1.5 text-red">
            <span className="link-sweep">See this life on the full timeline</span> <span aria-hidden="true">→</span>
          </Link>
        </EntrySection>

        <Notes notes={t.prose.notes} className="mt-4 max-w-3xl" />
      </Container>
    </article>
  );
}
