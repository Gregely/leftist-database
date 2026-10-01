import type { Metadata } from "next";
import { SourceEditor } from "@/components/desk/SourceEditor";
import { DeskHeading, DeskPage } from "@/components/desk/ui";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "New source" };

export default async function NewSource() {
  await requireUser();
  return (
    <DeskPage className="max-w-4xl">
      <DeskHeading kicker="Bibliography" title="Catalogue a source" lede="Record the edition you actually used — translator, edition and date matter for page references." />
      <div className="mt-8">
        <SourceEditor initial={{}} canEdit />
      </div>
    </DeskPage>
  );
}
