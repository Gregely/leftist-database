import type { Metadata } from "next";
import { DeskHeading, DeskPage } from "@/components/desk/ui";
import { PlaceEditor } from "@/components/desk/PlaceEditor";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "New place" };

export default async function NewPlace({ searchParams }: { searchParams: Promise<{ wording?: string }> }) {
  await requireUser();
  const sp = await searchParams;
  return (
    <DeskPage className="max-w-4xl">
      <DeskHeading kicker="Gazetteer" title="New place" lede="Take the coordinates from a named record, such as the place's Wikidata item, and say which." />
      <div className="mt-8">
        <PlaceEditor initial={sp.wording ? { matches: sp.wording } : {}} canEdit />
      </div>
    </DeskPage>
  );
}
