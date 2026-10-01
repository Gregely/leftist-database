@AGENTS.md

# THEORY / ATLAS — notes for Claude Code

Read `README.md` and `docs/ARCHITECTURE.md` first. Key rules:

- Pages get content only through `src/lib/data/index.ts`; never query the database from a component or hard-code content.
- Relationship semantics live in `src/lib/content/model.ts`; store canonical types only (`normaliseRelationship`).
- Editorial writes go through `src/lib/admin/repository.ts` (keeps the FTS index in sync) and server actions in
  `src/app/admin/actions.ts` (which call `requireAdmin()` and `revalidatePath`).
- New editable fields: schema → `npm run db:generate` → `src/lib/admin/fields.ts` → search index → data aggregate.
- Do not invent quotations or scholarly claims in seed data; see `docs/EDITORIAL.md`.
- Use only the design tokens in `src/app/globals.css`; keep the editorial idiom (rules, labels, serif display, restrained red).
- Verify with `npm run typecheck` and `npm run test:e2e`.
