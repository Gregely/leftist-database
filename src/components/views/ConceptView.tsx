import Link from "next/link";
import { DepthReader } from "@/components/concept/DepthReader";
import { Container, EmptyNote, lifespan, MetaList, entityLinks, Question } from "@/components/editorial/primitives";
import { Notes } from "@/components/editorial/Notes";
import { Prose } from "@/components/editorial/Prose";
import { MapFigure } from "@/components/graph/MapFigure";
import { EntryHeader } from "@/components/entity/EntryHeader";
import { EntrySection } from "@/components/entity/EntrySection";
import { Excerpts } from "@/components/entity/Excerpts";
import { RelationList } from "@/components/entity/RelationList";
import { SectionNav } from "@/components/entity/SectionNav";
import { type ConceptAggregate } from "@/lib/data";
import { parseJsonArray } from "@/lib/util/json";

/**
 * A concept, read as one descent: thirty seconds, five minutes, the deep
 * dive, then how it developed, who worked it out, where it is argued over,
 * the primary texts, and its neighbourhood. One page, so a reader can stop
 * at any depth without having entered a different part of the site.
 */
export function ConceptView({ c, depth }: { c: ConceptAggregate; depth?: string }) {
  const { entity, details } = c;
  const aliases = parseJsonArray(c.aliases);
  const initial = depth === "standard" || depth === "deep" ? depth : "brief";

  const sections = [
    { id: "descent", label: "Explanation" },
    ...(details.history ? [{ id: "development", label: "Development" }] : []),
    { id: "thinkers", label: "Thinkers" },
    { id: "interpretations", label: "Debates" },
    { id: "primary-texts", label: "Primary texts" },
    { id: "related", label: "Related concepts" },
  ];
  const n = (id: string) => String(sections.findIndex((s) => s.id === id) + 1);
  const developers = c.thinkers.filter((t) => t.type === "DEVELOPED");

  return (
    <article>
      <EntryHeader
        entity={entity}
        titleClassName="text-[3.2rem] sm:text-[5.4rem] xl:text-[7rem]"
        meta={
          aliases.length > 0 && (
            <p className="text-muted">
              <span className="label mr-2 text-faint">Also</span>
              <span className="serif-italic text-[1.2rem]">{aliases.join(" · ")}</span>
            </p>
          )
        }
        standfirst={entity.summary}
        aside={
          <MetaList
            items={[
              {
                label: "First theorised",
                value: entity.yearStart ? (
                  <Link className="link-inline" href={`/timeline?focus=${entity.yearStart}`}>
                    c. {entity.yearStart}
                  </Link>
                ) : null,
              },
              { label: "Developed by", value: entityLinks(developers.slice(0, 4)) },
              { label: "Key texts", value: entityLinks(c.texts.slice(0, 3)) },
              { label: "Debates", value: entityLinks(c.debates) },
              { label: "On paths", value: c.paths.length ? `${c.paths.length} learning path${c.paths.length > 1 ? "s" : ""}` : null },
            ]}
          />
        }
      />

      <SectionNav sections={sections} label="Descend into the concept" title={entity.title} />

      <Container>
        <EntrySection
          id="descent"
          number={n("descent")}
          label="Explanation"
          aside={
            <div className="border-l border-red pl-3">
              <p className="label text-faint">Further down</p>
              <ol className="mt-2 space-y-1 font-serif text-[1rem]">
                {sections.slice(1).map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="link-inline">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          }
        >
          <p className="mb-6 max-w-[40rem] font-serif text-[1.15rem] italic text-muted">
            Start with thirty seconds, and go deeper only as far as you want. Each level adds to the one above it.
          </p>
          <DepthReader
            initial={initial}
            levels={[
              { key: "brief", label: "30 seconds", duration: "The idea in a paragraph", available: !!details.brief, content: <Prose text={details.brief} context={c.prose.context} className="!text-[1.5rem] !leading-[1.4]" /> },
              { key: "standard", label: "5 minutes", duration: "A fuller explanation", available: !!details.standard, content: <Prose text={details.standard} context={c.prose.context} /> },
              { key: "deep", label: "Deep dive", duration: "Theory and interpretation", available: !!details.deep, content: <Prose text={details.deep} context={c.prose.context} /> },
            ]}
          />
        </EntrySection>

        {details.history && (
          <EntrySection id="development" number={n("development")} label="Historical development">
            <Prose text={details.history} context={c.prose.context} className="max-w-[42rem]" />
          </EntrySection>
        )}

        <EntrySection id="thinkers" number={n("thinkers")} label="Thinkers" title="Who worked the idea out, and who took it further.">
          {c.thinkers.length ? (
            <ul className="grid gap-x-10 border-t border-ink sm:grid-cols-2 lg:grid-cols-3">
              {c.thinkers.map((t) => (
                <li key={t.relationshipId} className="border-b border-rule">
                  <Link href={t.href} className="group block py-4">
                    <span className="rel block">{t.label}</span>
                    <span className="font-serif text-[1.4rem] leading-tight group-hover:text-red">{t.title}</span>
                    <span className="label-mono ml-2 text-faint">{lifespan(t.yearStart, t.yearEnd, "thinker")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyNote>No thinkers linked yet.</EmptyNote>
          )}
        </EntrySection>

        <EntrySection id="interpretations" number={n("interpretations")} label="Debates" title="Where it is read differently.">
          {(details.interpretations || details.criticisms) && (
            <div className="mb-12 grid gap-10 md:grid-cols-2">
              {details.interpretations && (
                <div>
                  <p className="label mb-3 border-t border-ink pt-2 text-faint">Interpretations</p>
                  <Prose text={details.interpretations} context={c.prose.context} className="!text-[1.08rem]" />
                </div>
              )}
              {details.criticisms && (
                <div>
                  <p className="label mb-3 border-t border-red pt-2 text-red">Criticisms</p>
                  <Prose text={details.criticisms} context={c.prose.context} className="!text-[1.08rem]" />
                </div>
              )}
            </div>
          )}
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="label mb-3 text-faint">Staged in debates</p>
              {c.debates.length ? (
                <ul className="border-t border-ink">
                  {c.debates.map((d) => (
                    <li key={d.id} className="border-b border-rule">
                      <Link href={d.href} className="group block py-4">
                        <span className="display text-[2rem] group-hover:text-red">
                          <Question title={d.title} />
                        </span>
                        <span className="mt-1 block text-[0.92rem] text-muted">{d.summary}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyNote>Not yet the subject of a debate entry.</EmptyNote>
              )}
            </div>
            <div>
              <p className="label mb-3 text-faint">Interpretations &amp; critiques</p>
              <RelationList items={c.interpretations} empty="No recorded interpretations yet." />
            </div>
          </div>
        </EntrySection>

        <EntrySection id="primary-texts" number={n("primary-texts")} label="Primary texts" title="Where the concept is worked out.">
          <Excerpts items={c.excerpts} />
          {c.texts.length > 0 && (
            <div className={c.excerpts.length ? "mt-12" : ""}>
              <p className="label mb-3 text-faint">Discussed in</p>
              <RelationList items={c.texts} showLabel={false} />
            </div>
          )}
          {!c.excerpts.length && !c.texts.length && <EmptyNote>No primary texts linked yet.</EmptyNote>}
        </EntrySection>

        <EntrySection id="related" number={n("related")} label="Related concepts" title="The concept's neighbourhood.">
          {c.constellation.nodes.length > 1 && (
            <div className="mb-10">
              <MapFigure
                graph={c.constellation}
                mode="radial"
                focusId={entity.id}
                size="medium"
                showLegend={false}
                plate="Constellation"
                heading={`Concepts around ${entity.title}`}
                title={`Concepts related to ${entity.title}`}
              />
            </div>
          )}
          <RelationList items={c.related} empty="No related concepts yet." />
        </EntrySection>

        <Notes notes={c.prose.notes} className="mt-4 max-w-3xl" />
      </Container>
    </article>
  );
}
