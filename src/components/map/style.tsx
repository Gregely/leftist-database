import { KINDS, type EntityKind, type RelationshipFamily } from "@/lib/content/model";

/** Plate colours: the tokens of globals.css as literal values, for SVG attributes and canvas measuring. */
export const C = {
  ink: "#16161A",
  red: "#BC2B1C",
  paper: "#F2EEE5",
  sheet: "#FAF8F2",
  rule: "#C9C1B2",
  ruleSoft: "#E0D9CB",
  faint: "#69635A",
  muted: "#56514A",
  blue: "#2C4A6E",
  olive: "#4A6146",
  umber: "#8A5A1E",
  redDeep: "#8C2014",
};

/** The bookcloth colour of each area of the collection (as in lib/site.ts). */
export const KIND_COLOR: Record<EntityKind, string> = {
  thinker: C.ink,
  concept: C.red,
  text: C.blue,
  tendency: C.olive,
  event: C.umber,
  debate: C.redDeep,
  path: C.faint,
};

export const MAP_KINDS: EntityKind[] = ["thinker", "concept", "text", "tendency", "event", "debate"];

export const FAMILY: Record<RelationshipFamily, { label: string; stroke: string; dash?: string }> = {
  influence: { label: "Influence", stroke: C.ink },
  critique: { label: "Critique", stroke: C.red, dash: "5 4" },
  response: { label: "Response", stroke: C.muted, dash: "1.5 3.5" },
  affinity: { label: "Affinity", stroke: C.olive },
  structure: { label: "Authorship & membership", stroke: C.faint, dash: "2 3" },
};

export const FAMILIES = Object.keys(FAMILY) as RelationshipFamily[];

export const kindLabel = (k: EntityKind, n = 1) => (n === 1 ? KINDS[k].label : KINDS[k].plural);

/** The shape for each kind, centred on 0,0 with radius r. */
export function Glyph({ kind, r, fill, stroke, strokeWidth = 1.4 }: { kind: EntityKind; r: number; fill?: string; stroke?: string; strokeWidth?: number }) {
  const color = KIND_COLOR[kind];
  const f = fill ?? color;
  const s = stroke ?? color;
  switch (kind) {
    case "concept":
      return <rect x={-r * 0.82} y={-r * 0.82} width={r * 1.64} height={r * 1.64} transform="rotate(45)" fill={f} stroke={s} strokeWidth={strokeWidth} />;
    case "text":
      return <rect x={-r * 0.72} y={-r * 0.95} width={r * 1.44} height={r * 1.9} fill={f} stroke={s} strokeWidth={strokeWidth} />;
    case "tendency":
      return <rect x={-r} y={-r} width={r * 2} height={r * 2} fill={f} stroke={s} strokeWidth={strokeWidth} />;
    case "event":
      return <path d={`M0,${-r * 1.1} L${r * 1.05},${r * 0.8} L${-r * 1.05},${r * 0.8} Z`} fill={f} stroke={s} strokeWidth={strokeWidth} strokeLinejoin="round" />;
    case "debate":
      return (
        <>
          <circle r={r} fill={f} stroke={s} strokeWidth={strokeWidth} />
          <line x1={-r * 0.7} y1={r * 0.7} x2={r * 0.7} y2={-r * 0.7} stroke={C.sheet} strokeWidth={1.2} />
        </>
      );
    default:
      return <circle r={r} fill={f} stroke={s} strokeWidth={strokeWidth} />;
  }
}

/** A small key swatch for a kind. */
export function KindSwatch({ kind, size = 12 }: { kind: EntityKind; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-7 -7 14 14" aria-hidden="true" className="shrink-0">
      <Glyph kind={kind} r={4.6} />
    </svg>
  );
}

export function FamilySwatch({ family }: { family: RelationshipFamily }) {
  return (
    <svg width="24" height="8" aria-hidden="true" className="shrink-0">
      <line x1="0" y1="4" x2="24" y2="4" stroke={FAMILY[family].stroke} strokeDasharray={FAMILY[family].dash} strokeWidth="1.5" />
    </svg>
  );
}
