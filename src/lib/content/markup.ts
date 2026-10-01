/**
 * Atlas markup — a deliberately small extension of Markdown used for all
 * long-form fields. It is parsed to a tiny AST and rendered by
 * `components/editorial/Prose.tsx`.
 *
 *   Paragraphs            separated by a blank line
 *   > quotation           a block quotation
 *   - item                a list
 *   **strong**  *emphasis*
 *   [label](https://…)    external link
 *   [[concept:alienation]]            cross-reference to an entity
 *   [[thinker:marx|Marx's]]           …with a custom label
 *   [cite:src_capital_fowkes]         footnote to a source
 *   [cite:src_capital_fowkes, p. 125] …with a locator
 *
 * Cross-references and citations are what make prose part of the graph: the
 * renderer resolves them against the database, and editors never write URLs.
 */

export type Inline =
  | { t: "text"; v: string }
  | { t: "strong"; c: Inline[] }
  | { t: "em"; c: Inline[] }
  | { t: "link"; href: string; c: Inline[] }
  | { t: "ref"; kind: string; slug: string; label?: string }
  | { t: "cite"; source: string; locator?: string };

export type Block =
  | { t: "p"; c: Inline[] }
  | { t: "quote"; c: Inline[] }
  | { t: "list"; items: Inline[][] };

const INLINE_RE =
  /\[\[([a-z]+):([a-z0-9-]+)(?:\|([^\]]+))?\]\]|\[cite:([A-Za-z0-9_-]+)(?:,\s*([^\]]+))?\]|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*/g;

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of src.matchAll(INLINE_RE)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ t: "text", v: src.slice(last, i) });
    if (m[1]) out.push({ t: "ref", kind: m[1], slug: m[2], label: m[3]?.trim() });
    else if (m[4]) out.push({ t: "cite", source: m[4], locator: m[5]?.trim() });
    else if (m[6]) out.push({ t: "link", href: m[7], c: parseInline(m[6]) });
    else if (m[8]) out.push({ t: "strong", c: parseInline(m[8]) });
    else if (m[9]) out.push({ t: "em", c: parseInline(m[9]) });
    last = i + m[0].length;
  }
  if (last < src.length) out.push({ t: "text", v: src.slice(last) });
  return out;
}

export function parseBlocks(src: string | null | undefined): Block[] {
  if (!src) return [];
  return src
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): Block => {
      const lines = chunk.split("\n");
      if (lines.every((l) => l.startsWith(">"))) {
        return { t: "quote", c: parseInline(lines.map((l) => l.replace(/^>\s?/, "")).join(" ")) };
      }
      if (lines.every((l) => /^[-•]\s/.test(l))) {
        return { t: "list", items: lines.map((l) => parseInline(l.replace(/^[-•]\s+/, ""))) };
      }
      return { t: "p", c: parseInline(lines.join(" ")) };
    });
}

/** Plain text, for search indexing, meta descriptions and previews. */
export function stripMarkup(src: string | null | undefined): string {
  if (!src) return "";
  return src
    .replace(/\[\[[a-z]+:([a-z0-9-]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[[a-z]+:([a-z0-9-]+)\]\]/g, (_, slug: string) => slug.replace(/-/g, " "))
    .replace(/\[cite:[^\]]+\]/g, "")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/^[-•]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Every "kind:slug" cross-reference in a set of fields. */
export function extractRefs(...sources: (string | null | undefined)[]): { kind: string; slug: string }[] {
  const seen = new Map<string, { kind: string; slug: string }>();
  for (const s of sources) {
    if (!s) continue;
    for (const m of s.matchAll(/\[\[([a-z]+):([a-z0-9-]+)(?:\|[^\]]+)?\]\]/g)) {
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

export function citeKey(source: string, locator?: string | null): string {
  return `${source}|${locator ?? ""}`;
}
