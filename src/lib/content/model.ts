/**
 * The domain model of the Atlas.
 *
 * Everything that can be explored — a thinker, a concept, a text, a tendency,
 * a debate, a historical event, a learning path — is an *entity*. Entities share
 * one id space so that relationships between any two of them are first-class,
 * typed, citable rows (see `RELATIONSHIP_TYPES`).
 *
 * This file is framework-free and safe to import from client components.
 */

export const ENTITY_KINDS = [
  "thinker",
  "concept",
  "text",
  "tendency",
  "debate",
  "event",
  "path",
] as const;
export type EntityKind = (typeof ENTITY_KINDS)[number];

export interface KindMeta {
  kind: EntityKind;
  label: string;
  plural: string;
  /** Public URL prefix. */
  base: string;
  /** Short prefix used when generating ids. */
  idPrefix: string;
  /** One-line description used on index pages. */
  blurb: string;
}

export const KINDS: Record<EntityKind, KindMeta> = {
  thinker: {
    kind: "thinker",
    label: "Thinker",
    plural: "Thinkers",
    base: "/thinkers",
    idPrefix: "th",
    blurb: "The people who wrote, organised, argued and disagreed.",
  },
  concept: {
    kind: "concept",
    label: "Concept",
    plural: "Concepts",
    base: "/concepts",
    idPrefix: "co",
    blurb: "The vocabulary of the left, from the elementary to the contested.",
  },
  text: {
    kind: "text",
    label: "Text",
    plural: "Texts",
    base: "/texts",
    idPrefix: "tx",
    blurb: "Books, pamphlets, notebooks and essays — primary works in the tradition.",
  },
  tendency: {
    kind: "tendency",
    label: "Tendency",
    plural: "Tendencies",
    base: "/tendencies",
    idPrefix: "td",
    blurb: "Schools, currents and traditions, with their shared commitments and splits.",
  },
  debate: {
    kind: "debate",
    label: "Debate",
    plural: "Debates",
    base: "/debates",
    idPrefix: "db",
    blurb: "The open questions, and how different traditions have answered them.",
  },
  event: {
    kind: "event",
    label: "Event",
    plural: "Events",
    base: "/timeline",
    idPrefix: "ev",
    blurb: "Revolutions, congresses, publications and turning points.",
  },
  path: {
    kind: "path",
    label: "Path",
    plural: "Learning paths",
    base: "/paths",
    idPrefix: "pa",
    blurb: "Routes through the material — followed in order, or abandoned at will.",
  },
};

export function entityHref(kind: EntityKind, slug: string): string {
  return `${KINDS[kind].base}/${slug}`;
}

export function isEntityKind(value: string): value is EntityKind {
  return (ENTITY_KINDS as readonly string[]).includes(value);
}

/* ------------------------------------------------------------------------ */
/* Editorial status                                                          */
/* ------------------------------------------------------------------------ */

export const ENTRY_STATUSES = ["sample", "draft", "review", "published"] as const;
export type EntryStatus = (typeof ENTRY_STATUSES)[number];

export const STATUS_LABELS: Record<EntryStatus, string> = {
  sample: "Sample entry",
  draft: "Draft",
  review: "In review",
  published: "Published",
};

/* ------------------------------------------------------------------------ */
/* Relationships                                                             */
/* ------------------------------------------------------------------------ */

/**
 * Relationship types. Only *canonical* types are stored. Inverse aliases
 * (e.g. INFLUENCED_BY) are accepted on input and normalised by swapping the
 * endpoints, so "Lenin INFLUENCED_BY Marx" is stored as "Marx INFLUENCED Lenin".
 */
export const CANONICAL_RELATIONSHIP_TYPES = [
  "INFLUENCED",
  "CRITIQUED",
  "RESPONDED_TO",
  "DEVELOPED",
  "REJECTED",
  "RELATED_TO",
  "MEMBER_OF",
  "ASSOCIATED_WITH",
  "WROTE",
  "DISCUSSES",
  "PRECEDES",
] as const;
export type RelationshipType = (typeof CANONICAL_RELATIONSHIP_TYPES)[number];

export const INVERSE_ALIASES = {
  INFLUENCED_BY: "INFLUENCED",
  CRITIQUED_BY: "CRITIQUED",
  FOLLOWED_BY: "PRECEDES",
} as const satisfies Record<string, RelationshipType>;
export type RelationshipAlias = keyof typeof INVERSE_ALIASES;
export type AnyRelationshipType = RelationshipType | RelationshipAlias;

export const ALL_RELATIONSHIP_TYPES = [
  ...CANONICAL_RELATIONSHIP_TYPES,
  ...(Object.keys(INVERSE_ALIASES) as RelationshipAlias[]),
] as AnyRelationshipType[];

/** Visual families used by graphs and lists. */
export type RelationshipFamily = "influence" | "critique" | "response" | "affinity" | "structure";

export interface RelationshipTypeMeta {
  type: RelationshipType;
  /** Reads forward: "{from} influenced {to}". */
  label: string;
  /** Reads backward: "{to} was influenced by {from}". */
  inverseLabel: string;
  symmetric: boolean;
  family: RelationshipFamily;
  /** Guidance for editors; not enforced as hard constraints. */
  typicalFrom: EntityKind[];
  typicalTo: EntityKind[];
}

export const RELATIONSHIP_TYPES: Record<RelationshipType, RelationshipTypeMeta> = {
  INFLUENCED: {
    type: "INFLUENCED",
    label: "influenced",
    inverseLabel: "influenced by",
    symmetric: false,
    family: "influence",
    typicalFrom: ["thinker", "text", "tendency", "event", "concept"],
    typicalTo: ["thinker", "text", "tendency", "event", "concept"],
  },
  CRITIQUED: {
    type: "CRITIQUED",
    label: "critiqued",
    inverseLabel: "critiqued by",
    symmetric: false,
    family: "critique",
    typicalFrom: ["thinker", "text", "tendency"],
    typicalTo: ["thinker", "text", "tendency", "concept"],
  },
  RESPONDED_TO: {
    type: "RESPONDED_TO",
    label: "responded to",
    inverseLabel: "drew a response from",
    symmetric: false,
    family: "response",
    typicalFrom: ["thinker", "text"],
    typicalTo: ["thinker", "text", "event"],
  },
  DEVELOPED: {
    type: "DEVELOPED",
    label: "developed",
    inverseLabel: "developed by",
    symmetric: false,
    family: "influence",
    typicalFrom: ["thinker", "text", "tendency"],
    typicalTo: ["concept"],
  },
  REJECTED: {
    type: "REJECTED",
    label: "rejected",
    inverseLabel: "rejected by",
    symmetric: false,
    family: "critique",
    typicalFrom: ["thinker", "tendency"],
    typicalTo: ["concept", "tendency"],
  },
  RELATED_TO: {
    type: "RELATED_TO",
    label: "related to",
    inverseLabel: "related to",
    symmetric: true,
    family: "affinity",
    typicalFrom: ["concept", "debate", "text"],
    typicalTo: ["concept", "debate", "text"],
  },
  MEMBER_OF: {
    type: "MEMBER_OF",
    label: "belongs to",
    inverseLabel: "includes",
    symmetric: false,
    family: "structure",
    typicalFrom: ["thinker"],
    typicalTo: ["tendency"],
  },
  ASSOCIATED_WITH: {
    type: "ASSOCIATED_WITH",
    label: "associated with",
    inverseLabel: "associated with",
    symmetric: true,
    family: "affinity",
    typicalFrom: ["thinker", "event", "tendency", "concept"],
    typicalTo: ["thinker", "event", "tendency", "concept"],
  },
  WROTE: {
    type: "WROTE",
    label: "wrote",
    inverseLabel: "written by",
    symmetric: false,
    family: "structure",
    typicalFrom: ["thinker"],
    typicalTo: ["text"],
  },
  DISCUSSES: {
    type: "DISCUSSES",
    label: "discusses",
    inverseLabel: "discussed in",
    symmetric: false,
    family: "structure",
    typicalFrom: ["text", "debate", "event"],
    typicalTo: ["concept", "thinker", "event"],
  },
  PRECEDES: {
    type: "PRECEDES",
    label: "precedes",
    inverseLabel: "follows",
    symmetric: false,
    family: "structure",
    typicalFrom: ["event", "text"],
    typicalTo: ["event", "text"],
  },
};

export function isRelationshipType(v: string): v is RelationshipType {
  return (CANONICAL_RELATIONSHIP_TYPES as readonly string[]).includes(v);
}

/** Normalise an incoming (possibly inverse) relationship into canonical form. */
export function normaliseRelationship(
  fromId: string,
  type: AnyRelationshipType,
  toId: string,
): { fromId: string; type: RelationshipType; toId: string } {
  if (type in INVERSE_ALIASES) {
    return { fromId: toId, type: INVERSE_ALIASES[type as RelationshipAlias], toId: fromId };
  }
  const canonical = type as RelationshipType;
  // Symmetric relations are stored with ids in a stable order to avoid duplicates.
  if (RELATIONSHIP_TYPES[canonical].symmetric && fromId > toId) {
    return { fromId: toId, type: canonical, toId: fromId };
  }
  return { fromId, type: canonical, toId };
}

/** Human-readable label for a relationship as seen from one of its endpoints. */
export function relationshipLabel(type: RelationshipType, direction: "out" | "in"): string {
  const meta = RELATIONSHIP_TYPES[type];
  return direction === "out" || meta.symmetric ? meta.label : meta.inverseLabel;
}

/* ------------------------------------------------------------------------ */
/* Sources                                                                   */
/* ------------------------------------------------------------------------ */

export const SOURCE_TYPES = [
  "PRIMARY",
  "SECONDARY",
  "ACADEMIC",
  "HISTORICAL",
  "REFERENCE",
  "CONTEMPORARY",
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  PRIMARY: "Primary text",
  SECONDARY: "Secondary literature",
  ACADEMIC: "Academic study",
  HISTORICAL: "Historical account",
  REFERENCE: "Reference work",
  CONTEMPORARY: "Contemporary writing",
};

/* ------------------------------------------------------------------------ */
/* Debates                                                                   */
/* ------------------------------------------------------------------------ */

export const STANCES = ["affirms", "qualified", "rejects", "silent"] as const;
export type Stance = (typeof STANCES)[number];

export const STANCE_LABELS: Record<Stance, string> = {
  affirms: "Affirms",
  qualified: "Qualified",
  rejects: "Rejects",
  silent: "Not addressed",
};

export const ARGUMENT_KINDS = ["argument", "counterargument"] as const;
export type ArgumentKind = (typeof ARGUMENT_KINDS)[number];

/* ------------------------------------------------------------------------ */
/* Kind-specific vocabularies                                                */
/* ------------------------------------------------------------------------ */

export const TEXT_FORMS = [
  "book",
  "pamphlet",
  "essay",
  "manuscript",
  "notebooks",
  "speech",
  "letter",
  "article",
] as const;

export const EVENT_TYPES = [
  "revolution",
  "uprising",
  "founding",
  "congress",
  "publication",
  "movement",
  "repression",
  "crisis",
  "war",
] as const;

export const PATH_LEVELS = ["introductory", "intermediate", "advanced"] as const;

/** Muted tendency palette — tokens resolved in CSS. */
export const TENDENCY_COLORS = ["red", "ink", "olive", "ochre", "deep", "beige"] as const;
export type TendencyColor = (typeof TENDENCY_COLORS)[number];

export const TENDENCY_COLOR_VALUES: Record<TendencyColor, string> = {
  red: "#B51F2A",
  deep: "#7E1720",
  ink: "#202020",
  olive: "#53624B",
  ochre: "#B18A47",
  beige: "#A79F8E",
};
