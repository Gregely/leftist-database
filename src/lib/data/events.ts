import "server-only";
import { and, asc, eq, gt, inArray, lt, sql } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import { entities, eventDetails, tendencyDetails, textDetails } from "@/lib/db/schema";
import { entityHref, type EntityKind } from "@/lib/content/model";
import { buildProse, getEntityRow, getMediaFor, getRelations, isPublic, toSummary, withPreview } from "./core";
import type { PreviewSpec, RelatedEntity } from "./types";

export async function getEvent(slug: string, preview?: PreviewSpec) {
  const row = await getEntityRow("event", slug, preview);
  if (!row) return null;
  const db = await ready();
  const [storedDetails, relations, media, prev, next] = await Promise.all([
    db.select().from(eventDetails).where(eq(eventDetails.entityId, row.id)).get(),
    getRelations(row.id),
    getMediaFor(row.id),
    db
      .select()
      .from(entities)
      .where(and(eq(entities.kind, "event"), isPublic(), lt(entities.yearStart, row.yearStart ?? 0)))
      .orderBy(sql`${entities.yearStart} DESC`)
      .limit(1)
      .get(),
    db
      .select()
      .from(entities)
      .where(and(eq(entities.kind, "event"), isPublic(), gt(entities.yearStart, row.yearStart ?? 0)))
      .orderBy(asc(entities.yearStart))
      .limit(1)
      .get(),
  ]);
  const details = storedDetails ? withPreview(storedDetails, preview) : null;
  const prose = await buildProse(row.id, [row.body, details?.significance]);
  return {
    entity: toSummary(row),
    body: row.body,
    media,
    details,
    relations,
    prev: prev ? toSummary(prev) : null,
    next: next ? toSummary(next) : null,
    prose,
  };
}

export type EventAggregate = NonNullable<Awaited<ReturnType<typeof getEvent>>>;

/* -------------------------------------------------------------------------- */
/* Timeline                                                                    */
/* -------------------------------------------------------------------------- */

export type TimelineLane = "event" | "text" | "thinker" | "tendency";

export interface TimelineItem {
  id: string;
  kind: EntityKind;
  lane: TimelineLane;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string;
  href: string;
  year: number;
  yearEnd: number | null;
  /** Event type, text form or tendency colour. */
  tag: string | null;
  dateLabel: string | null;
  featured: boolean;
}

export async function getTimeline(opts: { from?: number; to?: number; lanes?: TimelineLane[]; featuredOnly?: boolean } = {}) {
  const db = await ready();
  const lanes = opts.lanes ?? ["event", "text", "thinker", "tendency"];
  const rows = await db
    .select({
      e: entities,
      eventType: eventDetails.eventType,
      dateLabel: eventDetails.dateLabel,
      form: textDetails.form,
      color: tendencyDetails.color,
    })
    .from(entities)
    .leftJoin(eventDetails, eq(eventDetails.entityId, entities.id))
    .leftJoin(textDetails, eq(textDetails.entityId, entities.id))
    .leftJoin(tendencyDetails, eq(tendencyDetails.entityId, entities.id))
    .where(
      and(
        inArray(entities.kind, lanes),
        isPublic(),
        sql`${entities.yearStart} IS NOT NULL`,
        opts.featuredOnly ? eq(entities.featured, true) : undefined,
        opts.from != null ? sql`coalesce(${entities.yearEnd}, ${entities.yearStart}) >= ${opts.from}` : undefined,
        opts.to != null ? sql`${entities.yearStart} <= ${opts.to}` : undefined,
      ),
    )
    .orderBy(asc(entities.yearStart), asc(entities.sortOrder));

  const items: TimelineItem[] = rows.map(({ e, eventType, dateLabel, form, color }) => {
    const kind = e.kind as EntityKind;
    return {
      id: e.id,
      kind,
      lane: kind as TimelineLane,
      slug: e.slug,
      title: e.title,
      subtitle: e.subtitle,
      summary: e.summary,
      href: entityHref(kind, e.slug),
      year: e.yearStart!,
      yearEnd: e.yearEnd,
      tag: eventType ?? form ?? color ?? null,
      dateLabel: dateLabel ?? null,
      featured: e.featured,
    };
  });
  return items;
}

/** Contextual data for a timeline / map panel. */
export async function getPreview(id: string) {
  const db = await ready();
  const row = await db.select().from(entities).where(and(eq(entities.id, id), isPublic())).get();
  if (!row) return null;
  const relations = await getRelations(row.id);
  const groups: Record<string, RelatedEntity[]> = {};
  for (const r of relations.filter((r) => r.kind !== "path").slice(0, 16)) (groups[r.kind] ??= []).push(r);
  let detail: string | null = null;
  if (row.kind === "event") {
    const d = await db.select().from(eventDetails).where(eq(eventDetails.entityId, id)).get();
    detail = [d?.dateLabel, d?.place].filter(Boolean).join(" · ") || null;
  }
  return { entity: toSummary(row), detail, groups };
}
export type Preview = NonNullable<Awaited<ReturnType<typeof getPreview>>>;
