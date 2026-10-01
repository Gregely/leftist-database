"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteEntryAction, transitionAction } from "@/app/admin/actions";
import type { Transition } from "@/lib/editorial/workflow";

export interface WorkflowAction {
  transition: Transition;
  label: string;
  tone: "primary" | "neutral" | "danger";
}

export interface DependencySummary {
  text: string;
  liveDependants: number;
  items: { id: string; title: string; kind: string; live: boolean }[];
}

const NOTE_REQUIRED: Transition[] = ["requestRevision", "reject"];
const NOTE_OPTIONAL: Transition[] = ["submit", "approve"];
const CONFIRM_DEPS: Transition[] = ["unpublish", "archive"];

const PROMPTS: Partial<Record<Transition, string>> = {
  submit: "A note for the reviewer (optional): what changed, what to look at.",
  requestRevision: "What needs to change? The contributor will see this note.",
  reject: "Why is this entry being rejected? The contributor will see this note.",
  approve: "Approval note (optional).",
};

/** Workflow controls. The server re-checks every transition; this only offers what the user may do. */
export function WorkflowBar({
  entityId,
  actions,
  canArchive,
  canDelete,
  errorCount,
  dependencies,
}: {
  entityId: string;
  actions: WorkflowAction[];
  canArchive: boolean;
  canDelete: boolean;
  errorCount: number;
  dependencies: DependencySummary;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [open, setOpen] = useState<Transition | "delete" | null>(null);
  const [note, setNote] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const all: WorkflowAction[] = [...actions, ...(canArchive ? [{ transition: "archive" as Transition, label: "Archive", tone: "danger" as const }] : [])];

  const fire = (t: Transition) =>
    start(async () => {
      const res = await transitionAction(entityId, t, note.trim() || undefined);
      if (res.ok) {
        setOpen(null);
        setNote("");
        setResult({ ok: true, message: DONE[t] });
        router.refresh();
      } else setResult({ ok: false, message: res.message });
    });

  const click = (t: Transition) => {
    setResult(null);
    if (NOTE_REQUIRED.includes(t) || NOTE_OPTIONAL.includes(t) || CONFIRM_DEPS.includes(t) || (t === "publish" && errorCount > 0)) setOpen(open === t ? null : t);
    else fire(t);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {all.map((a) => (
          <button
            key={a.transition}
            type="button"
            disabled={pending}
            onClick={() => click(a.transition)}
            aria-expanded={open === a.transition}
            className={`btn py-1.5 disabled:opacity-60 ${a.tone === "primary" ? "btn-red" : a.tone === "danger" ? "border-red text-red hover:bg-red hover:text-paper-warm" : ""}`}
          >
            {a.label}
          </button>
        ))}
        {canDelete && (
          <button type="button" onClick={() => setOpen(open === "delete" ? null : "delete")} className="label px-2 text-faint hover:text-red">
            Delete draft
          </button>
        )}
        {!all.length && !canDelete && <span className="text-sm text-muted">No workflow actions are available to you at this stage.</span>}
      </div>

      {result && (
        <p role={result.ok ? "status" : "alert"} className={`mt-3 border-l-2 px-3 py-1.5 text-sm ${result.ok ? "border-olive bg-olive/10" : "border-red bg-red/5 text-red-deep"}`}>
          {result.message}
        </p>
      )}

      {open && open !== "delete" && (
        <div className="mt-3 border border-ink bg-paper-warm p-4" role="group" aria-label={`${open} details`}>
          {open === "publish" && errorCount > 0 && (
            <p className="mb-3 border-l-2 border-red pl-3 text-sm text-red-deep">
              Structural checks report {errorCount} error{errorCount > 1 ? "s" : ""}. Publishing will be refused until they are fixed — see the checks panel.
            </p>
          )}
          {CONFIRM_DEPS.includes(open) && (
            <div className="mb-3 text-sm">
              <p className="label mb-1">{open === "archive" ? "Archive this entry?" : "Withdraw from the public site?"}</p>
              <p>{dependencies.text}</p>
              {dependencies.items.length > 0 && (
                <ul className="mt-2 max-h-40 overflow-y-auto text-xs text-muted">
                  {dependencies.items.slice(0, 40).map((d) => (
                    <li key={d.id}>
                      {d.title} <span className="label">{d.kind}</span>
                      {d.live ? "" : " (not public)"}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-xs text-faint">
                Links to it will read as plain text and it will leave search, maps and the timeline. Nothing is deleted; it can be restored.
              </p>
            </div>
          )}
          {(NOTE_REQUIRED.includes(open) || NOTE_OPTIONAL.includes(open)) && (
            <>
              <label htmlFor="wf-note" className="label mb-1 block">
                {PROMPTS[open]}
              </label>
              <textarea id="wf-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} className="field" />
            </>
          )}
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              disabled={pending || (NOTE_REQUIRED.includes(open) && !note.trim())}
              onClick={() => fire(open)}
              className="btn btn-red disabled:opacity-50"
            >
              {pending ? "Working…" : `Confirm: ${all.find((a) => a.transition === open)?.label ?? open}`}
            </button>
            <button type="button" onClick={() => setOpen(null)} className="label text-muted hover:text-ink">
              Cancel
            </button>
          </div>
        </div>
      )}

      {open === "delete" && (
        <div className="mt-3 border border-red bg-red/5 p-4 text-sm" role="group" aria-label="Delete draft">
          <p className="label text-red">Delete this draft permanently?</p>
          <p className="mt-1">It has never been published. Its revisions, notes and connections are removed with it. {dependencies.text}</p>
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const res = await deleteEntryAction(entityId);
                  if (res && !res.ok) setResult({ ok: false, message: res.message });
                })
              }
              className="btn border-red bg-red text-paper-warm"
            >
              Delete permanently
            </button>
            <button type="button" onClick={() => setOpen(null)} className="label text-muted hover:text-ink">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const DONE: Record<Transition, string> = {
  submit: "Submitted for review. Reviewers have been given it in their queue.",
  startReview: "You are now reviewing this entry.",
  requestRevision: "Revision requested — the note is with the contributor.",
  approve: "Approved. An editor can now publish it.",
  reject: "Rejected — the note is with the contributor.",
  publish: "Published. It is now in the public library, search, maps and timeline.",
  unpublish: "Unpublished. It has left the public site.",
  archive: "Archived. It has left the public site; nothing was deleted.",
  unarchive: "Restored from the archive.",
};
