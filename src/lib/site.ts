import type { EntityKind } from "./content/model";

/**
 * Site identity. The working name lives here and only here: change
 * `name` and every wordmark, title and meta tag follows.
 */
export const SITE = {
  /** Rendered as "Theory" (serif italic) + "ATLAS" (condensed capitals). */
  name: ["Theory", "Atlas"] as const,
  tagline: "A map of socialist thought",
  description:
    "A living map of socialist thought — the ideas, thinkers, texts, tendencies and debates that shaped the modern left, and the relationships between them.",
  edition: "Working edition 0.1",
  year: 2026,
};

export const siteTitle = SITE.name.join(" ");

/**
 * Bookcloth colours: each area of the collection has one, used as a small
 * mark beside its name (as a publisher's series colours its spines).
 * Values are CSS colour tokens from globals.css.
 */
export const KIND_TONE: Record<EntityKind, string> = {
  thinker: "var(--color-ink)",
  concept: "var(--color-red)",
  text: "var(--color-blue)",
  debate: "var(--color-red-deep)",
  tendency: "var(--color-olive)",
  event: "var(--color-umber)",
  path: "var(--color-ochre)",
};

/** The areas of the collection, in reading order. Navigation, the homepage contents and the footer all read this. */
export const SECTIONS = [
  { key: "thinkers", label: "Thinkers", short: "Thinkers", href: "/thinkers", tone: KIND_TONE.thinker },
  { key: "concepts", label: "Concepts", short: "Concepts", href: "/concepts", tone: KIND_TONE.concept },
  { key: "texts", label: "Texts", short: "Texts", href: "/texts", tone: KIND_TONE.text },
  { key: "debates", label: "Debates", short: "Debates", href: "/debates", tone: KIND_TONE.debate },
  { key: "tendencies", label: "Tendencies", short: "Tendencies", href: "/tendencies", tone: KIND_TONE.tendency },
  { key: "timeline", label: "Timeline", short: "Timeline", href: "/timeline", tone: KIND_TONE.event },
  { key: "map", label: "Theory Map", short: "Map", href: "/map", tone: "var(--color-ink)" },
  { key: "geography", label: "Geography", short: "Geography", href: "/geography", tone: "var(--color-blue)" },
  { key: "explore", label: "Explore", short: "Explore", href: "/explore", tone: "var(--color-faint)" },
] as const;

/** Explore: the gateway to the whole collection, and the parent of every section below. */
export const EXPLORE = SECTIONS.find((s) => s.key === "explore")!;

/** The collection's contents, in reading order — what Explore leads into. */
export const COLLECTION = SECTIONS.filter((s) => s.key !== "explore");

/** Primary navigation: Guided on its own; then Explore, followed by its contents. */
export const NAV = [{ label: "Guided", href: "/guided" }, { label: EXPLORE.label, href: EXPLORE.href }, ...COLLECTION.map((s) => ({ label: s.label, href: s.href }))] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];
const section = (key: SectionKey) => SECTIONS.find((s) => s.key === key)!;

/**
 * Explore's menu: the collection in two groups, then two reference pages.
 * The masthead's dropdown and the phone sheet both read this; a new section
 * joins a group here.
 */
export const EXPLORE_GROUPS = [
  { key: "library", label: "Library", items: (["thinkers", "concepts", "texts", "debates", "tendencies"] as const).map(section) },
  { key: "maps", label: "Maps & time", items: (["timeline", "map", "geography"] as const).map(section) },
] as const;

/** Reference pages that belong to the collection, listed quietly under Explore's groups. */
export const EXPLORE_MORE = [
  { label: "Learning paths", href: "/paths" },
  { label: "Sources", href: "/sources" },
] as const;

/** Further pages listed in the index sheet and the footer. */
export const MORE = [
  { label: "Learning paths", href: "/paths" },
  { label: "Sources & bibliography", href: "/sources" },
  { label: "About this edition", href: "/about" },
] as const;

/** Periods used to browse by time. Kept as configuration so editors can tune the boundaries. */
export const PERIODS = [
  { slug: "age-of-revolution", label: "The age of revolution", from: 1780, to: 1847, note: "From the French Revolution to the eve of 1848." },
  { slug: "1848-to-the-commune", label: "1848 to the Commune", from: 1848, to: 1871, note: "Revolution, defeat, and the First International." },
  { slug: "second-international", label: "The Second International", from: 1872, to: 1913, note: "Mass parties, revisionism and the anarchist turn." },
  { slug: "war-and-revolution", label: "War and revolution", from: 1914, to: 1945, note: "1914, 1917, fascism and the Spanish Revolution." },
  { slug: "decolonisation-new-left", label: "Decolonisation & New Left", from: 1946, to: 1989, note: "Liberation movements, 1968, feminism, ecology." },
  { slug: "after-1989", label: "After 1989", from: 1990, to: 2030, note: "After the Wall: new movements, new crises." },
] as const;
