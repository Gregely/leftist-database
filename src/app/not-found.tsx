import Link from "next/link";
import { Container } from "@/components/editorial/primitives";
import { HomeSearch } from "@/components/search/HomeSearch";
import { SiteShell } from "@/components/layout/SiteShell";

export default function NotFound() {
  return (
    <SiteShell>
    <Container className="py-20">
      <p className="kicker text-red">404 · Not in the Atlas</p>
      <h1 className="display mt-6 max-w-3xl text-[3.4rem] sm:text-[5rem]">
        This page has not been written yet<span className="text-red">.</span>
      </h1>
      <p className="lede mt-6 max-w-xl text-muted">The entry may be a draft, may have moved, or may not exist. Try searching for it.</p>
      <HomeSearch className="mt-10 max-w-[44rem]" />
      <Link href="/explore" className="btn mt-10">
        Back to the library
      </Link>
    </Container>
    </SiteShell>
  );
}
