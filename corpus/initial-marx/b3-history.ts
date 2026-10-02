import type { CorpusBatch, CorpusSource } from "../../src/lib/corpus/types";

const MIA = "Marxists Internet Archive transcription (marxists.org). Check wording against a printed edition before quoting.";
const mia = (id: string, title: string, author: string, date: string, url: string, expect: string): CorpusSource => ({
  id,
  title,
  author,
  publicationDate: date,
  publisher: "Marxists Internet Archive",
  url,
  sourceType: "PRIMARY",
  notes: MIA,
  check: { kind: "url", expect },
});

/**
 * Batch 3 — The materialist conception of history, class and revolution:
 * the Manifesto, 1848, the Eighteenth Brumaire and the 1859 Preface.
 */
export const batch3: CorpusBatch = {
  id: "b3",
  title: "History, class and revolution: the Manifesto to the 1859 Preface",
  sources: [
    mia("src_mia_class_struggles_france", "The Class Struggles in France, 1848 to 1850", "Karl Marx", "1850", "https://www.marxists.org/archive/marx/works/1850/class-struggles-france/ch03.htm", "locomotives of history"),
    mia("src_mia_address_1850", "Address of the Central Committee to the Communist League (March 1850)", "Karl Marx and Frederick Engels", "1850", "https://www.marxists.org/archive/marx/works/1847/communist-league/1850-ad1.htm", "revolution permanent"),
    mia("src_mia_weydemeyer_1852", "Letter to Joseph Weydemeyer, 5 March 1852", "Karl Marx", "1852", "https://www.marxists.org/archive/marx/works/1852/letters/52_03_05-ab.htm", "no credit is due to me"),
    mia("src_mia_amsterdam_1872", "Speech at the Amsterdam meeting (“La Liberté speech”), 8 September 1872", "Karl Marx", "1872", "https://www.marxists.org/archive/marx/works/1872/09/08.htm", "peaceful means"),
    mia("src_mia_letter_1877", "Letter to the editorial board of Otechestvennye Zapiski", "Karl Marx", "written 1877 [published 1886]", "https://www.marxists.org/archive/marx/works/1877/11/russia.htm", "historico-philosophic theory"),
  ],
  entities: [
    /* ——— Concepts: history ——— */
    {
      key: "concept:historical-materialism",
      title: "Historical materialism",
      fields: {
        aliases: "Materialist conception of history\nMaterialist interpretation of history",
        summary:
          "The approach to history that starts from how people produce their material lives: the organisation of production shapes social relations, politics and ideas, and changes in production drive historical change.",
        yearStart: 1845,
        brief: `Historical materialism is the idea that to understand a society, you start by asking how people in it make a living — who works, who owns the tools and land, who takes the surplus. Those arrangements shape politics, law and ideas, and when they stop working, societies change.`,
        standard: `Marx and Engels first worked out the "materialist conception of history" in 1845–46 ([[text:the-german-ideology]]). Its most famous statement is a single paragraph in the Preface to *A Contribution to the Critique of Political Economy* (1859), which Marx called the "guiding principle" of his studies ([[text:contribution-critique-political-economy]]).[cite:src_mia_preface_1859]

**Text.** In that paragraph:

- In producing their lives, people enter into **relations of production** that correspond to a stage in the development of their **productive forces** ([[concept:relations-of-production]]; [[concept:productive-forces]]).
- These relations form the **economic structure** of society, "the real foundation, on which arises a legal and political superstructure".
- "It is not the consciousness of men that determines their existence, but their social existence that determines their consciousness."
- At a certain stage the productive forces come into conflict with the relations of production, which "turn into their fetters. Then begins an era of social revolution."[cite:src_mia_preface_1859]

The name "historical materialism" came later: Engels used it from the 1890s for the view of history that seeks the ultimate cause of historical events in the economic development of society ([[concept:materialism]]).[cite:src_mia_soc_utopian]`,
        deep: `### Three readings

**Interpretation.** (1) **Technological or "productive-force" determinism**: the development of the productive forces explains the character of the relations of production, which in turn explain the superstructure. G. A. Cohen's *Karl Marx's Theory of History* (1978) defended a precise version, in which the explanations are *functional*: relations exist because they promote the development of the productive forces.[cite:src_cohen_history] (2) **Class-struggle primacy**: history is made by conflicts between classes, and the forces of production develop within, not independently of, those conflicts. (3) **A guiding thread for research** rather than a general theory — the reading Marx himself suggested when he called the 1859 paragraph a "guiding principle".[cite:src_sep_marx]

### Determination "in the last instance"

**Text.** Engels, in his letter to Joseph Bloch (1890), wrote that "the ultimately determining element in history is the production and reproduction of real life" — but that whoever twists this into saying the economic element is the *only* determining one makes it meaningless. Political, legal and ideological forms also "exercise their influence" on historical struggles.[cite:src_mia_engels_bloch]

**Disputed.** Whether this clarifies Marx or retreats from him is debated: critics see it as making the theory unfalsifiable, defenders as a necessary statement of its explanatory structure ([[debate:what-is-historical-materialism]]).[cite:src_kolakowski][cite:src_cohen_history]

### A general path?

**Text.** The 1859 Preface lists "the Asiatic, ancient, feudal and modern bourgeois modes of production" as "epochs marking progress". But in an 1877 letter Marx protested against turning his sketch of the genesis of capitalism in Western Europe into an "historico-philosophic theory" of the general path imposed on every people ([[concept:mode-of-production]]).[cite:src_mia_preface_1859][cite:src_mia_letter_1877]`,
        history: `Formulated in 1845–46, first published in outline in *The Poverty of Philosophy* (1847) and the *Communist Manifesto* (1848), and stated in its classic form in 1859. In the 1880s–90s Engels, Kautsky, Plekhanov and Antonio Labriola turned it into the theoretical foundation of the socialist parties ([[tendency:marxism]]). Stalin's *Dialectical and Historical Materialism* (1938) codified a five-stage scheme (primitive communism, slavery, feudalism, capitalism, socialism) that became Soviet orthodoxy.[cite:src_kolakowski]`,
        interpretations: `- **Second International orthodoxy** (Kautsky, Plekhanov): a science of necessary historical development ([[thinker:kautsky]]; [[thinker:plekhanov]]).
- **Bernstein**: criticised "materialist" determinism and gave ethical and ideological factors more independence ([[thinker:bernstein]]).
- **Lenin and Luxemburg**: emphasised political struggle and organisation within the framework.
- **Analytical Marxism** (Cohen and his critics): precise reconstruction and testing.
- **Historians** (Hobsbawm, E. P. Thompson): a framework for research rather than a law.[cite:src_kolakowski][cite:src_cohen_history]`,
        criticisms: `Critics argue that the theory is either too vague to test or, when made precise, false: ideas, religion, war and the state have shaped economic development, not merely reflected it (Max Weber's study of Protestantism and capitalism is the classic counter-case). Others object that the base–superstructure metaphor is mechanical, or that functional explanations need mechanisms the theory does not supply.[cite:src_kolakowski][cite:src_cohen_history][cite:src_sep_marx]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample concept." },
        { type: "missing-source", field: "criticisms", note: "Weber's Protestant Ethic is mentioned without a citation; add the work itself or a secondary source on Weber's critique." },
      ],
    },
    {
      key: "concept:productive-forces",
      title: "Productive forces",
      fields: {
        aliases: "Forces of production\nProduktivkräfte",
        summary:
          "Everything that goes into producing: tools, machines, land and raw materials, together with human labour-power and its skills and knowledge. Their development is central to Marx's account of historical change.",
        yearStart: 1845,
        brief: `Productive forces are what a society can produce with: its tools, machines, land and materials, and the skills and knowledge of the people working with them. A society with steam engines and trained engineers has more developed productive forces than one with hand looms.`,
        standard: `The productive forces combine the **means of production** — instruments, machines, infrastructure, land, raw materials — and human **labour-power**, including skills, knowledge and, in modern industry, science applied to production ([[concept:labour-power]]).[cite:src_cohen_history]

**Text.** In the 1859 Preface, relations of production "correspond to a definite stage of development" of the productive forces, and historical change comes when the forces outgrow the relations, which turn into "fetters" ([[concept:relations-of-production]]).[cite:src_mia_preface_1859]

In the *Communist Manifesto*, Marx and Engels praised the bourgeoisie for having created "more massive and more colossal productive forces than have all preceding generations together" — and argued that those same forces now rebel against bourgeois property relations ([[text:communist-manifesto]]).[cite:src_manifesto_moore, section I]`,
        deep: `### What counts?

**Interpretation.** Marx's usage is not always consistent. Cohen argued that productive forces are only those things used *to* produce — means of production and labour-power — and that forms of cooperation belong to the relations of production; others include the organisation of work, or science as such.[cite:src_cohen_history]

### The "primacy" thesis

**Disputed.** Does the development of the productive forces explain the relations of production (the *development thesis* and *primacy thesis* as Cohen formulates them)? Critics argue that capitalism arose from changes in class relations — the dispossession of peasants, the rise of wage labour — before it transformed technology, so that relations explain forces at least as much as the reverse ([[debate:what-is-historical-materialism]]).[cite:src_cohen_history][cite:src_kolakowski]

### Ecology

Later critics and sympathisers alike have asked whether treating the growth of productive forces as the measure of progress ignores natural limits; some recent readers find in Marx's later writings on soil exhaustion a more ecological view.[cite:src_sep_marx]`,
        history: `The concept entered Marx's vocabulary from political economy (Friedrich List spoke of "productive powers") and was set out in *The German Ideology* and *The Poverty of Philosophy*.[cite:src_mia_german_ideology][cite:src_mia_poverty_philosophy]`,
        interpretations: `Orthodox Marxism of the Second International and Soviet Marxism stressed productive forces as the motor of history; Western Marxists and many historians gave priority to relations and struggle; analytical Marxism made the question precise.[cite:src_kolakowski][cite:src_cohen_history]`,
        criticisms: `Critics argue that the concept bundles together technology, knowledge and organisation so loosely that "their development" cannot do independent explanatory work.[cite:src_cohen_history]`,
      },
    },
    {
      key: "concept:relations-of-production",
      title: "Relations of production",
      fields: {
        aliases: "Production relations\nProduktionsverhältnisse\nEconomic structure",
        summary:
          "The social relations people enter into in producing — above all, who owns or controls the means of production and labour, and who appropriates the surplus. Together they make up society's economic structure.",
        yearStart: 1845,
        brief: `Relations of production are the social side of making things: who owns the land and factories, who works for whom, and who keeps the surplus. A slave and a master, a serf and a lord, a worker and an employer stand in different relations of production.`,
        standard: `**Text.** In the 1859 Preface, people "inevitably enter into definite relations, which are independent of their will, namely relations of production", and "the totality of these relations of production constitutes the economic structure of society".[cite:src_mia_preface_1859]

The key relations concern **control**: over the means of production, over labour-power, and over the products. Under slavery the producer is owned; under serfdom the producer works the lord's land or pays dues; under capitalism the producer is legally free but, owning no means of production, must sell labour-power for a wage ([[concept:labour-power]]; [[concept:class]]).

Property law, in Marx's terms, is the "legal expression" of relations of production — which is why he distinguished the economic structure from the legal and political superstructure built on it.[cite:src_mia_preface_1859]`,
        deep: `### Effective control and legal title

**Interpretation.** G. A. Cohen argued that relations of production are relations of *effective power* over persons and productive forces, not legal ownership as such; otherwise the base–superstructure distinction collapses, since the "base" would already contain law.[cite:src_cohen_history]

### Fetters

**Text.** The relations of production at first promote the development of the productive forces and then "turn into their fetters", opening an era of social revolution ([[concept:revolution]]).[cite:src_mia_preface_1859]

**Disputed.** What counts as fettering — slower growth than an alternative would allow, or absolute stagnation? The answer matters for whether capitalism can be said to fetter production while it continues to grow.[cite:src_cohen_history]`,
        history: `The term appears in *The Poverty of Philosophy* (1847), where Marx criticises Proudhon for treating economic categories as eternal ideas rather than as "the theoretical expressions, the abstractions of the social relations of production".[cite:src_mia_poverty_philosophy]`,
        interpretations: `Analytical Marxists (Cohen) treat relations as relations of effective control; Althusser and the structuralists as a structure that "assigns" places to agents; historians such as Robert Brenner emphasise the "social-property relations" that shape economic development.[cite:src_kolakowski][cite:src_cohen_history]`,
        criticisms: `Critics question whether relations of production can be identified independently of law and politics, and whether property relations are best seen as economic at all.[cite:src_cohen_history]`,
      },
    },
    {
      key: "concept:mode-of-production",
      title: "Mode of production",
      fields: {
        aliases: "Produktionsweise\nSocial formation",
        summary:
          "A historically specific combination of productive forces and relations of production — such as feudalism or capitalism — that gives a society its basic character.",
        yearStart: 1845,
        brief: `A mode of production is a whole way of organising production — like feudalism, where peasants worked the land and handed a share to their lords, or capitalism, where workers sell their labour for wages to the owners of businesses. Marx thought each has its own logic, conflicts and limits.`,
        standard: `A mode of production combines a level of development of the productive forces with a set of relations of production ([[concept:productive-forces]]; [[concept:relations-of-production]]). Each mode has its own way of extracting a surplus from the direct producers and therefore its own classes ([[concept:class]]).

**Text.** The 1859 Preface names "the Asiatic, ancient, feudal and modern bourgeois modes of production" as "epochs marking progress in the economic development of society", and calls the bourgeois mode of production "the last antagonistic form of the social process of production".[cite:src_mia_preface_1859]

The capitalist mode of production is the subject of *Capital*: production of commodities for profit by wage labourers employed by capitalists ([[text:capital-volume-one]]; [[concept:capital]]).`,
        deep: `### Not a ladder

**Text.** Marx rejected the idea that every society must pass through the same stages: in 1877 he objected to turning his sketch of the genesis of capitalism in Western Europe into an "historico-philosophic theory" of the general path imposed by fate on every people.[cite:src_mia_letter_1877] His late notes on Russia considered whether the peasant commune might allow a path to socialism that bypassed capitalist development ([[debate:revolution-in-russia]]).[cite:src_shanin_late_marx]

**Disputed.** The "Asiatic mode of production" in particular has been controversial: Marx's characterisation of Asian societies drew on European sources now considered unreliable, and Soviet scholars suppressed the concept because it complicated the official sequence of stages.[cite:src_kolakowski]

### Mode of production and social formation

Later Marxists, especially structuralists, distinguished the abstract *mode* from the concrete *social formation*, in which several modes coexist — capitalist industry alongside peasant agriculture, for instance.[cite:src_kolakowski]`,
        history: `The concept is prepared in *The German Ideology* (forms of property corresponding to stages of the division of labour) and in the *Grundrisse* section on pre-capitalist economic formations ([[text:grundrisse]]).[cite:src_mia_german_ideology][cite:src_grundrisse_nicolaus]`,
        interpretations: `Soviet Marxism-Leninism codified five modes in a fixed sequence; Western historians and anthropologists debated the transition from feudalism to capitalism and the classification of non-European societies.[cite:src_kolakowski]`,
        criticisms: `Critics argue that modes of production are ideal types that rarely exist in pure form, and that the stage scheme reflects nineteenth-century European assumptions about progress.[cite:src_sep_marx]`,
      },
      flags: [{ type: "specialist-review", field: "deep", note: "The account of the Asiatic mode of production controversy is compressed; a specialist in Marxist historiography should check it." }],
    },

    /* ——— Concepts: class ——— */
    {
      key: "concept:class",
      title: "Class",
      fields: {
        aliases: "Social class\nClass position",
        summary:
          "A group defined by its place in the relations of production — above all by whether it owns the means of production or must work for those who do.",
        yearStart: 1845,
        brief: `For Marx a class is not defined by income or lifestyle but by a group's position in production: whether you own businesses, land or capital, or have to sell your ability to work. Classes with opposed positions have opposed interests.`,
        standard: `Marx did not invent the idea of class. **Text.** In 1852 he wrote that "no credit is due to me for discovering the existence of classes in modern society or the struggle between them", crediting bourgeois historians and economists. What he claimed was new was to show that classes are bound up with "particular historical phases in the development of production" ([[concept:class-struggle]]).[cite:src_mia_weydemeyer_1852]

In Marx's sense, a class is defined by its relation to the means of production ([[concept:relations-of-production]]). In capitalism the basic classes are the **bourgeoisie**, who own the means of production and employ wage labour, and the **proletariat**, who own no means of production and must sell their labour-power ([[concept:bourgeoisie]]; [[concept:proletariat]]). Landowners, peasants, artisans, shopkeepers and professionals complicate the picture.

**Text.** The *Communist Manifesto* predicted that society was splitting "into two great hostile camps" ([[text:communist-manifesto]]).[cite:src_manifesto_moore, section I]`,
        deep: `### Class position and class action

**Text.** In *The Eighteenth Brumaire* Marx observed that French smallholding peasants share conditions of life but are isolated from one another — "much as potatoes in a sack form a sack of potatoes". Insofar as their conditions separate them from other classes they form a class; insofar as there is no community or political organisation among them, they do not ([[text:eighteenth-brumaire]]).[cite:src_mia_brumaire, ch. VII]

**Interpretation.** This distinction — later summarised, in a phrase Marx did not quite use, as a class "in itself" and a class "for itself" — became central to debates about class consciousness ([[concept:class-consciousness]]).[cite:src_kolakowski]

### The unfinished chapter

The manuscript Engels edited as the third volume of *Capital* breaks off at the start of a chapter on "Classes", after a few paragraphs. Marx never gave a systematic definition.[cite:src_heinrich_capital]

### Middle classes

**Disputed.** The polarisation predicted in the *Manifesto* is often contrasted with the growth of salaried middle classes; defenders reply that Marx also discussed the multiplication of intermediate strata, and that most salaried employees are wage labourers in Marx's sense.[cite:src_kolakowski][cite:src_sep_marx]`,
        history: `Earlier theorists — Smith's three classes of landlords, capitalists and labourers, the French Restoration historians' account of class conflict — supplied the starting point ([[tendency:classical-political-economy]]).[cite:src_mia_weydemeyer_1852]`,
        interpretations: `Max Weber distinguished class (market position) from status and party; twentieth-century Marxists (Lukács, E. P. Thompson) stressed class as formed in struggle and experience; analytical Marxists (Erik Olin Wright) developed models of "contradictory class locations".[cite:src_kolakowski]`,
        criticisms: `Critics argue that class is one axis of inequality and identity among many — nation, religion, gender, race — and that Marx's two-class model fits poorly with modern occupational structures.[cite:src_sep_marx]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample concept." },
        { type: "missing-source", field: "interpretations", note: "Weber, Thompson and Wright are named without direct citations; add their works or a secondary survey." },
      ],
    },
    {
      key: "concept:class-struggle",
      title: "Class struggle",
      fields: {
        aliases: "Class conflict\nClass war",
        summary:
          "Conflict between classes with opposed interests, which Marx and Engels made the thread of written history and the means by which capitalism would be overcome.",
        yearStart: 1848,
        brief: `Class struggle is the conflict between groups with opposed economic interests — masters and slaves, lords and serfs, employers and workers. Marx and Engels argued that these conflicts drive history, and that workers' struggles could end class society altogether.`,
        standard: `**Text.** The first section of the *Communist Manifesto* opens: "The history of all hitherto existing society is the history of class struggles." Freeman and slave, patrician and plebeian, lord and serf, guild-master and journeyman have stood "in constant opposition to one another", in a fight that each time ended "either in a revolutionary reconstitution of society at large, or in the common ruin of the contending classes" ([[text:communist-manifesto]]).[cite:src_manifesto_moore, section I]

Class struggle takes many forms: strikes and bargaining over wages and hours, political campaigns for laws such as the ten-hours bill, contests over ideas, and revolution ([[concept:revolution]]). Under capitalism the central struggle is between the bourgeoisie and the proletariat ([[concept:bourgeoisie]]; [[concept:proletariat]]).

**Text.** In 1852 Marx summarised what he thought new in his own work: that classes are tied to historical phases of production; that "the class struggle necessarily leads to the dictatorship of the proletariat"; and that this dictatorship is only the transition to a classless society ([[concept:dictatorship-of-the-proletariat]]).[cite:src_mia_weydemeyer_1852]`,
        deep: `### "Hitherto existing" history

Engels added a note in 1888: by "all history" was meant all *written* history; the prehistory of communal societies, little known in 1847, did not fit the formula.[cite:src_manifesto_moore, section I, note]

### Economic and political struggle

**Text.** The *Manifesto* insists that "every class struggle is a political struggle".[cite:src_manifesto_moore, section I] How economic struggles over wages become political struggles over the state — and whether they do so spontaneously — became one of the great questions of later Marxism ([[debate:class-consciousness]]; [[concept:spontaneity]]).

### Struggle and structure

**Disputed.** Is class struggle the motor of history (as the *Manifesto*'s first sentence suggests) or the means by which deeper contradictions between productive forces and relations work themselves out (as the 1859 Preface suggests)? Readers have stressed one or the other ([[concept:historical-materialism]]).[cite:src_cohen_history][cite:src_kolakowski]`,
        history: `The idea of history as class conflict owes much to French historians of the Restoration such as Augustin Thierry and François Guizot, whom Marx acknowledged.[cite:src_mia_weydemeyer_1852]`,
        interpretations: `Social democrats emphasised the organised, legal class struggle of unions and parties; Luxemburg its mass, spontaneous dimensions; Lenin its political leadership by a party ([[debate:reform-or-revolution]]; [[debate:spontaneity-and-organisation]]).[cite:src_kolakowski]`,
        criticisms: `Critics argue that class conflict has been contained or institutionalised in democratic states; that other conflicts — national, religious, ethnic — have often been more decisive; and that the expectation of a final, classless resolution is a secular eschatology.[cite:src_kolakowski][cite:src_walicki]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample concept." }],
    },
    {
      key: "concept:bourgeoisie",
      title: "Bourgeoisie",
      fields: {
        aliases: "Capitalist class\nBourgeois\nPetty bourgeoisie",
        summary:
          "In Marx's usage, the class that owns the means of production and employs wage labour — a class the Communist Manifesto credits with revolutionising the world.",
        yearStart: 1848,
        brief: `The bourgeoisie is the class that owns businesses — factories, banks, land used for profit — and employs other people's labour. Marx and Engels thought it had transformed the world more than any class before it, and that it was creating the conditions of its own downfall.`,
        standard: `**Text.** Engels's note to the 1888 English edition of the *Manifesto* defines the bourgeoisie as "the class of modern capitalists, owners of the means of social production and employers of wage labour".[cite:src_manifesto_moore, section I, note]

The word originally meant the burghers — town-dwellers — of medieval Europe. In French usage before Marx it denoted the propertied middle classes between nobility and people.[cite:src_williams_keywords]

The *Manifesto* is famously double-edged about this class ([[text:communist-manifesto]]). **Text.** "The bourgeoisie, historically, has played a most revolutionary part." It swept away feudal ties, created the world market and unprecedented productive forces, and made a world in which, in its famous phrase, "all that is solid melts into air". But it also reduced human relations to "naked self-interest" and called into existence the class that would overthrow it — "What the bourgeoisie therefore produces, above all, are its own grave-diggers" ([[concept:proletariat]]).[cite:src_manifesto_moore, section I]`,
        deep: `### Fractions of the bourgeoisie

In his political writings Marx distinguished fractions with different interests — financial aristocracy, industrial bourgeoisie, landed property — and showed them competing for control of the state ([[text:eighteenth-brumaire]]).[cite:src_mia_brumaire]

### The petty bourgeoisie

Small proprietors who work their own means of production — shopkeepers, artisans, small farmers — form a "petty bourgeoisie" that the *Manifesto* expected to sink into the proletariat. Its persistence has been a long-standing problem for Marxist class analysis ([[concept:class]]).[cite:src_manifesto_moore, section I]

### The state

**Text.** "The executive of the modern state is but a committee for managing the common affairs of the whole bourgeoisie."[cite:src_manifesto_moore, section I] Marx's later analyses of Bonapartism qualified this formula ([[concept:the-state]]).`,
        history: `The term carried French revolutionary meanings into German and English socialist usage in the 1840s.[cite:src_williams_keywords]`,
        interpretations: `Historians have debated whether "the bourgeoisie" made the French Revolution and whether capitalist development everywhere required a "bourgeois revolution" ([[event:french-revolution]]).[cite:src_hobsbawm_revolution]`,
        criticisms: `Critics argue that "the bourgeoisie" lumps together owners, managers and professionals with divergent interests, and that ownership and control have separated in modern corporations.[cite:src_kolakowski]`,
      },
    },
    {
      key: "concept:proletariat",
      title: "Proletariat",
      fields: {
        aliases: "Working class\nWage labourers\nLumpenproletariat",
        summary:
          "The class of wage labourers who own no means of production and must sell their labour-power to live — in Marx's account, the class whose self-emancipation would end class society.",
        yearStart: 1844,
        brief: `The proletariat is the working class in the modern sense: people who own no means of production and so must sell their ability to work for wages. Marx thought this class, concentrated by industry and organised by its own struggles, could overthrow capitalism.`,
        standard: `**Text.** Engels's 1888 note defines the proletariat as "the class of modern wage labourers who, having no means of production of their own, are reduced to selling their labour power in order to live" ([[concept:labour-power]]).[cite:src_manifesto_moore, section I, note]

The Latin *proletarii* were the poorest Roman citizens, who served the state only with their offspring (*proles*). In the 1830s and 1840s French and German writers used the word for the new propertyless poor.[cite:src_williams_keywords]

Marx first gave the proletariat a world-historical role in 1844, as the class "with radical chains" whose emancipation would be universal ([[text:critique-of-hegels-philosophy-of-right]]).[cite:src_mia_critique_hpr_intro] In the *Manifesto*, the proletariat is produced by capitalism itself, concentrated in factories, organised by its own struggles, and destined to become the ruling class ([[text:communist-manifesto]]).[cite:src_manifesto_moore, section II]`,
        deep: `### Self-emancipation

The General Rules of the First International, which Marx drafted, began from the principle that the emancipation of the working classes must be conquered by the working classes themselves ([[event:first-international]]).[cite:src_mia_iwma] How that principle relates to the leading role of parties and intellectuals became a central dispute after Marx ([[concept:vanguard-party]]).

### The lumpenproletariat

Marx was contemptuous of the "lumpenproletariat" — vagrants, discharged soldiers, criminals — whom he saw as available to reaction; Bonaparte's Society of 10 December recruited from it ([[text:eighteenth-brumaire]]).[cite:src_mia_brumaire]

### Immiseration

**Disputed.** Did Marx predict that workers would become absolutely poorer? Passages in *Capital* on the "general law of capitalist accumulation" speak of growing misery, but many scholars read this as relative impoverishment and insecurity rather than falling real wages. Bernstein's revisionism began partly from the evidence that real wages were rising ([[concept:revisionism]]; [[concept:accumulation]]).[cite:src_heinrich_capital][cite:src_gay_bernstein]`,
        history: `From the "class with radical chains" (1844) to the industrial working class of the *Manifesto* (1848) and the wage labourers of *Capital* (1867), the concept moved from philosophy to political economy. The mass socialist parties of the 1880s–1900s organised mainly skilled industrial workers ([[tendency:social-democracy]]).[cite:src_kolakowski]`,
        interpretations: `Debate has turned on who counts as proletarian (clerical and service workers, agricultural labourers), on whether peasants could be revolutionary allies — central in Russia ([[debate:revolution-in-russia]]) — and on whether the proletariat is the revolutionary subject at all.[cite:src_kolakowski]`,
        criticisms: `Critics point to the division of workers by skill, nation, race and gender; to the integration of labour movements into national politics, dramatically in 1914 ([[event:war-credits-1914]]); and to the decline of industrial employment in rich countries.[cite:src_haupt_war][cite:src_sep_marx]`,
      },
      flags: [{ type: "missing-source", field: "deep", note: "The immiseration debate should cite the specific chapter of Capital (ch. 25) and a secondary discussion of absolute vs relative immiseration." }],
    },
    {
      key: "concept:revolution",
      title: "Revolution",
      fields: {
        aliases: "Social revolution\nPolitical revolution\nPermanent revolution",
        summary:
          "The transformation of a society's basic relations, and the seizure of political power that may accompany it. Marx distinguished social from merely political revolution and saw revolutions as the “locomotives of history”.",
        yearStart: 1848,
        brief: `For Marx a revolution is more than a change of government. A social revolution changes who owns and controls the economy and therefore who holds power. He thought such revolutions happen when an old social order blocks new ways of producing — and that the working class could make one.`,
        standard: `Marx distinguished **political** revolution — a change in who holds state power — from **social** revolution — a transformation of the relations of production ([[concept:relations-of-production]]). **Text.** In the 1859 Preface, when relations of production become fetters on the productive forces, "then begins an era of social revolution".[cite:src_mia_preface_1859]

The model of a social revolution led by a rising class was the French Revolution, read as a **bourgeois revolution** ([[event:french-revolution]]). Marx and Engels expected a **proletarian revolution** in which wage labourers would win political power — "win the battle of democracy" in the *Manifesto*'s phrase — and use it to transform property relations ([[text:communist-manifesto]]).[cite:src_manifesto_moore, section II]

**Text.** Writing on 1848 in France, Marx called revolutions "the locomotives of history".[cite:src_mia_class_struggles_france, ch. III]`,
        deep: `### Permanent revolution

**Text.** In the March 1850 Address to the Communist League, Marx and Engels argued that workers should not stop at a democratic revolution led by the petty bourgeoisie, but "make the revolution permanent" until the propertied classes had been driven from power.[cite:src_mia_address_1850] The phrase was later taken up — and transformed — by Trotsky for Russia ([[debate:revolution-in-russia]]).

### Force and peaceful transition

**Text.** In a speech at Amsterdam in 1872 Marx allowed that in countries such as America, England and perhaps Holland, workers might "attain their goal by peaceful means", while on most of the Continent "the lever of our revolution must be force".[cite:src_mia_amsterdam_1872]

**Disputed.** Whether Marx's theory required violent revolution, or left the means to circumstances, became the core of the reform-or-revolution debate after his death; both sides could cite him ([[debate:reform-or-revolution]]; [[concept:reformism]]).[cite:src_kolakowski][cite:src_steger_bernstein]

### After the revolution

What a proletarian revolution would do with the existing state — take it over, or "smash" it — was clarified for Marx by the Paris Commune ([[text:civil-war-in-france]]; [[concept:the-state]]; [[concept:dictatorship-of-the-proletariat]]).`,
        history: `Marx and Engels lived through the revolutions of 1848 and the Paris Commune of 1871, and their expectations of revolution rose and fell with them ([[event:revolutions-of-1848]]; [[event:paris-commune]]). The Russian revolutions of 1905 and 1917 turned the question from theory into practice ([[event:revolution-1905]]; [[event:october-revolution]]).[cite:src_hobsbawm_capital]`,
        interpretations: `Kautsky's party was "revolutionary but not revolution-making"; Bernstein doubted the need for revolution; Luxemburg saw revolution as a mass process; Lenin as an act requiring a prepared party ([[debate:reform-or-revolution]]).[cite:src_mia_kautsky_road][cite:src_kolakowski]`,
        criticisms: `Liberal critics argue that revolutions tend to produce new tyrannies; historians question whether "bourgeois revolutions" were made by capitalist classes; others argue that Marx's model of revolution assumed a polarisation of classes that did not occur in industrial democracies.[cite:src_kolakowski][cite:src_hobsbawm_revolution]`,
      },
    },

    /* ——— Texts ——— */
    {
      key: "text:communist-manifesto",
      title: "Manifesto of the Communist Party",
      fields: {
        subtitle: "The Communist Manifesto",
        originalTitle: "Manifest der Kommunistischen Partei",
        language: "German",
        form: "pamphlet",
        yearStart: 1848,
        publicationNote: "Written December 1847–January 1848; published in London in German in February 1848; English translation by Samuel Moore, edited by Engels, 1888",
        edition: "trans. Samuel Moore (1888); many modern editions",
        difficulty: "1",
        readingUrl: "https://www.marxists.org/archive/marx/works/1848/communist-manifesto/",
        aliases: "The Communist Manifesto\nManifest der Kommunistischen Partei",
        summary:
          "The short programme Marx and Engels wrote for the Communist League on the eve of the 1848 revolutions: a history of class struggle, a portrait of capitalism transforming the world, and a call for workers of all countries to unite.",
        body: `## Purpose

The Communist League's second congress (London, November–December 1847) commissioned Marx and Engels to write a statement of principles ([[event:communist-league]]). Marx drafted it, drawing on Engels's earlier catechism, the *Principles of Communism*; it was published anonymously in German in London in February 1848, days before revolution broke out in Paris.[cite:src_mia_communist_league][cite:src_manifesto_moore]

## Main argument

- **I. Bourgeois and Proletarians.** History is the history of class struggles ([[concept:class-struggle]]). The bourgeoisie has revolutionised production and created a world market ([[concept:bourgeoisie]]); in doing so it has created the proletariat, which will overthrow it ([[concept:proletariat]]).
- **II. Proletarians and Communists.** Communists have no interests separate from the proletariat as a whole; their aim is the abolition of bourgeois private property, the conquest of political power and a short list of immediate measures (a progressive income tax, free education, nationalisation of credit and transport) ([[concept:communism]]).
- **III. Socialist and Communist Literature.** A critique of rival socialisms — feudal, petty-bourgeois, "true", conservative, and the "critical-utopian" systems of Saint-Simon, Fourier and Owen ([[tendency:early-socialism]]).
- **IV.** Communists support every revolutionary movement against the existing order; it ends: "Working Men of All Countries, Unite!"[cite:src_manifesto_moore]

## Later influence

Its immediate impact in 1848 was small. It was rediscovered in the 1870s, after the Paris Commune and the trial of German socialist leaders made Marx famous, and became the most widely translated political text of the socialist movement.[cite:src_hobsbawm_capital][cite:src_stedman_jones_marx]

## Interpretations

**Text.** In their preface of 1872 Marx and Engels themselves wrote that parts of the programme had become antiquated, and added a lesson of the Paris Commune: that the working class cannot simply take hold of the ready-made state machinery ([[text:civil-war-in-france]]).[cite:src_manifesto_moore, preface to the German edition of 1872]

**Disputed.** Readers have treated the *Manifesto* as a prophecy of globalisation, as a polemic of its moment, or as an over-confident prediction of polarisation and revolution.[cite:src_stedman_jones_marx][cite:src_kolakowski]`,
        context: `Written in Brussels for an organisation of a few hundred mostly German artisans, many in exile, on the eve of the revolutions of 1848 ([[event:revolutions-of-1848]]).[cite:src_mia_communist_league]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample text record." }],
    },
    {
      key: "text:eighteenth-brumaire",
      title: "The Eighteenth Brumaire of Louis Bonaparte",
      fields: {
        originalTitle: "Der achtzehnte Brumaire des Louis Bonaparte",
        language: "German",
        form: "essay",
        yearStart: 1852,
        publicationNote: "Written December 1851–March 1852; published in Joseph Weydemeyer's Die Revolution (New York), 1852; revised second edition, Hamburg, 1869",
        edition: "MECW vol. 11; many editions",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/marx/works/1852/18th-brumaire/",
        aliases: "The 18th Brumaire\nDer achtzehnte Brumaire",
        summary:
          "Marx's analysis of how the French Second Republic ended in Louis Bonaparte's coup of 1851: his most detailed study of classes, politics and the state in a concrete historical situation.",
        body: `## Purpose

Writing in London immediately after Louis Bonaparte's coup of 2 December 1851, Marx set out to explain how a "grotesque mediocrity" could take power in France, and how the revolution of 1848 had ended in dictatorship ([[event:coup-of-1851]]).[cite:src_mia_brumaire]

## Main argument

- **History and tradition.** **Text.** "Men make their own history, but they do not make it as they please." The revolutionaries of 1848 dressed themselves in the costumes of 1789; Marx adds, of Hegel's remark that historic events occur twice, "the first time as tragedy, the second time as farce".[cite:src_mia_brumaire, ch. I]
- **Classes and fractions.** The coalitions and conflicts of 1848–51 — financial aristocracy, industrial bourgeoisie, petty bourgeoisie, proletariat, peasantry — are traced through parliamentary politics ([[concept:class]]; [[concept:bourgeoisie]]).
- **The peasantry.** Smallholding peasants, isolated "as potatoes in a sack form a sack of potatoes", cannot represent themselves and must be represented — by Bonaparte ([[concept:class-consciousness]]).[cite:src_mia_brumaire, ch. VII]
- **The state.** Under Bonaparte the executive power, with its huge bureaucratic and military machine, appears to have made itself independent of society ([[concept:the-state]]).

## Later influence

The *Brumaire* became a model of Marxist political analysis: of class fractions, of the role of ideas and traditions, and of an apparently autonomous state.[cite:src_kolakowski]

## Interpretations

**Interpretation.** Twentieth-century theorists — Gramsci, the analysts of fascism, Nicos Poulantzas — drew on its account of "Bonapartism" and the relative autonomy of the state. Others read it as evidence that Marx's concrete analyses were subtler than his general formulas.[cite:src_kolakowski][cite:src_sep_marx]`,
        context: `The coup ended the French Second Republic founded in February 1848 ([[event:revolutions-of-1848]]). Marx wrote the essay in a few months in London, for an émigré weekly in New York run by his friend Joseph Weydemeyer.[cite:src_sperber_marx]`,
      },
    },
    {
      key: "text:contribution-critique-political-economy",
      title: "A Contribution to the Critique of Political Economy",
      fields: {
        subtitle: "With the 1859 Preface",
        originalTitle: "Zur Kritik der politischen Ökonomie",
        language: "German",
        form: "book",
        yearStart: 1859,
        publicationNote: "Berlin: Franz Duncker, 1859",
        edition: "trans. S. W. Ryazanskaya (Progress, 1970/1977); MECW vol. 29",
        difficulty: "3",
        readingUrl: "https://www.marxists.org/archive/marx/works/1859/critique-pol-economy/preface.htm",
        aliases: "Zur Kritik der politischen Ökonomie\nThe 1859 Preface\nPreface to A Contribution to the Critique of Political Economy",
        summary:
          "The first published instalment of Marx's critique of political economy, on the commodity and money — famous above all for its short Preface, the classic summary of the materialist conception of history.",
        body: `## Purpose

In 1857–58 Marx drafted a vast manuscript, now known as the *Grundrisse* ([[text:grundrisse]]). The *Contribution* was meant as the first part of a multi-volume work, beginning with the commodity and money. No further instalment followed; Marx reworked the material into *Capital* ([[text:capital-volume-one]]).[cite:src_heinrich_capital]

## Main argument

The two chapters analyse the commodity — its double character as use-value and exchange-value — and money ([[concept:commodity]]; [[concept:use-value]]; [[concept:exchange-value]]). The book's lasting fame rests on its **Preface**, in which Marx described his intellectual development and summarised the "general result" that served as the "guiding principle" of his studies: the relation between productive forces, relations of production, economic structure and superstructure ([[concept:historical-materialism]]).[cite:src_mia_preface_1859]

## Important concepts

[[concept:productive-forces]], [[concept:relations-of-production]], [[concept:mode-of-production]], [[concept:ideology]], [[concept:revolution]].

## Later influence

The Preface became the most quoted statement of historical materialism; for many Marxists of the Second International it *was* the theory.[cite:src_kolakowski]

## Interpretations

**Disputed.** G. A. Cohen built his defence of historical materialism on a close reading of the Preface; critics argue that it is a compressed, schematic summary that Marx's historical writings qualify, and that reading the whole theory from one paragraph has distorted it ([[debate:what-is-historical-materialism]]).[cite:src_cohen_history][cite:src_sep_marx]`,
        context: `Written in London in 1858–59 amid poverty and illness, after the world economic crisis of 1857 had raised and then disappointed Marx's hopes of revolution ([[event:crisis-of-1857]]). The book received little notice.[cite:src_sperber_marx]`,
      },
    },

    /* ——— Events ——— */
    {
      key: "event:communist-league",
      title: "The Communist League is founded",
      fields: {
        subtitle: "Bund der Kommunisten",
        yearStart: 1847,
        yearEnd: 1852,
        dateLabel: "June 1847 – November 1852",
        place: "London; Brussels; Paris; Cologne",
        eventType: "founding",
        summary:
          "The small international organisation of mainly German émigré workers, reorganised from the League of the Just in 1847, that commissioned the Communist Manifesto.",
        body: `## What happened

The League of the Just, a secret society of German émigré artisans, held a congress in London in June 1847 at which it reorganised itself as the Communist League. Engels attended as a delegate; Marx could not. The League's motto was changed from "All Men are Brothers" to "Working Men of All Countries, Unite!"[cite:src_mia_communist_league]

A second congress (November–December 1847) commissioned Marx and Engels to draft its programme — the *Communist Manifesto* ([[text:communist-manifesto]]). After the defeat of 1848–49 the League split in 1850 over revolutionary tactics; following the Cologne communist trial of 1852 it dissolved.[cite:src_mia_communist_league][cite:src_sperber_marx]`,
        significance: `The League connected Marx and Engels's theory to an organisation of workers for the first time, and its programme became the founding document of the Marxist tradition. **Text.** Marx and Engels's March 1850 Address to the League — calling for the revolution to be made "permanent" — later influenced Russian debates about the stages of revolution ([[concept:revolution]]).[cite:src_mia_address_1850]`,
      },
    },
    {
      key: "event:revolutions-of-1848",
      title: "The revolutions of 1848",
      fields: {
        subtitle: "The “Springtime of the Peoples”",
        yearStart: 1848,
        yearEnd: 1849,
        dateLabel: "January 1848 – August 1849",
        place: "France, the German states, the Austrian Empire, Italy",
        eventType: "revolution",
        summary:
          "The wave of revolutions that swept continental Europe in 1848, toppling governments from Paris to Vienna before being defeated in 1849 — the first test of Marx and Engels's politics and the source of much of their later thinking.",
        body: `## What happened

Revolution began in Sicily in January 1848; the February Revolution in Paris overthrew King Louis-Philippe and proclaimed the Second Republic. In March, uprisings in Vienna and Berlin forced concessions; a German National Assembly met at Frankfurt. In June the Paris workers rose against the closing of the National Workshops and were crushed in the "June Days". By 1849 counter-revolution had triumphed: the Habsburgs, with Russian help, defeated Hungary; the Frankfurt Assembly dissolved; and in France Louis Bonaparte, elected president in December 1848, moved towards dictatorship ([[event:coup-of-1851]]).[cite:src_sperber_1848][cite:src_hobsbawm_capital]

Marx returned to Germany and edited the *Neue Rheinische Zeitung* in Cologne (June 1848 – May 1849). Engels fought in the last campaign of the revolution in Baden and the Palatinate in 1849.[cite:src_sperber_marx][cite:src_hunt_engels]`,
        significance: `The failure of 1848 shaped Marx's mature thought. **Text.** In *The Class Struggles in France* (1850) and *The Eighteenth Brumaire* (1852) he analysed how class conflicts within the revolution — especially the June Days, which he read as the first great battle between bourgeoisie and proletariat — ended in Bonapartism ([[text:eighteenth-brumaire]]).[cite:src_mia_class_struggles_france][cite:src_mia_brumaire]

**Interpretation.** Historians stress how much the revolutions were also national, liberal and peasant movements, in which socialist workers were a minority; Marx's class reading captured some dynamics and missed others.[cite:src_sperber_1848]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample event." }],
    },
    {
      key: "event:coup-of-1851",
      title: "Louis Bonaparte's coup d'état",
      fields: {
        subtitle: "The coup of 2 December 1851",
        yearStart: 1851,
        yearEnd: 1852,
        dateLabel: "2 December 1851; Second Empire proclaimed 2 December 1852",
        place: "Paris",
        eventType: "repression",
        summary:
          "The coup by which Louis Napoleon Bonaparte, president of the French Second Republic, dissolved the National Assembly and established his personal rule — soon the Second Empire. Marx's Eighteenth Brumaire is its most famous analysis.",
        body: `## What happened

On 2 December 1851 — the anniversary of his uncle Napoleon's coronation and of Austerlitz — Louis Bonaparte, barred by the constitution from re-election, dissolved the National Assembly, arrested opposition deputies and restored universal male suffrage. Resistance in Paris and the provinces was suppressed. A plebiscite approved the coup; a year later, after another plebiscite, he proclaimed himself Emperor Napoleon III.[cite:src_hobsbawm_capital]`,
        significance: `For Marx the coup posed a theoretical problem: how could a state apparently stand above all classes? His answer in *The Eighteenth Brumaire* — that Bonaparte rested on the smallholding peasantry and on a bourgeoisie willing to give up political power to preserve its social power — became the starting point of later Marxist theories of "Bonapartism" and the relative autonomy of the state ([[text:eighteenth-brumaire]]; [[concept:the-state]]).[cite:src_mia_brumaire][cite:src_kolakowski]`,
      },
    },
  ],

  relationships: [
    { from: "thinker:marx", type: "DEVELOPED", to: "concept:historical-materialism", note: "With Engels from 1845; classic statement in the 1859 Preface.", source: "src_mia_preface_1859", weight: 3 },
    { from: "thinker:engels", type: "DEVELOPED", to: "concept:historical-materialism", note: "Co-author of its first statement; named and popularised it in the 1880s–90s.", source: "src_mia_soc_utopian", weight: 3 },
    { from: "thinker:marx", type: "DEVELOPED", to: "concept:class-struggle", note: "Marx credited earlier historians with discovering class struggle; his claim was to tie classes to historical phases of production.", source: "src_mia_weydemeyer_1852", weight: 3 },
    { from: "thinker:marx", type: "DEVELOPED", to: "concept:mode-of-production", note: "The 1859 Preface and the Grundrisse.", source: "src_mia_preface_1859" },
    { from: "thinker:marx", type: "DEVELOPED", to: "concept:productive-forces", note: "Set out from The German Ideology onwards.", source: "src_mia_german_ideology" },
    { from: "thinker:marx", type: "DEVELOPED", to: "concept:relations-of-production", note: "First named in The Poverty of Philosophy (1847).", source: "src_mia_poverty_philosophy" },
    { from: "thinker:marx", type: "DEVELOPED", to: "concept:revolution", note: "Social versus political revolution; proletarian revolution.", source: "src_mia_preface_1859" },
    { from: "concept:historical-materialism", type: "PRESUPPOSES", to: "concept:productive-forces", note: "The theory is stated in terms of forces and relations of production.", source: "src_mia_preface_1859" },
    { from: "concept:historical-materialism", type: "PRESUPPOSES", to: "concept:relations-of-production", note: "Relations of production make up the economic structure.", source: "src_mia_preface_1859" },
    { from: "concept:historical-materialism", type: "PRESUPPOSES", to: "concept:materialism", note: "Marx's “new materialism” applied to history.", source: "src_mia_german_ideology" },
    { from: "concept:mode-of-production", type: "PRESUPPOSES", to: "concept:productive-forces", note: "A mode of production combines forces and relations.", source: "src_cohen_history" },
    { from: "concept:mode-of-production", type: "PRESUPPOSES", to: "concept:relations-of-production", note: "A mode of production combines forces and relations.", source: "src_cohen_history" },
    { from: "concept:class", type: "PRESUPPOSES", to: "concept:relations-of-production", note: "Classes are defined by their place in the relations of production.", source: "src_cohen_history" },
    { from: "concept:class-struggle", type: "PRESUPPOSES", to: "concept:class", note: "Struggle between classes presupposes an account of what classes are.", source: "src_mia_weydemeyer_1852" },
    { from: "concept:bourgeoisie", type: "PRESUPPOSES", to: "concept:class", note: "One of the two great classes of capitalist society.", source: "src_manifesto_moore" },
    { from: "concept:proletariat", type: "PRESUPPOSES", to: "concept:class", note: "One of the two great classes of capitalist society.", source: "src_manifesto_moore" },
    { from: "concept:bourgeoisie", type: "CONTRASTS_WITH", to: "concept:proletariat", note: "The opposed classes of the Communist Manifesto.", source: "src_manifesto_moore", weight: 3 },
    { from: "concept:revolution", type: "PRESUPPOSES", to: "concept:class-struggle", note: "Social revolution as the culmination of class struggle.", source: "src_manifesto_moore" },
    { from: "concept:ideology", type: "RELATED_TO", to: "concept:historical-materialism", note: "Ideological forms belong to the superstructure.", source: "src_mia_preface_1859" },
    { from: "thinker:marx", type: "WROTE", to: "text:communist-manifesto", note: "With Engels; drafted by Marx from Engels's Principles of Communism.", source: "src_mia_communist_league", yearStart: 1848, weight: 3 },
    { from: "thinker:engels", type: "WROTE", to: "text:communist-manifesto", note: "Co-author; his Principles of Communism was a draft.", source: "src_mia_communist_league", yearStart: 1848, weight: 3 },
    { from: "thinker:marx", type: "WROTE", to: "text:eighteenth-brumaire", note: "Written December 1851–March 1852.", source: "src_mia_brumaire", yearStart: 1852 },
    { from: "thinker:marx", type: "WROTE", to: "text:contribution-critique-political-economy", note: "Published in Berlin in 1859.", source: "src_mia_preface_1859", yearStart: 1859 },
    { from: "text:communist-manifesto", type: "DISCUSSES", to: "concept:class-struggle", note: "“The history of all hitherto existing society is the history of class struggles.”", source: "src_manifesto_moore", weight: 3 },
    { from: "text:communist-manifesto", type: "DISCUSSES", to: "concept:bourgeoisie", note: "Section I.", source: "src_manifesto_moore" },
    { from: "text:communist-manifesto", type: "DISCUSSES", to: "concept:proletariat", note: "Sections I–II.", source: "src_manifesto_moore" },
    { from: "text:communist-manifesto", type: "CRITIQUED", to: "tendency:early-socialism", note: "Section III on “critical-utopian” socialism and communism.", source: "src_manifesto_moore" },
    { from: "text:contribution-critique-political-economy", type: "DISCUSSES", to: "concept:historical-materialism", note: "The 1859 Preface.", source: "src_mia_preface_1859", weight: 3 },
    { from: "text:contribution-critique-political-economy", type: "DISCUSSES", to: "concept:productive-forces", note: "The 1859 Preface.", source: "src_mia_preface_1859" },
    { from: "text:contribution-critique-political-economy", type: "DISCUSSES", to: "concept:mode-of-production", note: "The 1859 Preface.", source: "src_mia_preface_1859" },
    { from: "text:eighteenth-brumaire", type: "DISCUSSES", to: "concept:class", note: "Class fractions; the peasantry as a class and not a class.", source: "src_mia_brumaire", weight: 3 },
    { from: "text:eighteenth-brumaire", type: "DISCUSSES", to: "event:coup-of-1851", note: "Its subject.", source: "src_mia_brumaire", weight: 3 },
    { from: "text:eighteenth-brumaire", type: "DISCUSSES", to: "concept:the-state", note: "The executive power apparently made independent of society.", source: "src_mia_brumaire" },
    { from: "text:the-german-ideology", type: "PRECEDES", to: "text:communist-manifesto", note: "The materialist conception of history worked out in 1845–46 is presented to a political audience in 1848.", source: "src_mclellan_marx", basis: "interpretive" },
    { from: "text:communist-manifesto", type: "ASSOCIATED_WITH", to: "event:communist-league", note: "Commissioned by the League's second congress (November–December 1847).", source: "src_mia_communist_league", weight: 3 },
    { from: "thinker:marx", type: "PARTICIPATED_IN", to: "event:communist-league", note: "Leading member from 1847 until its dissolution in 1852.", source: "src_mia_communist_league", yearStart: 1847, yearEnd: 1852 },
    { from: "thinker:engels", type: "PARTICIPATED_IN", to: "event:communist-league", note: "Delegate to the founding congress, June 1847.", source: "src_mia_communist_league", yearStart: 1847, yearEnd: 1852 },
    { from: "thinker:marx", type: "PARTICIPATED_IN", to: "event:revolutions-of-1848", note: "Editor of the Neue Rheinische Zeitung, Cologne, 1848–49.", source: "src_sperber_marx", yearStart: 1848, yearEnd: 1849 },
    { from: "thinker:engels", type: "PARTICIPATED_IN", to: "event:revolutions-of-1848", note: "Journalist in Cologne; fought in the Baden-Palatinate campaign of 1849.", source: "src_hunt_engels", yearStart: 1848, yearEnd: 1849 },
    { from: "thinker:proudhon", type: "PARTICIPATED_IN", to: "event:revolutions-of-1848", note: "Elected to the Constituent Assembly in June 1848.", source: "src_woodcock_proudhon", yearStart: 1848 },
    { from: "event:revolutions-of-1848", type: "PRECEDES", to: "event:coup-of-1851", note: "The Second Republic born in February 1848 ended in Bonaparte's coup.", source: "src_hobsbawm_capital" },
    { from: "event:revolutions-of-1848", type: "INFLUENCED", to: "text:eighteenth-brumaire", note: "Marx's analysis of the defeat of 1848.", source: "src_mia_brumaire" },
    { from: "event:communist-league", type: "PRECEDES", to: "event:revolutions-of-1848", note: "The Manifesto appeared days before the February revolution.", source: "src_mia_communist_league" },
  ],

  excerpts: [
    {
      key: "manifesto-class-struggles",
      entity: "concept:class-struggle",
      speaker: "thinker:marx",
      text: "text:communist-manifesto",
      body: "The history of all hitherto existing society is the history of class struggles.",
      source: "src_manifesto_moore",
      locator: "Section I, opening",
      note: "Joint work of Marx and Engels; Moore's 1888 translation. Engels's 1888 note restricts “all history” to written history.",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1848/communist-manifesto/ch01.htm",
    },
    {
      key: "manifesto-grave-diggers",
      entity: "concept:bourgeoisie",
      speaker: "thinker:marx",
      text: "text:communist-manifesto",
      body: "What the bourgeoisie therefore produces, above all, are its own grave-diggers.",
      source: "src_manifesto_moore",
      locator: "End of section I",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1848/communist-manifesto/ch01.htm",
    },
    {
      key: "manifesto-proletariat-def",
      entity: "concept:proletariat",
      speaker: "thinker:engels",
      text: "text:communist-manifesto",
      body: "By proletariat, the class of modern wage labourers who, having no means of production of their own, are reduced to selling their labour power in order to live.",
      source: "src_manifesto_moore",
      locator: "Engels's note to the English edition of 1888",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1848/communist-manifesto/ch01.htm",
    },
    {
      key: "preface-1859-consciousness",
      entity: "concept:historical-materialism",
      speaker: "thinker:marx",
      text: "text:contribution-critique-political-economy",
      body: "It is not the consciousness of men that determines their existence, but their social existence that determines their consciousness.",
      source: "src_mia_preface_1859",
      locator: "Preface",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1859/critique-pol-economy/preface.htm",
    },
    {
      key: "preface-1859-no-social-order",
      entity: "concept:productive-forces",
      speaker: "thinker:marx",
      text: "text:contribution-critique-political-economy",
      body: "No social order is ever destroyed before all the productive forces for which it is sufficient have been developed, and new superior relations of production never replace older ones before the material conditions for their existence have matured within the framework of the old society.",
      source: "src_mia_preface_1859",
      locator: "Preface",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1859/critique-pol-economy/preface.htm",
    },
    {
      key: "brumaire-make-history",
      entity: "text:eighteenth-brumaire",
      speaker: "thinker:marx",
      text: "text:eighteenth-brumaire",
      body: "Men make their own history, but they do not make it as they please; they do not make it under self-selected circumstances, but under circumstances existing already, given and transmitted from the past.",
      source: "src_mia_brumaire",
      locator: "Chapter I",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1852/18th-brumaire/ch01.htm",
    },
    {
      key: "weydemeyer-no-credit",
      entity: "concept:class",
      speaker: "thinker:marx",
      body: "And now as to myself, no credit is due to me for discovering the existence of classes in modern society or the struggle between them.",
      source: "src_mia_weydemeyer_1852",
      locator: "Letter of 5 March 1852",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1852/letters/52_03_05-ab.htm",
    },
    {
      key: "class-struggles-locomotives",
      entity: "concept:revolution",
      speaker: "thinker:marx",
      body: "Revolutions are the locomotives of history.",
      source: "src_mia_class_struggles_france",
      locator: "Part III",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1850/class-struggles-france/ch03.htm",
    },
  ],
};
