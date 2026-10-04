import type { Metadata } from "next";
import Link from "next/link";
import { IndexHeader } from "@/components/editorial/IndexHeader";
import { Pager, pageParam } from "@/components/editorial/Pager";
import { Container } from "@/components/editorial/primitives";
import { listTexts } from "@/lib/data";
import { KIND_TONE } from "@/lib/site";
import { KINDS } from "@/lib/content/model";

export const metadata: Metadata = { title: "Texts", description: KINDS.text.blurb };
const PER_PAGE = 80;
const DIFFICULTY = ["", "Accessible", "Demanding", "Specialist"];

type Props = { searchParams: Promise<{ form?: string; sort?: string; page?: string }> };

export default async function TextsIndex({ searchParams }: Props) {
  const sp = await searchParams;
  const page = pageParam(sp.page);
  const { items, total, forms } = await listTexts({
    form: sp.form,
    order: sp.sort === "title" ? "title" : "year",
    limit: PER_PAGE,
    offset: (page - 1) * PER_PAGE,
  });
  const q = (o: Record<string, string | undefined>) => {
    const p = new URLSearchParams(Object.entries({ form: sp.form, sort: sp.sort, ...o }).filter(([, v]) => v) as [string, string][]);
    return p.toString() ? `/texts?${p}` : "/texts";
  };
  return (
    <>
      <IndexHeader
        tone={KIND_TONE.text}
        crumb="Texts"
        tally={`${total} texts`}
        title={
          <>
            The catalogue<span className="text-red">.</span>
          </>
        }
        lede="Books, pamphlets, notebooks and essays, in order of first publication, with their authors, their form and how hard they are to read."
      />
      <Container>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-ink py-3">
          <span className="label text-faint">Form</span>
          <Link href={q({ form: undefined, page: undefined })} className={`label ${!sp.form ? "text-red" : "hover:text-red"}`}>
            All
          </Link>
          {forms.map((f) => (
            <Link key={f} href={q({ form: f, page: undefined })} className={`label ${sp.form === f ? "text-red" : "text-muted hover:text-red"}`}>
              {f}
            </Link>
          ))}
          <span className="ml-auto flex gap-4">
            <span className="label text-faint">Sort</span>
            <Link href={q({ sort: undefined })} className={`label ${sp.sort !== "title" ? "text-red" : "hover:text-red"}`}>
              Year
            </Link>
            <Link href={q({ sort: "title" })} className={`label ${sp.sort === "title" ? "text-red" : "hover:text-red"}`}>
              Title
            </Link>
          </span>
        </div>
        <table className="mt-2 w-full border-collapse text-left">
          <caption className="sr-only">Catalogue of texts</caption>
          <thead className="hidden md:table-header-group">
            <tr className="border-b-[3px] border-ink">
              {["Year", "Title", "Author", "Form", "Reading"].map((h) => (
                <th key={h} scope="col" className="label py-3 pr-4 font-medium text-faint">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} className="group grid grid-cols-[4rem_1fr] border-b border-rule md:table-row">
                <td className="numeral row-span-3 py-4 pr-4 align-top text-[1.6rem] leading-tight text-blue">{t.yearStart}</td>
                <td className="pt-4 pr-6 align-top md:py-4">
                  <Link href={t.href} className="font-serif text-[1.35rem] italic leading-tight group-hover:text-red">
                    {t.title}
                  </Link>
                  <span className="mt-1 hidden max-w-xl text-sm leading-snug text-muted md:block">{t.summary}</span>
                </td>
                <td className="pr-4 align-top font-serif text-[1.05rem] md:py-4">{t.authors.join(", ")}</td>
                <td className="label hidden py-4 pr-4 align-top text-muted md:table-cell">{t.form}</td>
                <td className="label pb-4 align-top text-faint md:py-4">
                  <span aria-label={`Difficulty ${t.difficulty} of 3`} className="mr-2 tracking-[0.2em] text-red">
                    {"●".repeat(t.difficulty)}
                    <span className="text-rule">{"●".repeat(3 - t.difficulty)}</span>
                  </span>
                  {DIFFICULTY[t.difficulty]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pager page={page} total={total} perPage={PER_PAGE} base="/texts" params={{ form: sp.form, sort: sp.sort }} />
      </Container>
    </>
  );
}
