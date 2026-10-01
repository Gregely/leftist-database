/**
 * Field definitions for the editorial desk. Forms, validation and persistence
 * are all driven from here: adding a field to a kind means adding it to the
 * schema (src/lib/db/schema.ts), a migration, and one line below.
 */
import {
  ENTRY_STATUSES,
  EVENT_TYPES,
  PATH_LEVELS,
  TENDENCY_COLORS,
  TEXT_FORMS,
  type EntityKind,
} from "@/lib/content/model";

export type FieldType = "text" | "textarea" | "markup" | "number" | "select" | "checkbox" | "list" | "url";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  /** Stored on `entities` (shared) or on the kind's detail table. */
  store: "entity" | "details";
  required?: boolean;
  options?: readonly string[];
  help?: string;
  rows?: number;
  /** Layout hint for the form grid. */
  width?: "full" | "half" | "third";
}

const MARKUP_HELP = "Atlas markup: **bold**, *italic*, [[concept:alienation]] cross-references, [cite:source_id, p. 12] footnotes.";

export const COMMON_FIELDS: FieldDef[] = [
  { name: "title", label: "Title", type: "text", store: "entity", required: true, width: "half" },
  { name: "slug", label: "Slug", type: "text", store: "entity", width: "half", help: "URL name. Leave blank to generate from the title." },
  { name: "subtitle", label: "Subtitle", type: "text", store: "entity", width: "half", help: "Life dates, alternative title…" },
  { name: "status", label: "Status", type: "select", store: "entity", options: ENTRY_STATUSES, width: "third", help: "Drafts and entries in review are hidden from the public site." },
  { name: "featured", label: "Featured", type: "checkbox", store: "entity", width: "third" },
  { name: "summary", label: "Summary", type: "textarea", store: "entity", rows: 3, required: true, help: "One or two sentences, used in previews, maps and search." },
  { name: "yearStart", label: "Year (start)", type: "number", store: "entity", width: "third", help: "Birth, publication, start." },
  { name: "yearEnd", label: "Year (end)", type: "number", store: "entity", width: "third", help: "Death, end. Blank if ongoing." },
  { name: "sortOrder", label: "Sort order", type: "number", store: "entity", width: "third" },
  { name: "aliases", label: "Aliases", type: "list", store: "entity", help: "One per line: other names, spellings and translations (searchable)." },
  { name: "body", label: "Overview", type: "markup", store: "entity", rows: 10, help: MARKUP_HELP },
];

export const KIND_FIELDS: Record<EntityKind, FieldDef[]> = {
  thinker: [
    { name: "roles", label: "Roles", type: "text", store: "details", help: "e.g. German philosopher, economist and revolutionary" },
    { name: "birthPlace", label: "Birthplace", type: "text", store: "details", width: "half" },
    { name: "deathPlace", label: "Place of death", type: "text", store: "details", width: "half" },
    { name: "legacy", label: "Legacy", type: "markup", store: "details", rows: 6, help: MARKUP_HELP },
  ],
  concept: [
    { name: "brief", label: "30 seconds", type: "markup", store: "details", rows: 3, help: "Plain language, no jargon." },
    { name: "standard", label: "5 minutes", type: "markup", store: "details", rows: 10, help: MARKUP_HELP },
    { name: "deep", label: "Deep dive", type: "markup", store: "details", rows: 12, help: MARKUP_HELP },
  ],
  text: [
    { name: "originalTitle", label: "Original title", type: "text", store: "details", width: "half" },
    { name: "language", label: "Language", type: "text", store: "details", width: "half" },
    { name: "form", label: "Form", type: "select", store: "details", options: TEXT_FORMS, width: "third" },
    { name: "difficulty", label: "Difficulty (1–3)", type: "select", store: "details", options: ["1", "2", "3"], width: "third" },
    { name: "readingUrl", label: "Reading copy URL", type: "url", store: "details", width: "third" },
    { name: "publicationNote", label: "Publication note", type: "text", store: "details", help: "e.g. Written 1845–46; first published 1932" },
  ],
  tendency: [
    { name: "color", label: "Map colour", type: "select", store: "details", options: TENDENCY_COLORS, width: "half" },
    { name: "periodLabel", label: "Period label", type: "text", store: "details", width: "half", help: "e.g. 1840s –" },
  ],
  debate: [{ name: "intro", label: "Introduction", type: "textarea", store: "details", rows: 3, help: "Framing shown under the question." }],
  event: [
    { name: "dateLabel", label: "Date label", type: "text", store: "details", width: "third", help: "e.g. 18 March – 28 May 1871" },
    { name: "place", label: "Place", type: "text", store: "details", width: "third" },
    { name: "eventType", label: "Type", type: "select", store: "details", options: EVENT_TYPES, width: "third" },
  ],
  path: [
    { name: "entryLine", label: "Entry line", type: "text", store: "details", help: "First person: “I've never read Marx.”" },
    { name: "level", label: "Level", type: "select", store: "details", options: PATH_LEVELS, width: "half" },
    { name: "estimatedTime", label: "Estimated time", type: "text", store: "details", width: "half" },
  ],
};

export function fieldsFor(kind: EntityKind): FieldDef[] {
  return [...COMMON_FIELDS, ...KIND_FIELDS[kind]];
}
