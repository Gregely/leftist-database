import type { Metadata } from "next";
import { PathView } from "@/components/views/PathView";
import { redirect } from "next/navigation";
import { getPath, isGuidedPath } from "@/lib/data";
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
  // Paths offered as Guided journeys are read at /guided.
  if (await isGuidedPath(path.entity.id)) redirect(`/guided/${slug}${sp.step ? `?step=${encodeURIComponent(sp.step)}` : ""}`);
  return <PathView path={path} step={sp.step} />;
}
