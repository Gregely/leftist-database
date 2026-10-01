import { saveSourceAction } from "@/app/admin/actions";
import { SourceForm } from "@/components/admin/SourceForm";

export default function NewSource() {
  return (
    <div className="max-w-3xl">
      <h1 className="display mb-8 text-5xl">New source</h1>
      <SourceForm values={{}} action={saveSourceAction.bind(null, null)} />
    </div>
  );
}
