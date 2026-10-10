/**
 * Label placement for the Theory Map, in screen space.
 *
 * Candidates arrive in priority order; each is tried to the right, left,
 * below and above its mark and accepted in the first position that does not
 * collide with a label already placed, a prominent mark, or the edges of the
 * view. Whatever does not fit is simply not labelled at this zoom: zooming in
 * spreads the marks apart and the same pass then finds room for more.
 */

export interface LabelCandidate {
  id: string;
  /** Mark centre, screen px. */
  x: number;
  y: number;
  /** Mark radius, screen px. */
  r: number;
  width: number;
  height: number;
  /** Labels that must not be dropped (the selection, the hovered mark): placed even if crowded. */
  force?: boolean;
  /** Only to the side positions (edge-relationship labels sit centred on their point). */
  centred?: boolean;
  /** May lie over other marks (never over other labels): for the few most important names. */
  overMarks?: boolean;
}

export type Side = "right" | "left" | "below" | "above" | "centre";

export interface Placement {
  side: Side;
  /** Box in screen px. */
  box: [number, number, number, number];
}

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

const CELL = 48;

class Grid {
  private cells = new Map<string, Box[]>();
  private keys(b: Box) {
    const out: string[] = [];
    for (let i = Math.floor(b.x0 / CELL); i <= Math.floor(b.x1 / CELL); i++) for (let j = Math.floor(b.y0 / CELL); j <= Math.floor(b.y1 / CELL); j++) out.push(`${i},${j}`);
    return out;
  }
  add(b: Box) {
    for (const k of this.keys(b)) {
      const list = this.cells.get(k);
      if (list) list.push(b);
      else this.cells.set(k, [b]);
    }
  }
  hits(b: Box) {
    for (const k of this.keys(b)) for (const o of this.cells.get(k) ?? []) if (b.x0 < o.x1 && b.x1 > o.x0 && b.y0 < o.y1 && b.y1 > o.y0) return true;
    return false;
  }
}

function boxFor(c: LabelCandidate, side: Side): Box {
  const gap = 5;
  const { x, y, r, width: w, height: h } = c;
  switch (side) {
    case "right":
      return { x0: x + r + gap, y0: y - h / 2, x1: x + r + gap + w, y1: y + h / 2 };
    case "left":
      return { x0: x - r - gap - w, y0: y - h / 2, x1: x - r - gap, y1: y + h / 2 };
    case "below":
      return { x0: x - w / 2, y0: y + r + 3, x1: x + w / 2, y1: y + r + 3 + h };
    case "above":
      return { x0: x - w / 2, y0: y - r - 3 - h, x1: x + w / 2, y1: y - r - 3 };
    default:
      return { x0: x - w / 2, y0: y - h / 2, x1: x + w / 2, y1: y + h / 2 };
  }
}

/**
 * Place labels. `obstacles` are marks (x, y, r) that labels should not cover;
 * `bounds` is the visible area (labels outside it are not placed).
 */
export function placeLabels(
  candidates: LabelCandidate[],
  obstacles: { x: number; y: number; r: number }[],
  bounds: { width: number; height: number; top?: number; bottom?: number; right?: number },
  limit = Infinity,
  /** Areas no label may enter (controls drawn over the map). */
  blocked: [number, number, number, number][] = [],
): Map<string, Placement> {
  const grid = new Grid();
  for (const [x0, y0, x1, y1] of blocked) grid.add({ x0, y0, x1, y1 });
  const marks = new Grid();
  for (const o of obstacles) marks.add({ x0: o.x - o.r - 1, y0: o.y - o.r - 1, x1: o.x + o.r + 1, y1: o.y + o.r + 1 });
  const out = new Map<string, Placement>();
  const top = bounds.top ?? 0;
  const bottom = bounds.height - (bounds.bottom ?? 0);
  const right = bounds.width - (bounds.right ?? 0);
  let placed = 0;
  for (const c of candidates) {
    if (placed >= limit && !c.force) continue;
    if (c.x < -40 || c.x > right + 40 || c.y < top - 20 || c.y > bottom + 20) continue;
    const sides: Side[] = c.centred ? ["centre"] : c.x > right - c.width - 30 ? ["left", "below", "above", "right"] : ["right", "left", "below", "above"];
    let chosen: { side: Side; b: Box } | null = null;
    for (const side of sides) {
      const b = boxFor(c, side);
      if (b.x0 < 2 || b.x1 > right - 2 || b.y0 < top + 2 || b.y1 > bottom - 2) continue;
      // Pad by two pixels so neighbouring names never touch.
      const padded = { x0: b.x0 - 2, y0: b.y0 - 1, x1: b.x1 + 2, y1: b.y1 + 1 };
      if (grid.hits(padded)) continue;
      // A label may sit over a faint mark, but not over its own or another labelled mark's centre.
      if (!c.overMarks && marks.hits({ x0: b.x0 + 1, y0: b.y0 + 2, x1: b.x1 - 1, y1: b.y1 - 2 })) continue;
      chosen = { side, b };
      break;
    }
    if (!chosen && c.force) chosen = { side: sides[0], b: boxFor(c, sides[0]) };
    if (!chosen) continue;
    grid.add(chosen.b);
    out.set(c.id, { side: chosen.side, box: [chosen.b.x0, chosen.b.y0, chosen.b.x1, chosen.b.y1] });
    placed++;
  }
  return out;
}

/** Text width in px, measured with the page's serif face (cached). */
const cache = new Map<string, number>();
let ctx: CanvasRenderingContext2D | null = null;
export function measure(text: string, size: number, family: string, weight = 400): number {
  const key = `${weight}|${size}|${text}`;
  const hit = cache.get(key);
  if (hit != null) return hit;
  if (!ctx && typeof document !== "undefined") ctx = document.createElement("canvas").getContext("2d");
  let w = text.length * size * 0.5;
  if (ctx) {
    ctx.font = `${weight} ${size}px ${family}`;
    w = ctx.measureText(text).width;
  }
  cache.set(key, w);
  return w;
}
