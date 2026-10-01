"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateMediaAction } from "@/app/admin/actions";

const FIELDS: { name: string; label: string; area?: boolean; help?: string; wide?: boolean }[] = [
  { name: "title", label: "Title", wide: true },
  { name: "altText", label: "Alt text *", area: true, wide: true, help: "Describe what the image shows for readers who cannot see it." },
  { name: "caption", label: "Default caption", area: true, wide: true },
  { name: "description", label: "Description (internal)", area: true, wide: true },
  { name: "creator", label: "Creator" },
  { name: "year", label: "Year" },
  { name: "credit", label: "Credit line" },
  { name: "sourceText", label: "Source / archive" },
  { name: "license", label: "Licence", help: "Public domain, CC BY-SA 4.0, © with permission…" },
  { name: "rights", label: "Rights notes" },
  { name: "tags", label: "Tags", wide: true, help: "Comma separated" },
];

export function MediaMetaEditor({ id, initial, canEdit }: { id: string; initial: Record<string, string>; canEdit: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [f, setF] = useState(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const res = await updateMediaAction(id, f);
          setMsg(res.ok ? { ok: true, text: "Saved." } : { ok: false, text: res.message });
          router.refresh();
        });
      }}
      className="grid gap-4 sm:grid-cols-2"
    >
      {FIELDS.map((fd) => (
        <label key={fd.name} className={fd.wide ? "sm:col-span-2" : ""}>
          <span className="label mb-1 block">{fd.label}</span>
          {fd.area ? (
            <textarea disabled={!canEdit} rows={2} value={f[fd.name] ?? ""} onChange={(e) => setF({ ...f, [fd.name]: e.target.value })} className="field" />
          ) : (
            <input disabled={!canEdit} value={f[fd.name] ?? ""} onChange={(e) => setF({ ...f, [fd.name]: e.target.value })} className="field" />
          )}
          {fd.help && <span className="mt-1 block text-xs text-faint">{fd.help}</span>}
        </label>
      ))}
      {msg && (
        <p role={msg.ok ? "status" : "alert"} className={`border-l-2 px-3 py-1.5 text-sm sm:col-span-2 ${msg.ok ? "border-olive bg-olive/10" : "border-red text-red-deep"}`}>
          {msg.text}
        </p>
      )}
      {canEdit && (
        <div className="sm:col-span-2">
          <button type="submit" disabled={pending} className="btn btn-red">
            {pending ? "Saving…" : "Save details"}
          </button>
        </div>
      )}
    </form>
  );
}
