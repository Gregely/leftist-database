import type { CorpusBatch, CorpusSource } from "../../src/lib/corpus/types";

const MIA = "Marxists Internet Archive transcription (marxists.org). Check wording against a printed edition before quoting.";
const mia = (id: string, title: string, author: string, date: string, url: string, expect: string, extra: Partial<CorpusSource> = {}): CorpusSource => ({
  id,
  title,
  author,
  publicationDate: date,
  publisher: "Marxists Internet Archive",
  url,
  sourceType: "PRIMARY",
  notes: MIA,
  check: { kind: "url", expect },
  ...extra,
});
const book = (id: string, title: string, author: string, date: string, publisher: string, place: string, sourceType: CorpusSource["sourceType"], check: { title: string; author: string }): CorpusSource => ({
  id,
  title,
  author,
  publicationDate: date,
  publisher,
  place,
  sourceType,
  check: { kind: "book", ...check },
});

/**
 * Batch 4 — The International, the Paris Commune and the late Marx and
 * Engels (1864–1883/95): the state, the dictatorship of the proletariat and
 * communism; The Civil War in France, the Critique of the Gotha Programme and
 * Socialism: Utopian and Scientific.
 */
export const batch4: CorpusBatch = {
  id: "b4",
  title: "The International, the Commune and the late Marx and Engels",
  sources: [
    mia("src_mia_inaugural", "Inaugural Address of the International Working Men’s Association", "Karl Marx", "1864", "https://www.marxists.org/archive/marx/works/1864/10/27.htm", "political economy of labor"),
    mia("src_mia_iwma_rules", "General Rules of the International Working Men’s Association", "Karl Marx", "1864 [revised 1871]", "https://www.marxists.org/history/international/iwma/documents/1864/rules.htm", "conquered by the working classes themselves"),
    mia("src_mia_hague_resolutions", "Resolutions of the General Congress held at The Hague, 2–7 September 1872", "International Working Men’s Association", "1872", "https://www.marxists.org/history/international/iwma/documents/1872/hague-conference/resolutions.htm", "conquest of political power", { sourceType: "HISTORICAL" }),
    mia("src_mia_manifesto_1872", "Preface to the 1872 German edition of the Manifesto of the Communist Party", "Karl Marx and Frederick Engels", "1872", "https://www.marxists.org/archive/marx/works/1848/communist-manifesto/preface.htm", "proved by the Commune"),
    mia("src_mia_kugelmann_1871", "Letter to Ludwig Kugelmann, 12 April 1871", "Karl Marx", "1871", "https://www.marxists.org/archive/marx/works/1871/letters/71_04_12.htm", "bureaucratic-military machine"),
    mia("src_mia_engels_1891_cwf", "Introduction to the 1891 edition of The Civil War in France", "Frederick Engels", "1891", "https://www.marxists.org/archive/marx/works/1871/civil-war-france/postscript.htm", "Dictatorship of the Proletariat"),
    mia("src_mia_nieuwenhuis_1881", "Letter to Ferdinand Domela Nieuwenhuis, 22 February 1881", "Karl Marx", "1881", "https://www.marxists.org/archive/marx/works/1881/letters/81_02_22.htm", "in no sense socialist"),
    mia("src_mia_engels_bebel_1875", "Letter to August Bebel, 18–28 March 1875", "Frederick Engels", "1875 [first published 1911]", "https://www.marxists.org/archive/marx/works/1875/letters/75_03_18.htm", "Gemeinwesen"),
    mia("src_mia_engels_schmidt_1890", "Letter to Conrad Schmidt, 5 August 1890", "Frederick Engels", "1890 [first published 1920]", "https://www.marxists.org/archive/marx/works/1890/letters/90_08_05.htm", "not a Marxist"),
    mia("src_mia_bakunin_conspectus", "Conspectus of Bakunin’s Statism and Anarchy (extract)", "Karl Marx", "written 1874–75 [first published 1926]", "https://www.marxists.org/archive/marx/works/1874/04/bakunin-notes.htm", "Statism and Anarchy"),
    mia("src_mia_soc_utopian_1892", "Special introduction to the English edition of 1892 (Socialism: Utopian and Scientific)", "Frederick Engels", "1892", "https://www.marxists.org/archive/marx/works/1880/soc-utop/int-mat.htm", "circulates in 10 languages"),
    book("src_draper_dictatorship", "The “Dictatorship of the Proletariat” from Marx to Lenin", "Hal Draper", "1987", "Monthly Review Press", "New York", "ACADEMIC", { title: "dictatorship of the proletariat from Marx to Lenin", author: "Draper" }),
    book("src_collins_abramsky", "Karl Marx and the British Labour Movement: Years of the First International", "Henry Collins and Chimen Abramsky", "1965", "Macmillan", "London", "HISTORICAL", { title: "Karl Marx and the British labour movement", author: "Collins" }),
    book("src_morgan_first_international", "The German Social Democrats and the First International, 1864–1872", "Roger Morgan", "1965", "Cambridge University Press", "Cambridge", "HISTORICAL", { title: "German Social Democrats and the First International", author: "Morgan" }),
    book("src_merriman_massacre", "Massacre: The Life and Death of the Paris Commune of 1871", "John Merriman", "2014", "Yale University Press", "New Haven", "HISTORICAL", { title: "Massacre", author: "Merriman" }),
    book("src_lidtke_outlawed", "The Outlawed Party: Social Democracy in Germany, 1878–1890", "Vernon L. Lidtke", "1966", "Princeton University Press", "Princeton", "HISTORICAL", { title: "The outlawed party", author: "Lidtke" }),
  ],
  entities: [
    /* ——— Concepts ——— */
    {
      key: "concept:the-state",
      title: "The State",
      fields: {
        aliases: "State\nState power\nState machinery\nWithering away of the state",
        summary:
          "The organised apparatus of rule — army, police, bureaucracy, courts. Marx and Engels treated it as historically connected to class division; what that means, and what socialists should do with it, is among the most disputed questions in the tradition.",
        yearStart: 1843,
        brief: `For Marx and Engels the state is not a neutral referee standing above society. It grew up with the division of society into classes and, in their view, mainly protects the order that benefits the ruling class. They expected it to "wither away" once classes disappeared. How quickly, by what route and with what kind of transitional government were questions they answered differently at different times — and their followers fought over them for a century.`,
        standard: `Marx began from Hegel, who saw the state as the realm of universal interest standing above the conflicts of civil society. In 1843 he argued the reverse: the state's universality is illusory, and it is shaped by the private interests it claims to transcend ([[text:critique-of-hegels-philosophy-of-right]]; [[thinker:hegel]]).[cite:src_avineri]

**Text.** The *Manifesto* put it bluntly: "The executive of the modern state is but a committee for managing the common affairs of the whole bourgeoisie."[cite:src_manifesto_moore, section I]

Later writings complicate the formula:

- In *The Eighteenth Brumaire* (1852) the state under Louis Bonaparte seems to have made itself independent of all classes ([[text:eighteenth-brumaire]]).[cite:src_mia_brumaire]
- In *The Civil War in France* (1871) Marx argued that the working class "cannot simply lay hold of the ready-made state machinery" but must replace it with institutions like those of the Paris Commune ([[text:civil-war-in-france]]; [[event:paris-commune]]).[cite:src_mia_civil_war, part III]
- Engels's *Anti-Dühring* (1878) predicted that the state would not be "abolished" but would "die out" as class rule ended ([[text:socialism-utopian-and-scientific]]).[cite:src_mia_soc_utopian, part III]`,
        deep: `### Instrument, balance or structure?

Marx and Engels left no systematic theory of the state — the book on the state planned in Marx's original scheme for his economic work was never written. Their scattered statements support several readings:[cite:src_bottomore_dictionary][cite:src_kolakowski]

- **Instrumental.** The state is a tool controlled by the dominant class (the *Manifesto* formula).
- **Relative autonomy.** In periods when classes are evenly balanced, the state and its bureaucracy can gain independence — Bonapartism (1852) and Engels's remarks on absolutism in *The Origin of the Family* (1884).
- **Parasitic machine.** The *Civil War in France* describes the centralised state as a body growing over society, to be dismantled rather than captured.

### Capture or smash?

**Text.** In April 1871 Marx wrote to Kugelmann that the next French revolution would try "no longer, as before, to transfer the bureaucratic-military machine from one hand to another, but to smash it".[cite:src_mia_kugelmann_1871] In 1872, at Amsterdam, he also allowed that workers in countries such as America and England might reach their goals by peaceful means ([[event:hague-congress]]).[cite:src_mia_amsterdam_1872]

**Disputed.** These statements have been read as complementary (smashing the bureaucratic-military machine is compatible with a peaceful path where that machine is weak) or as a real tension. The dispute was fought out between Kautsky and Lenin ([[debate:what-is-the-state]]; [[text:the-state-and-revolution]]).[cite:src_draper_dictatorship][cite:src_salvadori_kautsky]

### Withering away

**Text.** Engels: "The State is not "abolished". It dies out."[cite:src_mia_soc_utopian, part III] In 1875 he advised Bebel to drop "state" in favour of *Gemeinwesen* ("commonalty"), pointing to the Commune, "which had ceased to be a state in the true sense of the term".[cite:src_mia_engels_bebel_1875]`,
        history: `The concept moves from the young Marx's critique of Hegel (1843), through the class analysis of 1848–52, to the lessons Marx drew from the Paris Commune (1871) and Engels's later formulations in *Anti-Dühring* (1878) and *The Origin of the Family, Private Property and the State* (1884).[cite:src_mclellan_marx][cite:src_hunt_engels]`,
        interpretations: `- **Anarchist.** Bakunin argued that any "people's state" would become a new despotism of an educated minority; Marx's private notes on *Statism and Anarchy* (1874–75) answer him point by point, insisting on the class character of the transition ([[thinker:bakunin]]).[cite:src_mia_bakunin_conspectus]
- **Second International.** Kautsky emphasised winning a parliamentary majority and transforming the existing state ([[thinker:kautsky]]).[cite:src_salvadori_kautsky]
- **Lenin (1917).** *The State and Revolution* revived the "smash the machine" reading and the Commune model ([[thinker:lenin]]).[cite:src_state_revolution]
- **Later Marxism.** Twentieth-century debates (Gramsci on hegemony; the Miliband–Poulantzas exchange) lie outside this corpus ([[concept:hegemony]]).[cite:src_bottomore_dictionary]`,
        criticisms: `Critics argue that the class theory of the state underrates the state's own interests and capacities, that liberal institutions protect workers as well as owners, and that the promise of withering away gave no guidance for restraining a revolutionary state — a gap they see filled in the twentieth century by party dictatorship.[cite:src_kolakowski][cite:src_walicki]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample concept. Keeps its existing links to later traditions (hegemony, ISAs)." },
      ],
    },
    {
      key: "concept:dictatorship-of-the-proletariat",
      title: "Dictatorship of the proletariat",
      fields: {
        aliases: "Diktatur des Proletariats\nWorkers' state\nRevolutionary dictatorship of the proletariat",
        summary:
          "Marx's term for the political rule of the working class in the transition from capitalism to communism. He used it rarely; what he meant by it — and whether it implies dictatorial methods — became one of the bitterest disputes in socialism.",
        yearStart: 1850,
        brief: `The phrase sounds like one-person rule, but Marx used "dictatorship" for the rule of a whole class. He meant the period after workers take political power and before classes disappear. He used the phrase only a handful of times and never described its institutions in detail. Engels pointed to the Paris Commune, with its elected and recallable officials, as an example. After 1917, Kautsky and Lenin drew opposite conclusions from the same texts.`,
        standard: `**Text.** The phrase appears in *The Class Struggles in France* (1850), where Marx describes revolutionary socialism as "the class dictatorship of the proletariat as the necessary transit point to the abolition of class distinctions generally".[cite:src_mia_class_struggles_france, part III] In 1852 he named it as one of the three things he had added to the theory of classes ([[concept:class-struggle]]).[cite:src_mia_weydemeyer_1852]

**Text.** In 1875 he wrote that between capitalist and communist society lies a political transition period "in which the state can be nothing but the revolutionary dictatorship of the proletariat" ([[text:critique-of-the-gotha-programme]]).[cite:src_mia_gotha, part IV]

**Text.** In 1891 Engels answered the "Social-Democratic philistine": "Look at the Paris Commune. That was the Dictatorship of the Proletariat." ([[event:paris-commune]])[cite:src_mia_engels_1891_cwf]`,
        deep: `### What did "dictatorship" mean?

In the nineteenth century "dictatorship" still carried the sense of the Roman emergency office and was often used for any concentrated sovereign power. Hal Draper argued that Marx used the phrase for the *social* content of a regime — rule by the working class — not for a form of government, and that he took it up partly in dialogue with followers of Auguste Blanqui, for whom it meant rule by a revolutionary minority.[cite:src_draper_dictatorship]

**Interpretation.** On this reading Marx's model is the Commune: universal suffrage, recallable delegates, workers' wages for officials, an armed people instead of a standing army. Critics reply that Marx also praised revolutionary terror in 1848–50 and that "dictatorship" cannot be emptied of coercion.[cite:src_draper_dictatorship][cite:src_kolakowski]

### The split of 1918

**Text.** Kautsky held that Marx spoke "not of a form of government, but of a condition", compatible with democracy and majority rule.[cite:src_mia_kautsky_dictatorship, ch. 5] **Text.** Lenin answered: "The revolutionary dictatorship of the proletariat is rule won and maintained by the use of violence by the proletariat against the bourgeoisie, rule that is unrestricted by any laws."[cite:src_mia_renegade, "How Kautsky Turned Marx into a Common Liberal"]

**Disputed.** Each side claimed fidelity to Marx. The texts are few, short and contextual, which is why both readings remain possible ([[debate:what-is-the-state]]; [[thinker:luxemburg]]).[cite:src_kolakowski][cite:src_salvadori_kautsky]`,
        history: `First used in 1850 amid the post-1848 alliance with Blanquists; restated in 1852 and 1875; popularised by Engels's 1891 introduction and by the publication of the Gotha critique the same year; made central to communist doctrine after 1917 and dropped by most Western communist parties in the 1970s.[cite:src_draper_dictatorship][cite:src_bottomore_dictionary]`,
        interpretations: `- **Democratic-majoritarian** (Kautsky; later democratic socialists): political rule of a working-class majority through democratic institutions.[cite:src_mia_kautsky_dictatorship]
- **Commune-state** (Draper; Lenin's 1917 text): rule through new, radically democratic institutions replacing the old state.[cite:src_draper_dictatorship][cite:src_state_revolution]
- **Revolutionary coercion** (Lenin, 1918): rule by force, unrestricted by law, against the former ruling class.[cite:src_mia_renegade]
- **Luxemburg (1918):** dictatorship of the class, not of a party, requiring the widest democracy ([[thinker:luxemburg]]).[cite:src_mia_luxemburg_russian_rev]`,
        criticisms: `Liberal and anarchist critics argue that whatever Marx meant, a doctrine that suspends legal limits on power in the name of a class will in practice empower the party that speaks for it — as Bakunin predicted and as twentieth-century communist states seemed to confirm.[cite:src_mia_bakunin_conspectus][cite:src_kolakowski]`,
      },
      flags: [{ type: "disputed", note: "The meaning of the term is genuinely contested. Wording has been kept to attributed positions; please check that no reading is presented as settled." }],
    },
    {
      key: "concept:communism",
      title: "Communism",
      fields: {
        aliases: "Kommunismus\nClassless society\nSocialism (first phase)\nHigher phase of communist society",
        summary:
          "For Marx, both a movement and a goal: the movement of workers against capitalism, and the society without classes, private ownership of the means of production or a state that he expected it to produce. He refused to write detailed blueprints of it.",
        yearStart: 1844,
        brief: `"Communism" was already a word for radical egalitarian movements when Marx adopted it in the 1840s. He meant a society where the means of production are owned in common, classes have disappeared, and the state is no longer needed. He was wary of describing it in detail: the future would be built by people's own struggles, not drawn up by thinkers. His few sketches — notably in 1875 — distinguish a first phase that still bears the marks of capitalism from a "higher phase".`,
        standard: `**Text.** "We call communism the real movement which abolishes the present state of things," Marx and Engels wrote in 1845–46 — not an ideal "to which reality [will] have to adjust itself" ([[text:the-german-ideology]]).[cite:src_mia_german_ideology, part I]

The *Manifesto* summed up the theory of the Communists as the abolition of bourgeois private property, and imagined "an association, in which the free development of each is the condition for the free development of all" ([[text:communist-manifesto]]).[cite:src_manifesto_moore, section II]

**Text.** In 1875 Marx distinguished:

- a **first phase**, "just emerged" from capitalism, in which each receives back from society according to labour performed, an equal right that is "still in principle — bourgeois right";
- a **higher phase**, when the division of labour and the antithesis of mental and physical labour have vanished and the productive forces have grown, which can inscribe on its banners: "From each according to his ability, to each according to his needs!" ([[text:critique-of-the-gotha-programme]]).[cite:src_mia_gotha, part I]`,
        deep: `### Against blueprints

Marx criticised the utopian socialists for designing ideal communities and appealing to enlightened benefactors ([[tendency:early-socialism]]). He gave few positive descriptions, which leaves later readers with fragments — the 1844 *Manuscripts*' communism as "the positive transcendence of private property" and of alienation, the German Ideology's hunter-fisherman-critic passage, *Capital*'s "community of free individuals", and the Gotha notes ([[concept:alienation]]).[cite:src_wood_marx][cite:src_walicki]

### Socialism and communism

Marx used the words with no fixed difference. The later convention of calling the first phase "socialism" and the higher phase "communism" was popularised by Lenin in *The State and Revolution* (1917) ([[text:the-state-and-revolution]]).[cite:src_state_revolution, ch. 5][cite:src_bottomore_dictionary]

### Freedom and necessity

**Interpretation.** Engels called the transition "the ascent of man from the kingdom of necessity to the kingdom of freedom" ([[text:socialism-utopian-and-scientific]]).[cite:src_mia_soc_utopian, part III] Commentators disagree about how much of the realm of necessity Marx thought could ever be abolished; *Capital* volume III treats a shorter working day as its "basic prerequisite".[cite:src_walicki][cite:src_kolakowski]`,
        history: `Communist ideas long predate Marx — from Plato's guardians and monastic common property to Babeuf's "Conspiracy of Equals" (1796) and the communist workers' societies of the 1830s–40s. Marx encountered French communism in Paris in 1843–44; the Communist League made it the name of his politics ([[event:communist-league]]).[cite:src_sep_socialism][cite:src_stedman_jones_marx]`,
        interpretations: `- **Humanist readings** stress self-realisation and the end of alienation.[cite:src_wood_marx]
- **Economic readings** stress planning and common ownership; the "socialist calculation" debate of the 1920s–30s asked whether a moneyless economy can allocate resources rationally.[cite:src_sep_socialism]
- **Walicki** argues that the vision of a society without commodity production was intrinsically utopian and helped legitimise coercion when communists tried to realise it.[cite:src_walicki]`,
        criticisms: `Critics argue that Marx's refusal to describe institutions left the hardest questions — coordination, incentives, the protection of minorities, the control of administrators — unanswered; defenders reply that he was right not to legislate for the future and that twentieth-century regimes do not show what his communism would be.[cite:src_walicki][cite:src_sep_socialism]`,
      },
      flags: [{ type: "specialist-review", field: "deep", note: "Short phrases from the 1844 Manuscripts, Capital (Moore–Aveling) and Capital vol. III (ch. 48) were matched against marxists.org transcriptions but carry no inline locator; add citations to the printed editions." }],
    },

    /* ——— Texts ——— */
    {
      key: "text:civil-war-in-france",
      title: "The Civil War in France",
      fields: {
        subtitle: "Address of the General Council of the International Working Men's Association",
        originalTitle: "The Civil War in France",
        language: "English",
        form: "pamphlet",
        yearStart: 1871,
        publicationNote: "Written April–May 1871 in English for the General Council of the International; published in London in June 1871. Engels's introduction to the German edition of 1891 is often printed with it.",
        edition: "MECW vol. 22; with drafts and Engels's 1891 introduction in many editions",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/marx/works/1871/civil-war-france/",
        aliases: "Der Bürgerkrieg in Frankreich\nAddress on the Civil War in France",
        summary:
          "Marx's address on the Paris Commune, written as it was crushed: a history of the Franco-Prussian war and the Thiers government, a defence of the Commune, and his most concrete account of what working-class political power might look like.",
        body: `## Purpose

The General Council of the International asked Marx for an address on the struggle in France. He worked on it through the spring of 1871 and read it to the Council on 30 May, two days after the Commune's fall ([[event:paris-commune]]; [[event:first-international]]).[cite:src_mia_civil_war][cite:src_tombs_commune]

## Main argument

- **The Thiers government** is portrayed as a government of national defection that preferred capitulation to Prussia to an armed Paris.
- **The Commune.** **Text.** It was "essentially a working class government", "the political form at last discovered under which to work out the economical emancipation of labor".[cite:src_mia_civil_war, part III]
- **Its measures**: suppression of the standing army in favour of the armed people; councillors elected by universal suffrage, "responsible and revocable at short terms"; public service "at workman's wage"; separation of church and state.[cite:src_mia_civil_war, part III]
- **The state.** The working class "cannot simply lay hold of the ready-made state machinery, and wield it for its own purposes" ([[concept:the-state]]).[cite:src_mia_civil_war, part III]

## Later influence

The address made Marx notorious across Europe as the supposed mastermind of the Commune. Marx and Engels wrote its key sentence into their 1872 preface to the *Manifesto*. Lenin's *The State and Revolution* (1917) built its argument on it.[cite:src_mia_manifesto_1872][cite:src_state_revolution][cite:src_sperber_marx]

## Interpretations

**Disputed.** Historians note that Marx idealised the Commune: its leaders were mostly Blanquists, Jacobins and Proudhonists, not Marxists, and some of its "measures" were intentions rather than achievements. **Text.** Marx himself wrote privately in 1881 that "the majority of the Commune was in no sense socialist, nor could it be".[cite:src_mia_nieuwenhuis_1881][cite:src_tombs_commune] Others read the address less as history than as political theory — a model of democracy against bureaucracy.[cite:src_draper_dictatorship]`,
        context: `Written in London while Paris was besieged by the Versailles army, in the name of an International whose French members were among the Communards ([[event:first-international]]).[cite:src_collins_abramsky]`,
      },
    },
    {
      key: "text:critique-of-the-gotha-programme",
      title: "Critique of the Gotha Programme",
      fields: {
        subtitle: "Marginal notes to the programme of the German Workers' Party",
        originalTitle: "Randglossen zum Programm der deutschen Arbeiterpartei",
        language: "German",
        form: "letter",
        yearStart: 1875,
        publicationNote: "Written April–early May 1875 and sent to Wilhelm Bracke for the Eisenach party leadership; first published by Engels in Die Neue Zeit in 1891.",
        edition: "MECW vol. 24; many editions",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/marx/works/1875/gotha/",
        aliases: "Gotha critique\nRandglossen zum Programm der deutschen Arbeiterpartei",
        summary:
          "Marx's private, sharply worded notes on the draft programme for the unification of the two German workers' parties. Published only in 1891, they contain his best-known remarks on the phases of communism and the transition between capitalism and communism.",
        body: `## Purpose

In 1875 Marx's associates in the Social Democratic Workers' Party (the "Eisenachers") agreed to merge with Lassalle's General German Workers' Association at Gotha ([[event:gotha-unity-congress]]). Marx sent detailed objections to the draft programme to the Eisenach leadership; Engels wrote in similar terms to Bebel.[cite:src_mia_gotha][cite:src_mia_engels_bebel_1875]

## Main argument

- **Labour and wealth.** Against the opening claim that labour is the source of all wealth, Marx insists that nature is just as much a source of use-values ([[concept:labour]]).
- **"Undiminished proceeds of labour".** A socialist society must deduct funds for replacement, expansion, administration, schools, health and those unable to work.
- **Two phases of communism.** In the first, distribution according to labour still follows "bourgeois right"; only in a higher phase, "From each according to his ability, to each according to his needs!" ([[concept:communism]]).[cite:src_mia_gotha, part I]
- **The state.** Against the Lassallean "free state" and state-aided co-operatives, Marx posits a transition period "in which the state can be nothing but the revolutionary dictatorship of the proletariat" ([[concept:dictatorship-of-the-proletariat]]; [[concept:the-state]]).[cite:src_mia_gotha, part IV]
- **The "iron law of wages"** is rejected as a Malthusian doctrine.

## Later influence

The programme was adopted with few changes; the notes had little effect in 1875. Engels's publication of them in 1891, against the reluctance of party leaders, coincided with the debate leading to the Erfurt Programme ([[event:erfurt-programme]]). Lenin drew on them heavily in *The State and Revolution*.[cite:src_steenson_kautsky][cite:src_state_revolution, ch. 5]

## Interpretations

Because the text is the fullest account Marx gave of a post-capitalist society, readers have found in it either a sober recognition of transitional inequality or, with critics such as Walicki, evidence of an ultimately utopian vision of a society without markets.[cite:src_walicki][cite:src_wood_marx]`,
        context: `Written in poor health in London, as German socialism grew into a mass party under the leadership of Bebel and Wilhelm Liebknecht.[cite:src_morgan_first_international][cite:src_sperber_marx]`,
      },
    },
    {
      key: "text:socialism-utopian-and-scientific",
      title: "Socialism: Utopian and Scientific",
      fields: {
        originalTitle: "Die Entwicklung des Sozialismus von der Utopie zur Wissenschaft",
        language: "German",
        form: "pamphlet",
        yearStart: 1880,
        publicationNote: "Three chapters of Anti-Dühring (1877–78) arranged by Engels for a French edition translated by Paul Lafargue (1880); German edition 1882 (dated 1883); English translation by Edward Aveling with a special introduction by Engels, 1892.",
        edition: "trans. Edward Aveling (1892); MECW vol. 24",
        difficulty: "1",
        readingUrl: "https://www.marxists.org/archive/marx/works/1880/soc-utop/",
        aliases: "Socialisme utopique et socialisme scientifique\nThe Development of Socialism from Utopia to Science",
        summary:
          "Engels's short popular account of how socialism became “scientific”: from the utopian socialists, through Hegel's dialectic, to historical materialism and the theory of surplus value. More than any other text, it defined “Marxism” for the generation of the Second International.",
        body: `## Purpose

At Paul Lafargue's request Engels arranged three chapters of his polemic against Eugen Dühring as a pamphlet for French workers.[cite:src_mia_soc_utopian_1892]

## Main argument

1. **The utopians.** Saint-Simon, Fourier and Owen are treated with respect as brilliant critics whose remedies depended on reason and goodwill rather than on a class movement ([[tendency:early-socialism]]; [[thinker:saint-simon]]; [[thinker:fourier]]; [[thinker:owen]]).
2. **Dialectics.** Hegel's great merit was to represent the whole world "as a process"; materialism must take over this insight ([[concept:dialectics]]; [[thinker:hegel]]).
3. **Historical materialism and capitalism.** **Text.** "These two great discoveries, the materialistic conception of history and the revelation of the secret of capitalistic production through surplus-value, we owe to Marx. With these discoveries, Socialism became a science." ([[concept:historical-materialism]]; [[concept:surplus-value]])[cite:src_mia_soc_utopian, part II] The contradiction between social production and private appropriation is to be resolved by social ownership; the state "dies out" ([[concept:the-state]]).[cite:src_mia_soc_utopian, part III]

## Later influence

**Text.** In 1892 Engels claimed it circulated in ten languages and had been translated more often than the *Manifesto* or *Capital*.[cite:src_mia_soc_utopian_1892] It was the introduction to Marxism for Kautsky's and Plekhanov's generation ([[tendency:marxism]]).[cite:src_kolakowski]

## Interpretations

**Disputed.** Some scholars (notably Carver) argue that Engels's systematising — the language of "science" and "laws" of dialectics — shifted Marx's critical project towards positivism and determinism; others see substantial continuity between the two men ([[thinker:engels]]).[cite:src_carver_relationship][cite:src_hunt_engels]`,
        context: `Written while Engels, freed from business since 1869, became the chief interpreter of Marx's ideas to the growing socialist parties.[cite:src_hunt_engels]`,
      },
    },

    /* ——— Events ——— */
    {
      key: "event:first-international",
      title: "The First International is founded",
      fields: {
        subtitle: "International Working Men's Association",
        yearStart: 1864,
        yearEnd: 1876,
        dateLabel: "Founded 28 September 1864; dissolved 1876",
        place: "St Martin's Hall, London",
        eventType: "founding",
        summary:
          "British trade unionists and continental radicals founded the International Working Men's Association in London. Marx drafted its founding documents and led its General Council; it became the arena of the first great disputes within socialism.",
        body: `## What happened

A meeting at St Martin's Hall, London, on 28 September 1864 brought together British trade union leaders and French workers' delegates, with Italian, German and Polish émigrés. Marx was elected to its committee and drafted the *Inaugural Address* and the *Rules*.[cite:src_collins_abramsky][cite:src_mia_iwma]

**Text.** The Rules declared "That the emancipation of the working classes must be conquered by the working classes themselves".[cite:src_mia_iwma_rules] The Address welcomed the Ten Hours' Act and co-operative factories as victories of "the political economy of labor over the political economy of property", and concluded that "to conquer political power has … become the great duty of the working classes".[cite:src_mia_inaugural]

## Its course

Congresses met at Geneva (1866), Lausanne (1867), Brussels (1868) and Basel (1869); by 1868–69 the French followers of Proudhon were outvoted on collective ownership of land ([[thinker:proudhon]]). From 1868 Bakunin's supporters challenged the General Council ([[thinker:bakunin]]). After the Paris Commune and the Hague Congress of 1872 the organisation broke apart; it was formally dissolved in Philadelphia in 1876 ([[event:paris-commune]]; [[event:hague-congress]]).[cite:src_collins_abramsky][cite:src_hobsbawm_capital]`,
        significance: `The International was small in paid-up members — contemporary police estimates were greatly inflated — but it gave Marx a practical role, spread his ideas among labour leaders and made "the International" a symbol feared by governments. Its disputes over politics, the state and organisation shaped the later split between Marxists and anarchists.[cite:src_collins_abramsky][cite:src_morgan_first_international]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample event." }],
    },
    {
      key: "event:paris-commune",
      title: "The Paris Commune",
      fields: {
        subtitle: "18 March – 28 May 1871",
        yearStart: 1871,
        yearEnd: 1871,
        dateLabel: "18 March – 28 May 1871",
        place: "Paris",
        eventType: "uprising",
        summary:
          "After France's defeat by Prussia, Paris rose against the national government and for ten weeks governed itself through an elected Commune, before being crushed in the “Bloody Week”. Marxists and anarchists both claimed its lessons.",
        body: `## What happened

France's defeat in the Franco-Prussian War (1870), the four-month siege of Paris and an armistice negotiated by a conservative National Assembly left the capital's National Guard armed and radicalised. On 18 March 1871 Adolphe Thiers's government tried to remove the Guard's cannon from Montmartre; the attempt failed and the government withdrew to Versailles.[cite:src_tombs_commune]

A Commune elected on 26 March governed the city. Its members ranged from Jacobins and Blanquists to Proudhonists and members of the International. It separated church and state, banned night work in bakeries, cancelled rent arrears accumulated during the siege and ordered abandoned workshops to be surveyed for transfer to workers' co-operatives, while fighting a civil war.[cite:src_tombs_commune][cite:src_merriman_massacre]

The Versailles army entered Paris on 21 May. In the "Bloody Week" that followed, Communards burned public buildings and shot hostages, and the army carried out mass summary executions. Thousands more were imprisoned or deported to New Caledonia.[cite:src_merriman_massacre][cite:src_tombs_commune]`,
        significance: `**Text.** For Marx the Commune was "the political form at last discovered under which to work out the economical emancipation of labor" ([[text:civil-war-in-france]]).[cite:src_mia_civil_war, part III] Engels called it the dictatorship of the proletariat ([[concept:dictatorship-of-the-proletariat]]).[cite:src_mia_engels_1891_cwf] Bakunin and later anarchists saw it as a federalist, anti-state revolution ([[thinker:bakunin]]). Lenin modelled his account of the soviet state on it ([[text:the-state-and-revolution]]).[cite:src_state_revolution]

**Interpretation.** Historians have also read it as a patriotic and municipal revolt, a late episode of the French revolutionary tradition rather than the first proletarian revolution. **Text.** Marx himself later called it "merely the rising of a town under exceptional conditions".[cite:src_mia_nieuwenhuis_1881][cite:src_tombs_commune]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample event." },
        { type: "specialist-review", field: "body", note: "Casualty figures for the Bloody Week are disputed (older estimates of 20,000+ dead have been revised downward by Tombs and others); no figure is given. Check the list of Commune measures against Tombs." },
      ],
    },
    {
      key: "event:hague-congress",
      title: "The Hague Congress",
      fields: {
        subtitle: "Fifth Congress of the International",
        yearStart: 1872,
        yearEnd: 1872,
        dateLabel: "2–7 September 1872",
        place: "The Hague",
        eventType: "congress",
        summary:
          "The congress of the International — the only one Marx attended — that expelled Bakunin, committed the organisation to political action and moved the General Council to New York, effectively splitting the movement between Marxists and anti-authoritarians.",
        body: `## What happened

Marx and Engels attended in person. **Text.** The congress wrote into the Rules a resolution adopted earlier by the London Conference of 1871, ending: "The conquest of political power has therefore become the great duty of the working class" (29 votes to 5, with 8 abstentions).[cite:src_mia_hague_resolutions]

It strengthened the powers of the General Council, expelled Bakunin and James Guillaume over the secret Alliance of Socialist Democracy, and, on Engels's motion, moved the General Council to New York ([[thinker:bakunin]]).[cite:src_mia_hague_resolutions][cite:src_collins_abramsky]

After the congress Marx told a meeting in Amsterdam that in countries such as America and England workers might attain their goals by peaceful means.[cite:src_mia_amsterdam_1872]`,
        significance: `The anti-authoritarian federations met at Saint-Imier days later and formed their own International. The split fixed the opposition between "authoritarian" and "anti-authoritarian" socialism — on political parties, elections and the state — that runs through the history of the left ([[tendency:anarchism]]; [[tendency:marxism]]).[cite:src_kolakowski][cite:src_hobsbawm_capital]

**Disputed.** Partisans have long disagreed whether the expulsions were a defence against a secret faction or a manoeuvre by Marx to control the International.[cite:src_collins_abramsky]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample event." }],
    },
    {
      key: "event:gotha-unity-congress",
      title: "The Gotha Unity Congress",
      fields: {
        subtitle: "Foundation of the Socialist Workers' Party of Germany",
        yearStart: 1875,
        yearEnd: 1875,
        dateLabel: "22–27 May 1875",
        place: "Gotha",
        eventType: "congress",
        summary:
          "The congress at which the two rival German workers' parties — the Lassallean General German Workers' Association and the “Eisenach” Social Democratic Workers' Party — united, founding the party later known as the SPD.",
        body: `## What happened

The General German Workers' Association (founded by Ferdinand Lassalle in 1863) and the Social Democratic Workers' Party (founded at Eisenach in 1869 by August Bebel and Wilhelm Liebknecht) merged as the Socialist Workers' Party of Germany. The programme combined Lassallean demands — state-aided producers' co-operatives, the "iron law of wages", a "free people's state" — with democratic and Eisenach positions.[cite:src_lidtke_outlawed][cite:src_morgan_first_international]

Marx's objections ([[text:critique-of-the-gotha-programme]]) were not made public; the programme passed largely unchanged.[cite:src_mia_gotha]`,
        significance: `The united party survived the Anti-Socialist Laws (1878–90) ([[event:anti-socialist-laws]]), took the name Social Democratic Party of Germany in 1890 and adopted a Marxist programme at Erfurt in 1891 ([[event:erfurt-programme]]). It became the model party of the Second International ([[tendency:social-democracy]]).[cite:src_lidtke_outlawed][cite:src_steenson_kautsky]`,
      },
    },

    /* ——— Tendency ——— */
    {
      key: "tendency:marxism",
      title: "Marxism",
      fields: {
        yearStart: 1845,
        periodLabel: "1840s–",
        color: "red",
        aliases: "Marxian socialism\nScientific socialism\nMarxist",
        summary:
          "The body of theory and practice descending from Marx and Engels — historical materialism, the critique of political economy and the politics of working-class self-emancipation — and the many, often conflicting, traditions that claim it.",
        body: `## What it is

"Marxism" names both a body of ideas and a family of movements. Its core is usually taken to be:

- **historical materialism** — history explained through the development of production and class struggle ([[concept:historical-materialism]]);
- **the critique of political economy** — capitalism as a system of exploitation and accumulation driven by surplus value ([[concept:surplus-value]]; [[text:capital-volume-one]]);
- **a politics of working-class self-emancipation** aiming at communism ([[concept:communism]]).

## Who made "Marxism"?

**Text.** Engels reported Marx's remark about his French followers: "All I know is that I am not a Marxist."[cite:src_mia_engels_schmidt_1890] The word spread in the 1870s–80s, first among opponents in the International, then as a self-description. Engels's popular works, especially *Socialism: Utopian and Scientific*, did much to systematise it ([[text:socialism-utopian-and-scientific]]; [[thinker:engels]]).[cite:src_kolakowski][cite:src_stedman_jones_marx]

## Branches in this corpus

- **Second International orthodoxy** (Kautsky, Plekhanov) — an evolutionary, determinist Marxism of mass parties ([[tendency:social-democracy]]; [[thinker:kautsky]]; [[thinker:plekhanov]]).
- **Revisionism** (Bernstein) and its critics ([[thinker:bernstein]]; [[concept:revisionism]]).
- **The revolutionary left** (Luxemburg) and **Bolshevism** (Lenin) ([[thinker:luxemburg]]; [[tendency:leninism]]).

Later currents — Western Marxism, structural Marxism, Marxist feminism, anti-colonial Marxisms — lie beyond this introductory corpus.`,
        context: `Marxism became a mass doctrine through the German Social Democratic Party and the Second International (1889–1914), whose parties adopted Marxist programmes while working mostly through elections and trade unions ([[event:second-international]]).[cite:src_steenson_kautsky][cite:src_kolakowski]`,
        criticisms: `**Disputed.** Critics from many directions — liberal, anarchist, and within Marxism itself — dispute whether there is one Marxism or many, whether Engels and the Second International distorted Marx, and whether its predictions of polarisation and revolution have been refuted.[cite:src_kolakowski][cite:src_carver_relationship]`,
        legacy: `Marxism shaped labour movements, revolutions and states, and remains an influence across history, sociology, economics and philosophy. Its political record, especially in the communist states of the twentieth century, is the subject of fierce and continuing dispute.[cite:src_kolakowski][cite:src_bottomore_dictionary]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample tendency description. Its links to later sample tendencies (Western Marxism, structural Marxism etc.) are kept." },
        { type: "specialist-review", field: "body", note: "The origin of the word “Marxism” (first used by opponents in the International) is stated briefly; check against Haupt, Aspects of International Socialism, or Kołakowski." },
      ],
    },
  ],

  relationships: [
    // Authorship
    { from: "thinker:marx", type: "WROTE", to: "text:civil-war-in-france", note: "Drafted for the General Council of the International, April–May 1871.", source: "src_mia_civil_war", yearStart: 1871, weight: 3 },
    { from: "thinker:marx", type: "WROTE", to: "text:critique-of-the-gotha-programme", note: "Marginal notes sent to the Eisenach leadership in May 1875.", source: "src_mia_gotha", yearStart: 1875, weight: 3 },
    { from: "thinker:engels", type: "WROTE", to: "text:socialism-utopian-and-scientific", note: "Arranged from three chapters of Anti-Dühring, 1880.", source: "src_mia_soc_utopian_1892", yearStart: 1880, weight: 3 },
    { from: "thinker:engels", type: "EDITED", to: "text:critique-of-the-gotha-programme", note: "Engels published the notes in Die Neue Zeit in 1891.", source: "src_steenson_kautsky", yearStart: 1891, on: "text:critique-of-the-gotha-programme" },
    { from: "thinker:engels", type: "EDITED", to: "text:civil-war-in-france", note: "Engels's introduction to the 1891 German edition.", source: "src_mia_engels_1891_cwf", yearStart: 1891, on: "text:civil-war-in-france" },

    // Texts and events
    { from: "text:civil-war-in-france", type: "RESPONDED_TO", to: "event:paris-commune", note: "Written during the Commune and read to the General Council two days after its fall.", source: "src_mia_civil_war", weight: 3 },
    { from: "text:critique-of-the-gotha-programme", type: "RESPONDED_TO", to: "event:gotha-unity-congress", note: "A critique of the draft programme for the unity congress.", source: "src_mia_gotha", weight: 3 },
    { from: "text:civil-war-in-france", type: "DISCUSSES", to: "concept:the-state", note: "The working class cannot simply take over the ready-made state machinery.", source: "src_mia_civil_war", locator: "Part III" },
    { from: "text:civil-war-in-france", type: "DISCUSSES", to: "concept:dictatorship-of-the-proletariat", note: "Marx avoids the term; Engels's 1891 introduction applies it to the Commune.", source: "src_mia_engels_1891_cwf" },
    { from: "text:critique-of-the-gotha-programme", type: "DISCUSSES", to: "concept:communism", note: "The first and higher phases of communist society.", source: "src_mia_gotha", locator: "Part I", weight: 3 },
    { from: "text:critique-of-the-gotha-programme", type: "DISCUSSES", to: "concept:dictatorship-of-the-proletariat", note: "The political transition period between capitalism and communism.", source: "src_mia_gotha", locator: "Part IV" },
    { from: "text:critique-of-the-gotha-programme", type: "DISCUSSES", to: "concept:the-state", note: "Against the Lassallean “free state”.", source: "src_mia_gotha", locator: "Part IV" },
    { from: "text:socialism-utopian-and-scientific", type: "DISCUSSES", to: "concept:historical-materialism", note: "One of the “two great discoveries” Engels credits to Marx.", source: "src_mia_soc_utopian", locator: "Part II" },
    { from: "text:socialism-utopian-and-scientific", type: "DISCUSSES", to: "concept:dialectics", note: "Hegel's world “as a process”.", source: "src_mia_soc_utopian", locator: "Part II" },
    { from: "text:socialism-utopian-and-scientific", type: "CRITIQUED", to: "tendency:early-socialism", note: "Respectful critique of the utopians' reliance on reason and benefactors.", source: "src_mia_soc_utopian", locator: "Part I" },
    { from: "text:socialism-utopian-and-scientific", type: "DISCUSSES", to: "concept:the-state", note: "The state “dies out”.", source: "src_mia_soc_utopian", locator: "Part III" },
    { from: "text:the-german-ideology", type: "DISCUSSES", to: "concept:communism", note: "Communism as “the real movement which abolishes the present state of things”.", source: "src_mia_german_ideology", locator: "Part I", on: "concept:communism" },
    { from: "text:communist-manifesto", type: "DISCUSSES", to: "concept:communism", note: "Section II sets out the Communists' aims.", source: "src_manifesto_moore", locator: "Section II", on: "concept:communism" },

    // Concepts
    { from: "thinker:marx", type: "DEVELOPED", to: "concept:dictatorship-of-the-proletariat", note: "Used in 1850, 1852 and 1875.", source: "src_draper_dictatorship", weight: 3, on: "concept:dictatorship-of-the-proletariat" },
    { from: "thinker:marx", type: "DEVELOPED", to: "concept:communism", note: "Adopted the term in 1843–44; theorised it as movement and goal.", source: "src_mia_german_ideology", weight: 3, on: "concept:communism" },
    { from: "thinker:engels", type: "DEVELOPED", to: "concept:the-state", note: "The state “dies out”; Origin of the Family (1884).", source: "src_mia_soc_utopian", on: "concept:the-state" },
    { from: "concept:dictatorship-of-the-proletariat", type: "PRESUPPOSES", to: "concept:the-state", note: "A transitional form of state power.", source: "src_mia_gotha" },
    { from: "concept:dictatorship-of-the-proletariat", type: "PRESUPPOSES", to: "concept:class-struggle", note: "Marx presented it as the outcome of class struggle.", source: "src_mia_weydemeyer_1852" },
    { from: "concept:communism", type: "PRESUPPOSES", to: "concept:class", note: "Communism is defined as the abolition of classes.", source: "src_manifesto_moore" },
    { from: "concept:dictatorship-of-the-proletariat", type: "RELATED_TO", to: "concept:communism", note: "The political transition to communist society.", source: "src_mia_gotha" },
    { from: "concept:communism", type: "RELATED_TO", to: "concept:alienation", note: "The 1844 Manuscripts present communism as the overcoming of alienation.", source: "src_wood_marx" },
    { from: "concept:the-state", type: "RELATED_TO", to: "concept:class", note: "The state as connected to class division.", source: "src_manifesto_moore", on: "concept:the-state" },

    // Events
    { from: "thinker:marx", type: "PARTICIPATED_IN", to: "event:first-international", note: "Member of the General Council; drafted the Address and Rules.", source: "src_collins_abramsky", yearStart: 1864, yearEnd: 1872, weight: 3, on: "event:first-international" },
    { from: "thinker:engels", type: "PARTICIPATED_IN", to: "event:first-international", note: "On the General Council from 1870 as corresponding secretary for several countries.", source: "src_hunt_engels", yearStart: 1870, yearEnd: 1872, on: "event:first-international" },
    { from: "thinker:marx", type: "PARTICIPATED_IN", to: "event:hague-congress", note: "The only congress of the International Marx attended.", source: "src_mia_hague_resolutions", yearStart: 1872, on: "event:hague-congress" },
    { from: "thinker:engels", type: "PARTICIPATED_IN", to: "event:hague-congress", note: "Moved the transfer of the General Council to New York.", source: "src_collins_abramsky", yearStart: 1872, on: "event:hague-congress" },
    { from: "event:first-international", type: "ASSOCIATED_WITH", to: "thinker:proudhon", note: "French Proudhonists were a major current in its early congresses.", source: "src_collins_abramsky", on: "event:first-international", basis: "interpretive" },
    { from: "event:first-international", type: "PRECEDES", to: "event:paris-commune", note: "Members of the International took part in the Commune.", source: "src_collins_abramsky", on: "event:first-international" },
    { from: "event:paris-commune", type: "PRECEDES", to: "event:hague-congress", note: "The repression after the Commune sharpened the dispute within the International.", source: "src_collins_abramsky", on: "event:paris-commune" },
    { from: "event:paris-commune", type: "INFLUENCED", to: "concept:dictatorship-of-the-proletariat", note: "Engels identified the Commune as the dictatorship of the proletariat.", source: "src_mia_engels_1891_cwf", on: "event:paris-commune" },
    { from: "event:paris-commune", type: "INFLUENCED", to: "concept:the-state", note: "Marx drew from it that the ready-made state machinery cannot simply be taken over.", source: "src_mia_manifesto_1872", on: "event:paris-commune" },
    { from: "event:revolutions-of-1848", type: "PRECEDES", to: "event:first-international", note: "The International revived organisation after the defeats of 1848–49.", source: "src_hobsbawm_capital", on: "event:first-international" },
    { from: "event:first-international", type: "PRECEDES", to: "event:gotha-unity-congress", note: "The Eisenach party was affiliated to the International.", source: "src_morgan_first_international", on: "event:gotha-unity-congress" },

    // Influence on later texts and thinkers
    { from: "text:civil-war-in-france", type: "INFLUENCED", to: "text:the-state-and-revolution", note: "Lenin's argument is built on Marx's account of the Commune.", source: "src_state_revolution", weight: 3, on: "text:civil-war-in-france" },
    { from: "text:critique-of-the-gotha-programme", type: "INFLUENCED", to: "text:the-state-and-revolution", note: "Lenin's chapter on the economic basis of the withering away of the state.", source: "src_state_revolution", locator: "Ch. 5", on: "text:critique-of-the-gotha-programme" },
    { from: "text:socialism-utopian-and-scientific", type: "INFLUENCED", to: "tendency:marxism", note: "The most widely read introduction to Marxism in the 1880s–1900s.", source: "src_kolakowski", weight: 3, on: "text:socialism-utopian-and-scientific" },
    { from: "thinker:marx", type: "CRITIQUED", to: "text:statism-and-anarchy", note: "Private notes on Bakunin's book, 1874–75.", source: "src_mia_bakunin_conspectus", yearStart: 1874 },
    { from: "thinker:engels", type: "MEMBER_OF", to: "tendency:marxism", note: "Co-founder and chief systematiser after 1883.", source: "src_hunt_engels", on: "tendency:marxism" },
    { from: "tendency:marxism", type: "CONTRASTS_WITH", to: "tendency:anarchism", note: "On political action, parties and the state, from the split of 1872.", source: "src_mia_hague_resolutions", on: "tendency:marxism" },
    { from: "tendency:early-socialism", type: "INFLUENCED", to: "tendency:marxism", note: "Engels presents scientific socialism as building on the utopians.", source: "src_mia_soc_utopian", on: "tendency:marxism" },
    { from: "tendency:classical-political-economy", type: "INFLUENCED", to: "tendency:marxism", note: "Marxism's economics began as a critique of Smith and Ricardo.", source: "src_heinrich_capital", on: "tendency:marxism" },
  ],

  excerpts: [
    {
      key: "cwf-ready-made",
      entity: "text:civil-war-in-france",
      speaker: "thinker:marx",
      text: "text:civil-war-in-france",
      body: "But the working class cannot simply lay hold of the ready-made state machinery, and wield it for its own purposes.",
      source: "src_mia_civil_war",
      locator: "Part III",
      note: "Quoted again by Marx and Engels in their 1872 preface to the Manifesto.",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1871/civil-war-france/ch05.htm",
    },
    {
      key: "cwf-political-form",
      entity: "event:paris-commune",
      speaker: "thinker:marx",
      text: "text:civil-war-in-france",
      body: "It was essentially a working class government, the product of the struggle of the producing against the appropriating class, the political form at last discovered under which to work out the economical emancipation of labor.",
      source: "src_mia_civil_war",
      locator: "Part III",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1871/civil-war-france/ch05.htm",
    },
    {
      key: "nieuwenhuis-commune",
      entity: "event:paris-commune",
      speaker: "thinker:marx",
      body: "Perhaps you will point to the Paris Commune; but apart from the fact that this was merely the rising of a town under exceptional conditions, the majority of the Commune was in no sense socialist, nor could it be.",
      source: "src_mia_nieuwenhuis_1881",
      locator: "Letter of 22 February 1881",
      note: "A private letter, ten years after the address on the Commune.",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1881/letters/81_02_22.htm",
    },
    {
      key: "engels-1891-dictatorship",
      entity: "concept:dictatorship-of-the-proletariat",
      speaker: "thinker:engels",
      text: "text:civil-war-in-france",
      body: "Well and good, gentlemen, do you want to know what this dictatorship looks like? Look at the Paris Commune. That was the Dictatorship of the Proletariat.",
      source: "src_mia_engels_1891_cwf",
      locator: "Introduction to the 1891 edition, closing paragraph",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1871/civil-war-france/postscript.htm",
    },
    {
      key: "gotha-transition",
      entity: "concept:dictatorship-of-the-proletariat",
      speaker: "thinker:marx",
      text: "text:critique-of-the-gotha-programme",
      body: "Between capitalist and communist society there lies the period of the revolutionary transformation of the one into the other. Corresponding to this is also a political transition period in which the state can be nothing but the revolutionary dictatorship of the proletariat.",
      source: "src_mia_gotha",
      locator: "Part IV",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1875/gotha/ch04.htm",
    },
    {
      key: "gotha-needs",
      entity: "concept:communism",
      speaker: "thinker:marx",
      text: "text:critique-of-the-gotha-programme",
      body: "In a higher phase of communist society, after the enslaving subordination of the individual to the division of labor, and therewith also the antithesis between mental and physical labor, has vanished; after labor has become not only a means of life but life's prime want; after the productive forces have also increased with the all-around development of the individual, and all the springs of co-operative wealth flow more abundantly – only then can the narrow horizon of bourgeois right be crossed in its entirety and society inscribe on its banners: From each according to his ability, to each according to his needs!",
      source: "src_mia_gotha",
      locator: "Part I",
      note: "The slogan was not Marx's invention; it circulated among French socialists (it is often traced to Louis Blanc).",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1875/gotha/ch01.htm",
    },
    {
      key: "german-ideology-real-movement",
      entity: "concept:communism",
      speaker: "thinker:marx",
      text: "text:the-german-ideology",
      body: "Communism is for us not a state of affairs which is to be established, an ideal to which reality [will] have to adjust itself. We call communism the real movement which abolishes the present state of things.",
      source: "src_mia_german_ideology",
      locator: "Part I",
      note: "Joint manuscript of Marx and Engels (1845–46); unpublished in their lifetimes.",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1845/german-ideology/ch01a.htm",
    },
    {
      key: "engels-dies-out",
      entity: "concept:the-state",
      speaker: "thinker:engels",
      text: "text:socialism-utopian-and-scientific",
      body: "State interference in social relations becomes, in one domain after another, superfluous, and then dies out of itself; the government of persons is replaced by the administration of things, and by the conduct of processes of production. The State is not \"abolished\". It dies out.",
      source: "src_mia_soc_utopian",
      locator: "Part III",
      note: "The same passage appears in Anti-Dühring (1878), part III, ch. 2. The idea of replacing government by administration is often traced to Saint-Simon.",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1880/soc-utop/ch03.htm",
    },
    {
      key: "iwma-rules-emancipation",
      entity: "event:first-international",
      speaker: "thinker:marx",
      body: "That the emancipation of the working classes must be conquered by the working classes themselves, that the struggle for the emancipation of the working classes means not a struggle for class privileges and monopolies, but for equal rights and duties, and the abolition of all class rule",
      source: "src_mia_iwma_rules",
      locator: "Preamble",
      note: "Drafted by Marx and adopted by the International; the Rules were revised in 1871.",
      archiveUrl: "https://www.marxists.org/history/international/iwma/documents/1864/rules.htm",
    },
    {
      key: "soc-utopian-two-discoveries",
      entity: "text:socialism-utopian-and-scientific",
      speaker: "thinker:engels",
      text: "text:socialism-utopian-and-scientific",
      body: "These two great discoveries, the materialistic conception of history and the revelation of the secret of capitalistic production through surplus-value, we owe to Marx. With these discoveries, Socialism became a science.",
      source: "src_mia_soc_utopian",
      locator: "Part II, closing paragraph",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1880/soc-utop/ch02.htm",
    },
    {
      key: "hague-political-power",
      entity: "event:hague-congress",
      body: "The conquest of political power has therefore become the great duty of the working class.",
      source: "src_mia_hague_resolutions",
      locator: "Resolution I (Article 7a of the General Rules)",
      note: "Adopted by 29 votes to 5, with 8 abstentions.",
      archiveUrl: "https://www.marxists.org/history/international/iwma/documents/1872/hague-conference/resolutions.htm",
    },
    {
      key: "engels-not-a-marxist",
      entity: "tendency:marxism",
      speaker: "thinker:engels",
      body: "Just as Marx used to say, commenting on the French “Marxists” of the late [18]70s: “All I know is that I am not a Marxist.”",
      source: "src_mia_engels_schmidt_1890",
      locator: "Letter of 5 August 1890",
      note: "Engels's report of a remark by Marx, not a text by Marx himself.",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1890/letters/90_08_05.htm",
    },
  ],
};
