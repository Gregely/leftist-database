import Link from "next/link";
import { Container } from "@/components/editorial/primitives";
import { HomeSearch } from "@/components/search/HomeSearch";
import { SiteShell } from "@/components/layout/SiteShell";

export default function NotFound() {
  return (
    <SiteShell>
    <Container className="py-20">
      <p className="kicker text-red">404</p>
      <h1 className="display mt-6 max-w-3xl text-[3.4rem] sm:text-[5rem]">
        Not in the Atlas<span className="text-red">.</span>
      </h1>
      <HomeSearch className="mt-10 max-w-[44rem]" />
      <Link href="/explore" className="btn mt-10">
        The library
      </Link>
    </Container>
    </SiteShell>
  );
}
