import type { Metadata } from "next";
import { TextView } from "@/components/views/TextView";
import { getText } from "@/lib/data";
import { notFoundOrRedirect } from "@/lib/routing";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getText((await params).slug);
  return t ? { title: t.entity.title, description: t.entity.summary } : {};
}

export default async function TextPage({ params }: Props) {
  const { slug } = await params;
  const t = await getText(slug);
  if (!t) return notFoundOrRedirect("text", slug);
  return <TextView t={t} />;
}
