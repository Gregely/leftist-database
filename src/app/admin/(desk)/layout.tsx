import type { Metadata } from "next";
import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { DeskNav } from "@/components/desk/DeskNav";
import { requireUser } from "@/lib/auth/session";
import { ROLE_LABELS } from "@/lib/content/model";
import { can } from "@/lib/editorial/permissions";
import { dashboard } from "@/lib/editorial/queries";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: "Editorial desk", template: "%s — Editorial desk" },
  robots: { index: false, follow: false },
};

export default async function DeskLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const d = await dashboard(user);
  const items = [
    { href: "/admin", label: "Desk" },
    { href: "/admin/content", label: "Content" },
    ...(can(user, "entity.startReview", { authorId: null, status: "submitted", live: false, publishedRevision: null })
      ? [{ href: "/admin/review", label: "Review queue", badge: d.queueCount }]
      : []),
    { href: "/admin/relationships", label: "Relationships" },
    { href: "/admin/sources", label: "Sources" },
    { href: "/admin/media", label: "Media" },
    ...(can(user, "users.manage") ? [{ href: "/admin/users", label: "People" }] : []),
    ...(can(user, "audit.view") ? [{ href: "/admin/audit", label: "Audit log" }] : []),
  ];
  return (
    <div className="min-h-screen">
      <a href="#desk-main" className="label sr-only z-50 bg-red px-3 py-2 text-paper focus:not-sr-only focus:absolute focus:left-4 focus:top-2">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-ink bg-ink text-paper">
        <div className="mx-auto flex max-w-[1480px] flex-wrap items-center gap-x-8 gap-y-0 px-4 sm:px-8">
          <Link href="/admin" className="flex items-baseline gap-3 py-3">
            <span className="font-sans text-[0.78rem] font-semibold uppercase tracking-[0.2em]">
              {SITE.name[0]} <span className="text-red">/</span> {SITE.name[1]}
            </span>
            <span className="serif-italic text-[0.95rem] text-ink-muted">Editorial desk</span>
          </Link>
          <div className="order-3 w-full lg:order-2 lg:w-auto">
            <DeskNav items={items} />
          </div>
          <div className="order-2 ml-auto flex items-center gap-4 lg:order-3">
            <Link href="/admin/new" className="label border border-red bg-red px-2.5 py-1.5 text-paper-warm hover:bg-red-deep">
              + New entry
            </Link>
            <Link href="/admin/account" className="hidden text-right sm:block" title="Your account">
              <span className="block text-[0.8rem] leading-tight text-paper">{user.name}</span>
              <span className="label block text-[0.6rem] text-ink-muted">{ROLE_LABELS[user.role]}</span>
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="label text-ink-muted hover:text-paper">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main id="desk-main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <footer className="mt-16 border-t border-rule">
        <div className="mx-auto flex max-w-[1480px] flex-wrap justify-between gap-3 px-4 py-6 sm:px-8">
          <p className="label text-faint">The public site is the library · the desk is the publishing room · the database is the archive</p>
          <Link href="/" className="label text-muted hover:text-red">
            View the public site ↗
          </Link>
        </div>
      </footer>
    </div>
  );
}
