import "server-only";
/**
 * Bulk review: the existing workflow transitions applied to several selected
 * entries. Nothing here changes what a transition does — each entry goes
 * through `transition()` exactly as from its own workflow bar, with the same
 * permission check, validation, revision sealing and audit entry. This module
 * only adds what a selection needs:
 *
 * - a separate permission to use bulk tools at all (editors);
 * - a fixed list of review/publish transitions (no unpublish, archive or delete);
 * - a check that each entry is still the version the editor selected
 *   (`lockVersion`), so nothing changed in the meantime is swept along;
 * - an explicit count confirmation for publishing;
 * - one summary audit record listing what was requested, done and skipped.
 *
 * Transitions never resolve or delete editorial notes, so approving or
 * publishing leaves every open flag on an entry open.
 */
import { inArray } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { STATUS_LABELS, type WorkflowStatus } from "@/lib/content/model";
import { audit } from "./audit";
import { ConflictError, gateOf, NotFoundError, transition, ValidationError } from "./content";
import { assertCan, can, ForbiddenError, type Actor } from "./permissions";
import { TRANSITION_PERMISSION, type Transition } from "./workflow";

export const BULK_TRANSITIONS = ["startReview", "requestRevision", "approve", "publish"] as const satisfies readonly Transition[];
export type BulkTransition = (typeof BULK_TRANSITIONS)[number];

export const BULK_LABELS: Record<BulkTransition, { verb: string; done: string }> = {
  startReview: { verb: "Start review", done: "moved to review" },
  requestRevision: { verb: "Request revision", done: "sent back for revision" },
  approve: { verb: "Approve", done: "approved" },
  publish: { verb: "Publish", done: "published" },
};

/** The most entries one bulk action may touch. */
export const BULK_LIMIT = 100;

export interface BulkItem {
  id: string;
  /** The entry's lockVersion when it was selected. */
  lockVersion: number;
}

export interface BulkOutcome {
  id: string;
  title: string;
  ok: boolean;
  status?: WorkflowStatus;
  reason?: string;
}

export function isBulkTransition(t: string): t is BulkTransition {
  return (BULK_TRANSITIONS as readonly string[]).includes(t);
}

/** Which bulk transitions `actor` may apply to an entry, for the selection UI. */
export function bulkActionsFor(actor: Actor, row: s.EntityRow): BulkTransition[] {
  if (!can(actor, "entity.bulkReview")) return [];
  return BULK_TRANSITIONS.filter((t) => can(actor, TRANSITION_PERMISSION[t], gateOf(row)));
}

export async function bulkTransition(
  actor: Actor,
  items: BulkItem[],
  t: string,
  opts: { note?: string; confirmCount?: number; validate?: (row: s.EntityRow) => Promise<{ level: string; message: string }[]> } = {},
): Promise<BulkOutcome[]> {
  assertCan(actor, "entity.bulkReview");
  if (!isBulkTransition(t)) throw new ValidationError({ action: "That action is not available in bulk." });

  // Only the entries explicitly selected, each once.
  const selected = [...new Map(items.filter((i) => typeof i?.id === "string" && Number.isInteger(i.lockVersion)).map((i) => [i.id, i])).values()];
  if (!selected.length) throw new ValidationError({ selection: "Select at least one entry." });
  if (selected.length > BULK_LIMIT) throw new ValidationError({ selection: `Select at most ${BULK_LIMIT} entries at a time.` });
  const note = opts.note?.trim() ?? "";
  if (t === "requestRevision" && !note) throw new ValidationError({ note: "Explain what needs to change — every selected entry receives this note." });
  if (t === "publish" && opts.confirmCount !== selected.length) {
    throw new ValidationError({ confirm: `Type ${selected.length} to confirm publishing ${selected.length === 1 ? "this entry" : `these ${selected.length} entries`}.` });
  }

  const db = await ready();
  const rows = new Map(
    (await db.select().from(s.entities).where(inArray(s.entities.id, selected.map((i) => i.id)))).map((r) => [r.id, r]),
  );
  const outcomes: BulkOutcome[] = [];
  try {
    for (const item of selected) {
      const row = rows.get(item.id);
      if (!row) {
        outcomes.push({ id: item.id, title: item.id, ok: false, reason: "Entry not found." });
        continue;
      }
      if (row.lockVersion !== item.lockVersion) {
        outcomes.push({ id: row.id, title: row.title, ok: false, reason: "Changed since you selected it — reload and check it again." });
        continue;
      }
      if (!can(actor, TRANSITION_PERMISSION[t], gateOf(row))) {
        outcomes.push({ id: row.id, title: row.title, ok: false, reason: `Not possible while ${STATUS_LABELS[row.status as WorkflowStatus] ?? row.status}.` });
        continue;
      }
      try {
        const status = await transition(actor, row.id, t, { note: note || undefined, validate: opts.validate });
        outcomes.push({ id: row.id, title: row.title, ok: true, status });
      } catch (e) {
        if (e instanceof ValidationError || e instanceof ConflictError || e instanceof ForbiddenError || e instanceof NotFoundError) {
          outcomes.push({ id: row.id, title: row.title, ok: false, reason: e.message || "Not possible." });
        } else throw e;
      }
    }
  } finally {
    const done = outcomes.filter((o) => o.ok);
    await audit(
      actor.id,
      "bulk_transition",
      { type: "entity", label: `${BULK_LABELS[t].verb} · ${done.length} of ${selected.length} selected` },
      {
        transition: t,
        requested: selected.map((i) => i.id),
        succeeded: done.map((o) => o.id),
        skipped: outcomes.filter((o) => !o.ok).map((o) => ({ id: o.id, reason: o.reason })),
        note: note || undefined,
      },
    );
  }
  return outcomes;
}

/** Per-entry selection data for a listing: the version selected and the bulk actions allowed. */
export async function bulkOptions(actor: Actor, ids: string[]): Promise<Record<string, { lockVersion: number; actions: BulkTransition[] }>> {
  if (!ids.length || !can(actor, "entity.bulkReview")) return {};
  const db = await ready();
  const rows = await db.select().from(s.entities).where(inArray(s.entities.id, ids));
  return Object.fromEntries(rows.map((r) => [r.id, { lockVersion: r.lockVersion, actions: bulkActionsFor(actor, r) }]));
}
