import "server-only";
/**
 * Corpus validation, run after each batch:
 *
 *  - data: duplicate keys, unknown references in prose ([[kind:slug]],
 *    [cite:…]), relationship endpoints and types, dates, required fields,
 *    unused sources, learning-path prerequisite order;
 *  - database: possible duplicates against everything already in the Atlas,
 *    the desk's structural checks (validateEntity), isolated entries, drafts
 *    leaking into public queries;
 *  - http (optional, against a running server): every entry renders in the
 *    authenticated collection preview, drafts 404 publicly, public search
 *    and pages do not contain draft material.
 */
import { createHash, randomBytes } from "node:crypto";
import { eq, inArray, sql } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { ALL_RELATIONSHIP_TYPES, entityHref, normaliseRelationship, RELATIONSHIP_TYPES, type EntityKind, type RelationshipType } from "@/lib/content/model";
import { extractCites, extractRefs } from "@/lib/content/markup";
import { fieldsFor } from "@/lib/editorial/fields";
import { validateEntity } from "@/lib/editorial/insight";
import { readWorkingFields } from "@/lib/editorial/content";
import { deskNeighborhood } from "@/lib/editorial/queries";
import { getEntityRow } from "@/lib/data/core";
import { search } from "@/lib/data/search";
import { corpusRows, parseKey, resolveKey } from "./ingest";
import type { Corpus, CorpusEntity, EntityKey } from "./types";

export interface CheckIssue {
  level: "error" | "warning" | "info";
  area: "data" | "duplicates" | "relationships" | "sources" | "dates" | "links" | "schema" | "graph" | "timeline" | "path" | "privacy" | "render";
  key?: string;
  message: string;
}

const norm = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/^(the|a|an)\s+/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

function allEntities(corpus: Corpus, upTo?: string) {
  const out: CorpusEntity[] = [];
  for (const b of corpus.batches) {
    out.push(...(b.entities ?? []));
    if (b.id === upTo) break;
  }
  return out;
}

function batchesUpTo(corpus: Corpus, upTo?: string) {
  const i = upTo ? corpus.batches.findIndex((b) => b.id === upTo) : corpus.batches.length - 1;
  return corpus.batches.slice(0, i + 1);
}

/** Static checks on the corpus data, resolved against the database for keys defined elsewhere. */
export async function checkData(corpus: Corpus, upTo?: string): Promise<CheckIssue[]> {
  const issues: CheckIssue[] = [];
  const batches = batchesUpTo(corpus, upTo);
  const entities = allEntities(corpus, upTo);
  const keys = new Map<string, CorpusEntity>();
  for (const e of entities) {
    if (keys.has(e.key)) issues.push({ level: "error", area: "data", key: e.key, message: "Entity defined twice in the corpus." });
    keys.set(e.key, e);
  }
  const known = async (key: string) => keys.has(key) || !!(await resolveKey(key as EntityKey));
  // Prose may link ahead to entries defined in later batches; structure may not.
  const laterKeys = new Set<string>([...allEntities(corpus).map((e) => e.key), ...(corpus.planned ?? [])]);
  const linkable = async (key: string) => laterKeys.has(key) || (await known(key));
  if (!upTo || upTo === corpus.batches.at(-1)?.id) {
    const defined = new Set(allEntities(corpus).map((e) => e.key));
    for (const k of corpus.planned ?? []) if (!defined.has(k)) issues.push({ level: "warning", area: "data", key: k, message: "Planned entry is not defined by any batch." });
  }

  // Sources
  const sources = new Map<string, { used: number }>();
  for (const b of batches) for (const src of b.sources ?? []) {
    if (sources.has(src.id)) issues.push({ level: "error", area: "sources", key: src.id, message: "Source defined twice." });
    sources.set(src.id, { used: 0 });
    if (!src.reuse) {
      if (!src.author) issues.push({ level: "warning", area: "sources", key: src.id, message: "Source has no author/editor." });
      if (!src.publicationDate) issues.push({ level: "warning", area: "sources", key: src.id, message: "Source has no date." });
      if (!src.url && !src.publisher) issues.push({ level: "warning", area: "sources", key: src.id, message: "Source has neither publisher nor URL." });
    }
  }
  const useSource = (id: string | undefined, where: string) => {
    if (!id) return;
    const s = sources.get(id);
    if (!s) issues.push({ level: "error", area: "sources", key: where, message: `Unknown source ${id}.` });
    else s.used++;
  };

  // Entities: fields, prose references, dates
  for (const e of entities) {
    const { kind } = parseKey(e.key);
    const defs = fieldsFor(kind);
    for (const name of Object.keys(e.fields)) {
      if (!defs.some((d) => d.name === name)) issues.push({ level: "error", area: "data", key: e.key, message: `Unknown field "${name}" for a ${kind}.` });
    }
    for (const d of defs) {
      if (d.required && d.name !== "title" && (e.fields[d.name] == null || e.fields[d.name] === "")) {
        issues.push({ level: "error", area: "data", key: e.key, message: `Required field "${d.label}" is empty.` });
      }
    }
    const prose = defs.filter((d) => d.type === "richtext").map((d) => String(e.fields[d.name] ?? ""));
    for (const r of extractRefs(...prose)) {
      const k = `${r.kind}:${r.slug}`;
      if (!(await linkable(k))) issues.push({ level: "error", area: "links", key: e.key, message: `Link to unknown entry [[${k}]].` });
      else if (!(await known(k))) issues.push({ level: "info", area: "links", key: e.key, message: `Links ahead to [[${k}]] (a later batch); it reads as plain text until then.` });
    }
    for (const c of extractCites(...prose)) useSource(c.source, e.key);
    for (const c of e.citations ?? []) useSource(c.source, e.key);
    const ys = e.fields.yearStart as number | null | undefined;
    const ye = e.fields.yearEnd as number | null | undefined;
    if (ys != null && ye != null && ye < ys) issues.push({ level: "error", area: "dates", key: e.key, message: `Ends (${ye}) before it starts (${ys}).` });
    if (["thinker", "text", "event"].includes(kind) && ys == null) issues.push({ level: "error", area: "timeline", key: e.key, message: "No year: it cannot be placed on the timeline." });
    if (kind === "thinker" && ys != null && ye != null && (ye - ys < 15 || ye - ys > 100)) issues.push({ level: "warning", area: "dates", key: e.key, message: `Implausible lifespan ${ys}–${ye}.` });
    if (kind === "concept" && !(e.fields.brief && e.fields.standard && e.fields.deep)) issues.push({ level: "warning", area: "data", key: e.key, message: "Concept lacks one of the three explanation depths." });
  }

  // Relationships
  const seen = new Set<string>();
  const years = new Map(entities.map((e) => [e.key, { start: e.fields.yearStart as number | null, end: e.fields.yearEnd as number | null }]));
  for (const b of batches) for (const r of b.relationships ?? []) {
    const label = `${r.from} ${r.type} ${r.to}`;
    if (!ALL_RELATIONSHIP_TYPES.includes(r.type)) issues.push({ level: "error", area: "relationships", key: label, message: "Unknown relationship type." });
    if (r.from === r.to) issues.push({ level: "error", area: "relationships", key: label, message: "Relationship to itself." });
    for (const k of [r.from, r.to]) if (!(await known(k))) issues.push({ level: "error", area: "relationships", key: label, message: `Unknown endpoint ${k}.` });
    const canon = normaliseRelationship(r.from, r.type, r.to);
    const id = `${canon.fromId}|${canon.type}|${canon.toId}`;
    if (seen.has(id)) issues.push({ level: "error", area: "relationships", key: label, message: "Duplicate relationship (after normalising inverse types)." });
    seen.add(id);
    if (!r.note.trim()) issues.push({ level: "error", area: "relationships", key: label, message: "Relationship has no explanation." });
    if (!r.source) issues.push({ level: r.basis === "interpretive" ? "info" : "warning", area: "relationships", key: label, message: "Relationship has no source." });
    useSource(r.source, label);
    // Chronology: an influence cannot run backwards in time.
    const type = canon.type as RelationshipType;
    if (["INFLUENCED", "DEVELOPED", "EXTENDED", "CRITIQUED", "RESPONDED_TO", "REJECTED"].includes(type)) {
      const a = years.get(canon.fromId as EntityKey);
      const z = years.get(canon.toId as EntityKey);
      if (a?.start != null && z?.end != null && parseKey(canon.toId as EntityKey).kind === "thinker" && a.start > z.end) {
        issues.push({ level: "warning", area: "dates", key: label, message: `Source of the relationship (${a.start}) post-dates the end of its target (${z.end}).` });
      }
    }
    if (RELATIONSHIP_TYPES[type]?.symmetric === undefined) issues.push({ level: "error", area: "relationships", key: label, message: "Type not in the registry." });
  }

  // Excerpts
  for (const b of batches) for (const x of b.excerpts ?? []) {
    useSource(x.source, x.key);
    if (!x.locator) issues.push({ level: "warning", area: "sources", key: x.key, message: "Quotation has no locator." });
    for (const k of [x.entity, x.speaker, x.text].filter(Boolean) as string[]) if (!(await known(k))) issues.push({ level: "error", area: "data", key: x.key, message: `Unknown entry ${k}.` });
  }

  // Debates
  for (const b of batches) for (const d of b.debates ?? []) {
    const props = new Set(d.propositions.map((p) => p.key));
    if (d.positions.length < 3) issues.push({ level: "info", area: "data", key: d.debate, message: `Only ${d.positions.length} positions.` });
    for (const p of d.positions) {
      for (const k of Object.keys(p.stances)) if (!props.has(k)) issues.push({ level: "error", area: "data", key: d.debate, message: `${p.label}: stance on unknown proposition ${k}.` });
      for (const k of [p.holder, ...(p.links ?? [])].filter(Boolean) as string[]) if (!(await known(k))) issues.push({ level: "error", area: "data", key: d.debate, message: `${p.label}: unknown entry ${k}.` });
    }
  }

  // Paths: prerequisites come first
  const presupposes = new Map<string, string[]>();
  for (const b of batches) for (const r of b.relationships ?? []) if (r.type === "PRESUPPOSES") presupposes.set(r.from, [...(presupposes.get(r.from) ?? []), r.to]);
  for (const b of batches) for (const p of b.paths ?? []) {
    const order = p.steps.map((s) => s.entity);
    order.forEach((k, i) => {
      for (const pre of presupposes.get(k) ?? []) {
        const j = order.indexOf(pre as EntityKey);
        if (j > i) issues.push({ level: "warning", area: "path", key: p.path, message: `${k} comes before its prerequisite ${pre}.` });
      }
    });
    for (const s of p.steps) for (const k of [s.entity, ...(s.branches ?? []).map((b) => b.entity)]) if (!(await known(k))) issues.push({ level: "error", area: "path", key: p.path, message: `Unknown step ${k}.` });
  }

  for (const [id, v] of sources) if (!v.used) issues.push({ level: "info", area: "sources", key: id, message: "Source is not cited anywhere yet." });
  return issues;
}

/** Checks against the database after an import. */
export async function checkDatabase(corpus: Corpus): Promise<CheckIssue[]> {
  const issues: CheckIssue[] = [];
  const db = await ready();
  const rows = await corpusRows(corpus.collection);
  const ids = new Set(rows.map((r) => r.id));
  const planned = corpus.planned ?? [];
  const everything = await db.select({ id: s.entities.id, kind: s.entities.kind, title: s.entities.title, aliases: s.entities.aliases }).from(s.entities);

  // Possible duplicates: same kind and a matching title or alias.
  const names = new Map<string, { id: string; title: string }[]>();
  for (const e of everything) {
    let aliases: string[] = [];
    try {
      aliases = JSON.parse(e.aliases);
    } catch {}
    for (const n of new Set([e.title, ...aliases].map(norm).filter((x) => x.length > 3))) {
      const k = `${e.kind}|${n}`;
      names.set(k, [...(names.get(k) ?? []), { id: e.id, title: e.title }]);
    }
  }
  for (const [k, list] of names) {
    const uniq = [...new Map(list.map((x) => [x.id, x])).values()];
    if (uniq.length > 1 && uniq.some((x) => ids.has(x.id))) {
      issues.push({ level: "warning", area: "duplicates", key: k.split("|")[1], message: `Possible duplicates: ${uniq.map((x) => `${x.title} (${x.id})`).join(", ")}.` });
    }
  }

  for (const row of rows) {
    const key = `${row.kind}:${row.slug}`;
    const fields = await readWorkingFields(row);
    for (const i of await validateEntity(row, fields)) {
      if (i.level === "info") continue;
      // Within an unpublished collection, links between its own entries are expected to be hidden until
      // they are published together, and links ahead to planned entries resolve when their batch is imported.
      if (i.code === "link-unpublished" || i.code === "relationship-unpublished") continue;
      if (i.code === "broken-link" && planned.some((p) => i.message.includes(`called “${p.split(":")[1]}”`))) {
        issues.push({ level: "info", area: "links", key, message: `${i.message} (planned for a later batch)` });
        continue;
      }
      issues.push({ level: i.level === "error" ? "error" : "warning", area: "schema", key, message: i.message });
    }
    const graph = await deskNeighborhood(row.id);
    if (graph.edges.length === 0 && row.kind !== "path") issues.push({ level: "warning", area: "graph", key, message: "No relationships: the entry is isolated on the map." });
    if (["thinker", "text", "event"].includes(row.kind) && fields.yearStart == null) issues.push({ level: "error", area: "timeline", key, message: "No year." });

    // Privacy: an unpublished entry must be invisible to public queries.
    const pub = await getEntityRow(row.kind as EntityKind, row.slug);
    if (!row.live && pub) issues.push({ level: "error", area: "privacy", key, message: "Draft is returned by a public query." });
    if (row.live && pub && fields.summary && pub.summary === fields.summary && row.revision > (row.publishedRevision ?? 0)) {
      issues.push({ level: "error", area: "privacy", key, message: "The pending summary is already public." });
    }
  }

  // Public search must not return drafts.
  for (const row of rows.filter((r) => !r.live).slice(0, 80)) {
    const res = await search(row.title, { limit: 30 });
    if (JSON.stringify(res).includes(`"${row.id}"`)) issues.push({ level: "error", area: "privacy", key: `${row.kind}:${row.slug}`, message: "Draft appears in public search." });
  }
  // Nothing the import wrote may be public: on live entries its structure must be staged, and it must
  // not have edited records it did not create.
  const importer = await db.select({ id: s.users.id }).from(s.users).where(eq(s.users.email, "research-import@atlas.invalid")).get();
  if (importer) {
    const leaks = (await db.all(sql`
      SELECT 'relationship' AS kind, r.id FROM relationships r JOIN entities a ON a.id = r.from_id JOIN entities b ON b.id = r.to_id
        WHERE r.created_by = ${importer.id} AND r.staged_for IS NULL AND a.live = 1 AND b.live = 1
      UNION ALL SELECT 'excerpt', x.id FROM excerpts x JOIN entities e ON e.id = x.entity_id
        WHERE x.created_by = ${importer.id} AND x.staged_for IS NULL AND e.live = 1
    `)) as { kind: string; id: string }[];
    for (const l of leaks) issues.push({ level: "error", area: "privacy", key: l.id, message: `Import-created ${l.kind} is public on a live entry.` });
    const edits = (await db.all(sql`
      SELECT a.metadata FROM audit_log a WHERE a.actor_id = ${importer.id} AND a.action = 'excerpt_edit'
    `)) as { metadata: string }[];
    for (const e of edits) {
      const exId = (JSON.parse(e.metadata) as { excerptId?: string }).excerptId;
      const x = exId ? await db.select().from(s.excerpts).where(eq(s.excerpts.id, exId)).get() : null;
      if (x && x.createdBy !== importer.id) issues.push({ level: "warning", area: "privacy", key: exId, message: "The import edited an excerpt it did not create (check it has been restored)." });
    }
  }
  // Staged structure must not be counted as public.
  const stagedRels = await db.select({ id: s.relationships.id }).from(s.relationships).where(inArray(s.relationships.stagedFor, [...ids]));
  if (stagedRels.length) issues.push({ level: "info", area: "relationships", message: `${stagedRels.length} relationships are staged on live entries and wait for their publication.` });
  return issues;
}

/**
 * Render checks against a running server, with a short-lived session for a
 * desk user (who must be active and a reviewer or above). The session is
 * deleted afterwards.
 */
export async function checkHttp(corpus: Corpus, baseUrl: string, email: string): Promise<CheckIssue[]> {
  const issues: CheckIssue[] = [];
  const db = await ready();
  const user = await db.select().from(s.users).where(eq(s.users.email, email)).get();
  if (!user || !user.active) return [{ level: "error", area: "render", message: `No active desk user ${email}.` }];
  const token = randomBytes(32).toString("base64url");
  const sid = createHash("sha256").update(token).digest("hex");
  await db.insert(s.sessions).values({ id: sid, userId: user.id, expiresAt: new Date(Date.now() + 3600_000).toISOString() });
  const get = (url: string, auth = false) => fetch(baseUrl + url, { headers: auth ? { cookie: `atlas_session=${token}` } : {}, redirect: "manual" });
  try {
    const rows = await corpusRows(corpus.collection);
    const q = `with=${encodeURIComponent(corpus.collection)}`;
    for (const row of rows) {
      const key = `${row.kind}:${row.slug}`;
      const preview = await get(`/preview/${row.id}?${q}`, true);
      const html = await preview.text();
      // A live entry's pending title lives in its working copy, not in the table.
      const title = String((await readWorkingFields(row)).title ?? row.title);
      if (preview.status !== 200) issues.push({ level: "error", area: "render", key, message: `Preview returned ${preview.status}.` });
      else if (!html.includes(title.replace(/&/g, "&amp;").replace(/'/g, "&#x27;").replace(/"/g, "&quot;").slice(0, 20)) && !html.includes(title.slice(0, 20))) {
        issues.push({ level: "warning", area: "render", key, message: "Preview does not show the title." });
      }
      const pub = await get(entityHref(row.kind as EntityKind, row.slug));
      if (!row.live && pub.status !== 404) issues.push({ level: "error", area: "privacy", key, message: `Public page answered ${pub.status} for a draft.` });
    }
    // Public search for every draft title.
    for (const row of rows.filter((r) => !r.live)) {
      const res = await get(`/api/search?q=${encodeURIComponent(row.title)}`);
      const body = await res.text();
      if (body.includes(row.id)) issues.push({ level: "error", area: "privacy", key: `${row.kind}:${row.slug}`, message: "Draft returned by /api/search." });
    }
    // Public timeline and home must not mention drafts.
    const pages = await Promise.all(["/", "/timeline", "/explore", "/thinkers", "/concepts", "/texts", "/debates", "/paths"].map(async (u) => [u, await (await get(u)).text()] as const));
    for (const row of rows.filter((r) => !r.live && r.title.length > 6)) {
      for (const [u, html] of pages) if (html.includes(`/preview/${row.id}`) || html.includes(`"${row.id}"`)) issues.push({ level: "error", area: "privacy", key: `${row.kind}:${row.slug}`, message: `Draft id found on ${u}.` });
    }
  } finally {
    await db.delete(s.sessions).where(eq(s.sessions.id, sid));
  }
  return issues;
}
