import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SourceEditor } from "@/components/desk/SourceEditor";
import { DeskHeading, DeskPage, Notice, Panel } from "@/components/desk/ui";
import { requireUser } from "@/lib/auth/session";
import { can } from "@/lib/editorial/permissions";
import { getSourceForDesk, sourceCitedBy, sourceUsage } from "@/lib/editorial/sources";

export const metadata: Metadata = { title: "Source" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> };

export default async function SourcePage({ params, searchParams }: Props) {
  const user = await requireUser();
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const src = await getSourceForDesk(id);
  if (!src) notFound();
  const [usage, uses] = await Promise.all([sourceUsage(id), sourceCitedBy(id)]);
  const initial = Object.fromEntries(Object.entries(src).map(([k, v]) => [k, v == null ? "" : String(v)]));
  return (
    <DeskPage className="max-w-5xl">
      <DeskHeading kicker="Source" title={<span className="italic">{src.title}</span>} lede={src.author} />
      {sp.created && (
        <div className="mt-4">
          <Notice tone="success">Added to the bibliography.</Notice>
        </div>
      )}
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_18rem]">
        <SourceEditor id={id} initial={initial} canEdit={can(user, "source.edit", undefined, src.createdBy)} canDelete={can(user, "source.edit", undefined, null) && usage.total === 0} />
        <Panel title={`Used ${usage.total} time${usage.total === 1 ? "" : "s"}`}>
          <ul className="space-y-1 text-sm">
            {uses.map((u, i) => (
              <li key={i}>
                <Link href={`/admin/entries/${u.id}?tab=sources`} className="link-inline">
                  {u.title}
                </Link>{" "}
                <span className="label text-faint">
                  {u.how}
                  {u.locator ? ` · ${u.locator}` : ""}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-faint">
            Cite inline from any rich-text field with Cite, or by id: <code className="font-mono">[cite:{id}, p. 12]</code>
          </p>
        </Panel>
      </div>
    </DeskPage>
  );
}
