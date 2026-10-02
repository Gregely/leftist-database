import type { CorpusSource } from "../../src/lib/corpus/types";

/**
 * Bibliography for the Initial Marx Corpus.
 *
 * Every record is a real publication or archive page. Online records carry a
 * check (the page must load and mention the expected words); books carry a
 * catalogue lookup (Open Library). Results are stored in verification.json by
 * `npm run corpus -- verify`. No page numbers are given unless a page has
 * actually been consulted: locators are chapters or sections.
 */

const MIA = "Marxists Internet Archive transcription (marxists.org). Check wording and pagination against a printed edition before quoting.";
const SEP = "Stanford Encyclopedia of Philosophy (peer-reviewed reference work, Stanford University). Cite the revision consulted.";

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

const sep = (id: string, title: string, author: string, date: string, slug: string): CorpusSource => ({
  id,
  title,
  author,
  publicationDate: date,
  containerTitle: "Stanford Encyclopedia of Philosophy",
  publisher: "Metaphysics Research Lab, Stanford University",
  url: `https://plato.stanford.edu/entries/${slug}/`,
  sourceType: "REFERENCE",
  notes: SEP,
  check: { kind: "url", expect: title.replace(/[’']/g, "") === title ? title : title.split(/[’']/)[0] },
});

const book = (
  id: string,
  title: string,
  author: string,
  date: string,
  publisher: string,
  place: string,
  sourceType: CorpusSource["sourceType"],
  lookup: { title: string; author: string },
  extra: Partial<CorpusSource> = {},
): CorpusSource => ({ id, title, author, publicationDate: date, publisher, place, sourceType, check: { kind: "book", ...lookup }, ...extra });

export const SOURCES: CorpusSource[] = [
  /* ——— Existing records reused unchanged (sample bibliography) ——— */
  { id: "src_capital_fowkes", reuse: true, title: "Capital, Volume One (trans. Fowkes)", sourceType: "PRIMARY" },
  { id: "src_manifesto_moore", reuse: true, title: "Manifesto of the Communist Party (trans. Moore)", sourceType: "PRIMARY" },
  { id: "src_1844_milligan", reuse: true, title: "Economic and Philosophic Manuscripts of 1844 (trans. Milligan)", sourceType: "PRIMARY" },
  { id: "src_theses_feuerbach", reuse: true, title: "Theses on Feuerbach", sourceType: "PRIMARY" },
  { id: "src_what_is_property", reuse: true, title: "What Is Property? (ed. Kelley and Smith)", sourceType: "PRIMARY" },
  { id: "src_preconditions", reuse: true, title: "The Preconditions of Socialism (ed. Tudor)", sourceType: "PRIMARY" },
  { id: "src_reform_revolution", reuse: true, title: "Social Reform or Revolution?", sourceType: "PRIMARY" },
  { id: "src_state_revolution", reuse: true, title: "The State and Revolution", sourceType: "PRIMARY" },
  { id: "src_kolakowski", reuse: true, title: "Main Currents of Marxism", sourceType: "ACADEMIC" },
  { id: "src_bottomore_dictionary", reuse: true, title: "A Dictionary of Marxist Thought", sourceType: "REFERENCE" },
  { id: "src_hobsbawm_revolution", reuse: true, title: "The Age of Revolution", sourceType: "HISTORICAL" },
  { id: "src_heinrich_capital", reuse: true, title: "An Introduction to the Three Volumes of Karl Marx's Capital", sourceType: "SECONDARY" },
  { id: "src_ollman_alienation", reuse: true, title: "Alienation: Marx's Conception of Man in Capitalist Society", sourceType: "ACADEMIC" },
  { id: "src_williams_keywords", reuse: true, title: "Keywords", sourceType: "REFERENCE" },

  /* ——— Collected editions ——— */
  {
    id: "src_mecw",
    title: "Collected Works",
    author: "Karl Marx and Frederick Engels",
    editors: "Institute of Marxism-Leninism (Moscow) and others",
    publicationDate: "1975–2004 (50 vols.)",
    publisher: "Lawrence & Wishart; Progress Publishers; International Publishers",
    place: "London; Moscow; New York",
    sourceType: "PRIMARY",
    notes: "The standard English edition (MECW). Locators give the volume.",
    check: { kind: "book", title: "Collected Works", author: "Karl Marx" },
  },

  /* ——— Reference works ——— */
  sep("src_sep_marx", "Karl Marx", "Jonathan Wolff and David Leopold", "2003; substantive revision 2025", "marx"),
  sep("src_sep_hegel", "Georg Wilhelm Friedrich Hegel", "Paul Redding", "1997; substantive revision 2025", "hegel"),
  sep("src_sep_hegel_dialectics", "Hegel’s Dialectics", "Julie E. Maybee", "2016; substantive revision 2020", "hegel-dialectics"),
  sep("src_sep_feuerbach", "Ludwig Andreas Feuerbach", "Todd Gooch", "2013; substantive revision 2023", "ludwig-feuerbach"),
  sep("src_sep_smith", "Adam Smith’s Moral and Political Philosophy", "Samuel Fleischacker", "2013; substantive revision 2025", "smith-moral-political"),
  sep("src_sep_socialism", "Socialism", "Pablo Gilabert and Martin O’Neill", "2019; substantive revision 2024", "socialism"),
  sep("src_sep_alienation", "Alienation", "David Leopold", "2018; substantive revision 2022", "alienation"),
  sep("src_sep_exploitation", "Exploitation", "Matt Zwolinski, Benjamin Ferguson and Alan Wertheimer", "2001; substantive revision 2022", "exploitation"),
  sep("src_sep_luxemburg", "Rosa Luxemburg", "Lea Ypi", "2022", "luxemburg"),
  sep("src_sep_ideology", "Ideology", "William Clare Roberts", "2025", "ideology"),
  sep("src_sep_idealism", "Idealism", "Paul Guyer and Rolf-Peter Horstmann", "2015; substantive revision 2026", "idealism"),

  /* ——— Precursors: primary texts ——— */
  book("src_hegel_phenomenology_miller", "Phenomenology of Spirit", "G. W. F. Hegel; trans. A. V. Miller", "1977 [German original 1807]", "Clarendon Press", "Oxford", "PRIMARY", { title: "Phenomenology of Spirit", author: "Hegel" }),
  book("src_hegel_pr_nisbet", "Elements of the Philosophy of Right", "G. W. F. Hegel; ed. Allen W. Wood; trans. H. B. Nisbet", "1991 [German original 1820]", "Cambridge University Press", "Cambridge", "PRIMARY", { title: "Elements of the Philosophy of Right", author: "Hegel" }),
  mia("src_mia_hegel_pr", "Philosophy of Right (trans. S. W. Dyde, 1896)", "G. W. F. Hegel", "1820 [trans. 1896]", "https://www.marxists.org/reference/archive/hegel/works/pr/preface.htm", "owl of Minerva", { translator: "S. W. Dyde" }),
  mia("src_feuerbach_essence", "The Essence of Christianity", "Ludwig Feuerbach", "1841 [trans. George Eliot, 1854]", "https://www.marxists.org/reference/archive/feuerbach/works/essence/", "Essence of Christianity", {
    translator: "George Eliot (Marian Evans); introduction trans. Zawar Hanfi",
    notes: `${MIA} The archive's introduction follows Hanfi's 1972 translation; the remainder George Eliot's of 1854 (London: John Chapman).`,
  }),
  book("src_smith_wealth", "An Inquiry into the Nature and Causes of the Wealth of Nations", "Adam Smith; ed. R. H. Campbell, A. S. Skinner and W. B. Todd", "1976 [first published 1776]", "Clarendon Press (Glasgow Edition)", "Oxford", "PRIMARY", { title: "Wealth of Nations", author: "Adam Smith" }),
  book("src_ricardo_principles", "On the Principles of Political Economy and Taxation", "David Ricardo; ed. Piero Sraffa with M. H. Dobb", "1951 [first published 1817; 3rd edn 1821]", "Cambridge University Press", "Cambridge", "PRIMARY", { title: "Principles of Political Economy and Taxation", author: "Ricardo" }, { containerTitle: "The Works and Correspondence of David Ricardo, vol. 1" }),
  book("src_owen_new_view", "A New View of Society and Other Writings", "Robert Owen; ed. Gregory Claeys", "1991 [A New View of Society first published 1813–16]", "Penguin Books", "London", "PRIMARY", { title: "A New View of Society", author: "Robert Owen" }),
  mia("src_mia_proudhon_property", "What is Property? (trans. Benjamin R. Tucker)", "Pierre-Joseph Proudhon", "1840 [Tucker translation first published 1876]", "https://www.marxists.org/reference/subject/economics/proudhon/property/index.htm", "What is Property", { translator: "Benjamin R. Tucker" }),

  /* ——— Precursors: scholarship ——— */
  book("src_taylor_hegel", "Hegel", "Charles Taylor", "1975", "Cambridge University Press", "Cambridge", "ACADEMIC", { title: "Hegel", author: "Charles Taylor" }),
  book("src_beiser_companion", "The Cambridge Companion to Hegel", "Frederick C. Beiser (ed.)", "1993", "Cambridge University Press", "Cambridge", "ACADEMIC", { title: "Cambridge Companion to Hegel", author: "Beiser" }),
  book("src_harvey_feuerbach", "Feuerbach and the Interpretation of Religion", "Van A. Harvey", "1995", "Cambridge University Press", "Cambridge", "ACADEMIC", { title: "Feuerbach and the Interpretation of Religion", author: "Harvey" }),
  book("src_breckman", "Marx, the Young Hegelians, and the Origins of Radical Social Theory: Dethroning the Self", "Warren Breckman", "1999", "Cambridge University Press", "Cambridge", "ACADEMIC", { title: "Marx, the Young Hegelians, and the Origins of Radical Social Theory", author: "Breckman" }),
  book("src_leopold_young_marx", "The Young Karl Marx: German Philosophy, Modern Politics, and Human Flourishing", "David Leopold", "2007", "Cambridge University Press", "Cambridge", "ACADEMIC", { title: "The Young Karl Marx", author: "David Leopold" }),
  book("src_meek_labour_value", "Studies in the Labour Theory of Value", "Ronald L. Meek", "1956 [2nd edn 1973]", "Lawrence & Wishart", "London", "ACADEMIC", { title: "Studies in the Labour Theory of Value", author: "Meek" }),
  book("src_schumpeter_hea", "History of Economic Analysis", "Joseph A. Schumpeter; ed. Elizabeth Boody Schumpeter", "1954", "Oxford University Press; Allen & Unwin", "New York; London", "ACADEMIC", { title: "History of Economic Analysis", author: "Schumpeter" }),
  book("src_manuel_saint_simon", "The New World of Henri Saint-Simon", "Frank E. Manuel", "1956", "Harvard University Press", "Cambridge, MA", "ACADEMIC", { title: "The New World of Henri Saint-Simon", author: "Frank E. Manuel" }),
  book("src_beecher_fourier", "Charles Fourier: The Visionary and His World", "Jonathan Beecher", "1986", "University of California Press", "Berkeley", "ACADEMIC", { title: "Charles Fourier", author: "Jonathan Beecher" }),
  book("src_taylor_utopian", "The Political Ideas of the Utopian Socialists", "Keith Taylor", "1982", "Frank Cass", "London", "ACADEMIC", { title: "Political Ideas of the Utopian Socialists", author: "Keith Taylor" }),
  book("src_claeys_citizens", "Citizens and Saints: Politics and Anti-Politics in Early British Socialism", "Gregory Claeys", "1989", "Cambridge University Press", "Cambridge", "ACADEMIC", { title: "Citizens and Saints", author: "Claeys" }),
  book("src_harrison_owen", "Robert Owen and the Owenites in Britain and America: The Quest for the New Moral World", "J. F. C. Harrison", "1969", "Routledge & Kegan Paul", "London", "ACADEMIC", { title: "Robert Owen and the Owenites in Britain and America", author: "Harrison" }),
  book("src_woodcock_proudhon", "Pierre-Joseph Proudhon: A Biography", "George Woodcock", "1956", "Routledge & Kegan Paul", "London", "SECONDARY", { title: "Pierre-Joseph Proudhon", author: "Woodcock" }),
  book("src_ehrenberg_proudhon", "Proudhon and His Age", "John Ehrenberg", "1996", "Humanities Press", "Atlantic Highlands, NJ", "ACADEMIC", { title: "Proudhon and his Age", author: "Ehrenberg" }),

  /* ——— Marx and Engels: primary texts (archive transcriptions) ——— */
  mia("src_mia_critique_hpr_intro", "A Contribution to the Critique of Hegel’s Philosophy of Right. Introduction", "Karl Marx", "1844 [written Dec 1843–Jan 1844]", "https://www.marxists.org/archive/marx/works/1843/critique-hpr/intro.htm", "sigh of the oppressed creature", { containerTitle: "Deutsch-Französische Jahrbücher (Paris, February 1844)" }),
  mia("src_mia_epm_labour", "Economic and Philosophic Manuscripts of 1844: Estranged Labour", "Karl Marx", "1844 [first published 1932]", "https://www.marxists.org/archive/marx/works/1844/manuscripts/labour.htm", "Estranged Labour"),
  mia("src_mia_german_ideology", "The German Ideology", "Karl Marx and Frederick Engels", "written 1845–46 [first published in full 1932]", "https://www.marxists.org/archive/marx/works/1845/german-ideology/", "German Ideology"),
  mia("src_mia_poverty_philosophy", "The Poverty of Philosophy", "Karl Marx", "1847", "https://www.marxists.org/archive/marx/works/1847/poverty-philosophy/", "Poverty of Philosophy"),
  mia("src_mia_wage_labour", "Wage Labour and Capital", "Karl Marx", "1849 [lectures of 1847]", "https://www.marxists.org/archive/marx/works/1847/wage-labour/", "Wage Labour and Capital"),
  mia("src_mia_brumaire", "The Eighteenth Brumaire of Louis Bonaparte", "Karl Marx", "1852", "https://www.marxists.org/archive/marx/works/1852/18th-brumaire/ch01.htm", "make their own history"),
  mia("src_mia_preface_1859", "A Contribution to the Critique of Political Economy: Preface", "Karl Marx", "1859", "https://www.marxists.org/archive/marx/works/1859/critique-pol-economy/preface.htm", "relations of production", {
    notes: `${MIA} The archive gives as its source: K. Marx, A Contribution to the Critique of Political Economy, Progress Publishers, Moscow, 1977.`,
  }),
  book("src_grundrisse_nicolaus", "Grundrisse: Foundations of the Critique of Political Economy (Rough Draft)", "Karl Marx; trans. Martin Nicolaus", "1973 [written 1857–58; first published 1939–41]", "Penguin Books in association with New Left Review", "Harmondsworth", "PRIMARY", { title: "Grundrisse", author: "Karl Marx" }, { url: "https://www.marxists.org/archive/marx/works/1857/grundrisse/" }),
  mia("src_mia_value_price_profit", "Value, Price and Profit", "Karl Marx", "1865 [first published 1898]", "https://www.marxists.org/archive/marx/works/1865/value-price-profit/", "Value, Price and Profit"),
  mia("src_mia_capital_moore", "Capital, Volume I (trans. Samuel Moore and Edward Aveling, ed. Frederick Engels, 1887)", "Karl Marx", "1867 [English translation 1887]", "https://www.marxists.org/archive/marx/works/1867-c1/", "Capital", { translator: "Samuel Moore and Edward Aveling" }),
  mia("src_mia_civil_war", "The Civil War in France", "Karl Marx", "1871", "https://www.marxists.org/archive/marx/works/1871/civil-war-france/", "Civil War in France"),
  mia("src_mia_gotha", "Critique of the Gotha Programme", "Karl Marx", "written 1875 [first published 1891]", "https://www.marxists.org/archive/marx/works/1875/gotha/ch01.htm", "according to his needs"),
  mia("src_mia_zasulich", "Letter to Vera Zasulich and drafts", "Karl Marx", "1881", "https://www.marxists.org/archive/marx/works/1881/zasulich/", "Zasulich"),
  mia("src_mia_engels_outlines", "Outlines of a Critique of Political Economy", "Frederick Engels", "1844 [written 1843]", "https://www.marxists.org/archive/marx/works/1844/df-jahrbucher/outlines.htm", "Political Economy"),
  mia("src_mia_condition", "The Condition of the Working Class in England", "Frederick Engels", "1845", "https://www.marxists.org/archive/marx/works/1845/condition-working-class/", "Working Class"),
  mia("src_mia_anti_duhring", "Anti-Dühring: Herr Eugen Dühring’s Revolution in Science", "Frederick Engels", "1878", "https://www.marxists.org/archive/marx/works/1877/anti-duhring/", "Anti-D"),
  mia("src_mia_soc_utopian", "Socialism: Utopian and Scientific", "Frederick Engels", "1880 [English trans. Edward Aveling 1892]", "https://www.marxists.org/archive/marx/works/1880/soc-utop/", "Socialism: Utopian and Scientific", { translator: "Edward Aveling" }),
  mia("src_mia_ludwig_feuerbach", "Ludwig Feuerbach and the End of Classical German Philosophy", "Frederick Engels", "1886 [book edition 1888]", "https://www.marxists.org/archive/marx/works/1886/ludwig-feuerbach/", "Ludwig Feuerbach"),
  mia("src_mia_engels_bloch", "Letter to Joseph Bloch, 21–22 September 1890", "Frederick Engels", "1890", "https://www.marxists.org/archive/marx/works/1890/letters/90_09_21.htm", "ultimately determining element"),
  mia("src_mia_engels_1895", "Introduction to Karl Marx’s The Class Struggles in France 1848 to 1850", "Frederick Engels", "1895", "https://www.marxists.org/archive/marx/works/1895/03/06.htm", "Class Struggles in France"),
  mia("src_mia_communist_league", "Communist League: documents and history", "Marxists Internet Archive (ed.)", "1847–1852", "https://www.marxists.org/archive/marx/works/1847/communist-league/index.htm", "Communist League", { sourceType: "HISTORICAL" }),
  mia("src_mia_iwma", "History of the International Workingmen’s Association", "Marxists Internet Archive (ed.)", "1864–1876", "https://www.marxists.org/history/international/iwma/index.htm", "International Workingmen", { sourceType: "HISTORICAL" }),

  /* ——— Marx and Engels: scholarship ——— */
  book("src_stedman_jones_marx", "Karl Marx: Greatness and Illusion", "Gareth Stedman Jones", "2016", "Allen Lane", "London", "ACADEMIC", { title: "Karl Marx", author: "Gareth Stedman Jones" }),
  book("src_sperber_marx", "Karl Marx: A Nineteenth-Century Life", "Jonathan Sperber", "2013", "Liveright", "New York", "ACADEMIC", { title: "Karl Marx", author: "Jonathan Sperber" }),
  book("src_mclellan_marx", "Karl Marx: His Life and Thought", "David McLellan", "1973 [later editions as Karl Marx: A Biography]", "Macmillan", "London", "ACADEMIC", { title: "Karl Marx: His Life and Thought", author: "McLellan" }),
  book("src_avineri", "The Social and Political Thought of Karl Marx", "Shlomo Avineri", "1968", "Cambridge University Press", "Cambridge", "ACADEMIC", { title: "The Social and Political Thought of Karl Marx", author: "Avineri" }),
  book("src_cohen_history", "Karl Marx’s Theory of History: A Defence", "G. A. Cohen", "1978 [expanded edn 2000]", "Clarendon Press; Princeton University Press", "Oxford; Princeton", "ACADEMIC", { title: "Karl Marx's Theory of History", author: "Cohen" }),
  book("src_wood_marx", "Karl Marx", "Allen W. Wood", "1981 [2nd edn 2004]", "Routledge & Kegan Paul", "London", "ACADEMIC", { title: "Karl Marx", author: "Allen Wood" }),
  book("src_harvey_companion", "A Companion to Marx’s Capital", "David Harvey", "2010", "Verso", "London", "SECONDARY", { title: "A Companion to Marx's Capital", author: "David Harvey" }),
  book("src_carver_relationship", "Marx and Engels: The Intellectual Relationship", "Terrell Carver", "1983", "Wheatsheaf Books", "Brighton", "ACADEMIC", { title: "Marx & Engels", author: "Terrell Carver" }),
  book("src_hunt_engels", "The Frock-Coated Communist: The Revolutionary Life of Friedrich Engels", "Tristram Hunt", "2009 [US edition: Marx’s General]", "Allen Lane", "London", "SECONDARY", { title: "Marx's General", author: "Tristram Hunt" }),
  book("src_shanin_late_marx", "Late Marx and the Russian Road: Marx and ‘the Peripheries of Capitalism’", "Teodor Shanin (ed.)", "1983", "Routledge & Kegan Paul; Monthly Review Press", "London; New York", "ACADEMIC", { title: "Late Marx and the Russian Road", author: "Shanin" }),
  book("src_walicki", "Marxism and the Leap to the Kingdom of Freedom: The Rise and Fall of the Communist Utopia", "Andrzej Walicki", "1995", "Stanford University Press", "Stanford", "ACADEMIC", { title: "Marxism and the Leap to the Kingdom of Freedom", author: "Walicki" }),

  /* ——— History ——— */
  book("src_hobsbawm_capital", "The Age of Capital, 1848–1875", "Eric Hobsbawm", "1975", "Weidenfeld & Nicolson", "London", "HISTORICAL", { title: "The Age of Capital", author: "Hobsbawm" }),
  book("src_hobsbawm_empire", "The Age of Empire, 1875–1914", "Eric Hobsbawm", "1987", "Weidenfeld & Nicolson", "London", "HISTORICAL", { title: "The Age of Empire", author: "Hobsbawm" }),
  book("src_sperber_1848", "The European Revolutions, 1848–1851", "Jonathan Sperber", "1994 [2nd edn 2005]", "Cambridge University Press", "Cambridge", "HISTORICAL", { title: "The European Revolutions, 1848-1851", author: "Sperber" }),
  book("src_tombs_commune", "The Paris Commune 1871", "Robert Tombs", "1999", "Longman", "London", "HISTORICAL", { title: "The Paris Commune 1871", author: "Tombs" }),
  book("src_schorske_spd", "German Social Democracy, 1905–1917: The Development of the Great Schism", "Carl E. Schorske", "1955", "Harvard University Press", "Cambridge, MA", "HISTORICAL", { title: "German Social Democracy, 1905-1917", author: "Schorske" }),
  book("src_haupt_war", "Socialism and the Great War: The Collapse of the Second International", "Georges Haupt", "1972", "Clarendon Press", "Oxford", "HISTORICAL", { title: "Socialism and the Great War", author: "Haupt" }),
  book("src_ascher_1905", "The Revolution of 1905", "Abraham Ascher", "1988–92 (2 vols.)", "Stanford University Press", "Stanford", "HISTORICAL", { title: "The Revolution of 1905", author: "Ascher" }),
  book("src_smith_russia", "Russia in Revolution: An Empire in Crisis, 1890 to 1928", "S. A. Smith", "2017", "Oxford University Press", "Oxford", "HISTORICAL", { title: "Russia in Revolution", author: "S. A. Smith" }),
  book("src_fitzpatrick_revolution", "The Russian Revolution", "Sheila Fitzpatrick", "1982 [4th edn 2017]", "Oxford University Press", "Oxford", "HISTORICAL", { title: "The Russian Revolution", author: "Fitzpatrick" }),

  /* ——— Second International: primary texts ——— */
  mia("src_mia_erfurt_program", "The Erfurt Program", "Social Democratic Party of Germany", "1891", "https://www.marxists.org/history/international/social-democracy/1891/erfurt-program.htm", "Erfurt"),
  mia("src_mia_kautsky_class_struggle", "The Class Struggle (Erfurt Program)", "Karl Kautsky", "1892", "https://www.marxists.org/archive/kautsky/1892/erfurt/", "Class Struggle"),
  mia("src_mia_kautsky_road", "The Road to Power", "Karl Kautsky", "1909", "https://www.marxists.org/archive/kautsky/1909/power/ch05.htm", "revolution-making party"),
  mia("src_mia_kautsky_dictatorship", "The Dictatorship of the Proletariat", "Karl Kautsky", "1918", "https://www.marxists.org/archive/kautsky/1918/dictprole/", "Dictatorship of the Proletariat"),
  mia("src_mia_bernstein_evsoc", "Evolutionary Socialism: A Criticism and Affirmation (trans. Edith C. Harvey)", "Eduard Bernstein", "1899 [English translation 1909]", "https://www.marxists.org/reference/archive/bernstein/works/1899/evsoc/preface.htm", "final aim of socialism", { translator: "Edith C. Harvey" }),
  mia("src_mia_plekhanov_struggle", "Socialism and the Political Struggle", "G. V. Plekhanov", "1883", "https://www.marxists.org/archive/plekhanov/1883/struggle/", "Political Struggle"),
  mia("src_mia_plekhanov_monist", "The Development of the Monist View of History", "G. V. Plekhanov", "1895", "https://www.marxists.org/archive/plekhanov/1895/monist/index.htm", "Monist View"),
  mia("src_mia_plekhanov_individual", "On the Role of the Individual in History", "G. V. Plekhanov", "1898", "https://www.marxists.org/archive/plekhanov/1898/xx/individual.html", "Individual in History"),
  mia("src_mia_luxemburg_org", "Organizational Questions of the Russian Social Democracy", "Rosa Luxemburg", "1904", "https://www.marxists.org/archive/luxemburg/1904/questions-rsd/ch02.htm", "Central Committee"),
  mia("src_mia_luxemburg_mass_strike", "The Mass Strike, the Political Party and the Trade Unions", "Rosa Luxemburg", "1906", "https://www.marxists.org/archive/luxemburg/1906/mass-strike/", "Mass Strike"),
  mia("src_mia_junius", "The Junius Pamphlet (The Crisis of German Social Democracy)", "Rosa Luxemburg", "written 1915 [published 1916]", "https://www.marxists.org/archive/luxemburg/1915/junius/ch01.htm", "barbarism"),
  mia("src_mia_luxemburg_russian_rev", "The Russian Revolution", "Rosa Luxemburg", "written 1918 [published 1922]", "https://www.marxists.org/archive/luxemburg/1918/russian-revolution/ch06.htm", "thinks differently"),
  mia("src_mia_witbd", "What Is to Be Done? Burning Questions of Our Movement", "V. I. Lenin", "1902", "https://www.marxists.org/archive/lenin/works/1901/witbd/", "What Is To Be Done"),
  mia("src_mia_onestep", "One Step Forward, Two Steps Back", "V. I. Lenin", "1904", "https://www.marxists.org/archive/lenin/works/1904/onestep/", "One Step Forward"),
  mia("src_mia_two_tactics", "Two Tactics of Social-Democracy in the Democratic Revolution", "V. I. Lenin", "1905", "https://www.marxists.org/archive/lenin/works/1905/tactics/", "Two Tactics"),
  mia("src_mia_imperialism", "Imperialism, the Highest Stage of Capitalism", "V. I. Lenin", "written 1916 [published 1917]", "https://www.marxists.org/archive/lenin/works/1916/imp-hsc/", "Imperialism"),
  mia("src_mia_april_theses", "The Tasks of the Proletariat in the Present Revolution (the April Theses)", "V. I. Lenin", "1917", "https://www.marxists.org/archive/lenin/works/1917/apr/04.htm", "April"),
  mia("src_mia_renegade", "The Proletarian Revolution and the Renegade Kautsky", "V. I. Lenin", "1918", "https://www.marxists.org/archive/lenin/works/1918/prrk/", "Renegade Kautsky"),
  mia("src_mia_basel", "Manifesto of the International Socialist Congress at Basel", "Second International", "1912", "https://www.marxists.org/history/international/social-democracy/1912/basel-manifesto.htm", "Basel"),
  mia("src_mia_zimmerwald", "The Zimmerwald Manifesto", "International Socialist Conference at Zimmerwald", "1915", "https://www.marxists.org/history/international/social-democracy/zimmerwald/manifesto-1915.htm", "Zimmerwald"),

  /* ——— Second International: scholarship ——— */
  book("src_gay_bernstein", "The Dilemma of Democratic Socialism: Eduard Bernstein’s Challenge to Marx", "Peter Gay", "1952", "Columbia University Press", "New York", "ACADEMIC", { title: "The Dilemma of Democratic Socialism", author: "Peter Gay" }),
  book("src_steger_bernstein", "The Quest for Evolutionary Socialism: Eduard Bernstein and Social Democracy", "Manfred B. Steger", "1997", "Cambridge University Press", "Cambridge", "ACADEMIC", { title: "The Quest for Evolutionary Socialism", author: "Steger" }),
  book("src_salvadori_kautsky", "Karl Kautsky and the Socialist Revolution, 1880–1938", "Massimo Salvadori", "1979", "New Left Books", "London", "ACADEMIC", { title: "Karl Kautsky and the Socialist Revolution", author: "Salvadori" }),
  book("src_steenson_kautsky", "Karl Kautsky, 1854–1938: Marxism in the Classical Years", "Gary P. Steenson", "1978", "University of Pittsburgh Press", "Pittsburgh", "ACADEMIC", { title: "Karl Kautsky, 1854-1938", author: "Steenson" }),
  book("src_nettl_luxemburg", "Rosa Luxemburg", "J. P. Nettl", "1966 (2 vols.)", "Oxford University Press", "London", "ACADEMIC", { title: "Rosa Luxemburg", author: "Nettl" }),
  book("src_baron_plekhanov", "Plekhanov: The Father of Russian Marxism", "Samuel H. Baron", "1963", "Stanford University Press", "Stanford", "ACADEMIC", { title: "Plekhanov", author: "Baron" }),
  book("src_harding_lenin", "Lenin’s Political Thought", "Neil Harding", "1977–81 (2 vols.)", "Macmillan", "London", "ACADEMIC", { title: "Lenin's Political Thought", author: "Harding" }),
  book("src_lih_lenin", "Lenin Rediscovered: What Is to Be Done? in Context", "Lars T. Lih", "2006 [paperback 2008]", "Brill", "Leiden", "ACADEMIC", { title: "Lenin Rediscovered", author: "Lih" }),
  book("src_service_lenin", "Lenin: A Biography", "Robert Service", "2000", "Macmillan", "London", "SECONDARY", { title: "Lenin", author: "Robert Service" }),
];
