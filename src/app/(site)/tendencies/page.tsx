import type { Metadata } from "next";
import Link from "next/link";
import { IndexHeader } from "@/components/editorial/IndexHeader";
import { Container } from "@/components/editorial/primitives";
import { getTendencyColors, listEntities } from "@/lib/data";
import { KIND_TONE } from "@/lib/site";
import { KINDS, TENDENCY_COLOR_VALUES, type TendencyColor } from "@/lib/content/model";

export const metadata: Metadata = { title: "Tendencies", description: KINDS.tendency.blurb };

const FROM = 1770;
const TO = 2030;
const pct = (y: number) => ((y - FROM) / (TO - FROM)) * 100;

export default async function TendenciesIndex() {
  const list = await listEntities({ kind: "tendency", order: "year" });
  const colors = await getTendencyColors(list.items.map((t) => t.id));
  return (
    <>
      <IndexHeader
        tone={KIND_TONE.tendency}
        crumb="Tendencies"
        tally={`${list.total} tendencies`}
        title={
          <>
            Schools, currents, traditions<span className="text-red">.</span>
          </>
        }
        lede="Traditions overlap, split and borrow from each other. Each band shows a tendency's span; open one to see its members, texts and lineage."
      />
      <Container>
        <div className="relative hidden h-6 border-b border-ink md:ml-[34%] md:block" aria-hidden="true">
          {[1800, 1850, 1900, 1950, 2000].map((y) => (
            <span key={y} className="label-mono absolute -translate-x-1/2 text-faint" style={{ left: `${pct(y)}%` }}>
              {y}
            </span>
          ))}
        </div>
        <ol>
          {list.items.map((t) => {
            const color = TENDENCY_COLOR_VALUES[(colors[t.id] as TendencyColor) ?? "ink"];
            return (
              <li key={t.id} className="border-b border-rule">
                <Link href={t.href} className="group grid items-center gap-x-6 gap-y-2 py-5 md:grid-cols-[34%_1fr]">
                  <span className="flex gap-4">
                    <span aria-hidden="true" className="mt-1 w-1.5 shrink-0 self-stretch" style={{ background: color }} />
                    <span>
                      <span className="font-serif text-[1.7rem] leading-tight group-hover:text-red">{t.title}</span>
                      <span className="mt-1 block text-sm leading-snug text-muted">{t.summary}</span>
                    </span>
                  </span>
                  <span className="relative block h-6">
                    <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-rule-soft" />
                    {t.yearStart != null && (
                      <span
                        aria-hidden="true"
                        className="absolute top-1/2 h-3 -translate-y-1/2 opacity-80 transition-opacity group-hover:opacity-100"
                        style={{
                          left: `${pct(t.yearStart)}%`,
                          width: `${pct(t.yearEnd ?? 2026) - pct(t.yearStart)}%`,
                          background: `linear-gradient(to right, ${color}, ${color}${t.yearEnd ? "" : "22"})`,
                        }}
                      />
                    )}
                    <span className="label-mono absolute -top-1 text-faint" style={{ left: `${pct(t.yearStart ?? FROM)}%` }}>
                      {t.yearStart}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </Container>
    </>
  );
}
