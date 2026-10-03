import type { Metadata } from "next";
import Link from "next/link";
import { ViewSwitch } from "@/components/desk/ui";
import { notFound } from "next/navigation";
import { ConceptView } from "@/components/views/ConceptView";
import { DebateView } from "@/components/views/DebateView";
import { EventView } from "@/components/views/EventView";
import { GuidedView } from "@/components/views/GuidedView";
import { PathView } from "@/components/views/PathView";
import { TendencyView } from "@/components/views/TendencyView";
import { TextView } from "@/components/views/TextView";
import { ThinkerView } from "@/components/views/ThinkerView";
import { requireUser } from "@/lib/auth/session";
import { getConcept, getDebate, getEvent, getGuidedJourney, getPath, getTendency, getText, getThinker } from "@/lib/data";
import type { PreviewSpec } from "@/lib/data/types";
import { STATUS_LABELS, type WorkflowStatus } from "@/lib/content/model";
import { hasPendingChanges, loadEntity, previewOverlay } from "@/lib/editorial/content";
import { assertCan } from "@/lib/editorial/permissions";
import { idsInCollection, parseTags, stepCollections } from "@/lib/editorial/collections";
import { enterPreviewScope } from "@/lib/data/scope";

export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false } };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ depth?: string; step?: string; embed?: string; with?: string }> };

/**
 * Authenticated preview of an entry's working copy, rendered with the same
 * view components as the public site. Never cached, never indexed.
 *
 * The entry's staged structure is always included. With `?with=<collection>`
 * the other unpublished entries of that editorial collection are treated as
 * published too, so a whole body of draft work can be read — and navigated —
 * as it would appear once released.
 */
export default async function PreviewPage({ params, searchParams }: Props) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const user = await requireUser();
  const row = await loadEntity(id);
  if (!row) notFound();
  assertCan(user, "entity.view");
  // Collections this preview can widen to: the entry's own, and for a path (or Guided journey) those of its stops.
  const own = parseTags(row.editorialTags);
  const tags = [...new Set([...own, ...(row.kind === "path" ? await stepCollections(id) : [])])];
  const collection = sp.with && tags.includes(sp.with) ? sp.with : null;
  enterPreviewScope(
    collection ? [id, ...(await idsInCollection(collection))] : [id],
    collection ? `with=${encodeURIComponent(collection)}` : "",
  );
  const overlay = await previewOverlay(row);
  const preview: PreviewSpec = { entityId: id, entity: overlay.entity, details: overlay.details };
  const slug = row.slug;

  let view: React.ReactNode = null;
  switch (row.kind) {
    case "thinker": {
      const t = await getThinker(slug, preview);
      if (t) view = <ThinkerView t={t} />;
      break;
    }
    case "concept": {
      const c = await getConcept(slug, preview);
      if (c) view = <ConceptView c={c} depth={sp.depth} />;
      break;
    }
    case "text": {
      const t = await getText(slug, preview);
      if (t) view = <TextView t={t} />;
      break;
    }
    case "tendency": {
      const t = await getTendency(slug, preview);
      if (t) view = <TendencyView t={t} />;
      break;
    }
    case "debate": {
      const d = await getDebate(slug, preview);
      if (d) view = <DebateView d={d} />;
      break;
    }
    case "event": {
      const e = await getEvent(slug, preview);
      if (e) view = <EventView e={e} />;
      break;
    }
    case "path": {
      const journey = await getGuidedJourney(slug, preview);
      if (journey) {
        const q = collection ? `with=${encodeURIComponent(collection)}` : "";
        view = <GuidedView journey={journey} step={sp.step} depth={sp.depth} links={{ overview: `/preview/${id}${q ? `?${q}` : ""}`, stepPrefix: `/preview/${id}?${q ? `${q}&` : ""}step=` }} />;
        break;
      }
      const p = await getPath(slug, preview);
      if (p) view = <PathView path={p} step={sp.step} />;
      break;
    }
  }
  if (!view) notFound();

  return (
    <>
      <div role="note" className="sticky top-14 z-30 border-b border-red bg-red text-paper-warm">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-8">
          <p className="label">
            Preview · v{row.revision} · {STATUS_LABELS[row.status as WorkflowStatus]}
            {row.live ? (hasPendingChanges(row) ? " · live version differs" : " · matches the live page") : " · not public"}
            {collection && ` · with the rest of “${collection}”`}
          </p>
          {sp.embed !== "1" &&
            (collection ? (
              <Link href={`/preview/${id}`} className="label underline underline-offset-4">
                Show this entry alone
              </Link>
            ) : (
              tags.map((t) => (
                <Link key={t} href={`/preview/${id}?with=${encodeURIComponent(t)}`} className="label underline underline-offset-4">
                  Include unpublished “{t}” entries
                </Link>
              ))
            ))}
          {sp.embed !== "1" && (
            <>
              <ViewSwitch id={id} active="preview" tone="red" className="lg:hidden" />
              <Link href={`/admin/entries/${id}`} className="label hidden underline underline-offset-4 lg:inline">
                ← Back to the editor
              </Link>
            </>
          )}
        </div>
      </div>
      {view}
    </>
  );
}
