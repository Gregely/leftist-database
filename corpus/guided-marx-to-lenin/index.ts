import type { Corpus, CorpusPath } from "../../src/lib/corpus/types";

/**
 * Guided journey: From Marx to Lenin. A route through the Marx to Lenin
 * Corpus and the Initial Marx entries it connects to, organised around the
 * developments and disagreements of 1883–1917 rather than around one line of
 * descent. Each stop points at an existing entry; the journey adds only a few
 * lines of orientation and features an excerpt where the entry has one.
 *
 * Imported as a draft for review like any corpus; never published by the import.
 */
const step = (s: CorpusPath["steps"][number]) => s;

export const guidedMarxToLenin: Corpus = {
  collection: "Guided journeys",
  dir: "corpus/guided-marx-to-lenin",
  requires: ["marx-to-lenin"],
  batches: [
    {
      id: "g1",
      title: "Guided journey: From Marx to Lenin",
      sources: [
        { id: "src_joll_second_international", reuse: true, title: "The Second International, 1889–1914", sourceType: "HISTORICAL" },
        { id: "src_ml_eley_forging", reuse: true, title: "Forging Democracy: The History of the Left in Europe, 1850–2000", sourceType: "HISTORICAL" },
      ],
      entities: [
        {
          key: "path:from-marx-to-lenin",
          title: "From Marx to Lenin",
          fields: {
            entryLine: "After Marx: the arguments that led to 1917.",
            level: "intermediate",
            estimatedTime: "About 4 hours at the shortest reading; longer with the side routes",
            summary:
              "A guided route through socialist thought from Marx's death in 1883 to the October Revolution: the mass parties and their rivals, the woman question, Russian Marxism, nations and empire, the war and 1917.",
            guided: true,
            overview: `This journey follows what socialists made of Marx between his death in 1883 and the October Revolution of 1917. It is organised around the arguments that divided them, not around a single line of descent.

- How Marxism became the doctrine of mass parties, and who challenged it: revisionists, French republicans, syndicalists and British gradualists.
- How socialists answered the woman question, and built a women's movement of their own.
- How Russian Marxism grew out of its argument with populism, split into Bolsheviks and Mensheviks, and was transformed by the revolution of 1905.
- How the national question and the new imperialism divided the International before 1914.
- How the war broke the International, and how the revolutions of 1917 posed the old questions again.

Each step begins with a short orientation. Side routes lead to the thinkers, texts and debates around each stop. The journey ends in October 1917, where this part of the collection ends. It works best after the Understanding Marx journey, but does not depend on it.`,
            prerequisites: `Some idea of Marx's main ideas helps: class struggle, capital, the state. The [[path:understanding-marx|Understanding Marx]] journey covers them. Where historians disagree, the entries say so.`,
          },
          citations: [
            { source: "src_joll_second_international", note: "A short history of the period, recommended as companion reading for the journey." },
            { source: "src_ml_eley_forging", note: "A longer history of the European left, recommended as companion reading for the journey." },
          ],
        },
      ],
      paths: [
        {
          path: "path:from-marx-to-lenin",
          steps: [
            step({
              entity: "text:introduction-class-struggles-in-france",
              framing: "Engels's last word on tactics, and how it was read.",
              orientation:
                "Marx died in 1883. In the twelve years Engels outlived him, socialist parties grew from small groups into mass organisations, the German party above all. In 1895, months before his death, Engels looked back on 1848 and asked what revolution could mean in an age of elections and modern armies.",
              whyItMatters:
                "Every later camp claimed this text. Reformists read it as Engels's endorsement of the legal road; revolutionaries pointed out that the party had cut it and that Engels kept the right to revolution. The argument over it is the argument of the whole period in miniature.",
              nextReason: "The parties needed a doctrine they could teach. The next stop is the book that supplied it.",
              excerpt: "The irony of history turns everything upside down",
              branches: [
                { entity: "thinker:engels", framing: "Marx's collaborator, and the movement's adviser until 1895." },
                { entity: "event:anti-socialist-laws", framing: "The ban the German party survived and grew under." },
                { entity: "event:second-international", framing: "The federation of socialist parties founded in 1889." },
              ],
            }),
            step({
              entity: "text:the-class-struggle",
              framing: "The textbook of orthodox Marxism.",
              orientation:
                "Karl Kautsky's commentary on the German party's Erfurt Programme (1891) explained socialism to a generation of workers, in translation across Europe and in Russia. Capitalism concentrates property, the propertyless majority grows, crises deepen, and the party's task is to organise the workers for political power.",
              whyItMatters:
                "This is the \"orthodoxy\" that everyone else in the journey argues with. Its confidence that history was moving towards socialism was its strength, and, its critics said, its weakness.",
              nextReason: "Within a few years a leading member of the same party argued that the forecast was wrong.",
              branches: [
                { entity: "thinker:kautsky", framing: "The authority of the International's Marxism." },
                { entity: "event:erfurt-programme", framing: "The programme the book explains." },
                { entity: "thinker:labriola", framing: "An Italian alternative: Marxism as critical method." },
                { entity: "debate:what-is-historical-materialism", framing: "How deterministic was Marx's theory of history?" },
              ],
            }),
            step({
              entity: "concept:revisionism",
              framing: "Bernstein's challenge, and the answer that made Luxemburg's name.",
              orientation:
                "In 1896–99 Eduard Bernstein argued that capitalism was not collapsing, that the middle classes were not disappearing, and that socialism would come through gradual reform and democracy. The party condemned him, but its unions and many of its deputies worked as he described.",
              whyItMatters:
                "The revisionism dispute fixed the terms of \"reform or revolution\" for the next century. Rosa Luxemburg's reply argued that reforms mattered as means, not as a substitute for the conquest of power.",
              nextReason: "In France the same question arrived in practical form: should a socialist join a government?",
              branches: [
                { entity: "thinker:bernstein", framing: "The revisionist himself." },
                { entity: "text:social-reform-or-revolution", framing: "Luxemburg's reply." },
                { entity: "debate:reform-or-revolution", framing: "The positions side by side." },
                { entity: "tendency:fabianism", framing: "Britain's gradualists, who never claimed to be Marxists.", track: "alternative" },
              ],
            }),
            step({
              entity: "thinker:jaures",
              framing: "Socialism as the completion of the democratic republic.",
              orientation:
                "Jean Jaurès led French socialism by the force of his oratory and his politics: he defended Dreyfus, supported a socialist's entry into government in 1899, and argued that socialism would extend democracy from politics to property. Jules Guesde's Marxists thought this was class collaboration.",
              whyItMatters:
                "Jaurès offered a democratic socialism that was neither German orthodoxy nor Bernstein's revision. The International's ruling against him at Amsterdam in 1904 showed how much authority the German model still had.",
              nextReason: "Some French workers rejected parties and parliaments altogether. They put their hopes in the unions and the general strike.",
              excerpt: "A society takes on a new form only when",
              branches: [
                { entity: "concept:ministerialism", framing: "Should socialists join non-socialist governments?" },
                { entity: "event:millerand-case", framing: "The case that started the argument." },
                { entity: "thinker:guesde", framing: "Jaurès's Marxist rival." },
                { entity: "event:amsterdam-congress", framing: "Where the International ruled on it." },
              ],
            }),
            step({
              entity: "concept:general-strike",
              framing: "The tactic that divided parties, unions and the left.",
              orientation:
                "Revolutionary syndicalists in France, and later in Spain, Italy and America, held that the unions, not the parties, would make the revolution, by a general stoppage of work. After the Russian strikes of 1905 the idea reached the German party too, where union leaders resisted it.",
              whyItMatters:
                "The general strike raised the question of who leads: the party, the unions or the workers themselves. Luxemburg, Sorel, Jaurès and the German union leaders each gave a different answer.",
              nextReason: "The parties also claimed to speak for women. The next stop asks how they understood women's subordination.",
              branches: [
                { entity: "tendency:revolutionary-syndicalism", framing: "The movement that made the general strike its programme." },
                { entity: "thinker:sorel", framing: "The general strike as a mobilising myth." },
                { entity: "text:the-mass-strike", framing: "Luxemburg's lessons of 1905." },
                { entity: "debate:the-general-strike", framing: "What was the general strike for?" },
                { entity: "thinker:william-morris", framing: "A different British socialism: art, work and a society without money.", track: "alternative" },
              ],
            }),
            step({
              entity: "concept:the-woman-question",
              framing: "How socialists explained women's subordination, and what they did about it.",
              orientation:
                "Bebel's Woman and Socialism and Engels's Origin of the Family gave the socialist parties an answer to the \"woman question\": women's subordination began with private property, and full emancipation would come with socialism. Clara Zetkin built a movement on that basis, and against the feminists of her day.",
              whyItMatters:
                "The socialist women's movement was one of the largest organisations of women anywhere before 1914, and it founded International Women's Day. Its insistence on class over sex is still argued over.",
              nextReason: "The journey now turns east, to the country where Marxism would first take power: Russia.",
              excerpt: "The first class opposition that appears in history",
              branches: [
                { entity: "thinker:zetkin", framing: "The movement's leader." },
                { entity: "text:woman-and-socialism", framing: "Bebel's best-selling book." },
                { entity: "text:origin-of-the-family", framing: "Engels's history of the family and property." },
                { entity: "thinker:kollontai", framing: "The woman question in Russia." },
                { entity: "debate:women-and-socialism", framing: "How were women to be emancipated?" },
              ],
            }),
            step({
              entity: "tendency:russian-populism",
              framing: "The tradition Russian Marxism argued its way out of.",
              orientation:
                "Russian revolutionaries of the 1870s hoped that the peasant commune would let Russia skip capitalism. Plekhanov, a former populist, answered in the 1880s that capitalism was already arriving and that the industrial workers, not the village, would make the revolution. The young Lenin set out to prove it.",
              whyItMatters:
                "The question of whether Russia must pass through capitalism, and who would lead its revolution, ran through every Russian dispute down to 1917.",
              nextReason: "Once Russian Marxists had a working-class movement, they quarrelled over how to organise it.",
              branches: [
                { entity: "thinker:plekhanov", framing: "The founder of Russian Marxism." },
                { entity: "text:development-of-capitalism-in-russia", framing: "Lenin's economic case against the populists." },
                { entity: "event:emancipation-of-labour-group", framing: "The first Russian Marxist group, 1883." },
                { entity: "debate:revolution-in-russia", framing: "Could Russia make a socialist revolution?" },
              ],
            }),
            step({
              entity: "text:what-is-to-be-done",
              framing: "Lenin's pamphlet on party and consciousness.",
              orientation:
                "In 1902 Lenin attacked the \"Economists\", who wanted workers to fight their employers and leave politics to the liberals. Socialist consciousness, he argued, had to be brought to the workers from outside the economic struggle, by an organisation of committed revolutionaries.",
              whyItMatters:
                "The pamphlet became the most argued-over text of Russian Marxism. Historians still disagree about whether it set out a new theory of the party or restated the orthodoxy of the International for Russian conditions.",
              nextReason: "A year later the party split, nominally over a clause on membership.",
              excerpt: "Class political consciousness can be brought",
              branches: [
                { entity: "concept:economism", framing: "The tendency Lenin was attacking." },
                { entity: "concept:vanguard-party", framing: "The idea as later generalised." },
                { entity: "debate:spontaneity-and-organisation", framing: "How should a revolutionary party be organised?" },
              ],
            }),
            step({
              entity: "event:bolshevik-menshevik-split",
              framing: "How Russian social democracy divided into two factions.",
              orientation:
                "At the party's second congress in 1903, Lenin and Martov proposed different definitions of a party member. Martov's won; Lenin's supporters won the elections to the leadership and called themselves Bolsheviks. Trotsky, then on Martov's side, accused Lenin of putting the committee in place of the class.",
              whyItMatters:
                "At the time many saw it as a quarrel among émigrés. The two factions it produced faced each other in 1917.",
              nextReason: "Two years later a real revolution tested both factions.",
              excerpt: "A Jacobin who wholly identifies himself",
              branches: [
                { entity: "tendency:bolshevism", framing: "Lenin's faction, 1903–17." },
                { entity: "tendency:menshevism", framing: "Martov's faction." },
                { entity: "thinker:martov", framing: "Lenin's ally, then his opponent." },
                { entity: "tendency:jewish-labour-bund", framing: "The Jewish socialist party whose walk-out decided the vote." },
                { entity: "thinker:luxemburg", framing: "Luxemburg's criticism of Lenin's centralism.", track: "alternative" },
              ],
            }),
            step({
              entity: "event:revolution-1905",
              framing: "The revolution that changed the arguments.",
              orientation:
                "In 1905 strikes, mutinies and peasant risings shook the Russian Empire. A general strike forced the tsar to grant a parliament, and workers in St Petersburg elected a council of delegates, a soviet, in which Trotsky played the leading part.",
              whyItMatters:
                "1905 gave socialists across Europe new material: Luxemburg drew her theory of the mass strike from it, Trotsky his theory of permanent revolution, and the soviets reappeared in 1917.",
              nextReason: "Who would lead the Russian revolution, and how far could it go? Trotsky's answer is the next stop.",
              branches: [
                { entity: "concept:soviets", framing: "The councils born in 1905." },
                { entity: "text:the-mass-strike", framing: "Luxemburg's reading of 1905." },
                { entity: "thinker:trotsky", framing: "Leader of the Petersburg Soviet." },
              ],
            }),
            step({
              entity: "concept:permanent-revolution",
              framing: "Could a democratic revolution become a socialist one?",
              orientation:
                "Marxists expected Russia to have a bourgeois revolution first. Trotsky argued in 1906 that the Russian bourgeoisie was too weak to lead it, that the workers would have to take power, and that once in power they would be driven to socialist measures, which could last only with revolution in the West.",
              whyItMatters:
                "This was one of three answers, with the Mensheviks' bourgeois revolution and Lenin's democratic dictatorship of workers and peasants. Which of them Lenin adopted in 1917 is still disputed.",
              nextReason: "Russia was also an empire of many nations. So was Austria-Hungary. The next stop asks what socialists owed national movements.",
              excerpt: "it is our interest and our task to make the revolution permanent",
              branches: [
                { entity: "text:results-and-prospects", framing: "Trotsky's essay of 1906." },
                { entity: "tendency:menshevism", framing: "The bourgeois revolution with the workers in opposition." },
                { entity: "debate:revolution-in-russia", framing: "The three answers side by side." },
              ],
            }),
            step({
              entity: "concept:national-self-determination",
              framing: "Socialists and the nations of the empires.",
              orientation:
                "In the Russian and Habsburg empires dozens of peoples wanted rights or independence. The Austrian Marxists proposed cultural autonomy for nations without borders; Luxemburg rejected the right of nations to self-determination as a bourgeois slogan; Lenin defended the right to secede.",
              whyItMatters:
                "The national question split socialists more than almost any other. It decided their relation to Poles, Jews, Irish, Ukrainians and Finns, and came to a head in 1916 with the Easter Rising.",
              nextReason: "Beyond Europe's empires lay the colonial world. Socialists now tried to explain why the powers were dividing it up.",
              branches: [
                { entity: "concept:national-cultural-autonomy", framing: "The Austro-Marxist alternative." },
                { entity: "text:national-question-and-autonomy", framing: "Luxemburg against self-determination." },
                { entity: "text:right-of-nations-to-self-determination", framing: "Lenin's reply." },
                { entity: "thinker:connolly", framing: "Irish socialism and the national struggle." },
                { entity: "event:easter-rising", framing: "A national rising in wartime." },
                { entity: "debate:the-national-question", framing: "Do nations have a right to their own state?" },
              ],
            }),
            step({
              entity: "concept:finance-capital",
              framing: "The theory of the new imperialism.",
              orientation:
                "After 1880 the great powers divided Africa and much of Asia. The liberal Hobson blamed surplus capital looking for outlets abroad; the Austrian Marxist Hilferding described a new \"finance capital\", banks fused with industry, that wanted tariffs, colonies and a strong state; Luxemburg argued that capital needed non-capitalist markets to grow.",
              whyItMatters:
                "If imperialism was a policy, it could be resisted by reform; if it was a stage of capitalism, war would follow. That difference shaped how socialists met 1914.",
              nextReason: "The International tried to answer colonialism and the threat of war at its congress of 1907.",
              excerpt: "I call bank capital",
              branches: [
                { entity: "text:imperialism-a-study", framing: "Hobson's critique of empire (1902)." },
                { entity: "text:finance-capital", framing: "Hilferding's book (1910)." },
                { entity: "text:accumulation-of-capital", framing: "Luxemburg's theory (1913)." },
                { entity: "concept:ultra-imperialism", framing: "Kautsky: could the powers combine instead of fighting?" },
                { entity: "debate:what-drives-imperialism", framing: "The theories compared." },
              ],
            }),
            step({
              entity: "event:stuttgart-congress",
              framing: "Colonies and war at the International's largest congress.",
              orientation:
                "At Stuttgart in 1907 part of the International was ready to accept a \"socialist colonial policy\"; the congress narrowly rejected it. On war, it resolved that socialists should try to prevent it and, if it came, use the crisis to hasten the fall of capitalism, an amendment moved by Luxemburg, Lenin and Martov.",
              whyItMatters:
                "The Stuttgart resolution, repeated at Basel in 1912, was the promise by which the parties were judged in August 1914.",
              nextReason: "In the summer of 1914 the promise was tested.",
              excerpt: "A sentence was inserted in the draft resolution",
              branches: [
                { entity: "event:basel-congress", framing: "The International's last pledge against war (1912)." },
                { entity: "concept:imperialism", framing: "The concept, and its several theories." },
              ],
            }),
            step({
              entity: "event:war-credits-1914",
              framing: "The day the International failed.",
              orientation:
                "Jaurès was murdered on 31 July 1914. On 4 August the German Social Democrats voted for war credits, and the French, Austrian and most other parties supported their governments. A minority in each country opposed the war.",
              whyItMatters:
                "August 1914 broke the Second International and divided socialists into those who defended their nations, those who wanted peace, and those who wanted revolution. Lenin explained the collapse by a labour aristocracy bought off by empire; others gave different reasons.",
              nextReason: "The opponents of the war disagreed about what to do instead.",
              branches: [
                { entity: "event:assassination-of-jaures", framing: "Three days before the war." },
                { entity: "concept:labour-aristocracy", framing: "Lenin's explanation of the collapse." },
                { entity: "debate:socialists-and-the-war", framing: "What should socialists do when war comes?" },
              ],
            }),
            step({
              entity: "concept:revolutionary-defeatism",
              framing: "The anti-war socialists and their arguments.",
              orientation:
                "In 1915 a few dozen socialists met at Zimmerwald and called for peace. Lenin wanted more: socialists should wish their own government's defeat and turn the war into civil war. Luxemburg, in prison, wrote that the war had shown bourgeois society as it was, and posed the choice of socialism or barbarism.",
              whyItMatters:
                "These were the arguments from which the revolutionary left of 1917 emerged. Trotsky and many Bolsheviks rejected Lenin's slogan, and historians still disagree about how literally he meant it.",
              nextReason: "In February 1917 the war brought down the tsar.",
              excerpt: "During a reactionary war",
              branches: [
                { entity: "event:zimmerwald-conference", framing: "The anti-war socialists' conference of 1915." },
                { entity: "text:junius-pamphlet", framing: "Luxemburg's indictment of the war.", track: "alternative" },
                { entity: "text:imperialism-highest-stage", framing: "Lenin's theory of imperialism (1916)." },
              ],
            }),
            step({
              entity: "concept:dual-power",
              framing: "February 1917: two governments in one capital.",
              orientation:
                "Women textile workers' strikes on International Women's Day began the February Revolution. Eight days later the tsar abdicated, and two authorities stood side by side: a liberal Provisional Government and the Petrograd Soviet of workers' and soldiers' deputies. Lenin called this dual power.",
              whyItMatters:
                "Every party had to decide its attitude to the new government. The Mensheviks and Socialist Revolutionaries who led the soviet supported it and in May joined it; the question of ministerialism had returned.",
              nextReason: "Lenin returned from exile in April with an answer that surprised his own party.",
              excerpt: "The highly remarkable feature of our revolution",
              branches: [
                { entity: "event:february-revolution", framing: "The revolution that ended the monarchy." },
                { entity: "concept:soviets", framing: "The second power." },
                { entity: "event:copenhagen-womens-conference", framing: "Where International Women's Day began." },
              ],
            }),
            step({
              entity: "text:april-theses",
              framing: "Lenin's programme: no support for the government, all power to the soviets.",
              orientation:
                "The day after his return, Lenin rejected support for the Provisional Government and the war, and called for a republic of soviets. The Bolshevik leaders in Petrograd thought he had abandoned the party's idea of a bourgeois-democratic revolution; within a month the party adopted his line.",
              whyItMatters:
                "The theses set the course to October. They also reopened the argument of 1905: had Lenin come round to Trotsky's permanent revolution, or applied his own strategy to a new situation?",
              nextReason: "Through the summer the Bolsheviks gained support, lost it after the July Days, and gained it again. The last stop is October.",
              excerpt: "The specific feature of the present situation",
              branches: [
                { entity: "thinker:kollontai", framing: "Among the first leading Bolsheviks to support them." },
                { entity: "text:the-state-and-revolution", framing: "Lenin's theory of the state, written in hiding that summer." },
                { entity: "tendency:bolshevism", framing: "The party the theses turned." },
              ],
            }),
            step({
              entity: "event:october-revolution",
              framing: "The end of this journey.",
              orientation:
                "On 24–25 October 1917 the Military Revolutionary Committee of the Petrograd Soviet, directed by Trotsky, took the capital, and the Second Congress of Soviets was asked to take power. Martov's Mensheviks walked out in protest.",
              whyItMatters:
                "October was one outcome of the arguments in this journey, not their only possible end. Kautsky, Plekhanov, Martov and, in part, Luxemburg disputed that it was the socialist revolution Marx had foreseen; the Bolsheviks claimed it was. The entries present both cases.",
              nextReason:
                "This is where the journey, and this part of the collection, ends. What followed, the Soviet state, the Communist International and the later schools of Marxism, lies beyond it.",
              branches: [
                { entity: "thinker:lenin", framing: "The Bolshevik leader." },
                { entity: "thinker:martov", framing: "The Menshevik internationalist who opposed the insurrection.", track: "alternative" },
                { entity: "tendency:leninism", framing: "What the Bolsheviks' politics became after 1917." },
              ],
            }),
          ],
        },
      ],
    },
  ],
};
