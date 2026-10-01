import type { Metadata } from "next";
import Link from "next/link";
import { IndexHeader } from "@/components/editorial/IndexHeader";
import { Container } from "@/components/editorial/primitives";
import { getDebatePositionLabels, listEntities } from "@/lib/data";
import { KINDS } from "@/lib/content/model";

export const metadata: Metadata = { title: "Debates", description: KINDS.debate.blurb };

export default async function DebatesIndex() {
  const list = await listEntities({ kind: "debate" });
  const positions = await getDebatePositionLabels(list.items.map((d) => d.id));
  return (
    <>
      <IndexHeader
        crumb="Debates"
        tally={`${list.total} open questions`}
        title={
          <>
            Questions the left keeps asking<span className="text-red">.</span>
          </>
        }
        lede="Each debate sets positions side by side — claims, assumptions, texts and criticisms — and lets you compare them. None is presented as the answer."
      />
      <Container>
        <ol className="border-t border-ink">
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
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    {(positions[d.id] ?? []).map((p) => (
                      <span key={p} className="border border-rule px-2 py-0.5 text-sm">
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
