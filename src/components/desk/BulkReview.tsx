"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { bulkTransitionAction } from "@/app/admin/actions";
import type { BulkOutcome, BulkTransition } from "@/lib/editorial/bulk";
import type { DeskRow } from "@/lib/editorial/queries";
import { ContentTable } from "./ContentTable";

export type BulkOptions = Record<string, { lockVersion: number; actions: BulkTransition[] }>;

/** Display order and wording; the server decides what each entry allows. */
const ACTIONS: { t: BulkTransition; label: string; tone: "primary" | "neutral" }[] = [
  { t: "startReview", label: "Start review", tone: "neutral" },
  { t: "requestRevision", label: "Request revision", tone: "neutral" },
  { t: "approve", label: "Approve", tone: "primary" },
  { t: "publish", label: "Publish", tone: "primary" },
];

const DONE: Record<BulkTransition, string> = {
  startReview: "moved to review",
  requestRevision: "sent back for revision",
  approve: "approved",
  publish: "published",
};

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/**
 * A listing with row selection and the review/publish workflow actions applied
 * to the selected entries. Every entry still goes through its own transition
 * on the server; this only collects the selection and asks for confirmation.
 */
export function BulkReview({ rows, options, empty, compact, scope }: { rows: DeskRow[]; options: BulkOptions; empty?: string; compact?: boolean; scope: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<BulkTransition | null>(null);
  const [note, setNote] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string; outcomes?: BulkOutcome[] } | null>(null);

  const selectable = rows.filter((r) => (options[r.id]?.actions.length ?? 0) > 0);
  const chosen = rows.filter((r) => selected.has(r.id));
  const eligible = (t: BulkTransition) => chosen.filter((r) => options[r.id]?.actions.includes(t));
  const target = open ? eligible(open) : [];
  const skipped = open ? chosen.filter((r) => !options[r.id]?.actions.includes(open)) : [];
  const openFlags = target.reduce((n, r) => n + r.openNotes, 0);
  const flaggedEntries = target.filter((r) => r.openNotes > 0).length;
  const allOnPage = selectable.length > 0 && selectable.every((r) => selected.has(r.id));

  const selection = useMemo(
    () => ({
      isSelected: (id: string) => selected.has(id),
      isSelectable: (id: string) => (options[id]?.actions.length ?? 0) > 0,
      toggle: (id: string) => {
        setResult(null);
        setOpen(null);
        setSelected((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
      },
    }),
    [selected, options],
  );

  const reset = () => {
    setOpen(null);
    setNote("");
    setConfirmText("");
  };

  const toggleAll = () => {
    setResult(null);
    setOpen(null);
    setSelected(allOnPage ? new Set() : new Set(selectable.map((r) => r.id)));
  };

  const confirm = (t: BulkTransition) =>
    start(async () => {
      const items = eligible(t).map((r) => ({ id: r.id, lockVersion: options[r.id].lockVersion }));
      const res = await bulkTransitionAction(items, t, {
        note: note.trim() || undefined,
        confirmCount: t === "publish" ? Number(confirmText.trim()) : undefined,
      });
      if (!res.ok) {
        setResult({ ok: false, message: res.message });
        return;
      }
      const outcomes = res.data ?? [];
      const done = outcomes.filter((o) => o.ok);
      setResult({
        ok: done.length > 0,
        message: `${plural(done.length, "entry", "entries")} ${DONE[t]}.${outcomes.length > done.length ? ` ${outcomes.length - done.length} could not be — see below.` : ""}`,
        outcomes,
      });
      // Keep anything that was not processed selected, so it can be looked at.
      setSelected(new Set(outcomes.filter((o) => !o.ok).map((o) => o.id)));
      reset();
      router.refresh();
    });

  const publishCountOk = Number(confirmText.trim()) === target.length && target.length > 0;

  return (
    <div data-bulk-scope={scope}>
      {selectable.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-rule bg-paper-warm px-3 py-2" role="toolbar" aria-label={`Bulk actions: ${scope}`}>
          <label className="label flex items-center gap-2 text-muted">
            <input type="checkbox" className="h-4 w-4 accent-red" checked={allOnPage} onChange={toggleAll} />
            Select all {selectable.length} on this page
          </label>
          <span className="label-mono text-faint" aria-live="polite">
            {chosen.length ? `${chosen.length} selected` : "None selected"}
          </span>
          {chosen.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {ACTIONS.filter((a) => eligible(a.t).length > 0).map((a) => {
                const n = eligible(a.t).length;
                return (
                  <button
                    key={a.t}
                    type="button"
                    disabled={pending}
                    aria-expanded={open === a.t}
                    onClick={() => {
                      setResult(null);
                      setNote("");
                      setConfirmText("");
                      setOpen(open === a.t ? null : a.t);
                    }}
                    className={`btn py-1 text-sm disabled:opacity-60 ${a.tone === "primary" ? "btn-red" : ""}`}
                  >
                    {a.label} {n < chosen.length ? `(${n} of ${chosen.length})` : `(${n})`}
                  </button>
                );
              })}
              <button type="button" onClick={() => setSelected(new Set())} className="label px-1 text-faint hover:text-red">
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}

      {open && (
        <div className="mb-4 border border-ink bg-paper-warm p-4 text-sm" role="dialog" aria-label={`Confirm: ${ACTIONS.find((a) => a.t === open)?.label}`}>
          <p className="label mb-2">
            {ACTIONS.find((a) => a.t === open)?.label} {plural(target.length, "entry", "entries")}?
          </p>
          <p>Only the entries listed here are changed. Each goes through its own workflow step, with its own history and audit entry.</p>
          <ul className="mt-2 max-h-48 overflow-y-auto border-l-2 border-rule pl-3 text-xs" aria-label="Entries to be changed">
            {target.map((r) => (
              <li key={r.id}>
                {r.title}
                {r.live && <span className="label ml-2 text-faint">{open === "publish" ? "replaces the public version" : "live"}</span>}
                {r.openNotes > 0 && <span className="label ml-2 text-red">✎ {r.openNotes}</span>}
              </li>
            ))}
          </ul>
          {skipped.length > 0 && (
            <p className="mt-2 text-xs text-muted">
              {plural(skipped.length, "selected entry is", "selected entries are")} not in a state where this applies and will be left as they are.
            </p>
          )}
          {(open === "approve" || open === "publish") && flaggedEntries > 0 && (
            <p className="mt-3 border-l-2 border-ochre pl-3">
              {plural(flaggedEntries, "of these entries has", "of these entries have")} open notes or flags ({openFlags} in all). They stay open: {open === "approve" ? "approving" : "publishing"} does not resolve or remove them.
            </p>
          )}
          {open === "approve" && <p className="mt-2 text-xs text-faint">Approval does not publish anything. Publishing is a separate step for editors.</p>}
          {open === "publish" && (
            <div className="mt-3 border-l-2 border-red pl-3">
              <p className="text-red-deep">
                Publishing makes {target.length === 1 ? "this entry" : `these ${target.length} entries`} public at once: pages, search, maps and timelines
                {target.some((r) => r.live) ? `, replacing the public version of ${plural(target.filter((r) => r.live).length, "entry", "entries")}` : ""}. An entry whose structural checks report errors is
                refused and left unpublished.
              </p>
              <label htmlFor={`bulk-confirm-${scope}`} className="label mt-3 block">
                Type {target.length} to confirm
              </label>
              <input
                id={`bulk-confirm-${scope}`}
                inputMode="numeric"
                autoComplete="off"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="field mt-1 w-28 py-1"
              />
            </div>
          )}
          {(open === "requestRevision" || open === "approve") && (
            <div className="mt-3">
              <label htmlFor={`bulk-note-${scope}`} className="label mb-1 block">
                {open === "requestRevision" ? "What needs to change? Every selected entry receives this note." : "Approval note (optional) — added to each entry; existing notes are untouched."}
              </label>
              <textarea id={`bulk-note-${scope}`} rows={3} value={note} onChange={(e) => setNote(e.target.value)} className="field" />
            </div>
          )}
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              disabled={pending || !target.length || (open === "requestRevision" && !note.trim()) || (open === "publish" && !publishCountOk)}
              onClick={() => confirm(open)}
              className="btn btn-red disabled:opacity-50"
            >
              {pending ? "Working…" : `${ACTIONS.find((a) => a.t === open)?.label} ${plural(target.length, "entry", "entries")}`}
            </button>
            <button type="button" onClick={reset} className="label text-muted hover:text-ink">
              Cancel
            </button>
          </div>
        </div>
      )}

      {result && (
        <div role={result.ok ? "status" : "alert"} className={`mb-4 border-l-2 px-3 py-2 text-sm ${result.ok ? "border-olive bg-olive/10" : "border-red bg-red/5 text-red-deep"}`}>
          <p>{result.message}</p>
          {result.outcomes?.some((o) => !o.ok) && (
            <ul className="mt-1 text-xs">
              {result.outcomes
                .filter((o) => !o.ok)
                .map((o) => (
                  <li key={o.id}>
                    <a href={`/admin/entries/${o.id}`} className="underline hover:text-red">
                      {o.title}
                    </a>{" "}
                    — {o.reason}
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}

      <ContentTable rows={rows} empty={empty} compact={compact} selection={selectable.length ? selection : undefined} />
    </div>
  );
}
