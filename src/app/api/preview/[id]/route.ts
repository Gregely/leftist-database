import { NextResponse } from "next/server";
import { getPreview } from "@/lib/data";

/** GET /api/preview/:id — an entity with its grouped connections (timeline & map panels). */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const preview = await getPreview(id);
  if (!preview) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(preview);
}
