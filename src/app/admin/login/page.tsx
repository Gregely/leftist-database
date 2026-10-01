import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/desk/LoginForm";
import { getCurrentUser } from "@/lib/auth/session";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Sign in — Editorial desk", robots: { index: false } };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  if (await getCurrentUser()) redirect("/admin");
  const { next } = await searchParams;
  const demo = process.env.NODE_ENV !== "production" && process.env.ATLAS_DEMO_USERS !== "0";
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-between bg-ink p-8 text-paper sm:p-12">
        <p className="font-sans text-[0.8rem] font-semibold uppercase tracking-[0.2em]">
          {SITE.name[0]} <span className="text-red">/</span> {SITE.name[1]}
        </p>
        <div className="py-16">
          <p className="label text-ink-muted">The publishing room</p>
          <h1 className="display mt-4 max-w-md text-[3rem] sm:text-[4.2rem]">
            Editorial desk<span className="text-red">.</span>
          </h1>
          <p className="mt-6 max-w-sm font-serif text-lg leading-snug text-ink-muted">
            Create, connect, source, review and publish the entries of the Atlas.
          </p>
        </div>
        <p className="label text-ink-muted">Accounts are created by an administrator.</p>
      </div>
      <div className="flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-sm">
          <h2 className="label mb-6 border-b border-ink pb-2 font-sans">Sign in</h2>
          <LoginForm next={next ?? ""} />
          {demo && (
            <div className="mt-10 border-t border-rule pt-4 text-xs leading-relaxed text-muted">
              <p className="label mb-2 text-faint">Development accounts</p>
              <p>
                contributor@, reviewer@, editor@ and admin@atlas.test — password <code className="font-mono text-ink">atlas-demo-2026</code>. Created only by{" "}
                <code className="font-mono">npm run dev</code>; never in production.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
