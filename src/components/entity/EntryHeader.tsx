import Link from "next/link";
import type { ReactNode } from "react";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";
import { Container, SampleMark, Swatch } from "@/components/editorial/primitives";
import { KINDS } from "@/lib/content/model";
import type { EntitySummary } from "@/lib/data/types";

/**
 * Shared title block for every entry page: a catalogue line (where this sits
 * in the collection), the kind in its bookcloth colour, a large title, a line
 * of facts, a standfirst, and a catalogue record in the right-hand column.
 * `band` is set full-width beneath the title block (e.g. a lifeline).
 */
export function EntryHeader({
  entity,
  number,
  title,
  meta,
  standfirst,
  aside,
  titleClassName = "text-[3.2rem] sm:text-[5rem] xl:text-[6.2rem]",
  children,
  band,
  kicker,
}: {
  entity: EntitySummary;
  number?: number | string;
  title?: ReactNode;
  meta?: ReactNode;
  standfirst?: ReactNode;
  aside?: ReactNode;
  titleClassName?: string;
  children?: ReactNode;
  band?: ReactNode;
  /** Replaces the kind label above the title. */
  kicker?: ReactNode;
}) {
  const kind = KINDS[entity.kind];
  return (
    <Container className="pt-5 sm:pt-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center justify-between gap-3 border-b border-ink pb-2">
        <ol className="label flex items-center gap-2 text-muted">
          <li>
            <Link href="/explore" className="hover:text-red">
              Atlas
            </Link>
          </li>
          <li aria-hidden="true" className="text-rule">
            /
          </li>
          <li>
            <Link href={kind.base} className="hover:text-red">
              {kind.plural}
            </Link>
          </li>
          {number != null && (
            <>
              <li aria-hidden="true" className="text-rule">
                /
              </li>
              <li className="label-mono text-faint">No. {String(number).padStart(3, "0")}</li>
            </>
          )}
        </ol>
        <div className="flex items-center gap-4">
          <SampleMark sample={entity.sample} />
          <BookmarkButton entity={{ id: entity.id, kind: entity.kind, title: entity.title, href: entity.href, subtitle: entity.subtitle }} />
        </div>
      </nav>

      <header className="grid gap-10 pb-10 pt-9 sm:pt-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-8">
          <p className="kicker flex items-center gap-2 text-ink">
            {kicker ?? (
              <>
                <Swatch kind={entity.kind} />
                {kind.label}
              </>
            )}
          </p>
          <h1 className={`display mt-4 text-balance ${titleClassName}`}>{title ?? entity.title}</h1>
          {meta && <div className="mt-5">{meta}</div>}
          {standfirst && <div className="lede mt-6 max-w-[40rem] text-ink-warm">{standfirst}</div>}
          {children}
        </div>
        {aside && <div className="lg:col-span-4 lg:pt-12">{aside}</div>}
      </header>
      {band}
    </Container>
  );
}
