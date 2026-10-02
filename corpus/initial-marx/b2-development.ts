import type { CorpusBatch } from "../../src/lib/corpus/types";

/**
 * Batch 2 — Marx's development, 1835–1847: from Young Hegelian journalist to
 * the historical materialism of The German Ideology, and the beginning of
 * the partnership with Engels.
 */
export const batch2: CorpusBatch = {
  id: "b2",
  title: "Marx's intellectual development, 1835–1847",
  entities: [
    {
      key: "thinker:marx",
      title: "Karl Marx",
      fields: {
        yearStart: 1818,
        yearEnd: 1883,
        subtitle: "1818–1883",
        roles: "German philosopher, journalist, economist and revolutionary; critic of political economy",
        birthPlace: "Trier, Prussian Rhineland",
        deathPlace: "London",
        aliases: "Marx\nKarl Heinrich Marx",
        summary:
          "Philosopher, journalist and revolutionary who argued that the way societies organise production shapes their politics and ideas, and who spent much of his life analysing capitalism as a historically specific and crisis-prone system. His work became the starting point of a tradition that soon divided over what it meant.",
        body: `## Reading Marx historically

Marx did not produce one finished system at one moment. His thought developed over four decades of writing — much of it left in notebooks and manuscripts, published long after his death — and in constant argument with other thinkers and with events. This entry follows that development; the major works and concepts have entries of their own.[cite:src_sperber_marx][cite:src_stedman_jones_marx]

### Philosophy and journalism (1835–1843)

Marx grew up in Trier in the Prussian Rhineland, the son of a lawyer who had converted from Judaism to Protestantism. He studied law at Bonn and Berlin, where he joined the circle of radical Young Hegelians around Bruno Bauer ([[tendency:young-hegelians]]) and completed a doctoral dissertation on Democritus and Epicurus (accepted by the University of Jena in 1841).[cite:src_mclellan_marx]

With an academic career closed to Hegelian radicals, he turned to journalism. As editor of the liberal *Rheinische Zeitung* in Cologne (1842–43) he wrote on press censorship, the law against gathering wood in forests and the distress of Moselle wine-growers. **Text.** He later recalled that this work first forced him to discuss "material interests" — a turning point in his own account ([[event:rheinische-zeitung-ban]]).[cite:src_mia_preface_1859]

### Critique and communism (1843–1845)

After the paper was banned, Marx married Jenny von Westphalen and spent the summer of 1843 writing a critique of Hegel's political philosophy, then moved to Paris. There he published the Introduction to that critique, which named the proletariat as the class whose emancipation would be human emancipation ([[text:critique-of-hegels-philosophy-of-right]]). In Paris he met socialist workers' circles, began a lifelong study of political economy and wrote the *Economic and Philosophic Manuscripts* on alienated labour ([[text:economic-philosophic-manuscripts]]).[cite:src_leopold_young_marx]

In August 1844 he met [[thinker:engels]], beginning a forty-year partnership. Expelled from France in 1845, he settled in Brussels.

### Historical materialism (1845–1848)

In 1845–46 Marx broke with his philosophical past. The *Theses on Feuerbach* and *The German Ideology*, written with Engels, set out a "new materialism": history explained through how people produce their lives, ideas through the social relations in which they arise ([[text:theses-on-feuerbach]]; [[text:the-german-ideology]]; [[concept:historical-materialism]]). *The Poverty of Philosophy* (1847) turned the new approach against [[thinker:proudhon]].[cite:src_mia_poverty_philosophy] The *Communist Manifesto*, written with Engels for the Communist League, appeared in February 1848 ([[text:communist-manifesto]]).

### Revolution and exile (1848–1864)

Marx returned to Germany in the revolution of 1848 and edited the *Neue Rheinische Zeitung* in Cologne until its suppression in May 1849. From August 1849 he lived in London, often in poverty, supported largely by Engels and by journalism for the *New-York Daily Tribune*. He analysed the defeat of 1848 in *The Class Struggles in France* and *The Eighteenth Brumaire of Louis Bonaparte* ([[text:eighteenth-brumaire]]), and from 1857 drafted his critique of political economy ([[text:grundrisse]]; [[text:contribution-critique-political-economy]]).[cite:src_sperber_marx]

### Capital and the International (1864–1883)

Marx was the leading intellectual figure of the International Workingmen's Association from its foundation in 1864 ([[event:first-international]]). The first volume of *Capital* appeared in 1867 ([[text:capital-volume-one]]); the further volumes remained unfinished drafts, edited after his death by Engels. *The Civil War in France* (1871) defended the Paris Commune ([[text:civil-war-in-france]]); the *Critique of the Gotha Programme* (1875) set out his most detailed remarks on a future communist society ([[text:critique-of-the-gotha-programme]]). In his last years he studied Russian agrarian communes, non-European societies and new natural science. He died in London on 14 March 1883.[cite:src_stedman_jones_marx][cite:src_shanin_late_marx]

### Core questions

- Why does modern society, which produces more wealth than any before it, produce poverty, crises and domination? ([[concept:capital]])
- How do the ways people produce shape their social relations, politics and ideas? ([[concept:historical-materialism]])
- Which social forces could transform capitalism, and how? ([[concept:class-struggle]]; [[concept:revolution]])`,
        context: `Marx's life coincided with the industrialisation of Western Europe, the revolutions of 1848, the growth of a world market and the first mass workers' movements ([[event:revolutions-of-1848]]; [[event:paris-commune]]). He wrote in German, French and English, mostly as an exile; many of his most discussed texts — the *1844 Manuscripts*, *The German Ideology*, the *Grundrisse* — were not published until the twentieth century, so the "Marx" of the late-nineteenth-century movement was largely the author of the *Manifesto*, *Capital* and Engels's popular expositions.[cite:src_sperber_marx][cite:src_kolakowski]`,
        legacy: `## Significance

Marx's influence on social theory, history, economics and politics is hard to overstate. Within this corpus, the important point is that his legacy was contested from the start: Engels, Kautsky, Plekhanov, Bernstein, Luxemburg and Lenin all claimed to continue his work and drew opposed conclusions from it ([[tendency:marxism]]).[cite:src_kolakowski]

## Disputed: one Marx or two?

**Interpretation.** After the *1844 Manuscripts* were published in 1932, readers argued over whether the "young" humanist Marx of alienation and the "mature" scientific Marx of *Capital* were the same thinker. Some — notably Louis Althusser in *For Marx* (1965) — posited an "epistemological break" around 1845 ([[text:for-marx]]); others stressed continuity, reading *Capital*'s analysis of commodity fetishism as a development of the theory of alienation ([[concept:alienation]]).[cite:src_avineri][cite:src_ollman_alienation][cite:src_sep_marx]

**Disputed.** Historians such as Jonathan Sperber and Gareth Stedman Jones have argued that Marx should be read as a nineteenth-century figure, whose concerns and assumptions belonged to his own time, rather than as a contemporary; others reply that his analysis of capitalism remains illuminating precisely because capitalism persists.[cite:src_sperber_marx][cite:src_stedman_jones_marx]

## Criticisms

Critics have challenged the labour theory of value, the predictions of increasing immiseration and of capitalism's collapse, the vagueness of his account of communist society, and the relation between his ideas and twentieth-century communist states. Defenders reply that several of these readings rest on later interpretations rather than on Marx's texts. The main lines of criticism are discussed under the relevant concepts.[cite:src_kolakowski][cite:src_sep_marx]

## Further reading

Two modern biographies with different emphases are Sperber's *Karl Marx: A Nineteenth-Century Life* and Stedman Jones's *Karl Marx: Greatness and Illusion*; David McLellan's older biography remains useful. Jonathan Wolff and David Leopold's encyclopedia article surveys the philosophy.[cite:src_sperber_marx][cite:src_stedman_jones_marx][cite:src_mclellan_marx][cite:src_sep_marx]`,
      },
      citations: [
        { source: "src_mecw", note: "Standard English edition of the writings" },
        { source: "src_wood_marx", note: "Philosophical introduction" },
      ],
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample entry for Marx; the sample's relationships (including to later thinkers outside this corpus) remain attached and should be reviewed." },
        { type: "disputed", field: "legacy", note: "The 'one Marx or two' and the 'Marx as nineteenth-century figure' debates are presented as open; reviewers should check the balance." },
      ],
    },
    {
      key: "thinker:engels",
      title: "Friedrich Engels",
      fields: {
        yearStart: 1820,
        yearEnd: 1895,
        subtitle: "1820–1895",
        roles: "German socialist theorist, businessman and journalist; Marx's collaborator and editor",
        birthPlace: "Barmen, Prussian Rhineland",
        deathPlace: "London",
        aliases: "Frederick Engels\nEngels",
        summary:
          "Manufacturer's son, social investigator and revolutionary who co-wrote the Communist Manifesto, financed and edited Marx, and — through his popular expositions — did more than anyone to define what “Marxism” meant to the movement that grew after Marx's death.",
        body: `## Related but distinct

Engels is often treated as Marx's shadow. This corpus treats him as a thinker in his own right: he reached a materialist analysis of capitalism partly independently, he wrote alone most of the texts through which Marxism was popularised, and on some questions his emphases differ from Marx's.[cite:src_carver_relationship][cite:src_hunt_engels]

### Development

Born into a pietist textile-manufacturing family in Barmen, Engels left school for a commercial apprenticeship. In Bremen and then as a soldier-volunteer in Berlin (1841–42) he joined the Young Hegelians and wrote polemics against Schelling ([[tendency:young-hegelians]]). Sent in 1842 to the family firm's mill in Manchester, he encountered Chartism and the factory system first-hand. His *Outlines of a Critique of Political Economy* (1844) and *The Condition of the Working Class in England* (1845) analysed capitalism from the factory floor ([[text:condition-working-class-england]]).[cite:src_mia_engels_outlines][cite:src_mia_condition]

**Text.** Marx later credited Engels's "brilliant essay on the critique of economic categories" with arriving by another road at the same result as his own.[cite:src_mia_preface_1859]

### Collaboration

From their meeting in Paris in August 1844 the two worked together: *The Holy Family* (1845), *The German Ideology* (1845–46), the *Manifesto* (1848), the *Neue Rheinische Zeitung* (1848–49). Engels fought in the Baden-Palatinate rising of 1849. From 1850 to 1869 he worked in the Manchester firm, sending Marx money that kept his family alive, and wrote much of the journalism that appeared under Marx's name. In 1870 he moved to London.[cite:src_hunt_engels]

### The populariser

After 1875 Engels wrote the texts through which most socialists learned "Marxism": *Anti-Dühring* (1878), its excerpt *Socialism: Utopian and Scientific* (1880) ([[text:socialism-utopian-and-scientific]]), *The Origin of the Family, Private Property and the State* (1884) and *Ludwig Feuerbach* (1886). After Marx's death he edited the second and third volumes of *Capital* (1885, 1894) and acted as adviser to the parties of the Second International ([[event:second-international]]).[cite:src_mia_anti_duhring][cite:src_hunt_engels]`,
        context: `Engels's double life — mill owner and communist — gave him both the means to support Marx and direct knowledge of industrial capitalism. In Manchester he lived with the Irish working woman Mary Burns, and after her death with her sister Lizzie.[cite:src_hunt_engels] His later prestige as Marx's literary executor made his interpretations authoritative for the German Social Democrats ([[tendency:social-democracy]]).`,
        legacy: `## Disputed: did Engels change Marxism?

**Interpretation.** Some scholars — Terrell Carver among the most careful — argue that Engels's late works turned Marx's critical social theory into a positivist world-view of "dialectical laws" governing nature and history, and that the deterministic Marxism of the Second International descends from Engels rather than Marx.[cite:src_carver_relationship] Others reply that Marx read and approved *Anti-Dühring*, that the two shared an interest in natural science, and that the distinction has been overdrawn by those wanting to rescue Marx from Marxism.[cite:src_hunt_engels][cite:src_kolakowski] See [[concept:dialectics]] and [[debate:what-is-historical-materialism]].

**Text.** Engels himself, in letters of the 1890s, rejected the reading of historical materialism as economic determinism: the economic element was "ultimately determining", not the only factor ([[concept:historical-materialism]]).[cite:src_mia_engels_bloch]

**Disputed.** His 1895 introduction to Marx's *Class Struggles in France*, which emphasised the electoral successes of German Social Democracy, was cut by the party leadership before publication and later cited by reformists as Engels's endorsement of legal, parliamentary methods. Whether it was such an endorsement is debated ([[debate:reform-or-revolution]]).[cite:src_mia_engels_1895][cite:src_steenson_kautsky]

## Criticisms

Beyond the charge of scientism, critics have questioned his anthropology of the family and the state in *The Origin of the Family*, which relied on Lewis Henry Morgan's now-superseded ethnology.[cite:src_kolakowski]

## Further reading

Terrell Carver, *Marx and Engels: The Intellectual Relationship*; Tristram Hunt's biography.[cite:src_carver_relationship][cite:src_hunt_engels]`,
      },
      citations: [{ source: "src_mecw" }],
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample entry for Engels." },
        { type: "disputed", field: "legacy", note: "The 'Engels distorted Marx' thesis and its critics are presented as an open debate." },
      ],
    },

    /* ——— Concepts ——— */
    {
      key: "concept:alienation",
      title: "Alienation",
      fields: {
        aliases: "Estrangement\nEntfremdung\nEntäusserung",
        summary:
          "The condition in which people's own activity and its products confront them as alien powers that dominate them. Marx's 1844 analysis of alienated labour is the most famous version.",
        yearStart: 1844,
        brief: `Alienation means that something you made, or do, has turned into a force outside you that controls you. For the young Marx, workers under capitalism are alienated: what they produce belongs to someone else, their work is not their own choice, and it cuts them off from their own abilities and from one another.`,
        standard: `The idea has a philosophical prehistory. [[thinker:hegel]] described spirit "externalising" itself in a world that it must then recognise as its own. [[thinker:feuerbach]] applied the idea to religion: people project their best qualities onto God and then kneel before their own creation ([[text:essence-of-christianity]]).[cite:src_sep_alienation]

In the *Economic and Philosophic Manuscripts* of 1844, Marx turned the idea from religion to work ([[text:economic-philosophic-manuscripts]]). **Text.** Starting from what he called "an actual economic fact" — that the worker becomes poorer the more wealth he produces — he described four aspects of alienated labour:[cite:src_mia_epm_labour]

1. **From the product**: what workers make belongs to another and confronts them as an independent power.
2. **From the activity**: work is forced, a means to survive rather than the expression of their own life.
3. **From the "species-being"**: the distinctively human capacity for free, conscious, creative production is reduced to a means of individual existence.
4. **From other people**: relations between people become relations of competition and domination.

Alienation, on this account, is not just a feeling of dissatisfaction. It is an objective situation built into how work is organised — people can be alienated without feeling it.`,
        deep: `### Terms

Marx used two German words, *Entfremdung* (estrangement) and *Entäusserung* (externalisation, alienation), sometimes interchangeably; translators differ in how they render them.[cite:src_sep_alienation]

### Normative basis

**Interpretation.** Alienation presupposes some idea of what human life would be without it. David Leopold reads the young Marx as working with an account of human flourishing in which people realise their essential capacities through creative work and community; critics call this "essentialist" and argue it is either too vague to guide politics or too specific to be universal.[cite:src_leopold_young_marx][cite:src_sep_alienation]

### Does alienation survive in the later Marx?

**Disputed.** The term becomes rarer after 1845. Althusser treated the concept as a remnant of pre-Marxist humanism, abandoned in a "break" with Feuerbach ([[text:for-marx]]). Bertell Ollman, Shlomo Avineri and many others argue for continuity: the analysis of *commodity fetishism* in *Capital* — social relations between people appearing as relations between things — restates alienation in the language of political economy ([[concept:commodity-fetishism]]), and the *Grundrisse* uses the vocabulary of alienation extensively ([[text:grundrisse]]).[cite:src_ollman_alienation][cite:src_avineri][cite:src_sep_marx]

### Alienation and exploitation

The two are distinct. Exploitation concerns the appropriation of unpaid labour ([[concept:exploitation]]); alienation concerns the lack of control over activity and its products. A well-paid worker can be alienated; whether a cooperative of self-employed producers can be exploited is a different question.[cite:src_sep_alienation]`,
        history: `The 1844 manuscripts were unknown to the Marxism of the Second International: they were first published in full in 1932. Their publication — and their translation into English and French after 1945 — produced a "humanist" Marxism focused on alienation, influential in the 1950s and 1960s in both Western and Eastern Europe. Earlier, Georg Lukács had reconstructed a similar theory from *Capital* (as "reification") before the manuscripts were known.[cite:src_kolakowski][cite:src_sep_alienation]`,
        interpretations: `- **Humanist Marxism** (Fromm, the Praxis school, many existentialists): alienation as the central theme of Marx's critique.
- **Structural Marxism** (Althusser): a pre-scientific, ideological concept.
- **Analytical and normative readings**: alienation as one of several independent objections to capitalism, alongside exploitation and unfreedom.[cite:src_sep_alienation][cite:src_kolakowski]`,
        criticisms: `Critics argue that the concept depends on contestable claims about human nature, that it is hard to apply empirically, and that alienation in some form may be inevitable in any complex society with a division of labour. Some sympathetic critics argue that Marx's picture of unalienated labour romanticises artisanal work.[cite:src_sep_alienation][cite:src_wood_marx]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample concept 'Alienation'." }],
    },
    {
      key: "concept:praxis",
      title: "Praxis",
      fields: {
        aliases: "Practice\nRevolutionary practice\nPhilosophy of praxis",
        summary:
          "Human practical, transformative activity — the unity of changing the world and understanding it. Marx's Theses on Feuerbach made it the starting point of his “new materialism”.",
        yearStart: 1845,
        brief: `Praxis means practical activity that changes the world — and changes the people doing it. Marx argued that philosophy had spent too long just interpreting the world; understanding should come from, and feed back into, transforming it.`,
        standard: `"Praxis" is the Greek word for action; Aristotle distinguished it from *poiesis* (making) and *theoria* (contemplation). In the 1830s the Polish Hegelian August Cieszkowski called for a "philosophy of praxis" that would turn Hegel's philosophy towards future action — a call several Young Hegelians took up ([[tendency:young-hegelians]]).[cite:src_breckman]

**Text.** In the *Theses on Feuerbach* (1845) Marx criticised earlier materialism for treating reality only as an object of contemplation, not as "sensuous human activity, practice". The third thesis insists that "the coincidence of the changing of circumstances and of human activity or self-changing" can be understood only as revolutionary practice; the eleventh closes with the famous contrast between interpreting the world and changing it ([[text:theses-on-feuerbach]]).[cite:src_theses_feuerbach]

The point is not anti-intellectual. Marx spent the rest of his life in libraries. The claim is that thinking is part of human practice, that the truth of a theory is a practical question, and that people change themselves by changing their circumstances.`,
        deep: `### Three claims in the Theses

**Text.** (1) Knowledge: whether thought has objective truth "is not a question of theory but is a practical question" (Thesis II). (2) Self-change: circumstances are changed by human beings, and the educator must himself be educated (Thesis III). (3) Social essence: the human essence is "the ensemble of the social relations" (Thesis VI).[cite:src_theses_feuerbach]

**Interpretation.** Readers disagree about how much philosophy these brief notes contain. For some they found an "activist" epistemology and a philosophy of human self-creation through labour; for others they mark Marx's exit from philosophy altogether, towards empirical social science.[cite:src_sep_marx][cite:src_kolakowski]

### "Philosophy of praxis"

In his prison notebooks Antonio Gramsci called Marxism the "philosophy of praxis" — partly to evade the censor, partly to stress its difference from mechanical materialism. In the 1960s the Yugoslav *Praxis* group of philosophers used the concept to criticise Stalinist orthodoxy in the name of Marxist humanism.[cite:src_kolakowski]`,
        history: `The concept is central to the early Marx (1844–46) and to twentieth-century "Western" and humanist Marxism; it played little role in the orthodox Marxism of the Second International, which emphasised objective laws of history ([[debate:what-is-historical-materialism]]).[cite:src_kolakowski]`,
        interpretations: `Gramsci, Lukács and the Frankfurt School stressed praxis against determinism; analytical Marxists translated the idea into claims about the explanatory role of human agency; Soviet Marxism-Leninism treated "practice" chiefly as the criterion of truth in a materialist theory of knowledge.[cite:src_kolakowski]`,
        criticisms: `Critics object that "the unity of theory and practice" can be used to subordinate inquiry to political authority — the party, as the bearer of practice, deciding what is true. Others argue that the concept is too general to do explanatory work.[cite:src_kolakowski]`,
      },
    },
    {
      key: "concept:ideology",
      title: "Ideology",
      fields: {
        aliases: "False consciousness\nIdeological forms",
        summary:
          "Ideas that express, justify or disguise particular social interests and relations — above all those of a ruling class — while presenting them as natural or universal.",
        yearStart: 1846,
        brief: `An ideology, in the Marxist sense, is a set of ideas that makes a particular social order look natural, fair or inevitable. Marx and Engels argued that the ruling ideas of any age tend to be the ideas of its ruling class — not because people are stupid, but because of how society is organised.`,
        standard: `The word was coined in the 1790s by the French philosopher Destutt de Tracy for a proposed "science of ideas"; Napoleon turned it into a sneer at impractical theorists.[cite:src_williams_keywords]

Marx and Engels gave it a critical meaning in *The German Ideology* (1845–46) ([[text:the-german-ideology]]). **Text.** Their target was German philosophers who believed that changing ideas would change the world. Against them they argued that ideas arise from people's actual life and social relations; that "the ideas of the ruling class are in every epoch the ruling ideas", since the class that controls material production also controls the means of intellectual production; and that ideology presents the interests of a particular class as the general interest.[cite:src_mia_german_ideology]

They also used an image: in ideology "men and their circumstances appear upside-down as in a camera obscura" — an inversion with real causes in social life, not a simple mistake.[cite:src_mia_german_ideology]

In the 1859 Preface Marx spoke of the "ideological forms" — legal, political, religious, artistic, philosophical — in which people become conscious of social conflicts ([[text:contribution-critique-political-economy]]).[cite:src_mia_preface_1859]`,
        deep: `### Two senses

**Interpretation.** Scholars distinguish a *critical* or "negative" sense — ideas that distort or conceal social reality in the interest of domination — from a *descriptive* sense — the system of ideas of any class or group. Marx mostly uses the first; later Marxists, including Lenin, spoke of "socialist ideology" in the second.[cite:src_sep_ideology][cite:src_williams_keywords]

### "False consciousness"

The phrase appears in a letter by Engels (1893), not in Marx. It has been criticised for suggesting that ideology is simply error, whereas Marx's account in *Capital* of commodity fetishism treats certain appearances as real features of how capitalism works ([[concept:commodity-fetishism]]).[cite:src_sep_ideology]

### Mechanisms

How do ruling ideas rule? Possible mechanisms in Marx's texts include control over the means of intellectual production; the division between manual and mental labour; the way social relations really do appear (wages appear to pay for all labour); and the presentation of particular interests as universal.[cite:src_sep_ideology][cite:src_wood_marx]

**Disputed.** Whether ideology is best explained functionally (ideas persist because they stabilise a social order), causally (by interests or social position) or as a structural effect remains debated.[cite:src_sep_ideology][cite:src_cohen_history]`,
        history: `*The German Ideology* was not published until 1932, so the late-nineteenth-century movement knew Marx's theory of ideology mainly through the 1859 Preface and Engels's letters. The theory was greatly extended in the twentieth century — by Lukács (reification), Gramsci (hegemony) and Althusser (ideological state apparatuses: see [[text:ideology-and-isas]]).[cite:src_kolakowski][cite:src_sep_ideology]`,
        interpretations: `**Lenin** treated ideology as the conscious doctrine of a class and argued that workers would not arrive at socialist ideology spontaneously ([[text:what-is-to-be-done]]). **Gramsci** emphasised consent and common sense; **Althusser** treated ideology as a permanent dimension of social life rather than a distortion to be dispelled.[cite:src_kolakowski]`,
        criticisms: `Critics point to a self-reference problem: if ideas reflect class position, why should Marxism itself be exempt? Others argue that the theory explains too much — any belief can be labelled ideological — or that it underestimates the independent force of ideas such as religion and nationalism.[cite:src_sep_ideology][cite:src_kolakowski]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample concept 'Ideology'." }],
    },

    /* ——— Texts ——— */
    {
      key: "text:critique-of-hegels-philosophy-of-right",
      title: "Contribution to the Critique of Hegel's Philosophy of Right: Introduction",
      fields: {
        subtitle: "Introduction (1844)",
        originalTitle: "Zur Kritik der Hegelschen Rechtsphilosophie. Einleitung",
        language: "German",
        form: "essay",
        yearStart: 1844,
        publicationNote: "Written December 1843–January 1844; published in the Deutsch-Französische Jahrbücher, Paris, February 1844. The longer Kreuznach manuscript on Hegel's Philosophy of Right (1843) was first published in 1927.",
        edition: "In Marx, Early Writings, or MECW vol. 3",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/marx/works/1843/critique-hpr/intro.htm",
        aliases: "Introduction to the Critique of Hegel's Philosophy of Right\nCritique of Hegel's Philosophy of Right",
        summary:
          "Marx's first published statement of his new position: the criticism of religion must become the criticism of politics and society, and the agent of human emancipation is the proletariat.",
        body: `## Purpose

Written in Paris for the single issue of the *Deutsch-Französische Jahrbücher* that Marx co-edited with Arnold Ruge, the essay announced how German radical criticism should move beyond religion ([[tendency:young-hegelians]]).[cite:src_mia_critique_hpr_intro][cite:src_leopold_young_marx]

It should not be confused with the longer manuscript Marx wrote in Kreuznach in 1843, a paragraph-by-paragraph critique of Hegel's theory of the state that remained unpublished until 1927.[cite:src_mecw, vol. 3]

## Main argument

1. **Religion.** "The criticism of religion is the prerequisite of all criticism", and in Germany it has been essentially completed. Religion is both an expression of real suffering and a protest against it — the famous passage that ends by calling it "the opium of the people".[cite:src_mia_critique_hpr_intro]
2. **From heaven to earth.** The task now is to criticise the social and political conditions that need such consolations.
3. **Germany's backwardness.** Germany lags behind France and England politically, but its philosophy is abreast of the times.
4. **The proletariat.** Emancipation requires a class "with radical chains" whose suffering is universal — the proletariat. **Text.** "The head of this emancipation is philosophy, its heart the proletariat."[cite:src_mia_critique_hpr_intro]

## Important concepts

The proletariat as universal class ([[concept:proletariat]]); human versus merely political emancipation; the realisation of philosophy.

## Later influence and interpretation

**Interpretation.** Scholars read the essay as the hinge of Marx's development: the first appearance of the proletariat in his writing, though as the material force of a philosophical programme rather than yet as the product of an economic analysis.[cite:src_leopold_young_marx][cite:src_avineri] The "opium" passage is often quoted as simple hostility to religion; read in full, it also treats religion as "the sigh of the oppressed creature", a protest against suffering.`,
        context: `Marx wrote the essay in his first months in Paris, after the closure of the *Rheinische Zeitung* ([[event:rheinische-zeitung-ban]]). The same issue of the *Jahrbücher* carried his "On the Jewish Question" and Engels's *Outlines of a Critique of Political Economy*. The journal was banned in Prussia and did not continue.[cite:src_leopold_young_marx]`,
      },
    },
    {
      key: "text:economic-philosophic-manuscripts",
      title: "Economic and Philosophic Manuscripts of 1844",
      fields: {
        originalTitle: "Ökonomisch-philosophische Manuskripte aus dem Jahre 1844",
        language: "German",
        form: "manuscript",
        yearStart: 1844,
        publicationNote: "Written in Paris, April–August 1844; first published in full in 1932",
        edition: "trans. Martin Milligan (Progress, 1959); also in Marx, Early Writings (Penguin, 1975)",
        difficulty: "3",
        readingUrl: "https://www.marxists.org/archive/marx/works/1844/manuscripts/preface.htm",
        aliases: "1844 Manuscripts\nParis Manuscripts\nEconomic and Philosophical Manuscripts",
        summary:
          "Unfinished notebooks in which the 26-year-old Marx first confronted political economy and developed his theory of alienated labour. Unknown until 1932, they transformed twentieth-century readings of Marx.",
        body: `## Purpose

In Paris in 1844 Marx began reading the political economists — Smith, Ricardo, Say — and wrote these manuscripts as a critical commentary, mixing economics, Hegelian philosophy and Feuerbachian humanism. They were working notes, not a finished book.[cite:src_leopold_young_marx]

## Main argument

- **Wages, profit and rent.** Using the economists' own material, Marx shows the worker reduced to a commodity.
- **Estranged labour.** The central section develops the theory of alienated labour: alienation from the product, from the activity, from the human "species-being" and from other people ([[concept:alienation]]).[cite:src_mia_epm_labour]
- **Private property and communism.** Private property is the product of alienated labour, not its cause; "crude" communism that merely generalises envy is distinguished from communism as the positive transcendence of private property and the return of human beings to themselves ([[concept:communism]]).
- **Critique of Hegel's dialectic.** Hegel grasped labour as the essence of human self-creation, but only abstract, mental labour.

## Later influence

Publication in 1932 gave the world a "humanist" Marx. In the 1950s and 1960s the manuscripts became central for existentialists, Catholic and Protestant thinkers in dialogue with Marxism, the Yugoslav *Praxis* school and the New Left.[cite:src_kolakowski]

## Interpretations

**Disputed.** Whether the manuscripts express Marx's lasting views or a transitional, still-Feuerbachian stage is one of the classic disputes ([[thinker:marx]]). Editors have also questioned whether the notebooks form a single work at all, rather than being assembled into one by twentieth-century editors.[cite:src_leopold_young_marx][cite:src_sep_marx]`,
        context: `Paris in 1844 was the capital of European socialism, home to French socialist sects, German artisan communists and émigré intellectuals. Marx attended workers' meetings and was impressed by them; he also met [[thinker:proudhon]] and, in August, [[thinker:engels]].[cite:src_mclellan_marx]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample text record." },
        { type: "specialist-review", field: "body", note: "The editorial question of whether the 1844 notebooks form one work should be checked against MEGA editorial scholarship." },
      ],
    },
    {
      key: "text:theses-on-feuerbach",
      title: "Theses on Feuerbach",
      fields: {
        originalTitle: "Thesen über Feuerbach",
        language: "German",
        form: "notebooks",
        yearStart: 1845,
        publicationNote: "Written in Brussels in spring 1845; first published by Engels, in an edited version, in 1888 as an appendix to Ludwig Feuerbach",
        edition: "Both Marx's original and Engels's edited version in MECW vol. 5",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/marx/works/1845/theses/theses.htm",
        aliases: "Ad Feuerbach",
        summary:
          "Eleven short notes in which Marx settled accounts with Feuerbach and sketched a “new materialism” centred on practical, social human activity. Engels called them the first document of the new outlook.",
        body: `## Purpose

Marx jotted the theses in a notebook in 1845, apparently as notes for his own clarification while preparing *The German Ideology* ([[text:the-german-ideology]]). They were never meant for publication. Engels found them after Marx's death and published them, lightly edited, in 1888.[cite:src_theses_feuerbach][cite:src_mia_ludwig_feuerbach]

## Main argument

- **Against contemplative materialism** (I): Feuerbach, like earlier materialists, grasped reality only as an object of contemplation, not as practical human activity; idealism developed the "active side", but only abstractly.
- **Truth as practical** (II).
- **Education and self-change** (III): those who would change circumstances are themselves changed in the process.
- **Religion and society** (IV, VII): Feuerbach dissolved religion into its secular basis but did not explain why that basis divides against itself.
- **The social essence** (VI): the human essence is not an abstraction inherent in each individual but "the ensemble of the social relations".
- **Interpreting and changing** (XI).[cite:src_theses_feuerbach]

## Important concepts

[[concept:praxis]], [[concept:materialism]], [[concept:alienation]] (religious alienation as rooted in social life).

## Later influence

The eleventh thesis became the most quoted sentence Marx wrote; it is inscribed on his grave in Highgate Cemetery. Engels called the theses "the brilliant germ of the new world outlook".[cite:src_mia_ludwig_feuerbach]

## Interpretations

**Disputed.** Readers divide over whether the theses announce a new *philosophy* of practice (Gramsci, the Praxis school) or the end of philosophy in favour of social science (many orthodox and analytical readings).[cite:src_kolakowski][cite:src_sep_marx] Note also that Engels altered the wording in places; the two versions differ.[cite:src_theses_feuerbach]`,
        context: `Written in Brussels after Marx's expulsion from Paris, in the months when he and Engels were working out their break with the Young Hegelians and with Feuerbach ([[tendency:young-hegelians]]).[cite:src_mclellan_marx]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample text record." }],
    },
    {
      key: "text:the-german-ideology",
      title: "The German Ideology",
      fields: {
        originalTitle: "Die deutsche Ideologie",
        language: "German",
        form: "manuscript",
        yearStart: 1845,
        yearEnd: 1846,
        publicationNote: "Written in Brussels, 1845–46; abandoned unpublished; first published in full in 1932",
        edition: "MECW vol. 5; the critical MEGA edition (2017) presents the manuscripts as separate drafts",
        difficulty: "3",
        readingUrl: "https://www.marxists.org/archive/marx/works/1845/german-ideology/",
        aliases: "Die deutsche Ideologie",
        summary:
          "Marx and Engels's sprawling, unfinished polemic against the Young Hegelians, which contains the first extended statement of the materialist conception of history.",
        body: `## Purpose

Marx and Engels wrote the manuscripts to settle accounts with their former philosophical comrades — Feuerbach, Bruno Bauer and, at enormous length, Max Stirner — and with the "true socialists". No publisher would take them. **Text.** Marx later wrote that they abandoned the manuscript "to the gnawing criticism of the mice" all the more willingly since they had achieved their main purpose — "self-clarification".[cite:src_mia_preface_1859]

## Main argument

The most influential part, usually printed as the first chapter ("Feuerbach"), starts not from ideas but from "real individuals, their activity and the material conditions under which they live".[cite:src_mia_german_ideology]

- **Production first.** Humans distinguish themselves from animals when they begin to produce their means of subsistence; how they produce shapes how they live.
- **Division of labour and property.** Successive forms of the division of labour correspond to successive forms of property — tribal, ancient, feudal, modern.
- **Ideology.** Ideas are produced by people in definite social relations; the ruling ideas are the ideas of the ruling class ([[concept:ideology]]).
- **Communism.** Not an ideal to be realised but "the real movement which abolishes the present state of things"; it presupposes developed productive forces and a world market ([[concept:communism]]).

A famous passage imagines communist society making it possible "to hunt in the morning, fish in the afternoon, rear cattle in the evening, criticise after dinner".[cite:src_mia_german_ideology]

## Later influence

Published only in 1932, the text became a founding document of historical materialism for twentieth-century readers ([[concept:historical-materialism]]).

## Interpretations

**Disputed.** The "Feuerbach chapter" as usually read was assembled by twentieth-century editors from separate drafts in both men's hands, and recent editors argue that presenting it as a finished chapter overstates its coherence. Scholars also debate each author's share of the drafting and whether the hunting-fishing passage is ironic.[cite:src_carver_relationship][cite:src_kolakowski]`,
        context: `Written in Brussels in 1845–46, alongside Marx and Engels's first efforts to organise communist correspondence committees linking socialists in several countries ([[event:communist-league]]).[cite:src_mclellan_marx]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample text record." },
        { type: "specialist-review", field: "body", note: "The editorial history of the 'Feuerbach chapter' should be checked against the MEGA I/5 edition (2017) and recent editorial scholarship; the MEGA reference is from general knowledge." },
      ],
    },

    /* ——— Event ——— */
    {
      key: "event:rheinische-zeitung-ban",
      title: "The Rheinische Zeitung is banned",
      fields: {
        subtitle: "Rheinische Zeitung für Politik, Handel und Gewerbe",
        yearStart: 1843,
        dateLabel: "Ban ordered January 1843; last issue 31 March 1843",
        place: "Cologne, Prussian Rhineland",
        eventType: "repression",
        summary:
          "The Prussian government's suppression of the liberal Cologne newspaper that Marx edited — the end of his first career as a Young Hegelian journalist and, by his own account, the start of his turn to “material interests”.",
        body: `## What happened

The *Rheinische Zeitung*, founded in Cologne in January 1842 by liberal Rhineland businessmen, became an outlet for the radical Hegelians ([[tendency:young-hegelians]]). [[thinker:marx]] became its editor in October 1842. Under his editorship it criticised censorship, the Prussian estates and the government's treatment of the Rhineland poor, including a law criminalising the gathering of fallen wood and the plight of Moselle wine-growers.[cite:src_mclellan_marx]

In January 1843 the Prussian authorities ordered the paper closed from April. Marx resigned on 17 March; the last issue appeared at the end of the month.[cite:src_mclellan_marx][cite:src_sperber_marx]`,
        significance: `**Text.** In 1859 Marx described his work at the paper as the moment he "first found myself in the embarrassing position of having to discuss what is known as material interests", which drove him to study economic questions; after the paper's closure he was glad, he wrote, "to withdraw from the public stage to my study".[cite:src_mia_preface_1859]

**Interpretation.** Biographers treat the ban as a turning point: it ended the strategy of reforming Prussia through enlightened public criticism and pushed Marx towards Paris, socialism and political economy.[cite:src_sperber_marx][cite:src_leopold_young_marx]`,
      },
    },
  ],

  relationships: [
    { from: "thinker:hegel", type: "INFLUENCED", to: "thinker:marx", note: "Marx's philosophical formation was Hegelian; he later called himself Hegel's pupil while claiming to have inverted his method.", source: "src_mia_capital_moore", locator: "Afterword to the second German edition", weight: 3 },
    { from: "thinker:marx", type: "CRITIQUED", to: "thinker:hegel", note: "The 1843 critique of Hegel's theory of the state and the 1844 critique of Hegel's dialectic.", source: "src_mecw", locator: "vol. 3", yearStart: 1843, yearEnd: 1844, weight: 3 },
    { from: "thinker:feuerbach", type: "INFLUENCED", to: "thinker:marx", note: "The inversion of subject and predicate and the idea of species-being shaped Marx's writings of 1843–44.", source: "src_mia_ludwig_feuerbach", locator: "part 1", yearStart: 1841, yearEnd: 1844, weight: 3 },
    { from: "thinker:marx", type: "CRITIQUED", to: "thinker:feuerbach", note: "The Theses on Feuerbach: contemplative materialism and an abstract human essence.", source: "src_theses_feuerbach", yearStart: 1845, weight: 3 },
    { from: "thinker:marx", type: "MEMBER_OF", to: "tendency:young-hegelians", note: "Member of the Berlin Doctors' Club and editor of the Rheinische Zeitung, before his break with the movement in 1844–45.", source: "src_leopold_young_marx", yearStart: 1837, yearEnd: 1844 },
    { from: "thinker:engels", type: "MEMBER_OF", to: "tendency:young-hegelians", note: "Associated with the Berlin radicals during his military service of 1841–42.", source: "src_hunt_engels", yearStart: 1841, yearEnd: 1842 },
    { from: "text:the-german-ideology", type: "CRITIQUED", to: "tendency:young-hegelians", note: "A long polemic against Bauer and Stirner (and against Feuerbach).", source: "src_mia_german_ideology", weight: 3 },
    { from: "thinker:marx", type: "ASSOCIATED_WITH", to: "thinker:engels", note: "Collaborators from August 1844 until Marx's death: joint works, constant correspondence, Engels's financial support and posthumous editing of Capital.", source: "src_carver_relationship", yearStart: 1844, yearEnd: 1883, weight: 3 },
    { from: "thinker:engels", type: "INFLUENCED", to: "thinker:marx", note: "Engels's Outlines of a Critique of Political Economy (1844), which Marx called brilliant, helped turn him to economics.", source: "src_mia_preface_1859", yearStart: 1844, weight: 2 },
    { from: "thinker:proudhon", type: "INFLUENCED", to: "thinker:marx", note: "Marx read What is Property? in the early 1840s and met Proudhon in Paris in 1844; he praised the book even after their break.", source: "src_woodcock_proudhon", yearStart: 1842, yearEnd: 1845, basis: "interpretive" },
    { from: "thinker:marx", type: "CRITIQUED", to: "thinker:proudhon", note: "The Poverty of Philosophy (1847), a reply to Proudhon's System of Economic Contradictions.", source: "src_mia_poverty_philosophy", yearStart: 1847, weight: 3 },
    { from: "thinker:marx", type: "WROTE", to: "text:critique-of-hegels-philosophy-of-right", note: "Published in Paris, February 1844.", source: "src_mia_critique_hpr_intro", yearStart: 1844 },
    { from: "thinker:marx", type: "WROTE", to: "text:economic-philosophic-manuscripts", note: "Paris notebooks, 1844.", source: "src_1844_milligan", yearStart: 1844 },
    { from: "thinker:marx", type: "WROTE", to: "text:theses-on-feuerbach", note: "Brussels, spring 1845.", source: "src_theses_feuerbach", yearStart: 1845 },
    { from: "thinker:marx", type: "WROTE", to: "text:the-german-ideology", note: "With Engels, 1845–46.", source: "src_mia_german_ideology", yearStart: 1845 },
    { from: "thinker:engels", type: "WROTE", to: "text:the-german-ideology", note: "With Marx, 1845–46; the two men's shares of the drafting are debated.", source: "src_carver_relationship", yearStart: 1845 },
    { from: "thinker:marx", type: "DEVELOPED", to: "concept:alienation", note: "The theory of alienated labour (1844).", source: "src_mia_epm_labour", weight: 3 },
    { from: "thinker:marx", type: "DEVELOPED", to: "concept:praxis", note: "Practice as the basis of a new materialism (1845).", source: "src_theses_feuerbach", weight: 3 },
    { from: "thinker:marx", type: "DEVELOPED", to: "concept:ideology", note: "The critical theory of ideology (with Engels, 1845–46).", source: "src_mia_german_ideology", weight: 3 },
    { from: "thinker:feuerbach", type: "ASSOCIATED_WITH", to: "concept:alienation", note: "Religious alienation: human powers projected onto God.", source: "src_sep_alienation" },
    { from: "thinker:hegel", type: "ASSOCIATED_WITH", to: "concept:alienation", note: "Spirit's externalisation and return to itself, especially in the Phenomenology of Spirit.", source: "src_sep_alienation" },
    { from: "text:economic-philosophic-manuscripts", type: "DISCUSSES", to: "concept:alienation", note: "The section on estranged labour.", source: "src_mia_epm_labour", weight: 3 },
    { from: "text:theses-on-feuerbach", type: "DISCUSSES", to: "concept:praxis", note: "Theses I–III and XI.", source: "src_theses_feuerbach", weight: 3 },
    { from: "text:theses-on-feuerbach", type: "DISCUSSES", to: "concept:materialism", note: "The critique of contemplative materialism and the idea of a new materialism.", source: "src_theses_feuerbach" },
    { from: "text:theses-on-feuerbach", type: "CRITIQUED", to: "thinker:feuerbach", note: "The theses are named after, and directed against, Feuerbach.", source: "src_theses_feuerbach" },
    { from: "text:the-german-ideology", type: "DISCUSSES", to: "concept:ideology", note: "Ruling ideas and the ruling class; the camera obscura.", source: "src_mia_german_ideology", weight: 3 },
    { from: "text:the-german-ideology", type: "DISCUSSES", to: "concept:historical-materialism", note: "The first extended statement of the materialist conception of history.", source: "src_mia_german_ideology", weight: 3 },
    { from: "text:the-german-ideology", type: "DISCUSSES", to: "concept:materialism", note: "Starting from real individuals and their material conditions.", source: "src_mia_german_ideology" },
    { from: "text:essence-of-christianity", type: "INFLUENCED", to: "text:critique-of-hegels-philosophy-of-right", note: "The critique of religion Marx builds on is Feuerbach's.", source: "src_leopold_young_marx", basis: "interpretive" },
    { from: "text:essence-of-christianity", type: "INFLUENCED", to: "text:economic-philosophic-manuscripts", note: "Species-being and the model of alienation come from Feuerbach.", source: "src_sep_alienation" },
    { from: "text:theses-on-feuerbach", type: "PRECEDES", to: "text:the-german-ideology", note: "Notes written as Marx prepared the joint manuscript.", source: "src_mia_ludwig_feuerbach", basis: "interpretive" },
    { from: "thinker:marx", type: "PARTICIPATED_IN", to: "event:rheinische-zeitung-ban", note: "Editor from October 1842; resigned 17 March 1843.", source: "src_mclellan_marx", yearStart: 1842, yearEnd: 1843 },
    { from: "event:rheinische-zeitung-ban", type: "INFLUENCED", to: "thinker:marx", note: "By his own account, the paper's work on “material interests” turned him towards economic questions.", source: "src_mia_preface_1859" },
    { from: "event:rheinische-zeitung-ban", type: "ASSOCIATED_WITH", to: "tendency:young-hegelians", note: "The paper was one of the movement's main outlets; its closure was part of the Prussian crackdown of 1843.", source: "src_breckman" },
  ],

  excerpts: [
    {
      key: "critique-hpr-opium",
      entity: "text:critique-of-hegels-philosophy-of-right",
      speaker: "thinker:marx",
      text: "text:critique-of-hegels-philosophy-of-right",
      body: "Religion is the sigh of the oppressed creature, the heart of a heartless world, and the soul of soulless conditions. It is the opium of the people.",
      source: "src_mia_critique_hpr_intro",
      locator: "Introduction, opening section",
      note: "The full sentence matters: the famous last phrase follows an account of religion as protest against real suffering.",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1843/critique-hpr/intro.htm",
    },
    {
      key: "critique-hpr-head-heart",
      entity: "concept:praxis",
      speaker: "thinker:marx",
      text: "text:critique-of-hegels-philosophy-of-right",
      body: "The head of this emancipation is philosophy, its heart the proletariat.",
      source: "src_mia_critique_hpr_intro",
      locator: "Introduction, closing section",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1843/critique-hpr/intro.htm",
    },
    {
      key: "epm-poorer",
      entity: "concept:alienation",
      speaker: "thinker:marx",
      text: "text:economic-philosophic-manuscripts",
      body: "The worker becomes all the poorer the more wealth he produces, the more his production increases in power and size.",
      source: "src_mia_epm_labour",
      locator: "First manuscript, “Estranged Labour”",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1844/manuscripts/labour.htm",
    },
    {
      key: "theses-xi",
      entity: "concept:praxis",
      speaker: "thinker:marx",
      text: "text:theses-on-feuerbach",
      body: "The philosophers have only interpreted the world, in various ways; the point is to change it.",
      source: "src_theses_feuerbach",
      locator: "Thesis XI",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1845/theses/theses.htm",
    },
    {
      key: "theses-vi",
      entity: "text:theses-on-feuerbach",
      speaker: "thinker:marx",
      text: "text:theses-on-feuerbach",
      body: "Feuerbach resolves the religious essence into the human essence. But the human essence is no abstraction inherent in each single individual. In its reality it is the ensemble of the social relations.",
      source: "src_theses_feuerbach",
      locator: "Thesis VI",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1845/theses/theses.htm",
    },
    {
      key: "german-ideology-ruling-ideas",
      entity: "concept:ideology",
      speaker: "thinker:marx",
      text: "text:the-german-ideology",
      body: "The ideas of the ruling class are in every epoch the ruling ideas, i.e. the class which is the ruling material force of society, is at the same time its ruling intellectual force.",
      source: "src_mia_german_ideology",
      locator: "Part I, “Ruling Class and Ruling Ideas”",
      note: "Joint work of Marx and Engels; Marx is listed as speaker by convention.",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1845/german-ideology/ch01b.htm",
    },
    {
      key: "engels-feuerbachians",
      entity: "thinker:feuerbach",
      speaker: "thinker:engels",
      body: "Enthusiasm was general; we all became at once Feuerbachians.",
      source: "src_mia_ludwig_feuerbach",
      locator: "Part I",
      note: "Engels recalling, forty years later, the effect of The Essence of Christianity.",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1886/ludwig-feuerbach/ch01.htm",
    },
  ],
};
