import type { SeedDebate } from "./types";

/*
 * Sample debates. Positions are simplified, descriptive summaries intended to
 * demonstrate the comparison interface. Stances are editorial readings and
 * are marked "qualified" wherever a thinker's view is contested or complex.
 */
export const debates: SeedDebate[] = [
  {
    slug: "what-is-the-state",
    title: "What is the state?",
    featured: true,
    sortOrder: 10,
    summary:
      "Is the state an instrument of class rule, a form of domination in itself, or a terrain of struggle? Different traditions answer differently — and draw different strategies from their answers.",
    intro:
      "Different traditions answer this question differently. Their answers determine whether socialists try to win elections, build parallel institutions, seize power, or refuse the state altogether.",
    body: `The question was sharpened by the Paris Commune of 1871, which Marx, Bakunin and later Lenin each read as confirmation of their own views. It returned with every revolution of the twentieth century.`,
    propositions: [
      { key: "instrument", statement: "The state is fundamentally an instrument of class rule." },
      { key: "seize", statement: "The working class should take political power." },
      { key: "transition", statement: "A transitional workers' state is necessary after a revolution." },
      { key: "wither", statement: "The state should ultimately disappear." },
      { key: "consent", statement: "State power rests on consent as well as coercion." },
      { key: "parliament", statement: "Participating in parliamentary politics can serve the cause." },
      { key: "centralism", statement: "Revolutionary organisation should be centralised." },
    ],
    positions: [
      {
        key: "marx",
        holder: "thinker:marx",
        label: "Marx & Engels",
        centralClaim:
          "The state is the organised power of one class for oppressing another; the workers must win political power, and the state will 'wither away' with classes.",
        summary:
          "The modern state manages the common affairs of the bourgeoisie. After the Commune, Marx added that the working class cannot simply take hold of the ready-made state machine: it must replace it with new, democratic forms.",
        assumptions: [
          "Political power derives from economic class relations.",
          "Classes — and so the state — are historical, not eternal.",
        ],
        criticisms: [
          "Anarchists: a 'workers' state' will create a new ruling elite.",
          "Later theorists: the state has more autonomy from class than this suggests.",
        ],
        links: ["text:communist-manifesto", "concept:class-struggle", "concept:historical-materialism"],
        stances: {
          instrument: "affirms",
          seize: "affirms",
          transition: ["affirms", "The 'dictatorship of the proletariat', modelled after 1871 on the Commune."],
          wither: "affirms",
          consent: ["qualified", "Addressed via ideology — 'the ruling ideas' — rather than a theory of consent."],
          parliament: ["qualified", "Supported workers' parties contesting elections where possible."],
          centralism: ["qualified", "Varied with circumstances; no settled theory of the party."],
        },
      },
      {
        key: "bakunin",
        holder: "thinker:bakunin",
        label: "Bakunin",
        centralClaim:
          "The state is itself a source of domination; any state, including a workers' state, will produce a new ruling class.",
        summary:
          "Revolution must destroy the state immediately, replacing it with a free federation of workers' and peasants' associations organised from below.",
        assumptions: [
          "Power corrupts those who hold it, whatever their class origin.",
          "The means of revolution shape its outcome.",
        ],
        criticisms: [
          "Marxists: without organised power, a revolution cannot defend itself.",
          "Critics: Bakunin's own conspiratorial organisations sat uneasily with his anti-authoritarianism.",
        ],
        links: ["text:statism-and-anarchy", "concept:the-state"],
        stances: {
          instrument: ["qualified", "Class rule — but also domination in its own right."],
          seize: "rejects",
          transition: "rejects",
          wither: ["affirms", "Abolished in the revolution itself, not after a transition."],
          consent: "silent",
          parliament: "rejects",
          centralism: ["rejects", "Federalism from below — though his secret societies are contested."],
        },
      },
      {
        key: "lenin",
        holder: "thinker:lenin",
        label: "Lenin",
        centralClaim:
          "The bourgeois state must be smashed and replaced by a Commune-type state of armed workers, which will itself wither away.",
        summary:
          "In The State and Revolution Lenin attacks reformist socialists for forgetting Marx's lessons from the Commune: the state is an organ of class domination that cannot be reformed into socialism.",
        assumptions: [
          "Class rule persists until classes are abolished.",
          "A disciplined party is needed to lead the revolution.",
        ],
        criticisms: [
          "Luxemburg: suppressing democracy will stifle the revolution itself.",
          "Anarchists: Soviet history confirmed Bakunin's warning.",
        ],
        links: ["text:the-state-and-revolution", "concept:vanguard-party", "event:october-revolution"],
        stances: {
          instrument: "affirms",
          seize: "affirms",
          transition: "affirms",
          wither: "affirms",
          consent: "silent",
          parliament: ["qualified", "A tactical arena — see 'Left-Wing' Communism (1920)."],
          centralism: ["affirms", "Democratic centralism."],
        },
      },
      {
        key: "luxemburg",
        holder: "thinker:luxemburg",
        label: "Luxemburg",
        centralClaim:
          "Socialism requires workers to take power — but the dictatorship of the proletariat must be the broadest democracy, not the rule of a party.",
        summary:
          "Luxemburg defended revolution against Bernstein's reformism, and defended democracy against Bolshevik centralism: the masses learn to rule by ruling.",
        assumptions: [
          "Mass self-activity, not party direction, is the motor of revolution.",
          "Socialist democracy is a means as well as an end.",
        ],
        criticisms: [
          "Leninists: her faith in spontaneity underrates organisation.",
          "Reformists: her revolutionary expectations were not borne out in the West.",
        ],
        links: ["text:social-reform-or-revolution", "text:the-russian-revolution", "concept:class-consciousness"],
        stances: {
          instrument: "affirms",
          seize: "affirms",
          transition: ["qualified", "Yes — exercised by the class as a whole, with full political freedoms."],
          wither: "affirms",
          consent: ["qualified", "Emphasises political education through mass struggle."],
          parliament: ["qualified", "Used parliament for agitation; rejected reformism."],
          centralism: ["rejects", "Criticised Lenin's 'ultra-centralism' (1904)."],
        },
      },
      {
        key: "gramsci",
        holder: "thinker:gramsci",
        label: "Gramsci",
        centralClaim:
          "The state, in its 'integral' sense, is political society plus civil society: hegemony protected by the armour of coercion.",
        summary:
          "In the West, rule is secured through a dense network of institutions that organise consent. Strategy must therefore include a long 'war of position' in civil society.",
        assumptions: [
          "Culture and common sense are terrains of struggle, not mere reflections.",
          "Western and Russian conditions differ fundamentally.",
        ],
        criticisms: [
          "Some readers: the war of position can slide into reformism.",
          "Anderson: the notebooks shift between incompatible definitions of the state.",
        ],
        links: ["text:prison-notebooks", "concept:hegemony"],
        stances: {
          instrument: ["qualified", "Class rule, but organised through consent as well as force."],
          seize: "affirms",
          transition: "affirms",
          wither: ["affirms", "The state absorbed into a 'regulated society'."],
          consent: "affirms",
          parliament: ["qualified", "Part of the war of position, never sufficient."],
          centralism: ["qualified", "The party as 'Modern Prince' — a collective intellectual."],
        },
      },
      {
        key: "althusser",
        holder: "thinker:althusser",
        label: "Althusser",
        centralClaim:
          "The state reproduces class relations through repressive apparatuses and through ideological state apparatuses — schools, family, churches, media.",
        summary:
          "Althusser extended Marxist state theory to the institutions that form subjects. Ideology is not false ideas but material practices that make us who we are.",
        assumptions: [
          "Social formations are structures, not expressions of a human essence.",
          "Reproduction of the relations of production is a central question.",
        ],
        criticisms: [
          "Critics: the theory leaves little room for resistance or agency.",
          "E. P. Thompson: structuralism erases historical experience.",
        ],
        links: ["text:ideology-and-isas", "concept:ideology"],
        stances: {
          instrument: "affirms",
          seize: "affirms",
          transition: ["affirms", "Defended the concept when the PCF abandoned it in 1976."],
          wither: "affirms",
          consent: ["affirms", "Through ideological state apparatuses."],
          parliament: "silent",
          centralism: ["qualified", "A party member who criticised its internal life."],
        },
      },
    ],
    arguments: [
      {
        key: "a1",
        position: "marx",
        kind: "argument",
        body: "The Commune showed that workers can govern themselves, but only by breaking up the old bureaucracy and standing army and making officials elected and recallable.",
      },
      {
        key: "c1",
        position: "bakunin",
        kind: "counterargument",
        respondsTo: "a1",
        body: "Calling the new power a 'state' at all invites the return of a governing minority. The Commune's lesson was federation, not a new centre.",
      },
      {
        key: "a2",
        position: "lenin",
        kind: "argument",
        body: "Without a centralised workers' state, the revolution cannot defeat armed counter-revolution.",
      },
      {
        key: "c2",
        position: "luxemburg",
        kind: "counterargument",
        respondsTo: "a2",
        body: "Without general elections, a free press and freedom of assembly, public life withers and the bureaucracy alone remains active.",
      },
      {
        key: "a3",
        position: "gramsci",
        kind: "argument",
        body: "In the West a frontal assault on the state will fail, because behind it stands a 'powerful system of fortresses and earthworks' in civil society.",
      },
      {
        key: "c3",
        kind: "counterargument",
        respondsTo: "a3",
        body: "If hegemony is built up gradually inside existing institutions, what distinguishes the strategy from reform?",
      },
    ],
    citations: [
      { source: "src_state_revolution" },
      { source: "src_statism_anarchy" },
      { source: "src_prison_notebooks" },
      { source: "src_isa" },
    ],
  },
  {
    slug: "reform-or-revolution",
    title: "Reform or revolution?",
    featured: true,
    sortOrder: 20,
    summary:
      "Can socialism be achieved through the gradual accumulation of reforms, or does it require a rupture with capitalist property and state power?",
    intro:
      "The revisionism controversy of 1898–1903 posed the question in its classic form. It has been reopened by every generation of the left.",
    propositions: [
      { key: "collapse", statement: "Capitalism tends towards deepening crisis." },
      { key: "gradual", statement: "Reforms can transform capitalism into socialism step by step." },
      { key: "reforms-value", statement: "Fighting for reforms strengthens the working class." },
      { key: "goal", statement: "The final goal must guide everyday politics." },
    ],
    positions: [
      {
        key: "bernstein",
        holder: "thinker:bernstein",
        label: "Bernstein",
        centralClaim: "What matters is the movement of practical reform, not a distant 'final goal'.",
        summary:
          "Capitalism was adapting rather than collapsing. Social democracy should become a democratic party of reform, extending democracy into economic life.",
        links: ["text:preconditions-of-socialism"],
        stances: { collapse: "rejects", gradual: "affirms", "reforms-value": "affirms", goal: "rejects" },
      },
      {
        key: "luxemburg",
        holder: "thinker:luxemburg",
        label: "Luxemburg",
        centralClaim:
          "Reform and revolution are not alternative routes to the same destination; reforms alone cannot abolish wage-labour.",
        summary:
          "The struggle for reforms is the means; social revolution is the goal. Abandon the goal and the movement becomes an attempt to manage capitalism.",
        links: ["text:social-reform-or-revolution"],
        stances: { collapse: "affirms", gradual: "rejects", "reforms-value": "affirms", goal: "affirms" },
      },
      {
        key: "lenin",
        holder: "thinker:lenin",
        label: "Lenin",
        centralClaim: "Reforms are by-products of revolutionary struggle; reformism disarms the working class.",
        summary:
          "Lenin attacked 'opportunism' in the Second International and, after 1914, saw reformism as rooted in a labour aristocracy bribed by imperialist super-profits.",
        links: ["text:what-is-to-be-done", "text:imperialism-highest-stage"],
        stances: {
          collapse: "affirms",
          gradual: "rejects",
          "reforms-value": ["qualified", "Only as part of revolutionary strategy."],
          goal: "affirms",
        },
      },
    ],
    citations: [{ source: "src_reform_revolution" }, { source: "src_preconditions" }],
  },
  {
    slug: "class-consciousness",
    title: "What is class consciousness?",
    featured: true,
    sortOrder: 30,
    summary:
      "How do people in a common economic position come to understand themselves as a class — and to act as one?",
    intro:
      "Every socialist strategy assumes an answer: that consciousness grows from struggle, is brought by a party, or must be won on the terrain of culture.",
    propositions: [
      { key: "spontaneous", statement: "Struggle itself produces socialist consciousness." },
      { key: "outside", statement: "Socialist ideas must be brought to workers from outside their immediate struggles." },
      { key: "culture", statement: "Culture and common sense are decisive terrains." },
    ],
    positions: [
      {
        key: "marx",
        holder: "thinker:marx",
        label: "Marx",
        centralClaim: "A class in its situation becomes a class 'for itself' through struggle and organisation.",
        summary: "Combination and conflict transform a mass of workers into a political force aware of common interests.",
        links: ["concept:class", "concept:class-struggle"],
        stances: { spontaneous: ["qualified", "Through organised struggle."], outside: "silent", culture: "silent" },
      },
      {
        key: "lenin",
        holder: "thinker:lenin",
        label: "Lenin",
        centralClaim: "Left to themselves, workers develop only trade-union consciousness.",
        summary: "Socialist consciousness has to be introduced by a party armed with theory.",
        links: ["text:what-is-to-be-done", "concept:vanguard-party"],
        stances: { spontaneous: "rejects", outside: "affirms", culture: "silent" },
      },
      {
        key: "luxemburg",
        holder: "thinker:luxemburg",
        label: "Luxemburg",
        centralClaim: "Mass action is the school of consciousness.",
        summary: "In mass strikes, workers learn more in days than in years of propaganda.",
        links: ["text:the-mass-strike"],
        stances: { spontaneous: "affirms", outside: ["qualified", "The party's role is to clarify, not to command."], culture: "silent" },
      },
      {
        key: "gramsci",
        holder: "thinker:gramsci",
        label: "Gramsci",
        centralClaim: "Consciousness is 'contradictory': common sense mixes ruling ideas with practical knowledge.",
        summary: "Organic intellectuals of the working class must work from within common sense to build a new hegemony.",
        links: ["text:prison-notebooks", "concept:hegemony"],
        stances: { spontaneous: "qualified", outside: "qualified", culture: "affirms" },
      },
    ],
  },
  {
    slug: "can-capitalism-be-reformed",
    title: "Can capitalism be reformed?",
    featured: true,
    sortOrder: 40,
    summary:
      "Can welfare states, regulation and green investment tame capitalism durably — or do its imperatives of growth and profit undo every settlement?",
    intro:
      "Post-war prosperity seemed to answer the question; the crises since the 1970s reopened it, now with ecological limits in view.",
    propositions: [
      { key: "taming", statement: "Democratic states can durably constrain capital." },
      { key: "growth", statement: "Capitalism requires endless growth." },
    ],
    positions: [
      {
        key: "social-democracy",
        holder: "tendency:social-democracy",
        label: "Social democracy",
        centralClaim: "Democratic politics can steer markets towards social ends.",
        summary: "Welfare states, collective bargaining and public ownership of key sectors can make capitalism serve the majority.",
        stances: { taming: "affirms", growth: "qualified" },
      },
      {
        key: "luxemburg",
        holder: "thinker:luxemburg",
        label: "Luxemburg",
        centralClaim: "Accumulation drives capital beyond every limit.",
        summary: "Reforms are won and lost; capital's expansionary dynamic is not changed by them.",
        links: ["text:accumulation-of-capital"],
        stances: { taming: "rejects", growth: "affirms" },
      },
      {
        key: "bookchin",
        holder: "thinker:bookchin",
        label: "Bookchin",
        centralClaim: "'Grow or die' is capitalism's law — and it is incompatible with ecology.",
        summary: "Ecological crisis cannot be solved within a system premised on competitive growth and hierarchy.",
        links: ["concept:social-ecology", "text:the-ecology-of-freedom"],
        stances: { taming: "rejects", growth: "affirms" },
      },
    ],
  },
  {
    slug: "revolutionary-subject",
    title: "What is the revolutionary subject?",
    featured: true,
    sortOrder: 50,
    summary:
      "Who makes the revolution? The industrial proletariat, the peasantry, the colonised, the unwaged — or a coalition still to be built?",
    intro:
      "Marx's answer was the proletariat. Each subsequent tradition has redrawn the map of who is exploited, who is excluded, and who can act.",
    propositions: [
      { key: "proletariat", statement: "The industrial working class is the central agent of change." },
      { key: "peasantry", statement: "Peasants can be a revolutionary force in their own right." },
      { key: "unwaged", statement: "Unwaged and reproductive workers are central to anti-capitalist struggle." },
    ],
    positions: [
      {
        key: "marx",
        holder: "thinker:marx",
        label: "Marx",
        centralClaim: "The proletariat, with nothing to lose but its chains.",
        summary: "Capitalism creates its own gravediggers: a propertyless class concentrated in industry.",
        links: ["text:communist-manifesto"],
        stances: { proletariat: "affirms", peasantry: "qualified", unwaged: "silent" },
      },
      {
        key: "bakunin",
        holder: "thinker:bakunin",
        label: "Bakunin",
        centralClaim: "The uprising of all the oppressed, peasants included.",
        summary: "Bakunin looked to the peasantry and the poorest strata as well as industrial workers.",
        stances: { proletariat: "qualified", peasantry: "affirms", unwaged: "silent" },
      },
      {
        key: "fanon",
        holder: "thinker:fanon",
        label: "Fanon",
        centralClaim: "In the colonies, the peasantry is the revolutionary class.",
        summary: "The small colonial urban proletariat is relatively privileged; the dispossessed rural masses carry decolonisation.",
        links: ["text:the-wretched-of-the-earth", "concept:decolonisation"],
        stances: { proletariat: "rejects", peasantry: "affirms", unwaged: "qualified" },
      },
      {
        key: "federici",
        holder: "thinker:federici",
        label: "Federici",
        centralClaim: "The unwaged — housewives, the colonised, the enclosed — are central to capital and to its overthrow.",
        summary: "Capital's accumulation rests on unwaged reproductive labour; struggles over it are class struggles.",
        links: ["text:wages-against-housework", "concept:social-reproduction"],
        stances: { proletariat: "qualified", peasantry: "qualified", unwaged: "affirms" },
      },
    ],
  },
];
