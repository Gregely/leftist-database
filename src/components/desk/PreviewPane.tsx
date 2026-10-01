"use client";

import { useState } from "react";

/** The live preview beside the editor — the public page components, rendering the working copy. */
export function PreviewPane({ src }: { src: string }) {
  const [n, setN] = useState(0);
  return (
    <div className="hidden lg:block">
      <div className="sticky top-[60px]">
        <div className="flex items-center justify-between border border-b-0 border-ink bg-ink px-3 py-1.5 text-paper">
          <span className="label">Preview · working copy</span>
          <span className="flex gap-4">
            <button type="button" onClick={() => setN((x) => x + 1)} className="label text-ink-muted hover:text-paper">
              Refresh ↻
            </button>
            <a href={src.replace("?embed=1", "")} target="_blank" rel="noreferrer" className="label text-ink-muted hover:text-paper">
              Open ↗
            </a>
          </span>
        </div>
        <iframe key={n} src={src} title="Preview of the working copy" className="h-[calc(100vh-110px)] w-full border border-ink bg-paper" />
      </div>
    </div>
  );
}
