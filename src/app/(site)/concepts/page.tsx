import type { Metadata } from "next";
import Link from "next/link";
import { IndexHeader } from "@/components/editorial/IndexHeader";
import { Pager, pageParam } from "@/components/editorial/Pager";
import { Container } from "@/components/editorial/primitives";
import { getConceptBriefs, lettersFor, listEntities } from "@/lib/data";
import { KINDS } from "@/lib/content/model";

export const metadata: Metadata = { title: "Concepts", description: KINDS.concept.blurb };
const PER_PAGE = 120;

type Props = { searchParams: Promise<{ letter?: string; page?: string }> };

export default async function ConceptsIndex({ searchParams }: Props) {
  const sp = await searchParams;
  const letter = sp.letter && /^[A-Za-z]$/.test(sp.letter) ? sp.letter.toUpperCase() : undefined;
  const page = pageParam(sp.page);
  const [list, letters] = await Promise.all([
    listEntities({ kind: "concept", order: "title", letter, limit: PER_PAGE, offset: (page - 1) * PER_PAGE }),
    lettersFor("concept"),
  ]);
  const briefs = await getConceptBriefs(list.items.map((c) => c.id));
  const groups = new Map<string, typeof list.items>();
  for (const c of list.items) {
    const l = c.title[0].toUpperCase();
    groups.set(l, [...(groups.get(l) ?? []), c]);
  }
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <>
      <IndexHeader
        crumb="Concepts"
        tally={`${list.total} concepts`}
        title={
          <>
            A glossary of the left<span className="text-red">.</span>
          </>
        }
        lede="Every concept opens in three depths — thirty seconds, five minutes, and a deep dive into how it has been argued over."
      />
      <Container>
        <nav aria-label="Alphabetical index" className="sticky top-14 z-20 -mx-4 overflow-x-auto border-y border-ink bg-paper/95 px-4 sm:mx-0 sm:px-0">
          <ol className="flex min-w-max items-center gap-0.5 py-2">
            <li>
              <Link href="/concepts" className={`label px-2 py-1 ${!letter ? "text-red" : "hover:text-red"}`}>
                All
              </Link>
            </li>
            {alphabet.map((l) => {
              const has = letters.includes(l);
              return (
                <li key={l}>
                  {has ? (
                    <Link
                      href={`/concepts?letter=${l}`}
                      aria-current={letter === l ? "true" : undefined}
                      className={`label-mono block w-7 py-1 text-center text-sm ${letter === l ? "bg-ink text-paper" : "hover:text-red"}`}
                    >
                      {l}
                    </Link>
                  ) : (
                    <span className="label-mono block w-7 py-1 text-center text-sm text-rule">{l}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <div className="mt-6">
          {[...groups.entries()].map(([l, items]) => (
            <section key={l} aria-labelledby={`letter-${l}`} className="grid gap-4 border-b border-rule py-8 md:grid-cols-[8rem_1fr]">
              <h2 id={`letter-${l}`} className="display text-[4.5rem] leading-none text-red">
                {l}
              </h2>
              <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((c) => (
                  <li key={c.id}>
                    <Link href={c.href} className="group block">
                      <span className="font-serif text-2xl leading-tight group-hover:text-red">{c.title}</span>
                      <span className="mt-1.5 block text-[0.9rem] leading-snug text-muted">{briefs[c.id] || c.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <Pager page={page} total={list.total} perPage={PER_PAGE} base="/concepts" params={{ letter }} />
      </Container>
    </>
  );
}
