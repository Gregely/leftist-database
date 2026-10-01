import Link from "next/link";

/** Simple numbered pagination that preserves other query parameters. */
export function Pager({
  page,
  total,
  perPage,
  base,
  params = {},
}: {
  page: number;
  total: number;
  perPage: number;
  base: string;
  params?: Record<string, string | undefined>;
}) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  const href = (p: number) => {
    const q = new URLSearchParams(Object.entries({ ...params, page: p > 1 ? String(p) : undefined }).filter(([, v]) => v) as [string, string][]);
    const s = q.toString();
    return s ? `${base}?${s}` : base;
  };
  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center gap-1 border-t border-ink pt-4">
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === page ? "page" : undefined}
          className={`label-mono border px-2.5 py-1 ${p === page ? "border-ink bg-ink text-paper" : "border-rule hover:border-ink"}`}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}

export function pageParam(v: string | undefined) {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : 1;
}
