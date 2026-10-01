# Editorial guide

## Adding an entry

1. Sign in at `/admin`.
2. Choose a kind and **+ New**. New entries start as **draft** (invisible to the public).
3. After creating, connect it: **Relationships** (any entry to any other, with a note, weight and optional source),
   **Citations** (entry-level sources with locators) and **Excerpts** (passages). Debates have propositions, positions,
   a stance matrix and arguments; paths have an ordered route.
4. Set status to **published** when it is ready.

## Atlas markup

Long-form fields (overview, legacy, the three concept depths) accept a small extension of Markdown:

| Write | Result |
| --- | --- |
| Blank line | New paragraph |
| `**strong**`, `*emphasis*` | Bold, italic |
| `> quoted text` | Block quotation |
| `- item` | List |
| `[label](https://…)` | External link |
| `[[concept:alienation]]` | Link to an entry, labelled with its title |
| `[[thinker:marx\|Marx's]]` | …with a custom label |
| `[cite:src_capital_fowkes]` | Footnote to a source |
| `[cite:src_capital_fowkes, p. 125]` | …with a locator |

References to unpublished entries render as plain text, so drafts never produce broken links.

## Sample content and accuracy

- Seeded records are **sample** entries, marked on every page. Replace or promote them deliberately.
- Do not add quotations from memory. Quote only from an edition recorded as a source, give a locator, and tick
  "wording checked" when verified. Until then, record the passage reference with an empty body.
- Describe positions; do not adjudicate them. Stances are readings: use **qualified** and a note wherever a view is
  contested or complex.
- Prefer a source for every relationship that makes a substantive claim (who influenced whom, who critiqued what).
