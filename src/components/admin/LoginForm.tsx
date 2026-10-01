"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action} className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="password" className="label mb-1 block">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus className="field" aria-invalid={!!state?.errors?.password} />
        {state?.errors?.password && <p className="mt-1 text-sm text-red">{state.errors.password}</p>}
        {state?.message && <p className="mt-1 text-sm text-red">{state.message}</p>}
      </div>
      <button type="submit" disabled={pending} className="btn btn-red w-full justify-center">
        {pending ? "Signing in…" : "Enter the desk"}
      </button>
    </form>
  );
}
