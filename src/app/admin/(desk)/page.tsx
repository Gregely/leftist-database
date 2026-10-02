import Link from "next/link";
import { ContentTable } from "@/components/desk/ContentTable";
import { DeskHeading, DeskLink, DeskPage, Panel, When } from "@/components/desk/ui";
import { requireUser } from "@/lib/auth/session";
import { ENTITY_KINDS, KINDS, STATUS_LABELS, type WorkflowStatus } from "@/lib/content/model";
import { atLeast } from "@/lib/editorial/permissions";
import { dashboard } from "@/lib/editorial/queries";

const STAGES: WorkflowStatus[] = ["draft", "submitted", "under_review", "revision_requested", "resubmitted", "approved", "published"];

const ACTION_LABELS: Record<string, string> = {
  create: "created",
  edit: "edited",
  submit: "submitted",
  review: "began reviewing",
  revision_request: "requested a revision of",
  approve: "approved",
  reject: "rejected",
  publish: "published",
  unpublish: "unpublished",
  archive: "archived",
  restore: "restored",
  restore_revision: "restored a version of",
  relationship_create: "drew a relationship:",
  relationship_delete: "removed a relationship:",
  source_attach: "attached a source to",
  excerpt_add: "added an excerpt to",
  media_upload: "uploaded",
  media_attach: "attached an image to",
  note_add: "left a note on",
};

export default async function DeskHome() {
  const user = await requireUser();
  const d = await dashboard(user);
  const reviewer = atLeast(user, "reviewer");
  const editor = atLeast(user, "editor");
  return (
    <DeskPage>
      <DeskHeading
        kicker={new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        title={
          <>
            Good to see you, {user.name.split(" ")[0]}
            <span className="text-red">.</span>
          </>
        }
        lede="Everything in the publishing room, from first drafts to the public library."
        aside={<DeskLink href="/admin/content">Browse all content →</DeskLink>}
      />

      {/* The workflow, as a strip of stages */}
      <section aria-label="Workflow" className="mt-8 overflow-x-auto">
        <ol className="grid min-w-[720px] grid-cols-7 border-y border-ink">
          {STAGES.map((s, i) => (
            <li key={s} className={i ? "border-l border-rule" : ""}>
              <Link href={`/admin/content?status=${s}`} className="group block px-3 py-4 hover:bg-paper-warm">
                <span className="numeral block text-3xl text-red">{d.byStatus[s] ?? 0}</span>
                <span className="label mt-1 block group-hover:text-red">{STATUS_LABELS[s]}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-8">
          {reviewer && (
            <Panel id="queue" title={`Review queue · ${d.queueCount}`} aside={<DeskLink href="/admin/review">Open queue →</DeskLink>}>
              <ContentTable rows={d.queue} compact empty="No submissions are waiting for review." />
            </Panel>
          )}
          {editor && d.approved.length > 0 && (
            <Panel id="approved" title={`Approved — ready to publish · ${d.approved.length}`}>
              <ContentTable rows={d.approved} compact />
            </Panel>
          )}
          <Panel id="revisions" title={`Revision requests · ${d.revisionRequests.length}`}>
            <ContentTable rows={d.revisionRequests} compact empty="No revision requests waiting on you." />
          </Panel>
          <Panel id="mine" title="Your work in progress" aside={<DeskLink href={`/admin/content?author=${user.id}`}>All your entries →</DeskLink>}>
            <ContentTable rows={d.mine} compact empty="Nothing in progress. Start a new entry from the button above." />
          </Panel>
          <Panel id="recent" title="Recently edited">
            <ContentTable rows={d.recent} />
          </Panel>
        </div>

        <aside className="space-y-10 lg:col-span-4">
          <Panel id="holdings" title="The archive">
            <ul className="divide-y divide-rule border-b border-rule">
              {ENTITY_KINDS.map((k) => (
                <li key={k}>
                  <Link href={`/admin/content?kind=${k}`} className="group flex items-baseline justify-between py-2">
                    <span className="font-serif text-lg group-hover:text-red">{KINDS[k].plural}</span>
                    <span className="label-mono text-faint">
                      <span className="text-ink">{d.byKind[k]?.live ?? 0}</span> live / {d.byKind[k]?.total ?? 0}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel id="activity" title="Recent editorial activity" aside={atLeast(user, "admin") ? <DeskLink href="/admin/audit">Audit log →</DeskLink> : undefined}>
            <ol className="space-y-3">
              {d.activity.map((a) => (
                <li key={a.id} className="border-l border-rule pl-3 text-sm leading-snug">
                  <span className="font-medium">{a.actorName}</span> <span className="text-muted">{ACTION_LABELS[a.action] ?? a.action.replace(/_/g, " ")}</span>{" "}
                  {a.targetType === "entity" && a.targetId ? (
                    <Link href={`/admin/entries/${a.targetId}`} className="link-inline">
                      {a.targetLabel}
                    </Link>
                  ) : (
                    <span>{a.targetLabel}</span>
                  )}
                  <span className="label-mono block text-faint">
                    <When at={a.createdAt} />
                  </span>
                </li>
              ))}
            </ol>
          </Panel>
        </aside>
      </div>
    </DeskPage>
  );
}
