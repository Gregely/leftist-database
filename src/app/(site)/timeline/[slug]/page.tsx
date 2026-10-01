import type { Metadata } from "next";
import { EventView } from "@/components/views/EventView";
import { getEvent } from "@/lib/data";
import { notFoundOrRedirect } from "@/lib/routing";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = await getEvent((await params).slug);
  return e ? { title: e.entity.title, description: e.entity.summary } : {};
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const e = await getEvent(slug);
  if (!e) return notFoundOrRedirect("event", slug);
  return <EventView e={e} />;
}
