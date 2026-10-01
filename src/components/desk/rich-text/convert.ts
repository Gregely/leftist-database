/**
 * Lossless conversion between Atlas markup (the stored format) and the
 * ProseMirror JSON used by the Tiptap editor.
 */
import type { JSONContent } from "@tiptap/core";
import { parseBlocks, parseInline, serializeBlocks, serializeInline, type Block, type Inline } from "@/lib/content/markup";

type Mark = { type: string; attrs?: Record<string, unknown> };

function inlineToPM(nodes: Inline[], marks: Mark[] = []): JSONContent[] {
  const out: JSONContent[] = [];
  for (const n of nodes) {
    switch (n.t) {
      case "text":
        if (n.v) out.push(marks.length ? { type: "text", text: n.v, marks } : { type: "text", text: n.v });
        break;
      case "strong":
        out.push(...inlineToPM(n.c, [...marks, { type: "bold" }]));
        break;
      case "em":
        out.push(...inlineToPM(n.c, [...marks, { type: "italic" }]));
        break;
      case "link":
        out.push(...inlineToPM(n.c, [...marks, { type: "link", attrs: { href: n.href } }]));
        break;
      case "ref": {
        const label = n.label ?? n.slug.replace(/-/g, " ");
        out.push(...inlineToPM(parseInline(label), [...marks, { type: "entityRef", attrs: { kind: n.kind, slug: n.slug } }]));
        break;
      }
      case "cite":
        out.push({ type: "citation", attrs: { source: n.source, locator: n.locator ?? "" } });
        break;
      case "footnote":
        out.push({ type: "footnote", attrs: { text: n.text } });
        break;
    }
  }
  return out;
}

const para = (c: Inline[]): JSONContent => {
  const content = inlineToPM(c);
  return content.length ? { type: "paragraph", content } : { type: "paragraph" };
};

function blockToPM(b: Block): JSONContent {
  switch (b.t) {
    case "p":
      return para(b.c);
    case "heading":
      return { type: "heading", attrs: { level: b.level }, content: inlineToPM(b.c) };
    case "quote":
      return { type: "blockquote", content: [para(b.c)] };
    case "list":
      return { type: b.ordered ? "orderedList" : "bulletList", content: b.items.map((it) => ({ type: "listItem", content: [para(it)] })) };
    case "callout":
      return { type: "callout", content: inlineToPM(b.c) };
    case "figure":
      return { type: "figure", attrs: { mediaId: b.id, caption: b.caption } };
    case "excerpt":
      return { type: "excerptEmbed", attrs: { excerptId: b.id } };
  }
}

export function markupToDoc(markup: string): JSONContent {
  const blocks = parseBlocks(markup);
  return { type: "doc", content: blocks.length ? blocks.map(blockToPM) : [{ type: "paragraph" }] };
}

/* ———————————————————————————————————————————————————————————————— */

type Seg = { node: JSONContent; marks: Mark[] };
const ORDER = ["entityRef", "link", "bold", "italic"] as const;

const markKey = (m: Mark | undefined) => (m ? `${m.type}:${JSON.stringify(m.attrs ?? {})}` : "");

function build(segs: Seg[], order: readonly string[]): Inline[] {
  if (!order.length) {
    return segs.flatMap((s): Inline[] => {
      const n = s.node;
      if (n.type === "text") return [{ t: "text", v: n.text ?? "" }];
      if (n.type === "citation") return [{ t: "cite", source: String(n.attrs?.source ?? ""), locator: String(n.attrs?.locator ?? "") || undefined }];
      if (n.type === "footnote") return [{ t: "footnote", text: String(n.attrs?.text ?? "") }];
      if (n.type === "hardBreak") return [{ t: "text", v: " " }];
      return [];
    });
  }
  const [type, ...rest] = order;
  const out: Inline[] = [];
  let i = 0;
  while (i < segs.length) {
    const m = segs[i].marks.find((x) => x.type === type);
    const key = markKey(m);
    let j = i + 1;
    while (j < segs.length && markKey(segs[j].marks.find((x) => x.type === type)) === key) j++;
    const group = segs.slice(i, j);
    if (!m) out.push(...build(group, rest));
    else {
      const inner = build(
        group.map((g) => ({ ...g, marks: g.marks.filter((x) => x.type !== type) })),
        rest,
      );
      if (type === "bold") out.push({ t: "strong", c: inner });
      else if (type === "italic") out.push({ t: "em", c: inner });
      else if (type === "link") out.push({ t: "link", href: String(m.attrs?.href ?? ""), c: inner });
      else out.push({ t: "ref", kind: String(m.attrs?.kind), slug: String(m.attrs?.slug), label: serializeInline(inner) });
    }
    i = j;
  }
  return out;
}

function pmInline(content: JSONContent[] | undefined): Inline[] {
  const segs: Seg[] = (content ?? []).map((node) => ({ node, marks: (node.marks ?? []) as Mark[] }));
  return build(segs, ORDER);
}

function pmBlock(n: JSONContent): Block[] {
  switch (n.type) {
    case "paragraph":
      return [{ t: "p", c: pmInline(n.content) }];
    case "heading":
      return [{ t: "heading", level: n.attrs?.level === 3 ? 3 : 2, c: pmInline(n.content) }];
    case "blockquote":
      return [{ t: "quote", c: (n.content ?? []).flatMap((p, i) => [...(i ? [{ t: "text" as const, v: " " }] : []), ...pmInline(p.content)]) }];
    case "bulletList":
    case "orderedList":
      return [
        {
          t: "list",
          ordered: n.type === "orderedList",
          items: (n.content ?? []).map((li) => (li.content ?? []).flatMap((p, i) => [...(i ? [{ t: "text" as const, v: " " }] : []), ...pmInline(p.content)])),
        },
      ];
    case "callout":
      return [{ t: "callout", c: pmInline(n.content) }];
    case "figure":
      return n.attrs?.mediaId ? [{ t: "figure", id: String(n.attrs.mediaId), caption: String(n.attrs.caption ?? "") }] : [];
    case "excerptEmbed":
      return n.attrs?.excerptId ? [{ t: "excerpt", id: String(n.attrs.excerptId) }] : [];
    default:
      return [];
  }
}

export function docToMarkup(doc: JSONContent): string {
  return serializeBlocks((doc.content ?? []).flatMap(pmBlock));
}
