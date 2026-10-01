/**
 * Field definitions for every entity kind. One table drives the editor forms,
 * revision snapshots, version comparison, validation and completeness.
 *
 * Adding an editable field: add the column to src/lib/db/schema.ts, run
 * `npm run db:generate`, add one line here, and (if it should be searchable)
 * include it in SELECT_DOCUMENTS in src/lib/db/search-index.ts.
 *
 * Safe to import on the client.
 */
import { EVENT_TYPES, PATH_LEVELS, TENDENCY_COLORS, TEXT_FORMS, type EntityKind } from "@/lib/content/model";

export type FieldType = "text" | "textarea" | "richtext" | "number" | "select" | "checkbox" | "list" | "url" | "slug";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  /** Column lives on `entities` (shared) or on the kind's detail table. */
  store: "entity" | "details";
  /** Editor section heading. */
  section: string;
  /** Needed before an entry can be published. */
  required?: boolean;
  options?: readonly string[];
  help?: string;
  placeholder?: string;
  width?: "full" | "half" | "third";
  /** Rich-text fields: a compact editor for short texts. */
  compact?: boolean;
}

export type FieldValues = Record<string, string | number | boolean | null>;

const title = (label = "Title", placeholder?: string): FieldDef => ({ name: "title", label, type: "text", store: "entity", section: "", required: true, width: "half", placeholder });
const slug: FieldDef = { name: "slug", label: "Slug", type: "slug", store: "entity", section: "", width: "half", help: "The address of the entry. Generated from the title; changing it after publication keeps a redirect." };
const subtitle = (help: string): FieldDef => ({ name: "subtitle", label: "Subtitle", type: "text", store: "entity", section: "", width: "half", help });
const summary: FieldDef = { name: "summary", label: "Summary", type: "textarea", store: "entity", section: "", required: true, help: "One or two plain sentences. Used in previews, maps, search results and the timeline." };
const aliases: FieldDef = { name: "aliases", label: "Other names", type: "list", store: "entity", section: "", help: "One per line: alternative names, spellings and translations. All are searchable." };
const years = (start: string, end: string, req = false): FieldDef[] => [
  { name: "yearStart", label: start, type: "number", store: "entity", section: "", width: "third", required: req },
  { name: "yearEnd", label: end, type: "number", store: "entity", section: "", width: "third" },
];
const body = (label: string, help?: string): FieldDef => ({ name: "body", label, type: "richtext", store: "entity", section: "", help });
const rich = (name: string, label: string, help?: string, compact?: boolean): FieldDef => ({ name, label, type: "richtext", store: "details", section: "", help, compact });
const curation: FieldDef[] = [
  { name: "featured", label: "Feature on the home page and maps", type: "checkbox", store: "entity", section: "Curation", width: "half" },
  { name: "sortOrder", label: "Editorial order", type: "number", store: "entity", section: "Curation", width: "third", help: "Lower comes first." },
];

function section(name: string, defs: FieldDef[]): FieldDef[] {
  return defs.map((d) => ({ ...d, section: name }));
}

export const KIND_FIELDS: Record<EntityKind, FieldDef[]> = {
  thinker: [
    ...section("Identity", [
      title("Name", "e.g. Rosa Luxemburg"),
      slug,
      ...years("Born", "Died", true),
      { name: "subtitle", label: "Dates as displayed", type: "text", store: "entity", section: "", width: "third", placeholder: "1871–1919" },
      { name: "roles", label: "Description", type: "text", store: "details", section: "", required: true, placeholder: "Polish-German Marxist theorist, economist and revolutionary" },
      { name: "birthPlace", label: "Place of birth", type: "text", store: "details", section: "", width: "half" },
      { name: "deathPlace", label: "Place of death", type: "text", store: "details", section: "", width: "half" },
      aliases,
    ]),
    ...section("Summary", [summary]),
    ...section("Biography", [body("Biography", "The overview shown at the top of the entry. Link people and ideas with Link entry; cite sources as you go.")]),
    ...section("Historical context", [rich("context", "Historical context")]),
    ...section("Legacy", [rich("legacy", "Legacy")]),
    ...curation,
  ],
  concept: [
    ...section("Definition", [title("Concept"), slug, aliases, summary, { name: "yearStart", label: "First theorised (year)", type: "number", store: "entity", section: "", width: "third" }]),
    ...section("Explanations", [
      { ...rich("brief", "30 seconds", "Plain language, no jargon, one short paragraph.", true), required: true },
      rich("standard", "5 minutes", "Accessible but more detailed."),
      rich("deep", "Deep dive", "The theoretical treatment and its controversies."),
    ]),
    ...section("Historical development", [rich("history", "Historical development")]),
    ...section("Interpretations & criticisms", [rich("interpretations", "Interpretations"), rich("criticisms", "Criticisms")]),
    ...curation,
  ],
  text: [
    ...section("Bibliographic", [
      title("Title"),
      slug,
      subtitle("Subtitle or alternative title."),
      { name: "originalTitle", label: "Original title", type: "text", store: "details", section: "", width: "half" },
      { name: "language", label: "Language", type: "text", store: "details", section: "", width: "third" },
      { name: "form", label: "Form", type: "select", store: "details", section: "", options: TEXT_FORMS, width: "third" },
      ...years("First published", "Completed (if a span)", true),
      { name: "publicationNote", label: "Publication note", type: "text", store: "details", section: "", placeholder: "Written 1845–46; first published 1932" },
      { name: "edition", label: "Recommended edition", type: "text", store: "details", section: "", placeholder: "trans. Ben Fowkes, Penguin, 1976" },
      { name: "difficulty", label: "Difficulty", type: "select", store: "details", section: "", options: ["1", "2", "3"], width: "third", help: "1 accessible · 2 demanding · 3 specialist" },
      { name: "readingUrl", label: "Open-access copy", type: "url", store: "details", section: "", width: "half" },
      aliases,
    ]),
    ...section("Summary", [summary]),
    ...section("About the text", [body("About the text")]),
    ...section("Context", [rich("context", "Context of writing and reception")]),
    ...curation,
  ],
  tendency: [
    ...section("Definition", [
      title("Tendency"),
      slug,
      ...years("Emerged", "Ended (if it did)"),
      { name: "periodLabel", label: "Period label", type: "text", store: "details", section: "", width: "third", placeholder: "1840s –" },
      { name: "color", label: "Map colour", type: "select", store: "details", section: "", options: TENDENCY_COLORS, width: "third" },
      aliases,
      summary,
    ]),
    ...section("Overview", [body("Overview")]),
    ...section("Historical context", [rich("context", "Historical context")]),
    ...section("Criticisms", [rich("criticisms", "Criticisms")]),
    ...section("Legacy", [rich("legacy", "Legacy")]),
    ...curation,
  ],
  debate: [
    ...section("Question", [
      title("Central question", "e.g. What is the state?"),
      slug,
      summary,
      { name: "intro", label: "Introduction", type: "textarea", store: "details", section: "", required: true, help: "One or two sentences framing why traditions disagree." },
    ]),
    ...section("Context", [body("Background"), rich("context", "Historical context")]),
    ...curation,
  ],
  event: [
    ...section("Event", [
      title("Event"),
      slug,
      subtitle("e.g. the formal name of an organisation."),
      ...years("Year", "Ended", true),
      { name: "dateLabel", label: "Dates as displayed", type: "text", store: "details", section: "", width: "third", placeholder: "18 March – 28 May 1871" },
      { name: "place", label: "Location", type: "text", store: "details", section: "", width: "half" },
      { name: "eventType", label: "Type", type: "select", store: "details", section: "", options: EVENT_TYPES, width: "half" },
      summary,
    ]),
    ...section("Description", [body("Description")]),
    ...section("Historical significance", [rich("significance", "Historical significance")]),
    ...curation,
  ],
  path: [
    ...section("Path", [
      title("Title"),
      slug,
      { name: "entryLine", label: "Entry line", type: "text", store: "details", section: "", required: true, placeholder: "I've never read Marx." },
      { name: "level", label: "Difficulty", type: "select", store: "details", section: "", options: PATH_LEVELS, width: "half" },
      { name: "estimatedTime", label: "Estimated time", type: "text", store: "details", section: "", width: "half" },
      summary,
    ]),
    ...section("Prerequisites", [rich("prerequisites", "Before you start", undefined, true)]),
    ...curation,
  ],
};

export function fieldsFor(kind: EntityKind): FieldDef[] {
  return KIND_FIELDS[kind];
}

export function fieldSections(kind: EntityKind): { name: string; fields: FieldDef[] }[] {
  const out: { name: string; fields: FieldDef[] }[] = [];
  for (const f of KIND_FIELDS[kind]) {
    const s = out.find((x) => x.name === f.section);
    if (s) s.fields.push(f);
    else out.push({ name: f.section, fields: [f] });
  }
  return out;
}

export function fieldLabel(kind: EntityKind, name: string): string {
  return KIND_FIELDS[kind].find((f) => f.name === name)?.label ?? name;
}

/** Defaults for a new entry. */
export const KIND_DEFAULTS: Partial<Record<EntityKind, FieldValues>> = {
  text: { form: "book", difficulty: 2 },
  tendency: { color: "ink" },
  event: { eventType: "movement" },
  path: { level: "introductory" },
};
