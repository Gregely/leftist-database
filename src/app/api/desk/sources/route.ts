import { NextResponse, type NextRequest } from "next/server";
import { apiUser } from "@/lib/auth/api";
import { searchSources } from "@/lib/editorial/sources";

/** GET /api/desk/sources?q=… — bibliography search for citation and excerpt pickers. */
export async function GET(req: NextRequest) {
  const user = await apiUser();
  if (user instanceof NextResponse) return user;
  const rows = await searchSources((req.nextUrl.searchParams.get("q") ?? "").slice(0, 120), 20);
  return NextResponse.json({
    items: rows.map((s) => ({ id: s.id, title: s.title, author: s.author, publicationDate: s.publicationDate, sourceType: s.sourceType })),
  });
}
