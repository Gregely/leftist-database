import { createRelationshipAction } from "@/app/admin/actions";
import { ALL_RELATIONSHIP_TYPES, INVERSE_ALIASES, RELATIONSHIP_TYPES, type EntityKind, type RelationshipType } from "@/lib/content/model";
import { EntityPicker } from "./EntityPicker";

function typeLabel(t: string) {
  if (t in INVERSE_ALIASES) {
    const c = INVERSE_ALIASES[t as keyof typeof INVERSE_ALIASES];
    return `${RELATIONSHIP_TYPES[c].inverseLabel} (${t})`;
  }
  return `${RELATIONSHIP_TYPES[t as RelationshipType].label} (${t})`;
}

/** "From [entry] — [type] → [entry]" sentence-style relationship builder. */
export function RelationshipComposer({
  from,
  sources,
  returnTo,
}: {
  from?: { id: string; title: string; kind: EntityKind };
  sources: { id: string; label: string }[];
  returnTo: string;
}) {
  return (
    <form action={createRelationshipAction} className="grid gap-3 border border-ink bg-paper-warm p-4 lg:grid-cols-12">
      <input type="hidden" name="returnTo" value={returnTo} />
      <div className="lg:col-span-4">
        {from ? (
          <>
            <input type="hidden" name="fromId" value={from.id} />
            <p className="label mb-1 text-faint">From</p>
            <p className="field border-ink font-serif">{from.title}</p>
          </>
        ) : (
          <EntityPicker name="fromId" label="From" required />
        )}
      </div>
      <div className="lg:col-span-3">
        <label htmlFor="rel-type" className="label mb-1 block text-faint">
          Relationship
        </label>
        <select id="rel-type" name="type" defaultValue="INFLUENCED" className="field">
          {ALL_RELATIONSHIP_TYPES.map((t) => (
            <option key={t} value={t}>
              {typeLabel(t)}
            </option>
          ))}
        </select>
      </div>
      <div className="lg:col-span-5">
        <EntityPicker name="toId" label="To" required />
      </div>
      <div className="lg:col-span-5">
        <label htmlFor="rel-note" className="label mb-1 block text-faint">Note</label>
        <input id="rel-note" name="note" className="field" placeholder="e.g. via The Poverty of Philosophy (1847)" />
      </div>
      <div className="lg:col-span-2">
        <label htmlFor="rel-weight" className="label mb-1 block text-faint">Weight</label>
        <select id="rel-weight" name="weight" defaultValue="2" className="field">
          <option value="1">1 · minor</option>
          <option value="2">2 · significant</option>
          <option value="3">3 · defining</option>
        </select>
      </div>
      <div className="lg:col-span-3">
        <label htmlFor="rel-source" className="label mb-1 block text-faint">Source</label>
        <select id="rel-source" name="sourceId" defaultValue="" className="field">
          <option value="">—</option>
          {sources.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label.slice(0, 70)}
            </option>
          ))}
        </select>
      </div>
      <div className="lg:col-span-2">
        <label htmlFor="rel-loc" className="label mb-1 block text-faint">Page / ch.</label>
        <input id="rel-loc" name="locator" className="field" />
      </div>
      <div className="flex items-end lg:col-span-12">
        <button type="submit" className="btn btn-red">Add relationship</button>
      </div>
    </form>
  );
}
