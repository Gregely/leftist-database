import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLink, Container, SectionHead } from "@/components/editorial/primitives";
import { SearchTrigger } from "@/components/search/SearchProvider";

export interface CollectionItem {
  label: string;
  href: string;
  /** What the section contains, in a few words. */
  description: string;
  /** A few real titles from the section (hidden on phones). */
  examples?: string;
  count?: number;
}

export interface CollectionGroup {
  title: string;
  items: CollectionItem[];
}

/**
 * The homepage's map of the collection: every major section, grouped, with
 * its size and a few of its entries. Set as a ruled index, not as cards.
 */
export function CollectionIndex({ groups, number, aside }: { groups: CollectionGroup[]; number: string; aside?: ReactNode }) {
  let n = 0;
  return (
    <section aria-labelledby="collection-heading" data-home-collection>
      <Container className="pb-14 pt-8 sm:py-20">
        <SectionHead number={number} id="collection-heading" label="Explore the collection" aside={aside ?? <ArrowLink href="/explore">Full library</ArrowLink>} />
        <p className="mt-4 max-w-2xl text-muted">
          Thinkers, concepts, tendencies, texts, debates and events form one connected collection: each entry links to the
          others it relates to.
        </p>
        <div className="mt-8 grid gap-x-10 gap-y-7 sm:mt-9 md:grid-cols-3 md:gap-y-9">
          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="label border-b border-ink pb-2 font-sans text-faint">{g.title}</h3>
              <ul>
                {g.items.map((item) => {
                  n += 1;
                  return (
                    <li key={item.href} className="border-b border-rule">
                      <Row number={n} item={item} />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Row({ number, item }: { number: number; item: CollectionItem }) {
  const body = (
    <>
      <span className="label-mono pt-1 text-red">{String(number).padStart(2, "0")}</span>
      <span className="min-w-0">
        <span className="block font-serif text-[1.4rem] leading-none transition-colors group-hover:text-red sm:text-[1.75rem]">{item.label}</span>
        <span className="mt-1 block text-[0.86rem] leading-snug text-muted sm:mt-1.5 sm:text-[0.9rem]">{item.description}</span>
        {item.examples && <span className="mt-0.5 hidden truncate text-[0.8rem] text-faint sm:block">{item.examples}</span>}
      </span>
      <span className="flex items-baseline gap-3 pt-1">
        {item.count != null && <span className="label-mono text-muted">{String(item.count).padStart(2, "0")}</span>}
        <span aria-hidden="true" className="text-red transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </>
  );
  const cls = "group grid w-full grid-cols-[1.75rem_1fr_auto] items-start gap-x-3 py-3 text-left transition-colors hover:bg-paper-warm sm:grid-cols-[2rem_1fr_auto] sm:py-3.5";
  // Search opens the site-wide search overlay, as "/" does from any page; the hero's search form works without JavaScript.
  if (item.href === "/search")
    return (
      <SearchTrigger className={cls}>
        {body}
      </SearchTrigger>
    );
  return (
    <Link href={item.href} className={cls}>
      {body}
    </Link>
  );
}
