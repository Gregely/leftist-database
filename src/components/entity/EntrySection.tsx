import type { ReactNode } from "react";

/**
 * A section of an entry page. The margin column carries the section number
 * and name (sticky on wide screens, as a reference book's margin heads);
 * the text column carries the content. There is deliberately no subtitle:
 * the heading names the section and the content follows it.
 */
export function EntrySection({
  id,
  number,
  label,
  children,
  tone,
}: {
  id: string;
  number: string;
  label: string;
  children: ReactNode;
  /** A recessed band for sections that sit apart from the main reading. */
  tone?: "deep";
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      className={`scroll-mt-32 border-t border-ink py-12 sm:py-16 ${tone === "deep" ? "-mx-4 bg-paper-deep px-4 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10" : ""}`}
    >
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-36">
            <h2 id={`${id}-h`} className="flex items-baseline gap-3 lg:block">
              <span aria-hidden="true" className="numeral text-[1.6rem] leading-none text-red lg:block lg:text-[2.6rem]">
                {number}
              </span>
              <span className="label font-sans text-ink lg:mt-2 lg:block">{label}</span>
            </h2>
          </div>
        </div>
        <div className="lg:col-span-9">
          {children}
        </div>
      </div>
    </section>
  );
}
