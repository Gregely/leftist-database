"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { attachMediaAction, detachMediaAction } from "@/app/admin/actions";
import { MEDIA_ROLES, type MediaRole } from "@/lib/content/model";
import { MediaPicker } from "./MediaPicker";
import { PendingMark } from "./ui";

export interface AttachedMedia {
  attachmentId: string;
  role: MediaRole;
  caption: string;
  media: { id: string; title: string; altText: string; credit: string; license: string; rights: string; width: number | null; height: number | null };
  gaps: string[];
  staged?: boolean;
  canRemove?: boolean;
}

const ROLE_HELP: Record<MediaRole, string> = {
  portrait: "Shown beside a thinker's name",
  photograph: "Archival photograph",
  cover: "Book cover or title page",
  scan: "Manuscript or document scan",
  diagram: "Diagram or chart",
  figure: "Placed in the text",
};

export function MediaPanel({ entityId, attached, canEdit, defaultRole }: { entityId: string; attached: AttachedMedia[]; canEdit: boolean; defaultRole: MediaRole }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [role, setRole] = useState<MediaRole>(defaultRole);
  const [picking, setPicking] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  return (
    <div className="space-y-6">
      {attached.length === 0 ? (
        <p className="border border-dashed border-rule px-4 py-4 text-sm italic text-muted">No images attached.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {attached.map((a) => (
            <li key={a.attachmentId} className="border border-rule bg-paper-warm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/media/${a.media.id}`} alt={a.media.altText} className="aspect-[4/3] w-full bg-beige/40 object-cover" />
              <div className="p-3 text-sm">
                <p className="label text-red">
                  {a.role}
                  {a.staged && <PendingMark />}
                </p>
                <p className="font-serif text-base">{a.media.title || "Untitled"}</p>
                {a.gaps.length > 0 && <p className="label mt-1 text-ochre">Missing {a.gaps.join(", ")}</p>}
                <div className="mt-2 flex gap-4">
                  <a href={`/admin/media/${a.media.id}`} className="label text-muted hover:text-red">
                    Details &amp; rights
                  </a>
                  {canEdit && a.canRemove !== false && (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        start(async () => {
                          const res = await detachMediaAction(a.attachmentId);
                          if (!res.ok) setMsg({ ok: false, text: res.message });
                          router.refresh();
                        })
                      }
                      className="label text-faint hover:text-red"
                    >
                      Detach
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {canEdit &&
        (picking ? (
          <div className="space-y-3">
            <label className="flex flex-wrap items-center gap-3">
              <span className="label">Use as</span>
              <select value={role} onChange={(e) => setRole(e.target.value as MediaRole)} className="field w-auto py-1.5">
                {MEDIA_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r} — {ROLE_HELP[r]}
                  </option>
                ))}
              </select>
            </label>
            <MediaPicker
              attachTo={entityId}
              role={role}
              submitLabel={`Attach as ${role}`}
              onCancel={() => setPicking(false)}
              onSelect={(m, info) =>
                start(async () => {
                  // Uploads are attached by the upload request itself; library picks are attached here.
                  if (info.uploaded) {
                    setMsg({ ok: true, text: info.duplicate ? "That file was already in the library — the existing record is now attached." : "Uploaded and attached." });
                  } else {
                    const res = await attachMediaAction(entityId, m.id, role);
                    if (!res.ok) return setMsg({ ok: false, text: res.message });
                    setMsg({ ok: true, text: "Attached." });
                  }
                  setPicking(false);
                  router.refresh();
                })
              }
            />
          </div>
        ) : (
          <button type="button" onClick={() => setPicking(true)} className="btn">
            + Add an image
          </button>
        ))}
      {msg && (
        <p role={msg.ok ? "status" : "alert"} className={`border-l-2 px-3 py-1.5 text-sm ${msg.ok ? "border-olive bg-olive/10" : "border-red bg-red/5 text-red-deep"}`}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
