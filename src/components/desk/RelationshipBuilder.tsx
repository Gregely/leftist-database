"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addRelationshipAction, deleteRelationshipAction } from "@/app/admin/actions";
import {
  ALL_RELATIONSHIP_TYPES,
  KINDS,
  RELATIONSHIP_TYPES,
  STATUS_LABELS,
  relationshipTypeLabel as typeLabel,
  type AnyRelationshipType,
  type EntityKind,
  type RelationshipType,
  type WorkflowStatus,
} from "@/lib/content/model";
import { EntityPicker, type PickedEntity } from "./EntityPicker";
import { SourcePicker, type PickedSource } from "./SourcePicker";

export interface ExistingRelationship {
  id: string;
  type: RelationshipType;
  direction: "out" | "in";
  note: string;
  weight: number;
  yearStart: number | null;
  yearEnd: number | null;
  sourceTitle: string | null;
  locator: string | null;
  other: { id: string; title: string; kind: EntityKind; live: boolean; status: WorkflowStatus };
  canDelete: boolean;
}


/**
 * FROM — TYPE — TO, with note, dates, context and source. Inverse phrasings
 * ("influenced by") are offered and stored canonically by the server.
 */
export function RelationshipBuilder({
  from,
  existing = [],
  canEdit,
  global = false,
}: {
  /** The entry being edited; omitted on the global relationships page. */
  from?: PickedEntity;
  existing?: ExistingRelationship[];
  canEdit: boolean;
  global?: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [fromEntity, setFrom] = useState<PickedEntity | null>(from ?? null);
  const [type, setType] = useState<AnyRelationshipType>("INFLUENCED");
  const [to, setTo] = useState<PickedEntity | null>(null);
  const [note, setNote] = useState("");
  const [context, setContext] = useState("");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [weight, setWeight] = useState("2");
  const [source, setSource] = useState<PickedSource | null>(null);
  const [locator, setLocator] = useState("");
  const [more, setMore] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [formKey, setFormKey] = useState(0);

  const sentence = fromEntity && to ? `${fromEntity.title} ${typeLabel(type)} ${to.title}` : null;

  const add = () =>
    start(async () => {
      if (!fromEntity || !to) return;
      const res = await addRelationshipAction(global ? null : from!.id, {
        fromId: fromEntity.id,
        type,
        toId: to.id,
        note,
        context,
        yearStart,
        yearEnd,
        weight: Number(weight),
        sourceId: source?.id,
        locator,
      });
      if (res.ok) {
        setMsg({ ok: true, text: `Added: ${sentence}.` });
        setTo(null);
        setNote("");
        setContext("");
        setYearStart("");
        setYearEnd("");
        setSource(null);
        setLocator("");
        setFormKey((k) => k + 1);
        if (global) setFrom(null);
        router.refresh();
      } else setMsg({ ok: false, text: res.message });
    });

  const groups = new Map<string, ExistingRelationship[]>();
  for (const r of existing) {
    const label = r.direction === "out" || RELATIONSHIP_TYPES[r.type].symmetric ? RELATIONSHIP_TYPES[r.type].label : RELATIONSHIP_TYPES[r.type].inverseLabel;
    groups.set(label, [...(groups.get(label) ?? []), r]);
  }

  return (
    <div className="space-y-8">
      {canEdit && (
        <div key={formKey} className="border border-ink bg-paper-warm" role="group" aria-label="Add a relationship">
          <div className="grid gap-0 lg:grid-cols-[1fr_15rem_1fr]">
            <div className="border-b border-rule p-4 lg:border-b-0 lg:border-r">
              {global ? (
                <EntityPicker label="From" value={fromEntity} onChange={setFrom} />
              ) : (
                <>
                  <p className="label mb-1 text-faint">From</p>
                  <p className="field border-ink font-serif">{from?.title}</p>
                </>
              )}
            </div>
            <div className="border-b border-rule p-4 lg:border-b-0 lg:border-r">
              <label htmlFor={`rel-type-${formKey}`} className="label mb-1 block text-faint">
                Type
              </label>
              <select id={`rel-type-${formKey}`} value={type} onChange={(e) => setType(e.target.value as AnyRelationshipType)} className="field">
                {ALL_RELATIONSHIP_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {typeLabel(t)}
                  </option>
                ))}
              </select>
            </div>
            <div className="p-4">
              <EntityPicker label="To" value={to} onChange={setTo} exclude={fromEntity ? [fromEntity.id] : []} />
            </div>
          </div>
          <div className="border-t border-rule p-4">
            <label htmlFor={`rel-note-${formKey}`} className="label mb-1 block text-faint">
              Note
            </label>
            <input id={`rel-note-${formKey}`} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. via The Poverty of Philosophy (1847)" className="field" />
            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_10rem]">
              <SourcePicker label="Source" value={source} onChange={setSource} />
              <label>
                <span className="label mb-1 block text-faint">Page / chapter</span>
                <input value={locator} onChange={(e) => setLocator(e.target.value)} className="field" />
              </label>
            </div>
            <button type="button" onClick={() => setMore((m) => !m)} aria-expanded={more} className="label mt-4 text-muted hover:text-ink">
              {more ? "− Fewer details" : "+ Dates, context, weight"}
            </button>
            {more && (
              <div className="mt-3 grid gap-4 sm:grid-cols-4">
                <label>
                  <span className="label mb-1 block text-faint">From year</span>
                  <input value={yearStart} onChange={(e) => setYearStart(e.target.value)} inputMode="numeric" className="field" />
                </label>
                <label>
                  <span className="label mb-1 block text-faint">To year</span>
                  <input value={yearEnd} onChange={(e) => setYearEnd(e.target.value)} inputMode="numeric" className="field" />
                </label>
                <label className="sm:col-span-2">
                  <span className="label mb-1 block text-faint">Weight</span>
                  <select value={weight} onChange={(e) => setWeight(e.target.value)} className="field">
                    <option value="1">Minor</option>
                    <option value="2">Significant</option>
                    <option value="3">Defining</option>
                  </select>
                </label>
                <label className="sm:col-span-4">
                  <span className="label mb-1 block text-faint">Context</span>
                  <textarea value={context} onChange={(e) => setContext(e.target.value)} rows={2} className="field" />
                </label>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 border-t border-ink px-4 py-3">
            <button type="button" onClick={add} disabled={pending || !fromEntity || !to} className="btn btn-red disabled:opacity-50">
              {pending ? "Adding…" : "Add relationship"}
            </button>
            {sentence && (
              <p className="font-serif text-lg">
                {sentence}
                <span className="text-red">.</span>
              </p>
            )}
          </div>
        </div>
      )}
      {msg && (
        <p role={msg.ok ? "status" : "alert"} className={`border-l-2 px-3 py-1.5 text-sm ${msg.ok ? "border-olive bg-olive/10" : "border-red bg-red/5 text-red-deep"}`}>
          {msg.text}
        </p>
      )}

      {!global && (
        <div>
          {existing.length === 0 ? (
            <p className="border border-dashed border-rule px-4 py-5 text-sm italic text-muted">No relationships yet. Connections are what put an entry on the map.</p>
          ) : (
            <div className="space-y-6">
              {[...groups.entries()].map(([label, rels]) => (
                <div key={label}>
                  <h3 className="label mb-1 border-b border-rule pb-1 font-sans text-faint">{label}</h3>
                  <ul>
                    {rels.map((r) => (
                      <li key={r.id + r.direction} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule-soft py-2">
                        <span>
                          <a href={`/admin/entries/${r.other.id}`} className="font-serif text-lg hover:text-red">
                            {r.other.title}
                          </a>
                          <span className="label ml-2 text-faint">{KINDS[r.other.kind].label}</span>
                          {!r.other.live && <span className="label ml-2 text-ochre">{STATUS_LABELS[r.other.status]} · not public</span>}
                          {r.note && <span className="block text-sm text-muted">{r.note}</span>}
                          {(r.sourceTitle || r.yearStart) && (
                            <span className="label-mono block text-faint">
                              {r.yearStart ? `${r.yearStart}${r.yearEnd ? `–${r.yearEnd}` : ""} · ` : ""}
                              {r.sourceTitle ? `source: ${r.sourceTitle}${r.locator ? `, ${r.locator}` : ""}` : ""}
                            </span>
                          )}
                        </span>
                        {r.canDelete && (
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() =>
                              start(async () => {
                                const res = await deleteRelationshipAction(r.id);
                                if (!res.ok) setMsg({ ok: false, text: res.message });
                                router.refresh();
                              })
                            }
                            className="label text-faint hover:text-red"
                            aria-label={`Remove relationship with ${r.other.title}`}
                          >
                            Remove
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
