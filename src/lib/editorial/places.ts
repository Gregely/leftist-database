import "server-only";
/**
 * The gazetteer: creating and editing places. Places are reference records,
 * like sources: whoever catalogues one may correct it, editors may correct
 * any. Coordinates must come from a named record (a Wikidata item, a
 * gazetteer) — the desk asks for it — never from a guess.
 */
import { asc, eq, like, or, sql } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { PLACE_KINDS, type PlaceKind } from "@/lib/content/model";
import { parseList, PlaceResolver } from "@/lib/geo/resolve";
import { newId } from "@/lib/util/id";
import { audit } from "./audit";
import { NotFoundError, ValidationError } from "./content";
import { assertCan, type Actor } from "./permissions";

export interface PlaceInput {
  name?: string;
  kind?: string;
  lat?: number | string;
  lon?: number | string;
  modernName?: string;
  country?: string;
  historicalNote?: string;
  /** One per line. */
  aliases?: string[] | string;
  matches?: string[] | string;
  wikidataId?: string;
  coordSource?: string;
}

const lines = (v: string[] | string | undefined) =>
  [...new Set((Array.isArray(v) ? v : (v ?? "").split("\n")).map((x) => x.trim()).filter(Boolean))];

export const slugifyPlace = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

function clean(f: PlaceInput) {
  const errors: Record<string, string> = {};
  const name = f.name?.trim() ?? "";
  if (!name) errors.name = "A name is required.";
  const kind = (f.kind ?? "settlement") as PlaceKind;
  if (!PLACE_KINDS.includes(kind)) errors.kind = "Choose what kind of place this is.";
  const lat = Number(f.lat);
  const lon = Number(f.lon);
  if (f.lat === "" || f.lat == null || !Number.isFinite(lat) || lat < -90 || lat > 90) errors.lat = "Latitude between −90 and 90.";
  if (f.lon === "" || f.lon == null || !Number.isFinite(lon) || lon < -180 || lon > 180) errors.lon = "Longitude between −180 and 180.";
  const wikidataId = f.wikidataId?.trim() || null;
  if (wikidataId && !/^Q\d+$/.test(wikidataId)) errors.wikidataId = "A Wikidata id looks like Q3138.";
  const coordSource = f.coordSource?.trim() ?? "";
  if (!wikidataId && !coordSource) errors.coordSource = "Say where the coordinates come from (a Wikidata item or another gazetteer).";
  if (Object.keys(errors).length) throw new ValidationError(errors);
  return {
    name,
    kind,
    lat: Math.round(lat * 1e5) / 1e5,
    lon: Math.round(lon * 1e5) / 1e5,
    modernName: f.modernName?.trim() ?? "",
    country: f.country?.trim() ?? "",
    historicalNote: f.historicalNote?.trim() ?? "",
    aliases: JSON.stringify(lines(f.aliases)),
    matches: JSON.stringify(lines(f.matches)),
    wikidataId,
    coordSource: coordSource || (wikidataId ? `Wikidata ${wikidataId}` : ""),
  };
}

/** Catalogue a place. `opts.id` gives it a stable id (used by imports); it must be unused. */
export async function createPlace(actor: Actor, f: PlaceInput, opts: { id?: string; slug?: string } = {}) {
  assertCan(actor, "place.create");
  const values = clean(f);
  const db = await ready();
  if (opts.id && !/^pl_[a-z0-9_-]{2,80}$/.test(opts.id)) throw new ValidationError({ id: "Place ids look like pl_name." });
  if (opts.id && (await db.select({ id: s.places.id }).from(s.places).where(eq(s.places.id, opts.id)).get())) {
    throw new ValidationError({ id: `A place with id ${opts.id} already exists.` });
  }
  let slug = opts.slug ?? slugifyPlace(values.name);
  if (!slug) slug = "place";
  for (let i = 2; await db.select({ id: s.places.id }).from(s.places).where(eq(s.places.slug, slug)).get(); i++) slug = `${slugifyPlace(values.name)}-${i}`;
  const id = opts.id ?? newId("pl");
  await db.insert(s.places).values({ id, slug, ...values, createdBy: actor.id });
  await audit(actor.id, "place_create", { type: "place", id, label: values.name }, { kind: values.kind, lat: values.lat, lon: values.lon, source: values.coordSource });
  return id;
}

export async function updatePlace(actor: Actor, id: string, f: PlaceInput) {
  const db = await ready();
  const row = await db.select().from(s.places).where(eq(s.places.id, id)).get();
  if (!row) throw new NotFoundError("Place not found.");
  assertCan(actor, "place.edit", undefined, row.createdBy);
  const values = clean(f);
  await db.update(s.places).set({ ...values, updatedAt: sql`(CURRENT_TIMESTAMP)` }).where(eq(s.places.id, id));
  const changed = (Object.keys(values) as (keyof typeof values)[]).filter((k) => String(values[k] ?? "") !== String(row[k] ?? ""));
  await audit(actor.id, "place_update", { type: "place", id, label: values.name }, { changed });
}

/** Remove a place that nothing refers to. */
export async function deletePlace(actor: Actor, id: string) {
  const db = await ready();
  const row = await db.select().from(s.places).where(eq(s.places.id, id)).get();
  if (!row) throw new NotFoundError("Place not found.");
  assertCan(actor, "place.edit", undefined, row.createdBy);
  const used = Number((await db.select({ n: sql<number>`count(*)` }).from(s.entityPlaces).where(eq(s.entityPlaces.placeId, id)).get())?.n ?? 0);
  if (used) throw new ValidationError({ place: `${used} association${used === 1 ? "" : "s"} use this place; remove them first.` });
  await db.delete(s.places).where(eq(s.places.id, id));
  await audit(actor.id, "place_delete", { type: "place", id, label: row.name });
}

export async function getPlace(id: string) {
  const db = await ready();
  return (await db.select().from(s.places).where(eq(s.places.id, id)).get()) ?? null;
}

export async function listPlaces(q = "") {
  const db = await ready();
  const term = `%${q.trim()}%`;
  return db
    .select()
    .from(s.places)
    .where(q.trim() ? or(like(s.places.name, term), like(s.places.aliases, term), like(s.places.modernName, term), like(s.places.country, term)) : undefined)
    .orderBy(asc(s.places.name));
}

export const placeAliases = (row: Pick<s.PlaceRow, "aliases">) => parseList(row.aliases);
export const placeMatches = (row: Pick<s.PlaceRow, "matches">) => parseList(row.matches);

/** A resolver over the whole gazetteer. */
export async function placeResolver() {
  const rows = await listPlaces();
  return { rows, resolver: new PlaceResolver(rows.map((r) => ({ id: r.id, name: r.name, kind: r.kind, aliases: placeAliases(r), matches: placeMatches(r) }))) };
}

/**
 * Every place wording already on entries — birthplaces, places of death,
 * event locations — with the places it resolves to (none, if not yet located).
 */
export async function placeWordings() {
  const db = await ready();
  const [thinkers, events, { rows, resolver }] = await Promise.all([
    db
      .select({ id: s.entities.id, title: s.entities.title, kind: s.entities.kind, live: s.entities.live, status: s.entities.status, birth: s.thinkerDetails.birthPlace, death: s.thinkerDetails.deathPlace })
      .from(s.thinkerDetails)
      .innerJoin(s.entities, eq(s.entities.id, s.thinkerDetails.entityId)),
    db
      .select({ id: s.entities.id, title: s.entities.title, kind: s.entities.kind, live: s.entities.live, status: s.entities.status, place: s.eventDetails.place })
      .from(s.eventDetails)
      .innerJoin(s.entities, eq(s.entities.id, s.eventDetails.entityId)),
    placeResolver(),
  ]);
  const byId = new Map(rows.map((r) => [r.id, r]));
  const out: { entity: { id: string; title: string; kind: string; live: boolean; status: string }; role: "birth" | "death" | "event"; text: string; places: s.PlaceRow[] }[] = [];
  const add = (e: (typeof thinkers)[number] | (typeof events)[number], role: "birth" | "death" | "event", text: string | null) => {
    if (!text?.trim()) return;
    out.push({ entity: { id: e.id, title: e.title, kind: e.kind, live: e.live, status: e.status }, role, text, places: resolver.resolve(text).map((id) => byId.get(id)!) });
  };
  for (const t of thinkers) {
    add(t, "birth", t.birth);
    add(t, "death", t.death);
  }
  for (const e of events) add(e, "event", e.place);
  return out;
}
