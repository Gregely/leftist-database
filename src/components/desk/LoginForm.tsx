"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="label mb-1 block">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required autoFocus className="field" />
      </div>
      <div>
        <label htmlFor="password" className="label mb-1 block">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      {state && !state.ok && (
        <p role="alert" className="border-l-2 border-red pl-3 text-sm text-red-deep">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-red w-full justify-center disabled:opacity-60">
        {pending ? "Signing in…" : "Enter the desk"}
      </button>
    </form>
  );
}
