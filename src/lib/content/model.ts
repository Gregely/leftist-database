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

/**
 * Workflow status of an entry's current edit cycle. Public visibility is a
 * separate flag (`entities.live`): a published entry that is being revised is
 * live *and* in, say, "draft" — the public keeps seeing the published version
 * until the new one is published.
 */
export const WORKFLOW_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "revision_requested",
  "resubmitted",
  "approved",
  "published",
  "unpublished",
  "archived",
  "rejected",
] as const;
export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];
/** @deprecated alias kept for older imports. */
export type EntryStatus = WorkflowStatus;

export const STATUS_LABELS: Record<WorkflowStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  revision_requested: "Revision requested",
  resubmitted: "Resubmitted",
  approved: "Approved",
  published: "Published",
  unpublished: "Unpublished",
  archived: "Archived",
  rejected: "Rejected",
};

/** Statuses that are waiting on a reviewer. */
export const REVIEW_QUEUE_STATUSES: WorkflowStatus[] = ["submitted", "resubmitted", "under_review"];

/* ------------------------------------------------------------------------ */
/* People                                                                    */
/* ------------------------------------------------------------------------ */

export const ROLES = ["contributor", "reviewer", "editor", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  contributor: "Contributor",
  reviewer: "Reviewer",
  editor: "Editor",
  admin: "Administrator",
};

/* ------------------------------------------------------------------------ */
/* Excerpts & media                                                          */
/* ------------------------------------------------------------------------ */

export const EXCERPT_VERIFICATION = ["verified", "unverified", "needs_review"] as const;
export type ExcerptVerification = (typeof EXCERPT_VERIFICATION)[number];
export const VERIFICATION_LABELS: Record<ExcerptVerification, string> = {
  verified: "Verified",
  unverified: "Unverified",
  needs_review: "Needs review",
};

export const MEDIA_ROLES = ["portrait", "photograph", "cover", "scan", "diagram", "figure"] as const;
export type MediaRole = (typeof MEDIA_ROLES)[number];

/* ------------------------------------------------------------------------ */
/* Geography                                                                 */
/* ------------------------------------------------------------------------ */

/**
 * What a place in the gazetteer is: a settlement (a town or city), a site
 * within one (a building, a street), a region, or a country or state. A
 * region or country is never drawn as if it were a point.
 */
export const PLACE_KINDS = ["settlement", "site", "region", "country"] as const;
export type PlaceKind = (typeof PLACE_KINDS)[number];
export const PLACE_KIND_LABELS: Record<PlaceKind, string> = { settlement: "Town or city", site: "Site", region: "Region", country: "Country or state" };

/**
 * How an entry is associated with a place. These are not interchangeable:
 * being born somewhere, living there in exile, organising there and
 * publishing there are different historical facts.
 *
 * `birth`, `death` and `event` come from fields already on the entries
 * (a thinker's birthplace and place of death, an event's location); the
 * others are recorded as place associations, with dates, a note and a source.
 */
export const PLACE_ROLES = ["birth", "death", "event", "residence", "exile", "activity", "writing", "publication", "influence"] as const;
export type PlaceRole = (typeof PLACE_ROLES)[number];
/** Roles that are recorded as associations (the rest are read from entry fields). */
export const RECORDED_PLACE_ROLES = ["residence", "exile", "activity", "writing", "publication", "influence"] as const satisfies readonly PlaceRole[];
export type RecordedPlaceRole = (typeof RECORDED_PLACE_ROLES)[number];

export const PLACE_ROLE_META: Record<PlaceRole, { label: string; verb: string; plural: string }> = {
  birth: { label: "Birthplace", verb: "born", plural: "Births" },
  death: { label: "Place of death", verb: "died", plural: "Deaths" },
  event: { label: "Event location", verb: "took place", plural: "Events" },
  residence: { label: "Residence", verb: "lived", plural: "Residence" },
  exile: { label: "Exile", verb: "in exile", plural: "Exile" },
  activity: { label: "Political activity", verb: "active", plural: "Political activity" },
  writing: { label: "Written", verb: "written", plural: "Writing" },
  publication: { label: "Publication", verb: "published", plural: "Publication" },
  influence: { label: "Regional influence", verb: "influential", plural: "Regional influence" },
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
  "EXTENDED",
  "EDITED",
  "CITES",
  "PARTICIPATED_IN",
  "CONTRASTS_WITH",
  "PRESUPPOSES",
] as const;
export type RelationshipType = (typeof CANONICAL_RELATIONSHIP_TYPES)[number];

export const INVERSE_ALIASES = {
  INFLUENCED_BY: "INFLUENCED",
  CRITIQUED_BY: "CRITIQUED",
  FOLLOWED_BY: "PRECEDES",
  EXTENDED_BY: "EXTENDED",
  EDITED_BY: "EDITED",
  CITED_BY: "CITES",
} as const satisfies Record<string, RelationshipType>;
export type RelationshipAlias = keyof typeof INVERSE_ALIASES;
export type AnyRelationshipType = RelationshipType | RelationshipAlias;

export const ALL_RELATIONSHIP_TYPES = [
  ...CANONICAL_RELATIONSHIP_TYPES,
  ...(Object.keys(INVERSE_ALIASES) as RelationshipAlias[]),
] as AnyRelationshipType[];

/** The phrase for a relationship type as offered to editors, including inverse aliases ("influenced by"). */
export function relationshipTypeLabel(t: AnyRelationshipType): string {
  if (t in INVERSE_ALIASES) return RELATIONSHIP_TYPES[INVERSE_ALIASES[t as RelationshipAlias]].inverseLabel;
  return RELATIONSHIP_TYPES[t as RelationshipType].label;
}

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
    label: "criticised",
    inverseLabel: "criticised by",
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
  EXTENDED: {
    type: "EXTENDED",
    label: "extended",
    inverseLabel: "extended by",
    symmetric: false,
    family: "influence",
    typicalFrom: ["thinker", "text", "tendency"],
    typicalTo: ["concept", "thinker", "text", "tendency"],
  },
  EDITED: {
    type: "EDITED",
    label: "edited",
    inverseLabel: "edited by",
    symmetric: false,
    family: "structure",
    typicalFrom: ["thinker"],
    typicalTo: ["text"],
  },
  CITES: {
    type: "CITES",
    label: "cites",
    inverseLabel: "cited by",
    symmetric: false,
    family: "structure",
    typicalFrom: ["text", "thinker"],
    typicalTo: ["text", "thinker"],
  },
  PARTICIPATED_IN: {
    type: "PARTICIPATED_IN",
    label: "participated in",
    inverseLabel: "participants include",
    symmetric: false,
    family: "affinity",
    typicalFrom: ["thinker", "tendency"],
    typicalTo: ["event"],
  },
  CONTRASTS_WITH: {
    type: "CONTRASTS_WITH",
    label: "contrasts with",
    inverseLabel: "contrasts with",
    symmetric: true,
    family: "critique",
    typicalFrom: ["concept", "tendency", "thinker"],
    typicalTo: ["concept", "tendency", "thinker"],
  },
  PRESUPPOSES: {
    type: "PRESUPPOSES",
    label: "builds on",
    inverseLabel: "is a prerequisite for",
    symmetric: false,
    family: "structure",
    typicalFrom: ["concept", "debate"],
    typicalTo: ["concept"],
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
