import "server-only";
import { and, desc, eq, sql, type SQL } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import { auditLog, users } from "@/lib/db/schema";
import { newId } from "@/lib/util/id";

export type AuditTarget = "entity" | "relationship" | "source" | "media" | "user" | "session";

const SENSITIVE = /pass(word)?|token|secret|hash|cookie|session/i;

function scrub(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(scrub);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([k]) => !SENSITIVE.test(k))
        .map(([k, v]) => [k, scrub(v)]),
    );
  }
  return typeof value === "string" && value.length > 500 ? value.slice(0, 500) + "…" : value;
}

/** Record an editorial action. Sensitive keys are dropped from metadata. */
export async function audit(
  actorId: string | null,
  action: string,
  target: { type: AuditTarget; id?: string | null; label?: string },
  metadata: Record<string, unknown> = {},
) {
  const db = await ready();
  await db.insert(auditLog).values({
    id: newId("log"),
    actorId,
    action,
    targetType: target.type,
    targetId: target.id ?? null,
    targetLabel: target.label ?? "",
    metadata: JSON.stringify(scrub(metadata)),
  });
}

export interface AuditQuery {
  actorId?: string;
  action?: string;
  targetType?: string;
  targetId?: string;
  limit?: number;
  offset?: number;
}

export async function listAudit(q: AuditQuery = {}) {
  const db = await ready();
  const where: SQL[] = [];
  if (q.actorId) where.push(eq(auditLog.actorId, q.actorId));
  if (q.action) where.push(eq(auditLog.action, q.action));
  if (q.targetType) where.push(eq(auditLog.targetType, q.targetType));
  if (q.targetId) where.push(eq(auditLog.targetId, q.targetId));
  const cond = where.length ? and(...where) : undefined;
  const [rows, count] = await Promise.all([
    db
      .select({ log: auditLog, actorName: users.name })
      .from(auditLog)
      .leftJoin(users, eq(users.id, auditLog.actorId))
      .where(cond)
      .orderBy(desc(auditLog.createdAt), desc(auditLog.id))
      .limit(q.limit ?? 50)
      .offset(q.offset ?? 0),
    db.select({ n: sql<number>`count(*)` }).from(auditLog).where(cond).get(),
  ]);
  return {
    total: Number(count?.n ?? 0),
    items: rows.map((r) => ({ ...r.log, actorName: r.actorName ?? "System", metadata: safeParse(r.log.metadata) })),
  };
}

function safeParse(s: string): Record<string, unknown> {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}

export const AUDIT_ACTIONS = [
  "create",
  "edit",
  "submit",
  "review",
  "revision_request",
  "approve",
  "reject",
  "publish",
  "unpublish",
  "archive",
  "restore",
  "restore_revision",
  "delete",
  "relationship_create",
  "relationship_delete",
  "source_create",
  "source_edit",
  "source_attach",
  "source_detach",
  "excerpt_add",
  "excerpt_edit",
  "excerpt_remove",
  "media_upload",
  "media_edit",
  "media_attach",
  "media_detach",
  "note_add",
  "note_resolve",
  "structure_edit",
  "tags_set",
  "import",
  "bulk_transition",
  "user_create",
  "role_change",
  "user_deactivate",
  "user_reactivate",
  "password_reset",
  "login",
  "login_failed",
  "logout",
] as const;
