"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The running head of an entry: sticky under the masthead, it carries the
 * entry's title (as a book's running head does), an index of its sections
 * with scroll-spy, and a hairline of reading progress. Sections stay on one
 * long page rather than in tabs, so everything is readable, linkable and printable.
 */
export function SectionNav({ sections, label = "On this page", title }: { sections: { id: string; label: string }[]; label?: string; title?: string }) {
  const [active, setActive] = useState(sections[0]?.id);
  const [progress, setProgress] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

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

  // Reading progress through the article that contains the nav.
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const article = listRef.current?.closest("article");
      if (!article) return;
      const r = article.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Keep the active tab in view in the horizontally scrolling index on phones.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    const list = listRef.current?.parentElement;
    if (el && list && list.scrollWidth > list.clientWidth) list.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
  }, [active]);

  return (
    <nav aria-label={label} className="sticky top-14 z-30 border-y border-ink bg-paper/95 backdrop-blur-[3px] lg:top-[60px]">
      <div className="mx-auto flex max-w-[1440px] items-stretch gap-6 px-4 sm:px-8 lg:px-10">
        {title && (
          <p className="hidden max-w-[16rem] shrink-0 items-center truncate border-r border-rule pr-6 font-serif text-[1.02rem] italic xl:flex">
            <span className="truncate">{title}</span>
          </p>
        )}
        <div className="scrollbar-none min-w-0 flex-1 overflow-x-auto">
          <ol ref={listRef} className="flex min-w-max items-center gap-5 sm:gap-7">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  data-section={s.id}
                  aria-current={active === s.id ? "location" : undefined}
                  className={`label relative flex items-baseline gap-1.5 py-3 transition-colors hover:text-red ${active === s.id ? "text-red" : "text-ink"}`}
                >
                  <span className="label-mono text-faint">{i + 1}</span>
                  {s.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-[3px] origin-left bg-red transition-transform duration-300 ${active === s.id ? "scale-x-100" : "scale-x-0"}`}
                  />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 -bottom-px h-px bg-transparent">
        <div className="h-[2px] origin-left bg-red/70" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </nav>
  );
}
