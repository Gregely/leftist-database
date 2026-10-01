"use client";

import { useEffect, useState } from "react";

/**
 * Sticky in-page index ("Overview · Ideas · Works …") with scroll-spy.
 * Sections stay on one long editorial page rather than hidden in tabs, so
 * everything is readable, linkable and printable.
 */
export function SectionNav({ sections, label = "On this page" }: { sections: { id: string; label: string }[]; label?: string }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [sections]);

  return (
    <nav aria-label={label} className="sticky top-14 z-30 border-y border-ink bg-paper/95 backdrop-blur-[2px]">
      <div className="scrollbar-thin mx-auto max-w-[1440px] overflow-x-auto px-4 sm:px-8">
        <ol className="flex min-w-max items-center gap-6 sm:gap-8">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "location" : undefined}
                className={`label relative flex items-baseline gap-2 py-3 transition-colors hover:text-red ${active === s.id ? "text-red" : "text-ink"}`}
              >
                <span className="label-mono text-faint">{String(i + 1).padStart(2, "0")}</span>
                {s.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-red transition-transform duration-300 ${active === s.id ? "scale-x-100" : "scale-x-0"}`}
                />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
