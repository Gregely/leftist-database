import type { Metadata } from "next";
import { Container, Label } from "@/components/editorial/primitives";
import { Timeline } from "@/components/timeline/Timeline";
import { getTimeline } from "@/lib/data";
import { PERIODS } from "@/lib/site";

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
      <Container className="pt-6 sm:pt-8">
        <div className="flex justify-between border-b border-rule pb-2">
          <Label className="text-muted">
            Atlas <span className="text-red">/</span> Timeline
          </Label>
          <Label className="text-faint">
            {counts.event ?? 0} events · {counts.text ?? 0} texts · {counts.thinker ?? 0} lives · {counts.tendency ?? 0} tendencies
          </Label>
        </div>
        <div className="grid gap-6 pb-10 pt-10 lg:grid-cols-12">
          <h1 className="display text-[3.4rem] sm:text-[5.4rem] lg:col-span-7">
            Move through history<span className="text-red">.</span>
          </h1>
          <p className="lede text-ink-warm lg:col-span-5 lg:pt-6">
            Revolutions and congresses, books and pamphlets, lives and traditions — on one track. Zoom from centuries to
            decades, filter the lanes, and select anything to see what it connects to.
          </p>
        </div>
      </Container>
      <Timeline
        items={items}
        periods={PERIODS}
        initial={{ zoom: sp.zoom, focus: num(sp.focus), item: sp.item, from: num(sp.from), to: num(sp.to) }}
      />
    </>
  );
}
