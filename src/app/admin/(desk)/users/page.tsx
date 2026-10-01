import type { Metadata } from "next";
import { NewUserForm, UserTable } from "@/components/desk/UserAdmin";
import { DeskHeading, DeskPage, Notice, Panel } from "@/components/desk/ui";
import { requireUser } from "@/lib/auth/session";
import { listUsers } from "@/lib/auth/users";
import { ROLE_LABELS, type Role } from "@/lib/content/model";
import { can } from "@/lib/editorial/permissions";

export const metadata: Metadata = { title: "People" };

const ROLE_HELP: Record<Role, string> = {
  contributor: "Creates and edits their own drafts, adds sources and media, submits for review.",
  reviewer: "Reviews submissions, leaves feedback, requests revisions, approves.",
  editor: "Edits everything; publishes, unpublishes and archives; manages the workflow.",
  admin: "Everything editors do, plus people, roles and the audit log.",
};

export default async function UsersPage() {
  const user = await requireUser();
  if (!can(user, "users.manage")) {
    return (
      <DeskPage className="max-w-3xl">
        <Notice tone="error">Only administrators can manage people.</Notice>
      </DeskPage>
    );
  }
  const users = await listUsers();
  return (
    <DeskPage>
      <DeskHeading kicker="Administration" title="People" lede="Accounts and roles for the editorial desk. Deactivating someone signs them out immediately; nothing they wrote is lost." />
      <div className="mt-8 space-y-10">
        <Panel title="Add a person">
          <NewUserForm />
        </Panel>
        <Panel title={`Accounts · ${users.length}`}>
          <UserTable
            users={users.map((u) => ({
              id: u.id,
              email: u.email,
              name: u.name,
              role: u.role as Role,
              active: u.active,
              lastLoginAt: u.lastLoginAt,
              entries: Number(u.entries),
              actions: Number(u.actions),
              self: u.id === user.id,
            }))}
          />
        </Panel>
        <Panel title="Roles">
          <dl className="grid gap-4 sm:grid-cols-2">
            {(Object.keys(ROLE_HELP) as Role[]).map((r) => (
              <div key={r} className="border-l-2 border-rule pl-3">
                <dt className="label">{ROLE_LABELS[r]}</dt>
                <dd className="text-sm text-muted">{ROLE_HELP[r]}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
    </DeskPage>
  );
}
