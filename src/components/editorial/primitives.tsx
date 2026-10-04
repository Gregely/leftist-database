import Link from "next/link";
import type { ReactNode } from "react";
import { KINDS, type EntityKind } from "@/lib/content/model";
import { KIND_TONE } from "@/lib/site";

/** Page-width container with the Atlas gutters. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-10 ${className}`}>{children}</div>;
}

export function Label({ children, className = "", as: As = "p" }: { children: ReactNode; className?: string; as?: "p" | "span" | "h2" | "h3" | "dt" }) {
  return <As className={`label ${className}`}>{children}</As>;
}

/** A small square in an area's bookcloth colour. */
export function Swatch({ kind, tone, className = "" }: { kind?: EntityKind; tone?: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-[0.6em] w-[0.6em] shrink-0 ${className}`}
      style={{ background: tone ?? (kind ? KIND_TONE[kind] : "var(--color-ink)") }}
    />
  );
}

/**
 * Section opening: the double rule and a condensed label, with an optional
 * link or count at the right. `tone="ink"` for sections set on a dark ground.
 */
export function SectionHead({
  number,
  label,
  id,
  aside,
  className = "",
  tone = "paper",
}: {
  number?: string;
  label: string;
  id?: string;
  aside?: ReactNode;
  className?: string;
  tone?: "paper" | "ink";
}) {
  const ink = tone === "ink";
  return (
    <header className={className}>
      <div className={`flex items-baseline justify-between gap-4 pt-3 ${ink ? "border-t-[3px] border-paper/80" : "rule-double"}`}>
        <h2 id={id} className="label flex items-baseline gap-3 pt-1.5 font-sans">
          {number && <span className={`label-mono ${ink ? "text-red-bright" : "text-red"}`}>{number}</span>}
          <span className={ink ? "text-paper" : "text-ink"}>{label}</span>
        </h2>
        {aside && <div className="pt-1.5">{aside}</div>}
      </div>
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
    <Link href={href} className={`group label inline-flex items-center gap-1.5 ${color} ${className}`}>
      <span className="link-sweep">{children}</span>
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

export function KindTag({ kind, className = "" }: { kind: EntityKind; className?: string }) {
  return (
    <span className={`label inline-flex items-center gap-1.5 text-faint ${className}`}>
      <Swatch kind={kind} />
      {KINDS[kind].label}
    </span>
  );
}

/** Marks seeded sample entries, so placeholder content is never mistaken for finished work. */
export function SampleMark({ sample, className = "" }: { sample: boolean; className?: string }) {
  if (!sample) return null;
  return (
    <span
      className={`label inline-flex items-center gap-1.5 border border-dashed border-red/70 px-1.5 py-0.5 text-red ${className}`}
      title="This is a sample record demonstrating the Atlas. It is not finished scholarship."
    >
      <span aria-hidden="true">◐</span>
      Sample entry
    </span>
  );
}

export function lifespan(a: number | null, b: number | null, kind?: EntityKind) {
  if (a == null) return "";
  if (kind === "thinker") return b == null ? `b. ${a}` : `${a}–${b}`;
  return b != null && b !== a ? `${a}–${b}` : `${a}`;
}

/** A catalogue record: ruled key/value rows, as on a library card. */
export function MetaList({ items, className = "" }: { items: { label: string; value: ReactNode }[]; className?: string }) {
  const shown = items.filter((i) => i.value != null && i.value !== "" && i.value !== false && !(Array.isArray(i.value) && !i.value.length));
  if (!shown.length) return null;
  return (
    <dl className={`border-t border-ink ${className}`}>
      {shown.map((i) => (
        <div key={i.label} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-rule py-2.5">
          <dt className="label pt-[3px] text-faint">{i.label}</dt>
          <dd className="font-serif text-[1.02rem] leading-snug">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** An inline list of entity links separated by middots. */
export function EntityLinks({ items, className = "" }: { items: { id: string; title: string; href: string }[]; className?: string }) {
  if (!items.length) return null;
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

/** An oversized numeral. */
export function BigNumeral({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span aria-hidden="true" className={`numeral block leading-none text-red ${className}`}>
      {children}
    </span>
  );
}

/** A note set in the margin on wide screens, inline on narrow ones. */
export function Marginal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <aside className={`border-l border-red pl-3 text-[0.85rem] leading-snug text-muted ${className}`}>{children}</aside>;
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="border-t border-dashed border-rule py-3 font-serif text-[1.02rem] italic text-muted">{children}</p>;
}

/** Debate titles are questions; the question mark is set in red. */
export function Question({ title }: { title: string }) {
  return (
    <>
      {title.replace(/\?$/, "")}
      <span className="text-red">?</span>
    </>
  );
}

/** EntityLinks for a MetaList value: nothing at all when there are no items, so the row is left out. */
export function entityLinks(items: { id: string; title: string; href: string }[]) {
  return items.length ? <EntityLinks items={items} /> : null;
}
