import type { Metadata } from "next";
import Link from "next/link";
import { MediaLibraryUpload } from "@/components/desk/MediaLibraryUpload";
import { DeskHeading, DeskPage, EmptyState } from "@/components/desk/ui";
import { requireUser } from "@/lib/auth/session";
import { listMedia, mediaGaps } from "@/lib/editorial/media";

export const metadata: Metadata = { title: "Media library" };

type Props = { searchParams: Promise<{ q?: string; tag?: string }> };

export default async function MediaLibrary({ searchParams }: Props) {
  await requireUser();
  const sp = await searchParams;
  const res = await listMedia({ q: sp.q, tag: sp.tag, limit: 120 });
  return (
    <DeskPage>
      <DeskHeading
        kicker="Archive"
        title="Media library"
        lede="Portraits, photographs, covers, scans and diagrams — each stored once, described once, and reusable on any entry."
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto]">
        <form className="flex flex-wrap items-end gap-3" role="search">
          <label>
            <span className="label mb-1 block text-faint">Search</span>
            <input name="q" defaultValue={sp.q} placeholder="Title, caption, creator, tag" className="field w-72 py-1.5" />
          </label>
          <button type="submit" className="btn">
            Search
          </button>
          {sp.tag && (
            <Link href="/admin/media" className="label text-muted">
              Tag: {sp.tag} ✕
            </Link>
          )}
        </form>
        <MediaLibraryUpload />
      </div>
      <p className="label mt-6 text-faint">{res.total} images</p>
      {res.items.length === 0 ? (
        <div className="mt-4">
          <EmptyState>The library is empty. Upload an image to begin.</EmptyState>
        </div>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {res.items.map((m) => {
            const gaps = mediaGaps(m);
            const tags: string[] = JSON.parse(m.tags);
            return (
              <li key={m.id} className="border border-rule bg-paper-warm">
                <Link href={`/admin/media/${m.id}`} className="group block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/media/${m.id}`} alt={m.altText} loading="lazy" className="aspect-square w-full bg-beige/40 object-cover" />
                  <span className="block p-2">
                    <span className="block truncate font-serif group-hover:text-red">{m.title || m.originalName}</span>
                    <span className="label-mono block text-faint">
                      {m.uses} use{m.uses === 1 ? "" : "s"} · {m.width}×{m.height}
                    </span>
                    {gaps.length > 0 && <span className="label block text-ochre">missing {gaps.join(", ")}</span>}
                  </span>
                </Link>
                {tags.length > 0 && (
                  <p className="px-2 pb-2 text-xs">
                    {tags.map((t) => (
                      <Link key={t} href={`/admin/media?tag=${encodeURIComponent(t)}`} className="mr-2 text-muted hover:text-red">
                        #{t}
                      </Link>
                    ))}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </DeskPage>
  );
}
