"use client";

import Link from "next/link";
import { useBookmarks } from "@/lib/client/bookmarks";

export function BookmarkCount({ className = "" }: { className?: string }) {
  const { items } = useBookmarks();
  return (
    <Link href="/bookmarks" className={`label inline-flex items-center gap-2 hover:text-red ${className}`} aria-label={`Saved entries: ${items.length}`}>
      <svg width="10" height="13" viewBox="0 0 11 14" aria-hidden="true" className={items.length ? "text-red" : ""}>
        <path d="M1 1h9v12L5.5 9.6 1 13z" fill={items.length ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.3" />
      </svg>
      <span className="hidden lg:inline">Saved</span>
      <span className={`label-mono ${items.length ? "text-red" : "text-faint"}`}>{items.length}</span>
    </Link>
  );
}
