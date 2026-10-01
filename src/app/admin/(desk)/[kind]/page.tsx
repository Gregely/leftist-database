import Link from "next/link";
import { notFound } from "next/navigation";
import { adminList } from "@/lib/admin/repository";
import { entityHref, isEntityKind, KINDS } from "@/lib/content/model";

type Props = { params: Promise<{ kind: string }>; searchParams: Promise<{ q?: string }> };

export default async function AdminKindList({ params, searchParams }: Props) {
  const [{ kind }, { q }] = await Promise.all([params, searchParams]);
  if (!isEntityKind(kind)) notFound();
  const rows = await adminList(kind, q);
  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-4">
        <div>
          <p className="label text-faint">Editorial desk</p>
          <h1 className="display mt-1 text-5xl">{KINDS[kind].plural}</h1>
        </div>
        <div className="flex items-center gap-3">
          <form className="flex gap-2">
            <label htmlFor="q" className="sr-only">Filter</label>
            <input id="q" name="q" defaultValue={q} placeholder="Filter by title or slug" className="field w-56" />
          </form>
          <Link href={`/admin/${kind}/new`} className="btn btn-red">+ New</Link>
        </div>
      </header>
      <table className="mt-4 w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-ink">
            {["Title", "Slug", "Years", "Status", "Updated", ""].map((h) => (
              <th key={h} scope="col" className="label py-2 pr-4 font-medium text-faint">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-rule hover:bg-paper-warm">
              <td className="py-2.5 pr-4">
                <Link href={`/admin/${kind}/${r.id}`} className="font-serif text-lg hover:text-red">{r.title}</Link>
                {r.featured && <span className="label ml-2 text-red">★</span>}
              </td>
              <td className="label-mono pr-4 text-faint">{r.slug}</td>
              <td className="label-mono pr-4 text-faint">{r.yearStart ?? ""}{r.yearEnd ? `–${r.yearEnd}` : ""}</td>
              <td className="pr-4"><span className={`label ${r.status === "draft" ? "text-ochre" : r.status === "sample" ? "text-red" : "text-olive"}`}>{r.status}</span></td>
              <td className="label-mono pr-4 text-faint">{r.updatedAt.slice(0, 16)}</td>
              <td className="text-right">
                <Link href={entityHref(kind, r.slug)} className="label text-muted hover:text-red">View ↗</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && <p className="mt-6 text-muted">Nothing here yet.</p>}
    </div>
  );
}
