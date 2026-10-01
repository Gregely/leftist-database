"use client";

import Link from "next/link";
import { useBookmarks } from "@/lib/client/bookmarks";

export function BookmarkCount({ className = "" }: { className?: string }) {
  const { items } = useBookmarks();
  return (
    <Link href="/bookmarks" className={`label inline-flex items-center gap-2 hover:text-red ${className}`}>
      <span>Bookmarks</span>
      <span
        className={`label-mono inline-flex h-[18px] min-w-[18px] items-center justify-center border px-1 ${items.length ? "border-red text-red" : "border-rule text-faint"}`}
        aria-label={`${items.length} saved`}
      >
        {items.length}
      </span>
    </Link>
  );
}
