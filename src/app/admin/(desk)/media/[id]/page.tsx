import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaMetaEditor } from "@/components/desk/MediaMetaEditor";
import { DeskHeading, DeskPage, Panel } from "@/components/desk/ui";
import { requireUser } from "@/lib/auth/session";
import { KINDS, type EntityKind } from "@/lib/content/model";
import { getMediaRecord, mediaGaps } from "@/lib/editorial/media";
import { can } from "@/lib/editorial/permissions";

export const metadata: Metadata = { title: "Image" };

export default async function MediaRecord({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const rec = await getMediaRecord((await params).id);
  if (!rec) notFound();
  const m = rec.media;
  const initial = Object.fromEntries(
    Object.entries({ ...m, tags: (JSON.parse(m.tags) as string[]).join(", "), year: m.year ?? "" }).map(([k, v]) => [k, v == null ? "" : String(v)]),
  );
  const gaps = mediaGaps(m);
  return (
    <DeskPage>
      <DeskHeading kicker="Media library" title={m.title || m.originalName} lede={`${m.mimeType} · ${m.width}×${m.height} · ${(m.size / 1024).toFixed(0)} KB · original file “${m.originalName}”`} />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/media/${m.id}`} alt={m.altText} className="w-full border border-rule bg-beige/40" />
          {gaps.length > 0 && <p className="mt-3 border-l-2 border-ochre pl-3 text-sm">Missing {gaps.join(", ")}. Entries that use this image will be flagged until it is complete.</p>}
          <Panel title={`Used on ${rec.usedBy.length} entr${rec.usedBy.length === 1 ? "y" : "ies"}`} className="mt-8">
            <ul className="space-y-1 text-sm">
              {rec.usedBy.map((u) => (
                <li key={u.a.id}>
                  <Link href={`/admin/entries/${u.e.id}?tab=media`} className="link-inline">
                    {u.e.title}
                  </Link>{" "}
                  <span className="label text-faint">
                    {KINDS[u.e.kind as EntityKind].label} · {u.a.role}
                    {u.e.live ? " · public" : ""}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <MediaMetaEditor id={m.id} initial={initial} canEdit={can(user, "media.edit", undefined, m.uploadedBy)} />
      </div>
    </DeskPage>
  );
}
