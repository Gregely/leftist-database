import Link from "next/link";
import type { ReactNode } from "react";
import { KINDS, STATUS_LABELS, type EntityKind, type EntryStatus } from "@/lib/content/model";

/** Page-width container with the Atlas gutters. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-4 sm:px-8 ${className}`}>{children}</div>;
}

export function Label({ children, className = "", as: As = "p" }: { children: ReactNode; className?: string; as?: "p" | "span" | "h2" | "h3" | "dt" }) {
  return <As className={`label ${className}`}>{children}</As>;
}

/** "01 / Concepts" — issue-like numbered section heading. */
export function SectionHead({
  number,
  label,
  title,
  id,
  aside,
  className = "",
  tone = "paper",
}: {
  number?: string;
  label: string;
  title?: ReactNode;
  id?: string;
  aside?: ReactNode;
  className?: string;
  tone?: "paper" | "ink";
}) {
  return (
    <header className={`${className}`}>
      <div className={`flex items-baseline justify-between gap-4 pt-3 ${tone === "ink" ? "border-t border-white/25" : "rule-lead"}`}>
        <h2 id={id} className="label font-sans">
          {number && <span className="label-mono mr-3 text-red">{number}</span>}
          <span className={tone === "ink" ? "text-paper" : "text-ink"}>{label}</span>
        </h2>
        {aside}
      </div>
      {title && (
        <p className={`display mt-5 max-w-4xl text-balance text-[2.1rem] sm:text-[2.9rem] ${tone === "ink" ? "text-paper" : ""}`}>
          {title}
        </p>
      )}
    </header>
  );
}

export function ArrowLink({
  href,
  children,
  className = "",
  tone = "red",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  tone?: "red" | "ink" | "paper";
}) {
  const color = tone === "red" ? "text-red" : tone === "paper" ? "text-paper" : "text-ink";
  return (
    <Link href={href} className={`group label inline-flex items-center gap-2 ${color} ${className}`}>
      <span className="link-sweep">{children}</span>
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

export function KindTag({ kind, className = "" }: { kind: EntityKind; className?: string }) {
  return <span className={`label text-faint ${className}`}>{KINDS[kind].label}</span>;
}

/** Marks sample / draft entries, so placeholder content is never mistaken for finished work. */
export function StatusMark({ status, className = "" }: { status: EntryStatus; className?: string }) {
  if (status === "published") return null;
  return (
    <span
      className={`label inline-flex items-center gap-1.5 border border-dashed border-red/60 px-1.5 py-0.5 text-red ${className}`}
      title="This is a sample record demonstrating the Atlas. It is not finished scholarship."
    >
      <span aria-hidden="true">◐</span>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function lifespan(a: number | null, b: number | null, kind?: EntityKind) {
  if (a == null) return "";
  if (kind === "thinker") return b == null ? `b. ${a}` : `${a}–${b}`;
  return b != null && b !== a ? `${a}–${b}` : `${a}`;
}

/** Definition-list sidebar block. */
export function MetaList({ items, className = "" }: { items: { label: string; value: ReactNode }[]; className?: string }) {
  const shown = items.filter((i) => i.value != null && i.value !== "" && !(Array.isArray(i.value) && !i.value.length));
  return (
    <dl className={`divide-y divide-rule border-y border-rule ${className}`}>
      {shown.map((i) => (
        <div key={i.label} className="grid grid-cols-[7.5rem_1fr] gap-3 py-2.5">
          <dt className="label pt-[3px] text-faint">{i.label}</dt>
          <dd className="text-[0.95rem] leading-snug">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A comma-free inline list of entity links. */
export function EntityLinks({ items, className = "" }: { items: { id: string; title: string; href: string }[]; className?: string }) {
  return (
    <span className={className}>
      {items.map((i, n) => (
        <span key={i.id}>
          <Link href={i.href} className="link-inline">
            {i.title}
          </Link>
          {n < items.length - 1 && <span className="text-faint"> · </span>}
        </span>
      ))}
    </span>
  );
}

/** An oversized decorative numeral. */
export function BigNumeral({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span aria-hidden="true" className={`numeral block leading-none text-red ${className}`}>
      {children}
    </span>
  );
}

/** Small note set in the margin on wide screens, inline on narrow ones. */
export function Marginal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <aside className={`border-l border-red pl-3 text-[0.82rem] leading-snug text-muted ${className}`}>{children}</aside>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <p className="border border-dashed border-rule px-4 py-3 text-sm italic text-muted">{children}</p>
  );
}
