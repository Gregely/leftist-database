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
            Saved<span className="text-red">.</span>
          </>
        }
        tally="Kept in this browser only"
      />
      <Container>
        <BookmarksView />
      </Container>
    </>
  );
}
