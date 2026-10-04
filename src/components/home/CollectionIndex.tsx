import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLink, Container, SectionHead } from "@/components/editorial/primitives";

export interface CollectionItem {
  label: string;
  href: string;
  /** Bookcloth colour of the area. */
  tone: string;
  /** What the section contains, in a few words. */
  description: string;
  /** A few real titles from the section. */
  examples?: string;
  count?: number;
  /** What the count counts, when it is not the section's own entries. */
  unit?: string;
}

/**
 * The front door's table of contents: every area of the collection at equal
 * weight, set like the contents page of a reference book — number, name, dot
 * leaders, extent — with a line on what is inside and a few real entries.
 */
export function CollectionIndex({ items, number, aside }: { items: CollectionItem[]; number?: string; aside?: ReactNode }) {
  return (
    <section aria-labelledby="collection-heading" data-home-collection>
      <Container className="pb-14 pt-10 sm:pb-20 sm:pt-14">
        <SectionHead number={number} id="collection-heading" label="Explore the collection" aside={aside ?? <ArrowLink href="/explore">Full library</ArrowLink>} />
        <ol className="mt-2 grid gap-x-12 md:grid-cols-2 md:[grid-auto-flow:column] md:[grid-template-rows:repeat(4,auto)]">
          {items.map((item, i) => (
            <li key={item.label} className="border-b border-rule">
              <Link href={item.href} className="group block py-4 sm:py-5">
                <span className="flex items-baseline">
                  <span className="label-mono w-8 shrink-0 text-red">{String(i + 1).padStart(2, "0")}</span>
                  <span aria-hidden="true" className="mr-2.5 h-2.5 w-2.5 shrink-0 self-center" style={{ background: item.tone }} />
                  <span className="font-serif text-[1.7rem] leading-none tracking-[-0.015em] transition-colors group-hover:text-red sm:text-[2.15rem]">{item.label}</span>
                  <span aria-hidden="true" className="leaders" />
                  {item.count != null ? (
                    <span className="numeral text-[1.25rem] leading-none text-ink sm:text-[1.5rem]">
                      {item.count}
                      {item.unit && <span className="label ml-1.5 align-middle text-faint">{item.unit}</span>}
                    </span>
                  ) : (
                    <span aria-hidden="true" className="text-red transition-transform duration-300 group-hover:translate-x-1">→</span>
                  )}
                </span>
                <span className="mt-1.5 block pl-8 text-[0.9rem] leading-snug text-muted">{item.description}</span>
                {item.examples && <span className="mt-0.5 block truncate pl-8 font-serif text-[0.98rem] italic text-faint">{item.examples}</span>}
              </Link>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
