import { getCurrentUser } from "@/lib/auth/session";
import { isMediaPublic, readMediaFile } from "@/lib/editorial/media";

/**
 * GET /media/:id — serves an image from the media library.
 * Images attached to a live entry are public; anything else (drafts, unused
 * uploads) is visible only to signed-in members of the editorial desk.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isPublic = await isMediaPublic(id);
  if (!isPublic && !(await getCurrentUser())) return new Response("Not found", { status: 404 });
  const file = await readMediaFile(id);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file.bytes), {
    headers: {
      "Content-Type": file.media.mimeType,
      "Content-Length": String(file.bytes.length),
      "Cache-Control": isPublic ? "public, max-age=86400" : "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
    },
  });
}
