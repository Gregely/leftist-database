import type { Corpus, CorpusPath } from "../../src/lib/corpus/types";

/**
 * The first Guided journey: a beginner's route through the Initial Marx
 * Corpus. It creates one learning path, offered as Guided, whose stops point
 * at existing entries — nothing from those entries is copied. Each stop adds
 * only a few lines of orientation ("Where you are", "Why it matters",
 * "Continue") and may feature one of the entry's existing excerpts.
 *
 * Imported through the editorial library like any corpus, then edited in the
 * desk (Route tab). It is never published by the import.
 */
const step = (s: CorpusPath["steps"][number]) => s;

export const guidedUnderstandingMarx: Corpus = {
  collection: "Guided journeys",
  dir: "corpus/guided-understanding-marx",
  // Every stop is an Initial Marx Corpus entry, and the sources are reused from it.
  requires: ["initial-marx"],
  batches: [
    {
      id: "g1",
      title: "Guided journey: Understanding Marx",
      sources: [
        { id: "src_sep_marx", reuse: true, title: "Karl Marx", sourceType: "REFERENCE" },
        { id: "src_mclellan_marx", reuse: true, title: "Karl Marx: His Life and Thought", sourceType: "ACADEMIC" },
      ],
      entities: [
        {
          key: "path:understanding-marx",
          title: "Understanding Marx",
          fields: {
            entryLine: "I don't know where to start.",
            level: "introductory",
            estimatedTime: "About 3 hours at the shortest reading; longer if you go deeper",
            summary: "A guided introduction to Marx's ideas, the problems he was trying to understand, and the tradition that developed around them.",
            guided: true,
            overview: `- **Who Marx was**, and the philosophy, economics and socialism he inherited.
- **His theory of history:** materialism, historical materialism, class and class struggle.
- **His critique of capitalism:** commodities, value, labour-power, surplus value and capital.
- **Politics:** ideology, the state and communism.
- **After Marx:** how Marxism developed and divided up to Lenin and 1917, which is where the Atlas currently ends.

Each step starts with a short explanation. You can go deeper, read a primary source, or leave for the full entry whenever you like.`,
            prerequisites: `None. Start at step 1, or jump to whatever interests you. Where scholars disagree, the entries say so. You do not have to agree with Marx to follow the journey.`,
          },
          citations: [
            { source: "src_sep_marx", note: "General introduction recommended as companion reading for the journey." },
            { source: "src_mclellan_marx", note: "Biography recommended as companion reading for the journey." },
          ],
        },
      ],
      paths: [
        {
          path: "path:understanding-marx",
          steps: [
            step({
              entity: "thinker:marx",
              framing: "Start with the person: who Marx was and what he was trying to understand.",
              orientation:
                "You are at the very beginning. Before any theory, it helps to know who Karl Marx was: a German philosopher turned journalist and economist, living mostly in exile, who spent his life trying to understand the new industrial capitalism around him, and how it might be changed.",
              whyItMatters:
                "Almost every idea in this journey was developed by Marx, often together with [[thinker:engels|Friedrich Engels]], in response to particular problems and events. Knowing his life makes the ideas easier to place.",
              nextReason: "Marx did not start from nothing. The next step looks at the philosopher he learned from and argued against.",
              branches: [{ entity: "thinker:engels", framing: "Marx's collaborator, and a thinker in his own right." }],
            }),
            step({
              entity: "thinker:hegel",
              framing: "The philosopher whose ideas Marx absorbed and then turned against.",
              orientation:
                "Marx grew up intellectually in a Germany dominated by the philosophy of G. W. F. Hegel, who saw history as the development of reason and freedom. Marx's earliest work is an argument with Hegel and with Hegel's radical young followers.",
              whyItMatters:
                "Several of Marx's key ideas, such as history as a process and contradiction as a source of change, are reworkings of Hegel's. Without Hegel, much of Marx's vocabulary is hard to follow.",
              nextReason:
                "Marx also drew on British political economy and French socialism (see the side routes). But his first decisive break was philosophical: what drives history: ideas, or material life?",
              excerpt: "The owl of Minerva",
              branches: [
                { entity: "thinker:feuerbach", framing: "The materialist critic of religion who showed the young Marx a way out of Hegel." },
                { entity: "tendency:young-hegelians", framing: "The radical circle Marx belonged to in his twenties." },
                { entity: "tendency:classical-political-economy", framing: "The economists Marx read most closely: Smith and Ricardo." },
                { entity: "tendency:early-socialism", framing: "The socialists Marx later called “utopian”." },
              ],
            }),
            step({
              entity: "concept:materialism",
              framing: "Ideas or material life: which comes first?",
              orientation:
                "The question here is philosophical: do ideas shape the world, or does the way people live and work shape their ideas? Marx's answer is usually called materialism. It has nothing to do with the everyday sense of caring about possessions.",
              whyItMatters:
                "Marx's materialism is the starting point of his theory of history: to understand a society, start from how people produce what they need to live.",
              nextReason:
                "If people's material activity matters so much, what happens to them when that activity is organised in a way they do not control? That is the young Marx's idea of alienation.",
              branches: [
                { entity: "concept:idealism", framing: "The view Marx defined himself against." },
                { entity: "concept:dialectics", framing: "Hegel's way of thinking through contradiction, and what Marx kept of it." },
                { entity: "text:theses-on-feuerbach", framing: "Eleven short theses, ending with Marx's most quoted sentence." },
              ],
            }),
            step({
              entity: "concept:alienation",
              framing: "The young Marx on what capitalism does to people.",
              orientation:
                "In 1844, in his mid-twenties, Marx filled notebooks arguing that under capitalism workers are estranged from what they make, from their own activity, from each other and from their human potential. The notebooks were not published until the 1930s.",
              whyItMatters:
                "Alienation shows the human and moral concern beneath Marx's later economics. Readers still disagree about how far the older Marx kept the idea; the entry sets out both views.",
              nextReason: "Marx soon moved from the individual worker to history as a whole: how societies are organised, and why they change.",
              excerpt: "The worker becomes all the poorer",
              branches: [
                { entity: "text:economic-philosophic-manuscripts", framing: "The 1844 notebooks themselves." },
                { entity: "concept:praxis", framing: "Human activity that changes the world — and the people doing it." },
              ],
            }),
            step({
              entity: "concept:historical-materialism",
              framing: "Marx's way of reading history as a whole.",
              orientation:
                "Historical materialism is the claim that the way a society produces its means of life (its tools and skills, and its relations of ownership and work) shapes its politics, law and ideas, and that conflicts in production drive historical change.",
              whyItMatters:
                "Most of Marx's specific arguments, about class, the state, ideology and revolution, sit inside this framework. It is also one of the most debated parts of his thought; the entry shows how strongly, or how loosely, it can be read.",
              nextReason: "On this view, history is made by groups with opposed positions in production. Marx's name for those groups is classes.",
              excerpt: "It is not the consciousness of men",
              branches: [
                { entity: "concept:productive-forces", framing: "What a society can produce: tools, skills, knowledge." },
                { entity: "concept:relations-of-production", framing: "Who owns, who works, who decides." },
                { entity: "concept:mode-of-production", framing: "How forces and relations combine into a whole way of producing." },
                { entity: "text:contribution-critique-political-economy", framing: "The 1859 Preface: the classic short statement." },
                { entity: "debate:what-is-historical-materialism", framing: "How Marxists have disagreed about what the theory claims." },
              ],
            }),
            step({
              entity: "concept:class",
              framing: "Classes defined by their place in production.",
              orientation:
                "For Marx a class is not mainly a matter of income, education or lifestyle, but of position in production: who owns the means of production, and who has to work for those who do.",
              whyItMatters: "Class is the hinge between Marx's theory of history and his analysis of capitalism, whose two main classes he called the bourgeoisie and the proletariat.",
              nextReason: "Classes with opposed interests come into conflict. The next step is Marx's best-known claim about that conflict.",
              excerpt: "And now as to myself",
              branches: [
                { entity: "concept:bourgeoisie", framing: "The class that owns." },
                { entity: "concept:proletariat", framing: "The class that must sell its capacity to work in order to live." },
              ],
            }),
            step({
              entity: "concept:class-struggle",
              framing: "Conflict between classes as a driver of change.",
              orientation:
                "Marx held that conflict between classes, sometimes open and often hidden, is central to how societies change. Marx and Engels put it at the very start of the first section of the Communist Manifesto.",
              whyItMatters:
                "Class struggle connects Marx's account of history to politics: it is why he expected workers to organise, and why he saw politics as more than a contest of ideas.",
              nextReason: "Marx's most famous portrait of class struggle in his own time is the short pamphlet he wrote with Engels in 1848.",
              branches: [{ entity: "event:revolutions-of-1848", framing: "The revolutions that broke out as the Manifesto appeared." }],
            }),
            step({
              entity: "text:communist-manifesto",
              framing: "Capitalism transforming the world, and the class it creates.",
              orientation:
                "The Communist Manifesto (1848) is the text most people read first. In a few pages it describes how capitalism has revolutionised production and spread across the globe, and argues that it has created the class that could replace it: the industrial working class.",
              whyItMatters:
                "The Manifesto gives you the shape of Marx's view of capitalism before the detailed economics. Marx and Engels themselves later said parts of it had dated; the entry explains which.",
              nextReason:
                "To show how capitalism actually works, Marx spent decades on economics. His analysis begins with something very ordinary: the commodity.",
              branches: [{ entity: "event:communist-league", framing: "The small organisation that commissioned the Manifesto." }],
            }),
            step({
              entity: "concept:commodity",
              framing: "Why Capital begins with things bought and sold.",
              orientation:
                "This is where the economics begins. In capitalist societies, Marx observes, wealth takes the form of commodities: goods produced in order to be sold. So he starts by asking what a commodity is.",
              whyItMatters:
                "Marx builds his whole economics, including value, money, capital and exploitation, step by step from the commodity. The next few steps follow that construction.",
              nextReason: "Commodities exchange in definite proportions. What makes them comparable at all? Marx's answer is his theory of value.",
              branches: [
                { entity: "concept:use-value", framing: "A thing's usefulness." },
                { entity: "concept:exchange-value", framing: "What it exchanges for." },
                { entity: "concept:labour", framing: "Concrete and abstract labour — needed for the theory of value." },
              ],
            }),
            step({
              entity: "concept:value",
              framing: "What makes commodities exchangeable.",
              orientation:
                "Marx took from Smith and Ricardo the idea that labour is the source of value, and transformed it. For him value is a social relation: the labour time a society needs to produce something, expressed through the prices of things.",
              whyItMatters: "The theory of value is the foundation of Marx's account of profit. It is also among the most criticised parts of his work; the entry sets out the objections.",
              nextReason:
                "If commodities exchange at their values, where does profit come from? Marx's answer turns on one special commodity that workers sell: their capacity to work.",
              branches: [
                { entity: "concept:commodity-fetishism", framing: "Why relations between people appear as relations between things." },
                { entity: "thinker:ricardo", framing: "The economist whose labour theory of value Marx reworked." },
              ],
            }),
            step({
              entity: "concept:labour-power",
              framing: "What workers actually sell.",
              orientation:
                "Marx distinguished labour, the work itself, from labour-power, the capacity to work, which workers sell to employers for a wage. Engels later called this one of the most important points in political economy.",
              whyItMatters:
                "With labour-power in place, profit can be explained without anyone cheating: the worker is paid the value of their labour-power, yet can produce more value than that.",
              nextReason: "That difference is surplus value, the central idea of Capital.",
              excerpt: "For the conversion of his money",
            }),
            step({
              entity: "concept:surplus-value",
              framing: "Where profit comes from, on Marx's account.",
              orientation:
                "Surplus value is the value workers produce beyond what they are paid. Marx argued that it is the source of profit, interest and rent, and that its extraction, even when wages are fair by market standards, is exploitation.",
              whyItMatters:
                "Surplus value ties the economics back to class: for Marx it explains why capitalists and workers have opposed interests. Critics dispute both the theory of value it rests on and the word “exploitation”; the entries give the arguments.",
              nextReason: "Capitalists do not simply consume surplus value; they reinvest it. That turns money into capital: value that grows.",
              excerpt: "The discovery of surplus value",
              branches: [{ entity: "concept:exploitation", framing: "Why Marx called the wage relation exploitative." }],
            }),
            step({
              entity: "concept:capital",
              framing: "Value that expands itself, and the system built on it.",
              orientation:
                "For Marx capital is not just money or machinery but a social relation: value that grows by employing labour-power and producing surplus value, which is then reinvested. Competition forces capitalists to keep accumulating.",
              whyItMatters: "Here Marx pictures capitalism as a dynamic system that keeps expanding, transforms technology and is prone to crisis. It is the subject of his major work, Capital.",
              nextReason: "Why do people come to accept such a system as natural? Part of Marx's answer concerns ideas themselves: ideology.",
              excerpt: "Capital is dead labour",
              branches: [
                { entity: "concept:accumulation", framing: "Growth, crisis and the origins of capitalism." },
                { entity: "text:capital-volume-one", framing: "The book itself: what it covers and how to approach it." },
                { entity: "text:grundrisse", framing: "The rough draft that changed how Capital is read." },
              ],
            }),
            step({
              entity: "concept:ideology",
              framing: "How ideas can serve a social order.",
              orientation:
                "Marx and Engels argued that the dominant ideas of a society tend to be the ideas of its dominant class. They did not mean a conspiracy: the point is who controls the means of producing and spreading ideas.",
              whyItMatters: "Ideology helps explain how class societies stay stable without constant force, and why, for Marx, changing society also involves changing how people understand it.",
              nextReason: "Beside ideas there is organised power: armies, police, courts. What is the state, and whose interests does it serve?",
              excerpt: "The ideas of the ruling class",
              branches: [{ entity: "text:the-german-ideology", framing: "The manuscript where the idea is first worked out." }],
            }),
            step({
              entity: "concept:the-state",
              framing: "What the state is, and what socialists should do with it.",
              orientation:
                "Marx and Engels saw the state as bound up with class division, but they never wrote a full theory of it. Their views shifted, especially after the Paris Commune of 1871, which Marx treated as a model of a different kind of political power.",
              whyItMatters:
                "Whether to take over the state, transform it or replace it is where Marxists later divided most sharply, and where they parted company with anarchists.",
              nextReason: "Marx's goal was a society without classes, and so, eventually, without a state. He called it communism.",
              excerpt: "State interference in social relations",
              branches: [
                { entity: "event:paris-commune", framing: "The 1871 rising Marx took as a model." },
                { entity: "text:civil-war-in-france", framing: "Marx's account of the Commune." },
                { entity: "debate:what-is-the-state", framing: "How different traditions answer the question." },
              ],
            }),
            step({
              entity: "concept:communism",
              framing: "What Marx meant by communism, and how little he said about it.",
              orientation:
                "Communism was, for Marx, both a movement and a goal: a society in which the means of production are held in common and classes have disappeared. He deliberately said very little about how it would work.",
              whyItMatters:
                "Communism is the endpoint of Marx's theory. It is also where the theory's gaps show most clearly, and his followers filled them in very different ways.",
              nextReason: "Marx died in 1883. The next step follows what his followers made of his ideas, and how they split.",
              excerpt: "Communism is for us not a state of affairs",
              branches: [
                { entity: "concept:revolution", framing: "What Marx meant by a social revolution." },
                { entity: "concept:dictatorship-of-the-proletariat", framing: "The most contested phrase in the tradition." },
                { entity: "text:critique-of-the-gotha-programme", framing: "The fullest sketch Marx gave of a society after capitalism." },
              ],
            }),
            step({
              entity: "tendency:marxism",
              framing: "How Marxism developed and divided after Marx.",
              orientation:
                "After Marx's death, Engels and a new generation turned his ideas into “Marxism”: the doctrine of mass socialist parties across Europe. They soon disagreed about reform and revolution, about consciousness and organisation, and about the state.",
              whyItMatters:
                "There was no single line from Marx to any one outcome. Reformists, orthodox Marxists, revolutionaries and their critics all claimed him; the debates show where, and why, they parted.",
              nextReason: "One of those paths led to the Bolsheviks and the Russian Revolution of 1917, where this journey and the Atlas's current coverage end.",
              excerpt: "Just as Marx used to say",
              branches: [
                { entity: "event:second-international", framing: "The federation of socialist parties, 1889–1914." },
                { entity: "thinker:kautsky", framing: "The authority of orthodox Marxism." },
                { entity: "thinker:bernstein", framing: "The case for revising Marx." },
                { entity: "thinker:luxemburg", framing: "Against reformism — and against Lenin's centralism." },
                { entity: "debate:reform-or-revolution", framing: "The dispute that divided the movement." },
              ],
            }),
            step({
              entity: "thinker:lenin",
              framing: "One path Marxism took, and the end of this journey.",
              orientation:
                "Lenin built a disciplined party in a country Marx had not expected to lead a socialist revolution, and in October 1917 the Bolsheviks took power. Lenin claimed to be applying Marx; many Marxists of the time, including Kautsky, Plekhanov and Luxemburg, disputed how.",
              whyItMatters:
                "Lenin shows one direction Marxism took, not the only one. Whether his path continued or departed from Marx is still argued over, and the entries present the competing views.",
              nextReason:
                "This is where the Atlas's coverage currently ends. Later history, including the Soviet state and Western Marxism, is not yet covered.",
              branches: [
                { entity: "event:october-revolution", framing: "The Bolshevik seizure of power." },
                { entity: "debate:revolution-in-russia", framing: "Could Russia make a socialist revolution at all?" },
                { entity: "concept:vanguard-party", framing: "Lenin's model of the party, and its critics." },
                { entity: "debate:spontaneity-and-organisation", framing: "How a revolutionary party should be organised." },
              ],
            }),
          ],
        },
      ],
    },
  ],
};
