import type { Metadata } from "next";
import { BookmarksView } from "@/components/bookmarks/BookmarksView";
import { IndexHeader } from "@/components/editorial/IndexHeader";
import { Container } from "@/components/editorial/primitives";

export const metadata: Metadata = { title: "Bookmarks" };

export default function BookmarksPage() {
  return (
    <>
      <IndexHeader
        crumb="Bookmarks"
        title={
          <>
            Your reading list<span className="text-red">.</span>
          </>
        }
        lede="Entries you have saved. They are kept in this browser only — nothing is sent to the Atlas."
      />
      <Container>
        <BookmarksView />
      </Container>
    </>
  );
}
