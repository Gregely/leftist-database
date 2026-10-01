import type { Metadata } from "next";
import Link from "next/link";
import { RelationshipBuilder } from "@/components/desk/RelationshipBuilder";
import { DeskHeading, DeskPage, Notice, Panel } from "@/components/desk/ui";
import { requireUser } from "@/lib/auth/session";
import { CANONICAL_RELATIONSHIP_TYPES, KINDS, relationshipTypeLabel as typeLabel, type EntityKind, type RelationshipType } from "@/lib/content/model";
import { can } from "@/lib/editorial/permissions";
import { listRelationships } from "@/lib/editorial/structure";

export const metadata: Metadata = { title: "Relationships" };

type Props = { searchParams: Promise<{ type?: string; q?: string; page?: string }> };

export default async function RelationshipsPage({ searchParams }: Props) {
  const user = await requireUser();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const type = CANONICAL_RELATIONSHIP_TYPES.includes(sp.type as RelationshipType) ? (sp.type as RelationshipType) : undefined;
  const res = await listRelationships({ type, q: sp.q, page, perPage: 60 });
  const canGlobal = can(user, "relationship.global");
  const pages = Math.ceil(res.total / 60);
  return (
    <DeskPage>
      <DeskHeading
        kicker="The intellectual map"
        title="Relationships"
        lede={`${res.total} typed, directed claims connect the entries of the Atlas. Each can carry a note, dates, context and a source.`}
      />
      <div className="mt-8 space-y-10">
        {canGlobal ? (
          <Panel title="Draw a relationship between any two entries">
            <RelationshipBuilder canEdit global />
          </Panel>
        ) : (
          <Notice>Open an entry you are writing to connect it — the Connections tab has the same builder.</Notice>
        )}
        <Panel title="All relationships">
          <form className="mb-4 flex flex-wrap items-end gap-3">
            <label>
              <span className="label mb-1 block text-faint">Type</span>
              <select name="type" defaultValue={type ?? ""} className="field w-56 py-1.5">
                <option value="">All types</option>
                {CANONICAL_RELATIONSHIP_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {typeLabel(t)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="label mb-1 block text-faint">Entry</span>
              <input name="q" defaultValue={sp.q} placeholder="Title contains…" className="field w-64 py-1.5" />
            </label>
            <button type="submit" className="btn">
              Filter
            </button>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink">
                  {["From", "Relationship", "To", "Note", "Source"].map((h) => (
                    <th key={h} scope="col" className="label py-2 pr-3 font-medium text-faint">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {res.items.map((r) => (
                  <tr key={r.id} className="border-b border-rule align-baseline hover:bg-paper-warm">
                    <td className="py-2 pr-3">
                      <Link href={`/admin/entries/${r.fromId}?tab=connections`} className="font-serif hover:text-red">
                        {r.fromTitle}
                      </Link>
                      <span className="label ml-2 text-faint">{KINDS[r.fromKind as EntityKind]?.label}</span>
                    </td>
                    <td className="label pr-3 text-red">{typeLabel(r.type as RelationshipType)}</td>
                    <td className="pr-3">
                      <Link href={`/admin/entries/${r.toId}?tab=connections`} className="font-serif hover:text-red">
                        {r.toTitle}
                      </Link>
                      <span className="label ml-2 text-faint">{KINDS[r.toKind as EntityKind]?.label}</span>
                    </td>
                    <td className="pr-3 text-muted">{r.note}</td>
                    <td className="pr-3 text-xs text-muted">{r.sourceTitle ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pages > 1 && (
            <nav aria-label="Pages" className="mt-4 flex flex-wrap gap-1">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/admin/relationships?${new URLSearchParams({ ...(type ? { type } : {}), ...(sp.q ? { q: sp.q } : {}), page: String(p) })}`}
                  aria-current={p === page ? "page" : undefined}
                  className={`label-mono border px-2.5 py-1 ${p === page ? "border-ink bg-ink text-paper" : "border-rule"}`}
                >
                  {p}
                </Link>
              ))}
            </nav>
          )}
        </Panel>
      </div>
    </DeskPage>
  );
}
