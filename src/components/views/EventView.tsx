import Link from "next/link";
import { Container, MetaList } from "@/components/editorial/primitives";
import { Notes } from "@/components/editorial/Notes";
import { Figure } from "@/components/editorial/Figure";
import { Prose } from "@/components/editorial/Prose";
import { EntryHeader } from "@/components/entity/EntryHeader";
import { RelationList } from "@/components/entity/RelationList";
import { PeriodStrip } from "@/components/timeline/PeriodStrip";
import { type EventAggregate } from "@/lib/data";


export function EventView({ e }: { e: EventAggregate }) {
  const { entity, details } = e;
  return (
    <article>
      <EntryHeader
        entity={entity}
        titleClassName="text-[2.8rem] sm:text-[4.6rem] xl:text-[5.4rem]"
        meta={<p className="numeral text-[2rem] leading-none text-umber sm:text-[2.6rem]">{details?.dateLabel ?? entity.yearStart}</p>}
        band={
          entity.yearStart != null && (
            <div className="pb-10">
              <PeriodStrip
                from={entity.yearStart}
                to={entity.yearEnd}
                label="Event"
                marks={[e.prev, e.next].filter((x): x is NonNullable<typeof x> => !!x && x.yearStart != null).map((x) => ({ year: x.yearStart!, title: x.title, href: x.href, kind: "event" }))}
              />
            </div>
          )
        }
        standfirst={entity.summary}
        aside={
          <MetaList
            items={[
              { label: "Date", value: details?.dateLabel },
              { label: "Place", value: details?.place },
              { label: "Type", value: details?.eventType && <span className="capitalize">{details.eventType}</span> },
              {
                label: "Timeline",
                value: (
                  <Link className="link-inline" href={`/timeline?focus=${entity.yearStart}&item=${entity.slug}`}>
                    See in context
                  </Link>
                ),
              },
            ]}
          />
        }
      />
      <Container>
        <div className="grid gap-10 border-t border-ink pt-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {entity.subtitle && <p className="label mb-4 text-faint">{entity.subtitle}</p>}
            {e.media[0] && <Figure media={e.media[0]} className="mb-8 max-w-[40rem]" />}
            <Prose text={e.body} context={e.prose.context} className="max-w-[40rem]" />
            {details?.significance && (
              <>
                <p className="label mb-3 mt-10 text-faint">Historical significance</p>
                <Prose text={details.significance} context={e.prose.context} className="max-w-[40rem]" />
              </>
            )}
            <p className="label mb-3 mt-8 text-faint">Connections</p>
            <RelationList items={e.relations} showKind empty="No connections recorded yet." />
          </div>
          <nav aria-label="Adjacent events" className="lg:col-span-4 lg:col-start-9">
            <p className="label mb-3 text-faint">Before &amp; after</p>
            {[e.prev && { dir: "← Before", ev: e.prev }, e.next && { dir: "After →", ev: e.next }]
              .filter(Boolean)
              .map((x) => (
                <Link key={x!.ev.id} href={x!.ev.href} className="group block border-t border-rule py-4">
                  <span className="label text-faint">{x!.dir}</span>
                  <span className="numeral ml-3 text-umber">{x!.ev.yearStart}</span>
                  <span className="mt-1 block font-serif text-[1.3rem] group-hover:text-red">{x!.ev.title}</span>
                </Link>
              ))}
          </nav>
        </div>
        <Notes notes={e.prose.notes} className="mt-12 max-w-3xl" />
      </Container>
    </article>
  );
}
