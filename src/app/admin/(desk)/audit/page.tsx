import type { Metadata } from "next";
import Link from "next/link";
import { DeskHeading, DeskPage, Notice } from "@/components/desk/ui";
import { requireUser } from "@/lib/auth/session";
import { AUDIT_ACTIONS, listAudit } from "@/lib/editorial/audit";
import { can } from "@/lib/editorial/permissions";
import { staffList } from "@/lib/editorial/queries";

export const metadata: Metadata = { title: "Audit log" };

type Props = { searchParams: Promise<{ actor?: string; action?: string; type?: string; target?: string; page?: string }> };

export default async function AuditPage({ searchParams }: Props) {
  const user = await requireUser();
  if (!can(user, "audit.view")) {
    return (
      <DeskPage className="max-w-3xl">
        <Notice tone="error">The audit log is available to administrators.</Notice>
      </DeskPage>
    );
  }
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const [res, staff] = await Promise.all([
    listAudit({ actorId: sp.actor, action: sp.action, targetType: sp.type, targetId: sp.target, limit: 50, offset: (page - 1) * 50 }),
    staffList(),
  ]);
  const pages = Math.ceil(res.total / 50);
  const qs = (p: number) => `/admin/audit?${new URLSearchParams(Object.entries({ ...sp, page: String(p) }).filter(([, v]) => v) as [string, string][])}`;
  return (
    <DeskPage>
      <DeskHeading kicker="Administration" title="Audit log" lede={`${res.total} recorded actions. Passwords, tokens and session secrets are never logged.`} />
      <form className="mt-6 flex flex-wrap items-end gap-3 border-b border-rule pb-5">
        <label>
          <span className="label mb-1 block text-faint">Person</span>
          <select name="actor" defaultValue={sp.actor ?? ""} className="field w-52 py-1.5">
            <option value="">Everyone</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label mb-1 block text-faint">Action</span>
          <select name="action" defaultValue={sp.action ?? ""} className="field w-52 py-1.5">
            <option value="">All actions</option>
            {AUDIT_ACTIONS.map((a) => (
              <option key={a} value={a}>
                {a.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label mb-1 block text-faint">Target</span>
          <select name="type" defaultValue={sp.type ?? ""} className="field w-40 py-1.5">
            <option value="">Any</option>
            {["entity", "relationship", "source", "media", "place", "user", "session"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn">
          Filter
        </button>
      </form>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink">
              {["When (UTC)", "Who", "Action", "Target", "Details"].map((h) => (
                <th key={h} scope="col" className="label py-2 pr-4 font-medium text-faint">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {res.items.map((l) => (
              <tr key={l.id} className="border-b border-rule align-baseline">
                <td className="label-mono py-2 pr-4 text-faint">{l.createdAt}</td>
                <td className="pr-4">{l.actorName}</td>
                <td className="label pr-4 text-red">{l.action.replace(/_/g, " ")}</td>
                <td className="pr-4">
                  <span className="label mr-2 text-faint">{l.targetType}</span>
                  {l.targetType === "entity" && l.targetId ? (
                    <Link href={`/admin/entries/${l.targetId}?tab=history`} className="link-inline">
                      {l.targetLabel}
                    </Link>
                  ) : (
                    l.targetLabel
                  )}
                </td>
                <td className="max-w-md pr-4 font-mono text-[0.7rem] text-muted">
                  {Object.entries(l.metadata)
                    .filter(([, v]) => v !== undefined && v !== null && v !== "")
                    .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`)
                    .join(" · ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <nav aria-label="Pages" className="mt-4 flex flex-wrap gap-1">
          {Array.from({ length: Math.min(pages, 30) }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={qs(p)} aria-current={p === page ? "page" : undefined} className={`label-mono border px-2.5 py-1 ${p === page ? "border-ink bg-ink text-paper" : "border-rule"}`}>
              {p}
            </Link>
          ))}
        </nav>
      )}
    </DeskPage>
  );
}
