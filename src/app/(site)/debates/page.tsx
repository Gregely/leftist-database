import type { Metadata } from "next";
import Link from "next/link";
import { IndexHeader } from "@/components/editorial/IndexHeader";
import { Container } from "@/components/editorial/primitives";
import { getDebatePositionLabels, listEntities } from "@/lib/data";
import { KIND_TONE } from "@/lib/site";
import { KINDS } from "@/lib/content/model";

export const metadata: Metadata = { title: "Debates", description: KINDS.debate.blurb };

export default async function DebatesIndex() {
  const list = await listEntities({ kind: "debate" });
  const positions = await getDebatePositionLabels(list.items.map((d) => d.id));
  return (
    <>
      <IndexHeader
        crumb="Debates"
        tone={KIND_TONE.debate}
        title={
          <>
            Debates<span className="text-red">.</span>
          </>
        }
        count={list.total}
      />
      <Container>
        <ol className="border-t-[3px] border-ink">
          {list.items.map((d, i) => (
            <li key={d.id} className="border-b border-rule">
              <Link href={d.href} className="group grid gap-x-10 gap-y-3 py-8 lg:grid-cols-[4rem_1fr_22rem]">
                <span className="label-mono pt-3 text-red">Q.{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="display block text-[2.4rem] transition-transform duration-500 group-hover:translate-x-1.5 sm:text-[3.6rem]">
                    {d.title.replace(/\?$/, "")}
                    <span className="text-red">?</span>
                  </span>
                  <span className="mt-3 block max-w-2xl text-muted">{d.summary}</span>
                </span>
                <span className="lg:pt-4">
                  <span className="label block text-faint">{(positions[d.id] ?? []).length} positions</span>
                  <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 font-serif text-[1.05rem] italic">
                    {(positions[d.id] ?? []).map((p) => (
                      <span key={p} className="border-l-2 border-red pl-2 leading-tight">
                        {p}
                      </span>
                    ))}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Container>
    </>
  );
}
