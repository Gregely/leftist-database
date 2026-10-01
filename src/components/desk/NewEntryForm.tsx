"use client";

import { useActionState, useState } from "react";
import { createEntryAction } from "@/app/admin/actions";
import { ENTITY_KINDS, KINDS, type EntityKind } from "@/lib/content/model";

export function NewEntryForm({ initialKind }: { initialKind?: EntityKind }) {
  const [state, action, pending] = useActionState(createEntryAction, null);
  const [kind, setKind] = useState<EntityKind | undefined>(initialKind);
  return (
    <form action={action} className="space-y-8">
      <fieldset>
        <legend className="label mb-3">What are you adding?</legend>
        <div className="grid gap-px border border-ink bg-ink sm:grid-cols-2 lg:grid-cols-4">
          {ENTITY_KINDS.map((k) => (
            <label key={k} className={`flex cursor-pointer flex-col gap-1 p-4 transition-colors ${kind === k ? "bg-ink text-paper" : "bg-paper hover:bg-paper-warm"}`}>
              <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} className="sr-only" />
              <span className="font-serif text-2xl">{KINDS[k].label}</span>
              <span className={`text-xs leading-snug ${kind === k ? "text-ink-muted" : "text-muted"}`}>{KINDS[k].blurb}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="new-title" className="label mb-1 block">
          Working title
        </label>
        <input
          id="new-title"
          name="title"
          required
          placeholder={kind === "thinker" ? "e.g. Rosa Luxemburg" : kind === "debate" ? "e.g. What is the state?" : "Title"}
          className="field font-serif text-2xl"
        />
      </div>
      {state && !state.ok && (
        <p role="alert" className="border-l-2 border-red pl-3 text-sm text-red-deep">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending || !kind} className="btn btn-red disabled:opacity-50">
        {pending ? "Creating…" : `Create ${kind ? KINDS[kind].label.toLowerCase() : "entry"} and open the editor →`}
      </button>
    </form>
  );
}
