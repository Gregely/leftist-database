import type { CorpusBatch } from "../../src/lib/corpus/types";

/**
 * Batch 3e — The critique of political economy: commodity, value, labour-power,
 * surplus value, exploitation, capital and accumulation; the Grundrisse and
 * Capital, Volume One; the crisis of 1857.
 */
export const batch3e: CorpusBatch = {
  id: "b3e",
  title: "The critique of political economy: Grundrisse and Capital",
  sources: [
    {
      id: "src_mia_engels_graveside",
      title: "Speech at the Grave of Karl Marx",
      author: "Frederick Engels",
      publicationDate: "1883",
      publisher: "Marxists Internet Archive",
      url: "https://www.marxists.org/archive/marx/works/1883/death/burial.htm",
      sourceType: "PRIMARY",
      notes: "Marxists Internet Archive transcription. Check against a printed edition before quoting.",
      check: { kind: "url", expect: "discovery of surplus value" },
    },
    {
      id: "src_bohm_bawerk",
      title: "Karl Marx and the Close of His System",
      author: "Eugen von Böhm-Bawerk",
      publicationDate: "1896 [English translation 1898]",
      publisher: "T. Fisher Unwin",
      place: "London",
      sourceType: "SECONDARY",
      notes: "The classic marginalist critique of Marx's value theory.",
      check: { kind: "book", title: "Karl Marx and the Close of His System", author: "Böhm-Bawerk" },
    },
    {
      id: "src_rosdolsky",
      title: "The Making of Marx's ‘Capital’",
      author: "Roman Rosdolsky",
      publicationDate: "1977 [German original 1968]",
      publisher: "Pluto Press",
      place: "London",
      sourceType: "ACADEMIC",
      check: { kind: "book", title: "Making of Marx's Capital", author: "Rosdolsky" },
    },
    {
      id: "src_hobsbawm_formations",
      title: "Pre-Capitalist Economic Formations (with an introduction by E. J. Hobsbawm)",
      author: "Karl Marx; ed. E. J. Hobsbawm; trans. Jack Cohen",
      publicationDate: "1964",
      publisher: "Lawrence & Wishart",
      place: "London",
      sourceType: "PRIMARY",
      check: { kind: "book", title: "Pre-capitalist economic formations", author: "Marx" },
    },
  ],
  entities: [
    {
      key: "concept:commodity",
      title: "Commodity",
      fields: {
        aliases: "Ware\nCommodity form",
        summary:
          "A product made to be exchanged rather than used by its producer. Capital begins with the commodity because, Marx argued, in capitalist societies wealth takes this form.",
        yearStart: 1859,
        brief: `A commodity is something produced to be sold. A loaf baked for your family is not a commodity; the same loaf baked for the market is. Marx starts his analysis of capitalism with the commodity because in capitalism almost everything — including people's ability to work — is bought and sold.`,
        standard: `**Text.** *Capital* opens: "The wealth of those societies in which the capitalist mode of production prevails, presents itself as 'an immense accumulation of commodities,' its unit being a single commodity" ([[text:capital-volume-one]]).[cite:src_mia_capital_moore, ch. 1]

A commodity has a double character:

- a **use-value**: it is useful, satisfying some human need ([[concept:use-value]]);
- an **exchange-value**: it exchanges with other commodities in definite proportions ([[concept:exchange-value]]).

What makes things with completely different uses exchangeable — so many coats for so much linen? Marx's answer, developed from classical political economy, is that they are all products of human labour, and that their exchange-value expresses the *value* they contain ([[concept:value]]).[cite:src_heinrich_capital]

Not every product has always been a commodity. Production for exchange existed in many societies, but only under capitalism does the commodity become the general form of products — because there labour-power itself is a commodity ([[concept:labour-power]]).[cite:src_mia_capital_moore, ch. 6]`,
        deep: `### Why begin with the commodity?

**Interpretation.** *Capital* proceeds from the simplest and most abstract category to more concrete ones — commodity, money, capital, wage labour — so that each later category is explained by the earlier ones. Readers disagree about whether this order is logical (a dialectical development of concepts), historical (simple commodity production preceding capitalism, as Engels suggested) or both.[cite:src_heinrich_capital][cite:src_harvey_companion]

### The commodity and money

The analysis of the "value-form" in chapter 1 tries to show how money necessarily emerges from commodity exchange: one commodity becomes the general equivalent in which all others express their value ([[concept:exchange-value]]).[cite:src_mia_capital_moore, ch. 1, § 3]

### Fetishism

Because producers relate to one another only through exchanging their products, their social relations appear as relations between things — the "fetishism of commodities" ([[concept:commodity-fetishism]]).[cite:src_mia_capital_moore, ch. 1, § 4]`,
        history: `The commodity was already the starting point of the *Contribution to the Critique of Political Economy* (1859) ([[text:contribution-critique-political-economy]]). In the 1844 manuscripts Marx had described the worker becoming a commodity; by *Capital* that intuition was reformulated as the sale of labour-power ([[concept:alienation]]).[cite:src_heinrich_capital]`,
        interpretations: `Value-form theorists (I. I. Rubin, Hans-Georg Backhaus, Michael Heinrich) stress that commodity form and value are social forms specific to capitalism; more traditional readings treat chapter 1 as also describing a historical stage of "simple commodity production".[cite:src_heinrich_capital]`,
        criticisms: `Critics argue that beginning with the commodity builds the labour theory of value into the starting point; others find the opening chapters needlessly abstract and Hegelian, a view Marx anticipated when he warned that beginnings are always difficult.[cite:src_kolakowski]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample concept. Note the sample excerpt (Fowkes translation, with a page reference) remains attached — confirm its wording and page." }],
    },
    {
      key: "concept:use-value",
      title: "Use-value",
      fields: {
        aliases: "Gebrauchswert\nUtility",
        summary: "The usefulness of a thing — its capacity to satisfy a human need. In Marx's analysis, every commodity is a use-value, but use-value alone does not explain exchange.",
        yearStart: 1859,
        brief: `Use-value is simply what a thing is good for: bread feeds you, a coat keeps you warm. Every commodity has to be useful to someone, or no one would buy it. But Marx argued that usefulness can't explain why things exchange in the proportions they do.`,
        standard: `Use-value is the qualitative, material side of a product: its physical properties as they meet some need, the nature of the wants, "whether, for instance, they spring from the stomach or from fancy, makes no difference".[cite:src_mia_capital_moore, ch. 1]

Classical political economists had distinguished "value in use" from "value in exchange" ([[thinker:adam-smith]]). Marx kept the distinction but gave it a twist: use-values are the material content of wealth in any society, while the forms in which they are exchanged are social and historical ([[concept:exchange-value]]).[cite:src_heinrich_capital]

The double character of the commodity as use-value and value corresponds, for Marx, to a double character of the labour that produces it: *concrete* useful labour (tailoring, weaving) creates use-values; *abstract* human labour creates value ([[concept:labour]]; [[concept:value]]).`,
        deep: `### Use-value and labour-power

Use-value becomes economically decisive at one point: the use-value of labour-power, for the capitalist who buys it, is its capacity to create more value than it costs — the source of surplus value ([[concept:labour-power]]; [[concept:surplus-value]]).[cite:src_mia_capital_moore, ch. 6–7]

### Use-value and needs

**Interpretation.** Marx distinguished needs that are natural from needs that are historically developed; what counts as useful changes with society. Some later Marxists built a critique of consumer capitalism on the gap between use-values produced and needs met; others warned against any claim to know people's "true" needs.[cite:src_heinrich_capital]`,
        history: `The distinction goes back to Aristotle and was standard in classical political economy; Marx's innovation was to link it to the double character of labour, which he called the "pivot" of political economy ([[concept:labour]]).[cite:src_mia_capital_moore, ch. 1, § 2]`,
        interpretations: `Marginalist economics merged use-value into "utility" and made it the basis of price theory, abandoning the classical and Marxian separation between use and exchange.[cite:src_schumpeter_hea]`,
        criticisms: `Critics argue that excluding utility from the explanation of exchange-value is the central mistake of the labour theory of value ([[concept:value]]).[cite:src_bohm_bawerk]`,
      },
    },
    {
      key: "concept:exchange-value",
      title: "Exchange-value",
      fields: {
        aliases: "Tauschwert\nValue-form\nPrice",
        summary: "The proportion in which one commodity exchanges for others; in Marx's analysis, the form in which the value of a commodity appears.",
        yearStart: 1859,
        brief: `Exchange-value is how much of one thing you can get for another — a coat for twenty yards of linen, or for a sum of money. Marx argued that this ratio isn't arbitrary: behind it lies the labour needed to produce the things exchanged.`,
        standard: `Exchange-value is the quantitative relation in which use-values of one sort exchange for use-values of another. **Text.** Since a quarter of corn exchanges with various quantities of other commodities, these must have something in common; Marx concludes that exchange-value is "the mode of expression, the phenomenal form" of a content distinct from it — value ([[concept:value]]).[cite:src_mia_capital_moore, ch. 1, § 1]

In a developed market economy, exchange-value appears as **price**: the value of commodities expressed in money. Money is itself the outcome of the development of exchange-value, as one commodity (historically gold) becomes the general equivalent for all others.[cite:src_mia_capital_moore, ch. 1, § 3][cite:src_heinrich_capital]`,
        deep: `### Value and its form

**Interpretation.** Marx criticised Ricardo for analysing the *magnitude* of value without asking why labour takes the *form* of value at all. Value-form theorists make this the heart of Marx's originality: value exists only in exchange, as a social relation, not as a substance contained in goods prior to exchange.[cite:src_heinrich_capital]

**Disputed.** Others read Marx more substantively, as holding that labour time embodied in production determines value, which exchange then expresses. The disagreement has consequences for the transformation problem and for how "testable" the theory is ([[concept:value]]).[cite:src_heinrich_capital][cite:src_kolakowski]

### Prices and values

In volume three of *Capital* Marx argued that competition equalises profit rates, so that commodities sell at "prices of production" that systematically differ from their values — while total value and total price, total surplus value and total profit, remain equal. The consistency of this argument is the "transformation problem".[cite:src_bohm_bawerk][cite:src_heinrich_capital]`,
        history: `"Value in exchange" was Smith's term ([[thinker:adam-smith]]). Marx's distinction between exchange-value and value became explicit only in the second edition of *Capital* (1872).[cite:src_heinrich_capital]`,
        interpretations: `Traditional, "embodied labour" readings; value-form readings (Rubin, Backhaus, Heinrich); and the "New Interpretation" (Duménil, Foley), which defines the value of money to make the aggregate equalities hold.[cite:src_heinrich_capital]`,
        criticisms: `Böhm-Bawerk argued that the move from exchange-value to labour as common substance ignores other common properties, such as utility or scarcity.[cite:src_bohm_bawerk]`,
      },
      flags: [{ type: "specialist-review", field: "deep", note: "The claim about when the exchange-value/value distinction became explicit (2nd edition, 1872) follows Heinrich; check the edition history." }],
    },
    {
      key: "concept:labour",
      title: "Labour",
      fields: {
        aliases: "Work\nConcrete labour\nAbstract labour",
        summary: "Purposeful human activity that transforms nature to meet human needs. Marx distinguished the concrete, useful labour that makes particular things from the abstract labour that forms value.",
        yearStart: 1844,
        brief: `Labour is people's purposeful work on the world — farming, weaving, building, caring. Marx saw it as how humans shape both nature and themselves. Under capitalism, he argued, labour also takes on a second, abstract character: it counts only as a quantity of time that makes things exchangeable.`,
        standard: `**Text.** "Labour is, in the first place, a process in which both man and Nature participate", in which human beings regulate their material exchanges with nature — and, by acting on nature, change their own nature.[cite:src_mia_capital_moore, ch. 7]

For the young Marx labour was the essence of human self-creation, which capitalism *alienates* ([[concept:alienation]]). In *Capital* the emphasis shifts to labour's **double character**:

- **Concrete labour**: particular, useful activity — tailoring, weaving — producing particular use-values ([[concept:use-value]]).
- **Abstract labour**: labour considered simply as expenditure of human labour-power, regardless of its particular form — the substance of value ([[concept:value]]).

**Text.** Marx called this distinction "the pivot on which a clear comprehension of political economy turns".[cite:src_mia_capital_moore, ch. 1, § 2]

Labour must also be distinguished from **labour-power**: the capacity to work, which workers sell, as opposed to the work they then perform ([[concept:labour-power]]).`,
        deep: `### Socially necessary labour

Not any labour counts. **Text.** Value is determined by "socially necessary" labour time: "that required to produce an article under the normal conditions of production, and with the average degree of skill and intensity prevalent at the time".[cite:src_mia_capital_moore, ch. 1, § 1] A slow weaver does not create more value by taking longer.

### Productive and unproductive labour

In *Theories of Surplus-Value* and *Capital* Marx distinguished labour that is productive *for capital* — producing surplus value — from labour that is not, such as domestic service paid from revenue. The distinction concerns social form, not usefulness.[cite:src_mecw, vols. 30–31]

### Unpaid and reproductive labour

**Interpretation.** Feminist Marxists from the 1970s argued that Marx's analysis neglected unpaid domestic labour, which reproduces labour-power itself; this became the basis of social reproduction theory ([[concept:social-reproduction]]).[cite:src_sep_marx]`,
        history: `Labour as the source of wealth and measure of value comes from Locke, Smith and Ricardo ([[tendency:classical-political-economy]]); labour as human self-formation comes from Hegel's *Phenomenology* ([[thinker:hegel]]). Marx's achievement, by his own account, was to combine and transform these lines.[cite:src_meek_labour_value][cite:src_sep_alienation]`,
        interpretations: `Humanist readings centre the early theory of labour as self-realisation; value-form readings centre abstract labour as a social form specific to capitalism; critics of "productivism" ask whether Marx overvalued labour as the core of human life.[cite:src_heinrich_capital][cite:src_sep_marx]`,
        criticisms: `Critics argue that "abstract labour" cannot be measured independently of the prices it is meant to explain, and that skilled and unskilled labour cannot be reduced to a common unit without circularity.[cite:src_bohm_bawerk][cite:src_kolakowski]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample concept." }],
    },
    {
      key: "concept:labour-power",
      title: "Labour-power",
      fields: {
        aliases: "Arbeitskraft\nCapacity to work",
        summary: "The capacity to work, which workers sell to employers for a wage. Distinguishing labour-power from the labour actually performed is the key to Marx's theory of surplus value.",
        yearStart: 1857,
        brief: `Labour-power is your ability to work. When you take a job you don't sell finished work — you sell the use of your capacity to work for a period of time. Marx argued that the gap between what that capacity costs (your wage) and what it produces is where profit comes from.`,
        standard: `Classical economists said workers sell their *labour*. Marx argued that this hides the key point: what the worker sells is **labour-power**, the capacity to work for a time, and its use — the labour actually performed — can produce more value than it costs.[cite:src_heinrich_capital]

Two historical conditions make labour-power a commodity. **Text.** The worker must be "free in the double sense": free to dispose of his labour-power as his own commodity, and free of any other commodity to sell — "short of everything necessary for the realisation of his labour-power".[cite:src_mia_capital_moore, ch. 6] That separation of producers from the means of production was the result of a long historical process ([[concept:accumulation]]).

The **value of labour-power**, like that of any commodity, is the labour time needed to reproduce it — the value of the means of subsistence the worker and family need. **Text.** Unlike other commodities, it contains "a historical and moral element": what counts as necessary depends on the customs and struggles of a given society.[cite:src_mia_capital_moore, ch. 6]`,
        deep: `### A late distinction

Marx worked out the distinction in the manuscripts of 1857–58 ([[text:grundrisse]]). **Text.** When Engels republished *Wage Labour and Capital* (1849) in 1891, he changed "labour" to "labour-power" throughout, explaining to workers that this was "one of the most important points in the whole range of political economy".[cite:src_mia_wage_labour, Engels's introduction of 1891]

### Why it matters

If capitalists paid for labour, and commodities exchanged at their values, there could be no profit without cheating. If they pay for labour-power at its value and use it for longer than is needed to reproduce that value, there is surplus value without any unequal exchange ([[concept:surplus-value]]; [[concept:exploitation]]).[cite:src_mia_capital_moore, ch. 6–7]

**Disputed.** Critics ask whether labour-power is really "produced" like other commodities, since workers are not manufactured for profit; defenders treat the "value of labour-power" as a convention for the wage-bundle necessary for reproduction.[cite:src_kolakowski][cite:src_heinrich_capital]`,
        history: `The term *Arbeitskraft* appears in the *Grundrisse* and becomes central in *Capital* (1867); the terminology of 1849 still spoke of selling labour.[cite:src_mia_wage_labour]`,
        interpretations: `Feminist theorists stress that labour-power is reproduced largely by unpaid domestic work; historians of slavery and unfree labour ask how much of capitalist history rested on labour that was not "free in the double sense".[cite:src_sep_marx]`,
        criticisms: `Critics argue that the distinction between labour and labour-power does not by itself establish that the surplus is produced by labour alone rather than by labour together with machinery and land.[cite:src_bohm_bawerk][cite:src_sep_exploitation]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample concept." }],
    },
    {
      key: "concept:value",
      title: "Value",
      fields: {
        aliases: "Labour theory of value\nLaw of value\nWert",
        summary: "In Marx's theory, the social substance common to commodities — abstract human labour, measured by socially necessary labour time — which appears in exchange as price.",
        yearStart: 1859,
        brief: `Why does a car cost more than a loaf of bread? Marx, following Smith and Ricardo, answered: because it takes much more human labour to produce. In his theory, the value of a commodity is the socially necessary labour time needed to make it, and prices move around that value.`,
        standard: `The **labour theory of value** comes from classical political economy ([[tendency:classical-political-economy]]). Smith treated labour as the real measure of value; Ricardo held that relative values depend on the relative quantities of labour needed to produce commodities ([[thinker:adam-smith]]; [[thinker:ricardo]]).[cite:src_meek_labour_value]

Marx's version, in *Capital* ([[text:capital-volume-one]]):

1. Commodities exchange as equivalents because they share a common substance — they are products of **abstract human labour** ([[concept:labour]]).
2. The magnitude of value is the **socially necessary labour time** required to produce them under average conditions.
3. Value appears as **exchange-value**, and in developed economies as price in money ([[concept:exchange-value]]).
4. Value is a **social relation**, not a natural property: it exists because producers work privately and are connected only through exchange.[cite:src_mia_capital_moore, ch. 1][cite:src_heinrich_capital]

Marx used the theory less to predict individual prices than to explain where profit comes from ([[concept:surplus-value]]).`,
        deep: `### What Marx added to Ricardo

**Interpretation.** Marx's own claim was that classical economics asked how much value commodities have, but never why the products of labour take the form of value at all. His answers — the double character of labour, the value-form, commodity fetishism — make value a historically specific social form rather than an eternal truth of economics ([[concept:commodity-fetishism]]).[cite:src_heinrich_capital][cite:src_meek_labour_value]

### The transformation problem

In volume three, competition equalises profit rates, so commodities sell at prices of production that diverge from values. Eugen von Böhm-Bawerk argued in 1896 that this contradicted volume one — that the "close" of Marx's system abandoned its foundations. Ladislaus von Bortkiewicz's correction (1907) and Piero Sraffa's work (1960) opened a long technical debate.[cite:src_bohm_bawerk][cite:src_heinrich_capital]

**Disputed.** Positions range from those who think the problem fatal to the labour theory of value (Sraffian critics such as Ian Steedman), to those who reformulate it ("New Interpretation", "temporal single-system" readings), to value-form theorists who think the problem misconceives what Marx meant by value.[cite:src_heinrich_capital][cite:src_kolakowski]`,
        history: `From Petty and Locke through Smith and Ricardo, to the "Ricardian socialists" of the 1820s who argued that labour was entitled to its whole product, to Marx, who rejected that conclusion as an ethical demand in favour of an analysis of how capitalism works ([[concept:exploitation]]).[cite:src_meek_labour_value]`,
        interpretations: `**Second International**: an economic law underpinning the inevitability of socialism. **Böhm-Bawerk and marginalists**: a refuted theory. **Sraffians**: an unnecessary detour — prices and profits can be explained from technical conditions and wages. **Value-form theory**: a theory of social form rather than of price determination.[cite:src_kolakowski][cite:src_heinrich_capital]`,
        criticisms: `The marginalist revolution of the 1870s (Jevons, Menger, Walras) explained prices by marginal utility and scarcity, and most economists today regard the labour theory of value as superseded. Critics also argue that heterogeneous labour cannot be reduced to a single unit without circularity.[cite:src_schumpeter_hea][cite:src_bohm_bawerk]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample concept." },
        { type: "disputed", field: "deep", note: "The transformation problem and the status of the labour theory of value are presented as open; an economist familiar with the debate should check the summary." },
      ],
    },
    {
      key: "concept:surplus-value",
      title: "Surplus value",
      fields: {
        aliases: "Mehrwert\nSurplus-value\nAbsolute surplus value\nRelative surplus value",
        summary: "The value workers produce beyond the value of their labour-power — the source, in Marx's account, of profit, interest and rent.",
        yearStart: 1857,
        brief: `Suppose a worker produces, in a day, value equal to their wage in the first four hours. If they work eight, the value made in the other four goes to the employer. That extra is surplus value — in Marx's theory, the hidden source of profit.`,
        standard: `**The puzzle.** If commodities exchange at their values, how can anyone end up with more value than they started with? Merchants who buy cheap and sell dear only redistribute value; they do not create it.[cite:src_mia_capital_moore, ch. 4–5]

**Marx's answer.** The capitalist buys one commodity whose use creates value: labour-power ([[concept:labour-power]]). Its value is the value of the worker's means of subsistence. But once bought, it can be put to work for longer than the time needed to reproduce that value. The working day divides into **necessary labour**, reproducing the value of labour-power, and **surplus labour**, producing **surplus value** for the capitalist.[cite:src_mia_capital_moore, ch. 7–9]

The **rate of surplus value** — surplus value over the capital spent on wages (s/v) — measures the degree of exploitation ([[concept:exploitation]]).

**Text.** At Marx's graveside, Engels named "the discovery of surplus value" as one of Marx's two great discoveries, alongside the materialist conception of history.[cite:src_mia_engels_graveside]`,
        deep: `### Absolute and relative surplus value

- **Absolute surplus value**: increased by lengthening the working day — the subject of Marx's long chapter on the struggle over factory legislation ([[text:capital-volume-one]]).
- **Relative surplus value**: increased by raising productivity in the industries that produce workers' consumption goods, so that necessary labour time falls ([[concept:productive-forces]]).[cite:src_mia_capital_moore, ch. 10, 12]

### Forms of surplus value

In the unfinished volumes two and three, surplus value is distributed among industrial profit, commercial profit, interest and ground-rent. Profit thus appears to come from capital itself, concealing its origin ([[concept:commodity-fetishism]]).[cite:src_heinrich_capital]

**Disputed.** Critics argue that profits reflect the productivity of capital, risk or time preference (Böhm-Bawerk's interest theory); Sraffian economists accept that profits are a surplus but reject the need to derive them from labour values ([[concept:value]]).[cite:src_bohm_bawerk][cite:src_kolakowski]`,
        history: `Marx worked out the theory in the *Grundrisse* (1857–58) and set it out in *Capital* (1867); his *Theories of Surplus-Value* (1862–63) traced earlier economists' partial insights ([[text:grundrisse]]).[cite:src_rosdolsky][cite:src_mecw, vols. 30–32]`,
        interpretations: `Orthodox Marxism treated surplus value as the scientific proof of capitalist exploitation; analytical Marxists (John Roemer) argued that exploitation could be defined without the labour theory of value, through unequal ownership of productive assets ([[concept:exploitation]]).[cite:src_sep_exploitation]`,
        criticisms: `Mainstream economics explains profit without reference to surplus labour; critics within Marxism dispute whether surplus value can be measured, given the transformation problem.[cite:src_bohm_bawerk][cite:src_heinrich_capital]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample concept." }],
    },
    {
      key: "concept:exploitation",
      title: "Exploitation",
      fields: {
        aliases: "Rate of exploitation\nExploitation of man by man",
        summary: "In Marx's sense, the appropriation by one class of the surplus labour of another. Under capitalism it happens through a fair-seeming wage contract.",
        yearStart: 1867,
        brief: `For Marx, exploitation means one group living off the unpaid work of another. Slaves and serfs were obviously exploited. Under capitalism, he argued, it is hidden: workers are paid the market value of their labour-power, but work longer than it takes to produce that value.`,
        standard: `In everyday speech, exploitation means unfair treatment. Marx's concept is more specific: the appropriation of **surplus labour** — labour beyond what producers need to reproduce themselves — by a class that controls the conditions of production ([[concept:surplus-value]]).[cite:src_sep_exploitation]

Every class society exploits, in different ways ([[concept:mode-of-production]]):

- under **slavery**, all of the slave's labour appears unpaid;
- under **feudalism**, the serf works some days on the lord's land, visibly separate from work on his own plot;
- under **capitalism**, all labour appears paid, because the wage seems to pay for the whole working day ([[concept:labour-power]]).

The **rate of exploitation** is the ratio of surplus value to variable capital (wages).[cite:src_mia_capital_moore, ch. 9]

The phrase "the exploitation of man by man" was used earlier by the followers of Saint-Simon ([[thinker:saint-simon]]).[cite:src_manuel_saint_simon]`,
        deep: `### Exploitation without cheating

**Text.** The point of Marx's analysis is that exploitation occurs even when the worker is paid the full value of labour-power: the exchange is equal by the rules of commodity exchange; the inequality arises in production.[cite:src_mia_capital_moore, ch. 6]

### Is exploitation unjust?

**Disputed.** Allen Wood argued that Marx did not condemn capitalism as unjust, since he treated justice as relative to a mode of production, and by capitalist standards the wage contract is just; others (Ziyad Husami, Norman Geras) replied that Marx's language of "robbery" and "theft" implies a transhistorical standard.[cite:src_wood_marx][cite:src_sep_exploitation]

### Analytical reformulations

John Roemer argued that exploitation can be defined through unequal ownership of productive assets, without the labour theory of value, and that it can occur in markets without wage labour; G. A. Cohen argued that the moral core of the charge concerns the unjust distribution of means of production.[cite:src_sep_exploitation]`,
        history: `Saint-Simonian usage (1820s) gave the word its socialist meaning; Marx's theory in *Capital* (1867) made it a technical concept tied to surplus value ([[text:capital-volume-one]]).[cite:src_manuel_saint_simon][cite:src_heinrich_capital]`,
        interpretations: `The concept has been extended to colonial and racial domination, to unpaid domestic labour and to unequal exchange between countries — extensions that raise the question whether exploitation is essentially about labour or about domination more broadly.[cite:src_sep_exploitation]`,
        criticisms: `Liberal critics argue that voluntary exchange at market prices cannot be exploitative, and that profits reward capital, risk and organisation; Marx's critics within philosophy argue that his analysis depends on the contested labour theory of value ([[concept:value]]).[cite:src_sep_exploitation][cite:src_bohm_bawerk]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample concept." }],
    },
    {
      key: "concept:capital",
      title: "Capital",
      fields: {
        aliases: "Self-valorising value\nM–C–M′\nConstant capital\nVariable capital",
        summary: "Not a thing but a process and a social relation: value that grows by passing through production in which wage labour produces surplus value.",
        yearStart: 1857,
        brief: `In everyday language capital means money or machines used in business. For Marx, capital is money that grows: it is invested to buy machines and hire workers, so as to come back as more money. That growth depends on workers producing more value than they are paid.`,
        standard: `**Text.** Marx contrasts two circuits. In simple exchange, C–M–C, a producer sells a commodity to buy another: selling in order to buy. In the circuit of capital, M–C–M′, money buys commodities in order to sell them for more money: buying in order to sell. The difference, M′ − M, is surplus value ([[concept:surplus-value]]).[cite:src_mia_capital_moore, ch. 4]

Capital is therefore defined by its movement: value seeking to expand itself, endlessly. It is also a **social relation**: means of production become capital only when they confront workers who own nothing but their labour-power ([[concept:labour-power]]).[cite:src_heinrich_capital]

Marx divides productive capital into **constant capital** (means of production, whose value is transferred to the product) and **variable capital** (wages, which buy the labour-power that creates new value).[cite:src_mia_capital_moore, ch. 8]

**Text.** "Capital is dead labour, that, vampire-like, only lives by sucking living labour, and lives the more, the more labour it sucks."[cite:src_mia_capital_moore, ch. 10]`,
        deep: `### Capital and capitalism

The word "capitalism" was rare in Marx's writing; he spoke of the "capitalist mode of production" ([[concept:mode-of-production]]; [[concept:capitalism]]).[cite:src_heinrich_capital]

### Forms of capital

Industrial capital produces surplus value; merchant capital and interest-bearing capital share in it. Marx notes that the Mercantilists already described capital as "money which begets money" (M—M′).[cite:src_mia_capital_moore, ch. 4] In volume three, interest-bearing capital appears as the most fetishised form of the relation, in which money seems to grow by itself ([[concept:commodity-fetishism]]).[cite:src_heinrich_capital]

### Capital as subject

**Interpretation.** Several readers emphasise that in *Capital* capital, not the capitalist, is the real subject of the process: capitalists are "personifications" of economic categories, compelled by competition to accumulate. This reading underlines Marx's statement that he does not hold individuals responsible for relations whose creature they remain.[cite:src_heinrich_capital][cite:src_harvey_companion]`,
        history: `Classical economists treated capital as accumulated stock or means of production ([[tendency:classical-political-economy]]). Marx's redefinition was worked out in the *Grundrisse* ([[text:grundrisse]]).[cite:src_rosdolsky]`,
        interpretations: `Rudolf Hilferding's *Finance Capital* (1910) extended the analysis to the fusion of bank and industrial capital, which fed into theories of imperialism ([[concept:imperialism]]).[cite:src_kolakowski]`,
        criticisms: `Neoclassical economics treats capital as a factor of production with its own marginal product; the "Cambridge capital controversy" of the 1960s questioned whether aggregate capital can be measured independently of the rate of profit, a debate some read as vindicating Marx's view of capital as a social relation.`,
      },
      flags: [
        { type: "missing-source", field: "criticisms", note: "The Cambridge capital controversy needs a source (e.g. a survey of the debate); none was added rather than cite a work that does not cover it." },
        { type: "possible-duplicate", note: "The sample concept “Capitalism” (co_capitalism) lists “Capital” as an alias. Remove that alias, or decide whether the two entries should be merged." },
      ],
    },
    {
      key: "concept:accumulation",
      title: "Accumulation",
      fields: {
        aliases: "Capital accumulation\nPrimitive accumulation\nOriginal accumulation\nIndustrial reserve army",
        summary: "The reinvestment of surplus value to expand production — the compulsion at the heart of capitalism — and, as “primitive accumulation”, the historical process that separated producers from the means of production.",
        yearStart: 1867,
        brief: `Capitalist firms don't just make profits; competition forces them to reinvest those profits to grow, or be overtaken. Marx called this accumulation. He also asked how capitalism started — and answered that people first had to be pushed off the land, so that they had nothing to sell but their labour.`,
        standard: `**Accumulation** is the conversion of surplus value into new capital: profits reinvested in more means of production and more labour-power ([[concept:capital]]; [[concept:surplus-value]]). Competition compels it: a capitalist who does not accumulate falls behind.[cite:src_mia_capital_moore, ch. 24]

**Text.** In the chapter on "The General Law of Capitalist Accumulation" Marx argues that accumulation, by raising productivity through machinery, produces a "relative surplus population" or **industrial reserve army** of unemployed and underemployed workers that holds down wages — so that "accumulation of wealth at one pole is, therefore, at the same time accumulation of misery … at the opposite pole".[cite:src_mia_capital_moore, ch. 25]

**Primitive** (or "original") accumulation is Marx's name for the historical process by which capitalism began: the enclosure of common land, the expropriation of peasants, colonial plunder and the slave trade. **Text.** Borrowing a phrase about money from the French writer Marie Augier, Marx concludes: "If money, according to Augier, “comes into the world with a congenital blood-stain on one cheek,” capital comes dripping from head to foot, from every pore, with blood and dirt."[cite:src_mia_capital_moore, ch. 31]`,
        deep: `### The expropriators are expropriated

**Text.** The historical chapter ends with an outline of capitalism's future: the centralisation of capital and the growing organisation of the working class until "the knell of capitalist private property sounds. The expropriators are expropriated."[cite:src_mia_capital_moore, ch. 32]

**Disputed.** Readers dispute how deterministic this passage is, and whether the "general law" predicts absolute impoverishment or relative inequality and insecurity ([[concept:proletariat]]).[cite:src_heinrich_capital][cite:src_kolakowski]

### Reproduction schemes

Volume two models how total social capital can reproduce itself on an expanding scale. [[thinker:luxemburg]] argued in *The Accumulation of Capital* (1913) that accumulation required non-capitalist markets — a key source of her theory of imperialism ([[text:accumulation-of-capital]]; [[concept:imperialism]]).[cite:src_sep_luxemburg]

### Primitive accumulation as ongoing

**Interpretation.** Some recent scholars (David Harvey's "accumulation by dispossession") argue that the violent processes Marx described as "primitive" continue alongside capitalist accumulation proper.[cite:src_harvey_companion]`,
        history: `The theory of accumulation develops classical discussions (Smith's "accumulation of stock", Ricardo on machinery) and the British debates over enclosures and the poor law ([[tendency:classical-political-economy]]).[cite:src_meek_labour_value]`,
        interpretations: `Theories of crisis (falling rate of profit, underconsumption, disproportionality) and of imperialism (Luxemburg, Lenin, Hilferding) all build on Marx's account of accumulation ([[text:imperialism-highest-stage]]).[cite:src_kolakowski]`,
        criticisms: `Historians have disputed Marx's account of English enclosure and the creation of a landless proletariat; economists dispute the existence of a long-run tendency to growing unemployment.[cite:src_kolakowski]`,
      },
      flags: [{ type: "missing-source", field: "standard", note: "Primitive accumulation spans chapters 26–32; check the locators and add a historical source on English enclosure." }],
    },
    {
      key: "concept:commodity-fetishism",
      title: "Commodity fetishism",
      fields: {
        aliases: "Fetishism of commodities\nReification",
        summary: "Marx's name for the way, in a market society, social relations between people appear as relations between things — prices, markets and money that seem to have powers of their own.",
        yearStart: 1867,
        brief: `Commodity fetishism is Marx's term for a strange effect of markets: the relations between people who make and need things show up as relations between the things themselves — prices rising and falling as if by their own nature. People then treat those movements as natural forces.`,
        standard: `In the last section of the first chapter of *Capital*, Marx compares market society to religion, in which "the productions of the human brain appear as independent beings endowed with life" ([[text:capital-volume-one]]).[cite:src_mia_capital_moore, ch. 1, § 4]

In a society of private producers, people relate to one another's work only through exchanging products. Their social relation — the division of social labour among them — therefore appears as a relation between commodities: their values. **Text.** It is "a definite social relation between men, that assumes, in their eyes, the fantastic form of a relation between things".[cite:src_mia_capital_moore, ch. 1, § 4]

This is not simply an illusion. Under these conditions social relations really do take the form of relations between things; the mistake is to think that this form is natural rather than historical ([[concept:value]]).`,
        deep: `### Fetishism and alienation

**Interpretation.** Many readers see fetishism as the mature form of the theory of alienation: human powers again confront their creators as alien forces, now through the market rather than religion ([[concept:alienation]]).[cite:src_ollman_alienation][cite:src_sep_alienation]

### Fetishism and ideology

**Disputed.** Is fetishism a theory of false belief (ideology) or of real social forms that compel certain appearances? Most recent scholarship emphasises the second: the appearance is "objective", produced by social practice, not by deception ([[concept:ideology]]).[cite:src_sep_ideology][cite:src_heinrich_capital]

### Reification

Georg Lukács's *History and Class Consciousness* (1923) generalised fetishism into a theory of "reification" pervading modern society and thought, influencing the Frankfurt School.[cite:src_kolakowski]`,
        history: `"Fetish" came from European accounts of West African religion; Marx had used the comparison as early as the 1840s. The section on fetishism was substantially revised for the 1872 second edition.[cite:src_heinrich_capital]`,
        interpretations: `From Lukács's reification to Isaak Rubin's value theory and the Frankfurt School's critique of the culture industry, fetishism became one of the most productive concepts of twentieth-century Marxism.[cite:src_kolakowski]`,
        criticisms: `Critics argue that the concept presupposes a privileged standpoint from which the "real" relations can be seen, and that markets coordinate dispersed knowledge rather than mystifying it.[cite:src_kolakowski]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample concept." }],
    },

    /* ——— Texts ——— */
    {
      key: "text:grundrisse",
      title: "Grundrisse",
      fields: {
        subtitle: "Foundations of the Critique of Political Economy (Rough Draft)",
        originalTitle: "Grundrisse der Kritik der politischen Ökonomie (Rohentwurf)",
        language: "German",
        form: "notebooks",
        yearStart: 1857,
        yearEnd: 1858,
        publicationNote: "Written in London, October 1857–May 1858; first published Moscow 1939–41; widely available from the Berlin edition of 1953; English translation 1973",
        edition: "trans. Martin Nicolaus (Penguin/New Left Review, 1973)",
        difficulty: "3",
        readingUrl: "https://www.marxists.org/archive/marx/works/1857/grundrisse/",
        aliases: "Grundrisse der Kritik der politischen Ökonomie\nOutlines of the Critique of Political Economy",
        summary:
          "Seven notebooks in which Marx first worked out his theory of capital and surplus value, written in a burst during the crisis of 1857–58. Published only in the twentieth century, they changed how Capital is read.",
        body: `## Purpose

As the world crisis of 1857 broke, Marx — expecting it to bring revolution — set out to clarify his economic theory ([[event:crisis-of-1857]]). The result was not a book but a vast rough draft for his own use.[cite:src_rosdolsky][cite:src_sperber_marx]

## Main argument

- **The 1857 Introduction** discusses method: political economy should rise from simple abstractions to the "concrete" as a "rich totality of many determinations and relations".[cite:src_grundrisse_nicolaus, Introduction, § 3]
- **Money**: a critique of Proudhonist schemes of labour money ([[thinker:proudhon]]).
- **Capital**: the distinction between labour and labour-power, the theory of surplus value, and the circulation of capital ([[concept:labour-power]]; [[concept:surplus-value]]).
- **Pre-capitalist economic formations**: forms of property and community preceding capitalism ([[concept:mode-of-production]]).[cite:src_hobsbawm_formations]
- **The "fragment on machines"**: as science and the "general intellect" become the main productive force, labour time ceases to be the measure of wealth — a passage that has fascinated later readers.[cite:src_grundrisse_nicolaus, notebook VII]

## Later influence

Little known until the 1950s, the *Grundrisse* became central to the "new reading" of Marx: Roman Rosdolsky's study of the making of *Capital*, Italian autonomist Marxism's use of the "fragment on machines", and continuity arguments linking the young and old Marx through its vocabulary of alienation.[cite:src_rosdolsky][cite:src_kolakowski]

## Interpretations

**Disputed.** Is the *Grundrisse* a laboratory superseded by *Capital*, or a more open, more Hegelian and in some respects more radical text? Both readings have strong advocates ([[concept:alienation]]; [[concept:dialectics]]).[cite:src_rosdolsky][cite:src_heinrich_capital]`,
        context: `Written at night in London in 1857–58, amid poverty, illness and journalism for the *New-York Daily Tribune*, during the first worldwide economic crisis ([[event:crisis-of-1857]]).[cite:src_sperber_marx]`,
      },
      flags: [{ type: "specialist-review", field: "body", note: "Short phrases (“rich totality of many determinations and relations”, “general intellect”) were matched against the marxists.org transcription of Nicolaus's translation; check against the printed edition. Characterisations of later readings (Rosdolsky, autonomism) need specialist review." }],
    },
    {
      key: "text:capital-volume-one",
      title: "Capital: A Critique of Political Economy, Volume One",
      fields: {
        subtitle: "The Process of Production of Capital",
        originalTitle: "Das Kapital. Kritik der politischen Ökonomie. Erster Band",
        language: "German",
        form: "book",
        yearStart: 1867,
        publicationNote: "Hamburg: Otto Meissner, 1867; second edition 1872–73; French edition 1872–75; English translation 1887. Volumes II (1885) and III (1894) edited by Engels from Marx's manuscripts.",
        edition: "trans. Ben Fowkes (Penguin/New Left Review, 1976); trans. Samuel Moore and Edward Aveling (1887)",
        difficulty: "3",
        readingUrl: "https://www.marxists.org/archive/marx/works/1867-c1/",
        aliases: "Das Kapital\nCapital, Volume I",
        summary:
          "Marx's masterwork: an analysis of capitalism as a system driven by the production of surplus value, from the commodity to the working day, the factory and the violent origins of capitalism.",
        body: `## Purpose

**Text.** Marx's preface states the aim: "to lay bare the economic law of motion of modern society". He studies capitalism in its "classic ground", England, and warns German readers: *de te fabula narratur* — the story is about you.[cite:src_mia_capital_moore, preface to the first German edition]

## Main argument

- **Part 1 — Commodities and money.** The double character of the commodity and of labour; the value-form and money; commodity fetishism ([[concept:commodity]]; [[concept:value]]; [[concept:commodity-fetishism]]).
- **Parts 2–3 — Capital and surplus value.** The circuit M–C–M′; labour-power as a commodity; the working day as a battleground ([[concept:capital]]; [[concept:labour-power]]; [[concept:surplus-value]]).
- **Parts 4–5 — Relative surplus value.** Cooperation, the manufacturing division of labour, machinery and modern industry.
- **Part 7 — Accumulation.** The general law of capitalist accumulation and the industrial reserve army ([[concept:accumulation]]).
- **Part 8 — So-called primitive accumulation.** The historical origins of capitalism in expropriation and colonial violence.

The book combines abstract theory with long historical and empirical chapters drawn from British factory inspectors' reports and parliamentary blue books.[cite:src_heinrich_capital][cite:src_harvey_companion]

## Later influence

The first edition of a thousand copies sold slowly. A Russian translation appeared in 1872, the first in a foreign language; the English translation followed only in 1887. Through the parties of the Second International, popular summaries (notably Kautsky's) and translations, *Capital* became the theoretical bible of the socialist movement — more cited than read.[cite:src_stedman_jones_marx][cite:src_kolakowski]

## Interpretations

**Disputed.** Major lines of reading include: an economic theory to be judged against mainstream economics (and found wanting by Böhm-Bawerk); a dialectical logic of capital (the "new reading" of Heinrich and others); a historical sociology of capitalism; and a political text about class struggle over the working day. Disputes over the transformation problem, the falling rate of profit (volume three) and immiseration have never been settled.[cite:src_bohm_bawerk][cite:src_heinrich_capital][cite:src_harvey_companion]`,
        context: `Marx worked on the book from 1861 to 1867 in London, using the British Museum reading room, while active in the newly founded International ([[event:first-international]]). He saw only volume one through the press; volumes two and three were assembled by Engels from drafts.[cite:src_sperber_marx][cite:src_heinrich_capital]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample text record." }],
    },

    /* ——— Event ——— */
    {
      key: "event:crisis-of-1857",
      title: "The world economic crisis of 1857",
      fields: {
        subtitle: "The Panic of 1857",
        yearStart: 1857,
        yearEnd: 1858,
        dateLabel: "August 1857 – 1858",
        place: "United States, Britain, the German states, Scandinavia",
        eventType: "crisis",
        summary:
          "A financial and commercial crisis that began in the United States and spread through the world market — often described as the first truly global economic crisis — prompting Marx's first sustained draft of his economic theory.",
        body: `## What happened

In August 1857 the failure of the Ohio Life Insurance and Trust Company in New York triggered a banking panic in the United States. Through trade and credit links the crisis spread within months to Britain, where the Bank Charter Act was suspended, and to Hamburg, Scandinavia and beyond.[cite:src_hobsbawm_capital]`,
        significance: `Marx and Engels had long expected an economic crisis to reopen the revolutionary situation of 1848. As the crisis spread, Marx began the intense work that produced the *Grundrisse* ([[text:grundrisse]]). No revolution followed, and recovery came quickly, a lesson that pushed Marx towards a longer-term analysis of capitalist cycles.[cite:src_sperber_marx][cite:src_rosdolsky]

**Interpretation.** Historians describe 1857 as a sign of how integrated the world market had become by the mid-century "age of capital".[cite:src_hobsbawm_capital]`,
      },
    },
  ],

  relationships: [
    { from: "thinker:adam-smith", type: "INFLUENCED", to: "thinker:marx", note: "Marx excerpted the Wealth of Nations from 1844 and treated Smith at length in Theories of Surplus-Value.", source: "src_mecw", locator: "vols. 30–32", weight: 2 },
    { from: "thinker:ricardo", type: "INFLUENCED", to: "thinker:marx", note: "Ricardo's labour theory of value was the starting point of Marx's own.", source: "src_meek_labour_value", weight: 3 },
    { from: "thinker:marx", type: "CRITIQUED", to: "tendency:classical-political-economy", note: "Capital is subtitled “a critique of political economy”: it criticises the classical economists for treating historical categories as natural.", source: "src_heinrich_capital", weight: 3 },
    { from: "thinker:marx", type: "DEVELOPED", to: "concept:surplus-value", note: "Engels called it one of Marx's two great discoveries.", source: "src_mia_engels_graveside", weight: 3 },
    { from: "thinker:marx", type: "DEVELOPED", to: "concept:labour-power", note: "The distinction between labour and labour-power (1857–58).", source: "src_mia_wage_labour", locator: "Engels's introduction of 1891", weight: 3 },
    { from: "thinker:marx", type: "DEVELOPED", to: "concept:commodity-fetishism", note: "Capital, ch. 1, § 4.", source: "src_mia_capital_moore", weight: 3 },
    { from: "thinker:marx", type: "DEVELOPED", to: "concept:capital", note: "Capital as self-expanding value and a social relation.", source: "src_mia_capital_moore", weight: 3 },
    { from: "thinker:marx", type: "DEVELOPED", to: "concept:accumulation", note: "The general law of capitalist accumulation; primitive accumulation.", source: "src_mia_capital_moore", weight: 2 },
    { from: "thinker:marx", type: "DEVELOPED", to: "concept:exploitation", note: "Exploitation as the appropriation of surplus labour.", source: "src_sep_exploitation", weight: 3 },
    { from: "thinker:marx", type: "EXTENDED", to: "concept:value", note: "Developed the classical labour theory of value into a theory of value as a social form.", source: "src_heinrich_capital", weight: 3 },
    { from: "thinker:ricardo", type: "DEVELOPED", to: "concept:value", note: "The classical labour theory of value in its most rigorous form.", source: "src_ricardo_principles", weight: 3 },
    { from: "thinker:adam-smith", type: "ASSOCIATED_WITH", to: "concept:labour", note: "Labour as the source and real measure of wealth; the division of labour.", source: "src_smith_wealth" },
    { from: "tendency:classical-political-economy", type: "ASSOCIATED_WITH", to: "concept:value", note: "The labour theory of value.", source: "src_meek_labour_value" },
    { from: "thinker:saint-simon", type: "ASSOCIATED_WITH", to: "concept:exploitation", note: "His followers popularised the phrase “the exploitation of man by man”.", source: "src_manuel_saint_simon", basis: "interpretive" },
    { from: "concept:use-value", type: "CONTRASTS_WITH", to: "concept:exchange-value", note: "The two sides of the commodity.", source: "src_mia_capital_moore", locator: "ch. 1", weight: 3 },
    { from: "concept:use-value", type: "PRESUPPOSES", to: "concept:commodity", note: "In Capital, use-value is introduced as one aspect of the commodity.", source: "src_mia_capital_moore", locator: "ch. 1" },
    { from: "concept:exchange-value", type: "PRESUPPOSES", to: "concept:commodity", note: "Exchange-value is the commodity's relation to other commodities.", source: "src_mia_capital_moore", locator: "ch. 1" },
    { from: "concept:value", type: "PRESUPPOSES", to: "concept:exchange-value", note: "Value is reached by analysing what exchange-value expresses.", source: "src_mia_capital_moore", locator: "ch. 1, § 1" },
    { from: "concept:value", type: "PRESUPPOSES", to: "concept:labour", note: "Abstract labour is the substance of value.", source: "src_mia_capital_moore", locator: "ch. 1, § 2" },
    { from: "concept:labour-power", type: "PRESUPPOSES", to: "concept:labour", note: "Labour-power is the capacity whose use is labour.", source: "src_mia_capital_moore", locator: "ch. 6" },
    { from: "concept:labour-power", type: "PRESUPPOSES", to: "concept:value", note: "The value of labour-power is determined like that of any commodity.", source: "src_mia_capital_moore", locator: "ch. 6" },
    { from: "concept:surplus-value", type: "PRESUPPOSES", to: "concept:labour-power", note: "Surplus value arises from the difference between the value of labour-power and the value it creates.", source: "src_mia_capital_moore", locator: "ch. 7", weight: 3 },
    { from: "concept:exploitation", type: "PRESUPPOSES", to: "concept:surplus-value", note: "Capitalist exploitation is the extraction of surplus value.", source: "src_mia_capital_moore", locator: "ch. 9", weight: 3 },
    { from: "concept:capital", type: "PRESUPPOSES", to: "concept:surplus-value", note: "Capital is value that expands through surplus value.", source: "src_mia_capital_moore", locator: "ch. 4" },
    { from: "concept:accumulation", type: "PRESUPPOSES", to: "concept:capital", note: "Accumulation is the reconversion of surplus value into capital.", source: "src_mia_capital_moore", locator: "ch. 24" },
    { from: "concept:commodity-fetishism", type: "PRESUPPOSES", to: "concept:value", note: "Fetishism is the appearance of value as a property of things.", source: "src_mia_capital_moore", locator: "ch. 1, § 4" },
    { from: "concept:commodity-fetishism", type: "RELATED_TO", to: "concept:alienation", note: "Often read as the mature form of the theory of alienation.", source: "src_ollman_alienation", basis: "interpretive" },
    { from: "concept:commodity-fetishism", type: "RELATED_TO", to: "concept:ideology", note: "Whether fetishism is ideology or a real social form is disputed.", source: "src_sep_ideology", basis: "interpretive" },
    { from: "thinker:marx", type: "WROTE", to: "text:grundrisse", note: "London, 1857–58.", source: "src_grundrisse_nicolaus", yearStart: 1857, yearEnd: 1858 },
    { from: "thinker:marx", type: "WROTE", to: "text:capital-volume-one", note: "Published in Hamburg in 1867.", source: "src_mia_capital_moore", yearStart: 1867, weight: 3 },
    { from: "text:capital-volume-one", type: "DISCUSSES", to: "concept:commodity", note: "Part 1.", source: "src_mia_capital_moore", weight: 3 },
    { from: "text:capital-volume-one", type: "DISCUSSES", to: "concept:surplus-value", note: "Parts 3–5.", source: "src_mia_capital_moore", weight: 3 },
    { from: "text:capital-volume-one", type: "DISCUSSES", to: "concept:accumulation", note: "Parts 7–8.", source: "src_mia_capital_moore", weight: 3 },
    { from: "text:capital-volume-one", type: "DISCUSSES", to: "concept:commodity-fetishism", note: "Ch. 1, § 4.", source: "src_mia_capital_moore" },
    { from: "text:capital-volume-one", type: "DISCUSSES", to: "concept:labour-power", note: "Ch. 6.", source: "src_mia_capital_moore" },
    { from: "text:capital-volume-one", type: "DISCUSSES", to: "concept:value", note: "Ch. 1.", source: "src_mia_capital_moore", weight: 3 },
    { from: "text:capital-volume-one", type: "CRITIQUED", to: "tendency:classical-political-economy", note: "Subtitled “A Critique of Political Economy”.", source: "src_heinrich_capital", weight: 3 },
    { from: "text:grundrisse", type: "PRECEDES", to: "text:contribution-critique-political-economy", note: "The draft from which the 1859 Contribution was extracted.", source: "src_rosdolsky" },
    { from: "text:contribution-critique-political-economy", type: "PRECEDES", to: "text:capital-volume-one", note: "Marx reworked the 1859 chapters as Part 1 of Capital.", source: "src_heinrich_capital" },
    { from: "text:grundrisse", type: "DISCUSSES", to: "concept:labour-power", note: "Where the distinction between labour and labour-power is first worked out.", source: "src_rosdolsky" },
    { from: "event:crisis-of-1857", type: "INFLUENCED", to: "text:grundrisse", note: "Marx began the manuscripts as the crisis broke, expecting it to reopen revolution.", source: "src_sperber_marx", weight: 3 },
    { from: "text:capital-volume-one", type: "INFLUENCED", to: "text:accumulation-of-capital", note: "Luxemburg's work begins from Marx's reproduction schemes (volume two) and the theory of accumulation.", source: "src_sep_luxemburg" },
  ],

  excerpts: [
    {
      key: "capital-immense-accumulation",
      entity: "text:capital-volume-one",
      speaker: "thinker:marx",
      text: "text:capital-volume-one",
      body: "The wealth of those societies in which the capitalist mode of production prevails, presents itself as “an immense accumulation of commodities,” its unit being a single commodity.",
      source: "src_mia_capital_moore",
      locator: "Chapter 1, opening",
      note: "Moore–Aveling translation. Fowkes (1976) has “an immense collection of commodities”.",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1867-c1/ch01.htm",
    },
    {
      key: "capital-fetishism",
      entity: "concept:commodity-fetishism",
      speaker: "thinker:marx",
      text: "text:capital-volume-one",
      body: "There it is a definite social relation between men, that assumes, in their eyes, the fantastic form of a relation between things.",
      source: "src_mia_capital_moore",
      locator: "Chapter 1, section 4",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1867-c1/ch01.htm",
    },
    {
      key: "capital-double-free",
      entity: "concept:labour-power",
      speaker: "thinker:marx",
      text: "text:capital-volume-one",
      body: "For the conversion of his money into capital, therefore, the owner of money must meet in the market with the free labourer, free in the double sense, that as a free man he can dispose of his labour-power as his own commodity, and that on the other hand he has no other commodity for sale, is short of everything necessary for the realisation of his labour-power.",
      source: "src_mia_capital_moore",
      locator: "Chapter 6",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1867-c1/ch06.htm",
    },
    {
      key: "capital-vampire",
      entity: "concept:capital",
      speaker: "thinker:marx",
      text: "text:capital-volume-one",
      body: "Capital is dead labour, that, vampire-like, only lives by sucking living labour, and lives the more, the more labour it sucks.",
      source: "src_mia_capital_moore",
      locator: "Chapter 10, section 1",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1867-c1/ch10.htm",
    },
    {
      key: "capital-two-poles",
      entity: "concept:accumulation",
      speaker: "thinker:marx",
      text: "text:capital-volume-one",
      body: "Accumulation of wealth at one pole is, therefore, at the same time accumulation of misery, agony of toil slavery, ignorance, brutality, mental degradation, at the opposite pole, i.e., on the side of the class that produces its own product in the form of capital.",
      source: "src_mia_capital_moore",
      locator: "Chapter 25, section 4",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1867-c1/ch25.htm",
    },
    {
      key: "capital-labour-process",
      entity: "concept:labour",
      speaker: "thinker:marx",
      text: "text:capital-volume-one",
      body: "Labour is, in the first place, a process in which both man and Nature participate, and in which man of his own accord starts, regulates, and controls the material re-actions between himself and Nature.",
      source: "src_mia_capital_moore",
      locator: "Chapter 7, section 1",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1867-c1/ch07.htm",
    },
    {
      key: "engels-graveside-surplus",
      entity: "concept:surplus-value",
      speaker: "thinker:engels",
      body: "The discovery of surplus value suddenly threw light on the problem, in trying to solve which all previous investigations, of both bourgeois economists and socialist critics, had been groping in the dark.",
      source: "src_mia_engels_graveside",
      locator: "Highgate Cemetery, 17 March 1883",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1883/death/burial.htm",
    },
  ],
};
