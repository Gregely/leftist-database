import type { Metadata } from "next";
import { NewEntryForm } from "@/components/desk/NewEntryForm";
import { DeskHeading, DeskPage } from "@/components/desk/ui";
import { requireUser } from "@/lib/auth/session";
import { isEntityKind } from "@/lib/content/model";

export const metadata: Metadata = { title: "New entry" };

type Props = { searchParams: Promise<{ kind?: string }> };

export default async function NewEntry({ searchParams }: Props) {
  await requireUser();
  const { kind } = await searchParams;
  return (
    <DeskPage className="max-w-4xl">
      <DeskHeading kicker="Begin" title="A new entry" lede="Choose what you are adding and give it a working title. Everything else happens in the editor — nothing is public until it has been reviewed and published." />
      <div className="mt-8">
        <NewEntryForm initialKind={kind && isEntityKind(kind) ? kind : undefined} />
      </div>
    </DeskPage>
  );
}
