import type { EntityKind, EntryStatus, RelationshipFamily, RelationshipType, SourceType, Stance } from "@/lib/content/model";

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
  status: EntryStatus;
  href: string;
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
  source: SourceRecord;
  locator: string | null;
  note: string;
  /** Inline marker (true) or entry-level citation (false). */
  inline: boolean;
}

/** Everything the Prose renderer needs to resolve references and footnotes. */
export interface ProseContext {
  refs: Record<string, { title: string; href: string; kind: EntityKind } | undefined>;
  /** "sourceId|locator" → footnote number. */
  notes: Record<string, number>;
}

export interface ExcerptRecord {
  id: string;
  body: string;
  locator: string | null;
  note: string;
  verified: boolean;
  text: EntitySummary | null;
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
