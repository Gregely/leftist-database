"use client";

import { useEffect, useState } from "react";

export interface PickedMedia {
  id: string;
  url: string;
  title: string;
  caption?: string;
  altText?: string;
  credit?: string;
  license?: string;
  width?: number | null;
  height?: number | null;
  uses?: number;
}

/**
 * Choose an image from the library or upload a new one with its rights
 * metadata. Identical files are stored once — re-uploading returns the
 * existing record.
 */
export function MediaPicker({
  onSelect,
  onCancel,
  attachTo,
  role,
  submitLabel = "Use this image",
}: {
  onSelect: (m: PickedMedia, info: { duplicate: boolean; uploaded: boolean }) => void;
  onCancel?: () => void;
  /** Upload-and-attach in one step. */
  attachTo?: string;
  role?: string;
  submitLabel?: string;
}) {
  const [tab, setTab] = useState<"library" | "upload">("library");
  return (
    <div className="border border-ink bg-paper-warm">
      <div role="tablist" aria-label="Media source" className="flex border-b border-ink">
        {(["library", "upload"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`label px-4 py-2.5 ${tab === t ? "bg-ink text-paper" : "hover:bg-paper"}`}
          >
            {t === "library" ? "From the library" : "Upload new"}
          </button>
        ))}
        {onCancel && (
          <button type="button" onClick={onCancel} className="label ml-auto px-4 text-muted hover:text-ink">
            Close ✕
          </button>
        )}
      </div>
      <div className="p-4">{tab === "library" ? <Library onSelect={(m) => onSelect(m, { duplicate: false, uploaded: false })} submitLabel={submitLabel} /> : <Upload onDone={onSelect} attachTo={attachTo} role={role} />}</div>
    </div>
  );
}

function Library({ onSelect, submitLabel }: { onSelect: (m: PickedMedia) => void; submitLabel: string }) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<PickedMedia[]>([]);
  const [chosen, setChosen] = useState<PickedMedia | null>(null);
  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/desk/media?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        if (r.ok) setItems((await r.json()).items);
      } catch {}
    }, 150);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [q]);
  return (
    <div>
      <label className="label mb-1 block text-faint" htmlFor="media-search">
        Search the library
      </label>
      <input id="media-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title, caption, creator, tag…" className="field" />
      {items.length === 0 ? (
        <p className="mt-4 text-sm italic text-muted">No images yet. Upload one in the other tab.</p>
      ) : (
        <ul className="mt-4 grid max-h-80 grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4 lg:grid-cols-6">
          {items.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setChosen(m)}
                aria-pressed={chosen?.id === m.id}
                className={`block w-full border text-left ${chosen?.id === m.id ? "border-red ring-2 ring-red" : "border-rule hover:border-ink"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.altText || ""} className="aspect-square w-full bg-beige/40 object-cover" loading="lazy" />
                <span className="block truncate px-1.5 py-1 text-xs">{m.title || "Untitled"}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex items-center gap-3">
        <button type="button" disabled={!chosen} onClick={() => chosen && onSelect(chosen)} className="btn btn-red disabled:opacity-50">
          {submitLabel}
        </button>
        {chosen && !chosen.altText && <span className="text-xs text-red-deep">This image has no alt text yet — add it in the media library.</span>}
      </div>
    </div>
  );
}

const META: { name: string; label: string; required?: boolean; help?: string; wide?: boolean }[] = [
  { name: "title", label: "Title", required: true },
  { name: "altText", label: "Alt text", required: true, help: "What the image shows, for readers who cannot see it.", wide: true },
  { name: "caption", label: "Caption", wide: true },
  { name: "creator", label: "Creator (photographer, artist)" },
  { name: "year", label: "Year" },
  { name: "credit", label: "Credit line" },
  { name: "sourceText", label: "Source / archive" },
  { name: "license", label: "Licence", help: "e.g. Public domain, CC BY-SA 4.0" },
  { name: "rights", label: "Rights notes" },
  { name: "tags", label: "Tags", help: "Comma separated" },
];

function Upload({ onDone, attachTo, role }: { onDone: (m: PickedMedia, info: { duplicate: boolean; uploaded: boolean }) => void; attachTo?: string; role?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        if (!file) return setError("Choose an image file.");
        if (!String(fd.get("altText") ?? "").trim()) return setError("Alt text is required.");
        if (attachTo) {
          fd.set("attachTo", attachTo);
          fd.set("role", role ?? "figure");
        }
        setBusy(true);
        const r = await fetch("/api/desk/media", { method: "POST", body: fd });
        setBusy(false);
        const data = await r.json();
        if (!r.ok) return setError(data.error ?? "Upload failed.");
        onDone(
          { id: data.id, url: `/media/${data.id}`, title: String(fd.get("title") ?? ""), caption: String(fd.get("caption") ?? ""), altText: String(fd.get("altText") ?? "") },
          { duplicate: data.duplicate, uploaded: true },
        );
      }}
      className="grid gap-4 md:grid-cols-[12rem_1fr]"
    >
      <div>
        <label htmlFor="media-file" className="label mb-1 block">
          Image file *
        </label>
        <input
          id="media-file"
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-xs file:mr-2 file:border file:border-ink file:bg-paper file:px-2 file:py-1 file:text-xs file:uppercase file:tracking-wider"
        />
        <p className="mt-1 text-xs text-faint">JPEG, PNG, WebP or GIF, up to 12 MB.</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {preview && <img src={preview} alt="" className="mt-3 w-full border border-rule" />}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {META.map((m) => (
          <label key={m.name} className={m.wide ? "sm:col-span-2" : ""}>
            <span className="label mb-1 block">
              {m.label}
              {m.required && <span className="text-red"> *</span>}
            </span>
            <input name={m.name} required={m.required} defaultValue={m.name === "title" && file ? file.name.replace(/\.[a-z0-9]+$/i, "") : undefined} key={m.name === "title" ? file?.name : m.name} className="field py-1.5" />
            {m.help && <span className="mt-0.5 block text-xs text-faint">{m.help}</span>}
          </label>
        ))}
        {error && (
          <p role="alert" className="text-sm text-red-deep sm:col-span-2">
            {error}
          </p>
        )}
        <div className="sm:col-span-2">
          <button type="submit" disabled={busy} className="btn btn-red disabled:opacity-60">
            {busy ? "Uploading…" : attachTo ? "Upload and attach" : "Upload"}
          </button>
        </div>
      </div>
    </form>
  );
}
