/**
 * Site identity. The working name lives here and only here: change
 * `name` and every wordmark, title and meta tag follows.
 */
export const SITE = {
  /** Rendered as THEORY / ATLAS — each part is one line of the stacked wordmark. */
  name: ["Theory", "Atlas"] as const,
  tagline: "A map of socialist thought",
  description:
    "A living map of socialist thought — the ideas, thinkers, texts, tendencies and debates that shaped the modern left, and the relationships between them.",
  edition: "Working edition 0.1",
  year: 2026,
};

export const siteTitle = SITE.name.join(" / ");

export const NAV = [
  { label: "Explore", href: "/explore" },
  { label: "Thinkers", href: "/thinkers" },
  { label: "Concepts", href: "/concepts" },
  { label: "Debates", href: "/debates" },
  { label: "Timeline", href: "/timeline" },
  { label: "Texts", href: "/texts" },
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
