"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addCitationAction, addExcerptAction, removeCitationAction, removeExcerptAction, updateExcerptAction } from "@/app/admin/actions";
import { EXCERPT_VERIFICATION, SOURCE_TYPE_LABELS, VERIFICATION_LABELS, type ExcerptVerification, type SourceType } from "@/lib/content/model";
import { EntityPicker, type PickedEntity } from "./EntityPicker";
import { SourcePicker, type PickedSource } from "./SourcePicker";

export interface CitationRow {
  id: string;
  field: string | null;
  locator: string | null;
  note: string;
  source: { id: string; title: string; author: string; publicationDate: string | null; sourceType: SourceType; gaps: string[] };
}

export interface ExcerptRow {
  id: string;
  body: string;
  locator: string | null;
  note: string;
  verification: ExcerptVerification;
  text: { id: string; title: string } | null;
  speaker: { id: string; title: string } | null;
  source: { id: string; title: string } | null;
}

function useMsg() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const el = msg && (
    <p role={msg.ok ? "status" : "alert"} className={`border-l-2 px-3 py-1.5 text-sm ${msg.ok ? "border-olive bg-olive/10" : "border-red bg-red/5 text-red-deep"}`}>
      {msg.text}
    </p>
  );
  return [el, setMsg] as const;
}

/** Sources attached to the entry. Inline citations in the prose appear here too (marked "inline"). */
export function CitationsPanel({ entityId, citations, canEdit }: { entityId: string; citations: CitationRow[]; canEdit: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [source, setSource] = useState<PickedSource | null>(null);
  const [locator, setLocator] = useState("");
  const [note, setNote] = useState("");
  const [msgEl, setMsg] = useMsg();
  const [k, setK] = useState(0);
  return (
    <div className="space-y-5">
      {citations.length === 0 ? (
        <p className="border border-dashed border-rule px-4 py-4 text-sm italic text-muted">No sources yet. Every entry should be traceable to sources.</p>
      ) : (
        <ol className="divide-y divide-rule border-y border-rule">
          {citations.map((c, i) => (
            <li key={c.id} className="flex flex-wrap items-baseline justify-between gap-3 py-2.5">
              <span className="min-w-0 text-sm">
                <span className="label-mono mr-2 text-red">{i + 1}.</span>
                {c.source.author && <span>{c.source.author}, </span>}
                <a href={`/admin/sources/${c.source.id}`} className="font-serif text-base italic hover:text-red">
                  {c.source.title}
                </a>
                {c.source.publicationDate && <span className="text-muted"> ({c.source.publicationDate})</span>}
                {c.locator && <span>, {c.locator}</span>}
                <span className="label ml-2 text-faint">{SOURCE_TYPE_LABELS[c.source.sourceType]}</span>
                {c.field === "inline" && <span className="label ml-2 text-olive">cited in text</span>}
                {c.source.gaps.length > 0 && <span className="label ml-2 text-ochre">missing {c.source.gaps.join(", ")}</span>}
                {c.note && <span className="block text-muted">{c.note}</span>}
              </span>
              {canEdit && c.field !== "inline" && (
                <button
                  type="button"
                  onClick={() =>
                    start(async () => {
                      const res = await removeCitationAction(c.id);
                      if (!res.ok) setMsg({ ok: false, text: res.message });
                      router.refresh();
                    })
                  }
                  className="label text-faint hover:text-red"
                >
                  Detach
                </button>
              )}
            </li>
          ))}
        </ol>
      )}
      {canEdit && (
        <div key={k} className="border border-ink bg-paper-warm p-4" role="group" aria-label="Attach a source">
          <p className="label mb-3">Attach a source to this entry</p>
          <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
            <SourcePicker value={source} onChange={setSource} />
            <label>
              <span className="label mb-1 block text-faint">Page / chapter</span>
              <input value={locator} onChange={(e) => setLocator(e.target.value)} className="field" />
            </label>
            <label className="sm:col-span-2">
              <span className="label mb-1 block text-faint">What it supports (optional)</span>
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. dates and early career" className="field" />
            </label>
          </div>
          <button
            type="button"
            disabled={!source || pending}
            onClick={() =>
              start(async () => {
                const res = await addCitationAction(entityId, { sourceId: source!.id, locator, note });
                if (res.ok) {
                  setMsg({ ok: true, text: `Attached “${source!.title}”.` });
                  setSource(null);
                  setLocator("");
                  setNote("");
                  setK((x) => x + 1);
                  router.refresh();
                } else setMsg({ ok: false, text: res.message });
              })
            }
            className="btn btn-red mt-4 disabled:opacity-50"
          >
            Attach source
          </button>
          <p className="mt-2 text-xs text-faint">To cite a specific passage, use Cite in the text editor — it becomes a numbered footnote.</p>
        </div>
      )}
      {msgEl}
    </div>
  );
}

/** Quotations and passage references, each with an edition and a verification status. Never invent quotations. */
export function ExcerptsPanel({ entityId, excerpts, canEdit, canVerify }: { entityId: string; excerpts: ExcerptRow[]; canEdit: boolean; canVerify: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msgEl, setMsg] = useMsg();
  const [k, setK] = useState(0);
  const [body, setBody] = useState("");
  const [text, setText] = useState<PickedEntity | null>(null);
  const [speaker, setSpeaker] = useState<PickedEntity | null>(null);
  const [source, setSource] = useState<PickedSource | null>(null);
  const [locator, setLocator] = useState("");
  const [note, setNote] = useState("");
  const [verification, setVerification] = useState<ExcerptVerification>("unverified");
  const statuses = EXCERPT_VERIFICATION.filter((v) => canVerify || v !== "verified");

  return (
    <div className="space-y-5">
      {excerpts.length === 0 ? (
        <p className="border border-dashed border-rule px-4 py-4 text-sm italic text-muted">No excerpts yet.</p>
      ) : (
        <ol className="space-y-4">
          {excerpts.map((x) => (
            <li key={x.id} className="border-l-2 border-red pl-4">
              {x.body ? <p className="font-serif text-lg leading-snug">“{x.body}”</p> : <p className="text-sm italic text-muted">Passage reference (no quotation)</p>}
              <p className="mt-1 text-sm text-muted">
                {x.speaker && <span>{x.speaker.title} · </span>}
                {x.text && <span className="italic">{x.text.title}</span>}
                {x.locator && <span>, {x.locator}</span>}
                {x.source && <span> · edition: {x.source.title}</span>}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <label className="sr-only" htmlFor={`ver-${x.id}`}>
                  Verification status
                </label>
                {canEdit || canVerify ? (
                  <select
                    id={`ver-${x.id}`}
                    value={x.verification}
                    disabled={pending}
                    onChange={(e) =>
                      start(async () => {
                        const res = await updateExcerptAction(x.id, { verification: e.target.value });
                        if (!res.ok) setMsg({ ok: false, text: res.message });
                        router.refresh();
                      })
                    }
                    className={`field w-auto py-1 text-xs ${x.verification === "verified" ? "text-olive" : "text-red-deep"}`}
                  >
                    {EXCERPT_VERIFICATION.map((v) => (
                      <option key={v} value={v} disabled={v === "verified" && !canVerify}>
                        {VERIFICATION_LABELS[v]}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="label">{VERIFICATION_LABELS[x.verification]}</span>
                )}
                <span className="label-mono text-faint" title="Embed in prose with the Excerpt tool">
                  {x.id}
                </span>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() =>
                      start(async () => {
                        const res = await removeExcerptAction(x.id);
                        if (!res.ok) setMsg({ ok: false, text: res.message });
                        router.refresh();
                      })
                    }
                    className="label text-faint hover:text-red"
                  >
                    Remove
                  </button>
                )}
              </div>
              {x.note && <p className="mt-1 text-xs text-faint">{x.note}</p>}
            </li>
          ))}
        </ol>
      )}
      {canEdit && (
        <div key={k} className="border border-ink bg-paper-warm p-4" role="group" aria-label="Add an excerpt">
          <p className="label mb-1">Add an excerpt</p>
          <p className="mb-3 text-xs text-muted">Quote only from an edition you have in front of you. Leave the quotation empty to record a passage reference instead.</p>
          <label className="block">
            <span className="label mb-1 block text-faint">Quotation</span>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} className="field font-serif" />
          </label>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <EntityPicker label="Author (who said or wrote it)" value={speaker} onChange={setSpeaker} kinds={["thinker"]} />
            <EntityPicker label="From text" value={text} onChange={setText} kinds={["text"]} />
            <SourcePicker label="Edition (source)" value={source} onChange={setSource} />
            <label>
              <span className="label mb-1 block text-faint">Page / chapter</span>
              <input value={locator} onChange={(e) => setLocator(e.target.value)} className="field" />
            </label>
            <label>
              <span className="label mb-1 block text-faint">Verification</span>
              <select value={verification} onChange={(e) => setVerification(e.target.value as ExcerptVerification)} className="field">
                {statuses.map((v) => (
                  <option key={v} value={v}>
                    {VERIFICATION_LABELS[v]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="label mb-1 block text-faint">Editorial note</span>
              <input value={note} onChange={(e) => setNote(e.target.value)} className="field" />
            </label>
          </div>
          <button
            type="button"
            disabled={pending || (!body.trim() && !locator.trim())}
            onClick={() =>
              start(async () => {
                const res = await addExcerptAction(entityId, { body, textId: text?.id, speakerId: speaker?.id, sourceId: source?.id, locator, note, verification });
                if (res.ok) {
                  setMsg({ ok: true, text: "Excerpt added." });
                  setBody("");
                  setText(null);
                  setSpeaker(null);
                  setSource(null);
                  setLocator("");
                  setNote("");
                  setVerification("unverified");
                  setK((x) => x + 1);
                  router.refresh();
                } else setMsg({ ok: false, text: res.message });
              })
            }
            className="btn btn-red mt-4 disabled:opacity-50"
          >
            Add excerpt
          </button>
        </div>
      )}
      {msgEl}
    </div>
  );
}
