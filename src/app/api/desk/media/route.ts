import { NextResponse, type NextRequest } from "next/server";
import { apiUser } from "@/lib/auth/api";
import { ValidationError } from "@/lib/editorial/content";
import { listMedia, MAX_UPLOAD_BYTES, MEDIA_META_FIELDS, uploadMedia, type MediaMeta } from "@/lib/editorial/media";
import { ForbiddenError } from "@/lib/editorial/permissions";
import { attachMedia } from "@/lib/editorial/structure";
import { MEDIA_ROLES, type MediaRole } from "@/lib/content/model";

/** GET /api/desk/media?q=…&tag=… — the media library. */
export async function GET(req: NextRequest) {
  const user = await apiUser();
  if (user instanceof NextResponse) return user;
  const sp = req.nextUrl.searchParams;
  const res = await listMedia({ q: sp.get("q") ?? undefined, tag: sp.get("tag") ?? undefined, limit: 60 });
  return NextResponse.json({
    total: res.total,
    items: res.items.map((m) => ({
      id: m.id,
      url: `/media/${m.id}`,
      title: m.title,
      caption: m.caption,
      altText: m.altText,
      credit: m.credit,
      license: m.license,
      width: m.width,
      height: m.height,
      uses: m.uses,
    })),
  });
}

/**
 * POST /api/desk/media — multipart upload: `file` plus metadata fields, and
 * optionally `attachTo` + `role` to attach it to an entry in the same step.
 * Identical files are stored once; the existing record is returned.
 */
export async function POST(req: NextRequest) {
  const user = await apiUser();
  if (user instanceof NextResponse) return user;
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > MAX_UPLOAD_BYTES + 64 * 1024) return NextResponse.json({ error: "Images must be 12 MB or smaller." }, { status: 413 });
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new ValidationError({ file: "Choose a file to upload." });
    const meta: MediaMeta = {};
    for (const k of MEDIA_META_FIELDS) {
      const v = form.get(k);
      if (typeof v === "string") meta[k] = v;
    }
    const result = await uploadMedia(user, { name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) }, meta);
    const attachTo = form.get("attachTo");
    const role = String(form.get("role") ?? "figure") as MediaRole;
    if (typeof attachTo === "string" && attachTo) {
      await attachMedia(user, attachTo, result.id, MEDIA_ROLES.includes(role) ? role : "figure", String(form.get("attachCaption") ?? ""));
    }
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof ValidationError) return NextResponse.json({ error: e.message, fields: e.fields }, { status: 400 });
    if (e instanceof ForbiddenError) return NextResponse.json({ error: e.message }, { status: 403 });
    throw e;
  }
}
