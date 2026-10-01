"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/admin/actions";
import { SOURCE_TYPE_LABELS, SOURCE_TYPES } from "@/lib/content/model";

type Values = Partial<Record<"title" | "author" | "publicationDate" | "publisher" | "url" | "sourceType" | "locator" | "notes", string | null>>;

export function SourceForm({ values, action }: { values: Values; action: (p: FormState, f: FormData) => Promise<FormState> }) {
  const [state, formAction, pending] = useActionState(action, null);
  const field = (name: keyof Values, label: string, cls = "sm:col-span-3", type = "text") => (
    <div className={`col-span-6 ${cls}`}>
      <label htmlFor={`s-${name}`} className="label mb-1 block">{label}</label>
      <input id={`s-${name}`} name={name} type={type} defaultValue={values[name] ?? ""} className="field" aria-invalid={!!state?.errors?.[name]} />
      {state?.errors?.[name] && <p className="mt-1 text-sm text-red">{state.errors[name]}</p>}
    </div>
  );
  return (
    <form action={formAction} className="grid gap-5 sm:grid-cols-6">
      {state?.message && <p role="status" className={`col-span-6 border-l-2 px-3 py-2 text-sm ${state.ok ? "border-olive bg-olive/10" : "border-red text-red"}`}>{state.message}</p>}
      {field("title", "Title *", "sm:col-span-6")}
      {field("author", "Author / editor / translator", "sm:col-span-4")}
      <div className="col-span-6 sm:col-span-2">
        <label htmlFor="s-type" className="label mb-1 block">Source type</label>
        <select id="s-type" name="sourceType" defaultValue={values.sourceType ?? "SECONDARY"} className="field">
          {SOURCE_TYPES.map((t) => <option key={t} value={t}>{SOURCE_TYPE_LABELS[t]}</option>)}
        </select>
      </div>
      {field("publicationDate", "Publication date", "sm:col-span-2")}
      {field("publisher", "Publisher", "sm:col-span-2")}
      {field("locator", "Page / chapter", "sm:col-span-2")}
      {field("url", "URL", "sm:col-span-6", "url")}
      <div className="col-span-6">
        <label htmlFor="s-notes" className="label mb-1 block">Notes</label>
        <textarea id="s-notes" name="notes" rows={3} defaultValue={values.notes ?? ""} className="field" />
      </div>
      <div className="col-span-6 border-t border-ink pt-4">
        <button type="submit" disabled={pending} className="btn btn-red">{pending ? "Saving…" : "Save source"}</button>
      </div>
    </form>
  );
}
