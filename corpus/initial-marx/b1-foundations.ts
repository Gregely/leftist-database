import type { CorpusBatch } from "../../src/lib/corpus/types";
import { SOURCES } from "./sources";

/**
 * Batch 1 — Before Marx. The problems Marx inherited: German idealism and
 * its radical Hegelian afterlife, the materialist critique of religion,
 * British political economy, and the first socialists.
 *
 * Voice conventions used throughout the corpus:
 *   **Text.**           what a primary source itself says
 *   **Interpretation.** how later scholars or traditions read it
 *   **Context.**        what historians infer from circumstances
 *   **Disputed.**       where there is genuine scholarly disagreement
 */
export const batch1: CorpusBatch = {
  id: "b1",
  title: "Before Marx: German philosophy, political economy and early socialism",
  sources: SOURCES,
  entities: [
    /* ——————————————————————————— Thinkers ——————————————————————————— */
    {
      key: "thinker:hegel",
      title: "Georg Wilhelm Friedrich Hegel",
      fields: {
        yearStart: 1770,
        yearEnd: 1831,
        subtitle: "1770–1831",
        roles: "German idealist philosopher of reason, freedom and historical development",
        birthPlace: "Stuttgart",
        deathPlace: "Berlin",
        aliases: "G. W. F. Hegel\nHegel",
        summary:
          "The philosopher whose account of reason, freedom and history set the terms of debate for the generation of German radicals among whom Marx came of age. Marx learned to think both with and against him.",
        body: `## Why Hegel matters here

Hegel built one of the most ambitious philosophical systems ever attempted, and this corpus does not try to summarise it. What matters for the story of Marxism is narrower: a set of problems and a way of thinking that Marx and his contemporaries inherited from Hegel and argued about for the rest of their lives.[cite:src_sep_hegel]

### Development

Hegel studied theology and philosophy at the Tübingen seminary (1788–93), where his friends included the poet Hölderlin and the philosopher Schelling. After years as a private tutor he taught at Jena, where he finished the *Phenomenology of Spirit* (1807) as Napoleon's army entered the town. He then edited a newspaper in Bamberg, ran a grammar school in Nuremberg — where he wrote the *Science of Logic* (1812–16) — and held chairs at Heidelberg and, from 1818 until his death in 1831, at Berlin.[cite:src_sep_hegel][cite:src_taylor_hegel]

### Core questions

- **How does reason develop?** For Hegel, concepts are not fixed. Thinking through a concept exposes tensions within it, and resolving them produces a richer one. This movement — his *dialectic* — is meant to be the way reality itself becomes intelligible, not a technique applied from outside.[cite:src_sep_hegel_dialectics]
- **How can freedom become real?** The *Elements of the Philosophy of Right* (1820) traces freedom from abstract rights through morality to the institutions of the family, *civil society* (the sphere of needs, work and market exchange) and the state.[cite:src_hegel_pr_nisbet]
- **What is history?** In his Berlin lectures, history is the story of the growing consciousness and realisation of freedom.

**Text.** Hegel did not think the market society he described was problem-free. In the *Philosophy of Right* he notes that civil society produces both great wealth and a mass of poor people, and that it is not rich enough to cure the poverty it creates.[cite:src_hegel_pr_nisbet, §§ 241–248] That unresolved problem would matter to readers who wanted to go further than he did.

### Disputed: which Hegel?

After his death his followers split over religion and politics. In 1837 D. F. Strauss borrowed the language of parliamentary seating to sort them into a right, a centre and a left; the radical "left" or "Young" Hegelians are where Marx began ([[tendency:young-hegelians]]).[cite:src_breckman] Scholars still disagree about how to read Hegel himself — as a metaphysician of absolute spirit, as a theorist of social reason and recognition, as a defender or a critic of the Prussian state — and the choice shapes how one reads what Marx took from him.[cite:src_sep_hegel]`,
        context: `Hegel's career ran from the French Revolution, which he greeted with enthusiasm as a student, through Napoleon's reorganisation of Germany to the restoration that followed 1815 ([[event:french-revolution]]).[cite:src_taylor_hegel] In Berlin his philosophy enjoyed official favour under the Prussian minister of culture, Altenstein. After 1840 the new king, Frederick William IV, turned against the Hegelian school; in 1841 Schelling was brought to Berlin to counter its influence, and radical Hegelians were pushed out of academic careers — one reason so many of them, Marx included, turned to journalism.[cite:src_breckman][cite:src_leopold_young_marx]`,
        legacy: `## Significance for Marxism

**Text.** Marx acknowledged the debt directly. In the afterword to the second German edition of *Capital* (1873) he wrote that he had "openly avowed" himself Hegel's pupil while insisting that his own method was "the direct opposite" of Hegel's: for Hegel thought creates the real, for Marx the ideal is the material world "reflected by the human mind".[cite:src_mia_capital_moore, Afterword to the second German edition] Engels gave a fuller, and more schematic, account in *Ludwig Feuerbach and the End of Classical German Philosophy* (1886).[cite:src_mia_ludwig_feuerbach]

**Interpretation.** How much of Hegel survives in Marx is one of the longest-running arguments in the tradition. Readers in the 1920s (Lukács, Korsch) restored Hegel to the centre of Marxism; others, notably Althusser in the 1960s, argued that the mature Marx broke with him.[cite:src_kolakowski] See [[concept:dialectics]].

## Criticisms

The Young Hegelians, and Marx in 1843, accused Hegel of accommodating the existing state and of "mystifying" real social relations by presenting them as stages in the life of an abstract Idea.[cite:src_leopold_young_marx] [[thinker:feuerbach]] argued that speculative philosophy was theology in disguise.[cite:src_sep_feuerbach] Liberal critics in the twentieth century read his account of the state as authoritarian; many recent scholars dispute that reading.[cite:src_sep_hegel]

## Further reading

Charles Taylor's *Hegel* remains a lucid introduction; Paul Redding's encyclopedia article surveys current interpretations; Julie Maybee explains the dialectic without the "thesis–antithesis–synthesis" shorthand that Hegel did not use.[cite:src_taylor_hegel][cite:src_sep_hegel][cite:src_sep_hegel_dialectics]`,
      },
      citations: [
        { source: "src_hegel_phenomenology_miller", note: "Primary text" },
        { source: "src_beiser_companion", note: "Scholarship" },
      ],
      flags: [
        { type: "sample-overlap", note: "This version replaces the seeded sample entry for Hegel. The sample's own relationships, citations and excerpts remain attached; decide which to keep." },
        { type: "specialist-review", note: "Hegel interpretation is a specialist field; a Hegel scholar should check the characterisation of the dialectic and of the Philosophy of Right." },
      ],
    },
    {
      key: "thinker:feuerbach",
      title: "Ludwig Feuerbach",
      fields: {
        yearStart: 1804,
        yearEnd: 1872,
        subtitle: "1804–1872",
        roles: "German philosopher; critic of religion and of Hegel's speculative philosophy",
        birthPlace: "Landshut, Bavaria",
        deathPlace: "Rechenberg, near Nuremberg",
        aliases: "Ludwig Andreas Feuerbach",
        summary:
          "Philosopher who argued that God is a projection of human qualities and that Hegel's philosophy was theology in disguise. For a few years in the early 1840s his humanist materialism electrified the radical Hegelians, Marx and Engels among them.",
        body: `## Intellectual role

Feuerbach is the bridge in this corpus between Hegel and Marx. He took the critical method of the Hegelian school and turned it against both Christianity and Hegel himself.[cite:src_sep_feuerbach]

### Development

He studied theology at Heidelberg before moving to Berlin to hear Hegel (1824–26). An anonymous book attacking belief in personal immortality (1830) was traced to him and closed off an academic career; from 1837 he lived largely in the village of Bruckberg, writing.[cite:src_sep_feuerbach]

His decisive book, *The Essence of Christianity* (1841), argued that religion is humanity's relation to its own nature, experienced as a relation to another being ([[text:essence-of-christianity]]). In the *Provisional Theses for the Reformation of Philosophy* (1842) and *Principles of the Philosophy of the Future* (1843) he extended the argument to Hegel: speculative philosophy, too, takes human attributes — thought, reason — and treats them as an independent subject.[cite:src_sep_feuerbach][cite:src_harvey_feuerbach]

### Core ideas

- **Projection.** In worshipping God, human beings worship the powers of their own species — love, reason, will — which they have separated from themselves and placed above themselves.
- **Inversion.** Philosophy should reverse Hegel's order of subject and predicate: thought is an activity of real, embodied human beings, not the other way round.
- **Sensuousness and community.** Truth begins from sensuous, finite human beings in relation to one another, not from abstract thought.

**Interpretation.** Feuerbach is often described as a materialist. He was ambivalent about the label, and his "materialism" is better understood as a naturalistic humanism focused on the human species and its relationships than as a theory of matter.[cite:src_sep_feuerbach] See [[concept:materialism]].`,
        context: `The early 1840s were the high point of radical Hegelian criticism of religion, and in Prussia criticism of religion was also criticism of the "Christian state" ([[tendency:young-hegelians]]). Feuerbach's books arrived at the moment when that movement was looking for a way past Hegel.[cite:src_breckman] He supported the revolution of 1848 and lectured on religion to students in Heidelberg in 1848–49, but his influence waned after the revolutions failed.[cite:src_sep_feuerbach]`,
        legacy: `## Significance

**Text.** Engels later recalled the effect of *The Essence of Christianity* on his generation as a liberation and wrote that they had all, for a time, become followers of Feuerbach.[cite:src_mia_ludwig_feuerbach, part 1]

In 1844 Marx used Feuerbach's inversion of subject and predicate and his idea of the human "species-being" to analyse the alienation of labour ([[concept:alienation]]). By 1845, in the *Theses on Feuerbach*, he was criticising him: Feuerbach saw human beings only as objects of contemplation, not as practical, world-changing activity, and treated the "human essence" as an abstraction instead of the ensemble of social relations ([[text:theses-on-feuerbach]]).[cite:src_theses_feuerbach]

**Disputed.** How Feuerbachian the young Marx was is contested. Some readers see the *1844 Manuscripts* as essentially Feuerbachian; others argue that Marx had already transformed Feuerbach's anthropology into a theory of labour and society.[cite:src_leopold_young_marx]

Beyond Marxism, Feuerbach's projection theory anticipated later psychological and anthropological accounts of religion.[cite:src_harvey_feuerbach]

## Criticisms

Besides Marx's objection that his humanism was contemplative and ahistorical, Max Stirner attacked Feuerbach's "species" as one more abstraction set over real individuals.[cite:src_breckman] Theologians have argued that projection explains religious belief only by assuming that its object does not exist.[cite:src_harvey_feuerbach]

## Further reading

Todd Gooch's encyclopedia article; Van Harvey, *Feuerbach and the Interpretation of Religion*; Warren Breckman on Feuerbach's place among the Young Hegelians.[cite:src_sep_feuerbach][cite:src_harvey_feuerbach][cite:src_breckman]`,
      },
      flags: [{ type: "specialist-review", note: "The characterisation of Feuerbach's ambivalence about 'materialism' follows the SEP entry; a specialist should confirm the wording." }],
    },
    {
      key: "thinker:adam-smith",
      title: "Adam Smith",
      fields: {
        yearStart: 1723,
        yearEnd: 1790,
        subtitle: "1723–1790",
        roles: "Scottish moral philosopher and political economist",
        birthPlace: "Kirkcaldy, Fife",
        deathPlace: "Edinburgh",
        aliases: "Smith",
        summary:
          "Scottish Enlightenment philosopher whose Wealth of Nations (1776) founded the political economy Marx set out to criticise: an account of how the division of labour, exchange and accumulation produce wealth, and of how income is divided between classes.",
        body: `## Intellectual role

Smith appears in this corpus because Marx's mature work is, by its own subtitle, a *critique of political economy* — and political economy, as a systematic science of wealth, began with him.[cite:src_sep_smith][cite:src_schumpeter_hea]

### Development

Smith studied at Glasgow under Francis Hutcheson and at Balliol College, Oxford. As professor of moral philosophy at Glasgow he published *The Theory of Moral Sentiments* (1759), a theory of moral judgement grounded in sympathy. Travelling in France as a tutor (1764–66) he met the physiocrats, the French economists who first modelled the economy as a circular flow. *An Inquiry into the Nature and Causes of the Wealth of Nations* appeared in 1776; Smith spent his last years as a commissioner of customs in Edinburgh.[cite:src_sep_smith]

### Core ideas

- **The division of labour** multiplies productivity, and its extent is limited by the extent of the market.[cite:src_smith_wealth, book I, ch. 1–3]
- **Labour and value.** Smith treated labour as the "real measure" of exchangeable value, though he wavered between value as the labour a good *embodies* and the labour it can *command* in exchange — an ambiguity Ricardo and Marx both seized on.[cite:src_meek_labour_value]
- **Three classes, three incomes.** Rent goes to landlords, wages to labourers, profit to the owners of stock (capital) — a class map of commercial society that Marx inherited and reworked.[cite:src_smith_wealth, book I]
- **Against mercantilism.** Smith attacked monopolies and state-protected merchant interests and argued for a "system of natural liberty".

**Interpretation.** The famous "invisible hand" appears only once in the *Wealth of Nations*, and Smith's work combines its case for markets with sharp criticism of merchants' and employers' interests and concern for the moral effects of repetitive labour. Recent scholarship stresses how far he is from later free-market caricatures.[cite:src_sep_smith]`,
        context: `Smith wrote in commercial Scotland after the Union of 1707, in the circle of the Scottish Enlightenment (Hume was a close friend), before the factory system of the industrial revolution had taken hold. His examples — the pin manufactory — are workshop examples. Scottish thinkers also developed a "stadial" history of society passing through hunting, pastoral, agricultural and commercial stages; historians see this as one source of later materialist theories of history.[cite:src_sep_smith][cite:src_meek_labour_value]`,
        legacy: `## Significance for Marx

Marx read Smith closely from 1844, filling notebooks with excerpts, and devoted long sections of his *Theories of Surplus-Value* to him.[cite:src_mecw, vols. 30–32] He credited Smith with grounding value in labour and with seeing that profit and rent are deductions from what labour produces, but criticised him for treating the categories of commercial society as natural and eternal.[cite:src_meek_labour_value]

## Criticisms

From the left, critics argued that Smith's own premises implied that labour was entitled to its whole product; from within economics, the marginalist revolution of the 1870s abandoned the labour-based theory of value altogether.[cite:src_meek_labour_value][cite:src_schumpeter_hea]

## Further reading

Samuel Fleischacker's encyclopedia article; Ronald Meek on the history of the labour theory of value.[cite:src_sep_smith][cite:src_meek_labour_value]`,
      },
    },
    {
      key: "thinker:ricardo",
      title: "David Ricardo",
      fields: {
        yearStart: 1772,
        yearEnd: 1823,
        subtitle: "1772–1823",
        roles: "English political economist; theorist of value, rent and distribution",
        birthPlace: "London",
        deathPlace: "Gatcombe Park, Gloucestershire",
        aliases: "Ricardo",
        summary:
          "Stockbroker turned economist whose Principles of Political Economy (1817) gave classical economics its most rigorous form. His labour theory of value and his analysis of conflicting class incomes were the starting point of Marx's own economics.",
        body: `## Intellectual role

If Smith founded political economy, Ricardo gave it the abstract, deductive form that Marx admired and set out to overturn. Marx treated him as the high point of the classical school.[cite:src_meek_labour_value][cite:src_schumpeter_hea]

### Development

Born into a Sephardic Jewish family of Dutch origin, Ricardo became a successful stockbroker and financier. He read the *Wealth of Nations* in 1799, entered public debate during the bullion controversy over paper money (1809–10), and argued against agricultural protection in his *Essay on … Profits* (1815). *On the Principles of Political Economy and Taxation* appeared in 1817 and was revised twice. He sat in Parliament from 1819 until his death in 1823.[cite:src_ricardo_principles]

### Core ideas

- **Labour and value.** The value of a commodity depends on the relative quantity of labour necessary for its production — a cleaner statement than Smith's, though Ricardo knew that differences in capital and time complicated it.[cite:src_ricardo_principles, ch. 1][cite:src_meek_labour_value]
- **Distribution as conflict.** Rent, profit and wages are not independent: with a given product, higher wages mean lower profits. Rent arises because land differs in fertility; as cultivation extends to poorer land, rents rise and the rate of profit tends to fall.
- **Comparative advantage** in international trade.
- **Machinery.** In the third edition (1821) Ricardo added a chapter conceding that the introduction of machinery could harm the interests of labourers — a striking admission for a defender of the market.[cite:src_ricardo_principles, ch. 31]`,
        context: `Ricardo wrote during the Napoleonic Wars and the post-war depression, amid fierce argument over the Corn Laws that protected landowners' incomes. His economics took the side of manufacturers against landlords. In the 1820s and 1830s radical writers sometimes called the "Ricardian socialists" (among them William Thompson and Thomas Hodgskin) argued from labour-based value that workers were robbed of their product.[cite:src_meek_labour_value][cite:src_claeys_citizens]`,
        legacy: `## Significance for Marx

Marx read Ricardo in Paris in 1844 and again, in depth, in London in the 1850s.[cite:src_stedman_jones_marx] His theory of value begins from Ricardo's, but asks questions Ricardo did not: why labour takes the form of value at all, and how, if commodities exchange at their values, profit can arise. His answer — the distinction between labour and labour-power — is the core of the theory of surplus value ([[concept:surplus-value]]).[cite:src_heinrich_capital]

## Criticisms

Joseph Schumpeter coined the phrase "the Ricardian vice" for building sweeping practical conclusions on highly simplified models.[cite:src_schumpeter_hea] The marginalist economists of the 1870s replaced labour-based value with value based on utility at the margin.[cite:src_meek_labour_value]

## Further reading

Piero Sraffa's edition of the *Works and Correspondence*; Ronald Meek on the labour theory of value.[cite:src_ricardo_principles][cite:src_meek_labour_value]`,
      },
    },
    {
      key: "thinker:saint-simon",
      title: "Henri de Saint-Simon",
      fields: {
        yearStart: 1760,
        yearEnd: 1825,
        subtitle: "1760–1825",
        roles: "French social theorist; prophet of an industrial society run by producers",
        birthPlace: "Paris",
        deathPlace: "Paris",
        aliases: "Claude-Henri de Rouvroy, comte de Saint-Simon\nSaint-Simon",
        summary:
          "Aristocrat, revolutionary-era speculator and visionary who argued that modern society should be organised by and for its productive members — scientists, engineers, industrialists and workers. His followers turned his ideas into one of the first socialist movements.",
        body: `## Intellectual role

Saint-Simon belongs to the generation that tried to understand what kind of society would follow the French Revolution and the industrial revolution. Marx and Engels later classed him with Fourier and Owen as a "utopian" socialist — a label this corpus treats with caution ([[tendency:early-socialism]]).[cite:src_manuel_saint_simon][cite:src_taylor_utopian]

### Development

Born into an old noble family, Saint-Simon served with the French forces in the American War of Independence. During the Revolution he renounced his title, made a fortune speculating in confiscated church and noble lands, and was imprisoned during the Terror. Having lost most of his money, he spent his later life writing — assisted for a time by the historian Augustin Thierry and the young Auguste Comte — in poverty.[cite:src_manuel_saint_simon]

### Core ideas

- **The industrial society.** Modern society is divided between the productive (*les industriels*) and the idle. Power should pass from soldiers, nobles and lawyers to those who produce and to scientists who understand production.
- **Administration rather than domination.** Government in an industrial society should become the rational management of production rather than command over people.
- **A new religion of social welfare.** His last work, *The New Christianity* (1825), made improving the condition of the poorest class the central religious duty.[cite:src_manuel_saint_simon]

**Disputed.** Engels attributed to Saint-Simon the idea that the government of persons would be replaced by the administration of things. The idea is Saint-Simonian, but the familiar wording is Engels's own, and how far Saint-Simon himself held it is debated.[cite:src_mia_soc_utopian][cite:src_taylor_utopian]`,
        context: `After his death, disciples including Prosper Enfantin and Saint-Amand Bazard turned his ideas into a movement and a quasi-church. Their lectures on the *Doctrine of Saint-Simon* (1828–29) criticised inheritance and the "exploitation of man by man" — an early use of a phrase that would become central to socialist vocabulary ([[concept:exploitation]]).[cite:src_manuel_saint_simon][cite:src_taylor_utopian] Several Saint-Simonians later became bankers and railway builders under the Second Empire.`,
        legacy: `## Significance

Saint-Simon's influence runs in two directions: through Comte into positivist sociology, and through his disciples into early socialism and technocratic thought. Engels praised his insight that politics is the science of production and that economic conditions underlie political institutions.[cite:src_mia_soc_utopian, ch. 1]

## Criticisms

Marx and Engels objected that Saint-Simonian plans were addressed to enlightened elites rather than to workers' own action. Later critics have seen in the vision of rule by experts a source of technocracy rather than democracy.[cite:src_taylor_utopian]

## Further reading

Frank Manuel, *The New World of Henri Saint-Simon*; Keith Taylor, *The Political Ideas of the Utopian Socialists*.[cite:src_manuel_saint_simon][cite:src_taylor_utopian]`,
      },
      flags: [{ type: "specialist-review", note: "Biographical details (American war service, speculation, imprisonment) follow Manuel; confirm against a recent biography." }],
    },
    {
      key: "thinker:fourier",
      title: "Charles Fourier",
      fields: {
        yearStart: 1772,
        yearEnd: 1837,
        subtitle: "1772–1837",
        roles: "French social theorist; critic of commercial civilisation and designer of cooperative communities",
        birthPlace: "Besançon",
        deathPlace: "Paris",
        aliases: "François Marie Charles Fourier",
        summary:
          "Commercial clerk and visionary who condemned the waste, fraud and misery of commercial society and imagined communities — the phalanxes — in which work would be organised around human passions and made attractive.",
        body: `## Intellectual role

Fourier is the most imaginative of the early socialists and the sharpest critic of what he called "civilisation": the commercial order of his day, with its speculation, middlemen, poverty amid plenty and loveless marriages.[cite:src_beecher_fourier]

### Development

The son of a cloth merchant, Fourier spent most of his working life as a commercial traveller and clerk in Lyon and Paris, an experience that fed his hatred of trade. His first book, *The Theory of the Four Movements* (1808), was followed by the *Treatise on Domestic-Agricultural Association* (1822) and *The New Industrial and Societal World* (1829). He waited, famously, for a patron to fund an experimental community; none came in his lifetime.[cite:src_beecher_fourier]

### Core ideas

- **Passional attraction.** Human passions are not to be repressed but harnessed; a well-designed society would arrange work so that people are drawn to it.
- **The phalanx.** A community of some sixteen hundred people living in a common building (the *phalanstère*), rotating between varied tasks and sharing in the product according to labour, capital and talent.
- **Women's emancipation.** Fourier treated the condition of women as a measure of social progress and attacked bourgeois marriage.[cite:src_beecher_fourier]`,
        context: `Fourier's disciples, led by Victor Considerant, built a movement in the 1830s and 1840s; several dozen short-lived "phalanxes" were founded in the United States in the 1840s.[cite:src_beecher_fourier] Lyon, where Fourier worked, was also the scene of the silk workers' risings of 1831 and 1834 — a reminder that the "social question" was not merely theoretical.`,
        legacy: `## Significance

Engels admired Fourier's satire of bourgeois society and his dialectical sense of history, while rejecting his plans as schemes to be realised by persuasion and example rather than class struggle.[cite:src_mia_soc_utopian, ch. 1] Later readers — from anarchists to feminists and twentieth-century critics of alienated work — have returned to Fourier for his insistence that labour can be pleasurable and that desire belongs in social theory.[cite:src_beecher_fourier]

## Criticisms

His cosmology and calculations of passions struck contemporaries as eccentric; his communities, where attempted, did not last. Marx and Engels counted him among the utopians who sought to invent a society rather than discover the movement already producing one ([[tendency:early-socialism]]).

## Further reading

Jonathan Beecher's biography is the standard account in English.[cite:src_beecher_fourier]`,
      },
    },
    {
      key: "thinker:owen",
      title: "Robert Owen",
      fields: {
        yearStart: 1771,
        yearEnd: 1858,
        subtitle: "1771–1858",
        roles: "Welsh mill owner, reformer and founder of British cooperative socialism",
        birthPlace: "Newtown, Montgomeryshire",
        deathPlace: "Newtown, Montgomeryshire",
        aliases: "Owen",
        summary:
          "Cotton-mill manager who turned New Lanark into a model of humane industry, argued that character is formed by circumstances, and inspired the cooperative and Owenite socialist movements in Britain and America.",
        body: `## Intellectual role

Owen gives this corpus its industrial British strand of early socialism: a practical reformer who started from inside the factory system and came to argue for its replacement by cooperative communities.[cite:src_harrison_owen][cite:src_claeys_citizens]

### Development

A draper's apprentice who rose to manage a Manchester cotton mill, Owen became managing partner of the New Lanark mills in Scotland in 1800. There he limited child labour, improved housing and opened schools, including one of the first infant schools in Britain. *A New View of Society* (1813–16) set out his principle that character is formed *for* people by their circumstances, not *by* them — so that a rational environment would produce rational and cooperative human beings.[cite:src_owen_new_view]

He campaigned for factory legislation, proposed "villages of cooperation" for the unemployed (1817), and in 1825 bought the settlement of New Harmony in Indiana for a communal experiment that collapsed within two years.[cite:src_harrison_owen]

### Core ideas

- **Environmentalism of character**: social conditions, especially education, shape character.
- **Cooperation instead of competition**: the competitive pursuit of profit produced poverty amid growing productive power.
- **Labour as the measure of value**: Owenite labour exchanges in the early 1830s experimented with notes denominated in hours of labour.[cite:src_claeys_citizens]`,
        context: `Owen's career spans the industrial revolution in its most brutal phase. In the late 1820s and 1830s Owenism became a mass movement of cooperative societies and trade unions; Owen was associated with the short-lived Grand National Consolidated Trades Union of 1834. The word "socialist" first came into English usage in Owenite circles.[cite:src_claeys_citizens][cite:src_williams_keywords]`,
        legacy: `## Significance

Engels, who knew the Owenite movement in Manchester, treated Owen with respect, crediting him with every real advance made in the interest of the English working class in his time.[cite:src_mia_soc_utopian, ch. 1] The cooperative movement is his most durable legacy.

## Criticisms

Owen addressed his appeals to monarchs, parliaments and philanthropists and was often hostile to independent working-class politics; historians have described the movement he inspired as combining radical social goals with a paternalist, sometimes "anti-political" outlook.[cite:src_claeys_citizens] Marx and Engels criticised this reliance on enlightened benefactors.

## Further reading

J. F. C. Harrison on the Owenites; Gregory Claeys on the politics of early British socialism.[cite:src_harrison_owen][cite:src_claeys_citizens]`,
      },
    },
    {
      key: "thinker:proudhon",
      title: "Pierre-Joseph Proudhon",
      fields: {
        yearStart: 1809,
        yearEnd: 1865,
        subtitle: "1809–1865",
        roles: "French socialist and anarchist; theorist of mutualism and federation",
        birthPlace: "Besançon",
        deathPlace: "Passy, Paris",
        aliases: "Proudhon",
        summary:
          "Self-taught printer who asked What is Property? (1840) and answered that it was theft; the first writer to call himself an anarchist. His quarrel with Marx in 1846–47 was one of the formative disputes of the socialist movement.",
        body: `## Intellectual role

Proudhon was the most influential socialist in France for most of Marx's lifetime, and Marx defined his own position partly by attacking him. His ideas shaped French workers' associations, the early First International and the anarchist tradition.[cite:src_woodcock_proudhon][cite:src_ehrenberg_proudhon]

### Development

The son of a cooper and a cook, Proudhon was largely self-educated while working as a printer. *What is Property?* (1840) argued that property, understood as the right to an income from things one does not use or work — rent, interest, profit — is a form of theft, while defending "possession": the right of producers to the use of what they work.[cite:src_what_is_property] In the same book he called himself an anarchist.

In Paris in 1844–45 he met Marx, who later claimed to have taught him Hegel. In May 1846 Marx invited him to join an international correspondence committee of socialists. Proudhon replied that he would correspond but warned against making socialism a new dogma and doubted the need for revolutionary action.[cite:src_woodcock_proudhon] Months later his *System of Economic Contradictions, or the Philosophy of Poverty* (1846) appeared; Marx answered with *The Poverty of Philosophy* (1847).[cite:src_mia_poverty_philosophy]

Elected to the Constituent Assembly in 1848, Proudhon tried to found a People's Bank offering free credit, and was imprisoned (1849–52) for attacks on Louis Napoleon. His later works developed a federalist theory of society built on contracts between free associations of producers.[cite:src_woodcock_proudhon]

### Core ideas

- **Mutualism**: exchange between independent producers and cooperatives at equal value, financed by free or cheap credit, rather than common ownership.
- **Anti-statism and federalism**: political authority to be dissolved into contracts among associations and communes.
- **Justice and balance**: his social thought seeks equilibrium between opposing principles rather than their overcoming.`,
        context: `Proudhon wrote for a France of artisans, small workshops and peasant property rather than large factories, and his programme spoke to that world. His followers were strong among the French members of the First International in the 1860s ([[event:first-international]]).[cite:src_ehrenberg_proudhon]`,
        legacy: `## Significance

**Text.** Marx's *Poverty of Philosophy* accused Proudhon of misunderstanding both Hegel and political economy: he treated economic categories as eternal ideas with "good" and "bad" sides instead of as expressions of historical relations of production.[cite:src_mia_poverty_philosophy] Marx's later obituary letter (1865) was more mixed, praising *What is Property?* as an epoch-making book.

**Interpretation.** Historians of anarchism see Proudhon as its first major theorist; historians of Marxism see the 1846–47 quarrel as the moment Marx first set out his historical materialism in print against a rival socialism.[cite:src_woodcock_proudhon][cite:src_kolakowski]

## Criticisms

Beyond Marx's critique, critics have pointed to Proudhon's hostility to women's equality — he defended the patriarchal family and opposed women's public role — and to antisemitic passages in his private notebooks.[cite:src_woodcock_proudhon] His economic proposals, such as free credit, were criticised as unworkable by socialists and liberals alike.

## Further reading

George Woodcock's biography; John Ehrenberg, *Proudhon and His Age*.[cite:src_woodcock_proudhon][cite:src_ehrenberg_proudhon]`,
      },
      citations: [{ source: "src_mia_proudhon_property", note: "Open-access translation (Tucker); the famous formula is rendered there as “It is robbery”." }],
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample entry for Proudhon; existing sample relationships remain attached." },
        { type: "specialist-review", field: "legacy", note: "The sentence on antisemitic passages in Proudhon's notebooks needs a precise scholarly citation (the notebooks, the Carnets, and a study discussing them); Woodcock is cited for the general point only." },
      ],
    },

    /* ——————————————————————————— Tendencies ——————————————————————————— */
    {
      key: "tendency:german-idealism",
      title: "German Idealism",
      fields: {
        yearStart: 1781,
        yearEnd: 1854,
        periodLabel: "1780s–1840s",
        color: "ink",
        aliases: "Classical German philosophy",
        summary:
          "The philosophical movement from Kant to Hegel that made freedom, reason and the activity of the mind the centre of philosophy — and gave Marx both his vocabulary and his adversary.",
        body: `## What it was

German Idealism names the philosophy that runs from Kant's *Critique of Pure Reason* (1781) through Fichte and Schelling to Hegel. Its common thread is the claim that the mind is active: the world as we know it is in some way structured by, or the expression of, reason. "Idealism" here does not mean high ideals; it means that thought or spirit, rather than matter alone, is fundamental to explaining reality and knowledge ([[concept:idealism]]).[cite:src_sep_idealism]

### Main problems

- **Freedom and autonomy**: how can rational beings be self-determining in a world of natural causes?
- **Subject and object**: how is knowledge of an independent world possible if the mind shapes experience?
- **System and history**: after Kant, Fichte, Schelling and above all [[thinker:hegel]] sought a single systematic account in which nature, society and history are stages in the development of reason.[cite:src_beiser_companion]

**Interpretation.** Engels called this tradition "classical German philosophy" and presented Marxism as its heir, keeping its dialectical method while rejecting its idealism.[cite:src_mia_ludwig_feuerbach] Historians of philosophy now generally treat the movement as more varied than that story suggests.[cite:src_sep_idealism]`,
        context: `The movement unfolded during the French Revolution and the Napoleonic wars, in a politically fragmented Germany whose universities were centres of national intellectual life. Several of its thinkers greeted the Revolution as the attempt to make reason and freedom the basis of the state ([[event:french-revolution]]).[cite:src_taylor_hegel]`,
        criticisms: `After Hegel's death, critics attacked idealism from several sides: the Young Hegelians and [[thinker:feuerbach]] as disguised theology, Schelling's late philosophy as unable to account for existence, and Marx and Engels as an inversion of the real relation between consciousness and social life.[cite:src_breckman][cite:src_mia_german_ideology]`,
        legacy: `Through Hegel, German Idealism supplied Marxism with its concepts of alienation, labour as self-formation, contradiction and historical development. Whether Marx transformed this inheritance or broke with it is one of the central disputes in Marx scholarship ([[concept:dialectics]]).[cite:src_kolakowski]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample entry for German Idealism. The end year (1854, Schelling's death) is a conventional choice; some histories end the movement in 1831 or the 1840s." }],
    },
    {
      key: "tendency:young-hegelians",
      title: "Young Hegelians",
      fields: {
        yearStart: 1835,
        yearEnd: 1845,
        periodLabel: "1835–1845",
        color: "ochre",
        aliases: "Left Hegelians\nYoung Hegelian movement",
        summary:
          "The radical followers of Hegel who, in the late 1830s and early 1840s, turned his philosophy into a critique of religion and of the Prussian state. Marx and Engels began among them and defined themselves by breaking with them.",
        body: `## Who they were

The Young (or Left) Hegelians were a loose network of philosophers, theologians and journalists rather than a school. Its leading figures included David Friedrich Strauss, whose *Life of Jesus* (1835) treated the gospels as myth; Bruno Bauer, the theorist of critical "self-consciousness"; the publicist Arnold Ruge; Max Stirner; Moses Hess; and, at one remove, [[thinker:feuerbach]].[cite:src_breckman][cite:src_leopold_young_marx]

### What they argued

- **Criticism of religion first.** In a state that called itself Christian, criticising religion was a political act.
- **Criticism of the state next.** By the early 1840s Ruge and others turned to liberal and democratic critiques of Prussian absolutism.
- **Philosophy into practice.** Several of them argued that philosophy, completed by Hegel, must now be realised in the world.

The young [[thinker:marx]] belonged to the Berlin "Doctors' Club" of Hegelian students in the late 1830s and was close to Bruno Bauer. As editor of the *Rheinische Zeitung* (1842–43) and co-editor with Ruge of the *Deutsch-Französische Jahrbücher* (1844), he worked within the movement's institutions.[cite:src_leopold_young_marx]`,
        context: `The movement lived through journals — the *Hallische Jahrbücher* (1838–41), the *Deutsche Jahrbücher* (1841–43) and the *Rheinische Zeitung* — and died with them under Prussian censorship in 1843, when many of its members went into exile or retreated ([[event:rheinische-zeitung-ban]]).[cite:src_breckman]`,
        criticisms: `Marx and Engels's first joint book, *The Holy Family* (1845), mocked Bruno Bauer and his circle; *The German Ideology* (1845–46) attacked Bauer and Stirner at great length for believing that changing ideas would change the world ([[text:the-german-ideology]]).[cite:src_mia_german_ideology] Historians now read these polemics as Marx and Engels's own settling of accounts and caution against taking them as fair portraits.[cite:src_breckman]`,
        legacy: `The Young Hegelians matter to the history of Marxism less for their doctrines than for the problems they left open: how to criticise religion and politics from a philosophy that seemed to justify the existing order, and how theory could become practice. Marx's answers began here ([[concept:praxis]]).[cite:src_leopold_young_marx]`,
      },
      flags: [{ type: "specialist-review", note: "Membership and dates of the Young Hegelian movement vary between accounts; 1835–1845 is a conventional bracket." }],
    },
    {
      key: "tendency:classical-political-economy",
      title: "Classical political economy",
      fields: {
        yearStart: 1776,
        yearEnd: 1848,
        periodLabel: "1770s–1840s",
        color: "olive",
        aliases: "Classical economics\nClassical school",
        summary:
          "The economics of Adam Smith, David Ricardo and their successors: a science of wealth, value, distribution between classes and accumulation. Marx's Capital is subtitled a critique of it.",
        body: `## What it was

Classical political economy runs from Adam Smith's *Wealth of Nations* (1776) through David Ricardo to John Stuart Mill's *Principles of Political Economy* (1848). Its practitioners asked how wealth is produced and grows, what determines the value of goods, and how the product is divided between landlords, capitalists and labourers.[cite:src_schumpeter_hea][cite:src_meek_labour_value]

**Text.** Marx drew the boundary himself. In *Capital* he defined classical political economy as the economics, from William Petty onwards, that investigates the real relations of production in bourgeois society — as opposed to "vulgar economy", which merely systematises the appearances.[cite:src_mia_capital_moore, ch. 1, § 4, note]

### Central ideas

- labour as the source and measure of value ([[concept:value]]);
- distribution of the product between classes as rent, profit and wages;
- accumulation of capital as the engine of growth;
- the case for free trade against mercantilist protection.`,
        context: `The school developed alongside Britain's industrial revolution and the political conflicts it generated, especially over the Corn Laws, repealed in 1846. Its precursors include the French physiocrats.[cite:src_hobsbawm_revolution]`,
        criticisms: `Socialists from the 1820s argued that a labour theory of value implied that labour was robbed of its product. Marx's critique went further: classical economists treated capitalist categories — value, capital, wage labour — as natural rather than historical.[cite:src_meek_labour_value] From the 1870s the marginalist economists replaced classical value theory with theories of utility and marginal productivity.[cite:src_schumpeter_hea]`,
        legacy: `Classical political economy is the theoretical material Marx worked over for most of his adult life. His *Contribution to the Critique of Political Economy* (1859) and *Capital* (1867) are critiques of it in the double sense of the word: an analysis of its achievements and limits, and an explanation of why capitalism appears to its theorists as it does ([[text:capital-volume-one]]).[cite:src_heinrich_capital]`,
      },
    },
    {
      key: "tendency:early-socialism",
      title: "Early socialism",
      fields: {
        yearStart: 1800,
        yearEnd: 1848,
        periodLabel: "1800s–1840s",
        color: "beige",
        aliases: "Utopian socialism\nPre-Marxian socialism",
        summary:
          "The first socialist and communist currents of the early nineteenth century — Saint-Simon, Fourier, Owen and many others — later labelled “utopian” by Marx and Engels.",
        body: `## Why the label is in quotation marks

Marx and Engels called these thinkers "critical-utopian" socialists in the *Communist Manifesto* (1848), and Engels's *Socialism: Utopian and Scientific* (1880) made the contrast between their "utopian" socialism and Marx's "scientific" socialism canonical ([[text:socialism-utopian-and-scientific]]).[cite:src_manifesto_moore, section III][cite:src_mia_soc_utopian] The label is polemical. Historians use "early socialism" to describe the movement on its own terms.[cite:src_taylor_utopian]

## Who and what

The best-known figures are [[thinker:saint-simon]], [[thinker:fourier]] and [[thinker:owen]], but the movement also included Étienne Cabet's communism, Louis Blanc's plan for state-supported workshops, Pierre Leroux, the German tailor Wilhelm Weitling and the British "Ricardian socialists".[cite:src_taylor_utopian][cite:src_claeys_citizens] Despite their differences they shared:

- a diagnosis of **competition** as the source of poverty amid growing wealth;
- an insistence that society could be **organised** — scientifically, cooperatively or communally;
- **experiments** in communities, cooperatives and labour exchanges.

The words "socialist" and "socialism" themselves emerged in these circles in the late 1820s and 1830s.[cite:src_williams_keywords]`,
        context: `Early socialism grew out of the disappointments of the French Revolution and the dislocations of industrialisation. François-Noël "Gracchus" Babeuf's Conspiracy of the Equals (1796) linked revolutionary egalitarianism to communism, a tradition carried into the 1830s by Philippe Buonarroti and Auguste Blanqui ([[event:french-revolution]]).[cite:src_hobsbawm_revolution]`,
        criticisms: `**Text.** For Marx and Engels, the early socialists rightly criticised capitalism but appealed to all classes, especially the rich, and invented ideal societies instead of identifying the social forces — above all the proletariat — that could change society.[cite:src_manifesto_moore, section III]

**Interpretation.** Historians have qualified this verdict: many early socialists were practical organisers, the line between "utopian" and "scientific" is drawn by one side of the argument, and Marx owed them more than the polemic admits.[cite:src_taylor_utopian][cite:src_claeys_citizens]`,
        legacy: `The cooperative movement, communitarian experiments and much of the vocabulary of socialism — association, organisation of labour, exploitation — descend from this period. The Marxist tradition defined itself against it, which is one reason it remains part of the story ([[concept:communism]]).`,
      },
      flags: [{ type: "disputed", note: "The 'utopian' label is contested; the entry presents it as Marx and Engels's polemical classification, not as a neutral category." }],
    },

    /* ——————————————————————————— Concepts ——————————————————————————— */
    {
      key: "concept:idealism",
      title: "Idealism",
      fields: {
        aliases: "Philosophical idealism\nAbsolute idealism",
        summary:
          "The philosophical view that mind, reason or spirit is fundamental to reality or to our knowledge of it. In Marxist usage it also names any account of history that explains society by ideas.",
        yearStart: 1781,
        brief: `Idealism, in philosophy, is not about having high ideals. It is the view that the mind plays the leading role: either the world we know is shaped by the mind, or reality itself is a kind of thought unfolding. Marx argued the opposite way round — that ideas are shaped by how people live and work.`,
        standard: `In everyday speech an idealist is someone with lofty aims. In philosophy the word means something different: the view that mind, reason or spirit is fundamental, and matter in some way derived from or structured by it.

The idealism that matters for Marx is **German Idealism** ([[tendency:german-idealism]]). Kant argued that the mind supplies the forms — space, time, causality — through which we experience any world at all. [[thinker:hegel]] went further: reality as a whole is the self-development of reason or "spirit", which comes to know itself through nature, history, art, religion and philosophy.[cite:src_sep_idealism]

For the radical Hegelians of the 1840s, the problem with this picture was political as well as philosophical. If history is the development of ideas, then changing the world means changing ideas — by criticising religion, for instance. Marx and Engels came to think this got things backwards. In *The German Ideology* they insisted on starting from "real individuals, their activity and the material conditions under which they live" ([[text:the-german-ideology]]).[cite:src_mia_german_ideology]

So in Marxist writing "idealism" acquired a second meaning: any explanation of social life that treats ideas, consciousness or the state as independent driving forces, rather than as part of a social world shaped by how people produce their lives. Its opposite is [[concept:materialism]].`,
        deep: `### Kinds of idealism

Philosophers distinguish at least three: **subjective** idealism (Berkeley: to be is to be perceived), **transcendental** idealism (Kant: the forms of experience come from the knowing subject, while things as they are in themselves remain unknown) and **absolute** idealism (Hegel: reality is rational and comes to self-knowledge in human thought and history).[cite:src_sep_idealism]

**Interpretation.** Hegel's idealism is now often read less as the claim that only minds exist than as the claim that reality is intelligible through concepts, and that concepts develop. On that reading the gap between Hegel and Marx is narrower than the old contrast between "idealism" and "materialism" suggests.[cite:src_sep_hegel]

### Marx's critique

**Text.** In 1843 Marx criticised Hegel's *Philosophy of Right* for turning the real subjects — human beings in families and civil society — into predicates of an abstract Idea of the state ([[text:critique-of-hegels-philosophy-of-right]]).[cite:src_mecw, vol. 3] In 1845 he criticised Feuerbach's materialism in turn for leaving the "active side" of human life to idealism ([[text:theses-on-feuerbach]]).[cite:src_theses_feuerbach]

### Engels's "two camps"

**Text.** In *Ludwig Feuerbach* (1886) Engels divided philosophers into two great camps according to how they answered the relation of thinking to being: those who held spirit to be primary (idealists) and those who held nature to be primary (materialists).[cite:src_mia_ludwig_feuerbach, part 2]

**Disputed.** This schema became orthodox in later Marxism, but many scholars think it oversimplifies both the philosophers it classifies and Marx's own position, which criticised traditional materialism as well as idealism.[cite:src_kolakowski][cite:src_sep_marx]`,
        history: `The term "idealism" became current in the eighteenth century (Leibniz used it of Plato) and was adopted by Kant for his own "transcendental idealism". Its polemical use against "materialism" is older still.[cite:src_sep_idealism] In the Marxist tradition its meaning was fixed largely by Engels's late writings and by Plekhanov ([[thinker:plekhanov]]).`,
        interpretations: `Western Marxists such as Lukács and Gramsci argued that crude anti-idealism had stripped Marxism of its attention to consciousness and human agency; analytical Marxists later reformulated the debate in terms of explanation rather than metaphysics.[cite:src_kolakowski]`,
        criticisms: `Critics of the Marxist usage object that it lumps together very different theories under one pejorative label, and that explanations giving ideas an independent role (for instance in religion's influence on economic life) are not thereby "idealist" in any metaphysical sense.[cite:src_sep_ideology]`,
      },
    },
    {
      key: "concept:materialism",
      title: "Materialism",
      fields: {
        aliases: "New materialism\nPractical materialism",
        summary:
          "In philosophy, the view that matter, not mind, is fundamental. Marx's “new materialism” started instead from human practical activity: people producing their lives under conditions they did not choose.",
        yearStart: 1845,
        brief: `Materialism in philosophy is not about loving possessions. It is the idea that the material world comes first and the mind depends on it. Marx gave it a twist: he started not from matter in general but from what people do — how they work and live together — and argued that this shapes how they think.`,
        standard: `Philosophical materialism is very old: the ancient atomists Democritus and Epicurus — the subject of Marx's own doctoral dissertation (1841) — held that everything consists of atoms moving in the void. Eighteenth-century French materialists such as d'Holbach explained human beings as part of nature governed by its laws.[cite:src_mclellan_marx]

[[thinker:feuerbach]]'s humanism gave materialism new appeal in the 1840s: begin, he said, not from abstract thought but from real, sensuous human beings.

Marx found this insufficient. **Text.** The first of his *Theses on Feuerbach* (1845) complains that all previous materialism grasped reality only "in the form of the object or of contemplation", not as human sensuous activity, as *practice* ([[text:theses-on-feuerbach]]; [[concept:praxis]]).[cite:src_theses_feuerbach]

The "new materialism" that Marx and Engels sketched in *The German Ideology* starts from people's activity in producing their means of subsistence. How people produce shapes how they live together, and both shape how they think ([[text:the-german-ideology]]).[cite:src_mia_german_ideology] Applied to history, this became what Engels later called **historical materialism** ([[concept:historical-materialism]]).`,
        deep: `### Three materialisms

1. **Metaphysical materialism**: only matter exists; mind is a property or product of matter.
2. **Feuerbach's anthropological materialism**: philosophy should start from embodied human beings and their sensuous relations, not from Hegel's Idea.
3. **Marx's practical or historical materialism**: explanation of social life starts from how human beings produce and reproduce their material lives in definite social relations.

**Interpretation.** Many scholars read Marx's materialism as primarily a method of social explanation, compatible with various views in the philosophy of mind; others, following Engels and Plekhanov, treat it as part of a general materialist world-view embracing nature as well as history.[cite:src_sep_marx][cite:src_kolakowski]

### "Dialectical materialism"

Marx never used the phrase. Engels's late writings (*Anti-Dühring*, *Ludwig Feuerbach*, the unfinished *Dialectics of Nature*) presented a materialist philosophy of nature and history governed by dialectical laws; [[thinker:plekhanov]] and others in the 1890s systematised this as "dialectical materialism", which later became official Soviet philosophy.[cite:src_mia_anti_duhring][cite:src_kolakowski]

**Disputed.** Whether this systematisation continues Marx or distorts him is contested. Critics from Lukács onwards argued that a dialectics of nature turned Marx's theory of social practice into a deterministic cosmology; defenders reply that Marx shared and endorsed Engels's project, having read *Anti-Dühring* before publication.[cite:src_carver_relationship][cite:src_kolakowski]`,
        history: `Marx's doctoral dissertation (1841) compared the atomism of Democritus and Epicurus, favouring Epicurus' room for spontaneity. His break with philosophical idealism came in stages between 1843 and 1846, through Feuerbach and then against him.[cite:src_leopold_young_marx] The term "historical materialism" was used by Engels from the 1890s, notably in the 1892 English introduction to *Socialism: Utopian and Scientific*.[cite:src_mia_soc_utopian]`,
        interpretations: `**Engels and the Second International** read materialism as a scientific world-view. **Lenin**'s *Materialism and Empirio-Criticism* (1909) defended a realist theory of knowledge against philosophical critics within the movement. **Western Marxists** emphasised praxis and consciousness. **Analytical Marxists** treated historical materialism as a set of explanatory claims to be stated precisely and tested ([[concept:historical-materialism]]).[cite:src_kolakowski][cite:src_cohen_history]`,
        criticisms: `Critics argue that "materialism" in Marx's sense is either too broad to be informative (everything human involves material activity) or, when made precise, too strong (it understates the independent force of religion, law, nationalism or ideas).[cite:src_sep_marx] Others object that the label "materialist" has been used to dismiss questions about consciousness and ethics as "idealist".`,
      },
    },
    {
      key: "concept:dialectics",
      title: "Dialectics",
      fields: {
        aliases: "Dialectic\nDialectical method\nMaterialist dialectic",
        summary:
          "A way of understanding things through their internal tensions and development. Hegel made it the movement of reason; Marx claimed to have turned it “right side up” as a method for analysing social change.",
        yearStart: 1807,
        brief: `Dialectics is a way of thinking about change. Instead of treating things as fixed, it looks for the tensions inside them — the ways a situation pushes against itself — and follows how those tensions transform it. Hegel applied this to ideas; Marx applied it to societies.`,
        standard: `The word comes from Greek philosophy, where it meant reasoning through dialogue and argument. [[thinker:hegel]] gave it a new meaning: the way concepts — and, for him, reality itself — develop through their own internal contradictions. A concept, thought through, turns out to imply its opposite; the tension is resolved in a richer concept that both cancels and preserves what came before (Hegel's word for this is *Aufhebung*, often translated "sublation").[cite:src_sep_hegel_dialectics]

**Interpretation.** The formula "thesis, antithesis, synthesis" is often attached to Hegel, but he did not use it to describe his method, and scholars warn that it distorts the logic of his work.[cite:src_sep_hegel_dialectics]

**Text.** Marx wrote that in Hegel's hands the dialectic was "standing on its head" and had to be turned right side up to find the "rational kernel within the mystical shell".[cite:src_mia_capital_moore, Afterword to the second German edition] For Marx this meant studying social forms — capitalism above all — as historical, internally contradictory and therefore transient: understanding the existing state of things also means understanding how it will pass away.`,
        deep: `### Dialectic as method of exposition

In *Capital* the dialectic is visible in the order of presentation: Marx begins with the simplest category, the [[concept:commodity]], and develops from its internal tension between [[concept:use-value]] and [[concept:exchange-value]] the more complex forms of money and [[concept:capital]] ([[text:capital-volume-one]]).[cite:src_heinrich_capital]

### Engels's "laws of dialectics"

**Text.** In *Anti-Dühring* (1878) and the unpublished *Dialectics of Nature*, Engels presented dialectics as "the science of the general laws of motion and development of nature, human society and thought", summarised in laws such as the transformation of quantity into quality, the interpenetration of opposites and the negation of the negation.[cite:src_mia_anti_duhring]

**Disputed.** Whether there is a dialectic of *nature* or only of society and thought divides Marxists. Lukács argued in 1923 that Engels had illegitimately extended the method beyond human history; Soviet "diamat" made the laws of dialectics official doctrine; analytical Marxists set the vocabulary aside as obscure.[cite:src_kolakowski][cite:src_cohen_history]

### Contradiction

"Contradiction" in dialectical writing usually means a structural opposition that drives change — between [[concept:productive-forces]] and [[concept:relations-of-production]], or between the use-value and value of a commodity — rather than a logical contradiction between propositions. Critics argue that the ambiguity has licensed loose reasoning; defenders that ordinary logic is not being denied.[cite:src_sep_hegel_dialectics][cite:src_kolakowski]`,
        history: `From Plato's dialogues through Kant's "transcendental dialectic" (the illusions reason falls into) to Hegel's *Science of Logic*, the term changed meaning repeatedly. Marx used Hegel's logic again while drafting the *Grundrisse* in 1857–58 and planned, but never wrote, a short account of the "rational" in Hegel's method ([[text:grundrisse]]).[cite:src_heinrich_capital][cite:src_sep_hegel_dialectics]`,
        interpretations: `Main lines of reading: (1) **method** of social analysis (much Western and academic Marxism); (2) **ontology** of nature and history (Engels, Plekhanov, Soviet Marxism); (3) **logic of presentation** in *Capital* (the "new reading of Marx" of Heinrich and others); (4) **dispensable rhetoric** (much analytical Marxism).[cite:src_heinrich_capital][cite:src_kolakowski][cite:src_cohen_history]`,
        criticisms: `Karl Popper and other critics argued that dialectical reasoning makes theories unfalsifiable by allowing any outcome to be read as a "contradiction" resolved; analytical Marxists argued that whatever is valid in dialectical explanation can be stated as ordinary causal or functional explanation.[cite:src_kolakowski][cite:src_cohen_history]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample concept 'Dialectics'. Check the sample's existing relationships." }],
    },

    /* ——————————————————————————— Texts ——————————————————————————— */
    {
      key: "text:essence-of-christianity",
      title: "The Essence of Christianity",
      fields: {
        originalTitle: "Das Wesen des Christentums",
        language: "German",
        form: "book",
        yearStart: 1841,
        publicationNote: "Leipzig, 1841; revised second edition 1843; English translation by George Eliot, 1854",
        edition: "trans. George Eliot (London: John Chapman, 1854; many reprints)",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/reference/archive/feuerbach/works/essence/",
        aliases: "Das Wesen des Christentums",
        summary:
          "Feuerbach's argument that religion is humanity's relation to its own nature, projected onto an imagined divine being. It gave the radical Hegelians — and the young Marx — a model of how human powers become alien to their creators.",
        body: `## Purpose

[[thinker:feuerbach]] set out to show that the "secret of theology is anthropology": the attributes Christianity ascribes to God — love, wisdom, goodness — are human attributes, belonging to the human species, which believers have separated from themselves and worshipped as another being.[cite:src_feuerbach_essence][cite:src_sep_feuerbach]

## Main argument

The book has two parts. The first presents the "true or anthropological essence" of religion: doctrines such as the incarnation or the Trinity, decoded, express real human relationships and needs. The second presents the "false or theological essence": when the projection is taken literally, religion impoverishes human beings, who give to God what they deny themselves.[cite:src_feuerbach_essence]

## Important concepts

- **Projection**: human beings objectify their own nature in an imagined being.
- **Species-being** (*Gattungswesen*): human beings are conscious of themselves as members of a species with common powers.
- **Inversion**: the predicates of God are the subject (humanity); theology reverses the real relationship.

## Later influence

The book's model — human powers made into an alien power that dominates their creators — passed directly into Marx's account of alienated labour in 1844 ([[concept:alienation]]) and into the critique of religion with which Marx opened his own public career ([[text:critique-of-hegels-philosophy-of-right]]).[cite:src_leopold_young_marx]

## Interpretations

Engels's later recollection made the book a turning point for a whole generation.[cite:src_mia_ludwig_feuerbach, part 1] Historians of religion read it as a founding text of the projection theory of religion; Van Harvey argues that Feuerbach's later work, which grounded religion in feelings of dependence on nature, is more defensible than the famous early book.[cite:src_harvey_feuerbach]`,
        context: `Written at Bruckberg and published in 1841, the book appeared as the Prussian state was turning against radical Hegelianism. It became the movement's most widely read work, but Feuerbach himself stayed outside its political journalism.[cite:src_breckman][cite:src_sep_feuerbach]`,
      },
    },

    /* ——————————————————————————— Events ——————————————————————————— */
    {
      key: "event:french-revolution",
      title: "The French Revolution",
      fields: {
        subtitle: "1789–1799",
        yearStart: 1789,
        yearEnd: 1799,
        dateLabel: "May 1789 – November 1799",
        place: "France",
        eventType: "revolution",
        summary:
          "The overthrow of the French monarchy and the old order of privilege, from the Estates-General of 1789 to Napoleon's seizure of power in 1799 — the model, and the warning, for every revolutionary of the next century.",
        body: `## What happened

The calling of the Estates-General in May 1789 led within weeks to the self-proclamation of the National Assembly, the storming of the Bastille (14 July) and the Declaration of the Rights of Man and of the Citizen (August). The monarchy was abolished in 1792; the Jacobin republic waged war and governed by Terror in 1793–94 before the Thermidorian reaction. On 18 Brumaire of Year VIII (9 November 1799) Napoleon Bonaparte seized power.[cite:src_hobsbawm_revolution]

Within the Revolution, François-Noël Babeuf's Conspiracy of the Equals (1796) attempted an insurrection for common ownership; it was crushed, but Philippe Buonarroti's account of it (1828) carried the idea of a revolutionary communist conspiracy into the nineteenth century ([[tendency:early-socialism]]).[cite:src_hobsbawm_revolution]`,
        significance: `## Why it matters for this map

- **For German philosophy**, the Revolution was the attempt to make freedom and reason the foundation of the state. [[thinker:hegel]] celebrated it as a student and analysed the Terror in the *Phenomenology of Spirit* as the outcome of an abstract, purely negative freedom.[cite:src_taylor_hegel]
- **For socialists**, it showed both the possibility of overturning an entire social order and the limits of political equality without social equality.
- **For Marx**, the Revolution became the model of a *bourgeois* revolution, in which a rising class remade the state in its own image. In 1843–44 he read intensively on its history and planned a history of the Convention.[cite:src_mclellan_marx] His title *The Eighteenth Brumaire of Louis Bonaparte* (1852) deliberately recalls Napoleon's coup ([[text:eighteenth-brumaire]]).

**Disputed.** The "bourgeois revolution" interpretation, dominant among historians for much of the twentieth century, was challenged from the 1950s by revisionist historians who denied that a capitalist class led or benefited from 1789; the debate continues.[cite:src_hobsbawm_revolution]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample event." },
        { type: "missing-source", field: "significance", note: "The revisionist challenge to the 'bourgeois revolution' interpretation (Cobban, Furet) should cite a historiographical source; Hobsbawm predates most of it." },
      ],
    },
  ],

  relationships: [
    { from: "thinker:hegel", type: "MEMBER_OF", to: "tendency:german-idealism", note: "The culminating figure of the movement.", source: "src_sep_idealism" },
    { from: "thinker:hegel", type: "DEVELOPED", to: "concept:dialectics", note: "Hegel's dialectic: concepts and reality developing through internal contradiction.", source: "src_sep_hegel_dialectics", weight: 3 },
    { from: "thinker:hegel", type: "DEVELOPED", to: "concept:idealism", note: "Hegel's absolute idealism.", source: "src_sep_idealism" },
    { from: "thinker:hegel", type: "INFLUENCED", to: "thinker:feuerbach", note: "Feuerbach studied under Hegel in Berlin (1824–26) before turning against speculative philosophy.", source: "src_sep_feuerbach", yearStart: 1824, yearEnd: 1826 },
    { from: "thinker:feuerbach", type: "CRITIQUED", to: "thinker:hegel", note: "Speculative philosophy as theology in disguise: the inversion of subject and predicate.", source: "src_sep_feuerbach", yearStart: 1839, yearEnd: 1843, weight: 3 },
    { from: "thinker:feuerbach", type: "WROTE", to: "text:essence-of-christianity", note: "Published at Leipzig in 1841.", source: "src_feuerbach_essence", yearStart: 1841 },
    { from: "thinker:feuerbach", type: "MEMBER_OF", to: "tendency:young-hegelians", note: "Closely associated with the movement and widely read by it, though older and independent of its circles.", source: "src_breckman", basis: "interpretive" },
    { from: "thinker:feuerbach", type: "ASSOCIATED_WITH", to: "concept:materialism", note: "An anthropological, humanist materialism — a label Feuerbach himself accepted only with reservations.", source: "src_sep_feuerbach" },
    { from: "text:essence-of-christianity", type: "CRITIQUED", to: "tendency:german-idealism", note: "The decoding of theology extended, in Feuerbach's following works, to speculative philosophy.", source: "src_sep_feuerbach", basis: "interpretive" },
    { from: "tendency:german-idealism", type: "INFLUENCED", to: "tendency:young-hegelians", note: "The Young Hegelians turned Hegel's philosophy into a critique of religion and the state.", source: "src_breckman", weight: 3 },
    { from: "tendency:german-idealism", type: "ASSOCIATED_WITH", to: "concept:idealism", note: "Idealism in the sense of Kant, Fichte, Schelling and Hegel.", source: "src_sep_idealism" },
    { from: "concept:idealism", type: "CONTRASTS_WITH", to: "concept:materialism", note: "The opposition Engels made the basic division of philosophy — a schema many scholars think oversimplifies.", source: "src_mia_ludwig_feuerbach", locator: "part 2" },
    { from: "thinker:adam-smith", type: "MEMBER_OF", to: "tendency:classical-political-economy", note: "The founder of the school.", source: "src_schumpeter_hea", weight: 3 },
    { from: "thinker:ricardo", type: "MEMBER_OF", to: "tendency:classical-political-economy", note: "Its most rigorous theorist.", source: "src_schumpeter_hea", weight: 3 },
    { from: "thinker:adam-smith", type: "INFLUENCED", to: "thinker:ricardo", note: "Ricardo read the Wealth of Nations in 1799; his Principles is in large part a critical commentary on Smith's value theory.", source: "src_ricardo_principles", yearStart: 1799 },
    { from: "thinker:saint-simon", type: "MEMBER_OF", to: "tendency:early-socialism", note: "One of the three thinkers Engels presented as the classic “utopians”.", source: "src_mia_soc_utopian" },
    { from: "thinker:fourier", type: "MEMBER_OF", to: "tendency:early-socialism", note: "One of the three thinkers Engels presented as the classic “utopians”.", source: "src_mia_soc_utopian" },
    { from: "thinker:owen", type: "MEMBER_OF", to: "tendency:early-socialism", note: "Founder of British cooperative socialism.", source: "src_claeys_citizens" },
    { from: "thinker:proudhon", type: "ASSOCIATED_WITH", to: "tendency:early-socialism", note: "Often grouped with the early socialists, though he rejected their designs for ideal communities.", source: "src_woodcock_proudhon", basis: "interpretive" },
    { from: "event:french-revolution", type: "INFLUENCED", to: "thinker:hegel", note: "Hegel greeted the Revolution as a student and analysed the Terror in the Phenomenology of Spirit.", source: "src_taylor_hegel" },
    { from: "event:french-revolution", type: "INFLUENCED", to: "tendency:early-socialism", note: "Babeuf's Conspiracy of the Equals (1796) and the disappointments of political equality without social equality.", source: "src_hobsbawm_revolution" },
    { from: "event:french-revolution", type: "INFLUENCED", to: "tendency:german-idealism", note: "German philosophers read the Revolution as the attempt to found the state on reason and freedom.", source: "src_taylor_hegel", basis: "interpretive" },
  ],

  excerpts: [
    {
      key: "hegel-pr-owl",
      entity: "thinker:hegel",
      speaker: "thinker:hegel",
      body: "The owl of Minerva, takes its flight only when the shades of night are gathering.",
      source: "src_mia_hegel_pr",
      locator: "Preface",
      note: "Dyde's 1896 translation, as transcribed by the archive (the comma is in the transcription). Philosophy, Hegel says, understands a form of life only when it has already grown old.",
      archiveUrl: "https://www.marxists.org/reference/archive/hegel/works/pr/preface.htm",
    },
    {
      key: "hegel-pr-rational",
      entity: "concept:idealism",
      speaker: "thinker:hegel",
      body: "What is rational is real; And what is real is rational.",
      source: "src_mia_hegel_pr",
      locator: "Preface",
      note: "Dyde translates wirklich as “real”; Nisbet's Cambridge translation has “actual”, which many scholars think closer to Hegel's meaning. Whether the sentence endorses the existing order was the first great dispute among his followers.",
      archiveUrl: "https://www.marxists.org/reference/archive/hegel/works/pr/preface.htm",
    },
    {
      key: "capital-afterword-head",
      entity: "concept:dialectics",
      speaker: "thinker:marx",
      text: "text:capital-volume-one",
      body: "With him it is standing on its head. It must be turned right side up again, if you would discover the rational kernel within the mystical shell.",
      source: "src_mia_capital_moore",
      locator: "Afterword to the second German edition (1873)",
      note: "“Him” is Hegel. The Moore–Aveling translation, as transcribed by the archive.",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1867-c1/p3.htm",
    },
  ],
};
