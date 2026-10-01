import Link from "next/link";
import { Fragment } from "react";
import { citeKey, footnoteKey, parseBlocks, type Inline } from "@/lib/content/markup";
import type { ProseContext } from "@/lib/data/types";
import { Figure } from "./Figure";
import { VERIFICATION_LABELS } from "@/lib/content/model";

function renderInline(nodes: Inline[], ctx: ProseContext, key = ""): React.ReactNode[] {
  return nodes.map((n, i) => {
    const k = `${key}${i}`;
    switch (n.t) {
      case "text":
        return <Fragment key={k}>{n.v}</Fragment>;
      case "strong":
        return <strong key={k}>{renderInline(n.c, ctx, k)}</strong>;
      case "em":
        return <em key={k}>{renderInline(n.c, ctx, k)}</em>;
      case "link":
        return (
          <a key={k} href={n.href} className="link-inline" rel="noopener noreferrer" target="_blank">
            {renderInline(n.c, ctx, k)}
          </a>
        );
      case "ref": {
        const target = ctx.refs[`${n.kind}:${n.slug}`];
        const label = n.label ?? target?.title ?? n.slug.replace(/-/g, " ");
        // References to unpublished entries render as plain text, so drafts never produce broken links.
        if (!target) return <Fragment key={k}>{label}</Fragment>;
        return (
          <Link key={k} href={target.href} className="link-inline" data-kind={target.kind}>
            {label}
          </Link>
        );
      }
      case "cite":
      case "footnote": {
        const num = ctx.notes[n.t === "cite" ? citeKey(n.source, n.locator) : footnoteKey(n.text)];
        if (!num) return null;
        return (
          <sup key={k}>
            <a href={`#note-${num}`} id={`ref-${num}-${k}`} aria-label={`Note ${num}`}>
              {num}
            </a>
          </sup>
        );
      }
    }
  });
}

/** Renders Atlas markup (see lib/content/markup.ts). Server component. */
export function Prose({
  text,
  context,
  className = "",
  dropcap = false,
}: {
  text: string | null | undefined;
  context: ProseContext;
  className?: string;
  dropcap?: boolean;
}) {
  const blocks = parseBlocks(text);
  if (!blocks.length) return null;
  return (
    <div className={`prose-atlas ${dropcap ? "dropcap" : ""} ${className}`}>
      {blocks.map((b, i) => {
        switch (b.t) {
          case "heading":
            return b.level === 2 ? (
              <h3 key={i} className="!mt-10 font-serif text-[1.65rem] leading-tight text-ink">
                {renderInline(b.c, context, `${i}-`)}
              </h3>
            ) : (
              <h4 key={i} className="label !mt-8 font-sans text-ink">
                {renderInline(b.c, context, `${i}-`)}
              </h4>
            );
          case "quote":
            return <blockquote key={i}>{renderInline(b.c, context, `${i}-`)}</blockquote>;
          case "list": {
            const items = b.items.map((it, j) => <li key={j}>{renderInline(it, context, `${i}-${j}-`)}</li>);
            return b.ordered ? (
              <ol key={i} className="list-decimal pl-6 marker:font-mono marker:text-[0.8em] marker:text-red">
                {items}
              </ol>
            ) : (
              <ul key={i}>{items}</ul>
            );
          }
          case "callout":
            return (
              <aside key={i} className="border-l-2 border-red bg-paper-warm px-4 py-3 text-[0.98rem]">
                <span className="label mb-1 block text-red">Note</span>
                {renderInline(b.c, context, `${i}-`)}
              </aside>
            );
          case "figure": {
            const m = context.media[b.id];
            return m ? <Figure key={i} media={m} caption={b.caption} /> : null;
          }
          case "excerpt": {
            const x = context.excerpts[b.id];
            if (!x || !x.body) return null;
            return (
              <figure key={i} className="!my-8 border-y border-rule py-5">
                <blockquote className="!border-0 !pl-0 font-serif text-[1.35rem] leading-snug">“{x.body}”</blockquote>
                <figcaption className="mt-2 text-sm text-muted">
                  {x.speaker && <span>{x.speaker.title}, </span>}
                  {x.text ? (
                    <Link href={x.text.href} className="link-inline italic">
                      {x.text.title}
                    </Link>
                  ) : (
                    x.source && <span className="italic">{x.source.title}</span>
                  )}
                  {x.locator && <span>, {x.locator}</span>}
                  {x.verification !== "verified" && (
                    <span className="label ml-2 text-red">{VERIFICATION_LABELS[x.verification]}</span>
                  )}
                </figcaption>
              </figure>
            );
          }
          default:
            return <p key={i}>{renderInline(b.c, context, `${i}-`)}</p>;
        }
      })}
    </div>
  );
}
