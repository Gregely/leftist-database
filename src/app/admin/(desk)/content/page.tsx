import type { Metadata } from "next";
import Link from "next/link";
import { BulkReview } from "@/components/desk/BulkReview";
import { ContentTable } from "@/components/desk/ContentTable";
import { DeskHeading, DeskPage, Notice } from "@/components/desk/ui";
import { requireUser } from "@/lib/auth/session";
import { ENTITY_KINDS, KINDS, STATUS_LABELS, WORKFLOW_STATUSES } from "@/lib/content/model";
import { browse, BROWSE_FLAGS, BROWSE_SORTS, staffList } from "@/lib/editorial/queries";
import { bulkOptions } from "@/lib/editorial/bulk";
import { listCollections } from "@/lib/editorial/collections";
import { can } from "@/lib/editorial/permissions";

export const metadata: Metadata = { title: "Content" };

type Props = { searchParams: Promise<Record<string, string | undefined>> };

export default async function ContentBrowser({ searchParams }: Props) {
  const user = await requireUser();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const [res, staff, collections] = await Promise.all([
    browse({ q: sp.q, kind: sp.kind, status: sp.status, author: sp.author, reviewer: sp.reviewer, collection: sp.collection, flag: sp.flag, sort: sp.sort, page }),
    staffList(),
    listCollections(),
  ]);
  const pages = Math.ceil(res.total / res.perPage);
  const bulk = can(user, "entity.bulkReview");
  const options = bulk ? await bulkOptions(user, res.items.map((i) => i.id)) : {};
  const qs = (o: Record<string, string | undefined>) => {
    const p = new URLSearchParams(Object.entries({ ...sp, ...o }).filter(([, v]) => v) as [string, string][]);
    return `/admin/content${p.toString() ? `?${p}` : ""}`;
  };
  const select = (name: string, label: string, options: [string, string][], value?: string) => (
    <div>
      <label htmlFor={`f-${name}`} className="label mb-1 block text-faint">
        {label}
      </label>
      <select id={`f-${name}`} name={name} defaultValue={value ?? ""} className="field py-1.5">
        <option value="">All</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
  return (
    <DeskPage>
      <DeskHeading kicker="The archive" title="Content" lede={`${res.total} ${res.total === 1 ? "entry" : "entries"} match.`} />
      {sp.deleted && (
        <div className="mt-6">
          <Notice tone="success">The draft was deleted.</Notice>
        </div>
      )}
      <form className="mt-6 grid gap-3 border-b border-rule pb-6 sm:grid-cols-2 lg:grid-cols-9" role="search" aria-label="Filter content">
        <div className="sm:col-span-2 lg:col-span-2">
          <label htmlFor="f-q" className="label mb-1 block text-faint">
            Search
          </label>
          <input id="f-q" name="q" defaultValue={sp.q} placeholder="Title, slug, alias…" className="field py-1.5" />
        </div>
        {select("kind", "Type", ENTITY_KINDS.map((k) => [k, KINDS[k].label]), sp.kind)}
        {select("status", "Status", [["live", "Live (public)"], ...WORKFLOW_STATUSES.map((s) => [s, STATUS_LABELS[s]] as [string, string])], sp.status)}
        {select("author", "Author", staff.map((u) => [u.id, u.name]), sp.author)}
        {select("reviewer", "Reviewer", staff.filter((u) => u.role !== "contributor").map((u) => [u.id, u.name]), sp.reviewer)}
        {select("collection", "Collection", collections.map((c) => [c.tag, `${c.tag} (${c.count})`]), sp.collection)}
        {select("flag", "Flagged", Object.entries(BROWSE_FLAGS), sp.flag)}
        <div>
          <label htmlFor="f-sort" className="label mb-1 block text-faint">
            Sort
          </label>
          <select id="f-sort" name="sort" defaultValue={sp.sort ?? "updated"} className="field py-1.5">
            {Object.entries(BROWSE_SORTS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-9">
          <button type="submit" className="btn">
            Apply
          </button>
          <Link href="/admin/content" className="label text-muted hover:text-red">
            Clear filters
          </Link>
        </div>
      </form>
      <div className="mt-6">
        {bulk ? (
          <BulkReview rows={res.items} options={options} empty="No entries match these filters." scope="Content" />
        ) : (
          <ContentTable rows={res.items} empty="No entries match these filters." />
        )}
      </div>
      {pages > 1 && (
        <nav aria-label="Pages" className="mt-6 flex flex-wrap items-center gap-1">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={qs({ page: String(p) })}
              aria-current={p === page ? "page" : undefined}
              className={`label-mono border px-2.5 py-1 ${p === page ? "border-ink bg-ink text-paper" : "border-rule hover:border-ink"}`}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </DeskPage>
  );
}
