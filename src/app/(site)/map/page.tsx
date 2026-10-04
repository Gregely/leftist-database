import type { Metadata } from "next";
import Link from "next/link";
import { IndexHeader } from "@/components/editorial/IndexHeader";
import { Container, lifespan } from "@/components/editorial/primitives";
import { MapFigure } from "@/components/graph/MapFigure";
import { getGraph } from "@/lib/data";
import { KINDS, type EntityKind } from "@/lib/content/model";

export const metadata: Metadata = {
  title: "The Theory Map",
  description: "Thinkers and ideas connected by influence, critique, response and affinity: every line an editorial claim.",
};

const VIEWS = {
  time: { label: "By time", note: "Thinkers placed by year of birth; relations pull them together across the other axis." },
  affinity: { label: "By affinity", note: "No time axis: entries settle near the ones they are most connected to." },
} as const;
const SCOPES = {
  thinkers: { label: "Thinkers", kinds: ["thinker"] as EntityKind[] },
  ideas: { label: "Thinkers & concepts", kinds: ["thinker", "concept"] as EntityKind[] },
  traditions: { label: "Thinkers & tendencies", kinds: ["thinker", "tendency"] as EntityKind[] },
} as const;

type Props = { searchParams: Promise<{ view?: string; scope?: string }> };

/**
 * The Theory Map as a feature in its own right: a large plate, two ways of
 * laying it out, a choice of what to include, and a key to reading it.
 * The same interactive map appears, smaller, on the homepage and entries.
 */
export default async function MapPage({ searchParams }: Props) {
  const sp = await searchParams;
  const view = sp.view === "affinity" ? "affinity" : "time";
  const scope = sp.scope === "ideas" || sp.scope === "traditions" ? sp.scope : "thinkers";
  const graph = await getGraph({ kinds: SCOPES[scope].kinds });
  const mode = view === "time" ? "chronological" : "radial";
  const hubs = [...graph.nodes].sort((a, b) => b.degree - a.degree).slice(0, 10);
  const href = (o: { view?: string; scope?: string }) => {
    const q = new URLSearchParams(Object.entries({ view, scope, ...o }).filter(([k, v]) => v && !(k === "view" && v === "time") && !(k === "scope" && v === "thinkers")) as [string, string][]);
    return q.toString() ? `/map?${q}` : "/map";
  };

  return (
    <>
      <IndexHeader
        crumb="Theory Map"
        tone="var(--color-ink)"
        tally={`${graph.nodes.length} entries · ${graph.edges.length} relations`}
        title={
          <>
            The Theory Map<span className="text-red">.</span>
          </>
        }
        lede="Who drew on whom, who argued against whom, and how ideas passed from one generation to the next. Every line is an editorial claim that can carry a note and a source."
      />
      <Container>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-ink py-3">
          <div role="group" aria-label="Layout" className="flex items-center gap-1">
            <span className="label mr-2 text-faint">Layout</span>
            {(Object.keys(VIEWS) as (keyof typeof VIEWS)[]).map((v) => (
              <Link
                key={v}
                href={href({ view: v })}
                scroll={false}
                aria-current={view === v ? "true" : undefined}
                className={`label border px-2.5 py-1 transition-colors ${view === v ? "border-ink bg-ink text-paper" : "border-rule hover:border-ink"}`}
              >
                {VIEWS[v].label}
              </Link>
            ))}
          </div>
          <div role="group" aria-label="Include" className="flex flex-wrap items-center gap-1">
            <span className="label mr-2 text-faint">Include</span>
            {(Object.keys(SCOPES) as (keyof typeof SCOPES)[]).map((s) => (
              <Link
                key={s}
                href={href({ scope: s })}
                scroll={false}
                aria-current={scope === s ? "true" : undefined}
                className={`label border px-2.5 py-1 transition-colors ${scope === s ? "border-red text-red" : "border-rule text-muted hover:border-ink"}`}
              >
                {SCOPES[s].label}
              </Link>
            ))}
          </div>
          <p className="font-serif text-[0.98rem] italic text-muted lg:ml-auto">{VIEWS[view].note}</p>
        </div>

        <section aria-labelledby="map-heading" className="pt-8">
          <h2 id="map-heading" className="sr-only">
            The map
          </h2>
          <MapFigure
            graph={graph}
            mode={mode}
            plate="Plate II"
            heading={`${SCOPES[scope].label}, ${VIEWS[view].label.toLowerCase()}`}
            title={`The Theory Map: ${SCOPES[scope].label.toLowerCase()}, ${VIEWS[view].label.toLowerCase()}`}
            caption="Hover or focus a name to trace its lines. Select it for a summary; select it again to open the entry."
          />
        </section>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <section aria-labelledby="reading-h" className="lg:col-span-7">
            <h2 id="reading-h" className="label border-t-[3px] border-ink pt-3 font-sans">
              How to read the map
            </h2>
            <div className="prose-atlas mt-5 max-w-[40rem] !text-[1.08rem]">
              <p>
                <strong>Position.</strong> Laid out by time, the horizontal axis is the year of birth (top to bottom on a
                phone); only the other axis is free, so names drift towards those they are connected to. Laid out by
                affinity, there is no axis at all, and entries gather near those they are most connected to.
              </p>
              <p>
                <strong>Lines.</strong> A solid line is influence or development; a red dashed line is critique or
                rejection; a dotted line is a response; green is a looser association. Arrowheads point from the one who
                acted to the one acted on. Heavier lines are claims the editors weight more strongly.
              </p>
              <p>
                <strong>Claims, not facts of nature.</strong> Each line is an editorial reading of the record, and can be
                questioned. Open an entry to see the note and source behind it, or read the whole map as a list beneath it.
              </p>
            </div>
          </section>
          <aside aria-labelledby="hubs-h" className="lg:col-span-4 lg:col-start-9">
            <h2 id="hubs-h" className="label border-t-[3px] border-ink pt-3 font-sans">
              Most connected
            </h2>
            <ol className="mt-3">
              {hubs.map((h, i) => (
                <li key={h.id} className="border-b border-rule">
                  <Link href={h.href} className="group grid grid-cols-[1.75rem_1fr_auto] items-baseline gap-2 py-2.5">
                    <span className="label-mono text-faint">{i + 1}</span>
                    <span>
                      <span className="font-serif text-[1.15rem] leading-tight group-hover:text-red">{h.title}</span>
                      <span className="label ml-2 text-faint">{h.kind === "thinker" ? lifespan(h.yearStart, h.yearEnd, "thinker") : KINDS[h.kind].label}</span>
                    </span>
                    <span className="numeral text-red">{h.degree}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </Container>
    </>
  );
}
