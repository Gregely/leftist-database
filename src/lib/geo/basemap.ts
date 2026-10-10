import "server-only";
import { geoEqualEarth, geoGraticule, geoPath, type GeoStream } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import land110 from "world-atlas/land-110m.json";
import land50 from "world-atlas/land-50m.json";

/**
 * The Geography section's base map, drawn once on the server as SVG paths in
 * a fixed world space (Equal Earth, 1000 units wide), so the browser needs no
 * map library: it only pans and zooms the drawing.
 *
 * Land only, from Natural Earth via world-atlas. No present-day borders are
 * drawn: they would be wrong for almost every date on the map, and the places
 * carry their own historical notes instead. The whole world is drawn at the
 * 1:110m scale; Europe, where most of the collection's places lie, at 1:50m.
 */

export const WORLD_WIDTH = 1000;

const projection = geoEqualEarth().fitWidth(WORLD_WIDTH, { type: "Sphere" });

/** Lon/lat → world units. */
export function project(lon: number, lat: number): [number, number] {
  const p = projection([lon, lat]);
  return p ? [Math.round(p[0] * 100) / 100, Math.round(p[1] * 100) / 100] : [0, 0];
}

export interface Basemap {
  width: number;
  height: number;
  sphere: string;
  graticule: string;
  land: string;
  /** Detailed land for the box below, drawn instead of `land` inside it. */
  detail: string;
  detailBox: [number, number, number, number];
}

function load(json: unknown) {
  const topo = json as Topology<{ land: GeometryCollection }>;
  return feature(topo, topo.objects.land);
}

/** Drop points closer than `eps` world units to the last one kept, and rings left with too few points. */
function thin(eps: number) {
  return (out: GeoStream): GeoStream => {
    let buf: [number, number][] = [];
    let last: [number, number] | null = null;
    return {
      point(x, y) {
        if (!last || Math.hypot(x - last[0], y - last[1]) >= eps) {
          buf.push([x, y]);
          last = [x, y];
        }
      },
      lineStart() {
        buf = [];
        last = null;
      },
      lineEnd() {
        if (buf.length < 3) return;
        out.lineStart();
        for (const [x, y] of buf) out.point(x, y);
        out.lineEnd();
      },
      polygonStart: () => out.polygonStart(),
      polygonEnd: () => out.polygonEnd(),
      sphere: () => out.sphere?.(),
    };
  };
}

let cached: Basemap | null = null;

export function basemap(): Basemap {
  if (cached) return cached;
  const height = Math.ceil(geoPath(projection).bounds({ type: "Sphere" })[1][1]);
  const sphere = geoPath(projection).digits(1)({ type: "Sphere" }) ?? "";
  const graticule = geoPath(projection).digits(1)(geoGraticule().step([15, 15])()) ?? "";
  const land = geoPath({ stream: (o) => projection.stream(thin(0.08)(o)) }).digits(1)(load(land110)) ?? "";

  // Europe and the Mediterranean, as a box in world units.
  const corners = [project(-26, 72), project(-26, 30), project(48, 72), project(48, 30)];
  const box: [number, number, number, number] = [
    Math.floor(Math.min(...corners.map((c) => c[0]))),
    Math.floor(Math.min(...corners.map((c) => c[1]))),
    Math.ceil(Math.max(...corners.map((c) => c[0]))),
    Math.ceil(Math.max(...corners.map((c) => c[1]))),
  ];
  const clipped = geoEqualEarth().fitWidth(WORLD_WIDTH, { type: "Sphere" }).clipExtent([
    [box[0], box[1]],
    [box[2], box[3]],
  ]);
  const detail = geoPath({ stream: (o) => clipped.stream(thin(0.12)(o)) }).digits(1)(load(land50)) ?? "";
  cached = { width: WORLD_WIDTH, height, sphere, graticule, land, detail, detailBox: box };
  return cached;
}
