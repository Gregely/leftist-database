import Link from "next/link";
import { DebateCompare } from "@/components/debate/DebateCompare";
import { Container, EmptyNote, Question } from "@/components/editorial/primitives";
import { Notes } from "@/components/editorial/Notes";
import { Prose } from "@/components/editorial/Prose";
import { EntryHeader } from "@/components/entity/EntryHeader";
import { EntrySection } from "@/components/entity/EntrySection";
import { EntryGrid } from "@/components/entity/RelationList";
import { SectionNav } from "@/components/entity/SectionNav";
import { type DebateArgument, type DebatePosition, type DebateAggregate } from "@/lib/data";

/** An argument and the replies to it, drawn as a thread: each reply hangs from the line of the one it answers. */
function ArgumentThread({ arg, positions, depth = 0 }: { arg: DebateArgument; positions: DebatePosition[]; depth?: number }) {
  const index = positions.findIndex((p) => p.id === arg.positionId);
  const pos = index >= 0 ? positions[index] : null;
  const counter = arg.kind === "counterargument";
  return (
    <li className={depth ? "relative mt-5 pl-6 sm:pl-10" : "border-t border-ink py-7"}>
      {depth > 0 && <span aria-hidden="true" className="absolute left-0 top-0 h-6 w-4 border-b border-l border-red sm:w-7" />}
      <p className="label flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className={counter ? "text-red" : "text-ink"}>{counter ? "Counterargument" : "Argument"}</span>
        {pos && (
          <a href={`#position-${pos.id}`} className="inline-flex items-center gap-1.5 text-faint hover:text-red">
            <span aria-hidden="true">·</span>
            <span className="numeral text-[0.95rem] normal-case text-red">{String.fromCharCode(65 + index)}</span>
            {pos.label}
          </a>
        )}
      </p>
      <p className={`mt-2 max-w-3xl font-serif leading-snug ${depth ? "text-[1.15rem] text-ink-warm" : "text-[1.4rem]"}`}>{arg.body}</p>
      {arg.replies.length > 0 && (
        <ul className={depth ? "" : "ml-2 border-l border-red/40 sm:ml-4"}>
          {arg.replies.map((r) => (
            <ArgumentThread key={r.id} arg={r} positions={positions} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * The debate in time: one row per position, its key texts placed by year,
 * with the historical touchstones as vertical markers. Shows when each answer
 * was given and what was happening when it was.
 */
function DebateInTime({ d }: { d: DebateAggregate }) {
  const rows = d.positions.map((p, i) => ({ p, i, years: p.texts.filter((t) => t.yearStart != null) }));
  const events = d.events.filter((e) => e.yearStart != null);
  const all = [...rows.flatMap((r) => r.years.map((t) => t.yearStart!)), ...events.map((e) => e.yearStart!)];
  if (all.length < 2) return null;
  const from = Math.floor((Math.min(...all) - 5) / 10) * 10;
  const to = Math.ceil((Math.max(...all) + 5) / 10) * 10;
  const pct = (y: number) => ((y - from) / (to - from)) * 100;
  const ticks: number[] = [];
  const step = to - from > 120 ? 50 : to - from > 50 ? 20 : 10;
  for (let y = Math.ceil(from / step) * step; y <= to; y += step) ticks.push(y);
  return (
    <figure className="mt-12">
      <figcaption className="label mb-3 flex flex-wrap justify-between gap-2 text-faint">
        <span>The debate in time</span>
        <span className="font-serif text-[0.95rem] normal-case italic tracking-normal">
          Each position&apos;s key texts by year{events.length ? "; vertical lines mark historical touchstones" : ""}
        </span>
      </figcaption>
      <div className="border-t border-ink">
        {rows.map(({ p, i, years }) => (
          <div key={p.id} className="grid grid-cols-[7rem_1fr] items-center border-b border-rule sm:grid-cols-[11rem_1fr]">
            <a href={`#position-${p.id}`} className="flex items-baseline gap-2 truncate py-2 pr-3 font-serif text-[1rem] hover:text-red">
              <span className="numeral text-red">{String.fromCharCode(65 + i)}</span>
              <span className="truncate">{p.label}</span>
            </a>
            <div className="relative h-9">
              {events.map((e) => (
                <span key={e.id} aria-hidden="true" className="absolute inset-y-0 w-px bg-umber/50" style={{ left: `${pct(e.yearStart!)}%` }} />
              ))}
              {years.map((t) => (
                <Link
                  key={t.id}
                  href={t.href}
                  title={`${t.yearStart}: ${t.title}`}
                  className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 border border-blue bg-blue transition-colors hover:border-red hover:bg-red"
                  style={{ left: `${pct(t.yearStart!)}%` }}
                >
                  <span className="sr-only">
                    {t.yearStart}: {t.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
        <div className="grid grid-cols-[7rem_1fr] sm:grid-cols-[11rem_1fr]">
          <span />
          <div className="relative h-12">
            {ticks.map((y) => (
              <span key={y} aria-hidden="true" className="label-mono absolute top-1 -translate-x-1/2 text-faint" style={{ left: `${pct(y)}%` }}>
                {y}
              </span>
            ))}
            {events.map((e, k) => (
              <Link
                key={e.id}
                href={e.href}
                className="absolute hidden -translate-x-1/2 whitespace-nowrap font-serif text-[0.85rem] italic text-umber hover:text-red sm:block"
                style={{ left: `${pct(e.yearStart!)}%`, top: k % 2 ? "2.1rem" : "1.2rem" }}
              >
                {e.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

/**
 * A debate: the question; why it mattered; the positions taken, each with its
 * claim, assumptions, texts and criticisms; a comparison of where they agree
 * and diverge; how the argument developed; and the texts and debates around it.
 * The page describes the disagreement. It does not settle it.
 */
export function DebateView({ d }: { d: DebateAggregate }) {
  const { entity } = d;
  const sections = [
    { id: "question", label: "The question" },
    { id: "positions", label: "Positions" },
    { id: "arguments", label: "Arguments" },
    { id: "texts", label: "Texts" },
    { id: "related", label: "Related debates" },
  ];
  const n = (id: string) => String(sections.findIndex((s) => s.id === id) + 1);

  return (
    <article>
      <EntryHeader
        entity={entity}
        title={<Question title={entity.title} />}
        titleClassName="text-[3rem] sm:text-[5rem] xl:text-[6.4rem]"
        standfirst={d.intro}
        aside={
          <nav aria-label="Positions at a glance">
            <p className="label border-t border-ink pt-2.5 text-faint">{d.positions.length} positions</p>
            <ol className="mt-1">
              {d.positions.map((p, i) => (
                <li key={p.id} className="border-b border-rule">
                  <a href={`#position-${p.id}`} className="group grid grid-cols-[1.75rem_1fr] items-baseline py-2">
                    <span className="numeral text-[1.2rem] text-red">{String.fromCharCode(65 + i)}</span>
                    <span>
                      <span className="font-serif text-[1.15rem] leading-tight group-hover:text-red">{p.label}</span>
                      <span className="mt-0.5 line-clamp-2 block text-[0.82rem] leading-snug text-muted">{p.centralClaim}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        }
      />

      <SectionNav sections={sections} title={entity.title} label="Sections of this debate" />

      <Container>
        <EntrySection id="question" number={n("question")} label="The question">
          <div className="grid gap-10 xl:grid-cols-9">
            <div className="xl:col-span-6">
              <p className="lede">{entity.summary}</p>
              {d.body && <Prose text={d.body} context={d.prose.context} className="mt-6 max-w-[40rem]" />}
              {d.context && (
                <>
                  <p className="label mb-3 mt-10 border-t border-ink pt-2.5 text-red">Why it mattered</p>
                  <Prose text={d.context} context={d.prose.context} className="max-w-[40rem]" />
                </>
              )}
            </div>
            <aside className="space-y-8 xl:col-span-3">
              {d.concepts.length > 0 && (
                <div>
                  <p className="label mb-2 border-t border-ink pt-2.5 text-faint">Concepts at stake</p>
                  <ul className="space-y-1">
                    {d.concepts.map((c) => (
                      <li key={c.id}>
                        <Link href={c.href} className="link-inline font-serif text-[1.15rem]">
                          {c.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {d.events.length > 0 && (
                <div>
                  <p className="label mb-2 border-t border-ink pt-2.5 text-faint">Historical touchstones</p>
                  <ul className="space-y-1">
                    {d.events.map((e) => (
                      <li key={e.id} className="flex items-baseline gap-3">
                        <span className="numeral w-10 shrink-0 text-umber">{e.yearStart}</span>
                        <Link href={e.href} className="link-inline font-serif text-[1.05rem]">
                          {e.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="border-l-2 border-red pl-4 text-[0.88rem] leading-relaxed text-muted">
                The Atlas presents positions descriptively. Summaries are simplifications and stances are editorial readings,
                open to correction; the aim is to map a disagreement, not to settle it.
              </p>
            </aside>
          </div>
          <DebateInTime d={d} />
        </EntrySection>

        <EntrySection id="positions" number={n("positions")} label="Positions" title="How the traditions answer.">
          <DebateCompare positions={d.positions} propositions={d.propositions} />
        </EntrySection>

        <EntrySection id="arguments" number={n("arguments")} label="Arguments" title="How the argument developed: claims, and the replies to them.">
          {d.arguments.length ? (
            <ul className="border-b border-ink">
              {d.arguments.map((a) => (
                <ArgumentThread key={a.id} arg={a} positions={d.positions} />
              ))}
            </ul>
          ) : (
            <EmptyNote>No arguments have been mapped for this debate yet.</EmptyNote>
          )}
        </EntrySection>

        <EntrySection id="texts" number={n("texts")} label="Texts">
          {d.texts.length ? <EntryGrid items={d.texts} /> : <EmptyNote>No texts linked yet.</EmptyNote>}
        </EntrySection>

        <EntrySection id="related" number={n("related")} label="Related debates">
          {d.related.length ? (
            <ul className="border-t border-ink">
              {d.related.map((r) => (
                <li key={r.id} className="border-b border-rule">
                  <Link href={r.href} className="group block py-5">
                    <span className="display text-[2rem] transition-transform group-hover:translate-x-1 sm:text-[2.6rem]">
                      <Question title={r.title} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyNote>No related debates yet.</EmptyNote>
          )}
        </EntrySection>

        <Notes notes={d.prose.notes} className="mt-4 max-w-3xl" />
      </Container>
    </article>
  );
}
