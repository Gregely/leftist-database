import "server-only";
import { notFound, permanentRedirect } from "next/navigation";
import { entityHref, type EntityKind } from "@/lib/content/model";
import { resolveMovedSlug } from "@/lib/data";

/** For a missing slug: redirect if it is an old address of a live entry, otherwise 404. */
export async function notFoundOrRedirect(kind: EntityKind, slug: string): Promise<never> {
  const moved = await resolveMovedSlug(kind, slug);
  if (moved) permanentRedirect(entityHref(kind, moved));
  notFound();
}
