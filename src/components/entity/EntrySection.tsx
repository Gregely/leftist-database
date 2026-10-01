import type { ReactNode } from "react";

/** A numbered section of an entry page, with the label in the margin on wide screens. */
export function EntrySection({
  id,
  number,
  label,
  title,
  children,
  aside,
}: {
  id: string;
  number: string;
  label: string;
  title?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28 border-t border-ink py-12 sm:py-16">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <h2 id={`${id}-h`} className="label font-sans lg:sticky lg:top-32">
            <span className="label-mono mr-3 text-red">{number}</span>
            {label}
          </h2>
          {aside && <div className="mt-6 hidden lg:block">{aside}</div>}
        </div>
        <div className="lg:col-span-9">
          {title && <p className="display mb-8 max-w-3xl text-balance text-[2rem] sm:text-[2.6rem]">{title}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
