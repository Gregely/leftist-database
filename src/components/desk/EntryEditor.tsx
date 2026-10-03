"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { saveEntryAction } from "@/app/admin/actions";
import type { FieldDef, FieldValues } from "@/lib/editorial/fields";
import { RichTextEditor } from "./rich-text/RichTextEditor";
import type { ExcerptOption } from "./rich-text/extensions";

type SaveState = "saved" | "dirty" | "saving" | "error" | "conflict";

const AUTOSAVE_MS = 2500;
const backupKey = (id: string) => `atlas:draft:${id}`;

function same(a: FieldValues, b: FieldValues) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) if ((a[k] ?? "") !== (b[k] ?? "")) return false;
  return true;
}

function clock(iso: string) {
  const d = new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * The structured editor for an entry's content fields. Autosaves after a
 * pause, keeps a local backup for recovery, refuses to overwrite someone
 * else's newer save, and warns before leaving with unsaved changes.
 */
export function EntryEditor({
  entityId,
  sections,
  initial,
  lockVersion,
  updatedAt,
  canEdit,
  readOnlyReason,
  excerpts,
  notesByField,
  liveNotice,
}: {
  entityId: string;
  sections: { name: string; fields: FieldDef[] }[];
  initial: FieldValues;
  lockVersion: number;
  updatedAt: string;
  canEdit: boolean;
  readOnlyReason?: string;
  excerpts: ExcerptOption[];
  notesByField: Record<string, number>;
  liveNotice?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<FieldValues>(initial);
  const [persisted, setPersisted] = useState<FieldValues>(initial);
  const [state, setState] = useState<SaveState>("saved");
  const [lastSaved, setLastSaved] = useState(updatedAt);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [conflict, setConflict] = useState<{ editor: string | null; updatedAt: string; lockVersion: number } | null>(null);
  const [recovery, setRecovery] = useState<{ values: FieldValues; at: number } | null>(null);
  const [versionNote, setVersionNote] = useState("");
  const [ready, setReady] = useState(false);
  const lock = useRef(lockVersion);
  const saving = useRef(false);
  const dirty = !same(values, persisted);

  // Offer to recover changes left in this browser.
  useEffect(() => {
    setReady(true);
    try {
      const raw = window.localStorage.getItem(backupKey(entityId));
      if (!raw) return;
      const b = JSON.parse(raw) as { values: FieldValues; at: number; lock: number };
      if (!same(b.values, initial)) setRecovery({ values: b.values, at: b.at });
      else window.localStorage.removeItem(backupKey(entityId));
    } catch {
      /* storage unavailable */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Local backup of unsaved work.
  useEffect(() => {
    if (!dirty || !canEdit) return;
    const t = setTimeout(() => {
      try {
        window.localStorage.setItem(backupKey(entityId), JSON.stringify({ values, at: Date.now(), lock: lock.current }));
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [values, dirty, canEdit, entityId]);

  const save = useCallback(
    async (opts: { message?: string; force?: boolean } = {}) => {
      if (saving.current || (!opts.force && conflict)) return;
      saving.current = true;
      setState("saving");
      const snapshot = values;
      const res = await saveEntryAction(entityId, lock.current, snapshot, opts.message);
      saving.current = false;
      if (res.ok && res.data) {
        lock.current = res.data.lockVersion;
        setPersisted(snapshot);
        setLastSaved(res.data.savedAt);
        setErrors({});
        setConflict(null);
        setMessage(opts.message ? `Saved as version ${res.data.revision}.` : null);
        setState("saved");
        try {
          window.localStorage.removeItem(backupKey(entityId));
        } catch {}
        // Refresh server-rendered context (status, checks, history) after substantive saves.
        if (res.data.newRevision || opts.message) router.refresh();
      } else if (!res.ok && res.conflict) {
        setConflict(res.conflict);
        setState("conflict");
      } else if (!res.ok) {
        setErrors(res.fields ?? {});
        setMessage(res.message);
        setState("error");
      }
    },
    [values, entityId, conflict, router],
  );

  // Autosave after a pause in typing.
  useEffect(() => {
    if (!dirty || !canEdit || conflict || state === "saving") return;
    setState((s) => (s === "error" ? s : "dirty"));
    const t = setTimeout(() => save(), AUTOSAVE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, dirty, canEdit, conflict, state]);

  // Save when the tab is hidden; warn before leaving with unsaved work.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden" && dirty && canEdit && !conflict) save();
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty || saving.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [dirty, canEdit, conflict, save]);

  const set = (name: string) => (v: string | number | boolean | null) => setValues((prev) => ({ ...prev, [name]: v }));

  const indicator = useMemo(() => {
    if (!canEdit) return { text: "Read only", tone: "text-faint" };
    switch (state) {
      case "saving":
        return { text: "Saving…", tone: "text-muted" };
      case "dirty":
        return { text: "Unsaved changes", tone: "text-ochre" };
      case "error":
        return { text: "Not saved", tone: "text-red" };
      case "conflict":
        return { text: "Conflict — not saved", tone: "text-red" };
      default:
        return { text: `Saved · ${clock(lastSaved)}`, tone: "text-olive" };
    }
  }, [state, lastSaved, canEdit]);

  return (
    <div data-editor-ready={ready || undefined}>
      {/* Save bar */}
      <div className="sticky top-[49px] z-20 -mx-4 mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-rule bg-paper/95 px-4 py-2 backdrop-blur-[2px] sm:mx-0 sm:px-0">
        <span role="status" aria-live="polite" className={`label ${indicator.tone}`}>
          <span aria-hidden="true">● </span>
          {indicator.text}
        </span>
        {canEdit && (
          <>
            <label className="sr-only" htmlFor="version-note">
              Version note
            </label>
            <input
              id="version-note"
              value={versionNote}
              onChange={(e) => setVersionNote(e.target.value)}
              placeholder="Note for this version (optional)"
              className="field ml-auto max-w-xs py-1 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                save({ message: versionNote.trim() || "Saved version" });
                setVersionNote("");
              }}
              disabled={state === "saving" || !!conflict}
              className="btn py-1.5 disabled:opacity-50"
            >
              Save version
            </button>
          </>
        )}
      </div>

      {liveNotice && (
        <p className="mb-6 border-l-2 border-olive bg-olive/10 px-4 py-2 text-sm">{liveNotice}</p>
      )}
      {!canEdit && readOnlyReason && <p className="mb-6 border-l-2 border-ink bg-paper-warm px-4 py-2 text-sm">{readOnlyReason}</p>}
      {message && state !== "conflict" && (
        <p role={state === "error" ? "alert" : "status"} className={`mb-6 border-l-2 px-4 py-2 text-sm ${state === "error" ? "border-red text-red-deep" : "border-olive"}`}>
          {message}
        </p>
      )}
      {conflict && (
        <div role="alert" className="mb-6 border border-red bg-red/5 p-4 text-sm">
          <p className="label text-red">Someone else saved this entry</p>
          <p className="mt-1">
            A newer version was saved at {clock(conflict.updatedAt)}. Your changes have <strong>not</strong> been saved, and are kept here and in this browser.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="button" onClick={() => window.location.reload()} className="btn">
              Load their version
            </button>
            <button
              type="button"
              onClick={() => {
                lock.current = conflict.lockVersion;
                setConflict(null);
                save({ force: true, message: "Saved over a concurrent edit" });
              }}
              className="btn border-red text-red hover:bg-red hover:text-paper-warm"
            >
              Save mine over theirs
            </button>
          </div>
        </div>
      )}
      {recovery && (
        <div role="status" className="mb-6 border border-ochre bg-ochre/10 p-4 text-sm">
          <p className="label">Unsaved changes found in this browser</p>
          <p className="mt-1">From {new Date(recovery.at).toLocaleString()}. Restore them into the editor?</p>
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              className="btn"
              onClick={() => {
                setValues(recovery.values);
                setRecovery(null);
              }}
            >
              Restore
            </button>
            <button
              type="button"
              className="label text-muted hover:text-ink"
              onClick={() => {
                setRecovery(null);
                try {
                  window.localStorage.removeItem(backupKey(entityId));
                } catch {}
              }}
            >
              Discard
            </button>
          </div>
        </div>
      )}

      <div className="space-y-12">
        {sections.map((section) => (
          <fieldset key={section.name} className="min-w-0">
            <legend className="label mb-4 w-full border-b border-ink pb-2 font-sans">{section.name}</legend>
            <div className="grid grid-cols-6 gap-x-5 gap-y-5">
              {section.fields.map((f) => (
                <Field
                  key={f.name}
                  def={f}
                  value={values[f.name]}
                  onChange={set(f.name)}
                  disabled={!canEdit}
                  error={errors[f.name]}
                  notes={notesByField[f.name] ?? 0}
                  excerpts={excerpts}
                  entityId={entityId}
                />
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

const WIDTH = { full: "col-span-6", half: "col-span-6 sm:col-span-3", third: "col-span-6 sm:col-span-2" } as const;

function Field({
  def: f,
  value,
  onChange,
  disabled,
  error,
  notes,
  excerpts,
  entityId,
}: {
  def: FieldDef;
  value: string | number | boolean | null | undefined;
  onChange: (v: string | number | boolean | null) => void;
  disabled: boolean;
  error?: string;
  notes: number;
  excerpts: ExcerptOption[];
  entityId: string;
}) {
  const id = `field-${f.name}`;
  const help = f.help ? `${id}-help` : undefined;
  const str = value == null ? "" : String(value);
  const head = (
    <label htmlFor={id} className="label mb-1 flex items-baseline justify-between gap-2">
      <span>
        {f.label}
        {f.required && (
          <span className="text-red" title="Needed before publication">
            {" "}
            *
          </span>
        )}
      </span>
      {notes > 0 && (
        <a href="?tab=review" className="label text-red hover:underline">
          ✎ {notes} note{notes > 1 ? "s" : ""}
        </a>
      )}
    </label>
  );
  const common = { id, disabled, "aria-invalid": !!error, "aria-describedby": help } as const;
  let control: React.ReactNode;
  switch (f.type) {
    case "richtext":
      return (
        <div className={WIDTH.full}>
          {head}
          <RichTextEditor id={id} label={f.label} value={str} onChange={onChange} disabled={disabled} compact={f.compact} excerpts={excerpts} entityId={entityId} describedBy={help} />
          {error && <p className="mt-1 text-sm text-red-deep">{error}</p>}
          {f.help && (
            <p id={help} className="mt-1 text-xs text-faint">
              {f.help}
            </p>
          )}
        </div>
      );
    case "checkbox":
      return (
        <div className={WIDTH[f.width ?? "full"]}>
          <label className="mt-6 inline-flex items-center gap-2">
            <input type="checkbox" id={id} disabled={disabled} checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#B51F2A]" />
            <span className="label">{f.label}</span>
          </label>
          {f.help && <p className="mt-1 text-xs text-faint">{f.help}</p>}
        </div>
      );
    case "select":
      control = (
        <select {...common} value={str} onChange={(e) => onChange(e.target.value)} className="field">
          {!f.required && <option value="">—</option>}
          {f.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
      break;
    case "textarea":
    case "list":
      control = <textarea {...common} rows={f.type === "list" ? 3 : 3} value={str} onChange={(e) => onChange(e.target.value)} className="field" placeholder={f.placeholder} />;
      break;
    default:
      control = (
        <input
          {...common}
          type={f.type === "url" ? "url" : "text"}
          inputMode={f.type === "number" ? "numeric" : undefined}
          value={str}
          onChange={(e) => onChange(e.target.value)}
          placeholder={f.placeholder}
          className={`field ${f.name === "title" ? "font-serif text-xl" : ""} ${f.type === "slug" ? "font-mono text-sm" : ""}`}
        />
      );
  }
  return (
    <div className={WIDTH[f.width ?? "full"]}>
      {head}
      {control}
      {error && <p className="mt-1 text-sm text-red-deep">{error}</p>}
      {f.help && (
        <p id={help} className="mt-1 text-xs text-faint">
          {f.help}
        </p>
      )}
    </div>
  );
}
