# Architecture

The Atlas is one Next.js application with three layers:

```
src/
  app/
    (site)/               Public routes, wrapped in the site chrome (SiteShell); includes /preview/[id]
    admin/                The editorial desk: (desk)/ pages, login, and actions.ts (every server action)
    api/                  Public JSON (search, map previews) and /api/desk/* (session-only pickers, uploads)
    media/[id]/           Serves uploaded images (public only while attached to a live entry)
  components/             UI, grouped by role: layout, editorial, entity, views (whole public pages, shared with the
                          preview), graph, timeline, debate, concept, path, search, desk (editor, rich text, panels)
  lib/
    content/              Framework-free domain model: kinds, relationship registry, markup parser (safe on client & server)
    db/                   Drizzle schema, libSQL client, FTS5 index maintenance
    data/                 The public content API (server-only): getThinker(), getConcept(), getDebate(), search()…
    auth/                 Passwords (scrypt), database sessions, users
    editorial/            The editorial domain: permissions, workflow, content (revisions, saves, transitions),
                          structure (relationships, citations, excerpts, media, debates, paths), sources, media,
                          notes, audit, validation/completeness/dependencies (insight), desk queries
    graph/                Server-side d3-force layout
    seed/                 Sample records and the seeder
drizzle/                  SQL migrations (generated + the hand-written FTS5 migration)
scripts/db.ts             migrate / seed / reset / ensure / reindex
scripts/users.ts          create / list desk accounts; demo accounts for development
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
4. **Draft is invisible.** Public queries filter to `entities.live` (`isPublic()` in `lib/data/core.ts`); only live
   entries are written to the search index, and relationships, graphs, timelines, sources and media are filtered
   through the same flag. The editorial library sees everything.
5. **One content model.** The desk edits the same tables the public site reads. The preview renders the public view
   components (`components/views/*`) with a `PreviewSpec` overlay that substitutes the working copy for one entry.

## Rendering & performance

- Entry pages are server-rendered on demand; index pages without query parameters are prerendered at build time and
  revalidated by `revalidatePath("/", "layout")` after every editorial write.
- **Graphs:** `MapFigure` (server) computes two layouts with d3-force — landscape for desktop/tablet and portrait for
  phones — and passes coordinates to `TheoryMap` (client), which only handles hover, selection, keyboard and the preview
  panel. The home map is *chronological*: time is a fixed axis (birth year), relations position the cross-axis.
- **Timeline** data is a single query over `entities.year_start` joined to detail tables (`getTimeline({from, to, lanes})`),
  so the same API can later serve windowed ranges; context for a selected item loads on demand from `/api/preview/[id]`.
- **Search:** FTS5 with Porter stemming and diacritic folding, weighted bm25 (title > aliases > body), prefix matching on
  every term, snippets, and "connected" results drawn from the relationship graph. The desk's entity picker uses its own
  lookup (`/api/desk/lookup`) across all statuses.
- Client JavaScript is limited to interaction: map, timeline, compare, depth reader, search overlay, bookmarks, path
  progress, and the desk. The search overlay is code-split and loaded on first use.

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
`SampleMark` (marks sample entries), `MetaList`, `Prose` (Atlas markup), `Notes` (footnotes), `IndexHeader`, `Pager`.
Entry primitives (`components/entity`): `EntryHeader`, `SectionNav` (sticky scroll-spy index), `EntrySection`,
`RelationList`, `EntryGrid`, `Excerpts`.

The working name lives only in `src/lib/site.ts` (`SITE.name`), which drives the wordmark, titles and metadata.

## Accessibility

Semantic landmarks and headings; skip link; visible red focus rings; all map nodes and timeline items are focusable
buttons with descriptive labels; the map has a "read as a list" alternative; the search overlay is a modal dialog with a
combobox/listbox pattern and focus trapping; comparison data is a real `<table>`; motion is disabled under
`prefers-reduced-motion`; colour is never the only carrier of meaning (stances have glyphs and labels).

## Guided journeys

`/guided` is a way of navigating the knowledge base, not a second content architecture. A journey is a learning
path flagged `guided` (see [`DATA_MODEL.md`](DATA_MODEL.md#guided-journeys)); `lib/data/guided.ts` reads it through
the same visibility scope as every public page and assembles each step from the stop entity's own fields, excerpts
and relationships. `components/views/GuidedView.tsx` renders the overview and the step pages for both the public
route and the desk preview, reusing `PathRoute`, `DepthReader`, `Excerpts`, `Prose` and `Notes`. Journeys are
created, edited, reviewed and published in the desk like any other path; nothing about a particular journey is
hard-coded in the frontend.

## Editorial system & security

- **Authentication.** Accounts live in `users` (scrypt password hashes). Signing in creates a random session token,
  stored hashed in `sessions` and sent as an HTTP-only, same-site cookie (`secure` in production) that expires after
  seven days. `getCurrentUser()` / `requireUser()` (`lib/auth/session.ts`) resolve it per request. `src/proxy.ts` (Next
  16's middleware) turns away requests without a session cookie early; it is a convenience, not the security boundary.
- **Authorization** is centralised in `lib/editorial/permissions.ts`. Every server action in `app/admin/actions.ts`
  and every `/api/desk/*` handler resolves the user on the server and the editorial library calls `assertCan()` before
  writing. Client components only decide which buttons to show.
- **Revisions.** Every save writes a snapshot to `revisions` (`{fields, structure}`); autosaves by the same person within
  half an hour are folded into one open version. For an entry that is not live, saves also write the tables; for a live
  entry the tables keep the published version and the working copy lives only in revisions until **publish** copies it
  across. Restoring writes the old snapshot as a new version.
- **Staging.** Structural rows of live entries (relationships, citations, excerpts, images, debate and path
  structure) are staged until publication (`lib/editorial/staging.ts`); `releaseStaged()` runs inside publish.
- **Preview scope.** `lib/data/scope.ts` holds a per-request scope (React `cache`). Public requests see only live
  entries and released rows; a desk preview enters a scope listing the entries (or the whole collection) whose working
  copies may be shown. Every data helper consults `entityVisible()` / `stagedVisible()` rather than reading `live`
  directly, so preview and public rendering share one code path.
- **Concurrency.** `entities.lock_version` is compared-and-set on every save; a stale save fails with a conflict that
  the editor shows to the user.
- **Publication propagates** by setting `live`, reindexing search and calling `revalidatePath("/", "layout")`, which
  refreshes prerendered pages, maps and timelines.
- **Slugs.** Renaming a published entry records the old slug in `slug_history`; public routes redirect permanently
  (`lib/routing.ts`).
- **Uploads** go through `/api/desk/media` (server actions are limited to 1 MB). Files are identified by content
  (magic bytes, no SVG), de-duplicated by SHA-256 and stored under `MEDIA_DIR`; `/media/[id]` serves them with
  `nosniff` and a restrictive CSP, publicly only while attached to a live entry.
- **No default credentials** in production; demo accounts are created only outside production with
  `ATLAS_DEMO_USERS=1`. The audit log scrubs any metadata key resembling a password, token, secret, hash, cookie or
  session.
