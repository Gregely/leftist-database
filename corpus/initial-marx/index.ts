import type { Corpus } from "../../src/lib/corpus/types";
import { batch1 } from "./b1-foundations";
import { batch2 } from "./b2-development";
import { batch3 } from "./b3-history";

/**
 * INITIAL MARX CORPUS — "Introduction to Marx".
 *
 * A bounded first body of researched content: the traditions Marx inherited,
 * his development, his major works, and the disputes among Marxists up to the
 * revolutionary rupture of 1917–19. Imported as unpublished work for review;
 * see docs/corpus/initial-marx-review.md.
 */
export const initialMarx: Corpus = {
  collection: "Initial Marx Corpus",
  dir: "corpus/initial-marx",
  planned: [
    // Thinkers
    "thinker:hegel", "thinker:feuerbach", "thinker:adam-smith", "thinker:ricardo", "thinker:saint-simon", "thinker:fourier", "thinker:owen", "thinker:proudhon",
    "thinker:marx", "thinker:engels", "thinker:kautsky", "thinker:plekhanov", "thinker:bernstein", "thinker:luxemburg", "thinker:lenin",
    // Tendencies
    "tendency:german-idealism", "tendency:young-hegelians", "tendency:classical-political-economy", "tendency:early-socialism", "tendency:marxism", "tendency:social-democracy", "tendency:leninism",
    // Concepts
    "concept:idealism", "concept:materialism", "concept:dialectics", "concept:alienation", "concept:praxis", "concept:historical-materialism", "concept:productive-forces",
    "concept:relations-of-production", "concept:mode-of-production", "concept:class", "concept:class-struggle", "concept:bourgeoisie", "concept:proletariat", "concept:commodity",
    "concept:use-value", "concept:exchange-value", "concept:labour", "concept:labour-power", "concept:value", "concept:surplus-value", "concept:exploitation", "concept:capital",
    "concept:accumulation", "concept:commodity-fetishism", "concept:ideology", "concept:the-state", "concept:revolution", "concept:communism", "concept:dictatorship-of-the-proletariat",
    "concept:class-consciousness", "concept:revisionism", "concept:reformism", "concept:spontaneity", "concept:vanguard-party", "concept:imperialism",
    // Texts
    "text:essence-of-christianity", "text:critique-of-hegels-philosophy-of-right", "text:economic-philosophic-manuscripts", "text:theses-on-feuerbach", "text:the-german-ideology",
    "text:communist-manifesto", "text:eighteenth-brumaire", "text:contribution-critique-political-economy", "text:grundrisse", "text:capital-volume-one", "text:civil-war-in-france",
    "text:critique-of-the-gotha-programme", "text:socialism-utopian-and-scientific", "text:preconditions-of-socialism", "text:social-reform-or-revolution", "text:what-is-to-be-done",
    "text:the-mass-strike", "text:imperialism-highest-stage", "text:the-state-and-revolution",
    // Events
    "event:french-revolution", "event:rheinische-zeitung-ban", "event:communist-league", "event:revolutions-of-1848", "event:coup-of-1851", "event:crisis-of-1857",
    "event:first-international", "event:paris-commune", "event:hague-congress", "event:gotha-unity-congress", "event:anti-socialist-laws", "event:emancipation-of-labour-group",
    "event:second-international", "event:erfurt-programme", "event:revisionism-controversy", "event:bolshevik-menshevik-split", "event:revolution-1905", "event:basel-congress",
    "event:war-credits-1914", "event:zimmerwald-conference", "event:february-revolution", "event:october-revolution", "event:spartacist-uprising",
    // Debates
    "debate:what-is-historical-materialism", "debate:reform-or-revolution", "debate:class-consciousness", "debate:spontaneity-and-organisation", "debate:what-is-the-state",
    "debate:revolution-in-russia", "debate:socialists-and-the-war",
    // Path
    "path:first-steps-into-marxism",
  ],
  batches: [batch1, batch2, batch3],
};
