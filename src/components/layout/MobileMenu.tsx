"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/site";
import { useSearch } from "@/components/search/SearchProvider";
import { useBookmarks } from "@/lib/client/bookmarks";
import { isActive } from "./NavLinks";

/** Compact index menu for small screens: a full-height sheet of numbered sections. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const { open: openSearch } = useSearch();
  const { items } = useBookmarks();
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links = [...NAV, { label: "Learning paths", href: "/paths" }, { label: "Sources", href: "/sources" }];

  return (
    <>
      <button
        ref={btn}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-index"
        className="label inline-flex h-10 items-center gap-2"
      >
        <span>{open ? "Close" : "Index"}</span>
        <span aria-hidden="true" className="relative block h-3 w-4">
          <span className={`absolute left-0 top-0 h-px w-4 bg-ink transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`} />
          <span className={`absolute left-0 top-[6px] h-px w-4 bg-red transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`absolute left-0 top-3 h-px w-4 bg-ink transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
        </span>
      </button>
      {open && (
        <nav
          id="mobile-index"
          aria-label="Site index"
          className="fixed inset-x-0 bottom-0 top-[57px] z-40 overflow-y-auto border-t border-ink bg-paper px-4 pb-10 pt-4 animate-fade"
        >
          <ol>
            {links.map((l, i) => {
              const active = isActive(pathname, l.href);
              return (
                <li key={l.href} className="border-b border-rule">
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className="flex items-baseline gap-4 py-3.5"
                  >
                    <span className="label-mono w-6 text-faint">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`font-serif text-[1.9rem] leading-none ${active ? "text-red" : ""}`}>{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => { setOpen(false); openSearch(); }} className="btn justify-center">
              Search
            </button>
            <Link href="/bookmarks" className="btn btn-quiet justify-center">
              Bookmarks · {items.length}
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
