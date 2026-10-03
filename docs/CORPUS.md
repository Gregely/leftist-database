# Research corpora

A **corpus** is a body of researched content — entries, relationships, sources, excerpts, debates, paths and
images — written as typed data under `corpus/<name>/` and loaded into the Atlas through the editorial library. It is
not a second content system: the importer calls the same functions as the desk (`lib/editorial/*`), so every write is
validated, versioned, staged and audited exactly as if an editor had typed it.

A corpus never publishes anything. Every entry it touches ends the import as a draft (or, with `--submit`, in the
review queue), tagged with the corpus's **collection** name.

The first corpus is **Initial Marx Corpus** (`corpus/initial-marx/`); its review queue is
[`docs/corpus/initial-marx-review.md`](corpus/initial-marx-review.md).

## Commands

```bash
npm run corpus -- setup                            # bring this database up to date with every committed corpus
npm run corpus -- verify initial-marx              # fetch archive pages / catalogues; record results in verification.json
npm run corpus -- import initial-marx [--batch b3] [--submit]
npm run corpus -- check  initial-marx [--batch b3] [--http http://localhost:3000 --as editor@atlas.test]
npm run corpus -- report initial-marx [--http …]   # writes docs/corpus/initial-marx-review.md
```

- **setup** is how a new checkout (or any database without the corpora) gets them, because `data/*.db` is not in
  Git. It applies migrations, then goes through `corpus/index.ts` in dependency order (`requires`; the Guided
  journey needs the Initial Marx Corpus) and imports with `--submit` each corpus none of whose entries carry its
  collection label yet. A corpus that is fully present is left untouched, even if editors have changed it since; a
  partly present one stops the run with the missing keys, to be completed deliberately with `import`. It ends with
  the database checks and the desk and preview URLs of each path (ids differ between databases). It never seeds,
  resets or publishes; an empty database needs `npm run db:ensure` (or `npm run dev`) first.
- **verify** is the only step that needs the network. It checks that each excerpt's wording appears verbatim
  (after normalising quotes, dashes and spacing) on its archive page, that each online source mentions an expected
  phrase, and that each book can be found in Open Library. Results are committed, so imports are reproducible offline.
- **import** is idempotent: re-running it changes nothing that has not changed in the data. But where an editor has
  changed an imported entry since, re-importing writes the corpus text back as a new working version (history is
  kept), so on a reviewed database prefer `setup`, which skips corpora already present. `import` refuses a corpus
  whose `requires` are not imported yet. It runs as the inactive
  editor account `research-import@atlas.invalid`, so the audit log and history show what the import did.
- **check** validates the data (keys, relationship types, sources, chronology, locators, debate stances, path order),
  then the database (possible duplicates, structural checks, graph isolation, timeline placement, that nothing in the
  collection is public, that public search does not return it, and that the import never edited a record it did not
  create). With `--http` it also renders the collection preview, confirms that drafts 404 publicly and that public
  pages, search and the API contain no draft ids.

## Format

`src/lib/corpus/types.ts` defines the format. A corpus has a `collection` name, a `planned` list of every entry the
finished corpus defines (so early batches can link ahead), and ordered **batches**, each with `sources`, `entities`,
`relationships`, `excerpts`, `debates`, `paths` and `media`.

- **Entities** are addressed by `kind:slug`. An existing entry with that slug is *amended* (for a live entry, a new
  working version — the published one is untouched); otherwise one is created. `fields` uses the editor field names
  in `lib/editorial/fields.ts`.
- **Prose** uses the desk's markup: `[[kind:slug]]` links, `[cite:src_id, locator]` citations, `##` headings. Voice
  markers make the status of a claim explicit: `**Text.**` (what a source says), `**Interpretation.**`,
  `**Context.**` and `**Disputed.**` (where scholars disagree; give both readings with their holders).
- **Locators** are chapters, sections, letters and dates — never invented page numbers.
- **Relationships** need a note and should name a source; `basis: "interpretive"` marks a reading rather than a
  documented fact. On a live entry they are staged and released with the entry named by `on` (default: `from`).
- **Excerpts** carry an `archiveUrl`. A verbatim match makes the excerpt *Needs review* with a provenance note; no
  match makes it *Unverified* with a flag. The import never marks anything *Verified* — that is a reviewer's job.
- **Flags** (`missing-source`, `disputed`, `unverified-quotation`, `uncertain-relationship`, `incomplete-metadata`,
  `possible-duplicate`, `specialist-review`, `sample-overlap`) become internal editorial notes on the entry, visible
  in its Review tab and never public.
- **Paths** list `steps` by entity key with a `framing` line, optional `track: "branch"` side routes, and — for a
  path whose fields set `guided: true` — the Guided copy `orientation`, `whyItMatters` and `nextReason`, plus
  `excerpt`: the opening words of an existing excerpt on the stop's entity to feature (the import fails if none
  matches). `corpus/guided-understanding-marx` is the example: one journey built only from Initial Marx Corpus
  entries.
- **Media** files sit in `corpus/<name>/media/` with title, alt text, caption, creator, credit, source and licence.
  Identical files are stored once; the import never rewrites metadata on a library image it did not upload.

## Reviewing a corpus

1. Open **Content** and filter by the collection, or open any entry's preview and choose *Include unpublished
   “Initial Marx Corpus” entries* to read the whole corpus together — links, maps, timelines and paths then follow
   the drafts.
2. Work through the review queue document: flags per entry, then quotations (check each against a printed edition
   and set *Verified*), then relationships.
3. Publish entries individually. Staged relationships, citations, excerpts, images and debate/path structure attached
   to a live entry are released when that entry is published.
