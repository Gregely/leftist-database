import type { Corpus } from "../../src/lib/corpus/types";
import { batchM1 } from "./m1-international";
import { batchM2 } from "./m2-women";
import { batchM3 } from "./m3-russia";
import { batchM4 } from "./m4-nations-empire";
import { batchM5 } from "./m5-war-1917";

/**
 * MARX TO LENIN CORPUS — socialist theory from Marx's death to October 1917.
 *
 * Follows the Initial Marx Corpus and fills the gaps around it: the
 * International after Engels and its rivals, the woman question, Russian
 * Marxism, nations and empire, and the arguments of 1914–17. Entries of the
 * Initial Marx Corpus are linked, not rewritten; two sample entries in the
 * period are rewritten. Imported as unpublished work for review; see
 * docs/corpus/marx-to-lenin-research.md and docs/corpus/marx-to-lenin-review.md.
 */
export const marxToLenin: Corpus = {
  collection: "Marx to Lenin Corpus",
  dir: "corpus/marx-to-lenin",
  requires: ["initial-marx"],
  planned: [
    // m1 — The International after Engels
    "text:introduction-class-struggles-in-france", "text:the-class-struggle", "thinker:labriola", "text:essays-on-the-materialist-conception-of-history",
    "thinker:bebel", "thinker:guesde", "thinker:jaures", "concept:ministerialism", "event:millerand-case", "event:amsterdam-congress", "tendency:fabianism",
    "text:fabian-essays", "thinker:william-morris", "text:news-from-nowhere", "tendency:revolutionary-syndicalism", "thinker:sorel", "text:reflections-on-violence",
    "concept:general-strike", "event:charter-of-amiens", "event:iww-founding", "debate:the-general-strike",
    // m2 — The woman question
    "concept:the-woman-question", "tendency:socialist-womens-movement", "text:woman-and-socialism", "thinker:zetkin", "text:only-with-the-proletarian-woman",
    "thinker:kollontai", "text:social-basis-of-the-woman-question", "event:copenhagen-womens-conference", "text:origin-of-the-family", "debate:women-and-socialism",
    // m3 — Russian Marxism
    "tendency:russian-populism", "text:development-of-capitalism-in-russia", "concept:economism", "thinker:martov", "tendency:menshevism", "tendency:bolshevism",
    "thinker:trotsky", "text:results-and-prospects", "concept:permanent-revolution", "concept:soviets",
    // m4 — Nations and empire
    "concept:national-self-determination", "concept:national-cultural-autonomy", "tendency:austro-marxism", "thinker:otto-bauer", "text:question-of-nationalities",
    "tendency:jewish-labour-bund", "text:national-question-and-autonomy", "text:right-of-nations-to-self-determination", "thinker:connolly",
    "text:labour-in-irish-history", "event:easter-rising", "thinker:hobson", "text:imperialism-a-study", "thinker:hilferding", "text:finance-capital",
    "concept:finance-capital", "concept:ultra-imperialism", "thinker:bukharin", "text:imperialism-and-world-economy", "concept:labour-aristocracy",
    "event:stuttgart-congress", "debate:the-national-question", "debate:what-drives-imperialism", "text:accumulation-of-capital",
    // m5 — War and revolution
    "event:assassination-of-jaures", "concept:revolutionary-defeatism", "text:junius-pamphlet", "concept:dual-power", "text:april-theses",
  ],
  batches: [batchM1, batchM2, batchM3, batchM4, batchM5],
};
