import type { Metadata } from "next";
import Link from "next/link";
import { DeskHeading, DeskPage } from "@/components/desk/ui";
import { requireUser } from "@/lib/auth/session";
import { SOURCE_TYPE_LABELS, SOURCE_TYPES, type SourceType } from "@/lib/content/model";
import { listSourcesForDesk, sourceGaps } from "@/lib/editorial/sources";

export const metadata: Metadata = { title: "Sources" };

type Props = { searchParams: Promise<{ q?: string; type?: string }> };

export default async function SourcesDesk({ searchParams }: Props) {
  await requireUser();
  const sp = await searchParams;
  const rows = await listSourcesForDesk({ q: sp.q, type: sp.type });
  return (
    <DeskPage>
      <DeskHeading
        kicker="Bibliography"
        title="Sources"
        lede="Every entry should be traceable. Sources are shared across the Atlas — catalogue each edition once and cite it everywhere."
        aside={
          <Link href="/admin/sources/new" className="btn btn-red">
            + New source
          </Link>
        }
      />
      <form className="mt-6 flex flex-wrap items-end gap-3 border-b border-rule pb-5" role="search">
        <label>
          <span className="label mb-1 block text-faint">Search</span>
          <input name="q" defaultValue={sp.q} placeholder="Title or author" className="field w-72 py-1.5" />
        </label>
        <label>
          <span className="label mb-1 block text-faint">Type</span>
          <select name="type" defaultValue={sp.type ?? ""} className="field w-56 py-1.5">
            <option value="">All types</option>
            {SOURCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {SOURCE_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn">
          Filter
        </button>
      </form>
      <ul className="mt-4 divide-y divide-rule">
        {rows.map(({ src, uses, creator }) => {
          const gaps = sourceGaps(src);
          return (
            <li key={src.id} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto]">
              <p className="text-sm leading-snug">
                {src.author && <span>{src.author}. </span>}
                <Link href={`/admin/sources/${src.id}`} className="font-serif text-lg italic hover:text-red">
                  {src.title}
                </Link>
                {src.publisher && <span className="text-muted">. {src.publisher}</span>}
                {src.publicationDate && <span className="text-muted">, {src.publicationDate}</span>}
                <span className="label ml-2 text-faint">{SOURCE_TYPE_LABELS[src.sourceType as SourceType]}</span>
                {gaps.length > 0 && <span className="label ml-2 text-ochre">missing {gaps.join(", ")}</span>}
              </p>
              <p className="label-mono text-faint sm:text-right">
                {Number(uses)} use{Number(uses) === 1 ? "" : "s"}
                {creator ? ` · added by ${creator}` : ""}
              </p>
            </li>
          );
        })}
      </ul>
    </DeskPage>
  );
}
