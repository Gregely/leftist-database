import "server-only";
import { asc, eq, sql } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { newId } from "@/lib/util/id";
import { audit } from "./audit";
import { gateOf, NotFoundError, requireEntity, ValidationError } from "./content";
import { assertCan, atLeast, ForbiddenError, type Actor } from "./permissions";

/** Internal editorial notes. They are never rendered on the public site. */
export async function addNote(actor: Actor, entityId: string, input: { body: string; field?: string; quote?: string; kind?: "note" | "reply" }) {
  const row = await requireEntity(entityId);
  assertCan(actor, "entity.comment", gateOf(row));
  const body = input.body.trim();
  if (!body) throw new ValidationError({ note: "Write a note." });
  const db = await ready();
  const id = newId("note");
  await db.insert(s.editorialNotes).values({
    id,
    entityId,
    authorId: actor.id,
    kind: input.kind ?? "note",
    field: input.field?.trim() || null,
    quote: input.quote?.trim().slice(0, 500) || null,
    body,
    revision: row.revision,
  });
  await audit(actor.id, "note_add", { type: "entity", id: entityId, label: row.title }, { noteId: id, field: input.field || undefined });
  return id;
}

export async function setNoteResolved(actor: Actor, noteId: string, resolved: boolean) {
  const db = await ready();
  const note = await db.select().from(s.editorialNotes).where(eq(s.editorialNotes.id, noteId)).get();
  if (!note) throw new NotFoundError("Note not found.");
  const row = await requireEntity(note.entityId);
  const mayResolve = atLeast(actor, "reviewer") || note.authorId === actor.id || row.authorId === actor.id;
  if (!mayResolve) throw new ForbiddenError();
  await db
    .update(s.editorialNotes)
    .set({ resolved, resolvedBy: resolved ? actor.id : null, resolvedAt: resolved ? new Date().toISOString() : null })
    .where(eq(s.editorialNotes.id, noteId));
  await audit(actor.id, "note_resolve", { type: "entity", id: note.entityId, label: row.title }, { noteId, resolved });
}

export async function notesFor(entityId: string) {
  const db = await ready();
  return db
    .select({ note: s.editorialNotes, author: s.users.name, authorRole: s.users.role })
    .from(s.editorialNotes)
    .leftJoin(s.users, eq(s.users.id, s.editorialNotes.authorId))
    .where(eq(s.editorialNotes.entityId, entityId))
    .orderBy(asc(s.editorialNotes.createdAt), asc(s.editorialNotes.id));
}

export async function openNoteCount(entityId: string) {
  const db = await ready();
  const r = await db
    .select({ n: sql<number>`count(*)` })
    .from(s.editorialNotes)
    .where(sql`${s.editorialNotes.entityId} = ${entityId} AND ${s.editorialNotes.resolved} = 0 AND ${s.editorialNotes.kind} != 'approval'`)
    .get();
  return Number(r?.n ?? 0);
}
