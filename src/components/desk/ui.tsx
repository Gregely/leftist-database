import Link from "next/link";
import type { ReactNode } from "react";
import { KINDS, STATUS_LABELS, type EntityKind, type WorkflowStatus } from "@/lib/content/model";

/** Desk page container — a little denser than the public site. */
export function DeskPage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1480px] px-4 py-8 sm:px-8 sm:py-10 ${className}`}>{children}</div>;
}

export function DeskHeading({
  kicker,
  title,
  lede,
  aside,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-6 border-b border-ink pb-5">
      <div className="min-w-0">
        {kicker && <p className="label slash text-red">{kicker}</p>}
        <h1 className="display mt-2 text-[2.4rem] sm:text-[3.2rem]">{title}</h1>
        {lede && <p className="mt-2 max-w-2xl text-muted">{lede}</p>}
      </div>
      {aside && <div className="flex flex-wrap items-center gap-3">{aside}</div>}
    </header>
  );
}

const STATUS_TONE: Record<WorkflowStatus, { text: string; mark: string }> = {
  draft: { text: "text-muted", mark: "bg-faint" },
  submitted: { text: "text-ink", mark: "bg-ochre" },
  resubmitted: { text: "text-ink", mark: "bg-ochre" },
  under_review: { text: "text-ink", mark: "bg-ink" },
  revision_requested: { text: "text-red", mark: "bg-red" },
  approved: { text: "text-olive", mark: "bg-olive" },
  published: { text: "text-olive", mark: "bg-olive" },
  unpublished: { text: "text-muted", mark: "border border-faint bg-transparent" },
  archived: { text: "text-faint", mark: "border border-faint bg-transparent" },
  rejected: { text: "text-red-deep", mark: "bg-red-deep" },
};

export function StatusBadge({ status, className = "" }: { status: WorkflowStatus; className?: string }) {
  const tone = STATUS_TONE[status] ?? STATUS_TONE.draft;
  return (
    <span className={`label inline-flex items-center gap-1.5 whitespace-nowrap ${tone.text} ${className}`}>
      <span aria-hidden="true" className={`inline-block h-2 w-2 ${tone.mark}`} />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

/** Public visibility: live (with or without pending changes) or not public. */
export function LiveBadge({ live, pending }: { live: boolean; pending?: boolean }) {
  if (!live) return <span className="label text-faint">Not public</span>;
  return (
    <span className="label inline-flex items-center gap-1.5 text-olive">
      <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-olive" />
      Live{pending ? <span className="text-red"> · changes pending</span> : null}
    </span>
  );
}

export function KindLabel({ kind, className = "" }: { kind: EntityKind; className?: string }) {
  return <span className={`label text-faint ${className}`}>{KINDS[kind].label}</span>;
}

export function Notice({ tone = "info", children, title }: { tone?: "info" | "success" | "error" | "warning"; children: ReactNode; title?: string }) {
  const cls = {
    info: "border-ink bg-paper-warm",
    success: "border-olive bg-olive/10",
    error: "border-red bg-red/5 text-red-deep",
    warning: "border-ochre bg-ochre/10",
  }[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`border-l-2 px-4 py-3 text-sm ${cls}`}>
      {title && <p className="label mb-1">{title}</p>}
      {children}
    </div>
  );
}

export function Panel({ title, children, aside, id, className = "" }: { title: ReactNode; children: ReactNode; aside?: ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-h` : undefined} className={`border-t border-ink pt-4 ${className}`}>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id={id ? `${id}-h` : undefined} className="label font-sans">
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="border border-dashed border-rule px-4 py-5 text-sm italic text-muted">{children}</p>;
}

export function DeskLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`label inline-flex items-center gap-1.5 text-red hover:underline ${className}`}>
      {children}
    </Link>
  );
}

/** "3 hours ago" style dates, rendered on the server (UTC timestamps from SQLite). */
export function When({ at, className = "" }: { at: string | null | undefined; className?: string }) {
  if (!at) return null;
  const d = new Date(at.includes("T") ? at : at.replace(" ", "T") + "Z");
  const diff = (Date.now() - d.getTime()) / 1000;
  const rel =
    diff < 60
      ? "just now"
      : diff < 3600
        ? `${Math.floor(diff / 60)} min ago`
        : diff < 86400
          ? `${Math.floor(diff / 3600)} h ago`
          : diff < 86400 * 14
            ? `${Math.floor(diff / 86400)} d ago`
            : d.toISOString().slice(0, 10);
  return (
    <time dateTime={d.toISOString()} title={d.toISOString().replace("T", " ").slice(0, 16) + " UTC"} className={className}>
      {rel}
    </time>
  );
}

/** The Editor / Preview switch used on small screens, where side-by-side does not fit. */
export function ViewSwitch({ id, active, className = "", tone = "paper" }: { id: string; active: "editor" | "preview"; className?: string; tone?: "paper" | "red" }) {
  const on = tone === "red" ? "bg-paper-warm text-red" : "bg-ink text-paper";
  const off = tone === "red" ? "text-paper-warm" : "text-ink hover:bg-paper-warm";
  const border = tone === "red" ? "border-paper-warm" : "border-ink";
  return (
    <nav aria-label="Editor or preview" className={`inline-flex border ${border} ${className}`}>
      <Link href={`/admin/entries/${id}`} aria-current={active === "editor" ? "page" : undefined} className={`label px-3 py-1.5 ${active === "editor" ? on : off}`}>
        Editor
      </Link>
      <Link href={`/preview/${id}`} aria-current={active === "preview" ? "page" : undefined} className={`label px-3 py-1.5 ${active === "preview" ? on : off}`}>
        Preview
      </Link>
    </nav>
  );
}
