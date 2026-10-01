import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, MetaList } from "@/components/editorial/primitives";
import { Notes } from "@/components/editorial/Notes";
import { Prose } from "@/components/editorial/Prose";
import { EntryHeader } from "@/components/entity/EntryHeader";
import { RelationList } from "@/components/entity/RelationList";
import { getEvent } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = await getEvent((await params).slug);
  return e ? { title: e.entity.title, description: e.entity.summary } : {};
}

export default async function EventPage({ params }: Props) {
  const e = await getEvent((await params).slug);
  if (!e) notFound();
  const { entity, details } = e;
  return (
    <article>
      <EntryHeader
        entity={entity}
        titleClassName="text-[2.8rem] sm:text-[4.6rem]"
        meta={<p className="numeral text-4xl text-red">{details?.dateLabel ?? entity.yearStart}</p>}
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
            <Prose text={e.body} context={e.prose.context} className="max-w-[40rem]" />
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
                  <span className="numeral ml-3 text-red">{x!.ev.yearStart}</span>
                  <span className="mt-1 block font-serif text-xl group-hover:text-red">{x!.ev.title}</span>
                </Link>
              ))}
          </nav>
        </div>
        <Notes notes={e.prose.notes} className="mt-12 max-w-3xl" />
      </Container>
    </article>
  );
}
