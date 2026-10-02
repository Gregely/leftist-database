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

/**
 * Batch 7 — Revolution, war and revolution again (1905–1919): 1905, the
 * International's anti-war pledges and their collapse, Zimmerwald, 1917 and
 * the German revolution; imperialism and the state; the Russian and war
 * debates; and the learning path that ties the corpus together.
 */
export const batch7: CorpusBatch = {
  id: "b7",
  title: "War and revolution, 1905–1919",
  sources: [
    mia("src_mia_manifesto_1882", "Preface to the 1882 Russian edition of the Manifesto of the Communist Party", "Karl Marx and Frederick Engels", "1882", "https://www.marxists.org/archive/marx/works/1848/communist-manifesto/preface.htm", "signal for a proletarian revolution"),
    mia("src_mia_lenin_war_1914", "The War and Russian Social-Democracy", "V. I. Lenin", "1914", "https://www.marxists.org/archive/lenin/works/1914/sep/28.htm", "conversion of the present imperialist war"),
    mia("src_mia_kautsky_ultra", "Ultra-imperialism (Der Imperialismus)", "Karl Kautsky", "1914", "https://www.marxists.org/archive/kautsky/1914/09/ultra-imp.htm", "Ultra-imperialism"),
    mia("src_mia_trotsky_results", "Results and Prospects", "Leon Trotsky", "1906", "https://www.marxists.org/archive/trotsky/1931/tpr/rp08.htm", "direct State support of the European proletariat"),
    mia("src_mia_kautsky_barbarism", "The Class Struggle (Erfurt Program), ch. IV", "Karl Kautsky", "1892 [trans. William E. Bohn, 1910]", "https://www.marxists.org/archive/kautsky/1892/erfurt/ch04.htm", "fall back into barbarism"),
    {
      id: "src_hobson_imperialism",
      title: "Imperialism: A Study",
      author: "J. A. Hobson",
      publicationDate: "1902",
      publisher: "James Nisbet & Co.",
      place: "London",
      sourceType: "PRIMARY",
      check: { kind: "book", title: "Imperialism", author: "Hobson" },
    },
    {
      id: "src_wade_revolution",
      title: "The Russian Revolution, 1917",
      author: "Rex A. Wade",
      publicationDate: "2000 [3rd edn 2017]",
      publisher: "Cambridge University Press",
      place: "Cambridge",
      sourceType: "HISTORICAL",
      check: { kind: "book", title: "The Russian Revolution, 1917", author: "Wade" },
    },
    {
      id: "src_gietinger_murder",
      title: "The Murder of Rosa Luxemburg",
      author: "Klaus Gietinger; trans. Loren Balhorn",
      publicationDate: "2019 [German original 1993]",
      publisher: "Verso",
      place: "London",
      sourceType: "HISTORICAL",
      check: { kind: "book", title: "Murder of Rosa Luxemburg", author: "Gietinger" },
    },
  ],
  entities: [
    /* ——— Concept ——— */
    {
      key: "concept:imperialism",
      title: "Imperialism",
      fields: {
        aliases: "Imperialist\nMonopoly capitalism\nFinance capital\nUltra-imperialism",
        summary:
          "The expansion of powerful states over other peoples and territories. Marxists after 1900 explained the new imperialism of the great powers by changes in capitalism itself — monopoly, finance capital and the export of capital — and drew opposite political conclusions from it.",
        yearStart: 1902,
        brief: `Between 1880 and 1914 a handful of European powers, joined by the United States and Japan, divided most of Africa and much of Asia among themselves. Marxists asked why. Their answer — that capitalism had entered a new stage of giant firms, banks and capital exports that pushed states to compete for territory — became one of the most influential ideas of the twentieth century, and an explanation of the First World War.`,
        standard: `Marx wrote about colonialism and the world market but not about "imperialism" in the later sense. The theory took shape in 1902–17:[cite:src_bottomore_dictionary][cite:src_hobsbawm_empire]

- **J. A. Hobson** (1902), a British liberal, traced imperialism to under-consumption at home and the search for investment outlets abroad.[cite:src_hobson_imperialism]
- **Rudolf Hilferding** (*Finance Capital*, 1910) described the fusion of bank and industrial capital in cartels protected by tariffs ([[concept:capital]]).[cite:src_kolakowski]
- **Rosa Luxemburg** (*The Accumulation of Capital*, 1913) argued that capitalism needs non-capitalist markets to realise surplus value ([[text:accumulation-of-capital]]; [[thinker:luxemburg]]).[cite:src_nettl_luxemburg]
- **Karl Kautsky** (1914) suggested that the great powers might form a cartel — "ultra-imperialism" — and exploit the world jointly instead of fighting ([[thinker:kautsky]]).[cite:src_mia_kautsky_ultra]
- **Lenin** (1916) answered that imperialism was capitalism's "monopoly stage", in which uneven development made war inevitable ([[text:imperialism-highest-stage]]; [[thinker:lenin]]).[cite:src_mia_imperialism, ch. 7]`,
        deep: `### Lenin's five features

Lenin's definition combined: the concentration of production into monopolies; the merging of bank and industrial capital into finance capital; the export of capital; international cartels dividing the world market; and the completed territorial division of the world among the great powers.[cite:src_mia_imperialism, ch. 7]

### Political conclusions

**Interpretation.** The theories were also arguments about August 1914. For Lenin, imperialism explained the collapse of the International: super-profits had created a "labour aristocracy" whose leaders supported their own states. Kautsky's "ultra-imperialism" implied that peace under capitalism was possible ([[event:war-credits-1914]]; [[concept:reformism]]; [[debate:socialists-and-the-war]]).[cite:src_mia_imperialism][cite:src_mia_kautsky_ultra][cite:src_haupt_war]

### Self-determination

Lenin also argued for the right of nations to self-determination, against Luxemburg, who held that in the age of imperialism national independence for small nations such as Poland was neither possible nor a socialist goal.[cite:src_nettl_luxemburg][cite:src_harding_lenin]`,
        history: `The word spread in British politics in the 1870s–90s; the Marxist theories date from 1910–17, and after 1917 Lenin's became communist orthodoxy and a resource for anti-colonial movements ([[tendency:anti-colonial-thought]]; [[concept:decolonisation]]).[cite:src_hobsbawm_empire][cite:src_bottomore_dictionary]`,
        interpretations: `- **Under-consumption** (Hobson, Luxemburg): capitalism needs outside markets.
- **Finance capital** (Hilferding, Lenin, Bukharin): monopoly and capital export drive rivalry.
- **Ultra-imperialism** (Kautsky): capitalist states might cooperate.
- **Later**: dependency and world-systems theories extended the argument to relations between rich and poor countries, beyond this corpus.[cite:src_bottomore_dictionary][cite:src_kolakowski]`,
        criticisms: `Historians have questioned the economic explanation: much capital exported before 1914 went to other industrial countries and settler colonies rather than to new colonies, many colonies were unprofitable, and strategic, nationalist and missionary motives mattered as much as finance. Defenders reply that the theory concerns the system of great-power rivalry, not the balance sheet of each colony.[cite:src_hobsbawm_empire][cite:src_kolakowski]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample concept; links to anti-colonial thought and decolonisation are kept." },
        { type: "missing-source", field: "standard", note: "Hilferding's Finance Capital has no source record (the Open Library lookup failed); it is cited via Kołakowski. Add a record for the Bottomore edition (1981)." },
      ],
    },

    /* ——— Texts ——— */
    {
      key: "text:imperialism-highest-stage",
      title: "Imperialism, the Highest Stage of Capitalism",
      fields: {
        subtitle: "A Popular Outline",
        originalTitle: "Империализм, как высшая стадия капитализма",
        language: "Russian",
        form: "pamphlet",
        yearStart: 1916,
        publicationNote: "Written in Zurich, January–June 1916; published in Petrograd in mid-1917. Prefaces of 1917 and 1920.",
        edition: "Lenin, Collected Works vol. 22",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/lenin/works/1916/imp-hsc/",
        aliases: "Imperialism\nImperialism, the Latest Stage of Capitalism",
        summary:
          "Lenin's short account of imperialism as the monopoly stage of capitalism, written in wartime exile: an explanation of the world war and of the collapse of the Second International.",
        body: `## Purpose

**Text.** Lenin explained in his 1917 preface that the pamphlet "was written with an eye to the tsarist censorship", which confined it to economic analysis.[cite:src_mia_imperialism, preface] Drawing on Hobson and Hilferding, he set out to show that the war was imperialist on both sides ([[event:war-credits-1914]]).[cite:src_harding_lenin]

## Main argument

- **Monopoly.** Free competition has given way to cartels and trusts.
- **Finance capital.** Banks have merged with industry under a financial oligarchy.
- **Capital export** has become more important than the export of goods.
- **Division of the world** among cartels and great powers is complete, so further expansion means redivision — war.
- **Parasitism and decay.** Super-profits allow the bribing of a "labour aristocracy", the social basis of opportunism ([[concept:reformism]]).
- **Text.** "If it were necessary to give the briefest possible definition of imperialism we should have to say that imperialism is the monopoly stage of capitalism."[cite:src_mia_imperialism, ch. 7]

## Later influence

After 1917 the pamphlet became a canonical text of communist parties and a key influence on anti-colonial movements ([[concept:imperialism]]; [[tendency:leninism]]).[cite:src_bottomore_dictionary]

## Interpretations

Critics note its reliance on Hobson and Hilferding and its weak empirical link between capital exports and colonies; defenders treat it as a political intervention rather than an economic treatise. Its polemic against Kautsky's ultra-imperialism remains debated ([[thinker:kautsky]]).[cite:src_kolakowski][cite:src_harding_lenin]`,
        context: `Written in Swiss exile during the war, when Lenin was building the "Zimmerwald Left" against the majority socialists ([[event:zimmerwald-conference]]).[cite:src_service_lenin]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample text record." }],
    },
    {
      key: "text:the-state-and-revolution",
      title: "The State and Revolution",
      fields: {
        subtitle: "The Marxist Theory of the State and the Tasks of the Proletariat in the Revolution",
        originalTitle: "Государство и революция",
        language: "Russian",
        form: "pamphlet",
        yearStart: 1917,
        publicationNote: "Written August–September 1917 while Lenin was in hiding; published in 1918. A planned final chapter on 1905 and 1917 was never written.",
        edition: "Lenin, Collected Works vol. 25",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/lenin/works/1917/staterev/",
        aliases: "State and Revolution\nGosudarstvo i revolyutsiya",
        summary:
          "Lenin's reconstruction of Marx and Engels's theory of the state, written on the eve of October: the bourgeois state must be smashed and replaced by a Commune-type state of armed workers that would begin at once to wither away.",
        body: `## Purpose

Lenin wrote against both the "opportunists" of the Second International and the anarchists, claiming to restore Marx's teaching on the state from Kautsky's "distortions" ([[thinker:kautsky]]; [[concept:the-state]]).[cite:src_state_revolution][cite:src_harding_lenin]

## Main argument

- **Origins.** **Text.** "The state is a product and a manifestation of the irreconcilability of class antagonisms."[cite:src_state_revolution, ch. 1]
- **Smash, do not capture.** Drawing on *The Civil War in France* and Marx's letter to Kugelmann, the existing bureaucratic-military machine must be broken ([[text:civil-war-in-france]]; [[event:paris-commune]]).
- **The Commune model.** Election and recall of officials, workers' wages for officials, the armed people instead of a standing army.
- **Withering away.** Citing Engels's view that the Commune "was no longer a state in the proper sense of the word", Lenin argued that the proletarian state begins to wither as soon as it is established. Socialism (the first phase) and communism (the higher phase) are distinguished, drawing on the Gotha critique ([[text:critique-of-the-gotha-programme]]; [[concept:communism]]).[cite:src_state_revolution, ch. 5]

**Text.** The postscript ends: "It is more pleasant and useful to go through the "experience of revolution" than to write about it."[cite:src_state_revolution, postscript]

## Later influence

**Disputed.** The text is the most libertarian of Lenin's works, and its distance from the Soviet state that followed — one-party rule, a vast bureaucracy and the Cheka — is one of the central problems in the interpretation of Leninism. Some read it as sincere and defeated by civil war; others as a programme that its own vanguard politics made impossible ([[tendency:leninism]]; [[debate:what-is-the-state]]).[cite:src_harding_lenin][cite:src_service_lenin][cite:src_kolakowski]`,
        context: `Written in Razliv and Helsingfors after the July Days of 1917, when the Provisional Government ordered Lenin's arrest ([[event:february-revolution]]; [[event:october-revolution]]).[cite:src_wade_revolution]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample text record." },
      ],
    },

    /* ——— Events ——— */
    {
      key: "event:revolution-1905",
      title: "The Russian Revolution of 1905",
      fields: {
        subtitle: "From Bloody Sunday to the Moscow rising",
        yearStart: 1905,
        yearEnd: 1907,
        dateLabel: "January 1905 – June 1907",
        place: "Russian Empire",
        eventType: "revolution",
        summary:
          "A wave of strikes, peasant revolts, mutinies and national uprisings across the Russian Empire after the massacre of “Bloody Sunday”, which forced the tsar to concede a parliament and gave birth to the first soviets. It was the dress rehearsal for 1917 and the source of new Marxist theories of revolution.",
        body: `## What happened

On 9 January 1905 (old style) troops fired on a peaceful procession of workers led by the priest Georgy Gapon in St Petersburg. Amid defeat in the war with Japan, strikes spread through the empire; the battleship *Potemkin* mutinied in June; in October a general strike forced Nicholas II to issue the October Manifesto promising civil liberties and an elected Duma.[cite:src_ascher_1905][cite:src_smith_russia]

Workers in St Petersburg elected a Soviet (council) of deputies, in which Leon Trotsky played a leading role. Its leaders were arrested in December, and an armed rising in Moscow was crushed. Repression and the restriction of the franchise in June 1907 ended the revolution.[cite:src_ascher_1905]`,
        significance: `1905 transformed Marxist debate. Luxemburg drew from it the theory of the mass strike ([[text:the-mass-strike]]); Lenin argued for a "revolutionary-democratic dictatorship of the proletariat and the peasantry"; Trotsky for "permanent revolution"; Mensheviks for support of the liberal bourgeoisie ([[debate:revolution-in-russia]]). The soviets reappeared in 1917 ([[event:february-revolution]]).[cite:src_nettl_luxemburg][cite:src_mia_two_tactics][cite:src_mia_trotsky_results][cite:src_harding_lenin]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample event." }],
    },
    {
      key: "event:basel-congress",
      title: "The Basel Congress of the International",
      fields: {
        subtitle: "Extraordinary International Socialist Congress",
        yearStart: 1912,
        yearEnd: 1912,
        dateLabel: "24–25 November 1912",
        place: "Basel",
        eventType: "congress",
        summary:
          "An emergency congress of the Second International, called during the First Balkan War, that issued a solemn manifesto against war and reaffirmed that socialists should use any war crisis to hasten the downfall of capitalist rule.",
        body: `## What happened

With war in the Balkans threatening to draw in the great powers, the International held an extraordinary congress in Basel and a mass demonstration in its cathedral.[cite:src_joll_second_international]

**Text.** Its manifesto restated the Stuttgart (1907) and Copenhagen (1910) resolutions: if war broke out, socialists were "to utilize the economic and political crisis created by the war to arouse the people and thereby to hasten the downfall of capitalist class rule". It declared that "the proletarians consider it a crime to fire at each other for the profits of the capitalists".[cite:src_mia_basel]`,
        significance: `Less than two years later most member parties supported their governments' war. Lenin and the Zimmerwald Left cited the Basel manifesto as proof that the majority socialists had betrayed their own pledges ([[event:war-credits-1914]]; [[event:zimmerwald-conference]]; [[debate:socialists-and-the-war]]).[cite:src_mia_lenin_war_1914][cite:src_haupt_war]`,
      },
    },
    {
      key: "event:war-credits-1914",
      title: "The SPD votes for war credits",
      fields: {
        subtitle: "4 August 1914",
        yearStart: 1914,
        yearEnd: 1914,
        dateLabel: "4 August 1914",
        place: "Reichstag, Berlin",
        eventType: "war",
        summary:
          "On the outbreak of the First World War the Social Democratic deputies in the Reichstag voted unanimously for war credits, as most socialist parties of the belligerent countries rallied to their governments. The Second International collapsed.",
        body: `## What happened

After the declarations of war, the SPD's Reichstag group decided by a large majority to support the war credits; the minority, including Hugo Haase, accepted party discipline, and Haase read the group's declaration. In France the socialists joined the "sacred union" after the assassination of Jean Jaurès on 31 July. Karl Liebknecht cast the first public vote against further credits in December 1914.[cite:src_schorske_spd][cite:src_haupt_war]

Socialists in Russia, Serbia and some neutral countries took different positions; within the belligerent majorities, opposition grew as the war went on.[cite:src_haupt_war][cite:src_joll_second_international]`,
        significance: `For revolutionaries the vote was a betrayal of the Stuttgart and Basel resolutions and the end of the Second International; for the majority it was defence against tsarist Russia, or of the nation. The split it opened led to the Independent Social Democrats (1917) and the Communist parties (1918–19) ([[event:basel-congress]]; [[debate:socialists-and-the-war]]; [[tendency:social-democracy]]).[cite:src_schorske_spd][cite:src_haupt_war]

**Interpretation.** Historians debate whether the vote expressed long-term integration of the party into the nation, fear of repression, genuine belief in a defensive war, or all three.[cite:src_haupt_war][cite:src_schorske_spd]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample event." },
        { type: "specialist-review", field: "body", note: "The internal vote of the Reichstag group (often given as 78 to 14) is deliberately not stated; confirm and add with a citation if wanted." },
      ],
    },
    {
      key: "event:zimmerwald-conference",
      title: "The Zimmerwald Conference",
      fields: {
        subtitle: "International Socialist Conference",
        yearStart: 1915,
        yearEnd: 1915,
        dateLabel: "5–8 September 1915",
        place: "Zimmerwald, Switzerland",
        eventType: "congress",
        summary:
          "A small conference of anti-war socialists from both sides of the front, which issued a manifesto for peace without annexations. Its left wing, led by Lenin, called for a break with the old International.",
        body: `## What happened

A few dozen socialists opposed to the war — from Germany, France, Italy, Russia, Poland, the Balkans, Switzerland and elsewhere — met secretly in a Swiss village. **Text.** Their manifesto declared that "Europe is like a gigantic human slaughterhouse" and called for "a peace without annexations or war indemnities".[cite:src_mia_zimmerwald]

A minority, the "Zimmerwald Left" around Lenin, wanted to turn the war into civil war and found a new International; the majority sought peace and the revival of the old one. A second conference met at Kienthal in 1916 ([[thinker:lenin]]).[cite:src_haupt_war][cite:src_harding_lenin]`,
        significance: `Zimmerwald became the symbol of socialist internationalism against the war and a seed of the Communist International founded in 1919 ([[debate:socialists-and-the-war]]).[cite:src_haupt_war][cite:src_service_lenin]`,
      },
    },
    {
      key: "event:february-revolution",
      title: "The February Revolution",
      fields: {
        subtitle: "The fall of the Romanov monarchy",
        yearStart: 1917,
        yearEnd: 1917,
        dateLabel: "23 February – 2 March 1917 (old style); 8–15 March (new style)",
        place: "Petrograd",
        eventType: "revolution",
        summary:
          "Strikes and demonstrations in Petrograd, joined by mutinous soldiers, brought down the tsarist monarchy within a week. Power was divided between a liberal Provisional Government and the Petrograd Soviet — the “dual power” of 1917.",
        body: `## What happened

Demonstrations on International Women's Day (23 February old style), food shortages and strikes grew into a general strike in Petrograd; when the garrison refused to fire and went over to the crowds, the government collapsed. Nicholas II abdicated on 2 March.[cite:src_wade_revolution][cite:src_smith_russia]

A Provisional Government formed from Duma liberals, while workers and soldiers elected the Petrograd Soviet, dominated at first by Mensheviks and Socialist Revolutionaries. Most socialists treated the revolution as bourgeois-democratic and gave the government conditional support ([[debate:revolution-in-russia]]).[cite:src_wade_revolution]

**Text.** Returning from exile in April, Lenin called for "not a parliamentary republic … but a republic of Soviets of Workers', Agricultural Labourers' and Peasants' Deputies throughout the country, from top to bottom" ([[thinker:lenin]]).[cite:src_mia_april_theses]`,
        significance: `February ended three centuries of Romanov rule and opened eight months of political freedom, social upheaval and dual power that ended in October ([[event:october-revolution]]). Its outcome tested every Marxist theory of the Russian revolution.[cite:src_wade_revolution][cite:src_fitzpatrick_revolution]`,
      },
    },
    {
      key: "event:october-revolution",
      title: "The October Revolution",
      fields: {
        subtitle: "The Bolshevik seizure of power",
        yearStart: 1917,
        yearEnd: 1918,
        dateLabel: "24–25 October 1917 (old style); 6–7 November (new style)",
        place: "Petrograd",
        eventType: "revolution",
        summary:
          "The Bolsheviks, through the Military Revolutionary Committee of the Petrograd Soviet, overthrew the Provisional Government and handed power to the Congress of Soviets. A Soviet government under Lenin followed; whether October was a popular revolution or a party coup remains contested.",
        body: `## What happened

After the failure of the Provisional Government's summer offensive and of General Kornilov's attempted coup, the Bolsheviks won majorities in the Petrograd and Moscow soviets. On 24–25 October the Military Revolutionary Committee, led by Trotsky among others, occupied key points in Petrograd and arrested the government in the Winter Palace.[cite:src_wade_revolution][cite:src_smith_russia]

The Second Congress of Soviets, after Mensheviks and right Socialist Revolutionaries walked out, approved a Soviet government (Sovnarkom) chaired by Lenin and decrees on peace and land. A political police, the Cheka, was created in December. The Constituent Assembly, in which the Socialist Revolutionaries had won the most seats, was dispersed in January 1918. Civil war followed.[cite:src_smith_russia][cite:src_fitzpatrick_revolution]`,
        significance: `October created the first state ruled by a Marxist party and split world socialism into communist and social-democratic camps ([[tendency:leninism]]; [[tendency:social-democracy]]).[cite:src_smith_russia]

**Disputed.** Historians disagree whether October was a popular revolution carried by workers', soldiers' and peasants' radicalism or a minority coup; and whether the authoritarianism that followed was rooted in Bolshevik doctrine or forced by civil war and isolation. Among Marxists, Kautsky condemned it as premature and dictatorial, while Luxemburg supported it but warned against the suppression of democracy ([[thinker:kautsky]]; [[thinker:luxemburg]]; [[concept:dictatorship-of-the-proletariat]]).[cite:src_fitzpatrick_revolution][cite:src_smith_russia][cite:src_mia_kautsky_dictatorship][cite:src_mia_luxemburg_russian_rev]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample event." },
        { type: "disputed", field: "significance", note: "The character of October (revolution or coup) is presented as an open historiographical question." },
      ],
    },
    {
      key: "event:spartacist-uprising",
      title: "The Spartacist uprising",
      fields: {
        subtitle: "Berlin, January 1919; Luxemburg and Liebknecht murdered",
        yearStart: 1919,
        yearEnd: 1919,
        dateLabel: "5–15 January 1919",
        place: "Berlin",
        eventType: "uprising",
        summary:
          "An armed rising in Berlin against the Social Democratic government, two months into the German Revolution, crushed by government troops and Freikorps. Rosa Luxemburg and Karl Liebknecht were murdered on 15 January.",
        body: `## What happened

The German Revolution of November 1918 overthrew the monarchy; a provisional government led by the Social Democrats Friedrich Ebert and Philipp Scheidemann took power, while workers' and soldiers' councils spread. The Spartacus League and others founded the Communist Party of Germany (KPD) at the turn of the year ([[thinker:luxemburg]]).[cite:src_nettl_luxemburg]

When the government dismissed Berlin's left-wing police chief, mass demonstrations turned into an armed occupation of newspaper offices and a call to overthrow the government by a revolutionary committee including Karl Liebknecht. Luxemburg doubted the rising's prospects but defended it publicly. Government troops and Freikorps units under the Social Democrat Gustav Noske crushed it.[cite:src_nettl_luxemburg][cite:src_gietinger_murder]

On 15 January Luxemburg and Liebknecht were captured and murdered by officers of the Guards Cavalry Rifle Division; Luxemburg's body was thrown into the Landwehr Canal.[cite:src_gietinger_murder]`,
        significance: `The murders left a lasting enmity between German communists and social democrats, and made Luxemburg a martyr claimed by many later currents ([[event:october-revolution]]; [[tendency:social-democracy]]).[cite:src_nettl_luxemburg][cite:src_gietinger_murder]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample event." },
        { type: "specialist-review", field: "body", note: "Check the extent of Luxemburg's support for the rising and the attribution of responsibility for the murders against Gietinger." },
      ],
    },

    /* ——— Debates ——— */
    {
      key: "debate:what-is-the-state",
      title: "What is the state?",
      fields: {
        summary:
          "Is the state an instrument of class rule, a source of domination in its own right, or something more complex? Should socialists capture it, smash it, or abolish it? The question divided Marxists from anarchists in the 1870s and Marxists among themselves in 1917.",
        intro:
          "Different traditions answer this question differently. Their answers determine whether socialists try to win elections, build parallel institutions, seize power, or refuse the state altogether.",
        body: `## Background

Marx and Engels left no systematic theory of the state, but a series of positions: the *Manifesto*'s "committee for managing the common affairs of the whole bourgeoisie", the analysis of Bonapartism, the lessons of the Paris Commune and Engels's "withering away" ([[concept:the-state]]; [[text:civil-war-in-france]]; [[event:paris-commune]]).[cite:src_manifesto_moore][cite:src_mia_civil_war][cite:src_mia_soc_utopian]

Bakunin's challenge in the First International — that any "workers' state" would become a new tyranny — was answered by Marx in private notes ([[thinker:bakunin]]).[cite:src_mia_bakunin_conspectus] In 1917–18 the dispute moved inside Marxism: Lenin's *The State and Revolution* against Kautsky's defence of democratic institutions, with Luxemburg criticising both reformism and Bolshevik centralism ([[text:the-state-and-revolution]]; [[concept:dictatorship-of-the-proletariat]]).[cite:src_state_revolution][cite:src_mia_kautsky_dictatorship][cite:src_mia_luxemburg_russian_rev]`,
        context: `The question arose in practice with the Paris Commune of 1871 and again with the soviets of 1905 and 1917 ([[event:revolution-1905]]; [[event:october-revolution]]).[cite:src_tombs_commune][cite:src_smith_russia]`,
      },
      flags: [
        { type: "sample-overlap", note: "The seeded debate structure (positions from Marx & Engels to Althusser) is kept unchanged; only the summary, background and context are revised." },
        { type: "specialist-review", note: "Consider adding a Kautsky position (democratic republic; dictatorship as a 'condition') to the structure; the corpus left the seeded positions untouched." },
      ],
    },
    {
      key: "debate:revolution-in-russia",
      title: "Could Russia make a socialist revolution?",
      fields: {
        summary:
          "Marx's theory seemed to say that socialism needs developed capitalism. Russia was a peasant empire under an autocrat. From the 1870s to 1917 Russian socialists, and Marx himself, argued about what kind of revolution Russia could have.",
        intro:
          "Should Russia follow Western Europe through capitalism to socialism, build on its peasant commune, or leap ahead with the help of revolution in the West? The answers divided populists from Marxists and Marxists among themselves — and were tested in 1917.",
        body: `## Background

Russian populists hoped that the peasant commune (*obshchina*) could allow Russia to bypass capitalism. **Text.** Marx refused to turn his account of Western Europe into a "historico-philosophic theory" binding on every people, and in 1882 he and Engels allowed that, if a Russian revolution became "the signal for a proletarian revolution in the West", the commune "may serve as the starting point for a communist development".[cite:src_mia_letter_1877][cite:src_mia_manifesto_1882][cite:src_shanin_late_marx]

Plekhanov and the Emancipation of Labour Group argued that capitalism was already dissolving the commune, and that Russia faced a bourgeois revolution first ([[thinker:plekhanov]]; [[event:emancipation-of-labour-group]]). After 1905 Mensheviks, Lenin and Trotsky disagreed over who would lead that revolution and how far it could go ([[event:revolution-1905]]).[cite:src_baron_plekhanov][cite:src_mia_two_tactics][cite:src_mia_trotsky_results]

In April 1917 Lenin called for a soviet republic and steps towards socialism; in October the Bolsheviks took power expecting revolution in Europe ([[event:february-revolution]]; [[event:october-revolution]]).[cite:src_mia_april_theses][cite:src_smith_russia]`,
        context: `In 1900 the Russian Empire had a fast-growing industry concentrated in a few cities, but some four-fifths of its people were peasants, and political parties were illegal until 1905.[cite:src_smith_russia][cite:src_walicki]`,
      },
    },
    {
      key: "debate:socialists-and-the-war",
      title: "What should socialists do when war comes?",
      fields: {
        summary:
          "The Second International pledged to oppose war. In August 1914 most of its parties supported their governments. Socialists then divided over national defence, peace and revolution.",
        intro:
          "The International's resolutions had promised that workers would not fire on each other for their rulers. When war came, socialists had to decide what that promise meant — and the answers split the movement permanently.",
        body: `## Background

The Stuttgart (1907) and Basel (1912) resolutions obliged socialists to try to prevent war and, if it came, to use the crisis to hasten the end of capitalist rule ([[event:basel-congress]]).[cite:src_mia_basel] In August 1914 the German, French, Austrian and British majorities supported national defence ([[event:war-credits-1914]]).[cite:src_haupt_war]

Opponents ranged from pacifist socialists seeking a negotiated peace to Luxemburg's *Junius Pamphlet* and Lenin's call to turn the imperialist war into civil war ([[event:zimmerwald-conference]]; [[thinker:luxemburg]]; [[thinker:lenin]]).[cite:src_mia_junius][cite:src_mia_lenin_war_1914]`,
        context: `The war killed millions, brought revolution in Russia, Germany, Austria-Hungary and elsewhere, and divided the socialist movement into social-democratic and communist Internationals ([[event:october-revolution]]; [[event:spartacist-uprising]]).[cite:src_hobsbawm_empire][cite:src_haupt_war]`,
      },
    },

    /* ——— Path ——— */
    {
      key: "path:first-steps-into-marxism",
      title: "First Steps into Marx",
      fields: {
        entryLine: "I've never read Marx.",
        level: "introductory",
        estimatedTime: "About 8–10 hours across sessions; side routes extra",
        summary:
          "A route through Marx's main ideas in an order that builds — from his life and philosophy, through history and class, to the critique of political economy and the political disputes it led to — with side routes for philosophy, political economy and revolutionary politics.",
        prerequisites: `None. Each step has a short "30 seconds" explanation; read that first and go deeper only if you want to. Side routes are optional: take the **philosophy** route if you want to know where Marx came from, the **political economy** route if you want the argument of *Capital*, and the **revolutionary politics** route if you want to know what his followers did with it.

Where scholars disagree, entries say so. Nothing here asks you to agree with Marx — only to understand him.`,
      },
      citations: [
        { source: "src_sep_marx", note: "General introduction recommended as companion reading for the route." },
        { source: "src_mclellan_marx", note: "Biography recommended as companion reading for the route." },
      ],
      flags: [{ type: "sample-overlap", note: "Replaces the seeded ten-step path (“First steps into Marxism”); the slug is kept so existing links continue to work." }],
    },
  ],

  debates: [
    {
      debate: "debate:revolution-in-russia",
      propositions: [
        { key: "commune", statement: "The peasant commune could become a starting point for socialism." },
        { key: "capitalism", statement: "Russia must pass through a full capitalist stage before socialism." },
        { key: "bourgeois", statement: "The coming revolution is bourgeois-democratic in its tasks." },
        { key: "workers", statement: "The working class, not the liberal bourgeoisie, must lead the revolution." },
        { key: "west", statement: "A socialist Russia can survive only with revolution in the West." },
      ],
      positions: [
        {
          key: "populists",
          label: "The populists (Narodniks)",
          centralClaim: "Russia can avoid the miseries of capitalism by building socialism on the peasant commune.",
          summary: "A broad revolutionary tradition from the 1860s to the Socialist Revolutionaries, which saw the peasantry rather than industrial workers as the main revolutionary force.",
          criticisms: ["Marxists: the commune was already dissolving under capitalism."],
          stances: {
            commune: ["affirms", "The commune as the germ of Russian socialism."],
            capitalism: ["rejects", "Capitalism is avoidable in Russia."],
            bourgeois: ["rejects", "A social revolution, not a bourgeois one."],
            workers: ["rejects", "The peasantry is the decisive force."],
            west: ["silent", "Not central to their argument."],
          },
        },
        {
          key: "marx",
          label: "Marx (1877–82)",
          holder: "thinker:marx",
          centralClaim: "The historical sketch in Capital is not a universal path; with revolution in the West, the Russian commune might be a starting point for communism.",
          summary: "In his 1877 letter, the 1881 drafts to Vera Zasulich and the 1882 preface, Marx kept open a non-capitalist route for Russia, conditional on European revolution.",
          links: ["text:communist-manifesto"],
          stances: {
            commune: ["qualified", "Possible, if a Western revolution comes to its aid."],
            capitalism: ["rejects", "Refused to make the Western path binding on every people."],
            bourgeois: ["silent", "Did not address the class character of a coming Russian revolution in these terms."],
            workers: ["silent", "Not addressed for Russia."],
            west: ["affirms", "The two revolutions must complement each other."],
          },
        },
        {
          key: "plekhanov",
          label: "Plekhanov and the Mensheviks",
          holder: "thinker:plekhanov",
          centralClaim: "Russia must first have a bourgeois-democratic revolution; workers should organise independently and press it forward, not seize power.",
          summary: "The founding position of Russian Marxism, kept by the Mensheviks in 1905 and 1917.",
          links: ["event:emancipation-of-labour-group"],
          criticisms: ["Lenin and Trotsky: the Russian bourgeoisie was too weak and timid to lead its own revolution."],
          stances: {
            commune: ["rejects", "Capitalism is already dissolving it."],
            capitalism: ["affirms", "Socialism needs developed capitalism."],
            bourgeois: ["affirms", "A bourgeois revolution comes first."],
            workers: ["qualified", "Workers should push the revolution forward from below, without taking power."],
            west: ["qualified", "Russian socialism depends on general European development."],
          },
        },
        {
          key: "lenin",
          label: "Lenin (1905 and 1917)",
          holder: "thinker:lenin",
          centralClaim: "The workers, allied with the peasantry, must lead the democratic revolution (1905); in 1917, power should pass to the soviets and take the first steps towards socialism.",
          summary: "In 1905 Lenin called for a 'revolutionary-democratic dictatorship of the proletariat and the peasantry'; the April Theses of 1917 moved towards Trotsky's position.",
          links: ["text:the-state-and-revolution"],
          stances: {
            commune: ["rejects", "Capitalism had already developed in Russia (1899)."],
            capitalism: ["qualified", "No immediate 'introduction' of socialism in 1917, but steps towards it under soviet power."],
            bourgeois: ["qualified", "Affirmed in 1905; superseded in practice in 1917."],
            workers: ["affirms", "The proletariat, allied with the peasantry, must lead."],
            west: ["affirms", "Expected and depended on European revolution."],
          },
        },
        {
          key: "trotsky",
          label: "Trotsky (permanent revolution, 1906)",
          centralClaim: "In Russia the democratic revolution can only be carried through by a workers' government, which will be driven to socialist measures and can survive only with European revolution.",
          summary: "Developed from the experience of 1905 in Results and Prospects; Trotsky is not yet an entry in this corpus.",
          criticisms: ["Mensheviks: adventurist; Lenin before 1917: underrated the peasantry."],
          stances: {
            commune: ["rejects", "The peasantry cannot play an independent role."],
            capitalism: ["rejects", "Uneven development allows Russia to skip stages."],
            bourgeois: ["qualified", "Bourgeois-democratic tasks, carried out by workers' power."],
            workers: ["affirms", "Only a workers' government can complete the revolution."],
            west: ["affirms", "Without European revolution the Russian workers cannot stay in power."],
          },
        },
      ],
      arguments: [
        { key: "a1", position: "plekhanov", kind: "argument", body: "Socialism presupposes a developed working class and productive forces. Trying to seize power in a backward peasant country would leave a socialist party ruling a society it cannot transform." },
        { key: "c1", position: "trotsky", kind: "counterargument", respondsTo: "a1", body: "The Russian bourgeoisie is too weak and too frightened of the workers to lead its own revolution; once workers take power to complete it, they cannot stop at bourgeois limits." },
        { key: "c2", position: "marx", kind: "counterargument", respondsTo: "a1", body: "There is no single historical path: Russia's future depends on its circumstances and on whether revolution in the West comes to its aid." },
        { key: "a2", kind: "argument", body: "Critics after 1917 argued that the outcome — isolation, civil war and dictatorship — confirmed the Menshevik warning; defenders replied that the failure of the European revolution, not the decision to take power, was decisive." },
      ],
    },
    {
      debate: "debate:socialists-and-the-war",
      propositions: [
        { key: "defence", statement: "Socialists should support national defence when their country is attacked." },
        { key: "imperialist", statement: "The war is an imperialist war on all sides." },
        { key: "credits", statement: "Socialist deputies should vote for war credits." },
        { key: "civil", statement: "The war should be turned into revolution." },
        { key: "international", statement: "A new International should replace the Second." },
      ],
      positions: [
        {
          key: "spd-majority",
          label: "The SPD majority (August 1914)",
          centralClaim: "In the hour of danger socialists cannot leave their country defenceless — above all against tsarist Russia.",
          summary: "The position of the German party leadership and Reichstag group, mirrored by the French 'sacred union' and other majority parties.",
          criticisms: ["Revolutionaries: a betrayal of the Basel pledges.", "Later: it bound social democracy to the war state."],
          links: ["event:war-credits-1914"],
          stances: {
            defence: ["affirms", "Defence of the country against attack."],
            imperialist: ["rejects", "Presented the war as defensive."],
            credits: ["affirms", "Voted for credits on 4 August 1914."],
            civil: ["rejects", "Civil peace (Burgfrieden) for the duration."],
            international: ["rejects", "Expected the International to revive after the war."],
          },
        },
        {
          key: "kautsky",
          label: "Kautsky (the 'centre')",
          holder: "thinker:kautsky",
          centralClaim: "The International is an instrument of peace, not of war; socialists should work for a peace without annexations and restore the International afterwards.",
          summary: "Kautsky avoided an open break in 1914, argued for a negotiated peace, and in 1917 joined the anti-war Independent Social Democrats.",
          criticisms: ["Lenin: 'centrism' that covered the majority's betrayal."],
          stances: {
            defence: ["qualified", "Accepted defence in principle, but opposed annexations."],
            imperialist: ["qualified", "Saw imperialism behind the war, but thought 'ultra-imperialist' peace possible."],
            credits: ["qualified", "Did not lead opposition in 1914; later opposed further credits."],
            civil: ["rejects", "Against turning the war into civil war."],
            international: ["rejects", "Hoped to rebuild the Second International."],
          },
        },
        {
          key: "plekhanov",
          label: "Plekhanov (defencism)",
          holder: "thinker:plekhanov",
          centralClaim: "German imperialism is the aggressor; socialists in the Allied countries should support the defence of their nations.",
          summary: "Plekhanov, like many French and British socialists, backed the Allied war effort.",
          stances: {
            defence: ["affirms", "Defence against German aggression."],
            imperialist: ["rejects", "Distinguished aggressor from victims."],
            credits: ["affirms", "Supported the Russian and Allied war effort."],
            civil: ["rejects", "Revolution during the war would aid Germany."],
            international: ["rejects", "No new International."],
          },
        },
        {
          key: "luxemburg",
          label: "Luxemburg (Junius, 1915)",
          holder: "thinker:luxemburg",
          centralClaim: "The war is imperialist on all sides; the collapse of social democracy in August 1914 must be overcome by international mass action for peace and socialism.",
          summary: "Written in prison, the Junius Pamphlet indicted the SPD and posed the alternative 'socialism or barbarism'.",
          links: ["event:war-credits-1914"],
          stances: {
            defence: ["rejects", "In the age of imperialism 'national defence' served imperialist aims."],
            imperialist: ["affirms", "An imperialist war on every side."],
            credits: ["rejects", "The vote was the 'crisis of social democracy'."],
            civil: ["qualified", "Called for mass action against the war rather than Lenin's slogan."],
            international: ["qualified", "Called for a renewed International grounded in mass action."],
          },
        },
        {
          key: "lenin",
          label: "Lenin (1914–17)",
          holder: "thinker:lenin",
          centralClaim: "The war is imperialist; socialists should work for the defeat of their own government and turn the imperialist war into civil war; the Second International is dead.",
          summary: "The position of the Zimmerwald Left, which led to the founding of the Communist International in 1919.",
          links: ["event:zimmerwald-conference", "text:imperialism-highest-stage"],
          stances: {
            defence: ["rejects", "'Defence of the fatherland' is a cover for imperialism."],
            imperialist: ["affirms", "Imperialist on both sides."],
            credits: ["rejects", "A betrayal of the Basel manifesto."],
            civil: ["affirms", "'The conversion of the present imperialist war into a civil war.'"],
            international: ["affirms", "A Third International."],
          },
        },
      ],
      arguments: [
        { key: "a1", position: "spd-majority", kind: "argument", body: "Workers have a stake in their nation's survival; a defeat by tsarist Russia would destroy the gains of German labour, including the party itself." },
        { key: "c1", position: "luxemburg", kind: "counterargument", respondsTo: "a1", body: "Every government claimed to be defending itself; by accepting that claim, the socialist parties delivered their workers to an imperialist slaughter and broke the International's own pledges." },
        { key: "a2", position: "lenin", kind: "argument", body: "Only revolution can end imperialist war for good; the war's crisis is the opportunity the Basel manifesto itself pointed to." },
        { key: "c2", position: "kautsky", kind: "counterargument", respondsTo: "a2", body: "Calling for civil war in wartime isolates socialists and plays into the hands of militarists; a negotiated peace is the realistic goal." },
      ],
    },
  ],

  paths: [
    {
      path: "path:first-steps-into-marxism",
      steps: [
        {
          entity: "thinker:marx",
          framing: "Start with the person: who Marx was, what he wrote, and why his ideas are still argued over.",
          branches: [
            { entity: "thinker:engels", framing: "Marx's collaborator — and a thinker in his own right." },
            { entity: "thinker:hegel", framing: "Philosophy route — the philosopher Marx learned from and argued against." },
            { entity: "thinker:feuerbach", framing: "Philosophy route — the materialist who showed the young Marx a way out of Hegel." },
          ],
        },
        {
          entity: "concept:materialism",
          framing: "What Marx meant by materialism, and why it is not the same as caring about money.",
          branches: [
            { entity: "concept:idealism", framing: "Philosophy route — the view Marx defined himself against." },
            { entity: "concept:dialectics", framing: "Philosophy route — Hegel's method and what Marx kept of it." },
          ],
        },
        {
          entity: "concept:alienation",
          framing: "The young Marx's account of what capitalism does to people's relation to their work and to each other.",
          branches: [
            { entity: "text:economic-philosophic-manuscripts", framing: "Philosophy route — the 1844 notebooks where the idea is worked out." },
            { entity: "text:theses-on-feuerbach", framing: "Philosophy route — eleven short theses, ending with the most famous sentence Marx wrote." },
          ],
        },
        {
          entity: "text:communist-manifesto",
          framing: "The short pamphlet most people read first — and what was new about it in 1848.",
          branches: [
            { entity: "event:revolutions-of-1848", framing: "Revolutionary politics route — the revolutions it appeared into." },
            { entity: "tendency:early-socialism", framing: "The socialists Marx criticised as 'utopian'." },
          ],
        },
        {
          entity: "concept:relations-of-production",
          framing: "The social side of production: who owns, who works, who decides.",
          branches: [
            { entity: "concept:productive-forces", framing: "The technical side: tools, skills and knowledge." },
            { entity: "concept:mode-of-production", framing: "How forces and relations combine into a whole way of producing." },
          ],
        },
        {
          entity: "concept:historical-materialism",
          framing: "Marx's way of reading history as a whole — and the questions it leaves open.",
          branches: [
            { entity: "text:contribution-critique-political-economy", framing: "The 1859 Preface, the classic statement in a few pages." },
            { entity: "debate:what-is-historical-materialism", framing: "How Marxists have disagreed about what the theory claims." },
          ],
        },
        {
          entity: "concept:class",
          framing: "Classes defined by their place in production, not by income or lifestyle.",
          branches: [
            { entity: "concept:bourgeoisie", framing: "The class that owns." },
            { entity: "concept:proletariat", framing: "The class that must sell its labour-power to live." },
          ],
        },
        {
          entity: "concept:class-struggle",
          framing: "Conflict between classes as a motor of history.",
          branches: [{ entity: "concept:revolution", framing: "Revolutionary politics route — what Marx meant by a social revolution." }],
        },
        {
          entity: "concept:commodity",
          framing: "Capital begins with the commodity. Here is why.",
          branches: [
            { entity: "concept:use-value", framing: "Political economy route — usefulness." },
            { entity: "concept:exchange-value", framing: "Political economy route — exchangeability." },
            { entity: "concept:labour", framing: "Political economy route — concrete and abstract labour." },
          ],
        },
        {
          entity: "concept:value",
          framing: "What makes things exchangeable in definite proportions — Marx's theory of value.",
          branches: [
            { entity: "concept:commodity-fetishism", framing: "Political economy route — why relations between people look like relations between things." },
            { entity: "concept:labour-power", framing: "Political economy route — the commodity workers sell." },
          ],
        },
        {
          entity: "concept:surplus-value",
          framing: "The central idea of Capital: where profit comes from.",
          branches: [
            { entity: "concept:exploitation", framing: "Why Marx called the wage relation exploitative even when wages are fair." },
            { entity: "concept:capital", framing: "Political economy route — capital as self-expanding value." },
            { entity: "concept:accumulation", framing: "Political economy route — growth, crisis and the reserve army of labour." },
          ],
        },
        {
          entity: "text:capital-volume-one",
          framing: "The book itself: what it covers and how to approach it.",
          branches: [
            { entity: "thinker:adam-smith", framing: "Political economy route — the economist Marx read most closely." },
            { entity: "text:grundrisse", framing: "Political economy route — the rough draft that changed how Capital is read." },
          ],
        },
        {
          entity: "concept:the-state",
          framing: "What the state is, and what socialists should do with it.",
          branches: [
            { entity: "event:paris-commune", framing: "Revolutionary politics route — the 1871 experiment Marx took as a model." },
            { entity: "text:civil-war-in-france", framing: "Revolutionary politics route — Marx's account of the Commune." },
          ],
        },
        {
          entity: "concept:communism",
          framing: "What Marx meant by communism — and how little he said about it.",
          branches: [
            { entity: "text:critique-of-the-gotha-programme", framing: "The fullest sketch Marx gave of a post-capitalist society." },
            { entity: "concept:dictatorship-of-the-proletariat", framing: "Revolutionary politics route — the most contested phrase in the tradition." },
          ],
        },
        {
          entity: "debate:reform-or-revolution",
          framing: "After Marx: can socialism be reached through reform?",
          branches: [
            { entity: "thinker:bernstein", framing: "The case for revision." },
            { entity: "thinker:luxemburg", framing: "The case against — and against Lenin too." },
          ],
        },
        {
          entity: "concept:class-consciousness",
          framing: "How does a class come to act as a class?",
          branches: [
            { entity: "text:what-is-to-be-done", framing: "Revolutionary politics route — Lenin's pamphlet and its disputed meaning." },
            { entity: "concept:vanguard-party", framing: "Revolutionary politics route — the party model and its critics." },
          ],
        },
        {
          entity: "event:october-revolution",
          framing: "1917: Marxists in power — and the arguments that followed.",
          branches: [
            { entity: "debate:revolution-in-russia", framing: "Could Russia make a socialist revolution at all?" },
            { entity: "debate:socialists-and-the-war", framing: "How the war of 1914 split the movement." },
          ],
        },
      ],
    },
  ],

  relationships: [
    // Imperialism
    { from: "text:imperialism-highest-stage", type: "CITES", to: "concept:capital", note: "Builds on Hilferding's analysis of finance capital.", source: "src_mia_imperialism", basis: "interpretive", on: "text:imperialism-highest-stage" },
    { from: "thinker:kautsky", type: "DEVELOPED", to: "concept:imperialism", note: "The theory of 'ultra-imperialism' (1914).", source: "src_mia_kautsky_ultra", yearStart: 1914, on: "concept:imperialism" },
    { from: "text:imperialism-highest-stage", type: "CRITIQUED", to: "thinker:kautsky", note: "Attacks the theory of ultra-imperialism.", source: "src_mia_imperialism", on: "text:imperialism-highest-stage" },
    { from: "concept:imperialism", type: "PRESUPPOSES", to: "concept:capital", note: "Monopoly and finance capital as stages of capital accumulation.", source: "src_mia_imperialism", on: "concept:imperialism" },
    { from: "concept:imperialism", type: "RELATED_TO", to: "concept:reformism", note: "Lenin linked reformism to a 'labour aristocracy' sustained by imperial profits.", source: "src_mia_imperialism", on: "concept:imperialism" },
    { from: "text:imperialism-highest-stage", type: "RESPONDED_TO", to: "event:war-credits-1914", note: "An explanation of the war and of the International's collapse.", source: "src_harding_lenin", on: "text:imperialism-highest-stage" },

    // State and Revolution
    { from: "text:the-state-and-revolution", type: "CRITIQUED", to: "thinker:kautsky", note: "Against Kautsky's account of the state.", source: "src_state_revolution", on: "text:the-state-and-revolution" },
    { from: "text:the-state-and-revolution", type: "DISCUSSES", to: "concept:dictatorship-of-the-proletariat", note: "The Commune-state as the dictatorship of the proletariat.", source: "src_state_revolution", on: "text:the-state-and-revolution" },
    { from: "text:the-state-and-revolution", type: "DISCUSSES", to: "concept:communism", note: "Socialism as the first phase, communism as the higher.", source: "src_state_revolution", locator: "Ch. 5", on: "text:the-state-and-revolution" },

    // Events
    { from: "thinker:luxemburg", type: "PARTICIPATED_IN", to: "event:revolution-1905", note: "Took part in the revolution in Warsaw; imprisoned 1906.", source: "src_nettl_luxemburg", yearStart: 1905 },
    { from: "thinker:lenin", type: "PARTICIPATED_IN", to: "event:revolution-1905", note: "Returned to Russia in November 1905.", source: "src_service_lenin", yearStart: 1905 },
    { from: "event:revolution-1905", type: "INFLUENCED", to: "concept:spontaneity", note: "Mass strikes and soviets arose largely without party direction.", source: "src_mia_luxemburg_mass_strike", on: "event:revolution-1905" },
    { from: "event:second-international", type: "PRECEDES", to: "event:basel-congress", note: "The International's extraordinary congress against war.", source: "src_joll_second_international", on: "event:basel-congress" },
    { from: "event:basel-congress", type: "PRECEDES", to: "event:war-credits-1914", note: "The pledges of 1912 were broken in 1914.", source: "src_haupt_war", on: "event:basel-congress" },
    { from: "event:war-credits-1914", type: "PRECEDES", to: "event:zimmerwald-conference", note: "Anti-war socialists regrouped in 1915.", source: "src_haupt_war", on: "event:zimmerwald-conference" },
    { from: "thinker:lenin", type: "PARTICIPATED_IN", to: "event:zimmerwald-conference", note: "Led the Zimmerwald Left.", source: "src_harding_lenin", yearStart: 1915, on: "event:zimmerwald-conference" },
    { from: "thinker:kautsky", type: "ASSOCIATED_WITH", to: "event:war-credits-1914", note: "The leading theorist of the 'centre' between majority and left.", source: "src_salvadori_kautsky", on: "event:war-credits-1914" },
    { from: "thinker:plekhanov", type: "ASSOCIATED_WITH", to: "event:war-credits-1914", note: "Supported the Allied war effort ('defencism').", source: "src_baron_plekhanov", basis: "interpretive", on: "event:war-credits-1914" },
    { from: "event:revolution-1905", type: "PRECEDES", to: "event:february-revolution", note: "The soviets of 1905 reappeared in 1917.", source: "src_smith_russia", on: "event:february-revolution" },
    { from: "event:february-revolution", type: "PRECEDES", to: "event:october-revolution", note: "Eight months of 'dual power'.", source: "src_wade_revolution", weight: 3, on: "event:february-revolution" },
    { from: "thinker:lenin", type: "PARTICIPATED_IN", to: "event:october-revolution", note: "Leader of the Bolshevik party; chairman of the Soviet government.", source: "src_smith_russia", yearStart: 1917, weight: 3, on: "event:october-revolution" },
    { from: "thinker:plekhanov", type: "CRITIQUED", to: "event:october-revolution", note: "Opposed the seizure of power as premature.", source: "src_baron_plekhanov", yearStart: 1917, on: "event:october-revolution" },
    { from: "thinker:kautsky", type: "CRITIQUED", to: "event:october-revolution", note: "The Dictatorship of the Proletariat (1918).", source: "src_mia_kautsky_dictatorship", yearStart: 1918, on: "event:october-revolution" },
    { from: "text:the-russian-revolution", type: "RESPONDED_TO", to: "event:october-revolution", note: "Luxemburg's critical defence of the Bolsheviks, written in prison in 1918.", source: "src_mia_luxemburg_russian_rev", on: "event:october-revolution" },
    { from: "event:october-revolution", type: "PRECEDES", to: "event:spartacist-uprising", note: "The German revolution followed a year later.", source: "src_nettl_luxemburg", on: "event:spartacist-uprising" },
    { from: "thinker:luxemburg", type: "PARTICIPATED_IN", to: "event:spartacist-uprising", note: "Co-founder of the KPD; murdered on 15 January 1919.", source: "src_gietinger_murder", yearStart: 1919, weight: 3, on: "event:spartacist-uprising" },
    { from: "event:october-revolution", type: "INFLUENCED", to: "tendency:leninism", note: "The Bolshevik state as the model for communist parties.", source: "src_smith_russia", on: "event:october-revolution" },

    // Debates
    { from: "debate:revolution-in-russia", type: "DISCUSSES", to: "concept:revolution", note: "What kind of revolution Russia could have.", source: "src_walicki", weight: 3 },
    { from: "debate:revolution-in-russia", type: "DISCUSSES", to: "concept:mode-of-production", note: "Whether Russia had to pass through capitalism.", source: "src_mia_letter_1877" },
    { from: "debate:revolution-in-russia", type: "DISCUSSES", to: "event:october-revolution", note: "The test of the debate.", source: "src_smith_russia" },
    { from: "debate:revolution-in-russia", type: "DISCUSSES", to: "event:revolution-1905", note: "The experience that reshaped every position.", source: "src_ascher_1905" },
    { from: "debate:revolution-in-russia", type: "RELATED_TO", to: "debate:what-is-historical-materialism", note: "Whether history follows fixed stages.", source: "src_walicki" },
    { from: "debate:socialists-and-the-war", type: "DISCUSSES", to: "concept:imperialism", note: "Whether the war was imperialist on all sides.", source: "src_mia_imperialism", weight: 3 },
    { from: "debate:socialists-and-the-war", type: "DISCUSSES", to: "event:war-credits-1914", note: "The vote of 4 August 1914.", source: "src_haupt_war", weight: 3 },
    { from: "debate:socialists-and-the-war", type: "DISCUSSES", to: "event:zimmerwald-conference", note: "The anti-war socialists.", source: "src_mia_zimmerwald" },
    { from: "debate:socialists-and-the-war", type: "DISCUSSES", to: "event:basel-congress", note: "The pledges of 1912.", source: "src_mia_basel" },
    { from: "debate:socialists-and-the-war", type: "RELATED_TO", to: "debate:reform-or-revolution", note: "1914 as the test of reformism.", source: "src_schorske_spd" },
    { from: "debate:what-is-the-state", type: "DISCUSSES", to: "text:the-state-and-revolution", note: "Lenin's 1917 statement.", source: "src_state_revolution", on: "debate:what-is-the-state" },
    { from: "debate:what-is-the-state", type: "DISCUSSES", to: "concept:dictatorship-of-the-proletariat", note: "What a workers' state would be.", source: "src_draper_dictatorship", on: "debate:what-is-the-state" },
    { from: "debate:what-is-the-state", type: "DISCUSSES", to: "text:civil-war-in-france", note: "Marx's account of the Commune.", source: "src_mia_civil_war", on: "debate:what-is-the-state" },
  ],

  excerpts: [
    {
      key: "junius-barbarism",
      entity: "debate:socialists-and-the-war",
      speaker: "thinker:luxemburg",
      body: "Friedrich Engels once said: “Bourgeois society stands at the crossroads, either transition to socialism or regression into barbarism.”",
      source: "src_mia_junius",
      locator: "Ch. 1",
      note: "No such sentence has been found in Engels's writings. A close formulation appears in Kautsky's The Class Struggle (1892): “we must either move forward into socialism or fall back into barbarism.” The attribution to Engels is disputed.",
      archiveUrl: "https://www.marxists.org/archive/luxemburg/1915/junius/ch01.htm",
    },
    {
      key: "kautsky-1892-barbarism",
      entity: "thinker:kautsky",
      speaker: "thinker:kautsky",
      body: "As things stand today capitalist civilization cannot continue; we must either move forward into socialism or fall back into barbarism.",
      source: "src_mia_kautsky_barbarism",
      locator: "Ch. IV",
      note: "Often proposed as the source of the “socialism or barbarism” formula Luxemburg attributed to Engels in 1915.",
      archiveUrl: "https://www.marxists.org/archive/kautsky/1892/erfurt/ch04.htm",
    },
    {
      key: "luxemburg-freedom",
      entity: "event:october-revolution",
      speaker: "thinker:luxemburg",
      text: "text:the-russian-revolution",
      body: "Freedom only for the supporters of the government, only for the members of one party – however numerous they may be – is no freedom at all. Freedom is always and exclusively freedom for the one who thinks differently.",
      source: "src_mia_luxemburg_russian_rev",
      locator: "Ch. 6",
      note: "From Luxemburg's unfinished manuscript of 1918, published posthumously in 1922.",
      archiveUrl: "https://www.marxists.org/archive/luxemburg/1918/russian-revolution/ch06.htm",
    },
    {
      key: "lenin-imperialism-monopoly",
      entity: "concept:imperialism",
      speaker: "thinker:lenin",
      text: "text:imperialism-highest-stage",
      body: "If it were necessary to give the briefest possible definition of imperialism we should have to say that imperialism is the monopoly stage of capitalism.",
      source: "src_mia_imperialism",
      locator: "Ch. 7",
      archiveUrl: "https://www.marxists.org/archive/lenin/works/1916/imp-hsc/ch07.htm",
    },
    {
      key: "state-rev-irreconcilable",
      entity: "text:the-state-and-revolution",
      speaker: "thinker:lenin",
      text: "text:the-state-and-revolution",
      body: "The state is a product and a manifestation of the irreconcilability of class antagonisms. The state arises where, when and insofar as class antagonism objectively cannot be reconciled. And, conversely, the existence of the state proves that the class antagonisms are irreconcilable.",
      source: "src_state_revolution",
      locator: "Ch. 1, § 1",
      archiveUrl: "https://www.marxists.org/archive/lenin/works/1917/staterev/ch01.htm",
    },
    {
      key: "april-theses-soviets",
      entity: "event:february-revolution",
      speaker: "thinker:lenin",
      body: "Not a parliamentary republic—to return to a parliamentary republic from the Soviets of Workers’ Deputies would be a retrograde step—but a republic of Soviets of Workers’, Agricultural Labourers’ and Peasants’ Deputies throughout the country, from top to bottom.",
      source: "src_mia_april_theses",
      locator: "Thesis 5",
      archiveUrl: "https://www.marxists.org/archive/lenin/works/1917/apr/04.htm",
    },
    {
      key: "basel-crime",
      entity: "event:basel-congress",
      body: "The proletarians consider it a crime to fire at each other for the profits of the capitalists, the ambitions of dynasties, or the greater glory of secret diplomatic treaties.",
      source: "src_mia_basel",
      locator: "Manifesto",
      archiveUrl: "https://www.marxists.org/history/international/social-democracy/1912/basel-manifesto.htm",
    },
    {
      key: "manifesto-1882-russia",
      entity: "debate:revolution-in-russia",
      speaker: "thinker:marx",
      text: "text:communist-manifesto",
      body: "If the Russian Revolution becomes the signal for a proletarian revolution in the West, so that both complement each other, the present Russian common ownership of land may serve as the starting point for a communist development.",
      source: "src_mia_manifesto_1882",
      locator: "Preface to the Russian edition of 1882",
      note: "Signed jointly by Marx and Engels.",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1848/communist-manifesto/preface.htm",
    },
    {
      key: "trotsky-european-support",
      entity: "debate:revolution-in-russia",
      body: "Without the direct State support of the European proletariat the working class of Russia cannot remain in power and convert its temporary domination into a lasting socialistic dictatorship.",
      source: "src_mia_trotsky_results",
      locator: "Ch. VIII, “A Workers' Government”",
      note: "Leon Trotsky, Results and Prospects (1906). Trotsky is not yet an entry in the Atlas, so no speaker is linked.",
      archiveUrl: "https://www.marxists.org/archive/trotsky/1931/tpr/rp08.htm",
    },
    {
      key: "lenin-1914-civil-war",
      entity: "debate:socialists-and-the-war",
      speaker: "thinker:lenin",
      body: "The conversion of the present imperialist war into a civil war is the only correct proletarian slogan, one that follows from the experience of the Commune, and outlined in the Basle resolution (1912)",
      source: "src_mia_lenin_war_1914",
      locator: "Closing part of the manifesto",
      note: "Manifesto of the Central Committee of the RSDLP, written by Lenin (autumn 1914).",
      archiveUrl: "https://www.marxists.org/archive/lenin/works/1914/sep/28.htm",
    },
    {
      key: "zimmerwald-slaughterhouse",
      entity: "event:zimmerwald-conference",
      body: "The war has lasted more than a year. Millions of corpses cover the battlefields. Millions of human beings have been crippled for the rest of their lives. Europe is like a gigantic human slaughterhouse.",
      source: "src_mia_zimmerwald",
      locator: "Opening",
      archiveUrl: "https://www.marxists.org/history/international/social-democracy/zimmerwald/manifesto-1915.htm",
    },
  ],
};
