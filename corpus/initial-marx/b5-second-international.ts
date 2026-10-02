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
 * Batch 5 — The Second International (1875–1900): the party, its orthodoxy
 * and its theorists. Kautsky and Plekhanov; the Anti-Socialist Laws, the
 * Emancipation of Labour Group, the Second International and the Erfurt
 * Programme; social democracy; the debate over what historical materialism
 * claims.
 */
export const batch5: CorpusBatch = {
  id: "b5",
  title: "The Second International and Marxist orthodoxy",
  sources: [
    mia("src_mia_plekhanov_1889", "Speech at the International Workers’ Socialist Congress in Paris, 14–21 July 1889", "G. V. Plekhanov", "1889", "https://www.marxists.org/archive/plekhanov/1889/07/speech.html", "as a working-class movement"),
    {
      id: "src_sassoon_hundred_years",
      title: "One Hundred Years of Socialism: The West European Left in the Twentieth Century",
      author: "Donald Sassoon",
      publicationDate: "1996",
      publisher: "I. B. Tauris",
      place: "London",
      sourceType: "HISTORICAL",
      check: { kind: "book", title: "One Hundred Years of Socialism", author: "Sassoon" },
    },
    {
      id: "src_joll_second_international",
      title: "The Second International, 1889–1914",
      author: "James Joll",
      publicationDate: "1955 [revised edition 1974]",
      publisher: "Weidenfeld & Nicolson",
      place: "London",
      sourceType: "HISTORICAL",
      check: { kind: "book", title: "The Second International", author: "Joll" },
    },
  ],
  entities: [
    /* ——— Thinkers ——— */
    {
      key: "thinker:kautsky",
      title: "Karl Kautsky",
      fields: {
        yearStart: 1854,
        yearEnd: 1938,
        subtitle: "1854–1938",
        roles: "Czech-born German-Austrian Marxist theorist, editor and historian; the leading theorist of the Second International",
        birthPlace: "Prague",
        deathPlace: "Amsterdam",
        aliases: "Karl Johann Kautsky\nKautsky",
        summary:
          "Editor of Die Neue Zeit, author of the theoretical part of the Erfurt Programme and, for a generation, the authority on Marxist doctrine in the international socialist movement — until Lenin denounced him as a “renegade”.",
        body: `## Identity

Born in Prague to an artistic family, Kautsky studied in Vienna and came to socialism through Darwinism and the German party press. He met Engels in London in 1881, lived there from 1885 to 1890, and remained Engels's closest younger collaborator ([[thinker:engels]]).[cite:src_steenson_kautsky]

### Development and works

- **Die Neue Zeit** (1883–1917), the theoretical journal he founded and edited, was the forum of international Marxism.[cite:src_steenson_kautsky]
- **The Erfurt Programme** (1891): Kautsky drafted its theoretical part and explained it in *The Class Struggle* (1892), the most widely read statement of orthodox Marxism ([[event:erfurt-programme]]).[cite:src_mia_kautsky_class_struggle]
- **Against revisionism** (1899): he answered Bernstein, defending the theory of growing class polarisation ([[thinker:bernstein]]; [[concept:revisionism]]).[cite:src_salvadori_kautsky]
- **The Road to Power** (1909) argued that a revolutionary period was approaching.[cite:src_mia_kautsky_road]
- He edited Marx's manuscripts on the history of economic theory as *Theories of Surplus-Value* (1905–10).[cite:src_steenson_kautsky]

### Core questions

How can a mass party prepare for socialism within a capitalist state that it does not control? Kautsky's answer combined revolutionary aims with legal organisation. **Text.** "The Socialist party is a revolutionary party, but not a revolution-making party."[cite:src_mia_kautsky_road, ch. 5]

### Disagreements

He broke with Luxemburg in 1910 over the mass strike, defending a "strategy of attrition" against her call for offensive action ([[thinker:luxemburg]]; [[text:the-mass-strike]]). He did not lead opposition to the party's vote for war credits in August 1914, but soon called for a peace without annexations and in 1917 joined the anti-war Independent Social Democrats (USPD) ([[event:war-credits-1914]]). After 1917 he criticised the Bolshevik regime as a dictatorship of a party over the proletariat; Lenin replied with *The Proletarian Revolution and the Renegade Kautsky* ([[concept:dictatorship-of-the-proletariat]]; [[thinker:lenin]]).[cite:src_salvadori_kautsky][cite:src_mia_kautsky_dictatorship][cite:src_mia_renegade]`,
        context: `Kautsky's Marxism was formed in the years of the Anti-Socialist Laws and the rise of the German Social Democratic Party to the largest party in Germany by votes. His concern to keep that party united, legal and revolutionary in principle shaped his theory ([[event:anti-socialist-laws]]; [[tendency:social-democracy]]).[cite:src_lidtke_outlawed][cite:src_schorske_spd]`,
        legacy: `## Significance

For thirty years Kautsky defined what counted as Marxist orthodoxy — for Lenin as much as for German social democrats. Lenin cited him as an authority in *What Is to Be Done?* (1902) before calling him a renegade in 1918 ([[text:what-is-to-be-done]]).[cite:src_mia_witbd][cite:src_lih_lenin]

## Interpretations and criticisms

**Disputed.** Critics on the left (Luxemburg, Lenin, later Korsch and Lukács) charged him with fatalism: waiting for economic development to deliver socialism. Defenders and recent historians (Salvadori, Lih) stress his democratic commitments and his insistence that revolution required conscious political action.[cite:src_salvadori_kautsky][cite:src_lih_lenin][cite:src_kolakowski]

## Further reading

Gary Steenson's biography; Massimo Salvadori, *Karl Kautsky and the Socialist Revolution*.[cite:src_steenson_kautsky][cite:src_salvadori_kautsky]`,
      },
      flags: [
        { type: "disputed", field: "legacy", note: "Kautsky's reputation as a fatalist is contested in recent scholarship; both readings are attributed." },
        { type: "specialist-review", field: "body", note: "Kautsky's exact advice to the Reichstag group on 3–4 August 1914 is reported differently in the literature; the wording avoids a specific claim. Check against Steenson or Salvadori." },
      ],
    },
    {
      key: "thinker:plekhanov",
      title: "Georgi Plekhanov",
      fields: {
        yearStart: 1856,
        yearEnd: 1918,
        subtitle: "1856–1918",
        roles: "Russian Marxist philosopher and revolutionary; founder of Russian Marxism",
        birthPlace: "Gudalovka, Tambov province, Russian Empire",
        deathPlace: "Terijoki, Finland",
        aliases: "Georgy Valentinovich Plekhanov\nGeorgii Plekhanov\nN. Beltov",
        summary:
          "The populist revolutionary who became the founder of Russian Marxism: he argued that Russia must pass through capitalism, systematised Marxism as a philosophy (“dialectical materialism”), taught a generation including Lenin, and opposed the October Revolution as premature.",
        body: `## Identity

The son of a minor noble family, Plekhanov joined the populist movement in the 1870s. When the populist organisation Land and Liberty split in 1879 over terrorism, he led the faction ("Black Repartition") that rejected it. In 1880 he emigrated, and in exile he became a Marxist.[cite:src_baron_plekhanov]

### Development and works

- **Socialism and the Political Struggle** (1883) and **Our Differences** (1885) argued against the populists that capitalism was already developing in Russia, that the peasant commune would not lead directly to socialism, and that a working-class party must first fight for political liberty.[cite:src_mia_plekhanov_struggle][cite:src_baron_plekhanov]
- In 1883 he founded the **Emancipation of Labour Group** in Geneva with Pavel Axelrod and Vera Zasulich ([[event:emancipation-of-labour-group]]).
- **The Development of the Monist View of History** (1895, published legally under the pseudonym N. Beltov) and **On the Role of the Individual in History** (1898) set out a systematic materialist philosophy of history ([[concept:historical-materialism]]).[cite:src_mia_plekhanov_monist][cite:src_mia_plekhanov_individual]

**Text.** At the founding congress of the Second International he declared that "the revolutionary movement in Russia will triumph only as a working-class movement or else it will never triumph!" ([[event:second-international]])[cite:src_mia_plekhanov_1889]

### Core questions

Can a backward, peasant country go straight to socialism? Plekhanov said no: Russia faced a bourgeois revolution first, and Marxists should organise workers for the struggle beyond it. **Text.** Individuals, he wrote, "can change the individual features of events and some of their particular consequences, but they cannot change their general trend".[cite:src_mia_plekhanov_individual]

### Disagreements

He co-founded *Iskra* with Lenin in 1900, supported him at the party congress of 1903, then sided with the Mensheviks ([[event:bolshevik-menshevik-split]]). In 1914 he supported the Allied war effort. Returning to Russia in 1917, he opposed the Bolshevik seizure of power as premature ([[event:october-revolution]]).[cite:src_baron_plekhanov]`,
        context: `Russian Marxism grew in emigration and in the debate with populism (narodnichestvo), at a time when industry was expanding rapidly in an autocratic, overwhelmingly peasant empire ([[debate:revolution-in-russia]]).[cite:src_walicki][cite:src_baron_plekhanov]`,
        legacy: `## Significance

Plekhanov's writings formed the Marxist education of Lenin and of Russian social democrats of every faction ([[thinker:lenin]]). He is usually credited with coining the term "dialectical materialism" (1891), which became the name of official Soviet philosophy ([[concept:dialectics]]).[cite:src_baron_plekhanov][cite:src_kolakowski]

## Criticisms

**Interpretation.** Critics see in his systematisation the origins of a deterministic "orthodoxy" that treated Marxism as a closed world-view; others value his insistence that Russia's historical conditions limited what any party could achieve. His opposition to October has been read both as dogmatism and as foresight.[cite:src_kolakowski][cite:src_walicki]

## Further reading

Samuel Baron, *Plekhanov: The Father of Russian Marxism*.[cite:src_baron_plekhanov]`,
      },
      flags: [{ type: "specialist-review", field: "legacy", note: "The coinage of “dialectical materialism” is usually attributed to Plekhanov (1891); Joseph Dietzgen used a similar phrase earlier. Check against Baron." }],
    },

    /* ——— Tendency ——— */
    {
      key: "tendency:social-democracy",
      title: "Social Democracy",
      fields: {
        yearStart: 1863,
        periodLabel: "1860s–",
        color: "ochre",
        aliases: "Social Democracy & Revisionism\nSocial-democratic movement\nDemocratic socialism\nSozialdemokratie",
        summary:
          "Before 1914, the name of the Marxist mass parties of the Second International, which combined a revolutionary programme with parliamentary and trade-union practice; after the splits of 1914–19, the reformist tradition that sought socialism, then a regulated capitalism, through parliamentary democracy.",
        body: `## Two meanings

Before 1914 "social democracy" named the whole socialist movement organised in mass parties — the German SPD, the Austrian, the Russian Social Democratic Labour Party — including its revolutionary wing: Lenin and Luxemburg were social democrats ([[thinker:lenin]]; [[thinker:luxemburg]]). After the split over the First World War and the Russian Revolution, communists claimed the revolutionary heritage, and "social democracy" came to mean the reformist, parliamentary tradition.[cite:src_joll_second_international][cite:src_schorske_spd]

### The classical model

The German party set the pattern: a disciplined mass organisation with its own press, trade unions, cooperatives, clubs and schools; a Marxist programme ([[event:erfurt-programme]]); steady electoral growth; and the expectation that capitalism's development would eventually bring socialism.[cite:src_steenson_kautsky][cite:src_schorske_spd]

### Tensions

The gap between a revolutionary programme and reformist everyday practice produced the great disputes of the period: Bernstein's revisionism, the mass-strike debate and the vote for war credits in 1914 ([[concept:revisionism]]; [[debate:reform-or-revolution]]; [[event:war-credits-1914]]).[cite:src_schorske_spd][cite:src_gay_bernstein]`,
        context: `The parties grew under conditions of semi-democratic monarchy (Germany), autocracy (Russia) and parliamentary republic (France), which shaped their attitudes to the state and to reform ([[event:anti-socialist-laws]]; [[event:second-international]]).[cite:src_joll_second_international][cite:src_hobsbawm_empire]`,
        criticisms: `Revolutionary critics accused social democracy of accommodating itself to capitalism and nationalism, a charge they saw confirmed in August 1914. Liberal and conservative critics saw its revolutionary language as a threat to parliamentary order. Historians debate how far the parties' radical rhetoric was ever matched by revolutionary intent.[cite:src_schorske_spd][cite:src_kolakowski]`,
        legacy: `After 1918 social-democratic parties governed in several European states, built welfare states after 1945 and, in most cases, abandoned the goal of social ownership (the German SPD's Bad Godesberg programme of 1959 is the usual landmark). That later history lies beyond this corpus.[cite:src_sassoon_hundred_years]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample tendency (“Social Democracy & Revisionism”); the old title is kept as an alias. Revisionism now has its own concept entry." }],
    },

    /* ——— Events ——— */
    {
      key: "event:anti-socialist-laws",
      title: "Bismarck's Anti-Socialist Laws",
      fields: {
        subtitle: "Law against the Publicly Dangerous Endeavours of Social Democracy",
        yearStart: 1878,
        yearEnd: 1890,
        dateLabel: "October 1878 – September 1890",
        place: "German Empire",
        eventType: "repression",
        summary:
          "The legislation by which Bismarck banned socialist organisations, meetings and newspapers in Germany for twelve years. The party survived underground and in exile, kept its seats in the Reichstag, and emerged stronger — and more Marxist.",
        body: `## What happened

After two attempts on the life of Emperor Wilhelm I in 1878 — neither the work of social democrats — Bismarck carried a law banning socialist associations, meetings and publications. It was renewed repeatedly until it lapsed in 1890.[cite:src_lidtke_outlawed]

Party members were expelled from cities, imprisoned or driven into exile; the party newspaper *Der Sozialdemokrat* was printed in Zurich and later London and smuggled into Germany. Because socialists could still stand for the Reichstag as individuals, the parliamentary group became the party's legal centre. Bismarck combined repression with the first state social insurance schemes (1883–89).[cite:src_lidtke_outlawed][cite:src_hobsbawm_empire]`,
        significance: `Persecution radicalised the party's self-understanding: the state appeared as the instrument of the ruling classes, which made Marxist theory more persuasive, while electoral success encouraged legal methods. When the law lapsed, the party took the name Social Democratic Party of Germany and adopted the Erfurt Programme ([[event:erfurt-programme]]; [[tendency:social-democracy]]).[cite:src_lidtke_outlawed][cite:src_steenson_kautsky]`,
      },
    },
    {
      key: "event:emancipation-of-labour-group",
      title: "The Emancipation of Labour Group is founded",
      fields: {
        subtitle: "Gruppa “Osvobozhdenie truda”",
        yearStart: 1883,
        yearEnd: 1903,
        dateLabel: "1883–1903",
        place: "Geneva",
        eventType: "founding",
        summary:
          "The first Russian Marxist organisation, founded in Geneva by former populists around Plekhanov. It translated Marx and Engels into Russian and argued, against populism, that Russia's road to socialism lay through capitalism and the working class.",
        body: `## What happened

In 1883 Georgi Plekhanov, Pavel Axelrod, Vera Zasulich, Lev Deutsch and Vasily Ignatov — émigrés from the populist movement — formed the group in Geneva ([[thinker:plekhanov]]).[cite:src_baron_plekhanov]

The group published Russian translations of Marx and Engels — Plekhanov's translation of the *Communist Manifesto* had appeared in 1882 with a new preface by Marx and Engels ([[text:communist-manifesto]]) — and polemics against populism, smuggled into Russia. It joined the editorial board of *Iskra* in 1900 and dissolved into the Russian Social Democratic Labour Party at its congress of 1903 ([[event:bolshevik-menshevik-split]]).[cite:src_baron_plekhanov][cite:src_harding_lenin]`,
        significance: `The group made Marxism a current within the Russian revolutionary movement. Its argument — capitalism first, a working-class party, a bourgeois-democratic revolution before a socialist one — framed every later Russian debate, including Lenin's ([[debate:revolution-in-russia]]). Marx himself had written more cautiously about the peasant commune in his 1881 drafts to Zasulich.[cite:src_mia_zasulich][cite:src_shanin_late_marx][cite:src_walicki]`,
      },
      flags: [{ type: "specialist-review", field: "body", note: "Check the attribution of the 1882 Russian translation of the Manifesto (usually credited to Plekhanov) and the membership list against Baron." }],
    },
    {
      key: "event:second-international",
      title: "The Second International is founded",
      fields: {
        subtitle: "International Socialist Congress, Paris",
        yearStart: 1889,
        yearEnd: 1914,
        dateLabel: "Founded 14 July 1889; collapsed 1914",
        place: "Paris",
        eventType: "founding",
        summary:
          "A congress of socialist parties and unions in Paris, on the centenary of the storming of the Bastille, founded a new International. Federal and largely Marxist, it was the world of Kautsky, Bernstein, Luxemburg and Lenin until the war of 1914 broke it apart.",
        body: `## What happened

Two rival congresses met in Paris in July 1889; the Marxist one, attended by delegates from some twenty countries, became the founding congress of the new International. It called for an international demonstration for the eight-hour day on 1 May 1890 — the origin of May Day as a workers' holiday.[cite:src_joll_second_international]

Unlike the First International it was a federation of national parties. Congresses met every few years (Brussels 1891, Zurich 1893, London 1896, Paris 1900, Amsterdam 1904, Stuttgart 1907, Copenhagen 1910); a permanent International Socialist Bureau was set up in Brussels in 1900. Anarchists were excluded by 1896.[cite:src_joll_second_international][cite:src_hobsbawm_empire]

**Text.** Plekhanov told the founding congress that the Russian revolution would triumph "only as a working-class movement".[cite:src_mia_plekhanov_1889]`,
        significance: `The International debated revisionism (condemned at Amsterdam, 1904), colonialism, the mass strike and, above all, war. Its resolutions committed parties to oppose war, but in August 1914 most of them supported their national governments ([[event:basel-congress]]; [[event:war-credits-1914]]; [[debate:socialists-and-the-war]]).[cite:src_joll_second_international][cite:src_haupt_war]`,
      },
      flags: [{ type: "sample-overlap", note: "Replaces the seeded sample event." }],
    },
    {
      key: "event:erfurt-programme",
      title: "The Erfurt Programme",
      fields: {
        subtitle: "Programme of the Social Democratic Party of Germany",
        yearStart: 1891,
        yearEnd: 1891,
        dateLabel: "14–20 October 1891",
        place: "Erfurt",
        eventType: "congress",
        summary:
          "The programme adopted by the German Social Democratic Party after the end of the Anti-Socialist Laws: a Marxist analysis of capitalism by Kautsky followed by a list of democratic and social reforms by Bernstein. It became the model programme of the Second International.",
        body: `## What happened

The congress at Erfurt replaced the Gotha programme of 1875 ([[event:gotha-unity-congress]]). Kautsky drafted the theoretical first part and Bernstein the practical demands ([[thinker:kautsky]]; [[thinker:bernstein]]).[cite:src_steenson_kautsky]

**Text.** The theoretical part states that "the economic development of bourgeois society invariably leads to the ruin of small business", that the struggle of the working class "is necessarily a political struggle", and that it "cannot bring about the transfer of the means of production into the possession of the community without first having obtained political power".[cite:src_mia_erfurt_program]

The second part demanded universal, equal and direct suffrage for all adults "without distinction of sex", proportional representation, a militia in place of the standing army, secular and free schooling, graduated income and property taxes, a working day of no more than eight hours and protective labour laws.[cite:src_mia_erfurt_program]`,
        significance: `**Interpretation.** The programme joined a prediction of capitalist polarisation and social revolution to immediate demands achievable under the existing state — a combination that critics on both sides saw as a contradiction, and that Bernstein's revisionism soon made explicit ([[concept:revisionism]]; [[tendency:social-democracy]]). Engels's critique of the draft (1891), and his publication of Marx's *Critique of the Gotha Programme* the same year, sought to sharpen its political demands ([[text:critique-of-the-gotha-programme]]).[cite:src_steenson_kautsky][cite:src_gay_bernstein]`,
      },
    },

    /* ——— Debate ——— */
    {
      key: "debate:what-is-historical-materialism",
      title: "What does historical materialism claim?",
      fields: {
        summary:
          "Is history driven by the development of production? Does the economy determine politics and ideas? Must societies pass through fixed stages? Marxists have disagreed about these questions since the 1890s.",
        intro:
          "The 1859 Preface states the materialist conception of history in a few compressed sentences. Whether it describes a mechanism, a research programme or a looser emphasis on material life is still debated — and the answer shapes what Marxists think politics can achieve.",
        body: `## Background

Marx never wrote a treatise on historical materialism. Its classic statement is the 1859 Preface, which describes an economic structure — relations of production corresponding to a stage of the productive forces — as the foundation on which a legal and political superstructure rises ([[text:contribution-critique-political-economy]]; [[concept:historical-materialism]]).[cite:src_mia_preface_1859]

**Text.** Late in life Engels complained that younger socialists used the theory "as an excuse for not studying history", and insisted that the economic element was only "ultimately" determining.[cite:src_mia_engels_schmidt_1890][cite:src_mia_engels_bloch]

The Second International turned the theory into a doctrine of historical development: Kautsky and Plekhanov presented it as a science of social evolution that made socialism inevitable; Bernstein argued that ideas and ethics were gaining independence from the economy ([[thinker:kautsky]]; [[thinker:plekhanov]]; [[thinker:bernstein]]).[cite:src_mia_kautsky_class_struggle][cite:src_mia_plekhanov_monist][cite:src_mia_bernstein_evsoc]

In the twentieth century the argument continued: G. A. Cohen's functional reading defended a strong "primacy of the productive forces"; others read the theory as a looser guide to research.[cite:src_cohen_history][cite:src_kolakowski]`,
        context: `The question mattered politically. If history moved by necessity through stages, Russian Marxists had to wait for capitalism to mature and German socialists could wait for capitalism to collapse; if it did not, political will and organisation counted for more ([[debate:revolution-in-russia]]; [[debate:reform-or-revolution]]).[cite:src_walicki][cite:src_kolakowski]`,
      },
    },
  ],

  debates: [
    {
      debate: "debate:what-is-historical-materialism",
      propositions: [
        { key: "forces", statement: "The development of the productive forces is the main driver of historical change." },
        { key: "base", statement: "The economic structure determines politics, law and ideas, at least “in the last instance”." },
        { key: "stages", statement: "Societies must pass through a fixed sequence of stages." },
        { key: "agency", statement: "Conscious political action can change the direction of history." },
        { key: "science", statement: "Historical materialism is a science comparable to the natural sciences." },
      ],
      positions: [
        {
          key: "marx-1859",
          label: "Marx (1859 Preface)",
          holder: "thinker:marx",
          centralClaim: "The economic structure of society — relations of production corresponding to a stage of the productive forces — is the real foundation on which a legal and political superstructure rises.",
          summary:
            "The Preface ties epochs of social revolution to conflicts between productive forces and relations of production. Elsewhere Marx stressed that people make their own history under given conditions, and in 1877 he rejected turning his account of Western Europe into a universal path.",
          assumptions: ["Material production is the basis of social life.", "Social relations can fetter the development of productive forces."],
          criticisms: ["The Preface is brief and was written for a censored public; how literally to take it is disputed."],
          links: ["text:contribution-critique-political-economy", "text:eighteenth-brumaire"],
          stances: {
            forces: ["affirms", "The Preface presents conflicts between forces and relations as the source of social revolutions."],
            base: ["affirms", "The economic structure is called the 'real foundation'."],
            stages: ["qualified", "The Preface lists Asiatic, ancient, feudal and bourgeois modes; the 1877 letter denies a universal path."],
            agency: ["qualified", "People make their own history, but not under circumstances they choose (1852)."],
            science: ["qualified", "Economic conditions can be determined 'with the precision of natural science'; ideological forms cannot."],
          },
        },
        {
          key: "engels-late",
          label: "Engels (letters of the 1890s)",
          holder: "thinker:engels",
          centralClaim: "The production and reproduction of real life is the 'ultimately determining element' in history, but political, legal and ideological factors act back upon it.",
          summary:
            "Engels defended the theory against crude economic determinism, presenting it as a guide to historical study rather than a formula. He accepted some blame for the overemphasis on economics in his and Marx's polemical writings.",
          assumptions: ["Historical outcomes result from many interacting wills and forces."],
          criticisms: ["Critics ask what 'ultimately' adds if non-economic factors can be decisive in particular cases."],
          links: ["text:socialism-utopian-and-scientific"],
          stances: {
            forces: ["affirms", "Economic development is the ultimately decisive factor."],
            base: ["qualified", "Determination only 'in the last instance'; the superstructure reacts back."],
            stages: ["qualified", "Endorsed a general sequence but warned against schematic use."],
            agency: ["qualified", "History is made by people, though outcomes are not what any individual wills."],
            science: ["affirms", "'With these discoveries, Socialism became a science.'"],
          },
        },
        {
          key: "kautsky",
          label: "Kautsky (Second International orthodoxy)",
          holder: "thinker:kautsky",
          centralClaim: "Economic development makes the socialist transformation of society inevitable; the party's task is to organise the working class to carry it out.",
          summary:
            "In The Class Struggle (1892) Kautsky wrote that irresistible economic forces were leading capitalism to shipwreck — while denying that the revolution would accomplish itself without workers' action.",
          assumptions: ["Capitalist development concentrates capital and enlarges the proletariat.", "The proletariat will become the majority."],
          criticisms: ["Charged by left critics with fatalism and passivity.", "Revisionists argued that the predicted polarisation was not happening."],
          stances: {
            forces: ["affirms", "Economic evolution drives social change."],
            base: ["affirms", "Politics and ideas follow economic development."],
            stages: ["affirms", "Socialism presupposes developed capitalism."],
            agency: ["qualified", "Organisation is essential, but the party does not 'make' the revolution."],
            science: ["affirms", "Presented Marxism as a science of social development close to Darwinism."],
          },
        },
        {
          key: "plekhanov",
          label: "Plekhanov ('monism')",
          holder: "thinker:plekhanov",
          centralClaim: "History is governed by the development of the productive forces; individuals can affect the particular features of events but not their general trend.",
          summary:
            "Plekhanov systematised historical materialism as a 'monist' philosophy, with social psychology and ideology mediating between economics and ideas. Politically, it implied that Russia must pass through capitalism before socialism.",
          assumptions: ["A single principle — material production — explains social development."],
          criticisms: ["Critics see the origin of a closed, deterministic 'orthodoxy'."],
          links: ["event:emancipation-of-labour-group"],
          stances: {
            forces: ["affirms", "The productive forces are the ultimate cause."],
            base: ["affirms", "Ideas are explained through mediations, but ultimately by the economy."],
            stages: ["affirms", "Russia faced a bourgeois revolution before a socialist one."],
            agency: ["qualified", "Great individuals change features, not the general trend."],
            science: ["affirms", "A scientific, materialist philosophy of history."],
          },
        },
        {
          key: "bernstein",
          label: "Bernstein (revisionism)",
          holder: "thinker:bernstein",
          centralClaim: "As societies develop, ideological and especially ethical factors gain greater independence from the economy; the theory must be freed of determinism and of Hegelian dialectics.",
          summary:
            "Bernstein accepted a materialist starting point but argued that the economy's grip on ideas was weakening, that capitalism was not polarising as predicted, and that socialism needed ethical justification.",
          assumptions: ["Democracy and rising living standards change the conditions Marx described."],
          criticisms: ["Orthodox critics said he abandoned the theory's core while keeping its name."],
          stances: {
            forces: ["qualified", "Economic factors remain important but less directly decisive."],
            base: ["rejects", "Ideological and ethical factors gain room for independent activity."],
            stages: ["rejects", "No inevitable collapse or fixed path to socialism."],
            agency: ["affirms", "Socialism is a goal to be pursued through democratic reform."],
            science: ["qualified", "Accepted empirical social science; rejected dialectical necessity."],
          },
        },
      ],
      arguments: [
        { key: "a1", position: "marx-1859", kind: "argument", body: "Every major transformation of social order — the end of feudalism, the rise of capitalism — followed long changes in how people produced. A theory that starts there explains more than one that starts from ideas or great men." },
        { key: "c1", kind: "counterargument", respondsTo: "a1", body: "Max Weber argued that religious ideas, such as the Protestant ethic, helped shape the rise of capitalism: causation runs in both directions, and economic primacy cannot be assumed in advance." },
        { key: "a2", position: "engels-late", kind: "argument", body: "'Ultimately determining' does not mean 'only determining': the theory directs historians to material conditions without denying that politics, law and ideas have real effects." },
        { key: "c2", kind: "counterargument", respondsTo: "a2", body: "If the economy determines only 'in the last instance', and that instance never arrives in a particular case, critics such as Karl Popper argued that the theory risks becoming unfalsifiable." },
        { key: "a3", position: "plekhanov", kind: "argument", body: "Russia's peasant commune was already dissolving under capitalism; hoping to skip capitalism ignored the real direction of development and left socialists without a social base." },
        { key: "c3", kind: "counterargument", respondsTo: "a3", body: "Marx himself, in his drafts to Vera Zasulich (1881), allowed that the Russian commune might become a starting point for communist development if a revolution in the West came to its aid." },
        { key: "a4", position: "bernstein", kind: "argument", body: "Where workers have the vote, unions and a free press, the course of history depends increasingly on what people choose; socialism must be argued for as a moral goal, not awaited as a necessity." },
        { key: "c4", position: "kautsky", kind: "counterargument", respondsTo: "a4", body: "Orthodox Marxists replied that the ethical turn left socialism without a guarantee of its own possibility and blurred the difference between socialist and liberal politics." },
      ],
    },
  ],

  relationships: [
    // Thinkers
    { from: "thinker:engels", type: "INFLUENCED", to: "thinker:kautsky", note: "Close collaboration in London in the 1880s; Engels guided Kautsky's early work.", source: "src_steenson_kautsky", yearStart: 1881, yearEnd: 1895, weight: 3, on: "thinker:kautsky" },
    { from: "thinker:engels", type: "INFLUENCED", to: "thinker:plekhanov", note: "Plekhanov's Marxism was shaped by Engels's popular works and correspondence.", source: "src_baron_plekhanov", on: "thinker:plekhanov" },
    { from: "thinker:kautsky", type: "MEMBER_OF", to: "tendency:marxism", note: "The leading theorist of Second International orthodoxy.", source: "src_steenson_kautsky", weight: 3 },
    { from: "thinker:kautsky", type: "MEMBER_OF", to: "tendency:social-democracy", note: "German social democracy from the 1880s; USPD 1917–22.", source: "src_steenson_kautsky", weight: 3 },
    { from: "thinker:plekhanov", type: "MEMBER_OF", to: "tendency:marxism", note: "Founder of Russian Marxism.", source: "src_baron_plekhanov", weight: 3 },
    { from: "thinker:plekhanov", type: "MEMBER_OF", to: "tendency:social-democracy", note: "Russian Social Democratic Labour Party; Menshevik after 1903.", source: "src_baron_plekhanov" },
    { from: "thinker:plekhanov", type: "INFLUENCED", to: "thinker:lenin", note: "Lenin's Marxist education drew heavily on Plekhanov's writings; they co-founded Iskra in 1900.", source: "src_harding_lenin", weight: 3 },
    { from: "thinker:kautsky", type: "INFLUENCED", to: "thinker:lenin", note: "What Is to Be Done? cites Kautsky as an authority.", source: "src_lih_lenin", weight: 2 },
    { from: "thinker:kautsky", type: "DEVELOPED", to: "concept:historical-materialism", note: "Systematised it as a theory of social evolution.", source: "src_mia_kautsky_class_struggle", on: "thinker:kautsky" },
    { from: "thinker:plekhanov", type: "DEVELOPED", to: "concept:historical-materialism", note: "The 'monist view of history' (1895).", source: "src_mia_plekhanov_monist" },
    { from: "thinker:plekhanov", type: "DEVELOPED", to: "concept:dialectics", note: "Usually credited with coining 'dialectical materialism'.", source: "src_baron_plekhanov", basis: "interpretive" },
    { from: "thinker:kautsky", type: "CRITIQUED", to: "thinker:lenin", note: "Criticised Bolshevik rule as a dictatorship of a party (1918).", source: "src_mia_kautsky_dictatorship", yearStart: 1918 },
    { from: "thinker:lenin", type: "CRITIQUED", to: "thinker:kautsky", note: "The Proletarian Revolution and the Renegade Kautsky (1918).", source: "src_mia_renegade", yearStart: 1918, on: "thinker:kautsky" },
    { from: "thinker:plekhanov", type: "CRITIQUED", to: "thinker:lenin", note: "Opposed the Bolshevik seizure of power as premature.", source: "src_baron_plekhanov", yearStart: 1917 },

    // Events
    { from: "thinker:kautsky", type: "PARTICIPATED_IN", to: "event:erfurt-programme", note: "Drafted the theoretical part.", source: "src_steenson_kautsky", yearStart: 1891, weight: 3 },
    { from: "thinker:bernstein", type: "PARTICIPATED_IN", to: "event:erfurt-programme", note: "Drafted the practical demands.", source: "src_steenson_kautsky", yearStart: 1891, on: "event:erfurt-programme" },
    { from: "thinker:engels", type: "CRITIQUED", to: "event:erfurt-programme", note: "Engels's critique of the draft (1891) pressed for clearer political demands.", source: "src_hunt_engels", yearStart: 1891, on: "event:erfurt-programme" },
    { from: "thinker:plekhanov", type: "PARTICIPATED_IN", to: "event:emancipation-of-labour-group", note: "Founder.", source: "src_baron_plekhanov", yearStart: 1883, weight: 3 },
    { from: "thinker:plekhanov", type: "PARTICIPATED_IN", to: "event:second-international", note: "Spoke at the founding congress of 1889.", source: "src_mia_plekhanov_1889", yearStart: 1889 },
    { from: "thinker:engels", type: "ASSOCIATED_WITH", to: "event:second-international", note: "Supported the Marxist congress of 1889 from London and addressed the Zurich congress of 1893.", source: "src_hunt_engels", on: "event:second-international" },
    { from: "event:gotha-unity-congress", type: "PRECEDES", to: "event:anti-socialist-laws", note: "The united party was banned in 1878.", source: "src_lidtke_outlawed", on: "event:anti-socialist-laws" },
    { from: "event:anti-socialist-laws", type: "PRECEDES", to: "event:erfurt-programme", note: "The programme followed the lapse of the law in 1890.", source: "src_lidtke_outlawed" },
    { from: "event:first-international", type: "PRECEDES", to: "event:second-international", note: "The Second International was organised as a federation of national parties.", source: "src_joll_second_international", on: "event:second-international" },
    { from: "event:erfurt-programme", type: "INFLUENCED", to: "tendency:social-democracy", note: "Model programme for parties of the Second International.", source: "src_steenson_kautsky", weight: 3 },
    { from: "event:second-international", type: "ASSOCIATED_WITH", to: "tendency:social-democracy", note: "The federation of social-democratic parties.", source: "src_joll_second_international" },
    { from: "event:erfurt-programme", type: "ASSOCIATED_WITH", to: "concept:class-struggle", note: "Its theoretical part was expounded by Kautsky as The Class Struggle.", source: "src_mia_kautsky_class_struggle" },
    { from: "text:critique-of-the-gotha-programme", type: "INFLUENCED", to: "event:erfurt-programme", note: "Engels published Marx's critique in 1891 as the new programme was drafted.", source: "src_steenson_kautsky", basis: "interpretive", on: "event:erfurt-programme" },
    { from: "event:emancipation-of-labour-group", type: "PRECEDES", to: "event:bolshevik-menshevik-split", note: "The group merged into the RSDLP at the 1903 congress where the split occurred.", source: "src_baron_plekhanov" },
    { from: "tendency:marxism", type: "INFLUENCED", to: "event:emancipation-of-labour-group", note: "The group's programme applied Marxism to Russia.", source: "src_baron_plekhanov", on: "event:emancipation-of-labour-group" },

    // Debate
    { from: "debate:what-is-historical-materialism", type: "DISCUSSES", to: "concept:historical-materialism", note: "The central question.", source: "src_mia_preface_1859", weight: 3 },
    { from: "debate:what-is-historical-materialism", type: "DISCUSSES", to: "concept:productive-forces", note: "The primacy of the productive forces.", source: "src_cohen_history" },
    { from: "debate:what-is-historical-materialism", type: "DISCUSSES", to: "concept:relations-of-production", note: "Base and superstructure.", source: "src_mia_preface_1859" },
    { from: "debate:what-is-historical-materialism", type: "DISCUSSES", to: "concept:mode-of-production", note: "Whether there is a fixed sequence of modes.", source: "src_mia_letter_1877" },
    { from: "debate:what-is-historical-materialism", type: "DISCUSSES", to: "text:contribution-critique-political-economy", note: "The 1859 Preface is the classic statement.", source: "src_mia_preface_1859" },
    { from: "debate:what-is-historical-materialism", type: "DISCUSSES", to: "event:emancipation-of-labour-group", note: "The Russian stakes of the debate.", source: "src_baron_plekhanov" },
  ],

  excerpts: [
    {
      key: "engels-bloch-ultimately",
      entity: "concept:historical-materialism",
      speaker: "thinker:engels",
      body: "According to the materialist conception of history, the ultimately determining element in history is the production and reproduction of real life. Other than this neither Marx nor I have ever asserted. Hence if somebody twists this into saying that the economic element is the only determining one, he transforms that proposition into a meaningless, abstract, senseless phrase.",
      source: "src_mia_engels_bloch",
      locator: "Letter of 21–22 September 1890",
      note: "Translations differ (“More than this…”); this follows the marxists.org text.",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1890/letters/90_09_21.htm",
    },
    {
      key: "kautsky-revolution-making",
      entity: "thinker:kautsky",
      speaker: "thinker:kautsky",
      body: "The Socialist party is a revolutionary party, but not a revolution-making party. We know that our goal can be attained only through a revolution. We also know that it is just as little in our power to create this revolution as it is in the power of our opponents to prevent it.",
      source: "src_mia_kautsky_road",
      locator: "Ch. 5, quoting Kautsky's article in Die Neue Zeit, December 1893",
      note: "From the abridged English translation of The Road to Power (1909); check against the German.",
      archiveUrl: "https://www.marxists.org/archive/kautsky/1909/power/ch05.htm",
    },
    {
      key: "kautsky-certainty-of-doom",
      entity: "debate:what-is-historical-materialism",
      speaker: "thinker:kautsky",
      body: "The capitalist social system has run its course; its dissolution is now only a question of time. Irresistible economic forces lead with the certainty of doom to the shipwreck of capitalist production.",
      source: "src_mia_kautsky_class_struggle",
      locator: "Ch. IV, “The Commonwealth of the Future”",
      note: "Translation by William E. Bohn (1910). In the same chapter Kautsky denies that the revolution “will be accomplished of itself”.",
      archiveUrl: "https://www.marxists.org/archive/kautsky/1892/erfurt/ch04.htm",
    },
    {
      key: "plekhanov-general-trend",
      entity: "thinker:plekhanov",
      speaker: "thinker:plekhanov",
      body: "Owing to the specific qualities of their minds and characters, influential individuals can change the individual features of events and some of their particular consequences, but they cannot change their general trend, which is determined by other forces.",
      source: "src_mia_plekhanov_individual",
      locator: "Section VI",
      archiveUrl: "https://www.marxists.org/archive/plekhanov/1898/xx/individual.html",
    },
    {
      key: "plekhanov-1889-working-class",
      entity: "event:emancipation-of-labour-group",
      speaker: "thinker:plekhanov",
      body: "In conclusion I repeat – and I insist on this important point: the revolutionary movement in Russia will triumph only as a working-class movement or else it will never triumph!",
      source: "src_mia_plekhanov_1889",
      locator: "Closing words",
      archiveUrl: "https://www.marxists.org/archive/plekhanov/1889/07/speech.html",
    },
    {
      key: "bernstein-ethical-factors",
      entity: "debate:what-is-historical-materialism",
      speaker: "thinker:bernstein",
      body: "the point of economic development attained to-day leaves the ideological, and especially the ethical, factors greater space for independent activity than was formerly the case.",
      source: "src_mia_bernstein_evsoc",
      locator: "Ch. I",
      note: "From the abridged English translation (Evolutionary Socialism, 1909).",
      archiveUrl: "https://www.marxists.org/reference/archive/bernstein/works/1899/evsoc/ch01.htm",
    },
    {
      key: "erfurt-political-power",
      entity: "event:erfurt-programme",
      body: "It cannot bring about the transfer of the means of production into the possession of the community without first having obtained political power.",
      source: "src_mia_erfurt_program",
      locator: "Part I",
      note: "Translation by Thomas Dunlap (German History in Documents and Images), as reproduced on marxists.org.",
      archiveUrl: "https://www.marxists.org/history/international/social-democracy/1891/erfurt-program.htm",
    },
  ],
};
