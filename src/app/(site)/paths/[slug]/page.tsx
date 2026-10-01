import type { Metadata } from "next";
import { PathView } from "@/components/views/PathView";
import { getPath } from "@/lib/data";
import { notFoundOrRedirect } from "@/lib/routing";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ step?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPath((await params).slug);
  return p ? { title: p.entity.title, description: p.entity.summary } : {};
}

export default async function PathPage({ params, searchParams }: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const path = await getPath(slug);
  if (!path) return notFoundOrRedirect("path", slug);
  return <PathView path={path} step={sp.step} />;
}
