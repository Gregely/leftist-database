import type { CorpusBatch } from "../../src/lib/corpus/types";
import { added, reused } from "./sources";

/**
 * Batch m1 — The International after Engels (1883–1914): how Marxism became
 * the doctrine of mass parties, the forms of that doctrine (Engels's last
 * introduction, Kautsky's textbook, Labriola's alternative), the French and
 * British alternatives to German orthodoxy, and the syndicalist challenge
 * of the general strike.
 */
export const batchM1: CorpusBatch = {
  id: "m1",
  title: "The International after Engels: orthodoxy and its rivals",
  sources: [...reused, ...added],
  entities: [
    /* ——— Texts of the orthodoxy ——— */
    {
      key: "text:introduction-class-struggles-in-france",
      title: "Introduction to The Class Struggles in France (1895)",
      fields: {
        yearStart: 1895,
        subtitle: "Engels's last major text",
        originalTitle: "Einleitung zu Karl Marx' „Klassenkämpfe in Frankreich 1848 bis 1850“",
        language: "German",
        form: "essay",
        publicationNote: "Dated 6 March 1895; printed with cuts in April 1895; the full text was published in 1930",
        edition: "MECW vol. 27; the MIA translation follows the cut text of 1895",
        difficulty: "2",
        readingUrl: "https://www.marxists.org/archive/marx/works/1850/class-struggles-france/intro.htm",
        aliases: "Engels's 1895 Introduction\nEngels's political testament",
        summary:
          "Engels's introduction to a new edition of Marx's articles on 1848, written months before his death. It argued that barricade fighting belonged to the past and that the German party's electoral growth was its strongest weapon. Cut at the party's request and quoted selectively, it was later read as Engels's endorsement of a legal road to socialism.",
        body: `In 1895 the Berlin publishers of *Vorwärts* reissued Marx's articles of 1850 as *The Class Struggles in France*. [[thinker:engels]], then seventy-four, wrote an introduction that looked back over half a century.

He began by admitting that he and Marx had misjudged 1848: they had expected the revolution to grow over quickly into a proletarian one, and "history has proved us wrong". Capitalism had still had room to expand across the continent, and the working class had needed decades to form ([[event:revolutions-of-1848]]).[cite:src_mia_engels_1895]

## The argument about tactics

The central part concerns method. Engels argued that the street fight behind barricades, decisive up to 1848, had become antiquated: armies were larger and better armed, cities had been rebuilt with long straight streets, and soldiers no longer saw "the people" behind a barricade. A revolution made by a determined minority at the head of an unprepared mass was no longer possible.[cite:src_mia_engels_1895]

Against this he set the example of the German Social Democratic Party, which had survived the [[event:anti-socialist-laws]] and grown into the largest party by votes. Universal suffrage had become a means of counting forces and of agitation. The governments, he wrote, now feared legality more than the socialists did.[cite:src_mia_engels_1895]

He did not renounce revolution. The text keeps the "right to revolution" and warns that the parties of order might themselves break with legality, in which case the workers would not be bound by it.[cite:src_mia_engels_1895]`,
        context: `Engels wrote while the Reichstag was debating a bill against "subversion" (the *Umsturzvorlage*). The party executive asked him to soften passages that could be used against it, and he agreed to cuts. Before the book appeared, Wilhelm Liebknecht printed extracts in *Vorwärts* that made him look like an unconditional advocate of legality, and Engels protested in letters to Kautsky and Lafargue in early April 1895. He died in August.[cite:src_steger_bernstein][cite:src_steenson_kautsky]

## Two readings

[[thinker:bernstein]] cited the introduction in 1899 as Engels's last word, evidence that Marxism itself had moved towards gradual reform ([[text:preconditions-of-socialism]]). Kautsky and, later, Luxemburg read it as a statement about tactics under particular conditions, not a renunciation of revolution, and blamed the cuts for the misunderstanding. The uncut manuscript was published only in 1930. Historians still disagree about how far Engels's own emphasis had shifted towards the parliamentary road.[cite:src_steger_bernstein][cite:src_salvadori_kautsky][cite:src_kolakowski]`,
      },
      citations: [
        { source: "src_mia_engels_1895", note: "The text as printed in 1895." },
        { source: "src_steger_bernstein", note: "The cuts and Bernstein's use of the text." },
      ],
      flags: [
        { type: "specialist-review", field: "context", note: "Check the publication history: who asked for the cuts (the executive via Richard Fischer), the date of Liebknecht's extracts in Vorwärts (30 March 1895), and the 1930 edition of the uncut text (Ryazanov)." },
      ],
    },
    {
      key: "text:the-class-struggle",
      title: "The Class Struggle (Erfurt Programme)",
      fields: {
        yearStart: 1892,
        subtitle: "Kautsky's commentary on the Erfurt Programme",
        originalTitle: "Das Erfurter Programm in seinem grundsätzlichen Teil erläutert",
        language: "German",
        form: "book",
        publicationNote: "Stuttgart, 1892; English translation by William E. Bohn, Chicago, 1910",
        edition: "trans. W. E. Bohn (Charles H. Kerr, 1910), reprinted",
        difficulty: "1",
        readingUrl: "https://www.marxists.org/archive/kautsky/1892/erfurt/",
        aliases: "Das Erfurter Programm\nThe Erfurt Program\nKautsky's Class Struggle",
        summary:
          "Kautsky's popular explanation of the theoretical part of the SPD's Erfurt Programme. Translated widely and read as the standard statement of Marxism in the parties of the Second International, it presented socialism as the necessary outcome of capitalist development and the party's task as organising the working class to take power.",
        body: `After the [[event:erfurt-programme]] of 1891, [[thinker:kautsky]] explained its first, theoretical part in five chapters: the decline of small production, the proletariat, the capitalist class, the "commonwealth of the future" and the class struggle.[cite:src_mia_kautsky_class_struggle]

The argument runs from economics to politics. Large-scale production drives out the small producer; the propertyless majority grows; crises and insecurity become permanent features of capitalism. Socialism, the common ownership of the means of production, is therefore both necessary and inevitable. The socialist party does not invent the class struggle. Its task is to make the workers conscious of it, to organise them, and to lead the struggle for political power.[cite:src_mia_kautsky_class_struggle][cite:src_steenson_kautsky]

Kautsky was careful about the future society: he refused to draw up blueprints and treated the forms of socialist production as questions that a victorious working class would settle. He also argued that the immediate demands of the programme (democratic rights, labour protection, progressive taxation) were part of the same struggle, not a separate reformist programme.[cite:src_mia_kautsky_class_struggle]`,
        context: `The book appeared just as the SPD emerged from illegality, and it became the commonest introduction to Marxism across Europe and in Russia, where it circulated in translation in the 1890s. Its picture of capitalism moving towards polarisation and crisis was the main target of [[thinker:bernstein]]'s revision a few years later ([[concept:revisionism]]).[cite:src_steenson_kautsky][cite:src_salvadori_kautsky]

Critics on the left later called its confidence in historical necessity fatalistic: if socialism was inevitable, what remained for the party to do but wait and grow? Defenders answer that Kautsky always tied necessity to organisation and political struggle.[cite:src_kolakowski][cite:src_salvadori_kautsky]`,
      },
      citations: [{ source: "src_mia_kautsky_class_struggle" }, { source: "src_steenson_kautsky" }],
    },

    /* ——— Labriola ——— */
    {
      key: "thinker:labriola",
      title: "Antonio Labriola",
      fields: {
        yearStart: 1843,
        yearEnd: 1904,
        subtitle: "1843–1904",
        roles: "Italian philosopher, the first systematic Marxist theorist in Italy",
        birthPlace: "Cassino",
        deathPlace: "Rome",
        summary:
          "A Hegelian-trained professor in Rome who turned to Marxism in his late forties and presented historical materialism as a critical, non-dogmatic method, against both positivist evolutionism and Bernstein's revision.",
        body: `## Life

Labriola studied philosophy in Naples under the Hegelian Bertrando Spaventa and taught moral philosophy and pedagogy at the University of Rome from 1874. He moved from liberalism through radical democracy to socialism around 1889–90, corresponded with [[thinker:engels]] from 1890, and took part in the early Italian socialist movement without taking party office.[cite:src_kolakowski]

## Works

His reputation rests on three long essays: *In Memory of the Communist Manifesto* (1895), *Historical Materialism: A Preliminary Exposition* (1896) and *Talks on Socialism and Philosophy* (1898), written as letters to [[thinker:sorel]] ([[text:essays-on-the-materialist-conception-of-history]]).[cite:src_ml_labriola_essays][cite:src_kolakowski]

## Ideas

Labriola insisted that historical materialism was neither an economic determinism nor a philosophy of history that could be applied like a formula. Economic structure conditions the rest of social life through complex mediations; ideas have their own history; the method has to be tested in concrete historical study. He called the doctrine "critical communism" and the unity of theory and practice a "philosophy of praxis".[cite:src_ml_labriola_essays][cite:src_kolakowski]`,
        context: `Italian socialism in the 1890s drew on positivism and evolutionary biology (Enrico Ferri, Achille Loria), which tended to read Marx as one more theory of natural progress. Labriola wrote against that synthesis, and from 1898–99 against [[thinker:bernstein]]'s revision, which he regarded as a retreat from the method rather than a correction of it ([[concept:revisionism]]).[cite:src_kolakowski]`,
        legacy: `His students and correspondents included Benedetto Croce, who drew opposite conclusions, and Sorel. After 1917 Gramsci took up the expression "philosophy of praxis" and acknowledged Labriola as the one Italian who had developed Marxism as an independent philosophy ([[thinker:gramsci]]).[cite:src_kolakowski][cite:src_bottomore_dictionary]`,
      },
    },
    {
      key: "text:essays-on-the-materialist-conception-of-history",
      title: "Essays on the Materialist Conception of History",
      fields: {
        yearStart: 1895,
        yearEnd: 1898,
        subtitle: "Labriola's three essays on historical materialism",
        originalTitle: "Saggi intorno alla concezione materialistica della storia",
        language: "Italian",
        form: "essay",
        publicationNote: "In memoria del Manifesto dei comunisti (1895); Del materialismo storico (1896); Discorrendo di socialismo e di filosofia (1898)",
        edition: "trans. Charles H. Kerr (1904); Monthly Review Press reprint (1966)",
        difficulty: "3",
        readingUrl: "https://www.marxists.org/archive/labriola/works/al00.htm",
        summary:
          "Labriola's essays presented historical materialism as a critical method rather than a fixed system: the economy conditions social life through many mediations, and the theory must prove itself in historical research.",
        body: `The first essay, written for the fiftieth anniversary of the [[text:communist-manifesto]], treats the Manifesto as the moment when socialism became "critical": a theory of the historical movement of the proletariat rather than a plan for a better society. The second sets out the materialist conception of history against both idealist philosophy of history and crude economic explanation. The third, a series of letters to [[thinker:sorel]], discusses the relation between Marxism and philosophy.[cite:src_ml_labriola_essays][cite:src_kolakowski]

Labriola rejected the idea that ideas, law or religion are mere reflections of economic interest. Social life forms a complex whole, and the "economic structure" is its foundation only in the sense that it sets the conditions within which the other spheres develop, with their own logic and history ([[concept:historical-materialism]]).[cite:src_ml_labriola_essays]`,
        context: `The essays appeared in Italian, French and German in the late 1890s, in the middle of the debates on revisionism and on the "crisis of Marxism" (Masaryk's phrase of 1898). They stand alongside Plekhanov's and Kautsky's writings as one of the three main theoretical statements of Second International Marxism, and the least deterministic of them ([[debate:what-is-historical-materialism]]).[cite:src_kolakowski][cite:src_bottomore_dictionary]`,
      },
    },

    /* ——— German and French leaders ——— */
    {
      key: "thinker:bebel",
      title: "August Bebel",
      fields: {
        yearStart: 1840,
        yearEnd: 1913,
        subtitle: "1840–1913",
        roles: "German turner, socialist parliamentarian and chairman of the Social Democratic Party; author of Woman and Socialism",
        birthPlace: "Deutz, near Cologne",
        deathPlace: "Passugg, Switzerland",
        aliases: "Ferdinand August Bebel",
        summary:
          "A self-educated craftsman who co-founded German social democracy, led it through the Anti-Socialist Laws and chaired it until his death. His Woman and Socialism was the most widely read socialist book of its time.",
        body: `## Life

The son of a Prussian non-commissioned officer, Bebel trained as a wood turner and entered politics through the workers' educational associations of the 1860s. With [[thinker:marx]]'s friend Wilhelm Liebknecht he founded the Social Democratic Workers' Party at Eisenach in 1869. Both opposed the Franco-Prussian war and the annexation of Alsace-Lorraine, and both served two years' fortress imprisonment after the Leipzig treason trial of 1872.[cite:src_ml_maehl_bebel]

He sat in the Reichstag almost continuously from 1867. Under the [[event:anti-socialist-laws]] he was the party's best-known leader and spokesman; from 1892 he was its co-chairman.[cite:src_ml_maehl_bebel][cite:src_lidtke_outlawed]

## Ideas and role

Bebel was a party leader more than a theorist. He accepted the Marxism of [[thinker:kautsky]] and corresponded closely with [[thinker:engels]], and he combined revolutionary language with careful parliamentary and organisational work. He led the party majority against [[thinker:bernstein]]'s revision: the Dresden congress of 1903 condemned revisionism on his motion, and at the [[event:amsterdam-congress]] of 1904 he defended the German party against Jaurès.[cite:src_ml_maehl_bebel][cite:src_joll_second_international]

His most influential work was *Woman and Socialism* (1879), which tied the emancipation of women to the abolition of private property ([[text:woman-and-socialism]]; [[concept:the-woman-question]]).[cite:src_ml_bebel_woman]`,
        context: `Bebel's career spans the transformation of German socialism from small sects into the largest party in the Reichstag (from the elections of 1912). His authority held together a party increasingly divided between reformist trade unionists and parliamentarians and a radical left.[cite:src_schorske_spd]`,
        legacy: `He died in August 1913, a year before the party he had led voted for war credits ([[event:war-credits-1914]]). Historians debate whether his combination of radical rhetoric and cautious practice preserved the party's unity or prepared its accommodation to the German state.[cite:src_schorske_spd][cite:src_ml_maehl_bebel]`,
      },
    },
    {
      key: "thinker:guesde",
      title: "Jules Guesde",
      fields: {
        yearStart: 1845,
        yearEnd: 1922,
        subtitle: "1845–1922",
        roles: "French journalist and socialist leader; founder of the Parti ouvrier and of French Marxism as a party doctrine",
        birthPlace: "Paris",
        deathPlace: "Saint-Mandé",
        aliases: "Jules Bazile\nGuesdists",
        summary:
          "The leader of the first Marxist party in France, the Parti ouvrier, whose programme of 1880 was drafted with Marx. He opposed socialist participation in bourgeois governments until 1914, when he joined the war cabinet.",
        body: `## Life

Born Jules Bazile, Guesde was a republican journalist who took the side of the Paris Commune and spent the 1870s in exile, where he came into contact with anarchists and then with Marxism. In 1877 he founded the weekly *L'Égalité*. In 1880 he went with Paul Lafargue to London, where [[thinker:marx]] dictated the theoretical preamble of the programme of the new Parti ouvrier ([[event:paris-commune]]).[cite:src_ml_stuart_guesdists][cite:src_joll_second_international]

## Ideas

The Guesdists presented Marxism as a clear class doctrine: capitalism would concentrate and polarise society, the working class had to organise as an independent party, and reforms and elections were means of agitation and of counting forces. They distrusted alliances with radical republicans and, after 1899, attacked socialist participation in government ([[concept:ministerialism]]; [[event:millerand-case]]).[cite:src_ml_stuart_guesdists]

Their opponents within French socialism included [[thinker:jaures]] and the independent socialists, the reformist "possibilists" and, from the 1890s, the revolutionary syndicalists, who rejected the party's claim to lead the unions ([[tendency:revolutionary-syndicalism]]).[cite:src_ml_stuart_guesdists][cite:src_ml_jennings_syndicalism]`,
        context: `After the [[event:amsterdam-congress]] of 1904 ordered the French factions to unite, the Guesdists merged with Jaurès's party into the SFIO (1905). Their stronghold was the textile districts of the Nord.[cite:src_joll_second_international][cite:src_ml_stuart_guesdists]`,
        legacy: `In August 1914 Guesde entered the government of national defence as minister of state, the outcome he had denounced in Millerand fifteen years earlier ([[debate:socialists-and-the-war]]). Robert Stuart's study argues that the Guesdists' Marxism was less a doctrine imposed from Germany than an ideology shaped by French working-class experience.[cite:src_haupt_war][cite:src_ml_stuart_guesdists]`,
      },
    },
    {
      key: "thinker:jaures",
      title: "Jean Jaurès",
      fields: {
        yearStart: 1859,
        yearEnd: 1914,
        subtitle: "1859–1914",
        roles: "French philosopher, historian and socialist leader; founder of L'Humanité",
        birthPlace: "Castres",
        deathPlace: "Paris",
        aliases: "Auguste Marie Joseph Jean Léon Jaurès",
        summary:
          "The leading figure of French socialism before 1914: a philosopher and orator who combined Marxism with republican democracy, defended Dreyfus, supported socialist participation in government in 1899, united the French socialists in 1905 and campaigned against war until he was assassinated on its eve.",
        body: `## Life

A student of the École normale supérieure and a philosophy lecturer at Toulouse, Jaurès entered the Chamber of Deputies as a moderate republican in 1885. The miners' strike at Carmaux (1892) brought him to socialism, and he was elected for the district as a socialist in 1893.[cite:src_ml_goldberg_jaures]

He took the side of Alfred Dreyfus in 1898, against those socialists (including Guesde) who regarded the affair as a quarrel within the bourgeoisie. In 1899 he supported the entry of the socialist Alexandre Millerand into a government of "republican defence" ([[event:millerand-case]]). In 1904 he founded the daily *L'Humanité*, and after the [[event:amsterdam-congress]] he joined the Guesdists in the unified SFIO (1905), which he led in practice.[cite:src_ml_goldberg_jaures][cite:src_joll_second_international]

## Ideas

Jaurès argued that socialism completed the French Revolution: the Republic had established political democracy, and socialism would extend it to property and work. He accepted the class struggle and the materialist conception of history, but held that ideals and moral will also move history, and debated the point publicly with Paul Lafargue in 1894–95.[cite:src_ml_goldberg_jaures][cite:src_kolakowski]

He thought of revolution as the work of a democratic majority. "A society takes on a new form only when the immense majority of the individuals who compose it demand or accept a great change," he wrote, which made him sceptical of insurrection and of the syndicalists' general strike, though not of mass action.[cite:src_ml_jaures_studies, "Revolutionary Majorities"][cite:src_ml_jaures_general_strike]

His historical work, the *Socialist History of the French Revolution* (1901–08), and his book on a citizens' army, *L'Armée nouvelle* (1911), belong to the same project.[cite:src_ml_goldberg_jaures]`,
        context: `From the Moroccan crises onwards Jaurès made opposition to war his main cause. In the International he supported proposals for a general strike against war, and in the last week of July 1914 he worked for an international protest until he was shot in Paris on 31 July ([[event:assassination-of-jaures]]; [[concept:general-strike]]).[cite:src_haupt_war][cite:src_ml_goldberg_jaures]`,
        legacy: `Jaurès became the emblem of French democratic socialism, claimed by reformists and by revolutionaries alike. Whether he would have resisted the *union sacrée* of August 1914 is unanswerable; historians note both his anti-war campaign and his attachment to national defence ([[debate:socialists-and-the-war]]).[cite:src_haupt_war][cite:src_ml_goldberg_jaures]`,
      },
    },

    /* ——— Ministerialism ——— */
    {
      key: "concept:ministerialism",
      title: "Ministerialism",
      fields: {
        yearStart: 1899,
        aliases: "Millerandism\nSocialist participation in bourgeois governments",
        summary:
          "The name given around 1900 to the participation of socialists in non-socialist governments. The question, raised by Millerand's entry into the French cabinet in 1899, divided the International between those who saw it as a useful tactic and those who saw it as abandoning the class struggle.",
        brief: `Should a socialist accept a seat in a government that is not socialist? Some said yes: it could protect democracy and win reforms. Others said no: a socialist minister shares responsibility for everything the government does, including sending troops against strikers. The argument broke out in France in 1899 and ran through the Second International.`,
        standard: `In June 1899 the independent socialist Alexandre Millerand joined the French cabinet of Pierre Waldeck-Rousseau, formed to defend the Republic during the Dreyfus affair. The same cabinet included General Galliffet, who had commanded troops in the suppression of the [[event:paris-commune]] ([[event:millerand-case]]).[cite:src_joll_second_international]

[[thinker:jaures]] defended the decision as a defence of the Republic, which socialism needed. [[thinker:guesde]] and Édouard Vaillant answered that a socialist could not share power with the class enemy, and the French movement split over it.[cite:src_ml_goldberg_jaures][cite:src_ml_stuart_guesdists]

The International's Paris congress (1900) adopted a resolution drafted by [[thinker:kautsky]]: participation was a question of tactics, acceptable only as a temporary, exceptional measure in an emergency, with the party's consent. Critics called it the "india-rubber resolution" because each side could read it as it wished. The [[event:amsterdam-congress]] of 1904 took a firmer line against it.[cite:src_joll_second_international][cite:src_salvadori_kautsky]`,
        deep: `The dispute was about more than one cabinet. Behind it lay two views of the state. For Jaurès and the reformists the democratic republic was common ground that socialists could occupy and extend; for the Guesdists, and for Luxemburg, who wrote on the French case in 1899–1900, it remained a class state whose government socialists could not join without becoming responsible for its repression ([[concept:the-state]]; [[debate:what-is-the-state]]).[cite:src_nettl_luxemburg][cite:src_ml_goldberg_jaures]

The question also concerned the meaning of [[concept:revisionism]]. Bernstein's critics saw Millerand as revisionism in practice; his defenders saw a sensible response to French conditions that the German party, with no prospect of office, did not face ([[debate:reform-or-revolution]]).[cite:src_joll_second_international]`,
        history: `The term was current from about 1900 in French and German debate. The issue returned in 1914, when socialists entered war cabinets in France and Belgium, and in 1917, when Mensheviks and Socialist Revolutionaries joined the Russian Provisional Government ([[event:february-revolution]]).[cite:src_haupt_war][cite:src_smith_russia]`,
        criticisms: `Opponents argued that ministers became hostages: Millerand remained in a government whose troops fired on strikers at Chalon-sur-Saône (1900) and Martinique. Supporters argued that refusing office left the workers' interests undefended and the Republic exposed to its enemies.[cite:src_joll_second_international][cite:src_ml_goldberg_jaures]`,
      },
    },
    {
      key: "event:millerand-case",
      title: "The Millerand case",
      fields: {
        yearStart: 1899,
        yearEnd: 1902,
        subtitle: "A socialist enters a French government",
        dateLabel: "22 June 1899 – May 1902",
        place: "Paris",
        eventType: "crisis",
        summary:
          "Alexandre Millerand, an independent socialist deputy, became minister of commerce in Waldeck-Rousseau's government of republican defence, alongside the general who had crushed the Commune. The decision split French socialism and opened the international debate on ministerialism.",
        body: `The Dreyfus affair had divided France between the defenders of the Republic and an anti-Dreyfusard right. When Pierre Waldeck-Rousseau formed a cabinet of "republican defence" in June 1899, he included Millerand at the Ministry of Commerce and General Gaston de Galliffet at the Ministry of War.[cite:src_joll_second_international]

[[thinker:jaures]] supported Millerand's acceptance; [[thinker:guesde]], Vaillant and their followers condemned it in a joint manifesto and broke off the attempt at socialist unity under way that year. Millerand stayed in office until 1902, introducing labour legislation while the government also sent troops against strikers.[cite:src_ml_goldberg_jaures][cite:src_ml_stuart_guesdists]`,
        significance: `The case made "ministerialism" a question for the whole International ([[concept:ministerialism]]). The Paris congress of 1900 adopted Kautsky's compromise, the [[event:amsterdam-congress]] of 1904 condemned the practice more firmly, and the French socialists were told to unite, which they did in 1905. Millerand himself drifted away from socialism and later became President of the Republic (1920–24).[cite:src_joll_second_international][cite:src_salvadori_kautsky]`,
      },
    },
    {
      key: "event:amsterdam-congress",
      title: "Amsterdam Congress of the Second International",
      fields: {
        yearStart: 1904,
        subtitle: "Sixth International Socialist Congress",
        dateLabel: "14–20 August 1904",
        place: "Amsterdam",
        eventType: "congress",
        summary:
          "The congress at which the International adopted the German party's condemnation of revisionism and ministerialism, heard Jaurès and Bebel debate the value of German orthodoxy, and instructed the socialists of each country to form a single party.",
        body: `The congress took the resolution passed by the SPD at Dresden in 1903 and made it the International's position: it condemned revisionist attempts to replace the conquest of power by a policy of accommodation, and rejected socialist participation in bourgeois governments ([[concept:revisionism]]; [[concept:ministerialism]]).[cite:src_joll_second_international]

The most remembered moment was the exchange between [[thinker:jaures]] and [[thinker:bebel]]. Jaurès argued that the German party's revolutionary formulas concealed its lack of real power in a semi-authoritarian state, while the French socialists, working in a republic, had to act. Bebel defended the German model and its intransigence.[cite:src_joll_second_international][cite:src_ml_goldberg_jaures]

A second resolution required the socialists of each country to unite in one party. Rosa Luxemburg, Plekhanov and the Japanese socialist Sen Katayama, who shook hands publicly with Plekhanov during the Russo-Japanese war, were among the delegates ([[thinker:luxemburg]]; [[thinker:plekhanov]]).[cite:src_joll_second_international]`,
        significance: `The French factions merged into the SFIO in April 1905. The congress marked the high point of the orthodox centre's authority; within a few years the questions it had treated as settled (the general strike, colonialism, war) produced new divisions ([[event:stuttgart-congress]]; [[concept:general-strike]]).[cite:src_joll_second_international][cite:src_ml_eley_forging]`,
      },
      flags: [{ type: "specialist-review", field: "body", note: "The vote on the Dresden resolution is not given (sources differ on the national vote count). Add it if a reliable figure is found." }],
    },

    /* ——— Britain ——— */
    {
      key: "tendency:fabianism",
      title: "Fabianism",
      fields: {
        yearStart: 1884,
        periodLabel: "1884 –",
        color: "olive",
        aliases: "Fabian socialism\nFabian Society\nFabians",
        summary:
          "The socialism of the Fabian Society, founded in London in 1884: gradual, democratic and administrative, aiming to bring industry and services under public control by persuading existing parties and institutions rather than by class struggle.",
        body: `The Fabian Society was founded in London in January 1884 by a group that had broken away from a society for ethical self-improvement. It took its name from the Roman general Fabius, known for avoiding pitched battles. Its leading members by the end of the decade were George Bernard Shaw, Sidney Webb, Sydney Olivier, Graham Wallas, Annie Besant and Hubert Bland; Beatrice Potter (Beatrice Webb) joined in the 1890s.[cite:src_ml_mackenzie_fabians]

Fabians held that socialism would come through the gradual extension of public ownership and regulation, especially at municipal level, achieved by democratic means. In the *Fabian Essays* of 1889 Webb set out the conditions: important changes must be democratic, gradual, accepted as moral by the majority and, in Britain at least, "constitutional and peaceful" ([[text:fabian-essays]]).[cite:src_ml_fabian_essays]

Their economics owed more to Jevons and the marginal theory of value than to [[thinker:marx]], and their method was "permeation": influencing Liberals, Conservatives and officials with research, lectures and pamphlets.[cite:src_ml_mackenzie_fabians][cite:src_sassoon_hundred_years]`,
        context: `The Fabians worked beside other British socialists (Hyndman's Social Democratic Federation, Morris's Socialist League, the Independent Labour Party of 1893) and helped found the Labour Representation Committee in 1900, which became the Labour Party in 1906. The Webbs founded the London School of Economics (1895) and wrote the standard histories of British trade unionism, one of which Lenin and Krupskaya translated into Russian in Siberian exile.[cite:src_ml_mackenzie_fabians][cite:src_service_lenin]`,
        criticisms: `[[thinker:william-morris]] objected that municipal reform was not socialism and that the Fabians confused administration with emancipation. Marxists saw in Fabianism the clearest case of [[concept:reformism]]; some historians argue that Bernstein's London years exposed him to Fabian ideas, a link that remains disputed ([[thinker:bernstein]]).[cite:src_ml_thompson_morris][cite:src_gay_bernstein]`,
        legacy: `Fabian ideas of planning and public ownership shaped the Labour Party's 1918 constitution and its later programmes; that history lies beyond this period.[cite:src_sassoon_hundred_years]`,
      },
    },
    {
      key: "text:fabian-essays",
      title: "Fabian Essays in Socialism",
      fields: {
        yearStart: 1889,
        subtitle: "Edited by G. Bernard Shaw",
        language: "English",
        form: "book",
        publicationNote: "London: The Fabian Society, December 1889",
        edition: "Project Gutenberg transcription of the first edition",
        difficulty: "1",
        readingUrl: "https://www.gutenberg.org/ebooks/69088",
        summary:
          "Eight lectures by leading Fabians, published as a book in 1889: the founding statement of gradualist, democratic socialism in Britain.",
        body: `The book collects lectures given in 1888: Shaw on the economic basis of socialism and on the transition, Sidney Webb on its historical basis, William Clarke on industry, Sydney Olivier on morals, Graham Wallas on property under socialism, Annie Besant on industry under socialism and Hubert Bland on the outlook ([[tendency:fabianism]]).[cite:src_ml_fabian_essays]

Webb's essay argued that Britain was already moving towards socialism through factory legislation, municipal services and taxation, and that further change would come the same way. His four conditions for "important organic changes" (democratic, gradual, accepted as moral, constitutional and peaceful) became the Fabian creed.[cite:src_ml_fabian_essays]

Shaw's economic essay builds on the marginal theory of value and Ricardo's theory of rent rather than on Marx's labour theory of value, which Shaw had criticised in the mid-1880s ([[concept:value]]).[cite:src_ml_fabian_essays][cite:src_ml_mackenzie_fabians]`,
        context: `The essays sold out quickly and went through many editions. They gave British socialism a body of argument independent of Marxism and of the anarchist and syndicalist currents of the time. William Morris reviewed them critically in *Commonweal* ([[thinker:william-morris]]).[cite:src_ml_mackenzie_fabians][cite:src_ml_thompson_morris]`,
      },
      flags: [{ type: "incomplete-metadata", note: "The essays' authors (Shaw, Webb, Clarke, Olivier, Besant, Wallas, Bland) have no entries, so no thinker is linked as author. Add entries for Shaw and the Webbs if the collection expands into British socialism." }],
    },
    {
      key: "thinker:william-morris",
      title: "William Morris",
      fields: {
        yearStart: 1834,
        yearEnd: 1896,
        subtitle: "1834–1896",
        roles: "English designer, poet, writer and revolutionary socialist; founder of the Socialist League",
        birthPlace: "Walthamstow, Essex",
        deathPlace: "Hammersmith, London",
        summary:
          "The designer and poet of the Arts and Crafts movement who became a revolutionary socialist in the 1880s. He joined the first British Marxist organisation, founded the Socialist League and wrote News from Nowhere, a vision of a communist society where work has become creative again.",
        body: `## Life

Morris made his name as a poet and as the founder of a decorative-arts firm whose wallpapers, textiles and books revived craft production. His concern with the degradation of work under industrial capitalism, learned from Ruskin, led him to politics: he joined the Democratic Federation in 1883 and read *Capital* in its French translation ([[text:capital-volume-one]]).[cite:src_ml_thompson_morris]

In December 1884 he left with Eleanor Marx, Edward Aveling and Ernest Belfort Bax to found the Socialist League, which [[thinker:engels]] supported, and edited its paper *Commonweal*. He spoke at street corners, was arrested at a free-speech meeting in 1885, and was present at "Bloody Sunday" in Trafalgar Square (13 November 1887), when police and troops dispersed a demonstration.[cite:src_ml_thompson_morris]

## Ideas

Morris argued that capitalism had destroyed the pleasure of useful work and that socialism meant a society in which work became an art again, production served need rather than profit, and the division between town and country disappeared. He opposed parliamentary politics for socialists, fearing that it would turn the movement into a party of reformers ([[concept:reformism]]).[cite:src_ml_thompson_morris]

His utopia, *News from Nowhere* (1890), answered Edward Bellamy's centralised and mechanised future in *Looking Backward* ([[text:news-from-nowhere]]).[cite:src_ml_news_from_nowhere][cite:src_ml_thompson_morris]`,
        context: `By 1890 anarchists controlled the Socialist League, and Morris withdrew to the Hammersmith Socialist Society. In his last years he moved towards cooperation with the other socialist groups and accepted that parliamentary action might be necessary, while keeping his revolutionary aims.[cite:src_ml_thompson_morris]`,
        legacy: `E. P. Thompson's biography (1955) argued that Morris was a Marxist who added to Marxism a moral and aesthetic critique of capitalism; others place him in a romantic tradition of anticapitalism. Both readings agree that he gave British socialism its most developed picture of what an unalienated life might look like ([[concept:alienation]]).[cite:src_ml_thompson_morris]`,
      },
    },
    {
      key: "text:news-from-nowhere",
      title: "News from Nowhere",
      fields: {
        yearStart: 1890,
        subtitle: "or An Epoch of Rest",
        language: "English",
        form: "book",
        publicationNote: "Serialised in Commonweal, January–October 1890; book edition 1891",
        edition: "ed. David Leopold (Oxford World's Classics, 2003)",
        difficulty: "1",
        readingUrl: "https://www.marxists.org/archive/morris/works/1890/nowhere/nowhere.htm",
        summary:
          "Morris's utopian romance: a socialist of the 1880s wakes in a communist England of the future, where money, the state and wage labour have gone, and work has become a pleasure.",
        body: `The narrator, William Guest, falls asleep in Hammersmith after a quarrelsome socialist meeting and wakes in the twenty-first century. He travels up the Thames through a country without money, prisons or central government, where people work because they enjoy it, crafts flourish, the great cities have been thinned out and the countryside is a garden ([[thinker:william-morris]]).[cite:src_ml_news_from_nowhere]

In the chapter "How the Change Came" an old man, Hammond, explains the transition. A massacre of demonstrators in Trafalgar Square begins a civil war, a general strike paralyses the old order, and the workers win after years of struggle. The scene echoes the repression of 1887 that Morris had witnessed.[cite:src_ml_news_from_nowhere]`,
        context: `The book was written partly as a reply to Edward Bellamy's best-selling *Looking Backward* (1888), whose future society is run by an industrial army under a centralised state, which Morris reviewed sceptically in *Commonweal* in 1889. It remains the most widely read English socialist utopia and was translated early into German, with a preface by Wilhelm Liebknecht ([[concept:communism]]).[cite:src_ml_thompson_morris]`,
      },
    },

    /* ——— Syndicalism and the general strike ——— */
    {
      key: "tendency:revolutionary-syndicalism",
      title: "Revolutionary syndicalism",
      fields: {
        yearStart: 1895,
        periodLabel: "1890s –",
        color: "ochre",
        aliases: "Syndicalism\nSyndicalisme révolutionnaire\nAnarcho-syndicalism\nDirect action",
        summary:
          "A labour movement that held that the trade unions, not parties or parliaments, were the instrument of working-class emancipation: through direct action and, finally, a general strike, they would expropriate the capitalists and become the cells of a new society.",
        body: `Revolutionary syndicalism took shape in France in the 1890s, in the Confédération générale du travail (CGT, founded 1895) and the labour exchanges (*bourses du travail*) organised by Fernand Pelloutier. Its activists included former anarchists and dissident socialists such as Victor Griffuelhes and Émile Pouget.[cite:src_ml_jennings_syndicalism]

Its main ideas were:

- the class struggle is fought at the point of production, by strikes, boycotts and sabotage ("direct action"), not by electing representatives;
- the unions must be independent of parties and sects, which divide the workers by opinion when the union unites them by class;
- the general strike will be the revolution itself, after which the unions will run production ([[concept:general-strike]]);
- anti-militarism and anti-patriotism, since armies were used against strikers and in wars between capitalists.

The CGT's congress at Amiens in 1906 set these principles down in the resolution later called the Charter of Amiens ([[event:charter-of-amiens]]).[cite:src_ml_jennings_syndicalism]`,
        context: `Similar movements grew elsewhere before 1914: the Industrial Workers of the World in the United States (1905), the CNT in Spain (1910), the Unione Sindacale Italiana (1912) and a syndicalist current in British trade unionism around Tom Mann ([[event:iww-founding]]). Intellectuals outside the unions, above all [[thinker:sorel]], wrote its theory, though the activists did not always recognise themselves in it.[cite:src_ml_jennings_syndicalism][cite:src_ml_eley_forging]`,
        criticisms: `Social democrats answered that the unions represented only part of the working class and could not take political power; Luxemburg and Kautsky argued that a general strike could not be decreed by a union congress ([[thinker:luxemburg]]; [[debate:the-general-strike]]). Anarchist critics such as Malatesta warned that unions tend to become conservative bodies defending their members' interests.[cite:src_nettl_luxemburg][cite:src_marshall_anarchism]`,
        legacy: `In 1914 the CGT, like the socialist parties, rallied to national defence. Syndicalist ideas survived in the workers' councils and factory occupations of 1917–20 and in Spanish anarcho-syndicalism, which lie outside this period ([[tendency:anarchism]]).[cite:src_ml_jennings_syndicalism][cite:src_haupt_war]`,
      },
    },
    {
      key: "thinker:sorel",
      title: "Georges Sorel",
      fields: {
        yearStart: 1847,
        yearEnd: 1922,
        subtitle: "1847–1922",
        roles: "French engineer and social theorist; the best-known theorist of revolutionary syndicalism",
        birthPlace: "Cherbourg",
        deathPlace: "Boulogne-sur-Seine",
        summary:
          "A retired civil engineer who turned to social theory in his forties, criticised the determinism of party Marxism and argued that the workers' movement needed the 'myth' of the general strike and the moral energy of class conflict.",
        body: `## Life

Sorel trained at the École polytechnique and worked as an engineer in the state bridges and roads service until 1892, when he retired to write. He came to Marxism through the debates of the 1890s, corresponded with [[thinker:labriola]] and the Italian Marxists, and edited reviews in which the "crisis of Marxism" was argued out.[cite:src_ml_sorel_reflections][cite:src_kolakowski]

## Ideas

Sorel accepted Bernstein's criticism of Marxist determinism ([[concept:revisionism]]) but drew the opposite conclusion: socialism would not come from economic necessity or parliamentary reform, but from the will and solidarity of workers organised in their unions ([[tendency:revolutionary-syndicalism]]).[cite:src_kolakowski][cite:src_ml_jennings_syndicalism]

In *Reflections on Violence* (1908) he described the general strike as a "myth": an image that gathers the feelings of the working class and moves it to act, whose value lies in its power to mobilise rather than in its accuracy as a forecast ([[text:reflections-on-violence]]; [[concept:general-strike]]).[cite:src_ml_sorel_reflections]`,
        context: `Sorel wrote at a distance from the CGT: its leaders read him little, and he was associated mainly with a group of intellectuals around Hubert Lagardelle's review *Le Mouvement socialiste*. His other works of the period include *The Decomposition of Marxism* and *The Illusions of Progress* (both 1908).[cite:src_ml_jennings_syndicalism]`,
        legacy: `After 1908 Sorel's disappointment with syndicalism led him briefly towards French nationalists (the Cercle Proudhon, 1911); after 1917 he praised Lenin. Readers as different as Italian fascists and Gramsci later drew on him. That reception lies outside this corpus and is often read back into his earlier work; Jennings's edition warns against doing so.[cite:src_ml_sorel_reflections][cite:src_kolakowski]`,
      },
      flags: [{ type: "disputed", field: "legacy", note: "Sorel's influence on fascism is contested and post-1917; the entry mentions it only as later reception. A specialist should check the wording." }],
    },
    {
      key: "text:reflections-on-violence",
      title: "Reflections on Violence",
      fields: {
        yearStart: 1908,
        originalTitle: "Réflexions sur la violence",
        language: "French",
        form: "book",
        publicationNote: "Articles in Le Mouvement socialiste, 1906; book Paris, 1908; English translation by T. E. Hulme, 1914",
        edition: "ed. Jeremy Jennings (Cambridge University Press, 1999)",
        difficulty: "3",
        summary:
          "Sorel's argument that the proletariat should reject parliamentary socialism and cultivate the 'myth' of the general strike and the moral discipline of class war.",
        body: `The book contrasts two kinds of power. The "force" of the state imposes the rule of a minority; proletarian "violence", by which Sorel meant the open conflict of strikes and refusal, breaks with that order and keeps the classes apart. Parliamentary socialism, he argued, softens the conflict and turns workers' leaders into politicians ([[tendency:revolutionary-syndicalism]]).[cite:src_ml_sorel_reflections]

The general strike is presented as a "myth": a body of images capable of evoking the sentiments of a whole movement, which cannot be refuted by showing that events will not happen exactly as imagined. Sorel compared it to the early Christians' expectation of the end of the world ([[concept:general-strike]]).[cite:src_ml_sorel_reflections][cite:src_kolakowski]`,
        context: `Written during the strike waves of 1906 and the clashes between the CGT and the Clemenceau government, the book had little effect on French unions but a large one on intellectuals across Europe. No online transcription of the text is used here; the summary follows Jennings's edition and introduction.[cite:src_ml_sorel_reflections][cite:src_ml_jennings_syndicalism]`,
      },
    },
    {
      key: "concept:general-strike",
      title: "General strike",
      fields: {
        yearStart: 1832,
        aliases: "Mass strike\nPolitical strike\nGrève générale\nMassenstreik\nGrand National Holiday",
        summary:
          "A stoppage of work across many industries at once, imagined from the 1830s as the means by which workers could overthrow capitalism without barricades. Between 1890 and 1914 socialists argued over whether it was a revolution in itself, a political weapon, a defence against war, or a dangerous illusion.",
        brief: `If workers everywhere stopped work at the same moment, the whole economy would halt. Some socialists thought that this would be enough to bring down capitalism. Others thought it a fantasy, or useful only for limited aims such as winning the vote. Real general strikes in Belgium, Sweden and Russia between 1893 and 1905 put the idea to the test.`,
        standard: `The idea goes back to William Benbow's "Grand National Holiday" (1832) and the Chartists' "sacred month". In the First International the Bakuninists adopted it as the means of social revolution, and [[thinker:engels]] criticised them for it in 1873.[cite:src_marshall_anarchism]

In the Second International the question returned in three forms. For the revolutionary syndicalists the general strike would be the revolution itself, the final act of a class struggle prepared by everyday direct action ([[tendency:revolutionary-syndicalism]]; [[event:charter-of-amiens]]). General strikes for universal suffrage in Belgium (1893, 1902, 1913) and Sweden (1902), and the Russian general strike of October 1905, showed what a limited, political mass strike could do ([[event:revolution-1905]]). And Dutch, French and British socialists proposed that the International answer a declaration of war with a general strike ([[event:stuttgart-congress]]).[cite:src_joll_second_international][cite:src_ml_jennings_syndicalism]`,
        deep: `The German party first rejected the general strike as anarchist. After 1905 it accepted the "political mass strike" as a defensive weapon in principle (Jena, 1905), but in 1906, at Mannheim, it conceded that the trade unions could not be committed without their consent.[cite:src_schorske_spd]

Luxemburg drew a different lesson from Russia: the mass strike was not a technique that leaders could call or forbid but the form a revolutionary period takes, a long wave of economic and political strikes in which the masses organise themselves ([[text:the-mass-strike]]; [[concept:spontaneity]]). In 1910, during the campaign for equal suffrage in Prussia, she urged the SPD to use it; Kautsky answered with a "strategy of attrition" that avoided a decisive confrontation, and the two broke ([[thinker:luxemburg]]; [[thinker:kautsky]]).[cite:src_nettl_luxemburg][cite:src_schorske_spd][cite:src_mia_luxemburg_mass_strike]

[[thinker:sorel]] moved the question onto different ground by calling the general strike a "myth", valuable for the action it inspired whatever its practical prospects ([[text:reflections-on-violence]]). [[thinker:jaures]] answered that a general strike could succeed only if it expressed the will of the majority, and could not replace democratic politics.[cite:src_ml_sorel_reflections][cite:src_ml_jaures_general_strike]`,
        history: `The war of 1914 settled the question of the anti-war general strike negatively: no party attempted one. Mass strikes nevertheless opened the revolutions of February 1917 in Petrograd and of 1918 in Germany ([[event:february-revolution]]).[cite:src_haupt_war][cite:src_smith_russia]`,
        interpretations: `The debate is set out in [[debate:the-general-strike]]. Historians distinguish the syndicalist "expropriating" general strike, the limited political strike and Luxemburg's mass strike as process; contemporaries often used the words interchangeably.[cite:src_joll_second_international][cite:src_nettl_luxemburg]`,
        criticisms: `Union leaders feared that a failed general strike would destroy organisations built over decades; Marxists in the Engels tradition argued that a working class strong enough to win a general strike would be strong enough to take power by other means, and that one too weak to do so would be defeated in the strike.[cite:src_schorske_spd][cite:src_joll_second_international]`,
      },
    },
    {
      key: "event:charter-of-amiens",
      title: "Charter of Amiens",
      fields: {
        yearStart: 1906,
        subtitle: "Resolution of the CGT congress at Amiens",
        dateLabel: "8–16 October 1906",
        place: "Amiens, France",
        eventType: "congress",
        summary:
          "The resolution of the French CGT's congress at Amiens that defined revolutionary syndicalism: the unions would fight for daily improvements and prepare complete emancipation through the general strike, independently of all political parties.",
        body: `The CGT met at Amiens the year after the French socialists had united in the SFIO and a few months after the campaign for the eight-hour day of 1 May 1906. A Guesdist motion proposed regular cooperation with the socialist party; the congress rejected it and adopted instead a text presented by the confederation's secretary, Victor Griffuelhes ([[thinker:guesde]]).[cite:src_ml_jennings_syndicalism]

The resolution recognised the class struggle and gave the unions a double task: to win immediate improvements such as shorter hours and higher wages, and to prepare "complete emancipation", which would be achieved by the expropriation of the capitalists through the general strike. The union, now a body of resistance, would later be the unit of production and distribution. Members remained free to take part in politics outside the union, but the CGT would have no ties to parties or sects ([[concept:general-strike]]).[cite:src_ml_jennings_syndicalism]`,
        significance: `The Charter became the reference text of [[tendency:revolutionary-syndicalism]] and of the French doctrine of union independence, which outlasted syndicalism itself. It also fixed a division of labour between French socialists and trade unionists that differed sharply from the German model, where the party and the "free" unions worked closely together ([[tendency:social-democracy]]).[cite:src_ml_jennings_syndicalism][cite:src_ml_eley_forging]`,
      },
      flags: [{ type: "missing-source", field: "body", note: "No checkable online text of the Charter was found; the summary follows Jennings. Add the French text from a printed collection (for example the CGT congress report of 1906) and check the vote (often given as 830 to 8)." }],
    },
    {
      key: "event:iww-founding",
      title: "Founding of the Industrial Workers of the World",
      fields: {
        yearStart: 1905,
        subtitle: "The IWW (“Wobblies”)",
        dateLabel: "27 June – 8 July 1905",
        place: "Chicago",
        eventType: "founding",
        summary:
          "A convention in Chicago founded a revolutionary union that aimed to organise all workers, skilled and unskilled, by industry rather than by craft, and to replace capitalism through industrial organisation.",
        body: `The convention brought together the Western Federation of Miners, socialists and anarchists. Its chairman was the miners' leader William D. Haywood; Eugene V. Debs of the Socialist Party, Daniel De Leon of the Socialist Labor Party, Mary "Mother" Jones and Lucy Parsons, widow of one of the Haymarket defendants, were among the delegates ([[event:haymarket]]).[cite:src_ml_dubofsky_iww]

The preamble adopted at Chicago declared that the working class and the employing class had nothing in common and called for workers to organise as a class, by industry, to take possession of the means of production. Against the craft unions of the American Federation of Labor, the IWW admitted immigrants, women, Black workers and the unskilled.[cite:src_ml_dubofsky_iww]`,
        significance: `The IWW soon split: Debs withdrew, and in 1908 De Leon's political faction was expelled, leaving a movement committed to direct action and close to [[tendency:revolutionary-syndicalism]]. It led large strikes among textile workers (Lawrence, 1912), miners and migrant labourers before federal raids and prosecutions in 1917–18 broke much of it. Its ideas of industrial unionism travelled to Australia, Britain and Ireland, where [[thinker:connolly]] organised for it.[cite:src_ml_dubofsky_iww][cite:src_ml_nevin_connolly]`,
      },
      flags: [{ type: "missing-source", field: "body", note: "The preamble is paraphrased, not quoted: no checkable online transcription was available. Quote it from a printed source (Kornbluh, Rebel Voices, 1964) if wanted." }],
    },

    /* ——— Debate ——— */
    {
      key: "debate:the-general-strike",
      title: "What is the general strike for?",
      fields: {
        summary:
          "Could workers overthrow capitalism by stopping work? Syndicalists said yes; German union leaders feared losing everything; Luxemburg saw the mass strike as the form of a revolutionary period; Sorel called it a myth; Jaurès tied it to the will of the majority.",
        intro:
          "Between the 1890s and 1914 the general strike divided the International more sharply than almost any other tactic, because it raised the question of who leads the working class: the party, the unions or the masses themselves.",
        body: `The idea of a universal stoppage of work was old ([[concept:general-strike]]). What made it urgent after 1890 was the growth of mass unions and the experience of political strikes: in Belgium and Sweden for the vote, and in Russia in 1905, where an October general strike forced the tsar to grant a constitution ([[event:revolution-1905]]).[cite:src_joll_second_international][cite:src_ascher_1905]

The positions below do not divide simply into reformist and revolutionary. German union leaders and Kautsky were both wary of the general strike for different reasons; Jaurès supported strikes against war but distrusted the insurrectionary strike; Luxemburg rejected both the syndicalist version and the union veto.[cite:src_schorske_spd][cite:src_nettl_luxemburg]`,
        context: `The debate culminated in the SPD between Jena (1905) and Mannheim (1906), in the French CGT at Amiens (1906), and in the International's discussions of an anti-war strike at Stuttgart (1907), Copenhagen (1910) and in July 1914 ([[event:charter-of-amiens]]; [[event:stuttgart-congress]]).[cite:src_schorske_spd][cite:src_haupt_war]`,
      },
    },
  ],
  relationships: [
    // Engels's introduction
    { from: "thinker:engels", type: "WROTE", to: "text:introduction-class-struggles-in-france", note: "Dated 6 March 1895.", source: "src_mia_engels_1895", yearStart: 1895, weight: 3, on: "text:introduction-class-struggles-in-france" },
    { from: "thinker:bernstein", type: "CITES", to: "text:introduction-class-struggles-in-france", note: "Invoked it in 1899 as Engels's endorsement of the legal road.", source: "src_steger_bernstein", yearStart: 1899, on: "text:introduction-class-struggles-in-france" },
    { from: "text:introduction-class-struggles-in-france", type: "DISCUSSES", to: "concept:revolution", note: "Argues that barricade insurrection is obsolete and that electoral growth is the party's strength.", source: "src_mia_engels_1895", on: "text:introduction-class-struggles-in-france" },
    { from: "text:introduction-class-struggles-in-france", type: "DISCUSSES", to: "event:revolutions-of-1848", note: "Looks back on 1848 and admits that he and Marx misjudged it.", source: "src_mia_engels_1895", on: "text:introduction-class-struggles-in-france" },
    { from: "text:introduction-class-struggles-in-france", type: "RELATED_TO", to: "debate:reform-or-revolution", note: "Both sides of the revisionism dispute claimed it.", source: "src_steger_bernstein", basis: "interpretive", on: "text:introduction-class-struggles-in-france" },
    // Kautsky's Class Struggle
    { from: "thinker:kautsky", type: "WROTE", to: "text:the-class-struggle", note: "Commentary on the Erfurt Programme's theoretical part.", source: "src_mia_kautsky_class_struggle", yearStart: 1892, weight: 3, on: "text:the-class-struggle" },
    { from: "text:the-class-struggle", type: "DISCUSSES", to: "event:erfurt-programme", note: "Explains the programme he had drafted.", source: "src_steenson_kautsky", on: "text:the-class-struggle" },
    { from: "text:the-class-struggle", type: "DISCUSSES", to: "concept:class-struggle", note: "Its final chapter.", source: "src_mia_kautsky_class_struggle", on: "text:the-class-struggle" },
    { from: "text:the-class-struggle", type: "INFLUENCED", to: "tendency:social-democracy", note: "The standard introduction to Marxism in the parties of the International.", source: "src_steenson_kautsky", weight: 2, on: "text:the-class-struggle" },
    { from: "thinker:bernstein", type: "CRITIQUED", to: "text:the-class-struggle", note: "Revisionism attacked its picture of polarisation and crisis.", source: "src_gay_bernstein", basis: "interpretive", on: "text:the-class-struggle" },
    // Labriola
    { from: "thinker:labriola", type: "WROTE", to: "text:essays-on-the-materialist-conception-of-history", note: "Three essays, 1895–98.", source: "src_ml_labriola_essays", yearStart: 1895, weight: 3, on: "thinker:labriola" },
    { from: "thinker:labriola", type: "MEMBER_OF", to: "tendency:marxism", note: "The first systematic Marxist theorist in Italy.", source: "src_kolakowski", on: "thinker:labriola" },
    { from: "thinker:labriola", type: "ASSOCIATED_WITH", to: "thinker:engels", note: "Correspondents from 1890.", source: "src_kolakowski", yearStart: 1890, on: "thinker:labriola" },
    { from: "thinker:labriola", type: "INFLUENCED", to: "thinker:sorel", note: "The 1898 essay was written as letters to Sorel.", source: "src_kolakowski", yearStart: 1898, on: "thinker:labriola" },
    { from: "thinker:labriola", type: "CRITIQUED", to: "thinker:bernstein", note: "Rejected revisionism as a retreat from the method.", source: "src_kolakowski", yearStart: 1899, on: "thinker:labriola" },
    { from: "thinker:labriola", type: "DEVELOPED", to: "concept:praxis", note: "Spoke of a \"philosophy of praxis\".", source: "src_kolakowski", on: "thinker:labriola" },
    { from: "thinker:labriola", type: "INFLUENCED", to: "thinker:gramsci", note: "Gramsci took up the phrase \"philosophy of praxis\" and acknowledged Labriola (later reception, after 1917).", source: "src_bottomore_dictionary", basis: "interpretive", on: "thinker:labriola" },
    { from: "text:essays-on-the-materialist-conception-of-history", type: "DISCUSSES", to: "concept:historical-materialism", note: "A non-deterministic exposition.", source: "src_ml_labriola_essays", on: "text:essays-on-the-materialist-conception-of-history" },
    { from: "text:essays-on-the-materialist-conception-of-history", type: "RELATED_TO", to: "debate:what-is-historical-materialism", note: "One of the three main statements of Second International Marxism.", source: "src_kolakowski", basis: "interpretive", on: "text:essays-on-the-materialist-conception-of-history" },
    // Bebel
    { from: "thinker:bebel", type: "MEMBER_OF", to: "tendency:social-democracy", note: "Co-founder (1869) and chairman of the SPD.", source: "src_ml_maehl_bebel", weight: 3, on: "thinker:bebel" },
    { from: "thinker:bebel", type: "PARTICIPATED_IN", to: "event:anti-socialist-laws", note: "Led the party through the years of illegality.", source: "src_lidtke_outlawed", on: "thinker:bebel" },
    { from: "thinker:bebel", type: "ASSOCIATED_WITH", to: "thinker:engels", note: "Close correspondents.", source: "src_ml_maehl_bebel", on: "thinker:bebel" },
    { from: "thinker:bebel", type: "CRITIQUED", to: "concept:revisionism", note: "The Dresden resolution (1903) condemning revisionism was his.", source: "src_ml_maehl_bebel", yearStart: 1903, on: "thinker:bebel" },
    { from: "thinker:bebel", type: "PARTICIPATED_IN", to: "event:amsterdam-congress", note: "Debated Jaurès.", source: "src_joll_second_international", yearStart: 1904, on: "thinker:bebel" },
    // Guesde and Jaurès
    { from: "thinker:guesde", type: "MEMBER_OF", to: "tendency:marxism", note: "Founder of the Parti ouvrier.", source: "src_ml_stuart_guesdists", weight: 2, on: "thinker:guesde" },
    { from: "thinker:guesde", type: "ASSOCIATED_WITH", to: "thinker:marx", note: "Marx dictated the preamble of the Parti ouvrier's 1880 programme.", source: "src_ml_stuart_guesdists", yearStart: 1880, on: "thinker:guesde" },
    { from: "thinker:guesde", type: "REJECTED", to: "concept:ministerialism", note: "Condemned Millerand's entry in 1899 — and joined the war cabinet in 1914.", source: "src_ml_stuart_guesdists", yearStart: 1899, on: "thinker:guesde" },
    { from: "thinker:guesde", type: "CONTRASTS_WITH", to: "thinker:jaures", note: "Rivals for the leadership of French socialism; united in the SFIO in 1905.", source: "src_ml_goldberg_jaures", weight: 2, on: "thinker:guesde" },
    { from: "thinker:guesde", type: "PARTICIPATED_IN", to: "event:amsterdam-congress", note: "Supported the Dresden resolution.", source: "src_joll_second_international", on: "thinker:guesde" },
    { from: "thinker:jaures", type: "MEMBER_OF", to: "tendency:social-democracy", note: "Leader of the SFIO.", source: "src_ml_goldberg_jaures", weight: 2, on: "thinker:jaures" },
    { from: "thinker:jaures", type: "PARTICIPATED_IN", to: "event:millerand-case", note: "Defended Millerand's entry into the cabinet.", source: "src_ml_goldberg_jaures", yearStart: 1899, on: "thinker:jaures" },
    { from: "thinker:jaures", type: "PARTICIPATED_IN", to: "event:amsterdam-congress", note: "Debated Bebel.", source: "src_joll_second_international", yearStart: 1904, on: "thinker:jaures" },
    { from: "thinker:jaures", type: "RESPONDED_TO", to: "thinker:bebel", note: "At Amsterdam he argued that German orthodoxy masked powerlessness.", source: "src_joll_second_international", yearStart: 1904, on: "thinker:jaures" },
    { from: "thinker:jaures", type: "ASSOCIATED_WITH", to: "concept:ministerialism", note: "Its best-known defender.", source: "src_ml_goldberg_jaures", on: "thinker:jaures" },
    { from: "thinker:jaures", type: "CRITIQUED", to: "concept:general-strike", note: "Doubted the insurrectionary general strike; supported strikes against war.", source: "src_ml_jaures_general_strike", basis: "interpretive", on: "thinker:jaures" },
    // Ministerialism, Millerand, Amsterdam
    { from: "event:millerand-case", type: "ASSOCIATED_WITH", to: "concept:ministerialism", note: "The case that named the question.", source: "src_joll_second_international", weight: 3, on: "event:millerand-case" },
    { from: "event:millerand-case", type: "PRECEDES", to: "event:amsterdam-congress", note: "The International ruled on it in 1900 and 1904.", source: "src_joll_second_international", on: "event:millerand-case" },
    { from: "concept:ministerialism", type: "RELATED_TO", to: "concept:revisionism", note: "Its critics called it revisionism in practice.", source: "src_joll_second_international", on: "concept:ministerialism" },
    { from: "concept:ministerialism", type: "RELATED_TO", to: "debate:reform-or-revolution", note: "A practical form of the question.", source: "src_joll_second_international", basis: "interpretive", on: "concept:ministerialism" },
    { from: "thinker:luxemburg", type: "CRITIQUED", to: "concept:ministerialism", note: "Wrote against the French experiment in 1899–1900.", source: "src_nettl_luxemburg", yearStart: 1899, on: "concept:ministerialism" },
    { from: "thinker:kautsky", type: "ASSOCIATED_WITH", to: "concept:ministerialism", note: "Drafted the Paris congress compromise (1900).", source: "src_salvadori_kautsky", yearStart: 1900, on: "concept:ministerialism" },
    { from: "event:second-international", type: "PRECEDES", to: "event:amsterdam-congress", note: "The sixth congress of the International founded in 1889.", source: "src_joll_second_international", on: "event:amsterdam-congress" },
    { from: "event:amsterdam-congress", type: "ASSOCIATED_WITH", to: "concept:revisionism", note: "Condemned it in the International's name.", source: "src_joll_second_international", on: "event:amsterdam-congress" },
    // Fabians and Morris
    { from: "text:fabian-essays", type: "MEMBER_OF", to: "tendency:fabianism", note: "Its founding statement.", source: "src_ml_mackenzie_fabians", weight: 3, on: "text:fabian-essays" },
    { from: "tendency:fabianism", type: "DEVELOPED", to: "concept:reformism", note: "Gradualism as a doctrine.", source: "src_ml_mackenzie_fabians", on: "tendency:fabianism" },
    { from: "tendency:fabianism", type: "CONTRASTS_WITH", to: "tendency:marxism", note: "Rejected the labour theory of value and the class-struggle strategy.", source: "src_ml_mackenzie_fabians", on: "tendency:fabianism" },
    { from: "tendency:fabianism", type: "INFLUENCED", to: "thinker:bernstein", note: "Bernstein lived in London 1888–1901; the extent of Fabian influence on his revision is disputed.", source: "src_gay_bernstein", basis: "interpretive", on: "tendency:fabianism", flag: { type: "uncertain-relationship", note: "Gay emphasises Bernstein's own development; check the weight given to Fabian influence." } },
    { from: "thinker:william-morris", type: "WROTE", to: "text:news-from-nowhere", note: "Serialised in Commonweal, 1890.", source: "src_ml_news_from_nowhere", yearStart: 1890, weight: 3, on: "thinker:william-morris" },
    { from: "thinker:william-morris", type: "CRITIQUED", to: "tendency:fabianism", note: "Reviewed the Fabian Essays critically; rejected municipal reform as socialism.", source: "src_ml_thompson_morris", yearStart: 1890, on: "thinker:william-morris" },
    { from: "thinker:william-morris", type: "ASSOCIATED_WITH", to: "thinker:engels", note: "Engels backed the Socialist League in its first years.", source: "src_ml_thompson_morris", yearStart: 1885, on: "thinker:william-morris" },
    { from: "thinker:william-morris", type: "INFLUENCED_BY", to: "text:capital-volume-one", note: "Read it in French in 1883.", source: "src_ml_thompson_morris", yearStart: 1883, on: "thinker:william-morris" },
    { from: "text:news-from-nowhere", type: "DISCUSSES", to: "concept:communism", note: "A picture of a society without money, state or wage labour.", source: "src_ml_news_from_nowhere", on: "text:news-from-nowhere" },
    { from: "text:news-from-nowhere", type: "DISCUSSES", to: "concept:alienation", note: "Work restored as pleasure and art.", source: "src_ml_thompson_morris", basis: "interpretive", on: "text:news-from-nowhere" },
    // Syndicalism and the general strike
    { from: "tendency:revolutionary-syndicalism", type: "DEVELOPED", to: "concept:general-strike", note: "The general strike as the revolution itself.", source: "src_ml_jennings_syndicalism", weight: 3, on: "tendency:revolutionary-syndicalism" },
    { from: "tendency:revolutionary-syndicalism", type: "CONTRASTS_WITH", to: "tendency:social-democracy", note: "Unions independent of parties; direct action against parliamentary politics.", source: "src_ml_jennings_syndicalism", on: "tendency:revolutionary-syndicalism" },
    { from: "tendency:revolutionary-syndicalism", type: "ASSOCIATED_WITH", to: "tendency:anarchism", note: "Many of its activists were former anarchists.", source: "src_marshall_anarchism", on: "tendency:revolutionary-syndicalism" },
    { from: "event:charter-of-amiens", type: "ASSOCIATED_WITH", to: "tendency:revolutionary-syndicalism", note: "Its founding text.", source: "src_ml_jennings_syndicalism", weight: 3, on: "event:charter-of-amiens" },
    { from: "event:charter-of-amiens", type: "ASSOCIATED_WITH", to: "concept:general-strike", note: "Named the general strike as the means of emancipation.", source: "src_ml_jennings_syndicalism", on: "event:charter-of-amiens" },
    { from: "event:iww-founding", type: "ASSOCIATED_WITH", to: "tendency:revolutionary-syndicalism", note: "After 1908 the American form of syndicalism.", source: "src_ml_dubofsky_iww", on: "event:iww-founding" },
    { from: "event:haymarket", type: "PRECEDES", to: "event:iww-founding", note: "Lucy Parsons, widow of a Haymarket defendant, was a founding delegate.", source: "src_ml_dubofsky_iww", on: "event:iww-founding" },
    { from: "thinker:sorel", type: "WROTE", to: "text:reflections-on-violence", note: "1906 articles, 1908 book.", source: "src_ml_sorel_reflections", yearStart: 1908, weight: 3, on: "thinker:sorel" },
    { from: "thinker:sorel", type: "ASSOCIATED_WITH", to: "tendency:revolutionary-syndicalism", note: "Its best-known theorist, though outside the unions.", source: "src_ml_jennings_syndicalism", on: "thinker:sorel" },
    { from: "thinker:sorel", type: "DEVELOPED", to: "concept:general-strike", note: "The general strike as a mobilising \"myth\".", source: "src_ml_sorel_reflections", on: "thinker:sorel" },
    { from: "thinker:sorel", type: "CRITIQUED", to: "concept:reformism", note: "Parliamentary socialism blunts the class conflict.", source: "src_ml_sorel_reflections", on: "thinker:sorel" },
    { from: "thinker:sorel", type: "RESPONDED_TO", to: "concept:revisionism", note: "Accepted Bernstein's critique of determinism, drew revolutionary conclusions.", source: "src_kolakowski", basis: "interpretive", on: "thinker:sorel" },
    { from: "concept:general-strike", type: "RELATED_TO", to: "text:the-mass-strike", note: "Luxemburg's account of the mass strike as process.", source: "src_mia_luxemburg_mass_strike", on: "concept:general-strike" },
    { from: "concept:general-strike", type: "RELATED_TO", to: "concept:spontaneity", note: "Can leaders call a mass strike?", source: "src_nettl_luxemburg", basis: "interpretive", on: "concept:general-strike" },
    { from: "thinker:luxemburg", type: "DEVELOPED", to: "concept:general-strike", note: "The mass strike as the form of a revolutionary period (1906).", source: "src_mia_luxemburg_mass_strike", yearStart: 1906, on: "concept:general-strike" },
    { from: "event:revolution-1905", type: "INFLUENCED", to: "concept:general-strike", note: "The October general strike forced a constitution.", source: "src_ascher_1905", on: "concept:general-strike" },
    { from: "debate:the-general-strike", type: "RELATED_TO", to: "debate:spontaneity-and-organisation", note: "Who leads: party, unions or masses?", source: "src_nettl_luxemburg", basis: "interpretive", on: "debate:the-general-strike" },
    { from: "debate:the-general-strike", type: "RELATED_TO", to: "concept:general-strike", note: "The debate on the concept.", source: "src_joll_second_international", on: "debate:the-general-strike" },
  ],
  excerpts: [
    {
      key: "ml-engels-irony-of-history",
      entity: "text:introduction-class-struggles-in-france",
      speaker: "thinker:engels",
      text: "text:introduction-class-struggles-in-france",
      body: "The irony of history turns everything upside down. We, the “revolutionists,” the “upsetters,” we thrive much better with legal than with illegal means in forcing an overthrow.",
      source: "src_mia_engels_1895",
      locator: "Introduction (1895)",
      note: "From the text as printed in 1895. Other translations read “the irony of world history”.",
      archiveUrl: "https://www.marxists.org/archive/marx/works/1850/class-struggles-france/intro.htm",
    },
    {
      key: "ml-labriola-critical-communism",
      entity: "text:essays-on-the-materialist-conception-of-history",
      speaker: "thinker:labriola",
      text: "text:essays-on-the-materialist-conception-of-history",
      body: "Critical communism – that is its true name, and there is none more exact for this doctrine – did not take its stand with the feudalists in regretting the old society for the sake of criticising by contrast the contemporary society – it had an eye only to the future.",
      source: "src_ml_labriola_essays",
      locator: "In Memory of the Communist Manifesto",
      note: "Kerr's 1904 translation.",
      archiveUrl: "https://www.marxists.org/archive/labriola/works/al00.htm",
    },
    {
      key: "ml-webb-organic-changes",
      entity: "text:fabian-essays",
      text: "text:fabian-essays",
      body: "important organic changes can only be (1) democratic, and thus acceptable to a majority of the people, and prepared for in the minds of all; (2) gradual, and thus causing no dislocation, however rapid may be the rate of progress; (3) not regarded as immoral by the mass of the people, and thus not subjectively demoralizing to them; and (4) in this country at any rate, constitutional and peaceful.",
      source: "src_ml_fabian_essays",
      locator: "Sidney Webb, “Historic”",
      note: "The sentence begins: “All students of society who are abreast of their time, Socialists as well as Individualists, realize that…”.",
      archiveUrl: "https://www.gutenberg.org/cache/epub/69088/pg69088-images.html",
    },
    {
      key: "ml-morris-trafalgar",
      entity: "text:news-from-nowhere",
      text: "text:news-from-nowhere",
      body: "That massacre of Trafalgar Square began the civil war, though, like all such events, it gathered head slowly, and people scarcely knew what a crisis they were acting in.",
      source: "src_ml_news_from_nowhere",
      locator: "Chapter XVII, “How the Change Came”",
      note: "Spoken by the character Hammond, recalling the revolution.",
      archiveUrl: "https://www.marxists.org/archive/morris/works/1890/nowhere/nowhere.htm",
    },
    {
      key: "ml-jaures-majority",
      entity: "thinker:jaures",
      speaker: "thinker:jaures",
      body: "A society takes on a new form only when the immense majority of the individuals who compose it demand or accept a great change.",
      source: "src_ml_jaures_studies",
      locator: "“Revolutionary Majorities”",
      note: "Minturn's 1906 translation.",
      archiveUrl: "https://www.marxists.org/archive/jaures/1906/studies-socialism/ch10.htm",
    },
  ],
  debates: [
    {
      debate: "debate:the-general-strike",
      propositions: [
        { key: "overthrow", statement: "A general strike can by itself overthrow capitalism." },
        { key: "independent", statement: "Unions should act independently of the socialist party." },
        { key: "called", statement: "Leaders can call or forbid a mass strike at will." },
        { key: "war", statement: "Socialists should prepare a general strike against war." },
        { key: "parliament", statement: "Elections and parliament remain essential to the struggle." },
      ],
      positions: [
        {
          key: "syndicalists",
          label: "Revolutionary syndicalists (CGT)",
          holder: "tendency:revolutionary-syndicalism",
          centralClaim: "The general strike, prepared by daily direct action, is the revolution: the unions will expropriate the capitalists and run production.",
          summary: "Set out in the Charter of Amiens (1906): unions independent of all parties, fighting for daily gains and preparing complete emancipation.",
          assumptions: ["The union unites workers by class, the party divides them by opinion.", "Direct action educates and hardens the workers."],
          criticisms: ["The unions organised only a minority of workers.", "In 1914 the CGT rallied to national defence."],
          links: ["event:charter-of-amiens"],
          stances: {
            overthrow: ["affirms", "The expropriating general strike is the final act of the class struggle."],
            independent: ["affirms", "No ties to parties or sects."],
            called: ["qualified", "Prepared by militant minorities, but realised only when the workers are ready."],
            war: ["affirms", "Anti-militarism and the strike against war were part of the programme."],
            parliament: ["rejects", "Parliamentary politics turns leaders into politicians."],
          },
        },
        {
          key: "sorel",
          label: "Sorel (1908)",
          holder: "thinker:sorel",
          centralClaim: "The general strike is a myth: an image that moves the working class to act, whose value does not depend on its coming true as imagined.",
          summary: "Proletarian violence keeps the classes apart and preserves the movement's moral energy against parliamentary compromise.",
          links: ["text:reflections-on-violence"],
          stances: {
            overthrow: ["qualified", "The question of whether it will succeed literally is beside the point."],
            independent: ["affirms", "Shared the syndicalists' rejection of the party."],
            called: ["silent", "Not his concern."],
            war: ["silent", "Not central to his argument."],
            parliament: ["rejects", "Parliamentary socialism is a form of class collaboration."],
          },
        },
        {
          key: "spd-unions",
          label: "SPD and union leaders (Jena 1905, Mannheim 1906)",
          holder: "tendency:social-democracy",
          centralClaim: "A political mass strike may be used defensively, for instance to defend the suffrage, but not without the unions' consent; the general strike as revolution is an anarchist illusion.",
          summary: "The SPD accepted the mass strike in principle at Jena and conceded the unions a veto at Mannheim, keeping the strike as a reserve weapon.",
          assumptions: ["Organisations built over decades must not be risked on one throw."],
          criticisms: ["Luxemburg: turns the mass strike into a paper resolution."],
          stances: {
            overthrow: ["rejects", "An anarchist fantasy."],
            independent: ["rejects", "Party and unions must act together; in practice the unions set limits."],
            called: ["affirms", "A mass strike must be decided and controlled by the organisations."],
            war: ["rejects", "Opposed a binding commitment to an anti-war strike."],
            parliament: ["affirms", "The party's main field of action."],
          },
        },
        {
          key: "luxemburg",
          label: "Luxemburg (1906–10)",
          holder: "thinker:luxemburg",
          centralClaim: "The mass strike is the form a revolutionary period takes: a long movement of economic and political strikes that no leadership can call or forbid, but which the party must lead politically.",
          summary: "Drawn from the Russian Revolution of 1905; turned against the union leaders' caution and, in 1910, against Kautsky's strategy of attrition.",
          criticisms: ["Kautsky: German conditions were not Russian ones.", "Union leaders: irresponsible risk to the organisations."],
          links: ["text:the-mass-strike", "concept:spontaneity"],
          stances: {
            overthrow: ["qualified", "Part of a revolutionary process that ends in the conquest of power, not a single act."],
            independent: ["rejects", "Social democracy must give the movement political leadership."],
            called: ["rejects", "Mass strikes arise from the situation; they cannot be made or prevented by decree."],
            war: ["affirms", "Argued that the International must answer war with mass action (Stuttgart amendment, 1907)."],
            parliament: ["qualified", "Necessary, but not enough; mass action must go beyond it."],
          },
        },
        {
          key: "jaures",
          label: "Jaurès (1904–14)",
          holder: "thinker:jaures",
          centralClaim: "A general strike succeeds only if it expresses the will of the great majority; as an insurrectionary method it is an illusion, but as a means of pressure, especially against war, it can be legitimate.",
          summary: "Socialism advances through democratic majorities; the strike is one of their means, not a substitute for them.",
          links: ["concept:general-strike"],
          stances: {
            overthrow: ["rejects", "No minority strike can replace the consent of the majority."],
            independent: ["qualified", "Respected union autonomy while working for cooperation with the party."],
            called: ["qualified", "Only with the support of the workers and public opinion."],
            war: ["affirms", "Supported an international strike against war (1910 and July 1914)."],
            parliament: ["affirms", "Democracy is the ground of socialism."],
          },
        },
      ],
      arguments: [
        { key: "a1", position: "syndicalists", kind: "argument", body: "Parliaments absorb workers' representatives into bourgeois politics; only action at the point of production expresses the class directly." },
        { key: "c1", position: "spd-unions", kind: "counterargument", respondsTo: "a1", body: "A failed general strike would destroy the unions and the party, which took decades to build; strength must be preserved for the decisive moment." },
        { key: "c2", position: "luxemburg", kind: "counterargument", respondsTo: "c1", body: "The decisive moment does not wait for permission. In Russia the mass strike created organisation rather than presupposing it." },
        { key: "c3", position: "jaures", kind: "counterargument", respondsTo: "a1", body: "Without the consent of the majority, a strike that tries to overthrow society will be isolated and crushed." },
      ],
    },
  ],
};
