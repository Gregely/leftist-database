import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DepthReader } from "@/components/concept/DepthReader";
import { Container, EmptyNote, lifespan, MetaList, EntityLinks } from "@/components/editorial/primitives";
import { Notes } from "@/components/editorial/Notes";
import { Prose } from "@/components/editorial/Prose";
import { MapFigure } from "@/components/graph/MapFigure";
import { EntryHeader } from "@/components/entity/EntryHeader";
import { EntrySection } from "@/components/entity/EntrySection";
import { Excerpts } from "@/components/entity/Excerpts";
import { RelationList } from "@/components/entity/RelationList";
import { SectionNav } from "@/components/entity/SectionNav";
import { getConcept } from "@/lib/data";
import { parseJsonArray } from "@/lib/util/json";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ depth?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getConcept((await params).slug);
  return c ? { title: c.entity.title, description: c.entity.summary } : {};
}

export default async function ConceptPage({ params, searchParams }: Props) {
  const [{ slug }, { depth }] = await Promise.all([params, searchParams]);
  const c = await getConcept(slug);
  if (!c) notFound();
  const { entity, details } = c;
  const aliases = parseJsonArray(c.aliases);
  const initial = depth === "standard" || depth === "deep" ? depth : "brief";

  const sections = [
    { id: "descent", label: "Explanation" },
    { id: "primary-texts", label: "Primary texts" },
    { id: "interpretations", label: "Debates" },
    { id: "related", label: "Related concepts" },
    { id: "thinkers", label: "Thinkers" },
  ];

  return (
    <article>
      <EntryHeader
        entity={entity}
        title={<span className="uppercase tracking-[-0.01em]">{entity.title}</span>}
        titleClassName="text-[3rem] sm:text-[5.6rem] xl:text-[7.4rem]"
        meta={
          aliases.length > 0 && (
            <p className="text-muted">
              <span className="label mr-2 text-faint">Also</span>
              <span className="serif-italic text-lg">{aliases.join(" · ")}</span>
            </p>
          )
        }
        standfirst={entity.summary}
        aside={
          <MetaList
            items={[
              { label: "First theorised", value: entity.yearStart ? <Link className="link-inline" href={`/timeline?focus=${entity.yearStart}`}>c. {entity.yearStart}</Link> : null },
              { label: "Thinkers", value: <EntityLinks items={c.thinkers.filter((t) => t.type === "DEVELOPED").slice(0, 4)} /> },
              { label: "Key texts", value: <EntityLinks items={c.texts.slice(0, 3)} /> },
              { label: "Debates", value: <EntityLinks items={c.debates} /> },
              { label: "On paths", value: c.paths.length ? `${c.paths.length} learning path${c.paths.length > 1 ? "s" : ""}` : null },
            ]}
          />
        }
      />

      <SectionNav sections={sections} label="Descend into the concept" />

      <Container>
        <EntrySection id="descent" number="01" label="Explanation" title="Read it in thirty seconds — or keep going down.">
          <DepthReader
            initial={initial}
            levels={[
              { key: "brief", label: "30 seconds", duration: "~ 80 words", available: !!details.brief, content: <Prose text={details.brief} context={c.prose.context} className="font-serif !text-[1.45rem] !leading-snug" /> },
              { key: "standard", label: "5 minutes", duration: "~ 400 words", available: !!details.standard, content: <Prose text={details.standard} context={c.prose.context} /> },
              { key: "deep", label: "Deep dive", duration: "Theory & interpretation", available: !!details.deep, content: <Prose text={details.deep} context={c.prose.context} /> },
            ]}
          />
        </EntrySection>

        <EntrySection id="primary-texts" number="02" label="Primary texts" title="Where the concept is worked out.">
          <Excerpts items={c.excerpts} />
          {c.texts.length > 0 && (
            <div className={c.excerpts.length ? "mt-12" : ""}>
              <p className="label mb-3 text-faint">Discussed in</p>
              <RelationList items={c.texts} showLabel={false} />
            </div>
          )}
          {!c.excerpts.length && !c.texts.length && <EmptyNote>No primary texts linked yet.</EmptyNote>}
        </EntrySection>

        <EntrySection id="interpretations" number="03" label="Debates" title="Who reads it differently.">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="label mb-3 text-faint">Interpretations &amp; critiques</p>
              <RelationList items={c.interpretations} empty="No recorded interpretations yet." />
            </div>
            <div>
              <p className="label mb-3 text-faint">Staged in debates</p>
              {c.debates.length ? (
                <ul className="border-t border-rule">
                  {c.debates.map((d) => (
                    <li key={d.id} className="border-b border-rule">
                      <Link href={d.href} className="group block py-4">
                        <span className="display text-3xl group-hover:text-red">
                          {d.title.replace(/\?$/, "")}
                          <span className="text-red">?</span>
                        </span>
                        <span className="mt-1 block text-sm text-muted">{d.summary}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyNote>Not yet the subject of a debate entry.</EmptyNote>
              )}
            </div>
          </div>
        </EntrySection>

        <EntrySection id="related" number="04" label="Related concepts" title="The concept's neighbourhood.">
          {c.constellation.nodes.length > 1 && (
            <div className="mb-10 border border-rule bg-paper-warm p-3 sm:p-6">
              <MapFigure
                graph={c.constellation}
                mode="radial"
                focusId={entity.id}
                size="medium"
                showLegend={false}
                title={`Concepts related to ${entity.title}`}
              />
            </div>
          )}
          <RelationList items={c.related} empty="No related concepts yet." />
        </EntrySection>

        <EntrySection id="thinkers" number="05" label="Thinkers">
          {c.thinkers.length ? (
            <ul className="grid gap-x-8 border-t border-rule sm:grid-cols-2 lg:grid-cols-3">
              {c.thinkers.map((t) => (
                <li key={t.relationshipId} className="border-b border-rule">
                  <Link href={t.href} className="group block py-4">
                    <span className="label block text-faint">{t.label}</span>
                    <span className="font-serif text-2xl group-hover:text-red">{t.title}</span>
                    <span className="label-mono ml-2 text-faint">{lifespan(t.yearStart, t.yearEnd, "thinker")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyNote>No thinkers linked yet.</EmptyNote>
          )}
        </EntrySection>

        <Notes notes={c.prose.notes} className="mt-4 max-w-3xl" />
      </Container>
    </article>
  );
}
