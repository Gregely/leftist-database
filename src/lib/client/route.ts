"use client";

import { useSyncExternalStore } from "react";

/**
 * The Guided journey a reader is following, kept in this browser only. It lets
 * the rest of the site offer a way back ("Return to step 3 of …") after the
 * reader leaves a journey to read a full entry. Nothing is sent to the server.
 */
export interface ActiveRoute {
  slug: string;
  title: string;
  step: number;
  total: number;
  /** Public URL of the step being read. */
  href: string;
  /** Entry pages that are stops on this journey, in order (href + title). */
  stops: { href: string; title: string }[];
}

const KEY = "atlas:guided:active";
const EVENT = "atlas:route";

let cache: { raw: string | null; value: ActiveRoute | null } = { raw: null, value: null };

function read(): ActiveRoute | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === cache.raw) return cache.value;
    const value = raw ? (JSON.parse(raw) as ActiveRoute) : null;
    cache = { raw, value: value && typeof value.slug === "string" && Array.isArray(value.stops) ? value : null };
    return cache.value;
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useActiveRoute() {
  return useSyncExternalStore(subscribe, read, () => null);
}

export function setActiveRoute(route: ActiveRoute) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(route));
  } catch {
    /* storage unavailable — the reader simply gets no way-back ribbon */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function clearActiveRoute() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}
