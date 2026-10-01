import { PERIODS } from "./site";

/** Periods overlapping a span of years. */
export function periodsFor(from: number | null, to: number | null) {
  if (from == null) return [];
  const end = to ?? new Date().getFullYear();
  return PERIODS.filter((p) => p.from <= end && p.to >= from);
}

/** For a thinker, the periods of their active (adult) life. */
export function activePeriods(born: number | null, died: number | null) {
  if (born == null) return [];
  return periodsFor(born + 20, died);
}
