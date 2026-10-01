# Architecture

The Atlas is one Next.js application with three layers:

```
src/
  app/                    Routes (server components by default), route handlers, server actions
  components/             UI, grouped by role: layout, editorial, entity, graph, timeline, debate, concept, path, search, admin
  lib/
    content/              Framework-free domain model: kinds, relationship registry, markup parser (safe on client & server)
    db/                   Drizzle schema, libSQL client, FTS5 index maintenance
    data/                 The public content API (server-only): getThinker(), getConcept(), getDebate(), search()…
    admin/                Session, field definitions, editorial repository (reads drafts, writes, reindexes)
    graph/                Server-side d3-force layout
    seed/                 Sample records and the seeder
drizzle/                  SQL migrations (generated + the hand-written FTS5 migration)
scripts/db.ts             migrate / seed / reset / ensure / reindex
tests/e2e/                Playwright
```

## Principles

1. **Pages never touch the database or hard-code content.** Every route calls functions exported from
   `src/lib/data/index.ts`. Those return plain, serialisable aggregates (e.g. `getThinker(slug)` returns the entity, its
   details, tendencies, ideas, works, influences, disagreements, debate positions, events, a timeline, excerpts, a
   neighbourhood graph and a resolved footnote apparatus).
2. **Everything is an entity; every connection is a relationship row.** Thinkers, concepts, texts, tendencies, debates,
   events and learning paths share one id space, so any entry can relate to any other. Relationship semantics live in
   one registry (`lib/content/model.ts`): labels in both directions, families used for graph styling, and inverse aliases
   that are normalised on write.
3. **Sources are first-class.** Entries cite sources (with locators), prose carries inline `[cite:…]` markers that are
   numbered into footnotes at render time, excerpts point to a text and an edition, and relationships can rest on a source.
4. **Draft is invisible.** Public queries filter to `sample` and `published`. The editorial repository sees everything.

## Rendering & performance

- Entry pages are server-rendered on demand; index pages without query parameters are prerendered at build time and
  revalidated by `revalidatePath("/", "layout")` after every editorial write.
- **Graphs:** `MapFigure` (server) computes two layouts with d3-force — landscape for desktop/tablet and portrait for
  phones — and passes coordinates to `TheoryMap` (client), which only handles hover, selection, keyboard and the preview
  panel. The home map is *chronological*: time is a fixed axis (birth year), relations position the cross-axis.
- **Timeline** data is a single query over `entities.year_start` joined to detail tables (`getTimeline({from, to, lanes})`),
  so the same API can later serve windowed ranges; context for a selected item loads on demand from `/api/preview/[id]`.
- **Search:** FTS5 with Porter stemming and diacritic folding, weighted bm25 (title > aliases > body), prefix matching on
  every term, snippets, and "connected" results drawn from the relationship graph. `/api/search?mode=lookup` powers the
  admin entity picker.
- Client JavaScript is limited to interaction: map, timeline, compare, depth reader, search overlay, bookmarks, path
  progress, admin forms. The search overlay is code-split and loaded on first use.

## Scaling from 20 to 2,000 thinkers

- All list APIs take `limit`/`offset` (and filters); index pages paginate (`Pager`) and A–Z/tendency/form filters are
  query-driven.
- Graph queries are scoped: `getGraph({kinds, featuredOnly, limit})` for overview maps, `getNeighborhood(id, {depth,
  kinds, limit})` for entry pages. Large overview maps should filter (by tendency, period) rather than draw everything.
- Relationship lookups are indexed on both endpoints; the unique index `(from_id, type, to_id)` prevents duplicates.
- Entry-page aggregates issue a bounded number of queries independent of database size.
- Moving to a hosted database: set `DATABASE_URL` (+ `DATABASE_AUTH_TOKEN`) to a libSQL/Turso URL. Moving to Postgres
  (e.g. Supabase): port `schema.ts` to `drizzle-orm/pg-core` (same tables and columns), replace the FTS5 index with a
  `tsvector` column + GIN index in `lib/db/search-index.ts`/`lib/data/search.ts`; the content API's signatures stay the same.

## Design system

Tokens are defined once in `src/app/globals.css` (`@theme`), replacing Tailwind's default palette entirely:

| Token | Value | Use |
| --- | --- | --- |
| `red` | `#B51F2A` | Active navigation, key labels, selected nodes, timeline markers, links' accents |
| `red-deep` | `#7E1720` | Hover on red, deep tendency colour |
| `ink` / `ink-warm` | `#171717` / `#202020` | Type, rules, ink sections |
| `paper` / `paper-warm` | `#F3F0E8` / `#FAF9F5` | Grounds (with a faint grain) |
| `beige` | `#DDD7CA` | Quiet bands |
| `olive`, `ochre` | `#53624B`, `#B18A47` | Secondary accents (ochre is decorative only — it fails text contrast) |
| `muted`, `faint` | `#5C574F`, `#6F695F` | Secondary text (both ≥ 4.5:1 on paper) |

Editorial primitives (`components/editorial`): `SectionHead` (issue-style numbered sections), `Label`, `ArrowLink`,
`StatusMark` (marks sample/draft entries), `MetaList`, `Prose` (Atlas markup), `Notes` (footnotes), `IndexHeader`, `Pager`.
Entry primitives (`components/entity`): `EntryHeader`, `SectionNav` (sticky scroll-spy index), `EntrySection`,
`RelationList`, `EntryGrid`, `Excerpts`.

The working name lives only in `src/lib/site.ts` (`SITE.name`), which drives the wordmark, titles and metadata.

## Accessibility

Semantic landmarks and headings; skip link; visible red focus rings; all map nodes and timeline items are focusable
buttons with descriptive labels; the map has a "read as a list" alternative; the search overlay is a modal dialog with a
combobox/listbox pattern and focus trapping; comparison data is a real `<table>`; motion is disabled under
`prefers-reduced-motion`; colour is never the only carrier of meaning (stances have glyphs and labels).

## Admin & security

`src/proxy.ts` (Next 16's middleware) guards `/admin/*`; every server action also calls `requireAdmin()`. Sessions are
HMAC-signed cookies (`lib/admin/session.ts`). In production the desk is disabled unless `ADMIN_PASSWORD` is set; set
`ADMIN_SESSION_SECRET` too. Redirect targets from forms are restricted to `/admin` paths. This is a single-editor model;
multi-user accounts and revision history are natural next steps.
