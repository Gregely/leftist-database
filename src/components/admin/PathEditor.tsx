import { addStepAction, deleteStepAction, moveStepAction, updateStepAction } from "@/app/admin/actions";
import type { getPathSteps } from "@/lib/admin/repository";
import { KINDS, type EntityKind } from "@/lib/content/model";
import { EntityPicker } from "./EntityPicker";
import { DeleteButton, Panel } from "./panels";

export function PathEditor({ pathId, steps, returnTo }: { pathId: string; steps: Awaited<ReturnType<typeof getPathSteps>>; returnTo: string }) {
  const back = `${returnTo}#steps`;
  return (
    <Panel id="steps" title="Route" count={steps.length} help="Stops in order. Each stop can be any entry; the framing explains why it is here.">
      <ol className="divide-y divide-rule border-y border-rule">
        {steps.map(({ step, e }, i) => (
          <li key={step.id} className="grid items-start gap-3 py-3 sm:grid-cols-[3rem_14rem_1fr_auto]">
            <span className="numeral text-2xl text-red">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <span className="font-serif text-lg">{e.title}</span>
              <span className="label block text-faint">{KINDS[e.kind as EntityKind]?.label}</span>
            </span>
            <form action={updateStepAction} className="flex gap-2">
              <input type="hidden" name="id" value={step.id} />
              <input type="hidden" name="returnTo" value={back} />
              <input name="framing" defaultValue={step.framing} className="field text-sm" aria-label={`Framing for stop ${i + 1}`} />
              <button type="submit" className="label text-muted hover:text-red">Save</button>
            </form>
            <span className="flex gap-3">
              {i > 0 && <DeleteButton action={moveStepAction} fields={{ pathId, id: step.id, delta: "-1", returnTo: back }} label="↑" />}
              {i < steps.length - 1 && <DeleteButton action={moveStepAction} fields={{ pathId, id: step.id, delta: "1", returnTo: back }} label="↓" />}
              <DeleteButton action={deleteStepAction} fields={{ pathId, id: step.id, returnTo: back }} />
            </span>
          </li>
        ))}
      </ol>
      <form action={addStepAction} className="mt-4 grid gap-3 sm:grid-cols-12">
        <input type="hidden" name="pathId" value={pathId} />
        <input type="hidden" name="returnTo" value={back} />
        <div className="sm:col-span-4"><EntityPicker name="entityId" placeholder="Add a stop…" /></div>
        <input name="framing" placeholder="Why this stop?" className="field sm:col-span-6" aria-label="Framing" />
        <button type="submit" className="btn btn-red sm:col-span-2">Add stop</button>
      </form>
    </Panel>
  );
}
