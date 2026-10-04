import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "./primitives";

/**
 * Masthead for index pages: the catalogue line (with the section's
 * bookcloth colour and its extent), a large title, and a standfirst.
 */
export function IndexHeader({
  crumb,
  title,
  lede,
  tally,
  tone,
  children,
}: {
  crumb: string;
  title: ReactNode;
  lede?: ReactNode;
  tally?: ReactNode;
  /** The section's bookcloth colour (a CSS colour). */
  tone?: string;
  children?: ReactNode;
}) {
  return (
    <Container className="pt-5 sm:pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink pb-2">
        <p className="label flex items-center gap-2 text-muted">
          <Link href="/explore" className="hover:text-red">
            Atlas
          </Link>
          <span aria-hidden="true" className="text-rule">
            /
          </span>
          {tone && <span aria-hidden="true" className="inline-block h-2 w-2" style={{ background: tone }} />}
          <span className="text-ink">{crumb}</span>
        </p>
        {tally && <p className="label-mono text-faint">{tally}</p>}
      </div>
      <div className="grid gap-6 pb-10 pt-9 sm:pb-12 sm:pt-12 lg:grid-cols-12 lg:gap-10">
        <h1 className="display text-balance text-[3.2rem] sm:text-[5rem] lg:col-span-7 xl:text-[5.8rem]">{title}</h1>
        {lede && <div className="lede text-ink-warm lg:col-span-5 lg:pt-5">{lede}</div>}
      </div>
      {children}
    </Container>
  );
}
