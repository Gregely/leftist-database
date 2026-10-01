import type { Metadata } from "next";
import { TendencyView } from "@/components/views/TendencyView";
import { getTendency } from "@/lib/data";
import { notFoundOrRedirect } from "@/lib/routing";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTendency((await params).slug);
  return t ? { title: t.entity.title, description: t.entity.summary } : {};
}

export default async function TendencyPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTendency(slug);
  if (!t) return notFoundOrRedirect("tendency", slug);
  return <TendencyView t={t} />;
}
