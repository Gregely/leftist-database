import { NextResponse, type NextRequest } from "next/server";
import { isEntityKind, type EntityKind } from "@/lib/content/model";
import { lookupEntities, search } from "@/lib/data";

/**
 * GET /api/search?q=…[&kinds=thinker,concept][&mode=lookup]
 * Grouped full-text search across every entity type.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const kinds = (req.nextUrl.searchParams.get("kinds") ?? "")
    .split(",")
    .filter(isEntityKind) as EntityKind[];
  if (q.length > 200) return NextResponse.json({ error: "Query too long" }, { status: 400 });
  if (req.nextUrl.searchParams.get("mode") === "lookup") {
    return NextResponse.json({ items: await lookupEntities(q, kinds) });
  }
  return NextResponse.json(await search(q, { kinds, limit: 30 }));
}
