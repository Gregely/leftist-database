"use client";

import { useEffect, useId, useRef, useState } from "react";
import { KINDS, type EntityKind } from "@/lib/content/model";

interface Option {
  id: string;
  kind: EntityKind;
  title: string;
  subtitle: string | null;
}

/**
 * Searchable entity combobox for the editorial desk. Submits the chosen
 * entity's id under `name`. Searches the full-text index, so it scales to
 * thousands of entries.
 */
export function EntityPicker({
  name,
  kinds,
  placeholder = "Search the Atlas…",
  initial,
  label,
  required,
}: {
  name: string;
  kinds?: EntityKind[];
  placeholder?: string;
  initial?: { id: string; title: string; kind: EntityKind } | null;
  label?: string;
  required?: boolean;
}) {
  const [q, setQ] = useState(initial?.title ?? "");
  const [value, setValue] = useState<Option | null>(initial ? { ...initial, subtitle: null } : null);
  const [options, setOptions] = useState<Option[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const id = useId();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !q.trim() || (value && value.title === q)) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?mode=lookup&q=${encodeURIComponent(q)}${kinds?.length ? `&kinds=${kinds.join(",")}` : ""}`, {
          signal: ctrl.signal,
        });
        if (res.ok) {
          setOptions((await res.json()).items);
          setActive(0);
        }
      } catch {}
    }, 120);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [q, open, kinds, value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function choose(o: Option) {
    setValue(o);
    setQ(o.title);
    setOpen(false);
  }

  return (
    <div ref={box} className="relative">
      {label && (
        <label htmlFor={id} className="label mb-1 block text-faint">
          {label}
        </label>
      )}
      <input type="hidden" name={name} value={value?.id ?? ""} />
      <input
        id={id}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setValue(null);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(options.length - 1, a + 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(0, a - 1));
          } else if (e.key === "Enter" && open && options[active]) {
            e.preventDefault();
            choose(options[active]);
          } else if (e.key === "Escape") setOpen(false);
        }}
        role="combobox"
        aria-expanded={open && options.length > 0}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder={placeholder}
        required={required}
        className={`field ${value ? "border-ink" : ""}`}
      />
      {value && <span className="label absolute right-2 top-[calc(50%+2px)] text-olive">✓ {KINDS[value.kind].label}</span>}
      {open && options.length > 0 && !value && (
        <ul id={`${id}-list`} role="listbox" className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto border border-ink bg-paper-warm shadow-[4px_4px_0_rgba(23,23,23,0.08)]">
          {options.map((o, i) => (
            <li
              key={o.id}
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
              <span className="label opacity-70">{KINDS[o.kind].label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
