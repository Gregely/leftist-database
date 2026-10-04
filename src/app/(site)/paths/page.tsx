import type { Metadata } from "next";
import Link from "next/link";
import { IndexHeader } from "@/components/editorial/IndexHeader";
import { Container } from "@/components/editorial/primitives";
import { listPaths } from "@/lib/data";
import { KIND_TONE } from "@/lib/site";
import { KINDS } from "@/lib/content/model";

export const metadata: Metadata = { title: "Learning paths", description: KINDS.path.blurb };

export default async function PathsIndex() {
  const paths = await listPaths();
  return (
    <>
      <IndexHeader
        tone={KIND_TONE.path}
        crumb="Learning paths"
        tally={`${paths.length} routes`}
        title={
          <>
            Routes through the material<span className="text-red">.</span>
          </>
        }
        lede="A path suggests an order, never a requirement. Every stop opens onto the rest of the Atlas, and you can leave the route whenever something catches your eye."
      />
      <Container>
        <ol className="border-t-[3px] border-ink">
          {paths.map((p, i) => (
            <li key={p.id} className="border-b border-rule">
              <Link href={p.href} className="group grid gap-x-10 gap-y-4 py-8 lg:grid-cols-[3rem_1fr_1fr]">
                <span className="label-mono pt-2 text-red">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="serif-italic block text-[2rem] leading-tight group-hover:text-red sm:text-[2.6rem]">“{p.entryLine}”</span>
                  <span className="mt-3 flex flex-wrap gap-x-3">
                    <span className="label">{p.title}</span>
                    <span className="label text-faint">
                      {p.level} · {p.steps.length} stops{p.estimatedTime ? ` · ${p.estimatedTime}` : ""}
                    </span>
                  </span>
                  <span className="mt-3 block max-w-xl text-muted">{p.summary}</span>
                </span>
                <ol className="relative border-l border-ink pl-5 lg:mt-2">
                  {p.steps.map((s, n) => (
                    <li key={n} className="relative py-0.5 text-[0.92rem]">
                      <span aria-hidden="true" className={`absolute -left-[24.5px] top-[0.55rem] h-2 w-2 rounded-full border ${n === 0 ? "border-red bg-red" : "border-ink bg-paper"}`} />
                      <span className="label-mono mr-2 text-faint">{String(n + 1).padStart(2, "0")}</span>
                      {s.title}
                    </li>
                  ))}
                </ol>
              </Link>
            </li>
          ))}
        </ol>
      </Container>
    </>
  );
}
