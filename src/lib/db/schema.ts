/**
 * Relational schema for THEORY / ATLAS.
 *
 * Design (see docs/DATA_MODEL.md for the long version):
 *
 *   entities ─┬─ thinker_details      (class-table inheritance: one row in
 *             ├─ concept_details       `entities` per node, plus one row in the
 *             ├─ text_details          matching *_details table)
 *             ├─ tendency_details
 *             ├─ debate_details ── debate_positions ── position_stances
 *             │                 ├─ debate_propositions ┘
 *             │                 └─ debate_arguments
 *             ├─ event_details
 *             └─ path_details ── path_steps
 *
 *   relationships (entity → entity, typed, optionally cited)
 *   sources ── citations (source → entity, with locator)
 *   excerpts (passages from sources, attached to entities)
 *
 * The full-text index (`search_index`, SQLite FTS5) lives in a hand-written
 * migration because Drizzle cannot express virtual tables.
 */
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
};

/* -------------------------------------------------------------------------- */
/* Core entity table                                                           */
/* -------------------------------------------------------------------------- */

export const entities = sqliteTable(
  "entities",
  {
    id: text("id").primaryKey(),
    kind: text("kind").notNull(), // EntityKind
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    /** Secondary line: life dates, a question's framing, an original title… */
    subtitle: text("subtitle"),
    /** One or two sentences. Used in previews, maps, search results. */
    summary: text("summary").notNull().default(""),
    /** Long-form overview in Atlas markdown (see lib/content/markup.ts). */
    body: text("body").notNull().default(""),
    /** JSON array of alternative names, spellings and translations. */
    aliases: text("aliases").notNull().default("[]"),
    /** Positions the entity in time: birth/death, publication, event span… */
    yearStart: integer("year_start"),
    yearEnd: integer("year_end"),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    /** Editorial ordering within a kind (lower first). */
    sortOrder: integer("sort_order").notNull().default(1000),
    status: text("status").notNull().default("draft"), // EntryStatus
    ...timestamps,
  },
  (t) => [
    uniqueIndex("entities_kind_slug").on(t.kind, t.slug),
    index("entities_kind").on(t.kind, t.sortOrder),
    index("entities_year").on(t.yearStart),
  ],
);

/* -------------------------------------------------------------------------- */
/* Kind-specific detail tables                                                 */
/* -------------------------------------------------------------------------- */

const entityRef = () =>
  text("entity_id")
    .primaryKey()
    .references(() => entities.id, { onDelete: "cascade" });

export const thinkerDetails = sqliteTable("thinker_details", {
  entityId: entityRef(),
  /** "German philosopher, economist and revolutionary". */
  roles: text("roles").notNull().default(""),
  birthPlace: text("birth_place"),
  deathPlace: text("death_place"),
  legacy: text("legacy").notNull().default(""),
});

export const conceptDetails = sqliteTable("concept_details", {
  entityId: entityRef(),
  /** "30 seconds" — the plain-language version. */
  brief: text("brief").notNull().default(""),
  /** "5 minutes" — accessible, more detailed. */
  standard: text("standard").notNull().default(""),
  /** "Deep dive" — theoretical treatment. */
  deep: text("deep").notNull().default(""),
});

export const textDetails = sqliteTable("text_details", {
  entityId: entityRef(),
  originalTitle: text("original_title"),
  language: text("language"),
  form: text("form").notNull().default("book"),
  /** Free text such as "Written 1845–46; first published 1932". */
  publicationNote: text("publication_note"),
  /** 1 = accessible, 2 = demanding, 3 = specialist. */
  difficulty: integer("difficulty").notNull().default(2),
  /** Public-domain or open-access reading copy. */
  readingUrl: text("reading_url"),
});

export const tendencyDetails = sqliteTable("tendency_details", {
  entityId: entityRef(),
  color: text("color").notNull().default("ink"), // TendencyColor
  periodLabel: text("period_label"),
});

export const debateDetails = sqliteTable("debate_details", {
  entityId: entityRef(),
  /** Short framing shown beneath the question. */
  intro: text("intro").notNull().default(""),
});

export const eventDetails = sqliteTable("event_details", {
  entityId: entityRef(),
  /** Human date, e.g. "18 March – 28 May 1871". */
  dateLabel: text("date_label"),
  place: text("place"),
  eventType: text("event_type").notNull().default("movement"),
});

export const pathDetails = sqliteTable("path_details", {
  entityId: entityRef(),
  /** The first-person entry line, e.g. "I've never read Marx." */
  entryLine: text("entry_line").notNull().default(""),
  level: text("level").notNull().default("introductory"),
  estimatedTime: text("estimated_time"),
});

export const pathSteps = sqliteTable(
  "path_steps",
  {
    id: text("id").primaryKey(),
    pathId: text("path_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    entityId: text("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    /** Why this step is here, in the context of this path. */
    framing: text("framing").notNull().default(""),
  },
  (t) => [index("path_steps_path").on(t.pathId, t.position)],
);

/* -------------------------------------------------------------------------- */
/* Debates                                                                     */
/* -------------------------------------------------------------------------- */

export const debatePositions = sqliteTable(
  "debate_positions",
  {
    id: text("id").primaryKey(),
    debateId: text("debate_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    /** The thinker or tendency holding the position (optional). */
    holderId: text("holder_id").references(() => entities.id, { onDelete: "set null" }),
    label: text("label").notNull(),
    centralClaim: text("central_claim").notNull().default(""),
    summary: text("summary").notNull().default(""),
    /** JSON string arrays. */
    assumptions: text("assumptions").notNull().default("[]"),
    criticisms: text("criticisms").notNull().default("[]"),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("debate_positions_debate").on(t.debateId, t.position)],
);

/** Propositions are the axes along which positions are compared. */
export const debatePropositions = sqliteTable(
  "debate_propositions",
  {
    id: text("id").primaryKey(),
    debateId: text("debate_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    statement: text("statement").notNull(),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("debate_propositions_debate").on(t.debateId, t.position)],
);

export const positionStances = sqliteTable(
  "position_stances",
  {
    positionId: text("position_id")
      .notNull()
      .references(() => debatePositions.id, { onDelete: "cascade" }),
    propositionId: text("proposition_id")
      .notNull()
      .references(() => debatePropositions.id, { onDelete: "cascade" }),
    stance: text("stance").notNull(), // Stance
    note: text("note").notNull().default(""),
  },
  (t) => [primaryKey({ columns: [t.positionId, t.propositionId] })],
);

/** Texts and concepts a position relies on. */
export const positionLinks = sqliteTable(
  "position_links",
  {
    positionId: text("position_id")
      .notNull()
      .references(() => debatePositions.id, { onDelete: "cascade" }),
    entityId: text("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.positionId, t.entityId] })],
);

export const debateArguments = sqliteTable(
  "debate_arguments",
  {
    id: text("id").primaryKey(),
    debateId: text("debate_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    positionId: text("position_id").references(() => debatePositions.id, {
      onDelete: "set null",
    }),
    kind: text("kind").notNull().default("argument"), // ArgumentKind
    /** A counterargument answers an argument. */
    respondsToId: text("responds_to_id"),
    body: text("body").notNull(),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("debate_arguments_debate").on(t.debateId, t.position)],
);

/* -------------------------------------------------------------------------- */
/* Relationships                                                               */
/* -------------------------------------------------------------------------- */

export const relationships = sqliteTable(
  "relationships",
  {
    id: text("id").primaryKey(),
    fromId: text("from_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    toId: text("to_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // RelationshipType (canonical only)
    /** Editorial gloss: "via The Poverty of Philosophy (1847)". */
    note: text("note").notNull().default(""),
    /** 1 (minor) – 3 (defining). Used for emphasis in graphs. */
    weight: integer("weight").notNull().default(2),
    sourceId: text("source_id").references(() => sources.id, { onDelete: "set null" }),
    locator: text("locator"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("relationships_unique").on(t.fromId, t.type, t.toId),
    index("relationships_from").on(t.fromId),
    index("relationships_to").on(t.toId),
  ],
);

/* -------------------------------------------------------------------------- */
/* Sources, citations, excerpts                                                */
/* -------------------------------------------------------------------------- */

export const sources = sqliteTable(
  "sources",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    author: text("author").notNull().default(""),
    /** Free-form so that "1867", "1932 [written 1844]" and "2017-05" all fit. */
    publicationDate: text("publication_date"),
    publisher: text("publisher"),
    url: text("url"),
    sourceType: text("source_type").notNull().default("SECONDARY"), // SourceType
    /** Default page / chapter for the source as a whole (citations can override). */
    locator: text("locator"),
    notes: text("notes").notNull().default(""),
    ...timestamps,
  },
  (t) => [index("sources_type").on(t.sourceType)],
);

export const citations = sqliteTable(
  "citations",
  {
    id: text("id").primaryKey(),
    entityId: text("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    sourceId: text("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),
    /** Page / chapter / section. */
    locator: text("locator"),
    /** Which part of the entry the citation supports, e.g. "overview", "deep". */
    field: text("field"),
    note: text("note").notNull().default(""),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("citations_entity").on(t.entityId), index("citations_source").on(t.sourceId)],
);

export const excerpts = sqliteTable(
  "excerpts",
  {
    id: text("id").primaryKey(),
    /** The entry the passage illustrates. */
    entityId: text("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    /** The text (entity) the passage is from, if catalogued. */
    textId: text("text_id").references(() => entities.id, { onDelete: "set null" }),
    sourceId: text("source_id").references(() => sources.id, { onDelete: "set null" }),
    /**
     * Quoted passage. May be empty: an excerpt can be a pointer to a passage
     * ("Capital I, ch. 1 §4") until a verified quotation is added.
     */
    body: text("body").notNull().default(""),
    locator: text("locator"),
    note: text("note").notNull().default(""),
    /** Has the wording been checked against the cited edition? */
    verified: integer("verified", { mode: "boolean" }).notNull().default(false),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("excerpts_entity").on(t.entityId)],
);

export type EntityRow = typeof entities.$inferSelect;
export type RelationshipRow = typeof relationships.$inferSelect;
export type SourceRow = typeof sources.$inferSelect;
export type CitationRow = typeof citations.$inferSelect;
export type ExcerptRow = typeof excerpts.$inferSelect;
