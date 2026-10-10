import type { LibSQLDatabase } from "drizzle-orm/libsql";
import * as s from "@/lib/db/schema";
import { PLACES } from "../../../corpus/geography/places";
import verification from "../../../corpus/geography/verification.json";

/**
 * The gazetteer for a fresh database: the places of the Geography corpus,
 * with the coordinates its `verify` step read from Wikidata. Places are
 * reference records, like sources; associations between entries and places
 * are not seeded (they go through review). A place without verified
 * coordinates is left out.
 */
export async function seedPlaces(db: LibSQLDatabase<typeof s>) {
  const located = (verification as { places?: Record<string, { ok: boolean; lat?: number; lon?: number }> }).places ?? {};
  let n = 0;
  for (const p of PLACES) {
    const v = located[p.id];
    if (!v?.ok || v.lat == null || v.lon == null) continue;
    await db.insert(s.places).values({
      id: p.id,
      slug: p.id.replace(/^pl_/, "").replace(/_/g, "-"),
      name: p.name,
      kind: p.kind,
      lat: v.lat,
      lon: v.lon,
      modernName: p.modernName ?? "",
      country: p.country ?? "",
      historicalNote: p.historicalNote ?? "",
      aliases: JSON.stringify(p.aliases ?? []),
      matches: JSON.stringify(p.matches ?? []),
      wikidataId: p.wikidata,
      coordSource: `Wikidata ${p.wikidata} (coordinate location), via the English Wikipedia article “${p.wikipedia}”`,
    });
    n++;
  }
  return n;
}
