/**
 * The publishing state machine.
 *
 *   DRAFT → SUBMITTED → UNDER REVIEW → REVISION REQUESTED → RESUBMITTED → APPROVED → PUBLISHED
 *                                    ↘ REJECTED                                   ↘ UNPUBLISHED
 *   any (editor) → ARCHIVED → (restore) → UNPUBLISHED / DRAFT
 *
 * Who may fire each transition is decided in permissions.ts; this module only
 * says where each transition leads.
 */
import type { WorkflowStatus } from "@/lib/content/model";

export type Transition =
  | "submit"
  | "startReview"
  | "requestRevision"
  | "approve"
  | "reject"
  | "publish"
  | "unpublish"
  | "archive"
  | "unarchive";

export const TRANSITION_PERMISSION = {
  submit: "entity.submit",
  startReview: "entity.startReview",
  requestRevision: "entity.requestRevision",
  approve: "entity.approve",
  reject: "entity.reject",
  publish: "entity.publish",
  unpublish: "entity.unpublish",
  archive: "entity.archive",
  unarchive: "entity.unarchive",
} as const;

export const TRANSITION_AUDIT: Record<Transition, string> = {
  submit: "submit",
  startReview: "review",
  requestRevision: "revision_request",
  approve: "approve",
  reject: "reject",
  publish: "publish",
  unpublish: "unpublish",
  archive: "archive",
  unarchive: "restore",
};

export function nextStatus(
  t: Transition,
  current: WorkflowStatus,
  ctx: { live: boolean; publishedRevision: number | null; hasPendingChanges: boolean },
): WorkflowStatus {
  switch (t) {
    case "submit":
      return current === "revision_requested" ? "resubmitted" : "submitted";
    case "startReview":
      return "under_review";
    case "requestRevision":
      return "revision_requested";
    case "approve":
      return "approved";
    case "reject":
      return "rejected";
    case "publish":
      return "published";
    case "unpublish":
      return "unpublished";
    case "archive":
      return "archived";
    case "unarchive":
      return ctx.publishedRevision != null && !ctx.hasPendingChanges ? "unpublished" : "draft";
  }
}

/** What happens to the status when someone edits the content. */
export function statusAfterEdit(current: WorkflowStatus): WorkflowStatus {
  // A published (or withdrawn, or rejected) entry being edited starts a new cycle.
  if (current === "published" || current === "unpublished" || current === "rejected") return "draft";
  return current;
}
