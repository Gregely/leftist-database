import Link from "next/link";
import { STATUS_LABELS, type EntityKind, type WorkflowStatus } from "@/lib/content/model";
import { diffText, stringify } from "@/lib/editorial/diff";
import { fieldLabel, type FieldValues } from "@/lib/editorial/fields";
import { RestoreButton } from "./RestoreButton";
import { When } from "./ui";

export interface RevisionRow {
  version: number;
  status: WorkflowStatus;
  message: string;
  author: string | null;
  createdAt: string;
  updatedAt: string;
  changed: string[];
  sealed: boolean;
  published: boolean;
}

export function RevisionList({
  entityId,
  kind,
  revisions,
  current,
  canRestore,
  lockVersion,
  compare,
}: {
  entityId: string;
  kind: EntityKind;
  revisions: RevisionRow[];
  current: number;
  canRestore: boolean;
  lockVersion: number;
  compare?: { a: number; b: number };
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-ink">
            {["Version", "Status", "By", "When", "Changes", "Compare", ""].map((h) => (
              <th key={h} scope="col" className="label py-2 pr-3 font-medium text-faint">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {revisions.map((r, i) => {
            const prev = revisions[i + 1];
            return (
              <tr key={r.version} className={`border-b border-rule align-baseline ${compare && (compare.a === r.version || compare.b === r.version) ? "bg-paper-warm" : ""}`}>
                <td className="py-2.5 pr-3">
                  <span className="numeral text-lg text-red">v{r.version}</span>
                  {r.version === current && <span className="label ml-2 text-ink">current</span>}
                  {r.published && <span className="label ml-2 text-olive">published</span>}
                </td>
                <td className="pr-3">
                  <span className="label">{STATUS_LABELS[r.status] ?? r.status}</span>
                </td>
                <td className="pr-3 text-muted">{r.author ?? "—"}</td>
                <td className="label-mono pr-3 text-faint">
                  <When at={r.updatedAt} />
                </td>
                <td className="max-w-xs pr-3">
                  {r.message && <span className="block font-serif italic">{r.message}</span>}
                  <span className="text-xs text-muted">{r.changed.map((f) => fieldLabel(kind, f)).join(", ") || "—"}</span>
                </td>
                <td className="pr-3">
                  {prev && (
                    <Link href={`/admin/entries/${entityId}?tab=history&a=${prev.version}&b=${r.version}`} className="label text-muted hover:text-red">
                      v{prev.version} → v{r.version}
                    </Link>
                  )}
                  {r.version !== current && (
                    <Link href={`/admin/entries/${entityId}?tab=history&a=${r.version}&b=${current}`} className="label ml-3 text-muted hover:text-red">
                      vs current
                    </Link>
                  )}
                </td>
                <td className="text-right">{canRestore && r.version !== current && <RestoreButton entityId={entityId} version={r.version} lockVersion={lockVersion} />}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Field-by-field comparison of two versions, with word-level changes. */
export function CompareView({
  kind,
  a,
  b,
  fieldsA,
  fieldsB,
  structureA,
  structureB,
}: {
  kind: EntityKind;
  a: number;
  b: number;
  fieldsA: FieldValues;
  fieldsB: FieldValues;
  structureA: string[];
  structureB: string[];
}) {
  const keys = [...new Set([...Object.keys(fieldsA), ...Object.keys(fieldsB)])].filter((k) => stringify(fieldsA[k]) !== stringify(fieldsB[k]));
  const added = structureB.filter((x) => !structureA.includes(x));
  const removed = structureA.filter((x) => !structureB.includes(x));
  return (
    <section aria-label={`Comparison of version ${a} and version ${b}`} className="border border-ink bg-paper-warm p-5">
      <p className="label">
        Comparing <span className="text-red">v{a}</span> → <span className="text-red">v{b}</span> · {keys.length} field{keys.length === 1 ? "" : "s"} changed
      </p>
      <p className="mt-1 text-xs text-muted">
        <del className="bg-red/10 text-red-deep decoration-red">Removed</del> · <ins className="bg-olive/15 no-underline">added</ins>
      </p>
      <div className="mt-5 space-y-6">
        {keys.map((k) => (
          <div key={k}>
            <h3 className="label mb-1 border-b border-rule pb-1 font-sans text-faint">{fieldLabel(kind, k)}</h3>
            <p className="whitespace-pre-wrap text-[0.95rem] leading-relaxed">
              {diffText(stringify(fieldsA[k]), stringify(fieldsB[k])).map((p, i) =>
                p.op === "eq" ? (
                  <span key={i}>{p.text}</span>
                ) : p.op === "del" ? (
                  <del key={i} className="bg-red/10 text-red-deep decoration-red">
                    {p.text}
                  </del>
                ) : (
                  <ins key={i} className="bg-olive/15 no-underline">
                    {p.text}
                  </ins>
                ),
              )}
            </p>
          </div>
        ))}
        {(added.length > 0 || removed.length > 0) && (
          <div>
            <h3 className="label mb-1 border-b border-rule pb-1 font-sans text-faint">Connections recorded with these versions</h3>
            <ul className="text-sm">
              {added.map((x) => (
                <li key={`+${x}`} className="text-olive">
                  + {x}
                </li>
              ))}
              {removed.map((x) => (
                <li key={`-${x}`} className="text-red-deep">
                  − {x}
                </li>
              ))}
            </ul>
          </div>
        )}
        {!keys.length && !added.length && !removed.length && <p className="text-sm italic text-muted">These versions are identical.</p>}
      </div>
    </section>
  );
}
