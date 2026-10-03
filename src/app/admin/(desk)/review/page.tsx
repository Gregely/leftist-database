import type { Metadata } from "next";
import Link from "next/link";
import { BulkReview } from "@/components/desk/BulkReview";
import { ContentTable } from "@/components/desk/ContentTable";
import { DeskHeading, DeskPage, Notice, Panel } from "@/components/desk/ui";
import { requireUser } from "@/lib/auth/session";
import { bulkOptions } from "@/lib/editorial/bulk";
import { atLeast, can } from "@/lib/editorial/permissions";
import { browse } from "@/lib/editorial/queries";

export const metadata: Metadata = { title: "Review queue" };

export default async function ReviewQueue() {
  const user = await requireUser();
  if (!atLeast(user, "reviewer")) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Notice tone="error">The review queue is for reviewers and editors.</Notice>
      </div>
    );
  }
  const [submitted, resubmitted, underReview, approved] = await Promise.all([
    browse({ status: "submitted", sort: "updated", perPage: 50 }),
    browse({ status: "resubmitted", sort: "updated", perPage: 50 }),
    browse({ status: "under_review", sort: "updated", perPage: 50 }),
    browse({ status: "approved", sort: "updated", perPage: 50 }),
  ]);
  const bulk = can(user, "entity.bulkReview");
  const options = bulk ? await bulkOptions(user, [submitted, resubmitted, underReview, approved].flatMap((r) => r.items.map((i) => i.id))) : {};
  const panels = [
    { key: "submitted", title: "New submissions", res: submitted, empty: "No new submissions." },
    { key: "resubmitted", title: "Resubmitted after revision", res: resubmitted, empty: "Nothing resubmitted." },
    { key: "under_review", title: "Under review", res: underReview, empty: "Nothing is currently under review." },
    { key: "approved", title: "Approved, awaiting publication", res: approved, empty: "Nothing approved yet." },
  ];
  return (
    <DeskPage>
      <DeskHeading
        kicker="Review"
        title="Review queue"
        lede={`Submissions waiting for a reader. Open an entry, read it in preview, leave notes, then approve or request revisions.${bulk ? " Editors can also select several entries and act on them together; approval and publication stay separate steps." : ""}`}
      />
      <div className="mt-8 space-y-10">
        {panels.map((p) => (
          <Panel key={p.key} title={`${p.title} · ${p.res.total}`}>
            {p.res.total > p.res.items.length && (
              <p className="mb-3 text-sm text-muted">
                Showing the {p.res.items.length} most recently edited.{" "}
                <Link href={`/admin/content?status=${p.key}`} className="link-inline">
                  See all {p.res.total} in Content
                </Link>
                .
              </p>
            )}
            {bulk ? <BulkReview rows={p.res.items} options={options} empty={p.empty} scope={p.title} /> : <ContentTable rows={p.res.items} empty={p.empty} />}
          </Panel>
        ))}
      </div>
    </DeskPage>
  );
}
