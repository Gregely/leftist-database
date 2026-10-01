"use server";
/**
 * Server actions for the editorial desk. Each one: resolves the signed-in
 * user from the database session, delegates to the editorial library (which
 * enforces permissions), maps domain errors to a serialisable result, and
 * revalidates public pages when public content may have changed.
 */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser, createSession, destroySession } from "@/lib/auth/session";
import * as users from "@/lib/auth/users";
import { audit } from "@/lib/editorial/audit";
import * as content from "@/lib/editorial/content";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/editorial/content";
import { validateEntity } from "@/lib/editorial/insight";
import * as mediaLib from "@/lib/editorial/media";
import * as notes from "@/lib/editorial/notes";
import { assertCan, ForbiddenError, type Actor } from "@/lib/editorial/permissions";
import * as sourcesLib from "@/lib/editorial/sources";
import * as structure from "@/lib/editorial/structure";
import type { Transition } from "@/lib/editorial/workflow";
import { isEntityKind, ROLES, type AnyRelationshipType, type ExcerptVerification, type MediaRole, type Role, type Stance } from "@/lib/content/model";

export type ActionResult<T = unknown> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; message: string; fields?: Record<string, string>; conflict?: { lockVersion: number; updatedAt: string; editor: string | null } };

async function actor(): Promise<Actor> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** Run an editorial operation and turn domain errors into results. */
async function run<T>(fn: (a: Actor) => Promise<T>, opts: { publicChange?: boolean; message?: string } = {}): Promise<ActionResult<T>> {
  const a = await actor();
  try {
    const data = await fn(a);
    if (opts.publicChange) revalidatePath("/", "layout");
    return { ok: true, data, message: opts.message };
  } catch (e) {
    if (e instanceof ValidationError) return { ok: false, message: e.message, fields: e.fields };
    if (e instanceof ConflictError) return { ok: false, message: e.message, conflict: e.current };
    if (e instanceof ForbiddenError) return { ok: false, message: e.message };
    if (e instanceof NotFoundError) return { ok: false, message: e.message || "Not found." };
    if (e instanceof users.UserError) return { ok: false, message: e.message };
    throw e;
  }
}

const str = (f: FormData, k: string) => {
  const v = f.get(k);
  return typeof v === "string" ? v.trim() : "";
};

/* — Session ——————————————————————————————————————————————————————————— */

export async function loginAction(_prev: ActionResult | null, f: FormData): Promise<ActionResult> {
  const email = str(f, "email");
  const user = await users.authenticate(email, String(f.get("password") ?? ""));
  if (!user) {
    await audit(null, "login_failed", { type: "session", label: email.toLowerCase().slice(0, 120) });
    return { ok: false, message: "That email and password do not match an active account." };
  }
  await createSession(user.id);
  await audit(user.id, "login", { type: "session", id: user.id, label: user.name });
  const next = str(f, "next");
  redirect(next.startsWith("/admin") || next.startsWith("/preview") ? next : "/admin");
}

export async function logoutAction() {
  const user = await getCurrentUser();
  if (user) await audit(user.id, "logout", { type: "session", id: user.id, label: user.name });
  await destroySession();
  redirect("/admin/login");
}

/* — Entries ——————————————————————————————————————————————————————————— */

export async function createEntryAction(_prev: ActionResult | null, f: FormData): Promise<ActionResult> {
  const kind = str(f, "kind");
  if (!isEntityKind(kind)) return { ok: false, message: "Choose what kind of entry to create.", fields: { kind: "Choose a kind." } };
  const res = await run((a) => content.createEntity(a, kind, { title: str(f, "title") }));
  if (!res.ok) return res;
  redirect(`/admin/entries/${res.data}?created=1`);
}

export async function saveEntryAction(
  id: string,
  baseLock: number,
  values: Record<string, unknown>,
  message?: string,
): Promise<ActionResult<content.SaveResult>> {
  return run((a) => content.saveContent(a, id, baseLock, values, { message }));
}

export async function transitionAction(id: string, t: Transition, note?: string): Promise<ActionResult> {
  const publicChange = ["publish", "unpublish", "archive", "unarchive"].includes(t);
  return run(
    async (a) => {
      await content.transition(a, id, t, { note, validate: (row) => validateEntity(row) });
    },
    { publicChange },
  );
}

export async function restoreRevisionAction(id: string, version: number, baseLock: number): Promise<ActionResult<content.SaveResult>> {
  return run((a) => content.restoreRevision(a, id, version, baseLock));
}

export async function deleteEntryAction(id: string): Promise<ActionResult> {
  const res = await run((a) => content.deleteEntity(a, id), { publicChange: true });
  if (!res.ok) return res;
  redirect("/admin/content?deleted=1");
}

/* — Notes ————————————————————————————————————————————————————————————— */

export async function addNoteAction(entityId: string, input: { body: string; field?: string; quote?: string }): Promise<ActionResult> {
  return run((a) => notes.addNote(a, entityId, input).then(() => undefined));
}

export async function resolveNoteAction(noteId: string, resolved: boolean): Promise<ActionResult> {
  return run((a) => notes.setNoteResolved(a, noteId, resolved));
}

/* — Relationships ———————————————————————————————————————————————————————— */

export async function addRelationshipAction(
  contextId: string | null,
  input: { fromId: string; type: string; toId: string; note?: string; weight?: number; sourceId?: string; locator?: string; yearStart?: string; yearEnd?: string; context?: string },
): Promise<ActionResult> {
  return run((a) => structure.upsertRelationship(a, contextId, { ...input, type: input.type as AnyRelationshipType }), { publicChange: true, message: "Relationship added." });
}

export async function deleteRelationshipAction(id: string): Promise<ActionResult> {
  return run((a) => structure.deleteRelationship(a, id), { publicChange: true });
}

/* — Citations & excerpts ——————————————————————————————————————————————— */

export async function addCitationAction(entityId: string, input: { sourceId: string; locator?: string; field?: string; note?: string }): Promise<ActionResult> {
  return run((a) => structure.addCitation(a, entityId, input), { publicChange: true });
}

export async function removeCitationAction(citationId: string): Promise<ActionResult> {
  return run((a) => structure.removeCitation(a, citationId), { publicChange: true });
}

export async function addExcerptAction(
  entityId: string,
  input: { body: string; textId?: string; sourceId?: string; speakerId?: string; locator?: string; note?: string; verification?: string },
): Promise<ActionResult<string>> {
  return run((a) => structure.addExcerpt(a, entityId, { ...input, verification: input.verification as ExcerptVerification }), { publicChange: true });
}

export async function updateExcerptAction(
  excerptId: string,
  input: { body?: string; textId?: string; sourceId?: string; speakerId?: string; locator?: string; note?: string; verification?: string },
): Promise<ActionResult> {
  return run((a) => structure.updateExcerpt(a, excerptId, { ...input, verification: input.verification as ExcerptVerification | undefined }), { publicChange: true });
}

export async function removeExcerptAction(excerptId: string): Promise<ActionResult> {
  return run((a) => structure.removeExcerpt(a, excerptId), { publicChange: true });
}

/* — Sources ——————————————————————————————————————————————————————————— */

export async function createSourceAction(input: sourcesLib.SourceInput): Promise<ActionResult<string>> {
  return run((a) => sourcesLib.createSource(a, input));
}

export async function updateSourceAction(id: string, input: sourcesLib.SourceInput): Promise<ActionResult> {
  return run((a) => sourcesLib.updateSource(a, id, input), { publicChange: true, message: "Source saved." });
}

export async function deleteSourceAction(id: string): Promise<ActionResult> {
  const res = await run((a) => sourcesLib.deleteSource(a, id), { publicChange: true });
  if (!res.ok) return res;
  redirect("/admin/sources");
}

/* — Media ————————————————————————————————————————————————————————————— */

export async function updateMediaAction(id: string, meta: mediaLib.MediaMeta): Promise<ActionResult> {
  return run((a) => mediaLib.updateMedia(a, id, meta), { publicChange: true, message: "Image details saved." });
}

export async function attachMediaAction(entityId: string, mediaId: string, role: string, caption = ""): Promise<ActionResult> {
  return run((a) => structure.attachMedia(a, entityId, mediaId, role as MediaRole, caption), { publicChange: true });
}

export async function detachMediaAction(attachmentId: string): Promise<ActionResult> {
  return run((a) => structure.detachMedia(a, attachmentId), { publicChange: true });
}

/* — Debates & paths ———————————————————————————————————————————————————— */

export async function savePositionAction(
  debateId: string,
  id: string | null,
  f: { label: string; holderId?: string; centralClaim: string; summary: string; assumptions: string; criticisms: string },
): Promise<ActionResult> {
  return run((a) => structure.savePosition(a, debateId, id, f), { publicChange: true });
}
export async function deletePositionAction(debateId: string, id: string): Promise<ActionResult> {
  return run((a) => structure.deletePosition(a, debateId, id), { publicChange: true });
}
export async function addPropositionAction(debateId: string, statement: string): Promise<ActionResult> {
  return run((a) => structure.addProposition(a, debateId, statement), { publicChange: true });
}
export async function deletePropositionAction(debateId: string, id: string): Promise<ActionResult> {
  return run((a) => structure.deleteProposition(a, debateId, id), { publicChange: true });
}
export async function setStancesAction(debateId: string, entries: { positionId: string; propositionId: string; stance: string; note: string }[]): Promise<ActionResult> {
  return run((a) => structure.setStances(a, debateId, entries.map((e) => ({ ...e, stance: e.stance as Stance | "" }))), { publicChange: true, message: "Stances saved." });
}
export async function linkPositionAction(debateId: string, positionId: string, entityId: string, remove = false): Promise<ActionResult> {
  return run((a) => structure.linkPosition(a, debateId, positionId, entityId, remove), { publicChange: true });
}
export async function addArgumentAction(debateId: string, f: { positionId?: string; kind: "argument" | "counterargument"; respondsToId?: string; body: string }): Promise<ActionResult> {
  return run((a) => structure.addArgument(a, debateId, f), { publicChange: true });
}
export async function deleteArgumentAction(debateId: string, id: string): Promise<ActionResult> {
  return run((a) => structure.deleteArgument(a, debateId, id), { publicChange: true });
}
export async function addStepAction(pathId: string, f: { entityId: string; framing: string; track?: string; parentStepId?: string }): Promise<ActionResult> {
  return run((a) => structure.addStep(a, pathId, f), { publicChange: true });
}
export async function updateStepAction(pathId: string, id: string, framing: string): Promise<ActionResult> {
  return run((a) => structure.updateStep(a, pathId, id, framing), { publicChange: true });
}
export async function moveStepAction(pathId: string, id: string, delta: -1 | 1): Promise<ActionResult> {
  return run((a) => structure.moveStep(a, pathId, id, delta), { publicChange: true });
}
export async function deleteStepAction(pathId: string, id: string): Promise<ActionResult> {
  return run((a) => structure.deleteStep(a, pathId, id), { publicChange: true });
}

/* — People ———————————————————————————————————————————————————————————— */

export async function createUserAction(_prev: ActionResult | null, f: FormData): Promise<ActionResult<{ password: string }>> {
  return run(async (a) => {
    assertCan(a, "users.manage");
    const role = str(f, "role") as Role;
    const password = str(f, "password") || (await import("@/lib/auth/password")).generatePassword();
    const id = await users.createUser({ email: str(f, "email"), name: str(f, "name"), role, password });
    await audit(a.id, "user_create", { type: "user", id, label: str(f, "name") }, { role, email: str(f, "email").toLowerCase() });
    return { password: str(f, "password") ? "" : password };
  });
}

export async function setRoleAction(userId: string, role: string): Promise<ActionResult> {
  return run(async (a) => {
    assertCan(a, "users.manage");
    if (!ROLES.includes(role as Role)) throw new ValidationError({ role: "Unknown role." });
    const target = await users.getUser(userId);
    if (!target) throw new NotFoundError("User not found.");
    if (target.role === "admin" && role !== "admin" && (await users.countAdmins()) <= 1) {
      throw new ValidationError({ role: "There must always be at least one active administrator." });
    }
    await users.setRole(userId, role as Role);
    await audit(a.id, "role_change", { type: "user", id: userId, label: target.name }, { from: target.role, to: role });
  });
}

export async function setActiveAction(userId: string, active: boolean): Promise<ActionResult> {
  return run(async (a) => {
    assertCan(a, "users.manage");
    const target = await users.getUser(userId);
    if (!target) throw new NotFoundError("User not found.");
    if (target.id === a.id && !active) throw new ValidationError({ active: "You cannot deactivate your own account." });
    if (!active && target.role === "admin" && (await users.countAdmins()) <= 1) {
      throw new ValidationError({ active: "There must always be at least one active administrator." });
    }
    await users.setActive(userId, active);
    await audit(a.id, active ? "user_reactivate" : "user_deactivate", { type: "user", id: userId, label: target.name });
  });
}

export async function resetPasswordAction(userId: string): Promise<ActionResult<{ password: string }>> {
  return run(async (a) => {
    assertCan(a, "users.manage");
    const target = await users.getUser(userId);
    if (!target) throw new NotFoundError("User not found.");
    const password = (await import("@/lib/auth/password")).generatePassword();
    await users.setPassword(userId, password);
    await audit(a.id, "password_reset", { type: "user", id: userId, label: target.name });
    return { password };
  });
}

export async function changePasswordAction(_prev: ActionResult | null, f: FormData): Promise<ActionResult> {
  return run(async (a) => {
    const next = String(f.get("next") ?? "");
    if (next !== String(f.get("confirm") ?? "")) throw new ValidationError({ confirm: "The new passwords do not match." });
    await users.changeOwnPassword(a.id, String(f.get("current") ?? ""), next);
    await audit(a.id, "password_reset", { type: "user", id: a.id, label: a.name }, { self: true });
  }, { message: "Password changed." });
}
