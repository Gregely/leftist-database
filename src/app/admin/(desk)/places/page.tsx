import type { Metadata } from "next";
import Link from "next/link";
import { DeskHeading, DeskPage, Panel } from "@/components/desk/ui";
import { requireUser } from "@/lib/auth/session";
import { KINDS, PLACE_KIND_LABELS, PLACE_ROLE_META, type EntityKind, type PlaceKind } from "@/lib/content/model";
import { listPlaces, placeWordings } from "@/lib/editorial/places";
import { ready } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export const metadata: Metadata = { title: "Places" };

type Props = { searchParams: Promise<{ q?: string }> };

/** The gazetteer: every place the Atlas can locate, and the place wordings on entries that are not located yet. */
export default async function PlacesDesk({ searchParams }: Props) {
  await requireUser();
  const sp = await searchParams;
  const db = await ready();
  const [rows, wordings, links] = await Promise.all([
    listPlaces(sp.q),
    placeWordings(),
    db.select({ placeId: s.entityPlaces.placeId, n: sql<number>`count(*)` }).from(s.entityPlaces).groupBy(s.entityPlaces.placeId),
  ]);
  const recorded = new Map(links.map((l) => [l.placeId, Number(l.n)]));
  const fromFields = new Map<string, number>();
  for (const w of wordings) for (const p of w.places) fromFields.set(p.id, (fromFields.get(p.id) ?? 0) + 1);
  const unlocated = wordings.filter((w) => w.places.length === 0);
  const uses = (id: string) => (fromFields.get(id) ?? 0) + (recorded.get(id) ?? 0);
  const located = wordings.length - unlocated.length;
  return (
    <DeskPage>
      <DeskHeading
        kicker="Gazetteer"
        title="Places"
        lede="The places the Geography can show. Each needs coordinates from a named record. Birthplaces, places of death and event locations written on entries are located through the wordings listed on each place; other associations (residence, exile, activity, writing, publication, influence) are added on an entry's Places tab."
        aside={
          <Link href="/admin/places/new" className="btn btn-red">
            + New place
          </Link>
        }
      />
      <form className="mt-6 flex flex-wrap items-end gap-3 border-b border-rule pb-5" role="search">
        <label>
          <span className="label mb-1 block text-faint">Search</span>
          <input name="q" defaultValue={sp.q} placeholder="Name, other name or country" className="field w-72 py-1.5" />
        </label>
        <button type="submit" className="btn">
          Filter
        </button>
        <p className="label-mono ml-auto text-faint">
          {rows.length} places · {located} of {wordings.length} wordings on entries located
        </p>
      </form>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <ul className="divide-y divide-rule">
          {rows.map((p) => (
            <li key={p.id} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto]">
              <p className="text-sm leading-snug">
                <Link href={`/admin/places/${p.id}`} className="font-serif text-lg hover:text-red">
                  {p.name}
                </Link>
                <span className="label ml-2 text-faint">{PLACE_KIND_LABELS[p.kind as PlaceKind]}</span>
                {(p.modernName || p.country) && <span className="text-muted"> · now {[p.modernName !== p.name ? p.modernName : "", p.country].filter(Boolean).join(", ")}</span>}
                {p.historicalNote && <span className="block text-muted">{p.historicalNote}</span>}
              </p>
              <p className="label-mono text-faint sm:text-right">
                {uses(p.id)} {uses(p.id) === 1 ? "use" : "uses"} · {p.lat.toFixed(2)}, {p.lon.toFixed(2)}
                {p.wikidataId ? ` · ${p.wikidataId}` : ""}
              </p>
            </li>
          ))}
        </ul>
        <Panel title={`Not yet located · ${unlocated.length}`}>
          <p className="mb-3 text-sm text-muted">
            Wordings on entries that match no place. Add the place, or add the exact wording to an existing place. Some are not places at all (“Global”, a party’s name) and should stay unlocated.
          </p>
          <ul className="space-y-2 text-sm">
            {unlocated.map((w, i) => (
              <li key={i}>
                <span className="font-serif">“{w.text}”</span>
                <span className="block text-faint">
                  {PLACE_ROLE_META[w.role].label} of{" "}
                  <Link href={`/admin/entries/${w.entity.id}?tab=places`} className="link-inline">
                    {w.entity.title}
                  </Link>{" "}
                  <span className="label">{KINDS[w.entity.kind as EntityKind].label}</span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </DeskPage>
  );
}
