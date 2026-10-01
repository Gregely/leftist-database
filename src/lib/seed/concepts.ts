import type { SeedConcept } from "./types";

/*
 * Sample concept records. Each concept carries three depths of explanation:
 * brief ("30 seconds"), standard ("5 minutes") and deep ("deep dive").
 * Only a few samples carry all three; the rest show how the interface
 * handles entries still being written.
 */
export const concepts: SeedConcept[] = [
  {
    slug: "alienation",
    title: "Alienation",
    featured: true,
    sortOrder: 10,
    aliases: ["Estrangement", "Entfremdung", "Entäußerung", "Estranged labour"],
    yearStart: 1844,
    summary:
      "The condition in which people become estranged from their own activity, its products, each other and their own human capacities.",
    brief: `You spend most of your waking life making things you don't own, in ways you don't control, for purposes you didn't choose. Marx called the result *alienation*: your own activity confronts you as something foreign.`,
    standard: `In the [[text:economic-philosophic-manuscripts|Economic and Philosophic Manuscripts of 1844]], Marx describes four connected forms of alienation under capitalism.[cite:src_1844_milligan, "Estranged Labour"]

**From the product.** What workers make belongs to someone else, and accumulates as a power — capital — standing over them.

**From the activity.** Work is not an expression of the worker's own purposes; it is directed by others and experienced as compulsion.

**From "species-being".** Humans are distinguished by conscious, creative, collective production. Under capitalism this capacity becomes merely a means to survive.

**From other people.** Relationships are mediated by competition and the market, and the worker faces the capitalist — and other workers — as strangers.

The concept draws on Hegel and on Feuerbach's critique of religion, but relocates estrangement from consciousness to material social relations.`,
    deep: `Readers disagree sharply about how central alienation is to Marx's mature thought.

**The humanist reading.** After the 1844 manuscripts were published in 1932, thinkers such as Lukács (who had independently developed the related idea of reification), the Frankfurt School and Erich Fromm treated alienation as the ethical core of Marx's project: capitalism is condemned because it frustrates human flourishing.[cite:src_ollman_alienation]

**The anti-humanist reading.** [[thinker:althusser|Althusser]] argued that the concept belongs to Marx's pre-scientific, Hegelian phase, and that *Capital* replaces talk of human essence with an analysis of structures and relations of production.

**Continuity readings.** Others trace the idea forward into [[concept:commodity-fetishism|commodity fetishism]], where social relations between people appear as relations between things. On this view the vocabulary changes but the problem persists.

Feminist and ecological writers have since extended the concept — to estrangement from the body, from reproductive labour, and from nature.`,
    citations: [
      { source: "src_1844_milligan", locator: "\"Estranged Labour\"", field: "standard" },
      { source: "src_ollman_alienation", field: "deep" },
      { source: "src_williams_keywords", locator: "\"Alienation\"", field: "standard" },
    ],
  },
  {
    slug: "commodity",
    title: "Commodity",
    featured: true,
    sortOrder: 20,
    aliases: ["Ware", "Commodities"],
    summary:
      "A product made to be exchanged on the market, with both a use-value and an exchange-value. Capital begins its analysis here.",
    brief: `A commodity is something produced in order to be sold. Under capitalism almost everything — including the ability to work — takes this form.`,
    standard: `[[text:capital-volume-one|Capital]] opens with the commodity because it is the elementary form of wealth in capitalist societies.[cite:src_capital_fowkes, p. 125] Every commodity is useful (it has a **use-value**) and exchangeable (it has an **exchange-value**). What makes very different things exchangeable in definite proportions, Marx argues, is that each is a product of human labour in general — abstract labour — measured socially as [[concept:value]].`,
    deep: `The commodity chapter is notoriously difficult, partly because Marx moves between logical and historical exposition. Interpreters disagree about whether the "simple commodity production" of chapter 1 describes an historical stage or is an abstraction from fully developed capitalism. Value-form theorists (e.g. Heinrich) emphasise that value only exists in exchange and money; others treat labour-time as a more direct measure.[cite:src_heinrich_capital]`,
    citations: [
      { source: "src_capital_fowkes", locator: "ch. 1", field: "standard" },
      { source: "src_heinrich_capital", field: "deep" },
    ],
  },
  {
    slug: "class",
    title: "Class",
    featured: true,
    sortOrder: 30,
    aliases: ["Social class", "Classes"],
    summary:
      "A group defined by its position in the relations of production — above all, by ownership or non-ownership of the means of production.",
    brief: `In Marxist usage, class is about where you stand in the way a society produces: whether you own the means of production, or must sell your capacity to work to someone who does.`,
    standard: `Marx never completed a systematic account of class — the manuscript of *Capital* volume III breaks off as the chapter on classes begins. But across his work, classes are defined relationally: capitalists and wage-labourers exist only in relation to each other. Later debates concern intermediate classes (managers, professionals, the self-employed), the relation between class and other social divisions, and the difference between a class "in itself" and a class conscious of itself.`,
    citations: [{ source: "src_bottomore_dictionary", locator: "\"Class\"", field: "standard" }],
  },
  {
    slug: "surplus-value",
    title: "Surplus Value",
    featured: true,
    sortOrder: 40,
    aliases: ["Mehrwert", "Surplus-value"],
    summary:
      "The difference between the value workers produce and the value of their labour-power, appropriated by capital as profit, interest and rent.",
    brief: `Workers are paid for their capacity to work, not for everything they produce. The gap between the two is surplus value — the source of profit.`,
    standard: `Capital buys [[concept:labour-power]] at its value — roughly, what it costs to reproduce the worker. But labour-power has the peculiar quality of producing more value than it costs. If a day's wage is produced in four hours and the working day is eight, the remaining hours produce surplus value.[cite:src_capital_fowkes, Part 3]

Capital can increase surplus value by lengthening the working day (*absolute* surplus value) or by raising productivity so that the worker's own subsistence takes less time to produce (*relative* surplus value).`,
    deep: `Surplus value is central to the Marxist claim that capitalism is [[concept:exploitation|exploitative]] even when wages are paid "fairly". It also underpins Marx's account of crisis tendencies, via the composition of capital and the tendency of the rate of profit to fall. Critics from Böhm-Bawerk onwards have attacked the labour theory of value on which it rests, and the "transformation problem" — how values relate to prices — remains a field of technical controversy.[cite:src_heinrich_capital]`,
    citations: [
      { source: "src_capital_fowkes", locator: "Parts 3–5", field: "standard" },
      { source: "src_heinrich_capital", field: "deep" },
    ],
  },
  {
    slug: "historical-materialism",
    title: "Historical Materialism",
    featured: true,
    sortOrder: 50,
    aliases: ["Materialist conception of history", "Historical materialist"],
    yearStart: 1845,
    summary:
      "The approach to history that starts from how people produce their means of life, and sees social and political forms as shaped by those relations of production.",
    brief: `To understand a society, start with how it produces and reproduces material life — who works, who owns, who decides — not with its ideas about itself.`,
    standard: `First worked out by Marx and Engels in [[text:the-german-ideology|The German Ideology]], historical materialism holds that the way a society organises production — its *forces* and *relations* of production — conditions its legal, political and cultural life. History moves through successive modes of production, propelled by contradictions between developing productive forces and existing property relations, and by [[concept:class-struggle]].`,
    deep: `How strong is the "conditioning"? A long tradition, from the Second International to G. A. Cohen's analytical defence, reads historical materialism as a theory in which productive forces have explanatory primacy. Others — E. P. Thompson, Gramsci, much Western Marxism — emphasise agency, culture and contingency, and treat "base and superstructure" as a metaphor to be used with caution. Engels himself, in late letters, warned against reducing the economic factor to the "only determining" one.`,
    citations: [{ source: "src_bottomore_dictionary", locator: "\"Historical materialism\"", field: "standard" }],
  },
  {
    slug: "hegemony",
    title: "Hegemony",
    featured: true,
    sortOrder: 60,
    aliases: ["Egemonia", "Cultural hegemony", "Hegemonic"],
    yearStart: 1929,
    summary:
      "Leadership exercised through consent as well as coercion: the way a ruling group's worldview becomes common sense.",
    brief: `Power doesn't only work through police and armies. It also works through what people come to accept as normal and obvious. Gramsci called that kind of leadership hegemony.`,
    standard: `In the [[text:prison-notebooks|Prison Notebooks]], Gramsci asks why revolution succeeded in Russia but failed in the West. His answer: in societies with a dense "civil society" — churches, schools, parties, press, associations — the ruling class rules not only by force but by organising consent.[cite:src_prison_notebooks]

Hegemony is never complete or permanent; it must be constantly renewed, and can be challenged by a counter-hegemonic bloc that builds its own institutions, intellectuals and common sense.`,
    deep: `Gramsci's distinction between a "war of manoeuvre" (frontal assault) and a "war of position" (a long struggle in civil society) has been read in rival ways — as a revolutionary strategy for the West, or as a rationale for gradualism. Perry Anderson's "The Antinomies of Antonio Gramsci" argued that the notebooks oscillate between incompatible models of state and civil society. Laclau and Mouffe later detached hegemony from class altogether, making it the basis of a post-Marxist theory of discourse.`,
    citations: [
      { source: "src_prison_notebooks", field: "standard" },
    ],
  },
  {
    slug: "capitalism",
    title: "Capitalism",
    sortOrder: 5,
    aliases: ["Capitalist mode of production", "Capital"],
    summary:
      "A mode of production in which the means of production are privately owned and production is organised for profit through wage-labour and market exchange.",
    brief: `An economic system where a minority owns the workplaces and resources, most people work for wages, and production is driven by the pursuit of profit.`,
    standard: `For Marx, capitalism is distinguished not by markets or money, which are much older, but by the generalisation of wage-labour: labour-power becomes a [[concept:commodity]]. Capital is value in motion — money invested to produce more money — and this compulsion to accumulate drives technical change, global expansion and recurring crises.`,
  },
  {
    slug: "labour",
    title: "Labour",
    sortOrder: 25,
    aliases: ["Work", "Arbeit", "Concrete labour", "Abstract labour"],
    summary:
      "Purposeful human activity that transforms nature; under capitalism, both concrete useful work and an abstract quantity that forms value.",
    brief: `Labour is how people transform the world to meet their needs. Capitalism counts it in a peculiar way: as an abstract quantity of time.`,
    standard: `Marx distinguishes **concrete labour** — tailoring, weaving, coding — which produces particular use-values, from **abstract labour**, labour in general, which forms [[concept:value]]. The distinction underlies his critique of political economy, and it has been extended by feminists who ask why some labour (domestic, reproductive) is not counted at all.`,
  },
  {
    slug: "value",
    title: "Value",
    sortOrder: 26,
    aliases: ["Labour theory of value", "Exchange-value", "Use-value"],
    summary:
      "In Marx, the social substance common to commodities: socially necessary abstract labour-time, expressed in money.",
    brief: `Why does a coat cost as much as twenty yards of linen? Marx's answer: the socially necessary labour-time it takes to produce them.`,
    standard: `Building on — and criticising — Smith and Ricardo, Marx argues that the value of a [[concept:commodity]] is determined by the socially necessary labour-time required to produce it, under average conditions. Value is not visible directly; it appears only in exchange, and ultimately in money.`,
  },
  {
    slug: "labour-power",
    title: "Labour-power",
    sortOrder: 27,
    aliases: ["Arbeitskraft", "Labour power"],
    summary:
      "The capacity to work, which the worker sells to the capitalist for a wage, as distinct from the labour actually performed.",
    brief: `When you take a job you're not selling your work, exactly — you're selling your ability to work for a set time. That ability is labour-power.`,
    standard: `The distinction between labour and labour-power is what allows Marx to explain [[concept:surplus-value]] without assuming that anyone is cheated in exchange. The worker is paid the value of labour-power; the capitalist consumes it, and it produces more value than it costs.`,
  },
  {
    slug: "exploitation",
    title: "Exploitation",
    sortOrder: 28,
    aliases: ["Rate of exploitation"],
    summary:
      "The appropriation of surplus labour by a non-producing class; under capitalism, the extraction of surplus value from wage-labour.",
    brief: `Exploitation, in Marx's sense, isn't about low wages. It's that one class lives from the unpaid labour of another — even when wages are "fair".`,
    standard: `All class societies involve exploitation: slaves, serfs and wage-workers each perform surplus labour for others. What is distinctive about capitalism is that exploitation is hidden by the apparently equal exchange of wages for work. Marx's "rate of surplus value" measures it as the ratio of surplus to necessary labour.`,
  },
  {
    slug: "class-struggle",
    title: "Class Struggle",
    sortOrder: 55,
    aliases: ["Class conflict", "Class war"],
    summary:
      "The conflict of interests between classes, which Marx and Engels treated as a driving force of historical change.",
    brief: `Classes have opposed interests, and the conflict between them — sometimes open, sometimes hidden — shapes history.`,
    standard: `The [[text:communist-manifesto|Manifesto]] opens with the claim that all recorded history has been the history of class struggles.[cite:src_manifesto_moore, §1] Class struggle includes strikes and revolutions, but also everyday conflicts over wages, hours, the pace of work and the shape of the state.`,
    citations: [{ source: "src_manifesto_moore", locator: "Section I", field: "standard" }],
  },
  {
    slug: "commodity-fetishism",
    title: "Commodity Fetishism",
    sortOrder: 22,
    aliases: ["Fetishism of commodities", "Fetish character of the commodity", "Reification"],
    summary:
      "The way social relations between people appear, under capitalism, as relations between things and their prices.",
    brief: `Prices move, markets "decide", the economy "demands". Marx called this commodity fetishism: our own social relationships appear to us as the behaviour of things.`,
    standard: `In the final section of the first chapter of [[text:capital-volume-one|Capital]], Marx argues that because producers only relate to one another through the exchange of their products, their social relations appear as relations between commodities. This is not simply a mistake in thinking: it is how these relations actually present themselves.[cite:src_capital_fowkes, ch. 1 §4]`,
  },
  {
    slug: "ideology",
    title: "Ideology",
    sortOrder: 65,
    aliases: ["False consciousness", "Ideological State Apparatuses", "ISAs"],
    summary:
      "Ideas, representations and practices that make an existing social order appear natural, just or inevitable.",
    brief: `Ideology is the set of ideas and habits that make the way things are seem like the way things must be.`,
    standard: `For Marx and Engels in [[text:the-german-ideology|The German Ideology]], the ruling ideas of an age are the ideas of its ruling class. Later theorists reworked the concept: Lukács through reification, Gramsci through [[concept:hegemony]], and [[thinker:althusser|Althusser]] through "ideological state apparatuses" that interpellate individuals as subjects.[cite:src_isa]`,
  },
  {
    slug: "the-state",
    title: "The State",
    sortOrder: 70,
    aliases: ["State", "State power", "State apparatus"],
    summary:
      "The organised apparatus of rule. Socialist traditions disagree profoundly about what it is and what to do with it.",
    brief: `Is the state a neutral referee, a weapon of the ruling class, or a form of domination in its own right? The answer shapes every socialist strategy.`,
    standard: `The [[debate:what-is-the-state|debate on the state]] runs through the whole history of the left: whether the state can be captured, must be smashed and replaced, should be abolished immediately, or will "wither away" once classes disappear.`,
  },
  {
    slug: "mutual-aid",
    title: "Mutual Aid",
    sortOrder: 80,
    aliases: ["Cooperation", "Mutual aid networks"],
    yearStart: 1902,
    summary:
      "Voluntary, reciprocal cooperation; for Kropotkin, a factor of evolution and the basis of a free society.",
    brief: `Mutual aid means people helping each other directly and reciprocally — not as charity, and not because a state tells them to.`,
    standard: `[[thinker:kropotkin|Kropotkin]] gathered evidence from animal behaviour, village communities, medieval guilds and workers' associations to argue that cooperation is as natural as competition.[cite:src_mutual_aid] The term has been revived by contemporary organisers to describe neighbourhood solidarity networks.`,
  },
  {
    slug: "social-reproduction",
    title: "Social Reproduction",
    sortOrder: 85,
    aliases: ["Reproductive labour", "Social reproduction theory", "SRT"],
    summary:
      "The work — much of it unpaid and gendered — of producing and maintaining people, including the workers capitalism depends on.",
    brief: `Before anyone can go to work, someone has to raise, feed, clean and care for them. Social reproduction theory asks who does that work, and why it is so often unpaid.`,
    standard: `Marxist feminists argued from the 1970s that the household is a site of production — of labour-power itself. The Wages for Housework campaign, with [[thinker:federici|Federici]] among its founders, made the point polemically. Contemporary social reproduction theory extends the analysis to schools, hospitals, care work and migration.[cite:src_srt_bhattacharya]`,
  },
  {
    slug: "imperialism",
    title: "Imperialism",
    sortOrder: 90,
    aliases: ["Imperialist", "Monopoly capitalism"],
    summary:
      "The domination of territories and peoples by powerful states and capitals; for Lenin, the 'highest stage' of capitalism.",
    brief: `Imperialism is the domination of some countries by others. Marxists argued it grows out of capitalism's need to expand.`,
    standard: `Hobson, Hilferding, Luxemburg, Bukharin and [[thinker:lenin|Lenin]] connected imperialism to the export of capital, the rise of monopolies and finance, and the scramble for colonies. Anti-colonial thinkers such as [[thinker:fanon|Fanon]] shifted the focus to the experience and agency of the colonised.`,
  },
  {
    slug: "dialectics",
    title: "Dialectics",
    sortOrder: 3,
    aliases: ["Dialectic", "Dialectical method", "Dialectical materialism"],
    summary:
      "A way of thinking about reality as processes driven by internal contradiction, rather than fixed things.",
    brief: `Dialectics treats things as processes — shaped by tensions inside them, and changing because of those tensions.`,
    standard: `Inherited from [[thinker:hegel|Hegel]], dialectics was "turned on its feet" by Marx. Whether there is a general dialectical method — Engels's "dialectics of nature" — or only a dialectical way of presenting the critique of political economy remains disputed.`,
  },
  {
    slug: "vanguard-party",
    title: "Vanguard Party",
    sortOrder: 95,
    aliases: ["Vanguard", "Vanguardism", "Democratic centralism"],
    yearStart: 1902,
    summary:
      "A disciplined organisation of committed revolutionaries intended to lead the working class.",
    brief: `The vanguard party is Lenin's idea of a tightly organised party of committed revolutionaries, meant to give the workers' movement political direction.`,
    standard: `In [[text:what-is-to-be-done|What Is to Be Done?]] Lenin argued that workers left to themselves develop only "trade-union consciousness", and that socialist consciousness must be brought by a party. [[thinker:luxemburg|Luxemburg]] warned in 1904 that ultra-centralism would stifle the initiative of the masses.`,
  },
  {
    slug: "social-ecology",
    title: "Social Ecology",
    sortOrder: 100,
    aliases: ["Libertarian municipalism", "Communalism"],
    yearStart: 1964,
    summary:
      "Bookchin's theory that ecological problems arise from social hierarchy, and that ecological society requires direct democracy.",
    brief: `Social ecology says the way we dominate nature mirrors the way people dominate each other — so solving one means confronting the other.`,
    standard: `[[thinker:bookchin|Bookchin]] traced the idea of dominating nature to the emergence of hierarchy — of age, gender and class — among humans, and argued for decentralised, confederated, directly democratic communities.[cite:src_ecology_freedom]`,
  },
  {
    slug: "class-consciousness",
    title: "Class Consciousness",
    sortOrder: 57,
    aliases: ["Class for itself", "Class in itself", "Trade-union consciousness"],
    summary:
      "A class's awareness of its shared position and interests, and of itself as a potential historical agent.",
    brief: `Being in the same economic position is one thing. Recognising it, and acting together because of it, is class consciousness.`,
    standard: `Marx contrasted a class defined by its situation with a class organised for its own interests. How consciousness develops — through struggle, through a party, through culture — is the subject of a long [[debate:class-consciousness|debate]].`,
  },
  {
    slug: "private-property",
    title: "Private Property",
    sortOrder: 7,
    aliases: ["Property", "Property is theft", "Means of production"],
    summary:
      "Exclusive ownership; in socialist usage, especially ownership of the means of production, as distinct from personal possessions.",
    brief: `Socialists don't usually mean your toothbrush. They mean private ownership of the things everyone needs to produce with — land, factories, infrastructure.`,
    standard: `[[thinker:proudhon|Proudhon]]'s "property is theft" distinguished exploitative property from possession. Marx and Engels argued for the abolition of *bourgeois* property — property in the means of production — rather than personal property.`,
  },
  {
    slug: "decolonisation",
    title: "Decolonisation",
    sortOrder: 105,
    aliases: ["Decolonization", "National liberation", "Anti-colonialism"],
    summary:
      "The overthrow of colonial rule, and — for Fanon — the transformation of the people and social relations colonialism produced.",
    brief: `Decolonisation means ending colonial rule. For Fanon it also meant remaking the people and societies that colonialism had shaped.`,
    standard: `[[thinker:fanon|Fanon]] insisted that decolonisation is not a handover of power to a native elite but a total transformation, and warned of the "pitfalls of national consciousness" when a national bourgeoisie simply replaces the colonial one.[cite:src_wretched]`,
  },
];
