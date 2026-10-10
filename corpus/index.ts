import type { Corpus } from "../src/lib/corpus/types";
import { geography } from "./geography";
import { guidedMarxToLenin } from "./guided-marx-to-lenin";
import { guidedUnderstandingMarx } from "./guided-understanding-marx";
import { initialMarx } from "./initial-marx";
import { marxToLenin } from "./marx-to-lenin";

/** Research corpora that can be imported with `npm run corpus`. */
export const CORPORA: Record<string, Corpus> = {
  "initial-marx": initialMarx,
  "guided-understanding-marx": guidedUnderstandingMarx,
  "marx-to-lenin": marxToLenin,
  "guided-marx-to-lenin": guidedMarxToLenin,
  geography,
};
