import Link from "next/link";
import { PERIODS } from "@/lib/site";

export interface StripMark {
  year: number;
  title: string;
  href?: string | null;
  /** text → bookcloth blue, event → umber, other → ink. */
  kind?: "text" | "event" | "life" | string;
}

const FROM = 1770;
const TO = 2030;
const pct = (y: number) => ((Math.min(Math.max(y, FROM), TO) - FROM) / (TO - FROM)) * 100;
const TONE: Record<string, string> = { text: "var(--color-blue)", event: "var(--color-umber)" };

/**
 * Where an entry sits in history: the Atlas's periods as bands along one
 * axis, the entry's span (a life, a tradition) or moment (a text) set on it in
 * red, and its works and events as ticks. Periods link to the timeline.
 */
export function PeriodStrip({
  from,
  to,
  marks = [],
  label,
  ongoing = false,
  className = "",
}: {
  from: number;
  to?: number | null;
  /** The span has not ended (a living thinker, a continuing tradition): drawn to the present, captioned "from …". */
  ongoing?: boolean;
  marks?: StripMark[];
  /** A caption for the red span, e.g. "Life" or "Published". */
  label?: string;
  className?: string;
}) {
  const end = ongoing ? 2026 : (to ?? from);
  const span = ongoing ? `from ${from}` : `${from}${end !== from ? `–${end}` : ""}`;
  const active = PERIODS.filter((p) => p.from <= end && p.to >= from);
  return (
    <figure className={className} aria-label={`${label ?? "Span"} ${span}, set against the Atlas's historical periods`}>
      <div className="relative h-[4.6rem]">
        {/* Period bands */}
        {PERIODS.map((p, i) => {
          const on = active.includes(p);
          return (
            <Link
              key={p.slug}
              href={`/timeline?from=${p.from}&to=${Math.min(p.to, 2026)}`}
              title={`${p.label}, ${p.from}–${Math.min(p.to, 2026)}`}
              className={`group absolute top-0 h-8 border-l border-ink/50 px-1.5 pt-1 transition-colors ${on ? "bg-beige" : i % 2 ? "bg-paper-deep/70" : "bg-paper-deep/30"} hover:bg-beige`}
              style={{ left: `${pct(p.from)}%`, width: `${pct(p.to + 1) - pct(p.from)}%` }}
            >
              <span className={`label block truncate text-[0.64rem] ${on ? "text-ink" : "text-faint"} group-hover:text-red`}>{p.label}</span>
            </Link>
          );
        })}
        {/* Axis */}
        <div aria-hidden="true" className="absolute inset-x-0 top-8 h-px bg-ink" />
        {/* The entry's span */}
        {end > from ? (
          <div
            aria-hidden="true"
            className="absolute top-[1.85rem] h-[7px] bg-red"
            style={{ left: `${pct(from)}%`, width: `${pct(end) - pct(from)}%`, ...(ongoing ? { maskImage: "linear-gradient(to right, black 85%, transparent)" } : {}) }}
          />
        ) : (
          <div aria-hidden="true" className="absolute top-[1.68rem] h-[11px] w-[11px] -translate-x-1/2 rotate-45 bg-red" style={{ left: `${pct(from)}%` }} />
        )}
        {/* Works and events */}
        {marks.map((m, i) => {
          const cls = "absolute top-9 -ml-[5px] flex h-5 w-[11px] justify-center";
          const tick = <span className="block h-3 w-[3px]" style={{ background: TONE[m.kind ?? ""] ?? "var(--color-ink)" }} />;
          return m.href ? (
            <Link key={i} href={m.href} title={`${m.year}: ${m.title}`} className={`${cls} hover:[&>span]:bg-red!`} style={{ left: `${pct(m.year)}%` }}>
              {tick}
              <span className="sr-only">
                {m.year}: {m.title}
              </span>
            </Link>
          ) : (
            <span key={i} title={`${m.year}: ${m.title}`} aria-hidden="true" className={cls} style={{ left: `${pct(m.year)}%` }}>
              {tick}
            </span>
          );
        })}
        {/* Axis years */}
        {[1800, 1850, 1900, 1950, 2000].map((y) => (
          <span key={y} aria-hidden="true" className="label-mono absolute bottom-0 -translate-x-1/2 text-[0.68rem] text-faint" style={{ left: `${pct(y)}%` }}>
            {y}
          </span>
        ))}
      </div>
      <figcaption className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.8rem] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-[6px] w-4 bg-red" />
          {label ?? "Span"} {span}
        </span>
        {marks.some((m) => m.kind === "text") && (
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-3 w-[3px] bg-blue" /> Works
          </span>
        )}
        {marks.some((m) => m.kind === "event") && (
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-3 w-[3px] bg-umber" /> Events
          </span>
        )}
        {active.length > 0 && (
          <span className="font-serif italic">
            {active.map((p) => p.label).join(" · ")}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
