"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { restoreRevisionAction } from "@/app/admin/actions";

/** Restoring creates a new revision from an old one — history is never rewritten. */
export function RestoreButton({ entityId, version, lockVersion }: { entityId: string; version: number; lockVersion: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirm, setConfirm] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  if (!confirm)
    return (
      <button type="button" onClick={() => setConfirm(true)} className="label text-red hover:underline">
        Restore v{version}
      </button>
    );
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className="text-xs">Restore version {version} as a new version?</span>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const res = await restoreRevisionAction(entityId, version, lockVersion);
            if (!res.ok) setMsg(res.message);
            else {
              setConfirm(false);
              router.push(`/admin/entries/${entityId}?tab=history&restored=${version}`);
              router.refresh();
            }
          })
        }
        className="btn btn-red py-1"
      >
        Restore
      </button>
      <button type="button" onClick={() => setConfirm(false)} className="label text-muted">
        Cancel
      </button>
      {msg && <span className="text-xs text-red-deep">{msg}</span>}
    </span>
  );
}
