import Link from "next/link";
import { KINDS } from "@/lib/content/model";
import type { RelatedEntity } from "@/lib/data/types";
import { EmptyNote, lifespan, Swatch } from "@/components/editorial/primitives";

/** A glyph for each family of relationship; critique is the one set in red. */
export const FAMILY_MARK: Record<string, string> = {
  influence: "→",
  critique: "⟂",
  response: "↩",
  affinity: "~",
  structure: "·",
};

/**
 * Relationships as an annotated list. Each line reads as a phrase — the
 * relationship in italic ("critiqued", "drew on"), then the entry — with the
 * editorial note beneath it.
 */
export function RelationList({
  items,
  empty,
  showKind = false,
  showLabel = true,
}: {
  items: RelatedEntity[];
  empty?: string;
  showKind?: boolean;
  showLabel?: boolean;
}) {
  if (!items.length) return empty ? <EmptyNote>{empty}</EmptyNote> : null;
  return (
    <ul className="border-t border-ink">
      {items.map((r) => (
        <li key={r.relationshipId + r.direction} className="border-b border-rule">
          <Link href={r.href} className="group grid grid-cols-[1.25rem_1fr_auto] gap-x-3 py-3">
            <span aria-hidden="true" className={`pt-1.5 text-[0.95rem] leading-none ${r.family === "critique" ? "text-red" : "text-faint"}`}>
              {FAMILY_MARK[r.family]}
            </span>
            <span className="min-w-0">
              {showLabel && <span className="rel block leading-tight">{r.label}</span>}
              <span className="font-serif text-[1.3rem] leading-tight transition-colors group-hover:text-red">{r.title}</span>
              {r.note && <span className="mt-1 block text-[0.9rem] leading-snug text-muted">{r.note}</span>}
            </span>
            <span className="pt-1 text-right">
              <span className="label-mono block text-faint">{lifespan(r.yearStart, r.yearEnd, r.kind)}</span>
              {showKind && (
                <span className="label mt-0.5 inline-flex items-center gap-1 text-faint">
                  <Swatch kind={r.kind} />
                  {KINDS[r.kind].label}
                </span>
              )}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** A ruled list of entries in columns — works, members, related entries. */
export function EntryGrid({
  items,
  cols = 3,
}: {
  items: { id: string; title: string; href: string; summary?: string; yearStart?: number | null; yearEnd?: number | null; kind?: RelatedEntity["kind"]; note?: string }[];
  cols?: 2 | 3;
}) {
  return (
    <ul className={`grid gap-x-10 border-t border-ink sm:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : ""}`}>
      {items.map((i) => (
        <li key={i.id} className="border-b border-rule">
          <Link href={i.href} className="group block py-4">
            <span className="flex items-baseline justify-between gap-3">
              <span className={`font-serif text-[1.3rem] leading-tight group-hover:text-red ${i.kind === "text" ? "italic" : ""}`}>{i.title}</span>
              {i.yearStart != null && <span className="label-mono shrink-0 text-faint">{lifespan(i.yearStart, i.yearEnd ?? null, i.kind)}</span>}
            </span>
            {(i.note || i.summary) && <span className="mt-1.5 line-clamp-3 block text-[0.9rem] leading-snug text-muted">{i.note || i.summary}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
