"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export interface DeskNavItem {
  href: string;
  label: string;
  badge?: number;
}

/** Desk navigation: a horizontal ruled bar on wide screens, a folding index on phones. */
export function DeskNav({ items }: { items: DeskNavItem[] }) {
  const pathname = usePathname() ?? "/admin";
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/"));

  const links = (
    <ul className="flex flex-col gap-0 lg:flex-row lg:items-center lg:gap-6">
      {items.map((i) => (
        <li key={i.href}>
          <Link
            href={i.href}
            aria-current={active(i.href) ? "page" : undefined}
            className={`label flex items-center gap-2 border-b border-white/10 py-3 lg:border-0 lg:py-2.5 ${active(i.href) ? "text-paper underline decoration-red decoration-2 underline-offset-[7px]" : "text-ink-muted hover:text-paper"}`}
          >
            {i.label}
            {i.badge ? <span className="label-mono bg-red px-1.5 text-[0.62rem] text-paper-warm">{i.badge}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <nav aria-label="Editorial desk">
      <div className="hidden lg:block">{links}</div>
      <div className="lg:hidden">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="desk-nav-mobile" className="label py-3 text-ink-muted hover:text-paper">
          {open ? "Close index ✕" : "Desk index ☰"}
        </button>
        {open && (
          <div id="desk-nav-mobile" className="pb-3">
            {links}
          </div>
        )}
      </div>
    </nav>
  );
}
