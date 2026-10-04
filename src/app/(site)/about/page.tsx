import type { Metadata } from "next";
import Link from "next/link";
import { IndexHeader } from "@/components/editorial/IndexHeader";
import { Container } from "@/components/editorial/primitives";
import { getArchiveStats } from "@/lib/data";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "About this edition" };

export default async function AboutPage() {
  const stats = await getArchiveStats();
  return (
    <>
      <IndexHeader
        crumb="About"
        title={
          <>
            About this edition<span className="text-red">.</span>
          </>
        }
        tally={SITE.edition}
      />
      <Container>
        <div className="grid gap-12 border-t border-ink py-12 lg:grid-cols-12">
          <div className="prose-atlas max-w-[40rem] lg:col-span-7">
            <p>
              This is a working edition. It establishes the architecture of the Atlas — its entities, relationships,
              sources and ways of reading — with a small set of <strong>sample entries</strong>. Every sample is marked
              as such. They are concise and conventional by design, and are not finished scholarship.
            </p>
            <p>
              The Atlas treats every thinker, concept, text, tendency, debate, event and learning path as a node, and
              every connection between them — <em>influenced</em>, <em>critiqued</em>, <em>developed</em>,{" "}
              <em>responded to</em> — as an editorial claim that can carry a note and a source.
            </p>
            <p>
              Quotations are only included where they can be traced to a cited edition, and are flagged until their
              wording has been checked. Where an excerpt has not yet been verified, the Atlas records a reference to the
              passage instead of inventing one.
            </p>
            <p>
              Debates are presented descriptively. Positions are summarised, stances are editorial readings, and the
              interface is built to compare rather than adjudicate.
            </p>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <dl className="divide-y divide-rule border-y border-ink">
              {[
                ["Entries", stats.entities],
                ["Relationships", stats.relationships],
                ["Sources", stats.sources],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between py-3">
                  <dt className="label text-faint">{k}</dt>
                  <dd className="numeral text-3xl text-red">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-muted">
              See the <Link href="/sources" className="link-inline">bibliography</Link>, or the{" "}
              <Link href="/admin" className="link-inline">editorial desk</Link> where entries and relationships are made.
            </p>
          </aside>
        </div>
      </Container>
    </>
  );
}
