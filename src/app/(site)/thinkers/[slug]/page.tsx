import type { Metadata } from "next";
import { ThinkerView } from "@/components/views/ThinkerView";
import { getThinker } from "@/lib/data";
import { notFoundOrRedirect } from "@/lib/routing";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getThinker((await params).slug);
  return t ? { title: t.entity.title, description: t.entity.summary } : {};
}

export default async function ThinkerPage({ params }: Props) {
  const { slug } = await params;
  const t = await getThinker(slug);
  if (!t) return notFoundOrRedirect("thinker", slug);
  return <ThinkerView t={t} />;
}
