import "server-only";
import { aliasedTable, and, asc, desc, eq, inArray, like, ne, or, sql, type SQL } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { entityHref, isEntityKind, RELATIONSHIP_TYPES, REVIEW_QUEUE_STATUSES, STATUS_LABELS, WORKFLOW_STATUSES, type EntityKind, type RelationshipType, type WorkflowStatus } from "@/lib/content/model";
import type { Graph } from "@/lib/data/types";
import { listAudit } from "./audit";
import { atLeast, type Actor } from "./permissions";
import { hasTag } from "./collections";

const reviewer = aliasedTable(s.users, "reviewer");

/** Columns shown in every editorial list. */
function listSelect() {
  return {
    e: s.entities,
    authorName: s.users.name,
    reviewerName: reviewer.name,
    openNotes: sql<number>`(SELECT count(*) FROM editorial_notes n WHERE n.entity_id = entities.id AND n.resolved = 0 AND n.kind != 'approval')`,
  };
}

export type DeskRow = {
  id: string;
  kind: EntityKind;
  title: string;
  slug: string;
  status: WorkflowStatus;
  live: boolean;
  isSample: boolean;
  pending: boolean;
  updatedAt: string;
  authorName: string | null;
  reviewerName: string | null;
  openNotes: number;
};

function toRow(r: { e: s.EntityRow; authorName: string | null; reviewerName: string | null; openNotes: number }): DeskRow {
  return {
    id: r.e.id,
    kind: r.e.kind as EntityKind,
    title: r.e.title,
    slug: r.e.slug,
    status: r.e.status as WorkflowStatus,
    live: r.e.live,
    isSample: r.e.isSample,
    pending: r.e.live && (r.e.revision > (r.e.publishedRevision ?? 0) || r.e.stagedChanges),
    updatedAt: r.e.updatedAt,
    authorName: r.authorName,
    reviewerName: r.reviewerName,
    openNotes: Number(r.openNotes),
  };
}

async function list(where: SQL | undefined, limit = 8, order: SQL[] = [desc(s.entities.updatedAt)]) {
  const db = await ready();
  const rows = await db
    .select(listSelect())
    .from(s.entities)
    .leftJoin(s.users, eq(s.users.id, s.entities.authorId))
    .leftJoin(reviewer, eq(reviewer.id, s.entities.reviewerId))
    .where(where)
    .orderBy(...order)
    .limit(limit);
  return rows.map(toRow);
}

export async function dashboard(actor: Actor) {
  const db = await ready();
  const counts = await db
    .select({ kind: s.entities.kind, status: s.entities.status, live: s.entities.live, n: sql<number>`count(*)` })
    .from(s.entities)
    .groupBy(s.entities.kind, s.entities.status, s.entities.live);
  const byStatus: Record<string, number> = {};
  const byKind: Record<string, { total: number; live: number }> = {};
  for (const c of counts) {
    byStatus[c.status] = (byStatus[c.status] ?? 0) + Number(c.n);
    byKind[c.kind] ??= { total: 0, live: 0 };
    byKind[c.kind].total += Number(c.n);
    if (c.live) byKind[c.kind].live += Number(c.n);
  }
  const queueWhere = and(
    inArray(s.entities.status, REVIEW_QUEUE_STATUSES),
    atLeast(actor, "editor") ? undefined : or(sql`${s.entities.authorId} IS NULL`, ne(s.entities.authorId, actor.id)),
  );
  const [mine, queue, revisionRequests, approved, recent, activity] = await Promise.all([
    list(and(eq(s.entities.authorId, actor.id), ne(s.entities.status, "published")), 8),
    atLeast(actor, "reviewer") ? list(queueWhere, 10, [asc(s.entities.submittedAt)]) : Promise.resolve([]),
    list(and(eq(s.entities.status, "revision_requested"), atLeast(actor, "editor") ? undefined : eq(s.entities.authorId, actor.id)), 8),
    atLeast(actor, "editor") ? list(eq(s.entities.status, "approved"), 8) : Promise.resolve([]),
    list(undefined, 10),
    listAudit({ limit: 14 }),
  ]);
  // The dashboard shows the oldest few; the badge needs the full count.
  const queueCount = atLeast(actor, "reviewer")
    ? Number((await db.select({ n: sql<number>`count(*)` }).from(s.entities).where(queueWhere).get())?.n ?? 0)
    : 0;
  return { byStatus, byKind, mine, queue, queueCount, revisionRequests, approved, recent, activity: activity.items };
}

export const BROWSE_FLAGS = {
  notes: "Open editorial notes",
  unverified: "Unverified quotations",
  nosources: "No sources",
  pending: "Unpublished changes",
  sample: "Sample entries",
} as const;
export type BrowseFlag = keyof typeof BROWSE_FLAGS;

export const BROWSE_SORTS = {
  updated: "Recently edited",
  title: "Title",
  kind: "Type",
  status: "Status",
  created: "Recently created",
} as const;

export interface BrowseQuery {
  q?: string;
  kind?: string;
  status?: string;
  author?: string;
  reviewer?: string;
  /** Editorial collection label, e.g. "Initial Marx Corpus". */
  collection?: string;
  flag?: string;
  sort?: string;
  page?: number;
  perPage?: number;
}

export async function browse(q: BrowseQuery) {
  const db = await ready();
  const where: SQL[] = [];
  if (q.q?.trim()) {
    const term = `%${q.q.trim()}%`;
    where.push(or(like(s.entities.title, term), like(s.entities.slug, term), like(s.entities.aliases, term), like(s.entities.summary, term))!);
  }
  if (q.kind && isEntityKind(q.kind)) where.push(eq(s.entities.kind, q.kind));
  if (q.status === "live") where.push(eq(s.entities.live, true));
  else if (q.status && (WORKFLOW_STATUSES as readonly string[]).includes(q.status)) where.push(eq(s.entities.status, q.status));
  if (q.author) where.push(eq(s.entities.authorId, q.author));
  if (q.reviewer) where.push(eq(s.entities.reviewerId, q.reviewer));
  if (q.collection) where.push(hasTag(q.collection));
  switch (q.flag as BrowseFlag) {
    case "notes":
      where.push(sql`EXISTS (SELECT 1 FROM editorial_notes n WHERE n.entity_id = entities.id AND n.resolved = 0 AND n.kind != 'approval')`);
      break;
    case "unverified":
      where.push(sql`EXISTS (SELECT 1 FROM excerpts x WHERE x.entity_id = entities.id AND x.body != '' AND x.verification != 'verified')`);
      break;
    case "nosources":
      where.push(sql`NOT EXISTS (SELECT 1 FROM citations c WHERE c.entity_id = entities.id)`);
      break;
    case "pending":
      where.push(sql`${s.entities.live} = 1 AND (${s.entities.revision} > coalesce(${s.entities.publishedRevision}, 0) OR ${s.entities.stagedChanges} = 1)`);
      break;
    case "sample":
      where.push(eq(s.entities.isSample, true));
      break;
  }
  const order =
    q.sort === "title"
      ? [asc(s.entities.title)]
      : q.sort === "kind"
        ? [asc(s.entities.kind), asc(s.entities.title)]
        : q.sort === "status"
          ? [asc(s.entities.status), desc(s.entities.updatedAt)]
          : q.sort === "created"
            ? [desc(s.entities.createdAt), desc(s.entities.id)]
            : [desc(s.entities.updatedAt), asc(s.entities.title)];
  const perPage = q.perPage ?? 30;
  const page = Math.max(1, q.page ?? 1);
  const cond = where.length ? and(...where) : undefined;
  const [rows, count] = await Promise.all([
    db
      .select(listSelect())
      .from(s.entities)
      .leftJoin(s.users, eq(s.users.id, s.entities.authorId))
      .leftJoin(reviewer, eq(reviewer.id, s.entities.reviewerId))
      .where(cond)
      .orderBy(...order)
      .limit(perPage)
      .offset((page - 1) * perPage),
    db.select({ n: sql<number>`count(*)` }).from(s.entities).where(cond).get(),
  ]);
  return { items: rows.map(toRow), total: Number(count?.n ?? 0), page, perPage };
}

export async function staffList() {
  const db = await ready();
  return db.select({ id: s.users.id, name: s.users.name, role: s.users.role }).from(s.users).orderBy(asc(s.users.name));
}

/** Search across every status, for the desk's pickers and link dialogs. */
export async function lookup(q: string, kinds: EntityKind[] = [], limit = 12) {
  const db = await ready();
  const term = q.trim();
  if (!term) return [];
  const like1 = `%${term}%`;
  const rows = await db
    .select({ id: s.entities.id, kind: s.entities.kind, slug: s.entities.slug, title: s.entities.title, subtitle: s.entities.subtitle, live: s.entities.live, status: s.entities.status })
    .from(s.entities)
    .where(and(or(like(s.entities.title, like1), like(s.entities.aliases, like1), like(s.entities.slug, like1)), kinds.length ? inArray(s.entities.kind, kinds) : undefined))
    .orderBy(sql`CASE WHEN lower(${s.entities.title}) = lower(${term}) THEN 0 WHEN lower(${s.entities.title}) LIKE lower(${term + "%"}) THEN 1 ELSE 2 END`, asc(s.entities.title))
    .limit(limit);
  return rows.map((r) => ({ ...r, kind: r.kind as EntityKind }));
}

/**
 * An entry's neighbourhood for the desk: every status, with unpublished
 * entries marked — the same relationship rows that drive the public map.
 */
export async function deskNeighborhood(id: string): Promise<Graph> {
  const db = await ready();
  const rels = await db
    .select()
    .from(s.relationships)
    .where(or(eq(s.relationships.fromId, id), eq(s.relationships.toId, id)));
  const ids = [...new Set([id, ...rels.flatMap((r) => [r.fromId, r.toId])])];
  const [rows, among] = await Promise.all([
    db.select().from(s.entities).where(inArray(s.entities.id, ids)),
    db.select().from(s.relationships).where(and(inArray(s.relationships.fromId, ids), inArray(s.relationships.toId, ids))),
  ]);
  const degree = new Map<string, number>();
  for (const r of among) {
    degree.set(r.fromId, (degree.get(r.fromId) ?? 0) + 1);
    degree.set(r.toId, (degree.get(r.toId) ?? 0) + 1);
  }
  return {
    nodes: rows.map((r) => ({
      id: r.id,
      kind: r.kind as EntityKind,
      title: r.title,
      subtitle: r.subtitle,
      summary: r.summary,
      href: r.live ? entityHref(r.kind as EntityKind, r.slug) : `/admin/entries/${r.id}`,
      yearStart: r.yearStart,
      yearEnd: r.yearEnd,
      color: null,
      group: r.live ? null : `${STATUS_LABELS[r.status as WorkflowStatus] ?? r.status} · not public`,
      degree: degree.get(r.id) ?? 0,
    })),
    edges: among.map((r) => {
      const meta = RELATIONSHIP_TYPES[r.type as RelationshipType];
      return { id: r.id, source: r.fromId, target: r.toId, type: meta.type, family: meta.family, label: meta.label, note: r.note, weight: r.weight };
    }),
  };
}
