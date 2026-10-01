import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteSourceAction, saveSourceAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Notice } from "@/components/admin/Notice";
import { SourceForm } from "@/components/admin/SourceForm";
import { getSourceAdmin } from "@/lib/admin/repository";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function EditSource({ params, searchParams }: Props) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const s = await getSourceAdmin(id);
  if (!s) notFound();
  return (
    <div className="max-w-3xl">
      <p className="label text-faint">
        <Link href="/admin/sources" className="hover:text-red">Sources</Link> / <span className="label-mono">{id}</span>
      </p>
      <div className="mb-8 mt-1 flex items-baseline justify-between gap-4">
        <h1 className="display text-4xl italic">{s.title}</h1>
        <Link href={`/sources/${id}`} className="label text-muted hover:text-red">View ↗</Link>
      </div>
      <Notice saved={sp.saved} />
      <p className="mb-6 text-sm text-muted">
        Cite inline in any markup field with <code className="font-mono text-ink">[cite:{id}, p. 12]</code>.
      </p>
      <SourceForm values={s} action={saveSourceAction.bind(null, id)} />
      <form action={deleteSourceAction} className="mt-12 border-t border-ink pt-4">
        <input type="hidden" name="id" value={id} />
        <ConfirmButton message="Delete this source and its citations?" className="btn border-red text-red hover:bg-red hover:text-paper-warm">Delete source</ConfirmButton>
      </form>
    </div>
  );
}
