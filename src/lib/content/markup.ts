/**
 * Atlas markup — a deliberately small extension of Markdown used for every
 * long-form field. It is the canonical stored format: readable in diffs and
 * revision comparisons, indexable for search, and round-tripped losslessly by
 * the editorial rich-text editor (components/editorial-desk/rich-text).
 *
 * Blocks (separated by a blank line)
 *   Paragraph
 *   ## Heading / ### Subheading
 *   > quotation
 *   - bulleted item            1. numbered item
 *   :::note                    a callout (one paragraph)
 *   …
 *   :::
 *   [[figure:med_123|Caption]] an image from the media library
 *   [[excerpt:ex_123]]         an excerpt attached to the entry
 *
 * Inline
 *   **strong**  *emphasis*
 *   [label](https://…)                 external link
 *   [[concept:alienation]]             cross-reference to an entry
 *   [[thinker:marx|Marx's]]            …with a custom label
 *   [cite:src_capital_fowkes, p. 125]  numbered source footnote (locator optional)
 *   [^Explanatory note text]           numbered explanatory footnote
 */

export type Inline =
  | { t: "text"; v: string }
  | { t: "strong"; c: Inline[] }
  | { t: "em"; c: Inline[] }
  | { t: "link"; href: string; c: Inline[] }
  | { t: "ref"; kind: string; slug: string; label?: string }
  | { t: "cite"; source: string; locator?: string }
  | { t: "footnote"; text: string };

export type Block =
  | { t: "p"; c: Inline[] }
  | { t: "heading"; level: 2 | 3; c: Inline[] }
  | { t: "quote"; c: Inline[] }
  | { t: "list"; ordered: boolean; items: Inline[][] }
  | { t: "callout"; c: Inline[] }
  | { t: "figure"; id: string; caption: string }
  | { t: "excerpt"; id: string };

const INLINE_RE =
  /\[\[(?!figure:|excerpt:)([a-z]+):([a-z0-9-]+)(?:\|([^\]]+))?\]\]|\[cite:([A-Za-z0-9_-]+)(?:,\s*([^\]]+))?\]|\[\^([^\]]+)\]|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*/g;

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of src.matchAll(INLINE_RE)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ t: "text", v: src.slice(last, i) });
    if (m[1]) out.push({ t: "ref", kind: m[1], slug: m[2], label: m[3]?.trim() });
    else if (m[4]) out.push({ t: "cite", source: m[4], locator: m[5]?.trim() });
    else if (m[6]) out.push({ t: "footnote", text: m[6].trim() });
    else if (m[7]) out.push({ t: "link", href: m[8], c: parseInline(m[7]) });
    else if (m[9]) out.push({ t: "strong", c: parseInline(m[9]) });
    else if (m[10]) out.push({ t: "em", c: parseInline(m[10]) });
    last = i + m[0].length;
  }
  if (last < src.length) out.push({ t: "text", v: src.slice(last) });
  return out;
}

const FIGURE_RE = /^\[\[figure:([A-Za-z0-9_-]+)(?:\|([^\]]*))?\]\]$/;
const EXCERPT_RE = /^\[\[excerpt:([A-Za-z0-9_-]+)\]\]$/;

export function parseBlocks(src: string | null | undefined): Block[] {
  if (!src) return [];
  return src
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): Block => {
      const lines = chunk.split("\n");
      const fig = chunk.match(FIGURE_RE);
      if (fig) return { t: "figure", id: fig[1], caption: (fig[2] ?? "").trim() };
      const ex = chunk.match(EXCERPT_RE);
      if (ex) return { t: "excerpt", id: ex[1] };
      if (lines.length === 1 && /^#{2,3}\s/.test(chunk)) {
        const level = chunk.startsWith("###") ? 3 : 2;
        return { t: "heading", level, c: parseInline(chunk.replace(/^#{2,3}\s+/, "")) };
      }
      if (lines[0].startsWith(":::") && lines.length >= 2 && lines[lines.length - 1].trim() === ":::") {
        return { t: "callout", c: parseInline(lines.slice(1, -1).join(" ")) };
      }
      if (lines.every((l) => l.startsWith(">"))) {
        return { t: "quote", c: parseInline(lines.map((l) => l.replace(/^>\s?/, "")).join(" ")) };
      }
      if (lines.every((l) => /^[-•]\s/.test(l))) {
        return { t: "list", ordered: false, items: lines.map((l) => parseInline(l.replace(/^[-•]\s+/, ""))) };
      }
      if (lines.every((l) => /^\d+\.\s/.test(l))) {
        return { t: "list", ordered: true, items: lines.map((l) => parseInline(l.replace(/^\d+\.\s+/, ""))) };
      }
      return { t: "p", c: parseInline(lines.join(" ")) };
    });
}

/** Plain text, for search indexing, meta descriptions and previews. */
export function stripMarkup(src: string | null | undefined): string {
  if (!src) return "";
  return src
    .replace(/^\[\[(figure|excerpt):[^\]]*\]\]$/gm, "")
    .replace(/\[\[[a-z]+:([a-z0-9-]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[[a-z]+:([a-z0-9-]+)\]\]/g, (_, slug: string) => slug.replace(/-/g, " "))
    .replace(/\[cite:[^\]]+\]/g, "")
    .replace(/\[\^([^\]]+)\]/g, "")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^:::\w*$/gm, "")
    .replace(/^#{2,3}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^([-•]|\d+\.)\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Every "kind:slug" cross-reference in a set of fields. */
export function extractRefs(...sources: (string | null | undefined)[]): { kind: string; slug: string }[] {
  const seen = new Map<string, { kind: string; slug: string }>();
  for (const s of sources) {
    if (!s) continue;
    for (const m of s.matchAll(/\[\[(?!figure:|excerpt:)([a-z]+):([a-z0-9-]+)(?:\|[^\]]+)?\]\]/g)) {
      seen.set(`${m[1]}:${m[2]}`, { kind: m[1], slug: m[2] });
    }
  }
  return [...seen.values()];
}

/** Every citation marker, in reading order. */
export function extractCites(...sources: (string | null | undefined)[]): { source: string; locator?: string }[] {
  const out: { source: string; locator?: string }[] = [];
  for (const s of sources) {
    if (!s) continue;
    for (const m of s.matchAll(/\[cite:([A-Za-z0-9_-]+)(?:,\s*([^\]]+))?\]/g)) {
      out.push({ source: m[1], locator: m[2]?.trim() });
    }
  }
  return out;
}

/** Notes (source citations and explanatory footnotes) in reading order. */
export function extractNotes(
  ...sources: (string | null | undefined)[]
): ({ t: "cite"; source: string; locator?: string } | { t: "footnote"; text: string })[] {
  const out: ({ t: "cite"; source: string; locator?: string } | { t: "footnote"; text: string })[] = [];
  for (const s of sources) {
    if (!s) continue;
    for (const m of s.matchAll(/\[cite:([A-Za-z0-9_-]+)(?:,\s*([^\]]+))?\]|\[\^([^\]]+)\]/g)) {
      if (m[1]) out.push({ t: "cite", source: m[1], locator: m[2]?.trim() });
      else out.push({ t: "footnote", text: m[3].trim() });
    }
  }
  return out;
}

export function extractFigures(...sources: (string | null | undefined)[]): string[] {
  const ids = new Set<string>();
  for (const s of sources) for (const m of (s ?? "").matchAll(/^\[\[figure:([A-Za-z0-9_-]+)/gm)) ids.add(m[1]);
  return [...ids];
}

export function extractExcerptIds(...sources: (string | null | undefined)[]): string[] {
  const ids = new Set<string>();
  for (const s of sources) for (const m of (s ?? "").matchAll(/^\[\[excerpt:([A-Za-z0-9_-]+)\]\]/gm)) ids.add(m[1]);
  return [...ids];
}

export function citeKey(source: string, locator?: string | null): string {
  return `${source}|${locator ?? ""}`;
}

export const footnoteKey = (text: string) => `^${text}`;

/* -------------------------------------------------------------------------- */
/* Serialisation (used by the rich-text editor)                                */
/* -------------------------------------------------------------------------- */

const escapeText = (s: string) => s.replace(/\n+/g, " ");

export function serializeInline(nodes: Inline[]): string {
  return nodes
    .map((n) => {
      switch (n.t) {
        case "text":
          return escapeText(n.v);
        case "strong":
          return `**${serializeInline(n.c)}**`;
        case "em":
          return `*${serializeInline(n.c)}*`;
        case "link":
          return `[${serializeInline(n.c)}](${n.href})`;
        case "ref":
          return n.label ? `[[${n.kind}:${n.slug}|${n.label}]]` : `[[${n.kind}:${n.slug}]]`;
        case "cite":
          return n.locator ? `[cite:${n.source}, ${n.locator}]` : `[cite:${n.source}]`;
        case "footnote":
          return `[^${n.text.replace(/[\]\n]/g, " ")}]`;
      }
    })
    .join("");
}

export function serializeBlocks(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.t) {
        case "p":
          return serializeInline(b.c).trim();
        case "heading":
          return `${b.level === 2 ? "##" : "###"} ${serializeInline(b.c).trim()}`;
        case "quote":
          return `> ${serializeInline(b.c).trim()}`;
        case "list":
          return b.items.map((it, i) => `${b.ordered ? `${i + 1}.` : "-"} ${serializeInline(it).trim()}`).join("\n");
        case "callout":
          return `:::note\n${serializeInline(b.c).trim()}\n:::`;
        case "figure":
          return `[[figure:${b.id}${b.caption ? `|${b.caption.replace(/[\]\n]/g, " ")}` : ""}]]`;
        case "excerpt":
          return `[[excerpt:${b.id}]]`;
      }
    })
    .filter((s) => s.length > 0)
    .join("\n\n");
}
