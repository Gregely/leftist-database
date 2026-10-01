import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapFigure } from "@/components/graph/MapFigure";
import { Container, EmptyNote, EntityLinks, MetaList } from "@/components/editorial/primitives";
import { Notes } from "@/components/editorial/Notes";
import { Prose } from "@/components/editorial/Prose";
import { EntryHeader } from "@/components/entity/EntryHeader";
import { EntrySection } from "@/components/entity/EntrySection";
import { Excerpts } from "@/components/entity/Excerpts";
import { RelationList } from "@/components/entity/RelationList";
import { SectionNav } from "@/components/entity/SectionNav";
import { getThinker } from "@/lib/data";
import { activePeriods } from "@/lib/periods";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getThinker((await params).slug);
  return t ? { title: t.entity.title, description: t.entity.summary } : {};
}

export default async function ThinkerPage({ params }: Props) {
  const t = await getThinker((await params).slug);
  if (!t) notFound();
  const { entity, details } = t;
  const periods = activePeriods(entity.yearStart, entity.yearEnd);

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "ideas", label: "Ideas" },
    { id: "works", label: "Works" },
    { id: "influences", label: "Influences" },
    { id: "disagreements", label: "Disagreements" },
    { id: "legacy", label: "Legacy" },
    { id: "timeline", label: "Timeline" },
  ];

  return (
    <article>
      <EntryHeader
        entity={entity}
        number={t.sortOrder / 5}
        meta={
          <p className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <span className="numeral text-3xl text-red">{entity.subtitle}</span>
            <span className="text-lg text-muted">{details.roles}</span>
          </p>
        }
        standfirst={entity.summary}
        aside={
          <MetaList
            items={[
              { label: "Tendency", value: <EntityLinks items={t.tendencies} /> },
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
              { label: "Related", value: <EntityLinks items={t.relatedThinkers.slice(0, 6)} /> },
              { label: "Key texts", value: <EntityLinks items={t.works.slice(0, 4)} /> },
            ]}
          />
        }
      />

      <SectionNav sections={sections} />

      <Container>
        <EntrySection id="overview" number="01" label="Overview">
          <div className="grid gap-10 xl:grid-cols-9">
            <div className="xl:col-span-6">
              <Prose text={t.body} context={t.prose.context} dropcap className="max-w-[40rem]" />
            </div>
            {t.excerpts.length > 0 && (
              <aside className="xl:col-span-3">
                <p className="label mb-3 text-faint">In their words</p>
                {t.excerpts
                  .filter((x) => x.body)
                  .map((x) => (
                    <figure key={x.id} className="border-t border-ink pt-3">
                      <blockquote className="font-serif text-xl leading-snug">“{x.body}”</blockquote>
                      <figcaption className="mt-2 text-xs text-muted">
                        {x.text && (
                          <Link href={x.text.href} className="link-inline italic">
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
        </EntrySection>

        <EntrySection id="ideas" number="02" label="Core ideas" title="The concepts this thinker developed or is associated with.">
          {t.ideas.length ? (
            <ol className="grid gap-x-10 sm:grid-cols-2">
              {t.ideas.map((c, i) => (
                <li key={c.id} className="border-t border-rule py-4">
                  <Link href={c.href} className="group grid grid-cols-[2.5rem_1fr] gap-2">
                    <span className="numeral text-2xl text-red">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="font-serif text-2xl leading-tight group-hover:text-red">{c.title}</span>
                      <span className="mt-1 block text-sm leading-snug text-muted">{c.note || c.summary}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyNote>No concepts linked yet.</EmptyNote>
          )}
          {t.network.nodes.length > 1 && (
            <div className="mt-14 border-t border-ink pt-6">
              <p className="label mb-1">Intellectual network</p>
              <p className="mb-4 text-sm text-muted">Thinkers one step away, and the relations among them.</p>
              <MapFigure
                graph={t.network}
                mode="radial"
                focusId={entity.id}
                size="medium"
                title={`Intellectual network of ${entity.title}`}
              />
            </div>
          )}
        </EntrySection>

        <EntrySection id="works" number="03" label="Major works">
          {t.works.length ? (
            <ol className="border-t border-rule">
              {t.works.map((w) => (
                <li key={w.id} className="border-b border-rule">
                  <Link href={w.href} className="group grid grid-cols-[4.5rem_1fr] gap-4 py-4 sm:grid-cols-[5rem_1fr_14rem]">
                    <span className="numeral text-2xl text-red">{w.yearStart}</span>
                    <span>
                      <span className="font-serif text-2xl italic leading-tight group-hover:text-red">{w.title}</span>
                      <span className="mt-1 block text-sm text-muted sm:hidden">{w.summary}</span>
                    </span>
                    <span className="hidden text-sm leading-snug text-muted sm:block">{w.summary}</span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyNote>No works catalogued yet.</EmptyNote>
          )}
        </EntrySection>

        <EntrySection id="influences" number="04" label="Influences">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="label mb-3 text-faint">← Drew on</p>
              <RelationList items={[...t.influencedBy, ...t.collaborators]} empty="No recorded influences yet." />
            </div>
            <div>
              <p className="label mb-3 text-faint">Went on to shape →</p>
              <RelationList items={t.influenced} empty="No recorded successors yet." />
            </div>
          </div>
        </EntrySection>

        <EntrySection id="disagreements" number="05" label="Disagreements" title="Who they argued with — and where the arguments are staged.">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="label mb-3 text-faint">Critiques &amp; responses</p>
              <RelationList items={t.disagreements} showKind empty="No recorded disagreements yet." />
            </div>
            <div>
              <p className="label mb-3 text-faint">Positions in debates</p>
              {t.debates.length ? (
                <ul className="border-t border-rule">
                  {t.debates.map((d) => (
                    <li key={d.href} className="border-b border-rule">
                      <Link href={d.href} className="group block py-3">
                        <span className="font-serif text-xl group-hover:text-red">
                          {d.debate.title.replace(/\?$/, "")}
                          <span className="text-red">?</span>
                        </span>
                        <span className="mt-1 block text-sm leading-snug text-muted">{d.centralClaim}</span>
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

        <EntrySection id="legacy" number="06" label="Legacy">
          {details.legacy ? (
            <Prose text={details.legacy} context={t.prose.context} className="max-w-[40rem]" />
          ) : (
            <EmptyNote>Legacy not yet written.</EmptyNote>
          )}
        </EntrySection>

        <EntrySection id="timeline" number="07" label="Timeline">
          <ol className="relative ml-2 border-l border-ink">
            {t.timeline.map((ev, i) => (
              <li key={i} className="relative grid grid-cols-[5rem_1fr] gap-4 py-3 pl-6">
                <span
                  aria-hidden="true"
                  className={`absolute -left-[5px] top-[1.15rem] h-[9px] w-[9px] rotate-45 border ${ev.kind === "life" ? "border-ink bg-ink" : ev.kind === "event" ? "border-red bg-red" : "border-ink bg-paper"}`}
                />
                <span className="numeral text-xl text-red">{ev.year}</span>
                <span>
                  {ev.href ? (
                    <Link href={ev.href} className={`link-inline font-serif text-lg ${ev.kind === "text" ? "italic" : ""}`}>
                      {ev.title}
                    </Link>
                  ) : (
                    <span className="font-serif text-lg">{ev.title}</span>
                  )}
                  <span className="label ml-3 text-faint">{ev.kind === "text" ? "Work" : ev.kind === "event" ? "Event" : "Life"}</span>
                </span>
              </li>
            ))}
          </ol>
          <Link href={`/timeline?focus=${entity.yearStart}&item=${entity.slug}`} className="label mt-6 inline-block text-red">
            See this life on the full timeline →
          </Link>
        </EntrySection>

        <Notes notes={t.prose.notes} className="mt-4 max-w-3xl" />
      </Container>
    </article>
  );
}
