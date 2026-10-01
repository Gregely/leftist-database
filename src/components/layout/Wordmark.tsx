import Link from "next/link";
import { SITE } from "@/lib/site";

/**
 * Text wordmark. "inline" renders THEORY / ATLAS on one line; "stacked"
 * renders THEORY over / ATLAS — the slash is the recurring motif.
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
  const inner =
    variant === "stacked" ? (
      <span className="flex flex-col leading-[0.92]">
        <span>{a}</span>
        <span>
          <span className="text-red">/</span>&thinsp;{b}
        </span>
      </span>
    ) : (
      <span className="whitespace-nowrap">
        {a} <span className="text-red">/</span> {b}
      </span>
    );
  const cls = `font-sans font-semibold uppercase tracking-[0.2em] ${className}`;
  if (!asLink) return <span className={cls}>{inner}</span>;
  return (
    <Link href="/" className={cls} aria-label={`${a} / ${b} — home`}>
      {inner}
    </Link>
  );
}
