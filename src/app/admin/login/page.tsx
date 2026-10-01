import type { Metadata } from "next";
import { Container } from "@/components/editorial/primitives";
import { LoginForm } from "@/components/admin/LoginForm";
import { adminPassword } from "@/lib/admin/session";

export const metadata: Metadata = { title: "Editorial desk", robots: { index: false } };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const configured = !!adminPassword();
  const devDefault = !process.env.ADMIN_PASSWORD && configured;
  return (
    <Container className="py-20">
      <div className="mx-auto max-w-md border border-ink bg-paper-warm p-8">
        <p className="label slash text-red">Editorial desk</p>
        <h1 className="display mt-4 text-5xl">Sign in<span className="text-red">.</span></h1>
        <p className="mt-3 text-sm text-muted">Create and edit entries, relationships and sources.</p>
        {configured ? (
          <LoginForm next={next ?? ""} />
        ) : (
          <p className="mt-6 border-l-2 border-red pl-3 text-sm">
            The editorial desk is disabled. Set <code className="font-mono">ADMIN_PASSWORD</code> (and{" "}
            <code className="font-mono">ADMIN_SESSION_SECRET</code>) in the environment to enable it.
          </p>
        )}
        {devDefault && (
          <p className="mt-6 text-xs text-faint">
            Development mode: no ADMIN_PASSWORD is set, so the password is <code className="font-mono text-ink">atlas</code>.
          </p>
        )}
      </div>
    </Container>
  );
}
