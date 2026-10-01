import type { Metadata } from "next";
import { DebateView } from "@/components/views/DebateView";
import { getDebate } from "@/lib/data";
import { notFoundOrRedirect } from "@/lib/routing";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await getDebate((await params).slug);
  return d ? { title: d.entity.title, description: d.entity.summary } : {};
}

export default async function DebatePage({ params }: Props) {
  const { slug } = await params;
  const d = await getDebate(slug);
  if (!d) return notFoundOrRedirect("debate", slug);
  return <DebateView d={d} />;
}
