import Link from "next/link";
import { SOURCE_TYPE_LABELS } from "@/lib/content/model";
import type { Note } from "@/lib/data/types";

/** Footnote apparatus: numbered notes, then the sources they point to. */
export function Notes({ notes, className = "" }: { notes: Note[]; className?: string }) {
  if (!notes.length) return null;
  return (
    <section aria-labelledby="notes-heading" className={className}>
      <h2 id="notes-heading" className="label mb-4 border-t border-ink pt-3 font-sans">
        <span className="label-mono mr-3 text-red">§</span>Notes &amp; sources
      </h2>
      <ol className="space-y-3">
        {notes.map((n) => (
          <li key={n.n} id={`note-${n.n}`} className="grid grid-cols-[2rem_1fr] gap-2 text-[0.88rem] leading-snug target:bg-beige/40">
            <span className="label-mono pt-[2px] text-red">{n.n}.</span>
            {n.source ? (
            <span>
              <span className="text-ink-warm">{n.source.author}</span>,{" "}
              <Link href={`/sources/${n.source.id}`} className="link-inline italic">
                {n.source.title}
              </Link>
              {n.source.publisher && <span className="text-muted">, {n.source.publisher}</span>}
              {n.source.publicationDate && <span className="text-muted"> ({n.source.publicationDate})</span>}
              {n.locator && <span>, {n.locator}</span>}.
              <span className="label ml-2 text-faint">{SOURCE_TYPE_LABELS[n.source.sourceType]}</span>
              {!n.inline && <span className="label ml-2 text-faint">· general</span>}
              {n.note && <span className="mt-0.5 block text-muted">{n.note}</span>}
            </span>
            ) : (
              <span className="text-ink-warm">{n.text}</span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
