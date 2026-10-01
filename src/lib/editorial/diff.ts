/**
 * Word-level diff for comparing revisions. Small and dependency-free; long
 * texts fall back to paragraph granularity to keep the comparison fast.
 */
export type DiffPart = { op: "eq" | "ins" | "del"; text: string };

function lcsDiff(a: string[], b: string[]): DiffPart[] {
  const n = a.length;
  const m = b.length;
  const dp: Uint32Array[] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: DiffPart[] = [];
  const push = (op: DiffPart["op"], text: string) => {
    const last = out[out.length - 1];
    if (last && last.op === op) last.text += text;
    else out.push({ op, text });
  };
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      push("eq", a[i]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) push("del", a[i++]);
    else push("ins", b[j++]);
  }
  while (i < n) push("del", a[i++]);
  while (j < m) push("ins", b[j++]);
  return out;
}

export function diffText(before: string, after: string): DiffPart[] {
  if (before === after) return before ? [{ op: "eq", text: before }] : [];
  const words = (s: string) => s.split(/(\s+)/).filter((x) => x.length);
  const a = words(before);
  const b = words(after);
  if (a.length * b.length > 4_000_000) {
    const paras = (s: string) => s.split(/(\n\n)/);
    return lcsDiff(paras(before), paras(after));
  }
  return lcsDiff(a, b);
}

export function stringify(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}
