import type { Metadata } from "next";
import { IndexHeader } from "@/components/editorial/IndexHeader";
import { Timeline } from "@/components/timeline/Timeline";
import { getTimeline } from "@/lib/data";
import { KIND_TONE, PERIODS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Timeline",
  description: "Events, texts, thinkers and tendencies on one zoomable timeline.",
};

type Props = { searchParams: Promise<Record<string, string | undefined>> };

const num = (v?: string) => (v && /^\d{3,4}$/.test(v) ? Number(v) : undefined);

export default async function TimelinePage({ searchParams }: Props) {
  const sp = await searchParams;
  const items = await getTimeline();
  const counts = items.reduce<Record<string, number>>((a, i) => ({ ...a, [i.lane]: (a[i.lane] ?? 0) + 1 }), {});
  return (
    <>
      <IndexHeader
        crumb="Timeline"
        tone={KIND_TONE.event}
        tally={`${counts.event ?? 0} events · ${counts.text ?? 0} texts · ${counts.thinker ?? 0} lives · ${counts.tendency ?? 0} tendencies`}
        title={
          <>
            Move through history<span className="text-red">.</span>
          </>
        }
        lede="Revolutions and congresses, books and pamphlets, lives and traditions, on one track. Zoom from centuries to decades, filter the lanes, and select anything to see what it connects to."
      />
      <Timeline
        items={items}
        periods={PERIODS}
        initial={{ zoom: sp.zoom, focus: num(sp.focus), item: sp.item, from: num(sp.from), to: num(sp.to) }}
      />
    </>
  );
}
