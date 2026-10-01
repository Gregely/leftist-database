/**
 * Centralised authorisation for the editorial desk.
 *
 * Every server action and every protected read asks `can(...)` (or the
 * throwing `assertCan(...)`). The UI uses the same function to decide which
 * controls to show, but hiding a button is never the security boundary.
 *
 * This module is pure (no I/O) so it can be unit-tested and reused on the
 * client for display decisions.
 */
import type { Role, WorkflowStatus } from "@/lib/content/model";

export interface Actor {
  id: string;
  role: Role;
  name: string;
  email: string;
}

/** The parts of an entity that permissions depend on. */
export interface EntityGate {
  authorId: string | null;
  reviewerId?: string | null;
  status: WorkflowStatus;
  live: boolean;
  publishedRevision: number | null;
}

const RANK: Record<Role, number> = { contributor: 0, reviewer: 1, editor: 2, admin: 3 };
export const atLeast = (actor: Actor, role: Role) => RANK[actor.role] >= RANK[role];

/** States in which an author may keep working on their own entry. */
const AUTHOR_EDITABLE: WorkflowStatus[] = ["draft", "revision_requested", "rejected", "published", "unpublished"];
const AWAITING_REVIEW: WorkflowStatus[] = ["submitted", "resubmitted", "under_review"];

export type Permission =
  | "entity.create"
  | "entity.view"
  | "entity.edit"
  | "entity.editStructure"
  | "entity.submit"
  | "entity.startReview"
  | "entity.requestRevision"
  | "entity.approve"
  | "entity.reject"
  | "entity.publish"
  | "entity.unpublish"
  | "entity.archive"
  | "entity.unarchive"
  | "entity.delete"
  | "entity.restoreRevision"
  | "entity.comment"
  | "source.create"
  | "source.edit"
  | "media.upload"
  | "media.edit"
  | "relationship.global"
  | "users.manage"
  | "audit.view";

const isAuthor = (a: Actor, e?: EntityGate) => !!e && !!e.authorId && e.authorId === a.id;

/**
 * May `actor` do `permission` (to `entity`, where relevant)?
 * `owner` is used for sources and media (the creating user).
 */
export function can(actor: Actor | null, permission: Permission, entity?: EntityGate, owner?: string | null): boolean {
  if (!actor) return false;
  const editor = atLeast(actor, "editor");
  const reviewer = atLeast(actor, "reviewer");
  switch (permission) {
    case "entity.create":
    case "entity.view":
    case "source.create":
    case "media.upload":
      return true;

    case "entity.edit":
    case "entity.restoreRevision":
      if (!entity || entity.status === "archived") return false;
      return editor || (isAuthor(actor, entity) && AUTHOR_EDITABLE.includes(entity.status));

    case "entity.editStructure":
      // Structural changes (relationships, citations, media…) take effect
      // immediately, so on live entries they are reserved for editors.
      return can(actor, "entity.edit", entity) && (!entity!.live || editor);

    case "entity.submit":
      if (!entity) return false;
      return (
        (editor || isAuthor(actor, entity)) &&
        ["draft", "revision_requested", "rejected"].includes(entity.status)
      );

    case "entity.startReview":
      return !!entity && reviewer && ["submitted", "resubmitted"].includes(entity.status) && (editor || !isAuthor(actor, entity));

    case "entity.requestRevision":
    case "entity.approve":
    case "entity.reject":
      // Reviewers never sign off their own work; editors may.
      return !!entity && reviewer && AWAITING_REVIEW.includes(entity.status) && (editor || !isAuthor(actor, entity));

    case "entity.publish":
      return !!entity && editor && (entity.status === "approved" || (entity.status === "unpublished" && entity.publishedRevision != null));

    case "entity.unpublish":
      return !!entity && editor && entity.live;

    case "entity.archive":
      return !!entity && editor && entity.status !== "archived";

    case "entity.unarchive":
      return !!entity && editor && entity.status === "archived";

    case "entity.delete":
      // Only material that was never published can be removed outright.
      if (!entity || entity.live || entity.publishedRevision != null) return false;
      return editor || (isAuthor(actor, entity) && ["draft", "rejected"].includes(entity.status));

    case "entity.comment":
      return reviewer || isAuthor(actor, entity);

    case "source.edit":
    case "media.edit":
      return editor || (!!owner && owner === actor.id);

    case "relationship.global":
      return editor;

    case "users.manage":
    case "audit.view":
      return actor.role === "admin";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "You do not have permission to do that.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export function assertCan(actor: Actor | null, permission: Permission, entity?: EntityGate, owner?: string | null): asserts actor is Actor {
  if (!can(actor, permission, entity, owner)) throw new ForbiddenError();
}

/** The workflow actions available to an actor, in display order. */
export function availableActions(actor: Actor, e: EntityGate) {
  const all: { permission: Permission; label: string; tone: "primary" | "neutral" | "danger" }[] = [
    { permission: "entity.submit", label: e.status === "revision_requested" ? "Resubmit for review" : "Submit for review", tone: "primary" },
    { permission: "entity.startReview", label: "Start review", tone: "neutral" },
    { permission: "entity.requestRevision", label: "Request revision", tone: "neutral" },
    { permission: "entity.approve", label: "Approve", tone: "primary" },
    { permission: "entity.reject", label: "Reject", tone: "danger" },
    { permission: "entity.publish", label: e.live ? "Publish changes" : "Publish", tone: "primary" },
    { permission: "entity.unpublish", label: "Unpublish", tone: "danger" },
    { permission: "entity.unarchive", label: "Restore from archive", tone: "neutral" },
  ];
  return all.filter((a) => can(actor, a.permission, e));
}
