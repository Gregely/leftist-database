import Link from "next/link";
import { Container, EmptyNote, lifespan, MetaList } from "@/components/editorial/primitives";
import { Notes } from "@/components/editorial/Notes";
import { Prose } from "@/components/editorial/Prose";
import { MapFigure } from "@/components/graph/MapFigure";
import { EntryHeader } from "@/components/entity/EntryHeader";
import { EntrySection } from "@/components/entity/EntrySection";
import { EntryGrid, RelationList } from "@/components/entity/RelationList";
import { type TendencyAggregate } from "@/lib/data";
import { TENDENCY_COLOR_VALUES, type TendencyColor } from "@/lib/content/model";


export function TendencyView({ t }: { t: TendencyAggregate }) {
  const { entity, details } = t;
  const color = TENDENCY_COLOR_VALUES[details.color as TendencyColor] ?? "#202020";
  return (
    <article>
      <div aria-hidden="true" className="h-1.5" style={{ background: color }} />
      <EntryHeader
        entity={entity}
        meta={<p className="numeral text-3xl text-red">{details.periodLabel}</p>}
        standfirst={entity.summary}
        aside={
          <MetaList
            items={[
              { label: "Period", value: details.periodLabel },
              { label: "Members", value: `${t.members.length} in the Atlas` },
              { label: "Texts", value: `${t.texts.length} by members` },
              {
                label: "Timeline",
                value: entity.yearStart && (
                  <Link className="link-inline" href={`/timeline?from=${entity.yearStart}&to=${entity.yearEnd ?? 2026}`}>
                    View period
                  </Link>
                ),
              },
            ]}
          />
        }
      />
      <Container>
        {t.body && (
          <EntrySection id="overview" number="01" label="Overview">
            <Prose text={t.body} context={t.prose.context} className="max-w-[40rem]" />
          </EntrySection>
        )}
        {details.context && (
          <EntrySection id="context" number="01·" label="Historical context">
            <Prose text={details.context} context={t.prose.context} className="max-w-[40rem]" />
          </EntrySection>
        )}
        <EntrySection id="members" number="02" label="Thinkers">
          {t.members.length ? (
            <ul className="grid gap-x-8 border-t border-rule sm:grid-cols-2 lg:grid-cols-3">
              {t.members.map((m) => (
                <li key={m.id} className="border-b border-rule">
                  <Link href={m.href} className="group block py-4">
                    <span className="font-serif text-2xl group-hover:text-red">{m.title}</span>
                    <span className="label-mono ml-2 text-faint">{lifespan(m.yearStart, m.yearEnd, "thinker")}</span>
                    <span className="mt-1 block text-sm leading-snug text-muted">{m.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyNote>No thinkers assigned to this tendency yet.</EmptyNote>
          )}
          {t.network.nodes.length > 2 && (
            <div className="mt-12 border-t border-ink pt-6">
              <p className="label mb-4">Lineage &amp; membership</p>
              <MapFigure graph={t.network} mode="radial" focusId={entity.id} size="medium" title={`${entity.title}: members and related tendencies`} />
            </div>
          )}
        </EntrySection>
        <EntrySection id="lineage" number="03" label="Lineage">
          <RelationList items={t.lineage} empty="No lineage recorded yet." />
        </EntrySection>
        <EntrySection id="texts" number="04" label="Texts">
          {t.texts.length ? <EntryGrid items={t.texts} /> : <EmptyNote>No texts yet.</EmptyNote>}
        </EntrySection>
        {t.events.length > 0 && (
          <EntrySection id="events" number="05" label="Events">
            <RelationList items={t.events} />
          </EntrySection>
        )}
        {(details.criticisms || details.legacy) && (
          <EntrySection id="assessment" number="06" label="Criticisms & legacy">
            <div className="grid gap-10 md:grid-cols-2">
              {details.criticisms && (
                <div>
                  <p className="label mb-3 text-faint">Criticisms</p>
                  <Prose text={details.criticisms} context={t.prose.context} />
                </div>
              )}
              {details.legacy && (
                <div>
                  <p className="label mb-3 text-faint">Legacy</p>
                  <Prose text={details.legacy} context={t.prose.context} />
                </div>
              )}
            </div>
          </EntrySection>
        )}
        <Notes notes={t.prose.notes} className="mt-4 max-w-3xl" />
      </Container>
    </article>
  );
}
