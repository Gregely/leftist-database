"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

const SearchOverlay = dynamic(() => import("./SearchOverlay").then((m) => m.SearchOverlay), { ssr: false });

const Ctx = createContext<{ open: (q?: string) => void }>({ open: () => {} });
export const useSearch = () => useContext(Ctx);

/** Owns the archive search overlay; "/" opens it from anywhere. */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; q: string }>({ open: false, q: "" });
  const open = useCallback((q = "") => setState({ open: true, q }), []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
      if (!typing && e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        open();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      {state.open && <SearchOverlay initialQuery={state.q} onClose={close} />}
    </Ctx.Provider>
  );
}

export function SearchTrigger({ className = "", children }: { className?: string; children?: ReactNode }) {
  const { open } = useSearch();
  return (
    <button type="button" onClick={() => open()} className={className} aria-haspopup="dialog">
      {children ?? (
        <span className="label inline-flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
            <circle cx="5.5" cy="5.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <path d="M9 9l3.5 3.5" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          Search
          <kbd className="label-mono hidden border border-rule px-1 text-faint lg:inline">/</kbd>
        </span>
      )}
    </button>
  );
}
