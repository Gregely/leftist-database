/**
 * The format of a research corpus: plain, typed data that the importer
 * (./ingest.ts) writes into the Atlas through the editorial library — the
 * same code paths, validation, revisions, staging and audit trail as the desk.
 *
 * A corpus never publishes anything. Every entry it touches ends the import
 * awaiting human review.
 */
import type { AnyRelationshipType, EntityKind, ExcerptVerification, MediaRole, SourceType, Stance } from "@/lib/content/model";

/** `kind:slug`, e.g. "thinker:marx". Slugs are matched against existing entries (and their old slugs). */
export type EntityKey = `${EntityKind}:${string}`;

/** Why a human needs to look at something. Each becomes an internal editorial note. */
export type FlagType =
  | "missing-source"
  | "disputed"
  | "unverified-quotation"
  | "uncertain-relationship"
  | "incomplete-metadata"
  | "possible-duplicate"
  | "specialist-review"
  | "sample-overlap";

export interface Flag {
  type: FlagType;
  /** Field the note attaches to (e.g. "deep"), if any. */
  field?: string;
  note: string;
}

export interface CorpusSource {
  /** Stable id (`src_…`), cited in prose as [cite:id, locator]. */
  id: string;
  /**
   * Reuse an existing record as it is (e.g. a sample bibliography entry)
   * instead of creating one. Public source records are never modified by an import.
   */
  reuse?: boolean;
  title: string;
  author?: string;
  editors?: string;
  translator?: string;
  edition?: string;
  publicationDate?: string;
  publisher?: string;
  place?: string;
  containerTitle?: string;
  isbn?: string;
  url?: string;
  sourceType: SourceType;
  notes?: string;
  /** How the record should be checked: an online page, or a book looked up in a catalogue. */
  check?: { kind: "url"; expect: string } | { kind: "book"; title: string; author: string };
}

export interface CitationSpec {
  source: string;
  locator?: string;
  /** Which part of the entry it supports. */
  field?: string;
  note?: string;
}

export interface CorpusEntity {
  key: EntityKey;
  title: string;
  /** All content fields by editor field name (see lib/editorial/fields.ts). */
  fields: Record<string, string | number | boolean | null>;
  citations?: CitationSpec[];
  flags?: Flag[];
}

export interface CorpusRelationship {
  from: EntityKey;
  type: AnyRelationshipType;
  to: EntityKey;
  note: string;
  context?: string;
  source?: string;
  locator?: string;
  yearStart?: number;
  yearEnd?: number;
  weight?: 1 | 2 | 3;
  /** The entry whose publication releases the relationship (default: `from`). */
  on?: EntityKey;
  /** "interpretive": the relationship is a reading, not a documented fact. */
  basis?: "documented" | "interpretive";
  flag?: Flag;
}

export interface CorpusExcerpt {
  /** Stable key for idempotent imports and verification records. */
  key: string;
  entity: EntityKey;
  body: string;
  speaker?: EntityKey;
  text?: EntityKey;
  source: string;
  locator?: string;
  note?: string;
  /** The online transcription the wording is checked against. */
  archiveUrl: string;
}

export interface CorpusDebate {
  debate: EntityKey;
  propositions: { key: string; statement: string }[];
  positions: {
    key: string;
    label: string;
    holder?: EntityKey;
    centralClaim: string;
    summary: string;
    assumptions?: string[];
    criticisms?: string[];
    links?: EntityKey[];
    /** propositionKey → [stance, note] */
    stances: Record<string, [Stance, string]>;
  }[];
  arguments?: { key: string; position?: string; kind: "argument" | "counterargument"; respondsTo?: string; body: string }[];
}

export interface CorpusPath {
  path: EntityKey;
  steps: { entity: EntityKey; framing: string; branches?: { entity: EntityKey; framing: string; track?: "branch" | "alternative" }[] }[];
}

export interface CorpusMedia {
  key: string;
  /** File in the corpus media folder. */
  file: string;
  title: string;
  altText: string;
  caption: string;
  creator?: string;
  credit: string;
  sourceText: string;
  license: string;
  rights?: string;
  year?: string;
  tags?: string[];
  attach: { entity: EntityKey; role: MediaRole; caption?: string }[];
}

export interface CorpusBatch {
  id: string;
  title: string;
  sources?: CorpusSource[];
  entities?: CorpusEntity[];
  relationships?: CorpusRelationship[];
  excerpts?: CorpusExcerpt[];
  debates?: CorpusDebate[];
  paths?: CorpusPath[];
  media?: CorpusMedia[];
}

export interface Corpus {
  /** Editorial collection label applied to every entry the corpus touches. */
  collection: string;
  /** Folder (relative to the repository) holding media and verification records. */
  dir: string;
  /** Every entry the finished corpus will define, so earlier batches can link ahead. */
  planned?: EntityKey[];
  batches: CorpusBatch[];
}

/** Results of online checks, stored with the corpus so imports are reproducible offline. */
export interface VerificationRecord {
  checkedAt: string;
  quotes: Record<string, { url: string; status: number; matched: boolean; provenance?: string; detail?: string }>;
  sources: Record<string, { status: number | null; ok: boolean; detail: string }>;
}

export type { ExcerptVerification };
