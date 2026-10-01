/** Banner for ?error= and ?saved= feedback after a server action redirect. */
export function Notice({ error, saved }: { error?: string; saved?: string }) {
  if (error)
    return (
      <p role="alert" className="mb-6 border-l-2 border-red bg-red/5 px-3 py-2 text-sm text-red">
        {error}
      </p>
    );
  if (saved)
    return (
      <p role="status" className="mb-6 border-l-2 border-olive bg-olive/10 px-3 py-2 text-sm">
        Saved.
      </p>
    );
  return null;
}
