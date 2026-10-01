import Link from "next/link";
import { RelationshipComposer } from "@/components/admin/RelationshipComposer";
import { adminCounts, listSourcesAdmin, recentEntities } from "@/lib/admin/repository";
import { ENTITY_KINDS, entityHref, isEntityKind, KINDS } from "@/lib/content/model";

export default async function AdminHome() {
  const [counts, recent, sources] = await Promise.all([adminCounts(), recentEntities(12), listSourcesAdmin()]);
  const byKind = (k: string) => counts.rows.filter((r) => r.kind === k);
  return (
    <div className="space-y-14">
      <header>
        <h1 className="display text-5xl">The desk<span className="text-red">.</span></h1>
        <p className="mt-2 text-muted">
          {counts.rows.reduce((a, r) => a + r.n, 0)} entries · {counts.relationships} relationships · {counts.sources} sources
        </p>
      </header>

      <section aria-labelledby="kinds-h">
        <h2 id="kinds-h" className="label mb-3 font-sans">Entries</h2>
        <ul className="grid gap-px border border-ink bg-ink sm:grid-cols-2 lg:grid-cols-4">
          {ENTITY_KINDS.map((k) => {
            const rows = byKind(k);
            const total = rows.reduce((a, r) => a + r.n, 0);
            return (
              <li key={k} className="bg-paper p-4">
                <div className="flex items-baseline justify-between">
                  <Link href={`/admin/${k}`} className="font-serif text-2xl hover:text-red">
                    {KINDS[k].plural}
                  </Link>
                  <span className="numeral text-2xl text-red">{total}</span>
                </div>
                <p className="label mt-1 text-faint">{rows.map((r) => `${r.n} ${r.status}`).join(" · ") || "none"}</p>
                <Link href={`/admin/${k}/new`} className="label mt-3 inline-block text-red hover:underline">
                  + New {KINDS[k].label.toLowerCase()}
                </Link>
              </li>
            );
          })}
          <li className="bg-paper p-4">
            <div className="flex items-baseline justify-between">
              <Link href="/admin/sources" className="font-serif text-2xl hover:text-red">
                Sources
              </Link>
              <span className="numeral text-2xl text-red">{counts.sources}</span>
            </div>
            <Link href="/admin/sources/new" className="label mt-3 inline-block text-red hover:underline">
              + New source
            </Link>
          </li>
        </ul>
      </section>

      <section aria-labelledby="rel-h" className="border-t border-ink pt-6">
        <div className="flex items-baseline justify-between">
          <h2 id="rel-h" className="label font-sans">Draw a relationship</h2>
          <Link href="/admin/relationships" className="label text-red">All relationships →</Link>
        </div>
        <p className="mb-4 mt-1 text-sm text-muted">Any entry can be related to any other. Inverse types (e.g. “influenced by”) are stored in canonical form.</p>
        <RelationshipComposer sources={sources.map((s) => ({ id: s.id, label: `${s.author} — ${s.title}` }))} returnTo="/admin" />
      </section>

      <section aria-labelledby="recent-h" className="border-t border-ink pt-6">
        <h2 id="recent-h" className="label mb-3 font-sans">Recently edited</h2>
        <ul className="divide-y divide-rule border-y border-rule">
          {recent.map((e) => (
            <li key={e.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2.5">
              <span>
                <span className="label mr-3 text-faint">{isEntityKind(e.kind) ? KINDS[e.kind].label : e.kind}</span>
                <Link href={`/admin/${e.kind}/${e.id}`} className="font-serif text-lg hover:text-red">
                  {e.title}
                </Link>
                <span className="label ml-3 text-faint">{e.status}</span>
              </span>
              <span className="flex gap-4">
                <span className="label-mono text-faint">{e.updatedAt}</span>
                {isEntityKind(e.kind) && (
                  <Link href={entityHref(e.kind, e.slug)} className="label text-muted hover:text-red">View ↗</Link>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
