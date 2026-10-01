import type { EntityKind, ExcerptVerification, MediaRole, RelationshipFamily, RelationshipType, SourceType, Stance, WorkflowStatus } from "@/lib/content/model";

/** The minimal shape of any entity, used in lists, previews and graphs. */
export interface EntitySummary {
  id: string;
  kind: EntityKind;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string;
  yearStart: number | null;
  yearEnd: number | null;
  status: WorkflowStatus;
  /** Seeded demonstration record. */
  sample: boolean;
  href: string;
}

/**
 * Renders an entry's working copy instead of its live record — used only by
 * the authenticated editorial preview.
 */
export interface PreviewSpec {
  entityId: string;
  entity: Record<string, unknown>;
  details: Record<string, unknown>;
}

export interface PublicMedia {
  id: string;
  url: string;
  role: MediaRole;
  title: string;
  alt: string;
  caption: string;
  credit: string;
  creator: string;
  license: string;
  rights: string;
  year: number | null;
  width: number | null;
  height: number | null;
}

/** An entity seen through one of its relationships to another. */
export interface RelatedEntity extends EntitySummary {
  relationshipId: string;
  type: RelationshipType;
  direction: "out" | "in";
  /** Reads from the perspective of the entity being viewed. */
  label: string;
  family: RelationshipFamily;
  note: string;
  weight: number;
}

export interface SourceRecord {
  id: string;
  title: string;
  author: string;
  publicationDate: string | null;
  publisher: string | null;
  url: string | null;
  sourceType: SourceType;
  locator: string | null;
  notes: string;
}

export interface Note {
  n: number;
  /** Source citation… */
  source: SourceRecord | null;
  /** …or explanatory footnote text. */
  text: string | null;
  locator: string | null;
  note: string;
  /** Inline marker (true) or entry-level citation (false). */
  inline: boolean;
}

/** Everything the Prose renderer needs to resolve references and footnotes. */
export interface ProseContext {
  refs: Record<string, { title: string; href: string; kind: EntityKind } | undefined>;
  /** "sourceId|locator" (or "^text" for footnotes) → note number. */
  notes: Record<string, number>;
  /** Figures embedded in the prose. */
  media: Record<string, PublicMedia | undefined>;
  /** Excerpts embedded in the prose. */
  excerpts: Record<string, ExcerptRecord | undefined>;
}

export interface ExcerptRecord {
  id: string;
  body: string;
  locator: string | null;
  note: string;
  verification: ExcerptVerification;
  verified: boolean;
  text: EntitySummary | null;
  speaker: EntitySummary | null;
  source: SourceRecord | null;
}

export interface GraphNode {
  id: string;
  kind: EntityKind;
  title: string;
  subtitle: string | null;
  summary: string;
  href: string;
  yearStart: number | null;
  yearEnd: number | null;
  /** Tendency colour token, if any. */
  color: string | null;
  group: string | null;
  degree: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  family: RelationshipFamily;
  label: string;
  note: string;
  weight: number;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface StanceCell {
  stance: Stance;
  note: string;
}

export type { EntityKind, Stance };
