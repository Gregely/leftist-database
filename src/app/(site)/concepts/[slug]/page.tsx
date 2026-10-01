import type { Metadata } from "next";
import { ConceptView } from "@/components/views/ConceptView";
import { getConcept } from "@/lib/data";
import { notFoundOrRedirect } from "@/lib/routing";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ depth?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getConcept((await params).slug);
  return c ? { title: c.entity.title, description: c.entity.summary } : {};
}

export default async function ConceptPage({ params, searchParams }: Props) {
  const [{ slug }, { depth }] = await Promise.all([params, searchParams]);
  const c = await getConcept(slug);
  if (!c) return notFoundOrRedirect("concept", slug);
  return <ConceptView c={c} depth={depth} />;
}
