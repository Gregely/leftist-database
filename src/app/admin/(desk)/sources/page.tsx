import Link from "next/link";
import { listSourcesAdmin } from "@/lib/admin/repository";
import { SOURCE_TYPE_LABELS, type SourceType } from "@/lib/content/model";

export default async function SourcesAdmin() {
  const rows = await listSourcesAdmin();
  return (
    <div>
      <header className="flex items-end justify-between border-b border-ink pb-4">
        <div>
          <p className="label text-faint">Editorial desk</p>
          <h1 className="display mt-1 text-5xl">Sources</h1>
        </div>
        <Link href="/admin/sources/new" className="btn btn-red">+ New source</Link>
      </header>
      <table className="mt-4 w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-ink">
            {["Title", "Author", "Date", "Type", "Id"].map((h) => <th key={h} scope="col" className="label py-2 pr-3 font-medium text-faint">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.id} className="border-b border-rule hover:bg-paper-warm">
              <td className="py-2 pr-3"><Link href={`/admin/sources/${s.id}`} className="font-serif italic hover:text-red">{s.title}</Link></td>
              <td className="pr-3">{s.author}</td>
              <td className="label-mono pr-3 text-faint">{s.publicationDate}</td>
              <td className="label pr-3 text-faint">{SOURCE_TYPE_LABELS[s.sourceType as SourceType]}</td>
              <td className="label-mono text-faint">{s.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
