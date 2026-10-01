import type { Metadata } from "next";
import Link from "next/link";
import { Container, Label } from "@/components/editorial/primitives";
import { Highlight } from "@/components/search/Highlight";
import { search } from "@/lib/data";
import { ENTITY_KINDS, isEntityKind, KINDS, type EntityKind } from "@/lib/content/model";

export const metadata: Metadata = { title: "Search the archive" };

type Props = { searchParams: Promise<{ q?: string; kind?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", kind } = await searchParams;
  const k = kind && isEntityKind(kind) ? (kind as EntityKind) : undefined;
  const res = q.trim() ? await search(q, { kinds: k ? [k] : undefined, limit: 80 }) : null;
  return (
    <Container className="pt-6 sm:pt-8">
      <div className="border-b border-rule pb-2">
        <Label className="text-muted">
          Atlas <span className="text-red">/</span> Search
        </Label>
      </div>
      <form action="/search" role="search" className="border-b border-ink py-10">
        <label htmlFor="q" className="label slash text-red">
          Consult the archive
        </label>
        <div className="mt-4 flex items-end gap-4">
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            autoFocus={!q}
            placeholder="A thinker, a concept, a year…"
            className="display w-full bg-transparent text-[2.4rem] text-ink placeholder:text-faint/60 focus:outline-none sm:text-[4.2rem]"
          />
          {k && <input type="hidden" name="kind" value={k} />}
          <button type="submit" className="btn btn-red mb-3 shrink-0">
            Search
          </button>
        </div>
      </form>

      {res && (
        <div className="grid gap-12 py-10 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <p className="label mb-3 text-faint">Filter by type</p>
            <ul className="space-y-1">
              <li>
                <Link href={`/search?q=${encodeURIComponent(q)}`} className={`label ${!k ? "text-red" : "hover:text-red"}`}>
                  Everything
                </Link>
              </li>
              {ENTITY_KINDS.map((kk) => (
                <li key={kk}>
                  <Link href={`/search?q=${encodeURIComponent(q)}&kind=${kk}`} className={`label ${k === kk ? "text-red" : "text-muted hover:text-red"}`}>
                    {KINDS[kk].plural}
                  </Link>
                </li>
              ))}
            </ul>
            {res.related.length > 0 && (
              <div className="mt-10">
                <p className="label mb-3 text-faint">Related</p>
                <ul className="space-y-1.5">
                  {res.related.map((r) => (
                    <li key={r.id}>
                      <Link href={r.href} className="link-inline font-serif text-lg">
                        {r.title}
                      </Link>
                      <span className="label ml-2 text-faint">{KINDS[r.kind].label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
          <div className="lg:col-span-9">
            <p className="mb-8 text-muted" aria-live="polite">
              {res.total ? (
                <>
                  {res.total} {res.total === 1 ? "entry" : "entries"} for <em className="text-ink">“{res.query}”</em>
                </>
              ) : (
                <>
                  Nothing in the archive matches <em className="text-ink">“{res.query}”</em> yet.
                </>
              )}
            </p>
            {res.groups.map((g) => (
              <section key={g.kind} aria-labelledby={`g-${g.kind}`} className="mb-12">
                <h2 id={`g-${g.kind}`} className="label mb-2 flex justify-between border-b border-ink pb-2 font-sans">
                  <span>{KINDS[g.kind].label}</span>
                  <span className="label-mono text-faint">{g.hits.length}</span>
                </h2>
                <ol>
                  {g.hits.map((h) => (
                    <li key={h.id} className="border-b border-rule">
                      <Link href={h.href} className="group grid gap-1 py-4 sm:grid-cols-[1fr_6rem]">
                        <span>
                          <span className="font-serif text-2xl group-hover:text-red">{h.title}</span>
                          <span className="mt-1 block text-[0.95rem] leading-snug text-muted">
                            <Highlight text={h.snippet || h.summary} />
                          </span>
                        </span>
                        <span className="label-mono text-faint sm:text-right">
                          {h.yearStart ?? ""}
                          {h.yearEnd && h.yearEnd !== h.yearStart ? `–${h.yearEnd}` : ""}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
