# Data model

Source of truth: `src/lib/db/schema.ts` (tables) and `src/lib/content/model.ts` (vocabularies).

## Entities (class-table inheritance)

Every explorable thing is a row in `entities`, plus one row in its kind's detail table.

| `entities` column | Meaning |
| --- | --- |
| `id` | Opaque id, prefixed by kind (`th_`, `co_`, `tx_`, `td_`, `db_`, `ev_`, `pa_`) |
| `kind` | `thinker` · `concept` · `text` · `tendency` · `debate` · `event` · `path` |
| `slug` | URL name, unique per kind |
| `title`, `subtitle`, `summary`, `body` | Display fields; `body` is Atlas markup |
| `aliases` | JSON array of alternative names (searchable) |
| `year_start`, `year_end` | Positions the entity in time (life, publication, event, span) — powers the timeline |
| `featured`, `sort_order` | Editorial curation |
| `live` | Whether the entry is on the public site. Public queries read only live entries |
| `status` | Workflow status of the current edit cycle: `draft` · `submitted` · `under_review` · `revision_requested` · `resubmitted` · `approved` · `published` · `unpublished` · `archived` · `rejected` |
| `is_sample` | Seeded sample record (labelled on the site) |
| `author_id`, `reviewer_id`, `last_edited_by` | Desk users |
| `lock_version` | Optimistic-concurrency counter, compared-and-set on every save |
| `revision`, `published_revision` | Latest saved version and the version on the public site |
| `published_at`, `submitted_at` | Workflow timestamps |

| Detail table | Fields |
| --- | --- |
| `thinker_details` | `roles`, `birth_place`, `death_place`, `context`, `legacy` |
| `concept_details` | `brief` (30 seconds), `standard` (5 minutes), `deep` (deep dive), `history`, `interpretations`, `criticisms` |
| `text_details` | `original_title`, `language`, `form`, `publication_note`, `edition`, `context`, `difficulty` (1–3), `reading_url` |
| `tendency_details` | `color` (map colour token), `period_label`, `context`, `criticisms`, `legacy` |
| `debate_details` | `intro`, `context` |
| `event_details` | `date_label`, `place`, `event_type`, `significance` |
| `path_details` | `entry_line`, `level`, `estimated_time`, `prerequisites` |

## Relationships

`relationships(id, from_id, to_id, type, note, weight 1–3, source_id, locator, year_start, year_end, context, created_by)`
with a unique index on
`(from_id, type, to_id)` and indexes on both endpoints.

Only canonical types are stored. Inverse aliases are accepted from editors and normalised by swapping endpoints;
symmetric types are stored with ids in a stable order.

| Type | Reads forward | Reads backward | Family | Typical use |
| --- | --- | --- | --- | --- |
| `INFLUENCED` (alias `INFLUENCED_BY`) | influenced | influenced by | influence | thinker → thinker, event → text |
| `CRITIQUED` (alias `CRITIQUED_BY`) | criticised | criticised by | critique | thinker → thinker / concept |
| `RESPONDED_TO` | responded to | drew a response from | response | text → text / event |
| `DEVELOPED` | developed | developed by | influence | thinker → concept |
| `REJECTED` | rejected | rejected by | critique | thinker → concept |
| `RELATED_TO` | related to | — (symmetric) | affinity | concept ↔ concept, debate ↔ debate |
| `MEMBER_OF` | belongs to | includes | structure | thinker → tendency |
| `ASSOCIATED_WITH` | associated with | — (symmetric) | affinity | event ↔ thinker |
| `WROTE` | wrote | written by | structure | thinker → text |
| `DISCUSSES` | discusses | discussed in | structure | text / debate → concept |
| `PRECEDES` (alias `FOLLOWED_BY`) | precedes | followed by | structure | event → event |
| `EXTENDED` (alias `EXTENDED_BY`) | extended | extended by | influence | thinker → concept / text |
| `EDITED` (alias `EDITED_BY`) | edited | edited by | structure | thinker → text |
| `CITES` (alias `CITED_BY`) | cites | cited by | structure | text → text |
| `PARTICIPATED_IN` | participated in | participants include | affinity | thinker → event |
| `CONTRASTS_WITH` | contrasts with | — (symmetric) | critique | concept ↔ concept, tendency ↔ tendency |
| `PRESUPPOSES` | builds on | is a prerequisite for | structure | concept → concept |

Families drive graph styling (influence solid ink, critique dashed red, response dotted, affinity olive).
`getRelations(id)` returns the *other* endpoint labelled from the viewed entity's perspective.

## Sources, citations, excerpts

- `sources(id, title, author, editors, translator, edition, publication_date, publisher, place, container_title, isbn,
  url, source_type, locator, notes, created_by)` — `source_type` is one of
  `PRIMARY`, `SECONDARY`, `ACADEMIC`, `HISTORICAL`, `REFERENCE`, `CONTEMPORARY`.
- `citations(entity_id, source_id, locator, field, note, position)` — entry-level support; `field` records which part
  of the entry (e.g. `deep`) the source supports.
- Inline markers `[cite:source_id, locator]` in any markup field become numbered footnotes; entry-level citations not
  cited inline are appended as "general" notes.
- `excerpts(entity_id, text_id, speaker_id, source_id, body, locator, note, verification, created_by)` — a passage
  illustrating an entry. `body` may be empty (a reference to a passage). `verification` is `unverified`,
  `needs_review` or `verified`; only reviewers and above can set `verified`, and the public site labels the others.
- Entry-level citations added by the rich-text **Cite** tool are kept in sync with the prose (`field = 'inline'`).

## Debates

```
debate ── debate_propositions (the axes of comparison)
       ── debate_positions (label, holder → thinker/tendency, central claim, summary, assumptions[], criticisms[])
             ├─ position_stances (position × proposition → affirms | qualified | rejects | silent, + note)
             └─ position_links (texts, concepts, events the position relies on)
       ── debate_arguments (argument | counterargument, by position, responds_to → argument)
```

The compare view computes, for the selected positions, which propositions they share and where they diverge.

## Learning paths

`path_steps(path_id, entity_id, position, framing, track, parent_step_id)` — an ordered route of any entities, each
with a framing note. `track = 'main'` steps form the route; `track = 'branch'` steps hang off a main step
(`parent_step_id`) as optional branches. Detours are computed from the relationship graph.

## Media

- `media(id, sha256 unique, file_name, original_name, mime_type, size, width, height, title, description, caption,
  alt_text, creator, credit, source_text, source_id, license, rights, year, tags, created_by)` — one row per distinct file.
- `entity_media(entity_id, media_id, role, caption, position)` — attachments, with `role` one of `portrait`,
  `photograph`, `cover`, `scan`, `diagram`, `figure`. Figures placed in prose are attached automatically.

## Editorial tables

| Table | Purpose |
| --- | --- |
| `users` | Desk accounts: email, name, role (`contributor` · `reviewer` · `editor` · `admin`), scrypt hash, active |
| `sessions` | Hashed session tokens with expiry |
| `revisions` | `(entity_id, version)` snapshots `{fields, structure}`, changed fields, message, status, author, sealed |
| `editorial_notes` | Review notes: general or attached to a field and quoted passage; resolved flag. Never public |
| `audit_log` | Who did what to which target, with scrubbed metadata |
| `slug_history` | Old `(kind, slug)` pairs pointing at an entity, for permanent redirects |

Columns that support staging and collections:

| Column | Purpose |
| --- | --- |
| `entities.staged_changes` | The live entry has staged structural rows waiting for its next publication |
| `entities.staged_structure` | A live debate or path is being edited as a staged copy of its structure |
| `entities.editorial_tags` | JSON array of internal collection names (e.g. `"Initial Marx Corpus"`) |
| `relationships` / `citations` / `excerpts` / `entity_media` `.staged_for` | The live entry whose publication releases the row; `NULL` for released rows |
| `debate_positions` / `debate_propositions` / `debate_arguments` / `path_steps` `.staged_for`, `.origin_id` | Rows of a staged copy of a debate or path, and the released row each was copied from |

Relationship uniqueness is enforced separately for released rows (`relationships_unique`, `WHERE staged_for IS NULL`)
and staged rows (`relationships_staged_unique`), so a staged edit can shadow a public relationship until release.
Public queries read only released rows of live entries; the request-scoped preview scope (`lib/data/scope.ts`) widens
this for desk previews.

## Search index

`search_index` is an FTS5 virtual table (`entity_id`, `kind`, `title`, `aliases`, `body`) created in
`drizzle/0001_search_index.sql`. `body` concatenates every readable field including kind-specific ones and debate
positions. Only live entries are indexed. It is updated by `indexEntity()` on every editorial write and workflow
transition; `npm run db:reindex` rebuilds it.

Migrations `0002_editorial.sql` / `0003_excerpt_verification.sql` add the editorial system and convert existing
databases: former `sample`/`published` entries become live (`sample` ones flagged `is_sample`), `review` becomes
`under_review`, and excerpts' boolean `verified` becomes `verification`.

## Changing the schema

1. Edit `src/lib/db/schema.ts`.
2. `npm run db:generate` → review the SQL in `drizzle/`.
3. If it's a new editable field, add it to `KIND_FIELDS` in `src/lib/editorial/fields.ts` (and to `DETAIL_TABLES` in
   `src/lib/editorial/content.ts` if it lives in a detail table); if it should be searchable, add it to
   `SELECT_DOCUMENTS` in `src/lib/db/search-index.ts`.
4. Expose it through the relevant `src/lib/data/*` aggregate.
