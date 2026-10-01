"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  addArgumentAction,
  addPropositionAction,
  addStepAction,
  deleteArgumentAction,
  deletePositionAction,
  deletePropositionAction,
  deleteStepAction,
  linkPositionAction,
  moveStepAction,
  savePositionAction,
  setStancesAction,
  updateStepAction,
} from "@/app/admin/actions";
import { KINDS, STANCE_LABELS, STANCES, type EntityKind } from "@/lib/content/model";
import { EntityPicker, type PickedEntity } from "./EntityPicker";

type Result = { ok: boolean; message?: string };

function useAct() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const act = (fn: () => Promise<Result>, after?: () => void) =>
    start(async () => {
      const res = await fn();
      if (!res.ok) setMsg(res.message ?? "That did not work.");
      else {
        setMsg(null);
        after?.();
      }
      router.refresh();
    });
  const el = msg && (
    <p role="alert" className="border-l-2 border-red bg-red/5 px-3 py-1.5 text-sm text-red-deep">
      {msg}
    </p>
  );
  return { act, pending, el };
}

/* -------------------------------------------------------------------------- */
/* Debates                                                                     */
/* -------------------------------------------------------------------------- */

export interface DebateData {
  propositions: { id: string; statement: string }[];
  positions: {
    id: string;
    label: string;
    holder: PickedEntity | null;
    centralClaim: string;
    summary: string;
    assumptions: string[];
    criticisms: string[];
    links: { id: string; title: string; kind: EntityKind }[];
  }[];
  stances: { positionId: string; propositionId: string; stance: string; note: string }[];
  args: { id: string; kind: string; body: string; positionId: string | null; respondsToId: string | null }[];
}

function PositionForm({ debateId, p, onDone }: { debateId: string; p?: DebateData["positions"][number]; onDone?: () => void }) {
  const { act, pending, el } = useAct();
  const [holder, setHolder] = useState<PickedEntity | null>(p?.holder ?? null);
  const [f, setF] = useState({
    label: p?.label ?? "",
    centralClaim: p?.centralClaim ?? "",
    summary: p?.summary ?? "",
    assumptions: (p?.assumptions ?? []).join("\n"),
    criticisms: (p?.criticisms ?? []).join("\n"),
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <div className="grid gap-3 sm:grid-cols-6">
      <label className="sm:col-span-2">
        <span className="label mb-1 block text-faint">Label</span>
        <input value={f.label} onChange={set("label")} placeholder="e.g. Luxemburg" className="field" />
      </label>
      <div className="sm:col-span-4">
        <EntityPicker label="Held by (thinker or tendency)" value={holder} onChange={setHolder} kinds={["thinker", "tendency"]} />
      </div>
      <label className="sm:col-span-6">
        <span className="label mb-1 block text-faint">Central claim</span>
        <textarea value={f.centralClaim} onChange={set("centralClaim")} rows={2} className="field font-serif" />
      </label>
      <label className="sm:col-span-6">
        <span className="label mb-1 block text-faint">Short explanation</span>
        <textarea value={f.summary} onChange={set("summary")} rows={3} className="field" />
      </label>
      <label className="sm:col-span-3">
        <span className="label mb-1 block text-faint">Underlying assumptions — one per line</span>
        <textarea value={f.assumptions} onChange={set("assumptions")} rows={3} className="field" />
      </label>
      <label className="sm:col-span-3">
        <span className="label mb-1 block text-faint">Criticisms — one per line</span>
        <textarea value={f.criticisms} onChange={set("criticisms")} rows={3} className="field" />
      </label>
      <div className="sm:col-span-6">
        <button type="button" disabled={pending || !f.label.trim()} onClick={() => act(() => savePositionAction(debateId, p?.id ?? null, { ...f, holderId: holder?.id }), onDone)} className="btn btn-red disabled:opacity-50">
          {p ? "Save position" : "Add position"}
        </button>
        {el}
      </div>
    </div>
  );
}

export function DebateEditor({ debateId, data, canEdit }: { debateId: string; data: DebateData; canEdit: boolean }) {
  const { act, pending, el } = useAct();
  const [statement, setStatement] = useState("");
  const [adding, setAdding] = useState(false);
  const [link, setLink] = useState<Record<string, PickedEntity | null>>({});
  const [stances, setStances] = useState(() => Object.fromEntries(data.stances.map((s) => [`${s.positionId}:${s.propositionId}`, { stance: s.stance, note: s.note }])));
  const [arg, setArg] = useState({ kind: "argument" as "argument" | "counterargument", positionId: "", respondsToId: "", body: "" });

  return (
    <div className="space-y-12">
      {el}
      <section aria-labelledby="props-h">
        <h3 id="props-h" className="label mb-1 border-b border-ink pb-2 font-sans">
          Propositions · the axes of comparison
        </h3>
        <ol className="divide-y divide-rule">
          {data.propositions.map((p, i) => (
            <li key={p.id} className="flex items-baseline justify-between gap-3 py-2">
              <span>
                <span className="label-mono mr-3 text-red">{i + 1}</span>
                <span className="font-serif text-lg">{p.statement}</span>
              </span>
              {canEdit && (
                <button type="button" onClick={() => act(() => deletePropositionAction(debateId, p.id))} className="label text-faint hover:text-red">
                  Remove
                </button>
              )}
            </li>
          ))}
        </ol>
        {canEdit && (
          <div className="mt-3 flex gap-3">
            <label className="sr-only" htmlFor="new-prop">
              New proposition
            </label>
            <input id="new-prop" value={statement} onChange={(e) => setStatement(e.target.value)} placeholder="e.g. The state should ultimately disappear." className="field" />
            <button type="button" disabled={pending || !statement.trim()} onClick={() => act(() => addPropositionAction(debateId, statement), () => setStatement(""))} className="btn shrink-0 disabled:opacity-50">
              Add
            </button>
          </div>
        )}
      </section>

      <section aria-labelledby="pos-h">
        <h3 id="pos-h" className="label mb-3 border-b border-ink pb-2 font-sans">
          Positions · {data.positions.length}
        </h3>
        <div className="space-y-3">
          {data.positions.map((p) => (
            <details key={p.id} className="border border-rule bg-paper-warm">
              <summary className="flex cursor-pointer flex-wrap items-baseline justify-between gap-3 px-4 py-3">
                <span className="font-serif text-xl">{p.label}</span>
                <span className="label text-faint">
                  {p.holder?.title ?? "No holder"} · {p.links.length} linked
                </span>
              </summary>
              <div className="space-y-5 border-t border-rule p-4">
                {canEdit ? <PositionForm debateId={debateId} p={p} /> : <p className="font-serif">{p.centralClaim}</p>}
                <div>
                  <p className="label mb-2 text-faint">Key texts, concepts and events</p>
                  <ul className="flex flex-wrap gap-2">
                    {p.links.map((l) => (
                      <li key={l.id} className="inline-flex items-center gap-2 border border-rule px-2 py-0.5 text-sm">
                        {l.title} <span className="label text-faint">{KINDS[l.kind].label}</span>
                        {canEdit && (
                          <button type="button" onClick={() => act(() => linkPositionAction(debateId, p.id, l.id, true))} aria-label={`Unlink ${l.title}`} className="text-faint hover:text-red">
                            ✕
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                  {canEdit && (
                    <div className="mt-2 flex items-end gap-2">
                      <div className="flex-1">
                        <EntityPicker label="Link" value={link[p.id] ?? null} onChange={(e) => setLink({ ...link, [p.id]: e })} kinds={["text", "concept", "event"]} />
                      </div>
                      <button type="button" disabled={!link[p.id]} onClick={() => act(() => linkPositionAction(debateId, p.id, link[p.id]!.id), () => setLink({ ...link, [p.id]: null }))} className="btn shrink-0 disabled:opacity-50">
                        Link
                      </button>
                    </div>
                  )}
                </div>
                {canEdit && (
                  <button type="button" onClick={() => act(() => deletePositionAction(debateId, p.id))} className="label text-faint hover:text-red">
                    Delete position
                  </button>
                )}
              </div>
            </details>
          ))}
        </div>
        {canEdit &&
          (adding ? (
            <div className="mt-4 border border-dashed border-ink p-4">
              <PositionForm debateId={debateId} onDone={() => setAdding(false)} />
            </div>
          ) : (
            <button type="button" onClick={() => setAdding(true)} className="btn mt-4">
              + Add a position
            </button>
          ))}
      </section>

      {data.positions.length > 0 && data.propositions.length > 0 && (
        <section aria-labelledby="stance-h">
          <h3 id="stance-h" className="label mb-3 border-b border-ink pb-2 font-sans">
            Stance matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink">
                  <th scope="col" className="label py-2 pr-3 text-left font-medium text-faint">
                    Proposition
                  </th>
                  {data.positions.map((p) => (
                    <th key={p.id} scope="col" className="px-2 py-2 text-left font-serif font-normal">
                      {p.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.propositions.map((prop) => (
                  <tr key={prop.id} className="border-b border-rule align-top">
                    <th scope="row" className="py-2 pr-3 text-left font-serif font-normal">
                      {prop.statement}
                    </th>
                    {data.positions.map((p) => {
                      const k = `${p.id}:${prop.id}`;
                      const cell = stances[k] ?? { stance: "", note: "" };
                      return (
                        <td key={p.id} className="px-2 py-2">
                          <select
                            disabled={!canEdit}
                            value={cell.stance}
                            onChange={(e) => setStances({ ...stances, [k]: { ...cell, stance: e.target.value } })}
                            className="field py-1 text-xs"
                            aria-label={`${p.label} on: ${prop.statement}`}
                          >
                            <option value="">—</option>
                            {STANCES.map((s) => (
                              <option key={s} value={s}>
                                {STANCE_LABELS[s]}
                              </option>
                            ))}
                          </select>
                          <input
                            disabled={!canEdit}
                            value={cell.note}
                            onChange={(e) => setStances({ ...stances, [k]: { ...cell, note: e.target.value } })}
                            placeholder="note"
                            className="field mt-1 py-1 text-xs"
                            aria-label={`Note: ${p.label} on ${prop.statement}`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {canEdit && (
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                act(() =>
                  setStancesAction(
                    debateId,
                    Object.entries(stances).map(([k, v]) => {
                      const [positionId, propositionId] = k.split(":");
                      return { positionId, propositionId, stance: v.stance, note: v.note };
                    }),
                  ),
                )
              }
              className="btn btn-red mt-4"
            >
              Save stances
            </button>
          )}
        </section>
      )}

      <section aria-labelledby="args-h">
        <h3 id="args-h" className="label mb-3 border-b border-ink pb-2 font-sans">
          Arguments &amp; counterarguments
        </h3>
        <ul className="space-y-2">
          {data.args.map((a) => (
            <li key={a.id} className={`flex items-baseline justify-between gap-4 border-l-2 pl-3 ${a.kind === "counterargument" ? "ml-6 border-red" : "border-ink"}`}>
              <span className="text-sm">
                <span className="label mr-2 text-faint">
                  {a.kind}
                  {a.positionId ? ` · ${data.positions.find((p) => p.id === a.positionId)?.label ?? ""}` : ""}
                </span>
                {a.body}
              </span>
              {canEdit && (
                <button type="button" onClick={() => act(() => deleteArgumentAction(debateId, a.id))} className="label text-faint hover:text-red">
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
        {canEdit && (
          <div className="mt-4 grid gap-3 sm:grid-cols-12">
            <select value={arg.kind} onChange={(e) => setArg({ ...arg, kind: e.target.value as typeof arg.kind })} className="field sm:col-span-3" aria-label="Kind">
              <option value="argument">Argument</option>
              <option value="counterargument">Counterargument</option>
            </select>
            <select value={arg.positionId} onChange={(e) => setArg({ ...arg, positionId: e.target.value })} className="field sm:col-span-3" aria-label="From position">
              <option value="">From position…</option>
              {data.positions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <select value={arg.respondsToId} onChange={(e) => setArg({ ...arg, respondsToId: e.target.value })} className="field sm:col-span-6" aria-label="Responds to">
              <option value="">Responds to…</option>
              {data.args.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.body.slice(0, 80)}
                </option>
              ))}
            </select>
            <textarea value={arg.body} onChange={(e) => setArg({ ...arg, body: e.target.value })} rows={2} placeholder="The argument, stated fairly" className="field sm:col-span-10" aria-label="Argument" />
            <button type="button" disabled={!arg.body.trim() || pending} onClick={() => act(() => addArgumentAction(debateId, arg), () => setArg({ ...arg, body: "" }))} className="btn sm:col-span-2 disabled:opacity-50">
              Add
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Learning paths                                                              */
/* -------------------------------------------------------------------------- */

export interface PathStepRow {
  id: string;
  position: number;
  framing: string;
  track: "main" | "branch" | "alternative";
  parentStepId: string | null;
  entity: { id: string; title: string; kind: EntityKind; live: boolean };
}

export function PathEditor({ pathId, steps, canEdit }: { pathId: string; steps: PathStepRow[]; canEdit: boolean }) {
  const { act, pending, el } = useAct();
  const main = steps.filter((s) => s.track === "main");
  const [entity, setEntity] = useState<PickedEntity | null>(null);
  const [framing, setFraming] = useState("");
  const [track, setTrack] = useState<"main" | "branch" | "alternative">("main");
  const [parent, setParent] = useState("");
  const [k, setK] = useState(0);
  const [framings, setFramings] = useState<Record<string, string>>(Object.fromEntries(steps.map((s) => [s.id, s.framing])));

  const row = (s: PathStepRow, i?: number) => (
    <li key={s.id} className={`grid items-start gap-3 py-3 sm:grid-cols-[3rem_14rem_1fr_auto] ${s.track !== "main" ? "border-l-2 border-red pl-3 sm:ml-12" : ""}`}>
      <span className="numeral text-2xl text-red">{s.track === "main" ? String((i ?? 0) + 1).padStart(2, "0") : "↳"}</span>
      <span>
        <span className="font-serif text-lg">{s.entity.title}</span>
        <span className="label block text-faint">
          {s.track !== "main" ? `${s.track} · ` : ""}
          {KINDS[s.entity.kind].label}
          {!s.entity.live && " · not public"}
        </span>
      </span>
      <span className="flex gap-2">
        <label className="sr-only" htmlFor={`fr-${s.id}`}>
          Why this stop
        </label>
        <input
          id={`fr-${s.id}`}
          disabled={!canEdit}
          value={framings[s.id] ?? ""}
          onChange={(e) => setFramings({ ...framings, [s.id]: e.target.value })}
          className="field text-sm"
        />
        {canEdit && framings[s.id] !== s.framing && (
          <button type="button" onClick={() => act(() => updateStepAction(pathId, s.id, framings[s.id]))} className="label text-red">
            Save
          </button>
        )}
      </span>
      {canEdit && (
        <span className="flex gap-3">
          {s.track === "main" && i! > 0 && (
            <button type="button" onClick={() => act(() => moveStepAction(pathId, s.id, -1))} className="label text-muted hover:text-ink" aria-label={`Move ${s.entity.title} up`}>
              ↑
            </button>
          )}
          {s.track === "main" && i! < main.length - 1 && (
            <button type="button" onClick={() => act(() => moveStepAction(pathId, s.id, 1))} className="label text-muted hover:text-ink" aria-label={`Move ${s.entity.title} down`}>
              ↓
            </button>
          )}
          <button type="button" onClick={() => act(() => deleteStepAction(pathId, s.id))} className="label text-faint hover:text-red" aria-label={`Remove ${s.entity.title}`}>
            Remove
          </button>
        </span>
      )}
    </li>
  );

  return (
    <div className="space-y-6">
      {el}
      <ol className="divide-y divide-rule border-y border-rule">
        {main.flatMap((s, i) => [row(s, i), ...steps.filter((b) => b.parentStepId === s.id).map((b) => row(b))])}
      </ol>
      {canEdit && (
        <div key={k} className="grid gap-3 border border-ink bg-paper-warm p-4 sm:grid-cols-12">
          <div className="sm:col-span-5">
            <EntityPicker label="Add a stop" value={entity} onChange={setEntity} />
          </div>
          <label className="sm:col-span-3">
            <span className="label mb-1 block text-faint">Route</span>
            <select value={track} onChange={(e) => setTrack(e.target.value as typeof track)} className="field">
              <option value="main">Main route</option>
              <option value="branch">Branch from a stop</option>
              <option value="alternative">Alternative to a stop</option>
            </select>
          </label>
          {track !== "main" && (
            <label className="sm:col-span-4">
              <span className="label mb-1 block text-faint">Leaves from</span>
              <select value={parent} onChange={(e) => setParent(e.target.value)} className="field">
                <option value="">Choose a stop…</option>
                {main.map((s, i) => (
                  <option key={s.id} value={s.id}>
                    {i + 1}. {s.entity.title}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="sm:col-span-12">
            <span className="label mb-1 block text-faint">Why this stop?</span>
            <input value={framing} onChange={(e) => setFraming(e.target.value)} className="field" />
          </label>
          <div className="sm:col-span-12">
            <button
              type="button"
              disabled={!entity || pending || (track !== "main" && !parent)}
              onClick={() =>
                act(
                  () => addStepAction(pathId, { entityId: entity!.id, framing, track, parentStepId: parent || undefined }),
                  () => {
                    setEntity(null);
                    setFraming("");
                    setK((x) => x + 1);
                  },
                )
              }
              className="btn btn-red disabled:opacity-50"
            >
              Add stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
