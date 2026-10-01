import "server-only";
/**
 * Structural checks, completeness and dependency reports.
 *
 * These are aids for human editors. They check structure and sourcing — a
 * missing field, a broken link, an unverified quotation — and deliberately do
 * not attempt to judge whether an interpretation is right.
 */
import { and, eq, inArray, like, or, sql } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { isEntityKind, KINDS, RELATIONSHIP_TYPES, type EntityKind, type RelationshipType } from "@/lib/content/model";
import { extractCites, extractExcerptIds, extractFigures, extractRefs, stripMarkup } from "@/lib/content/markup";
import { readWorkingFields } from "./content";
import { fieldsFor, type FieldValues } from "./fields";
import { mediaGaps } from "./media";
import { sourceGaps } from "./sources";

export type IssueLevel = "error" | "warning" | "info";
export interface Issue {
  level: IssueLevel;
  code: string;
  message: string;
  field?: string;
}

/** Everything the checks need, gathered once. */
async function gather(row: s.EntityRow, fields: FieldValues) {
  const db = await ready();
  const kind = row.kind as EntityKind;
  const texts = fieldsFor(kind)
    .filter((f) => f.type === "richtext")
    .map((f) => ({ name: f.name, text: String(fields[f.name] ?? "") }));
  const all = texts.map((t) => t.text);
  const [out, inc, cites, excerpts, media, positions, propositions, steps, heldPositions] = await Promise.all([
    db.select({ r: s.relationships, o: s.entities }).from(s.relationships).innerJoin(s.entities, eq(s.entities.id, s.relationships.toId)).where(eq(s.relationships.fromId, row.id)),
    db.select({ r: s.relationships, o: s.entities }).from(s.relationships).innerJoin(s.entities, eq(s.entities.id, s.relationships.fromId)).where(eq(s.relationships.toId, row.id)),
    db.select({ c: s.citations, src: s.sources }).from(s.citations).innerJoin(s.sources, eq(s.sources.id, s.citations.sourceId)).where(eq(s.citations.entityId, row.id)),
    db.select().from(s.excerpts).where(eq(s.excerpts.entityId, row.id)),
    db.select({ a: s.entityMedia, m: s.media }).from(s.entityMedia).innerJoin(s.media, eq(s.media.id, s.entityMedia.mediaId)).where(eq(s.entityMedia.entityId, row.id)),
    db.select().from(s.debatePositions).where(eq(s.debatePositions.debateId, row.id)),
    db.select().from(s.debatePropositions).where(eq(s.debatePropositions.debateId, row.id)),
    db.select().from(s.pathSteps).where(eq(s.pathSteps.pathId, row.id)),
    db.select({ id: s.debatePositions.id }).from(s.debatePositions).where(eq(s.debatePositions.holderId, row.id)),
  ]);
  const rels = [
    ...out.map((x) => ({ ...x.r, other: x.o, dir: "out" as const })),
    ...inc.map((x) => ({ ...x.r, other: x.o, dir: "in" as const })),
  ];
  return { kind, texts, all, rels, cites, excerpts, media, positions, propositions, steps, heldPositions };
}

export async function validateEntity(row: s.EntityRow, fieldsIn?: FieldValues): Promise<Issue[]> {
  const db = await ready();
  const fields = fieldsIn ?? (await readWorkingFields(row));
  const g = await gather(row, fields);
  const issues: Issue[] = [];
  const add = (level: IssueLevel, code: string, message: string, field?: string) => issues.push({ level, code, message, field });

  // Required fields.
  for (const f of fieldsFor(g.kind)) {
    const v = fields[f.name];
    const empty = v == null || (typeof v === "string" && !stripMarkup(v).trim() && !v.trim());
    if (f.required && empty) add("error", "required", `${f.label} is required.`, f.name);
  }
  if (typeof fields.yearStart === "number" && typeof fields.yearEnd === "number" && fields.yearEnd < fields.yearStart) {
    add("error", "dates", "The end year is before the start year.", "yearEnd");
  }
  const summary = String(fields.summary ?? "");
  if (summary.length > 420) add("info", "summary-length", "The summary is long; it appears in previews and maps — aim for one or two sentences.", "summary");

  // Internal links in prose.
  const refs = extractRefs(...g.all).filter((r) => isEntityKind(r.kind));
  if (refs.length) {
    const found = await db
      .select({ kind: s.entities.kind, slug: s.entities.slug, live: s.entities.live, title: s.entities.title })
      .from(s.entities)
      .where(or(...refs.map((r) => and(eq(s.entities.kind, r.kind), eq(s.entities.slug, r.slug)))));
    const moved = await db
      .select({ kind: s.slugHistory.kind, slug: s.slugHistory.slug })
      .from(s.slugHistory)
      .where(or(...refs.map((r) => and(eq(s.slugHistory.kind, r.kind), eq(s.slugHistory.slug, r.slug)))));
    for (const r of refs) {
      const hit = found.find((f) => f.kind === r.kind && f.slug === r.slug);
      const field = g.texts.find((t) => t.text.includes(`[[${r.kind}:${r.slug}`))?.name;
      if (!hit && moved.some((m) => m.kind === r.kind && m.slug === r.slug)) add("info", "link-moved", `The link to “${r.slug}” uses an old address; it still works through a redirect.`, field);
      else if (!hit) add("error", "broken-link", `Broken internal link: no ${KINDS[r.kind as EntityKind].label.toLowerCase()} called “${r.slug}”.`, field);
      else if (!hit.live) add("warning", "link-unpublished", `“${hit.title}” is not published; the link will read as plain text until it is.`, field);
    }
  }

  // Citations and figures in prose.
  const citedIds = [...new Set(extractCites(...g.all).map((c) => c.source))];
  if (citedIds.length) {
    const have = (await db.select({ id: s.sources.id }).from(s.sources).where(inArray(s.sources.id, citedIds))).map((x) => x.id);
    for (const id of citedIds.filter((x) => !have.includes(x))) add("error", "missing-source", `A citation points to a source that does not exist (${id}).`);
  }
  const figIds = extractFigures(...g.all);
  if (figIds.length) {
    const have = (await db.select({ id: s.media.id }).from(s.media).where(inArray(s.media.id, figIds))).map((x) => x.id);
    for (const id of figIds.filter((x) => !have.includes(x))) add("error", "missing-media", `A figure refers to an image that no longer exists (${id}).`);
  }
  for (const id of extractExcerptIds(...g.all)) {
    if (!g.excerpts.some((x) => x.id === id)) add("error", "missing-excerpt", "An embedded excerpt is not attached to this entry.");
  }

  // Sourcing.
  if (!g.cites.length) add("warning", "no-sources", "No sources are attached. Every entry should be traceable to sources.");
  for (const c of g.cites) {
    const gaps = sourceGaps(c.src);
    if (gaps.length) add("warning", "incomplete-source", `“${c.src.title}” is missing ${gaps.join(", ")}.`);
  }
  for (const x of g.excerpts) {
    if (x.body && x.verification === "unverified") add("warning", "unverified-quote", `Unverified quotation${x.locator ? ` (${x.locator})` : ""}: check the wording against the cited edition.`);
    if (x.verification === "needs_review") add("warning", "quote-needs-review", `A quotation is marked “needs review”${x.locator ? ` (${x.locator})` : ""}.`);
    if (x.body && !x.sourceId) add("warning", "quote-no-edition", "A quotation has no edition (source) recorded.");
  }

  // Relationships.
  for (const r of g.rels) {
    if (!r.other.live) add("warning", "relationship-unpublished", `Connected to “${r.other.title}”, which is not published: the link stays hidden until it is.`);
  }
  if (!g.rels.length && g.kind !== "path") add("warning", "isolated", "This entry has no relationships, so it will not appear on any map.");

  // Media.
  for (const { m } of g.media) {
    const gaps = mediaGaps(m);
    if (gaps.includes("alt text")) add("error", "media-alt", `Image “${m.title || m.originalName}” has no alt text.`);
    if (gaps.includes("licence / rights")) add("warning", "media-rights", `Image “${m.title || m.originalName}” has no licence or rights information.`);
  }

  // Kind-specific structure.
  if (g.kind === "debate") {
    if (g.positions.length < 2) add("error", "debate-positions", "A debate needs at least two positions.");
    if (g.propositions.length < 2) add("warning", "debate-propositions", "Add at least two propositions so positions can be compared.");
  }
  if (g.kind === "path" && g.steps.filter((x) => x.track === "main").length < 2) add("error", "path-steps", "A learning path needs at least two stops.");
  if (g.kind === "text" && !g.rels.some((r) => r.type === "WROTE" && r.dir === "in")) add("warning", "text-author", "No author is linked (a thinker “wrote” this text).");
  if (g.kind === "thinker" && !g.rels.some((r) => r.type === "MEMBER_OF")) add("info", "thinker-tendency", "Not yet placed in a tendency.");

  const order = { error: 0, warning: 1, info: 2 };
  return issues.sort((a, b) => order[a.level] - order[b.level]);
}

export interface CompletenessItem {
  section: string;
  done: boolean;
  hint?: string;
}

const has = (v: unknown, min = 1) => stripMarkup(typeof v === "string" ? v : "").length >= min;

export async function completeness(row: s.EntityRow, fieldsIn?: FieldValues): Promise<CompletenessItem[]> {
  const fields = fieldsIn ?? (await readWorkingFields(row));
  const g = await gather(row, fields);
  const rel = (pred: (r: (typeof g.rels)[number]) => boolean) => g.rels.some(pred);
  const sources = g.cites.length > 0;
  const item = (section: string, done: boolean, hint?: string): CompletenessItem => ({ section, done, hint });
  switch (g.kind) {
    case "thinker":
      return [
        item("Identity", has(fields.title) && fields.yearStart != null && has(fields.roles), "Name, dates and description"),
        item("Summary", has(fields.summary, 40)),
        item("Biography", has(fields.body, 300), "At least a few paragraphs"),
        item("Historical context", has(fields.context, 80)),
        item("Core ideas", rel((r) => r.other.kind === "concept" && ["DEVELOPED", "ASSOCIATED_WITH", "EXTENDED"].includes(r.type)), "Link concepts they developed"),
        item("Works", rel((r) => r.type === "WROTE" && r.dir === "out"), "Link texts they wrote"),
        item("Relationships", rel((r) => r.other.kind === "thinker"), "Influences, critics, collaborators"),
        item("Tendency", rel((r) => r.type === "MEMBER_OF")),
        item("Sources", sources),
        item("Media", g.media.some((x) => x.a.role === "portrait"), "A portrait with rights information"),
        item("Debates", g.heldPositions.length > 0, "Positions in debates"),
        item("Legacy", has(fields.legacy, 80)),
      ];
    case "concept":
      return [
        item("Definition", has(fields.summary, 40)),
        item("30 seconds", has(fields.brief, 40)),
        item("5 minutes", has(fields.standard, 300)),
        item("Deep dive", has(fields.deep, 300)),
        item("Historical development", has(fields.history, 80)),
        item("Interpretations", has(fields.interpretations, 80) || rel((r) => RELATIONSHIP_TYPES[r.type as RelationshipType]?.family === "critique")),
        item("Thinkers", rel((r) => r.other.kind === "thinker")),
        item("Texts", rel((r) => r.other.kind === "text")),
        item("Related concepts", rel((r) => r.other.kind === "concept")),
        item("Primary texts", g.excerpts.length > 0, "Excerpts or passage references"),
        item("Sources", sources),
        item("Debates", rel((r) => r.other.kind === "debate")),
      ];
    case "text":
      return [
        item("Bibliographic", fields.yearStart != null && !!fields.form && has(fields.language)),
        item("Summary", has(fields.summary, 40)),
        item("Author", rel((r) => r.type === "WROTE" && r.dir === "in")),
        item("About the text", has(fields.body, 200)),
        item("Context", has(fields.context, 80)),
        item("Concepts", rel((r) => r.type === "DISCUSSES" && r.dir === "out")),
        item("Excerpts", g.excerpts.length > 0),
        item("Sources", sources),
        item("Media", g.media.length > 0, "A cover or scan"),
      ];
    case "tendency":
      return [
        item("Definition", has(fields.summary, 40) && fields.yearStart != null),
        item("Overview", has(fields.body, 200)),
        item("Historical context", has(fields.context, 80)),
        item("Thinkers", rel((r) => r.type === "MEMBER_OF")),
        item("Lineage", rel((r) => r.other.kind === "tendency")),
        item("Criticisms", has(fields.criticisms, 80)),
        item("Legacy", has(fields.legacy, 80)),
        item("Sources", sources),
      ];
    case "debate":
      return [
        item("Question", has(fields.summary, 40) && has(fields.intro)),
        item("Context", has(fields.body, 80) || has(fields.context, 80)),
        item("Propositions", g.propositions.length >= 2),
        item("Positions", g.positions.length >= 2),
        item("Concepts", rel((r) => r.other.kind === "concept")),
        item("Sources", sources),
      ];
    case "event":
      return [
        item("Event", fields.yearStart != null && has(fields.place) && has(fields.dateLabel)),
        item("Summary", has(fields.summary, 40)),
        item("Description", has(fields.body, 200)),
        item("Significance", has(fields.significance, 80)),
        item("Connections", g.rels.length > 0),
        item("Sources", sources),
        item("Media", g.media.length > 0),
      ];
    case "path":
      return [
        item("Path", has(fields.entryLine) && has(fields.summary, 40)),
        item("Prerequisites", has(fields.prerequisites)),
        item("Stops", g.steps.filter((x) => x.track === "main").length >= 3, "At least three stops"),
        item("Branches", g.steps.some((x) => x.track !== "main"), "Optional detours or alternatives"),
      ];
  }
}

/* -------------------------------------------------------------------------- */
/* Dependencies                                                                */
/* -------------------------------------------------------------------------- */

const MARKUP_COLUMNS: [string, string[]][] = [
  ["thinker_details", ["context", "legacy"]],
  ["concept_details", ["brief", "standard", "deep", "history", "interpretations", "criticisms"]],
  ["text_details", ["context"]],
  ["tendency_details", ["context", "criticisms", "legacy"]],
  ["debate_details", ["context"]],
  ["event_details", ["significance"]],
  ["path_details", ["prerequisites"]],
];

/** What would be affected by unpublishing, archiving or deleting this entry. */
export async function dependencies(row: s.EntityRow) {
  const db = await ready();
  const [out, inc, steps, held, linked] = await Promise.all([
    db.select({ o: s.entities }).from(s.relationships).innerJoin(s.entities, eq(s.entities.id, s.relationships.toId)).where(eq(s.relationships.fromId, row.id)),
    db.select({ o: s.entities }).from(s.relationships).innerJoin(s.entities, eq(s.entities.id, s.relationships.fromId)).where(eq(s.relationships.toId, row.id)),
    db.select({ o: s.entities }).from(s.pathSteps).innerJoin(s.entities, eq(s.entities.id, s.pathSteps.pathId)).where(eq(s.pathSteps.entityId, row.id)),
    db
      .select({ o: s.entities })
      .from(s.debatePositions)
      .innerJoin(s.entities, eq(s.entities.id, s.debatePositions.debateId))
      .where(eq(s.debatePositions.holderId, row.id)),
    db
      .select({ o: s.entities })
      .from(s.positionLinks)
      .innerJoin(s.debatePositions, eq(s.debatePositions.id, s.positionLinks.positionId))
      .innerJoin(s.entities, eq(s.entities.id, s.debatePositions.debateId))
      .where(eq(s.positionLinks.entityId, row.id)),
  ]);

  // Prose references: [[kind:slug]] or [[kind:slug|label]] anywhere in long-form fields.
  const a = `%[[${row.kind}:${row.slug}]]%`;
  const b = `%[[${row.kind}:${row.slug}|%`;
  const refIds = new Set(
    (await db.select({ id: s.entities.id }).from(s.entities).where(or(like(s.entities.body, a), like(s.entities.body, b)))).map((r) => r.id),
  );
  for (const [table, cols] of MARKUP_COLUMNS) {
    const conds = cols.flatMap((c) => [sql`${sql.identifier(c)} LIKE ${a}`, sql`${sql.identifier(c)} LIKE ${b}`]);
    const rows = (await db.all(sql`SELECT entity_id AS id FROM ${sql.identifier(table)} WHERE ${sql.join(conds, sql` OR `)}`)) as { id: string }[];
    for (const r of rows) refIds.add(r.id);
  }
  refIds.delete(row.id);
  const referencing = refIds.size ? await db.select().from(s.entities).where(inArray(s.entities.id, [...refIds])) : [];

  const uniq = (xs: s.EntityRow[]) => [...new Map(xs.filter((x) => x.id !== row.id).map((x) => [x.id, x])).values()];
  const related = uniq([...out, ...inc].map((x) => x.o));
  const groups = {
    related,
    paths: uniq(steps.map((x) => x.o)),
    debates: uniq([...held, ...linked].map((x) => x.o)),
    referencing: uniq(referencing),
  };
  const byKind: Record<string, number> = {};
  for (const e of uniq([...groups.related, ...groups.paths, ...groups.debates, ...groups.referencing])) byKind[e.kind] = (byKind[e.kind] ?? 0) + 1;
  const liveDependants = uniq([...groups.related, ...groups.paths, ...groups.debates, ...groups.referencing]).filter((e) => e.live).length;
  return { ...groups, byKind, liveDependants };
}
