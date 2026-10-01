"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState, useTransition } from "react";
import { createUserAction, resetPasswordAction, setActiveAction, setRoleAction } from "@/app/admin/actions";
import { ROLE_LABELS, ROLES, type Role } from "@/lib/content/model";

export interface UserRow {
  id: string;
  email: string;
  name: string;
  role: Role;
  active: boolean;
  lastLoginAt: string | null;
  entries: number;
  actions: number;
  self: boolean;
}

export function UserTable({ users }: { users: UserRow[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const run = (fn: () => Promise<{ ok: boolean; message?: string; data?: unknown }>, ok: (d?: unknown) => string) =>
    start(async () => {
      const res = await fn();
      setMsg(res.ok ? { ok: true, text: ok(res.data) } : { ok: false, text: res.message ?? "Failed." });
      router.refresh();
    });
  return (
    <div>
      {msg && (
        <p role={msg.ok ? "status" : "alert"} className={`mb-4 border-l-2 px-3 py-1.5 text-sm ${msg.ok ? "border-olive bg-olive/10" : "border-red bg-red/5 text-red-deep"}`}>
          {msg.text}
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink">
              {["Person", "Role", "Status", "Activity", ""].map((h) => (
                <th key={h} scope="col" className="label py-2 pr-4 font-medium text-faint">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className={`border-b border-rule align-baseline ${u.active ? "" : "opacity-60"}`}>
                <td className="py-3 pr-4">
                  <span className="block font-serif text-lg">
                    {u.name}
                    {u.self && <span className="label ml-2 text-faint">you</span>}
                  </span>
                  <span className="label-mono text-faint">{u.email}</span>
                </td>
                <td className="pr-4">
                  <label className="sr-only" htmlFor={`role-${u.id}`}>
                    Role for {u.name}
                  </label>
                  <select
                    id={`role-${u.id}`}
                    value={u.role}
                    disabled={pending}
                    onChange={(e) => run(() => setRoleAction(u.id, e.target.value), () => `${u.name} is now ${ROLE_LABELS[e.target.value as Role].toLowerCase()}.`)}
                    className="field w-auto py-1"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="pr-4">
                  <span className={`label ${u.active ? "text-olive" : "text-faint"}`}>{u.active ? "Active" : "Deactivated"}</span>
                </td>
                <td className="pr-4 text-xs text-muted">
                  {u.entries} entries · {u.actions} actions
                  <span className="block">Last sign-in: {u.lastLoginAt ? u.lastLoginAt.slice(0, 16).replace("T", " ") : "never"}</span>
                  <a href={`/admin/audit?actor=${u.id}`} className="link-inline">
                    Activity
                  </a>
                </td>
                <td className="space-x-3 whitespace-nowrap text-right">
                  {!u.self && (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => run(() => setActiveAction(u.id, !u.active), () => (u.active ? `${u.name} was deactivated and signed out.` : `${u.name} was reactivated.`))}
                      className="label text-muted hover:text-red"
                    >
                      {u.active ? "Deactivate" : "Reactivate"}
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      if (window.confirm(`Reset the password for ${u.name}?`))
                        run(() => resetPasswordAction(u.id), (d) => `New temporary password for ${u.name}: ${(d as { password: string }).password} — share it securely; it is shown once.`);
                    }}
                    className="label text-muted hover:text-red"
                  >
                    Reset password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function NewUserForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(async (prev: Awaited<ReturnType<typeof createUserAction>> | null, f: FormData) => {
    const res = await createUserAction(prev, f);
    if (res.ok) router.refresh();
    return res;
  }, null);
  return (
    <form action={action} className="grid gap-3 border border-ink bg-paper-warm p-4 sm:grid-cols-2 lg:grid-cols-5">
      <label className="lg:col-span-1">
        <span className="label mb-1 block">Name</span>
        <input name="name" required className="field" />
      </label>
      <label className="lg:col-span-2">
        <span className="label mb-1 block">Email</span>
        <input name="email" type="email" required className="field" />
      </label>
      <label>
        <span className="label mb-1 block">Role</span>
        <select name="role" defaultValue="contributor" className="field">
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="label mb-1 block">Password</span>
        <input name="password" type="text" placeholder="Leave blank to generate" className="field" autoComplete="off" />
      </label>
      <div className="sm:col-span-2 lg:col-span-5">
        <button type="submit" disabled={pending} className="btn btn-red">
          {pending ? "Creating…" : "Create account"}
        </button>
        {state && !state.ok && <span className="ml-3 text-sm text-red-deep">{state.message}</span>}
        {state?.ok && (
          <span role="status" className="ml-3 text-sm">
            Account created.
            {(state.data as { password: string })?.password && (
              <>
                {" "}
                Temporary password: <code className="font-mono">{(state.data as { password: string }).password}</code> — shown once.
              </>
            )}
          </span>
        )}
      </div>
    </form>
  );
}
