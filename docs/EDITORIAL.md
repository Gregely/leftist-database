# The Atlas Editorial Desk

The desk at `/admin` is the only way content enters the Atlas. It writes to the same tables the public site reads —
there is no separate admin data model — and nothing reaches the public site until an editor publishes it.

## Roles

| Role | Can |
| --- | --- |
| **Contributor** | Create entries; edit their own entries while in draft, revision requested, rejected (and propose edits to their own published entries); add sources, excerpts and media; submit for review. Cannot review, publish or archive. |
| **Reviewer** | Everything a contributor can, plus start reviews, leave field- and passage-level notes, request revisions, reject, approve, and mark excerpts *verified*. Never signs off their own work. |
| **Editor** | Edit any entry; change structure on live entries (relationships, citations, media, debate and path structure); publish, unpublish, archive and restore; global relationship editing; edit any source or media record. |
| **Administrator** | Everything editors can, plus **People** (create accounts, change roles, deactivate/reactivate, reset passwords) and the **Audit log**. |

Permissions are decided in one place, `src/lib/editorial/permissions.ts` (`can()` / `assertCan()`), and enforced on the
server by every server action and desk API route. Buttons the user may not use are hidden, but hiding is a courtesy —
the server refuses the action regardless.

## Workflow

```
DRAFT → SUBMITTED → UNDER REVIEW → REVISION REQUESTED → RESUBMITTED → UNDER REVIEW → APPROVED → PUBLISHED
                                 ↘ REJECTED                                                  ↘ UNPUBLISHED
any (editor) → ARCHIVED → restore → DRAFT / UNPUBLISHED
```

- **Submit** sends the entry to the review queue (`/admin/review`); the author can no longer edit it until a reviewer
  responds.
- **Request revision** and **Reject** require a note, which the author sees in the Review tab.
- **Publish** is available to editors on approved entries and is refused while structural checks report errors.
- Editing a published entry starts a new cycle: the public page keeps showing the published version until the new one
  is reviewed and published (the entry header shows "Unpublished changes: vN (live: vM)").
- **Unpublish** and **Archive** show what depends on the entry (relationships, learning paths, debates, prose links)
  before asking for confirmation. Published material is never hard-deleted; only never-published drafts can be deleted.

Whether an entry is public is the `live` flag; `status` is where its current edit cycle stands. Public queries,
search, maps, timelines and `/api/*` only ever read live entries.

### Bulk review

Editors can select several entries in the **Review queue** or the **Content** list (checkboxes; *Select all on this
page*) and apply one workflow step to all of them: **Start review**, **Request revision** (one required note, added
to each entry), **Approve** (optional note) or **Publish**. It is the same workflow, not a separate system
(`lib/editorial/bulk.ts`):

- Each entry goes through `transition()` individually, with its own permission check, structural checks (an entry with
  errors is refused publication), revision sealing and audit record; one extra `bulk_transition` audit record lists
  what was requested, done and skipped.
- Only selected entries in a state where the step applies are changed; the confirmation lists them and says how many
  others will be left as they are. An entry edited since the page was loaded is skipped rather than swept along.
- Approving or publishing **never resolves or removes notes or flags**; the confirmation counts the open ones.
- Approval and publication stay separate steps. Publishing in bulk asks for the number of entries to be typed in.
- Bulk tools are for editors (`entity.bulkReview` in `permissions.ts`); unpublish, archive and delete are not offered.

### Staged changes on live entries

Structural changes to a live entry are **staged** until its next publication, just like its fields:

- New relationships, citations, excerpts and images attached to a live entry are stored with `staged_for` = that
  entry and marked *◌ with next publication* in the desk. Publishing the entry releases them; until then the public
  site does not see them.
- Editing a live debate's positions, stances and arguments, or a live path's route, works on a **staged copy** of the
  whole structure. Publishing replaces the public structure with it. (There is no desk button yet to discard a staged copy;
  `resetStructure()` in `lib/editorial/structure.ts` does this for the corpus importer.)
- Removing a public row from a live entry is reserved for editors.

## Editing an entry

The entry editor (`/admin/entries/[id]`) has tabs:

- **Content** — the fields for the entry's kind (defined in `src/lib/editorial/fields.ts`), grouped into sections.
  Long-form fields use the rich-text editor. The editor **autosaves** a few seconds after you stop typing (the save
  bar reads *Unsaved changes → Saving… → Saved · time*), saves when you switch tabs or windows, warns before you leave
  with unsaved work, and keeps a backup in the browser that it offers to restore. **Save version** saves with a note.
  If someone else saved the entry in the meantime, your save is refused and you choose whether to load their version
  or save yours over it — nothing is silently overwritten.
- **Connections** — the relationship builder (FROM · TYPE · TO, with note, dates, context, weight and source), a map of
  the entry's neighbourhood and its place on the timeline. Inverse phrasings ("influenced by") are stored canonically.
- **Sources & excerpts** — entry-level citations and excerpts. Each excerpt has a verification status:
  *Unverified*, *Needs review* or *Verified* (reviewers and above). Leave the quotation empty to record a passage
  reference instead.
- **Media** — attach images from the library or upload new ones (portrait, photograph, cover, scan, diagram, figure).
- **Positions & arguments** (debates) / **Route** (learning paths).
- **Review** — editorial notes, general or attached to a field and passage. Notes are internal and never public.
- **History** — every version, who saved it and what changed; compare any two versions word by word; **restore** an
  old version (this creates a new version — history is never rewritten).

The right-hand rail shows a **completeness** checklist for the kind (a guide to what entries usually cover, not a
score), structural **checks** (errors, warnings, information: broken links, missing required fields, unsourced
relationships, unverified quotations…) and open feedback. The checks are about structure and sourcing; whether an
interpretation is right is for editors to judge.

**Preview** renders the working copy with the public page components. On wide screens **Side-by-side** puts the
preview beside the editor; on phones an **Editor / Preview** switch toggles between them. Previews require a desk
session and are never indexed.

## The rich-text editor

A word-labelled toolbar: **H2 / H3**, **Bold / Italic**, **Quote**, **• List / 1. List**, **Note box** (callout),
**Link entry**, **Web link**, **Cite**, **Footnote**, **Figure** and **Excerpt**.

- **Link entry** (⌘⇧L): select words, search the Atlas, choose an entry. Links are stored by kind and slug, so they
  follow renames (old slugs redirect) and read as plain text while the target is unpublished.
- **Cite** inserts a numbered citation to a source with an optional page; it also lists the source on the entry.
- **Figure** places an image from the media library with a caption; **Excerpt** embeds one of the entry's excerpts.

Content is stored as Atlas markup (`src/lib/content/markup.ts`), a small superset of Markdown:

| Markup | Meaning |
| --- | --- |
| `## Heading`, `### Subheading` | Section headings |
| `**strong**`, `*emphasis*`, `> quote`, `- item`, `1. item` | As in Markdown |
| `:::note` … `:::` | Callout box |
| `[label](https://…)` | External link |
| `[[concept:alienation]]`, `[[thinker:marx\|Marx's]]` | Link to an entry (optionally relabelled) |
| `[cite:src_capital_fowkes, p. 125]` | Citation footnote |
| `[^Footnote text]` | Editorial footnote |
| `[[figure:med_…\|Caption]]` | Figure from the media library |
| `[[excerpt:ex_…]]` | Embedded excerpt |

## Sources and media

- **Sources** (`/admin/sources`) are the shared bibliography: author, title, edition, translator, editors, publisher,
  place, date, container title, ISBN, URL and type. Sources can also be catalogued inline from any source picker.
  Sources in use cannot be deleted. A source is public only while something live cites it.
- **Media** (`/admin/media`) holds images with title, alt text (required), caption, creator, credit, source, licence,
  rights notes, year and tags. Uploads are checked by content (JPEG, PNG, WebP, GIF; no SVG; 12 MB max) and identical
  files are stored once. An image is publicly served only while attached to a live entry. Files live in `MEDIA_DIR`.

## Places

The **Geography** section draws on two kinds of place data, kept apart because they mean different things.

- **Place fields** already on entries: a thinker's birthplace and place of death, an event's location. Write them
  as the sources do, with the name of the period ("Trier, Prussia", "Petrograd"). The map locates a wording only
  when a place in the gazetteer lists it exactly; the entry's **Places** tab shows which wordings are located, and
  links an unlocated one to *add place*.
- **Recorded associations**, added on the **Places** tab: residence, exile, political activity, where a text was
  written or first published, and a movement's regional influence. Each takes a place, years, a short note and a
  source with a locator. On a live entry they wait for its next publication, like relationships.

The **gazetteer** (`/admin/places`) lists every place, how often it is used, and the wordings on entries that match
none. A place needs a name (the name of the period, with other names and their dates under *Other names*), a kind,
coordinates and where the coordinates come from: a Wikidata item, or another named gazetteer. Never estimate
coordinates. Use *Historical context* for the states and provinces a place belonged to and when that changed; the
public map draws no borders and relies on these notes. Regions and countries are shown as names or listed, never
as points. Any desk user can add a place; editors (or the place's creator) can change it; a place in use cannot be
deleted.

## Collections

An entry can carry editorial **collection** tags (`entities.editorial_tags`), for example the *Initial Marx Corpus*.
Collections are internal: the Content list can be filtered by collection, and the preview of any entry in a
collection offers *Include unpublished “…” entries*, which renders the page with the rest of the collection's drafts
and pending versions visible — links, relationships, maps, timelines and paths included — so a reviewer can read a
body of new work as a whole before any of it is published. The scope applies only to that preview request.

## Guided journeys

Guided journeys (`/guided`) are learning paths offered step by step to readers who do not know where to start. They
are built from entries that already exist; a journey adds only a few lines of copy around each one.

- **Create** a journey with *New entry → Path*. Give it a title, an entry line (the reader's question, e.g. “I don't
  know where to start.”), a summary, and on the Content tab tick **Offer this path as a Guided journey** and fill in
  **What the journey covers**. Rename it or change its description there at any time.
- **Steps** are managed on the **Route** tab: *Add a stop* picks any existing entry; ↑/↓ reorder the main route;
  *Remove* drops a stop; *Branch from a stop* adds an optional side route. Open **Guided copy** on a stop to write
  *Where you are*, *Why it matters* and *Continue* (on the last stop, an optional closing note), choose the
  **Featured excerpt** from the entry's own excerpts, or **point the stop at a different entry** (its copy is kept).
  Validation warns about stops missing copy; Completeness lists *Journey overview* and *Guided copy*.
- **Review and publication** are the ordinary workflow: submit, review, approve, publish, unpublish. Changes to a
  published journey are staged until it is published again. A journey only ever shows stops whose entries are
  public, so publish the entries first (or with it); the preview — with *Include unpublished “…” entries* for a
  collection — shows the journey as readers will see it, drafts included.
- The step page itself is assembled from the entry: its depth reader levels, excerpts, and connections. To improve
  what a step says about an idea, edit the entry, not the journey.

The first journey, **Understanding Marx**, was imported from `corpus/guided-understanding-marx` (18 stops, Marx to
Lenin, built only from the Initial Marx Corpus) and submitted for review; like the corpus, it is not published.
A database that does not have it yet (for example a new checkout) gets both with `npm run corpus -- setup`. Until it
is published, find it in the desk under Content (type *Path*, or collection *Guided journeys*) and the Review queue;
the public `/guided` page lists published journeys only.

## Research corpora

Researched content can be prepared as data under `corpus/` and loaded through the editorial library with
`npm run corpus`. Nothing is published by an import; flags become editorial notes. See
[`docs/CORPUS.md`](CORPUS.md).

## Audit

Logins, failed logins, creation, each new version, every workflow transition, restores, structural changes, source and
media changes and account changes are written to the audit log (`/admin/audit`, administrators only). Passwords,
tokens and session secrets are never logged.

## Accounts and sessions

Accounts are created by administrators (People) or from the command line (`npm run user:create`). Passwords are
hashed with scrypt; sessions are random tokens in an HTTP-only, same-site cookie (secure in production), stored hashed
and expiring after seven days. Deactivating an account signs it out everywhere. There are no default credentials in
production; the demo accounts exist only when `ATLAS_DEMO_USERS=1` outside production.

## Sample content and accuracy

- Seeded records are **sample** entries, marked on every page. Replace or promote them deliberately.
- **Never invent quotations.** Quote only from an edition recorded as a source, give a locator, and leave the excerpt
  *Unverified* until a reviewer has checked the wording against that edition. Otherwise record the passage reference
  with an empty quotation.
- Describe positions; do not adjudicate them. Stances are readings: use **qualified** and a note wherever a view is
  contested or complex.
- Prefer a source for every relationship that makes a substantive claim (who influenced whom, who criticised what).
