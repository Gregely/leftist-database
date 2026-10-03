import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLink, Container, SectionHead } from "@/components/editorial/primitives";
import { SearchTrigger } from "@/components/search/SearchProvider";

export interface CollectionItem {
  label: string;
  href: string;
  /** What the section contains, in a few words. */
  description: string;
  /** A few real titles from the section (wide screens only). */
  examples?: string;
  count?: number;
}

/**
 * The homepage's index of the collection: every major area at equal weight,
 * with its size and a few of its entries. Set as a ruled index, not as cards.
 */
export function CollectionIndex({ items, number, aside }: { items: CollectionItem[]; number: string; aside?: ReactNode }) {
  return (
    <section aria-labelledby="collection-heading" data-home-collection>
      <Container className="pb-14 pt-8 sm:pb-20 sm:pt-12">
        <SectionHead number={number} id="collection-heading" label="Explore the collection" aside={aside ?? <ArrowLink href="/explore">Full library</ArrowLink>} />
        <ul className="mt-6 grid grid-cols-2 gap-x-6 border-t border-ink md:grid-cols-3 md:gap-x-10">
          {items.map((item, i) => (
            <li key={item.label} className="border-b border-rule">
              <Entry number={i + 1} item={item} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Entry({ number, item }: { number: number; item: CollectionItem }) {
  const body = (
    <>
      <span className="flex items-baseline justify-between gap-3">
        <span className="flex min-w-0 items-baseline gap-2.5">
          <span className="label-mono text-red">{String(number).padStart(2, "0")}</span>
          <span className="font-serif text-[1.35rem] leading-none transition-colors group-hover:text-red sm:text-[1.9rem]">{item.label}</span>
        </span>
        <span className="flex shrink-0 items-baseline gap-3">
          {item.count != null && <span className="label-mono hidden text-muted sm:inline">{String(item.count).padStart(2, "0")}</span>}
          <span aria-hidden="true" className="text-red transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </span>
      <span className="mt-1.5 block text-[0.82rem] leading-snug text-muted sm:text-[0.9rem]">{item.description}</span>
      {item.examples && <span className="mt-0.5 hidden truncate text-[0.8rem] text-faint md:block">{item.examples}</span>}
    </>
  );
  const cls = "group h-full w-full py-3.5 text-left transition-colors hover:bg-paper-warm sm:py-4";
  // Search opens the site-wide search overlay, as "/" does from any page; the hero's search form works without JavaScript.
  if (item.href === "/search")
    return (
      // A stretched button centres its content; keep it at the top like the links beside it.
      <SearchTrigger className={`${cls} flex flex-col justify-start`}>
        <span className="block">{body}</span>
      </SearchTrigger>
    );
  return (
    <Link href={item.href} className={`${cls} block`}>
      {body}
    </Link>
  );
}
