import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GuidedView } from "@/components/views/GuidedView";
import { getGuidedJourney, getPath } from "@/lib/data";
import { notFoundOrRedirect } from "@/lib/routing";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ step?: string; depth?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const j = await getGuidedJourney((await params).slug);
  return j ? { title: `${j.entity.title} — Guided`, description: j.entity.summary } : {};
}

export default async function GuidedJourneyPage({ params, searchParams }: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const journey = await getGuidedJourney(slug);
  if (!journey) {
    // A published learning path that is not offered as Guided lives at /paths.
    if (await getPath(slug)) redirect(`/paths/${slug}`);
    return notFoundOrRedirect("path", slug);
  }
  return <GuidedView journey={journey} step={sp.step} depth={sp.depth} links={{ overview: `/guided/${slug}`, stepPrefix: `/guided/${slug}?step=` }} />;
}
