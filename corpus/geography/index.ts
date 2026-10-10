import type { Corpus, CorpusPlaceLink, CorpusSource, EntityKey } from "../../src/lib/corpus/types";
import { PLACES } from "./places";

/**
 * Geography: the gazetteer behind the Geography section, and associations
 * between entries and places that the entry fields cannot express.
 *
 * Birthplaces, places of death and event locations are not repeated here:
 * the map reads them from the published fields, through the gazetteer's exact
 * wordings. What this corpus adds is where people lived, worked and went into
 * exile, and where texts were written and first published. Each association
 * has a date range, a note and a source already in the collection; anything
 * the sources here do not support was left out rather than estimated.
 *
 * Associations on published entries are staged with them and released only
 * when an editor publishes the entry again. Imported for review like any
 * corpus; nothing is published by the import.
 */
const reuse = (id: string, title: string, sourceType: CorpusSource["sourceType"]): CorpusSource => ({ id, reuse: true, title, sourceType });
const link = (entity: EntityKey, place: string, role: CorpusPlaceLink["role"], yearStart: number, yearEnd: number | undefined, note: string, source: string): CorpusPlaceLink => ({
  entity,
  place,
  role,
  yearStart,
  ...(yearEnd != null ? { yearEnd } : {}),
  note,
  source,
});

export const geography: Corpus = {
  collection: "Geography",
  dir: "corpus/geography",
  requires: ["initial-marx", "marx-to-lenin"],
  batches: [
    {
      id: "g1",
      title: "Gazetteer",
      places: PLACES,
    },
    {
      id: "g2",
      title: "Lives: residence, exile and political work",
      sources: [
        reuse("src_mclellan_marx", "Karl Marx: His Life and Thought", "ACADEMIC"),
        reuse("src_hunt_engels", "The Frock-Coated Communist: The Revolutionary Life of Friedrich Engels", "SECONDARY"),
        reuse("src_service_lenin", "Lenin: A Biography", "SECONDARY"),
        reuse("src_nettl_luxemburg", "Rosa Luxemburg", "ACADEMIC"),
        reuse("src_ml_deutscher_armed", "The Prophet Armed: Trotsky, 1879–1921", "ACADEMIC"),
        reuse("src_baron_plekhanov", "Plekhanov: The Father of Russian Marxism", "ACADEMIC"),
        reuse("src_steger_bernstein", "The Quest for Evolutionary Socialism: Eduard Bernstein and Social Democracy", "ACADEMIC"),
        reuse("src_harrison_owen", "Robert Owen and the Owenites in Britain and America: The Quest for the New Moral World", "ACADEMIC"),
        reuse("src_woodcock_proudhon", "Pierre-Joseph Proudhon: A Biography", "SECONDARY"),
        reuse("src_ml_foner_zetkin", "Clara Zetkin: Selected Writings", "PRIMARY"),
        reuse("src_prison_notebooks", "Selections from the Prison Notebooks", "PRIMARY"),
        reuse("src_ml_nevin_connolly", "James Connolly: “A Full Life”", "ACADEMIC"),
      ],
      placeLinks: [
        // Marx
        link("thinker:marx", "pl_cologne", "activity", 1842, 1843, "Edited the Rheinische Zeitung in Cologne until the Prussian government suppressed it in 1843.", "src_mclellan_marx"),
        link("thinker:marx", "pl_paris", "residence", 1843, 1845, "Moved to Paris in October 1843 to edit the Deutsch-Französische Jahrbücher with Arnold Ruge; expelled from France early in 1845.", "src_mclellan_marx"),
        link("thinker:marx", "pl_brussels", "exile", 1845, 1848, "Lived in Brussels after his expulsion from France, until the Belgian government expelled him in March 1848.", "src_mclellan_marx"),
        link("thinker:marx", "pl_cologne", "activity", 1848, 1849, "Returned to Cologne during the revolution to edit the Neue Rheinische Zeitung, until its suppression in May 1849.", "src_mclellan_marx"),
        link("thinker:marx", "pl_london", "exile", 1849, 1883, "Settled in London in 1849 and lived there for the rest of his life.", "src_mclellan_marx"),
        // Engels
        link("thinker:engels", "pl_manchester", "residence", 1842, 1844, "Worked in the office of the family firm's Manchester mill; what he saw there went into The Condition of the Working Class in England.", "src_hunt_engels"),
        link("thinker:engels", "pl_manchester", "residence", 1850, 1870, "Returned to the firm in Manchester after the defeat of 1849 and supported Marx from his income; retired in 1869 and moved to London the next year.", "src_hunt_engels"),
        link("thinker:engels", "pl_london", "residence", 1870, 1895, "Lived in London from 1870 until his death, editing Marx's manuscripts and advising the parties of the International.", "src_hunt_engels"),
        // Lenin
        link("thinker:lenin", "pl_shushenskoye", "exile", 1897, 1900, "Administrative exile in eastern Siberia, where he finished The Development of Capitalism in Russia.", "src_service_lenin"),
        link("thinker:lenin", "pl_munich", "exile", 1900, 1902, "Emigrated in 1900 and worked on the newspaper Iskra, which was edited from Munich.", "src_service_lenin"),
        link("thinker:lenin", "pl_london", "exile", 1902, 1903, "Followed Iskra to London in 1902.", "src_service_lenin"),
        link("thinker:lenin", "pl_geneva", "exile", 1903, 1905, "Lived in Geneva in the years of the split with the Mensheviks, until the revolution of 1905 drew him back to Russia.", "src_service_lenin"),
        link("thinker:lenin", "pl_krakow", "exile", 1912, 1914, "Moved to Austrian Galicia, close to the Russian border, to direct Bolshevik work in Russia; left for Switzerland when war broke out.", "src_service_lenin"),
        link("thinker:lenin", "pl_zurich", "exile", 1916, 1917, "Lived in Zurich from early 1916 until he returned to Russia in April 1917.", "src_service_lenin"),
        link("thinker:lenin", "pl_st_petersburg", "activity", 1917, 1918, "Returned to Petrograd in April 1917 and led the Bolshevik Party through the October Revolution; the government moved to Moscow in March 1918.", "src_service_lenin"),
        // Luxemburg
        link("thinker:luxemburg", "pl_zurich", "residence", 1889, 1897, "Studied at the University of Zurich, taking her doctorate in 1897, and worked with the exiled Polish socialists there.", "src_nettl_luxemburg"),
        link("thinker:luxemburg", "pl_berlin", "activity", 1898, 1919, "Moved to Berlin in 1898 and worked in the German party, as journalist, speaker and teacher at its school, until her murder in January 1919.", "src_nettl_luxemburg"),
        // Trotsky
        link("thinker:trotsky", "pl_st_petersburg", "activity", 1905, 1905, "A leader of the St Petersburg Soviet in the revolution of 1905, until its members were arrested in December.", "src_ml_deutscher_armed"),
        link("thinker:trotsky", "pl_vienna", "exile", 1907, 1914, "Lived in Vienna after escaping from Siberian exile, until the outbreak of war.", "src_ml_deutscher_armed"),
        link("thinker:trotsky", "pl_st_petersburg", "activity", 1917, 1918, "Returned to Petrograd in May 1917; chairman of the Petrograd Soviet from September and organiser of the October insurrection.", "src_ml_deutscher_armed"),
        // Plekhanov, Bernstein
        link("thinker:plekhanov", "pl_geneva", "exile", 1880, 1917, "Left Russia in 1880 and spent most of his exile in Geneva, where he founded the Emancipation of Labour group in 1883; returned to Russia in 1917.", "src_baron_plekhanov"),
        link("thinker:bernstein", "pl_zurich", "exile", 1878, 1888, "Went to Zurich in 1878 and from 1881 edited Der Sozialdemokrat, the party paper printed abroad under the Anti-Socialist Laws, until the Swiss authorities expelled the editors in 1888.", "src_steger_bernstein"),
        link("thinker:bernstein", "pl_london", "exile", 1888, 1901, "Continued Der Sozialdemokrat in London and came to know the Fabians; returned to Germany in 1901.", "src_steger_bernstein"),
        // Owen, Proudhon
        link("thinker:owen", "pl_new_lanark", "activity", 1800, 1825, "Managed the New Lanark mills, where he reformed working hours and set up schools for the workers' children.", "src_harrison_owen"),
        link("thinker:owen", "pl_new_harmony", "activity", 1825, 1827, "Bought the town of New Harmony in 1825 for a cooperative community, which broke up within two years.", "src_harrison_owen"),
        link("thinker:proudhon", "pl_brussels", "exile", 1858, 1862, "Fled to Belgium after being sentenced for De la justice dans la Révolution et dans l'Église, and lived in exile there until 1862.", "src_woodcock_proudhon"),
        // Zetkin, Gramsci, Connolly
        link("thinker:zetkin", "pl_stuttgart", "activity", 1892, 1917, "Edited Die Gleichheit, the German party's paper for working women, published in Stuttgart.", "src_ml_foner_zetkin"),
        link("thinker:gramsci", "pl_turin", "activity", 1911, 1922, "Came to Turin as a student in 1911, became a socialist journalist there and in 1919 co-founded L'Ordine Nuovo, the paper of the factory council movement.", "src_prison_notebooks"),
        link("thinker:connolly", "pl_dublin", "activity", 1896, 1903, "Founded the Irish Socialist Republican Party in Dublin in 1896, and its paper The Workers' Republic.", "src_ml_nevin_connolly"),
      ],
    },
    {
      id: "g3",
      title: "Texts: where they were written and first published",
      sources: [
        reuse("src_what_is_property", "What Is Property?", "PRIMARY"),
        reuse("src_feuerbach_essence", "The Essence of Christianity", "PRIMARY"),
        reuse("src_hegel_phenomenology_miller", "Phenomenology of Spirit", "PRIMARY"),
        reuse("src_mia_critique_hpr_intro", "A Contribution to the Critique of Hegel’s Philosophy of Right. Introduction", "PRIMARY"),
        reuse("src_1844_milligan", "Economic and Philosophic Manuscripts of 1844", "PRIMARY"),
        reuse("src_mia_condition", "The Condition of the Working Class in England", "PRIMARY"),
        reuse("src_theses_feuerbach", "Theses on Feuerbach", "PRIMARY"),
        reuse("src_mia_german_ideology", "The German Ideology", "PRIMARY"),
        reuse("src_manifesto_moore", "Manifesto of the Communist Party", "PRIMARY"),
        reuse("src_mia_brumaire", "The Eighteenth Brumaire of Louis Bonaparte", "PRIMARY"),
        reuse("src_grundrisse_nicolaus", "Grundrisse: Foundations of the Critique of Political Economy (Rough Draft)", "PRIMARY"),
        reuse("src_mia_preface_1859", "A Contribution to the Critique of Political Economy: Preface", "PRIMARY"),
        reuse("src_capital_fowkes", "Capital: A Critique of Political Economy, Volume One", "PRIMARY"),
        reuse("src_mia_civil_war", "The Civil War in France", "PRIMARY"),
        reuse("src_mia_gotha", "Critique of the Gotha Programme", "PRIMARY"),
        reuse("src_mia_soc_utopian", "Socialism: Utopian and Scientific", "PRIMARY"),
        reuse("src_ml_engels_origin", "The Origin of the Family, Private Property and the State", "PRIMARY"),
        reuse("src_ml_fabian_essays", "Fabian Essays in Socialism", "PRIMARY"),
        reuse("src_ml_news_from_nowhere", "News from Nowhere, or An Epoch of Rest", "PRIMARY"),
        reuse("src_mia_kautsky_class_struggle", "The Class Struggle (Erfurt Program)", "PRIMARY"),
        reuse("src_preconditions", "The Preconditions of Socialism", "PRIMARY"),
        reuse("src_ml_lenin_development", "The Development of Capitalism in Russia", "PRIMARY"),
        reuse("src_lih_lenin", "Lenin Rediscovered: What Is to Be Done? in Context", "ACADEMIC"),
        reuse("src_hobson_imperialism", "Imperialism: A Study", "PRIMARY"),
        reuse("src_mutual_aid", "Mutual Aid: A Factor of Evolution", "PRIMARY"),
        reuse("src_mia_trotsky_results", "Results and Prospects", "PRIMARY"),
        reuse("src_mia_luxemburg_mass_strike", "The Mass Strike, the Political Party and the Trade Unions", "PRIMARY"),
        reuse("src_ml_bauer_nationalities", "The Question of Nationalities and Social Democracy", "PRIMARY"),
        reuse("src_ml_sorel_reflections", "Reflections on Violence", "PRIMARY"),
        reuse("src_ml_luxemburg_national", "The National Question and Autonomy", "PRIMARY"),
        reuse("src_ml_kollontai_1909", "The Social Basis of the Woman Question (abridged)", "PRIMARY"),
        reuse("src_ml_connolly_lih", "Labour in Irish History", "PRIMARY"),
        reuse("src_ml_hilferding_fc", "Finance Capital: A Study of the Latest Phase of Capitalist Development", "PRIMARY"),
        reuse("src_ml_luxemburg_accumulation", "The Accumulation of Capital", "PRIMARY"),
        reuse("src_ml_bukharin_iwe", "Imperialism and World Economy", "PRIMARY"),
        reuse("src_mia_junius", "The Junius Pamphlet (The Crisis of German Social Democracy)", "PRIMARY"),
        reuse("src_mia_imperialism", "Imperialism, the Highest Stage of Capitalism", "PRIMARY"),
        reuse("src_mia_april_theses", "The Tasks of the Proletariat in the Present Revolution (the April Theses)", "PRIMARY"),
        reuse("src_state_revolution", "The State and Revolution", "PRIMARY"),
        reuse("src_mia_luxemburg_russian_rev", "The Russian Revolution", "PRIMARY"),
        reuse("src_wretched", "The Wretched of the Earth", "PRIMARY"),
      ],
      placeLinks: [
        link("text:phenomenology-of-spirit", "pl_jena", "writing", 1805, 1807, "Written in Jena, where Hegel taught at the university; finished as the French army approached the town in October 1806.", "src_hegel_phenomenology_miller"),
        link("text:phenomenology-of-spirit", "pl_bamberg", "publication", 1807, undefined, "Published by Joseph Anton Goebhardt, Bamberg and Würzburg, 1807.", "src_hegel_phenomenology_miller"),
        link("text:what-is-property", "pl_paris", "publication", 1840, undefined, "First published in Paris in 1840.", "src_what_is_property"),
        link("text:essence-of-christianity", "pl_leipzig", "publication", 1841, undefined, "Published in Leipzig by Otto Wigand in 1841; revised second edition 1843.", "src_feuerbach_essence"),
        link("text:critique-of-hegels-philosophy-of-right", "pl_paris", "publication", 1844, undefined, "The Introduction appeared in the only issue of the Deutsch-Französische Jahrbücher, Paris, February 1844.", "src_mia_critique_hpr_intro"),
        link("text:economic-philosophic-manuscripts", "pl_paris", "writing", 1844, undefined, "Written in Paris in the spring and summer of 1844; not published until 1932.", "src_1844_milligan"),
        link("text:condition-working-class-england", "pl_leipzig", "publication", 1845, undefined, "Published by Otto Wigand in Leipzig in 1845.", "src_mia_condition"),
        link("text:theses-on-feuerbach", "pl_brussels", "writing", 1845, undefined, "Jotted down in Brussels in the spring of 1845; Engels published them in 1888.", "src_theses_feuerbach"),
        link("text:the-german-ideology", "pl_brussels", "writing", 1845, 1846, "Written by Marx and Engels in Brussels in 1845–46; no publisher could be found, and the manuscript was published in full only in 1932.", "src_mia_german_ideology"),
        link("text:communist-manifesto", "pl_brussels", "writing", 1847, 1848, "Written by Marx in Brussels in December 1847 and January 1848, after the Communist League's second congress commissioned it.", "src_manifesto_moore"),
        link("text:communist-manifesto", "pl_london", "publication", 1848, undefined, "Printed in German in London in February 1848, for the Communist League.", "src_manifesto_moore"),
        link("text:eighteenth-brumaire", "pl_new_york", "publication", 1852, undefined, "Published in Joseph Weydemeyer's Die Revolution, New York, 1852.", "src_mia_brumaire"),
        link("text:eighteenth-brumaire", "pl_hamburg", "publication", 1869, undefined, "Revised second edition, Hamburg, 1869.", "src_mia_brumaire"),
        link("text:grundrisse", "pl_london", "writing", 1857, 1858, "Written in London between October 1857 and May 1858, during the economic crisis of 1857; first published in Moscow in 1939–41.", "src_grundrisse_nicolaus"),
        link("text:contribution-critique-political-economy", "pl_berlin", "publication", 1859, undefined, "Published by Franz Duncker, Berlin, 1859.", "src_mia_preface_1859"),
        link("text:capital-volume-one", "pl_hamburg", "publication", 1867, undefined, "Published by Otto Meissner in Hamburg in September 1867.", "src_capital_fowkes"),
        link("text:civil-war-in-france", "pl_london", "publication", 1871, undefined, "Written in English as an address of the General Council of the International and published in London in June 1871.", "src_mia_civil_war"),
        link("text:critique-of-the-gotha-programme", "pl_london", "writing", 1875, undefined, "Written in London in April and May 1875 as marginal notes on the draft programme, and sent to the Eisenach party's leaders.", "src_mia_gotha"),
        link("text:socialism-utopian-and-scientific", "pl_paris", "publication", 1880, undefined, "First published in French, in Paul Lafargue's translation, in Paris in 1880.", "src_mia_soc_utopian"),
        link("text:origin-of-the-family", "pl_zurich", "publication", 1884, undefined, "First published in Hottingen-Zürich in 1884, while the Anti-Socialist Laws were in force in Germany.", "src_ml_engels_origin"),
        link("text:fabian-essays", "pl_london", "publication", 1889, undefined, "Published by the Fabian Society, London, December 1889.", "src_ml_fabian_essays"),
        link("text:news-from-nowhere", "pl_london", "publication", 1890, undefined, "Serialised in Commonweal, the Socialist League's paper, published in London, January–October 1890.", "src_ml_news_from_nowhere"),
        link("text:the-class-struggle", "pl_stuttgart", "publication", 1892, undefined, "Published in Stuttgart in 1892 as a commentary on the Erfurt Programme.", "src_mia_kautsky_class_struggle"),
        link("text:preconditions-of-socialism", "pl_stuttgart", "publication", 1899, undefined, "Published by J. H. W. Dietz in Stuttgart in 1899.", "src_preconditions"),
        link("text:development-of-capitalism-in-russia", "pl_shushenskoye", "writing", 1897, 1899, "Begun in prison in St Petersburg and finished in Siberian exile at Shushenskoye.", "src_ml_lenin_development"),
        link("text:development-of-capitalism-in-russia", "pl_st_petersburg", "publication", 1899, undefined, "Published legally in St Petersburg in March 1899 under the pseudonym Vladimir Ilyin.", "src_ml_lenin_development"),
        link("text:what-is-to-be-done", "pl_stuttgart", "publication", 1902, undefined, "Published by J. H. W. Dietz in Stuttgart in March 1902.", "src_lih_lenin"),
        link("text:imperialism-a-study", "pl_london", "publication", 1902, undefined, "Published by James Nisbet, London, 1902.", "src_hobson_imperialism"),
        link("text:mutual-aid", "pl_london", "publication", 1902, undefined, "Published in London in 1902, from articles that appeared in The Nineteenth Century from 1890.", "src_mutual_aid"),
        link("text:results-and-prospects", "pl_st_petersburg", "publication", 1906, undefined, "Written in prison in 1906 as the closing chapter of Trotsky's collection Our Revolution, published in St Petersburg; most copies were seized.", "src_mia_trotsky_results"),
        link("text:the-mass-strike", "pl_hamburg", "publication", 1906, undefined, "Published as a pamphlet in Hamburg in 1906.", "src_mia_luxemburg_mass_strike"),
        link("text:question-of-nationalities", "pl_vienna", "publication", 1907, undefined, "Published in Vienna in 1907 as volume 2 of the Marx-Studien.", "src_ml_bauer_nationalities"),
        link("text:reflections-on-violence", "pl_paris", "publication", 1908, undefined, "Articles in Le Mouvement socialiste (1906), published as a book in Paris in 1908.", "src_ml_sorel_reflections"),
        link("text:national-question-and-autonomy", "pl_krakow", "publication", 1908, 1909, "A series of articles in Przegląd Socjaldemokratyczny, published in Kraków, 1908–09.", "src_ml_luxemburg_national"),
        link("text:social-basis-of-the-woman-question", "pl_st_petersburg", "publication", 1909, undefined, "Published in St Petersburg in 1909, written for the All-Russian Women's Congress of December 1908.", "src_ml_kollontai_1909"),
        link("text:labour-in-irish-history", "pl_dublin", "publication", 1910, undefined, "Published by Maunsel, Dublin, 1910.", "src_ml_connolly_lih"),
        link("text:finance-capital", "pl_vienna", "publication", 1910, undefined, "Published in Vienna in 1910 as volume 3 of the Marx-Studien.", "src_ml_hilferding_fc"),
        link("text:accumulation-of-capital", "pl_berlin", "publication", 1913, undefined, "Published in Berlin in 1913.", "src_ml_luxemburg_accumulation"),
        link("text:imperialism-and-world-economy", "pl_st_petersburg", "publication", 1918, undefined, "Written in 1915; published in Petrograd in 1918.", "src_ml_bukharin_iwe"),
        link("text:junius-pamphlet", "pl_zurich", "publication", 1916, undefined, "Written in prison in 1915 and published illegally in Zurich in April 1916 under the pseudonym Junius.", "src_mia_junius"),
        link("text:imperialism-highest-stage", "pl_zurich", "writing", 1916, undefined, "Written in Zurich in the first half of 1916.", "src_mia_imperialism"),
        link("text:imperialism-highest-stage", "pl_st_petersburg", "publication", 1917, undefined, "Published in Petrograd in 1917.", "src_mia_imperialism"),
        link("text:april-theses", "pl_st_petersburg", "publication", 1917, undefined, "Read at meetings in the Tauride Palace, Petrograd, on 4 April 1917 and published in Pravda on 7 April.", "src_mia_april_theses"),
        link("text:the-state-and-revolution", "pl_st_petersburg", "publication", 1918, undefined, "Published in Petrograd in 1918.", "src_state_revolution"),
        link("text:the-russian-revolution", "pl_breslau", "writing", 1918, undefined, "Written in 1918 in Breslau prison, where Luxemburg was held until the November revolution.", "src_mia_luxemburg_russian_rev"),
        link("text:the-russian-revolution", "pl_berlin", "publication", 1922, undefined, "Published by Paul Levi in Berlin in 1922, after Luxemburg's death.", "src_mia_luxemburg_russian_rev"),
        link("text:the-wretched-of-the-earth", "pl_paris", "publication", 1961, undefined, "Published by François Maspero, Paris, 1961.", "src_wretched"),
      ],
    },
    {
      id: "g4",
      title: "Movements: centres and regions",
      sources: [
        reuse("src_ml_jennings_syndicalism", "Syndicalism in France: A Study of Ideas", "ACADEMIC"),
        reuse("src_ml_bottomore_austro", "Austro-Marxism", "ACADEMIC"),
        reuse("src_ml_tobias_bund", "The Jewish Bund in Russia: From Its Origins to 1905", "HISTORICAL"),
        reuse("src_ml_mackenzie_fabians", "The First Fabians", "HISTORICAL"),
        reuse("src_marshall_anarchism", "Demanding the Impossible: A History of Anarchism", "SECONDARY"),
      ],
      placeLinks: [
        link("tendency:revolutionary-syndicalism", "pl_france", "influence", 1895, 1914, "Revolutionary syndicalism took its first and fullest form in the French labour movement, in the CGT founded in 1895 and its Charter of Amiens (1906).", "src_ml_jennings_syndicalism"),
        link("tendency:austro-marxism", "pl_vienna", "activity", 1904, 1934, "The work of a group of Viennese socialists around the Marx-Studien (from 1904) and the Austrian Social Democratic Party, until the party was banned in 1934.", "src_ml_bottomore_austro"),
        link("tendency:jewish-labour-bund", "pl_vilna", "activity", 1897, undefined, "The General Jewish Labour Bund was founded at a secret congress in Vilna in 1897.", "src_ml_tobias_bund"),
        link("tendency:fabianism", "pl_london", "activity", 1884, undefined, "The Fabian Society was founded in London in 1884.", "src_ml_mackenzie_fabians"),
        link("tendency:anarchism", "pl_catalonia", "influence", 1868, 1939, "From the arrival of the International in Spain in 1868 to the end of the Civil War in 1939, anarchism was a mass movement in Spain, strongest in Catalonia and Andalusia.", "src_marshall_anarchism"),
      ],
    },
  ],
};
