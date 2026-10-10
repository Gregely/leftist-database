import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { DeskHeading, DeskPage, Notice, Panel } from "@/components/desk/ui";
import { PlaceEditor } from "@/components/desk/PlaceEditor";
import { requireUser } from "@/lib/auth/session";
import { KINDS, PLACE_KIND_LABELS, PLACE_ROLE_META, type EntityKind, type PlaceKind, type PlaceRole } from "@/lib/content/model";
import { ready } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { can } from "@/lib/editorial/permissions";
import { getPlace, placeAliases, placeMatches, placeWordings } from "@/lib/editorial/places";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPlace((await params).id);
  return { title: p ? `Place: ${p.name}` : "Place" };
}

export default async function PlaceDesk({ params, searchParams }: Props) {
  const user = await requireUser();
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const place = await getPlace(id);
  if (!place) notFound();
  const db = await ready();
  const [links, wordings] = await Promise.all([
    db
      .select({ l: s.entityPlaces, e: { id: s.entities.id, title: s.entities.title, kind: s.entities.kind } })
      .from(s.entityPlaces)
      .innerJoin(s.entities, eq(s.entities.id, s.entityPlaces.entityId))
      .where(eq(s.entityPlaces.placeId, id)),
    placeWordings(),
  ]);
  const fromFields = wordings.filter((w) => w.places.some((p) => p.id === id));
  const initial: Record<string, string> = {
    name: place.name,
    kind: place.kind,
    lat: String(place.lat),
    lon: String(place.lon),
    modernName: place.modernName,
    country: place.country,
    historicalNote: place.historicalNote,
    aliases: placeAliases(place).join("\n"),
    matches: placeMatches(place).join("\n"),
    wikidataId: place.wikidataId ?? "",
    coordSource: place.coordSource,
  };
  const uses = links.length + fromFields.length;
  return (
    <DeskPage className="max-w-6xl">
      <DeskHeading kicker={`Place · ${PLACE_KIND_LABELS[place.kind as PlaceKind]}`} title={place.name} lede={place.historicalNote || undefined} />
      {sp.created && (
        <div className="mt-4">
          <Notice tone="success">Added to the gazetteer.</Notice>
        </div>
      )}
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <PlaceEditor id={id} initial={initial} canEdit={can(user, "place.edit", undefined, place.createdBy)} canDelete={can(user, "place.edit", undefined, place.createdBy) && links.length === 0} />
        <Panel title={`Used ${uses} time${uses === 1 ? "" : "s"}`}>
          <ul className="space-y-1.5 text-sm">
            {fromFields.map((w, i) => (
              <li key={`f${i}`}>
                <Link href={`/admin/entries/${w.entity.id}?tab=places`} className="link-inline">
                  {w.entity.title}
                </Link>{" "}
                <span className="label text-faint">
                  {PLACE_ROLE_META[w.role].label} · “{w.text}”
                </span>
              </li>
            ))}
            {links.map(({ l, e }) => (
              <li key={l.id}>
                <Link href={`/admin/entries/${e.id}?tab=places`} className="link-inline">
                  {e.title}
                </Link>{" "}
                <span className="label text-faint">
                  {PLACE_ROLE_META[l.role as PlaceRole].label}
                  {l.yearStart ? ` · ${l.yearStart}${l.yearEnd && l.yearEnd !== l.yearStart ? `–${l.yearEnd}` : ""}` : ""} · {KINDS[e.kind as EntityKind].label}
                  {l.stagedFor ? " · with next publication" : ""}
                </span>
              </li>
            ))}
          </ul>
          {place.wikidataId && (
            <p className="mt-4 text-xs text-faint">
              Coordinates:{" "}
              <a className="link-inline" href={`https://www.wikidata.org/wiki/${place.wikidataId}`} target="_blank" rel="noreferrer">
                Wikidata {place.wikidataId}
              </a>
            </p>
          )}
        </Panel>
      </div>
    </DeskPage>
  );
}
