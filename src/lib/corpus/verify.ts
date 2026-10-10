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
import { existsSync, statSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
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
    // Archive markup often leaves a space before punctuation that follows italics.
    .replace(/ ([,.;:!?)\]])/g, "$1")
    .replace(/([(\[]) /g, "$1")
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

/** The transcription's own header: where it says the text comes from (source edition, translation). */
function provenance(text: string) {
  const flat = text.replace(/\s+/g, " ");
  const src = /Source\s*:\s*(.{10,220}?)(?=\s(?:Transcri\w*|Translat\w*|First Published|Proofread\w*|Online Version|HTML|Markup|Copyleft|Public Domain)\b|$)/i.exec(flat);
  const tr = /Translated(?: by)?\s*:?\s*(.{4,120}?)(?=;|\s(?:Source|Transcri\w*|Proofread\w*|Online Version|HTML|Markup)\b|$)/i.exec(flat);
  const parts = [src?.[1]?.trim(), tr ? `translated: ${tr[1].trim()}` : undefined].filter(Boolean);
  return parts.length ? parts.join("; ").slice(0, 300) : undefined;
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
  // Places: the article must point to the named Wikidata item; the coordinates are that item's (P625).
  const places = corpus.batches.flatMap((b) => b.places ?? []);
  if (places.length) record.places = {};
  for (const pl of places) {
    record.places![pl.id] = await locate(pl.wikipedia, pl.wikidata);
    const r = record.places![pl.id];
    log(`${r.ok ? "✓" : "✗"} place ${pl.id} — ${r.detail}`);
    await sleep(1000);
  }
  // Keep results for anything not re-checked this time.
  try {
    const prev = JSON.parse(await readFile(file, "utf8")) as VerificationRecord;
    record.quotes = { ...prev.quotes, ...record.quotes };
    record.sources = { ...prev.sources, ...record.sources };
    if (prev.places || record.places) record.places = { ...prev.places, ...record.places };
  } catch {}
  await writeFile(file, JSON.stringify(record, null, 2) + "\n");
  return record;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getJson(url: string) {
  for (let attempt = 0, wait = 4000; attempt < 4; attempt++, wait *= 2) {
    const res = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" }, signal: AbortSignal.timeout(30_000) }).catch(() => null);
    if (res?.ok) return res.json();
    if (res && res.status !== 429 && res.status < 500) throw new Error(`HTTP ${res.status}`);
    await sleep(wait);
  }
  throw new Error("no response (rate-limited or offline)");
}

/** Coordinates for a place: the Wikidata item behind a Wikipedia article, if it is the expected one, and its P625. */
async function locate(title: string, qid: string): Promise<{ ok: boolean; lat?: number; lon?: number; wikidata?: string; detail: string }> {
  try {
    const page = (await getJson(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&redirects=1&prop=pageprops&ppprop=wikibase_item&titles=${encodeURIComponent(title)}`,
    )) as { query: { pages: { title: string; missing?: boolean; pageprops?: { wikibase_item?: string } }[] } };
    const article = page.query.pages[0];
    const item = article?.pageprops?.wikibase_item;
    if (!article || article.missing || item !== qid) return { ok: false, wikidata: item, detail: `article “${title}” is Wikidata ${item ?? "?"}, not ${qid}` };
    const data = (await getJson(`https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&entity=${qid}&property=P625`)) as {
      claims: { P625?: { rank: string; mainsnak: { datavalue?: { value: { latitude: number; longitude: number } } } }[] };
    };
    const claims = (data.claims.P625 ?? []).filter((c) => c.rank !== "deprecated");
    const claim = (claims.find((c) => c.rank === "preferred") ?? claims[0])?.mainsnak.datavalue?.value;
    if (!claim) return { ok: false, wikidata: qid, detail: `Wikidata ${qid} has no coordinate location (P625)` };
    const lat = Math.round(claim.latitude * 1e5) / 1e5;
    const lon = Math.round(claim.longitude * 1e5) / 1e5;
    return { ok: true, lat, lon, wikidata: qid, detail: `Wikidata ${qid} (“${article.title}”): ${lat}, ${lon}` };
  } catch (e) {
    return { ok: false, wikidata: qid, detail: (e as Error).message };
  }
}

/**
 * Download image files that a corpus lists but does not have yet. Requests are
 * spaced out and back off when the server answers 429, as Wikimedia asks.
 */
export async function downloadMedia(corpus: Corpus, log: (l: string) => void = () => {}) {
  const dir = path.join(process.cwd(), corpus.dir, "media");
  await mkdir(dir, { recursive: true });
  for (const m of corpus.batches.flatMap((b) => b.media ?? [])) {
    const file = path.join(dir, m.file);
    if (existsSync(file) && statSync(file).size > 0) continue;
    if (!m.download) {
      log(`✗ ${m.file} — missing, and no download URL`);
      continue;
    }
    let done = false;
    for (let attempt = 0, wait = 20_000; attempt < 5 && !done; attempt++, wait *= 2) {
      const res = await fetch(m.download, { headers: { "User-Agent": UA } }).catch(() => null);
      if (res?.ok) {
        await writeFile(file, new Uint8Array(await res.arrayBuffer()));
        log(`✓ ${m.file}`);
        done = true;
      } else if (res?.status === 429 || !res) {
        log(`… ${m.file}: ${res ? "rate-limited" : "network error"}; retrying in ${wait / 1000}s`);
        await sleep(wait);
      } else {
        log(`✗ ${m.file} — HTTP ${res.status}`);
        break;
      }
    }
    if (!done) log(`✗ ${m.file} — not downloaded; run the command again later`);
    await sleep(5_000);
  }
}
