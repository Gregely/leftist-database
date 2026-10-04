import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "./primitives";

/**
 * Masthead for index pages: the catalogue line, the section's name set large,
 * and its extent as a figure. No standfirst: the name and the list beneath it
 * say what the page is.
 */
export function IndexHeader({
  crumb,
  title,
  count,
  unit,
  tally,
  tone,
  children,
}: {
  crumb: string;
  title: ReactNode;
  /** The number of entries, set as a large figure beside the title. */
  count?: number;
  unit?: string;
  /** Further figures in the catalogue line, e.g. a breakdown by kind. */
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
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3 pb-8 pt-8 sm:pb-10 sm:pt-10">
        <h1 className="display text-balance text-[3.2rem] sm:text-[5rem] xl:text-[5.8rem]">{title}</h1>
        {count != null && (
          <p className="flex items-baseline gap-2 pb-2">
            <span className="numeral text-[2.6rem] leading-none text-red sm:text-[3.4rem]">{count}</span>
            {unit && <span className="label text-faint">{unit}</span>}
          </p>
        )}
      </div>
      {children}
    </Container>
  );
}
