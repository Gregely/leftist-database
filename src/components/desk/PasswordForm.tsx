"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/app/admin/actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, null);
  return (
    <form action={action} className="grid max-w-md gap-4">
      {[
        ["current", "Current password", "current-password"],
        ["next", "New password (10+ characters)", "new-password"],
        ["confirm", "Confirm new password", "new-password"],
      ].map(([name, label, ac]) => (
        <label key={name}>
          <span className="label mb-1 block">{label}</span>
          <input name={name} type="password" required autoComplete={ac} className="field" />
          {state && !state.ok && state.fields?.[name] && <span className="mt-1 block text-sm text-red-deep">{state.fields[name]}</span>}
        </label>
      ))}
      {state && (
        <p role={state.ok ? "status" : "alert"} className={`text-sm ${state.ok ? "text-olive" : "text-red-deep"}`}>
          {state.ok ? state.message : state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-red w-fit">
        Change password
      </button>
    </form>
  );
}
