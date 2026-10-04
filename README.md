# THEORY / ATLAS

**A living map of socialist thought** — ideas, thinkers, texts, tendencies, debates, and the relationships between them.

This repository holds the public site, a relational content model in which relationships and sources are first-class
data, the **Atlas Editorial Desk** — a multi-user publishing system with roles, review workflow, revisions, rich text,
sources and media — and a small set of clearly marked **sample records** that demonstrate the system. It is built as a
machine for holding the theory, not yet as the theory itself.

## Quick start

```bash
npm install
npm run dev          # migrates + seeds data/atlas.db on first run, then starts http://localhost:3000
npm run corpus -- setup   # optional: load the committed research corpora (Initial Marx Corpus, Guided journeys)
```

`data/*.db` is not in Git, so a new checkout starts with the sample records only. `npm run corpus -- setup` imports
the corpora committed under `corpus/` into your database, for review in the desk: it applies migrations, imports
each corpus that is not there yet (prerequisites first), submits it for review and publishes nothing. It leaves a
corpus that is already present untouched, so it is safe to run again. See [`docs/CORPUS.md`](docs/CORPUS.md).

- Public site: <http://localhost:3000>
- Editorial desk: <http://localhost:3000/admin>. In development `npm run dev` creates four demo accounts, one per role —
  `contributor@atlas.test`, `reviewer@atlas.test`, `editor@atlas.test`, `admin@atlas.test` — all with the password
  `atlas-demo-2026`. They are never created in production; create real accounts with `npm run user:create`.

| Command | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js (each ensures the database exists first) |
| `npm run typecheck` | TypeScript, no emit |
| `npm run test:e2e` | Playwright suite (public site, editorial workflow, desk, mobile) against a throwaway `data/test.db` |
| `npm run db:reset` | Delete the local database, migrate and re-seed the samples |
| `npm run db:migrate` / `db:seed` / `db:reindex` | Individual database tasks |
| `npm run corpus -- setup` | Import the committed research corpora that this database does not have yet (unpublished, submitted for review) |
| `npm run db:generate` | Generate a migration after editing `src/lib/db/schema.ts` |
| `npm run user:create -- --email … --name … --role admin` | Create a desk account (prints a generated password once unless `--password` is given) |
| `npm run user:list` | List desk accounts |

Copy `.env.example` to `.env.local` to configure the database URL and the media folder.

### Deploying

1. Set `DATABASE_URL` (and `DATABASE_AUTH_TOKEN` for libSQL/Turso) and `MEDIA_DIR` (a persistent folder for uploads).
2. `npm run build && npm start` — migrations run automatically before both.
3. Create the first administrator: `npm run user:create -- --email you@example.org --name "Your Name" --role admin`.
   Administrators then manage everyone else from **People** in the desk.

## What's here

| Area | Route | Notes |
| --- | --- | --- |
| Home | `/` | What the site is, a prominent search, Guided beside it with other ways in; the collection as a table of contents (every section at equal weight); concepts at three depths; open debates; texts and lives; Guided journeys and learning paths; the Theory Map as a plate; historical moments; method |
| Library | `/explore` | Thinkers, concepts, tendencies, debates, texts and periods, each with its own visual treatment |
| Theory Map | `/map` | The relationship map as an atlas plate: by time or by affinity, thinkers alone or with concepts or tendencies; a key and the most-connected entries |
| Thinkers | `/thinkers`, `/thinkers/[slug]` | Lifespan index with tendency filters; entry with ideas, network graph, works, influences, disagreements, legacy, timeline |
| Concepts | `/concepts`, `/concepts/[slug]` | A–Z glossary; entry with a **descending depth reader** (30 seconds → 5 minutes → deep dive), primary texts, debates, related-concept constellation |
| Debates | `/debates`, `/debates/[slug]` | Positions side by side; **compare** two or more to see shared and divergent stances; arguments and counterarguments |
| Timeline | `/timeline`, `/timeline/[slug]` | Zoomable (century / half-century / decade) multi-lane timeline with contextual panel; vertical list on phones |
| Texts, tendencies | `/texts…`, `/tendencies…` | Catalogue and traditions |
| Guided | `/guided`, `/guided/[slug]?step=n` | *Where should I start?* Curated journeys through existing entries, one step at a time: where you are, the idea (with its depth reader), why it matters, a source excerpt, and where it leads; progress and *Continue* kept in the browser, and a line under the masthead leads back to the route from anywhere else on the site |
| Learning paths | `/paths`, `/paths/[slug]?step=n` | A route through ideas with next / back / explore and detours; progress kept in the browser |
| Search | overlay (`/` or ⌘K) and `/search` | SQLite FTS5 full-text search grouped by entity type, with related entries |
| Sources | `/sources`, `/sources/[id]` | Bibliography; every citation and excerpt points here |
| Bookmarks | `/bookmarks` | Per-browser reading list |
| Editorial desk | `/admin` | Roles, review workflow, revisions, rich-text editor, relationship builder, sources, excerpts, media library, previews, audit log — see [`docs/EDITORIAL.md`](docs/EDITORIAL.md) |

## Stack

- **Next.js 16** (App Router, React Server Components, server actions) + **TypeScript**
- **Tailwind CSS 4** with a project-specific token set (no default palette) and a small editorial component library
- **SQLite via libSQL** + **Drizzle ORM**. Locally a file; in production `DATABASE_URL` can point at a libSQL/Turso server with no code change. The schema is relational and portable to Postgres (see `docs/DATA_MODEL.md`).
- **SQLite FTS5** for search, maintained on every write
- **d3-force**, run **on the server**, for graph layout — the client receives coordinates and renders SVG, so no physics library ships to the browser
- Fonts: **Newsreader** (display, reading text, quotations) and **Archivo** with its width axis (condensed capitals for labels and navigation; tabular figures for metadata)

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — layers, data access, rendering, design system, scaling
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — entities, relationship types, sources and citations, debates, paths
- [`docs/EDITORIAL.md`](docs/EDITORIAL.md) — the editorial desk: roles, workflow, revisions, rich text, sources, media; the sample-content policy
- [`docs/CORPUS.md`](docs/CORPUS.md) — research corpora: format, verification, import and review (`npm run corpus`)
- [`docs/corpus/initial-marx-review.md`](docs/corpus/initial-marx-review.md) — the review queue for the *Initial Marx Corpus*

## Content policy for this build

The **Initial Marx Corpus** (`corpus/initial-marx/`) is a researched introduction to Marx, his predecessors and the
Marxism of 1890–1919. Load it with `npm run corpus -- import` after seeding; every entry it touches stays unpublished
and awaits human review (see [`docs/CORPUS.md`](docs/CORPUS.md)).

All seeded entries are flagged **sample** (`is_sample`) and labelled as such on the site. Summaries are brief and conventional.
Only a handful of very widely reproduced quotations are included, each tied to a cited edition and flagged
**unverified** until checked; elsewhere excerpts are references to passages, not invented text. Debate stances are
editorial readings, presented descriptively.
