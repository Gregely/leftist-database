/**
 * Online verification for a corpus, recorded in <dir>/verification.json:
 *
 *  - quotations: the archive page named for each excerpt is fetched and the
 *    excerpt must occur in it verbatim (after normalising whitespace and
 *    typographic quotes/dashes). The page's own "Source:" line is kept as
 *    provenance. A match means "matches that transcription" — a reviewer
 *    still checks the printed edition before marking a quotation verified.
 *  - sources: web pages must load and mention the expected title; books are
 *    looked up in the Open Library catalogue by title and author.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Corpus, VerificationRecord } from "./types";

const UA = "TheoryAtlas-CorpusVerification/1.0 (editorial source checking)";

export function normaliseText(t: string) {
  return t
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/ /g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", mdash: "—", ndash: "–", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…", eacute: "é", uuml: "ü", ouml: "ö", auml: "ä", szlig: "ß" };

export function htmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
}

async function fetchText(url: string): Promise<{ status: number; text: string }> {
  const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow", signal: AbortSignal.timeout(30_000) });
  const buf = Buffer.from(await res.arrayBuffer());
  // Older archive pages are often Windows-1252 / Latin-1.
  const declared = /charset=["']?([\w-]+)/i.exec(res.headers.get("content-type") ?? "")?.[1] ?? /<meta[^>]+charset=["']?([\w-]+)/i.exec(buf.toString("latin1"))?.[1] ?? "utf-8";
  const enc = /8859-1|latin|1252/i.test(declared) ? "latin1" : "utf8";
  return { status: res.status, text: buf.toString(enc) };
}

function provenance(text: string) {
  const m = /Source\s*:\s*([^\n]{10,240}?)(?:\s{2,}|Transcri|Translat|First Published|Proofread|Online Version|HTML|Markup|$)/i.exec(text);
  return m?.[1]?.trim();
}

export async function verifyCorpus(corpus: Corpus, log: (l: string) => void = () => {}): Promise<VerificationRecord> {
  const file = path.join(process.cwd(), corpus.dir, "verification.json");
  const record: VerificationRecord = { checkedAt: new Date().toISOString(), quotes: {}, sources: {} };
  const pages = new Map<string, { status: number; text: string; norm: string }>();
  const page = async (url: string) => {
    if (!pages.has(url)) {
      try {
        const r = await fetchText(url);
        const text = htmlToText(r.text);
        pages.set(url, { status: r.status, text, norm: normaliseText(text) });
      } catch (e) {
        pages.set(url, { status: 0, text: "", norm: `__error__ ${(e as Error).message}` });
      }
    }
    return pages.get(url)!;
  };

  for (const b of corpus.batches) {
    for (const x of b.excerpts ?? []) {
      const p = await page(x.archiveUrl);
      const needle = normaliseText(x.body);
      const matched = p.status === 200 && p.norm.includes(needle);
      let detail = matched ? "verbatim" : p.status !== 200 ? `HTTP ${p.status}` : "text not found on page";
      if (!matched && p.status === 200) {
        // Locate the longest matching prefix to help an editor see where it diverges.
        let n = needle.length;
        while (n > 20 && !p.norm.includes(needle.slice(0, n))) n = Math.floor(n * 0.8);
        if (n > 20) detail = `diverges after: “${needle.slice(0, n).slice(-60)}”`;
      }
      record.quotes[x.key] = { url: x.archiveUrl, status: p.status, matched, provenance: provenance(p.text), detail };
      log(`${matched ? "✓" : "✗"} quote ${x.key} — ${detail}`);
    }
    for (const src of b.sources ?? []) {
      if (!src.check) continue;
      try {
        if (src.check.kind === "url") {
          const p = await page(src.url!);
          const ok = p.status === 200 && p.norm.includes(normaliseText(src.check.expect));
          record.sources[src.id] = { status: p.status, ok, detail: ok ? `page mentions “${src.check.expect}”` : p.status === 200 ? `page does not mention “${src.check.expect}”` : `HTTP ${p.status}` };
        } else {
          const u = `https://openlibrary.org/search.json?title=${encodeURIComponent(src.check.title)}&author=${encodeURIComponent(src.check.author)}&limit=5&fields=title,author_name,first_publish_year,publisher`;
          const res = await fetch(u, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(30_000) });
          const json = (await res.json()) as { numFound: number; docs: { title: string; author_name?: string[]; first_publish_year?: number; publisher?: string[] }[] };
          const doc = json.docs[0];
          record.sources[src.id] = {
            status: res.status,
            ok: json.numFound > 0,
            detail: doc ? `Open Library: “${doc.title}”, ${doc.author_name?.join(", ") ?? "?"}, first published ${doc.first_publish_year ?? "?"}` : "not found in Open Library",
          };
        }
      } catch (e) {
        record.sources[src.id] = { status: null, ok: false, detail: (e as Error).message };
      }
      log(`${record.sources[src.id].ok ? "✓" : "✗"} source ${src.id} — ${record.sources[src.id].detail}`);
    }
  }
  // Keep results for anything not re-checked this time.
  try {
    const prev = JSON.parse(await readFile(file, "utf8")) as VerificationRecord;
    record.quotes = { ...prev.quotes, ...record.quotes };
    record.sources = { ...prev.sources, ...record.sources };
  } catch {}
  await writeFile(file, JSON.stringify(record, null, 2) + "\n");
  return record;
}
