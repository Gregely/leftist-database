import Link from "next/link";
import { KINDS } from "@/lib/content/model";
import type { RelatedEntity } from "@/lib/data/types";
import { EmptyNote, lifespan } from "@/components/editorial/primitives";

const FAMILY_MARK: Record<string, string> = {
  influence: "→",
  critique: "⟂",
  response: "↩",
  affinity: "~",
  structure: "·",
};

/** Relationships as an annotated list: label, entry, years and editorial note. */
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
    <ul className="border-t border-rule">
      {items.map((r) => (
        <li key={r.relationshipId + r.direction} className="border-b border-rule">
          <Link href={r.href} className="group grid grid-cols-[1.5rem_1fr_auto] gap-x-3 py-3">
            <span aria-hidden="true" className={`pt-1 text-sm ${r.family === "critique" ? "text-red" : "text-faint"}`}>
              {FAMILY_MARK[r.family]}
            </span>
            <span>
              {showLabel && <span className="label block text-faint">{r.label}</span>}
              <span className="font-serif text-xl leading-tight group-hover:text-red">{r.title}</span>
              {r.note && <span className="mt-1 block text-sm leading-snug text-muted">{r.note}</span>}
            </span>
            <span className="text-right">
              <span className="label-mono block text-faint">{lifespan(r.yearStart, r.yearEnd, r.kind)}</span>
              {showKind && <span className="label block text-faint">{KINDS[r.kind].label}</span>}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Compact grid of entity cards — used for works, members, related entries. */
export function EntryGrid({
  items,
  cols = 3,
}: {
  items: { id: string; title: string; href: string; summary?: string; yearStart?: number | null; yearEnd?: number | null; kind?: RelatedEntity["kind"]; note?: string }[];
  cols?: 2 | 3;
}) {
  return (
    <ul className={`grid gap-x-8 border-t border-rule sm:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : ""}`}>
      {items.map((i) => (
        <li key={i.id} className="border-b border-rule">
          <Link href={i.href} className="group block py-4">
            <span className="flex items-baseline justify-between gap-3">
              <span className="font-serif text-xl leading-tight group-hover:text-red">{i.title}</span>
              {i.yearStart != null && <span className="label-mono text-faint">{lifespan(i.yearStart, i.yearEnd ?? null, i.kind)}</span>}
            </span>
            {(i.note || i.summary) && <span className="mt-1.5 block text-sm leading-snug text-muted">{i.note || i.summary}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
