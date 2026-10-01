import { NextResponse, type NextRequest } from "next/server";
import { apiUser } from "@/lib/auth/api";
import { isEntityKind, type EntityKind } from "@/lib/content/model";
import { lookup } from "@/lib/editorial/queries";

/** GET /api/desk/lookup?q=…&kinds=thinker,concept — every status, for pickers and link dialogs. */
export async function GET(req: NextRequest) {
  const user = await apiUser();
  if (user instanceof NextResponse) return user;
  const q = (req.nextUrl.searchParams.get("q") ?? "").slice(0, 120);
  const kinds = (req.nextUrl.searchParams.get("kinds") ?? "").split(",").filter(isEntityKind) as EntityKind[];
  return NextResponse.json({ items: await lookup(q, kinds) });
}
