import type { SeedThinker } from "./types";

/*
 * Sample thinker records. Summaries are deliberately brief, conventional and
 * descriptive. They are placeholders demonstrating the template, not finished
 * entries.
 */
export const thinkers: SeedThinker[] = [
  {
    slug: "marx",
    title: "Karl Marx",
    subtitle: "1818–1883",
    roles: "German philosopher, economist and revolutionary",
    birthPlace: "Trier, Prussia",
    deathPlace: "London",
    yearStart: 1818,
    yearEnd: 1883,
    featured: true,
    sortOrder: 10,
    aliases: ["Marx", "Karl Heinrich Marx"],
    summary:
      "Philosopher and critic of political economy whose analysis of capitalism, class and history became the central reference point — positive or negative — for most of the modern left.",
    body: `Marx began as a student of Hegel's philosophy in the circle of the Young Hegelians, and moved through journalism, exile and political organising towards a lifelong project: a critique of [[concept:capitalism|capitalist]] society that would explain how it works, why it is unstable, and how it might be superseded.

His early writings develop a theory of [[concept:alienation]]; with Engels he set out a materialist conception of history in *The German Ideology* and the *Communist Manifesto*; and from the 1850s he devoted himself to the critique of political economy that culminated in [[text:capital-volume-one|Capital]].[cite:src_kolakowski, vol. 1]

Marx was also a political actor — in the Communist League, in the International Workingmen's Association and in a long correspondence with socialist parties — and his writings on the Paris Commune shaped later arguments about [[concept:the-state|the state]].`,
    legacy: `Few thinkers have been interpreted so variously. Social democrats, Leninists, Western Marxists, structuralists, autonomists, feminists and anti-colonial theorists have each claimed — and contested — parts of Marx's work. The publication of his early manuscripts in 1932 opened a further debate about the continuity between the "young" and the "mature" Marx.`,
    citations: [
      { source: "src_kolakowski", locator: "vol. 1", field: "overview" },
      { source: "src_bottomore_dictionary", field: "overview" },
    ],
  },
  {
    slug: "engels",
    title: "Friedrich Engels",
    subtitle: "1820–1895",
    roles: "German social theorist, journalist and organiser",
    birthPlace: "Barmen, Prussia",
    deathPlace: "London",
    yearStart: 1820,
    yearEnd: 1895,
    featured: true,
    sortOrder: 20,
    summary:
      "Marx's collaborator and co-author, whose study of the Manchester working class and later popularising works did much to define 'Marxism' as a doctrine.",
    body: `The son of a textile manufacturer, Engels wrote [[text:condition-working-class-england|The Condition of the Working Class in England]] from direct observation of industrial Manchester. From 1844 he worked with Marx, co-writing *The German Ideology* and the *Manifesto*, and financially supporting Marx's research for decades.

After Marx's death he edited the second and third volumes of *Capital* and wrote widely read syntheses — including *Socialism: Utopian and Scientific* and *The Origin of the Family, Private Property and the State* — that shaped the theory of the Second International.`,
    legacy: `Engels's role is itself debated: some read him as Marx's faithful interpreter, others as the author of a more deterministic, systematised "Marxism". His account of the family and the state was an early touchstone for Marxist feminism.`,
    citations: [{ source: "src_bottomore_dictionary", field: "overview" }],
  },
  {
    slug: "hegel",
    title: "G. W. F. Hegel",
    subtitle: "1770–1831",
    roles: "German idealist philosopher",
    birthPlace: "Stuttgart, Württemberg",
    deathPlace: "Berlin",
    yearStart: 1770,
    yearEnd: 1831,
    featured: false,
    sortOrder: 5,
    aliases: ["Georg Wilhelm Friedrich Hegel", "Hegel"],
    summary:
      "Idealist philosopher whose dialectical account of history and self-consciousness was the starting point that Marx, Bakunin and many others reworked or rejected.",
    body: `Hegel is not a socialist thinker, but the Atlas includes him as a precursor: his philosophy of history, his treatment of [[concept:dialectics]] and his account of self-estrangement were the intellectual material out of which the Young Hegelians — Marx and Bakunin among them — built their own projects.`,
    legacy: `Debates over Marx's relationship to Hegel recur throughout the tradition: Lukács and the Frankfurt School emphasised the Hegelian inheritance; Althusser argued for an "epistemological break" between them.`,
  },
  {
    slug: "proudhon",
    title: "Pierre-Joseph Proudhon",
    subtitle: "1809–1865",
    roles: "French social theorist, printer and the first self-described anarchist",
    birthPlace: "Besançon, France",
    deathPlace: "Passy, Paris",
    yearStart: 1809,
    yearEnd: 1865,
    featured: true,
    sortOrder: 15,
    summary:
      "Self-educated printer who declared himself an anarchist, attacked property as theft, and proposed a mutualist economy of free exchange and federation.",
    body: `In [[text:what-is-property|What Is Property?]] (1840) Proudhon gave the period one of its most famous provocations, distinguishing exploitative property from the *possession* of what one uses. He later developed mutualism: workers' associations, free credit and federation in place of the centralised state.

Marx initially admired Proudhon, then attacked him in *The Poverty of Philosophy* (1847). Proudhon's influence on French workers' movements remained strong through the First International and the Paris Commune.`,
    legacy: `Proudhon's federalism and suspicion of the state passed into the anarchist tradition through Bakunin. His writings also contain antisemitic and misogynist passages that later anarchists and historians have criticised.`,
    citations: [{ source: "src_marshall_anarchism", field: "overview" }],
  },
  {
    slug: "bakunin",
    title: "Mikhail Bakunin",
    subtitle: "1814–1876",
    roles: "Russian revolutionary and theorist of collectivist anarchism",
    birthPlace: "Pryamukhino, Russian Empire",
    deathPlace: "Bern, Switzerland",
    yearStart: 1814,
    yearEnd: 1876,
    featured: true,
    sortOrder: 25,
    summary:
      "Revolutionary anarchist whose clash with Marx in the First International set the terms of the long dispute between libertarian and authoritarian socialism.",
    body: `A participant in the revolutions of 1848–49, imprisoned and exiled to Siberia, Bakunin escaped in 1861 and became the leading figure of the anti-authoritarian wing of the International. He argued that any "workers' state" would produce a new ruling class of administrators, and that the state must be abolished in the revolution itself rather than after it.

His conflict with Marx culminated in his expulsion at the Hague Congress of 1872. [[text:statism-and-anarchy|Statism and Anarchy]] (1873) restates his case against Marxist political strategy.[cite:src_statism_anarchy]`,
    legacy: `Bakunin's critique of the "dictatorship of the proletariat" is often cited — by anarchists and others — as anticipating the bureaucratic outcome of twentieth-century revolutions.`,
    citations: [
      { source: "src_statism_anarchy", field: "overview" },
      { source: "src_marshall_anarchism", field: "overview" },
    ],
  },
  {
    slug: "kropotkin",
    title: "Peter Kropotkin",
    subtitle: "1842–1921",
    roles: "Russian geographer and theorist of anarchist communism",
    birthPlace: "Moscow, Russian Empire",
    deathPlace: "Dmitrov, Russia",
    yearStart: 1842,
    yearEnd: 1921,
    featured: true,
    sortOrder: 40,
    aliases: ["Pyotr Kropotkin", "Petr Kropotkin"],
    summary:
      "Scientist and anarchist communist who argued that cooperation — mutual aid — is as much a factor of evolution as competition, and that society could be organised without the state or wages.",
    body: `Trained as a geographer, Kropotkin renounced his princely title and spent decades in prison and exile. In [[text:the-conquest-of-bread|The Conquest of Bread]] he sketched a communist society organised through free association, and in [[text:mutual-aid|Mutual Aid]] he challenged Social Darwinist readings of evolution.`,
    legacy: `Kropotkin's synthesis of science and ethics shaped anarchist communism and, later, ecological and communitarian thought, including the social ecology of Murray Bookchin.`,
    citations: [{ source: "src_mutual_aid", field: "overview" }],
  },
  {
    slug: "bernstein",
    title: "Eduard Bernstein",
    subtitle: "1850–1932",
    roles: "German social democratic theorist and politician",
    birthPlace: "Berlin",
    deathPlace: "Berlin",
    yearStart: 1850,
    yearEnd: 1932,
    featured: false,
    sortOrder: 45,
    summary:
      "Leading theorist of 'revisionism', who argued that socialism would come through gradual democratic reform rather than capitalist collapse and revolution.",
    body: `A close associate of Engels, Bernstein argued in *The Preconditions of Socialism* (1899) that key Marxist predictions — the polarisation of classes, ever-deepening crises — were not being borne out, and that social democracy should become openly what it already was in practice: a party of democratic reform.[cite:src_preconditions]

The resulting "revisionism debate" drew replies from Kautsky, Luxemburg and many others.`,
    legacy: `Bernstein's arguments anticipated the trajectory of twentieth-century social democracy.`,
    citations: [{ source: "src_preconditions", field: "overview" }],
  },
  {
    slug: "lenin",
    title: "Vladimir Lenin",
    subtitle: "1870–1924",
    roles: "Russian revolutionary, Bolshevik leader and theorist",
    birthPlace: "Simbirsk, Russian Empire",
    deathPlace: "Gorki, near Moscow",
    yearStart: 1870,
    yearEnd: 1924,
    featured: true,
    sortOrder: 50,
    aliases: ["Vladimir Ilyich Ulyanov", "V. I. Lenin"],
    summary:
      "Leader of the Bolshevik party and the October Revolution, whose theories of the party, imperialism and the state became the foundation of twentieth-century communism.",
    body: `Lenin's [[text:what-is-to-be-done|What Is to Be Done?]] (1902) argued for a disciplined party of professional revolutionaries — the [[concept:vanguard-party|vanguard]]. During the First World War he analysed [[concept:imperialism]] as a stage of capitalism, and in 1917 wrote [[text:the-state-and-revolution|The State and Revolution]], which revived Marx's writings on the Paris Commune.[cite:src_state_revolution]

After October 1917 he led the Soviet government through civil war, the Red Terror and the New Economic Policy.`,
    legacy: `"Leninism" was codified after his death and claimed by many opposed currents — Stalinist, Trotskyist, Maoist. Critics from Luxemburg onwards questioned whether his conception of the party prepared the ground for bureaucratic rule.`,
    citations: [{ source: "src_kolakowski", locator: "vol. 2", field: "overview" }],
  },
  {
    slug: "luxemburg",
    title: "Rosa Luxemburg",
    subtitle: "1871–1919",
    roles: "Polish-German Marxist theorist, economist and revolutionary",
    birthPlace: "Zamość, Russian Poland",
    deathPlace: "Berlin",
    yearStart: 1871,
    yearEnd: 1919,
    featured: true,
    sortOrder: 55,
    summary:
      "Revolutionary Marxist who answered Bernstein's revisionism, championed mass action and workers' democracy, and criticised the Bolsheviks from the left.",
    body: `Luxemburg's [[text:social-reform-or-revolution|Social Reform or Revolution?]] made her the sharpest critic of Bernstein. Her pamphlet on [[text:the-mass-strike|the mass strike]], drawn from the Russian events of 1905, emphasised the creativity of mass action over the caution of party and union officials.[cite:src_reform_revolution]

In [[text:accumulation-of-capital|The Accumulation of Capital]] she linked capitalist expansion to non-capitalist environments and imperialism. She opposed the SPD's support for the war in 1914, co-founded the Spartacus League, and was murdered by Freikorps soldiers in January 1919.`,
    legacy: `Luxemburg's insistence that socialism and democracy are inseparable has made her a reference point for anti-Stalinist and democratic socialists alike.`,
    citations: [{ source: "src_reform_revolution", field: "overview" }],
  },
  {
    slug: "gramsci",
    title: "Antonio Gramsci",
    subtitle: "1891–1937",
    roles: "Italian Marxist theorist, journalist and communist leader",
    birthPlace: "Ales, Sardinia",
    deathPlace: "Rome",
    yearStart: 1891,
    yearEnd: 1937,
    featured: true,
    sortOrder: 60,
    summary:
      "Communist leader imprisoned by Mussolini's regime, whose Prison Notebooks developed the concept of hegemony and reshaped Marxist thinking about culture, consent and strategy.",
    body: `Gramsci was active in the Turin factory councils of 1919–20 and co-founded the Communist Party of Italy. Arrested in 1926, he filled some thirty notebooks in prison, writing on [[concept:hegemony]], intellectuals, common sense, the "war of position" and the specific history of Italy.[cite:src_prison_notebooks]`,
    legacy: `Published after 1945, the *Prison Notebooks* became foundational for Western Marxism, cultural studies, post-colonial theory and the post-Marxism of Laclau and Mouffe.`,
    citations: [
      { source: "src_prison_notebooks", field: "overview" },
      { source: "src_anderson_western", field: "legacy" },
    ],
  },
  {
    slug: "fanon",
    title: "Frantz Fanon",
    subtitle: "1925–1961",
    roles: "Martinican psychiatrist, philosopher and anti-colonial revolutionary",
    birthPlace: "Fort-de-France, Martinique",
    deathPlace: "Bethesda, Maryland",
    yearStart: 1925,
    yearEnd: 1961,
    featured: true,
    sortOrder: 70,
    summary:
      "Psychiatrist and theorist of decolonisation who analysed the psychological and political violence of colonialism and the dangers facing newly independent states.",
    body: `Fanon's *Black Skin, White Masks* (1952) examined the lived experience of racism; his work as a psychiatrist in Algeria during the war of independence led him to join the FLN. [[text:the-wretched-of-the-earth|The Wretched of the Earth]] (1961) theorised [[concept:decolonisation]], the revolutionary role of the colonised peasantry, and the risk that a national bourgeoisie would simply replace the colonial one.[cite:src_wretched]`,
    legacy: `Fanon's work influenced liberation movements, Black radical thought and post-colonial theory, and remains central to debates on violence, race and class.`,
    citations: [{ source: "src_wretched", field: "overview" }],
  },
  {
    slug: "althusser",
    title: "Louis Althusser",
    subtitle: "1918–1990",
    roles: "French Marxist philosopher",
    birthPlace: "Birmandreïs, French Algeria",
    deathPlace: "La Verrière, France",
    yearStart: 1918,
    yearEnd: 1990,
    featured: true,
    sortOrder: 80,
    summary:
      "Structuralist philosopher who argued for a scientific, anti-humanist reading of Marx and theorised how ideology reproduces the conditions of production.",
    body: `In *For Marx* and *Reading Capital* (both 1965) Althusser argued that Marx's mature work broke with the humanism of the early manuscripts. His essay on [[text:ideology-and-isas|Ideology and Ideological State Apparatuses]] (1970) analysed schools, family, media and churches as sites where [[concept:ideology]] constitutes individuals as subjects.[cite:src_isa]`,
    legacy: `Althusser's students and interlocutors — among them Balibar, Rancière, Poulantzas and Macherey — carried his questions into political theory, literary criticism and state theory.`,
    citations: [{ source: "src_isa", field: "overview" }],
  },
  {
    slug: "bookchin",
    title: "Murray Bookchin",
    subtitle: "1921–2006",
    roles: "American social theorist and founder of social ecology",
    birthPlace: "New York City",
    deathPlace: "Burlington, Vermont",
    yearStart: 1921,
    yearEnd: 2006,
    featured: true,
    sortOrder: 85,
    summary:
      "Former Marxist turned anarchist who argued that ecological crisis is rooted in social hierarchy, and later proposed libertarian municipalism.",
    body: `Bookchin's [[concept:social-ecology]] holds that the domination of nature grows out of the domination of human by human. [[text:the-ecology-of-freedom|The Ecology of Freedom]] (1982) traced hierarchy historically; his later "libertarian municipalism" proposed confederations of directly democratic assemblies.[cite:src_ecology_freedom]`,
    legacy: `His ideas were taken up, via Abdullah Öcalan, in the "democratic confederalism" of the Kurdish movement in northern Syria.`,
    citations: [{ source: "src_ecology_freedom", field: "overview" }],
  },
  {
    slug: "federici",
    title: "Silvia Federici",
    subtitle: "b. 1942",
    roles: "Italian-American feminist scholar and activist",
    birthPlace: "Parma, Italy",
    yearStart: 1942,
    yearEnd: null,
    featured: true,
    sortOrder: 90,
    summary:
      "Autonomist Marxist feminist, co-founder of the Wages for Housework campaign, whose history of the witch-hunts recasts the origins of capitalism.",
    body: `Federici was a co-founder of the International Feminist Collective (1972), which launched the Wages for Housework campaign. Her essay [[text:wages-against-housework|Wages Against Housework]] (1975) argued that unwaged domestic labour sustains capitalist accumulation.

[[text:caliban-and-the-witch|Caliban and the Witch]] (2004) re-reads "primitive accumulation" through the enclosure of women's bodies and the European witch-hunts.[cite:src_caliban]`,
    legacy: `Her work is central to contemporary [[concept:social-reproduction]] theory and to commons-based politics.`,
    citations: [{ source: "src_caliban", field: "overview" }],
  },
];
