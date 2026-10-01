import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteEntityAction, saveEntityAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { DebateEditor } from "@/components/admin/DebateEditor";
import { EntityForm } from "@/components/admin/EntityForm";
import { Notice } from "@/components/admin/Notice";
import { CitationsPanel, ExcerptsPanel, Panel, RelationshipsPanel, ViewLink } from "@/components/admin/panels";
import { PathEditor } from "@/components/admin/PathEditor";
import { fieldsFor } from "@/lib/admin/fields";
import { getDebateStructure, getForEdit, getPathSteps, listSourcesAdmin } from "@/lib/admin/repository";
import { isEntityKind, KINDS } from "@/lib/content/model";

type Props = { params: Promise<{ kind: string; id: string }>; searchParams: Promise<{ error?: string; saved?: string }> };

export default async function EditEntity({ params, searchParams }: Props) {
  const [{ kind, id }, sp] = await Promise.all([params, searchParams]);
  if (!isEntityKind(kind)) notFound();
  const edit = await getForEdit(kind, id);
  if (!edit) notFound();
  const [sourceRows, debate, steps] = await Promise.all([
    listSourcesAdmin(),
    kind === "debate" ? getDebateStructure(id) : null,
    kind === "path" ? getPathSteps(id) : null,
  ]);
  const sources = sourceRows.map((s) => ({ id: s.id, label: `${s.author} — ${s.title}` }));
  const returnTo = `/admin/${kind}/${id}`;
  const values = { ...edit.details, ...edit.entity };
  const sections = ["fields", ...(debate ? ["propositions", "positions", "stances", "arguments"] : []), ...(steps ? ["steps"] : []), "relationships", "citations", "excerpts"];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_14rem]">
      <div className="min-w-0 space-y-12">
        <header>
          <p className="label text-faint">
            <Link href={`/admin/${kind}`} className="hover:text-red">{KINDS[kind].plural}</Link> / <span className="label-mono">{id}</span>
          </p>
          <div className="mt-1 flex flex-wrap items-baseline justify-between gap-4">
            <h1 className="display text-5xl">{edit.entity.title}</h1>
            <ViewLink kind={kind} slug={edit.entity.slug} />
          </div>
        </header>
        <Notice error={sp.error} saved={sp.saved} />
        <Panel id="fields" title="Entry">
          <EntityForm fields={fieldsFor(kind)} values={values} action={saveEntityAction.bind(null, kind, id)} />
        </Panel>
        {debate && <DebateEditor debateId={id} s={debate} returnTo={returnTo} />}
        {steps && <PathEditor pathId={id} steps={steps} returnTo={returnTo} />}
        <RelationshipsPanel edit={edit} sources={sources} returnTo={returnTo} />
        <CitationsPanel edit={edit} sources={sources} returnTo={returnTo} />
        <ExcerptsPanel edit={edit} sources={sources} returnTo={returnTo} />
        <Panel id="danger" title="Delete">
          <form action={deleteEntityAction} className="flex items-center gap-4">
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="kind" value={kind} />
            <ConfirmButton message={`Delete “${edit.entity.title}” permanently?`} className="btn border-red text-red hover:bg-red hover:text-paper-warm">Delete this entry</ConfirmButton>
            <p className="text-sm text-muted">Removes the entry with its relationships, citations and excerpts. This cannot be undone.</p>
          </form>
        </Panel>
      </div>
      <nav aria-label="Editor sections" className="hidden lg:block">
        <ol className="sticky top-24 space-y-1.5 border-l border-ink pl-4">
          {sections.map((s) => (
            <li key={s}>
              <a href={`#${s}`} className="label text-muted hover:text-red">{s}</a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
