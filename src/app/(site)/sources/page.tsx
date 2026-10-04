import type { Metadata } from "next";
import Link from "next/link";
import { IndexHeader } from "@/components/editorial/IndexHeader";
import { Container } from "@/components/editorial/primitives";
import { listSources } from "@/lib/data";
import { SOURCE_TYPE_LABELS, SOURCE_TYPES, type SourceType } from "@/lib/content/model";

export const metadata: Metadata = { title: "Sources", description: "The bibliography behind the Atlas." };

type Props = { searchParams: Promise<{ type?: string }> };

export default async function SourcesIndex({ searchParams }: Props) {
  const { type } = await searchParams;
  const active = SOURCE_TYPES.includes(type as SourceType) ? (type as SourceType) : undefined;
  const sources = await listSources({ type: active });
  const groups = SOURCE_TYPES.map((t) => ({ type: t, items: sources.filter((s) => s.sourceType === t) })).filter((g) => g.items.length);
  return (
    <>
      <IndexHeader
        crumb="Sources"
        title={
          <>
            Sources<span className="text-red">.</span>
          </>
        }
        count={sources.length}
      />
      <Container>
        <div className="flex flex-wrap gap-x-5 gap-y-2 border-y border-ink py-3">
          <Link href="/sources" className={`label ${!active ? "text-red" : "hover:text-red"}`}>
            All
          </Link>
          {SOURCE_TYPES.map((t) => (
            <Link key={t} href={`/sources?type=${t}`} className={`label ${active === t ? "text-red" : "text-muted hover:text-red"}`}>
              {SOURCE_TYPE_LABELS[t]}
            </Link>
          ))}
        </div>
        {groups.map((g) => (
          <section key={g.type} className="grid gap-4 border-b border-rule py-8 md:grid-cols-[14rem_1fr]">
            <h2 className="label font-sans text-red">{SOURCE_TYPE_LABELS[g.type]}</h2>
            <ol className="space-y-4">
              {g.items.map((s) => (
                <li key={s.id} className="grid gap-1 sm:grid-cols-[1fr_6rem]">
                  <p className="leading-snug">
                    <span>{s.author}. </span>
                    <Link href={`/sources/${s.id}`} className="link-inline font-serif text-lg italic">
                      {s.title}
                    </Link>
                    {s.publisher && <span className="text-muted">. {s.publisher}</span>}
                    {s.publicationDate && <span className="text-muted">, {s.publicationDate}</span>}.
                  </p>
                  <p className="label-mono text-faint sm:text-right">{s.cited ? `cited ×${s.cited}` : "uncited"}</p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </Container>
    </>
  );
}
