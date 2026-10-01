"use client";

import Link from "next/link";
import { useBookmarks } from "@/lib/client/bookmarks";
import { ENTITY_KINDS, KINDS } from "@/lib/content/model";

export function BookmarksView() {
  const { items, remove } = useBookmarks();
  if (!items.length) {
    return (
      <div className="border-y border-ink py-12">
        <p className="lede max-w-xl text-muted">
          Nothing saved yet. Use <span className="label text-ink">Save</span> on any thinker, concept, text or debate to keep
          it here.
        </p>
        <Link href="/explore" className="btn mt-6">
          Explore the library →
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-12">
      {ENTITY_KINDS.filter((k) => items.some((i) => i.kind === k)).map((k) => (
        <section key={k} aria-labelledby={`bm-${k}`}>
          <h2 id={`bm-${k}`} className="label mb-2 border-b border-ink pb-2 font-sans">
            {KINDS[k].plural}
          </h2>
          <ul>
            {items
              .filter((i) => i.kind === k)
              .map((b) => (
                <li key={b.id} className="flex items-baseline justify-between gap-4 border-b border-rule py-3">
                  <Link href={b.href} className="font-serif text-2xl hover:text-red">
                    {b.title}
                    {b.subtitle && <span className="label-mono ml-3 text-faint">{b.subtitle}</span>}
                  </Link>
                  <button type="button" onClick={() => remove(b.id)} className="label text-faint hover:text-red">
                    Remove<span className="sr-only"> {b.title}</span>
                  </button>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
