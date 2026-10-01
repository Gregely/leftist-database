"use client";

import { Mark, mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, type ReactNodeViewProps } from "@tiptap/react";

/** A link to another entry in the Atlas, stored as kind + slug (never a URL). */
export const EntityRef = Mark.create({
  name: "entityRef",
  inclusive: false,
  excludes: "link",
  addAttributes() {
    return {
      kind: { default: null, parseHTML: (el) => el.getAttribute("data-kind"), renderHTML: (a) => ({ "data-kind": a.kind }) },
      slug: { default: null, parseHTML: (el) => el.getAttribute("data-slug"), renderHTML: (a) => ({ "data-slug": a.slug }) },
    };
  },
  parseHTML() {
    return [{ tag: "a[data-entity-ref]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["a", mergeAttributes(HTMLAttributes, { "data-entity-ref": "", class: "rt-entity", title: `Links to ${HTMLAttributes["data-kind"]}: ${HTMLAttributes["data-slug"]}` }), 0];
  },
});

/** Inline citation of a source, rendered on the site as a numbered footnote. */
export const Citation = Node.create({
  name: "citation",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  addAttributes() {
    return {
      source: { default: "" },
      locator: { default: "" },
      label: { default: "" },
    };
  },
  parseHTML() {
    return [{ tag: "sup[data-cite]" }];
  },
  renderHTML({ node }) {
    const { source, locator, label } = node.attrs as { source: string; locator: string; label: string };
    return ["sup", { "data-cite": source, class: "rt-chip", title: `Citation: ${label || source}${locator ? `, ${locator}` : ""}` }, `[${(label || source).slice(0, 28)}${locator ? `, ${locator}` : ""}]`];
  },
});

/** Explanatory footnote, rendered on the site in the notes apparatus. */
export const Footnote = Node.create({
  name: "footnote",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  addAttributes() {
    return { text: { default: "" } };
  },
  parseHTML() {
    return [{ tag: "sup[data-footnote]" }];
  },
  renderHTML({ node }) {
    return ["sup", { "data-footnote": "", class: "rt-chip rt-chip-note", title: `Footnote: ${node.attrs.text}` }, "[note]"];
  },
});

/** A callout box: one paragraph of emphasised editorial aside. */
export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "inline*",
  defining: true,
  parseHTML() {
    return [{ tag: "aside[data-callout]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["aside", mergeAttributes(HTMLAttributes, { "data-callout": "", class: "rt-callout" }), 0];
  },
});

function FigureView({ node, updateAttributes, selected, deleteNode }: ReactNodeViewProps) {
  const { mediaId, caption } = node.attrs as { mediaId: string; caption: string };
  return (
    <NodeViewWrapper as="figure" className={`rt-figure ${selected ? "is-selected" : ""}`} data-drag-handle="">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/media/${mediaId}`} alt="" />
      <div className="flex items-center gap-2" contentEditable={false}>
        <label className="label shrink-0 text-faint" htmlFor={`cap-${mediaId}`}>
          Caption
        </label>
        <input
          id={`cap-${mediaId}`}
          value={caption}
          onChange={(e) => updateAttributes({ caption: e.target.value })}
          placeholder="Caption for this use (optional)"
          className="field py-1 text-sm"
        />
        <button type="button" onClick={deleteNode} className="label shrink-0 text-faint hover:text-red" aria-label="Remove figure">
          ✕
        </button>
      </div>
    </NodeViewWrapper>
  );
}

export const Figure = Node.create({
  name: "figure",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return { mediaId: { default: "" }, caption: { default: "" } };
  },
  parseHTML() {
    return [{ tag: "figure[data-media]" }];
  },
  renderHTML({ node }) {
    return ["figure", { "data-media": node.attrs.mediaId }];
  },
  addNodeView() {
    return ReactNodeViewRenderer(FigureView);
  },
});

export interface ExcerptOption {
  id: string;
  body: string;
  locator: string | null;
  verification: string;
}

function ExcerptView({ node, extension, selected, deleteNode }: ReactNodeViewProps) {
  const options = (extension.options as { excerpts: ExcerptOption[] }).excerpts;
  const x = options.find((o) => o.id === node.attrs.excerptId);
  return (
    <NodeViewWrapper as="div" className={`rt-excerpt ${selected ? "is-selected" : ""}`} contentEditable={false}>
      <span className="label text-red">Excerpt</span>
      {x ? (
        <span className="mt-1 block font-serif">
          {x.body ? `“${x.body}”` : <em>Passage reference</em>} <span className="text-xs text-muted">{x.locator}</span>
          {x.verification !== "verified" && <span className="label ml-2 text-red">{x.verification.replace("_", " ")}</span>}
        </span>
      ) : (
        <span className="mt-1 block text-sm text-red-deep">Excerpt {String(node.attrs.excerptId)} is not attached to this entry.</span>
      )}
      <button type="button" onClick={deleteNode} className="label mt-1 text-faint hover:text-red">
        Remove
      </button>
    </NodeViewWrapper>
  );
}

export const ExcerptEmbed = Node.create<{ excerpts: ExcerptOption[] }>({
  name: "excerptEmbed",
  group: "block",
  atom: true,
  addOptions() {
    return { excerpts: [] };
  },
  addAttributes() {
    return { excerptId: { default: "" } };
  },
  parseHTML() {
    return [{ tag: "div[data-excerpt]" }];
  },
  renderHTML({ node }) {
    return ["div", { "data-excerpt": node.attrs.excerptId }];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ExcerptView);
  },
});
