import Link from "next/link";
import { deleteRelationshipAction } from "@/app/admin/actions";
import { Notice } from "@/components/admin/Notice";
import { DeleteButton } from "@/components/admin/panels";
import { RelationshipComposer } from "@/components/admin/RelationshipComposer";
import { listAllRelationships, listSourcesAdmin } from "@/lib/admin/repository";
import { CANONICAL_RELATIONSHIP_TYPES, RELATIONSHIP_TYPES, type RelationshipType } from "@/lib/content/model";

type Props = { searchParams: Promise<{ type?: string; q?: string; error?: string }> };

export default async function RelationshipsAdmin({ searchParams }: Props) {
  const sp = await searchParams;
  const type = CANONICAL_RELATIONSHIP_TYPES.includes(sp.type as RelationshipType) ? sp.type : undefined;
  const [rows, sources] = await Promise.all([listAllRelationships({ type, q: sp.q }), listSourcesAdmin()]);
  const returnTo = `/admin/relationships${type || sp.q ? `?${new URLSearchParams({ ...(type ? { type } : {}), ...(sp.q ? { q: sp.q } : {}) })}` : ""}`;
  return (
    <div className="space-y-8">
      <header className="border-b border-ink pb-4">
        <p className="label text-faint">Editorial desk</p>
        <h1 className="display mt-1 text-5xl">Relationships</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          The graph is built from these rows. Each is a typed, directed claim with an optional note, weight and source. Inverse
          types are accepted and normalised.
        </p>
      </header>
      <Notice error={sp.error} />
      <RelationshipComposer sources={sources.map((s) => ({ id: s.id, label: `${s.author} — ${s.title}` }))} returnTo={returnTo} />
      <form className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="type" className="label mb-1 block text-faint">Type</label>
          <select id="type" name="type" defaultValue={type ?? ""} className="field w-56">
            <option value="">All types</option>
            {CANONICAL_RELATIONSHIP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="q" className="label mb-1 block text-faint">Entry</label>
          <input id="q" name="q" defaultValue={sp.q} placeholder="Title contains…" className="field w-64" />
        </div>
        <button type="submit" className="btn">Filter</button>
        <span className="label-mono ml-auto text-faint">{rows.length} rows</span>
      </form>
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-ink">
            {["From", "Relationship", "To", "Note", "W", ""].map((h) => <th key={h} scope="col" className="label py-2 pr-3 font-medium text-faint">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ r, fromTitle, fromKind, toTitle, toKind }) => (
            <tr key={r.id} className="border-b border-rule align-baseline hover:bg-paper-warm">
              <td className="py-2 pr-3"><Link href={`/admin/${fromKind}/${r.fromId}`} className="font-serif hover:text-red">{fromTitle}</Link></td>
              <td className="label pr-3 text-red">{RELATIONSHIP_TYPES[r.type as RelationshipType]?.label ?? r.type}</td>
              <td className="pr-3"><Link href={`/admin/${toKind}/${r.toId}`} className="font-serif hover:text-red">{toTitle}</Link></td>
              <td className="pr-3 text-muted">{r.note}</td>
              <td className="label-mono pr-3 text-faint">{r.weight}</td>
              <td className="text-right"><DeleteButton action={deleteRelationshipAction} fields={{ id: r.id, returnTo }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
