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
| `status` | `sample` · `draft` · `review` · `published` (only `sample`/`published` are public) |

| Detail table | Fields |
| --- | --- |
| `thinker_details` | `roles`, `birth_place`, `death_place`, `legacy` |
| `concept_details` | `brief` (30 seconds), `standard` (5 minutes), `deep` (deep dive) |
| `text_details` | `original_title`, `language`, `form`, `publication_note`, `difficulty` (1–3), `reading_url` |
| `tendency_details` | `color` (map colour token), `period_label` |
| `debate_details` | `intro` |
| `event_details` | `date_label`, `place`, `event_type` |
| `path_details` | `entry_line`, `level`, `estimated_time` |

## Relationships

`relationships(id, from_id, to_id, type, note, weight 1–3, source_id, locator)` with a unique index on
`(from_id, type, to_id)` and indexes on both endpoints.

Only canonical types are stored. Inverse aliases are accepted from editors and normalised by swapping endpoints;
symmetric types are stored with ids in a stable order.

| Type | Reads forward | Reads backward | Family | Typical use |
| --- | --- | --- | --- | --- |
| `INFLUENCED` (alias `INFLUENCED_BY`) | influenced | influenced by | influence | thinker → thinker, event → text |
| `CRITIQUED` (alias `CRITIQUED_BY`) | critiqued | critiqued by | critique | thinker → thinker / concept |
| `RESPONDED_TO` | responded to | drew a response from | response | text → text / event |
| `DEVELOPED` | developed | developed by | influence | thinker → concept |
| `REJECTED` | rejected | rejected by | critique | thinker → concept |
| `RELATED_TO` | related to | — (symmetric) | affinity | concept ↔ concept, debate ↔ debate |
| `MEMBER_OF` | belongs to | includes | structure | thinker → tendency |
| `ASSOCIATED_WITH` | associated with | — (symmetric) | affinity | event ↔ thinker |
| `WROTE` | wrote | written by | structure | thinker → text |
| `DISCUSSES` | discusses | discussed in | structure | text / debate → concept |
| `PRECEDES` (alias `FOLLOWED_BY`) | precedes | follows | structure | event → event |

Families drive graph styling (influence solid ink, critique dashed red, response dotted, affinity olive).
`getRelations(id)` returns the *other* endpoint labelled from the viewed entity's perspective.

## Sources, citations, excerpts

- `sources(id, title, author, publication_date, publisher, url, source_type, locator, notes)` — `source_type` is one of
  `PRIMARY`, `SECONDARY`, `ACADEMIC`, `HISTORICAL`, `REFERENCE`, `CONTEMPORARY`.
- `citations(entity_id, source_id, locator, field, note, position)` — entry-level support; `field` records which part
  of the entry (e.g. `deep`) the source supports.
- Inline markers `[cite:source_id, locator]` in any markup field become numbered footnotes; entry-level citations not
  cited inline are appended as "general" notes.
- `excerpts(entity_id, text_id, source_id, body, locator, note, verified)` — a passage illustrating an entry. `body`
  may be empty (a reference to a passage); unverified quotations are flagged in the UI.

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

`path_steps(path_id, entity_id, position, framing)` — an ordered route of any entities, each with a framing note.
Detours are computed from the relationship graph.

## Search index

`search_index` is an FTS5 virtual table (`entity_id`, `kind`, `title`, `aliases`, `body`) created in
`drizzle/0001_search_index.sql`. `body` concatenates every readable field including kind-specific ones and debate
positions. It is updated by `indexEntity()` on every editorial write; `npm run db:reindex` rebuilds it.

## Changing the schema

1. Edit `src/lib/db/schema.ts`.
2. `npm run db:generate` → review the SQL in `drizzle/`.
3. If it's a new editable field, add it to `src/lib/admin/fields.ts`; if it should be searchable, add it to
   `SELECT_DOCUMENTS` in `src/lib/db/search-index.ts`.
4. Expose it through the relevant `src/lib/data/*` aggregate.
