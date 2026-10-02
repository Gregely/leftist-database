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
 *   media ── entity_media (images attached to entities)
 *
 * Editorial layer (same canonical entities — no second content store):
 *   users ── sessions
 *   revisions        (versioned snapshots of an entity's content fields)
 *   editorial_notes  (internal feedback, never rendered publicly)
 *   audit_log        (who did what, when)
 *   slug_history     (old published slugs → redirects)
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
    /** Workflow status of the current edit cycle (WorkflowStatus). */
    status: text("status").notNull().default("draft"),
    /** Is a published version visible to the public? The only public-visibility switch. */
    live: integer("live", { mode: "boolean" }).notNull().default(false),
    /** Seeded demonstration record (labelled on the public site). */
    isSample: integer("is_sample", { mode: "boolean" }).notNull().default(false),
    authorId: text("author_id"),
    reviewerId: text("reviewer_id"),
    lastEditedBy: text("last_edited_by"),
    /** Incremented on every write; used for optimistic concurrency. */
    lockVersion: integer("lock_version").notNull().default(1),
    /** Latest revision number (revisions.version). */
    revision: integer("revision").notNull().default(0),
    /** Revision number currently live, if any. */
    publishedRevision: integer("published_revision"),
    publishedAt: text("published_at"),
    submittedAt: text("submitted_at"),
    /** A live entry has structural changes (relationships, citations…) waiting for its next publication. */
    stagedChanges: integer("staged_changes", { mode: "boolean" }).notNull().default(false),
    /** A live debate's or path's structure is being edited as a staged copy that replaces it on publication. */
    stagedStructure: integer("staged_structure", { mode: "boolean" }).notNull().default(false),
    /** Internal collection labels (JSON array), e.g. "Initial Marx Corpus". Never shown publicly. */
    editorialTags: text("editorial_tags").notNull().default("[]"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("entities_kind_slug").on(t.kind, t.slug),
    index("entities_kind").on(t.kind, t.sortOrder),
    index("entities_year").on(t.yearStart),
    index("entities_live").on(t.live, t.kind),
    index("entities_status").on(t.status),
    index("entities_author").on(t.authorId),
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
  /** Historical context of the life and work (markup). */
  context: text("context").notNull().default(""),
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
  /** Historical development of the concept (markup). */
  history: text("history").notNull().default(""),
  /** Rival interpretations (markup). */
  interpretations: text("interpretations").notNull().default(""),
  /** Criticisms of the concept (markup). */
  criticisms: text("criticisms").notNull().default(""),
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
  /** Recommended edition / translation, free text. */
  edition: text("edition"),
  /** Context of composition and reception (markup). */
  context: text("context").notNull().default(""),
});

export const tendencyDetails = sqliteTable("tendency_details", {
  entityId: entityRef(),
  color: text("color").notNull().default("ink"), // TendencyColor
  periodLabel: text("period_label"),
  context: text("context").notNull().default(""),
  criticisms: text("criticisms").notNull().default(""),
  legacy: text("legacy").notNull().default(""),
});

export const debateDetails = sqliteTable("debate_details", {
  entityId: entityRef(),
  /** Short framing shown beneath the question. */
  intro: text("intro").notNull().default(""),
  /** Historical context of the debate (markup). */
  context: text("context").notNull().default(""),
});

export const eventDetails = sqliteTable("event_details", {
  entityId: entityRef(),
  /** Human date, e.g. "18 March – 28 May 1871". */
  dateLabel: text("date_label"),
  place: text("place"),
  eventType: text("event_type").notNull().default("movement"),
  /** Historical significance (markup). */
  significance: text("significance").notNull().default(""),
});

export const pathDetails = sqliteTable("path_details", {
  entityId: entityRef(),
  /** The first-person entry line, e.g. "I've never read Marx." */
  entryLine: text("entry_line").notNull().default(""),
  level: text("level").notNull().default("introductory"),
  estimatedTime: text("estimated_time"),
  /** What a reader should know first (markup). */
  prerequisites: text("prerequisites").notNull().default(""),
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
    /** "main" route, a "branch" off a main stop, or an "alternative" to one. */
    track: text("track").notNull().default("main"),
    /** For branches and alternatives: the main-route stop they leave from. */
    parentStepId: text("parent_step_id"),
    /** Set while this row waits for the publication of the named (live) entry; null when public-eligible. */
    stagedFor: text("staged_for"),
    /** For a staged copy: the live row it was copied from. */
    originId: text("origin_id"),
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
    /** Set while this row waits for the publication of the named (live) entry; null when public-eligible. */
    stagedFor: text("staged_for"),
    /** For a staged copy: the live row it was copied from. */
    originId: text("origin_id"),
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
    /** Set while this row waits for the publication of the named (live) entry; null when public-eligible. */
    stagedFor: text("staged_for"),
    /** For a staged copy: the live row it was copied from. */
    originId: text("origin_id"),
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
    /** Set while this row waits for the publication of the named (live) entry; null when public-eligible. */
    stagedFor: text("staged_for"),
    /** For a staged copy: the live row it was copied from. */
    originId: text("origin_id"),
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
    /** When the relation held, if it matters (e.g. a polemic of 1847). */
    yearStart: integer("year_start"),
    yearEnd: integer("year_end"),
    /** Longer editorial context for the claim. */
    context: text("context").notNull().default(""),
    createdBy: text("created_by"),
    /** Set while this row waits for the publication of the named (live) entry; null when public-eligible. */
    stagedFor: text("staged_for"),
    ...timestamps,
  },
  (t) => [
    // One public relationship per (from, type, to); a staged one may wait to replace it.
    uniqueIndex("relationships_unique").on(t.fromId, t.type, t.toId).where(sql`staged_for IS NULL`),
    uniqueIndex("relationships_staged_unique").on(t.fromId, t.type, t.toId, t.stagedFor).where(sql`staged_for IS NOT NULL`),
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
    edition: text("edition"),
    translator: text("translator"),
    editors: text("editors"),
    place: text("place"),
    /** Journal, collection or book containing the item. */
    containerTitle: text("container_title"),
    isbn: text("isbn"),
    createdBy: text("created_by"),
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
    /** Set while this row waits for the publication of the named (live) entry; null when public-eligible. */
    stagedFor: text("staged_for"),
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
    /** Has the wording been checked against the cited edition? (ExcerptVerification) */
    verification: text("verification").notNull().default("unverified"),
    /** Who said or wrote the passage, if catalogued (usually a thinker). */
    speakerId: text("speaker_id").references(() => entities.id, { onDelete: "set null" }),
    position: integer("position").notNull().default(0),
    /** Set while this row waits for the publication of the named (live) entry; null when public-eligible. */
    stagedFor: text("staged_for"),

    createdBy: text("created_by"),
  },
  (t) => [index("excerpts_entity").on(t.entityId)],
);

/* -------------------------------------------------------------------------- */
/* Media                                                                       */
/* -------------------------------------------------------------------------- */

export const media = sqliteTable(
  "media",
  {
    id: text("id").primaryKey(),
    /** SHA-256 of the file contents — identical uploads are stored once. */
    sha256: text("sha256").notNull(),
    fileName: text("file_name").notNull(),
    originalName: text("original_name").notNull().default(""),
    mimeType: text("mime_type").notNull(),
    size: integer("size").notNull(),
    width: integer("width"),
    height: integer("height"),
    title: text("title").notNull().default(""),
    description: text("description").notNull().default(""),
    caption: text("caption").notNull().default(""),
    altText: text("alt_text").notNull().default(""),
    creator: text("creator").notNull().default(""),
    credit: text("credit").notNull().default(""),
    /** Where it came from: archive, collection, URL. */
    sourceText: text("source_text").notNull().default(""),
    sourceId: text("source_id").references(() => sources.id, { onDelete: "set null" }),
    license: text("license").notNull().default(""),
    rights: text("rights").notNull().default(""),
    year: integer("year"),
    tags: text("tags").notNull().default("[]"),
    uploadedBy: text("uploaded_by"),
    ...timestamps,
  },
  (t) => [uniqueIndex("media_sha").on(t.sha256)],
);

export const entityMedia = sqliteTable(
  "entity_media",
  {
    id: text("id").primaryKey(),
    entityId: text("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    mediaId: text("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("figure"), // MediaRole
    /** Overrides the media caption in this context. */
    caption: text("caption").notNull().default(""),
    position: integer("position").notNull().default(0),
    /** Set while this row waits for the publication of the named (live) entry; null when public-eligible. */
    stagedFor: text("staged_for"),
  },
  (t) => [uniqueIndex("entity_media_unique").on(t.entityId, t.mediaId, t.role), index("entity_media_media").on(t.mediaId)],
);

/* -------------------------------------------------------------------------- */
/* Editorial layer                                                             */
/* -------------------------------------------------------------------------- */

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    role: text("role").notNull().default("contributor"), // Role
    /** scrypt$N$r$p$salt$hash */
    passwordHash: text("password_hash").notNull(),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    lastLoginAt: text("last_login_at"),
    ...timestamps,
  },
  (t) => [uniqueIndex("users_email").on(t.email)],
);

export const sessions = sqliteTable(
  "sessions",
  {
    /** SHA-256 of the session token; the token itself only lives in the cookie. */
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: text("expires_at").notNull(),
    createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => [index("sessions_user").on(t.userId)],
);

export const revisions = sqliteTable(
  "revisions",
  {
    id: text("id").primaryKey(),
    entityId: text("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    /** JSON: { entity: {...content fields}, details: {...} } */
    snapshot: text("snapshot").notNull(),
    /** JSON array of field names changed relative to the previous revision. */
    changedFields: text("changed_fields").notNull().default("[]"),
    message: text("message").notNull().default(""),
    /** Workflow status when the revision was recorded. */
    status: text("status").notNull(),
    authorId: text("author_id"),
    /** A sealed revision is never amended by autosave (submitted, published, restored, or messaged). */
    sealed: integer("sealed", { mode: "boolean" }).notNull().default(false),
    ...timestamps,
  },
  (t) => [uniqueIndex("revisions_entity_version").on(t.entityId, t.version)],
);

export const editorialNotes = sqliteTable(
  "editorial_notes",
  {
    id: text("id").primaryKey(),
    entityId: text("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    authorId: text("author_id"),
    /** note | revision_request | approval | rejection | reply */
    kind: text("kind").notNull().default("note"),
    /** The field the note concerns, if any. */
    field: text("field"),
    /** The passage the note concerns, if any. */
    quote: text("quote"),
    body: text("body").notNull(),
    resolved: integer("resolved", { mode: "boolean" }).notNull().default(false),
    resolvedBy: text("resolved_by"),
    resolvedAt: text("resolved_at"),
    revision: integer("revision"),
    createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => [index("editorial_notes_entity").on(t.entityId)],
);

export const auditLog = sqliteTable(
  "audit_log",
  {
    id: text("id").primaryKey(),
    actorId: text("actor_id"),
    action: text("action").notNull(),
    /** entity | relationship | source | media | user | session */
    targetType: text("target_type").notNull(),
    targetId: text("target_id"),
    /** Human label captured at the time (survives deletion). */
    targetLabel: text("target_label").notNull().default(""),
    metadata: text("metadata").notNull().default("{}"),
    createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => [index("audit_created").on(t.createdAt), index("audit_target").on(t.targetId), index("audit_actor").on(t.actorId)],
);

export const slugHistory = sqliteTable(
  "slug_history",
  {
    kind: text("kind").notNull(),
    slug: text("slug").notNull(),
    entityId: text("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => [primaryKey({ columns: [t.kind, t.slug] })],
);

export type EntityRow = typeof entities.$inferSelect;
export type RelationshipRow = typeof relationships.$inferSelect;
export type SourceRow = typeof sources.$inferSelect;
export type CitationRow = typeof citations.$inferSelect;
export type ExcerptRow = typeof excerpts.$inferSelect;
export type MediaRow = typeof media.$inferSelect;
export type UserRow = typeof users.$inferSelect;
export type RevisionRow = typeof revisions.$inferSelect;
