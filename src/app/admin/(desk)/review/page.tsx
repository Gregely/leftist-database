import type { Metadata } from "next";
import { ContentTable } from "@/components/desk/ContentTable";
import { DeskHeading, DeskPage, Notice, Panel } from "@/components/desk/ui";
import { requireUser } from "@/lib/auth/session";
import { atLeast } from "@/lib/editorial/permissions";
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
  return (
    <DeskPage>
      <DeskHeading kicker="Review" title="Review queue" lede="Submissions waiting for a reader. Open an entry, read it in preview, leave notes, then approve or request revisions." />
      <div className="mt-8 space-y-10">
        <Panel title={`New submissions · ${submitted.total}`}>
          <ContentTable rows={submitted.items} empty="No new submissions." />
        </Panel>
        <Panel title={`Resubmitted after revision · ${resubmitted.total}`}>
          <ContentTable rows={resubmitted.items} empty="Nothing resubmitted." />
        </Panel>
        <Panel title={`Under review · ${underReview.total}`}>
          <ContentTable rows={underReview.items} empty="Nothing is currently under review." />
        </Panel>
        <Panel title={`Approved, awaiting publication · ${approved.total}`}>
          <ContentTable rows={approved.items} empty="Nothing approved yet." />
        </Panel>
      </div>
    </DeskPage>
  );
}
