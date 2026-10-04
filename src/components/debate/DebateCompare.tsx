"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { STANCE_LABELS, type Stance } from "@/lib/content/model";
import type { DebatePosition } from "@/lib/data/debates";

function StanceGlyph({ stance, size = 14 }: { stance: Stance; size?: number }) {
  const r = size / 2 - 1.2;
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="inline-block align-middle">
      {stance === "affirms" && <circle cx={c} cy={c} r={r} fill="#16161A" />}
      {stance === "qualified" && (
        <>
          <circle cx={c} cy={c} r={r} fill="none" stroke="#16161A" strokeWidth="1.3" />
          <path d={`M${c},${c - r} A${r},${r} 0 0 1 ${c},${c + r} Z`} fill="#16161A" />
        </>
      )}
      {stance === "rejects" && <circle cx={c} cy={c} r={r} fill="none" stroke="#BC2B1C" strokeWidth="1.6" />}
      {stance === "silent" && <line x1={c - r} x2={c + r} y1={c} y2={c} stroke="#69635A" strokeWidth="1.3" />}
    </svg>
  );
}

type RowKind = "agree" | "diverge" | "partial";

function classify(stances: (Stance | undefined)[]): RowKind {
  const said = stances.filter((s): s is Stance => !!s && s !== "silent");
  if (said.length < 2) return "partial";
  return new Set(said).size === 1 ? (said.length === stances.length ? "agree" : "partial") : "diverge";
}

const ROW_LABEL: Record<RowKind, string> = { agree: "Agree", diverge: "Diverge", partial: "Partly addressed" };

/**
 * Positions laid out side by side, plus a comparison matrix. Selecting two
 * or more positions narrows the matrix to them and marks where they agree
 * and diverge. The interface describes positions; it does not adjudicate.
 */
export function DebateCompare({
  positions,
  propositions,
}: {
  positions: DebatePosition[];
  propositions: { id: string; statement: string }[];
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [onlyDiverge, setOnlyDiverge] = useState(false);
  const [openNote, setOpenNote] = useState<string | null>(null);

  const comparing = selected.length >= 2;
  const columns = comparing ? positions.filter((p) => selected.includes(p.id)) : positions;
  const rows = useMemo(
    () =>
      propositions.map((prop) => {
        const stances = columns.map((c) => c.stances[prop.id]?.stance);
        return { prop, kind: classify(stances) };
      }),
    [propositions, columns],
  );
  const counts = rows.reduce((acc, r) => ({ ...acc, [r.kind]: (acc[r.kind] ?? 0) + 1 }), {} as Record<RowKind, number>);

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  return (
    <div>
      {/* Positions */}
      <ol className="border-t-[3px] border-ink">
        {positions.map((p, i) => {
          const on = selected.includes(p.id);
          return (
            <li
              key={p.id}
              id={`position-${p.id}`}
              className={`relative scroll-mt-36 border-b border-ink py-7 transition-colors sm:py-9 ${on ? "bg-paper-warm" : ""}`}
            >
              {on && <span aria-hidden="true" className="absolute inset-y-0 -left-4 w-[3px] bg-red sm:-left-5" />}
              <div className="grid gap-x-8 gap-y-4 md:grid-cols-[4rem_1fr]">
                <span aria-hidden="true" className="numeral text-[2.6rem] leading-none text-red md:text-[3.4rem]">
                  {String.fromCharCode(65 + i)}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-[1.9rem] leading-none sm:text-[2.3rem]">
                        {p.holder ? (
                          <Link href={p.holder.href} className="hover:text-red">
                            {p.label}
                          </Link>
                        ) : (
                          p.label
                        )}
                      </h3>
                      {p.holder?.subtitle && <p className="label-mono mt-1.5 text-faint">{p.holder.subtitle}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(p.id)}
                      aria-pressed={on}
                      className={`label inline-flex shrink-0 items-center gap-1.5 border px-2.5 py-1.5 transition-colors ${on ? "border-red bg-red text-paper-warm" : "border-ink hover:bg-ink hover:text-paper"}`}
                    >
                      <span aria-hidden="true">{on ? "✓" : "+"}</span> Compare
                      <span className="sr-only"> {p.label}</span>
                    </button>
                  </div>

                  <div className="mt-5 grid gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                    <div>
                      <p className="label text-red">Central claim</p>
                      <p className="mt-2 font-serif text-[1.45rem] leading-[1.3] sm:text-[1.6rem]">{p.centralClaim}</p>
                      <p className="mt-4 max-w-[40rem] font-serif text-[1.05rem] leading-relaxed text-ink-warm">{p.summary}</p>
                    </div>
                    <div className="space-y-5 border-t border-rule pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                      {p.assumptions.length > 0 && (
                        <div>
                          <p className="label text-faint">Assumes</p>
                          <ul className="mt-1.5 space-y-1.5 text-[0.92rem] leading-snug">
                            {p.assumptions.map((a) => (
                              <li key={a} className="grid grid-cols-[1rem_1fr]">
                                <span aria-hidden="true" className="text-faint">–</span>
                                {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {p.texts.length > 0 && (
                        <div>
                          <p className="label text-faint">Key texts</p>
                          <ul className="mt-1.5 space-y-1 font-serif text-[1rem]">
                            {p.texts.map((t) => (
                              <li key={t.id}>
                                <Link href={t.href} className="link-inline italic">
                                  {t.title}
                                </Link>{" "}
                                <span className="label-mono text-faint">{t.yearStart}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {p.concepts.length > 0 && (
                        <div>
                          <p className="label text-faint">Concepts</p>
                          <p className="mt-1.5 font-serif text-[1rem]">
                            {p.concepts.map((c, n) => (
                              <span key={c.id}>
                                <Link href={c.href} className="link-inline">
                                  {c.title}
                                </Link>
                                {n < p.concepts.length - 1 && <span className="text-faint"> · </span>}
                              </span>
                            ))}
                          </p>
                        </div>
                      )}
                      {p.criticisms.length > 0 && (
                        <div>
                          <p className="label text-red">Criticisms</p>
                          <ul className="mt-1.5 space-y-1.5 text-[0.9rem] leading-snug text-muted">
                            {p.criticisms.map((c) => (
                              <li key={c} className="grid grid-cols-[1rem_1fr]">
                                <span aria-hidden="true" className="text-red">⟂</span>
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Comparison matrix */}
      {propositions.length > 0 && (
        <div id="compare" className="mt-14 scroll-mt-36">
          <div className="flex flex-wrap items-end justify-between gap-4 border-t-[3px] border-ink pt-4">
            <div>
              <p className="label">
                <span aria-hidden="true" className="mr-3 text-red">⇄</span>
                {comparing ? `Comparing ${columns.map((c) => c.label).join(" · ")}` : "All positions"}
              </p>
              <p className="mt-2 text-sm text-muted" aria-live="polite">
                {counts.agree ?? 0} shared · {counts.diverge ?? 0} divergent · {counts.partial ?? 0} partly addressed
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="label inline-flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={onlyDiverge}
                  onChange={(e) => setOnlyDiverge(e.target.checked)}
                  className="h-3.5 w-3.5 accent-[#BC2B1C]"
                />
                Only disagreements
              </label>
              {comparing && (
                <button type="button" onClick={() => setSelected([])} className="label text-red hover:underline">
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="scrollbar-thin mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">
                How each position stands on the propositions at issue. Affirms, qualified, rejects, or not addressed.
              </caption>
              <thead>
                <tr className="border-b border-ink">
                  <th scope="col" className="label w-[34%] py-3 pr-4 font-medium text-faint">
                    Proposition
                  </th>
                  {columns.map((c) => (
                    <th key={c.id} scope="col" className="px-2 py-3 text-center font-serif text-[1.15rem] font-normal leading-tight">
                      {c.label}
                    </th>
                  ))}
                  <th scope="col" className="label w-24 py-3 pl-2 text-right font-medium text-faint">
                    Reading
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows
                  .filter((r) => !onlyDiverge || r.kind === "diverge")
                  .map(({ prop, kind }) => (
                    <tr
                      key={prop.id}
                      className={`border-b border-rule transition-colors ${kind === "diverge" ? "bg-red/[0.045]" : ""}`}
                    >
                      <th scope="row" className="relative py-4 pr-4 pl-3 align-top font-serif text-[1.12rem] font-normal leading-snug">
                        {kind === "diverge" && <span aria-hidden="true" className="absolute left-0 top-4 bottom-4 w-[3px] bg-red" />}
                        {prop.statement}
                      </th>
                      {columns.map((c) => {
                        const cell = c.stances[prop.id];
                        const stance = cell?.stance ?? "silent";
                        const key = `${prop.id}:${c.id}`;
                        return (
                          <td key={c.id} className="px-2 py-4 text-center align-top">
                            <button
                              type="button"
                              onClick={() => setOpenNote(openNote === key ? null : key)}
                              disabled={!cell?.note}
                              aria-expanded={cell?.note ? openNote === key : undefined}
                              className={`group inline-flex flex-col items-center gap-1 ${cell?.note ? "cursor-pointer" : "cursor-default"}`}
                            >
                              <StanceGlyph stance={stance} size={16} />
                              <span className={`label text-[0.6rem] ${stance === "silent" ? "text-faint" : "text-muted"} ${cell?.note ? "underline decoration-dotted underline-offset-2 group-hover:text-red" : ""}`}>
                                {STANCE_LABELS[stance]}
                              </span>
                            </button>
                            {cell?.note && openNote === key && (
                              <p className="mx-auto mt-2 max-w-[13rem] text-left text-xs leading-snug text-ink-warm animate-fade">{cell.note}</p>
                            )}
                          </td>
                        );
                      })}
                      <td className="py-4 pl-2 text-right align-top">
                        <span className={`label ${kind === "diverge" ? "text-red" : kind === "agree" ? "text-olive" : "text-faint"}`}>
                          {ROW_LABEL[kind]}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
            {(Object.keys(STANCE_LABELS) as Stance[]).map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5">
                <StanceGlyph stance={s} size={11} /> {STANCE_LABELS[s]}
              </span>
            ))}
            <span className="text-faint">Stances are editorial readings.</span>
          </p>
        </div>
      )}
    </div>
  );
}
