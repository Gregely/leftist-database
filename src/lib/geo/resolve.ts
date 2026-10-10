/**
 * Resolving the place wordings already on entries — a thinker's birthplace,
 * an event's location — to places in the gazetteer.
 *
 * Only exact wordings resolve: a place lists the phrases that refer to it
 * (its name, other names, and wordings found in entries, e.g. "Trier,
 * Prussia"). A wording that names several places ("Brussels and London",
 * "London; Brussels; Paris; Cologne") resolves to each part that matches; a
 * comma-separated list ("Paris, Vienna, Berlin") only when it has three or
 * more items and every one is a town, so "Moscow, Russian Empire" or
 * "Deutz, Cologne" is never read as two places.
 * Nothing is guessed from part of a phrase, so "Newtown, Montgomeryshire" is
 * never taken for some other Newtown, and "Global" or a party's name stays
 * unlocated.
 */

export interface Resolvable {
  id: string;
  name: string;
  aliases: string[];
  matches: string[];
  kind?: string;
}

export const normalisePlace = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’']/g, "'")
    .replace(/\s*\([^)]*\)\s*/g, " ") // "Petrograd (1914–24)" → "Petrograd"
    .replace(/[^a-z0-9',;&-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function parseList(json: string | null | undefined): string[] {
  try {
    const v = JSON.parse(json ?? "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export class PlaceResolver {
  private index = new Map<string, string>();
  private points = new Set<string>();
  constructor(places: Resolvable[]) {
    for (const p of places) if (!p.kind || p.kind === "settlement") this.points.add(p.id);
    for (const p of places) for (const w of [p.name, ...p.aliases, ...p.matches]) {
      const k = normalisePlace(w);
      if (k && !this.index.has(k)) this.index.set(k, p.id);
    }
  }

  /** Place ids for a wording, in the order they are named; empty if nothing matches exactly. */
  resolve(text: string | null | undefined): string[] {
    if (!text?.trim()) return [];
    const whole = this.index.get(normalisePlace(text));
    if (whole) return [whole];
    const parts = text
      .split(/\s*;\s*|\s+and\s+|\s*&\s*/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length < 2 && !text.includes(",")) return [];
    const out: string[] = [];
    const add = (id: string) => out.includes(id) || out.push(id);
    for (const p of parts) {
      const id = this.index.get(normalisePlace(p));
      if (id) {
        if (parts.length > 1) add(id);
        continue;
      }
      const items = p.split(/\s*,\s*/).filter(Boolean);
      const ids = items.map((i) => this.index.get(normalisePlace(i)));
      if (items.length > 2 && ids.every((i): i is string => !!i && this.points.has(i))) ids.forEach(add);
    }
    return out;
  }
}
