-- Full-text search index over every entity (SQLite FTS5).
-- Maintained by the application (lib/data/search-index.ts) whenever an entity
-- or its detail record changes, and rebuilt in full by `npm run db:reindex`.
CREATE VIRTUAL TABLE IF NOT EXISTS search_index USING fts5(
  entity_id UNINDEXED,
  kind UNINDEXED,
  title,
  aliases,
  body,
  tokenize = 'porter unicode61 remove_diacritics 2'
);
