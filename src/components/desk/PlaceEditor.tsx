"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createPlaceAction, deletePlaceAction, updatePlaceAction } from "@/app/admin/actions";
import { PLACE_KIND_LABELS, PLACE_KINDS } from "@/lib/content/model";

const FIELDS: { name: string; label: string; cls?: string; help?: string; area?: boolean }[] = [
  { name: "name", label: "Name *", cls: "sm:col-span-4", help: "The name used in the collection, usually that of the period: “St Petersburg”, “Constantinople”." },
  { name: "modernName", label: "Present-day name", cls: "sm:col-span-2" },
  { name: "country", label: "Present-day country", cls: "sm:col-span-2" },
  { name: "lat", label: "Latitude *", cls: "sm:col-span-2" },
  { name: "lon", label: "Longitude *", cls: "sm:col-span-2" },
  { name: "wikidataId", label: "Wikidata item", cls: "sm:col-span-2", help: "The record the coordinates come from, e.g. Q3138." },
  { name: "coordSource", label: "Coordinates from", cls: "sm:col-span-4", help: "If not from Wikidata: the gazetteer or reference used. Never estimate." },
  { name: "historicalNote", label: "Historical context", cls: "sm:col-span-6", area: true, help: "The states and provinces it belonged to in the period, and when they changed: “Prussian Rhine Province until 1918; now Rhineland-Palatinate, Germany”." },
  { name: "aliases", label: "Other names", cls: "sm:col-span-3", area: true, help: "One per line, with dates where they applied: “Petrograd (1914–24)”." },
  { name: "matches", label: "Wordings in entries", cls: "sm:col-span-3", area: true, help: "Exact phrases used in birthplace, place of death or event location fields that mean this place, one per line: “Trier, Prussia”." },
];

export function PlaceEditor({ id, initial, canEdit, canDelete }: { id?: string; initial: Record<string, string>; canEdit: boolean; canDelete?: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [f, setF] = useState<Record<string, string>>({ kind: "settlement", ...initial });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const input = { ...f, aliases: f.aliases ?? "", matches: f.matches ?? "" };
          const res = id ? await updatePlaceAction(id, input) : await createPlaceAction(input);
          if (!res.ok) {
            setErrors(res.fields ?? {});
            return setMsg({ ok: false, text: res.message });
          }
          setErrors({});
          if (!id) router.push(`/admin/places/${res.data}?created=1`);
          else {
            setMsg({ ok: true, text: "Place saved." });
            router.refresh();
          }
        });
      }}
      className="grid grid-cols-6 gap-4"
    >
      <label className="col-span-6 sm:col-span-2">
        <span className="label mb-1 block">Kind of place</span>
        <select disabled={!canEdit} value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })} className="field">
          {PLACE_KINDS.map((k) => (
            <option key={k} value={k}>
              {PLACE_KIND_LABELS[k]}
            </option>
          ))}
        </select>
        <span className="mt-1 block text-xs text-faint">Regions and countries are drawn as areas of influence, never as points.</span>
      </label>
      {FIELDS.map((fd) => (
        <label key={fd.name} className={`col-span-6 ${fd.cls ?? ""}`}>
          <span className="label mb-1 block">{fd.label}</span>
          {fd.area ? (
            <textarea disabled={!canEdit} rows={3} value={f[fd.name] ?? ""} onChange={(e) => setF({ ...f, [fd.name]: e.target.value })} aria-invalid={!!errors[fd.name]} className="field" />
          ) : (
            <input
              disabled={!canEdit}
              value={f[fd.name] ?? ""}
              onChange={(e) => setF({ ...f, [fd.name]: e.target.value })}
              aria-invalid={!!errors[fd.name]}
              inputMode={fd.name === "lat" || fd.name === "lon" ? "decimal" : undefined}
              className={`field ${fd.name === "name" ? "font-serif text-lg" : ""}`}
            />
          )}
          {errors[fd.name] && <span className="mt-1 block text-sm text-red-deep">{errors[fd.name]}</span>}
          {fd.help && <span className="mt-1 block text-xs text-faint">{fd.help}</span>}
        </label>
      ))}
      {msg && (
        <p role={msg.ok ? "status" : "alert"} className={`col-span-6 border-l-2 px-3 py-1.5 text-sm ${msg.ok ? "border-olive bg-olive/10" : "border-red text-red-deep"}`}>
          {msg.text}
        </p>
      )}
      {canEdit && (
        <div className="col-span-6 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={pending} className="btn btn-red disabled:opacity-50">
            {id ? "Save place" : "Add to the gazetteer"}
          </button>
          {id && canDelete && (
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                if (!confirm("Remove this place from the gazetteer?")) return;
                start(async () => {
                  const res = await deletePlaceAction(id);
                  if (res && !res.ok) setMsg({ ok: false, text: res.message });
                });
              }}
              className="label text-faint hover:text-red"
            >
              Remove place
            </button>
          )}
        </div>
      )}
    </form>
  );
}
