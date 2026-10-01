import type { ReactNode } from "react";
import { Container, Label } from "./primitives";

/** Masthead for index pages: breadcrumb, large title, standfirst, tally. */
export function IndexHeader({
  crumb,
  title,
  lede,
  tally,
  children,
}: {
  crumb: string;
  title: ReactNode;
  lede?: ReactNode;
  tally?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Container className="pt-6 sm:pt-8">
      <div className="flex flex-wrap justify-between gap-2 border-b border-rule pb-2">
        <Label className="text-muted">
          Atlas <span className="text-red">/</span> {crumb}
        </Label>
        {tally && <Label className="text-faint">{tally}</Label>}
      </div>
      <div className="grid gap-6 pb-10 pt-10 sm:pb-14 lg:grid-cols-12">
        <h1 className="display text-balance text-[3.4rem] sm:text-[5.4rem] lg:col-span-7">{title}</h1>
        {lede && <div className="lede text-ink-warm lg:col-span-5 lg:pt-6">{lede}</div>}
      </div>
      {children}
    </Container>
  );
}
