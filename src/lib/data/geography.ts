import "server-only";
import { and, eq } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import { entities, entityPlaces, eventDetails, places, sources, thinkerDetails } from "@/lib/db/schema";
import { PLACE_ROLES, type EntityKind, type PlaceKind, type PlaceRole } from "@/lib/content/model";
import { parseList, PlaceResolver } from "@/lib/geo/resolve";
import { hrefFor, isPublic } from "./core";
import { stagedVisible } from "./scope";

/**
 * The Geography section's data: the gazetteer places that published entries
 * are associated with, and each association.
 *
 * Two kinds of association, kept apart because they are not interchangeable:
 *
 *  - from the entry's own fields: a thinker's birthplace and place of death,
 *    an event's location. These are matched to the gazetteer by exact
 *    wording only (see lib/geo/resolve.ts); a wording that matches nothing
 *    is left off the map, not guessed at.
 *  - recorded: residence, exile, political activity, where a text was
 *    written or published, a movement's regional influence. Each has its
 *    own dates, note and source, and is staged with the entry until it is
 *    published.
 */

export interface GeoPlace {
  id: string;
  slug: string;
  name: string;
  kind: PlaceKind;
  lat: number;
  lon: number;
  modernName: string;
  country: string;
  historicalNote: string;
  aliases: string[];
  wikidataId: string | null;
}

export interface GeoEntry {
  id: string;
  /** kind:slug, for addresses. */
  key: string;
  kind: EntityKind;
  title: string;
  subtitle: string | null;
  href: string;
  yearStart: number | null;
  yearEnd: number | null;
}

export interface GeoLink {
  id: string;
  entry: string;
  place: string;
  role: PlaceRole;
  /** The span the association covers; null when neither the association nor the entry is dated. */
  yearStart: number | null;
  yearEnd: number | null;
  /** True when it comes from the entry's own fields (birthplace, place of death, event location). */
  derived: boolean;
  /** For a derived association, the wording in the entry ("Trier, Prussia"). */
  wording: string | null;
  note: string | null;
  source: { title: string; href: string; locator: string | null } | null;
}

export interface Geography {
  places: GeoPlace[];
  entries: GeoEntry[];
  links: GeoLink[];
  /** First and last years any association covers. */
  years: [number, number];
  /** Wordings on published entries that the gazetteer does not (yet) locate. */
  unlocated: number;
}

export async function getGeography(): Promise<Geography> {
  const db = await ready();
  const [placeRows, thinkers, events, recorded] = await Promise.all([
    db.select().from(places),
    db
      .select({ e: entities, birth: thinkerDetails.birthPlace, death: thinkerDetails.deathPlace })
      .from(thinkerDetails)
      .innerJoin(entities, eq(entities.id, thinkerDetails.entityId))
      .where(isPublic()),
    db
      .select({ e: entities, place: eventDetails.place })
      .from(eventDetails)
      .innerJoin(entities, eq(entities.id, eventDetails.entityId))
      .where(isPublic()),
    db
      .select({ l: entityPlaces, e: entities, src: { id: sources.id, title: sources.title } })
      .from(entityPlaces)
      .innerJoin(entities, eq(entities.id, entityPlaces.entityId))
      .leftJoin(sources, eq(sources.id, entityPlaces.sourceId))
      .where(and(isPublic(), stagedVisible(entityPlaces.stagedFor))),
  ]);

  const resolver = new PlaceResolver(placeRows.map((p) => ({ id: p.id, name: p.name, kind: p.kind, aliases: parseList(p.aliases), matches: parseList(p.matches) })));
  const entries = new Map<string, GeoEntry>();
  const links: GeoLink[] = [];
  let unlocated = 0;
  const entry = (r: typeof entities.$inferSelect) => {
    if (!entries.has(r.id))
      entries.set(r.id, { id: r.id, key: `${r.kind}:${r.slug}`, kind: r.kind as EntityKind, title: r.title, subtitle: r.subtitle, href: hrefFor(r), yearStart: r.yearStart, yearEnd: r.yearEnd });
    return r.id;
  };
  const derive = (r: typeof entities.$inferSelect, role: "birth" | "death" | "event", text: string | null, y0: number | null, y1: number | null) => {
    if (!text?.trim()) return;
    const ids = resolver.resolve(text);
    if (!ids.length) unlocated++;
    for (const place of ids)
      links.push({ id: `${r.id}:${role}:${place}`, entry: entry(r), place, role, yearStart: y0, yearEnd: y1, derived: true, wording: text, note: null, source: null });
  };
  for (const { e, birth, death } of thinkers) {
    derive(e, "birth", birth, e.yearStart, e.yearStart);
    derive(e, "death", death, e.yearEnd, e.yearEnd);
  }
  for (const { e, place } of events) derive(e, "event", place, e.yearStart, e.yearEnd ?? e.yearStart);
  for (const { l, e, src } of recorded) {
    if (!(PLACE_ROLES as readonly string[]).includes(l.role)) continue;
    const y0 = l.yearStart ?? e.yearStart;
    links.push({
      id: l.id,
      entry: entry(e),
      place: l.placeId,
      role: l.role as PlaceRole,
      yearStart: y0,
      yearEnd: l.yearEnd ?? l.yearStart ?? e.yearEnd ?? y0,
      derived: false,
      wording: null,
      note: l.note || null,
      source: src?.id ? { title: src.title, href: `/sources/${src.id}`, locator: l.locator || null } : null,
    });
  }

  const used = new Set(links.map((l) => l.place));
  const placesOut: GeoPlace[] = placeRows
    .filter((p) => used.has(p.id))
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      kind: p.kind as PlaceKind,
      lat: p.lat,
      lon: p.lon,
      modernName: p.modernName,
      country: p.country,
      historicalNote: p.historicalNote,
      aliases: parseList(p.aliases),
      wikidataId: p.wikidataId,
    }));
  const ys = links.flatMap((l) => [l.yearStart, l.yearEnd]).filter((y): y is number => y != null);
  return {
    places: placesOut,
    entries: [...entries.values()],
    links,
    years: ys.length ? [Math.min(...ys), Math.max(...ys)] : [1800, 2000],
    unlocated,
  };
}

