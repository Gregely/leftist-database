import "server-only";
/**
 * The human review summary for a corpus, generated from the database:
 * every entry, its editorial state, and what needs a person's attention
 * (the flags recorded as internal notes, structural checks, quotations
 * awaiting verification, sources still missing).
 */
import { and, eq, inArray, sql } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { KINDS, STATUS_LABELS, VERIFICATION_LABELS, type EntityKind, type WorkflowStatus } from "@/lib/content/model";
import { readWorkingFields } from "@/lib/editorial/content";
import { validateEntity } from "@/lib/editorial/insight";
import type { CheckIssue } from "./check";
import { corpusRows, FLAG_LABELS } from "./ingest";
import type { Corpus, FlagType } from "./types";

const KIND_ORDER: EntityKind[] = ["thinker", "concept", "text", "tendency", "debate", "event", "path"];

export async function buildReport(corpus: Corpus, checks: CheckIssue[] = []): Promise<string> {
  const db = await ready();
  const rows = (await corpusRows(corpus.collection)).sort((a, b) => KIND_ORDER.indexOf(a.kind as EntityKind) - KIND_ORDER.indexOf(b.kind as EntityKind) || a.title.localeCompare(b.title));
  const ids = rows.map((r) => r.id);
  const [notes, excerpts, rels, cites, sources] = await Promise.all([
    ids.length ? db.select().from(s.editorialNotes).where(and(inArray(s.editorialNotes.entityId, ids), eq(s.editorialNotes.resolved, false))) : [],
    ids.length ? db.select().from(s.excerpts).where(inArray(s.excerpts.entityId, ids)) : [],
    ids.length ? db.select().from(s.relationships).where(sql`${s.relationships.fromId} IN ${ids} OR ${s.relationships.toId} IN ${ids}`) : [],
    ids.length ? db.select().from(s.citations).where(inArray(s.citations.entityId, ids)) : [],
    db.select({ id: s.sources.id, title: s.sources.title, createdBy: s.sources.createdBy }).from(s.sources),
  ]);
  const importer = (await db.select().from(s.users).where(eq(s.users.email, "research-import@atlas.invalid")).get())?.id;
  const corpusSources = sources.filter((x) => x.createdBy === importer);
  const corpusRels = rels.filter((r) => r.createdBy === importer);

  const flagOf = (body: string) => (Object.entries(FLAG_LABELS).find(([, l]) => body.startsWith(`[${l}]`))?.[0] as FlagType | undefined) ?? null;
  const count = <T,>(xs: T[], f: (x: T) => boolean) => xs.filter(f).length;
  const byKind = Object.fromEntries(KIND_ORDER.map((k) => [k, rows.filter((r) => r.kind === k)]));
  const statuses = new Map<string, number>();
  for (const r of rows) statuses.set(r.status, (statuses.get(r.status) ?? 0) + 1);

  const flagged = new Map<string, { type: FlagType | null; field: string | null; body: string }[]>();
  for (const n of notes) {
    if (n.kind === "approval") continue;
    flagged.set(n.entityId, [...(flagged.get(n.entityId) ?? []), { type: flagOf(n.body), field: n.field, body: n.body }]);
  }
  const issuesById = new Map<string, { level: string; message: string }[]>();
  for (const r of rows) {
    const list = (await validateEntity(r, await readWorkingFields(r))).filter((i) => i.level !== "info");
    issuesById.set(r.id, list);
  }
  const ready_ = rows.filter((r) => !(flagged.get(r.id)?.length) && !(issuesById.get(r.id) ?? []).some((i) => i.level === "error"));

  const L: string[] = [];
  L.push(`# ${corpus.collection} — review summary`, "");
  L.push(`Generated ${new Date().toISOString().slice(0, 10)} from the database by \`npm run corpus -- report\`. Every entry below is **unpublished**: new entries are drafts, and entries that already existed as public sample records have a pending new version whose text and structure stay off the public site until an editor publishes them. Read them in the desk, or as a connected whole in the collection preview (Preview → *Include unpublished “${corpus.collection}” entries*).`, "");
  L.push("## Totals", "");
  L.push("| | Count |", "| --- | --- |");
  for (const k of KIND_ORDER) L.push(`| ${KINDS[k].plural} | ${byKind[k].length} (${count(byKind[k], (r) => !r.isSample && r.publishedRevision == null)} new, ${count(byKind[k], (r) => r.publishedRevision != null)} amending existing sample entries) |`);
  L.push(`| Sources catalogued by the corpus | ${corpusSources.length} (plus ${new Set(cites.map((c) => c.sourceId)).size - corpusSources.filter((x) => cites.some((c) => c.sourceId === x.id)).length} existing records reused) |`);
  L.push(`| Relationships recorded by the corpus | ${corpusRels.length} (${count(corpusRels, (r) => !!r.sourceId)} with a source) |`);
  L.push(`| Citations on corpus entries | ${cites.length} |`);
  L.push(`| Excerpts | ${excerpts.length} — ${Object.entries(VERIFICATION_LABELS).map(([k, l]) => `${count(excerpts, (x) => x.verification === k)} ${l.toLowerCase()}`).join(", ")} |`);
  L.push("");
  L.push("## Editorial state", "");
  L.push("| State | Entries |", "| --- | --- |");
  for (const [st, n] of statuses) L.push(`| ${STATUS_LABELS[st as WorkflowStatus] ?? st} | ${n} |`);
  L.push(`| Flagged for human attention | ${count(rows, (r) => (flagged.get(r.id)?.length ?? 0) > 0)} |`);
  L.push(`| No flags and no structural errors (ready for an editor's read) | ${ready_.length} |`);
  L.push("", "Nothing in this corpus is ready for publication without a human review: the research import cannot approve its own work.", "");

  L.push("## Flags by type", "");
  const types = Object.keys(FLAG_LABELS) as FlagType[];
  L.push("| Flag | Entries |", "| --- | --- |");
  for (const t of types) {
    const n = rows.filter((r) => flagged.get(r.id)?.some((f) => f.type === t)).length;
    if (n) L.push(`| ${FLAG_LABELS[t]} | ${n} |`);
  }
  L.push("");

  L.push("## Review queue", "", "Each entry with what needs checking. Notes are internal (Review tab of the entry) and never public.", "");
  for (const k of KIND_ORDER) {
    if (!byKind[k].length) continue;
    L.push(`### ${KINDS[k].plural}`, "");
    for (const r of byKind[k]) {
      const fl = flagged.get(r.id) ?? [];
      const iss = issuesById.get(r.id) ?? [];
      const xs = excerpts.filter((x) => x.entityId === r.id);
      const state = `${STATUS_LABELS[r.status as WorkflowStatus] ?? r.status}${r.live ? " · live sample version unchanged, new version pending" : " · draft, not public"}`;
      L.push(`- **${r.title}** (\`${r.id}\`) — ${state}`);
      for (const f of fl) L.push(`  - ${f.body}${f.field ? ` _(field: ${f.field})_` : ""}`);
      for (const i of iss) L.push(`  - [Check · ${i.level}] ${i.message}`);
      for (const x of xs.filter((x) => x.body && x.verification !== "verified")) L.push(`  - [Quotation · ${VERIFICATION_LABELS[x.verification as keyof typeof VERIFICATION_LABELS]}] “${x.body.slice(0, 90)}${x.body.length > 90 ? "…" : ""}”`);
      if (!fl.length && !iss.length && !xs.some((x) => x.body && x.verification !== "verified")) L.push("  - No flags. Read for accuracy and balance before approving.");
    }
    L.push("");
  }

  if (checks.length) {
    L.push("## Automated checks", "");
    const order = { error: 0, warning: 1, info: 2 };
    for (const c of [...checks].sort((a, b) => order[a.level] - order[b.level])) L.push(`- **${c.level}** · ${c.area}${c.key ? ` · ${c.key}` : ""} — ${c.message}`);
    L.push("");
  }
  return L.join("\n");
}
