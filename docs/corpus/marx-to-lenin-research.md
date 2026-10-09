# From Marx to Lenin (1883–1917) — research dossier

The research basis for the **Marx to Lenin Corpus** (`corpus/marx-to-lenin/`) and the Guided journey *From Marx to
Lenin* (`corpus/guided-marx-to-lenin/`). It records the scope, the decisions behind it, the sources and quotations
checked, and the questions left open for reviewers. Nothing here is public.

## Scope

**Period.** From Marx's death (March 1883) to the October Revolution (October 1917). The endpoint is hard: Lenin's
successors, the Communist International, the civil war and later Marxist schools are left out, except for one-line
retrospective notes where a biography would otherwise stop mid-sentence (Trotsky, Bukharin, Zetkin, Kollontai,
Hilferding, Bauer and Martov all lived past 1917).

**Starting point.** The Initial Marx Corpus already reaches 1917. It holds the spine of the period: Kautsky,
Plekhanov, Bernstein, Luxemburg and Lenin; social democracy; the Anti-Socialist Laws, the Second International, the
Erfurt Programme, the revisionism controversy, the 1903 split, 1905, Basel, August 1914, Zimmerwald and the two
revolutions of 1917; *What Is to Be Done?*, *Reform or Revolution*, *The Mass Strike*, *Imperialism* and *The State and
Revolution*; and the debates on reform or revolution, spontaneity and organisation, the war and revolution in
Russia. This corpus does not rewrite those entries. It fills the gaps around them, so that the period reads as an
international argument rather than a line from Marx to Lenin.

**What the gaps were.** Measured against the standard histories (Joll, Haupt, Eley, Sassoon, Kołakowski), the existing
collection had almost nothing on:

1. **Engels's last years and the shape of orthodoxy**: the 1895 Introduction and its use in the reform debate;
   Kautsky's *Class Struggle* as the textbook of the International; Labriola's alternative.
2. **France and the wider socialist family**: Jaurès and Guesde, the Millerand case and "ministerialism", the
   Amsterdam congress; revolutionary syndicalism, the general strike, Sorel; the Fabians and William Morris; the IWW.
3. **The woman question**: Bebel, Zetkin, Kollontai, the socialist women's conferences of 1907 and 1910 and the
   origin of International Women's Day. The sample entry on Engels's *Origin of the Family* needed revision.
4. **Russian Marxism before Bolshevism**: the populists Marxism defined itself against; Lenin's *Development of
   Capitalism in Russia*; Martov and the Mensheviks; Trotsky, the 1905 soviet and permanent revolution.
5. **Nations**: national self-determination, Austro-Marxist national-cultural autonomy, Luxemburg against both,
   Lenin's position, Connolly and the Easter Rising.
6. **Imperialism as a theoretical problem**: Hobson, Hilferding's finance capital, Luxemburg's *Accumulation of
   Capital* (a sample entry needing revision), Kautsky's ultra-imperialism, Bukharin, the labour aristocracy, and
   the colonial debate at Stuttgart in 1907.
7. **The war and 1917 as argument**: Jaurès's assassination, revolutionary defeatism, the Junius pamphlet, dual
   power and the April Theses.

## Shape of the corpus

| Batch | Theme | New entries |
| --- | --- | --- |
| `m1` | The International after Engels: orthodoxy, its rivals, the general strike | Engels's 1895 Introduction; Kautsky's *Class Struggle*; Labriola and his *Essays*; Bebel; Guesde; Jaurès; ministerialism; the Millerand case; the Amsterdam congress; Fabianism and the *Fabian Essays*; Morris and *News from Nowhere*; revolutionary syndicalism; Sorel and *Reflections on Violence*; the general strike; the Charter of Amiens; the IWW; debate: *What is the general strike for?* |
| `m2` | The woman question | the woman question; the socialist women's movement; *Woman and Socialism*; Zetkin and her 1896 Gotha speech; Kollontai and *The Social Basis of the Woman Question*; the Copenhagen women's conference (1910); debate: *How are women to be emancipated?*; revision of *The Origin of the Family* |
| `m3` | Russian Marxism: populism, factions, 1905 | Russian populism; *The Development of Capitalism in Russia*; Economism; Martov; Menshevism; Bolshevism; Trotsky; *Results and Prospects*; permanent revolution; soviets |
| `m4` | Nations and empire | national self-determination; national-cultural autonomy; Austro-Marxism; Otto Bauer and *The Question of Nationalities*; Luxemburg's *National Question and Autonomy*; Lenin's *Right of Nations to Self-Determination*; Connolly and *Labour in Irish History*; the Easter Rising; the Jewish Labour Bund; Hobson and *Imperialism: A Study*; Hilferding and *Finance Capital*; finance capital; ultra-imperialism; Bukharin and *Imperialism and World Economy*; the labour aristocracy; the Stuttgart congress; debates: *Do nations have a right to their own state?* and *What drives imperialism?*; revision of *The Accumulation of Capital* |
| `m5` | War and revolution, 1914–17 | the assassination of Jaurès; revolutionary defeatism; the Junius pamphlet; dual power; the April Theses; connecting relationships and review notes on existing entries |
| `g1` | Guided journey (`corpus/guided-marx-to-lenin/`) | *From Marx to Lenin*: 19 stops and 71 side routes |

As imported: 68 new entries (15 thinkers, 13 concepts, 20 texts, 8 tendencies, 8 events, 4 debates), two rewritten
sample entries, five existing entries annotated with review notes or citations, 296 relationships, 34 excerpts (all
matched verbatim against their archive pages), 60 new source records and 39 reused ones. Entry counts were not a
target; each entry exists because a later step of the argument needs it. Economism, the Bund and Bukharin's
*Imperialism and World Economy* were added during writing, when the entries on the 1903 split, the national question
and ultra-imperialism turned out to need them.

## Revising rather than recreating

- **Rewritten:** the sample entries *The Origin of the Family* (1884) and *The Accumulation of Capital* (1913), which
  sit squarely in the period and were placeholder text. The rewrite keeps their slugs and history.
- **Not rewritten:** the Initial Marx entries on the same period. They are already researched and, in production,
  published; rewriting them would replace reviewed text. The corpus connects to them through relationships instead,
  which stay staged until the new entries are published.
- **Annotated:** review notes (not text changes) are added where the new research bears on an existing entry:
  the *Leninism* tendency (terminology, and its alias "Bolshevism"); *Imperialism* (Hobson and Hilferding now have
  source records, answering its *Missing source* flag; its aliases "Finance capital" and "Ultra-imperialism" now
  duplicate new entries); *Vanguard party* (Trotsky's 1904 critique now has a source); *Revolution* (its alias
  "Permanent revolution" duplicates a new entry); and the debate *Could Russia make a socialist revolution?*, whose
  Trotsky position has no holder and says Trotsky "is not yet an entry". New source records are attached as
  citations. The importer treats an entity with no fields as such an annotation and leaves its text alone.
- **Existing debates are not restructured.** The importer replaces a debate's positions when it imports one, so the
  new arguments (the general strike, women, nations, imperialism) are new debates rather than additions to *Reform
  or revolution?* or *Socialists and the war*.

## Terminology

- **No "socialist feminism".** The term belongs to the 1970s. Socialists of this period spoke of the *woman question*
  (*Frauenfrage*, *zhenskii vopros*) and of a *proletarian* or *socialist women's movement*, which they defined
  against "bourgeois" feminism; the entries use their terms and say that later historians grouped them under
  socialist feminism.
- **"Bolshevism", not "Leninism", before 1917.** *Bolshevik* and *Menshevik* date from the 1903 congress. "Leninism"
  appears in Menshevik polemic before 1917 but became the name of a doctrine only after 1924. A new *Bolshevism*
  tendency carries the pre-1917 story; the existing *Leninism* entry is left as it is with a review note on its
  terminology and overlap.
- **"Social democrat"** means a member of the Marxist parties of the International, not a reformist. "Communist" is
  used only for Marx and Engels's usage and for Lenin's April 1917 proposal to rename the party.
- **Austro-Marxism** is used because the name was current from about 1904 (it is usually credited to the American
  socialist Louis Boudin); **revolutionary syndicalism** and **Fabian** are contemporary names; **ministerialism**
  is the term used in the debate of 1899–1904.
- Dates in Russia before February 1918 are given in the Julian (Old Style) calendar where the events are known by
  them ("the October Revolution"), with the Western date in brackets where it matters.

## Quotations

Every quotation added by the corpus is an excerpt matched verbatim against an online transcription (run
`npm run corpus -- verify marx-to-lenin`); none is marked *Verified*, which needs a printed edition. Wording follows
the transcription, so older translations keep their spelling ("dishonored", "civilising").

| Excerpt | Source | Note |
| --- | --- | --- |
| Engels: "The irony of history turns everything upside down…" | 1895 Introduction, MIA | Translation of the text as first printed; the cuts made in 1895 are discussed on the entry |
| Kautsky's *Class Struggle* | (existing excerpts) | Reused, not duplicated |
| Labriola: "Critical communism – that is its true name…" | *Essays*, MIA (Kerr translation) | |
| Webb: "important organic changes can only be (1) democratic…" | *Fabian Essays* (1889), Project Gutenberg | |
| Morris: "That massacre of Trafalgar Square began the civil war…" | *News from Nowhere*, MIA | Fiction: a character speaks |
| Jaurès: "A society takes on a new form only when the immense majority…" | *Studies in Socialism*, MIA (Minturn trans. 1906) | |
| Bebel: "For there can be no liberation of mankind without social independence and equality of the sexes." | *Woman and Socialism*, MIA (Meta Stern trans. 1910) | |
| Engels (three): "…the production and reproduction of the immediate essentials of life"; "The overthrow of mother-right was the world historical defeat of the female sex"; "The first class opposition…" | *Origin of the Family*, preface and ch. II, MIA | For the rewritten entry and the woman question |
| Zetkin (two): "…a joint struggle with the male of her class…"; "We must not conduct special women's propaganda…" | Gotha speech, 1896, MIA (Foner ed.) | |
| Kollontai: "…equal rights at the present time are, for the proletarian women, only a means…" | *Social Basis*, MIA (Holt trans.) | Abstract only online |
| Lenin: "…examine the whole process of the development of capitalism in Russia…" | *Development of Capitalism*, preface, MIA | |
| Trotsky (1904): "…not a substitute for the proletariat, but its political leader." | *Our Political Tasks*, MIA | |
| Trotsky (1906): "It is possible for the workers to come to power in an economically backward country…" | *Results and Prospects*, MIA | Existing excerpt "Without the direct State support…" kept |
| Marx & Engels (1850): "…to make the revolution permanent…" | Address to the Communist League, MIA | Pre-1883 source of the term |
| Lenin (1917): "…it has brought about a dual power." | "The Dual Power", MIA | |
| Luxemburg (1908–09): "The right of nations to self-determination” is at first glance a paraphrase…" | *National Question and Autonomy*, MIA | |
| Lenin (1914): "The bourgeois nationalism of any oppressed nation has a general democratic content…" | *Right of Nations*, ch. 4, MIA | |
| Connolly: "…urging upon the Irish toilers, as a sacred national and religious duty…" | *Labour in Irish History*, foreword, MIA | |
| Lenin (1916): "The term ‘putsch’, in its scientific sense…" | "The Discussion on Self-Determination Summed Up", MIA | On the Easter Rising |
| Hobson: "It is this economic condition of affairs that forms the taproot of Imperialism." | *Imperialism: A Study*, I.6, MIA | |
| Hilferding (three): definition of finance capital; "Finance capital does not want freedom, but domination…"; "…cannot be free trade, but only socialism." | *Finance Capital*, chs. 14, 22, 25, MIA (Bottomore ed.) | |
| Kautsky (1914): "…a phase of ultra-imperialism…" | "Ultra-imperialism", MIA | The transcription has a typo ("Jive" for "live") just before; the excerpt starts after it |
| Lenin (1907) on the colonial resolution at Stuttgart | "The International Socialist Congress in Stuttgart", MIA | Lenin gives the vote as 128 to 108 with ten abstentions |
| Lenin (1916): "…the desertion of a stratum of the labour aristocracy…" | "Imperialism and the Split in Socialism", MIA | |
| Engels: "They form an aristocracy among the working-class…" | Preface to the English edition of *The Condition of the Working Class* (1892), MIA | Quoting his article of 1885. Engels's letter of 7 October 1858 is not online at MIA and is only paraphrased |
| Bukharin: "For imperialism, as we all know, is nothing but the expression of competition between state capitalist trusts." | *Imperialism and World Economy*, ch. 12, MIA | |
| Luxemburg (1913): "Capitalism is the first mode of economy with the weapon of propaganda…" | *Accumulation of Capital*, ch. 32, MIA | For the rewritten entry |
| Lenin (1915): "During a reactionary war a revolutionary class cannot but desire the defeat of its government." | "The Defeat of One's Own Government…", MIA | |
| Luxemburg (1915): "Violated, dishonored, wading in blood, dripping filth…" | Junius pamphlet, ch. 1, MIA | Existing excerpt on "barbarism" kept |
| Lenin (1917): "The specific feature of the present situation in Russia…" | April Theses, thesis 2, MIA | Existing excerpt "Not a parliamentary republic…" (on the February Revolution) kept |

**Not quoted, deliberately.** Sorel's *Reflections on Violence*, Bauer's *Question of Nationalities*, the IWW
preamble and the Charter of Amiens are not available in a checkable online transcription; they are paraphrased and
cited to printed editions and scholarly studies. Jaurès's line that capitalism "carries war within it as clouds carry
the storm" is widely quoted but its wording varies between sources and no transcription was found, so it is not used.
The phrase "the inevitability of gradualness" is Webb's, but from 1923, and is not attributed to the Fabians of this
period. "General strike is general nonsense" is often attributed to the union leader Ignaz Auer; it is not used.

## Sources

Primary texts are cited from the Marxists Internet Archive (and, for the *Fabian Essays*, Project Gutenberg), each
with an online check. Secondary works were limited to standard scholarly studies checked against Open Library:

- General: Joll, *The Second International*; Haupt, *Socialism and the Great War*; Eley, *Forging Democracy*;
  Sassoon, *One Hundred Years of Socialism*; Kołakowski, *Main Currents of Marxism*; Hobsbawm, *The Age of Empire*.
- Germany: Schorske, *German Social Democracy 1905–1917*; Steenson and Salvadori on Kautsky; Maehl, *August Bebel*;
  Quataert, *Reluctant Feminists in German Social Democracy*.
- France: Goldberg, *The Life of Jean Jaurès*; Stuart, *Marxism at Work*; Jennings, *Syndicalism in France* and his
  edition of Sorel.
- Britain, Ireland, the United States: MacKenzie, *The First Fabians*; Thompson, *William Morris*; Nevin, *James
  Connolly*; Townshend, *Easter 1916*; Dubofsky, *We Shall Be All*.
- Russia: Venturi, *Roots of Revolution*; Walicki; Haimson, *The Russian Marxists and the Origins of Bolshevism*;
  Getzler, *Martov*; Deutscher, *The Prophet Armed*; Knei-Paz on Trotsky; Lih; Harding; Rabinowitch, *The Bolsheviks
  Come to Power*; S. A. Smith, *Russia in Revolution*; Cohen, *Bukharin and the Bolshevik Revolution*.
- Women: Boxer and Quataert (eds), *Socialist Women*; Stites, *The Women's Liberation Movement in Russia*; Clements,
  *Bolshevik Feminist*.
- Russia (additions): Anweiler, *The Soviets*; Tobias, *The Jewish Bund in Russia*; Frankel, *Prophecy and Politics*.
- Nations and imperialism: Bottomore and Goode, *Austro-Marxism*; Nimni's edition of Bauer; Connor, *The National
  Question in Marxist-Leninist Theory and Strategy*; Brewer, *Marxist Theories of Imperialism*; Day and Gaido (eds),
  *Discovering Imperialism* and *Witnesses to Permanent Revolution*; Cain, *Hobson and Imperialism*.

No page numbers are given; locators are chapters, parts, sections and dates.

## Disputed and uncertain points (flagged for review)

- **Engels's 1895 Introduction.** It was cut before publication at the party executive's request, and Liebknecht's
  *Vorwärts* printed extracts that made Engels look like a convert to legality, which he protested in letters of
  April 1895. Revisionists later read it as Engels's "testament"; the full text was published only in 1930. The entry
  presents both readings and the textual history.
- **The Stuttgart colonial vote.** Lenin gives 128 to 108 with ten abstentions; some secondary accounts give 127 to
  108. The entry uses Lenin's figure, attributed.
- **Origins of International Women's Day.** The Copenhagen conference (1910) approved an annual women's day without
  fixing a date; the first was held on 19 March 1911; 8 March became usual from 1913–14. The American Socialist
  Party's "National Woman's Day" of 1909 is often cited as the model. The story of a New York demonstration of 1857 is
  a later invention and is not repeated.
- **Who coined "Austro-Marxism"** (Boudin, around 1904) and **the first soviet** (Ivanovo-Voznesensk, May 1905, or
  St Petersburg, October 1905) are given with "usually"; specialist review flags are attached.
- **Permanent revolution.** Trotsky's and Parvus's respective shares in the 1905 theory are disputed (Day and Gaido);
  the entry names both.
- **Lenin and permanent revolution in April 1917.** Old Bolsheviks (Kamenev) accused Lenin of "Trotskyism"; whether
  the April Theses adopted Trotsky's perspective is a long-running dispute and is presented as one.
- **Revolutionary defeatism.** How literally to read Lenin's slogans of 1914–15 (Trotsky and many Bolsheviks objected)
  is presented through the documents; Lih's and Harding's readings are cited.
- **Sorel's later politics** (the nationalist Cercle Proudhon, praise of Lenin in 1919) lie outside the period and are
  mentioned only as later reception.
- **"Socialism or barbarism."** Luxemburg attributes the alternative to Engels; no such sentence has been found in
  Engels. The nearest earlier wording is in Kautsky's *Class Struggle* (1892), already an excerpt on the Kautsky
  entry. The Junius entry says this and carries a review flag.
- **Checked during writing:** Lenin's sentence on a "pure" social revolution (1916), quoted in the Easter Rising
  entry, against the archive page; Hobson's "inter-Imperialism" against Part II, ch. 6 of the 1902 text; the phrase
  from *Capital* on "a higher form of the family" against ch. 15.
- **Connolly's synthesis of nationalism and socialism** is contested between nationalist, socialist and revisionist
  Irish historians; the entry gives the positions without adjudicating.

## Open questions for the editors

- Several existing entries carry aliases that now duplicate new titles (*Leninism*: "Bolshevism"; *Imperialism*:
  "Finance capital", "Ultra-imperialism"; *Revolution*: "Permanent revolution"). Each has a review note; the import
  did not change them.
- Should a *Leninism* entry describing a post-1917 doctrine remain in a collection whose Guided journey ends in
  1917, or should it be renamed or scoped? (Review note on the entry.)
- The corpus has no entry on the **Second International's congresses before 1904** (Brussels 1891, Zurich 1893, London
  1896, Paris 1900) or on **Kienthal** (1916); they are covered inside other entries. Add them if the timeline needs
  them.
- **Anarchism in the period** (Kropotkin's *Conquest of Bread*, Malatesta, the 1914 *Manifesto of the Sixteen*) is
  only connected through relationships to the existing sample entries; a dedicated anarchism corpus would serve it
  better than piecemeal additions here.
- **Non-European socialism** (Sun Yat-sen's "people's livelihood", Japanese socialism, Indian and Egyptian
  nationalists' encounters with socialism) is outside the scope set for this corpus and is a real gap.
