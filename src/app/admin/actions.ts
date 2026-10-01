"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/guard";
import * as repo from "@/lib/admin/repository";
import { ValidationError } from "@/lib/admin/repository";
import { checkPassword, createSessionToken, SESSION_COOKIE } from "@/lib/admin/session";
import {
  ALL_RELATIONSHIP_TYPES,
  isEntityKind,
  SOURCE_TYPES,
  STANCES,
  type AnyRelationshipType,
  type SourceType,
  type Stance,
} from "@/lib/content/model";

export type FormState = { ok?: boolean; message?: string; errors?: Record<string, string> } | null;

const str = (f: FormData, k: string) => {
  const v = f.get(k);
  return typeof v === "string" ? v.trim() : "";
};

/** Only allow redirects back into the editorial desk. */
function back(f: FormData, fallback = "/admin") {
  const r = str(f, "returnTo");
  return r.startsWith("/admin") ? r : fallback;
}

function withError(path: string, message: string) {
  const [base, hash] = path.split("#");
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}error=${encodeURIComponent(message)}${hash ? `#${hash}` : ""}`;
}

/** Run a small mutation, publish the change, and return to the form. */
async function mutate(f: FormData, fn: () => Promise<unknown>, fallback?: string) {
  await requireAdmin();
  const to = back(f, fallback);
  try {
    await fn();
  } catch (e) {
    if (e instanceof ValidationError) redirect(withError(to, e.message));
    throw e;
  }
  revalidatePath("/", "layout");
  redirect(to);
}

/* — Session ——————————————————————————————————————————————————————————— */

export async function loginAction(_prev: FormState, f: FormData): Promise<FormState> {
  if (!(await checkPassword(str(f, "password")))) {
    return { errors: { password: "That password is not correct." } };
  }
  const session = await createSessionToken();
  if (!session) return { message: "The editorial desk is not configured: set ADMIN_PASSWORD." };
  (await cookies()).set(SESSION_COOKIE, session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: session.maxAge,
  });
  const next = str(f, "next");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* — Entities ——————————————————————————————————————————————————————————— */

export async function saveEntityAction(kind: string, id: string | null, _prev: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  if (!isEntityKind(kind)) return { message: "Unknown kind." };
  let savedId: string;
  try {
    savedId = await repo.saveEntity(kind, id, f);
  } catch (e) {
    if (e instanceof ValidationError) return { errors: e.fields, message: "Please correct the highlighted fields." };
    throw e;
  }
  revalidatePath("/", "layout");
  if (!id) redirect(`/admin/${kind}/${savedId}?saved=1`);
  return { ok: true, message: "Saved." };
}

export async function deleteEntityAction(f: FormData) {
  await requireAdmin();
  const kind = str(f, "kind");
  await repo.deleteEntity(str(f, "id"));
  revalidatePath("/", "layout");
  redirect(`/admin/${isEntityKind(kind) ? kind : ""}`);
}

/* — Relationships —————————————————————————————————————————————————————— */

export async function createRelationshipAction(f: FormData) {
  const type = str(f, "type") as AnyRelationshipType;
  await mutate(f, async () => {
    if (!ALL_RELATIONSHIP_TYPES.includes(type)) throw new ValidationError({ type: "Choose a relationship type." });
    await repo.createRelationship({
      fromId: str(f, "fromId"),
      type,
      toId: str(f, "toId"),
      note: str(f, "note"),
      weight: Number(str(f, "weight")) || 2,
      sourceId: str(f, "sourceId") || null,
      locator: str(f, "locator") || null,
    });
  });
}

export async function deleteRelationshipAction(f: FormData) {
  await mutate(f, () => repo.deleteRelationship(str(f, "id")));
}

/* — Citations & excerpts ———————————————————————————————————————————————— */

export async function addCitationAction(f: FormData) {
  await mutate(f, () => repo.addCitation(str(f, "entityId"), str(f, "sourceId"), str(f, "locator"), str(f, "field"), str(f, "note")));
}

export async function deleteCitationAction(f: FormData) {
  await mutate(f, () => repo.deleteCitation(str(f, "id")));
}

export async function addExcerptAction(f: FormData) {
  await mutate(f, () =>
    repo.addExcerpt({
      entityId: str(f, "entityId"),
      textId: str(f, "textId"),
      sourceId: str(f, "sourceId"),
      body: str(f, "body"),
      locator: str(f, "locator"),
      note: str(f, "note"),
      verified: f.get("verified") === "on",
    }),
  );
}

export async function deleteExcerptAction(f: FormData) {
  await mutate(f, () => repo.deleteExcerpt(str(f, "id")));
}

/* — Debates ——————————————————————————————————————————————————————————— */

export async function savePositionAction(f: FormData) {
  await mutate(f, () =>
    repo.savePosition(str(f, "debateId"), str(f, "id") || null, {
      label: str(f, "label"),
      holderId: str(f, "holderId"),
      centralClaim: str(f, "centralClaim"),
      summary: str(f, "summary"),
      assumptions: str(f, "assumptions"),
      criticisms: str(f, "criticisms"),
    }),
  );
}

export async function deletePositionAction(f: FormData) {
  await mutate(f, () => repo.deletePosition(str(f, "id"), str(f, "debateId")));
}

export async function addPropositionAction(f: FormData) {
  await mutate(f, () => repo.addProposition(str(f, "debateId"), str(f, "statement")));
}

export async function deletePropositionAction(f: FormData) {
  await mutate(f, () => repo.deleteProposition(str(f, "id")));
}

/** Stance matrix: fields named "stance:<positionId>:<propositionId>" and "note:<…>". */
export async function saveStancesAction(f: FormData) {
  const entries: { positionId: string; propositionId: string; stance: Stance | ""; note: string }[] = [];
  for (const [k, v] of f.entries()) {
    if (!k.startsWith("stance:")) continue;
    const [, positionId, propositionId] = k.split(":");
    const stance = String(v) as Stance | "";
    if (stance && !STANCES.includes(stance)) continue;
    entries.push({ positionId, propositionId, stance, note: str(f, `note:${positionId}:${propositionId}`) });
  }
  await mutate(f, () => repo.setStances(entries));
}

export async function addPositionLinkAction(f: FormData) {
  await mutate(f, () => repo.addPositionLink(str(f, "positionId"), str(f, "entityId")));
}

export async function removePositionLinkAction(f: FormData) {
  await mutate(f, () => repo.removePositionLink(str(f, "positionId"), str(f, "entityId")));
}

export async function addArgumentAction(f: FormData) {
  await mutate(f, () =>
    repo.addArgument(str(f, "debateId"), {
      positionId: str(f, "positionId"),
      kind: str(f, "kind") === "counterargument" ? "counterargument" : "argument",
      respondsToId: str(f, "respondsToId"),
      body: str(f, "body"),
    }),
  );
}

export async function deleteArgumentAction(f: FormData) {
  await mutate(f, () => repo.deleteArgument(str(f, "id")));
}

/* — Paths ————————————————————————————————————————————————————————————— */

export async function addStepAction(f: FormData) {
  await mutate(f, () => repo.addStep(str(f, "pathId"), str(f, "entityId"), str(f, "framing")));
}

export async function updateStepAction(f: FormData) {
  await mutate(f, () => repo.updateStep(str(f, "id"), str(f, "framing")));
}

export async function moveStepAction(f: FormData) {
  await mutate(f, () => repo.moveStep(str(f, "pathId"), str(f, "id"), str(f, "delta") === "-1" ? -1 : 1));
}

export async function deleteStepAction(f: FormData) {
  await mutate(f, () => repo.deleteStep(str(f, "pathId"), str(f, "id")));
}

/* — Sources ——————————————————————————————————————————————————————————— */

export async function saveSourceAction(id: string | null, _prev: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const sourceType = str(f, "sourceType") as SourceType;
  if (!SOURCE_TYPES.includes(sourceType)) return { errors: { sourceType: "Choose a source type." } };
  let saved: string;
  try {
    saved = await repo.saveSource(id, {
      title: str(f, "title"),
      author: str(f, "author"),
      publicationDate: str(f, "publicationDate"),
      publisher: str(f, "publisher"),
      url: str(f, "url"),
      sourceType,
      locator: str(f, "locator"),
      notes: str(f, "notes"),
    });
  } catch (e) {
    if (e instanceof ValidationError) return { errors: e.fields, message: "Please correct the highlighted fields." };
    throw e;
  }
  revalidatePath("/", "layout");
  if (!id) redirect(`/admin/sources/${saved}?saved=1`);
  return { ok: true, message: "Saved." };
}

export async function deleteSourceAction(f: FormData) {
  await requireAdmin();
  await repo.deleteSource(str(f, "id"));
  revalidatePath("/", "layout");
  redirect("/admin/sources");
}
