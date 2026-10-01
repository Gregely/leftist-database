"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addNoteAction, resolveNoteAction } from "@/app/admin/actions";

export interface NoteRow {
  id: string;
  kind: string;
  field: string | null;
  fieldLabel: string | null;
  quote: string | null;
  body: string;
  resolved: boolean;
  author: string;
  authorRole: string | null;
  createdAt: string;
  revision: number | null;
  canResolve: boolean;
}

const KIND_LABEL: Record<string, string> = {
  note: "Note",
  reply: "Reply",
  revision_request: "Revision requested",
  approval: "Approved",
  rejection: "Rejected",
};

/** Internal editorial feedback — never shown on the public site. */
export function NotesPanel({
  entityId,
  notes,
  canComment,
  fields,
}: {
  entityId: string;
  notes: NoteRow[];
  canComment: boolean;
  fields: { name: string; label: string }[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [body, setBody] = useState("");
  const [field, setField] = useState("");
  const [quote, setQuote] = useState("");
  const [showResolved, setShowResolved] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const open = notes.filter((n) => !n.resolved);
  const shown = showResolved ? notes : open;

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-muted">
          {open.length} open · {notes.length - open.length} resolved
        </p>
        {notes.length > open.length && (
          <button type="button" onClick={() => setShowResolved((s) => !s)} className="label text-muted hover:text-ink">
            {showResolved ? "Hide resolved" : "Show resolved"}
          </button>
        )}
      </div>
      {shown.length === 0 ? (
        <p className="border border-dashed border-rule px-4 py-4 text-sm italic text-muted">No open notes.</p>
      ) : (
        <ol className="space-y-4">
          {shown.map((n) => (
            <li key={n.id} className={`border-l-2 pl-4 ${n.resolved ? "border-rule opacity-70" : n.kind === "revision_request" || n.kind === "rejection" ? "border-red" : n.kind === "approval" ? "border-olive" : "border-ink"}`}>
              <p className="label flex flex-wrap gap-x-3">
                <span className={n.kind === "revision_request" || n.kind === "rejection" ? "text-red" : "text-ink"}>{KIND_LABEL[n.kind] ?? n.kind}</span>
                <span className="text-faint">
                  {n.author}
                  {n.authorRole ? ` · ${n.authorRole}` : ""}
                </span>
                <span className="label-mono text-faint">{n.createdAt.slice(0, 16)}</span>
                {n.revision != null && <span className="label-mono text-faint">v{n.revision}</span>}
                {n.fieldLabel && <span className="text-red">on: {n.fieldLabel}</span>}
              </p>
              {n.quote && <blockquote className="mt-1 border-l border-rule pl-3 font-serif text-sm italic text-muted">“{n.quote}”</blockquote>}
              <p className="mt-1 whitespace-pre-line text-[0.95rem]">{n.body}</p>
              {n.canResolve && n.kind !== "approval" && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    start(async () => {
                      await resolveNoteAction(n.id, !n.resolved);
                      router.refresh();
                    })
                  }
                  className="label mt-1 text-muted hover:text-ink"
                >
                  {n.resolved ? "Reopen" : "Mark resolved"}
                </button>
              )}
            </li>
          ))}
        </ol>
      )}
      {canComment && (
        <form
          className="border border-ink bg-paper-warm p-4"
          onSubmit={(e) => {
            e.preventDefault();
            setErr(null);
            start(async () => {
              const res = await addNoteAction(entityId, { body, field: field || undefined, quote: quote || undefined });
              if (!res.ok) return setErr(res.message);
              setBody("");
              setQuote("");
              setField("");
              router.refresh();
            });
          }}
        >
          <p className="label mb-3">Leave a note</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="label mb-1 block text-faint">About (optional)</span>
              <select value={field} onChange={(e) => setField(e.target.value)} className="field">
                <option value="">The entry as a whole</option>
                {fields.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="label mb-1 block text-faint">Passage (optional)</span>
              <input value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Paste the words you mean" className="field" />
            </label>
            <label className="sm:col-span-2">
              <span className="label mb-1 block text-faint">Note</span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                required
                placeholder="e.g. Please provide a source for this claim."
                className="field"
              />
            </label>
          </div>
          {err && <p className="mt-2 text-sm text-red-deep">{err}</p>}
          <button type="submit" disabled={pending || !body.trim()} className="btn btn-red mt-3 disabled:opacity-50">
            Add note
          </button>
          <p className="mt-2 text-xs text-faint">Notes are internal to the desk and never appear on the public site.</p>
        </form>
      )}
    </div>
  );
}
