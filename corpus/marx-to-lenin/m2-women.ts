import type { CorpusBatch } from "../../src/lib/corpus/types";

/**
 * Batch m2 — The woman question (1879–1917): how the parties of the
 * International explained women's oppression and organised working women,
 * from Bebel's book and Engels's Origin of the Family to Zetkin's women's
 * movement, Kollontai's polemic with Russian feminism, and the first
 * International Women's Day.
 *
 * Terminology: the period spoke of the "woman question" and of a
 * "proletarian" or "socialist women's movement", defined against
 * "bourgeois" feminism. "Socialist feminism" is a later historians'
 * category and is used only as such.
 */
export const batchM2: CorpusBatch = {
  id: "m2",
  title: "The woman question",
  entities: [
    {
      key: "concept:the-woman-question",
      title: "The woman question",
      fields: {
        yearStart: 1879,
        aliases: "Frauenfrage\nZhenskii vopros\nThe women's question\nWomen's emancipation",
        summary:
          "The name nineteenth-century writers gave to the debate about women's place in society. Socialists of the Second International answered it in class terms: women's subordination arose with private property, women's waged work prepared their independence, and full emancipation required socialism.",
        brief: `Why are women subordinate to men, and what would set them free? Liberals and feminists of the nineteenth century called this the "woman question" and answered with equal rights: the vote, education, the professions, control of property. Socialists agreed with many of those demands but argued that they were not enough. For them women's position was tied to private property and the family built on it, and working-class women were exploited as workers as well as subordinated as women. Their emancipation would come with the end of capitalism, and working women had to fight for it alongside working men.`,
        standard: `Two books set the terms for the socialist parties. [[thinker:bebel]]'s *Woman and Socialism* (1879) surveyed women's position in the past, present and future and promised equality under socialism. [[thinker:engels]]'s *Origin of the Family, Private Property and the State* (1884) gave the argument a historical theory: the subordination of women began with private property and the monogamous family, which existed to pass property to legitimate heirs ([[text:woman-and-socialism]]; [[text:origin-of-the-family]]).[cite:src_ml_bebel_woman][cite:src_ml_engels_origin]

From these followed three practical conclusions. Women's entry into industry, however harsh its conditions, was the precondition of their independence, so socialists should not try to drive them out of the factories. Working women had to be organised by the workers' parties and unions, not left to the women's associations of the middle classes. And reforms (the vote, protective labour laws, maternity insurance) were worth fighting for, but would not end women's subordination while property relations remained.[cite:src_ml_zetkin_1896][cite:src_ml_quataert_feminists]

[[thinker:zetkin]] set out these conclusions for the German party in 1896, and [[thinker:kollontai]] defended them in Russia against the feminists of the 1900s ([[text:only-with-the-proletarian-woman]]; [[text:social-basis-of-the-woman-question]]).[cite:src_ml_zetkin_1896][cite:src_ml_kollontai_1909]`,
        deep: `The socialist answer was not obvious to every socialist. Proudhon and many French and German trade unionists of the 1860s and 1870s wanted women out of paid work and in the home; male craft unions feared women's cheaper labour. Marx's *Capital* had described the employment of women and children as a means of cheapening labour, and also, in a passage much quoted later, as creating "a new economic foundation for a higher form of the family and of the relations between the sexes" ([[text:capital-volume-one]]). Bebel and Zetkin took the second side of that argument.[cite:src_ml_boxer_socialist_women][cite:src_ml_quataert_feminists]

The class answer also separated socialist women from the women's movements of their own countries. Socialists called those movements "bourgeois" and accused them of seeking equality within the propertied classes. Zetkin and Kollontai argued that there was no single woman question but several, which differed by class, and refused joint organisations. Others in the socialist parties, such as Lily Braun in Germany, wanted cooperation on shared demands such as the vote ([[debate:women-and-socialism]]).[cite:src_ml_zetkin_1896][cite:src_ml_boxer_socialist_women]

The theory had a limit that critics noticed at the time and that later historians stress: it treated the family and domestic labour as matters that socialism would settle, and said little about how men's authority within working-class families and organisations was to be challenged before then.[cite:src_ml_boxer_socialist_women][cite:src_ml_quataert_feminists]`,
        history: `The phrase was general in nineteenth-century European debate (*question des femmes*, *Frauenfrage*, *zhenskii vopros*). Socialists used it for the whole field of women's rights, work, marriage, sexuality and the family. The organised socialist women's movement that grew from the 1890s used it to mark its difference from feminism, a word it reserved for the movements it opposed ([[tendency:socialist-womens-movement]]).[cite:src_ml_boxer_socialist_women][cite:src_ml_stites_women]

Historians since the 1970s have grouped Bebel, Zetkin and Kollontai under "socialist feminism". The term is theirs, not the period's, and the women it describes would have rejected the second word ([[tendency:marxist-feminism]]).[cite:src_ml_boxer_socialist_women]`,
        interpretations: `Quataert describes the German socialist women as "reluctant feminists": they rejected feminism in name while building an autonomous women's organisation, a press and demands of their own inside a party run by men. Stites, writing on Russia, sees the Bolshevik women's work of 1913–17 as drawing on the same tradition and on the feminist movement it attacked.[cite:src_ml_quataert_feminists][cite:src_ml_stites_women]`,
        criticisms: `Feminists of the period answered that subordination cut across classes: working men also beat their wives, kept them from meetings and excluded them from trades. Later critics argued that the theory reduced women's oppression to class and deferred it to the future. Defenders reply that the socialist women's movement won concrete gains in its own time: suffrage demands without property qualification, maternity provision and the organisation of women workers on a scale no other movement reached.[cite:src_ml_boxer_socialist_women][cite:src_ml_quataert_feminists]`,
      },
      citations: [
        { source: "src_ml_bebel_woman" },
        { source: "src_ml_engels_origin" },
        { source: "src_ml_zetkin_1896" },
        { source: "src_ml_boxer_socialist_women", note: "Comparative survey of European socialist women's movements." },
      ],
    },
    {
      key: "tendency:socialist-womens-movement",
      title: "The socialist women's movement",
      fields: {
        yearStart: 1889,
        yearEnd: 1917,
        periodLabel: "1889–1917",
        color: "ochre",
        aliases: "Proletarian women's movement\nProletarische Frauenbewegung\nSocialist Women's International\nInternational Socialist Women's Conference",
        summary:
          "The organised women's movement of the socialist parties, strongest in Germany. Led by Clara Zetkin, it built a women's press and network inside social democracy, held international conferences from 1907, founded International Women's Day in 1910, and defined itself against the 'bourgeois' feminist movement.",
        body: `The movement began in Germany, where Prussian and other state laws barred women from political associations until 1908. Social democrats worked round the ban with elected women's spokespersons (*Vertrauenspersonen*) and educational societies, and from 1892 with the fortnightly *Die Gleichheit* (Equality), edited by [[thinker:zetkin]] until 1917.[cite:src_ml_quataert_feminists]

At the Gotha congress of 1896 Zetkin set out its principles: the proletarian woman's struggle was a joint one with the men of her class against capital, and the party's task was socialist agitation among women, not a separate women's programme ([[text:only-with-the-proletarian-woman]]). In practice the movement built its own organisation, which grew quickly once the Reich Law of Associations of 1908 allowed women to join parties.[cite:src_ml_zetkin_1896][cite:src_ml_quataert_feminists]

Internationally, the first International Conference of Socialist Women met in Stuttgart in August 1907, before the International's congress there. It demanded women's suffrage without property qualifications and set up an international secretariat under Zetkin. The second conference, at Copenhagen in 1910, called for an annual women's day ([[event:copenhagen-womens-conference]]).[cite:src_ml_boxer_socialist_women][cite:src_joll_second_international]

In Russia, women's work was slower to develop. [[thinker:kollontai]] organised working women's clubs in St Petersburg from 1907 and led a group of women workers at the All-Russian Women's Congress of December 1908. The Bolsheviks founded the journal *Rabotnitsa* (The Woman Worker) in 1914 and revived it in 1917.[cite:src_ml_stites_women][cite:src_ml_clements_kollontai]`,
        context: `The movement shared the International's divisions. Revisionists such as Lily Braun favoured cooperation with liberal feminists and practical reforms such as household cooperatives; Zetkin's majority rejected both. Some parties, including the Austrian and Belgian, set women's suffrage aside in their campaigns for manhood suffrage, which the Stuttgart conference of 1907 criticised ([[concept:revisionism]]).[cite:src_ml_boxer_socialist_women][cite:src_ml_quataert_feminists]

The war split it as it split the parties. In March 1915 Zetkin convened an international socialist women's conference at Bern against the war, the first meeting of socialists from belligerent countries after August 1914, and was arrested on her return. The SPD executive removed her from *Die Gleichheit* in 1917 ([[event:war-credits-1914]]; [[event:zimmerwald-conference]]).[cite:src_haupt_war][cite:src_ml_foner_zetkin]`,
        criticisms: `Liberal feminists accused the socialist women of putting party before women and of refusing alliances that could have won the vote sooner. Within the parties, men often treated women's work as secondary. Historians have also noted the movement's emphasis on women as mothers and the reluctance of its leaders to raise questions of sexuality and domestic power that Kollontai began to raise.[cite:src_ml_quataert_feminists][cite:src_ml_boxer_socialist_women]`,
        legacy: `On 23 February 1917 (8 March New Style), International Women's Day demonstrations by women textile workers in Petrograd began the strikes that became the February Revolution ([[event:february-revolution]]). Later Marxist feminists returned to the movement's arguments, often to criticise their limits.[cite:src_smith_russia][cite:src_ml_stites_women]`,
      },
      citations: [{ source: "src_ml_quataert_feminists" }, { source: "src_ml_boxer_socialist_women" }, { source: "src_ml_stites_women" }],
      flags: [
        { type: "specialist-review", field: "context", note: "Check the claim about the Austrian and Belgian parties deferring women's suffrage (Austria 1905–07; Belgian Workers' Party 1902) and how the Stuttgart women's conference resolution addressed it." },
      ],
    },
    {
      key: "text:woman-and-socialism",
      title: "Woman and Socialism",
      fields: {
        yearStart: 1879,
        subtitle: "Bebel's history and programme of women's emancipation",
        originalTitle: "Die Frau und der Sozialismus",
        language: "German",
        form: "book",
        publicationNote:
          "First published in 1879 under the Anti-Socialist Laws; retitled Die Frau in der Vergangenheit, Gegenwart und Zukunft (1883) to evade the ban; revised in the light of Engels's Origin of the Family for the ninth edition (1891); fiftieth edition 1909",
        edition: "trans. Meta L. Stern (Socialist Literature Co., New York, 1910) from the fiftieth edition",
        difficulty: "1",
        readingUrl: "https://www.marxists.org/archive/bebel/1879/woman-socialism/index.htm",
        aliases: "Die Frau und der Sozialismus\nWoman under Socialism\nWoman in the Past, Present and Future",
        summary:
          "Bebel's survey of women's position from early societies to the present, with a picture of their equality under socialism. Reissued and enlarged more than fifty times in his lifetime and translated widely, it was for many workers their first introduction to socialism.",
        body: `The book is in three parts: woman in the past, woman in the present, and woman in the future. The historical part traces women's subordination through ancient and Christian society; after 1891 Bebel rewrote it to follow [[thinker:engels]]'s account of the origin of the family and private property ([[text:origin-of-the-family]]).[cite:src_ml_bebel_woman]

The longest part describes the present: marriage as an economic arrangement, the barriers to women's education and professions, prostitution, women's work in industry, and the legal disabilities of women. Bebel argues that women and workers share a condition of dependence, and that the emancipation of one cannot be completed without the other.[cite:src_ml_bebel_woman][cite:src_ml_maehl_bebel]

The last part sketches socialist society: production in common, collective kitchens and laundries, the care and education of children as a public task, and marriage as a private union freely made and freely dissolved. Bebel presents this as the natural development of tendencies already visible in capitalism ([[concept:the-woman-question]]).[cite:src_ml_bebel_woman]`,
        context: `Written by the best-known leader of the German party while the [[event:anti-socialist-laws]] were in force, the book was printed abroad and distributed illegally before 1890. It was the most widely borrowed book in German workers' libraries and was translated into about twenty languages before 1914; the first English version (by Daniel De Leon, 1904) appeared as *Woman under Socialism*.[cite:src_ml_maehl_bebel][cite:src_ml_quataert_feminists]

Its picture of the future went beyond what Marx and Engels had allowed themselves, and Bebel drew on the utopian socialists, Fourier especially, as well as on Marx ([[thinker:fourier]]). Socialist women such as [[thinker:zetkin]] and [[thinker:kollontai]] counted it among the books that brought them to the movement.[cite:src_ml_boxer_socialist_women]`,
      },
      citations: [{ source: "src_ml_bebel_woman" }, { source: "src_ml_maehl_bebel" }],
      flags: [
        { type: "specialist-review", field: "publicationNote", note: "Check the edition history (1879 imprint; 1883 title; ninth edition 1891; fiftieth 1909) and the claim about translations and library borrowing against Maehl or a bibliography of the book." },
        { type: "uncertain-relationship", field: "context", note: "That Zetkin and Kollontai each named the book as formative is commonly stated; find a citation in Foner's Zetkin or Clements before publication, or soften the sentence." },
      ],
    },
    {
      key: "thinker:zetkin",
      title: "Clara Zetkin",
      fields: {
        yearStart: 1857,
        yearEnd: 1933,
        subtitle: "1857–1933",
        roles: "German teacher, journalist and socialist; leader of the socialist women's movement and editor of Die Gleichheit",
        birthPlace: "Wiederau, Saxony",
        deathPlace: "Arkhangelskoye, near Moscow",
        aliases: "Clara Eißner\nClara Eissner",
        summary:
          "The organiser and leading theorist of the socialist women's movement. She edited the women's paper Die Gleichheit for twenty-five years, set out the German party's position on the woman question in 1896, founded International Women's Day, and opposed the war from 1914.",
        body: `## Life

Born Clara Eißner, the daughter of a village schoolteacher, she trained as a teacher in Leipzig, where she met Russian émigré students, among them Ossip Zetkin, her partner, whose name she took. She joined the socialists around 1878. During the [[event:anti-socialist-laws]] she lived in Zurich and Paris; at the founding congress of the [[event:second-international]] in Paris in 1889 she spoke on women's emancipation through work.[cite:src_ml_foner_zetkin][cite:src_ml_quataert_feminists]

Back in Germany from 1890, she settled in Stuttgart and from 1892 edited *Die Gleichheit*, which became the organ of the socialist women's movement ([[tendency:socialist-womens-movement]]). Her speech at the Gotha party congress of 1896 became its programme ([[text:only-with-the-proletarian-woman]]).[cite:src_ml_zetkin_1896][cite:src_ml_quataert_feminists]

She belonged to the party's left. She fought [[thinker:bernstein]]'s revision, was a close friend of [[thinker:luxemburg]], and as secretary of the international women's movement organised the conferences of Stuttgart (1907) and Copenhagen (1910), where she proposed an annual women's day ([[event:copenhagen-womens-conference]]).[cite:src_ml_foner_zetkin][cite:src_nettl_luxemburg]

## Against the war

In 1914 she opposed the vote for war credits. In March 1915 she convened an international socialist women's conference in Bern against the war, and was imprisoned for some months on her return. In 1917 she joined the Independent Social Democrats and lost the editorship of *Die Gleichheit* ([[event:war-credits-1914]]).[cite:src_haupt_war][cite:src_ml_foner_zetkin]

## Ideas

Zetkin argued that the woman question had a different content for each class. For the woman of the upper classes it was a question of property; for the middle-class woman, of access to the professions; for the working woman, of exploitation by capital, which she shared with the men of her class. She therefore rejected cooperation with liberal feminists while insisting that the party organise women, defend their right to work and fight for their political rights ([[concept:the-woman-question]]).[cite:src_ml_zetkin_1896]`,
        context: `Her movement built the largest organisation of women in the socialist world. Historians have debated how far her insistence on the primacy of class kept it dependent on a party led by men, and how far it gave women an autonomous base inside it.[cite:src_ml_quataert_feminists][cite:src_ml_boxer_socialist_women]`,
        legacy: `After 1917 Zetkin joined the Communist Party of Germany and worked in the Communist International until her death in 1933; that part of her life lies outside this collection. Her speeches and articles on the woman question remained the standard socialist statement of it.[cite:src_ml_foner_zetkin]`,
      },
      citations: [{ source: "src_ml_foner_zetkin" }, { source: "src_ml_quataert_feminists" }],
      flags: [
        { type: "specialist-review", field: "body", note: "Check the dates: arrest after the Bern conference (July 1915, released in October) and her removal from Die Gleichheit (May 1917)." },
      ],
    },
    {
      key: "text:only-with-the-proletarian-woman",
      title: "Only in Conjunction with the Proletarian Woman Will Socialism Be Victorious",
      fields: {
        yearStart: 1896,
        subtitle: "Zetkin's speech to the Gotha party congress",
        originalTitle: "Nur mit der proletarischen Frau wird der Sozialismus siegen",
        language: "German",
        form: "speech",
        publicationNote: "Speech at the congress of the Social Democratic Party of Germany, Gotha, 16 October 1896; published by the party in the same year",
        edition: "in Clara Zetkin: Selected Writings, ed. Philip S. Foner (International Publishers, 1984)",
        difficulty: "1",
        readingUrl: "https://www.marxists.org/archive/zetkin/1896/10/women.htm",
        aliases: "Zetkin's Gotha speech\nThe Gotha speech on the woman question",
        summary:
          "Zetkin's speech to the German party congress of 1896. It distinguished the woman question of each class, argued that the working woman's struggle was a joint struggle with working men against capital, and proposed socialist agitation among women rather than a separate women's programme.",
        body: `Zetkin began from the history of the family and women's work. With large-scale industry the household lost its old productive functions, and women of every class were pushed out into society, but with different consequences in each.[cite:src_ml_zetkin_1896]

Women of the propertied classes wanted control of their own property. Middle-class women wanted access to education and the professions, and competed with the men of their class for them. Working women had already been drawn into industry; for them the question was exploitation, which they shared with working men. Their struggle could not resemble the bourgeois woman's struggle against the men of her class; it had to be a joint struggle against the capitalist class.[cite:src_ml_zetkin_1896]

From this Zetkin drew the conclusion for practice: the party should organise women for socialism, through agitation among women, and should support their political rights and labour protection, but without a separate women's programme or alliances with the feminist organisations ([[concept:the-woman-question]]).[cite:src_ml_zetkin_1896]`,
        context: `The congress adopted a resolution on women's agitation along the lines Zetkin proposed. Because the association laws still barred women from party membership, the agitation was organised through local women's spokespersons. The speech stood for twenty years as the German party's position and was translated for the other parties of the International ([[tendency:socialist-womens-movement]]).[cite:src_ml_quataert_feminists][cite:src_ml_foner_zetkin]`,
      },
      citations: [{ source: "src_ml_zetkin_1896" }, { source: "src_ml_foner_zetkin" }],
    },
    {
      key: "thinker:kollontai",
      title: "Alexandra Kollontai",
      fields: {
        yearStart: 1872,
        yearEnd: 1952,
        subtitle: "1872–1952",
        roles: "Russian socialist writer, organiser of women workers and, from 1915, Bolshevik",
        birthPlace: "St Petersburg",
        deathPlace: "Moscow",
        aliases: "Aleksandra Mikhailovna Kollontai\nAlexandra Domontovich\nAleksandra Kollontai",
        summary:
          "A general's daughter who became the leading socialist writer on the woman question in Russia. She organised working women's clubs, attacked Russian feminism in The Social Basis of the Woman Question (1909), spent the years 1908–17 in exile, and moved from the Mensheviks to the Bolsheviks over the war.",
        body: `## Life

Alexandra Domontovich grew up in a wealthy family in St Petersburg and married her cousin Vladimir Kollontai in 1893. A visit to the Kreenholm textile mills at Narva in 1896 turned her towards the labour movement; she left her marriage in 1898 to study political economy in Zurich, and wrote on the conditions of Finnish workers.[cite:src_ml_clements_kollontai]

She took part in the revolution of 1905 and from 1906 worked with the Mensheviks, organising clubs for working women in St Petersburg from 1907 ([[event:revolution-1905]]; [[tendency:menshevism]]). She attended the international socialist women's conferences of 1907 and 1910 ([[event:copenhagen-womens-conference]]).[cite:src_ml_clements_kollontai][cite:src_ml_stites_women]

For the All-Russian Women's Congress of December 1908, organised by liberal feminists, she prepared the workers' group's case and wrote *The Social Basis of the Woman Question*; facing arrest, she left Russia before the congress ended ([[text:social-basis-of-the-woman-question]]).[cite:src_ml_clements_kollontai]

## War and revolution

In exile in Germany, Britain, Scandinavia and the United States she opposed the war, and in 1915 she joined the Bolsheviks and worked with [[thinker:lenin]] ([[tendency:bolshevism]]). She returned to Petrograd in March 1917, was elected to the executive of the Petrograd Soviet, supported Lenin's April Theses, was imprisoned after the July Days and was elected to the Bolshevik Central Committee in August ([[text:april-theses]]).[cite:src_ml_clements_kollontai][cite:src_ml_rabinowitch_bolsheviks]

## Ideas

Kollontai held, with [[thinker:zetkin]], that the woman question differed by class and that equal rights under capitalism could only be a means for working women. She went further than most socialists in arguing that the relations between the sexes, the family and sexual morality were themselves part of the struggle and would have to be remade, not simply left to change once property was abolished ([[concept:the-woman-question]]).[cite:src_ml_kollontai_1909][cite:src_ml_clements_kollontai]`,
        context: `Russian socialism came late to women's work, and much of it was done by women who, like Kollontai, had to persuade their own parties that it mattered. Her polemic was aimed at a Russian feminist movement that had grown rapidly in 1905 and that, she argued, spoke for women of the propertied classes.[cite:src_ml_stites_women][cite:src_ml_clements_kollontai]`,
        legacy: `After October 1917 she became People's Commissar of Social Welfare and later a diplomat; her writing on sexuality and the family in the 1920s, and her part in the Workers' Opposition, fall outside this collection.[cite:src_ml_clements_kollontai]`,
      },
      citations: [{ source: "src_ml_clements_kollontai" }, { source: "src_ml_kollontai_selected" }],
      flags: [
        { type: "specialist-review", field: "body", note: "Check her support for the April Theses at the Bolshevik meetings of 4 April 1917 and the date of her election to the Central Committee (Sixth Congress, August 1917)." },
      ],
    },
    {
      key: "text:social-basis-of-the-woman-question",
      title: "The Social Basis of the Woman Question",
      fields: {
        yearStart: 1909,
        subtitle: "Kollontai's polemic against Russian feminism",
        originalTitle: "Sotsial'nye osnovy zhenskogo voprosa",
        language: "Russian",
        form: "book",
        publicationNote: "St Petersburg, 1909; written for the All-Russian Women's Congress of December 1908",
        edition: "abridged in Selected Writings of Alexandra Kollontai, trans. Alix Holt (Allison & Busby, 1977)",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/kollonta/1909/social-basis.htm",
        aliases: "Sotsial'nye osnovy zhenskogo voprosa\nThe Social Bases of the Woman Question",
        summary:
          "Kollontai's long reply to the Russian feminist movement. It argues that there is no single woman question above classes, that equal rights are for working women only a means of struggle against capital, and that the family and morality will change with the economic order that supports them.",
        body: `Kollontai opens by rejecting the idea of a women's question common to all women. The feminists, she argues, want equality with the men of their own class within the existing order; working women share their exploitation with working men, and for them equal rights matter only as weapons in the struggle against that order.[cite:src_ml_kollontai_1909]

The book then examines women's work, marriage and the family, prostitution and motherhood. It argues that capitalism is already breaking up the family as an economic unit by drawing women into wage labour, and that the forms of marriage and sexual morality rest on property and will change when it is abolished. Working women therefore need their own organisation within the labour movement, not an alliance with the feminists.[cite:src_ml_kollontai_1909][cite:src_ml_clements_kollontai]`,
        context: `The book was prepared for the first All-Russian Women's Congress, held in St Petersburg in December 1908 and organised by liberal feminists. A group of working women organised by Kollontai and others took part and walked out near its end. The book appeared in 1909, after Kollontai had left Russia to escape arrest ([[thinker:kollontai]]; [[tendency:socialist-womens-movement]]).[cite:src_ml_stites_women][cite:src_ml_clements_kollontai]`,
      },
      citations: [{ source: "src_ml_kollontai_1909" }, { source: "src_ml_stites_women", note: "The 1908 congress and the workers' group." }],
      flags: [
        { type: "specialist-review", field: "body", note: "Only an abridged chapter is online. Check the summary of the book's later chapters against the full Russian text or a full translation." },
      ],
    },
    {
      key: "event:copenhagen-womens-conference",
      title: "The Copenhagen conference of socialist women",
      fields: {
        yearStart: 1910,
        subtitle: "The second International Conference of Socialist Women",
        dateLabel: "26–27 August 1910",
        place: "Copenhagen",
        eventType: "congress",
        summary:
          "A conference of about a hundred socialist women from seventeen countries, held before the International's Copenhagen congress. It resolved to hold an annual women's day, above all for women's suffrage. The first was held on 19 March 1911; 8 March became usual from 1914.",
        body: `The conference met in Copenhagen just before the eighth congress of the [[event:second-international]]. Its main resolution, proposed by [[thinker:zetkin]], Käte Duncker and others, called on socialist women in every country to hold an annual women's day, whose first aim would be the vote for women. It did not fix a date.[cite:src_ml_boxer_socialist_women][cite:src_ml_foner_zetkin]

The idea had a model in the American Socialist Party's "National Woman's Day", held on the last Sunday of February from 1909. The first International Women's Day was held on 19 March 1911 in Germany, Austria, Denmark and Switzerland, with large meetings and marches. The date varied in the following years; Russian socialists marked it first in 1913, and 8 March became usual from 1914.[cite:src_ml_boxer_socialist_women][cite:src_ml_stites_women]`,
        significance: `International Women's Day became the movement's best-known creation. In Petrograd on 23 February 1917 (8 March New Style) women textile workers struck and marched on Women's Day, and the strikes spread over the next days into the revolution that ended the monarchy ([[event:february-revolution]]).[cite:src_smith_russia][cite:src_ml_stites_women]

A story that Women's Day commemorates a demonstration of New York women workers on 8 March 1857 appeared only in the 1950s and has no contemporary evidence.[cite:src_ml_boxer_socialist_women]`,
      },
      citations: [{ source: "src_ml_boxer_socialist_women" }, { source: "src_ml_stites_women" }],
      flags: [
        { type: "specialist-review", field: "significance", note: "The source for the 1857 legend is general knowledge among historians of the day (Temma Kaplan, Feminist Studies, 1985; Françoise Picq). Add a specific citation, or cut the sentence, before publication." },
        { type: "specialist-review", field: "body", note: "Check numbers (about 100 delegates from 17 countries) and the list of countries for 19 March 1911." },
      ],
    },

    /* ——— Revision of a sample entry ——— */
    {
      key: "text:origin-of-the-family",
      title: "The Origin of the Family, Private Property and the State",
      fields: {
        yearStart: 1884,
        subtitle: "Engels on kinship, property and the state",
        originalTitle: "Der Ursprung der Familie, des Privateigenthums und des Staats",
        language: "German",
        form: "book",
        publicationNote: "Hottingen-Zürich, 1884; revised fourth edition, Stuttgart, 1891",
        edition: "MECW vol. 26",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/marx/works/1884/origin-family/index.htm",
        aliases: "Origin of the Family\nDer Ursprung der Familie",
        summary:
          "Engels's account of how the family, private property and the state arose. Building on Lewis Henry Morgan's anthropology and Marx's notes on it, he argued that women's subordination began with private property, and that the state arose to hold class society together. It became the theoretical basis of the socialist answer to the woman question.",
        body: `After [[thinker:marx]]'s death Engels found among his papers extensive notes on the American anthropologist Lewis Henry Morgan's *Ancient Society* (1877). He wrote the book, he said in the preface, partly to carry out a bequest: to present Morgan's results in the light of the materialist conception of history ([[concept:historical-materialism]]).[cite:src_ml_engels_origin]

The preface widens that conception. The determining factor in history is "the production and reproduction of the immediate essentials of life", which has a twofold character: the production of the means of subsistence, and the production of human beings themselves. Social organisation is shaped by both, by the development of labour and by the development of the family.[cite:src_ml_engels_origin]

## The argument

Following Morgan, Engels describes early societies organised by kinship groups (gentes) in which descent was traced through the mother and property was held in common. As herding and agriculture produced wealth that men controlled, men wanted to pass it to their own children; descent through the male line replaced "mother-right", and the monogamous family, binding on the woman but not in practice on the man, arose to secure legitimate heirs. Engels calls this "the world historical defeat of the female sex" ([[concept:private-property]]).[cite:src_ml_engels_origin]

The last chapters follow the break-up of the gentile constitution among the Greeks, Romans and Germans. With the division of society into classes a public power separate from the people became necessary; the state arose to keep class conflict within bounds, and normally served the economically dominant class ([[concept:the-state]]).[cite:src_ml_engels_origin]

From this Engels concluded that women's emancipation required their return to public production, which in turn required that the individual family cease to be the economic unit of society.[cite:src_ml_engels_origin]`,
        context: `The book was published in Zurich in 1884, while the [[event:anti-socialist-laws]] were in force, and revised in 1891 for a fourth edition that took account of newer anthropology. It gave [[thinker:bebel]]'s *Woman and Socialism* a historical theory, and Bebel rewrote his own book to follow it. Through both, its argument became the common ground of the socialist parties on the woman question ([[text:woman-and-socialism]]; [[concept:the-woman-question]]).[cite:src_ml_bebel_woman][cite:src_ml_boxer_socialist_women]

Its account of the state was the other part of its influence: [[thinker:lenin]] began *The State and Revolution* (1917) from Engels's statement that the state is a product of irreconcilable class antagonisms ([[text:the-state-and-revolution]]).[cite:src_state_revolution]

## Disputed points

Morgan's evolutionary scheme of savagery, barbarism and civilisation, and the thesis of an original stage of group marriage and mother-right, were questioned by anthropologists soon after 1900 and are not accepted today. Readers disagree about what survives: some treat the book as a historical hypothesis now superseded in its details, others value its central claim that the family and women's position have a history tied to property. Later feminist scholars both built on and criticised it, especially its assumption that the division of labour between the sexes was natural before property arose ([[tendency:marxist-feminism]]).[cite:src_bottomore_dictionary][cite:src_ml_boxer_socialist_women]`,
      },
      citations: [
        { source: "src_ml_engels_origin" },
        { source: "src_bottomore_dictionary", note: "The anthropological standing of the book." },
      ],
      flags: [
        { type: "sample-overlap", note: "This rewrite replaces the sample summary (\"an early reference point for Marxist feminism\"), which used a later term. The slug, title and existing relationships are kept." },
        { type: "specialist-review", field: "context", note: "The paragraph on the book's anthropological standing summarises a large literature in two sentences. A specialist should check it and add a citation to a recent study (for example Lise Vogel or Eleanor Leacock's introduction to the 1972 edition)." },
      ],
    },

    /* ——— Debate ——— */
    {
      key: "debate:women-and-socialism",
      title: "How are women to be emancipated?",
      fields: {
        summary:
          "Should working women ally with feminists for the vote and equal rights, or organise only with the men of their class? Must women leave paid work, or does work free them? Socialists of the International gave different answers, and Zetkin's became the majority line.",
        intro:
          "The socialist parties agreed that capitalism shaped women's position. They disagreed about whether women's work was a threat or a liberation, whether to cooperate with the feminist movements, and how far relations between the sexes could change before socialism.",
        body: `The positions below run from the old craft-union hostility to women's labour to Kollontai's argument that the family and sexual morality were political questions. Between them lie the majority of the German party under [[thinker:zetkin]], the revisionist women around Lily Braun who sought cooperation with liberal feminists, and those feminists themselves ([[concept:the-woman-question]]).[cite:src_ml_boxer_socialist_women][cite:src_ml_quataert_feminists]

The disagreement was sharpest over the vote. Feminist suffrage movements often accepted property qualifications that excluded working women; some socialist parties postponed women's suffrage to win manhood suffrage first. The Stuttgart women's conference of 1907 rejected both compromises ([[tendency:socialist-womens-movement]]).[cite:src_ml_boxer_socialist_women]`,
        context: `The debate took place in Germany in the 1890s and 1900s, in Russia around the women's congress of 1908, and at the international socialist women's conferences of 1907 and 1910 ([[event:copenhagen-womens-conference]]).[cite:src_ml_quataert_feminists][cite:src_ml_stites_women]`,
      },
    },
  ],
  relationships: [
    // The concept
    { from: "concept:the-woman-question", type: "RELATED_TO", to: "concept:private-property", note: "Engels traced women's subordination to its rise.", source: "src_ml_engels_origin", on: "concept:the-woman-question" },
    { from: "concept:the-woman-question", type: "RELATED_TO", to: "concept:class", note: "Socialists held that it took a different form in each class.", source: "src_ml_zetkin_1896", weight: 2, on: "concept:the-woman-question" },
    { from: "concept:the-woman-question", type: "RELATED_TO", to: "concept:labour", note: "Women's waged work as the basis of their independence.", source: "src_ml_bebel_woman", on: "concept:the-woman-question" },
    { from: "concept:the-woman-question", type: "RELATED_TO", to: "concept:social-reproduction", note: "Later theorists of social reproduction took up questions the period left open.", source: "src_ml_boxer_socialist_women", basis: "interpretive", on: "concept:the-woman-question" },
    { from: "debate:women-and-socialism", type: "RELATED_TO", to: "concept:the-woman-question", note: "The debate on the concept.", source: "src_ml_boxer_socialist_women", weight: 3, on: "debate:women-and-socialism" },
    { from: "debate:women-and-socialism", type: "RELATED_TO", to: "debate:reform-or-revolution", note: "Cooperation with feminists was a form of the question of alliances with the middle classes.", source: "src_ml_quataert_feminists", basis: "interpretive", on: "debate:women-and-socialism" },
    // The movement
    { from: "tendency:socialist-womens-movement", type: "DEVELOPED", to: "concept:the-woman-question", note: "Its class answer.", source: "src_ml_boxer_socialist_women", weight: 3, on: "tendency:socialist-womens-movement" },
    { from: "tendency:socialist-womens-movement", type: "ASSOCIATED_WITH", to: "tendency:social-democracy", note: "Organised within the parties of the International.", source: "src_ml_quataert_feminists", weight: 2, on: "tendency:socialist-womens-movement" },
    { from: "tendency:socialist-womens-movement", type: "ASSOCIATED_WITH", to: "event:second-international", note: "International conferences from 1907.", source: "src_ml_boxer_socialist_women", yearStart: 1907, on: "tendency:socialist-womens-movement" },
    { from: "tendency:socialist-womens-movement", type: "INFLUENCED", to: "tendency:marxist-feminism", note: "Later Marxist feminists returned to its arguments, often critically.", source: "src_ml_boxer_socialist_women", basis: "interpretive", on: "tendency:socialist-womens-movement" },
    // Bebel and Engels
    { from: "thinker:bebel", type: "WROTE", to: "text:woman-and-socialism", note: "First published 1879; revised through fifty editions.", source: "src_ml_bebel_woman", yearStart: 1879, weight: 3, on: "text:woman-and-socialism" },
    { from: "text:woman-and-socialism", type: "DISCUSSES", to: "concept:the-woman-question", note: "The most widely read socialist statement of it.", source: "src_ml_bebel_woman", weight: 3, on: "text:woman-and-socialism" },
    { from: "text:origin-of-the-family", type: "INFLUENCED", to: "text:woman-and-socialism", note: "Bebel rewrote his historical chapters to follow Engels (1891).", source: "src_ml_maehl_bebel", yearStart: 1891, on: "text:woman-and-socialism" },
    { from: "text:woman-and-socialism", type: "INFLUENCED", to: "tendency:socialist-womens-movement", note: "Its common reference.", source: "src_ml_quataert_feminists", on: "text:woman-and-socialism" },
    { from: "text:origin-of-the-family", type: "DISCUSSES", to: "concept:the-woman-question", note: "Women's subordination as a product of private property.", source: "src_ml_engels_origin", weight: 3, on: "concept:the-woman-question" },
    { from: "text:origin-of-the-family", type: "DISCUSSES", to: "concept:historical-materialism", note: "The \"twofold\" production of subsistence and of human beings.", source: "src_ml_engels_origin", on: "text:origin-of-the-family" },
    { from: "text:origin-of-the-family", type: "INFLUENCED", to: "text:the-state-and-revolution", note: "Lenin's starting point on the origin of the state.", source: "src_state_revolution", yearStart: 1917, on: "text:origin-of-the-family" },
    // Zetkin
    { from: "thinker:zetkin", type: "WROTE", to: "text:only-with-the-proletarian-woman", note: "Gotha, 16 October 1896.", source: "src_ml_zetkin_1896", yearStart: 1896, weight: 3, on: "thinker:zetkin" },
    { from: "thinker:zetkin", type: "MEMBER_OF", to: "tendency:socialist-womens-movement", note: "Its leader and editor of Die Gleichheit (1892–1917).", source: "src_ml_quataert_feminists", weight: 3, on: "thinker:zetkin" },
    { from: "thinker:zetkin", type: "MEMBER_OF", to: "tendency:social-democracy", note: "On the SPD left; joined the Independents in 1917.", source: "src_ml_foner_zetkin", yearEnd: 1917, on: "thinker:zetkin" },
    { from: "thinker:zetkin", type: "DEVELOPED", to: "concept:the-woman-question", note: "The woman question differs by class.", source: "src_ml_zetkin_1896", weight: 2, on: "thinker:zetkin" },
    { from: "thinker:zetkin", type: "INFLUENCED_BY", to: "thinker:bebel", note: "Worked with him on the party's women's policy.", source: "src_ml_quataert_feminists", on: "thinker:zetkin" },
    { from: "thinker:zetkin", type: "ASSOCIATED_WITH", to: "thinker:luxemburg", note: "Close friends and allies on the party left.", source: "src_nettl_luxemburg", weight: 2, on: "thinker:zetkin" },
    { from: "thinker:zetkin", type: "CRITIQUED", to: "concept:revisionism", note: "Fought Bernstein's revision from 1898.", source: "src_ml_foner_zetkin", yearStart: 1898, on: "thinker:zetkin" },
    { from: "thinker:zetkin", type: "PARTICIPATED_IN", to: "event:second-international", note: "Spoke at the founding congress, Paris 1889.", source: "src_ml_foner_zetkin", yearStart: 1889, on: "thinker:zetkin" },
    { from: "thinker:zetkin", type: "PARTICIPATED_IN", to: "event:copenhagen-womens-conference", note: "Proposed the annual women's day.", source: "src_ml_foner_zetkin", yearStart: 1910, weight: 3, on: "thinker:zetkin" },
    { from: "thinker:zetkin", type: "REJECTED", to: "event:war-credits-1914", note: "Opposed the war; convened the Bern women's conference, March 1915.", source: "src_haupt_war", yearStart: 1914, on: "thinker:zetkin" },
    { from: "text:only-with-the-proletarian-woman", type: "DISCUSSES", to: "concept:the-woman-question", note: "The German party's position for twenty years.", source: "src_ml_zetkin_1896", weight: 3, on: "text:only-with-the-proletarian-woman" },
    { from: "text:only-with-the-proletarian-woman", type: "DISCUSSES", to: "concept:class-struggle", note: "A joint struggle of working women and men against capital.", source: "src_ml_zetkin_1896", on: "text:only-with-the-proletarian-woman" },
    // Kollontai
    { from: "thinker:kollontai", type: "WROTE", to: "text:social-basis-of-the-woman-question", note: "Written for the women's congress of December 1908.", source: "src_ml_kollontai_1909", yearStart: 1909, weight: 3, on: "thinker:kollontai" },
    { from: "thinker:kollontai", type: "MEMBER_OF", to: "tendency:socialist-womens-movement", note: "Organised working women's clubs in St Petersburg from 1907.", source: "src_ml_clements_kollontai", weight: 2, on: "thinker:kollontai" },
    { from: "thinker:kollontai", type: "PARTICIPATED_IN", to: "event:copenhagen-womens-conference", note: "A Russian delegate.", source: "src_ml_clements_kollontai", yearStart: 1910, on: "thinker:kollontai" },
    { from: "thinker:kollontai", type: "PARTICIPATED_IN", to: "event:revolution-1905", note: "Her turn to full-time party work.", source: "src_ml_clements_kollontai", yearStart: 1905, on: "thinker:kollontai" },
    { from: "thinker:kollontai", type: "PARTICIPATED_IN", to: "event:october-revolution", note: "Member of the Bolshevik Central Committee from August 1917.", source: "src_ml_rabinowitch_bolsheviks", yearStart: 1917, on: "thinker:kollontai" },
    { from: "thinker:kollontai", type: "INFLUENCED_BY", to: "thinker:zetkin", note: "Shared her class analysis of the woman question.", source: "src_ml_clements_kollontai", on: "thinker:kollontai" },
    { from: "text:social-basis-of-the-woman-question", type: "DISCUSSES", to: "concept:the-woman-question", note: "No single woman question above classes.", source: "src_ml_kollontai_1909", weight: 3, on: "text:social-basis-of-the-woman-question" },
    // Copenhagen and Women's Day
    { from: "event:copenhagen-womens-conference", type: "ASSOCIATED_WITH", to: "tendency:socialist-womens-movement", note: "Its second international conference.", source: "src_ml_boxer_socialist_women", weight: 3, on: "event:copenhagen-womens-conference" },
    { from: "event:copenhagen-womens-conference", type: "ASSOCIATED_WITH", to: "event:second-international", note: "Held before the International's Copenhagen congress.", source: "src_joll_second_international", on: "event:copenhagen-womens-conference" },
    { from: "event:copenhagen-womens-conference", type: "PRECEDES", to: "event:february-revolution", note: "Women's Day, 23 February 1917, began the Petrograd strikes.", source: "src_smith_russia", yearStart: 1917, on: "event:copenhagen-womens-conference" },
  ],
  excerpts: [
    {
      key: "ml-bebel-equality",
      entity: "text:woman-and-socialism",
      speaker: "thinker:bebel",
      text: "text:woman-and-socialism",
      body: "For there can be no liberation of mankind without social independence and equality of the sexes.",
      source: "src_ml_bebel_woman",
      locator: "Introduction",
      note: "Meta Stern's 1910 translation of the fiftieth edition.",
      archiveUrl: "https://www.marxists.org/archive/bebel/1879/woman-socialism/introduction.htm",
    },
    {
      key: "ml-zetkin-joint-struggle",
      entity: "text:only-with-the-proletarian-woman",
      speaker: "thinker:zetkin",
      text: "text:only-with-the-proletarian-woman",
      body: "Therefore the liberation struggle of the proletarian woman cannot be similar to the struggle that the bourgeois woman wages against the male of her class. On the contrary, it must be a joint struggle with the male of her class against the entire class of capitalists.",
      source: "src_ml_zetkin_1896",
      locator: "Speech at Gotha, 16 October 1896",
      note: "Translation from Foner's edition of Zetkin's Selected Writings.",
      archiveUrl: "https://www.marxists.org/archive/zetkin/1896/10/women.htm",
    },
    {
      key: "ml-zetkin-agitation",
      entity: "thinker:zetkin",
      speaker: "thinker:zetkin",
      text: "text:only-with-the-proletarian-woman",
      body: "We must not conduct special women’s propaganda, but Socialist agitation among women.",
      source: "src_ml_zetkin_1896",
      locator: "Speech at Gotha, 16 October 1896",
      archiveUrl: "https://www.marxists.org/archive/zetkin/1896/10/women.htm",
    },
    {
      key: "ml-kollontai-means",
      entity: "text:social-basis-of-the-woman-question",
      speaker: "thinker:kollontai",
      text: "text:social-basis-of-the-woman-question",
      body: "While for the feminists the achievement of equal rights with men in the framework of the contemporary capitalist world represents a sufficiently concrete end in itself, equal rights at the present time are, for the proletarian women, only a means of advancing the struggle against the economic slavery of the working class.",
      source: "src_ml_kollontai_1909",
      locator: "Abridged chapter",
      note: "Alix Holt's translation.",
      archiveUrl: "https://www.marxists.org/archive/kollonta/1909/social-basis.htm",
    },
    {
      key: "ml-engels-twofold-production",
      entity: "text:origin-of-the-family",
      speaker: "thinker:engels",
      text: "text:origin-of-the-family",
      body: "According to the materialistic conception, the determining factor in history is, in the final instance, the production and reproduction of the immediate essentials of life.",
      source: "src_ml_engels_origin",
      locator: "Preface to the first edition (1884)",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1884/origin-family/preface.htm",
    },
    {
      key: "ml-engels-world-historical-defeat",
      entity: "text:origin-of-the-family",
      speaker: "thinker:engels",
      text: "text:origin-of-the-family",
      body: "The overthrow of mother-right was the world historical defeat of the female sex.",
      source: "src_ml_engels_origin",
      locator: "Chapter II, “The Family”",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1884/origin-family/ch02c.htm",
    },
    {
      key: "ml-engels-first-class-oppression",
      entity: "concept:the-woman-question",
      speaker: "thinker:engels",
      text: "text:origin-of-the-family",
      body: "The first class opposition that appears in history coincides with the development of the antagonism between man and woman in monogamous marriage, and the first class oppression coincides with that of the female sex by the male.",
      source: "src_ml_engels_origin",
      locator: "Chapter II, “The Family”",
      note: "Engels is extending a sentence he quotes from an unpublished manuscript of his and Marx's from 1846.",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1884/origin-family/ch02d.htm",
    },
  ],
  debates: [
    {
      debate: "debate:women-and-socialism",
      propositions: [
        { key: "work", statement: "Women's paid work is the basis of their emancipation." },
        { key: "alliance", statement: "Working women should cooperate with feminists on shared demands such as the vote." },
        { key: "own-organisation", statement: "Socialist women need their own organisations and press." },
        { key: "suffrage-now", statement: "Women's suffrage must be demanded now, without property qualifications." },
        { key: "only-socialism", statement: "Women's full emancipation requires the abolition of capitalism." },
        { key: "family-now", statement: "Relations between the sexes and the family must be challenged now, not left to change after the revolution." },
      ],
      positions: [
        {
          key: "craft-unions",
          label: "Craft unionists and Proudhonists (1860s–1890s)",
          centralClaim: "Women belong in the home; their factory work lowers men's wages and destroys the working-class family.",
          summary: "Strong among French Proudhonists and German craft unions in the early International, and still present in many unions after 1890.",
          assumptions: ["A man's wage should support a family."],
          criticisms: ["Bebel and Zetkin: it is reactionary to try to reverse industrial development, and it leaves women dependent."],
          stances: {
            work: ["rejects", "Women's labour is a weapon of capital against the worker."],
            alliance: ["rejects", "Not a question they recognised."],
            "own-organisation": ["rejects", "Women should not be organised separately or at all."],
            "suffrage-now": ["rejects", "Indifferent or opposed."],
            "only-socialism": ["silent", "Emancipation of women was not their aim."],
            "family-now": ["rejects", "The family is to be protected, not changed."],
          },
        },
        {
          key: "bebel",
          label: "Bebel (1879–1913)",
          holder: "thinker:bebel",
          centralClaim: "Women and workers share a condition of dependence; both will be freed together in a socialist society, whose institutions will make women economically independent.",
          summary: "The common ground of the party: a historical account of subordination and a detailed picture of equality in the future.",
          links: ["text:woman-and-socialism"],
          stances: {
            work: ["affirms", "Industry is already making women independent."],
            alliance: ["qualified", "Supported women's rights in the Reichstag, including the vote, without organising with the feminists."],
            "own-organisation": ["qualified", "Supported women's agitation within the party."],
            "suffrage-now": ["affirms", "Moved women's suffrage in the Reichstag."],
            "only-socialism": ["affirms", "Full equality requires socialism."],
            "family-now": ["qualified", "Marriage will become a free private union under socialism."],
          },
        },
        {
          key: "zetkin",
          label: "Zetkin and the German majority (1896–1917)",
          holder: "thinker:zetkin",
          centralClaim: "The woman question differs by class. Working women's struggle is a joint struggle with working men against capital; feminists are allies of the class enemy.",
          summary: "Adopted by the SPD at Gotha in 1896 and by the international socialist women's conferences of 1907 and 1910.",
          assumptions: ["Class divides women more than sex unites them."],
          criticisms: ["Braun: refuses useful alliances.", "Feminists: subordinates women to a party led by men."],
          links: ["text:only-with-the-proletarian-woman", "tendency:socialist-womens-movement"],
          stances: {
            work: ["affirms", "Work is the precondition of independence."],
            alliance: ["rejects", "No cooperation with the bourgeois women's movement."],
            "own-organisation": ["qualified", "Socialist agitation among women, through women's structures inside the party."],
            "suffrage-now": ["affirms", "Universal suffrage for women, with no property qualifications."],
            "only-socialism": ["affirms", "Reforms help, but do not end subordination."],
            "family-now": ["qualified", "Accepted reforms such as maternity protection; left the family largely to the future."],
          },
        },
        {
          key: "braun",
          label: "Lily Braun and the revisionist women",
          centralClaim: "Socialist women should cooperate with liberal feminists for the vote and social reform, and build practical alternatives such as household cooperatives now.",
          summary: "A minority in the German movement, aligned with Bernstein's revision and defeated by Zetkin in the 1900s.",
          criticisms: ["Zetkin: blurs the class line and spreads illusions in reform."],
          links: ["concept:revisionism"],
          stances: {
            work: ["affirms", "With maternity insurance and protection."],
            alliance: ["affirms", "Common demands justify common action."],
            "own-organisation": ["affirms", "Women's own initiatives inside and outside the party."],
            "suffrage-now": ["affirms", "The vote is the first goal."],
            "only-socialism": ["qualified", "Reforms can transform women's position gradually."],
            "family-now": ["affirms", "Cooperative housekeeping could free women from domestic labour now."],
          },
        },
        {
          key: "feminists",
          label: "The liberal women's movements (as socialists called them, \"bourgeois feminism\")",
          centralClaim: "Women's subordination is a matter of rights: the vote, education, the professions and equality in law, which can be won within existing society.",
          summary: "Organised in national associations in Germany, Russia, Britain and elsewhere; some accepted property qualifications for the vote.",
          criticisms: ["Zetkin and Kollontai: speaks for women of the propertied classes."],
          stances: {
            work: ["qualified", "Sought access to education and the professions; divided on protective laws."],
            alliance: ["qualified", "Some welcomed socialist support; many feared it."],
            "own-organisation": ["affirms", "Women's organisations independent of men's parties."],
            "suffrage-now": ["qualified", "Often on the same terms as men, which meant property qualifications where men had them."],
            "only-socialism": ["rejects", "Equality can be won without abolishing property."],
            "family-now": ["qualified", "Reform of marriage and property law."],
          },
        },
        {
          key: "kollontai",
          label: "Kollontai (1908–17)",
          holder: "thinker:kollontai",
          centralClaim: "Equal rights are only a means for working women; but the family, marriage and sexual morality are part of the struggle and must be challenged by the movement itself.",
          summary: "Shared Zetkin's class line against the Russian feminists while pressing her own party to take women's work and the questions of everyday life seriously.",
          criticisms: ["Many party comrades: a distraction from the class struggle."],
          links: ["text:social-basis-of-the-woman-question"],
          stances: {
            work: ["affirms", "Wage labour is breaking up the old family."],
            alliance: ["rejects", "Led working women against the feminists at the 1908 congress."],
            "own-organisation": ["affirms", "Working women's clubs and special work among women."],
            "suffrage-now": ["affirms", "As a means of struggle."],
            "only-socialism": ["affirms", "Equal rights are a means, not an end."],
            "family-now": ["affirms", "The new morality begins in the movement."],
          },
        },
      ],
      arguments: [
        { key: "a1", position: "craft-unions", kind: "argument", body: "Women's factory work is used to cut wages and break up the family; the labour movement should fight for a wage that lets a man keep his family." },
        { key: "c1", position: "bebel", kind: "counterargument", respondsTo: "a1", body: "Industry cannot be turned back. Women's work is cruel under capitalism, but it is also what makes them independent of fathers and husbands." },
        { key: "a2", position: "braun", kind: "argument", body: "Socialist and liberal women want the same vote and the same reforms. Refusing to work together delays them for all women." },
        { key: "c2", position: "zetkin", kind: "counterargument", respondsTo: "a2", body: "The feminists want equality within the propertied classes; they accept property qualifications that leave working women voteless. Working women's allies are the men of their class." },
        { key: "c3", position: "feminists", kind: "counterargument", respondsTo: "c2", body: "Working men also keep women from trades, meetings and power; women of all classes share disabilities that a workers' party does not take seriously." },
        { key: "c4", position: "kollontai", kind: "counterargument", respondsTo: "c3", body: "That is why the movement must raise the family and sexual morality itself; but it cannot do so in alliance with women whose interests are tied to property." },
      ],
    },
  ],
};
