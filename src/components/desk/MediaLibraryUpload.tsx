"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MediaPicker } from "./MediaPicker";

/** Upload straight into the library from the library page. */
export function MediaLibraryUpload() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div>
      {open ? (
        <MediaPicker
          onCancel={() => setOpen(false)}
          onSelect={(m, info) => {
            setOpen(false);
            setMsg(info.duplicate ? "That file was already in the library — opening the existing record." : "Uploaded.");
            router.push(`/admin/media/${m.id}`);
          }}
        />
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="btn btn-red">
          + Upload an image
        </button>
      )}
      {msg && (
        <p role="status" className="mt-2 text-sm">
          {msg}
        </p>
      )}
    </div>
  );
}
