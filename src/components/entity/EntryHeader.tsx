import Link from "next/link";
import type { ReactNode } from "react";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";
import { Container, StatusMark } from "@/components/editorial/primitives";
import { KINDS } from "@/lib/content/model";
import type { EntitySummary } from "@/lib/data/types";

/**
 * Shared masthead for every entry page: kind label, catalogue number,
 * large serif title, a standfirst and a right-hand column for metadata.
 */
export function EntryHeader({
  entity,
  number,
  title,
  meta,
  standfirst,
  aside,
  titleClassName = "text-[3.4rem] sm:text-[5.4rem] xl:text-[6.5rem]",
  children,
}: {
  entity: EntitySummary;
  number?: number | string;
  title?: ReactNode;
  meta?: ReactNode;
  standfirst?: ReactNode;
  aside?: ReactNode;
  titleClassName?: string;
  children?: ReactNode;
}) {
  const kind = KINDS[entity.kind];
  return (
    <Container className="pt-6 sm:pt-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-2">
        <ol className="label flex items-center gap-2 text-muted">
          <li>
            <Link href="/explore" className="hover:text-red">
              Atlas
            </Link>
          </li>
          <li aria-hidden="true" className="text-red">/</li>
          <li>
            <Link href={kind.base} className="hover:text-red">
              {kind.plural}
            </Link>
          </li>
          {number != null && (
            <>
              <li aria-hidden="true" className="text-red">/</li>
              <li className="label-mono text-faint">No. {String(number).padStart(3, "0")}</li>
            </>
          )}
        </ol>
        <div className="flex items-center gap-4">
          <StatusMark status={entity.status} />
          <BookmarkButton
            entity={{ id: entity.id, kind: entity.kind, title: entity.title, href: entity.href, subtitle: entity.subtitle }}
          />
        </div>
      </nav>

      <header className="grid gap-10 pb-12 pt-10 sm:pt-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <p className="label slash text-red">{kind.label}</p>
          <h1 className={`display mt-4 text-balance ${titleClassName}`}>{title ?? entity.title}</h1>
          {meta && <div className="mt-4">{meta}</div>}
          {standfirst && <div className="lede mt-6 max-w-2xl text-ink-warm">{standfirst}</div>}
          {children}
        </div>
        {aside && <div className="lg:col-span-4 lg:pt-10">{aside}</div>}
      </header>
    </Container>
  );
}
