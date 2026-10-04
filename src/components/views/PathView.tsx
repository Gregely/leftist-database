import Link from "next/link";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";
import { Container, Label, SampleMark } from "@/components/editorial/primitives";
import { PathRoute } from "@/components/path/PathRoute";
import { Prose } from "@/components/editorial/Prose";
import { getStepDetours, type PathAggregate } from "@/lib/data";
import { KINDS } from "@/lib/content/model";


export async function PathView({ path, step: stepParam }: { path: PathAggregate; step?: string }) {
  const sp = { step: stepParam };
  const slug = path.entity.slug;
  const n = path.steps.length;
  const current = Math.min(n, Math.max(0, Number(sp.step) || 0));
  const step = current ? path.steps[current - 1] : null;
  const detours = step ? await getStepDetours(step.entity.id, path.steps.map((s) => s.entity.id)) : [];
  const stops = path.steps.map((s) => ({ position: s.position, title: s.entity.title, kind: s.entity.kind }));

  return (
    <article>
      <Container className="pt-5 sm:pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink pb-2">
          <Label className="text-muted">
            <Link href="/paths" className="hover:text-red">
              Learning paths
            </Link>{" "}
            <span className="text-rule">/</span> <span className="text-ink">{path.level}</span>
          </Label>
          <div className="flex items-center gap-4">
            <SampleMark sample={path.entity.sample} />
            <BookmarkButton entity={{ id: path.entity.id, kind: "path", title: path.entity.title, href: path.entity.href }} />
          </div>
        </div>
        <header className="grid gap-6 pb-8 pt-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="kicker text-ochre">Learning path</p>
            <h1 className="display mt-3 text-[2.8rem] sm:text-[4.6rem]">
              <Link href={path.entity.href} className="hover:text-red">
                {path.entity.title}
              </Link>
            </h1>
            <p className="mt-4 font-serif text-[1.5rem] italic text-red">“{path.entryLine}”</p>
          </div>
          <p className="font-serif text-[1.1rem] text-muted lg:col-span-4 lg:pt-10">
            {path.entity.summary}
            {path.estimatedTime && <span className="label mt-3 block text-faint">{path.estimatedTime}</span>}
          </p>
        </header>
        <div className="border-y-[3px] border-ink py-5">
          <PathRoute slug={slug} stops={stops} current={current} />
        </div>
      </Container>

      <Container className="py-12">
        {step ? (
          <div key={step.id} className="grid gap-12 lg:grid-cols-12 animate-enter">
            <div className="lg:col-span-8">
              <p className="label flex items-center gap-3">
                <span className="label-mono text-red">
                  Stop {String(current).padStart(2, "0")} / {String(n).padStart(2, "0")}
                </span>
                <span className="text-faint">{KINDS[step.entity.kind].label}</span>
              </p>
              <h2 className="display mt-4 text-[3rem] sm:text-[4.6rem]">{step.entity.title}</h2>
              <p className="mt-6 max-w-2xl border-l-[3px] border-red pl-4 font-serif text-[1.2rem] leading-snug">
                <span className="label mb-1 block text-faint">Why this stop</span>
                {step.framing}
              </p>
              <p className="lede mt-8 max-w-2xl">{step.brief || step.entity.summary}</p>

              <nav aria-label="Path navigation" className="mt-12 grid grid-cols-3 border border-ink">
                {current > 1 ? (
                  <Link href={`?step=${current - 1}`} scroll={false} className="group p-4 hover:bg-paper-warm">
                    <span className="label block text-faint">← Back</span>
                    <span className="mt-1 hidden font-serif text-lg leading-tight group-hover:text-red sm:block">
                      {path.steps[current - 2].entity.title}
                    </span>
                  </Link>
                ) : (
                  <Link href="?" scroll={false} className="group p-4 hover:bg-paper-warm">
                    <span className="label block text-faint">← Overview</span>
                  </Link>
                )}
                <Link href={step.entity.href} className="group border-x border-ink p-4 text-center hover:bg-ink hover:text-paper">
                  <span className="label block">Explore</span>
                  <span className="mt-1 hidden text-sm text-muted group-hover:text-ink-muted sm:block">Open the full entry</span>
                </Link>
                {current < n ? (
                  <Link href={`?step=${current + 1}`} scroll={false} className="group bg-red p-4 text-right text-paper-warm hover:bg-red-deep">
                    <span className="label block">Next →</span>
                    <span className="mt-1 hidden font-serif text-lg leading-tight sm:block">{path.steps[current].entity.title}</span>
                  </Link>
                ) : (
                  <Link href="/paths" className="group bg-ink p-4 text-right text-paper">
                    <span className="label block">Path complete →</span>
                    <span className="mt-1 hidden text-sm text-ink-muted sm:block">Choose another route</span>
                  </Link>
                )}
              </nav>
            </div>
            <aside className="lg:col-span-4">
              {step.branches.length > 0 && (
                <div className="mb-8">
                  <p className="label mb-3 text-red">Branches from this stop</p>
                  <ul className="border-t border-ink">
                    {step.branches.map((b) => (
                      <li key={b.id} className="border-b border-rule">
                        <Link href={b.entity.href} className="group block py-3">
                          <span className="label block text-faint">{b.track === "alternative" ? "Alternative route" : "Branch"} · {KINDS[b.entity.kind].label}</span>
                          <span className="font-serif text-lg group-hover:text-red">{b.entity.title}</span>
                          {b.framing && <span className="mt-1 block text-sm text-muted">{b.framing}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="label mb-3 text-faint">Leave the path — detours</p>
              <ul className="border-t border-rule">
                {detours.map((d) => (
                  <li key={d.relationshipId} className="border-b border-rule">
                    <Link href={d.href} className="group block py-3">
                      <span className="label block text-faint">
                        {d.label} · {KINDS[d.kind].label}
                      </span>
                      <span className="font-serif text-lg group-hover:text-red">{d.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted">The route will be here when you come back. Progress is kept in this browser only.</p>
            </aside>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-12">
            <ol className="lg:col-span-8">
              {path.steps.map((s) => (
                <li key={s.id} className="border-t border-rule">
                  <Link href={`?step=${s.position}`} scroll={false} className="group grid grid-cols-[3rem_1fr] gap-4 py-5">
                    <span className="numeral text-[1.8rem] leading-tight text-red">{String(s.position).padStart(2, "0")}</span>
                    <span>
                      <span className="label block text-faint">{KINDS[s.entity.kind].label}</span>
                      <span className="font-serif text-2xl group-hover:text-red">{s.entity.title}</span>
                      <span className="mt-1 block font-serif italic text-muted">{s.framing}</span>
                      {s.branches.length > 0 && (
                        <span className="label mt-2 block text-faint">
                          ↳ {s.branches.length} branch{s.branches.length > 1 ? "es" : ""}: {s.branches.map((b) => b.entity.title).join(" · ")}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <aside className="lg:col-span-4">
              {path.prerequisites && (
                <div className="mb-8 border-l-2 border-red pl-4">
                  <p className="label mb-2 text-faint">Before you start</p>
                  <Prose text={path.prerequisites} context={path.prose.context} className="!text-[0.95rem]" />
                </div>
              )}
              <Link href="?step=1" scroll={false} className="btn btn-red w-full justify-between">
                Begin the path <span aria-hidden="true">→</span>
              </Link>
              <p className="mt-4 text-sm text-muted">
                Move forward and back, or jump to any stop on the route. Every stop links out to the full Atlas entry and
                to detours — you are never confined to the path.
              </p>
            </aside>
          </div>
        )}
      </Container>
    </article>
  );
}
