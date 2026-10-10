import { basemap } from "@/lib/geo/basemap";

/**
 * The land paths of the Geography base map, served apart from the page so the
 * page stays light and browsers cache the drawing between visits. Built once,
 * at build time; it changes only with the world-atlas package.
 */
export const dynamic = "force-static";

export function GET() {
  const { land, detail } = basemap();
  return Response.json({ land, detail }, { headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" } });
}
