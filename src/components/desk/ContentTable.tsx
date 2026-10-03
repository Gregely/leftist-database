import Link from "next/link";
import type { DeskRow } from "@/lib/editorial/queries";
import { EmptyState, KindLabel, LiveBadge, StatusBadge, When } from "./ui";

/** Optional row selection, supplied by the bulk-review wrapper (BulkReview). */
export interface RowSelection {
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  /** Rows nothing can be done to in bulk are shown without a checkbox. */
  isSelectable: (id: string) => boolean;
}

function SelectBox({ row, selection }: { row: DeskRow; selection: RowSelection }) {
  if (!selection.isSelectable(row.id)) return <span className="inline-block w-4" aria-hidden />;
  return (
    <input
      type="checkbox"
      className="h-4 w-4 accent-red"
      checked={selection.isSelected(row.id)}
      onChange={() => selection.toggle(row.id)}
      aria-label={`Select “${row.title}”`}
      data-bulk-select={row.id}
    />
  );
}

/** Editorial listing: a ruled table on wide screens, stacked rows on phones. */
export function ContentTable({
  rows,
  empty = "Nothing here.",
  compact = false,
  selection,
}: {
  rows: DeskRow[];
  empty?: string;
  compact?: boolean;
  selection?: RowSelection;
}) {
  if (!rows.length) return <EmptyState>{empty}</EmptyState>;
  return (
    <div>
      <table className="hidden w-full border-collapse text-left text-sm md:table">
        <thead>
          <tr className="border-b border-ink">
            {selection && (
              <th scope="col" className="w-8 py-2">
                <span className="sr-only">Select</span>
              </th>
            )}
            {["Entry", "Status", ...(compact ? [] : ["Public", "Author", "Reviewer"]), "Edited"].map((h) => (
              <th key={h} scope="col" className="label py-2 pr-4 font-medium text-faint">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={`border-b border-rule align-baseline hover:bg-paper-warm ${selection?.isSelected(r.id) ? "bg-paper-warm" : ""}`}>
              {selection && (
                <td className="py-2.5 pr-2 align-middle">
                  <SelectBox row={r} selection={selection} />
                </td>
              )}
              <td className="py-2.5 pr-4">
                <KindLabel kind={r.kind} className="mr-3" />
                <Link href={`/admin/entries/${r.id}`} className="font-serif text-[1.08rem] hover:text-red">
                  {r.title}
                </Link>
                {r.openNotes > 0 && (
                  <span className="label ml-2 text-red" title={`${r.openNotes} open notes`}>
                    ✎ {r.openNotes}
                  </span>
                )}
                {r.isSample && <span className="label ml-2 text-faint">sample</span>}
              </td>
              <td className="pr-4">
                <StatusBadge status={r.status} />
              </td>
              {!compact && (
                <>
                  <td className="pr-4">
                    <LiveBadge live={r.live} pending={r.pending} />
                  </td>
                  <td className="pr-4 text-muted">{r.authorName ?? "—"}</td>
                  <td className="pr-4 text-muted">{r.reviewerName ?? "—"}</td>
                </>
              )}
              <td className="label-mono text-faint">
                <When at={r.updatedAt} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="border-t border-ink md:hidden">
        {rows.map((r) => (
          <li key={r.id} className={`border-b border-rule ${selection ? "flex items-start gap-3" : ""}`}>
            {selection && (
              <span className="pt-4">
                <SelectBox row={r} selection={selection} />
              </span>
            )}
            <Link href={`/admin/entries/${r.id}`} className="block min-w-0 flex-1 py-3">
              <span className="flex items-baseline justify-between gap-3">
                <KindLabel kind={r.kind} />
                <StatusBadge status={r.status} />
              </span>
              <span className="mt-1 block font-serif text-lg leading-tight">{r.title}</span>
              <span className="label-mono mt-1 flex gap-3 text-faint">
                <When at={r.updatedAt} />
                {r.authorName && <span>{r.authorName}</span>}
                {r.openNotes > 0 && <span className="text-red">✎ {r.openNotes}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
