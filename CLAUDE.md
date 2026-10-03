@AGENTS.md

# THEORY / ATLAS — notes for Claude Code

Read `README.md` and `docs/ARCHITECTURE.md` first. Key rules:

- Pages get content only through `src/lib/data/index.ts`; never query the database from a component or hard-code content.
- Relationship semantics live in `src/lib/content/model.ts`; store canonical types only (`normaliseRelationship`).
- Editorial writes go through `src/lib/editorial/*` (content, structure, sources, media — they record revisions,
  audit entries and keep the FTS index in sync) called from server actions in `src/app/admin/actions.ts` or
  `/api/desk/*` handlers, which resolve the user with `requireUser()`/`apiUser()` and `revalidatePath` on public changes.
- Authorization lives only in `src/lib/editorial/permissions.ts` (`can`/`assertCan`); enforce it on the server, never
  only by hiding UI. Public visibility is `entities.live`, never `status`.
- New editable fields: schema → `npm run db:generate` → `src/lib/editorial/fields.ts` → search index → data aggregate
  (and the view in `src/components/views/`, which both the public page and the preview render).
- Desk accounts for development: `contributor|reviewer|editor|admin@atlas.test`, password `atlas-demo-2026`.
- Do not invent quotations or scholarly claims in seed data; see `docs/EDITORIAL.md`.
- Use only the design tokens in `src/app/globals.css`; keep the editorial idiom (rules, labels, serif display, restrained red).
- Verify with `npm run typecheck` and `npm run test:e2e`.

## Writing style

For all original public-facing prose, explanations, thinker summaries, concept explanations, introductions, debates, timelines, learning-path copy, and other editorial writing:

- Use the `avoid-ai-writing` skill as a final prose audit before saving the content.
- Preserve factual accuracy, citations, quotations, attribution, and the intended meaning.
- Prefer clear, natural, specific writing over generic polished or promotional language.
- Do not apply rewriting to source quotations, citations, code, configuration, structured data, or database mechanics.
- Do not invent facts or alter scholarly claims just to make prose sound more natural.
