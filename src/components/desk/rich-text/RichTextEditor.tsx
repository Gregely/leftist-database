"use client";

import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useId, useRef, useState } from "react";
import { EntityPicker, type PickedEntity } from "../EntityPicker";
import { MediaPicker } from "../MediaPicker";
import { SourcePicker, type PickedSource } from "../SourcePicker";
import { docToMarkup, markupToDoc } from "./convert";
import { Callout, Citation, EntityRef, ExcerptEmbed, Figure, Footnote, type ExcerptOption } from "./extensions";

type Drawer = null | "entity" | "link" | "cite" | "footnote" | "figure" | "excerpt";

/**
 * The editorial rich-text editor. A slim, word-labelled toolbar rather than a
 * wall of icons; tools that need input open a drawer beneath it. Content is
 * stored as Atlas markup (see lib/content/markup.ts).
 */
export function RichTextEditor({
  id,
  label,
  value,
  onChange,
  disabled,
  compact,
  excerpts = [],
  entityId,
  describedBy,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (markup: string) => void;
  disabled?: boolean;
  compact?: boolean;
  excerpts?: ExcerptOption[];
  entityId?: string;
  describedBy?: string;
}) {
  const [drawer, setDrawer] = useState<Drawer>(null);
  const lastEmitted = useRef(value);
  const labelId = useId();

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        strike: false,
        horizontalRule: false,
        underline: false,
        link: { openOnClick: false, autolink: false, HTMLAttributes: { rel: "noopener noreferrer", class: "rt-link" } },
      }),
      EntityRef,
      Citation,
      Footnote,
      Callout,
      Figure,
      ExcerptEmbed.configure({ excerpts }),
    ],
    content: markupToDoc(value),
    editorProps: {
      attributes: {
        class: `rt-content prose-atlas ${compact ? "min-h-[5rem]" : "min-h-[12rem]"}`,
        "aria-labelledby": labelId,
        "aria-multiline": "true",
        role: "textbox",
        ...(describedBy ? { "aria-describedby": describedBy } : {}),
      },
      handleKeyDown: (_view, event) => {
        if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "l") {
          setDrawer("entity");
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const md = docToMarkup(editor.getJSON());
      lastEmitted.current = md;
      onChange(md);
    },
  });

  // External value changes (restore, recovery) replace the document.
  useEffect(() => {
    if (!editor || value === lastEmitted.current) return;
    lastEmitted.current = value;
    editor.commands.setContent(markupToDoc(value), { emitUpdate: false });
  }, [value, editor]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [disabled, editor]);

  return (
    <div className={`rt border ${disabled ? "border-rule bg-paper" : "border-rule bg-paper-warm focus-within:border-ink"}`}>
      <span id={labelId} className="sr-only">
        {label}
      </span>
      {!disabled && editor && <Toolbar editor={editor} drawer={drawer} setDrawer={setDrawer} compact={compact} hasExcerpts={excerpts.length > 0} />}
      {!disabled && editor && drawer && (
        <div className="border-b border-rule bg-paper px-3 py-3">
          <DrawerBody editor={editor} drawer={drawer} close={() => setDrawer(null)} excerpts={excerpts} entityId={entityId} />
        </div>
      )}
      <EditorContent editor={editor} id={id} className="px-4 py-3" />
    </div>
  );
}

function Toolbar({ editor, drawer, setDrawer, compact, hasExcerpts }: { editor: Editor; drawer: Drawer; setDrawer: (d: Drawer) => void; compact?: boolean; hasExcerpts: boolean }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      quote: e.isActive("blockquote"),
      ul: e.isActive("bulletList"),
      ol: e.isActive("orderedList"),
      link: e.isActive("link"),
      entity: e.isActive("entityRef"),
      callout: e.isActive("callout"),
    }),
  });
  const btn = (label: string, active: boolean, onClick: () => void, title?: string) => (
    <button
      key={label}
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-pressed={active}
      title={title ?? label}
      className={`label px-2 py-1.5 transition-colors ${active ? "bg-ink text-paper" : "text-muted hover:bg-paper hover:text-ink"}`}
    >
      {label}
    </button>
  );
  const sep = (k: string) => <span key={k} aria-hidden="true" className="mx-1 h-4 w-px bg-rule" />;
  const c = () => editor.chain().focus();
  const toggleDrawer = (d: Drawer) => setDrawer(drawer === d ? null : d);
  return (
    <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-0.5 border-b border-rule px-1.5 py-1">
      {!compact && [btn("H2", !!s?.h2, () => c().toggleHeading({ level: 2 }).run(), "Section heading"), btn("H3", !!s?.h3, () => c().toggleHeading({ level: 3 }).run(), "Subheading"), sep("a")]}
      {btn("Bold", !!s?.bold, () => c().toggleBold().run())}
      {btn("Italic", !!s?.italic, () => c().toggleItalic().run())}
      {!compact && [sep("b"), btn("Quote", !!s?.quote, () => c().toggleBlockquote().run()), btn("• List", !!s?.ul, () => c().toggleBulletList().run()), btn("1. List", !!s?.ol, () => c().toggleOrderedList().run()), btn("Note box", !!s?.callout, () => (s?.callout ? c().setParagraph().run() : c().setNode("callout").run()), "Callout")]}
      {sep("c")}
      {btn("Link entry", !!s?.entity || drawer === "entity", () => (s?.entity ? c().unsetMark("entityRef").run() : toggleDrawer("entity")), s?.entity ? "Remove entry link" : "Link the selected words to an entry (⌘⇧L)")}
      {btn("Web link", !!s?.link || drawer === "link", () => (s?.link ? c().unsetLink().run() : toggleDrawer("link")))}
      {btn("Cite", drawer === "cite", () => toggleDrawer("cite"), "Insert a citation")}
      {btn("Footnote", drawer === "footnote", () => toggleDrawer("footnote"))}
      {!compact && [btn("Figure", drawer === "figure", () => toggleDrawer("figure")), ...(hasExcerpts ? [btn("Excerpt", drawer === "excerpt", () => toggleDrawer("excerpt"))] : [])]}
    </div>
  );
}

function DrawerBody({ editor, drawer, close, excerpts, entityId }: { editor: Editor; drawer: Drawer; close: () => void; excerpts: ExcerptOption[]; entityId?: string }) {
  const selected = editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to, " ").trim();
  const [entity, setEntity] = useState<PickedEntity | null>(null);
  const [source, setSource] = useState<PickedSource | null>(null);
  const [text, setText] = useState("");
  const [locator, setLocator] = useState("");
  const done = () => {
    close();
    editor.commands.focus();
  };
  const actions = (primary: string, disabled: boolean, onClick: () => void) => (
    <div className="mt-3 flex items-center gap-3">
      <button type="button" disabled={disabled} onClick={onClick} className="btn btn-red py-1.5 disabled:opacity-50">
        {primary}
      </button>
      <button type="button" onClick={done} className="label text-muted hover:text-ink">
        Cancel
      </button>
    </div>
  );

  if (drawer === "entity") {
    return (
      <div>
        <EntityPicker
          label={selected ? `Link “${selected.slice(0, 40)}” to…` : "Insert a link to…"}
          value={entity}
          onChange={setEntity}
          initialQuery={selected}
          autoFocus
          kinds={["thinker", "concept", "text", "debate", "tendency", "event"]}
        />
        {actions("Link", !entity, () => {
          if (!entity) return;
          const mark = { kind: entity.kind, slug: entity.slug };
          if (selected) editor.chain().focus().setMark("entityRef", mark).run();
          else editor.chain().focus().insertContent({ type: "text", text: entity.title, marks: [{ type: "entityRef", attrs: mark }] }).insertContent(" ").run();
          done();
        })}
      </div>
    );
  }
  if (drawer === "link") {
    return (
      <div>
        <label className="label mb-1 block text-faint" htmlFor="rt-url">
          Web address
        </label>
        <input id="rt-url" autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="https://…" className="field" />
        {actions("Add link", !/^https?:\/\/\S+$/.test(text), () => {
          if (selected) editor.chain().focus().setLink({ href: text }).run();
          else editor.chain().focus().insertContent({ type: "text", text, marks: [{ type: "link", attrs: { href: text } }] }).run();
          done();
        })}
      </div>
    );
  }
  if (drawer === "cite") {
    return (
      <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
        <SourcePicker label="Cite a source" value={source} onChange={setSource} />
        <label>
          <span className="label mb-1 block text-faint">Page / chapter</span>
          <input value={locator} onChange={(e) => setLocator(e.target.value)} placeholder="p. 125" className="field" />
        </label>
        <div className="sm:col-span-2">
          {actions("Insert citation", !source, () => {
            if (!source) return;
            editor.chain().focus().insertContent({ type: "citation", attrs: { source: source.id, locator: locator.trim(), label: source.title } }).run();
            done();
          })}
          <p className="mt-2 text-xs text-faint">The source is numbered as a footnote on the site and listed under Notes &amp; sources.</p>
        </div>
      </div>
    );
  }
  if (drawer === "footnote") {
    return (
      <div>
        <label className="label mb-1 block text-faint" htmlFor="rt-fn">
          Footnote text
        </label>
        <textarea id="rt-fn" autoFocus rows={2} value={text} onChange={(e) => setText(e.target.value.replace(/[\]\n]/g, " "))} className="field" />
        {actions("Insert footnote", !text.trim(), () => {
          editor.chain().focus().insertContent({ type: "footnote", attrs: { text: text.trim() } }).run();
          done();
        })}
      </div>
    );
  }
  if (drawer === "figure") {
    return (
      <MediaPicker
        submitLabel="Insert figure"
        onCancel={done}
        onSelect={(m) => {
          editor.chain().focus().insertContent({ type: "figure", attrs: { mediaId: m.id, caption: m.caption ?? "" } }).run();
          done();
        }}
      />
    );
  }
  if (drawer === "excerpt") {
    return (
      <div>
        <p className="label mb-2 text-faint">Embed one of this entry&apos;s excerpts {entityId ? "" : ""}</p>
        <ul className="max-h-56 space-y-1 overflow-y-auto">
          {excerpts.map((x) => (
            <li key={x.id}>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().insertContent({ type: "excerptEmbed", attrs: { excerptId: x.id } }).run();
                  done();
                }}
                className="w-full border border-rule px-3 py-2 text-left text-sm hover:border-ink"
              >
                {x.body ? `“${x.body.slice(0, 120)}”` : <em>Passage reference</em>} <span className="text-muted">{x.locator}</span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={done} className="label mt-2 text-muted hover:text-ink">
          Cancel
        </button>
      </div>
    );
  }
  return null;
}
