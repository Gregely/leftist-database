import type { Metadata } from "next";
import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin/guard";
import { ENTITY_KINDS, KINDS } from "@/lib/content/model";

export const metadata: Metadata = { title: { default: "Editorial desk", template: "%s — Editorial desk" }, robots: { index: false } };

export default async function DeskLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div>
      <div className="border-b border-ink bg-ink text-paper">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5 sm:px-8">
          <Link href="/admin" className="label text-paper">
            <span className="text-red">✎</span> Editorial desk
          </Link>
          <nav aria-label="Editorial sections" className="flex flex-wrap gap-x-4 gap-y-1">
            {ENTITY_KINDS.map((k) => (
              <Link key={k} href={`/admin/${k}`} className="label text-ink-muted hover:text-paper">
                {KINDS[k].plural}
              </Link>
            ))}
            <span className="text-white/25">|</span>
            <Link href="/admin/relationships" className="label text-ink-muted hover:text-paper">
              Relationships
            </Link>
            <Link href="/admin/sources" className="label text-ink-muted hover:text-paper">
              Sources
            </Link>
          </nav>
          <form action={logoutAction} className="ml-auto">
            <button type="submit" className="label text-ink-muted hover:text-paper">
              Sign out
            </button>
          </form>
        </div>
      </div>
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8">{children}</div>
    </div>
  );
}
