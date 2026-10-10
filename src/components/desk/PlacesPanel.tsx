"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { addPlaceLinkAction, removePlaceLinkAction } from "@/app/admin/actions";
import { PLACE_KIND_LABELS, PLACE_ROLE_META, RECORDED_PLACE_ROLES, type PlaceKind, type PlaceRole, type RecordedPlaceRole } from "@/lib/content/model";
import { SourcePicker, type PickedSource } from "./SourcePicker";
import { PendingMark } from "./ui";

export interface PlaceOption {
  id: string;
  name: string;
  kind: PlaceKind;
  modern: string;
}

export interface FieldPlace {
  role: "birth" | "death" | "event";
  text: string;
  places: { id: string; name: string }[];
}

export interface PlaceLinkRow {
  id: string;
  role: RecordedPlaceRole;
  place: { id: string; name: string; kind: PlaceKind };
  yearStart: number | null;
  yearEnd: number | null;
  note: string;
  source: { id: string; title: string } | null;
  locator: string | null;
  staged?: boolean;
  canRemove?: boolean;
}

const ROLE_HELP: Record<RecordedPlaceRole, string> = {
  residence: "Lived there (not in exile).",
  exile: "Lived there because return was barred or dangerous.",
  activity: "Organised, agitated, edited a paper, sat in a parliament or party body there.",
  writing: "The text was written there.",
  publication: "The text was first published there.",
  influence: "A movement's or idea's documented presence in a region or country.",
};

const years = (a: number | null, b: number | null) => (a == null ? "" : b != null && b !== a ? `${a}–${b}` : `${a}`);

/** An entry's places: what its own fields say, and the associations recorded for it. */
export function PlacesPanel({
  entityId,
  fieldPlaces,
  links,
  options,
  canEdit,
}: {
  entityId: string;
  fieldPlaces: FieldPlace[];
  links: PlaceLinkRow[];
  options: PlaceOption[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const uid = useId();
  const [pending, start] = useTransition();
  const [placeName, setPlaceName] = useState("");
  const [role, setRole] = useState<RecordedPlaceRole>("residence");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [note, setNote] = useState("");
  const [source, setSource] = useState<PickedSource | null>(null);
  const [locator, setLocator] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [k, setK] = useState(0);
  const label = (o: PlaceOption) => `${o.name}${o.modern && o.modern !== o.name ? ` (${o.modern})` : ""}`;
  const picked = options.find((o) => label(o) === placeName || o.name === placeName);

  return (
    <div className="space-y-10">
      <section aria-labelledby={`${uid}-fields`}>
        <h3 id={`${uid}-fields`} className="label mb-2">
          From this entry’s fields
        </h3>
        {fieldPlaces.length === 0 ? (
          <p className="text-sm italic text-muted">This kind of entry has no place fields. Use associations below.</p>
        ) : (
          <ul className="divide-y divide-rule border-y border-rule">
            {fieldPlaces.map((f, i) => (
              <li key={i} className="flex flex-wrap items-baseline justify-between gap-3 py-2.5 text-sm">
                <span>
                  <span className="label mr-2 text-faint">{PLACE_ROLE_META[f.role].label}</span>
                  <span className="font-serif">“{f.text}”</span>
                </span>
                {f.places.length ? (
                  <span className="label text-olive">
                    located:{" "}
                    {f.places.map((p, j) => (
                      <span key={p.id}>
                        {j > 0 && ", "}
                        <Link href={`/admin/places/${p.id}`} className="hover:text-red">
                          {p.name}
                        </Link>
                      </span>
                    ))}
                  </span>
                ) : (
                  <Link href={`/admin/places/new?wording=${encodeURIComponent(f.text)}`} className="label text-ochre hover:text-red">
                    not located · add place
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-faint">Edit the wording in Content. A wording is located when a place in the gazetteer lists it exactly.</p>
      </section>

      <section aria-labelledby={`${uid}-links`}>
        <h3 id={`${uid}-links`} className="label mb-2">
          Recorded associations · {links.length}
        </h3>
        {links.length === 0 ? (
          <p className="border border-dashed border-rule px-4 py-4 text-sm italic text-muted">None yet. Record where this entry lived, worked, was written or published, or had influence — with dates and a source.</p>
        ) : (
          <ol className="divide-y divide-rule border-y border-rule">
            {links.map((l) => (
              <li key={l.id} className="flex flex-wrap items-baseline justify-between gap-3 py-2.5">
                <span className="min-w-0 text-sm">
                  <span className="label mr-2 text-red">{PLACE_ROLE_META[l.role as PlaceRole].label}</span>
                  <Link href={`/admin/places/${l.place.id}`} className="font-serif text-base hover:text-red">
                    {l.place.name}
                  </Link>
                  <span className="label ml-2 text-faint">{PLACE_KIND_LABELS[l.place.kind]}</span>
                  {years(l.yearStart, l.yearEnd) && <span className="label-mono ml-2 text-muted">{years(l.yearStart, l.yearEnd)}</span>}
                  {l.staged && <PendingMark />}
                  {l.note && <span className="block text-muted">{l.note}</span>}
                  {l.source ? (
                    <span className="block text-faint">
                      Source:{" "}
                      <a href={`/admin/sources/${l.source.id}`} className="italic hover:text-red">
                        {l.source.title}
                      </a>
                      {l.locator ? `, ${l.locator}` : ""}
                    </span>
                  ) : (
                    <span className="label block text-ochre">no source</span>
                  )}
                </span>
                {canEdit && l.canRemove !== false && (
                  <button
                    type="button"
                    onClick={() =>
                      start(async () => {
                        const res = await removePlaceLinkAction(l.id);
                        if (!res.ok) setMsg({ ok: false, text: res.message });
                        router.refresh();
                      })
                    }
                    className="label text-faint hover:text-red"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      {canEdit && (
        <div key={k} className="border border-ink bg-paper-warm p-4" role="group" aria-label="Record a place association">
          <p className="label mb-3">Record a place association</p>
          <div className="grid gap-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor={`${uid}-place`} className="label mb-1 block text-faint">
                Place
              </label>
              <input id={`${uid}-place`} list={`${uid}-places`} value={placeName} onChange={(e) => setPlaceName(e.target.value)} placeholder="Start typing a place…" className="field" aria-invalid={!!errors.place} />
              <datalist id={`${uid}-places`}>
                {options.map((o) => (
                  <option key={o.id} value={label(o)}>
                    {PLACE_KIND_LABELS[o.kind]}
                  </option>
                ))}
              </datalist>
              {errors.place && <span className="mt-1 block text-sm text-red-deep">{errors.place}</span>}
              <Link href="/admin/places/new" className="label mt-1 inline-block text-faint hover:text-red">
                Not in the gazetteer? Add it
              </Link>
            </div>
            <label className="sm:col-span-3">
              <span className="label mb-1 block text-faint">How it is connected</span>
              <select value={role} onChange={(e) => setRole(e.target.value as RecordedPlaceRole)} className="field">
                {RECORDED_PLACE_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {PLACE_ROLE_META[r].label}
                  </option>
                ))}
              </select>
              <span className="mt-1 block text-xs text-faint">{ROLE_HELP[role]}</span>
            </label>
            <label className="sm:col-span-1">
              <span className="label mb-1 block text-faint">From</span>
              <input value={from} onChange={(e) => setFrom(e.target.value)} inputMode="numeric" className="field" aria-invalid={!!errors.yearStart} />
            </label>
            <label className="sm:col-span-1">
              <span className="label mb-1 block text-faint">To</span>
              <input value={to} onChange={(e) => setTo(e.target.value)} inputMode="numeric" className="field" aria-invalid={!!errors.yearEnd} />
            </label>
            <label className="sm:col-span-4">
              <span className="label mb-1 block text-faint">Note</span>
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. edited the Neue Rheinische Zeitung" className="field" />
            </label>
            <div className="sm:col-span-4">
              <SourcePicker value={source} onChange={setSource} />
            </div>
            <label className="sm:col-span-2">
              <span className="label mb-1 block text-faint">Page / chapter</span>
              <input value={locator} onChange={(e) => setLocator(e.target.value)} className="field" />
            </label>
          </div>
          <button
            type="button"
            disabled={!picked || pending}
            onClick={() =>
              start(async () => {
                const res = await addPlaceLinkAction(entityId, { placeId: picked!.id, role, yearStart: from, yearEnd: to, note, sourceId: source?.id ?? null, locator });
                if (res.ok) {
                  setMsg({ ok: true, text: `Recorded: ${PLACE_ROLE_META[role].label.toLowerCase()}, ${picked!.name}.` });
                  setErrors({});
                  setPlaceName("");
                  setFrom("");
                  setTo("");
                  setNote("");
                  setSource(null);
                  setLocator("");
                  setK((x) => x + 1);
                  router.refresh();
                } else {
                  setErrors(res.fields ?? {});
                  setMsg({ ok: false, text: res.message });
                }
              })
            }
            className="btn btn-red mt-4 disabled:opacity-50"
          >
            Record association
          </button>
        </div>
      )}
      {msg && (
        <p role={msg.ok ? "status" : "alert"} className={`border-l-2 px-3 py-1.5 text-sm ${msg.ok ? "border-olive bg-olive/10" : "border-red bg-red/5 text-red-deep"}`}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
