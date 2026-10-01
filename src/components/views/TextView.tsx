import Link from "next/link";
import { Container, EmptyNote, EntityLinks, MetaList } from "@/components/editorial/primitives";
import { Notes } from "@/components/editorial/Notes";
import { Figure } from "@/components/editorial/Figure";
import { Prose } from "@/components/editorial/Prose";
import { EntryHeader } from "@/components/entity/EntryHeader";
import { EntrySection } from "@/components/entity/EntrySection";
import { Excerpts } from "@/components/entity/Excerpts";
import { RelationList } from "@/components/entity/RelationList";
import { type TextAggregate } from "@/lib/data";
import { parseJsonArray } from "@/lib/util/json";
const DIFFICULTY = ["", "Accessible", "Demanding", "Specialist"];

export function TextView({ t }: { t: TextAggregate }) {
  const { entity, details } = t;
  const aliases = parseJsonArray(t.aliases);
  return (
    <article>
      <EntryHeader
        entity={entity}
        title={<span className="italic">{entity.title}</span>}
        titleClassName="text-[2.8rem] sm:text-[4.6rem] xl:text-[5.4rem]"
        meta={
          <p className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <span className="numeral text-3xl text-red">
              {entity.yearStart}
              {entity.yearEnd ? `–${entity.yearEnd}` : ""}
            </span>
            {t.authors.length > 0 && (
              <span className="text-lg">
                <span className="text-muted">by </span>
                <EntityLinks items={t.authors} />
              </span>
            )}
          </p>
        }
        standfirst={entity.summary}
        aside={
          <>
          {t.media[0] && <Figure media={t.media[0]} size="portrait" className="mb-6 max-w-[14rem]" />}
          <MetaList
            items={[
              { label: "Original", value: details?.originalTitle && <span className="italic">{details.originalTitle}</span> },
              { label: "Edition", value: details?.edition },
              { label: "Language", value: details?.language },
              { label: "Form", value: details?.form && <span className="capitalize">{details.form}</span> },
              { label: "Publication", value: details?.publicationNote },
              { label: "Reading", value: details && `${"●".repeat(details.difficulty)} ${DIFFICULTY[details.difficulty]}` },
              { label: "Also known", value: aliases.join(" · ") },
              {
                label: "Read it",
                value: details?.readingUrl && (
                  <a href={details.readingUrl} className="link-inline" target="_blank" rel="noopener noreferrer">
                    Open-access copy ↗
                  </a>
                ),
              },
            ]}
          />
          </>
        }
      />
      <Container>
        {t.body && (
          <EntrySection id="about" number="01" label="About the text">
            <Prose text={t.body} context={t.prose.context} className="max-w-[40rem]" />
          </EntrySection>
        )}
        {details?.context && (
          <EntrySection id="context" number="01·" label="Context">
            <Prose text={details.context} context={t.prose.context} className="max-w-[40rem]" />
          </EntrySection>
        )}
        <EntrySection id="concepts" number={t.body ? "02" : "01"} label="Concepts discussed">
          {t.concepts.length ? (
            <ul className="grid gap-x-10 border-t border-rule sm:grid-cols-2">
              {t.concepts.map((c) => (
                <li key={c.id} className="border-b border-rule">
                  <Link href={c.href} className="group block py-4">
                    <span className="font-serif text-2xl group-hover:text-red">{c.title}</span>
                    {c.note && <span className="ml-3 text-sm text-muted">{c.note}</span>}
                    <span className="mt-1 block text-sm text-muted">{c.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyNote>No concepts linked yet.</EmptyNote>
          )}
        </EntrySection>
        <EntrySection id="passages" number={t.body ? "03" : "02"} label="Passages">
          <Excerpts items={t.excerpts} empty="No passages from this text have been catalogued yet." />
        </EntrySection>
        <EntrySection id="conversation" number={t.body ? "04" : "03"} label="In conversation">
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
