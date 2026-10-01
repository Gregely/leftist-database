"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createSourceAction, deleteSourceAction, updateSourceAction } from "@/app/admin/actions";
import { SOURCE_TYPE_LABELS, SOURCE_TYPES } from "@/lib/content/model";

const FIELDS: { name: string; label: string; cls?: string; help?: string }[] = [
  { name: "title", label: "Title *", cls: "sm:col-span-6" },
  { name: "author", label: "Author(s)", cls: "sm:col-span-4", help: "As it should appear in notes: “Marx, Karl” or “Karl Marx; trans. Ben Fowkes”." },
  { name: "publicationDate", label: "Date", cls: "sm:col-span-2", help: "Free form: 1976 [1867]" },
  { name: "publisher", label: "Publisher", cls: "sm:col-span-3" },
  { name: "place", label: "Place", cls: "sm:col-span-3" },
  { name: "edition", label: "Edition", cls: "sm:col-span-2" },
  { name: "translator", label: "Translator", cls: "sm:col-span-2" },
  { name: "editors", label: "Editor(s)", cls: "sm:col-span-2" },
  { name: "containerTitle", label: "In (journal, collection)", cls: "sm:col-span-4" },
  { name: "locator", label: "Default page / chapter", cls: "sm:col-span-2" },
  { name: "isbn", label: "ISBN", cls: "sm:col-span-2" },
  { name: "url", label: "URL", cls: "sm:col-span-4" },
];

export function SourceEditor({ id, initial, canEdit, canDelete }: { id?: string; initial: Record<string, string>; canEdit: boolean; canDelete?: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [f, setF] = useState<Record<string, string>>({ sourceType: "SECONDARY", ...initial });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const res = id ? await updateSourceAction(id, f) : await createSourceAction(f);
          if (!res.ok) {
            setErrors(res.fields ?? {});
            return setMsg({ ok: false, text: res.message });
          }
          setErrors({});
          if (!id) router.push(`/admin/sources/${res.data}?created=1`);
          else {
            setMsg({ ok: true, text: "Source saved." });
            router.refresh();
          }
        });
      }}
      className="grid grid-cols-6 gap-4"
    >
      {FIELDS.map((fd) => (
        <label key={fd.name} className={`col-span-6 ${fd.cls ?? ""}`}>
          <span className="label mb-1 block">{fd.label}</span>
          <input
            disabled={!canEdit}
            value={f[fd.name] ?? ""}
            onChange={(e) => setF({ ...f, [fd.name]: e.target.value })}
            aria-invalid={!!errors[fd.name]}
            className={`field ${fd.name === "title" ? "font-serif text-lg italic" : ""}`}
          />
          {errors[fd.name] && <span className="mt-1 block text-sm text-red-deep">{errors[fd.name]}</span>}
          {fd.help && <span className="mt-1 block text-xs text-faint">{fd.help}</span>}
        </label>
      ))}
      <label className="col-span-6 sm:col-span-2">
        <span className="label mb-1 block">Type</span>
        <select disabled={!canEdit} value={f.sourceType} onChange={(e) => setF({ ...f, sourceType: e.target.value })} className="field">
          {SOURCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {SOURCE_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </label>
      <label className="col-span-6">
        <span className="label mb-1 block">Notes</span>
        <textarea disabled={!canEdit} rows={3} value={f.notes ?? ""} onChange={(e) => setF({ ...f, notes: e.target.value })} className="field" />
      </label>
      {msg && (
        <p role={msg.ok ? "status" : "alert"} className={`col-span-6 border-l-2 px-3 py-1.5 text-sm ${msg.ok ? "border-olive bg-olive/10" : "border-red text-red-deep"}`}>
          {msg.text}
        </p>
      )}
      {canEdit && (
        <div className="col-span-6 flex flex-wrap items-center gap-4 border-t border-ink pt-4">
          <button type="submit" disabled={pending} className="btn btn-red disabled:opacity-60">
            {pending ? "Saving…" : id ? "Save source" : "Add to bibliography"}
          </button>
          {id && canDelete && (
            <button
              type="button"
              onClick={() =>
                start(async () => {
                  if (!window.confirm("Delete this source? Only unused sources can be deleted.")) return;
                  const res = await deleteSourceAction(id);
                  if (res && !res.ok) setMsg({ ok: false, text: res.message });
                })
              }
              className="label text-faint hover:text-red"
            >
              Delete source
            </button>
          )}
        </div>
      )}
    </form>
  );
}
