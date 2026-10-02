/**
 * Research corpora: import, verify, check and report.
 *
 *   npm run corpus -- verify  [corpus]                    online checks → <dir>/verification.json
 *   npm run corpus -- media   [corpus]                    download missing image files into <dir>/media
 *   npm run corpus -- import  [corpus] [--batch id …] [--submit]
 *   npm run corpus -- check   [corpus] [--batch id] [--http http://localhost:3000 --as editor@…]
 *   npm run corpus -- report  [corpus] [--http … --as …]   → docs/corpus/<corpus>-review.md
 *
 * Imports go through the editorial library (lib/editorial/*) under an
 * inactive "research import" account; nothing is ever published.
 */
import { writeFile } from "node:fs/promises";
import { CORPORA } from "../corpus";
import { checkData, checkDatabase, checkHttp, type CheckIssue } from "../src/lib/corpus/check";
import { importCorpus } from "../src/lib/corpus/ingest";
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

async function main() {
  const corpus = CORPORA[name];
  if (!corpus) throw new Error(`Unknown corpus "${name}". Known: ${Object.keys(CORPORA).join(", ")}`);
  switch (command) {
    case "verify":
      await verifyCorpus(corpus, console.log);
      break;
    case "import": {
      const batches = opts("--batch");
      const errors = await checkData(corpus, batches.at(-1));
      if (errors.some((e) => e.level === "error")) {
        print(errors.filter((e) => e.level === "error"));
        throw new Error("The corpus data has errors; nothing was imported.");
      }
      const summary = await importCorpus(corpus, { batches, submit: args.includes("--submit"), log: console.log });
      console.log(
        `\nCreated ${summary.created.length}, amended ${summary.amended.length}, unchanged ${summary.unchanged.length}; ` +
          `sources +${summary.sources.created} ~${summary.sources.updated} (reused ${summary.sources.reused}); ` +
          `relationships ${summary.relationships}, citations +${summary.citations}, excerpts +${summary.excerpts}, media ${summary.media}${summary.mediaMissing ? ` (${summary.mediaMissing} not downloaded yet)` : ""}, notes +${summary.notes}, submitted ${summary.submitted}.`,
      );
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
      console.log("Usage: npm run corpus -- verify|media|import|check|report [corpus] [options]");
  }
}

main().then(
  () => process.exit(process.exitCode ?? 0),
  (e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  },
);
