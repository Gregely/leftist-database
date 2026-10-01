/**
 * Shapes used by the sample seed. References between records use stable
 * "kind:slug" keys (e.g. "thinker:marx") that the seeder resolves to ids.
 *
 * Every seeded entity is given status "sample": these records exist to
 * demonstrate the system, not as finished scholarship.
 */
import type {
  AnyRelationshipType,
  SourceType,
  Stance,
  TendencyColor,
} from "@/lib/content/model";

export type Ref = `${"thinker" | "concept" | "text" | "tendency" | "debate" | "event" | "path"}:${string}`;

interface SeedBase {
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  body?: string;
  aliases?: string[];
  yearStart?: number | null;
  yearEnd?: number | null;
  featured?: boolean;
  sortOrder?: number;
  citations?: SeedCitation[];
}

export interface SeedCitation {
  source: string; // source id
  locator?: string;
  field?: string;
  note?: string;
}

export interface SeedThinker extends SeedBase {
  roles: string;
  birthPlace?: string;
  deathPlace?: string;
  legacy?: string;
}

export interface SeedConcept extends SeedBase {
  brief: string;
  standard?: string;
  deep?: string;
}

export interface SeedText extends SeedBase {
  originalTitle?: string;
  language?: string;
  form: string;
  publicationNote?: string;
  difficulty?: 1 | 2 | 3;
  readingUrl?: string;
}

export interface SeedTendency extends SeedBase {
  color: TendencyColor;
  periodLabel?: string;
}

export interface SeedEvent extends SeedBase {
  dateLabel?: string;
  place?: string;
  eventType: string;
}

export interface SeedPosition {
  key: string;
  holder?: Ref;
  label: string;
  centralClaim: string;
  summary: string;
  assumptions?: string[];
  criticisms?: string[];
  links?: Ref[];
  /** Keyed by proposition key. */
  stances?: Record<string, Stance | [Stance, string]>;
}

export interface SeedArgument {
  key: string;
  position?: string; // position key
  kind: "argument" | "counterargument";
  respondsTo?: string; // argument key
  body: string;
}

export interface SeedDebate extends SeedBase {
  intro: string;
  propositions: { key: string; statement: string }[];
  positions: SeedPosition[];
  arguments?: SeedArgument[];
}

export interface SeedPath extends SeedBase {
  entryLine: string;
  level: "introductory" | "intermediate" | "advanced";
  estimatedTime?: string;
  steps: { ref: Ref; framing: string }[];
}

export interface SeedSource {
  id: string;
  title: string;
  author: string;
  publicationDate?: string;
  publisher?: string;
  url?: string;
  sourceType: SourceType;
  locator?: string;
  notes?: string;
}

export type SeedRelationship = [Ref, AnyRelationshipType, Ref, string?, (1 | 2 | 3)?];

export interface SeedExcerpt {
  entity: Ref;
  text?: Ref;
  source?: string;
  body: string;
  locator?: string;
  note?: string;
  verified?: boolean;
}
