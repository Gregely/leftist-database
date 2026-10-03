/**
 * Research corpora: import, verify, check and report.
 *
 *   npm run corpus -- verify  [corpus]                    online checks → <dir>/verification.json
 *   npm run corpus -- media   [corpus]                    download missing image files into <dir>/media
 *   npm run corpus -- import  [corpus] [--batch id …] [--submit]
 *   npm run corpus -- check   [corpus] [--batch id] [--http http://localhost:3000 --as editor@…]
 *   npm run corpus -- report  [corpus] [--http … --as …]   → docs/corpus/<corpus>-review.md
 *   npm run corpus -- setup                                 migrate, then import every corpus not yet in this
 *                                                           database, in dependency order, submitted for review
 *
 * Imports go through the editorial library (lib/editorial/*) under an
 * inactive "research import" account; nothing is ever published.
 */
import { writeFile } from "node:fs/promises";
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/libsql/migrator";
import { CORPORA } from "../corpus";
import { ready } from "../src/lib/db/client";
import { checkData, checkDatabase, checkHttp, type CheckIssue } from "../src/lib/corpus/check";
import { importCorpus, importState, resolveKey, type ImportSummary } from "../src/lib/corpus/ingest";
import type { Corpus } from "../src/lib/corpus/types";
import { buildReport } from "../src/lib/corpus/report";
import { downloadMedia, verifyCorpus } from "../src/lib/corpus/verify";

const args = process.argv.slice(2);
const command = args[0];
const name = args[1] && !args[1].startsWith("--") ? args[1] : "initial-marx";
const opt = (flag: string) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const opts = (flag: string) => args.flatMap((a, i) => (a === flag ? [args[i + 1]] : []));

function print(issues: CheckIssue[]) {
  const order = { error: 0, warning: 1, info: 2 };
  for (const i of [...issues].sort((a, b) => order[a.level] - order[b.level])) console.log(`${i.level.padEnd(7)} ${i.area.padEnd(13)} ${i.key ?? ""} — ${i.message}`);
  const n = (l: string) => issues.filter((i) => i.level === l).length;
  console.log(`\n${n("error")} errors, ${n("warning")} warnings, ${n("info")} notes`);
  return n("error");
}

function summarise(s: ImportSummary) {
  console.log(
    `\nCreated ${s.created.length}, amended ${s.amended.length}, unchanged ${s.unchanged.length}; ` +
      `sources +${s.sources.created} ~${s.sources.updated} (reused ${s.sources.reused}); ` +
      `relationships ${s.relationships}, citations +${s.citations}, excerpts +${s.excerpts}, media ${s.media}${s.mediaMissing ? ` (${s.mediaMissing} not downloaded yet)` : ""}, notes +${s.notes}, submitted ${s.submitted}.`,
  );
}

/** Refuse to import a corpus whose prerequisites are not fully in the database. */
async function requirePrerequisites(corpusName: string, corpus: Corpus) {
  for (const dep of corpus.requires ?? []) {
    const state = await importState(CORPORA[dep]);
    if (state.present.length < state.defined)
      throw new Error(`${corpusName} links to entries of ${dep}, which is not fully imported (${state.present.length} of ${state.defined}). Run \`npm run corpus -- setup\`.`);
  }
}

async function validData(corpus: Corpus, batch?: string) {
  const errors = (await checkData(corpus, batch)).filter((e) => e.level === "error");
  if (errors.length) {
    print(errors);
    throw new Error("The corpus data has errors; nothing was imported.");
  }
}

/**
 * Bring a database up to date with the committed corpora: apply migrations,
 * then import each corpus that is not in the database yet, prerequisites
 * first, and submit it for review. A corpus that is already present is left
 * exactly as it is (editors may have changed it since), and a partly present
 * one stops the run rather than being overwritten. Nothing is published,
 * deleted or seeded.
 */
async function setup() {
  const db = await ready();
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Migrations: up to date.");
  const { n } = (await db.get(sql`SELECT count(*) AS n FROM entities`)) as { n: number };
  if (!Number(n)) throw new Error("This database has no entries. Run `npm run db:ensure` (or `npm run dev`) first; setup never seeds.");

  const done = new Set<string>();
  const pending = Object.keys(CORPORA);
  while (pending.length) {
    const next = pending.findIndex((c) => (CORPORA[c].requires ?? []).every((d) => done.has(d)));
    if (next < 0) throw new Error(`Corpus prerequisites cannot be satisfied: ${pending.join(", ")}`);
    const [corpusName] = pending.splice(next, 1);
    const corpus = CORPORA[corpusName];
    const state = await importState(corpus);
    if (state.present.length === state.defined) {
      console.log(`\n${corpusName}: already in this database (${state.defined} entries) — left unchanged.`);
    } else if (state.present.length) {
      throw new Error(
        `${corpusName} is only partly in this database (${state.present.length} of ${state.defined} entries carry “${corpus.collection}”). ` +
          `Setup will not overwrite it. Missing: ${state.missing.slice(0, 8).join(", ")}${state.missing.length > 8 ? "…" : ""}. ` +
          `Review it, then complete it with \`npm run corpus -- import ${corpusName} --submit\`.`,
      );
    } else {
      await requirePrerequisites(corpusName, corpus);
      await validData(corpus);
      console.log(`\n${corpusName}: importing ${state.defined} entries as “${corpus.collection}”, submitted for review`);
      summarise(await importCorpus(corpus, { submit: true, log: console.log }));
    }
    done.add(corpusName);
  }

  let errors = 0;
  for (const [corpusName, corpus] of Object.entries(CORPORA)) {
    const issues = await checkDatabase(corpus);
    console.log(`\nCheck ${corpusName}:`);
    errors += print(issues);
  }
  // Where to find the learning paths and Guided journeys in the desk (ids differ between databases).
  console.log("\nPaths in these corpora:");
  for (const corpus of Object.values(CORPORA))
    for (const e of corpus.batches.flatMap((b) => b.entities ?? []).filter((x) => x.key.startsWith("path:"))) {
      const row = await resolveKey(e.key);
      if (!row) continue;
      const preview = `/preview/${row.id}?with=${encodeURIComponent((corpus.requires ?? []).map((d) => CORPORA[d].collection)[0] ?? corpus.collection)}`;
      console.log(`  ${row.title}${e.fields?.guided ? " (Guided)" : ""} — ${row.status}${row.live ? ", live" : ", not public"} — desk /admin/entries/${row.id} — preview ${preview}`);
    }
  process.exitCode = errors ? 1 : 0;
}

async function main() {
  if (command === "setup") return setup();
  const corpus = CORPORA[name];
  if (!corpus) throw new Error(`Unknown corpus "${name}". Known: ${Object.keys(CORPORA).join(", ")}`);
  switch (command) {
    case "verify":
      await verifyCorpus(corpus, console.log);
      break;
    case "import": {
      const batches = opts("--batch");
      await requirePrerequisites(name, corpus);
      await validData(corpus, batches.at(-1));
      summarise(await importCorpus(corpus, { batches, submit: args.includes("--submit"), log: console.log }));
      break;
    }
    case "media":
      await downloadMedia(corpus, console.log);
      break;
    case "check": {
      const issues = [...(await checkData(corpus, opt("--batch"))), ...(await checkDatabase(corpus))];
      if (opt("--http")) issues.push(...(await checkHttp(corpus, opt("--http")!, opt("--as") ?? "editor@atlas.test")));
      process.exitCode = print(issues) ? 1 : 0;
      break;
    }
    case "report": {
      const issues = [...(await checkData(corpus)), ...(await checkDatabase(corpus))];
      if (opt("--http")) issues.push(...(await checkHttp(corpus, opt("--http")!, opt("--as") ?? "editor@atlas.test")));
      const out = `docs/corpus/${name}-review.md`;
      await writeFile(out, await buildReport(corpus, issues));
      console.log(`Wrote ${out}`);
      break;
    }
    default:
      console.log("Usage: npm run corpus -- setup | verify|media|import|check|report [corpus] [options]");
  }
}

main().then(
  () => process.exit(process.exitCode ?? 0),
  (e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  },
);
