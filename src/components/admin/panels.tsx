import Link from "next/link";
import type { ReactNode } from "react";
import {
  addCitationAction,
  addExcerptAction,
  deleteCitationAction,
  deleteExcerptAction,
  deleteRelationshipAction,
} from "@/app/admin/actions";
import { entityHref, isEntityKind, KINDS, relationshipLabel, type EntityKind, type RelationshipType } from "@/lib/content/model";
import type { getForEdit } from "@/lib/admin/repository";
import { EntityPicker } from "./EntityPicker";
import { RelationshipComposer } from "./RelationshipComposer";

type Edit = NonNullable<Awaited<ReturnType<typeof getForEdit>>>;
type SourceOption = { id: string; label: string };

export function Panel({ id, title, count, children, help }: { id: string; title: string; count?: number; children: ReactNode; help?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-20 border-t border-ink pt-5">
      <h2 id={`${id}-h`} className="label flex items-baseline gap-3 font-sans">
        {title}
        {count != null && <span className="label-mono text-faint">{count}</span>}
      </h2>
      {help && <p className="mt-1 text-sm text-muted">{help}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function DeleteButton({ action, fields, label = "Remove" }: { action: (f: FormData) => Promise<void>; fields: Record<string, string>; label?: string }) {
  return (
    <form action={action}>
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button type="submit" className="label text-faint hover:text-red">
        {label}
      </button>
    </form>
  );
}

export function RelationshipsPanel({ edit, sources, returnTo }: { edit: Edit; sources: SourceOption[]; returnTo: string }) {
  const kind = edit.entity.kind as EntityKind;
  return (
    <Panel id="relationships" title="Relationships" count={edit.relationships.length} help="Outgoing and incoming. Each reads from this entry's point of view.">
      <ul className="divide-y divide-rule border-y border-rule">
        {edit.relationships.map((r) => (
          <li key={r.id + r.direction} className="grid items-baseline gap-2 py-2 sm:grid-cols-[12rem_1fr_auto]">
            <span className="label text-faint">
              {r.direction === "in" ? "← " : "→ "}
              {relationshipLabel(r.type as RelationshipType, r.direction)}
            </span>
            <span>
              <Link href={`/admin/${r.other.kind}/${r.other.id}`} className="font-serif text-lg hover:text-red">
                {r.other.title}
              </Link>
              <span className="label ml-2 text-faint">{isEntityKind(r.other.kind) ? KINDS[r.other.kind].label : ""}</span>
              {r.note && <span className="ml-3 text-sm text-muted">{r.note}</span>}
              <span className="label-mono ml-2 text-faint">w{r.weight}</span>
            </span>
            <DeleteButton action={deleteRelationshipAction} fields={{ id: r.id, returnTo: `${returnTo}#relationships` }} />
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <RelationshipComposer from={{ id: edit.entity.id, title: edit.entity.title, kind }} sources={sources} returnTo={`${returnTo}#relationships`} />
      </div>
    </Panel>
  );
}

export function CitationsPanel({ edit, sources, returnTo }: { edit: Edit; sources: SourceOption[]; returnTo: string }) {
  return (
    <Panel id="citations" title="Citations" count={edit.citations.length} help="Entry-level sources. Inline footnotes use [cite:source_id, locator] in markup fields.">
      <ul className="divide-y divide-rule border-y border-rule">
        {edit.citations.map((c) => (
          <li key={c.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
            <span className="text-sm">
              <span className="italic">{c.source.title}</span> — {c.source.author}
              {c.locator && <span className="text-muted">, {c.locator}</span>}
              {c.field && <span className="label ml-2 text-faint">{c.field}</span>}
              <span className="label-mono ml-2 text-faint">{c.source.id}</span>
            </span>
            <DeleteButton action={deleteCitationAction} fields={{ id: c.id, returnTo: `${returnTo}#citations` }} />
          </li>
        ))}
      </ul>
      <form action={addCitationAction} className="mt-4 grid gap-3 sm:grid-cols-12">
        <input type="hidden" name="entityId" value={edit.entity.id} />
        <input type="hidden" name="returnTo" value={`${returnTo}#citations`} />
        <select name="sourceId" defaultValue="" className="field sm:col-span-5" aria-label="Source">
          <option value="">Choose a source…</option>
          {sources.map((s) => (
            <option key={s.id} value={s.id}>{s.label.slice(0, 90)}</option>
          ))}
        </select>
        <input name="locator" placeholder="Page / chapter" className="field sm:col-span-2" aria-label="Locator" />
        <input name="field" placeholder="Field (e.g. overview)" className="field sm:col-span-2" aria-label="Field supported" />
        <input name="note" placeholder="Note" className="field sm:col-span-2" aria-label="Note" />
        <button type="submit" className="btn sm:col-span-1">Add</button>
      </form>
    </Panel>
  );
}

export function ExcerptsPanel({ edit, sources, returnTo }: { edit: Edit; sources: SourceOption[]; returnTo: string }) {
  return (
    <Panel
      id="excerpts"
      title="Excerpts"
      count={edit.excerpts.length}
      help="Quoted passages or passage references. Never add a quotation you have not checked; leave the text empty to record a reference only."
    >
      <ul className="space-y-2">
        {edit.excerpts.map((x) => (
          <li key={x.id} className="flex items-baseline justify-between gap-4 border-l-2 border-red pl-3">
            <span className="text-sm">
              {x.body ? <span className="font-serif">“{x.body}”</span> : <em className="text-muted">Reference only</em>}
              <span className="text-muted"> — {x.locator}</span>
              {!x.verified && x.body && <span className="label ml-2 text-red">unverified</span>}
            </span>
            <DeleteButton action={deleteExcerptAction} fields={{ id: x.id, returnTo: `${returnTo}#excerpts` }} />
          </li>
        ))}
      </ul>
      <form action={addExcerptAction} className="mt-4 grid gap-3 sm:grid-cols-12">
        <input type="hidden" name="entityId" value={edit.entity.id} />
        <input type="hidden" name="returnTo" value={`${returnTo}#excerpts`} />
        <div className="sm:col-span-4">
          <EntityPicker name="textId" kinds={["text"]} placeholder="From text…" />
        </div>
        <select name="sourceId" defaultValue="" className="field sm:col-span-4" aria-label="Edition">
          <option value="">Edition (source)…</option>
          {sources.map((s) => (
            <option key={s.id} value={s.id}>{s.label.slice(0, 80)}</option>
          ))}
        </select>
        <input name="locator" placeholder="Locator (ch., §, p.)" className="field sm:col-span-4" aria-label="Locator" />
        <textarea name="body" rows={2} placeholder="Quoted passage (optional)" className="field sm:col-span-8" aria-label="Passage" />
        <input name="note" placeholder="Editorial note" className="field sm:col-span-4" aria-label="Note" />
        <label className="label inline-flex items-center gap-2 sm:col-span-6">
          <input type="checkbox" name="verified" className="accent-[#B51F2A]" /> Wording checked against the edition
        </label>
        <div className="sm:col-span-6 sm:text-right">
          <button type="submit" className="btn">Add excerpt</button>
        </div>
      </form>
    </Panel>
  );
}

export function ViewLink({ kind, slug }: { kind: EntityKind; slug: string }) {
  return (
    <Link href={entityHref(kind, slug)} className="label text-muted hover:text-red">
      View on site ↗
    </Link>
  );
}
