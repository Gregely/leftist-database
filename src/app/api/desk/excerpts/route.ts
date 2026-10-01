import { NextResponse, type NextRequest } from "next/server";
import { apiUser } from "@/lib/auth/api";
import { excerptsFor } from "@/lib/editorial/structure";

/** GET /api/desk/excerpts?entity=… — an entry's excerpts, for embedding in prose. */
export async function GET(req: NextRequest) {
  const user = await apiUser();
  if (user instanceof NextResponse) return user;
  const id = req.nextUrl.searchParams.get("entity") ?? "";
  const rows = await excerptsFor(id);
  return NextResponse.json({
    items: rows.map((x) => ({ id: x.id, body: x.body, locator: x.locator, verification: x.verification, text: x.text?.title ?? null })),
  });
}
