import type { CorpusBatch } from "../../src/lib/corpus/types";

/**
 * Batch m3 — Russian Marxism, 1883–1914: the populist tradition it argued
 * against, Lenin's economic case for Russian capitalism, the Economist
 * dispute, the two factions that emerged from 1903, Trotsky, the soviets of
 * 1905 and the theory of permanent revolution.
 *
 * Terminology: "Bolshevism" and "Menshevism" are the period's names; the
 * existing "Leninism" entry describes the later codified doctrine and is
 * not rewritten.
 */
export const batchM3: CorpusBatch = {
  id: "m3",
  title: "Russian Marxism: populism, factions and 1905",
  entities: [
    {
      key: "tendency:russian-populism",
      title: "Russian populism",
      fields: {
        yearStart: 1861,
        yearEnd: 1917,
        periodLabel: "1860s–1917",
        color: "olive",
        aliases: "Narodnichestvo\nNarodniks\nNarodnaya Volya\nPeople's Will\nLand and Liberty\nSocialist Revolutionaries",
        summary:
          "The Russian revolutionary tradition that hoped to build socialism on the peasant commune and avoid capitalism. Russian Marxism was born in argument with it, and its heirs, the Socialist Revolutionaries, were the largest party of the peasantry in 1917.",
        body: `The populists drew on Alexander Herzen and Nikolai Chernyshevsky, who argued in the 1850s and 1860s that the Russian village commune (*obshchina*, *mir*), with its periodic redistribution of land, could become the basis of a socialist society without the misery of Western capitalism.[cite:src_ml_venturi_roots][cite:src_ml_walicki_controversy]

In 1874 thousands of students "went to the people" to agitate in the villages and were met with indifference and arrest. The organisation Land and Liberty (*Zemlya i volya*, 1876) split in 1879: the People's Will (*Narodnaya volya*) turned to terror and assassinated Alexander II on 1 March 1881, while Black Repartition, led by [[thinker:plekhanov]], rejected terrorism. Plekhanov's group moved to Marxism in exile ([[event:emancipation-of-labour-group]]).[cite:src_ml_venturi_roots][cite:src_baron_plekhanov]

In the 1880s and 1890s "legal populist" economists such as Vasily Vorontsov and Nikolai Danielson, the translator of *Capital*, argued that capitalism could not take root in Russia because it lacked a home market. [[thinker:marx]] himself corresponded with Danielson from 1868 and in 1881 told Vera Zasulich that the commune could become the starting point of social regeneration in Russia, provided the forces undermining it were removed ([[debate:revolution-in-russia]]).[cite:src_ml_walicki_controversy][cite:src_mia_zasulich][cite:src_shanin_late_marx]`,
        context: `Populism revived after 1900 in the Party of Socialist Revolutionaries (founded 1901–02), led by Viktor Chernov, which combined a programme of land socialisation with a terrorist Combat Organisation. In 1917 it was the largest party among the peasants and soldiers, and its leaders joined the Provisional Government ([[event:february-revolution]]).[cite:src_smith_russia][cite:src_ml_venturi_roots]`,
        criticisms: `The Russian Marxists answered that the commune was already dissolving under the pressure of taxes, markets and land hunger, that the peasantry was dividing into rich and poor, and that the industrial working class, not the village, would make the revolution ([[text:development-of-capitalism-in-russia]]).[cite:src_baron_plekhanov][cite:src_ml_lenin_development]`,
        legacy: `Walicki notes that the Marxists of the 1890s stretched the word "populism" to cover all their opponents, from terrorists to liberal economists; in the 1870s it named a narrower current that put the peasants' own wishes above theories made for them. Historians since Venturi have also argued that the populists' emphasis on organisation, will and the seizure of power passed into Russian Marxism, and into Bolshevism especially.[cite:src_ml_walicki_controversy][cite:src_ml_venturi_roots]`,
      },
      citations: [{ source: "src_ml_venturi_roots" }, { source: "src_ml_walicki_controversy" }],
      flags: [
        { type: "disputed", field: "legacy", note: "The continuity between populism and Bolshevism is a contested thesis (Venturi, Walicki, Haimson). Check the wording presents it as such." },
      ],
    },
    {
      key: "text:development-of-capitalism-in-russia",
      title: "The Development of Capitalism in Russia",
      fields: {
        yearStart: 1899,
        subtitle: "Lenin's economic answer to the populists",
        originalTitle: "Razvitie kapitalizma v Rossii",
        language: "Russian",
        form: "book",
        publicationNote: "Written 1896–99 in prison and in Siberian exile; published legally in St Petersburg in March 1899 under the pseudonym Vladimir Ilyin; second edition 1908",
        edition: "Lenin, Collected Works, vol. 3",
        difficulty: "3",
        readingUrl: "https://www.marxists.org/archive/lenin/works/1899/devel/index.htm",
        aliases: "Razvitie kapitalizma v Rossii\nThe Process of the Formation of a Home Market for Large-Scale Industry",
        summary:
          "Lenin's long statistical study arguing that capitalism was already the dominant economic form in Russia. Against the populists, it showed the peasantry splitting into a rural bourgeoisie and a rural proletariat, and so creating the home market they said Russia lacked.",
        body: `Lenin wrote most of the book in prison in St Petersburg and in exile at Shushenskoye in Siberia, using the statistical surveys of the rural local councils (*zemstvos*). His aim, as the preface says, was to examine the whole process of the development of capitalism in Russia rather than isolated facts ([[thinker:lenin]]).[cite:src_ml_lenin_development]

The argument is that the populist economists had the relation backwards. They held that capitalism could not develop without a home market, and that the impoverished peasantry could not provide one. Lenin answered that the very process that impoverished part of the peasantry created the market: the "differentiation" of the peasants into a minority of commercial farmers who hired labour and a mass of poor peasants who had to sell theirs turned subsistence production into commodity production and labour power into a commodity ([[tendency:russian-populism]]; [[concept:labour-power]]).[cite:src_ml_lenin_development][cite:src_ml_walicki_controversy]

The later chapters trace the same process in handicrafts, manufacture and large-scale industry. Lenin concludes that Russia was a capitalist country, though with many survivals of serfdom, and that the working class was the force that would carry its development further.[cite:src_ml_lenin_development]`,
        context: `The book belongs to the controversy between Marxists and populists in the 1890s, in which the "legal Marxists" Pyotr Struve and Mikhail Tugan-Baranovsky also took the Marxist side. It drew on Marx's analysis of reproduction in the second volume of *Capital*. Its political conclusion, that Russia faced a bourgeois revolution in which the workers would play a leading part, was common ground among Russian social democrats at the time ([[debate:revolution-in-russia]]).[cite:src_ml_walicki_controversy][cite:src_harding_lenin]

Historians have questioned how far the zemstvo data show class differentiation rather than the cyclical rise and fall of household size, a point made in the 1920s by the economist Alexander Chayanov.[cite:src_smith_russia][cite:src_ml_walicki_controversy]`,
      },
      citations: [{ source: "src_ml_lenin_development" }, { source: "src_ml_walicki_controversy" }],
      flags: [
        { type: "specialist-review", field: "context", note: "The Chayanov point is post-1917 scholarship used as brief retrospective context. Check that it is fairly stated and cited (Shanin, The Awkward Class, 1972, would be a better source)." },
      ],
    },
    {
      key: "concept:economism",
      title: "Economism",
      fields: {
        yearStart: 1897,
        aliases: "Economists\nEkonomizm\nRabocheye Delo\nThe Credo",
        summary:
          "The name Russian Marxists gave, around 1899–1902, to the view that workers should concentrate on economic struggles against employers and leave political opposition to the autocracy to the liberals. Lenin's What Is to Be Done? was written against it.",
        brief: `In the late 1890s Russian Marxists began agitating among factory workers over wages, hours and fines. Some came to think that this economic struggle was what the workers really cared about, and that political demands should grow out of it slowly, or be left to the liberals. Their opponents called them "Economists". The argument was about whether a workers' party should lead the fight against the tsar.`,
        standard: `The term was polemical. It was applied to the papers *Rabochaya mysl* (Workers' Thought, 1897–1902) and *Rabocheye delo* (Workers' Cause), and above all to the *Credo* (1899), a private statement by Ekaterina Kuskova that the workers should fight economically while the intelligentsia supported the liberal opposition.[cite:src_ml_haimson_origins][cite:src_harding_lenin]

[[thinker:lenin]], then in Siberian exile, drafted a *Protest* against the *Credo* signed by seventeen exiled social democrats, and [[thinker:plekhanov]] attacked the Economists from Geneva. The newspaper *Iskra*, founded in 1900 by Lenin, Martov, Potresov and the Emancipation of Labour Group, made the struggle against Economism its first task ([[thinker:martov]]).[cite:src_ml_haimson_origins][cite:src_ml_getzler_martov]

In *What Is to Be Done?* (1902) Lenin generalised the dispute: Economism was a form of [[concept:revisionism]], and its "worship of spontaneity" left the workers' movement under bourgeois ideology ([[text:what-is-to-be-done]]; [[concept:spontaneity]]).[cite:src_mia_witbd]`,
        deep: `Historians disagree about how much of a current Economism was. Those labelled Economists denied that they had ever opposed political struggle, and the *Credo* was published by its opponents. Lih argues that Lenin's target was a narrow tendency and that the common reading of *What Is to Be Done?* as a theory of the party set against the workers' spontaneity mistakes a polemic for a doctrine. Others, following Haimson, see in the dispute an early sign of a lasting difference between those who trusted the workers' own movement and those who feared it ([[debate:spontaneity-and-organisation]]).[cite:src_lih_lenin][cite:src_ml_haimson_origins]`,
        criticisms: `The so-called Economists answered that the *Iskra* group wanted to impose a political line on workers from outside, and that the economic struggle was the school in which workers learned politics. Some of these arguments reappeared in the Menshevik criticism of Lenin after 1903 ([[tendency:menshevism]]).[cite:src_ml_haimson_origins][cite:src_ml_getzler_martov]`,
      },
      citations: [{ source: "src_ml_haimson_origins" }, { source: "src_mia_witbd" }],
    },
    {
      key: "thinker:martov",
      title: "Julius Martov",
      fields: {
        yearStart: 1873,
        yearEnd: 1923,
        subtitle: "1873–1923",
        roles: "Russian social democrat; co-founder of Iskra and leader of the Mensheviks",
        birthPlace: "Constantinople",
        deathPlace: "Schömberg, Germany",
        aliases: "Yuli Osipovich Tsederbaum\nL. Martov\nIulii Martov",
        summary:
          "Lenin's closest collaborator in the 1890s and his principal opponent after 1903. Martov led the Mensheviks, opposed the war as an internationalist, opposed his own party's entry into the Provisional Government in 1917, and opposed the Bolshevik seizure of power.",
        body: `## Life

Born Yuli Tsederbaum into a Jewish family that settled in Odessa, Martov became a socialist as a student in St Petersburg. In Vilna in 1893–95 he worked among Jewish artisans and helped to set out the method of mass agitation over economic grievances. Back in St Petersburg he co-founded, with [[thinker:lenin]], the Union of Struggle for the Emancipation of the Working Class (1895), and after three years of Siberian exile joined him and Potresov in founding *Iskra* in 1900.[cite:src_ml_getzler_martov]

At the second congress of the party in 1903 his definition of membership, broader than Lenin's, was adopted, but his supporters lost the votes for the party's central bodies and became the Mensheviks ([[event:bolshevik-menshevik-split]]; [[tendency:menshevism]]).[cite:src_ml_getzler_martov][cite:src_harding_lenin]

## War and 1917

In 1914 he took an internationalist position against the war and attended the [[event:zimmerwald-conference]]. Returning to Petrograd in May 1917, he led the Menshevik-Internationalists, opposed the entry of Mensheviks into the coalition government, and called for a government of the socialist parties based on the soviets. He condemned the Bolshevik insurrection and led his group out of the Second Congress of Soviets on 25 October ([[event:october-revolution]]).[cite:src_ml_getzler_martov][cite:src_ml_rabinowitch_bolsheviks]

## Ideas

Martov held to the view that Russia faced a bourgeois revolution in which the workers should organise as an independent opposition and not take power before the country, and the working class, were ready for socialism. He placed his hopes in the self-organisation of the workers and in a broad party open to them, and distrusted what he saw as Lenin's reliance on a conspiratorial centre ([[debate:revolution-in-russia]]; [[concept:vanguard-party]]).[cite:src_ml_getzler_martov][cite:src_ml_haimson_origins]`,
        context: `Getzler's biography presents Martov as the conscience of Russian social democracy: respected by opponents for his integrity and intelligence, and repeatedly isolated between the Bolsheviks and the right of his own faction.[cite:src_ml_getzler_martov]`,
        legacy: `He opposed the Bolshevik government from within the soviets until he left Russia in 1920, and died in Germany in 1923. His later writings on the Soviet state lie outside this collection.[cite:src_ml_getzler_martov]`,
      },
      citations: [{ source: "src_ml_getzler_martov" }, { source: "src_ml_haimson_origins" }],
    },
    {
      key: "tendency:menshevism",
      title: "Menshevism",
      fields: {
        yearStart: 1903,
        yearEnd: 1917,
        periodLabel: "1903–1917",
        color: "beige",
        aliases: "Mensheviks\nMen'sheviki\nMenshevik-Internationalists",
        summary:
          "The faction of the Russian Social Democratic Labour Party that formed around Martov, Axelrod and, from late 1903, Plekhanov. It held that Russia faced a bourgeois revolution, favoured a broad workers' party, and in 1917 led the soviets in their first months and joined the Provisional Government.",
        body: `The Mensheviks ("those of the minority") took their name from the vote at the 1903 congress. Their leaders included [[thinker:martov]], Pavel Axelrod, Fyodor Dan, Alexander Potresov and, after he broke with Lenin in late 1903, [[thinker:plekhanov]] ([[event:bolshevik-menshevik-split]]).[cite:src_ml_getzler_martov][cite:src_baron_plekhanov]

They agreed with the Bolsheviks that Russia faced a bourgeois-democratic revolution, but drew different conclusions. Since the bourgeoisie would rule after it, the workers' party should push the revolution forward from outside power, as an opposition, while building its own organisations: trade unions, cooperatives, and, in Axelrod's proposal of 1905–07, a broad labour congress. They criticised Lenin's organisational plan as a dictatorship over the party ([[concept:vanguard-party]]).[cite:src_ml_haimson_origins][cite:src_ml_getzler_martov]

Between 1907 and 1914 many Mensheviks turned to legal work in unions, insurance funds and the Duma; the Bolsheviks called them "liquidators" of the underground party. The war divided them into defencists and internationalists, the latter led by Martov ([[debate:socialists-and-the-war]]).[cite:src_ml_getzler_martov][cite:src_smith_russia]`,
        context: `In February 1917 Mensheviks led the Petrograd Soviet, with Nikolai Chkheidze as chairman and Irakli Tsereteli as its leading figure after his return in March. In May Tsereteli and others entered the coalition Provisional Government, which committed them to the war and to deferring the land question to a constituent assembly; Martov opposed the decision ([[event:february-revolution]]; [[concept:ministerialism]]).[cite:src_smith_russia][cite:src_ml_rabinowitch_bolsheviks]

Their support fell sharply through the summer and autumn. In Georgia, under Noe Zhordania, Menshevism remained a mass movement.[cite:src_smith_russia]`,
        criticisms: `Bolsheviks charged that Menshevism subordinated the workers to the liberal bourgeoisie; Trotsky, that it expected a bourgeoisie too weak and frightened to lead its own revolution. Mensheviks answered that the Bolshevik alternative meant a minority dictatorship in a peasant country unready for socialism ([[concept:permanent-revolution]]; [[debate:revolution-in-russia]]).[cite:src_mia_trotsky_results][cite:src_ml_getzler_martov]`,
        legacy: `Mensheviks predicted that a seizure of power by a workers' party in Russia would end in dictatorship; whether events after 1917 proved them right is a question outside the scope of this collection, and historians remain divided about it.[cite:src_ml_haimson_origins]`,
      },
      citations: [{ source: "src_ml_getzler_martov" }, { source: "src_ml_haimson_origins" }, { source: "src_smith_russia" }],
    },
    {
      key: "tendency:bolshevism",
      title: "Bolshevism",
      fields: {
        yearStart: 1903,
        periodLabel: "1903 –",
        color: "red",
        aliases: "Bolsheviks\nBol'sheviki\nRSDLP (Bolsheviks)",
        summary:
          "The faction led by Lenin that took its name from the vote at the 1903 congress and became a separate party in 1912. It stood for a centralised underground party and for working-class leadership of a democratic revolution allied to the peasantry; in 1917 it led the soviets to take power.",
        body: `The Bolsheviks ("those of the majority") formed around [[thinker:lenin]] after the 1903 congress, where his supporters won the elections to the party's central bodies ([[event:bolshevik-menshevik-split]]). They insisted on a disciplined organisation of committed members working underground under the autocracy ([[concept:vanguard-party]]).[cite:src_harding_lenin][cite:src_ml_haimson_origins]

In 1905 Lenin argued in *Two Tactics of Social-Democracy* that the Russian bourgeoisie would betray its own revolution, and that the workers, allied with the peasantry, should lead it to a "revolutionary-democratic dictatorship of the proletariat and the peasantry". The revolution would remain bourgeois-democratic, but could be carried to its end and serve as a spark to revolution in Europe ([[event:revolution-1905]]).[cite:src_mia_two_tactics][cite:src_harding_lenin]

After 1907 the faction was itself divided, between Lenin and the group around Alexander Bogdanov, which wanted to recall the party's deputies from the Duma. In 1912 Lenin's followers held their own conference in Prague and formed a separate central committee; they won most of the workers' seats in the 1912 Duma elections and published the daily *Pravda*.[cite:src_service_lenin][cite:src_harding_lenin]`,
        context: `In 1914 the Bolshevik Duma deputies voted against war credits and were arrested and exiled. In exile Lenin called for the defeat of one's own government and a break with the Second International ([[concept:revolutionary-defeatism]]; [[event:zimmerwald-conference]]).[cite:src_mia_lenin_war_1914][cite:src_haupt_war]

In March 1917 the Petrograd Bolsheviks around Lev Kamenev and Joseph Stalin gave conditional support to the Provisional Government. Lenin's return on 3 April and his April Theses turned the party against it. Between the July Days and the defeat of General Kornilov at the end of August the party grew rapidly; it won majorities in the Petrograd and Moscow soviets in September and organised the insurrection of 24–25 October ([[text:april-theses]]; [[event:october-revolution]]).[cite:src_ml_rabinowitch_bolsheviks][cite:src_smith_russia]`,
        criticisms: `Opponents from Martov and Trotsky in 1904 to Luxemburg charged that Bolshevik centralism put the party committee in place of the working class. Defenders answered that no other kind of organisation could survive the tsarist police ([[debate:spontaneity-and-organisation]]).[cite:src_ml_trotsky_tasks][cite:src_mia_luxemburg_org]`,
        legacy: `Historians disagree about how distinct Bolshevism was before 1917. One reading, going back to Haimson, sees in it from 1903 a distinctive distrust of spontaneity and reliance on a centralised party. Lih argues instead that the Bolsheviks saw themselves as orthodox social democrats on the German model, and that their distinctiveness lay in strategy for the Russian revolution more than in organisation. After 1917 the doctrine was codified as "Leninism", a name that before 1917 was used mainly by its opponents ([[tendency:leninism]]).[cite:src_ml_haimson_origins][cite:src_lih_lenin]`,
      },
      citations: [{ source: "src_harding_lenin" }, { source: "src_lih_lenin" }, { source: "src_ml_rabinowitch_bolsheviks" }],
      flags: [
        { type: "possible-duplicate", note: "Overlaps with the existing Leninism tendency, which covers the same faction but names it with a later term. This entry carries the pre-1917 story; editors should decide whether Leninism should be scoped to the post-1917 doctrine." },
      ],
    },
    {
      key: "thinker:trotsky",
      title: "Leon Trotsky",
      fields: {
        yearStart: 1879,
        yearEnd: 1940,
        subtitle: "1879–1940",
        roles: "Russian revolutionary, journalist and theorist of permanent revolution; leader of the Petersburg Soviet in 1905 and of the October insurrection",
        birthPlace: "Yanovka, Kherson province",
        deathPlace: "Coyoacán, Mexico City",
        aliases: "Lev Davidovich Bronstein\nLev Trotsky\nLeo Trotzky",
        summary:
          "A Marxist who stood outside both Russian factions for most of the years before 1917. He led the Petersburg Soviet of 1905, developed the theory of permanent revolution, criticised Lenin's centralism, and joined the Bolsheviks in 1917 to lead the October insurrection.",
        body: `## Life

Lev Bronstein, the son of a Jewish farmer in southern Ukraine, became a revolutionary in Nikolaev in 1897. Arrested and exiled to Siberia, he escaped in 1902 under the name Trotsky and joined the *Iskra* group in London. At the 1903 congress he sided with Martov ([[event:bolshevik-menshevik-split]]), and in *Our Political Tasks* (1904) accused Lenin of putting the party committee in place of the class. He soon parted from the Mensheviks as well.[cite:src_ml_deutscher_armed][cite:src_ml_trotsky_tasks]

In 1905 he returned to Russia and became the leading figure of the St Petersburg Soviet of Workers' Deputies, chairing it after the arrest of its first chairman. Arrested with its members in December, he wrote in prison the essay in which he set out the theory of permanent revolution ([[event:revolution-1905]]; [[concept:soviets]]; [[text:results-and-prospects]]).[cite:src_ml_deutscher_armed][cite:src_ascher_1905]

Sentenced to exile for life, he escaped in 1907 and lived in Vienna, where he edited a non-factional *Pravda* and tried to reunite the party. During the war he opposed the war from Paris, drafted the manifesto of the [[event:zimmerwald-conference]], and was expelled to Spain and then the United States.[cite:src_ml_deutscher_armed][cite:src_mia_zimmerwald]

## 1917

Back in Petrograd in May 1917, he led the Inter-District group (*Mezhraiontsy*), which joined the Bolsheviks in August. Imprisoned after the July Days, he was elected chairman of the Petrograd Soviet in September and directed its Military Revolutionary Committee in the insurrection of October ([[tendency:bolshevism]]; [[event:october-revolution]]).[cite:src_ml_rabinowitch_bolsheviks][cite:src_ml_deutscher_armed]

## Ideas

Trotsky argued that in Russia the bourgeoisie was too weak and too dependent on the autocracy and foreign capital to lead a democratic revolution. The working class would have to lead it, and having taken power could not stop at democratic measures; it would be driven towards socialism, and could hold out only if revolution spread to the West ([[concept:permanent-revolution]]).[cite:src_mia_trotsky_results][cite:src_ml_kneipaz_trotsky]`,
        context: `Before 1917 Trotsky was a well-known writer in the European socialist press and a figure without a faction in Russia: Lenin attacked his attempts at reunification as unprincipled, and the Mensheviks regarded him as an adventurer.[cite:src_ml_deutscher_armed][cite:src_ml_kneipaz_trotsky]`,
        legacy: `After 1917 he founded the Red Army, lost the struggle for the succession to Lenin, and was exiled and murdered on Stalin's orders in 1940. This collection covers him only to 1917.[cite:src_ml_deutscher_armed]`,
      },
      citations: [{ source: "src_ml_deutscher_armed" }, { source: "src_ml_kneipaz_trotsky" }],
    },
    {
      key: "text:results-and-prospects",
      title: "Results and Prospects",
      fields: {
        yearStart: 1906,
        subtitle: "Trotsky's theory of permanent revolution",
        originalTitle: "Itogi i perspektivy",
        language: "Russian",
        form: "essay",
        publicationNote: "Written in prison in 1906 as the final chapter of Trotsky's collection Nasha revolyutsiya (Our Revolution), St Petersburg, 1906; most copies were seized",
        edition: "trans. in The Permanent Revolution and Results and Prospects (New Park, 1962)",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/trotsky/1931/tpr/index.htm",
        aliases: "Itogi i perspektivy\nResults and Prospects: The Driving Forces of the Revolution",
        summary:
          "Trotsky's essay drawing the lessons of 1905. It argued that in Russia only the working class could carry through the democratic revolution, that a workers' government could not confine itself to democratic tasks, and that it would survive only as part of a European revolution.",
        body: `The essay begins with the peculiarities of Russian history: a state that had grown strong on the back of a weak society, and a capitalism introduced from above with foreign capital, so that large-scale industry and a concentrated working class appeared before a strong urban bourgeoisie ([[event:revolution-1905]]).[cite:src_mia_trotsky_results][cite:src_ml_kneipaz_trotsky]

From this Trotsky concluded that the coming of a workers' government did not depend on the level of the productive forces alone. The workers could come to power in a backward country before an advanced one, as they had briefly in Paris in 1871. Once in power they could not leave the factories to the employers or refuse the peasants' demands, and their own measures would push the revolution from democratic to collectivist tasks ([[event:paris-commune]]).[cite:src_mia_trotsky_results]

The last sections argue that a workers' government in Russia would meet the hostility of the peasantry once it began collectivist measures, and of the European powers. Without state support from a victorious European working class, it could not hold power ([[concept:permanent-revolution]]).[cite:src_mia_trotsky_results]`,
        context: `The essay was written in answer to both factions: to the Mensheviks, who expected the bourgeoisie to take power, and to Lenin's formula of a democratic dictatorship of workers and peasants. Trotsky developed it in collaboration and argument with Parvus (Alexander Helphand), whose share in the theory is disputed. Few read it before 1917; it became central to later disputes about the Russian revolution ([[debate:revolution-in-russia]]).[cite:src_ml_day_gaido_witnesses][cite:src_ml_deutscher_armed]`,
      },
      citations: [{ source: "src_mia_trotsky_results" }, { source: "src_ml_day_gaido_witnesses", note: "The documents of the 1905 debate." }],
    },
    {
      key: "concept:permanent-revolution",
      title: "Permanent revolution",
      fields: {
        yearStart: 1850,
        aliases: "Uninterrupted revolution\nRevolution in permanence\nPermanente Revolution",
        summary:
          "The idea that a democratic revolution led by the workers would not stop at democratic aims but grow into a socialist one, and spread beyond national borders. Marx and Engels used the phrase in 1850; Trotsky and Parvus developed it for Russia after 1905.",
        brief: `Marxists expected that a backward country like Russia would first have a bourgeois revolution: the overthrow of the monarchy, a parliament, freedom for capitalism. Socialism would come later. The theory of permanent revolution said that the stages could merge. If the workers had to lead the democratic revolution because the bourgeoisie would not, they would not hand power back afterwards; they would begin to build socialism, and they would need revolutions in other countries to succeed.`,
        standard: `In March 1850 [[thinker:marx]] and [[thinker:engels]] told the Communist League that the workers' task was to make the revolution "permanent": to press beyond the aims of the democratic petty bourgeoisie until the proletariat had conquered state power, not only in one country but in the leading countries of the world ([[event:communist-league]]).[cite:src_mia_address_1850]

The phrase returned in the Russian revolution of 1905. Parvus and [[thinker:trotsky]] argued that the Russian bourgeoisie was too weak to lead its revolution and that a workers' government would be its result. Trotsky's *Results and Prospects* (1906) made the further argument: such a government would be forced to take socialist measures and could survive only with European revolution ([[text:results-and-prospects]]).[cite:src_mia_trotsky_results][cite:src_ml_day_gaido_witnesses]

The alternatives were the Menshevik view of a bourgeois revolution with the workers in opposition, and Lenin's of a "revolutionary-democratic dictatorship of the proletariat and the peasantry" that would remain within bourgeois limits ([[tendency:menshevism]]; [[tendency:bolshevism]]).[cite:src_mia_two_tactics][cite:src_harding_lenin]`,
        deep: `Day and Gaido have shown that the idea was more widely discussed in 1905–07 than the later identification with Trotsky suggests: Kautsky, Luxemburg, Mehring and Ryazanov also wrote of the Russian revolution as one that might pass beyond bourgeois limits. Kautsky's article "The Driving Forces of the Russian Revolution" (1906) was welcomed by Lenin and Trotsky alike.[cite:src_ml_day_gaido_witnesses]

In 1917 Lenin's call for power to the soviets led old Bolsheviks to accuse him of adopting Trotsky's position. Whether the April Theses did so, or developed Lenin's own position under new conditions, is a long-running dispute ([[text:april-theses]]; [[debate:revolution-in-russia]]).[cite:src_harding_lenin][cite:src_ml_rabinowitch_bolsheviks]`,
        history: `Marx and Engels took the phrase from the language of the French Revolution and of Blanquism. It disappeared from Marxist usage after 1850 and returned in Russian and German debates in 1905. Its later history, in the disputes between Trotsky and Stalin after 1924, lies outside this collection.[cite:src_ml_day_gaido_witnesses][cite:src_bottomore_dictionary]`,
        criticisms: `Mensheviks argued that a workers' government in a peasant country would either be overthrown or become a dictatorship over the majority. Lenin before 1917 objected that Trotsky underrated the peasantry as an ally. Others pointed out that the theory made the Russian revolution depend on events in Europe that Russian socialists could not control.[cite:src_ml_getzler_martov][cite:src_harding_lenin]`,
      },
      citations: [{ source: "src_mia_address_1850" }, { source: "src_mia_trotsky_results" }, { source: "src_ml_day_gaido_witnesses" }],
      flags: [
        { type: "disputed", field: "deep", note: "The relationship between the April Theses and Trotsky's theory is contested. Check that the entry does not decide it." },
        { type: "specialist-review", field: "standard", note: "Parvus's and Trotsky's shares in the 1905 theory are disputed. Day and Gaido give the documents; check the attribution." },
      ],
    },
    {
      key: "concept:soviets",
      title: "Soviets",
      fields: {
        yearStart: 1905,
        aliases: "Soviet\nCouncils of workers' deputies\nSovety\nWorkers' councils\nSoviet of Workers' and Soldiers' Deputies",
        summary:
          "Councils of delegates elected in factories, and in 1917 in army units and villages, that first appeared in the Russian strikes of 1905. In 1917 they became a rival authority to the Provisional Government and, under the slogan \"All power to the soviets\", the basis of the new state.",
        brief: `"Soviet" is the Russian word for council. In 1905 striking workers in Russian cities elected delegates from each factory to coordinate the strike, and these councils began to act like a local government. In 1917 they appeared again, now with soldiers' delegates, and became a second power next to the official government.`,
        standard: `The St Petersburg Soviet of Workers' Deputies met first on 13 October 1905, during the general strike, with delegates elected at the rate of one for every five hundred workers. It published its own paper, called for an eight-hour day and for a refusal to pay taxes, and was arrested in December. Soviets formed in dozens of other towns ([[event:revolution-1905]]; [[thinker:trotsky]]).[cite:src_ascher_1905][cite:src_ml_deutscher_armed]

On 27 February 1917 the Petrograd Soviet of Workers' and Soldiers' Deputies was formed in the Tauride Palace, on the same day as the committee of the Duma that became the Provisional Government. The soviet's Order No. 1 put the army's weapons under the control of elected committees, and soviets spread through the country. Lenin called the result "dual power" ([[event:february-revolution]]; [[concept:dual-power]]).[cite:src_smith_russia][cite:src_ml_lenin_dual_power]

Lenin's April Theses demanded that all power pass to the soviets, a republic of soviets rather than a parliamentary republic. In September the Bolsheviks won majorities in the Petrograd and Moscow soviets, and the insurrection of 25 October was timed to hand power to the Second All-Russian Congress of Soviets ([[text:april-theses]]; [[event:october-revolution]]).[cite:src_mia_april_theses][cite:src_ml_rabinowitch_bolsheviks]`,
        deep: `Socialists disagreed about what the soviets were. For the Mensheviks and Socialist Revolutionaries who led them until September 1917 they were organs of "revolutionary democracy", which should supervise and pressure the government but not replace it. For Lenin in 1917 they were a state of a new type, comparable to the Paris Commune, in which the armed people replaced the standing army and the bureaucracy ([[event:paris-commune]]; [[text:the-state-and-revolution]]; [[concept:dictatorship-of-the-proletariat]]).[cite:src_smith_russia][cite:src_state_revolution]

In 1905 the soviets came from the strike, not from any party's plan, and Bolsheviks in St Petersburg at first distrusted the soviet as a rival to the party. Luxemburg read the same experience as proof that organisation could grow out of mass action ([[concept:spontaneity]]; [[text:the-mass-strike]]).[cite:src_ascher_1905][cite:src_nettl_luxemburg]`,
        history: `Which soviet was the first is disputed: the council of delegates elected during the textile strike at Ivanovo-Voznesensk in May 1905 is often given that place, and the St Petersburg Soviet of October 1905 was the one that gave the institution its name and model. After 1917 "soviet" became the name of the Russian state, and councils on the Russian model appeared in Germany, Austria and Hungary in 1918–19, which lies outside this collection.[cite:src_ml_anweiler_soviets][cite:src_ascher_1905]`,
        criticisms: `Liberals and moderate socialists in 1917 objected that soviets represented only part of the population, and that their power competed with a constituent assembly elected by all. Supporters answered that they were more democratic than any parliament because their delegates could be recalled at any time.[cite:src_smith_russia][cite:src_wade_revolution]`,
      },
      citations: [{ source: "src_ascher_1905" }, { source: "src_ml_anweiler_soviets" }, { source: "src_smith_russia" }, { source: "src_mia_april_theses" }],
      flags: [
        { type: "specialist-review", field: "history", note: "The claim for Ivanovo-Voznesensk as the first soviet (May 1905) is common but contested. Check against Anweiler, The Soviets (1974), now cited." },
      ],
    },

    /* ——— A note on an existing debate ——— */
    {
      key: "debate:revolution-in-russia",
      title: "Could Russia make a socialist revolution?",
      fields: {},
      flags: [
        { type: "specialist-review", note: "The Marx to Lenin Corpus adds an entry for Trotsky (and for permanent revolution, Menshevism and Bolshevism). The position \"Trotsky (permanent revolution, 1906)\" has no holder and its summary says \"Trotsky is not yet an entry in this corpus\"; when the Trotsky entry is published, set the holder and remove that sentence in the debate's structure tab." },
      ],
    },
  ],
  relationships: [
    // Populism
    { from: "tendency:russian-populism", type: "CONTRASTS_WITH", to: "tendency:marxism", note: "Russian Marxism defined itself against it.", source: "src_ml_walicki_controversy", weight: 3, on: "tendency:russian-populism" },
    { from: "thinker:plekhanov", type: "MEMBER_OF", to: "tendency:russian-populism", note: "Led Black Repartition before turning to Marxism.", source: "src_baron_plekhanov", yearStart: 1876, yearEnd: 1881, on: "tendency:russian-populism" },
    { from: "thinker:plekhanov", type: "CRITIQUED", to: "tendency:russian-populism", note: "Socialism and the Political Struggle (1883), Our Differences (1885).", source: "src_baron_plekhanov", yearStart: 1883, weight: 2, on: "tendency:russian-populism" },
    { from: "thinker:marx", type: "ASSOCIATED_WITH", to: "tendency:russian-populism", note: "Corresponded with Danielson from 1868; answered Zasulich on the commune in 1881.", source: "src_shanin_late_marx", yearStart: 1868, on: "tendency:russian-populism" },
    { from: "thinker:bakunin", type: "INFLUENCED", to: "tendency:russian-populism", note: "Inspired its 'rebel' wing in the 1870s.", source: "src_ml_venturi_roots", on: "tendency:russian-populism" },
    { from: "tendency:russian-populism", type: "RELATED_TO", to: "debate:revolution-in-russia", note: "The populist position in the debate.", source: "src_ml_walicki_controversy", on: "tendency:russian-populism" },
    { from: "event:emancipation-of-labour-group", type: "RESPONDED_TO", to: "tendency:russian-populism", note: "Founded by former populists in 1883.", source: "src_baron_plekhanov", yearStart: 1883, on: "tendency:russian-populism" },
    // Lenin's Development of Capitalism
    { from: "thinker:lenin", type: "WROTE", to: "text:development-of-capitalism-in-russia", note: "Published under the name Vladimir Ilyin, 1899.", source: "src_ml_lenin_development", yearStart: 1899, weight: 3, on: "text:development-of-capitalism-in-russia" },
    { from: "text:development-of-capitalism-in-russia", type: "CRITIQUED", to: "tendency:russian-populism", note: "Against the populist economists' denial of a home market.", source: "src_ml_lenin_development", weight: 3, on: "text:development-of-capitalism-in-russia" },
    { from: "text:development-of-capitalism-in-russia", type: "DISCUSSES", to: "concept:capitalism", note: "Capitalism as Russia's dominant economic form.", source: "src_ml_lenin_development", on: "text:development-of-capitalism-in-russia" },
    { from: "text:development-of-capitalism-in-russia", type: "DISCUSSES", to: "concept:class", note: "The differentiation of the peasantry.", source: "src_ml_lenin_development", on: "text:development-of-capitalism-in-russia" },
    { from: "text:capital-volume-one", type: "INFLUENCED", to: "text:development-of-capitalism-in-russia", note: "Applies Marx's analysis of the home market and primitive accumulation.", source: "src_ml_walicki_controversy", basis: "interpretive", on: "text:development-of-capitalism-in-russia" },
    // Economism
    { from: "text:what-is-to-be-done", type: "CRITIQUED", to: "concept:economism", note: "Its main target.", source: "src_mia_witbd", yearStart: 1902, weight: 3, on: "concept:economism" },
    { from: "thinker:lenin", type: "CRITIQUED", to: "concept:economism", note: "Drafted the Protest against the Credo (1899).", source: "src_ml_haimson_origins", yearStart: 1899, on: "concept:economism" },
    { from: "thinker:plekhanov", type: "CRITIQUED", to: "concept:economism", note: "Attacked the Economists from Geneva.", source: "src_baron_plekhanov", yearStart: 1899, on: "concept:economism" },
    { from: "concept:economism", type: "RELATED_TO", to: "concept:spontaneity", note: "Lenin called it worship of spontaneity.", source: "src_mia_witbd", weight: 2, on: "concept:economism" },
    { from: "concept:economism", type: "RELATED_TO", to: "concept:revisionism", note: "Lenin treated it as Russian revisionism.", source: "src_mia_witbd", basis: "interpretive", on: "concept:economism" },
    { from: "concept:economism", type: "RELATED_TO", to: "debate:spontaneity-and-organisation", note: "The dispute that opened the debate.", source: "src_lih_lenin", on: "concept:economism" },
    // Martov
    { from: "thinker:martov", type: "MEMBER_OF", to: "tendency:menshevism", note: "Its leader.", source: "src_ml_getzler_martov", weight: 3, on: "thinker:martov" },
    { from: "thinker:martov", type: "ASSOCIATED_WITH", to: "thinker:lenin", note: "Co-founded the Union of Struggle (1895) and Iskra (1900).", source: "src_ml_getzler_martov", yearStart: 1895, yearEnd: 1903, weight: 2, on: "thinker:martov" },
    { from: "thinker:martov", type: "CONTRASTS_WITH", to: "thinker:lenin", note: "Opponents from 1903.", source: "src_ml_getzler_martov", yearStart: 1903, weight: 2, on: "thinker:martov" },
    { from: "thinker:martov", type: "PARTICIPATED_IN", to: "event:bolshevik-menshevik-split", note: "His membership formula was adopted; his side lost the elections.", source: "src_ml_getzler_martov", yearStart: 1903, weight: 3, on: "thinker:martov" },
    { from: "thinker:martov", type: "CRITIQUED", to: "concept:vanguard-party", note: "Opposed Lenin's centralism from 1903.", source: "src_ml_getzler_martov", on: "thinker:martov" },
    { from: "thinker:martov", type: "CRITIQUED", to: "concept:economism", note: "As an Iskra editor.", source: "src_ml_getzler_martov", yearStart: 1900, on: "thinker:martov" },
    { from: "thinker:martov", type: "PARTICIPATED_IN", to: "event:zimmerwald-conference", note: "For the Menshevik internationalists.", source: "src_ml_getzler_martov", yearStart: 1915, on: "thinker:martov" },
    { from: "thinker:martov", type: "REJECTED", to: "concept:ministerialism", note: "Opposed the Mensheviks' entry into the coalition government, May 1917.", source: "src_ml_getzler_martov", yearStart: 1917, on: "thinker:martov" },
    { from: "thinker:martov", type: "REJECTED", to: "event:october-revolution", note: "Led his group out of the Second Congress of Soviets.", source: "src_ml_rabinowitch_bolsheviks", yearStart: 1917, on: "thinker:martov" },
    // Menshevism
    { from: "tendency:menshevism", type: "ASSOCIATED_WITH", to: "event:bolshevik-menshevik-split", note: "Named after the 1903 vote.", source: "src_harding_lenin", weight: 3, on: "tendency:menshevism" },
    { from: "tendency:menshevism", type: "CONTRASTS_WITH", to: "tendency:bolshevism", note: "The two factions of Russian social democracy.", source: "src_ml_haimson_origins", weight: 3, on: "tendency:menshevism" },
    { from: "tendency:menshevism", type: "ASSOCIATED_WITH", to: "tendency:social-democracy", note: "A faction of the Russian Social Democratic Labour Party.", source: "src_ml_getzler_martov", on: "tendency:menshevism" },
    { from: "thinker:plekhanov", type: "MEMBER_OF", to: "tendency:menshevism", note: "Broke with Lenin in late 1903; later stood apart from both factions.", source: "src_baron_plekhanov", yearStart: 1903, on: "tendency:menshevism" },
    { from: "tendency:menshevism", type: "ASSOCIATED_WITH", to: "event:february-revolution", note: "Led the Petrograd Soviet in its first months.", source: "src_smith_russia", yearStart: 1917, on: "tendency:menshevism" },
    { from: "tendency:menshevism", type: "ASSOCIATED_WITH", to: "concept:ministerialism", note: "Entered the coalition Provisional Government in May 1917.", source: "src_smith_russia", yearStart: 1917, on: "tendency:menshevism" },
    { from: "tendency:menshevism", type: "RELATED_TO", to: "debate:revolution-in-russia", note: "The bourgeois revolution with the workers in opposition.", source: "src_ml_getzler_martov", on: "tendency:menshevism" },
    // Bolshevism
    { from: "thinker:kollontai", type: "MEMBER_OF", to: "tendency:menshevism", note: "Worked with the Mensheviks, 1906–15.", source: "src_ml_clements_kollontai", yearStart: 1906, yearEnd: 1915, on: "thinker:kollontai" },
    { from: "thinker:kollontai", type: "MEMBER_OF", to: "tendency:bolshevism", note: "Joined in 1915 over the war.", source: "src_ml_clements_kollontai", yearStart: 1915, on: "thinker:kollontai" },
    { from: "thinker:lenin", type: "MEMBER_OF", to: "tendency:bolshevism", note: "Its founder and leader.", source: "src_harding_lenin", yearStart: 1903, weight: 3, on: "tendency:bolshevism" },
    { from: "tendency:bolshevism", type: "ASSOCIATED_WITH", to: "event:bolshevik-menshevik-split", note: "Named after the 1903 vote.", source: "src_harding_lenin", weight: 3, on: "tendency:bolshevism" },
    { from: "tendency:bolshevism", type: "ASSOCIATED_WITH", to: "concept:vanguard-party", note: "A centralised party of committed members.", source: "src_ml_haimson_origins", weight: 2, on: "tendency:bolshevism" },
    { from: "text:what-is-to-be-done", type: "INFLUENCED", to: "tendency:bolshevism", note: "Read by opponents as its founding text; Lih disputes the reading.", source: "src_lih_lenin", basis: "interpretive", on: "tendency:bolshevism" },
    { from: "tendency:bolshevism", type: "ASSOCIATED_WITH", to: "event:revolution-1905", note: "Two Tactics: workers and peasants should lead the democratic revolution.", source: "src_mia_two_tactics", yearStart: 1905, on: "tendency:bolshevism" },
    { from: "tendency:bolshevism", type: "ASSOCIATED_WITH", to: "event:october-revolution", note: "Organised the insurrection.", source: "src_ml_rabinowitch_bolsheviks", yearStart: 1917, weight: 3, on: "tendency:bolshevism" },
    { from: "tendency:bolshevism", type: "RELATED_TO", to: "tendency:leninism", note: "After 1917 its doctrine was codified as Leninism.", source: "src_lih_lenin", on: "tendency:bolshevism" },
    { from: "tendency:bolshevism", type: "RELATED_TO", to: "debate:spontaneity-and-organisation", note: "The organisational dispute of 1903–04.", source: "src_ml_haimson_origins", on: "tendency:bolshevism" },
    // Trotsky
    { from: "thinker:trotsky", type: "WROTE", to: "text:results-and-prospects", note: "Written in prison, 1906.", source: "src_mia_trotsky_results", yearStart: 1906, weight: 3, on: "thinker:trotsky" },
    { from: "thinker:trotsky", type: "DEVELOPED", to: "concept:permanent-revolution", note: "Its best-known statement.", source: "src_mia_trotsky_results", yearStart: 1906, weight: 3, on: "thinker:trotsky" },
    { from: "thinker:trotsky", type: "PARTICIPATED_IN", to: "event:revolution-1905", note: "Led the St Petersburg Soviet.", source: "src_ml_deutscher_armed", yearStart: 1905, weight: 3, on: "thinker:trotsky" },
    { from: "thinker:trotsky", type: "PARTICIPATED_IN", to: "event:bolshevik-menshevik-split", note: "Sided with Martov at the congress.", source: "src_ml_deutscher_armed", yearStart: 1903, on: "thinker:trotsky" },
    { from: "thinker:trotsky", type: "CRITIQUED", to: "concept:vanguard-party", note: "Our Political Tasks (1904).", source: "src_ml_trotsky_tasks", yearStart: 1904, weight: 2, on: "thinker:trotsky" },
    { from: "thinker:trotsky", type: "CRITIQUED", to: "thinker:lenin", note: "Attacked his centralism in 1904 and his factionalism before 1914.", source: "src_ml_deutscher_armed", yearStart: 1904, yearEnd: 1914, on: "thinker:trotsky" },
    { from: "thinker:trotsky", type: "PARTICIPATED_IN", to: "event:zimmerwald-conference", note: "Drafted its manifesto.", source: "src_ml_deutscher_armed", yearStart: 1915, on: "thinker:trotsky" },
    { from: "thinker:trotsky", type: "MEMBER_OF", to: "tendency:bolshevism", note: "Joined in August 1917.", source: "src_ml_rabinowitch_bolsheviks", yearStart: 1917, on: "thinker:trotsky" },
    { from: "thinker:trotsky", type: "PARTICIPATED_IN", to: "event:october-revolution", note: "Chairman of the Petrograd Soviet and its Military Revolutionary Committee.", source: "src_ml_rabinowitch_bolsheviks", yearStart: 1917, weight: 3, on: "thinker:trotsky" },
    { from: "thinker:trotsky", type: "ASSOCIATED_WITH", to: "concept:soviets", note: "Chaired the Petersburg Soviet in 1905 and the Petrograd Soviet in 1917.", source: "src_ml_deutscher_armed", weight: 2, on: "thinker:trotsky" },
    // Results and Prospects and permanent revolution
    { from: "text:results-and-prospects", type: "DISCUSSES", to: "concept:permanent-revolution", note: "The theory's first full statement.", source: "src_mia_trotsky_results", weight: 3, on: "text:results-and-prospects" },
    { from: "text:results-and-prospects", type: "DISCUSSES", to: "event:revolution-1905", note: "Draws its lessons.", source: "src_mia_trotsky_results", on: "text:results-and-prospects" },
    { from: "text:results-and-prospects", type: "RELATED_TO", to: "debate:revolution-in-russia", note: "Trotsky's position in the debate.", source: "src_ml_day_gaido_witnesses", on: "text:results-and-prospects" },
    { from: "thinker:marx", type: "DEVELOPED", to: "concept:permanent-revolution", note: "Address to the Communist League, March 1850 (with Engels).", source: "src_mia_address_1850", yearStart: 1850, on: "concept:permanent-revolution" },
    { from: "concept:permanent-revolution", type: "RELATED_TO", to: "debate:revolution-in-russia", note: "One answer to the question.", source: "src_ml_day_gaido_witnesses", weight: 2, on: "concept:permanent-revolution" },
    { from: "concept:permanent-revolution", type: "RELATED_TO", to: "concept:revolution", note: "Democratic revolution growing into socialist revolution.", source: "src_bottomore_dictionary", on: "concept:permanent-revolution" },
    { from: "thinker:kautsky", type: "ASSOCIATED_WITH", to: "concept:permanent-revolution", note: "The Driving Forces of the Russian Revolution (1906), welcomed by Lenin and Trotsky.", source: "src_ml_day_gaido_witnesses", yearStart: 1906, basis: "interpretive", on: "concept:permanent-revolution" },
    // Soviets
    { from: "event:revolution-1905", type: "ASSOCIATED_WITH", to: "concept:soviets", note: "The first soviets.", source: "src_ascher_1905", yearStart: 1905, weight: 3, on: "concept:soviets" },
    { from: "event:february-revolution", type: "ASSOCIATED_WITH", to: "concept:soviets", note: "The Petrograd Soviet formed on 27 February 1917.", source: "src_smith_russia", yearStart: 1917, weight: 3, on: "concept:soviets" },
    { from: "event:october-revolution", type: "ASSOCIATED_WITH", to: "concept:soviets", note: "Power passed to the Second Congress of Soviets.", source: "src_ml_rabinowitch_bolsheviks", yearStart: 1917, weight: 2, on: "concept:soviets" },
    { from: "concept:soviets", type: "RELATED_TO", to: "event:paris-commune", note: "Lenin saw both as a state of a new type.", source: "src_state_revolution", basis: "interpretive", on: "concept:soviets" },
    { from: "concept:soviets", type: "RELATED_TO", to: "concept:dictatorship-of-the-proletariat", note: "Lenin's form of the workers' state in 1917.", source: "src_state_revolution", on: "concept:soviets" },
    { from: "concept:soviets", type: "RELATED_TO", to: "concept:general-strike", note: "Grew out of the strike committees of October 1905.", source: "src_ascher_1905", on: "concept:soviets" },
  ],
  excerpts: [
    {
      key: "ml-lenin-development-preface",
      entity: "text:development-of-capitalism-in-russia",
      speaker: "thinker:lenin",
      text: "text:development-of-capitalism-in-russia",
      body: "It seemed to us that it was necessary to examine the whole process of the development of capitalism in Russia, to endeavour to depict it in its entirety.",
      source: "src_ml_lenin_development",
      locator: "Preface to the first edition",
      archiveUrl: "https://www.marxists.org/archive/lenin/works/1899/devel/preface1.htm",
    },
    {
      key: "ml-trotsky-not-a-substitute",
      entity: "thinker:trotsky",
      speaker: "thinker:trotsky",
      body: "The Petersburg Committee would have acted in a qualitatively different way if, every hour and every minute, it had felt it was not a substitute for the proletariat, but its political leader",
      source: "src_ml_trotsky_tasks",
      locator: "Our Political Tasks, chapter 3",
      note: "From Trotsky's criticism of Lenin's organisational methods (1904). The sentence ends with a full stop in the original.",
      archiveUrl: "https://www.marxists.org/archive/trotsky/1904/tasks/ch03.htm",
    },
    {
      key: "ml-trotsky-backward-country",
      entity: "text:results-and-prospects",
      speaker: "thinker:trotsky",
      text: "text:results-and-prospects",
      body: "It is possible for the workers to come to power in an economically backward country sooner than in an advanced country.",
      source: "src_mia_trotsky_results",
      locator: "Chapter 4, “Revolution and the Proletariat”",
      archiveUrl: "https://www.marxists.org/archive/trotsky/1931/tpr/rp04.htm",
    },
    {
      key: "ml-marx-engels-permanent",
      entity: "concept:permanent-revolution",
      speaker: "thinker:marx",
      body: "it is our interest and our task to make the revolution permanent until all the more or less propertied classes have been driven from their ruling positions, until the proletariat has conquered state power",
      source: "src_mia_address_1850",
      locator: "Address of the Central Committee to the Communist League, March 1850",
      note: "Written by Marx and Engels jointly.",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1847/communist-league/1850-ad1.htm",
    },
  ],
};
