import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, EmptyNote, Label, MetaList } from "@/components/editorial/primitives";
import { getSource } from "@/lib/data";
import { KINDS, SOURCE_TYPE_LABELS } from "@/lib/content/model";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await getSource((await params).id);
  return s ? { title: s.source.title } : {};
}

export default async function SourcePage({ params }: Props) {
  const data = await getSource((await params).id);
  if (!data) notFound();
  const { source, citedBy, excerpts } = data;
  return (
    <Container className="pt-6 sm:pt-8">
      <div className="border-b border-rule pb-2">
        <Label className="text-muted">
          <Link href="/sources" className="hover:text-red">
            Sources
          </Link>{" "}
          <span className="text-red">/</span> {SOURCE_TYPE_LABELS[source.sourceType]}
        </Label>
      </div>
      <div className="grid gap-10 py-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="label slash text-red">Source</p>
          <h1 className="display mt-4 text-[2.6rem] italic sm:text-[3.8rem]">{source.title}</h1>
          <p className="lede mt-4">{source.author}</p>
          {source.notes && <p className="mt-6 border-l-2 border-red pl-4 text-sm text-muted">{source.notes}</p>}
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <MetaList
            items={[
              { label: "Type", value: SOURCE_TYPE_LABELS[source.sourceType] },
              { label: "Published", value: source.publicationDate },
              { label: "Publisher", value: source.publisher },
              { label: "Locator", value: source.locator },
              {
                label: "Online",
                value: source.url && (
                  <a href={source.url} className="link-inline break-all" target="_blank" rel="noopener noreferrer">
                    {source.url.replace(/^https?:\/\//, "")}
                  </a>
                ),
              },
            ]}
          />
        </div>
      </div>
      <section className="border-t border-ink py-10">
        <h2 className="label mb-4 font-sans">Cited by</h2>
        {citedBy.length ? (
          <ul className="border-t border-rule">
            {citedBy.map((c, i) => (
              <li key={i} className="flex flex-wrap items-baseline justify-between gap-3 border-b border-rule py-3">
                <span>
                  <span className="label mr-3 text-faint">{KINDS[c.entity.kind].label}</span>
                  <Link href={c.entity.href} className="link-inline font-serif text-xl">
                    {c.entity.title}
                  </Link>
                </span>
                <span className="text-sm text-muted">
                  {c.field && <span className="label mr-2 text-faint">{c.field}</span>}
                  {c.locator}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyNote>No entries cite this source yet.</EmptyNote>
        )}
        {excerpts.length > 0 && (
          <>
            <h2 className="label mb-4 mt-10 font-sans">Quoted in</h2>
            <ul className="space-y-4">
              {excerpts.map((x, i) => (
                <li key={i} className="border-l-2 border-red pl-4">
                  {x.body && <p className="font-serif text-lg">“{x.body}”</p>}
                  <p className="text-sm text-muted">
                    {x.locator} — on{" "}
                    <Link href={x.entity.href} className="link-inline">
                      {x.entity.title}
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </Container>
  );
}
