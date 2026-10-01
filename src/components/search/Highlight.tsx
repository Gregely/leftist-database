/** Renders FTS snippets, where matches are wrapped in ⟦ ⟧. */
export function Highlight({ text }: { text: string }) {
  const parts = text.split(/(⟦[^⟧]*⟧)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("⟦") ? (
          <mark key={i} className="bg-transparent text-ink underline decoration-red decoration-2 underline-offset-2">
            {p.slice(1, -1)}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
