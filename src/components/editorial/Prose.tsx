import Link from "next/link";
import { Fragment } from "react";
import { citeKey, parseBlocks, type Inline } from "@/lib/content/markup";
import type { ProseContext } from "@/lib/data/types";

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
        // Unresolved references (e.g. to an unpublished entry) render as plain text.
        if (!target) return <Fragment key={k}>{label}</Fragment>;
        return (
          <Link key={k} href={target.href} className="link-inline" data-kind={target.kind}>
            {label}
          </Link>
        );
      }
      case "cite": {
        const num = ctx.notes[citeKey(n.source, n.locator)];
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
        if (b.t === "quote") return <blockquote key={i}>{renderInline(b.c, context, `${i}-`)}</blockquote>;
        if (b.t === "list")
          return (
            <ul key={i}>
              {b.items.map((it, j) => (
                <li key={j}>{renderInline(it, context, `${i}-${j}-`)}</li>
              ))}
            </ul>
          );
        return <p key={i}>{renderInline(b.c, context, `${i}-`)}</p>;
      })}
    </div>
  );
}
