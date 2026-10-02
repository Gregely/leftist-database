import "server-only";
import { cache } from "react";
import { inArray, or, sql, type SQL, type SQLWrapper } from "drizzle-orm";
import { entities } from "@/lib/db/schema";

/**
 * Visibility scope for one request.
 *
 * Public requests see live entries and released structure only. The
 * authenticated preview widens the scope to the previewed entry — and, when
 * asked, to the other unpublished entries of the same collection — so that it
 * renders exactly what publishing them would show: their staged
 * relationships, citations, excerpts, media and debate/path structure
 * included. The scope is request-local (React `cache`); outside a server
 * render it is always empty, so nothing outside the preview can widen it.
 */
interface Scope {
  /** Entries treated as public for this render. */
  ids: string[];
  /** Query string that keeps links inside the preview (e.g. "with=Initial%20Marx%20Corpus"). */
  linkQuery: string;
}

const holder = cache((): { scope: Scope | null } => ({ scope: null }));

export function enterPreviewScope(ids: string[], linkQuery = "") {
  holder().scope = { ids: [...new Set(ids)], linkQuery };
}

export function previewScope(): Scope | null {
  return holder().scope;
}

const inScope = (column: SQLWrapper, ids: string[]) => sql`${column} IN (${sql.join(ids.map((id) => sql`${id}`), sql`, `)})`;

/** Is the entry (a row of `entities`) visible in this render? */
export function entityVisible(): SQL {
  const scope = previewScope();
  return scope?.ids.length ? or(sql`${entities.live} = 1`, inArray(entities.id, scope.ids))! : sql`${entities.live} = 1`;
}

/** Same rule for raw SQL over an aliased entities table (e.g. `e.live`). */
export function entityVisibleSql(alias: string): SQL {
  const scope = previewScope();
  const live = sql.raw(`${alias}.live = 1`);
  return scope?.ids.length ? sql`(${live} OR ${inScope(sql.raw(`${alias}.id`), scope.ids)})` : live;
}

/**
 * Additive structure (relationships, citations, excerpts, media attachments):
 * released rows, plus rows staged for an entry in the preview scope.
 */
export function stagedVisible(stagedFor: SQLWrapper): SQL {
  const scope = previewScope();
  return scope?.ids.length ? sql`(${stagedFor} IS NULL OR ${inScope(stagedFor, scope.ids)})` : sql`${stagedFor} IS NULL`;
}

/**
 * Replaceable structure (debate positions, propositions, arguments, path
 * steps): normally the released set; for an owner in the preview scope that
 * is being edited as a staged copy, that copy instead.
 */
export function structureVisible(stagedFor: SQLWrapper, ownerId: SQLWrapper): SQL {
  const scope = previewScope();
  if (!scope?.ids.length) return sql`${stagedFor} IS NULL`;
  const forked = sql`(SELECT id FROM entities WHERE staged_structure = 1 AND ${inScope(sql.raw("id"), scope.ids)})`;
  return sql`((${stagedFor} IS NULL AND ${ownerId} NOT IN ${forked}) OR ${inScope(stagedFor, scope.ids)})`;
}
