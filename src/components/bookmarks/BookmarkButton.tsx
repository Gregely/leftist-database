"use client";

import { useBookmarks } from "@/lib/client/bookmarks";
import type { EntityKind } from "@/lib/content/model";

export function BookmarkButton({
  entity,
  className = "",
}: {
  entity: { id: string; kind: EntityKind; title: string; href: string; subtitle?: string | null };
  className?: string;
}) {
  const { has, toggle } = useBookmarks();
  const saved = has(entity.id);
  return (
    <button
      type="button"
      onClick={() => toggle(entity)}
      aria-pressed={saved}
      className={`label group inline-flex items-center gap-2 transition-colors ${saved ? "text-red" : "text-muted hover:text-ink"} ${className}`}
    >
      <svg width="11" height="14" viewBox="0 0 11 14" aria-hidden="true" className="shrink-0">
        <path
          d="M1 1h9v12L5.5 9.6 1 13z"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.2"
          className="transition-[fill]"
        />
      </svg>
      <span>{saved ? "Saved" : "Save"}</span>
      <span className="sr-only"> {entity.title} to bookmarks</span>
    </button>
  );
}
