import type { GeoEntry, GeoLink, GeoPlace } from "@/lib/data/geography";

export type { GeoEntry, GeoLink };

/** A place with its position in the base map's world units. */
export interface GeoPoint extends GeoPlace {
  at: [number, number];
}

export interface BasemapPaths {
  width: number;
  height: number;
  sphere: string;
  graticule: string;
  land: string;
  detail: string;
  detailBox: [number, number, number, number];
}

export interface GeoData {
  basemap: BasemapPaths;
  places: GeoPoint[];
  entries: GeoEntry[];
  links: GeoLink[];
  years: [number, number];
  unlocated: number;
}

export interface GeoState {
  kinds?: string[];
  roles?: string[];
  period: [number, number] | null;
  place: string | null;
  trace: string | null;
}
