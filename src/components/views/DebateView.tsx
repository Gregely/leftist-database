import Link from "next/link";
import { DebateCompare } from "@/components/debate/DebateCompare";
import { Container, EmptyNote } from "@/components/editorial/primitives";
import { Notes } from "@/components/editorial/Notes";
import { Prose } from "@/components/editorial/Prose";
import { EntryHeader } from "@/components/entity/EntryHeader";
import { EntrySection } from "@/components/entity/EntrySection";
import { EntryGrid } from "@/components/entity/RelationList";
import { SectionNav } from "@/components/entity/SectionNav";
import { type DebateArgument, type DebatePosition, type DebateAggregate } from "@/lib/data";
function ArgumentThread({ arg, positions, depth = 0 }: { arg: DebateArgument; positions: DebatePosition[]; depth?: number }) {
  const pos = positions.find((p) => p.id === arg.positionId);
  return (
    <li className={depth ? "mt-4 border-l border-red pl-5 sm:ml-8" : "border-t border-rule py-6"}>
      <p className="label flex items-center gap-2">
        <span className={arg.kind === "counterargument" ? "text-red" : "text-ink"}>
          {arg.kind === "counterargument" ? "↳ Counterargument" : "Argument"}
        </span>
        {pos && (
          <a href={`#position-${pos.id}`} className="text-faint hover:text-red">
            · {pos.label}
          </a>
        )}
      </p>
      <p className={`mt-2 max-w-3xl font-serif leading-snug ${depth ? "text-lg" : "text-[1.35rem]"}`}>{arg.body}</p>
      {arg.replies.length > 0 && (
        <ul>
          {arg.replies.map((r) => (
            <ArgumentThread key={r.id} arg={r} positions={positions} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function DebateView({ d }: { d: DebateAggregate }) {
  const { entity } = d;
  const sections = [
    { id: "question", label: "Question" },
    { id: "positions", label: "Positions" },
    { id: "arguments", label: "Arguments" },
    { id: "texts", label: "Texts" },
    { id: "related", label: "Related debates" },
  ];

  return (
    <article>
      <EntryHeader
        entity={entity}
        title={
          <>
            {entity.title.replace(/\?$/, "")}
            <span className="text-red">?</span>
          </>
        }
        titleClassName="text-[3rem] sm:text-[5rem] xl:text-[6.2rem]"
        standfirst={d.intro}
        aside={
          <ol className="border-y border-ink">
            {["Question", "Positions", "Arguments", "Counterarguments", "Texts", "Related debates"].map((s, i) => (
              <li key={s} className="flex items-baseline gap-3 border-b border-rule py-1.5 last:border-0">
                <span className="label-mono w-6 text-red">{String(i + 1).padStart(2, "0")}</span>
                <span className="label">{s}</span>
                {i < 5 && <span aria-hidden="true" className="ml-auto text-faint">↓</span>}
              </li>
            ))}
          </ol>
        }
      />

      <SectionNav sections={sections} />

      <Container>
        <EntrySection id="question" number="01" label="The question">
          <div className="grid gap-8 xl:grid-cols-9">
            <div className="xl:col-span-6">
              <p className="lede">{entity.summary}</p>
              {d.body && <Prose text={d.body} context={d.prose.context} className="mt-6 max-w-[40rem]" />}
              {d.context && (
                <>
                  <p className="label mb-2 mt-8 text-faint">Historical context</p>
                  <Prose text={d.context} context={d.prose.context} className="max-w-[40rem]" />
                </>
              )}
            </div>
            <aside className="xl:col-span-3">
              <p className="label mb-2 text-faint">Concepts at stake</p>
              <ul className="space-y-1">
                {d.concepts.map((c) => (
                  <li key={c.id}>
                    <Link href={c.href} className="link-inline font-serif text-lg">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
              {d.events.length > 0 && (
                <>
                  <p className="label mb-2 mt-6 text-faint">Historical touchstones</p>
                  <ul className="space-y-1">
                    {d.events.map((e) => (
                      <li key={e.id}>
                        <Link href={e.href} className="link-inline">
                          {e.title}
                        </Link>{" "}
                        <span className="label-mono text-faint">{e.yearStart}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </aside>
          </div>
          <p className="mt-10 max-w-2xl border-l-2 border-red pl-4 text-sm leading-relaxed text-muted">
            The Atlas presents positions descriptively. Summaries are simplifications and stances are editorial readings,
            open to correction; the aim is to map a disagreement, not to settle it.
          </p>
        </EntrySection>

        <EntrySection id="positions" number="02" label="Positions" title="How the traditions answer.">
          <DebateCompare positions={d.positions} propositions={d.propositions} />
        </EntrySection>

        <EntrySection id="arguments" number="03" label="Arguments" title="Arguments and counterarguments.">
          {d.arguments.length ? (
            <ul className="border-b border-rule">
              {d.arguments.map((a) => (
                <ArgumentThread key={a.id} arg={a} positions={d.positions} />
              ))}
            </ul>
          ) : (
            <EmptyNote>No arguments have been mapped for this debate yet.</EmptyNote>
          )}
        </EntrySection>

        <EntrySection id="texts" number="04" label="Texts">
          {d.texts.length ? <EntryGrid items={d.texts} /> : <EmptyNote>No texts linked yet.</EmptyNote>}
        </EntrySection>

        <EntrySection id="related" number="05" label="Related debates">
          {d.related.length ? (
            <ul className="border-t border-rule">
              {d.related.map((r) => (
                <li key={r.id} className="border-b border-rule">
                  <Link href={r.href} className="group block py-5">
                    <span className="display text-[2rem] transition-transform group-hover:translate-x-1 sm:text-[2.6rem]">
                      {r.title.replace(/\?$/, "")}
                      <span className="text-red">?</span>
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
