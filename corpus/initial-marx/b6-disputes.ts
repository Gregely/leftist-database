import type { CorpusBatch } from "../../src/lib/corpus/types";

/**
 * Batch 6 — The great disputes of 1896–1906: Bernstein's revisionism and
 * its critics; Lenin, Luxemburg and the questions of consciousness,
 * spontaneity and party organisation; the Bolshevik–Menshevik split.
 */
export const batch6: CorpusBatch = {
  id: "b6",
  title: "Revisionism, consciousness and the party, 1896–1906",
  sources: [
    {
      id: "src_mia_poverty_ch2",
      title: "The Poverty of Philosophy, chapter 2, § 5: Strikes and Combinations of Workers",
      author: "Karl Marx",
      publicationDate: "1847",
      publisher: "Marxists Internet Archive",
      url: "https://www.marxists.org/archive/marx/works/1847/poverty-philosophy/ch02e.htm",
      sourceType: "PRIMARY",
      notes: "Marxists Internet Archive transcription (marxists.org). Check wording against a printed edition before quoting.",
      check: { kind: "url", expect: "not yet for itself" },
    },
    {
      id: "src_mia_bernstein_conclusion",
      title: "Evolutionary Socialism, Conclusion: Ultimate Aim and Tendency – Kant against Cant",
      author: "Eduard Bernstein",
      publicationDate: "1899 [English translation 1909]",
      publisher: "Marxists Internet Archive",
      url: "https://www.marxists.org/reference/archive/bernstein/works/1899/evsoc/ch04-conc.htm",
      sourceType: "PRIMARY",
      notes: "Abridged English translation by Edith C. Harvey. Check against Tudor's translation (1993) before quoting.",
      check: { kind: "url", expect: "Kant against Cant" },
    },
  ],
  entities: [
    /* ——— Thinkers ——— */
    {
      key: "thinker:bernstein",
      title: "Eduard Bernstein",
      fields: {
        yearStart: 1850,
        yearEnd: 1932,
        subtitle: "1850–1932",
        roles: "German social democratic theorist, journalist and politician; founder of revisionism",
        birthPlace: "Berlin",
        deathPlace: "Berlin",
        aliases: "Eduard Bernstein\nBernstein",
        summary:
          "Engels's friend and literary executor who, in the late 1890s, argued that Marx's predictions of capitalist collapse and class polarisation had been refuted, and that socialism would come through democratic reform — launching the “revisionist” controversy.",
        body: `## Identity

The son of a Jewish railway engineer, Bernstein worked as a bank clerk and joined the Eisenach socialists in 1872. Under the Anti-Socialist Laws he edited the party paper *Der Sozialdemokrat* in exile, first in Zurich (1880–88) and then in London, where he stayed until 1901 and worked closely with Engels ([[event:anti-socialist-laws]]; [[thinker:engels]]).[cite:src_gay_bernstein][cite:src_steger_bernstein]

### Development and works

In London he came to know the Fabian socialists and British parliamentary and trade-union practice. From 1896 his series "Problems of Socialism" in *Die Neue Zeit* questioned orthodox expectations; in 1899 he set out his case in *The Preconditions of Socialism* ([[text:preconditions-of-socialism]]).[cite:src_gay_bernstein][cite:src_preconditions]

### Core questions

- **Is capitalism heading for collapse?** Bernstein argued that credit, cartels and the world market were making crises milder, not worse.
- **Is society polarising?** Small and medium enterprises, the peasantry and the middle classes were not disappearing as predicted.
- **What follows politically?** Social democracy should become openly what it already was in practice: a democratic party of social reform ([[concept:revisionism]]; [[concept:reformism]]).[cite:src_preconditions][cite:src_steger_bernstein]

**Text.** Defending his notorious sentence, he wrote: "In this sense I wrote the sentence that the movement means everything for me and that what is usually called “the final aim of socialism” is nothing; and in this sense I write it down again to-day."[cite:src_mia_bernstein_evsoc, preface]

### Disagreements

Luxemburg, Kautsky and Plekhanov answered him; the party condemned revisionism at Hanover (1899) and Dresden (1903), without expelling him ([[event:revisionism-controversy]]; [[thinker:luxemburg]]; [[thinker:kautsky]]; [[thinker:plekhanov]]). In 1915 he joined the opposition to the war and in 1917 the Independent Social Democrats, returning to the SPD in 1919.[cite:src_steger_bernstein]`,
        context: `Bernstein's revisionism reflected the conditions of the 1890s: prosperity after the long depression, rising real wages, growing unions and the electoral success of the SPD, together with the gap between the party's revolutionary programme and its reformist practice ([[tendency:social-democracy]]; [[event:erfurt-programme]]).[cite:src_schorske_spd][cite:src_gay_bernstein]`,
        legacy: `## Significance

Bernstein is widely regarded as the founder of democratic socialism as a distinct tradition. **Text.** His conclusion, headed "Kant against Cant", appealed to ethical reasoning against what he saw as dogmatic tradition.[cite:src_mia_bernstein_conclusion][cite:src_steger_bernstein]

## Criticisms

**Disputed.** Orthodox critics held that he abandoned socialism while keeping its name; later critics argued that the crises of the twentieth century proved his optimism premature. Defenders reply that post-1945 social democracy vindicated his strategy, and Steger presents him as a theorist of democracy rather than a mere opportunist.[cite:src_gay_bernstein][cite:src_steger_bernstein][cite:src_kolakowski]

## Further reading

Peter Gay, *The Dilemma of Democratic Socialism*; Manfred Steger, *The Quest for Evolutionary Socialism*.[cite:src_gay_bernstein][cite:src_steger_bernstein]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample entry for Bernstein." }],
    },
    {
      key: "thinker:luxemburg",
      title: "Rosa Luxemburg",
      fields: {
        yearStart: 1871,
        yearEnd: 1919,
        subtitle: "1871–1919",
        roles: "Polish-German Marxist theorist, economist and revolutionary",
        birthPlace: "Zamość, Russian Poland",
        deathPlace: "Berlin",
        aliases: "Róża Luksemburg\nJunius\nRosa Luxemburg",
        summary:
          "Polish-born revolutionary and economist who answered Bernstein, championed the mass strike, criticised Lenin's centralism and later the Bolsheviks' suppression of democracy, opposed the First World War from prison, and was murdered during the German revolution.",
        body: `## Identity

Born into a Jewish family in Russian Poland, Luxemburg went into exile in Switzerland in 1889 and took a doctorate in Zurich on the industrial development of Poland. With Leo Jogiches she founded the Social Democracy of the Kingdom of Poland (later and Lithuania), which opposed Polish nationalism. In 1898 she moved to Germany ([[tendency:social-democracy]]).[cite:src_nettl_luxemburg][cite:src_sep_luxemburg]

### Development and works

- **Social Reform or Revolution?** (1899) answered Bernstein ([[text:social-reform-or-revolution]]).
- **Organizational Questions of the Russian Social Democracy** (1904) criticised Lenin's centralism ([[debate:spontaneity-and-organisation]]).
- **The Mass Strike, the Political Party and the Trade Unions** (1906) drew the lessons of 1905 ([[text:the-mass-strike]]; [[event:revolution-1905]]).
- **The Accumulation of Capital** (1913) argued that capitalism needs non-capitalist markets to expand, linking accumulation to imperialism ([[text:accumulation-of-capital]]; [[concept:imperialism]]).
- **The Junius Pamphlet** (1915/16) and **The Russian Revolution** (1918) were written in prison.[cite:src_nettl_luxemburg]

### Core questions

How does a working class become capable of revolution? **Text.** Against Bernstein: "The struggle for reforms is its means; the social revolution, its aim."[cite:src_reform_revolution, introduction] Against Lenin: "Historically, the errors committed by a truly revolutionary movement are infinitely more fruitful than the infallibility of the cleverest Central Committee."[cite:src_mia_luxemburg_org]

### Disagreements

She broke with Kautsky in 1910 over the mass strike, opposed the SPD's vote for war credits and founded the Spartacus League ([[event:war-credits-1914]]). She welcomed the October Revolution but criticised the dissolution of the Constituent Assembly and the suppression of freedoms ([[event:october-revolution]]). She was murdered by Freikorps soldiers on 15 January 1919, two weeks after the founding of the German Communist Party ([[event:spartacist-uprising]]).[cite:src_nettl_luxemburg][cite:src_mia_luxemburg_russian_rev]`,
        context: `Luxemburg worked across three movements — Polish, Russian and German — and as a woman and a Polish Jew in the German party she faced hostility from opponents and sometimes from comrades. From 1907 she taught political economy at the SPD's party school in Berlin.[cite:src_nettl_luxemburg]`,
        legacy: `## Significance

Luxemburg's combination of revolutionary commitment with insistence on democracy and mass self-activity made her a reference point for later left critics of both social democracy and Soviet communism.[cite:src_sep_luxemburg][cite:src_kolakowski]

## Interpretations

**Disputed.** Her opponents, and later Soviet orthodoxy, labelled her a believer in "spontaneity" who underrated organisation; Nettl and others show that she valued the party highly but saw its role as clarifying and leading mass action rather than commanding it ([[concept:spontaneity]]). Her theory of accumulation has been criticised by economists since its publication.[cite:src_nettl_luxemburg][cite:src_sep_luxemburg]

## Further reading

J. P. Nettl's biography; Lea Ypi's article in the *Stanford Encyclopedia of Philosophy*.[cite:src_nettl_luxemburg][cite:src_sep_luxemburg]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample entry for Luxemburg." },
        { type: "disputed", field: "legacy", note: "The 'spontaneism' label is contested; both readings are attributed." },
      ],
    },
    {
      key: "thinker:lenin",
      title: "Vladimir Lenin",
      fields: {
        yearStart: 1870,
        yearEnd: 1924,
        subtitle: "1870–1924",
        roles: "Russian Marxist revolutionary and theorist; leader of the Bolsheviks and of the Soviet government",
        birthPlace: "Simbirsk, Russian Empire",
        deathPlace: "Gorki, near Moscow",
        aliases: "Vladimir Ilyich Ulyanov\nV. I. Lenin\nLenin",
        summary:
          "Founder of Bolshevism and leader of the October Revolution, whose theories of the party, imperialism and the state became the basis of twentieth-century communism. His legacy — and its relation to Marx and to Stalinism — is among the most fiercely disputed in political history.",
        body: `## Identity

Vladimir Ulyanov, son of a provincial school inspector, turned to revolution after his elder brother was executed in 1887 for plotting to kill the tsar. In St Petersburg in the 1890s he joined Marxist circles, and after arrest and Siberian exile he went abroad in 1900 to found *Iskra* with Plekhanov, Martov and others ([[thinker:plekhanov]]).[cite:src_service_lenin][cite:src_harding_lenin]

### Development and works

- **The Development of Capitalism in Russia** (1899) argued, against the populists, that Russia was already capitalist.
- **What Is to Be Done?** (1902) called for a centralised organisation of revolutionaries and argued that socialist consciousness must be brought to workers "from without" the economic struggle ([[text:what-is-to-be-done]]; [[concept:vanguard-party]]).
- **One Step Forward, Two Steps Back** (1904) defended his position in the party split ([[event:bolshevik-menshevik-split]]).
- **Two Tactics** (1905) proposed a "revolutionary-democratic dictatorship of the proletariat and peasantry" for Russia ([[debate:revolution-in-russia]]).
- **Imperialism** (1916) and **The State and Revolution** (1917) belong to the war and revolution years ([[text:imperialism-highest-stage]]; [[text:the-state-and-revolution]]).[cite:src_harding_lenin][cite:src_service_lenin]

### Core questions

How can a revolutionary party act under autocracy, and how can the working class lead a revolution in a peasant country? Lenin's answers stressed organisation, theory and political initiative ([[concept:class-consciousness]]).[cite:src_harding_lenin]

### Disagreements

With the Mensheviks over party membership (1903) and alliances (1905); with Luxemburg over centralism; with Kautsky over the war and the dictatorship of the proletariat ([[thinker:luxemburg]]; [[thinker:kautsky]]; [[concept:dictatorship-of-the-proletariat]]). In 1917 he led the Bolsheviks to power ([[event:october-revolution]]). As head of the Soviet government he presided over the dissolution of the Constituent Assembly, the Red Terror and the civil war, and in 1921 introduced the New Economic Policy and banned factions within the party.[cite:src_service_lenin][cite:src_smith_russia]`,
        context: `Lenin's politics were formed under tsarist autocracy, where open parties were illegal, and in the factional world of the Russian emigration. Industrialisation, a growing but small working class and a vast peasantry posed problems unknown to German social democracy ([[event:emancipation-of-labour-group]]).[cite:src_smith_russia][cite:src_harding_lenin]`,
        legacy: `## Significance

Lenin's party, his theory of imperialism and the Soviet state he founded shaped communist movements across the twentieth century; "Leninism" was codified after his death ([[tendency:leninism]]).[cite:src_harding_lenin][cite:src_kolakowski]

## Interpretations

**Disputed.** Was Lenin a faithful interpreter of Marx, a creative adapter to Russian conditions, or the author of a new, authoritarian doctrine? Did Stalinism continue or betray Leninism? Historians such as Service stress continuity and Lenin's own use of terror; Lih argues that the conventional reading of *What Is to Be Done?* as elitist misreads it, and that Lenin saw himself as an orthodox follower of Kautsky's Marxism.[cite:src_service_lenin][cite:src_lih_lenin][cite:src_harding_lenin]

## Further reading

Neil Harding, *Lenin's Political Thought*; Lars Lih, *Lenin Rediscovered*; Robert Service's biography.[cite:src_harding_lenin][cite:src_lih_lenin][cite:src_service_lenin]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample entry for Lenin." },
        { type: "disputed", field: "legacy", note: "Interpretations of Lenin are deeply contested; check that no reading is presented as settled and that the terror and repression after 1917 are neither omitted nor sensationalised." },
      ],
    },

    /* ——— Concepts ——— */
    {
      key: "concept:revisionism",
      title: "Revisionism",
      fields: {
        aliases: "Revisionismus\nRevisionist controversy\nBernsteinism",
        summary:
          "The current, led by Eduard Bernstein around 1896–1903, that sought to revise Marxist theory — especially the expectation of capitalist collapse and class polarisation — in favour of a gradual, democratic road to socialism. Later a general Marxist term of abuse for deviation.",
        yearStart: 1896,
        brief: `Revisionism was the attempt, in the late 1890s, to update Marx in the light of what had happened since. Its leader, Eduard Bernstein, argued that capitalism was not collapsing, that the middle classes were not vanishing, and that workers were winning reforms through unions and elections. So, he said, socialists should stop waiting for a revolution and openly become a party of democratic reform.`,
        standard: `Revisionism was a critique of Marxist theory from inside the movement. Bernstein argued that ([[thinker:bernstein]]; [[text:preconditions-of-socialism]]):[cite:src_preconditions][cite:src_gay_bernstein]

- the **collapse theory** (*Zusammenbruchstheorie*) was wrong: capitalism was adapting through credit, cartels and expanding markets;
- **polarisation** was not happening: property was spreading through joint-stock companies, and small business and peasant farming survived;
- **dialectics** — the Hegelian element in Marx — had led to speculative predictions;
- **democracy** allowed gradual change, so the party's practice of reform should be matched by its theory.

**Text.** "The movement means everything for me and … what is usually called “the final aim of socialism” is nothing."[cite:src_mia_bernstein_evsoc, preface]

Luxemburg, Kautsky and Plekhanov replied; the German party condemned revisionism at its Hanover (1899) and Dresden (1903) congresses, and the International at Amsterdam (1904) ([[event:revisionism-controversy]]).[cite:src_schorske_spd][cite:src_joll_second_international]`,
        deep: `### Theory and practice

**Interpretation.** The controversy exposed a gap: the SPD's programme predicted revolution, its daily work was reform. Revisionists wanted to close the gap by changing the theory; their orthodox critics by reaffirming it while continuing the practice. Schorske argues that the formal defeat of revisionism left the reformist practice of the unions and party bureaucracy untouched ([[concept:reformism]]).[cite:src_schorske_spd]

### Ethical socialism

Some revisionists drew on neo-Kantian philosophy to argue that socialism is an ethical ideal, not a scientific prediction — a position that reappears in the debate over historical materialism ([[debate:what-is-historical-materialism]]).[cite:src_steger_bernstein][cite:src_kolakowski]

### A word with a later life

After 1917 "revisionist" became a term of abuse in communist polemics, applied to anyone accused of departing from orthodoxy — from Tito to Khrushchev. That usage should be distinguished from the historical controversy of 1896–1903.[cite:src_bottomore_dictionary]`,
        history: `Bernstein's articles in *Die Neue Zeit* (1896–98), his letter to the Stuttgart congress (1898) and *The Preconditions of Socialism* (1899) launched the debate; French "ministerialism" — the socialist Alexandre Millerand's entry into a bourgeois cabinet in 1899 — was its practical counterpart abroad.[cite:src_gay_bernstein][cite:src_joll_second_international]`,
        interpretations: `- **Orthodox Marxist**: an opportunist adaptation to capitalism (Luxemburg, Kautsky, Plekhanov, Lenin).
- **Democratic socialist**: an honest recognition of reality that anticipated twentieth-century social democracy (Gay, Steger).
- **Historians**: a symptom of the SPD's integration into German society and of the prosperity of 1895–1914.[cite:src_gay_bernstein][cite:src_steger_bernstein][cite:src_schorske_spd]`,
        criticisms: `Critics argued that Bernstein generalised from a period of prosperity, underestimated the persistence of crises and the resistance of ruling classes to reform, and offered no account of how socialism would be reached; the economic crises, wars and revolutions of 1914–45 were later cited against him.[cite:src_reform_revolution][cite:src_kolakowski]`,
      },
    },
    {
      key: "concept:reformism",
      title: "Reformism",
      fields: {
        aliases: "Gradualism\nEvolutionary socialism\nReformist socialism",
        summary:
          "The strategy of changing society through gradual legal reforms — legislation, collective bargaining, elections — rather than revolution. Its critics argued that reforms alone could improve capitalism but never abolish it.",
        yearStart: 1890,
        brief: `Reformism means trying to change society step by step through laws, elections and union bargaining instead of revolution. In the socialist movement the question was not whether to fight for reforms — almost everyone did — but whether reforms could add up, over time, to socialism.`,
        standard: `Every party of the Second International fought for reforms: shorter hours, social insurance, the vote. The dividing line was what reforms were *for* ([[tendency:social-democracy]]).[cite:src_joll_second_international]

- **Reformists** (Bernstein; the Fabians in Britain; many trade-union leaders) held that accumulated reforms would transform capitalism into socialism ([[thinker:bernstein]]; [[concept:revisionism]]).
- **Their revolutionary critics** held that reforms improve workers' position within capitalism and train them for struggle, but cannot abolish wage labour. **Text.** Luxemburg: those who choose legislative reform instead of the conquest of power "do not really choose a more tranquil, calmer and slower road to the same goal, but a different goal" ([[thinker:luxemburg]]).[cite:src_reform_revolution, ch. 8]`,
        deep: `### Theory and practice

**Interpretation.** Historians stress that reformism was often a practice before it was a theory: trade unions and municipal and parliamentary work produced leaders and habits oriented to negotiation, whatever the programme said. Schorske's study of the SPD traces this to the growth of the party and union bureaucracy after 1905.[cite:src_schorske_spd]

### Disputed

Whether the welfare states of the twentieth century vindicate reformism, or show that reforms stop short of socialism and can be reversed, remains disputed ([[debate:reform-or-revolution]]; [[debate:can-capitalism-be-reformed]]).[cite:src_sassoon_hundred_years][cite:src_sep_socialism]`,
        history: `Gradualist socialism developed in the 1880s–90s among the British Fabians, French "possibilists" and German trade-union leaders; Bernstein gave it a theory in 1899, and Millerand's entry into government that year made "ministerialism" an international issue.[cite:src_joll_second_international][cite:src_gay_bernstein]`,
        interpretations: `Lenin treated reformism as the politics of a privileged "labour aristocracy" bought off with imperial profits ([[concept:imperialism]]); social democrats saw it as the democratic realisation of socialist goals; historians emphasise organisational interests and national integration.[cite:src_mia_imperialism][cite:src_sassoon_hundred_years][cite:src_schorske_spd]`,
        criticisms: `Revolutionary critics argue that reformism leaves ownership and power untouched and binds workers' organisations to the state, as in August 1914 ([[event:war-credits-1914]]). Reformists reply that revolutionary strategies produced dictatorships while reforms produced real gains.[cite:src_reform_revolution][cite:src_sassoon_hundred_years]`,
      },
    },
    {
      key: "concept:spontaneity",
      title: "Spontaneity",
      fields: {
        aliases: "Stikhiinost\nSpontaneism\nSpontaneous movement\nSelf-activity",
        summary:
          "In Russian Marxist debate, the unplanned, “elemental” self-organisation of workers — strikes, protests, unions — as opposed to conscious, organised socialist politics. How the two relate divided Lenin, the “Economists” and Luxemburg.",
        yearStart: 1899,
        brief: `Workers often organise and strike without being told to by any party. Is that "spontaneous" movement enough to produce socialism, or does it need a party with a theory to guide it? Lenin warned against "bowing to spontaneity"; Luxemburg celebrated the creativity of mass action. Both, though, believed in a party and in workers' own activity — the dispute was about the balance.`,
        standard: `In Russian, *stikhiinost* ("elementalness", spontaneity) was contrasted with *soznatelnost* (consciousness).[cite:src_lih_lenin]

- **The "Economists"** (around the journal *Rabocheye Dyelo* and the "Credo" of 1899) urged Russian Marxists to support workers' economic struggles and leave politics to the liberals.
- **Lenin** answered that the "spontaneous element" represents "consciousness in an embryonic form" but that, left to itself, the workers' movement produced only trade-union consciousness ([[text:what-is-to-be-done]]).[cite:src_mia_witbd, ch. II]
- **Luxemburg** argued from the 1905 mass strikes that the masses learn through action, and that no party can call a revolution at will ([[text:the-mass-strike]]; [[thinker:luxemburg]]).[cite:src_mia_luxemburg_mass_strike]`,
        deep: `### A false opposition?

**Disputed.** Later polemics opposed a "Leninist" cult of organisation to a "Luxemburgist" faith in spontaneity. Both labels simplify. Lenin praised spontaneous upsurges and in 1905 welcomed the soviets; Luxemburg insisted that social democracy was the "most enlightened, most class-conscious vanguard" and should lead mass action.[cite:src_mia_luxemburg_mass_strike] Lih argues that Lenin's target was not spontaneity as such but those who limited socialist activity to it.[cite:src_lih_lenin][cite:src_nettl_luxemburg]

### Self-emancipation

Behind the dispute lies Marx's principle that "the emancipation of the working classes must be conquered by the working classes themselves" ([[event:first-international]]; [[concept:class-consciousness]]).[cite:src_mia_iwma_rules]`,
        history: `The term was central to Russian debates of 1899–1904; Luxemburg's 1904 and 1906 writings gave it a broader European significance; later revolutionary movements (the councils of 1917–20) revived the question.[cite:src_lih_lenin][cite:src_nettl_luxemburg]`,
        interpretations: `- **Leninist**: spontaneity must be "combated" or directed by a party armed with theory.
- **Luxemburgist / council communist**: mass self-activity is the source of revolutionary creativity; the party clarifies rather than commands.
- **Revisionist historians** (Lih): the opposition was about the tasks of a party under autocracy, not about distrust of workers.[cite:src_lih_lenin][cite:src_nettl_luxemburg][cite:src_harding_lenin]`,
        criticisms: `Critics of "spontaneism" argue that unorganised movements dissipate or are captured by better-organised forces; critics of vanguardism argue that a party which claims to embody consciousness substitutes itself for the class.[cite:src_kolakowski][cite:src_mia_luxemburg_org]`,
      },
    },
    {
      key: "concept:class-consciousness",
      title: "Class Consciousness",
      fields: {
        aliases: "Class for itself\nClass in itself\nTrade-union consciousness\nSocialist consciousness",
        summary:
          "Awareness by members of a class of their shared position and interests — and, in Marxist debate, of the possibility of changing society. How workers come to it, and what role parties and intellectuals play, was a central dispute of the Second International.",
        yearStart: 1847,
        brief: `Being in the same situation does not automatically make people see themselves as a group with common interests. Class consciousness is that awareness. Marxists argued about how workers acquire it: through their own struggles, through a party that brings them socialist ideas, or through great mass movements that teach faster than any pamphlet.`,
        standard: `Marx did not use the phrase "class consciousness", but the idea is in his work. **Text.** In 1847 he described workers combined by capital as "already a class as against capital, but not yet for itself"; in struggle "this mass becomes united, and constitutes itself as a class for itself" ([[concept:class]]).[cite:src_mia_poverty_ch2]

**Text.** In 1901–02 Kautsky argued that "socialist consciousness is something introduced into the proletarian class struggle from without" — Lenin quoted him approvingly ([[thinker:kautsky]]).[cite:src_mia_witbd, ch. II] **Text.** Lenin added that "the working class, exclusively by its own effort, is able to develop only trade union consciousness" ([[text:what-is-to-be-done]]; [[thinker:lenin]]).[cite:src_mia_witbd, ch. II]

Luxemburg stressed instead how mass action itself — above all the strikes of 1905 — raised workers' consciousness ([[thinker:luxemburg]]; [[text:the-mass-strike]]).[cite:src_mia_luxemburg_mass_strike]`,
        deep: `### "From without": what did it mean?

**Disputed.** The usual reading takes *What Is to Be Done?* to say that workers cannot become socialist without intellectuals, and treats this as the root of Leninist elitism. Lih argues that Lenin was restating Kautsky's orthodox view about the origin of socialist *theory* among educated people, while expecting workers to embrace it eagerly; the "from without" of chapter III refers to political knowledge from outside the factory struggle.[cite:src_lih_lenin][cite:src_harding_lenin] **Text.** "Class political consciousness can be brought to the workers only from without, that is, only from outside the economic struggle, from outside the sphere of relations between workers and employers."[cite:src_mia_witbd, ch. III]

### False consciousness

The phrase "false consciousness" comes from a letter of Engels (1893) about ideology, not from Marx; later Marxists used it for workers' acceptance of ideas contrary to their interests ([[concept:ideology]]).[cite:src_bottomore_dictionary]

### After 1917

Georg Lukács's *History and Class Consciousness* (1923) and Gramsci's concept of hegemony carried the question into Western Marxism, beyond this corpus ([[concept:hegemony]]).[cite:src_kolakowski]`,
        history: `From Marx's "class in itself / for itself" (1847) through the German party's educational work and Kautsky's "from without" (1901), to the Russian debate of 1902–04 and Luxemburg's analysis of 1905.[cite:src_mia_poverty_ch2][cite:src_lih_lenin][cite:src_nettl_luxemburg]`,
        interpretations: `- **Orthodox (Kautsky, Lenin 1902)**: socialist theory originates with intellectuals and must be combined with the workers' movement.
- **Luxemburg**: consciousness develops through mass action, with the party as its most conscious part.
- **Economists**: workers' consciousness develops from economic to political struggle by stages.[cite:src_lih_lenin][cite:src_nettl_luxemburg]`,
        criticisms: `Sociologists question whether shared economic position reliably produces shared consciousness, given divisions of skill, nation, religion, gender and race; critics of Marxism argue that the concept lets theorists dismiss workers' actual views as "false".[cite:src_kolakowski][cite:src_bottomore_dictionary]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample concept; its links to hegemony and the revolutionary-subject debate are kept." },
        { type: "specialist-review", field: "deep", note: "The Engels letter of 1893 (to Franz Mehring) as the source of “false consciousness” is standard but should be checked; the corpus does not yet include it as a source record." },
      ],
    },
    {
      key: "concept:vanguard-party",
      title: "Vanguard Party",
      fields: {
        aliases: "Vanguard\nVanguardism\nDemocratic centralism\nParty of a new type",
        summary:
          "A disciplined, centralised party of committed revolutionaries that claims to lead the working class. Associated with Lenin's What Is to Be Done? and with Bolshevism; its meaning, and its responsibility for later one-party states, are disputed.",
        yearStart: 1902,
        brief: `A vanguard party is a tightly organised party of dedicated activists that aims to lead the working class in revolution. Lenin argued that under the tsarist police state a loose, open party would be destroyed, so Russian socialists needed a centralised organisation of professional revolutionaries. Critics, starting with Luxemburg and Trotsky in 1904, warned that such a party could end up ruling over the class it claimed to represent.`,
        standard: `**Context.** Socialist parties were illegal in Russia; local circles were repeatedly broken by police. In *What Is to Be Done?* (1902) Lenin argued for an all-Russian organisation of "professional revolutionaries", centralised and secret, connected to a national newspaper ([[text:what-is-to-be-done]]; [[thinker:lenin]]).[cite:src_mia_witbd][cite:src_harding_lenin]

At the 1903 congress the dispute over who counted as a party member split the party ([[event:bolshevik-menshevik-split]]). **Text.** Lenin defended himself: "A Jacobin who wholly identifies himself with the organisation of the proletariat—a proletariat conscious of its class interests—is a revolutionary Social-Democrat."[cite:src_mia_onestep, section Q]

**Text.** Luxemburg replied that "the ultra-centralism asked by Lenin is full of the sterile spirit of the overseer" ([[thinker:luxemburg]]).[cite:src_mia_luxemburg_org]`,
        deep: `### Democratic centralism

The phrase "democratic centralism" — free discussion, binding decisions, elected leadership — was adopted by both Russian factions in 1905–06. Its balance shifted with circumstances; the Bolshevik ban on factions in 1921 and the Comintern's conditions for membership made centralism dominant.[cite:src_harding_lenin][cite:src_service_lenin]

### Continuity or rupture?

**Disputed.** One school (Service; many Cold War historians) sees the vanguard party as the seed of one-party dictatorship. Another (Lih; Harding in part) reads *What Is to Be Done?* as a tactical text for underground conditions, much closer to German social democracy than its later reputation suggests, and attributes the post-1917 regime to civil war and isolation as much as to doctrine.[cite:src_lih_lenin][cite:src_harding_lenin][cite:src_service_lenin]`,
        history: `The idea of a "vanguard" of conscious workers is older (the *Manifesto* calls Communists the most advanced section of the working class). Lenin's organisational model dates from 1902–04, was revised in 1905–07 when the party opened up, and was codified for the Communist International after 1919 ([[text:communist-manifesto]]; [[tendency:leninism]]).[cite:src_harding_lenin][cite:src_manifesto_moore]`,
        interpretations: `- **Leninist**: the party as the organised, conscious vanguard of the class.
- **Luxemburg / Trotsky (1904)**: centralism risks substituting the committee for the party and the party for the class.
- **Menshevik**: a broad party on the German model.
- **Historians**: an adaptation to conditions of illegality, later universalised.[cite:src_mia_luxemburg_org][cite:src_lih_lenin][cite:src_harding_lenin]`,
        criticisms: `Critics argue that vanguardism licensed a minority to act in the name of a class it did not consult, and led directly to party dictatorship; defenders argue that every effective political movement needs organisation and leadership, and that the alternative under autocracy was defeat.[cite:src_kolakowski][cite:src_lih_lenin]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample concept." },
        { type: "specialist-review", field: "standard", note: "Trotsky's 1904 critique (Our Political Tasks) is mentioned without a source record; add one or remove the reference." },
      ],
    },

    /* ——— Texts ——— */
    {
      key: "text:preconditions-of-socialism",
      title: "The Preconditions of Socialism",
      fields: {
        subtitle: "and the Tasks of Social Democracy",
        originalTitle: "Die Voraussetzungen des Sozialismus und die Aufgaben der Sozialdemokratie",
        language: "German",
        form: "book",
        yearStart: 1899,
        publicationNote: "Stuttgart: J. H. W. Dietz, 1899. Abridged English translation as Evolutionary Socialism (1909); complete translation by Henry Tudor (1993).",
        edition: "ed. and trans. Henry Tudor, Cambridge University Press, 1993",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/reference/archive/bernstein/works/1899/evsoc/",
        aliases: "Evolutionary Socialism\nDie Voraussetzungen des Sozialismus",
        summary:
          "Bernstein's systematic case for revising Marxism: capitalism was not collapsing, society was not polarising, and social democracy should become openly a democratic party of reform. The founding text of revisionism.",
        body: `## Purpose

Written at the request of party friends after his articles had caused uproar, the book set out Bernstein's position in full ([[thinker:bernstein]]; [[concept:revisionism]]).[cite:src_preconditions][cite:src_gay_bernstein]

## Main argument

1. **Method.** Marxism contains a scientific core and a speculative, Hegelian-dialectical element that should be discarded ([[concept:dialectics]]).
2. **Economics.** Statistics show the survival of small and medium enterprises and peasant farming; crises are becoming milder through credit and cartels; property is spreading through shareholding.
3. **Politics.** Democracy makes gradual change possible; trade unions and cooperatives are building socialism within capitalism.
4. **Ethics.** **Text.** The conclusion, "Kant against Cant", calls for a socialism grounded in ethics rather than historical necessity.[cite:src_mia_bernstein_conclusion]

## Later influence

The book provoked replies from Kautsky, Plekhanov and Luxemburg ([[text:social-reform-or-revolution]]) and was condemned by party congresses, but it became a founding text of democratic socialism.[cite:src_steger_bernstein]

## Interpretations

**Disputed.** Read as betrayal by revolutionaries and as realism by social democrats; historians debate how far its statistics supported its claims and how far it described the existing practice of the SPD.[cite:src_gay_bernstein][cite:src_schorske_spd]`,
        context: `Bernstein wrote in London, in exile under a German arrest warrant, during the prosperity of the late 1890s ([[event:revisionism-controversy]]).[cite:src_steger_bernstein]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample text record." }],
    },
    {
      key: "text:social-reform-or-revolution",
      title: "Social Reform or Revolution?",
      fields: {
        originalTitle: "Sozialreform oder Revolution?",
        language: "German",
        form: "pamphlet",
        yearStart: 1898,
        yearEnd: 1899,
        publicationNote: "Articles in the Leipziger Volkszeitung (1898–99); published as a pamphlet in 1899; second, revised edition 1908.",
        edition: "marxists.org transcription; in The Rosa Luxemburg Reader (Monthly Review Press, 2004)",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/luxemburg/1900/reform-revolution/",
        aliases: "Reform or Revolution\nSozialreform oder Revolution?",
        summary:
          "Luxemburg's reply to Bernstein: capitalism's adaptations do not overcome its contradictions; reforms are a means of the class struggle, not a substitute for the conquest of power; to abandon the final goal is to abandon socialism.",
        body: `## Purpose

A point-by-point answer to Bernstein's articles and book ([[text:preconditions-of-socialism]]; [[thinker:bernstein]]).[cite:src_reform_revolution][cite:src_nettl_luxemburg]

## Main argument

- **Reform and revolution.** **Text.** "Between social reforms and revolution there exists for the Social Democracy an indissoluble tie. The struggle for reforms is its means; the social revolution, its aim."[cite:src_reform_revolution, introduction]
- **Adaptation.** Credit and cartels do not abolish crises but intensify the contradictions of capitalism.
- **Trade unions and democracy** improve the workers' position within capitalism — a "labour of Sisyphus" — but cannot abolish exploitation ([[concept:reformism]]).
- **A different goal.** Choosing reform instead of revolution means choosing not a slower road to the same goal but "a different goal".[cite:src_reform_revolution, ch. 8]

## Later influence

The pamphlet made Luxemburg's reputation in the German party and remains one of the most widely read critiques of reformism ([[debate:reform-or-revolution]]).[cite:src_nettl_luxemburg]

## Interpretations

Critics note that Luxemburg defended the "collapse" expectation that Bernstein had attacked; defenders argue that her case rests less on economic prediction than on the limits of reform within capitalist property relations.[cite:src_kolakowski][cite:src_sep_luxemburg]`,
        context: `Written when Luxemburg had just arrived in Germany; it established her, at twenty-seven, as a leading voice of the party's left ([[event:revisionism-controversy]]).[cite:src_nettl_luxemburg]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample text record." },
      ],
    },
    {
      key: "text:what-is-to-be-done",
      title: "What Is to Be Done?",
      fields: {
        subtitle: "Burning Questions of Our Movement",
        originalTitle: "Что делать? Наболевшие вопросы нашего движения",
        language: "Russian",
        form: "pamphlet",
        yearStart: 1901,
        yearEnd: 1902,
        publicationNote: "Written autumn 1901 – February 1902; published in Stuttgart by J. H. W. Dietz, March 1902.",
        edition: "Lenin, Collected Works vol. 5; annotated translation in Lih, Lenin Rediscovered (2006)",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/lenin/works/1901/witbd/",
        aliases: "Chto delat'?\nWITBD",
        summary:
          "Lenin's polemic against the “Economists”: Russian social democrats must not bow to the spontaneous workers' movement but bring political consciousness to it, through a centralised organisation of professional revolutionaries. Its meaning has been fiercely contested ever since.",
        body: `## Purpose

A contribution to the debates of the Russian Social Democratic movement before its 1903 congress, attacking the "Economist" tendency and promoting *Iskra*'s plan for an all-Russian party ([[thinker:lenin]]; [[event:bolshevik-menshevik-split]]). The title echoes Chernyshevsky's novel of 1863.[cite:src_lih_lenin][cite:src_harding_lenin]

## Main argument

- **Against "bowing to spontaneity".** **Text.** "The history of all countries shows that the working class, exclusively by its own effort, is able to develop only trade union consciousness."[cite:src_mia_witbd, ch. II]
- **Theory from without.** Lenin quotes Kautsky that socialist consciousness is "introduced into the proletarian class struggle from without" ([[thinker:kautsky]]; [[concept:class-consciousness]]).[cite:src_mia_witbd, ch. II]
- **Political exposure.** Social democrats must expose every form of tsarist oppression to all classes, not only factory conditions to workers.[cite:src_mia_witbd, ch. III]
- **Organisation.** A secret, centralised organisation of professional revolutionaries, linked by an all-Russian newspaper ([[concept:vanguard-party]]).[cite:src_mia_witbd, ch. IV–V]

## Later influence

After 1917 the pamphlet was read as the founding charter of the communist party model. Its passages on consciousness were quoted by critics as proof of Leninist elitism.[cite:src_harding_lenin][cite:src_kolakowski]

## Interpretations

**Disputed.** Lih argues that the "textbook interpretation" misreads it: Lenin was applying orthodox Second International Marxism to Russian conditions, expected workers to welcome socialist ideas, and that Lenin himself, at the 1903 congress, presented its sharpest formulations as a polemical correction of the Economists' one-sidedness.[cite:src_lih_lenin] Others maintain that it expresses a durable distrust of workers' self-activity.[cite:src_service_lenin][cite:src_kolakowski]`,
        context: `Written in emigration in Munich, as the *Iskra* group fought for control of a Russian movement made up of scattered, police-infiltrated local committees.[cite:src_lih_lenin]`,
      },
      flags: [
        { type: "sample-overlap", note: "Replaces the seeded sample text record." },
        { type: "disputed", field: "body", note: "The interpretation of WITBD is genuinely contested (Lih vs. the 'textbook' reading); both are attributed." },
      ],
    },
    {
      key: "text:the-mass-strike",
      title: "The Mass Strike, the Political Party and the Trade Unions",
      fields: {
        originalTitle: "Massenstreik, Partei und Gewerkschaften",
        language: "German",
        form: "pamphlet",
        yearStart: 1906,
        publicationNote: "Written in Kuokkala, Finland, in August–September 1906 at the request of the Hamburg party organisation; published in Hamburg, 1906.",
        edition: "marxists.org transcription (trans. Patrick Lavin)",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/luxemburg/1906/mass-strike/",
        aliases: "The Mass Strike\nMassenstreik, Partei und Gewerkschaften",
        summary:
          "Luxemburg's analysis of the Russian Revolution of 1905: the mass strike is not a tactic that leaders can call or forbid but the form of the proletarian struggle in revolution, in which economic and political struggles feed each other.",
        body: `## Purpose

Luxemburg had taken part in the revolution in Warsaw and been imprisoned. She wrote for German social democrats, whose union leaders had rejected discussion of the political mass strike in 1905 ([[event:revolution-1905]]; [[thinker:luxemburg]]).[cite:src_nettl_luxemburg][cite:src_schorske_spd]

## Main argument

- **Not a technique.** **Text.** "The mass strike, as shown to us in the Russian Revolution, is not a crafty method discovered by subtle reasoning for the purpose of making the proletarian struggle more effective, but the method of motion of the proletarian mass, the phenomenal form of the proletarian struggle in the revolution."[cite:src_mia_luxemburg_mass_strike, ch. IV]
- **Economic and political struggle** are not separate stages but continually pass into one another.
- **Organisation follows action.** Struggles create organisation as much as organisation creates struggles; the party's task is political leadership, not to "make" the strike ([[concept:spontaneity]]).
- **Unions and party.** German union leaders' caution threatened to subordinate the party to the unions ([[concept:reformism]]).[cite:src_mia_luxemburg_mass_strike]

## Later influence

The pamphlet framed the German left's arguments of 1906–14 and was later cited by council communists and syndicalists.[cite:src_schorske_spd][cite:src_nettl_luxemburg]

## Interpretations

Critics read it as underrating organisation and overestimating the readiness of German workers; defenders as a realistic account of how revolutions actually unfold ([[debate:spontaneity-and-organisation]]).[cite:src_kolakowski][cite:src_sep_luxemburg]`,
        context: `The SPD and the unions reached the Mannheim agreement (1906), giving the unions a veto over mass strikes; Schorske treats this as a turning point in the party's development.[cite:src_schorske_spd]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample text record." }],
    },

    /* ——— Events ——— */
    {
      key: "event:revisionism-controversy",
      title: "The revisionism controversy",
      fields: {
        subtitle: "Bernstein-Debatte",
        yearStart: 1896,
        yearEnd: 1904,
        dateLabel: "1896 – 1904",
        place: "German Social Democratic Party; Second International",
        eventType: "movement",
        summary:
          "The debate set off by Bernstein's articles of 1896–98 over whether Marxism needed revision. Party congresses condemned revisionism, but the controversy shaped every later dispute between reformists and revolutionaries.",
        body: `## What happened

Bernstein's series "Problems of Socialism" (1896–98) and his book of 1899 provoked replies from Luxemburg, Kautsky, Plekhanov and others ([[thinker:bernstein]]; [[text:preconditions-of-socialism]]; [[text:social-reform-or-revolution]]).[cite:src_gay_bernstein]

The SPD discussed revisionism at Stuttgart (1898), rejected it in a resolution at Hanover (1899) and condemned it sharply at Dresden (1903); the Amsterdam congress of the International adopted the Dresden resolution in 1904. Bernstein was not expelled, and revisionists continued to work within the party.[cite:src_schorske_spd][cite:src_joll_second_international]`,
        significance: `The controversy defined the opposition between "orthodox" and "revisionist" Marxism and gave the young Luxemburg her reputation. **Interpretation.** Historians stress that the formal victory of orthodoxy changed little in the party's reformist practice ([[concept:revisionism]]; [[concept:reformism]]; [[debate:reform-or-revolution]]).[cite:src_schorske_spd][cite:src_steger_bernstein]`,
      },
    },
    {
      key: "event:bolshevik-menshevik-split",
      title: "The Bolshevik–Menshevik split",
      fields: {
        subtitle: "Second Congress of the Russian Social Democratic Labour Party",
        yearStart: 1903,
        yearEnd: 1912,
        dateLabel: "July–August 1903 (Brussels, London); separate parties by 1912",
        place: "Brussels and London",
        eventType: "congress",
        summary:
          "At its second congress the Russian Social Democratic Labour Party divided over the definition of party membership and the leadership of Iskra. Lenin's supporters took the name “Bolsheviks” (majority); their opponents became the “Mensheviks”.",
        body: `## What happened

The congress met in Brussels and, under police pressure, moved to London. Lenin and Martov, both *Iskra* editors, proposed different definitions of a party member: Lenin required personal participation in one of the party's organisations; Martov, regular personal assistance under the direction of one. Martov's wording was adopted ([[thinker:lenin]]).[cite:src_harding_lenin][cite:src_service_lenin]

After the Jewish Bund and the "Economist" delegates walked out, Lenin's supporters won a majority in the elections to the party's central bodies and took the name *bolsheviki* ("those of the majority"). Plekhanov sided with Lenin at the congress but soon moved towards the Mensheviks ([[thinker:plekhanov]]).[cite:src_baron_plekhanov][cite:src_harding_lenin]

The factions reunited formally in 1906 but went separate ways; in 1912 the Bolsheviks constituted their own central committee at Prague.[cite:src_service_lenin]`,
        significance: `The split produced the two currents of Russian Marxism that would face each other in 1917 ([[event:october-revolution]]; [[debate:revolution-in-russia]]). **Interpretation.** At the time many participants saw it as a quarrel over personalities and organisation; its significance was magnified in retrospect ([[concept:vanguard-party]]; [[debate:spontaneity-and-organisation]]).[cite:src_harding_lenin][cite:src_lih_lenin]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample event." }],
    },

    /* ——— Tendency ——— */
    {
      key: "tendency:leninism",
      title: "Leninism",
      fields: {
        yearStart: 1903,
        periodLabel: "1903–",
        color: "deep",
        aliases: "Bolshevism\nMarxism-Leninism\nBolsheviks",
        summary:
          "The Marxism of Lenin and the Bolsheviks — the vanguard party, the alliance of workers and peasants, the theory of imperialism and the soviet state — codified after Lenin's death as the doctrine of the communist movement.",
        body: `## What it is

"Leninism" first named the politics of the Bolshevik faction: a centralised party, the leadership of the working class over the peasantry in a democratic revolution, and, from 1914, a break with the Second International ([[concept:vanguard-party]]; [[event:bolshevik-menshevik-split]]; [[thinker:lenin]]).[cite:src_harding_lenin]

After 1917 it added the theory of imperialism as the highest stage of capitalism, the state as a soviet "commune state", and the dictatorship of the proletariat as exercised through the party ([[concept:imperialism]]; [[text:the-state-and-revolution]]; [[concept:dictatorship-of-the-proletariat]]).[cite:src_harding_lenin][cite:src_state_revolution]

## Codification

The term was systematised after Lenin's death in 1924 — notably in Stalin's lectures *The Foundations of Leninism* — and "Marxism-Leninism" became the official doctrine of the Soviet state and the Communist International.[cite:src_kolakowski][cite:src_service_lenin]`,
        context: `Bolshevism grew among Russian socialists under autocracy, in emigration and through the revolutions of 1905 and 1917 ([[event:revolution-1905]]; [[event:october-revolution]]).[cite:src_smith_russia]`,
        criticisms: `**Disputed.** Social democrats (Kautsky), revolutionary critics (Luxemburg) and anarchists criticised Bolshevik rule as a dictatorship of a party over the class; liberal historians see Leninism as the origin of totalitarianism; others distinguish Lenin's thought from its Stalinist codification ([[thinker:kautsky]]; [[thinker:luxemburg]]).[cite:src_mia_kautsky_dictatorship][cite:src_mia_luxemburg_russian_rev][cite:src_lih_lenin][cite:src_kolakowski]`,
        legacy: `Leninist parties led revolutions and governed states across the twentieth century; most of these regimes collapsed or transformed after 1989–91. Assessments of the legacy remain politically charged and are outside the scope of this introductory corpus.[cite:src_service_lenin][cite:src_smith_russia]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample tendency; links to later tendencies kept." }],
    },

    /* ——— Debates ——— */
    {
      key: "debate:reform-or-revolution",
      title: "Reform or revolution?",
      fields: {
        summary:
          "Can socialism be reached through gradual reforms within capitalism and parliamentary democracy, or does it require a revolutionary conquest of power? The question split the socialist movement from the 1890s onwards.",
        intro:
          "Every socialist party fought for reforms. The dispute was over whether reforms could add up to socialism — and therefore over the meaning of the 'final goal', of democracy and of revolution.",
        body: `## Background

The Erfurt Programme of 1891 combined a prediction of social revolution with a list of immediate reforms ([[event:erfurt-programme]]). Bernstein argued that practice had outgrown the theory; Luxemburg answered that reforms without the goal meant abandoning socialism ([[event:revisionism-controversy]]).[cite:src_mia_erfurt_program][cite:src_mia_bernstein_evsoc][cite:src_reform_revolution]

Kautsky defended a "revolutionary but not revolution-making" party; Lenin, after 1914, argued that reformism had led social democracy into supporting imperialist war ([[thinker:kautsky]]; [[thinker:lenin]]; [[event:war-credits-1914]]).[cite:src_mia_kautsky_road][cite:src_harding_lenin]`,
        context: `The question took different forms in different states: in Germany, a semi-parliamentary monarchy; in France, a republic in which a socialist entered government in 1899; in Russia, an autocracy with no parliament until 1906 ([[tendency:social-democracy]]).[cite:src_joll_second_international]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample debate's introduction and structure." }],
    },
    {
      key: "debate:class-consciousness",
      title: "What is class consciousness?",
      fields: {
        summary:
          "How do workers come to see themselves as a class with common interests and a common project? Through their own struggles, through a party that brings socialist theory, or through mass action?",
        intro:
          "Marx expected the working class to emancipate itself. His followers disagreed about how a class becomes conscious of itself — and therefore about what parties and intellectuals are for.",
        body: `## Background

Marx distinguished a class "as against capital" from a class "for itself" ([[concept:class]]).[cite:src_mia_poverty_ch2] German social democracy treated socialist education as a central task; Kautsky argued that socialist theory originated among intellectuals and was "introduced" into the class struggle; Lenin drew organisational conclusions for Russia; Luxemburg saw mass action as the great educator ([[concept:class-consciousness]]; [[text:what-is-to-be-done]]; [[text:the-mass-strike]]).[cite:src_mia_witbd][cite:src_mia_luxemburg_mass_strike]

Later Marxists — Lukács, Gramsci — took the question further ([[concept:hegemony]]).[cite:src_kolakowski]`,
        context: `The debate was sharpest in Russia, where an illegal movement of intellectuals sought contact with a young, rapidly growing working class.[cite:src_lih_lenin]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample debate's introduction and structure; links to hegemony and other sample debates kept." }],
    },
    {
      key: "debate:spontaneity-and-organisation",
      title: "How should a revolutionary party be organised?",
      fields: {
        summary:
          "Centralised and selective, or broad and open? Leading the masses, or learning from them? The question divided Lenin, the Mensheviks and Luxemburg in 1902–06 and shaped the history of the left.",
        intro:
          "Under tsarist autocracy every socialist faced the same problem: how to build an organisation that could survive the police and still be part of a mass movement. The answers became models — and warnings — for the twentieth century.",
        body: `## Background

*What Is to Be Done?* (1902) proposed a centralised organisation of professional revolutionaries ([[text:what-is-to-be-done]]). At the 1903 congress Lenin and Martov disagreed over the definition of a party member ([[event:bolshevik-menshevik-split]]). In 1904 Luxemburg criticised Lenin's "ultra-centralism"; in 1906, after the revolution of 1905, she argued that mass strikes could not be called or prevented by any party ([[text:the-mass-strike]]; [[event:revolution-1905]]).[cite:src_mia_witbd][cite:src_mia_luxemburg_org][cite:src_mia_luxemburg_mass_strike]

**Interpretation.** Recent scholarship (Lih) argues that the differences were narrower than the later "Leninism versus spontaneism" polemic suggests; older accounts treat 1902–04 as the founding moment of a new kind of party.[cite:src_lih_lenin][cite:src_harding_lenin]`,
        context: `Russian socialist circles were small, illegal and regularly destroyed by arrests; the German party, by contrast, was a legal mass organisation. Each side of the debate drew on one of these models ([[concept:vanguard-party]]; [[concept:spontaneity]]).[cite:src_lih_lenin][cite:src_schorske_spd]`,
      },
    },
  ],

  debates: [
    {
      debate: "debate:reform-or-revolution",
      propositions: [
        { key: "collapse", statement: "Capitalism is heading for breakdown or ever deeper crises." },
        { key: "reforms", statement: "Reforms can transform capitalism into socialism step by step." },
        { key: "struggle", statement: "Fighting for reforms strengthens the working class." },
        { key: "goal", statement: "The final goal must guide everyday politics." },
        { key: "democracy", statement: "Parliamentary democracy can be the vehicle of socialist transformation." },
      ],
      positions: [
        {
          key: "bernstein",
          label: "Bernstein (1899)",
          holder: "thinker:bernstein",
          centralClaim: "Capitalism is not collapsing; democracy, unions and cooperatives allow a gradual transition, so the party should become openly a party of democratic reform.",
          summary: "The movement — the continuous work of reform — matters more than a distant final goal, which Bernstein declared to be 'nothing' to him.",
          assumptions: ["Crises are becoming milder.", "Property and the middle classes are not polarising.", "Democracy is extending."],
          criticisms: ["Generalised from a period of prosperity.", "Offered no account of how capital would be socialised."],
          links: ["text:preconditions-of-socialism", "concept:revisionism"],
          stances: {
            collapse: ["rejects", "Credit, cartels and world markets allow capitalism to adapt."],
            reforms: ["affirms", "Socialism grows through democratic and economic reforms."],
            struggle: ["affirms", "Unions and reforms raise workers' power and living standards."],
            goal: ["rejects", "The final aim is 'nothing' to him; the movement is everything."],
            democracy: ["affirms", "Democracy is both means and substance of socialism."],
          },
        },
        {
          key: "luxemburg",
          label: "Luxemburg (1899)",
          holder: "thinker:luxemburg",
          centralClaim: "Reforms are the means of the class struggle and revolution its aim; reforms alone cannot abolish wage labour.",
          summary: "Choosing reform instead of revolution means choosing a different goal — improving capitalism rather than replacing it.",
          assumptions: ["Capitalism's contradictions are not overcome by adaptation."],
          criticisms: ["Relied on the expectation of collapse that Bernstein attacked."],
          links: ["text:social-reform-or-revolution"],
          stances: {
            collapse: ["affirms", "Defended the tendency towards collapse against Bernstein."],
            reforms: ["rejects", "Reforms cannot abolish capitalist property relations."],
            struggle: ["affirms", "The struggle for reforms is the means of the class struggle."],
            goal: ["affirms", "Without the goal the movement loses its socialist character."],
            democracy: ["qualified", "Democracy is indispensable to the workers' movement but cannot by itself transfer power."],
          },
        },
        {
          key: "kautsky",
          label: "Kautsky (orthodox centre)",
          holder: "thinker:kautsky",
          centralClaim: "The party is revolutionary in aim but does not 'make' revolutions; it prepares the working class to win power, ideally through a democratic majority.",
          summary: "Kautsky rejected Bernstein's revision while defending legal, parliamentary methods and a 'strategy of attrition'.",
          assumptions: ["Economic development enlarges and unifies the proletariat."],
          criticisms: ["Left critics: passivity that ended in accommodation in 1914."],
          stances: {
            collapse: ["qualified", "Rejected a mechanical collapse but expected sharpening contradictions."],
            reforms: ["rejects", "Socialism requires the conquest of political power."],
            struggle: ["affirms", "Reforms and organisation prepare the class."],
            goal: ["affirms", "The goal gives the party its identity."],
            democracy: ["affirms", "The democratic republic is the form in which socialism can be realised."],
          },
        },
        {
          key: "lenin",
          label: "Lenin (1914–17)",
          holder: "thinker:lenin",
          centralClaim: "Reformism reflects a privileged 'labour aristocracy' and led social democracy into supporting imperialist war; the existing state must be overthrown.",
          summary: "Reforms are by-products of revolutionary struggle; parliamentary democracy is a form of bourgeois rule to be replaced by soviets.",
          assumptions: ["Imperialism has made revolution an immediate possibility."],
          criticisms: ["Democratic socialists: the soviet alternative produced party dictatorship."],
          links: ["text:the-state-and-revolution"],
          stances: {
            collapse: ["qualified", "Imperialism is 'moribund' capitalism, but there is no automatic collapse."],
            reforms: ["rejects", "Reformism is a bourgeois influence within the workers' movement."],
            struggle: ["qualified", "Useful only when subordinated to revolutionary aims."],
            goal: ["affirms", "Revolution must guide all tactics."],
            democracy: ["rejects", "In 1917 he called for a soviet republic instead of a parliamentary one."],
          },
        },
      ],
      arguments: [
        { key: "a1", position: "bernstein", kind: "argument", body: "Thirty years after Marx's predictions, small businesses and peasants survive, crises have become milder and workers' living standards are rising. A theory must be revised when the facts change." },
        { key: "c1", position: "luxemburg", kind: "counterargument", respondsTo: "a1", body: "Credit and cartels postpone crises by enlarging them; they do not abolish the contradictions of capitalism. Reforms that leave property untouched can be withdrawn." },
        { key: "a2", position: "kautsky", kind: "argument", body: "A mass party in a semi-democratic state can win a majority and use it to take power; provoking a premature confrontation would only destroy its organisations." },
        { key: "c2", position: "lenin", kind: "counterargument", respondsTo: "a2", body: "Waiting for a majority under the existing state ended in August 1914, when the parties of the International supported their governments' war." },
        { key: "a3", kind: "argument", body: "Social democrats after 1945 argued that welfare states, built through elections and bargaining, achieved more for workers than any revolution — a later claim, beyond this corpus's period." },
      ],
    },
    {
      debate: "debate:class-consciousness",
      propositions: [
        { key: "spont", statement: "Workers' everyday struggles lead by themselves to socialist consciousness." },
        { key: "without", statement: "Socialist theory must be brought to workers from outside the economic struggle." },
        { key: "intell", statement: "Intellectuals have a necessary role in forming socialist consciousness." },
        { key: "action", statement: "Consciousness develops mainly through mass action rather than instruction." },
      ],
      positions: [
        {
          key: "marx",
          label: "Marx",
          holder: "thinker:marx",
          centralClaim: "A class 'as against capital' becomes a class 'for itself' through its own struggles; the emancipation of the working class must be its own work.",
          summary: "Marx expected consciousness to grow out of combination and conflict, while noting that some 'bourgeois ideologists' go over to the proletariat.",
          links: ["text:communist-manifesto"],
          stances: {
            spont: ["qualified", "Struggle constitutes the class 'for itself', but Marx never left it to struggle alone."],
            without: ["qualified", "Some bourgeois ideologists who understand history theoretically join the proletariat."],
            intell: ["qualified", "Acknowledged but not given a leading role."],
            action: ["affirms", "Self-emancipation through struggle."],
          },
        },
        {
          key: "kautsky",
          label: "Kautsky (1901–02)",
          holder: "thinker:kautsky",
          centralClaim: "Modern socialist consciousness arises from scientific knowledge, whose bearers are intellectuals; it is introduced into the class struggle from without.",
          summary: "Kautsky's formula, written for the Austrian party programme, was quoted by Lenin as an authority.",
          stances: {
            spont: ["rejects", "The class struggle does not produce socialist theory by itself."],
            without: ["affirms", "'Introduced into the proletarian class struggle from without.'"],
            intell: ["affirms", "The bearers of science are the bourgeois intelligentsia."],
            action: ["qualified", "Struggle and theory must be combined."],
          },
        },
        {
          key: "lenin",
          label: "Lenin (1902)",
          holder: "thinker:lenin",
          centralClaim: "Left to itself the workers' movement produces only trade-union consciousness; political consciousness must come from outside the economic struggle.",
          summary: "Lenin directed his argument against the 'Economists'. How far it expresses distrust of workers is disputed (Lih against the 'textbook' reading).",
          links: ["text:what-is-to-be-done"],
          stances: {
            spont: ["rejects", "Spontaneity yields trade-union, not socialist, consciousness."],
            without: ["affirms", "Political consciousness comes from outside the employer–worker relation."],
            intell: ["affirms", "Socialist theory arose among the educated; worker-revolutionaries must master it."],
            action: ["qualified", "Mass action matters, but must be led."],
          },
        },
        {
          key: "luxemburg",
          label: "Luxemburg (1904–06)",
          holder: "thinker:luxemburg",
          centralClaim: "The masses learn through their own action; the party clarifies and leads, but cannot substitute itself for the class.",
          summary: "From 1905 she argued that mass strikes raised consciousness faster than years of education.",
          links: ["text:the-mass-strike"],
          stances: {
            spont: ["qualified", "Struggles educate, but social democracy is their most conscious part."],
            without: ["qualified", "Did not directly dispute Kautsky's formula but rejected its organisational conclusions."],
            intell: ["qualified", "Intellectual leadership must not become tutelage."],
            action: ["affirms", "Mass action is the great school of the class."],
          },
        },
        {
          key: "economists",
          label: "The 'Economists' (c. 1899–1902)",
          centralClaim: "Russian Marxists should support workers' economic struggles and let political consciousness develop from them by stages.",
          summary: "A loose tendency around the journal Rabocheye Dyelo and the 'Credo' of 1899, known mainly through Lenin's polemic against it.",
          criticisms: ["Their views are mostly known through their opponents' accounts."],
          stances: {
            spont: ["affirms", "Economic struggle leads to political struggle."],
            without: ["rejects", "Against imposing a political programme from outside."],
            intell: ["qualified", "Intellectuals should serve the workers' movement."],
            action: ["affirms", "Workers learn through their own struggles."],
          },
        },
      ],
      arguments: [
        { key: "a1", position: "lenin", kind: "argument", body: "Strikes teach workers that they must combine against employers; they do not by themselves teach how the state, the law and every class in society are connected. That knowledge has to be brought from wider political life." },
        { key: "c1", position: "luxemburg", kind: "counterargument", respondsTo: "a1", body: "In 1905 millions of workers learned in months, through mass strikes, what decades of propaganda had not taught; the party's task is to articulate that experience, not to supply it from outside." },
        { key: "c2", kind: "counterargument", respondsTo: "a1", body: "Lars Lih argues that Lenin's 'from without' referred to political knowledge from outside the factory, not to a claim that workers were incapable of socialism." },
      ],
    },
    {
      debate: "debate:spontaneity-and-organisation",
      propositions: [
        { key: "central", statement: "The party should be centralised, with authority over local organisations." },
        { key: "pro", statement: "The core of the party should be professional revolutionaries." },
        { key: "broad", statement: "Membership should be open to all who support the party and work under its direction." },
        { key: "mass", statement: "Decisive revolutionary initiatives come from mass action that no party can command." },
      ],
      positions: [
        {
          key: "lenin",
          label: "Lenin (1902–04)",
          holder: "thinker:lenin",
          centralClaim: "Under autocracy the party must be a centralised, disciplined organisation of revolutionaries with clear membership.",
          summary: "Defended against the Mensheviks as the way to give the movement continuity, secrecy and political direction.",
          links: ["text:what-is-to-be-done", "concept:vanguard-party"],
          stances: {
            central: ["affirms", "Centralism against the 'amateurism' of isolated local circles."],
            pro: ["affirms", "Professional revolutionaries as the core."],
            broad: ["rejects", "Members must belong to a party organisation."],
            mass: ["qualified", "Welcomed mass upsurges, above all in 1905, but insisted they need leadership."],
          },
        },
        {
          key: "martov",
          label: "Martov and the Mensheviks (1903–04)",
          centralClaim: "A workers' party should be broad, with membership open to supporters who work under its direction, on the model of Western social democracy.",
          summary: "Martov's definition of membership won at the 1903 congress; the Mensheviks later favoured broader alliances and workers' self-organisation.",
          stances: {
            central: ["qualified", "Accepted a national leadership, but not Lenin's degree of control."],
            pro: ["qualified", "Needed under illegality, but not as the definition of the party."],
            broad: ["affirms", "Martov's membership formula."],
            mass: ["qualified", "Emphasised workers' own organisations."],
          },
        },
        {
          key: "luxemburg",
          label: "Luxemburg (1904–06)",
          holder: "thinker:luxemburg",
          centralClaim: "Social-democratic centralism must be the self-centralism of the advanced workers, not the control of a committee; revolutions cannot be made to order.",
          summary: "She criticised Lenin's 'ultra-centralism' in 1904 and, after 1905, argued that mass strikes arise from social conditions rather than party decisions.",
          links: ["text:the-mass-strike", "concept:spontaneity"],
          stances: {
            central: ["qualified", "Centralism yes, but democratic and grounded in the mass movement."],
            pro: ["rejects", "A narrow body of professionals risks becoming an overseer."],
            broad: ["qualified", "Favoured a party rooted in mass activity."],
            mass: ["affirms", "The mass strike cannot be called or prevented at will."],
          },
        },
      ],
      arguments: [
        { key: "a1", position: "lenin", kind: "argument", body: "Local circles were broken by the police within months; only a centralised organisation of experienced revolutionaries could survive and give the movement continuity." },
        { key: "c1", position: "luxemburg", kind: "counterargument", respondsTo: "a1", body: "A party built to control its members will fear the initiative of the masses; the mistakes of a real movement teach more than the wisdom of a central committee." },
        { key: "a2", position: "martov", kind: "argument", body: "A narrow membership would cut the party off from the workers who supported it and turn it into a conspiracy of intellectuals." },
      ],
    },
  ],

  relationships: [
    // Thinkers and tendencies
    { from: "thinker:bernstein", type: "DEVELOPED", to: "concept:revisionism", note: "Founder of revisionism.", source: "src_preconditions", yearStart: 1896, weight: 3, on: "concept:revisionism" },
    { from: "thinker:bernstein", type: "DEVELOPED", to: "concept:reformism", note: "Gave gradualist practice a theory.", source: "src_gay_bernstein", on: "concept:reformism" },
    { from: "thinker:bernstein", type: "MEMBER_OF", to: "tendency:marxism", note: "Engels's associate; revised Marxism from within.", source: "src_gay_bernstein", basis: "interpretive" },
    { from: "thinker:bernstein", type: "PARTICIPATED_IN", to: "event:revisionism-controversy", note: "Its originator.", source: "src_gay_bernstein", weight: 3, on: "event:revisionism-controversy" },
    { from: "thinker:luxemburg", type: "PARTICIPATED_IN", to: "event:revisionism-controversy", note: "Her reply made her reputation.", source: "src_nettl_luxemburg", on: "event:revisionism-controversy" },
    { from: "thinker:kautsky", type: "PARTICIPATED_IN", to: "event:revisionism-controversy", note: "Replied to Bernstein in 1899.", source: "src_salvadori_kautsky", on: "event:revisionism-controversy" },
    { from: "thinker:kautsky", type: "CRITIQUED", to: "thinker:bernstein", note: "Bernstein und das sozialdemokratische Programm (1899).", source: "src_salvadori_kautsky", yearStart: 1899, on: "thinker:kautsky" },
    { from: "thinker:plekhanov", type: "CRITIQUED", to: "thinker:bernstein", note: "Attacked Bernstein's philosophy and called for his expulsion.", source: "src_baron_plekhanov", yearStart: 1898, on: "thinker:plekhanov" },
    { from: "thinker:luxemburg", type: "CONTRASTS_WITH", to: "thinker:kautsky", note: "Broke in 1910 over the mass strike and the 'strategy of attrition'.", source: "src_nettl_luxemburg", yearStart: 1910 },
    { from: "thinker:luxemburg", type: "MEMBER_OF", to: "tendency:social-democracy", note: "SDKPiL and SPD until 1917.", source: "src_nettl_luxemburg" },
    { from: "thinker:lenin", type: "MEMBER_OF", to: "tendency:social-democracy", note: "RSDLP (Bolshevik faction) until the break of 1914–18.", source: "src_harding_lenin" },
    { from: "thinker:lenin", type: "PARTICIPATED_IN", to: "event:bolshevik-menshevik-split", note: "Leader of the Bolshevik faction.", source: "src_harding_lenin", yearStart: 1903, weight: 3 },
    { from: "thinker:plekhanov", type: "PARTICIPATED_IN", to: "event:bolshevik-menshevik-split", note: "Sided with Lenin at the congress, then with the Mensheviks.", source: "src_baron_plekhanov", yearStart: 1903, on: "event:bolshevik-menshevik-split" },
    { from: "tendency:leninism", type: "CONTRASTS_WITH", to: "concept:reformism", note: "Defined against the reformism of the Second International.", source: "src_harding_lenin", on: "tendency:leninism" },
    { from: "tendency:leninism", type: "PRESUPPOSES", to: "concept:vanguard-party", note: "The party model at the core of Bolshevism.", source: "src_harding_lenin", on: "concept:vanguard-party", basis: "interpretive" },

    // Texts
    { from: "text:preconditions-of-socialism", type: "DISCUSSES", to: "concept:revisionism", note: "The founding statement.", source: "src_preconditions", weight: 3, on: "concept:revisionism" },
    { from: "text:preconditions-of-socialism", type: "CRITIQUED", to: "concept:dialectics", note: "Rejects the Hegelian element in Marx.", source: "src_preconditions" },
    { from: "text:preconditions-of-socialism", type: "CRITIQUED", to: "event:erfurt-programme", note: "Questions the programme's theory of polarisation and collapse.", source: "src_gay_bernstein", basis: "interpretive" },
    { from: "text:social-reform-or-revolution", type: "DISCUSSES", to: "concept:reformism", note: "Reform as means, revolution as aim.", source: "src_reform_revolution", weight: 3, on: "concept:reformism" },
    { from: "text:social-reform-or-revolution", type: "CRITIQUED", to: "concept:revisionism", note: "The classic reply.", source: "src_reform_revolution", on: "concept:revisionism" },
    { from: "text:what-is-to-be-done", type: "DISCUSSES", to: "concept:spontaneity", note: "Against 'bowing to spontaneity'.", source: "src_mia_witbd", weight: 3, on: "concept:spontaneity" },
    { from: "text:what-is-to-be-done", type: "CITES", to: "thinker:kautsky", note: "Quotes Kautsky on socialist consciousness 'from without'.", source: "src_mia_witbd", locator: "Ch. II" },
    { from: "text:what-is-to-be-done", type: "INFLUENCED", to: "event:bolshevik-menshevik-split", note: "Its organisational plan underlay the dispute of 1903.", source: "src_harding_lenin", on: "event:bolshevik-menshevik-split" },
    { from: "text:the-mass-strike", type: "DISCUSSES", to: "concept:spontaneity", note: "Mass strikes cannot be called or forbidden.", source: "src_mia_luxemburg_mass_strike", on: "concept:spontaneity" },
    { from: "text:the-mass-strike", type: "DISCUSSES", to: "concept:class-consciousness", note: "Mass action as the school of the class.", source: "src_mia_luxemburg_mass_strike" },
    { from: "text:the-mass-strike", type: "CRITIQUED", to: "concept:reformism", note: "Against union leaders' caution.", source: "src_schorske_spd", on: "concept:reformism" },

    // Concepts
    { from: "concept:revisionism", type: "RELATED_TO", to: "concept:reformism", note: "Revisionism gave reformist practice a theory.", source: "src_schorske_spd" },
    { from: "concept:reformism", type: "CONTRASTS_WITH", to: "concept:revolution", note: "Gradual reform against revolutionary transformation.", source: "src_reform_revolution" },
    { from: "concept:spontaneity", type: "CONTRASTS_WITH", to: "concept:vanguard-party", note: "The poles of the organisational debate — though neither side held a pure position.", source: "src_lih_lenin", basis: "interpretive" },
    { from: "concept:spontaneity", type: "RELATED_TO", to: "concept:class-consciousness", note: "Spontaneous struggle and conscious politics.", source: "src_mia_witbd" },
    { from: "concept:vanguard-party", type: "PRESUPPOSES", to: "concept:class-consciousness", note: "The vanguard is defined by its consciousness.", source: "src_mia_witbd", on: "concept:vanguard-party" },
    { from: "concept:class-consciousness", type: "PRESUPPOSES", to: "concept:class", note: "Consciousness of a class position.", source: "src_mia_poverty_ch2", on: "concept:class-consciousness" },
    { from: "concept:revisionism", type: "CRITIQUED", to: "concept:historical-materialism", note: "Questioned its determinism and dialectics.", source: "src_mia_bernstein_evsoc", basis: "interpretive" },

    // Events and debates
    { from: "event:erfurt-programme", type: "PRECEDES", to: "event:revisionism-controversy", note: "Bernstein's challenge began five years after the programme.", source: "src_steenson_kautsky" },
    { from: "event:revisionism-controversy", type: "INFLUENCED", to: "tendency:social-democracy", note: "Defined the orthodox–revisionist divide.", source: "src_schorske_spd" },
    { from: "event:emancipation-of-labour-group", type: "PRECEDES", to: "event:revisionism-controversy", note: "Plekhanov took a leading part against Bernstein.", source: "src_baron_plekhanov", basis: "interpretive", on: "event:revisionism-controversy" },
    { from: "event:bolshevik-menshevik-split", type: "INFLUENCED", to: "tendency:leninism", note: "Origin of the Bolshevik faction.", source: "src_harding_lenin", on: "tendency:leninism" },
    { from: "debate:reform-or-revolution", type: "DISCUSSES", to: "concept:reformism", note: "The central question.", source: "src_reform_revolution", weight: 3 },
    { from: "debate:reform-or-revolution", type: "DISCUSSES", to: "concept:revisionism", note: "Bernstein's challenge.", source: "src_mia_bernstein_evsoc" },
    { from: "debate:reform-or-revolution", type: "DISCUSSES", to: "concept:revolution", note: "Whether socialism requires a revolutionary conquest of power.", source: "src_reform_revolution" },
    { from: "debate:reform-or-revolution", type: "DISCUSSES", to: "text:social-reform-or-revolution", note: "Luxemburg's reply to Bernstein.", source: "src_reform_revolution" },
    { from: "debate:reform-or-revolution", type: "DISCUSSES", to: "text:preconditions-of-socialism", note: "Bernstein's case.", source: "src_preconditions" },
    { from: "debate:reform-or-revolution", type: "DISCUSSES", to: "event:revisionism-controversy", note: "The historical setting.", source: "src_schorske_spd" },
    { from: "debate:class-consciousness", type: "DISCUSSES", to: "text:what-is-to-be-done", note: "The 'from without' thesis.", source: "src_mia_witbd" },
    { from: "debate:class-consciousness", type: "DISCUSSES", to: "concept:spontaneity", note: "Spontaneity and consciousness.", source: "src_lih_lenin" },
    { from: "debate:spontaneity-and-organisation", type: "DISCUSSES", to: "concept:vanguard-party", note: "The central question.", source: "src_mia_witbd", weight: 3 },
    { from: "debate:spontaneity-and-organisation", type: "DISCUSSES", to: "concept:spontaneity", note: "Mass action and the party.", source: "src_mia_luxemburg_mass_strike", weight: 3 },
    { from: "debate:spontaneity-and-organisation", type: "DISCUSSES", to: "event:bolshevik-menshevik-split", note: "The 1903 dispute over party membership.", source: "src_harding_lenin" },
    { from: "debate:spontaneity-and-organisation", type: "DISCUSSES", to: "text:the-mass-strike", note: "Luxemburg's account of 1905.", source: "src_mia_luxemburg_mass_strike" },
    { from: "debate:spontaneity-and-organisation", type: "RELATED_TO", to: "debate:class-consciousness", note: "Organisation follows from views on consciousness.", source: "src_lih_lenin" },
  ],

  excerpts: [
    {
      key: "bernstein-movement-everything",
      entity: "thinker:bernstein",
      speaker: "thinker:bernstein",
      text: "text:preconditions-of-socialism",
      body: "In this sense I wrote the sentence that the movement means everything for me and that what is usually called “the final aim of socialism” is nothing; and in this sense I write it down again to-day.",
      source: "src_mia_bernstein_evsoc",
      locator: "Preface",
      note: "The sentence first appeared in Bernstein's “Problems of Socialism” articles (1898). Tudor's 1993 translation differs in wording.",
      archiveUrl: "https://www.marxists.org/reference/archive/bernstein/works/1899/evsoc/preface.htm",
    },
    {
      key: "luxemburg-means-aim",
      entity: "text:social-reform-or-revolution",
      speaker: "thinker:luxemburg",
      text: "text:social-reform-or-revolution",
      body: "Between social reforms and revolution there exists for the Social Democracy an indissoluble tie. The struggle for reforms is its means; the social revolution, its aim.",
      source: "src_reform_revolution",
      locator: "Introduction",
      archiveUrl: "https://www.marxists.org/archive/luxemburg/1900/reform-revolution/intro.htm",
    },
    {
      key: "luxemburg-different-goal",
      entity: "concept:reformism",
      speaker: "thinker:luxemburg",
      text: "text:social-reform-or-revolution",
      body: "That is why people who pronounce themselves in favour of the method of legislative reform in place and in contradistinction to the conquest of political power and social revolution, do not really choose a more tranquil, calmer and slower road to the same goal, but a different goal.",
      source: "src_reform_revolution",
      locator: "Ch. 8",
      archiveUrl: "https://www.marxists.org/archive/luxemburg/1900/reform-revolution/ch08.htm",
    },
    {
      key: "witbd-trade-union-consciousness",
      entity: "concept:class-consciousness",
      speaker: "thinker:lenin",
      text: "text:what-is-to-be-done",
      body: "We have said that there could not have been Social-Democratic consciousness among the workers. It would have to be brought to them from without. The history of all countries shows that the working class, exclusively by its own effort, is able to develop only trade union consciousness, i.e., the conviction that it is necessary to combine in unions, fight the employers, and strive to compel the government to pass necessary labour legislation, etc.",
      source: "src_mia_witbd",
      locator: "Ch. II",
      note: "The meaning of this passage is disputed; see Lih, Lenin Rediscovered.",
      archiveUrl: "https://www.marxists.org/archive/lenin/works/1901/witbd/ii.htm",
    },
    {
      key: "witbd-kautsky-from-without",
      entity: "debate:class-consciousness",
      speaker: "thinker:kautsky",
      text: "text:what-is-to-be-done",
      body: "Thus, socialist consciousness is something introduced into the proletarian class struggle from without [von Aussen Hineingetragenes] and not something that arose within it spontaneously [urwüchsig].",
      source: "src_mia_witbd",
      locator: "Ch. II, quoting Kautsky in Die Neue Zeit (1901–02)",
      note: "Kautsky's words as quoted and bracketed by Lenin.",
      archiveUrl: "https://www.marxists.org/archive/lenin/works/1901/witbd/ii.htm",
    },
    {
      key: "witbd-from-without-political",
      entity: "text:what-is-to-be-done",
      speaker: "thinker:lenin",
      text: "text:what-is-to-be-done",
      body: "Class political consciousness can be brought to the workers only from without, that is, only from outside the economic struggle, from outside the sphere of relations between workers and employers.",
      source: "src_mia_witbd",
      locator: "Ch. III",
      archiveUrl: "https://www.marxists.org/archive/lenin/works/1901/witbd/iii.htm",
    },
    {
      key: "luxemburg-errors-fruitful",
      entity: "debate:spontaneity-and-organisation",
      speaker: "thinker:luxemburg",
      body: "Historically, the errors committed by a truly revolutionary movement are infinitely more fruitful than the infallibility of the cleverest Central Committee.",
      source: "src_mia_luxemburg_org",
      locator: "Closing paragraph",
      archiveUrl: "https://www.marxists.org/archive/luxemburg/1904/questions-rsd/ch02.htm",
    },
    {
      key: "luxemburg-overseer",
      entity: "concept:vanguard-party",
      speaker: "thinker:luxemburg",
      body: "The ultra-centralism asked by Lenin is full of the sterile spirit of the overseer. It is not a positive and creative spirit.",
      source: "src_mia_luxemburg_org",
      locator: "Part 1",
      archiveUrl: "https://www.marxists.org/archive/luxemburg/1904/questions-rsd/ch01.htm",
    },
    {
      key: "lenin-jacobin",
      entity: "event:bolshevik-menshevik-split",
      speaker: "thinker:lenin",
      body: "A Jacobin who wholly identifies himself with the organisation of the proletariat—a proletariat conscious of its class interests—is a revolutionary Social-Democrat.",
      source: "src_mia_onestep",
      locator: "Section Q",
      note: "From One Step Forward, Two Steps Back (1904), Lenin's account of the split.",
      archiveUrl: "https://www.marxists.org/archive/lenin/works/1904/onestep/q.htm",
    },
    {
      key: "mass-strike-method-of-motion",
      entity: "text:the-mass-strike",
      speaker: "thinker:luxemburg",
      text: "text:the-mass-strike",
      body: "In a word, the mass strike, as shown to us in the Russian Revolution, is not a crafty method discovered by subtle reasoning for the purpose of making the proletarian struggle more effective, but the method of motion of the proletarian mass, the phenomenal form of the proletarian struggle in the revolution.",
      source: "src_mia_luxemburg_mass_strike",
      locator: "Ch. IV",
      archiveUrl: "https://www.marxists.org/archive/luxemburg/1906/mass-strike/ch04.htm",
    },
  ],
};
