"use client";

import { useEffect, useId, useRef, useState } from "react";
import { KINDS, STATUS_LABELS, type EntityKind, type WorkflowStatus } from "@/lib/content/model";

export interface PickedEntity {
  id: string;
  kind: EntityKind;
  slug: string;
  title: string;
  live?: boolean;
  status?: WorkflowStatus;
}

/**
 * Accessible autocomplete over the whole repository (every status), backed
 * by /api/desk/lookup. Controlled: the parent owns the chosen entity.
 */
export function EntityPicker({
  label,
  value,
  onChange,
  kinds,
  placeholder = "Search the Atlas…",
  initialQuery = "",
  autoFocus,
  exclude = [],
  name,
}: {
  label: string;
  value: PickedEntity | null;
  onChange: (e: PickedEntity | null) => void;
  kinds?: EntityKind[];
  placeholder?: string;
  initialQuery?: string;
  autoFocus?: boolean;
  exclude?: string[];
  /** If set, a hidden input carries the id for plain form posts. */
  name?: string;
}) {
  const id = useId();
  const [q, setQ] = useState(value?.title ?? initialQuery);
  const [items, setItems] = useState<PickedEntity[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const kindsKey = kinds?.join(",") ?? "";

  useEffect(() => {
    if (value) setQ(value.title);
  }, [value]);

  useEffect(() => {
    if (!open || !q.trim() || (value && value.title === q)) return;
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/desk/lookup?q=${encodeURIComponent(q)}${kindsKey ? `&kinds=${kindsKey}` : ""}`, { signal: ctrl.signal });
        if (r.ok) {
          const data = (await r.json()).items as PickedEntity[];
          setItems(data.filter((d) => !exclude.includes(d.id)));
          setActive(0);
        }
      } catch {
        /* aborted */
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 120);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, open, kindsKey]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const choose = (e: PickedEntity) => {
    onChange(e);
    setQ(e.title);
    setOpen(false);
  };
  const showList = open && !value && q.trim().length > 0;

  return (
    <div ref={box} className="relative">
      <label htmlFor={id} className="label mb-1 block text-faint">
        {label}
      </label>
      {name && <input type="hidden" name={name} value={value?.id ?? ""} />}
      <div className="relative">
        <input
          id={id}
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQ(e.target.value);
            if (value) onChange(null);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
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
          aria-expanded={showList && items.length > 0}
          aria-controls={`${id}-list`}
          aria-activedescendant={showList && items[active] ? `${id}-opt-${active}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder={placeholder}
          className={`field pr-24 ${value ? "border-ink" : ""}`}
        />
        {value && (
          <span className="label pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-olive">
            ✓ {KINDS[value.kind].label}
          </span>
        )}
        {loading && !value && <span className="label absolute right-2 top-1/2 -translate-y-1/2 text-faint">…</span>}
      </div>
      {showList && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={`${label} — suggestions`}
          className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto border border-ink bg-paper-warm shadow-[4px_4px_0_rgba(23,23,23,0.08)]"
        >
          {items.length === 0 && !loading && <li className="px-3 py-2 text-sm italic text-muted">No matching entries.</li>}
          {items.map((o, i) => (
            <li
              key={o.id}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(o);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-baseline justify-between gap-3 px-3 py-2 ${i === active ? "bg-ink text-paper" : ""}`}
            >
              <span className="font-serif">{o.title}</span>
              <span className="label shrink-0 opacity-75">
                {KINDS[o.kind].label}
                {!o.live && o.status ? ` · ${STATUS_LABELS[o.status]}` : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
