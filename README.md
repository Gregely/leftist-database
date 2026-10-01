# THEORY / ATLAS

**A living map of socialist thought** — ideas, thinkers, texts, tendencies, debates, and the relationships between them.

This repository is the initial build: a complete editorial front end, a relational content model in which
relationships and sources are first-class data, an editorial desk for creating and connecting entries, and a small set of
clearly marked **sample records** that demonstrate the system. It is built as a machine for holding the theory, not yet as
the theory itself.

## Quick start

```bash
npm install
npm run dev          # migrates + seeds data/atlas.db on first run, then starts http://localhost:3000
```

- Public site: <http://localhost:3000>
- Editorial desk: <http://localhost:3000/admin> — in development the password is `atlas` unless `ADMIN_PASSWORD` is set.

| Command | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js (each ensures the database exists first) |
| `npm run typecheck` | TypeScript, no emit |
| `npm run test:e2e` | Playwright suite (desktop, mobile, admin) against a throwaway `data/test.db` |
| `npm run db:reset` | Delete the local database, migrate and re-seed the samples |
| `npm run db:migrate` / `db:seed` / `db:reindex` | Individual database tasks |
| `npm run db:generate` | Generate a migration after editing `src/lib/db/schema.ts` |

Copy `.env.example` to `.env.local` to configure the database URL and admin credentials.

## What's here

| Area | Route | Notes |
| --- | --- | --- |
| Home | `/` | Masthead, *Explore by* index, the chronological **Theory Map**, featured concepts, debates, mini timeline, learning paths |
| Library | `/explore` | Thinkers, concepts, tendencies, debates, texts and periods, each with its own visual treatment |
| Thinkers | `/thinkers`, `/thinkers/[slug]` | Lifespan index with tendency filters; entry with ideas, network graph, works, influences, disagreements, legacy, timeline |
| Concepts | `/concepts`, `/concepts/[slug]` | A–Z glossary; entry with a **descending depth reader** (30 seconds → 5 minutes → deep dive), primary texts, debates, related-concept constellation |
| Debates | `/debates`, `/debates/[slug]` | Positions side by side; **compare** two or more to see shared and divergent stances; arguments and counterarguments |
| Timeline | `/timeline`, `/timeline/[slug]` | Zoomable (century / half-century / decade) multi-lane timeline with contextual panel; vertical list on phones |
| Texts, tendencies | `/texts…`, `/tendencies…` | Catalogue and traditions |
| Learning paths | `/paths`, `/paths/[slug]?step=n` | A route through ideas with next / back / explore and detours; progress kept in the browser |
| Search | overlay (`/` or ⌘K) and `/search` | SQLite FTS5 full-text search grouped by entity type, with related entries |
| Sources | `/sources`, `/sources/[id]` | Bibliography; every citation and excerpt points here |
| Bookmarks | `/bookmarks` | Per-browser reading list |
| Editorial desk | `/admin` | Create and edit every entity, relationships, citations, excerpts, debate structure and path routes |

## Stack

- **Next.js 16** (App Router, React Server Components, server actions) + **TypeScript**
- **Tailwind CSS 4** with a project-specific token set (no default palette) and a small editorial component library
- **SQLite via libSQL** + **Drizzle ORM**. Locally a file; in production `DATABASE_URL` can point at a libSQL/Turso server with no code change. The schema is relational and portable to Postgres (see `docs/DATA_MODEL.md`).
- **SQLite FTS5** for search, maintained on every write
- **d3-force**, run **on the server**, for graph layout — the client receives coordinates and renders SVG, so no physics library ships to the browser
- Fonts: **Fraunces** (display, quotations) and **IBM Plex Sans / Mono** (interface, metadata)

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — layers, data access, rendering, design system, scaling
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — entities, relationship types, sources and citations, debates, paths
- [`docs/EDITORIAL.md`](docs/EDITORIAL.md) — markup, the sample-content policy, how to add entries

## Content policy for this build

All seeded entries carry status **sample** and are labelled as such on the site. Summaries are brief and conventional.
Only a handful of very widely reproduced quotations are included, each tied to a cited edition and flagged
**unverified** until checked; elsewhere excerpts are references to passages, not invented text. Debate stances are
editorial readings, presented descriptively.
