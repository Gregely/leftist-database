"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { EntityKind } from "@/lib/content/model";

/**
 * Reader bookmarks, kept in this browser only (localStorage). They are a
 * per-reader convenience; nothing is sent to the server.
 */
export interface Bookmark {
  id: string;
  kind: EntityKind;
  title: string;
  href: string;
  subtitle?: string | null;
  savedAt: number;
}

const KEY = "atlas:bookmarks";
const EVENT = "atlas:bookmarks-changed";
const EMPTY: Bookmark[] = [];
let cache: { raw: string | null; value: Bookmark[] } = { raw: null, value: EMPTY };

function read(): Bookmark[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === cache.raw) return cache.value;
    const value = raw ? (JSON.parse(raw) as Bookmark[]) : EMPTY;
    cache = { raw, value: Array.isArray(value) ? value : EMPTY };
    return cache.value;
  } catch {
    return EMPTY;
  }
}

function write(items: Bookmark[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable (private mode, blocked) — bookmarks simply don't persist */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useBookmarks() {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);
  const toggle = useCallback((b: Omit<Bookmark, "savedAt">) => {
    const current = read();
    write(
      current.some((x) => x.id === b.id)
        ? current.filter((x) => x.id !== b.id)
        : [{ ...b, savedAt: Date.now() }, ...current],
    );
  }, []);
  const remove = useCallback((id: string) => write(read().filter((x) => x.id !== id)), []);
  const has = useCallback((id: string) => items.some((x) => x.id === id), [items]);
  return { items, toggle, remove, has };
}
