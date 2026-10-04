import Link from "next/link";
import type { ExcerptRecord } from "@/lib/data/types";
import { VERIFICATION_LABELS } from "@/lib/content/model";
import { EmptyNote } from "@/components/editorial/primitives";

/**
 * Primary-text passages, set as quotations: a hanging red quotation mark, the
 * passage in the serif italic, and the bibliographic line beneath. An excerpt
 * may be a verified quotation or only a pointer to a passage; unverified
 * wording is always flagged.
 */
export function Excerpts({ items, empty }: { items: ExcerptRecord[]; empty?: string }) {
  if (!items.length) return empty ? <EmptyNote>{empty}</EmptyNote> : null;
  return (
    <ol className="space-y-10">
      {items.map((x, i) => (
        <li key={x.id} className="grid gap-3 sm:grid-cols-[3rem_1fr]">
          <span className="label-mono pt-2 text-faint">§{i + 1}</span>
          <figure className="relative">
            {x.body ? (
              <blockquote className="relative max-w-[42rem] pl-7 font-serif text-[1.5rem] italic leading-[1.38] text-ink sm:text-[1.65rem]">
                <span aria-hidden="true" className="absolute -top-1 left-0 font-serif text-[2.6rem] not-italic leading-none text-red">
                  “
                </span>
                {x.body}
              </blockquote>
            ) : (
              <p className="max-w-[42rem] border-l border-dashed border-rule pl-7 font-serif text-[1.15rem] italic text-muted">
                Passage reference — the excerpt will be added from a verified edition.
              </p>
            )}
            <figcaption className="mt-3 pl-7 text-[0.9rem] leading-snug">
              <span aria-hidden="true" className="mr-2 text-faint">
                —
              </span>
              {x.text ? (
                <Link href={x.text.href} className="link-inline font-serif italic">
                  {x.text.title}
                </Link>
              ) : (
                x.source && <span className="font-serif italic">{x.source.title}</span>
              )}
              {x.locator && <span className="text-muted">, {x.locator}</span>}
              {x.source && (
                <span className="text-muted">
                  {" "}
                  · edition:{" "}
                  <Link href={`/sources/${x.source.id}`} className="link-inline">
                    {x.source.author}
                    {x.source.publicationDate ? ` (${x.source.publicationDate.split(" ")[0]})` : ""}
                  </Link>
                </span>
              )}
              {x.body && !x.verified && (
                <span className="label ml-2 inline-block border border-dashed border-red/60 px-1 text-red">{VERIFICATION_LABELS[x.verification]} wording</span>
              )}
              {x.note && <span className="mt-1 block text-muted">{x.note}</span>}
            </figcaption>
          </figure>
        </li>
      ))}
    </ol>
  );
}
