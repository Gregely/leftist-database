"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createSourceAction } from "@/app/admin/actions";
import { SOURCE_TYPE_LABELS, SOURCE_TYPES, type SourceType } from "@/lib/content/model";

export interface PickedSource {
  id: string;
  title: string;
  author: string;
  publicationDate?: string | null;
}

/**
 * Search the bibliography; if the source is missing, catalogue it on the
 * spot without leaving the editor.
 */
export function SourcePicker({
  label = "Source",
  value,
  onChange,
  allowCreate = true,
}: {
  label?: string;
  value: PickedSource | null;
  onChange: (s: PickedSource | null) => void;
  allowCreate?: boolean;
}) {
  const id = useId();
  const [q, setQ] = useState(value ? value.title : "");
  const [items, setItems] = useState<PickedSource[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [creating, setCreating] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || (value && value.title === q)) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/desk/sources?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        if (r.ok) {
          setItems((await r.json()).items);
          setActive(0);
        }
      } catch {}
    }, 120);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [q, open, value]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const choose = (s: PickedSource) => {
    onChange(s);
    setQ(s.title);
    setOpen(false);
  };
  const showList = open && !value;

  return (
    <div ref={box} className="relative">
      <label htmlFor={id} className="label mb-1 block text-faint">
        {label}
      </label>
      <input
        id={id}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          if (value) onChange(null);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(items.length - 1, a + 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(0, a - 1));
          } else if (e.key === "Enter" && showList && items[active]) {
            e.preventDefault();
            choose(items[active]);
          } else if (e.key === "Escape") setOpen(false);
        }}
        role="combobox"
        aria-expanded={showList}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder="Search by title or author…"
        className={`field ${value ? "border-ink" : ""}`}
      />
      {showList && (
        <ul id={`${id}-list`} role="listbox" aria-label="Sources" className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto border border-ink bg-paper-warm shadow-[4px_4px_0_rgba(23,23,23,0.08)]">
          {items.map((s, i) => (
            <li
              key={s.id}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(s);
              }}
              onMouseEnter={() => setActive(i)}
              className={`cursor-pointer px-3 py-2 text-sm ${i === active ? "bg-ink text-paper" : ""}`}
            >
              <span className="font-serif italic">{s.title}</span>
              <span className="block text-xs opacity-75">
                {s.author}
                {s.publicationDate ? ` · ${s.publicationDate}` : ""}
              </span>
            </li>
          ))}
          {allowCreate && (
            <li className="border-t border-rule">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setCreating(true);
                  setOpen(false);
                }}
                className="label w-full px-3 py-2 text-left text-red hover:bg-paper"
              >
                + Catalogue a new source{q ? ` “${q.slice(0, 40)}”` : ""}
              </button>
            </li>
          )}
        </ul>
      )}
      {creating && (
        <NewSourceForm
          initialTitle={q}
          onCancel={() => setCreating(false)}
          onCreated={(s) => {
            setCreating(false);
            choose(s);
          }}
        />
      )}
    </div>
  );
}

function NewSourceForm({ initialTitle, onCreated, onCancel }: { initialTitle: string; onCreated: (s: PickedSource) => void; onCancel: () => void }) {
  const [f, setF] = useState({ title: initialTitle, author: "", sourceType: "SECONDARY" as SourceType, publicationDate: "", publisher: "", edition: "", translator: "", url: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const input = (k: keyof typeof f, label: string, cls = "sm:col-span-3") => (
    <label className={`col-span-6 ${cls}`}>
      <span className="label mb-1 block text-faint">{label}</span>
      <input value={f[k]} onChange={set(k)} className="field py-1.5" />
    </label>
  );
  return (
    <div className="mt-3 border border-ink bg-paper-warm p-4" role="group" aria-label="New source">
      <p className="label mb-3">Catalogue a new source</p>
      <div className="grid grid-cols-6 gap-3">
        {input("title", "Title *", "sm:col-span-6")}
        {input("author", "Author / editor")}
        <label className="col-span-6 sm:col-span-3">
          <span className="label mb-1 block text-faint">Type</span>
          <select value={f.sourceType} onChange={set("sourceType")} className="field py-1.5">
            {SOURCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {SOURCE_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </label>
        {input("publicationDate", "Date", "sm:col-span-2")}
        {input("publisher", "Publisher", "sm:col-span-2")}
        {input("edition", "Edition", "sm:col-span-2")}
        {input("translator", "Translator")}
        {input("url", "URL")}
      </div>
      {error && <p className="mt-2 text-sm text-red-deep">{error}</p>}
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            const res = await createSourceAction(f);
            setBusy(false);
            if (!res.ok) return setError(res.message);
            onCreated({ id: res.data as string, title: f.title, author: f.author, publicationDate: f.publicationDate });
          }}
          className="btn btn-red"
        >
          {busy ? "Saving…" : "Add to bibliography"}
        </button>
        <button type="button" onClick={onCancel} className="label text-muted hover:text-ink">
          Cancel
        </button>
      </div>
    </div>
  );
}
