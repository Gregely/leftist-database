import type { CorpusBatch } from "../../src/lib/corpus/types";

/**
 * Batch m5 — War and revolution, 1914–17: the death of Jaurès, the arguments
 * of the anti-war minorities (revolutionary defeatism, the Junius pamphlet),
 * dual power and the April Theses; with review notes on existing entries
 * where the new research bears on them, and links from the new entries to
 * the existing war and 1917 entries.
 */
export const batchM5: CorpusBatch = {
  id: "m5",
  title: "War and revolution, 1914–17",
  entities: [
    {
      key: "event:assassination-of-jaures",
      title: "The assassination of Jaurès",
      fields: {
        yearStart: 1914,
        subtitle: "The death of French socialism's leader on the eve of war",
        dateLabel: "31 July 1914",
        place: "Café du Croissant, Paris",
        eventType: "crisis",
        summary:
          "Jean Jaurès was shot dead in a Paris café by a young nationalist, Raoul Villain, three days after the International's leaders had met in Brussels to try to stop the war. Within days the French socialists voted for war credits and joined the government of national defence.",
        body: `In the last week of July 1914 [[thinker:jaures]] campaigned for peace. On 29 July he spoke with Hugo Haase, Rosa Luxemburg and other leaders at a meeting of the International Socialist Bureau in Brussels, which called on the socialist parties to press their governments for a negotiated settlement and brought forward the International's planned congress.[cite:src_haupt_war][cite:src_ml_goldberg_jaures]

On the evening of 31 July, as he dined with colleagues from *L'Humanité* at the Café du Croissant, he was shot through the window by Raoul Villain, a nationalist student who had been influenced by the right-wing press's campaign against him. Germany declared war on Russia the next day and on France on 3 August.[cite:src_ml_goldberg_jaures]`,
        significance: `On 4 August the French socialist deputies voted for war credits, and at the end of the month Guesde and Marcel Sembat entered the government of national defence, the *union sacrée* ([[thinker:guesde]]; [[concept:ministerialism]]). Whether Jaurès would have opposed the war, once Germany had invaded, is unknowable; historians agree that his death removed the one French socialist with authority across the International ([[debate:socialists-and-the-war]]; [[event:war-credits-1914]]).[cite:src_haupt_war][cite:src_ml_goldberg_jaures]`,
      },
      citations: [{ source: "src_ml_goldberg_jaures" }, { source: "src_haupt_war" }],
    },
    {
      key: "concept:revolutionary-defeatism",
      title: "Revolutionary defeatism",
      fields: {
        yearStart: 1914,
        aliases: "Defeatism\nPorazhenchestvo\nDefeat of one's own government\nTurn the imperialist war into a civil war",
        summary:
          "Lenin's position in the First World War that socialists in each belligerent country should work for the defeat of their own government, because its defeat would weaken it and open the way to revolution. It was rejected by most anti-war socialists, including Trotsky and many Bolsheviks.",
        brief: `When war broke out in 1914, most socialists supported their own countries. Those who opposed the war mostly called for peace. Lenin went further: socialists should want their own government to lose, since defeat would weaken it and give the workers a chance to overthrow it. The war between nations should be turned into a war between classes.`,
        standard: `In his theses of September 1914 and the manifesto *The War and Russian Social-Democracy* [[thinker:lenin]] declared the war imperialist on all sides and called for the "conversion of the present imperialist war into a civil war". For Russia, he wrote, the defeat of the tsarist monarchy would be the lesser evil.[cite:src_mia_lenin_war_1914][cite:src_harding_lenin]

In 1915 he generalised the point: in a reactionary war a revolutionary class cannot but desire the defeat of its own government, and should not be deterred by the fear of helping the enemy. Revolutionary action in wartime would in practice contribute to defeat; socialists in every country should accept that ([[event:zimmerwald-conference]]).[cite:src_ml_lenin_defeat]`,
        deep: `Few anti-war socialists accepted the slogan. [[thinker:trotsky]], who worked closely with Lenin's group in Paris, objected that it implied wishing victory to the other side and offered nothing to the workers of the enemy country; he proposed "neither victory nor defeat" and peace without annexations. At Zimmerwald the slogan was not adopted even by the left, and Bolsheviks in Russia were uneasy with it.[cite:src_ml_deutscher_armed][cite:src_haupt_war]

Historians read it differently. Harding presents it as the logical consequence of Lenin's theory of imperialism; Lih argues that it was a polemical formula, aimed at the "social chauvinists" who justified support for the war by fear of defeat, and that Lenin did not use it in 1917 ([[concept:imperialism]]; [[debate:socialists-and-the-war]]).[cite:src_harding_lenin][cite:src_lih_lenin]`,
        history: `The Russian word *porazhenchestvo* was used mainly by Lenin's opponents; Lenin wrote of the "defeat of one's own government". In 1917 the issue returned as "revolutionary defencism", the position of the Mensheviks and Socialist Revolutionaries that a revolutionary Russia should defend itself, which Lenin's April Theses rejected ([[text:april-theses]]; [[tendency:menshevism]]).[cite:src_mia_april_theses][cite:src_smith_russia]`,
        criticisms: `Opponents argued that the slogan was either meaningless or treasonable, that it handed governments a weapon against the anti-war movement, and that its symmetry was false: the defeat of one side meant the victory of the other. Defenders answered that the slogan was meant to break with the logic of national defence, not to choose a side.[cite:src_ml_deutscher_armed][cite:src_lih_lenin]`,
      },
      citations: [{ source: "src_ml_lenin_defeat" }, { source: "src_mia_lenin_war_1914" }, { source: "src_lih_lenin" }],
      flags: [
        { type: "disputed", field: "deep", note: "Readings of Lenin's defeatism differ (Harding, Lih, Riddell). Check that the entry presents them without deciding; check also Trotsky's formula \"neither victory nor defeat\" against Nashe Slovo or Deutscher." },
      ],
    },
    {
      key: "text:junius-pamphlet",
      title: "The Junius Pamphlet",
      fields: {
        yearStart: 1915,
        subtitle: "Luxemburg's indictment of the war and of German social democracy",
        originalTitle: "Die Krise der Sozialdemokratie",
        language: "German",
        form: "pamphlet",
        publicationNote: "Written in prison, February–April 1915; published illegally in Zurich in April 1916 under the pseudonym Junius",
        edition: "in Rosa Luxemburg Speaks, ed. Mary-Alice Waters (Pathfinder, 1970)",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/luxemburg/1915/junius/index.htm",
        aliases: "Die Krise der Sozialdemokratie\nThe Crisis of German Social Democracy\nThe Crisis of Social Democracy",
        summary:
          "Luxemburg's prison pamphlet against the war. It denounced the war as imperialist on all sides, condemned the SPD's vote of 4 August 1914 as the collapse of the International, and posed the alternative of socialism or barbarism.",
        body: `Luxemburg opens with the scene of August 1914, the crowds and the patriotic press, and then the reality of the war, "bourgeois society" exposed as it is. The SPD's vote for war credits on 4 August had abandoned the resolutions of Stuttgart and Basel, and with them the International ([[event:war-credits-1914]]; [[event:stuttgart-congress]]; [[event:basel-congress]]).[cite:src_mia_junius]

The central chapters take apart the party's justifications: that this was a war of defence against tsarism, that it was a war for national independence, that the working class had to defend its country. Luxemburg argues that German imperialism had prepared the war for years, that every power fought for markets and colonies, and that national defence in such a war was a fiction ([[concept:imperialism]]).[cite:src_mia_junius][cite:src_nettl_luxemburg]

She attributes to Engels the statement that bourgeois society faces a choice between transition to socialism and regression into barbarism, and makes it the pamphlet's conclusion: the world war is that regression, and only the international action of the working class can break it.[cite:src_mia_junius]`,
        context: `Luxemburg wrote it in the Berlin women's prison where she was serving a sentence for anti-militarist speeches. The pamphlet was smuggled out and published a year later, with theses that the Internationale group around Luxemburg and Karl Liebknecht had adopted in January 1916 ([[thinker:luxemburg]]).[cite:src_nettl_luxemburg]

[[thinker:lenin]] reviewed it in 1916, without knowing for certain who Junius was. He praised it as a Marxist work but criticised it for not breaking clearly with the "centre" and for arguing that a national war was impossible in the epoch of imperialism.[cite:src_nettl_luxemburg][cite:src_ml_riddell_struggle]

The words "socialism or barbarism" have not been found in this form in Engels's writings. The nearest earlier statement is in Kautsky's commentary on the Erfurt Programme (1892): capitalist civilisation cannot continue, and society must either move forward into socialism or fall back into barbarism ([[text:the-class-struggle]]).[cite:src_mia_kautsky_class_struggle]`,
      },
      citations: [{ source: "src_mia_junius" }, { source: "src_nettl_luxemburg" }],
      flags: [
        { type: "specialist-review", field: "context", note: "The source of the \"socialism or barbarism\" attribution is debated (Kautsky's Class Struggle, ch. 4; some point to Anti-Dühring). Check against recent scholarship (for example Ian Angus, 2014) before publication." },
      ],
    },
    {
      key: "concept:dual-power",
      title: "Dual power",
      fields: {
        yearStart: 1917,
        aliases: "Dvoevlastie\nDual authority\nDvoyevlastiye",
        summary:
          "Lenin's name for the situation in Russia after February 1917, when the liberal Provisional Government held office while the soviets of workers' and soldiers' deputies held much of the real power. It lasted, in Lenin's view, until July; the Bolsheviks ended it in October.",
        brief: `After the tsar fell in February 1917 there were two authorities in Petrograd. The Provisional Government, formed by liberal members of the Duma, was the official government. The Petrograd Soviet, elected by workers and soldiers, controlled the garrison, the railways and the printing presses, and the government could not act against its will. Lenin called this "dual power" and argued that it could not last: one side or the other would have to win.`,
        standard: `The Provisional Government and the Petrograd Soviet were formed on the same days, 27 February to 2 March 1917, in the same building, the Tauride Palace. The soviet's leaders, Mensheviks and Socialist Revolutionaries, agreed to support the government only to the extent that it carried out the revolution's programme, and its Order No. 1 put the army's weapons and discipline under soldiers' committees ([[event:february-revolution]]; [[concept:soviets]]).[cite:src_smith_russia][cite:src_wade_revolution]

[[thinker:lenin]] described the situation in *Pravda* on 9 April 1917. Alongside the government of the bourgeoisie, another government had arisen, the soviets, a dictatorship of the proletariat and peasantry resting on the armed people. Such a duality could not last; the soviets, still led by parties that trusted the bourgeoisie, would have to take all power ([[text:april-theses]]).[cite:src_ml_lenin_dual_power]`,
        deep: `Dual power passed through crises. In April, Foreign Minister Milyukov's note promising the Allies that Russia would fight on brought soldiers and workers into the streets and forced him out; in May Mensheviks and Socialist Revolutionaries entered a coalition government ([[concept:ministerialism]]; [[tendency:menshevism]]). After the armed demonstrations of the July Days the government suppressed the Bolsheviks, and Lenin wrote that dual power had ended in favour of the bourgeoisie. General Kornilov's failed move on Petrograd at the end of August reversed the balance, and in September the Bolsheviks won majorities in the Petrograd and Moscow soviets ([[event:october-revolution]]).[cite:src_ml_rabinowitch_bolsheviks][cite:src_smith_russia]

Historians have extended the term to describe the whole structure of 1917: not two institutions only, but a society in which factory committees, soldiers' committees, peasant assemblies and national councils all claimed authority.[cite:src_smith_russia][cite:src_wade_revolution]`,
        history: `Lenin's coinage of April 1917. Later Marxists, Trotsky especially, generalised it into a feature of every revolution, which lies outside this collection.[cite:src_ml_lenin_dual_power][cite:src_bottomore_dictionary]`,
      },
      citations: [{ source: "src_ml_lenin_dual_power" }, { source: "src_smith_russia" }, { source: "src_ml_rabinowitch_bolsheviks" }],
    },
    {
      key: "text:april-theses",
      title: "The April Theses",
      fields: {
        yearStart: 1917,
        subtitle: "Lenin's programme on returning to Russia",
        originalTitle: "O zadachakh proletariata v dannoi revolyutsii",
        language: "Russian",
        form: "article",
        publicationNote: "Read to meetings of Bolsheviks and of social democratic delegates in the Tauride Palace, 4 April 1917; published in Pravda, 7 April 1917",
        edition: "Lenin, Collected Works, vol. 24",
        difficulty: "1",
        readingUrl: "https://www.marxists.org/archive/lenin/works/1917/apr/04.htm",
        aliases: "The Tasks of the Proletariat in the Present Revolution\nO zadachakh proletariata v dannoi revolyutsii\nApril Theses",
        summary:
          "Ten short theses Lenin presented the day after his return to Petrograd. They rejected support for the Provisional Government and the war, called for a republic of soviets, and set out first steps towards workers' control. They turned the Bolshevik party against its own leaders' policy and set its course to October.",
        body: `Lenin returned from Switzerland on 3 April 1917, through Germany in a sealed railway carriage, and read the theses the next day ([[thinker:lenin]]).[cite:src_ml_rabinowitch_bolsheviks][cite:src_service_lenin]

The war, the first thesis says, remained imperialist under the new government, and no concession to "revolutionary defencism" was permissible. Russia was passing from the first stage of the revolution, which had put power in the hands of the bourgeoisie, to a second, which must put it in the hands of the proletariat and the poorest peasants. The Provisional Government should get no support. Since the Bolsheviks were a minority in the soviets, their task was patient explanation.[cite:src_mia_april_theses]

The programme followed: not a parliamentary republic but a republic of soviets; abolition of the police, the army and the bureaucracy; confiscation and nationalisation of land; a single national bank under soviet control; not the "introduction" of socialism but soviet control of production and distribution. The party should hold a congress, change its programme, rename itself the Communist Party, and work for a new International ([[concept:soviets]]; [[concept:dual-power]]).[cite:src_mia_april_theses]`,
        context: `The theses broke with the policy of the Petrograd Bolsheviks around Kamenev and Stalin, who had given the government conditional support. *Pravda* published them as Lenin's personal view, and Kamenev answered in its pages that Lenin's scheme was unacceptable because it treated the bourgeois-democratic revolution as finished. Within three weeks, at the party's April conference, Lenin's line won ([[tendency:bolshevism]]).[cite:src_ml_rabinowitch_bolsheviks][cite:src_harding_lenin]

Old Bolsheviks charged Lenin with adopting Trotsky's permanent revolution; Lenin answered that his position followed from the new situation of dual power. Whether the theses changed Bolshevik strategy or applied it to new circumstances is still disputed ([[concept:permanent-revolution]]; [[debate:revolution-in-russia]]).[cite:src_harding_lenin][cite:src_lih_lenin]`,
      },
      citations: [{ source: "src_mia_april_theses" }, { source: "src_ml_rabinowitch_bolsheviks" }],
      flags: [
        { type: "disputed", field: "context", note: "Whether the April Theses rearmed the party (the older view) or continued Old Bolshevik strategy (Lih) is disputed; check the wording. Check also the paraphrase of Kamenev's reply (Pravda, 8 April 1917) against a printed source." },
      ],
    },

    /* ——— Notes on existing entries ——— */
    {
      key: "tendency:leninism",
      title: "Leninism",
      fields: {},
      flags: [
        { type: "specialist-review", note: "Terminology: \"Leninism\" was used before 1917 mainly by Lenin's opponents, and became the name of a doctrine after 1924. The Marx to Lenin Corpus adds a Bolshevism tendency for the faction's history from 1903 to 1917. Editors should decide whether this entry should be scoped to the post-1917 doctrine and link to Bolshevism for the earlier period." },
        { type: "possible-duplicate", field: "aliases", note: "This entry lists \"Bolshevism\" as an alias, which now duplicates the title of the new Bolshevism tendency and makes searches for it ambiguous. Consider removing the alias." },
      ],
    },
    {
      key: "concept:revolution",
      title: "Revolution",
      fields: {},
      flags: [
        { type: "possible-duplicate", field: "aliases", note: "This entry lists \"Permanent revolution\" as an alias. The Marx to Lenin Corpus adds a Permanent revolution entry; consider removing the alias and linking to the new entry instead." },
      ],
    },
    {
      key: "concept:vanguard-party",
      title: "Vanguard party",
      fields: {},
      citations: [{ source: "src_ml_trotsky_tasks", note: "Trotsky's 1904 critique of Lenin's organisational plan." }],
      flags: [
        { type: "specialist-review", note: "The Marx to Lenin Corpus attaches Trotsky's Our Political Tasks (1904) as a source and adds entries for Trotsky, Martov, Menshevism, Bolshevism and Economism. The expression \"vanguard party\" is a later label; check that the entry says so and links to those entries where useful." },
      ],
    },
  ],
  relationships: [
    // Jaurès's death
    { from: "event:assassination-of-jaures", type: "ASSOCIATED_WITH", to: "thinker:jaures", note: "Shot on 31 July 1914.", source: "src_ml_goldberg_jaures", yearStart: 1914, weight: 3, on: "event:assassination-of-jaures" },
    { from: "event:assassination-of-jaures", type: "PRECEDES", to: "event:war-credits-1914", note: "Four days before the votes of 4 August.", source: "src_haupt_war", yearStart: 1914, on: "event:assassination-of-jaures" },
    { from: "event:assassination-of-jaures", type: "RELATED_TO", to: "debate:socialists-and-the-war", note: "The International lost its leading opponent of war.", source: "src_haupt_war", basis: "interpretive", on: "event:assassination-of-jaures" },
    // Defeatism
    { from: "thinker:lenin", type: "DEVELOPED", to: "concept:revolutionary-defeatism", note: "From September 1914.", source: "src_ml_lenin_defeat", yearStart: 1914, weight: 3, on: "concept:revolutionary-defeatism" },
    { from: "thinker:trotsky", type: "CRITIQUED", to: "concept:revolutionary-defeatism", note: "Rejected the slogan while opposing the war.", source: "src_ml_deutscher_armed", yearStart: 1915, on: "concept:revolutionary-defeatism" },
    { from: "concept:revolutionary-defeatism", type: "RELATED_TO", to: "debate:socialists-and-the-war", note: "Lenin's position in the debate.", source: "src_ml_lenin_defeat", weight: 3, on: "concept:revolutionary-defeatism" },
    { from: "concept:revolutionary-defeatism", type: "RELATED_TO", to: "event:zimmerwald-conference", note: "Not adopted at Zimmerwald, even by the left.", source: "src_haupt_war", on: "concept:revolutionary-defeatism" },
    { from: "concept:revolutionary-defeatism", type: "RELATED_TO", to: "concept:imperialism", note: "Follows from treating the war as imperialist on all sides.", source: "src_harding_lenin", basis: "interpretive", on: "concept:revolutionary-defeatism" },
    { from: "tendency:bolshevism", type: "ASSOCIATED_WITH", to: "concept:revolutionary-defeatism", note: "Lenin's line, accepted with reservations.", source: "src_lih_lenin", yearStart: 1914, on: "concept:revolutionary-defeatism" },
    // Junius
    { from: "thinker:luxemburg", type: "WROTE", to: "text:junius-pamphlet", note: "Written in prison in 1915.", source: "src_mia_junius", yearStart: 1915, weight: 3, on: "text:junius-pamphlet" },
    { from: "text:junius-pamphlet", type: "CRITIQUED", to: "event:war-credits-1914", note: "The vote as the collapse of the International.", source: "src_mia_junius", weight: 3, on: "text:junius-pamphlet" },
    { from: "text:junius-pamphlet", type: "RELATED_TO", to: "debate:socialists-and-the-war", note: "Luxemburg's position.", source: "src_mia_junius", weight: 2, on: "text:junius-pamphlet" },
    { from: "text:junius-pamphlet", type: "DISCUSSES", to: "concept:imperialism", note: "The war as imperialist on all sides.", source: "src_mia_junius", on: "text:junius-pamphlet" },
    { from: "thinker:lenin", type: "CRITIQUED", to: "text:junius-pamphlet", note: "Reviewed it in 1916.", source: "src_ml_riddell_struggle", yearStart: 1916, on: "text:junius-pamphlet" },
    { from: "text:junius-pamphlet", type: "CITES", to: "text:the-class-struggle", note: "Its \"socialism or barbarism\" is closest to a sentence of Kautsky's (1892).", source: "src_mia_kautsky_class_struggle", basis: "interpretive", on: "text:junius-pamphlet", flag: { type: "uncertain-relationship", note: "Luxemburg attributes the phrase to Engels; the link to Kautsky is a scholarly reconstruction." } },
    // Dual power and the April Theses
    { from: "thinker:lenin", type: "DEVELOPED", to: "concept:dual-power", note: "Pravda, 9 April 1917.", source: "src_ml_lenin_dual_power", yearStart: 1917, weight: 3, on: "concept:dual-power" },
    { from: "event:february-revolution", type: "ASSOCIATED_WITH", to: "concept:dual-power", note: "Provisional Government and Petrograd Soviet.", source: "src_smith_russia", yearStart: 1917, weight: 3, on: "concept:dual-power" },
    { from: "concept:dual-power", type: "RELATED_TO", to: "concept:soviets", note: "The soviets as the second power.", source: "src_ml_lenin_dual_power", weight: 3, on: "concept:dual-power" },
    { from: "concept:dual-power", type: "PRECEDES", to: "event:october-revolution", note: "Ended when the soviets took power.", source: "src_ml_rabinowitch_bolsheviks", on: "concept:dual-power" },
    { from: "concept:dual-power", type: "RELATED_TO", to: "concept:ministerialism", note: "Socialists entered the coalition government in May 1917.", source: "src_smith_russia", on: "concept:dual-power" },
    { from: "thinker:lenin", type: "WROTE", to: "text:april-theses", note: "4 April 1917.", source: "src_mia_april_theses", yearStart: 1917, weight: 3, on: "text:april-theses" },
    { from: "text:april-theses", type: "DISCUSSES", to: "concept:soviets", note: "A republic of soviets.", source: "src_mia_april_theses", weight: 3, on: "text:april-theses" },
    { from: "text:april-theses", type: "DISCUSSES", to: "concept:dual-power", note: "No support for the Provisional Government.", source: "src_mia_april_theses", weight: 2, on: "text:april-theses" },
    { from: "text:april-theses", type: "RESPONDED_TO", to: "event:february-revolution", note: "The programme for the revolution's second stage.", source: "src_mia_april_theses", weight: 2, on: "text:april-theses" },
    { from: "text:april-theses", type: "PRECEDES", to: "event:october-revolution", note: "Set the party's course.", source: "src_ml_rabinowitch_bolsheviks", weight: 2, on: "text:april-theses" },
    { from: "text:april-theses", type: "INFLUENCED", to: "tendency:bolshevism", note: "Adopted at the April conference.", source: "src_ml_rabinowitch_bolsheviks", yearStart: 1917, weight: 2, on: "text:april-theses" },
    { from: "text:april-theses", type: "RELATED_TO", to: "concept:permanent-revolution", note: "Old Bolsheviks charged Lenin with adopting Trotsky's theory.", source: "src_harding_lenin", basis: "interpretive", on: "text:april-theses", flag: { type: "uncertain-relationship", note: "A contested reading; see the flag on the entry." } },
    { from: "text:april-theses", type: "RELATED_TO", to: "text:the-state-and-revolution", note: "Its demand to abolish police, army and bureaucracy was developed there.", source: "src_state_revolution", on: "text:april-theses" },
    { from: "text:april-theses", type: "RELATED_TO", to: "debate:revolution-in-russia", note: "Lenin's 1917 position.", source: "src_harding_lenin", on: "text:april-theses" },
    { from: "thinker:kollontai", type: "ASSOCIATED_WITH", to: "text:april-theses", note: "Among the first leading Bolsheviks to support them.", source: "src_ml_clements_kollontai", yearStart: 1917, on: "thinker:kollontai" },
    // The war: other new entries in the existing debate
    { from: "thinker:guesde", type: "RELATED_TO", to: "debate:socialists-and-the-war", note: "Joined the war cabinet in August 1914.", source: "src_haupt_war", yearStart: 1914, on: "thinker:guesde" },
    { from: "thinker:martov", type: "RELATED_TO", to: "debate:socialists-and-the-war", note: "Led the Menshevik internationalists.", source: "src_ml_getzler_martov", yearStart: 1914, on: "thinker:martov" },
    { from: "thinker:trotsky", type: "RELATED_TO", to: "debate:socialists-and-the-war", note: "Peace without annexations; neither victory nor defeat.", source: "src_ml_deutscher_armed", yearStart: 1914, on: "thinker:trotsky" },
    { from: "thinker:zetkin", type: "RELATED_TO", to: "debate:socialists-and-the-war", note: "Convened the women's anti-war conference at Bern, March 1915.", source: "src_haupt_war", yearStart: 1915, on: "thinker:zetkin" },
    { from: "concept:labour-aristocracy", type: "RELATED_TO", to: "debate:socialists-and-the-war", note: "Lenin's explanation of the majority's support for the war.", source: "src_ml_lenin_split", on: "concept:labour-aristocracy" },
  ],
  excerpts: [
    {
      key: "ml-lenin-defeat",
      entity: "concept:revolutionary-defeatism",
      speaker: "thinker:lenin",
      body: "During a reactionary war a revolutionary class cannot but desire the defeat of its government.",
      source: "src_ml_lenin_defeat",
      locator: "“The Defeat of One's Own Government in the Imperialist War” (1915)",
      archiveUrl: "https://www.marxists.org/archive/lenin/works/1915/jul/26.htm",
    },
    {
      key: "ml-junius-bourgeois-society",
      entity: "text:junius-pamphlet",
      speaker: "thinker:luxemburg",
      text: "text:junius-pamphlet",
      body: "Violated, dishonored, wading in blood, dripping filth – there stands bourgeois society.",
      source: "src_mia_junius",
      locator: "Chapter 1",
      archiveUrl: "https://www.marxists.org/archive/luxemburg/1915/junius/ch01.htm",
    },
    {
      key: "ml-lenin-dual-power",
      entity: "concept:dual-power",
      speaker: "thinker:lenin",
      body: "The highly remarkable feature of our revolution is that it has brought about a dual power.",
      source: "src_ml_lenin_dual_power",
      locator: "“The Dual Power”, Pravda, 9 April 1917",
      archiveUrl: "https://www.marxists.org/archive/lenin/works/1917/apr/09.htm",
    },
    {
      key: "ml-april-theses-second-stage",
      entity: "text:april-theses",
      speaker: "thinker:lenin",
      text: "text:april-theses",
      body: "The specific feature of the present situation in Russia is that the country is passing from the first stage of the revolution—which, owing to the insufficient class-consciousness and organisation of the proletariat, placed power in the hands of the bourgeoisie—to its second stage, which must place power in the hands of the proletariat and the poorest sections of the peasants.",
      source: "src_mia_april_theses",
      locator: "Thesis 2",
      archiveUrl: "https://www.marxists.org/archive/lenin/works/1917/apr/04.htm",
    },
  ],
};
