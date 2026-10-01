import Link from "next/link";
import { notFound } from "next/navigation";
import { saveEntityAction } from "@/app/admin/actions";
import { EntityForm } from "@/components/admin/EntityForm";
import { fieldsFor } from "@/lib/admin/fields";
import { isEntityKind, KINDS } from "@/lib/content/model";

type Props = { params: Promise<{ kind: string }> };

export default async function NewEntity({ params }: Props) {
  const { kind } = await params;
  if (!isEntityKind(kind)) notFound();
  return (
    <div className="max-w-4xl">
      <p className="label text-faint">
        <Link href={`/admin/${kind}`} className="hover:text-red">{KINDS[kind].plural}</Link> / New
      </p>
      <h1 className="display mb-8 mt-1 text-5xl">New {KINDS[kind].label.toLowerCase()}</h1>
      <EntityForm
        fields={fieldsFor(kind)}
        values={{ status: "draft", sortOrder: 1000, ...(kind === "text" ? { form: "book", difficulty: 2 } : {}), ...(kind === "path" ? { level: "introductory" } : {}), ...(kind === "event" ? { eventType: "movement" } : {}), ...(kind === "tendency" ? { color: "ink" } : {}) }}
        action={saveEntityAction.bind(null, kind, null)}
        submitLabel={`Create ${KINDS[kind].label.toLowerCase()}`}
      />
      <p className="mt-6 text-sm text-muted">Relationships, citations and structure can be added once the entry exists.</p>
    </div>
  );
}
