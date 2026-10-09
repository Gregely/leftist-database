import type { CorpusBatch } from "../../src/lib/corpus/types";

/**
 * Batch m4 — Nations and empire (1896–1917): the national question in the
 * multinational empires (Austro-Marxist autonomy, the Bund, Luxemburg's
 * rejection of self-determination, Lenin's defence of it), Connolly and the
 * Easter Rising; and the theories of imperialism from Hobson and Hilferding
 * to Luxemburg, Kautsky, Bukharin and the labour aristocracy, with the
 * colonial debate at Stuttgart in 1907.
 */
export const batchM4: CorpusBatch = {
  id: "m4",
  title: "Nations and empire",
  entities: [
    /* ——— The national question ——— */
    {
      key: "concept:national-self-determination",
      title: "National self-determination",
      fields: {
        yearStart: 1896,
        aliases: "Right of nations to self-determination\nSelbstbestimmungsrecht der Nationen\nPravo natsii na samoopredelenie\nThe national question",
        summary:
          "The right of a nation to decide its own political fate, up to forming a separate state. The International endorsed it in 1896 and the Russian party wrote it into its programme in 1903; Luxemburg rejected it as a bourgeois slogan, the Austro-Marxists replaced it with cultural autonomy, and Lenin defended it as a right of secession.",
        brief: `Most of Europe's socialists lived in states that ruled over many peoples: the Russian, Austro-Hungarian, German and British empires. Poles, Czechs, Irish, Finns, Ukrainians and many others wanted their own institutions or their own states. Socialists had to decide whether to support those demands, which divided workers by nation, or to oppose them, which left them on the side of the empires. "Self-determination" was the name of one answer: let each nation decide for itself.`,
        standard: `The International's London congress of 1896 declared for the full right of all nations to self-determination, and the Russian Social Democratic Labour Party put the same right into its programme in 1903. What it meant was disputed from the start.[cite:src_ml_connor_national][cite:src_ml_lenin_self_det]

[[thinker:luxemburg]] and the Polish party she led rejected it. A "right of nations" was an abstraction that ignored classes; Polish independence was an economic utopia and a nationalist distraction; socialists should demand democracy and local autonomy within the existing states ([[text:national-question-and-autonomy]]).[cite:src_ml_luxemburg_national][cite:src_nettl_luxemburg]

The Austrian social democrats proposed to separate nationality from territory: each nation would run its own schools and culture as an association of persons wherever its members lived, within a democratic multinational state ([[concept:national-cultural-autonomy]]; [[tendency:austro-marxism]]).[cite:src_ml_bottomore_austro][cite:src_ml_bauer_nationalities]

[[thinker:lenin]] defended the right of secession against both. Socialists of an oppressing nation must recognise the right of oppressed nations to leave, while the workers of all nations remained united in one party; recognising the right did not mean supporting every secession ([[text:right-of-nations-to-self-determination]]).[cite:src_ml_lenin_self_det]`,
        deep: `The war sharpened the dispute. In 1915–16 Bukharin, Georgy Pyatakov and the Polish social democrats argued that under imperialism national self-determination had become impossible or reactionary, and that socialists should go straight to the struggle for socialism. Lenin called this "imperialist economism" and answered in theses of 1916 that the socialist revolution itself would have to recognise the right of nations to separate ([[thinker:bukharin]]; [[concept:imperialism]]).[cite:src_ml_lenin_self_det_summed][cite:src_ml_connor_national]

The Easter Rising tested the positions. Karl Radek dismissed it as a "putsch"; Lenin replied that a rising with mass sympathy was nothing of the kind, and that socialists who waited for a pure social revolution would never see one ([[event:easter-rising]]).[cite:src_ml_lenin_self_det_summed]

In April 1917 the Bolshevik conference reaffirmed the right of secession against Pyatakov's opposition, as Finland and Ukraine pressed their demands on the Provisional Government ([[event:february-revolution]]).[cite:src_ml_connor_national][cite:src_smith_russia]`,
        history: `The phrase came from the democratic movements of the nineteenth century and was used by socialists from the 1860s. Its prominence in international politics after 1918, when Woodrow Wilson made it a principle of the peace settlement, lies outside this collection.[cite:src_ml_connor_national]`,
        interpretations: `Connor argues that Lenin's position was a strategy for winning the support of national movements, with the expectation that nations would not in fact choose to secede from a socialist state; others read it as a principled democratic commitment. Historians of Luxemburg have defended her as consistent in her internationalism, while noting that her expectations for Poland were not borne out.[cite:src_ml_connor_national][cite:src_nettl_luxemburg]`,
        criticisms: `Luxemburg argued that the right could not be realised under capitalism and, under socialism, would be decided by the working class, not by "nations". Bauer argued that territorial self-determination could not work where nations were mixed together, as in most of central and eastern Europe.[cite:src_ml_luxemburg_national][cite:src_ml_bauer_nationalities]`,
      },
      citations: [{ source: "src_ml_lenin_self_det" }, { source: "src_ml_luxemburg_national" }, { source: "src_ml_connor_national" }],
      flags: [
        { type: "specialist-review", field: "standard", note: "Check the wording of the London congress resolution of 1896 and clause 9 of the 1903 programme against a printed source (Lenin quotes both in The Right of Nations, ch. 8)." },
      ],
    },
    {
      key: "concept:national-cultural-autonomy",
      title: "National-cultural autonomy",
      fields: {
        yearStart: 1899,
        aliases: "Personal autonomy\nExtraterritorial national autonomy\nPersonalitätsprinzip\nNational autonomy",
        summary:
          "The Austro-Marxist proposal that nations should be organised as self-governing associations of persons, wherever they lived, with control over education and culture, rather than as territories. The Jewish Bund adopted it for the Russian Empire; Lenin and Luxemburg opposed it.",
        brief: `In central and eastern Europe nations did not live in separate territories: Germans, Czechs, Poles, Jews and Ukrainians lived side by side in the same towns. Drawing borders around them would always leave minorities. The Austrian socialists Karl Renner and Otto Bauer proposed instead that each nation be organised like a church: its members, wherever they lived, would register and elect bodies to run their own schools and cultural life, while the state stayed common to all.`,
        standard: `Karl Renner set out the "personal principle" in *State and Nation* (1899) and *The Struggle of the Austrian Nations for the State* (1902), under pseudonyms. The Austrian party's Brünn programme of 1899 called for a democratic federation of nationalities, with nationally delimited self-governing areas; a South Slav proposal for non-territorial autonomy was not adopted.[cite:src_ml_bottomore_austro]

[[thinker:otto-bauer]]'s *Question of Nationalities* (1907) gave the proposal a theory of the nation as a community of character formed by a common history, and argued that socialism would bring the masses into their national cultures rather than dissolve them ([[text:question-of-nationalities]]).[cite:src_ml_bauer_nationalities][cite:src_ml_bottomore_austro]

The Jewish Bund, whose constituency had no territory of its own, adopted national-cultural autonomy for the Jews of the Russian Empire, in principle in 1901 and fully in 1905 ([[tendency:jewish-labour-bund]]).[cite:src_ml_tobias_bund][cite:src_ml_frankel_prophecy]`,
        deep: `Lenin and his followers opposed it as dividing the workers by nation, above all in schools, and as a concession to nationalism. Stalin's *Marxism and the National Question* (1913), written in Vienna with Lenin's encouragement, attacked Bauer and the Bund and defined the nation by common language, territory, economic life and culture. [[thinker:luxemburg]] also rejected it, preferring territorial self-government ([[thinker:lenin]]; [[debate:the-national-question]]).[cite:src_ml_connor_national][cite:src_ml_lenin_self_det]

Defenders have argued that the proposal took seriously what its critics did not: that in mixed regions territorial self-determination would mean new minorities under new national states.[cite:src_ml_bauer_nationalities][cite:src_ml_bottomore_austro]`,
        criticisms: `Opponents argued that separating schools by nationality would hand education to clergy and nationalists and divide workers in the same factory. The Austrian party itself split along national lines between 1897 and 1911, when the Czech social democrats separated from the Austrian trade unions and party, which critics took as evidence that national autonomy within socialism did not hold.[cite:src_ml_connor_national][cite:src_ml_bottomore_austro]`,
      },
      citations: [{ source: "src_ml_bottomore_austro" }, { source: "src_ml_bauer_nationalities" }],
      flags: [
        { type: "specialist-review", field: "criticisms", note: "Check the dates of the Czech split in the Austrian social democratic movement (federalised party 1897; union and party split 1910–11)." },
      ],
    },
    {
      key: "tendency:austro-marxism",
      title: "Austro-Marxism",
      fields: {
        yearStart: 1904,
        periodLabel: "1904 –",
        color: "beige",
        aliases: "Austromarxismus\nThe Vienna school\nMarx-Studien",
        summary:
          "A group of Viennese Marxists, among them Max Adler, Rudolf Hilferding, Karl Renner, Otto Bauer and Friedrich Adler, who from 1904 published the Marx-Studien. They applied Marxism to questions the founders had left open: the nation, finance capital, law and the philosophy of science.",
        body: `The group formed among students at the University of Vienna around 1900. In 1904 Max Adler and [[thinker:hilferding]] began the series *Marx-Studien*, whose volumes included Hilferding's reply to Böhm-Bawerk's criticism of Marx (1904), Renner's study of the social function of law (1904), [[thinker:otto-bauer]]'s *Question of Nationalities* (1907) and Hilferding's *Finance Capital* (1910). From 1907 the monthly *Der Kampf* was their journal ([[text:question-of-nationalities]]; [[text:finance-capital]]).[cite:src_ml_bottomore_austro]

They shared a view of Marxism as a social science to be developed by research, open to the philosophy of the day (Max Adler drew on Kant) and to the new economics. Politically they stood between the German party's orthodox centre and its revisionists, and they had to work in a multinational state where the national question was the first question of politics ([[concept:national-cultural-autonomy]]).[cite:src_ml_bottomore_austro][cite:src_kolakowski]`,
        context: `The Austrian Social Democratic Party, led by Victor Adler, won universal manhood suffrage in 1907 after mass demonstrations. In 1914 it supported the war. On 21 October 1916 Friedrich Adler, the party leader's son and secretary of the party, shot dead the Austrian prime minister, Count Stürgkh, in protest against the war and the suspension of parliament ([[event:war-credits-1914]]).[cite:src_ml_bottomore_austro][cite:src_haupt_war]`,
        criticisms: `Lenin and the Bolsheviks attacked its national programme as a concession to nationalism; the German left found its politics cautious. Kołakowski credits it with the most original Marxist theory of its time.[cite:src_kolakowski][cite:src_ml_connor_national]`,
        legacy: `The name is usually credited to the American socialist Louis Boudin, around 1904. The school's later history, in the Austrian republic and the "Red Vienna" of the 1920s, lies outside this collection.[cite:src_ml_bottomore_austro]`,
      },
      citations: [{ source: "src_ml_bottomore_austro" }, { source: "src_kolakowski" }],
      flags: [
        { type: "specialist-review", field: "legacy", note: "Check the attribution of the name to Boudin (c. 1904) against Bottomore and Goode's introduction." },
      ],
    },
    {
      key: "thinker:otto-bauer",
      title: "Otto Bauer",
      fields: {
        yearStart: 1881,
        yearEnd: 1938,
        subtitle: "1881–1938",
        roles: "Austrian social democrat and theorist; author of The Question of Nationalities and Social Democracy",
        birthPlace: "Vienna",
        deathPlace: "Paris",
        summary:
          "The leading theorist of Austrian social democracy. His Question of Nationalities (1907), written at twenty-five, defined the nation as a community of character formed by a common history and proposed national autonomy for the peoples of the Habsburg empire.",
        body: `## Life

The son of a Jewish textile manufacturer in Vienna, Bauer studied law and joined the social democrats as a student. *The Question of Nationalities and Social Democracy* (1907) made his name. In the same year he co-founded the party monthly *Der Kampf* and became secretary of the party's parliamentary group ([[text:question-of-nationalities]]; [[tendency:austro-marxism]]).[cite:src_ml_bottomore_austro][cite:src_ml_bauer_nationalities]

Called up in 1914 as a reserve officer, he was captured on the eastern front in November and spent nearly three years as a prisoner of war in Siberia. He returned to Vienna in September 1917 and joined the party's left, which opposed the war.[cite:src_ml_bottomore_austro]

## Ideas

Bauer argued that nations were not natural or eternal but historical communities, shaped by a shared fate into a common character. Under capitalism only the propertied classes shared fully in national culture; socialism would bring the workers into it. The Habsburg state should be reorganised so that each nation governed its own culture and education as a corporate body of persons, not territories ([[concept:national-cultural-autonomy]]).[cite:src_ml_bauer_nationalities]`,
        context: `He wrote for a multinational party in a multinational state where Germans, Czechs, Poles, Ukrainians, Italians and South Slavs competed over schools, offices and language rights, and where the party itself was dividing on national lines.[cite:src_ml_bottomore_austro]`,
        legacy: `After 1918 Bauer was briefly foreign minister of the Austrian republic and led the party until 1934; that period lies outside this collection. His theory of the nation was attacked by Lenin and Stalin and revived by later scholars of nationalism.[cite:src_ml_bauer_nationalities][cite:src_ml_connor_national]`,
      },
      citations: [{ source: "src_ml_bauer_nationalities" }, { source: "src_ml_bottomore_austro" }],
    },
    {
      key: "text:question-of-nationalities",
      title: "The Question of Nationalities and Social Democracy",
      fields: {
        yearStart: 1907,
        subtitle: "Bauer's theory of the nation",
        originalTitle: "Die Nationalitätenfrage und die Sozialdemokratie",
        language: "German",
        form: "book",
        publicationNote: "Vienna, 1907, as volume 2 of the Marx-Studien; second edition 1924",
        edition: "ed. Ephraim J. Nimni, trans. Joseph O'Donnell (University of Minnesota Press, 2000)",
        difficulty: "3",
        aliases: "Die Nationalitätenfrage und die Sozialdemokratie\nThe Nationalities Question",
        summary:
          "Bauer's study of the nation and of the national conflicts of the Habsburg empire. It treats the nation as a historical community of character and proposes that nations be organised as self-governing cultural associations of persons within a democratic federal state.",
        body: `The first part offers a theory of the nation. Bauer rejects definitions by race, language or territory alone and defines the nation as a community of character that has grown out of a community of fate: people who share a history come to share habits, culture and outlook. In class society the national culture belongs mainly to the ruling classes; the masses are its "tenants". Socialism will make the whole people a nation of culture ([[thinker:otto-bauer]]).[cite:src_ml_bauer_nationalities]

The second part analyses the national struggles of Austria-Hungary as conflicts produced by capitalist development, which drew peasant peoples into the towns and into politics. The third proposes the reorganisation of the empire on the personal principle: each nation organised as a public body with its own elected representation, responsible for schools and cultural affairs, irrespective of where its members lived ([[concept:national-cultural-autonomy]]).[cite:src_ml_bauer_nationalities][cite:src_ml_bottomore_austro]

A section on the Jews argued, against the Bund, that they were losing their national character and would assimilate ([[tendency:jewish-labour-bund]]).[cite:src_ml_bauer_nationalities][cite:src_ml_frankel_prophecy]`,
        context: `The book was the most ambitious Marxist study of nationality before 1917 and the main target of Lenin's and Stalin's writings on the national question in 1913–14 ([[text:right-of-nations-to-self-determination]]; [[debate:the-national-question]]).[cite:src_ml_connor_national][cite:src_ml_bottomore_austro]`,
      },
      citations: [{ source: "src_ml_bauer_nationalities" }, { source: "src_ml_bottomore_austro" }],
      flags: [
        { type: "missing-source", field: "body", note: "No checkable online English text was found, so the book is paraphrased, not quoted. The expressions \"community of character\" and \"community of fate\" follow the 2000 translation and should be checked against it." },
      ],
    },
    {
      key: "tendency:jewish-labour-bund",
      title: "The Jewish Labour Bund",
      fields: {
        yearStart: 1897,
        periodLabel: "1897 –",
        color: "ochre",
        aliases: "The Bund\nAlgemeyner Yidisher Arbeter Bund\nGeneral Jewish Workers' Union\nBundism",
        summary:
          "The socialist party of Jewish workers in the Russian Empire, founded in Vilna in 1897. A founder of the Russian Social Democratic Labour Party, it demanded autonomy within it and, from 1901–05, national-cultural autonomy for the Jews; its conflict with the Iskra group helped bring about the split of 1903.",
        body: `The Bund was founded at a secret congress in Vilna in October 1897 by Jewish social democrats who had been agitating among artisans and workers in Yiddish since the early 1890s. It quickly became the largest social democratic organisation in the empire, and in 1898 it was one of the founders of the Russian Social Democratic Labour Party.[cite:src_ml_tobias_bund][cite:src_ml_frankel_prophecy]

From 1901 the Bund described the Jews as a nation and demanded that the party be organised federally, with the Bund as the sole representative of Jewish workers. At the second congress in 1903 the *Iskra* majority, including [[thinker:lenin]], [[thinker:martov]] and [[thinker:plekhanov]], rejected the demand and the Bund delegates walked out, which changed the balance of votes and left Lenin's supporters with their majority ([[event:bolshevik-menshevik-split]]).[cite:src_ml_tobias_bund][cite:src_harding_lenin]

It organised self-defence against the pogroms of 1903–06, played a large part in the revolution of 1905, and rejoined the Russian party in 1906. Its programme of national-cultural autonomy for the Jews, adopted in full in 1905, drew on the Austro-Marxists ([[concept:national-cultural-autonomy]]; [[event:revolution-1905]]).[cite:src_ml_frankel_prophecy][cite:src_ml_tobias_bund]`,
        context: `The Bund rejected Zionism, holding that the Jews' future lay in the countries where they lived, in Yiddish culture and in the socialist movement. It was attacked from both sides: by Zionists for denying a Jewish homeland, and by Lenin, Stalin and the Iskra group for separatism. After 1906 it generally aligned with the Mensheviks ([[tendency:menshevism]]).[cite:src_ml_frankel_prophecy]`,
        legacy: `The Bund's history after 1917, in independent Poland and in the Soviet Union, lies outside this collection.[cite:src_ml_frankel_prophecy]`,
      },
      citations: [{ source: "src_ml_tobias_bund" }, { source: "src_ml_frankel_prophecy" }],
    },
    {
      key: "text:national-question-and-autonomy",
      title: "The National Question and Autonomy",
      fields: {
        yearStart: 1908,
        yearEnd: 1909,
        subtitle: "Luxemburg against the right of nations to self-determination",
        originalTitle: "Kwestia narodowościowa i autonomia",
        language: "Polish",
        form: "article",
        publicationNote: "Series of articles in Przegląd Socjaldemokratyczny (Kraków), 1908–09",
        edition: "in Horace B. Davis (ed.), The National Question: Selected Writings by Rosa Luxemburg (Monthly Review Press, 1976)",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/luxemburg/1909/national-question/index.htm",
        aliases: "Kwestia narodowościowa i autonomia",
        summary:
          "Luxemburg's articles against the right of nations to self-determination in the Russian party's programme. She argued that the slogan was an abstraction borrowed from bourgeois nationalism, that Polish independence was neither possible nor in the workers' interest, and that socialists should demand democratic autonomy within the existing state.",
        body: `Luxemburg begins with the clause on self-determination in the programme of 1903. A "right of nations", she argues, says nothing about the class content of a nation's demands and repeats the old liberal slogan of national freedom; in a class society "the nation" does not have a single will ([[concept:national-self-determination]]).[cite:src_ml_luxemburg_national]

She then argues from economics and history. Capitalist development had bound Russian Poland to the Russian market, and the Polish bourgeoisie had no interest in independence; the small nations of Europe were being absorbed by the great states; national independence movements served one great power against another. Socialists should demand democratic local self-government for Poland within a democratic Russia, alongside equal rights for all nationalities.[cite:src_ml_luxemburg_national][cite:src_nettl_luxemburg]`,
        context: `The articles continued the fight Luxemburg's party, the Social Democracy of the Kingdom of Poland and Lithuania, had waged since the 1890s against the Polish Socialist Party, whose programme put independence first. Lenin answered them in *The Right of Nations to Self-Determination* (1914) ([[thinker:luxemburg]]; [[text:right-of-nations-to-self-determination]]).[cite:src_nettl_luxemburg][cite:src_ml_lenin_self_det]`,
      },
      citations: [{ source: "src_ml_luxemburg_national" }, { source: "src_nettl_luxemburg" }],
    },
    {
      key: "text:right-of-nations-to-self-determination",
      title: "The Right of Nations to Self-Determination",
      fields: {
        yearStart: 1914,
        subtitle: "Lenin's reply to Luxemburg",
        originalTitle: "O prave natsii na samoopredelenie",
        language: "Russian",
        form: "article",
        publicationNote: "Prosveshcheniye, nos 4–6, April–June 1914",
        edition: "Lenin, Collected Works, vol. 20",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/lenin/works/1914/self-det/index.htm",
        aliases: "O prave natsii na samoopredelenie",
        summary:
          "Lenin's defence of the right of nations to secede, written against Luxemburg. He distinguished the nationalism of oppressing and oppressed nations, argued that socialists must support the democratic content of the latter, and held that recognising the right to secede was the condition for uniting workers of all nations.",
        body: `Lenin defines self-determination as the right to political separation, the formation of a separate national state. He argues that Luxemburg confused two questions: whether a right should be recognised in the programme, and whether a particular secession should be supported. Socialists recognise the right as they recognise the right to divorce, without thereby recommending it in every case ([[concept:national-self-determination]]).[cite:src_ml_lenin_self_det]

The core of the argument concerns the Russian Empire, where Great Russians were a minority of the population and the other nations were oppressed by the state. The nationalism of an oppressed nation has a general democratic content against oppression, which socialists support unconditionally, while opposing its tendency to national exclusiveness. A Russian socialist who refused the right of secession would in practice side with Great Russian chauvinism.[cite:src_ml_lenin_self_det]

The articles also review the history of the question in Marx's writings on Ireland and Poland and in the International's resolution of 1896 ([[thinker:marx]]).[cite:src_ml_lenin_self_det]`,
        context: `The text belongs to Lenin's campaign of 1913–14 against Austro-Marxist national autonomy, the Bund, and Luxemburg's rejection of self-determination ([[concept:national-cultural-autonomy]]; [[text:national-question-and-autonomy]]). Lenin returned to it during the war against Bukharin and Pyatakov, who argued that imperialism had made the slogan obsolete ([[debate:the-national-question]]).[cite:src_ml_connor_national][cite:src_ml_lenin_self_det_summed]`,
      },
      citations: [{ source: "src_ml_lenin_self_det" }, { source: "src_ml_connor_national" }],
    },

    /* ——— Ireland ——— */
    {
      key: "thinker:connolly",
      title: "James Connolly",
      fields: {
        yearStart: 1868,
        yearEnd: 1916,
        subtitle: "1868–1916",
        roles: "Irish socialist, trade union organiser and historian; commander of the Irish Citizen Army in the Easter Rising",
        birthPlace: "Edinburgh",
        deathPlace: "Dublin",
        summary:
          "A socialist born to Irish parents in Edinburgh who argued that national independence and socialism in Ireland were one cause. He founded the Irish Socialist Republican Party, organised for the IWW in the United States, wrote Labour in Irish History, led the Irish Citizen Army in the Easter Rising and was executed in May 1916.",
        body: `## Life

Born in the Cowgate in Edinburgh to Irish immigrant parents, Connolly served in the British army as a young man and became a socialist in Scotland. In 1896 he moved to Dublin as an organiser and founded the Irish Socialist Republican Party, whose paper, *The Workers' Republic*, argued for an Irish socialist republic.[cite:src_ml_nevin_connolly]

From 1903 to 1910 he lived in the United States, where he worked with Daniel De Leon's Socialist Labor Party, organised for the Industrial Workers of the World and then for the Socialist Party ([[event:iww-founding]]). Back in Ireland, he became an organiser of the Irish Transport and General Workers' Union under James Larkin, and was one of the leaders of the Dublin lockout of 1913.[cite:src_ml_nevin_connolly][cite:src_ml_dubofsky_iww]

## War and rising

In 1914 he opposed the war and the recruitment of Irishmen to the British army. Commanding the Irish Citizen Army, the workers' militia formed during the lockout, he joined the leaders of the Irish Volunteers in planning a rising. He signed the Proclamation of the Republic, commanded the rebel forces in Dublin, was wounded, and after the surrender was court-martialled and shot at Kilmainham on 12 May 1916 ([[event:easter-rising]]).[cite:src_ml_townshend_easter][cite:src_ml_nevin_connolly]

## Ideas

Connolly held that the Irish national question could not be separated from the social question. English conquest had replaced Gaelic communal landholding with private property; Irish nationalists of the propertied classes wanted independence without changing that property; only the working class could carry the national struggle through, and only national independence would let the Irish working class take control of its country ([[text:labour-in-irish-history]]; [[concept:national-self-determination]]).[cite:src_ml_connolly_lih][cite:src_ml_nevin_connolly]

He was also a syndicalist in his view of the union: industrial unions would be the framework of the future socialist commonwealth ([[tendency:revolutionary-syndicalism]]).[cite:src_ml_nevin_connolly]`,
        context: `Ireland was ruled from London; the Home Rule bill passed in 1914 was suspended for the duration of the war, and Ulster unionists had armed to resist it. Connolly's decision to join a rising with the nationalists puzzled many socialists abroad.[cite:src_ml_townshend_easter]`,
        legacy: `Connolly's combination of nationalism and socialism is contested: Irish nationalists claimed him as a martyr of the nation, socialists as a Marxist who saw the rising as the opening of a European revolution, and revisionist historians have questioned whether he abandoned socialism for nationalism in 1916.[cite:src_ml_nevin_connolly][cite:src_ml_townshend_easter]`,
      },
      citations: [{ source: "src_ml_nevin_connolly" }, { source: "src_ml_townshend_easter" }],
      flags: [
        { type: "disputed", field: "legacy", note: "Interpretations of Connolly in 1916 divide nationalist, socialist and revisionist historians. Check that the entry presents them without adjudicating." },
      ],
    },
    {
      key: "text:labour-in-irish-history",
      title: "Labour in Irish History",
      fields: {
        yearStart: 1910,
        subtitle: "Connolly's socialist history of Ireland",
        language: "English",
        form: "book",
        publicationNote: "Dublin: Maunsel, 1910; chapters first serialised in The Workers' Republic and The Harp",
        edition: "Dublin: New Books, 1983 and later reprints",
        difficulty: "1",
        readingUrl: "https://www.marxists.org/archive/connolly/1910/lih/index.htm",
        summary:
          "Connolly's history of Ireland from the seventeenth to the nineteenth century written from the standpoint of the working class. It argues that the propertied leaders of Irish nationalism repeatedly betrayed the poor, and that the cause of Irish freedom was the cause of labour.",
        body: `The book reinterprets Irish history from the Williamite wars to the Young Irelanders and the Fenians. Connolly argues that the Gaelic order had held land in common, that English conquest imposed private property in land, and that the Irish gentry and middle class accepted that order and asked the poor to defend it in the name of nation and religion ([[thinker:connolly]]).[cite:src_ml_connolly_lih]

Against them he sets a tradition of agrarian and labour radicalism, from the United Irishmen's appeal to "men of no property" to the Fenians and the social radicals of 1848, and concludes that national freedom and the emancipation of labour in Ireland are one struggle ([[concept:national-self-determination]]).[cite:src_ml_connolly_lih][cite:src_ml_nevin_connolly]`,
        context: `Written mainly in the United States and published on Connolly's return to Ireland, it was the first Marxist history of Ireland and shaped the Irish left's reading of its past.[cite:src_ml_nevin_connolly]`,
      },
      citations: [{ source: "src_ml_connolly_lih" }, { source: "src_ml_nevin_connolly" }],
      flags: [
        { type: "specialist-review", field: "body", note: "Check the attribution of the phrase \"men of no property\" to the United Irishmen as Connolly uses it (Wolfe Tone's phrase); if not in the book, remove the quotation marks." },
      ],
    },
    {
      key: "event:easter-rising",
      title: "The Easter Rising",
      fields: {
        yearStart: 1916,
        subtitle: "The rising for an Irish Republic in Dublin",
        dateLabel: "24–29 April 1916",
        place: "Dublin",
        eventType: "uprising",
        summary:
          "An armed rising in Dublin by the Irish Volunteers and James Connolly's Irish Citizen Army, which proclaimed an Irish Republic and held out for six days. Its leaders were executed. Among socialists it raised the question of how to judge a national rising in the middle of an imperialist war.",
        body: `On Easter Monday, 24 April 1916, some fifteen hundred members of the Irish Volunteers and the Irish Citizen Army occupied the General Post Office and other buildings in Dublin, and Patrick Pearse read a Proclamation of the Irish Republic. Plans for a national rising had been disrupted, and German arms for it had been intercepted. British troops and artillery forced the surrender on 29 April; several hundred people were killed, more than half of them civilians.[cite:src_ml_townshend_easter]

Fifteen leaders were executed in May, among them Pearse and [[thinker:connolly]], and some 3,500 people were arrested.[cite:src_ml_townshend_easter][cite:src_ml_nevin_connolly]`,
        significance: `The executions turned Irish opinion towards the republicans. In the socialist movement the rising became a test case in the debate on national self-determination: Karl Radek dismissed it as a "putsch", and [[thinker:lenin]] answered that a rising which had drawn the sympathy of the masses deserved the support of socialists, and that "whoever expects a 'pure' social revolution will never live to see it" ([[concept:national-self-determination]]; [[debate:the-national-question]]).[cite:src_ml_lenin_self_det_summed][cite:src_ml_townshend_easter]`,
      },
      citations: [{ source: "src_ml_townshend_easter" }, { source: "src_ml_lenin_self_det_summed" }],
      flags: [
        { type: "specialist-review", field: "body", note: "Check the figures (about 1,500 rebels; fifteen executed in May, including Thomas Kent in Cork; about 3,500 arrests) against Townshend." },
      ],
    },

    /* ——— Imperialism ——— */
    {
      key: "thinker:hobson",
      title: "J. A. Hobson",
      fields: {
        yearStart: 1858,
        yearEnd: 1940,
        subtitle: "1858–1940",
        roles: "English economist and journalist; theorist of underconsumption and critic of imperialism",
        birthPlace: "Derby",
        deathPlace: "London",
        aliases: "John Atkinson Hobson",
        summary:
          "A liberal economist outside the academic mainstream whose Imperialism: A Study (1902) traced colonial expansion to surplus capital seeking investment abroad, a result of the unequal distribution of income at home. Not a socialist, he was the main source for Lenin's Imperialism.",
        body: `## Life

The son of a Derby newspaper proprietor, Hobson studied at Oxford and taught classics before turning to economics. *The Physiology of Industry* (1889), written with A. F. Mummery, argued that saving could exceed what industry could profitably use; the doctrine of "underconsumption" made him a heretic to orthodox economists and cost him university extension lecturing in economics.[cite:src_ml_cain_hobson]

He reported on South Africa for the *Manchester Guardian* in 1899, and wrote against the Boer War. *Imperialism: A Study* followed in 1902 ([[text:imperialism-a-study]]).[cite:src_ml_cain_hobson]

## Ideas

Hobson argued that imperialism did not pay for the nation as a whole, only for particular interests: investors, financiers, armament makers, the military and colonial services. Its root was the maldistribution of income, which left the mass of the population unable to buy what industry produced and the rich with savings that could find no profitable use at home. The cure was social reform: higher wages and public spending would absorb the surplus at home ([[concept:imperialism]]).[cite:src_hobson_imperialism][cite:src_ml_cain_hobson]`,
        context: `Hobson was a "new Liberal", close to the Fabians and later to the Labour Party, and a critic of Marxism. His writing on the Boer War also blamed a small group of mostly Jewish financiers, in terms that Cain and other historians treat as antisemitic; the theme is muted in *Imperialism* but present ([[tendency:fabianism]]).[cite:src_ml_cain_hobson]`,
        legacy: `[[thinker:lenin]] drew heavily on Hobson's evidence while rejecting his reformist conclusion. Later economists, notably Keynes, acknowledged him as a forerunner of the theory of effective demand.[cite:src_mia_imperialism][cite:src_ml_cain_hobson]`,
      },
      citations: [{ source: "src_ml_cain_hobson" }, { source: "src_hobson_imperialism" }],
    },
    {
      key: "text:imperialism-a-study",
      title: "Imperialism: A Study",
      fields: {
        yearStart: 1902,
        subtitle: "Hobson's economic critique of empire",
        language: "English",
        form: "book",
        publicationNote: "London: James Nisbet, 1902; revised editions 1905 and 1938",
        edition: "3rd edition (Allen & Unwin, 1938)",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/hobson/1902/imperialism/index.htm",
        summary:
          "Hobson's study of the new imperialism of the 1880s and 1890s. Part I argues that empire does not pay the nation but serves investors and finance, and that its root is surplus capital produced by unequal distribution at home; Part II examines its politics, from militarism to the government of subject peoples.",
        body: `Hobson begins by measuring the new empire acquired since 1870 and showing how little it contributed to British trade. If it did not pay the nation, why was it pursued? His answer was that particular interests gained from it, and above all investors seeking outlets for capital abroad, with financiers coordinating them ([[thinker:hobson]]).[cite:src_hobson_imperialism]

The sixth chapter of Part I names the "taproot" of imperialism: the excess of goods and capital that the home market could not absorb because income was so unequally distributed. Trade unionism and social reform, by raising consumption at home, would remove the motive ([[concept:imperialism]]).[cite:src_hobson_imperialism][cite:src_ml_cain_hobson]

Part II treats the political consequences: militarism, the decline of parliamentary government, the effects of imperial rule on subject peoples, and the danger that the great powers would combine to exploit the rest of the world, which Hobson called "inter-Imperialism".[cite:src_hobson_imperialism][cite:src_ml_brewer_imperialism]`,
        context: `The book came out at the end of the Boer War and was read by liberals and socialists across Europe. Lenin cited it throughout *Imperialism, the Highest Stage of Capitalism* (1916), and Kautsky's idea of ultra-imperialism resembles Hobson's "inter-Imperialism" ([[text:imperialism-highest-stage]]; [[concept:ultra-imperialism]]).[cite:src_mia_imperialism][cite:src_ml_brewer_imperialism]`,
      },
      citations: [{ source: "src_hobson_imperialism" }, { source: "src_ml_cain_hobson" }],
    },
    {
      key: "thinker:hilferding",
      title: "Rudolf Hilferding",
      fields: {
        yearStart: 1877,
        yearEnd: 1941,
        subtitle: "1877–1941",
        roles: "Austrian-German doctor, economist and social democratic journalist; author of Finance Capital",
        birthPlace: "Vienna",
        deathPlace: "Paris",
        summary:
          "A Viennese doctor turned economist whose Finance Capital (1910) described the merging of bank and industrial capital, cartels, protectionism and capital export, and called the result imperialism. It was the most influential Marxist work of economics after Capital.",
        body: `## Life

The son of a Jewish merchant in Vienna, Hilferding trained as a doctor and practised in Vienna while writing on economics. His reply to Eugen von Böhm-Bawerk's critique of Marx's theory of value opened the *Marx-Studien* in 1904 ([[tendency:austro-marxism]]).[cite:src_ml_smaldone_hilferding][cite:src_ml_bottomore_austro]

In 1906 [[thinker:kautsky]] and Bebel brought him to Berlin to teach at the SPD's party school, and from 1907 he was foreign editor of *Vorwärts*. *Finance Capital* appeared in 1910 ([[text:finance-capital]]).[cite:src_ml_smaldone_hilferding]

During the war, as an Austrian citizen, he served as a doctor in the Austro-Hungarian army, and sided with the opposition to the SPD majority's war policy.[cite:src_ml_smaldone_hilferding]

## Ideas

Hilferding argued that capitalism had entered a new phase. The concentration of industry and the rise of joint-stock companies made industry dependent on the banks, and the banks became owners of industry: the capital that resulted he called finance capital. It sought monopoly through cartels, protection through tariffs, and new fields through the export of capital, and it drew the state into an aggressive foreign policy ([[concept:finance-capital]]; [[concept:imperialism]]).[cite:src_ml_hilferding_fc]

The same concentration made socialism easier: control of a few great banks would give society control of the main branches of industry.[cite:src_ml_hilferding_fc][cite:src_ml_brewer_imperialism]`,
        legacy: `After 1918 Hilferding became a leading theorist of the SPD and twice minister of finance in the Weimar Republic; his later idea of "organised capitalism" and his death in Gestapo custody in 1941 lie outside this collection.[cite:src_ml_smaldone_hilferding]`,
      },
      citations: [{ source: "src_ml_smaldone_hilferding" }, { source: "src_ml_hilferding_fc" }],
      flags: [
        { type: "specialist-review", field: "body", note: "Check Hilferding's position during the war (removal from the Vorwärts editorial board in 1915–16; relations with the Independents from 1917) against Smaldone." },
      ],
    },
    {
      key: "text:finance-capital",
      title: "Finance Capital",
      fields: {
        yearStart: 1910,
        subtitle: "Hilferding's study of the latest phase of capitalism",
        originalTitle: "Das Finanzkapital: Eine Studie über die jüngste Entwicklung des Kapitalismus",
        language: "German",
        form: "book",
        publicationNote: "Vienna, 1910, as volume 3 of the Marx-Studien",
        edition: "ed. Tom Bottomore, trans. Morris Watnick and Sam Gordon (Routledge & Kegan Paul, 1981)",
        difficulty: "3",
        readingUrl: "https://www.marxists.org/archive/hilferding/1910/finkap/index.htm",
        aliases: "Das Finanzkapital\nFinance Capital: A Study of the Latest Phase of Capitalist Development",
        summary:
          "Hilferding's analysis of money, credit, joint-stock companies, banks and cartels, culminating in the concept of finance capital and an account of imperialism as its policy. Widely regarded as the continuation of Marx's Capital, it was the basis of Lenin's and Bukharin's theories of imperialism.",
        body: `The book is in five parts. The first two develop Marx's theory of money and credit and analyse the joint-stock company, in which ownership separates from management and founders make a "promoter's profit" by capitalising expected earnings. The third shows how competition leads to concentration and to cartels and trusts, and how the banks, as lenders and shareholders, come to dominate industry ([[thinker:hilferding]]).[cite:src_ml_hilferding_fc][cite:src_ml_brewer_imperialism]

Bank capital invested in industry in this way is what Hilferding calls finance capital. The fourth part, on crises, argues that cartels change the form of crises without abolishing them ([[concept:finance-capital]]).[cite:src_ml_hilferding_fc]

The fifth part concerns economic policy. Finance capital abandons free trade for protective tariffs, which secure monopoly profits at home and serve as a base for dumping abroad; it exports capital to less developed countries and needs a strong state to protect its investments. Its ideology is imperialism, the idea of national power and domination in place of liberal freedom. The proletariat's answer cannot be a return to free trade, only socialism ([[concept:imperialism]]).[cite:src_ml_hilferding_fc]`,
        context: `Kautsky called it a continuation of *Capital*, and it became the common starting point of Marxist discussion of imperialism: Lenin took its account of finance capital and monopoly, Bukharin its picture of national capitals fused with their states ([[text:imperialism-highest-stage]]; [[text:imperialism-and-world-economy]]). Luxemburg's *Accumulation of Capital* (1913) went in a different direction ([[text:accumulation-of-capital]]).[cite:src_ml_brewer_imperialism][cite:src_ml_day_gaido_imperialism]

Critics have noted that the dominance of banks over industry fitted Germany and Austria better than Britain or the United States.[cite:src_ml_brewer_imperialism]`,
      },
      citations: [{ source: "src_ml_hilferding_fc" }, { source: "src_ml_brewer_imperialism" }],
    },
    {
      key: "concept:finance-capital",
      title: "Finance capital",
      fields: {
        yearStart: 1910,
        aliases: "Finanzkapital\nBank capital",
        summary:
          "Hilferding's term for bank capital invested in and controlling industry: the fusion of banking and industrial capital in large concentrated firms and cartels. He and Lenin made it the basis of their accounts of imperialism.",
        brief: `By 1900 the great German firms were joint-stock companies that raised money through the banks, and the banks held their shares and sat on their boards. Hilferding called the capital that resulted "finance capital": money capital of the banks that had become industrial capital, with the banks in control. He argued that it explained the new features of capitalism, from cartels to colonial expansion.`,
        standard: `In *Finance Capital* (1910) [[thinker:hilferding]] defined it as bank capital, capital in money form, transformed into industrial capital. Its rise rested on the joint-stock company and on concentration: as firms grew, they depended on bank credit, and banks became their owners. Finance capital favours cartels over competition, protective tariffs over free trade, and the export of capital over the export of goods ([[text:finance-capital]]).[cite:src_ml_hilferding_fc]

[[thinker:lenin]] adopted the term in *Imperialism, the Highest Stage of Capitalism* (1916), defining finance capital as the merging of bank capital with industrial capital and the rule of a "financial oligarchy". Imperialism, for him, was the monopoly stage in which finance capital dominates ([[text:imperialism-highest-stage]]; [[concept:imperialism]]).[cite:src_mia_imperialism]`,
        deep: `The concept carried a political argument. If a small number of banks controlled industry, the transition to socialism would be simpler: Hilferding suggested that seizing six large Berlin banks would give society control of the most important branches of industry. Lenin made a similar point in 1917 about the banks as the apparatus of socialist accounting.[cite:src_ml_hilferding_fc][cite:src_state_revolution]

It also raised a question that divided Marxists. Did finance capital make war inevitable, or could the financiers of different nations cooperate? Kautsky drew the second conclusion, Lenin and Bukharin the first ([[concept:ultra-imperialism]]; [[debate:what-drives-imperialism]]).[cite:src_mia_kautsky_ultra][cite:src_ml_brewer_imperialism]`,
        criticisms: `Historians of business have questioned how far banks controlled industry even in Germany; in Britain the banks largely kept out of industrial finance. Later Marxists also distinguished between monopoly and finance capital.[cite:src_ml_brewer_imperialism]`,
      },
      citations: [{ source: "src_ml_hilferding_fc" }, { source: "src_mia_imperialism" }, { source: "src_ml_brewer_imperialism" }],
    },
    {
      key: "concept:ultra-imperialism",
      title: "Ultra-imperialism",
      fields: {
        yearStart: 1914,
        aliases: "Ultraimperialismus\nInter-imperialism",
        summary:
          "Kautsky's suggestion, in an article written as the war began, that the great capitalist powers might pass from rivalry to a cartel for the joint exploitation of the world, ending the arms race. Lenin and Bukharin attacked it as an illusion that excused the war.",
        brief: `If capitalists inside a country could form cartels instead of competing, could the great powers do the same? In 1914 Kautsky suggested they might: imperialism might give way to a joint exploitation of the world by an alliance of the capitalist powers, which he called ultra-imperialism. He did not think this would be good, only that war might not be inevitable.`,
        standard: `[[thinker:kautsky]] argued in "Der Imperialismus", published in *Die Neue Zeit* in September 1914 but written before the war began, that imperialism was a policy preferred by finance capital, not an economic necessity. The costs of armaments and war might lead the capitalists of the great powers to combine, as cartels had combined within nations. The result would be a phase of ultra-imperialism, to be fought like imperialism but with different dangers.[cite:src_mia_kautsky_ultra][cite:src_salvadori_kautsky]

[[thinker:lenin]] replied in *Imperialism, the Highest Stage of Capitalism* that any such alliance would be a truce between wars, since uneven development would always upset the division of the world. [[thinker:bukharin]] gave the economic argument: the national capitals had fused with their states into "state capitalist trusts" whose competition took the form of war ([[text:imperialism-highest-stage]]; [[text:imperialism-and-world-economy]]).[cite:src_mia_imperialism][cite:src_ml_bukharin_iwe]`,
        deep: `The dispute was also political. Lenin read the theory as a justification for the "centre" of the International, which hoped for a negotiated peace and a restored International rather than revolution ([[debate:socialists-and-the-war]]). Defenders of Kautsky point out that he did not predict ultra-imperialism, only allowed for it, and that the article was written before the war ([[debate:what-drives-imperialism]]).[cite:src_salvadori_kautsky][cite:src_ml_day_gaido_imperialism]

Hobson had raised a similar possibility in 1902 under the name "inter-Imperialism", a federation of the great powers living on tribute from Asia and Africa.[cite:src_hobson_imperialism][cite:src_ml_brewer_imperialism]`,
        history: `The idea was revived in discussions of relations among the capitalist powers after 1945, which lie outside this collection.[cite:src_ml_brewer_imperialism]`,
      },
      citations: [{ source: "src_mia_kautsky_ultra" }, { source: "src_salvadori_kautsky" }, { source: "src_mia_imperialism" }],
    },
    {
      key: "thinker:bukharin",
      title: "Nikolai Bukharin",
      fields: {
        yearStart: 1888,
        yearEnd: 1938,
        subtitle: "1888–1938",
        roles: "Russian Bolshevik economist and theorist; author of Imperialism and World Economy",
        birthPlace: "Moscow",
        deathPlace: "Moscow",
        aliases: "Nikolai Ivanovich Bukharin",
        summary:
          "A young Moscow Bolshevik who in exile became the faction's leading economist. His Imperialism and World Economy (written 1915) described the world economy as a struggle between national state capitalist trusts. He differed with Lenin over the state and over national self-determination.",
        body: `## Life

The son of Moscow schoolteachers, Bukharin joined the Bolsheviks as a student in 1906 and worked in the Moscow organisation until his arrest and exile in 1910–11. He escaped abroad and studied economics in Vienna, where he wrote a critique of the Austrian marginalist school, and then lived in Switzerland, Scandinavia and the United States, where in 1916–17 he edited the Russian socialist paper *Novyi mir* in New York with Trotsky ([[tendency:bolshevism]]).[cite:src_ml_cohen_bukharin]

He returned to Russia in May 1917, became a leader of the Moscow Bolsheviks, and was elected to the Central Committee in August ([[event:october-revolution]]).[cite:src_ml_cohen_bukharin]

## Ideas

In *Imperialism and World Economy*, finished in 1915 with a preface by Lenin, Bukharin described a world economy in which national capitals had fused with their states into "state capitalist trusts", whose competition took the form of war ([[text:imperialism-and-world-economy]]).[cite:src_ml_bukharin_iwe][cite:src_ml_cohen_bukharin]

From this he drew conclusions that Lenin at first rejected. In 1915–16 he argued, with Pyatakov, that national self-determination was impossible under imperialism and should be dropped from the programme; and in an article of 1916 he argued that socialists must aim to destroy the imperialist state, a view Lenin first criticised and then took up in *The State and Revolution* ([[concept:national-self-determination]]; [[text:the-state-and-revolution]]).[cite:src_ml_cohen_bukharin][cite:src_harding_lenin]`,
        legacy: `After 1917 Bukharin was one of the main Bolshevik leaders, the editor of *Pravda*, and later the main defender of the New Economic Policy; he was tried and shot in 1938. This collection covers him only to 1917.[cite:src_ml_cohen_bukharin]`,
      },
      citations: [{ source: "src_ml_cohen_bukharin" }, { source: "src_ml_bukharin_iwe" }],
    },
    {
      key: "text:imperialism-and-world-economy",
      title: "Imperialism and World Economy",
      fields: {
        yearStart: 1915,
        subtitle: "Bukharin's theory of state capitalist trusts",
        originalTitle: "Mirovoe khoziaistvo i imperializm",
        language: "Russian",
        form: "book",
        publicationNote: "Written 1915, with a preface by Lenin dated December 1915; published in Petrograd in 1918",
        edition: "Merlin Press, 1972",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/bukharin/works/1917/imperial/index.htm",
        aliases: "Mirovoe khoziaistvo i imperializm\nWorld Economy and Imperialism",
        summary:
          "Bukharin's account of imperialism as the competition of national state capitalist trusts on the world market. It argued that the internationalisation of the economy and its organisation into national blocs, fused with their states, made war the form of capitalist competition.",
        body: `Bukharin describes two tendencies at once. Production and trade had become international, forming a world economy; at the same time capital was organised nationally, in cartels, trusts and banks increasingly fused with the state. Each nation's capitalist class became something like a single trust, and competition between these state capitalist trusts was fought with tariffs, colonies and, finally, armies.[cite:src_ml_bukharin_iwe][cite:src_ml_brewer_imperialism]

The last chapters reject Kautsky's ultra-imperialism: agreements between national trusts were possible in principle but unstable in practice, because of their uneven development ([[concept:ultra-imperialism]]).[cite:src_ml_bukharin_iwe]`,
        context: `Lenin wrote the preface in December 1915, but the book could not be published until after the revolution. It was written before Lenin's *Imperialism* and influenced it; Bukharin's picture of an all-powerful imperialist state also shaped his dispute with Lenin over the state in 1916 ([[text:imperialism-highest-stage]]; [[thinker:bukharin]]).[cite:src_ml_cohen_bukharin][cite:src_ml_brewer_imperialism]`,
      },
      citations: [{ source: "src_ml_bukharin_iwe" }, { source: "src_ml_cohen_bukharin" }],
    },
    {
      key: "concept:labour-aristocracy",
      title: "Labour aristocracy",
      fields: {
        yearStart: 1858,
        aliases: "Aristocracy of labour\nWorking-class aristocracy\nArbeiteraristokratie",
        summary:
          "A better-paid stratum of skilled workers who, Engels argued for Britain, shared in the benefits of industrial and colonial monopoly and accepted capitalism. Lenin made it the economic basis of the socialist parties' support for the war in 1914.",
        brief: `Why did British workers in the second half of the nineteenth century turn away from Chartism to respectable trade unionism and Liberal politics? Engels's answer was that part of the working class, the skilled and organised, had won a comfortable position because British industry dominated the world market. In 1916 Lenin generalised the argument: imperialist profits allowed capitalists to buy off a layer of workers, and that layer supplied the leaders who had backed the war.`,
        standard: `[[thinker:engels]] wrote to Marx in 1858 that the English proletariat was becoming "more and more bourgeois". In the 1880s and 1890s he described the engineers, carpenters and bricklayers organised in the old unions as "an aristocracy among the working-class", which had won a relatively comfortable position from Britain's industrial monopoly and would lose it when the monopoly ended.[cite:src_ml_engels_1892_preface][cite:src_ml_lenin_split]

In "Imperialism and the Split in Socialism" (1916) [[thinker:lenin]] took up these passages. Monopoly profits from imperialism let the capitalists of every great power bribe a stratum of workers; this labour aristocracy and its leaders were the social base of opportunism, and its "desertion" to the bourgeoisie explained the collapse of the International in 1914 ([[event:war-credits-1914]]; [[concept:imperialism]]).[cite:src_ml_lenin_split]`,
        deep: `The theory answered a real question: why had mass socialist parties supported their governments in 1914? But it was contested at the time and since. Critics argued that the skilled workers of Germany were often the most radical, that support for the war was broad across the working class, and that the theory turned a political failure into an economic necessity. Historians of nineteenth-century Britain have debated whether a distinct labour aristocracy existed and what it explained ([[debate:socialists-and-the-war]]).[cite:src_ml_brewer_imperialism][cite:src_hobsbawm_empire]`,
        criticisms: `Brewer notes that the theory requires imperial profits large enough to raise the wages of a whole stratum, which is hard to show; others point out that Lenin's own account stresses political choices as much as economic bribery.[cite:src_ml_brewer_imperialism]`,
      },
      citations: [{ source: "src_ml_engels_1892_preface" }, { source: "src_ml_lenin_split" }, { source: "src_ml_brewer_imperialism" }],
    },
    {
      key: "event:stuttgart-congress",
      title: "The Stuttgart congress",
      fields: {
        yearStart: 1907,
        subtitle: "The seventh congress of the Second International",
        dateLabel: "18–24 August 1907",
        place: "Stuttgart",
        eventType: "congress",
        summary:
          "The largest congress of the Second International before 1914. It narrowly rejected a resolution that would have accepted a 'socialist colonial policy', and adopted on war a resolution with an amendment by Luxemburg, Lenin and Martov calling on socialists to use a war crisis to hasten the fall of capitalism.",
        body: `Some 886 delegates from five continents attended. The first international conference of socialist women met alongside it ([[tendency:socialist-womens-movement]]).[cite:src_ml_lenin_stuttgart][cite:src_ml_boxer_socialist_women]

On colonial policy, the congress commission, led by the Dutch socialist Henri van Kol, proposed a resolution saying that the congress did not condemn all colonial policy in principle, since under socialism it could play a civilising role. Bernstein and Eduard David supported it, most of the German delegation with them. The congress rejected it, by 128 votes to 108 according to Lenin, and adopted a resolution condemning colonial policy ([[concept:imperialism]]).[cite:src_ml_lenin_stuttgart][cite:src_joll_second_international]

On militarism and war, the French socialists Jaurès and Vaillant wanted to commit the International to a general strike against war, which the Germans refused. The resolution, drafted by Bebel, was amended by [[thinker:luxemburg]], [[thinker:lenin]] and [[thinker:martov]]: if war broke out, socialists should use the economic and political crisis it caused to hasten the overthrow of capitalist rule ([[concept:general-strike]]).[cite:src_ml_lenin_stuttgart][cite:src_haupt_war]`,
        significance: `The colonial vote showed how far revisionist and national interests reached into the International. The anti-war amendment was repeated at Copenhagen (1910) and Basel (1912), and in 1914 became the standard by which the left judged the parties that voted for the war ([[event:basel-congress]]; [[event:war-credits-1914]]).[cite:src_haupt_war][cite:src_joll_second_international]`,
      },
      citations: [{ source: "src_ml_lenin_stuttgart" }, { source: "src_joll_second_international" }, { source: "src_haupt_war" }],
      flags: [
        { type: "disputed", field: "body", note: "Lenin gives the colonial vote as 128 to 108 with ten abstentions; some secondary accounts give 127 to 108. The entry attributes the figure to Lenin." },
      ],
    },

    /* ——— Debates ——— */
    {
      key: "debate:the-national-question",
      title: "Do nations have a right to their own state?",
      fields: {
        summary:
          "In the empires of central and eastern Europe socialists had to decide whether to support national movements. Lenin defended the right of secession; Luxemburg rejected it; the Austro-Marxists and the Bund proposed cultural autonomy instead; Connolly fused national and social revolution; Bukharin and Pyatakov said imperialism had made the question obsolete.",
        intro:
          "The Communist Manifesto said that the workers have no country. Yet the socialists of the Russian and Habsburg empires faced dozens of nations demanding rights, autonomy or independence, and their own parties divided along national lines.",
        body: `Every position below claimed to serve the unity of the working class. They disagreed about whether that unity required recognising national demands, transcending them, or organising them inside a common state ([[concept:national-self-determination]]; [[concept:national-cultural-autonomy]]).[cite:src_ml_connor_national]

The dispute was sharpest in 1908–14, between Luxemburg, Lenin, the Austrians and the Bund, and again in 1915–16, when the war and the Easter Rising raised the question of national movements within an imperialist war ([[event:easter-rising]]).[cite:src_ml_lenin_self_det][cite:src_ml_lenin_self_det_summed]`,
        context: `The International's London congress (1896) had endorsed the right of all nations to self-determination, and Marx and Engels had supported Polish and Irish independence. The Russian, Austrian and Polish parties had to translate these principles into programmes for multinational states.[cite:src_ml_connor_national][cite:src_ml_lenin_self_det]`,
      },
    },
    {
      key: "debate:what-drives-imperialism",
      title: "What drives imperialism?",
      fields: {
        summary:
          "Was the scramble for colonies a policy that reform could change, or a necessary stage of capitalism? Hobson blamed underconsumption, Hilferding finance capital, Luxemburg the need for non-capitalist markets; Kautsky thought the powers might combine; Lenin and Bukharin held that war was built into the system.",
        intro:
          "Between 1900 and 1917 the great powers divided Africa and Asia, built navies and finally went to war. Socialists and radicals tried to explain why, and the explanation decided what they should do about it.",
        body: `The theories differed on cause and on cure. If imperialism came from a maldistribution of income, social reform could remove it; if from the dominance of finance capital, it was a policy that a strong labour movement might restrain; if from the nature of capital accumulation, only socialism could end it ([[concept:imperialism]]; [[concept:finance-capital]]).[cite:src_ml_brewer_imperialism][cite:src_ml_day_gaido_imperialism]

The positions also differed on colonies. At Stuttgart in 1907 a part of the International was willing to accept a "socialist colonial policy"; the majority condemned colonialism, but the question of what socialists owed the colonised peoples remained open ([[event:stuttgart-congress]]).[cite:src_ml_lenin_stuttgart][cite:src_joll_second_international]`,
        context: `Day and Gaido have collected the debates of 1900–1916 in which these theories were worked out, mostly in the German and Austrian socialist press. Lenin's *Imperialism* (1916) was a synthesis written at the end of that discussion, for a popular readership ([[text:imperialism-highest-stage]]).[cite:src_ml_day_gaido_imperialism][cite:src_mia_imperialism]`,
      },
    },

    /* ——— Revision of a sample entry ——— */
    {
      key: "text:accumulation-of-capital",
      title: "The Accumulation of Capital",
      fields: {
        yearStart: 1913,
        subtitle: "Luxemburg's theory of capitalist expansion",
        originalTitle: "Die Akkumulation des Kapitals: Ein Beitrag zur ökonomischen Erklärung des Imperialismus",
        language: "German",
        form: "book",
        publicationNote: "Berlin, 1913; her reply to critics, the Anti-Critique, was written in prison in 1915 and published in 1921",
        edition: "trans. Agnes Schwarzschild (Routledge & Kegan Paul, 1951)",
        difficulty: "3",
        readingUrl: "https://www.marxists.org/archive/luxemburg/1913/accumulation-capital/index.htm",
        aliases: "Die Akkumulation des Kapitals\nA Contribution to the Economic Explanation of Imperialism",
        summary:
          "Luxemburg's argument that capitalism cannot accumulate within a purely capitalist world: the surplus value it produces must be realised by selling to non-capitalist buyers, so capital must continually expand into non-capitalist societies. Imperialism is the form of that expansion, and its limit would be the limit of capitalism.",
        body: `The book began as a problem Luxemburg met while teaching economics at the SPD's party school: she could not explain how, in Marx's schemes of reproduction in the second volume of *Capital*, the growing product of a closed capitalist economy found buyers ([[thinker:luxemburg]]; [[text:capital-volume-one]]).[cite:src_ml_luxemburg_accumulation][cite:src_nettl_luxemburg]

The first part sets out the problem; the second reviews the debates on it, from Sismondi and Malthus to the Russian populists and legal Marxists ([[tendency:russian-populism]]). The third gives her answer. The part of the surplus value that is to be reinvested cannot be realised by sales to capitalists and workers alone; it needs buyers outside the capitalist system, among peasants, artisans and colonial societies. Capital therefore lives on its non-capitalist surroundings, destroying natural economies, seizing land and labour, imposing commodity exchange and taxes, and lending to non-capitalist states.[cite:src_ml_luxemburg_accumulation][cite:src_ml_brewer_imperialism]

Imperialism is the political expression of this process, the competition of capitalist states for what remains of the non-capitalist world. Militarism is itself a field of accumulation. As the non-capitalist world shrinks, capitalism approaches a limit, which it cannot reach without catastrophes that will make socialism necessary ([[concept:imperialism]]).[cite:src_ml_luxemburg_accumulation]`,
        context: `The book was attacked on publication by the party's economists, including Otto Bauer, Gustav Eckstein and Anton Pannekoek, who argued that Marx's schemes showed accumulation to be possible within capitalism and that she had misread them. Lenin also rejected it. Luxemburg replied in the *Anti-Critique*, written in prison in 1915 ([[debate:what-drives-imperialism]]; [[thinker:otto-bauer]]).[cite:src_nettl_luxemburg][cite:src_ml_day_gaido_imperialism]

Most economists, Marxist and other, have accepted the critics' point about the reproduction schemes. Its account of capital's dependence on and destruction of non-capitalist societies has had a longer life, in later theories of development, dependency and the commons, which lie outside this collection.[cite:src_ml_brewer_imperialism]`,
      },
      citations: [
        { source: "src_ml_luxemburg_accumulation" },
        { source: "src_ml_brewer_imperialism", note: "Exposition and critique." },
      ],
      flags: [
        { type: "sample-overlap", note: "This rewrite replaces the one-line sample summary. The slug, title and existing relationships are kept." },
      ],
    },

    /* ——— Notes on an existing entry ——— */
    {
      key: "concept:imperialism",
      title: "Imperialism",
      fields: {},
      citations: [
        { source: "src_hobson_imperialism", note: "Hobson, Imperialism: A Study (1902)." },
        { source: "src_ml_hilferding_fc", note: "Hilferding, Finance Capital (1910)." },
      ],
      flags: [
        { type: "missing-source", note: "The Marx to Lenin Corpus adds entries and source records for Hobson, Hilferding, Kautsky's ultra-imperialism, Bukharin and the labour aristocracy, and attaches Hobson's and Hilferding's books as citations here. Check whether this answers the entry's earlier missing-source note and link the new entries from its text where useful." },
        { type: "possible-duplicate", field: "aliases", note: "The working copy of this entry lists \"Finance capital\" and \"Ultra-imperialism\" as aliases, which now duplicate the titles of two new concept entries. Consider removing them and linking to the new entries." },
      ],
    },
  ],
  relationships: [
    // Self-determination
    { from: "thinker:lenin", type: "DEVELOPED", to: "concept:national-self-determination", note: "The right of secession (1913–16).", source: "src_ml_lenin_self_det", yearStart: 1914, weight: 3, on: "concept:national-self-determination" },
    { from: "thinker:luxemburg", type: "REJECTED", to: "concept:national-self-determination", note: "A bourgeois slogan without class content.", source: "src_ml_luxemburg_national", yearStart: 1908, weight: 3, on: "concept:national-self-determination" },
    { from: "event:second-international", type: "ASSOCIATED_WITH", to: "concept:national-self-determination", note: "The London congress of 1896 endorsed it.", source: "src_ml_connor_national", yearStart: 1896, on: "concept:national-self-determination" },
    { from: "concept:national-self-determination", type: "CONTRASTS_WITH", to: "concept:national-cultural-autonomy", note: "Territorial versus personal solutions.", source: "src_ml_connor_national", weight: 2, on: "concept:national-self-determination" },
    { from: "concept:national-self-determination", type: "RELATED_TO", to: "concept:imperialism", note: "Bukharin and Pyatakov held it impossible under imperialism.", source: "src_ml_lenin_self_det_summed", on: "concept:national-self-determination" },
    { from: "debate:the-national-question", type: "RELATED_TO", to: "concept:national-self-determination", note: "The debate on the concept.", source: "src_ml_connor_national", weight: 3, on: "debate:the-national-question" },
    { from: "debate:the-national-question", type: "RELATED_TO", to: "concept:national-cultural-autonomy", note: "The Austro-Marxist alternative.", source: "src_ml_bottomore_austro", on: "debate:the-national-question" },
    { from: "text:right-of-nations-to-self-determination", type: "DISCUSSES", to: "concept:national-self-determination", note: "Lenin's main statement.", source: "src_ml_lenin_self_det", weight: 3, on: "text:right-of-nations-to-self-determination" },
    { from: "thinker:lenin", type: "WROTE", to: "text:right-of-nations-to-self-determination", note: "Prosveshcheniye, 1914.", source: "src_ml_lenin_self_det", yearStart: 1914, weight: 3, on: "text:right-of-nations-to-self-determination" },
    { from: "text:right-of-nations-to-self-determination", type: "RESPONDED_TO", to: "text:national-question-and-autonomy", note: "A reply to Luxemburg's articles.", source: "src_ml_lenin_self_det", weight: 3, on: "text:right-of-nations-to-self-determination" },
    { from: "text:right-of-nations-to-self-determination", type: "CRITIQUED", to: "concept:national-cultural-autonomy", note: "Rejected cultural autonomy as dividing the workers.", source: "src_ml_connor_national", on: "text:right-of-nations-to-self-determination" },
    { from: "thinker:luxemburg", type: "WROTE", to: "text:national-question-and-autonomy", note: "Przegląd Socjaldemokratyczny, 1908–09.", source: "src_ml_luxemburg_national", yearStart: 1908, weight: 3, on: "text:national-question-and-autonomy" },
    { from: "text:national-question-and-autonomy", type: "DISCUSSES", to: "concept:national-self-determination", note: "Against the clause in the 1903 programme.", source: "src_ml_luxemburg_national", weight: 3, on: "text:national-question-and-autonomy" },
    // Austro-Marxism and the Bund
    { from: "thinker:otto-bauer", type: "MEMBER_OF", to: "tendency:austro-marxism", note: "Its leading political theorist.", source: "src_ml_bottomore_austro", weight: 3, on: "thinker:otto-bauer" },
    { from: "thinker:otto-bauer", type: "WROTE", to: "text:question-of-nationalities", note: "Marx-Studien, vol. 2 (1907).", source: "src_ml_bauer_nationalities", yearStart: 1907, weight: 3, on: "thinker:otto-bauer" },
    { from: "thinker:otto-bauer", type: "DEVELOPED", to: "concept:national-cultural-autonomy", note: "Gave it a theory of the nation.", source: "src_ml_bauer_nationalities", yearStart: 1907, weight: 3, on: "thinker:otto-bauer" },
    { from: "thinker:otto-bauer", type: "CRITIQUED", to: "text:accumulation-of-capital", note: "Reviewed it critically in Die Neue Zeit (1913).", source: "src_nettl_luxemburg", yearStart: 1913, on: "thinker:otto-bauer" },
    { from: "text:question-of-nationalities", type: "DISCUSSES", to: "concept:national-cultural-autonomy", note: "Its fullest statement.", source: "src_ml_bauer_nationalities", weight: 3, on: "text:question-of-nationalities" },
    { from: "tendency:austro-marxism", type: "DEVELOPED", to: "concept:national-cultural-autonomy", note: "Renner and Bauer.", source: "src_ml_bottomore_austro", weight: 2, on: "tendency:austro-marxism" },
    { from: "tendency:austro-marxism", type: "ASSOCIATED_WITH", to: "tendency:marxism", note: "A school within it.", source: "src_ml_bottomore_austro", on: "tendency:austro-marxism" },
    { from: "tendency:austro-marxism", type: "ASSOCIATED_WITH", to: "tendency:social-democracy", note: "The theorists of the Austrian party.", source: "src_ml_bottomore_austro", on: "tendency:austro-marxism" },
    { from: "thinker:hilferding", type: "MEMBER_OF", to: "tendency:austro-marxism", note: "Co-founder of the Marx-Studien.", source: "src_ml_bottomore_austro", weight: 2, on: "thinker:hilferding" },
    { from: "tendency:jewish-labour-bund", type: "ASSOCIATED_WITH", to: "concept:national-cultural-autonomy", note: "Adopted it for the Jews of the Russian Empire (1901–05).", source: "src_ml_tobias_bund", yearStart: 1901, weight: 2, on: "tendency:jewish-labour-bund" },
    { from: "tendency:jewish-labour-bund", type: "PARTICIPATED_IN", to: "event:bolshevik-menshevik-split", note: "Its walk-out left Lenin's supporters with a majority.", source: "src_ml_tobias_bund", yearStart: 1903, weight: 2, on: "tendency:jewish-labour-bund" },
    { from: "tendency:jewish-labour-bund", type: "ASSOCIATED_WITH", to: "tendency:social-democracy", note: "A founder of the Russian Social Democratic Labour Party (1898).", source: "src_ml_tobias_bund", yearStart: 1898, on: "tendency:jewish-labour-bund" },
    { from: "tendency:jewish-labour-bund", type: "PARTICIPATED_IN", to: "event:revolution-1905", note: "Strikes and self-defence against pogroms.", source: "src_ml_frankel_prophecy", yearStart: 1905, on: "tendency:jewish-labour-bund" },
    { from: "tendency:jewish-labour-bund", type: "ASSOCIATED_WITH", to: "tendency:menshevism", note: "Generally aligned with them after 1906.", source: "src_ml_frankel_prophecy", yearStart: 1906, on: "tendency:jewish-labour-bund" },
    { from: "thinker:lenin", type: "CRITIQUED", to: "tendency:jewish-labour-bund", note: "Opposed its federalism (1903) and its national programme.", source: "src_ml_tobias_bund", yearStart: 1903, on: "tendency:jewish-labour-bund" },
    // Ireland
    { from: "thinker:connolly", type: "WROTE", to: "text:labour-in-irish-history", note: "Dublin, 1910.", source: "src_ml_connolly_lih", yearStart: 1910, weight: 3, on: "thinker:connolly" },
    { from: "thinker:connolly", type: "PARTICIPATED_IN", to: "event:easter-rising", note: "Commanded the rebel forces in Dublin; executed 12 May 1916.", source: "src_ml_townshend_easter", yearStart: 1916, weight: 3, on: "thinker:connolly" },
    { from: "thinker:connolly", type: "ASSOCIATED_WITH", to: "event:iww-founding", note: "IWW organiser in the United States, 1905–10.", source: "src_ml_dubofsky_iww", yearStart: 1905, on: "thinker:connolly" },
    { from: "thinker:connolly", type: "ASSOCIATED_WITH", to: "tendency:revolutionary-syndicalism", note: "Industrial unionism as the framework of socialism.", source: "src_ml_nevin_connolly", on: "thinker:connolly" },
    { from: "thinker:connolly", type: "DEVELOPED", to: "concept:national-self-determination", note: "National freedom and socialism as one cause.", source: "src_ml_connolly_lih", basis: "interpretive", on: "thinker:connolly" },
    { from: "thinker:connolly", type: "REJECTED", to: "event:war-credits-1914", note: "Opposed the war and recruitment in Ireland.", source: "src_ml_nevin_connolly", yearStart: 1914, on: "thinker:connolly" },
    { from: "text:labour-in-irish-history", type: "DISCUSSES", to: "concept:class-struggle", note: "Irish history from the standpoint of labour.", source: "src_ml_connolly_lih", on: "text:labour-in-irish-history" },
    { from: "text:labour-in-irish-history", type: "DISCUSSES", to: "concept:national-self-determination", note: "The national cause as the cause of labour.", source: "src_ml_connolly_lih", on: "text:labour-in-irish-history" },
    { from: "thinker:lenin", type: "RESPONDED_TO", to: "event:easter-rising", note: "Defended it against Radek's charge of a putsch (1916).", source: "src_ml_lenin_self_det_summed", yearStart: 1916, weight: 2, on: "event:easter-rising" },
    { from: "event:easter-rising", type: "RELATED_TO", to: "debate:the-national-question", note: "A test case in the debate.", source: "src_ml_lenin_self_det_summed", on: "event:easter-rising" },
    // Hobson
    { from: "thinker:hobson", type: "WROTE", to: "text:imperialism-a-study", note: "London, 1902.", source: "src_hobson_imperialism", yearStart: 1902, weight: 3, on: "thinker:hobson" },
    { from: "thinker:hobson", type: "INFLUENCED", to: "thinker:lenin", note: "Lenin's main empirical source in 1916.", source: "src_mia_imperialism", yearStart: 1916, weight: 2, on: "thinker:hobson" },
    { from: "thinker:hobson", type: "ASSOCIATED_WITH", to: "tendency:fabianism", note: "A new Liberal close to the Fabians.", source: "src_ml_cain_hobson", basis: "interpretive", on: "thinker:hobson" },
    { from: "text:imperialism-a-study", type: "DISCUSSES", to: "concept:imperialism", note: "Its economic \"taproot\" in surplus capital.", source: "src_hobson_imperialism", weight: 3, on: "text:imperialism-a-study" },
    { from: "text:imperialism-a-study", type: "INFLUENCED", to: "text:imperialism-highest-stage", note: "Cited throughout.", source: "src_mia_imperialism", yearStart: 1916, weight: 2, on: "text:imperialism-a-study" },
    // Hilferding and finance capital
    { from: "thinker:hilferding", type: "WROTE", to: "text:finance-capital", note: "Marx-Studien, vol. 3 (1910).", source: "src_ml_hilferding_fc", yearStart: 1910, weight: 3, on: "thinker:hilferding" },
    { from: "thinker:hilferding", type: "DEVELOPED", to: "concept:finance-capital", note: "Coined and defined it.", source: "src_ml_hilferding_fc", yearStart: 1910, weight: 3, on: "thinker:hilferding" },
    { from: "thinker:hilferding", type: "ASSOCIATED_WITH", to: "thinker:kautsky", note: "Kautsky brought him to Berlin in 1906.", source: "src_ml_smaldone_hilferding", yearStart: 1906, on: "thinker:hilferding" },
    { from: "text:finance-capital", type: "DISCUSSES", to: "concept:finance-capital", note: "The book that defined it.", source: "src_ml_hilferding_fc", weight: 3, on: "text:finance-capital" },
    { from: "text:finance-capital", type: "DISCUSSES", to: "concept:imperialism", note: "Imperialism as the policy of finance capital.", source: "src_ml_hilferding_fc", weight: 2, on: "text:finance-capital" },
    { from: "text:finance-capital", type: "EXTENDED", to: "text:capital-volume-one", note: "Presented as a continuation of Capital.", source: "src_ml_brewer_imperialism", basis: "interpretive", on: "text:finance-capital" },
    { from: "text:finance-capital", type: "INFLUENCED", to: "text:imperialism-highest-stage", note: "Lenin's account of finance capital and monopoly.", source: "src_mia_imperialism", weight: 3, on: "text:finance-capital" },
    { from: "concept:finance-capital", type: "RELATED_TO", to: "concept:imperialism", note: "Lenin: imperialism is the epoch of finance capital.", source: "src_mia_imperialism", weight: 3, on: "concept:finance-capital" },
    { from: "concept:finance-capital", type: "RELATED_TO", to: "concept:capital", note: "A new form of capital.", source: "src_ml_hilferding_fc", on: "concept:finance-capital" },
    // Ultra-imperialism and Bukharin
    { from: "thinker:kautsky", type: "DEVELOPED", to: "concept:ultra-imperialism", note: "Die Neue Zeit, September 1914.", source: "src_mia_kautsky_ultra", yearStart: 1914, weight: 3, on: "concept:ultra-imperialism" },
    { from: "thinker:lenin", type: "CRITIQUED", to: "concept:ultra-imperialism", note: "A truce between wars (1915–16).", source: "src_mia_imperialism", yearStart: 1916, weight: 2, on: "concept:ultra-imperialism" },
    { from: "concept:ultra-imperialism", type: "RELATED_TO", to: "concept:imperialism", note: "Could imperialism give way to a cartel of powers?", source: "src_mia_kautsky_ultra", on: "concept:ultra-imperialism" },
    { from: "concept:ultra-imperialism", type: "RELATED_TO", to: "debate:socialists-and-the-war", note: "Lenin read it as the theory of the centre.", source: "src_salvadori_kautsky", basis: "interpretive", on: "concept:ultra-imperialism" },
    { from: "thinker:bukharin", type: "WROTE", to: "text:imperialism-and-world-economy", note: "Written 1915, published 1918.", source: "src_ml_bukharin_iwe", yearStart: 1915, weight: 3, on: "thinker:bukharin" },
    { from: "thinker:bukharin", type: "MEMBER_OF", to: "tendency:bolshevism", note: "From 1906.", source: "src_ml_cohen_bukharin", yearStart: 1906, weight: 2, on: "thinker:bukharin" },
    { from: "thinker:bukharin", type: "CRITIQUED", to: "concept:ultra-imperialism", note: "Agreements between state capitalist trusts would be unstable.", source: "src_ml_bukharin_iwe", yearStart: 1915, on: "thinker:bukharin" },
    { from: "thinker:bukharin", type: "REJECTED", to: "concept:national-self-determination", note: "With Pyatakov, 1915–16.", source: "src_ml_cohen_bukharin", yearStart: 1915, on: "thinker:bukharin" },
    { from: "thinker:bukharin", type: "INFLUENCED", to: "text:the-state-and-revolution", note: "His 1916 argument for destroying the imperialist state.", source: "src_ml_cohen_bukharin", yearStart: 1917, basis: "interpretive", on: "thinker:bukharin" },
    { from: "thinker:bukharin", type: "INFLUENCED_BY", to: "thinker:hilferding", note: "Built on Finance Capital.", source: "src_ml_brewer_imperialism", on: "thinker:bukharin" },
    { from: "text:imperialism-and-world-economy", type: "DISCUSSES", to: "concept:imperialism", note: "Competition of state capitalist trusts.", source: "src_ml_bukharin_iwe", weight: 3, on: "text:imperialism-and-world-economy" },
    { from: "text:imperialism-and-world-economy", type: "INFLUENCED", to: "text:imperialism-highest-stage", note: "Written earlier, with a preface by Lenin.", source: "src_ml_cohen_bukharin", basis: "interpretive", on: "text:imperialism-and-world-economy" },
    // Labour aristocracy
    { from: "thinker:engels", type: "DEVELOPED", to: "concept:labour-aristocracy", note: "On the British skilled workers (1858–92).", source: "src_ml_engels_1892_preface", yearStart: 1858, weight: 2, on: "concept:labour-aristocracy" },
    { from: "thinker:lenin", type: "DEVELOPED", to: "concept:labour-aristocracy", note: "Imperialism and the Split in Socialism (1916).", source: "src_ml_lenin_split", yearStart: 1916, weight: 3, on: "concept:labour-aristocracy" },
    { from: "concept:labour-aristocracy", type: "RELATED_TO", to: "event:war-credits-1914", note: "Lenin's explanation of 1914.", source: "src_ml_lenin_split", weight: 2, on: "concept:labour-aristocracy" },
    { from: "concept:labour-aristocracy", type: "RELATED_TO", to: "concept:reformism", note: "Its alleged social base.", source: "src_ml_lenin_split", on: "concept:labour-aristocracy" },
    { from: "concept:labour-aristocracy", type: "RELATED_TO", to: "concept:imperialism", note: "Monopoly profits as the source of the bribe.", source: "src_ml_lenin_split", on: "concept:labour-aristocracy" },
    // Stuttgart
    { from: "event:amsterdam-congress", type: "PRECEDES", to: "event:stuttgart-congress", note: "The next congress (1907).", source: "src_joll_second_international", on: "event:stuttgart-congress" },
    { from: "event:stuttgart-congress", type: "PRECEDES", to: "event:basel-congress", note: "Basel (1912) repeated its anti-war resolution.", source: "src_haupt_war", on: "event:stuttgart-congress" },
    { from: "event:stuttgart-congress", type: "ASSOCIATED_WITH", to: "event:second-international", note: "Its seventh congress.", source: "src_joll_second_international", weight: 2, on: "event:stuttgart-congress" },
    { from: "event:stuttgart-congress", type: "ASSOCIATED_WITH", to: "concept:imperialism", note: "Rejected a 'socialist colonial policy'.", source: "src_ml_lenin_stuttgart", weight: 2, on: "event:stuttgart-congress" },
    { from: "thinker:luxemburg", type: "PARTICIPATED_IN", to: "event:stuttgart-congress", note: "Moved the anti-war amendment with Lenin and Martov.", source: "src_ml_lenin_stuttgart", yearStart: 1907, weight: 2, on: "event:stuttgart-congress" },
    { from: "thinker:lenin", type: "PARTICIPATED_IN", to: "event:stuttgart-congress", note: "Co-author of the anti-war amendment.", source: "src_ml_lenin_stuttgart", yearStart: 1907, on: "event:stuttgart-congress" },
    { from: "thinker:martov", type: "PARTICIPATED_IN", to: "event:stuttgart-congress", note: "Co-author of the anti-war amendment.", source: "src_ml_lenin_stuttgart", yearStart: 1907, on: "event:stuttgart-congress" },
    { from: "thinker:bernstein", type: "PARTICIPATED_IN", to: "event:stuttgart-congress", note: "Supported the commission's colonial resolution.", source: "src_joll_second_international", yearStart: 1907, on: "event:stuttgart-congress" },
    { from: "thinker:jaures", type: "PARTICIPATED_IN", to: "event:stuttgart-congress", note: "Proposed a general strike against war.", source: "src_haupt_war", yearStart: 1907, on: "event:stuttgart-congress" },
    // Debate on imperialism and Luxemburg
    { from: "debate:what-drives-imperialism", type: "RELATED_TO", to: "concept:imperialism", note: "The debate on the concept.", source: "src_ml_brewer_imperialism", weight: 3, on: "debate:what-drives-imperialism" },
    { from: "debate:what-drives-imperialism", type: "RELATED_TO", to: "debate:socialists-and-the-war", note: "The theory decided the response to the war.", source: "src_ml_day_gaido_imperialism", basis: "interpretive", on: "debate:what-drives-imperialism" },
    { from: "text:accumulation-of-capital", type: "RELATED_TO", to: "debate:what-drives-imperialism", note: "Luxemburg's position.", source: "src_ml_brewer_imperialism", on: "debate:what-drives-imperialism" },
    { from: "text:accumulation-of-capital", type: "CONTRASTS_WITH", to: "text:finance-capital", note: "Realisation of surplus value, not finance, as the root of imperialism.", source: "src_ml_brewer_imperialism", basis: "interpretive", on: "text:accumulation-of-capital" },
    { from: "text:accumulation-of-capital", type: "DISCUSSES", to: "concept:accumulation", note: "Accumulation requires non-capitalist buyers.", source: "src_ml_luxemburg_accumulation", weight: 3, on: "text:accumulation-of-capital" },
    { from: "text:accumulation-of-capital", type: "CRITIQUED", to: "tendency:russian-populism", note: "Reviews the Russian debate on markets.", source: "src_ml_luxemburg_accumulation", on: "text:accumulation-of-capital" },
  ],
  excerpts: [
    {
      key: "ml-luxemburg-national-paraphrase",
      entity: "text:national-question-and-autonomy",
      speaker: "thinker:luxemburg",
      text: "text:national-question-and-autonomy",
      body: "“The right of nations to self-determination” is at first glance a paraphrase of the old slogan of bourgeois nationalism put forth in all countries at all times: “the right of nations to freedom and independence.”",
      source: "src_ml_luxemburg_national",
      locator: "Chapter 1",
      note: "Translation from Horace B. Davis's edition.",
      archiveUrl: "https://www.marxists.org/archive/luxemburg/1909/national-question/ch01.htm",
    },
    {
      key: "ml-lenin-democratic-content",
      entity: "text:right-of-nations-to-self-determination",
      speaker: "thinker:lenin",
      text: "text:right-of-nations-to-self-determination",
      body: "The bourgeois nationalism of any oppressed nation has a general democratic content that is directed against oppression, and it is this content that we unconditionally support",
      source: "src_ml_lenin_self_det",
      locator: "Chapter 4",
      archiveUrl: "https://www.marxists.org/archive/lenin/works/1914/self-det/ch04.htm",
    },
    {
      key: "ml-connolly-sacred-duty",
      entity: "text:labour-in-irish-history",
      speaker: "thinker:connolly",
      text: "text:labour-in-irish-history",
      body: "Hence we have had in Ireland for over 250 years the remarkable phenomenon of Irishmen of the upper and middle classes urging upon the Irish toilers, as a sacred national and religious duty, the necessity of maintaining a social order against which their Gaelic forefathers had struggled, despite prison cells, famine, and the sword, for over 400 years.",
      source: "src_ml_connolly_lih",
      locator: "Foreword",
      archiveUrl: "https://www.marxists.org/archive/connolly/1910/lih/foreword.htm",
    },
    {
      key: "ml-lenin-putsch",
      entity: "event:easter-rising",
      speaker: "thinker:lenin",
      body: "The term \"putsch\", in its scientific sense, may be employed only when the attempt at insurrection has revealed nothing but a circle of conspirators or stupid maniacs, and has aroused no sympathy among the masses.",
      source: "src_ml_lenin_self_det_summed",
      locator: "The Discussion on Self-Determination Summed Up, section 10, “The Irish Rebellion of 1916”",
      archiveUrl: "https://www.marxists.org/archive/lenin/works/1916/jul/x01.htm",
    },
    {
      key: "ml-hobson-taproot",
      entity: "text:imperialism-a-study",
      speaker: "thinker:hobson",
      text: "text:imperialism-a-study",
      body: "It is this economic condition of affairs that forms the taproot of Imperialism.",
      source: "src_hobson_imperialism",
      locator: "Part I, chapter 6, “Economic Taproot of Imperialism”",
      archiveUrl: "https://www.marxists.org/archive/hobson/1902/imperialism/pt1ch6.htm",
    },
    {
      key: "ml-hilferding-definition",
      entity: "concept:finance-capital",
      speaker: "thinker:hilferding",
      text: "text:finance-capital",
      body: "I call bank capital, that is, capital in money form which is actually transformed in this way into industrial capital, finance capital.",
      source: "src_ml_hilferding_fc",
      locator: "Chapter 14",
      note: "Watnick and Gordon's translation.",
      archiveUrl: "https://www.marxists.org/archive/hilferding/1910/finkap/ch14.htm",
    },
    {
      key: "ml-hilferding-domination",
      entity: "text:finance-capital",
      speaker: "thinker:hilferding",
      text: "text:finance-capital",
      body: "Finance capital does not want freedom, but domination; it has no regard for the independence of the individual capitalist, but demands his allegiance.",
      source: "src_ml_hilferding_fc",
      locator: "Chapter 22",
      archiveUrl: "https://www.marxists.org/archive/hilferding/1910/finkap/ch22.htm",
    },
    {
      key: "ml-hilferding-only-socialism",
      entity: "thinker:hilferding",
      speaker: "thinker:hilferding",
      text: "text:finance-capital",
      body: "The response of the proletariat to the economic policy of finance capital - imperialism - cannot be free trade, but only socialism.",
      source: "src_ml_hilferding_fc",
      locator: "Chapter 25",
      archiveUrl: "https://www.marxists.org/archive/hilferding/1910/finkap/ch25.htm",
    },
    {
      key: "ml-kautsky-ultra",
      entity: "concept:ultra-imperialism",
      speaker: "thinker:kautsky",
      body: "a phase of ultra-imperialism, which of course we must struggle against as energetically as we do against imperialism, but whose perils lie in another direction, not in that of the arms race and the threat to world peace.",
      source: "src_mia_kautsky_ultra",
      locator: "“Ultra-imperialism” (Die Neue Zeit, 11 September 1914)",
      note: "The online transcription has a misprint (\"Jive\" for \"live\") just before this passage, so the excerpt begins after it.",
      archiveUrl: "https://www.marxists.org/archive/kautsky/1914/09/ultra-imp.htm",
    },
    {
      key: "ml-bukharin-state-trusts",
      entity: "text:imperialism-and-world-economy",
      speaker: "thinker:bukharin",
      text: "text:imperialism-and-world-economy",
      body: "For imperialism, as we all know, is nothing but the expression of competition between state capitalist trusts.",
      source: "src_ml_bukharin_iwe",
      locator: "Chapter 12",
      archiveUrl: "https://www.marxists.org/archive/bukharin/works/1917/imperial/12.htm",
    },
    {
      key: "ml-engels-aristocracy",
      entity: "concept:labour-aristocracy",
      speaker: "thinker:engels",
      body: "They form an aristocracy among the working-class; they have succeeded in enforcing for themselves a relatively comfortable position, and they accept it as final.",
      source: "src_ml_engels_1892_preface",
      locator: "Preface to the English edition of The Condition of the Working Class in England (1892), quoting his article “England in 1845 and 1885”",
      note: "On the skilled workers of the engineering and building trades.",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1892/01/11.htm",
    },
    {
      key: "ml-lenin-labour-aristocracy",
      entity: "concept:labour-aristocracy",
      speaker: "thinker:lenin",
      body: "The important thing is that, economically, the desertion of a stratum of the labour aristocracy to the bourgeoisie has matured and become an accomplished fact; and this economic fact, this shift in class relations, will find political form, in one shape or another, without any particular \"difficulty\".",
      source: "src_ml_lenin_split",
      locator: "“Imperialism and the Split in Socialism” (1916)",
      archiveUrl: "https://www.marxists.org/archive/lenin/works/1916/oct/x01.htm",
    },
    {
      key: "ml-lenin-stuttgart-colonial",
      entity: "event:stuttgart-congress",
      speaker: "thinker:lenin",
      body: "A sentence was inserted in the draft resolution to the effect that the Congress did not in principle condemn all colonial policy, for under socialism colonial policy could play a civilising role.",
      source: "src_ml_lenin_stuttgart",
      locator: "“The International Socialist Congress in Stuttgart” (1907)",
      archiveUrl: "https://www.marxists.org/archive/lenin/works/1907/oct/20.htm",
    },
    {
      key: "ml-luxemburg-first-mode",
      entity: "text:accumulation-of-capital",
      speaker: "thinker:luxemburg",
      text: "text:accumulation-of-capital",
      body: "Capitalism is the first mode of economy with the weapon of propaganda, a mode which tends to engulf the entire globe and to stamp out all other economies, tolerating no rival at its side. Yet at the same time it is also the first mode of economy which is unable to exist by itself, which needs other economic systems as a medium and soil.",
      source: "src_ml_luxemburg_accumulation",
      locator: "Chapter 32, “Militarism as a Province of Accumulation”",
      note: "Schwarzschild's translation.",
      archiveUrl: "https://www.marxists.org/archive/luxemburg/1913/accumulation-capital/ch32.htm",
    },
  ],
  debates: [
    {
      debate: "debate:the-national-question",
      propositions: [
        { key: "secession", statement: "Socialists should recognise the right of nations to secede and form their own states." },
        { key: "personal", statement: "National rights are best secured by cultural autonomy for persons, not territories." },
        { key: "one-party", statement: "The workers of all nations in one state should belong to a single party." },
        { key: "oppressed", statement: "The nationalism of an oppressed nation has a democratic content socialists should support." },
        { key: "own-independence", statement: "Socialists of an oppressed nation should fight for its independence." },
        { key: "obsolete", statement: "Under imperialism national self-determination has become impossible or reactionary." },
      ],
      positions: [
        {
          key: "lenin",
          label: "Lenin (1913–16)",
          holder: "thinker:lenin",
          centralClaim: "Socialists of oppressing nations must recognise the right of oppressed nations to secede; recognising the right is the condition for uniting the workers of all nations in one party.",
          summary: "Set out against Luxemburg and the Austrians in 1913–14 and against Bukharin and Pyatakov in 1915–16.",
          assumptions: ["Large centralised states favour economic development and the class struggle; voluntary union is better than forced union."],
          criticisms: ["Luxemburg: an abstract right with no class content.", "Bukharin and Pyatakov: obsolete in the epoch of imperialism."],
          links: ["text:right-of-nations-to-self-determination", "concept:national-self-determination"],
          stances: {
            secession: ["affirms", "The right to political separation."],
            personal: ["rejects", "Cultural autonomy divides the workers and strengthens nationalism."],
            "one-party": ["affirms", "Against the Bund's federalism."],
            oppressed: ["affirms", "Supported unconditionally against oppression."],
            "own-independence": ["qualified", "Depends on the interests of the class struggle in each case."],
            obsolete: ["rejects", "\"Imperialist economism\"."],
          },
        },
        {
          key: "luxemburg",
          label: "Luxemburg and the Polish social democrats",
          holder: "thinker:luxemburg",
          centralClaim: "The \"right of nations\" is a bourgeois abstraction; Polish independence is a utopia; socialists should fight for democracy and local autonomy within the existing state.",
          summary: "The position of the Social Democracy of the Kingdom of Poland and Lithuania against the Polish Socialist Party.",
          criticisms: ["Lenin: in practice sides with the oppressing nation."],
          links: ["text:national-question-and-autonomy"],
          stances: {
            secession: ["rejects", "No right of nations above classes."],
            personal: ["rejects", "Favoured territorial self-government."],
            "one-party": ["affirms", "One party for the workers of the whole empire."],
            oppressed: ["qualified", "Opposed national oppression, but not by supporting nationalism."],
            "own-independence": ["rejects", "Against the PPS's independence programme."],
            obsolete: ["affirms", "Capitalist development had made small-nation independence a utopia."],
          },
        },
        {
          key: "austrians",
          label: "Renner and Bauer (Austro-Marxists)",
          holder: "tendency:austro-marxism",
          centralClaim: "Where nations live mixed together, borders cannot solve the question; each nation should govern its own culture and schools as an association of persons within a democratic federal state.",
          summary: "Developed for the Habsburg empire between 1899 and 1907.",
          criticisms: ["Lenin and Stalin: divides the workers and hands schools to nationalists."],
          links: ["concept:national-cultural-autonomy", "text:question-of-nationalities"],
          stances: {
            secession: ["rejects", "Sought to keep the multinational state."],
            personal: ["affirms", "The personal principle."],
            "one-party": ["qualified", "The Austrian party was itself a federation of national parties."],
            oppressed: ["qualified", "National cultures are to be developed, not merely tolerated."],
            "own-independence": ["rejects", "Reform of the empire, not its break-up."],
            obsolete: ["rejects", "The nation is a lasting community."],
          },
        },
        {
          key: "bund",
          label: "The Jewish Labour Bund",
          holder: "tendency:jewish-labour-bund",
          centralClaim: "The Jews of the Russian Empire are a nation without a territory; they need national-cultural autonomy and their own organisation within a federal party.",
          summary: "Adopted national-cultural autonomy in principle in 1901 and fully in 1905.",
          criticisms: ["Lenin and the Iskra group: separatism.", "Bauer: the Jews were assimilating."],
          links: ["concept:national-cultural-autonomy"],
          stances: {
            secession: ["silent", "Not applicable to a nation without territory."],
            personal: ["affirms", "The only form available to the Jews."],
            "one-party": ["rejects", "A federal party with the Bund as sole representative of Jewish workers."],
            oppressed: ["affirms", "Jewish workers suffered national as well as class oppression."],
            "own-independence": ["rejects", "Against Zionism."],
            obsolete: ["rejects", "National culture would flourish under socialism."],
          },
        },
        {
          key: "connolly",
          label: "Connolly (1897–1916)",
          holder: "thinker:connolly",
          centralClaim: "In a colonised country national freedom and socialism are one cause; only the working class will carry the national struggle through, and only independence will free labour.",
          summary: "Applied to Ireland in the Irish Socialist Republican Party's programme and in Labour in Irish History; acted on in 1916.",
          criticisms: ["Some socialists: subordinated the class struggle to nationalism in 1916."],
          links: ["text:labour-in-irish-history", "event:easter-rising"],
          stances: {
            secession: ["affirms", "An Irish republic."],
            personal: ["silent", "Not his question."],
            "one-party": ["rejects", "Irish socialists needed their own party."],
            oppressed: ["qualified", "Only if led by labour, not by the propertied classes."],
            "own-independence": ["affirms", "The national struggle is the workers' struggle."],
            obsolete: ["rejects", "The war made the rising urgent."],
          },
        },
        {
          key: "bukharin-pyatakov",
          label: "Bukharin and Pyatakov (1915–16)",
          holder: "thinker:bukharin",
          centralClaim: "In the epoch of imperialism national states cannot be independent; the slogan of self-determination distracts from the struggle for socialism, which alone will end national oppression.",
          summary: "Theses submitted to the Bolshevik leadership in 1915 and opposed by Lenin as \"imperialist economism\".",
          criticisms: ["Lenin: ignores the democratic content of national movements and repeats Luxemburg's error."],
          links: ["concept:imperialism"],
          stances: {
            secession: ["rejects", "Impossible under imperialism."],
            personal: ["rejects", "Equally a concession to nationalism."],
            "one-party": ["affirms", "One international struggle."],
            oppressed: ["qualified", "Against oppression, but not for national states."],
            "own-independence": ["rejects", "Socialism, not independence."],
            obsolete: ["affirms", "Their central claim."],
          },
        },
      ],
      arguments: [
        { key: "a1", position: "luxemburg", kind: "argument", body: "A nation is divided into classes; its \"right\" to a state means the right of its bourgeoisie to rule. Socialists should not adopt a nationalist slogan." },
        { key: "c1", position: "lenin", kind: "counterargument", respondsTo: "a1", body: "A Russian socialist who denies Poland the right to leave helps the tsar keep it. Recognising the right removes the distrust that divides workers of different nations." },
        { key: "a2", position: "austrians", kind: "argument", body: "In Bohemia or Galicia every border leaves a minority behind it. Autonomy for persons, not territories, protects all nations without breaking up the state." },
        { key: "c2", position: "lenin", kind: "counterargument", respondsTo: "a2", body: "Separate national schools divide the children of workers who stand in the same factory; it is the programme of nationalists, not of socialists." },
        { key: "a3", position: "bukharin-pyatakov", kind: "argument", body: "Imperialism has made the independence of small nations a fiction; the only way to end national oppression is the socialist revolution." },
        { key: "c3", position: "connolly", kind: "counterargument", respondsTo: "a3", body: "In Ireland the war is the moment to strike; a national rising can open the European revolution rather than wait for it." },
      ],
    },
    {
      debate: "debate:what-drives-imperialism",
      propositions: [
        { key: "underconsumption", statement: "Imperialism arises from insufficient demand at home." },
        { key: "stage", statement: "Imperialism is a necessary stage of capitalism, not a policy that could be changed." },
        { key: "war", statement: "Imperialist rivalry makes war unavoidable while capitalism lasts." },
        { key: "cartel", statement: "The great powers could combine to exploit the world together." },
        { key: "reform", statement: "Social reform at home could remove the drive to empire." },
        { key: "colonies", statement: "Socialists can support a colonial policy that develops subject peoples." },
      ],
      positions: [
        {
          key: "hobson",
          label: "Hobson (1902)",
          holder: "thinker:hobson",
          centralClaim: "Imperialism is driven by surplus capital seeking investment abroad, the result of an unequal distribution of income that keeps home demand low.",
          summary: "A liberal critique: imperialism serves investors, not the nation, and can be cured by redistribution.",
          criticisms: ["Lenin: a bourgeois reformist who imagines capitalism without its essential features."],
          links: ["text:imperialism-a-study"],
          stances: {
            underconsumption: ["affirms", "The \"taproot\"."],
            stage: ["rejects", "A policy of particular interests."],
            war: ["qualified", "A danger, not a necessity."],
            cartel: ["affirms", "Warned of an \"inter-Imperialism\" of the great powers."],
            reform: ["affirms", "Higher wages and social spending would absorb the surplus."],
            colonies: ["qualified", "Accepted trusteeship over \"lower races\" under international control."],
          },
        },
        {
          key: "hilferding",
          label: "Hilferding (1910)",
          holder: "thinker:hilferding",
          centralClaim: "Imperialism is the policy of finance capital: bank-dominated monopolies need protective tariffs, capital export and a strong state.",
          summary: "The foundation of the Marxist theories that followed.",
          links: ["text:finance-capital", "concept:finance-capital"],
          stances: {
            underconsumption: ["rejects", "Rooted in the structure of capital, not demand."],
            stage: ["affirms", "The policy of a new phase of capitalism."],
            war: ["qualified", "Rivalry tends to war, but the outcome is political."],
            cartel: ["qualified", "Cartelisation suggested organised capitalism."],
            reform: ["rejects", "The answer is socialism, not free trade."],
            colonies: ["rejects", "Imperialism is finance capital's ideology."],
          },
        },
        {
          key: "luxemburg",
          label: "Luxemburg (1913)",
          holder: "thinker:luxemburg",
          centralClaim: "Capital cannot realise its surplus value in a closed capitalist world; it must expand into non-capitalist societies, and imperialism is the competition for what remains of them.",
          summary: "The Accumulation of Capital and the Anti-Critique.",
          criticisms: ["Bauer, Eckstein, Pannekoek, Lenin: misreads Marx's reproduction schemes."],
          links: ["text:accumulation-of-capital"],
          stances: {
            underconsumption: ["qualified", "Insufficient demand within capitalism, not because of distribution."],
            stage: ["affirms", "The final phase of capitalist accumulation."],
            war: ["affirms", "Militarism and war are built into accumulation."],
            cartel: ["rejects", "Competition for the shrinking non-capitalist world."],
            reform: ["rejects", "Only socialism."],
            colonies: ["rejects", "Describes colonialism's destruction of non-capitalist societies."],
          },
        },
        {
          key: "kautsky",
          label: "Kautsky (1914)",
          holder: "thinker:kautsky",
          centralClaim: "Imperialism is the policy preferred by finance capital, not an economic necessity; the powers might yet combine in an ultra-imperialist cartel.",
          summary: "Written as the war began; became the theory of the International's centre.",
          criticisms: ["Lenin and Bukharin: an illusion that excuses the war."],
          links: ["concept:ultra-imperialism"],
          stances: {
            underconsumption: ["silent", "Not his argument."],
            stage: ["rejects", "A policy, not a stage."],
            war: ["rejects", "War might be overcome by agreement."],
            cartel: ["affirms", "Ultra-imperialism."],
            reform: ["qualified", "The labour movement can resist imperialist policy."],
            colonies: ["rejects", "Opposed colonial policy at Stuttgart."],
          },
        },
        {
          key: "lenin",
          label: "Lenin (1916)",
          holder: "thinker:lenin",
          centralClaim: "Imperialism is the monopoly stage of capitalism, in which finance capital dominates, capital is exported and the world is divided among the powers; uneven development makes war inevitable.",
          summary: "A synthesis of Hobson, Hilferding and Bukharin, turned against Kautsky.",
          links: ["text:imperialism-highest-stage", "concept:labour-aristocracy"],
          stances: {
            underconsumption: ["rejects", "Monopoly and surplus capital, not demand."],
            stage: ["affirms", "The highest stage of capitalism."],
            war: ["affirms", "Any truce is temporary."],
            cartel: ["rejects", "Only as a truce between wars."],
            reform: ["rejects", "Reform cannot change the stage."],
            colonies: ["rejects", "Opposed the Stuttgart commission."],
          },
        },
        {
          key: "colonial-reformists",
          label: "Van Kol, David and Bernstein (Stuttgart, 1907)",
          centralClaim: "Colonies are a fact; socialists should press for humane and developmental colonial administration, which under socialism could play a civilising role.",
          summary: "The majority of the congress commission at Stuttgart; defeated in the full congress.",
          criticisms: ["Kautsky, Ledebour, Lenin: a socialist colonial policy is a contradiction."],
          links: ["event:stuttgart-congress", "concept:revisionism"],
          stances: {
            underconsumption: ["silent", "Not their concern."],
            stage: ["rejects", "Colonial policy could be reformed."],
            war: ["silent", "Not addressed."],
            cartel: ["silent", "Not addressed."],
            reform: ["affirms", "Reform of colonial administration."],
            colonies: ["affirms", "Their central claim."],
          },
        },
      ],
      arguments: [
        { key: "a1", position: "hobson", kind: "argument", body: "Empire costs the nation more than it returns; it is pursued because investors with idle capital profit from it. Spread income more evenly and the motive disappears." },
        { key: "c1", position: "lenin", kind: "counterargument", respondsTo: "a1", body: "Capitalism that raised the living standards of the masses would no longer be capitalism. Surplus capital is exported because profits are higher abroad; that is the system, not a policy." },
        { key: "a2", position: "kautsky", kind: "argument", body: "The capitalists of the great powers may find war too costly and combine, as cartels combine within nations." },
        { key: "c2", position: "lenin", kind: "counterargument", respondsTo: "a2", body: "Any such alliance would be divided again as the strength of its members changed; it would be a truce between wars." },
        { key: "a3", position: "luxemburg", kind: "argument", body: "Expansion is not a choice of finance capital; accumulation itself requires non-capitalist buyers, and capital will fight for the last of them." },
      ],
    },
  ],
};
