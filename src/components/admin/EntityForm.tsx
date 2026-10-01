"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/admin/actions";
import type { FieldDef } from "@/lib/admin/fields";

const WIDTH = { full: "sm:col-span-6", half: "sm:col-span-3", third: "sm:col-span-2" } as const;

/** Schema-driven entity form. Field definitions live in lib/admin/fields.ts. */
export function EntityForm({
  fields,
  values,
  action,
  submitLabel = "Save",
}: {
  fields: FieldDef[];
  values: Record<string, unknown>;
  action: (prev: FormState, f: FormData) => Promise<FormState>;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className="grid gap-x-5 gap-y-5 sm:grid-cols-6" noValidate>
      {state?.message && (
        <p role="status" className={`sm:col-span-6 border-l-2 px-3 py-2 text-sm ${state.ok ? "border-olive bg-olive/10" : "border-red bg-red/5 text-red"}`}>
          {state.message}
        </p>
      )}
      {fields.map((f) => {
        const err = state?.errors?.[f.name];
        const id = `f-${f.name}`;
        const raw = values[f.name];
        const value = f.type === "list" ? safeList(raw).join("\n") : raw == null ? "" : String(raw);
        return (
          <div key={f.name} className={`col-span-6 ${WIDTH[f.width ?? "full"]}`}>
            {f.type === "checkbox" ? (
              <label className="mt-6 inline-flex items-center gap-2">
                <input type="checkbox" name={f.name} defaultChecked={!!raw} className="h-4 w-4 accent-[#B51F2A]" />
                <span className="label">{f.label}</span>
              </label>
            ) : (
              <>
                <label htmlFor={id} className="label mb-1 flex justify-between">
                  <span>
                    {f.label}
                    {f.required && <span className="text-red"> *</span>}
                  </span>
                  {f.type === "markup" && <span className="text-faint">Markup</span>}
                </label>
                {f.type === "select" ? (
                  <select id={id} name={f.name} defaultValue={value} className="field" aria-invalid={!!err}>
                    {!f.required && <option value="">—</option>}
                    {f.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : f.type === "textarea" || f.type === "markup" || f.type === "list" ? (
                  <textarea
                    id={id}
                    name={f.name}
                    defaultValue={value}
                    rows={f.rows ?? (f.type === "list" ? 3 : 4)}
                    className={`field ${f.type === "markup" ? "font-mono text-[0.85rem] leading-relaxed" : ""}`}
                    aria-invalid={!!err}
                    aria-describedby={f.help ? `${id}-help` : undefined}
                  />
                ) : (
                  <input
                    id={id}
                    name={f.name}
                    type={f.type === "number" ? "text" : f.type === "url" ? "url" : "text"}
                    inputMode={f.type === "number" ? "numeric" : undefined}
                    defaultValue={value}
                    className="field"
                    aria-invalid={!!err}
                    aria-describedby={f.help ? `${id}-help` : undefined}
                  />
                )}
              </>
            )}
            {err && <p className="mt-1 text-sm text-red">{err}</p>}
            {f.help && (
              <p id={`${id}-help`} className="mt-1 text-xs text-faint">
                {f.help}
              </p>
            )}
          </div>
        );
      })}
      <div className="col-span-6 flex items-center gap-4 border-t border-ink pt-4">
        <button type="submit" disabled={pending} className="btn btn-red disabled:opacity-60">
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

function safeList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v !== "string") return [];
  try {
    const p = JSON.parse(v);
    return Array.isArray(p) ? p.map(String) : [];
  } catch {
    return [];
  }
}
