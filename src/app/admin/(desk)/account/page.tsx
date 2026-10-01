import type { Metadata } from "next";
import { PasswordForm } from "@/components/desk/PasswordForm";
import { DeskHeading, DeskLink, DeskPage, Panel } from "@/components/desk/ui";
import { requireUser } from "@/lib/auth/session";
import { ROLE_LABELS } from "@/lib/content/model";

export const metadata: Metadata = { title: "Your account" };

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <DeskPage className="max-w-4xl">
      <DeskHeading kicker="Account" title={user.name} lede={`${user.email} · ${ROLE_LABELS[user.role]}`} aside={<DeskLink href={`/admin/content?author=${user.id}`}>Your entries →</DeskLink>} />
      <Panel title="Change your password" className="mt-8">
        <PasswordForm />
      </Panel>
    </DeskPage>
  );
}
