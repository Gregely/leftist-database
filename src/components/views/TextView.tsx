import Link from "next/link";
import type { ReactNode } from "react";
import { Container, EmptyNote, EntityLinks, MetaList } from "@/components/editorial/primitives";
import { Notes } from "@/components/editorial/Notes";
import { Figure } from "@/components/editorial/Figure";
import { Prose } from "@/components/editorial/Prose";
import { EntryHeader } from "@/components/entity/EntryHeader";
import { EntrySection } from "@/components/entity/EntrySection";
import { Excerpts } from "@/components/entity/Excerpts";
import { RelationList } from "@/components/entity/RelationList";
import { SectionNav } from "@/components/entity/SectionNav";
import { PeriodStrip } from "@/components/timeline/PeriodStrip";
import { type TextAggregate } from "@/lib/data";
import { parseJsonArray } from "@/lib/util/json";

const DIFFICULTY = ["", "Accessible", "Demanding", "Specialist"];

function Card({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-ink pt-2.5">
      <p className="label text-faint">{label}</p>
      <div className="mt-1.5 font-serif text-[1.12rem] leading-snug">{children}</div>
    </div>
  );
}

/**
 * A text as a reading object. The title page and catalogue card answer what
 * it is, who wrote it, when, and where to read it; the period strip shows
 * where it falls; then why it matters, its context, the concepts it works
 * out, passages from it, and what answered it. Sources close the page.
 */
export function TextView({ t }: { t: TextAggregate }) {
  const { entity, details } = t;
  const aliases = parseJsonArray(t.aliases);
  const sections = [
    ...(t.body ? [{ id: "about", label: "About the text" }] : []),
    ...(details?.context ? [{ id: "context", label: "Context" }] : []),
    { id: "concepts", label: "Concepts" },
    { id: "passages", label: "Passages" },
    { id: "conversation", label: "In conversation" },
  ];
  const n = (id: string) => String(sections.findIndex((s) => s.id === id) + 1);
  const year = `${entity.yearStart ?? ""}${entity.yearEnd && entity.yearEnd !== entity.yearStart ? `–${entity.yearEnd}` : ""}`;

  return (
    <article>
      <EntryHeader
        entity={entity}
        title={<span className="italic">{entity.title}</span>}
        titleClassName="text-[2.9rem] sm:text-[4.6rem] xl:text-[5.6rem] !leading-[1]"
        meta={
          <p className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            {year && <span className="numeral text-[2rem] leading-none text-blue sm:text-[2.4rem]">{year}</span>}
            {t.authors.length > 0 && (
              <span className="font-serif text-[1.3rem]">
                <span className="italic text-muted">by </span>
                <EntityLinks items={t.authors} />
              </span>
            )}
          </p>
        }
        standfirst={entity.summary}
        aside={
          <>
            {t.media[0] && <Figure media={t.media[0]} size="portrait" className="mb-6 max-w-[13rem]" />}
            <MetaList
              items={[
                { label: "Original", value: details?.originalTitle && <span className="italic">{details.originalTitle}</span> },
                { label: "Edition", value: details?.edition },
                { label: "Also known", value: aliases.join(" · ") },
                {
                  label: "Reading",
                  value: details && (
                    <span>
                      <span aria-hidden="true" className="mr-2 tracking-[0.15em] text-red">
                        {"●".repeat(details.difficulty)}
                        <span className="text-rule">{"●".repeat(3 - details.difficulty)}</span>
                      </span>
                      {DIFFICULTY[details.difficulty]}
                    </span>
                  ),
                },
              ]}
            />
          </>
        }
        band={
          <div className="pb-10">
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
              <Card label="Form">
                <span className="capitalize">{details?.form || "Text"}</span>
                {details?.language && <span className="text-muted">, in {details.language}</span>}
              </Card>
              <Card label="Author">{t.authors.length ? <EntityLinks items={t.authors} /> : <span className="italic text-faint">Not recorded</span>}</Card>
              <Card label="Written">
                {year || "—"}
                {details?.publicationNote && <span className="mt-0.5 block text-[0.95rem] text-muted">{details.publicationNote}</span>}
              </Card>
              <Card label="Full text">
                {details?.readingUrl ? (
                  <a href={details.readingUrl} className="link-inline" target="_blank" rel="noopener noreferrer">
                    Open-access copy ↗
                  </a>
                ) : t.excerpts.length ? (
                  <a href="#passages" className="link-inline">
                    {t.excerpts.length} passage{t.excerpts.length > 1 ? "s" : ""} below
                  </a>
                ) : (
                  <span className="italic text-faint">No copy linked yet</span>
                )}
              </Card>
            </div>
            {entity.yearStart != null && (
              <div className="mt-10">
                <PeriodStrip
                  from={entity.yearStart}
                  to={entity.yearEnd}
                  label="Written"
                  marks={t.events.filter((e) => e.yearStart != null).map((e) => ({ year: e.yearStart!, title: e.title, href: e.href, kind: "event" }))}
                />
              </div>
            )}
          </div>
        }
      />

      <SectionNav sections={sections} title={entity.title} label="Sections of this text" />

      <Container>
        {t.body && (
          <EntrySection id="about" number={n("about")} label="About the text">
            <Prose text={t.body} context={t.prose.context} className="max-w-[40rem]" dropcap />
          </EntrySection>
        )}
        {details?.context && (
          <EntrySection id="context" number={n("context")} label="Context">
            <Prose text={details.context} context={t.prose.context} className="max-w-[40rem]" />
          </EntrySection>
        )}
        <EntrySection id="concepts" number={n("concepts")} label="Concepts discussed">
          {t.concepts.length ? (
            <ul className="grid gap-x-10 border-t border-ink sm:grid-cols-2">
              {t.concepts.map((c) => (
                <li key={c.id} className="border-b border-rule">
                  <Link href={c.href} className="group block py-4">
                    <span className="font-serif text-[1.45rem] leading-tight group-hover:text-red">{c.title}</span>
                    {c.note && <span className="rel ml-3">{c.note}</span>}
                    <span className="mt-1 block text-[0.92rem] text-muted">{c.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyNote>No concepts linked yet.</EmptyNote>
          )}
        </EntrySection>
        <EntrySection id="passages" number={n("passages")} label="Passages" tone="deep">
          <Excerpts items={t.excerpts} empty="No passages catalogued yet." />
        </EntrySection>
        <EntrySection id="conversation" number={n("conversation")} label="In conversation">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="label mb-3 text-faint">Responses &amp; critiques</p>
              <RelationList items={t.responses} showKind empty="No responses recorded yet." />
            </div>
            <div>
              <p className="label mb-3 text-faint">Influences &amp; events</p>
              <RelationList items={[...t.influences, ...t.events]} showKind empty="No connections recorded yet." />
            </div>
          </div>
        </EntrySection>
        <Notes notes={t.prose.notes} className="mt-4 max-w-3xl" />
      </Container>
    </article>
  );
}
