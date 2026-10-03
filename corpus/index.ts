import type { Corpus } from "../src/lib/corpus/types";
import { guidedUnderstandingMarx } from "./guided-understanding-marx";
import { initialMarx } from "./initial-marx";

/** Research corpora that can be imported with `npm run corpus`. */
export const CORPORA: Record<string, Corpus> = {
  "initial-marx": initialMarx,
  "guided-understanding-marx": guidedUnderstandingMarx,
};
