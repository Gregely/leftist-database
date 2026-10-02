import "server-only";
/**
 * Corpus import. Writes a research corpus into the Atlas through the
 * editorial library — the desk's own functions — so every record gets the
 * same validation, revisions, staging, search indexing and audit entries as
 * work done by hand. Nothing is published: new entries are drafts, existing
 * live entries receive a pending new version with staged structure, and
 * (with `submit`) everything is sent to the review queue.
 *
 * Imports are idempotent: unchanged sections are skipped (each import records
 * a fingerprint per entry in the audit log), so re-running after fixing the
 * data only touches what changed.
 */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { and, desc, eq, sql } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { generatePassword, hashPassword } from "@/lib/auth/password";
import { isEntityKind, type EntityKind } from "@/lib/content/model";
import { audit } from "@/lib/editorial/audit";
import { parseTags, setTags } from "@/lib/editorial/collections";
import { coerceValues, createEntity, loadEntity, readWorkingFields, saveContent, transition } from "@/lib/editorial/content";
import { updateMedia, uploadMedia } from "@/lib/editorial/media";
import { addNote } from "@/lib/editorial/notes";
import type { Actor } from "@/lib/editorial/permissions";
import { createSource, updateSource } from "@/lib/editorial/sources";
import {
  addArgument,
  addCitation,
  addExcerpt,
  addProposition,
  addStep,
  attachMedia,
  citationsFor,
  excerptsFor,
  linkPosition,
  resetStructure,
  savePosition,
  setStances,
  updateExcerpt,
  upsertRelationship,
} from "@/lib/editorial/structure";
import { newId } from "@/lib/util/id";
import type { Corpus, CorpusBatch, CorpusEntity, EntityKey, Flag, FlagType, VerificationRecord } from "./types";

export const IMPORT_USER = { email: "research-import@atlas.invalid", name: "Atlas research import" };

export const FLAG_LABELS: Record<FlagType, string> = {
  "missing-source": "Missing source",
  disputed: "Disputed interpretation",
  "unverified-quotation": "Unverified quotation",
  "uncertain-relationship": "Uncertain relationship",
  "incomplete-metadata": "Incomplete metadata",
  "possible-duplicate": "Possible duplicate",
  "specialist-review": "Specialist review recommended",
  "sample-overlap": "Replaces sample content",
};

type Log = (line: string) => void;

/**
 * The account imports are recorded under. It is an editor (imports amend
 * existing entries and stage structure) but cannot sign in: it is inactive
 * and its password is random and never shown.
 */
export async function importActor(): Promise<Actor> {
  const db = await ready();
  const found = await db.select().from(s.users).where(eq(s.users.email, IMPORT_USER.email)).get();
  if (found) return { id: found.id, role: "editor", name: found.name, email: found.email };
  const id = newId("usr");
  await db.insert(s.users).values({ id, email: IMPORT_USER.email, name: IMPORT_USER.name, role: "editor", active: false, passwordHash: await hashPassword(generatePassword()) });
  return { id, role: "editor", name: IMPORT_USER.name, email: IMPORT_USER.email };
}

export function parseKey(key: EntityKey): { kind: EntityKind; slug: string } {
  const [kind, slug] = key.split(":") as [string, string];
  if (!isEntityKind(kind) || !slug) throw new Error(`Bad entity key: ${key}`);
  return { kind, slug };
}

/** The entry an entity key names (by current slug, then by former slugs). */
export async function resolveKey(key: EntityKey): Promise<s.EntityRow | null> {
  const { kind, slug } = parseKey(key);
  const db = await ready();
  const row = await db.select().from(s.entities).where(and(eq(s.entities.kind, kind), eq(s.entities.slug, slug))).get();
  if (row) return row;
  const moved = await db.select().from(s.slugHistory).where(and(eq(s.slugHistory.kind, kind), eq(s.slugHistory.slug, slug))).get();
  return moved ? ((await loadEntity(moved.entityId)) ?? null) : null;
}

async function requireKey(key: EntityKey) {
  const row = await resolveKey(key);
  if (!row) throw new Error(`No entry for ${key}. Is it defined in this or an earlier batch?`);
  return row;
}

const fingerprint = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex").slice(0, 16);

/** Has this exact section already been imported for the entry? */
async function alreadyImported(entityId: string, section: string, hash: string) {
  const db = await ready();
  const rows = await db
    .select({ metadata: s.auditLog.metadata })
    .from(s.auditLog)
    .where(and(eq(s.auditLog.action, "import"), eq(s.auditLog.targetId, entityId)))
    .orderBy(desc(s.auditLog.createdAt))
    .limit(50);
  for (const r of rows) {
    try {
      const m = JSON.parse(r.metadata) as { section?: string; hash?: string };
      if (m.section === section) return m.hash === hash;
    } catch {
      /* ignore */
    }
  }
  return false;
}

async function recordImport(actor: Actor, row: s.EntityRow, section: string, hash: string, collection: string) {
  await audit(actor.id, "import", { type: "entity", id: row.id, label: row.title }, { section, hash, collection });
}

export interface ImportOptions {
  /** Only these batches (by id); earlier batches are assumed imported. Default: all. */
  batches?: string[];
  /** Send every touched entry to the review queue. */
  submit?: boolean;
  log?: Log;
}

export interface ImportSummary {
  created: string[];
  amended: string[];
  unchanged: string[];
  sources: { created: number; updated: number; reused: number };
  relationships: number;
  citations: number;
  excerpts: number;
  media: number;
  notes: number;
  submitted: number;
}

export async function importCorpus(corpus: Corpus, opts: ImportOptions = {}): Promise<ImportSummary> {
  const log = opts.log ?? (() => {});
  const actor = await importActor();
  const verification = await loadVerification(corpus);
  const summary: ImportSummary = { created: [], amended: [], unchanged: [], sources: { created: 0, updated: 0, reused: 0 }, relationships: 0, citations: 0, excerpts: 0, media: 0, notes: 0, submitted: 0 };
  const touched = new Set<string>();
  const batches = opts.batches?.length ? corpus.batches.filter((b) => opts.batches!.includes(b.id)) : corpus.batches;
  for (const batch of batches) {
    log(`— ${batch.id}: ${batch.title}`);
    await importBatch(corpus, batch, actor, verification, summary, touched, log);
  }
  if (opts.submit) {
    for (const id of touched) {
      const row = (await loadEntity(id))!;
      if (!["draft", "revision_requested", "rejected"].includes(row.status)) continue;
      await transition(actor, id, "submit", {
        note: `${corpus.collection}: research import, awaiting human review. Internal notes on this entry list what needs checking (sources, disputed readings, quotations).`,
      });
      summary.submitted++;
    }
  }
  return summary;
}

async function importBatch(
  corpus: Corpus,
  batch: CorpusBatch,
  actor: Actor,
  verification: VerificationRecord | null,
  summary: ImportSummary,
  touched: Set<string>,
  log: Log,
) {
  const db = await ready();

  /* Sources ------------------------------------------------------------- */
  for (const src of batch.sources ?? []) {
    const existing = await db.select().from(s.sources).where(eq(s.sources.id, src.id)).get();
    if (src.reuse) {
      if (!existing) throw new Error(`Source ${src.id} is marked for reuse but does not exist.`);
      summary.sources.reused++;
      continue;
    }
    const { id, reuse: _r, check: _c, ...fields } = src;
    void _r;
    void _c;
    const input = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v == null ? "" : String(v)]));
    if (!existing) {
      await createSource(actor, input, { id });
      summary.sources.created++;
    } else if (existing.createdBy === actor.id) {
      const changed = Object.entries(input).some(([k, v]) => String((existing as Record<string, unknown>)[k] ?? "") !== v);
      if (changed) {
        await updateSource(actor, id, input);
        summary.sources.updated++;
      }
    } else {
      log(`  ! source ${id} exists and was not created by this import — left unchanged`);
    }
  }

  /* Entities ------------------------------------------------------------ */
  for (const e of batch.entities ?? []) {
    const row = await importEntity(corpus, e, actor, summary, log);
    touched.add(row.id);
  }

  /* Relationships --------------------------------------------------------- */
  for (const r of batch.relationships ?? []) {
    const [from, to] = await Promise.all([requireKey(r.from), requireKey(r.to)]);
    const context = r.on ? await requireKey(r.on) : from;
    const contextId = [from.id, to.id].includes(context.id) ? context.id : from.id;
    await upsertRelationship(actor, contextId, {
      fromId: from.id,
      type: r.type,
      toId: to.id,
      note: r.note,
      context: [r.context, r.basis === "interpretive" ? "Interpretive: this relationship is a reading of the evidence, not a documented exchange." : ""].filter(Boolean).join("\n\n"),
      sourceId: r.source ?? null,
      locator: r.locator ?? null,
      yearStart: r.yearStart ?? null,
      yearEnd: r.yearEnd ?? null,
      weight: r.weight ?? 2,
    });
    summary.relationships++;
    touched.add(contextId);
    if (r.flag) summary.notes += await flagNote(actor, contextId, { ...r.flag, note: `${from.title} — ${r.type} — ${to.title}: ${r.flag.note}` });
  }

  /* Excerpts --------------------------------------------------------------- */
  for (const x of batch.excerpts ?? []) {
    const entity = await requireKey(x.entity);
    const [speaker, text] = await Promise.all([x.speaker ? requireKey(x.speaker) : null, x.text ? requireKey(x.text) : null]);
    const check = verification?.quotes[x.key];
    const matched = !!check?.matched;
    const note = [
      x.note ?? "",
      matched
        ? `Wording matched verbatim (whitespace-normalised) to ${x.archiveUrl} on ${verification!.checkedAt.slice(0, 10)}${check?.provenance ? ` — transcription of: ${check.provenance}` : ""}. Check against the printed edition before marking verified.`
        : `Not matched against ${x.archiveUrl}${check ? ` (${check.detail ?? "no match"})` : " (not yet checked)"}.`,
    ]
      .filter(Boolean)
      .join(" ");
    const verificationStatus = matched ? "needs_review" : "unverified";
    const sameWording = (await excerptsFor(entity.id)).filter((r) => r.body === x.body.trim());
    // Only the import's own excerpts are updated. An excerpt someone else made (for example a public
    // sample excerpt) is never modified: changing it would change the public site immediately.
    const existing = sameWording.find((r) => r.createdBy === actor.id);
    const foreign = sameWording.find((r) => r.createdBy !== actor.id);
    if (!existing && foreign) {
      summary.notes += await flagNote(actor, entity.id, {
        type: "sample-overlap",
        note: `An existing excerpt (${foreign.id}) already has the wording “${x.body.slice(0, 60)}…”. The research import left it unchanged and did not add a duplicate. Its verification: ${matched ? `matches ${x.archiveUrl}` : "not matched"}; locator suggested: ${x.locator ?? "—"}.`,
      });
      touched.add(entity.id);
      continue;
    }
    if (existing) {
      if (existing.note !== note || existing.verification !== verificationStatus || existing.locator !== (x.locator ?? null)) {
        await updateExcerpt(actor, existing.id, { note, verification: verificationStatus, locator: x.locator ?? "" });
      }
    } else {
      await addExcerpt(actor, entity.id, {
        body: x.body,
        sourceId: x.source,
        textId: text?.id ?? null,
        speakerId: speaker?.id ?? null,
        locator: x.locator ?? "",
        note,
        verification: verificationStatus,
      });
      summary.excerpts++;
    }
    if (!matched) {
      summary.notes += await flagNote(actor, entity.id, { type: "unverified-quotation", note: `“${x.body.slice(0, 80)}…” could not be matched to its archive transcription. Check the wording against an edition before publishing.` });
    }
    touched.add(entity.id);
  }

  /* Debates ---------------------------------------------------------------- */
  for (const d of batch.debates ?? []) {
    const row = await requireKey(d.debate);
    touched.add(row.id);
    const hash = fingerprint(d);
    if (await alreadyImported(row.id, "debate-structure", hash)) continue;
    await resetStructure(actor, row.id);
    const props = new Map<string, string>();
    for (const p of d.propositions) props.set(p.key, await addProposition(actor, row.id, p.statement));
    const positions = new Map<string, string>();
    for (const p of d.positions) {
      const holder = p.holder ? await requireKey(p.holder) : null;
      const id = await savePosition(actor, row.id, null, {
        label: p.label,
        holderId: holder?.id,
        centralClaim: p.centralClaim,
        summary: p.summary,
        assumptions: (p.assumptions ?? []).join("\n"),
        criticisms: (p.criticisms ?? []).join("\n"),
      });
      positions.set(p.key, id);
      for (const link of p.links ?? []) await linkPosition(actor, row.id, id, (await requireKey(link)).id);
    }
    await setStances(
      actor,
      row.id,
      d.positions.flatMap((p) =>
        Object.entries(p.stances).map(([prop, [stance, note]]) => {
          if (!props.has(prop)) throw new Error(`${d.debate}: unknown proposition ${prop}`);
          return { positionId: positions.get(p.key)!, propositionId: props.get(prop)!, stance, note };
        }),
      ),
    );
    const args = new Map<string, string>();
    for (const a of d.arguments ?? []) {
      args.set(
        a.key,
        await addArgument(actor, row.id, {
          kind: a.kind,
          positionId: a.position ? positions.get(a.position) : undefined,
          respondsToId: a.respondsTo ? args.get(a.respondsTo) : undefined,
          body: a.body,
        }),
      );
    }
    await recordImport(actor, row, "debate-structure", hash, corpus.collection);
  }

  /* Paths ------------------------------------------------------------------ */
  for (const p of batch.paths ?? []) {
    const row = await requireKey(p.path);
    touched.add(row.id);
    const hash = fingerprint(p);
    if (await alreadyImported(row.id, "path-steps", hash)) continue;
    await resetStructure(actor, row.id);
    for (const step of p.steps) {
      const stepId = await addStep(actor, row.id, { entityId: (await requireKey(step.entity)).id, framing: step.framing });
      for (const b of step.branches ?? []) {
        await addStep(actor, row.id, { entityId: (await requireKey(b.entity)).id, framing: b.framing, track: b.track ?? "branch", parentStepId: stepId });
      }
    }
    await recordImport(actor, row, "path-steps", hash, corpus.collection);
  }

  /* Media ------------------------------------------------------------------ */
  for (const m of batch.media ?? []) {
    const bytes = await readFile(path.join(process.cwd(), corpus.dir, "media", m.file));
    const { id } = await uploadMedia(actor, { name: m.file, bytes: new Uint8Array(bytes) }, {});
    const db = await ready();
    const existing = await db.select({ uploadedBy: s.media.uploadedBy, title: s.media.title }).from(s.media).where(eq(s.media.id, id)).get();
    if (existing && existing.uploadedBy !== actor.id) {
      // The same file is already in the library under someone else's record (possibly public):
      // never rewrite its metadata — attach it and ask a human to reconcile the details.
      for (const a of m.attach) {
        const row = await requireKey(a.entity);
        await attachMedia(actor, row.id, id, a.role, a.caption ?? "");
        summary.notes += await flagNote(actor, row.id, { type: "sample-overlap", note: `The image “${m.title}” is identical to the existing library item “${existing.title}”, whose metadata was left unchanged. Check its credit and licence against: ${m.sourceText}` });
        touched.add(row.id);
      }
      summary.media++;
      continue;
    }
    await updateMedia(actor, id, {
      title: m.title,
      altText: m.altText,
      caption: m.caption,
      creator: m.creator ?? "",
      credit: m.credit,
      sourceText: m.sourceText,
      license: m.license,
      rights: m.rights ?? "",
      year: m.year ?? "",
    });
    for (const a of m.attach) {
      const row = await requireKey(a.entity);
      await attachMedia(actor, row.id, id, a.role, a.caption ?? "");
      if (m.flag) summary.notes += await flagNote(actor, row.id, { ...m.flag, note: `Image “${m.title}”: ${m.flag.note}` });
      touched.add(row.id);
    }
    summary.media++;
  }
}

async function importEntity(corpus: Corpus, e: CorpusEntity, actor: Actor, summary: ImportSummary, log: Log) {
  const { kind, slug } = parseKey(e.key);
  let row = await resolveKey(e.key);
  const created = !row;
  if (!row) {
    const id = await createEntity(actor, kind, { title: e.title });
    row = (await loadEntity(id))!;
  }
  const input: Record<string, unknown> = { isSample: false, ...e.fields, title: e.title, slug };
  const before = await readWorkingFields(row);
  const after = coerceValues(kind, input, before);
  const changed = Object.keys(after).some((k) => (after[k] ?? "") !== (before[k] ?? ""));
  if (changed) {
    await saveContent(actor, row.id, row.lockVersion, input, { message: `${corpus.collection} — research import` });
    (created ? summary.created : summary.amended).push(e.key);
    log(`  ${created ? "+" : "~"} ${e.key}`);
  } else summary.unchanged.push(e.key);
  row = (await loadEntity(row.id))!;

  const tags = parseTags(row.editorialTags);
  if (!tags.includes(corpus.collection)) await setTags(actor, row.id, [...tags, corpus.collection]);

  // Citations: add what is missing (matched on source, locator and field).
  const existing = await citationsFor(row.id);
  for (const c of e.citations ?? []) {
    const has = existing.some((x) => x.c.sourceId === c.source && (x.c.locator ?? "") === (c.locator ?? "") && (x.c.field ?? "") === (c.field ?? ""));
    if (has) continue;
    await addCitation(actor, row.id, { sourceId: c.source, locator: c.locator, field: c.field, note: c.note });
    summary.citations++;
  }
  for (const f of e.flags ?? []) summary.notes += await flagNote(actor, row.id, f);
  return (await loadEntity(row.id))!;
}

/** An internal editorial note for a flag (once). Returns 1 if a note was added. */
async function flagNote(actor: Actor, entityId: string, f: Flag) {
  const body = `[${FLAG_LABELS[f.type]}] ${f.note}`;
  const db = await ready();
  const dupe = await db
    .select({ id: s.editorialNotes.id })
    .from(s.editorialNotes)
    .where(and(eq(s.editorialNotes.entityId, entityId), eq(s.editorialNotes.body, body)))
    .get();
  if (dupe) return 0;
  await addNote(actor, entityId, { body, field: f.field });
  return 1;
}

async function loadVerification(corpus: Corpus): Promise<VerificationRecord | null> {
  try {
    return JSON.parse(await readFile(path.join(process.cwd(), corpus.dir, "verification.json"), "utf8")) as VerificationRecord;
  } catch {
    return null;
  }
}

/** All entries carrying the corpus collection label. */
export async function corpusRows(collection: string) {
  const db = await ready();
  return db
    .select()
    .from(s.entities)
    .where(sql`EXISTS (SELECT 1 FROM json_each(${s.entities.editorialTags}) WHERE json_each.value = ${collection})`);
}
