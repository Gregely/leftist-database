import "server-only";
/**
 * The media library: images stored once by content hash, described with
 * bibliographic and rights metadata, attachable to any entry.
 *
 * Files live under MEDIA_DIR (default data/uploads). On a host without a
 * persistent disk, swap `writeFile`/`readMediaFile` for object storage — the
 * rest of the system only deals in media records.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { and, desc, eq, isNull, like, or, sql } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { newId } from "@/lib/util/id";
import { audit } from "./audit";
import { NotFoundError, ValidationError } from "./content";
import { assertCan, type Actor } from "./permissions";

export const MEDIA_DIR = process.env.MEDIA_DIR || path.join(process.cwd(), "data", "uploads");

/** Where an upload lives on disk. Uploads are runtime data, so the bundler must not trace this path. */
const mediaPath = (fileName: string) => path.join(/*turbopackIgnore: true*/ MEDIA_DIR, path.basename(fileName));
export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

const TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
} as const;
type Mime = keyof typeof TYPES;

/** Identify the format from magic bytes — never trust the browser's claim. SVG is refused (scriptable). */
export function sniff(b: Uint8Array): Mime | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return "image/gif";
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "image/webp";
  return null;
}

export function dimensions(b: Uint8Array, mime: Mime): { width: number; height: number } | null {
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  try {
    if (mime === "image/png") return { width: dv.getUint32(16), height: dv.getUint32(20) };
    if (mime === "image/gif") return { width: dv.getUint16(6, true), height: dv.getUint16(8, true) };
    if (mime === "image/webp") {
      const chunk = String.fromCharCode(b[12], b[13], b[14], b[15]);
      if (chunk === "VP8 ") return { width: dv.getUint16(26, true) & 0x3fff, height: dv.getUint16(28, true) & 0x3fff };
      if (chunk === "VP8L") {
        const bits = dv.getUint32(21, true);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
      if (chunk === "VP8X") {
        const w = 1 + (b[24] | (b[25] << 8) | (b[26] << 16));
        const h = 1 + (b[27] | (b[28] << 8) | (b[29] << 16));
        return { width: w, height: h };
      }
    }
    if (mime === "image/jpeg") {
      let i = 2;
      while (i < b.length) {
        if (b[i] !== 0xff) return null;
        const marker = b[i + 1];
        const len = dv.getUint16(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { height: dv.getUint16(i + 5), width: dv.getUint16(i + 7) };
        }
        i += 2 + len;
      }
    }
  } catch {
    /* malformed header */
  }
  return null;
}

export const MEDIA_META_FIELDS = ["title", "description", "caption", "altText", "creator", "credit", "sourceText", "sourceId", "license", "rights", "year", "tags"] as const;
export type MediaMeta = Partial<Record<(typeof MEDIA_META_FIELDS)[number], string>>;

function cleanMeta(m: MediaMeta) {
  const out: Partial<s.MediaRow> = {};
  for (const k of ["title", "description", "caption", "altText", "creator", "credit", "sourceText", "license", "rights"] as const) {
    if (m[k] != null) out[k] = m[k]!.trim();
  }
  if (m.sourceId !== undefined) out.sourceId = m.sourceId || null;
  if (m.year != null) {
    const y = m.year.trim();
    if (y && !/^-?\d{1,4}$/.test(y)) throw new ValidationError({ year: "Year must be a number." });
    out.year = y ? Number(y) : null;
  }
  if (m.tags != null) {
    out.tags = JSON.stringify(
      [...new Set(m.tags.split(/[,\n]/).map((t) => t.trim().toLowerCase()).filter(Boolean))].slice(0, 20),
    );
  }
  return out;
}

/** Store an upload. Identical files are stored once: the existing record is returned. */
export async function uploadMedia(actor: Actor, file: { name: string; bytes: Uint8Array }, meta: MediaMeta = {}) {
  assertCan(actor, "media.upload");
  if (!file.bytes.length) throw new ValidationError({ file: "Choose a file to upload." });
  if (file.bytes.length > MAX_UPLOAD_BYTES) throw new ValidationError({ file: "Images must be 12 MB or smaller." });
  const mime = sniff(file.bytes);
  if (!mime) throw new ValidationError({ file: "Upload a JPEG, PNG, WebP or GIF image." });
  const sha256 = createHash("sha256").update(file.bytes).digest("hex");
  const db = await ready();
  const existing = await db.select().from(s.media).where(eq(s.media.sha256, sha256)).get();
  if (existing) return { id: existing.id, duplicate: true };

  const fileName = `${sha256}.${TYPES[mime]}`;
  await mkdir(/*turbopackIgnore: true*/ MEDIA_DIR, { recursive: true });
  await writeFile(mediaPath(fileName), file.bytes);
  const dims = dimensions(file.bytes, mime);
  const id = newId("med");
  const cleaned = cleanMeta(meta);
  await db.insert(s.media).values({
    id,
    sha256,
    fileName,
    originalName: file.name.slice(0, 200),
    mimeType: mime,
    size: file.bytes.length,
    width: dims?.width ?? null,
    height: dims?.height ?? null,
    title: cleaned.title || file.name.replace(/\.[a-z0-9]+$/i, "").slice(0, 120),
    ...cleaned,
    uploadedBy: actor.id,
  } as typeof s.media.$inferInsert);
  await audit(actor.id, "media_upload", { type: "media", id, label: cleaned.title || file.name }, { mimeType: mime, size: file.bytes.length });
  return { id, duplicate: false };
}

export async function updateMedia(actor: Actor, id: string, meta: MediaMeta) {
  const db = await ready();
  const m = await db.select().from(s.media).where(eq(s.media.id, id)).get();
  if (!m) throw new NotFoundError("Image not found.");
  assertCan(actor, "media.edit", undefined, m.uploadedBy);
  const set = cleanMeta(meta);
  await db.update(s.media).set({ ...set, updatedAt: sql`(CURRENT_TIMESTAMP)` }).where(eq(s.media.id, id));
  await audit(actor.id, "media_edit", { type: "media", id, label: set.title ?? m.title });
}

export async function listMedia(opts: { q?: string; tag?: string; limit?: number; offset?: number } = {}) {
  const db = await ready();
  const term = `%${opts.q?.trim() ?? ""}%`;
  const where = and(
    opts.q?.trim() ? or(like(s.media.title, term), like(s.media.caption, term), like(s.media.creator, term), like(s.media.tags, term)) : undefined,
    opts.tag ? like(s.media.tags, `%"${opts.tag}"%`) : undefined,
  );
  const [items, count] = await Promise.all([
    db
      .select({ m: s.media, uses: sql<number>`(SELECT count(*) FROM entity_media WHERE media_id = media.id)` })
      .from(s.media)
      .where(where)
      .orderBy(desc(s.media.createdAt), desc(s.media.id))
      .limit(opts.limit ?? 48)
      .offset(opts.offset ?? 0),
    db.select({ n: sql<number>`count(*)` }).from(s.media).where(where).get(),
  ]);
  return { total: Number(count?.n ?? 0), items: items.map((r) => ({ ...r.m, uses: Number(r.uses) })) };
}

export async function getMediaRecord(id: string) {
  const db = await ready();
  const m = await db.select().from(s.media).where(eq(s.media.id, id)).get();
  if (!m) return null;
  const usedBy = await db
    .select({ a: s.entityMedia, e: s.entities })
    .from(s.entityMedia)
    .innerJoin(s.entities, eq(s.entities.id, s.entityMedia.entityId))
    .where(eq(s.entityMedia.mediaId, id));
  return { media: m, usedBy };
}

/** Images become public only once attached to a live entry. */
export async function isMediaPublic(id: string) {
  const db = await ready();
  const r = await db
    .select({ n: sql<number>`count(*)` })
    .from(s.entityMedia)
    .innerJoin(s.entities, eq(s.entities.id, s.entityMedia.entityId))
    .where(and(eq(s.entityMedia.mediaId, id), eq(s.entities.live, true), isNull(s.entityMedia.stagedFor)))
    .get();
  return Number(r?.n ?? 0) > 0;
}

export async function readMediaFile(id: string) {
  const db = await ready();
  const m = await db.select().from(s.media).where(eq(s.media.id, id)).get();
  if (!m) return null;
  try {
    return { media: m, bytes: await readFile(mediaPath(m.fileName)) };
  } catch {
    return null;
  }
}

/** Rights and accessibility gaps for a media record. */
export function mediaGaps(m: Pick<s.MediaRow, "altText" | "license" | "rights" | "credit">): string[] {
  const gaps: string[] = [];
  if (!m.altText.trim()) gaps.push("alt text");
  if (!m.license.trim() && !m.rights.trim()) gaps.push("licence / rights");
  if (!m.credit.trim()) gaps.push("credit");
  return gaps;
}

export const mediaUrl = (id: string) => `/media/${id}`;
