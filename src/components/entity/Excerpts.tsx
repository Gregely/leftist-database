import Link from "next/link";
import type { ExcerptRecord } from "@/lib/data/types";
import { EmptyNote } from "@/components/editorial/primitives";

/**
 * Primary-text passages. An excerpt may be a verified quotation or a pointer
 * to a passage; unverified quotations are always flagged.
 */
export function Excerpts({ items, empty }: { items: ExcerptRecord[]; empty?: string }) {
  if (!items.length) return empty ? <EmptyNote>{empty}</EmptyNote> : null;
  return (
    <ol className="space-y-8">
      {items.map((x, i) => (
        <li key={x.id} className="grid gap-4 sm:grid-cols-[3rem_1fr]">
          <span className="numeral text-3xl leading-none text-red">{String(i + 1).padStart(2, "0")}</span>
          <figure>
            {x.body ? (
              <blockquote className="border-l-2 border-red pl-5 font-serif text-[1.45rem] leading-snug text-ink">
                “{x.body}”
              </blockquote>
            ) : (
              <p className="border-l-2 border-dashed border-rule pl-5 font-serif text-lg italic text-muted">
                Passage reference — the excerpt will be added from a verified edition.
              </p>
            )}
            <figcaption className="mt-3 pl-5 text-sm leading-snug">
              {x.text ? (
                <Link href={x.text.href} className="link-inline italic">
                  {x.text.title}
                </Link>
              ) : (
                x.source && <span className="italic">{x.source.title}</span>
              )}
              {x.locator && <span className="text-muted">, {x.locator}</span>}
              {x.source && (
                <span className="text-muted">
                  {" "}· edition:{" "}
                  <Link href={`/sources/${x.source.id}`} className="link-inline">
                    {x.source.author}
                    {x.source.publicationDate ? ` (${x.source.publicationDate.split(" ")[0]})` : ""}
                  </Link>
                </span>
              )}
              {x.body && !x.verified && (
                <span className="label ml-2 inline-block border border-dashed border-red/60 px-1 text-red">Unverified wording</span>
              )}
              {x.note && <span className="mt-1 block text-muted">{x.note}</span>}
            </figcaption>
          </figure>
        </li>
      ))}
    </ol>
  );
}
