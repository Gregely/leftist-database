import {
  addArgumentAction,
  addPositionLinkAction,
  addPropositionAction,
  deleteArgumentAction,
  deletePositionAction,
  deletePropositionAction,
  removePositionLinkAction,
  savePositionAction,
  saveStancesAction,
} from "@/app/admin/actions";
import type { getDebateStructure } from "@/lib/admin/repository";
import { parseJsonArray } from "@/lib/util/json";
import { STANCE_LABELS, STANCES } from "@/lib/content/model";
import { EntityPicker } from "./EntityPicker";
import { DeleteButton, Panel } from "./panels";

type Structure = Awaited<ReturnType<typeof getDebateStructure>>;

function PositionFields({ p, holder }: { p?: Structure["positions"][number]; holder?: { id: string; title: string; kind: "thinker" | "tendency" } | null }) {
  return (
    <div className="grid gap-3 sm:grid-cols-6">
      <input name="label" defaultValue={p?.label} placeholder="Label (e.g. Luxemburg)" className="field sm:col-span-2" aria-label="Label" required />
      <div className="sm:col-span-4">
        <EntityPicker name="holderId" kinds={["thinker", "tendency"]} placeholder="Held by (thinker or tendency)…" initial={holder ?? null} />
      </div>
      <textarea name="centralClaim" defaultValue={p?.centralClaim} rows={2} placeholder="Central claim" className="field sm:col-span-6" aria-label="Central claim" />
      <textarea name="summary" defaultValue={p?.summary} rows={3} placeholder="Short explanation" className="field sm:col-span-6" aria-label="Summary" />
      <textarea name="assumptions" defaultValue={parseJsonArray(p?.assumptions).join("\n")} rows={3} placeholder="Underlying assumptions — one per line" className="field sm:col-span-3" aria-label="Assumptions" />
      <textarea name="criticisms" defaultValue={parseJsonArray(p?.criticisms).join("\n")} rows={3} placeholder="Criticisms — one per line" className="field sm:col-span-3" aria-label="Criticisms" />
    </div>
  );
}

export function DebateEditor({ debateId, s, returnTo }: { debateId: string; s: Structure; returnTo: string }) {
  const holderById = new Map(s.holders.map((h) => [h.id, h]));
  const back = (hash: string) => `${returnTo}#${hash}`;
  return (
    <>
      <Panel id="propositions" title="Propositions" count={s.propositions.length} help="The axes on which positions are compared.">
        <ol className="divide-y divide-rule border-y border-rule">
          {s.propositions.map((p, i) => (
            <li key={p.id} className="flex items-baseline justify-between gap-3 py-2">
              <span><span className="label-mono mr-3 text-red">{i + 1}</span><span className="font-serif text-lg">{p.statement}</span></span>
              <DeleteButton action={deletePropositionAction} fields={{ id: p.id, returnTo: back("propositions") }} />
            </li>
          ))}
        </ol>
        <form action={addPropositionAction} className="mt-3 flex gap-3">
          <input type="hidden" name="debateId" value={debateId} />
          <input type="hidden" name="returnTo" value={back("propositions")} />
          <input name="statement" placeholder="e.g. The state should ultimately disappear." className="field" aria-label="New proposition" />
          <button type="submit" className="btn shrink-0">Add</button>
        </form>
      </Panel>

      <Panel id="positions" title="Positions" count={s.positions.length}>
        <div className="space-y-6">
          {s.positions.map((p) => {
            const h = p.holderId ? holderById.get(p.holderId) : null;
            const links = s.links.filter((l) => l.positionId === p.id);
            return (
              <details key={p.id} className="border border-rule bg-paper-warm">
                <summary className="flex cursor-pointer items-baseline justify-between gap-3 px-4 py-3">
                  <span className="font-serif text-xl">{p.label}</span>
                  <span className="label text-faint">{h?.title ?? "No holder"} · {links.length} links</span>
                </summary>
                <div className="space-y-4 border-t border-rule p-4">
                  <form action={savePositionAction} className="space-y-3">
                    <input type="hidden" name="debateId" value={debateId} />
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="returnTo" value={back("positions")} />
                    <PositionFields p={p} holder={h ? { id: h.id, title: h.title, kind: h.kind as "thinker" } : null} />
                    <button type="submit" className="btn">Save position</button>
                  </form>
                  <div>
                    <p className="label mb-2 text-faint">Key texts &amp; concepts</p>
                    <ul className="flex flex-wrap gap-2">
                      {links.map((l) => (
                        <li key={l.entityId} className="inline-flex items-center gap-2 border border-rule px-2 py-0.5 text-sm">
                          {l.entity.title}
                          <DeleteButton action={removePositionLinkAction} fields={{ positionId: p.id, entityId: l.entityId, returnTo: back("positions") }} label="✕" />
                        </li>
                      ))}
                    </ul>
                    <form action={addPositionLinkAction} className="mt-2 flex gap-2">
                      <input type="hidden" name="positionId" value={p.id} />
                      <input type="hidden" name="returnTo" value={back("positions")} />
                      <div className="flex-1"><EntityPicker name="entityId" kinds={["text", "concept", "event"]} placeholder="Link a text or concept…" /></div>
                      <button type="submit" className="btn shrink-0">Link</button>
                    </form>
                  </div>
                  <DeleteButton action={deletePositionAction} fields={{ id: p.id, debateId, returnTo: back("positions") }} label="Delete position" />
                </div>
              </details>
            );
          })}
        </div>
        <details className="mt-6 border border-dashed border-ink">
          <summary className="label cursor-pointer px-4 py-3 text-red">+ Add a position</summary>
          <form action={savePositionAction} className="space-y-3 border-t border-rule p-4">
            <input type="hidden" name="debateId" value={debateId} />
            <input type="hidden" name="returnTo" value={back("positions")} />
            <PositionFields />
            <button type="submit" className="btn btn-red">Add position</button>
          </form>
        </details>
      </Panel>

      {s.positions.length > 0 && s.propositions.length > 0 && (
        <Panel id="stances" title="Stance matrix" help="How each position stands on each proposition. Notes appear in the public comparison.">
          <form action={saveStancesAction}>
            <input type="hidden" name="returnTo" value={back("stances")} />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-ink">
                    <th scope="col" className="label py-2 pr-3 text-left font-medium text-faint">Proposition</th>
                    {s.positions.map((p) => (
                      <th key={p.id} scope="col" className="px-2 py-2 text-left font-serif font-normal">{p.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.propositions.map((prop) => (
                    <tr key={prop.id} className="border-b border-rule align-top">
                      <th scope="row" className="py-2 pr-3 text-left font-serif font-normal">{prop.statement}</th>
                      {s.positions.map((p) => {
                        const st = s.stances.find((x) => x.positionId === p.id && x.propositionId === prop.id);
                        return (
                          <td key={p.id} className="px-2 py-2">
                            <select name={`stance:${p.id}:${prop.id}`} defaultValue={st?.stance ?? ""} className="field py-1 text-xs" aria-label={`${p.label} on: ${prop.statement}`}>
                              <option value="">—</option>
                              {STANCES.map((x) => <option key={x} value={x}>{STANCE_LABELS[x]}</option>)}
                            </select>
                            <input name={`note:${p.id}:${prop.id}`} defaultValue={st?.note ?? ""} placeholder="note" className="field mt-1 py-1 text-xs" aria-label="Note" />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="submit" className="btn btn-red mt-4">Save stances</button>
          </form>
        </Panel>
      )}

      <Panel id="arguments" title="Arguments & counterarguments" count={s.args.length}>
        <ul className="space-y-2">
          {s.args.map((a) => (
            <li key={a.id} className={`flex items-baseline justify-between gap-4 border-l-2 pl-3 ${a.kind === "counterargument" ? "ml-6 border-red" : "border-ink"}`}>
              <span className="text-sm">
                <span className="label mr-2 text-faint">{a.kind}{a.positionId ? ` · ${s.positions.find((p) => p.id === a.positionId)?.label ?? ""}` : ""}</span>
                {a.body}
              </span>
              <DeleteButton action={deleteArgumentAction} fields={{ id: a.id, returnTo: back("arguments") }} />
            </li>
          ))}
        </ul>
        <form action={addArgumentAction} className="mt-4 grid gap-3 sm:grid-cols-12">
          <input type="hidden" name="debateId" value={debateId} />
          <input type="hidden" name="returnTo" value={back("arguments")} />
          <select name="kind" className="field sm:col-span-3" aria-label="Kind">
            <option value="argument">Argument</option>
            <option value="counterargument">Counterargument</option>
          </select>
          <select name="positionId" defaultValue="" className="field sm:col-span-3" aria-label="Made from position">
            <option value="">From position…</option>
            {s.positions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <select name="respondsToId" defaultValue="" className="field sm:col-span-6" aria-label="Responds to">
            <option value="">Responds to…</option>
            {s.args.map((a) => <option key={a.id} value={a.id}>{a.body.slice(0, 80)}</option>)}
          </select>
          <textarea name="body" rows={2} placeholder="The argument, stated fairly" className="field sm:col-span-10" aria-label="Argument" />
          <button type="submit" className="btn sm:col-span-2">Add</button>
        </form>
      </Panel>
    </>
  );
}
