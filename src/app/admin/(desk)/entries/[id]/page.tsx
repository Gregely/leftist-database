import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapFigure } from "@/components/graph/MapFigure";
import { EntryEditor } from "@/components/desk/EntryEditor";
import { CompareView, RevisionList } from "@/components/desk/History";
import { MediaPanel } from "@/components/desk/MediaPanel";
import { NotesPanel } from "@/components/desk/NotesPanel";
import { PreviewPane } from "@/components/desk/PreviewPane";
import { RelationshipBuilder } from "@/components/desk/RelationshipBuilder";
import { CitationsPanel, ExcerptsPanel } from "@/components/desk/SourcesPanel";
import { DebateEditor, PathEditor } from "@/components/desk/StructureEditors";
import { KindLabel, LiveBadge, Notice, Panel, StatusBadge, ViewSwitch, When } from "@/components/desk/ui";
import { WorkflowBar } from "@/components/desk/WorkflowBar";
import { getTimeline } from "@/lib/data";
import { requireUser } from "@/lib/auth/session";
import { userNames } from "@/lib/auth/users";
import { entityHref, KINDS, type EntityKind, type MediaRole, type WorkflowStatus } from "@/lib/content/model";
import { gateOf, getRevision, hasPendingChanges, listRevisions, loadEntity, readWorkingFields, snapshotFields } from "@/lib/editorial/content";
import { fieldLabel, fieldSections, fieldsFor } from "@/lib/editorial/fields";
import { completeness, dependencies, validateEntity } from "@/lib/editorial/insight";
import { mediaGaps } from "@/lib/editorial/media";
import { notesFor } from "@/lib/editorial/notes";
import { atLeast, availableActions, can } from "@/lib/editorial/permissions";
import { deskNeighborhood } from "@/lib/editorial/queries";
import { sourceGaps } from "@/lib/editorial/sources";
import { citationsFor, debateStructure, excerptsFor, mediaFor, pathSteps, relationshipsFor } from "@/lib/editorial/structure";
import { TRANSITION_PERMISSION, type Transition } from "@/lib/editorial/workflow";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; a?: string; b?: string; split?: string; created?: string; restored?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const row = await loadEntity((await params).id);
  return { title: row ? `Editing: ${row.title}` : "Entry" };
}

const TABS = [
  { id: "content", label: "Content" },
  { id: "connections", label: "Connections" },
  { id: "sources", label: "Sources & excerpts" },
  { id: "media", label: "Media" },
  { id: "structure", label: "Structure" },
  { id: "review", label: "Review" },
  { id: "history", label: "History" },
] as const;

export default async function EntryPage({ params, searchParams }: Props) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const user = await requireUser();
  const row = await loadEntity(id);
  if (!row) notFound();
  const kind = row.kind as EntityKind;
  const gate = gateOf(row);
  const canEdit = can(user, "entity.edit", gate);
  const canStructure = can(user, "entity.editStructure", gate);
  const pending = hasPendingChanges(row);
  const hasStructure = kind === "debate" || kind === "path";
  const tab = TABS.some((t) => t.id === sp.tab) && (sp.tab !== "structure" || hasStructure) ? sp.tab! : "content";
  const split = sp.split === "1" && tab === "content";

  const fields = await readWorkingFields(row);
  const [issues, checklist, notes, names, rels, cites, excerpts, attached, deps, revisions] = await Promise.all([
    validateEntity(row, fields),
    completeness(row, fields),
    notesFor(id),
    userNames(),
    relationshipsFor(id),
    citationsFor(id),
    excerptsFor(id),
    mediaFor(id),
    dependencies(row),
    listRevisions(id),
  ]);

  const openNotes = notes.filter((n) => !n.note.resolved && n.note.kind !== "approval");
  const notesByField: Record<string, number> = {};
  for (const n of openNotes) if (n.note.field) notesByField[n.note.field] = (notesByField[n.note.field] ?? 0) + 1;
  const errors = issues.filter((i) => i.level === "error");

  const actions = availableActions(user, gate).map((a) => ({
    transition: (Object.keys(TRANSITION_PERMISSION) as Transition[]).find((t) => TRANSITION_PERMISSION[t] === a.permission)!,
    label: a.label,
    tone: a.tone,
  }));
  const depCount = deps.related.length + deps.paths.length + deps.debates.length + deps.referencing.length;
  const depText = depCount
    ? `It is connected to ${Object.entries(deps.byKind)
        .map(([k, n]) => `${n} ${n === 1 ? KINDS[k as EntityKind].label.toLowerCase() : KINDS[k as EntityKind].plural.toLowerCase()}`)
        .join(", ")}${deps.paths.length ? `, appears on ${deps.paths.length} learning path${deps.paths.length > 1 ? "s" : ""}` : ""}${deps.referencing.length ? `, and is linked from the prose of ${deps.referencing.length} entr${deps.referencing.length > 1 ? "ies" : "y"}` : ""}. ${deps.liveDependants} of these are public.`
    : "Nothing else in the Atlas depends on it.";
  const depItems = [...deps.related, ...deps.paths, ...deps.debates, ...deps.referencing]
    .filter((e, i, all) => all.findIndex((x) => x.id === e.id) === i)
    .map((e) => ({ id: e.id, title: e.title, kind: KINDS[e.kind as EntityKind].label, live: e.live }));

  let readOnlyReason: string | undefined;
  if (!canEdit) {
    if (row.status === "archived") readOnlyReason = "This entry is archived. An editor can restore it from the archive.";
    else if (row.authorId === user.id) readOnlyReason = "Submitted for review — the entry is locked until a reviewer responds. You can still add notes in Review.";
    else readOnlyReason = "Only the author and editors can change this entry. Leave feedback in the Review tab.";
  }
  const liveNotice = row.live
    ? `This entry is live. Edits are saved as a new version and reach the public site only when an editor publishes them.${pending ? ` Unpublished changes: v${row.revision} (live: v${row.publishedRevision}).` : ""}`
    : undefined;

  const tabHref = (t: string) => `/admin/entries/${id}${t === "content" ? "" : `?tab=${t}`}`;
  const excerptOptions = excerpts.map((x) => ({ id: x.id, body: x.body, locator: x.locator, verification: x.verification }));

  /* ——— Tab bodies ——— */
  let body: React.ReactNode = null;
  if (tab === "content") {
    body = (
      <EntryEditor
        entityId={id}
        sections={fieldSections(kind)}
        initial={fields}
        lockVersion={row.lockVersion}
        updatedAt={row.updatedAt}
        canEdit={canEdit}
        readOnlyReason={readOnlyReason}
        excerpts={excerptOptions}
        notesByField={notesByField}
        liveNotice={liveNotice}
      />
    );
  } else if (tab === "connections") {
    const graph = await deskNeighborhood(id);
    const y = row.yearStart;
    const timeline = y != null ? await getTimeline({ from: y - 12, to: y + 12 }) : [];
    body = (
      <div className="space-y-12">
        {!canStructure && canEdit && <Notice>This entry is live, so its connections are changed by editors. Leave a note in Review to suggest one.</Notice>}
        <RelationshipBuilder
          from={{ id, kind, slug: row.slug, title: row.title }}
          canEdit={canStructure}
          existing={rels.map((r) => ({
            id: r.id,
            type: r.type as never,
            direction: r.direction,
            note: r.note,
            weight: r.weight,
            yearStart: r.yearStart,
            yearEnd: r.yearEnd,
            sourceTitle: r.sourceTitle,
            locator: r.locator,
            other: { id: r.other.id, title: r.other.title, kind: r.other.kind as EntityKind, live: r.other.live, status: r.other.status as WorkflowStatus },
            canDelete: canStructure,
          }))}
        />
        {graph.nodes.length > 1 && (
          <Panel title="On the map" aside={<span className="label text-faint">Unpublished entries are labelled — the public map shows only live ones</span>}>
            <div className="border border-rule bg-paper-warm p-3">
              <MapFigure graph={graph} mode="radial" focusId={id} size="medium" title={`Connections of ${row.title}`} />
            </div>
          </Panel>
        )}
        <Panel title="On the timeline">
          {y == null ? (
            <p className="text-sm italic text-muted">Add a year to place this entry on the timeline.</p>
          ) : (
            <ol className="border-l border-ink">
              {[...timeline.filter((t) => t.id !== id), { id, year: y, title: row.title, kind, lane: kind, mine: true } as never]
                .sort((a: { year: number }, b: { year: number }) => a.year - b.year)
                .map((t: { id: string; year: number; title: string; kind: EntityKind; mine?: boolean }) => (
                  <li key={t.id} className={`relative grid grid-cols-[4rem_1fr] gap-3 py-1.5 pl-4 ${t.mine ? "bg-red/5" : ""}`}>
                    <span aria-hidden="true" className={`absolute -left-[5px] top-3 h-2 w-2 rotate-45 ${t.mine ? "bg-red" : "border border-ink bg-paper"}`} />
                    <span className="numeral text-red">{t.year}</span>
                    <span className={t.mine ? "font-serif font-semibold" : "font-serif"}>
                      {t.title} <KindLabel kind={t.kind} className="ml-1" />
                      {t.mine && <span className="label ml-2 text-red">{row.live ? "this entry" : "this entry — appears once published"}</span>}
                    </span>
                  </li>
                ))}
            </ol>
          )}
        </Panel>
      </div>
    );
  } else if (tab === "sources") {
    body = (
      <div className="space-y-12">
        {!canStructure && canEdit && <Notice>This entry is live, so its sources and excerpts are changed by editors.</Notice>}
        <Panel title={`Sources · ${cites.length}`}>
          <CitationsPanel
            entityId={id}
            canEdit={canStructure}
            citations={cites.map((c) => ({
              id: c.c.id,
              field: c.c.field,
              locator: c.c.locator,
              note: c.c.note,
              source: { id: c.src.id, title: c.src.title, author: c.src.author, publicationDate: c.src.publicationDate, sourceType: c.src.sourceType as never, gaps: sourceGaps(c.src) },
            }))}
          />
        </Panel>
        <Panel title={`Excerpts · ${excerpts.length}`}>
          <ExcerptsPanel
            entityId={id}
            canEdit={canStructure}
            canVerify={atLeast(user, "reviewer")}
            excerpts={excerpts.map((x) => ({
              id: x.id,
              body: x.body,
              locator: x.locator,
              note: x.note,
              verification: x.verification as never,
              text: x.text,
              speaker: x.speaker,
              source: x.source ? { id: x.source.id, title: x.source.title } : null,
            }))}
          />
        </Panel>
      </div>
    );
  } else if (tab === "media") {
    body = (
      <Panel title={`Images · ${attached.length}`}>
        <MediaPanel
          entityId={id}
          canEdit={canStructure}
          defaultRole={(kind === "thinker" ? "portrait" : kind === "text" ? "cover" : kind === "event" ? "photograph" : "figure") as MediaRole}
          attached={attached.map((x) => ({
            attachmentId: x.a.id,
            role: x.a.role as MediaRole,
            caption: x.a.caption,
            media: { id: x.m.id, title: x.m.title, altText: x.m.altText, credit: x.m.credit, license: x.m.license, rights: x.m.rights, width: x.m.width, height: x.m.height },
            gaps: mediaGaps(x.m),
          }))}
        />
      </Panel>
    );
  } else if (tab === "structure" && kind === "debate") {
    const d = await debateStructure(id);
    body = (
      <DebateEditor
        debateId={id}
        canEdit={canStructure}
        data={{
          propositions: d.propositions.map((p) => ({ id: p.id, statement: p.statement })),
          positions: d.positions.map((p) => {
            const h = d.holders.find((x) => x.id === p.holderId);
            return {
              id: p.id,
              label: p.label,
              holder: h ? { id: h.id, kind: h.kind as EntityKind, slug: h.slug, title: h.title } : null,
              centralClaim: p.centralClaim,
              summary: p.summary,
              assumptions: JSON.parse(p.assumptions),
              criticisms: JSON.parse(p.criticisms),
              links: d.links.filter((l) => l.positionId === p.id).map((l) => ({ id: l.entity.id, title: l.entity.title, kind: l.entity.kind as EntityKind })),
            };
          }),
          stances: d.stances.map((s) => ({ positionId: s.positionId, propositionId: s.propositionId, stance: s.stance, note: s.note })),
          args: d.args.map((a) => ({ id: a.id, kind: a.kind, body: a.body, positionId: a.positionId, respondsToId: a.respondsToId })),
        }}
      />
    );
  } else if (tab === "structure" && kind === "path") {
    const steps = await pathSteps(id);
    body = (
      <PathEditor
        pathId={id}
        canEdit={canStructure}
        steps={steps.map(({ step, e }) => ({
          id: step.id,
          position: step.position,
          framing: step.framing,
          track: step.track as "main",
          parentStepId: step.parentStepId,
          entity: { id: e.id, title: e.title, kind: e.kind as EntityKind, live: e.live },
        }))}
      />
    );
  } else if (tab === "review") {
    body = (
      <NotesPanel
        entityId={id}
        canComment={can(user, "entity.comment", gate)}
        fields={fieldsFor(kind).map((f) => ({ name: f.name, label: f.label }))}
        notes={notes.map((n) => ({
          id: n.note.id,
          kind: n.note.kind,
          field: n.note.field,
          fieldLabel: n.note.field ? fieldLabel(kind, n.note.field) : null,
          quote: n.note.quote,
          body: n.note.body,
          resolved: n.note.resolved,
          author: n.author ?? "Former member",
          authorRole: n.authorRole,
          createdAt: n.note.createdAt,
          revision: n.note.revision,
          canResolve: atLeast(user, "reviewer") || n.note.authorId === user.id || row.authorId === user.id,
        }))}
      />
    );
  } else if (tab === "history") {
    const a = Number(sp.a);
    const b = Number(sp.b);
    let compare: React.ReactNode = null;
    if (a && b) {
      const [ra, rb] = await Promise.all([getRevision(id, a), getRevision(id, b)]);
      if (ra && rb) {
        const struct = (r: { snapshot: string }) => {
          try {
            return (JSON.parse(r.snapshot).structure ?? []) as string[];
          } catch {
            return [];
          }
        };
        compare = <CompareView kind={kind} a={a} b={b} fieldsA={snapshotFields(ra)} fieldsB={snapshotFields(rb)} structureA={struct(ra)} structureB={struct(rb)} />;
      }
    }
    body = (
      <div className="space-y-8">
        {sp.restored && <Notice tone="success">Version {sp.restored} was restored as a new version. Nothing was deleted.</Notice>}
        {compare}
        <RevisionList
          entityId={id}
          kind={kind}
          current={row.revision}
          canRestore={can(user, "entity.restoreRevision", gate)}
          lockVersion={row.lockVersion}
          compare={a && b ? { a, b } : undefined}
          revisions={revisions.map((r) => ({
            version: r.rev.version,
            status: r.rev.status as WorkflowStatus,
            message: r.rev.message,
            author: r.author,
            createdAt: r.rev.createdAt,
            updatedAt: r.rev.updatedAt,
            changed: JSON.parse(r.rev.changedFields),
            sealed: r.rev.sealed,
            published: row.publishedRevision === r.rev.version,
          }))}
        />
        <p className="text-xs text-faint">Autosaves by the same person within half an hour are folded into one version. Saving with a note, submitting, publishing or restoring always starts a new one.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1480px] px-4 py-6 sm:px-8">
      {/* Header */}
      <nav aria-label="Breadcrumb" className="label flex flex-wrap items-center gap-2 text-muted">
        <Link href="/admin/content" className="hover:text-red">
          Content
        </Link>
        <span className="text-red">/</span>
        <Link href={`/admin/content?kind=${kind}`} className="hover:text-red">
          {KINDS[kind].plural}
        </Link>
        <span className="text-red">/</span>
        <span className="label-mono text-faint">{id}</span>
      </nav>
      <header className="mt-3 flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <StatusBadge status={row.status as WorkflowStatus} />
            <LiveBadge live={row.live} pending={pending} />
            {row.isSample && <span className="label text-faint">Sample entry</span>}
          </div>
          <h1 className="display mt-2 text-[2.2rem] sm:text-[3rem]">{fields.title || row.title}</h1>
          <p className="label-mono mt-1 text-faint">
            v{row.revision} · {row.authorId ? `by ${names[row.authorId] ?? "former member"}` : "seeded"} · edited <When at={row.updatedAt} />
            {row.reviewerId && ` · reviewer ${names[row.reviewerId] ?? "—"}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ViewSwitch id={id} active="editor" className="lg:hidden" />
          <Link href={`/preview/${id}`} className="btn btn-quiet hidden lg:inline-flex">
            Preview ↗
          </Link>
          {tab === "content" && (
            <Link href={split ? `/admin/entries/${id}` : `/admin/entries/${id}?split=1`} className="btn btn-quiet hidden lg:inline-flex" aria-pressed={split}>
              {split ? "Close side-by-side" : "Side-by-side"}
            </Link>
          )}
          {row.live && (
            <Link href={entityHref(kind, row.slug)} className="label text-muted hover:text-red">
              Live page ↗
            </Link>
          )}
        </div>
      </header>

      {sp.created && (
        <div className="mt-4">
          <Notice tone="success">Created as a draft. Only the desk can see it until it is reviewed and published.</Notice>
        </div>
      )}

      <div className="mt-4">
        <WorkflowBar entityId={id} actions={actions} canArchive={can(user, "entity.archive", gate)} canDelete={can(user, "entity.delete", gate)} errorCount={errors.length} dependencies={{ text: depText, liveDependants: deps.liveDependants, items: depItems }} />
      </div>

      {/* Tabs */}
      <nav aria-label="Editor sections" className="scrollbar-thin mt-6 overflow-x-auto border-b border-ink">
        <ul className="flex min-w-max gap-6">
          {TABS.filter((t) => t.id !== "structure" || hasStructure).map((t) => (
            <li key={t.id}>
              <Link
                href={tabHref(t.id)}
                aria-current={tab === t.id ? "page" : undefined}
                className={`label relative block py-3 ${tab === t.id ? "text-red" : "text-ink hover:text-red"}`}
              >
                {t.id === "structure" ? (kind === "debate" ? "Positions & arguments" : "Route") : t.label}
                {t.id === "review" && openNotes.length > 0 && <span className="label-mono ml-1.5 bg-red px-1 text-[0.6rem] text-paper-warm">{openNotes.length}</span>}
                {t.id === "connections" && <span className="label-mono ml-1.5 text-faint">{rels.length}</span>}
                {t.id === "sources" && <span className="label-mono ml-1.5 text-faint">{cites.length}</span>}
                {t.id === "media" && <span className="label-mono ml-1.5 text-faint">{attached.length}</span>}
                {tab === t.id && <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-[2px] bg-red" />}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {split ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="min-w-0">{body}</div>
          <PreviewPane src={`/preview/${id}?embed=1`} />
        </div>
      ) : (
        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="min-w-0">{body}</div>
          <aside className="space-y-8" aria-label="Editorial checks">
            <Panel title="Completeness">
              <ul className="space-y-1">
                {checklist.map((c) => (
                  <li key={c.section} className="flex items-baseline justify-between gap-3 text-sm" title={c.hint}>
                    <span className={c.done ? "" : "text-muted"}>{c.section}</span>
                    <span aria-label={c.done ? "complete" : "incomplete"} className={c.done ? "text-olive" : "text-faint"}>
                      {c.done ? "✓" : "○"}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-faint">A guide to what an entry usually covers — not a score.</p>
            </Panel>
            <Panel title={`Checks · ${errors.length} error${errors.length === 1 ? "" : "s"}`}>
              {issues.length === 0 ? (
                <p className="text-sm text-olive">No structural problems found.</p>
              ) : (
                <ul className="space-y-2">
                  {issues.map((i, n) => (
                    <li key={n} className="text-sm leading-snug">
                      <span className={`label mr-1.5 ${i.level === "error" ? "text-red" : i.level === "warning" ? "text-ochre" : "text-faint"}`}>{i.level}</span>
                      {i.message}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs text-faint">These checks cover structure and sourcing. Whether an interpretation is right is for editors to judge.</p>
            </Panel>
            <Panel title="Feedback">
              <p className="text-sm">
                {openNotes.length ? (
                  <Link href={tabHref("review")} className="link-inline">
                    {openNotes.length} open note{openNotes.length > 1 ? "s" : ""}
                  </Link>
                ) : (
                  <span className="text-muted">No open notes.</span>
                )}
              </p>
            </Panel>
          </aside>
        </div>
      )}
    </div>
  );
}
