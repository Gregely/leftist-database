import Link from "next/link";
import { SITE } from "@/lib/site";

/**
 * Text wordmark: "Theory" in the serif italic, "ATLAS" in condensed capitals,
 * joined by a short red rule — the two voices of the site (the text and the index).
 * "stacked" sets the two words on separate lines, for the footer and desk.
 */
export function Wordmark({
  variant = "inline",
  className = "",
  asLink = true,
}: {
  variant?: "inline" | "stacked";
  className?: string;
  asLink?: boolean;
}) {
  const [a, b] = SITE.name;
  const inner = (
    <span className={`inline-flex ${variant === "stacked" ? "flex-col items-start leading-[0.86]" : "items-baseline gap-[0.28em] whitespace-nowrap leading-none"}`}>
      <span className="font-serif text-[1.18em] font-normal italic tracking-[-0.01em]">{a}</span>
      <span className="inline-flex items-baseline gap-[0.28em]">
        {variant === "inline" && <span aria-hidden="true" className="inline-block h-[0.14em] w-[0.7em] -translate-y-[0.28em] bg-red" />}
        <span className="font-sans font-extrabold uppercase tracking-[0.04em] [font-variation-settings:'wdth'_68]">{b}</span>
      </span>
    </span>
  );
  if (!asLink) return <span className={className}>{inner}</span>;
  return (
    <Link href="/" className={className} aria-label={`${a} ${b} — home`}>
      {inner}
    </Link>
  );
}
