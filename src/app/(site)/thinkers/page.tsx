import type { Metadata } from "next";
import Link from "next/link";
import { IndexHeader } from "@/components/editorial/IndexHeader";
import { Pager, pageParam } from "@/components/editorial/Pager";
import { Container, lifespan } from "@/components/editorial/primitives";
import { getTendencyMemberIds, listEntities, withTendencies } from "@/lib/data";
import { KINDS } from "@/lib/content/model";

export const metadata: Metadata = { title: "Thinkers", description: KINDS.thinker.blurb };

const PER_PAGE = 60;
const AXIS_FROM = 1760;
const AXIS_TO = 2030;
const pct = (y: number) => ((y - AXIS_FROM) / (AXIS_TO - AXIS_FROM)) * 100;

type Props = { searchParams: Promise<{ tendency?: string; sort?: string; page?: string }> };

export default async function ThinkersIndex({ searchParams }: Props) {
  const sp = await searchParams;
  const page = pageParam(sp.page);
  const sort = sp.sort === "name" ? "title" : "year";
  const memberIds = sp.tendency ? await getTendencyMemberIds(sp.tendency) : undefined;
  const [list, tendencies] = await Promise.all([
    listEntities({ kind: "thinker", order: sort, ids: memberIds ?? undefined, limit: PER_PAGE, offset: (page - 1) * PER_PAGE }),
    listEntities({ kind: "tendency" }),
  ]);
  const thinkers = await withTendencies(list.items);
  const ticks = [1800, 1850, 1900, 1950, 2000];
  const q = (o: Record<string, string | undefined>) => {
    const p = new URLSearchParams(Object.entries({ tendency: sp.tendency, sort: sp.sort, ...o }).filter(([, v]) => v) as [string, string][]);
    const s = p.toString();
    return s ? `/thinkers?${s}` : "/thinkers";
  };

  return (
    <>
      <IndexHeader
        crumb="Thinkers"
        tally={`${list.total} ${list.total === 1 ? "thinker" : "thinkers"}`}
        title={
          <>
            The people who argued it out<span className="text-red">.</span>
          </>
        }
        lede="Each line is a life, set against two and a half centuries. Filter by tendency, or sort by name."
      />
      <Container>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-ink py-3">
          <span className="label text-faint">Tendency</span>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            <li>
              <Link href={q({ tendency: undefined, page: undefined })} className={`label ${!sp.tendency ? "text-red" : "hover:text-red"}`}>
                All
              </Link>
            </li>
            {tendencies.items.map((t) => (
              <li key={t.id}>
                <Link
                  href={q({ tendency: t.slug, page: undefined })}
                  aria-current={sp.tendency === t.slug ? "true" : undefined}
                  className={`label ${sp.tendency === t.slug ? "text-red" : "text-muted hover:text-red"}`}
                >
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
          <span className="ml-auto flex gap-4">
            <span className="label text-faint">Sort</span>
            <Link href={q({ sort: undefined })} className={`label ${sort === "year" ? "text-red" : "hover:text-red"}`}>
              Born
            </Link>
            <Link href={q({ sort: "name" })} className={`label ${sort === "title" ? "text-red" : "hover:text-red"}`}>
              Name
            </Link>
          </span>
        </div>

        {/* Axis */}
        <div className="relative mt-6 hidden h-6 md:ml-[38%] md:block" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className="label-mono absolute -translate-x-1/2 text-faint" style={{ left: `${pct(t)}%` }}>
              {t}
            </span>
          ))}
        </div>

        <ol className="border-t border-ink">
          {thinkers.map((t) => {
            const end = t.yearEnd ?? 2026;
            return (
              <li key={t.id} className="border-b border-rule">
                <Link href={t.href} className="group grid items-center gap-x-6 gap-y-1 py-4 md:grid-cols-[38%_1fr]">
                  <span>
                    <span className="font-serif text-[1.75rem] leading-tight transition-colors group-hover:text-red">{t.title}</span>
                    <span className="label-mono ml-3 text-faint">{lifespan(t.yearStart, t.yearEnd, "thinker")}</span>
                    <span className="mt-1 block text-[0.85rem] text-muted">{t.tendencies.map((x) => x.title).join(" · ")}</span>
                  </span>
                  <span className="relative block h-8">
                    <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-rule-soft" />
                    {ticks.map((tick) => (
                      <span key={tick} aria-hidden="true" className="absolute top-2 hidden h-4 w-px bg-rule md:block" style={{ left: `${pct(tick)}%` }} />
                    ))}
                    {t.yearStart != null && (
                      <span
                        aria-hidden="true"
                        className="absolute top-1/2 h-[6px] -translate-y-1/2 border-l-2 border-ink bg-beige transition-colors group-hover:border-red group-hover:bg-red"
                        style={{ left: `${pct(t.yearStart)}%`, width: `${pct(end) - pct(t.yearStart)}%` }}
                      />
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
        <Pager page={page} total={list.total} perPage={PER_PAGE} base="/thinkers" params={{ tendency: sp.tendency, sort: sp.sort }} />
      </Container>
    </>
  );
}
