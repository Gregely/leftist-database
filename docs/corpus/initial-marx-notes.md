# Initial Marx Corpus — research notes

Companion to the generated review queue ([`initial-marx-review.md`](initial-marx-review.md)). The queue lists what
each entry needs; this page records decisions, known problems and gaps across the corpus. Nothing here is public.

## Scope and sources

- **Period.** From German Idealism, classical political economy and early socialism to the end of the Second
  International (1917–19). Later Marxism (Lukács, Gramsci, Trotsky as a thinker, the Comintern) is deliberately left
  for a later corpus; existing sample entries on it were not changed.
- **Primary texts** are cited from the Marxists Internet Archive (MIA) transcriptions, which can be checked online, and
  from standard editions recorded as sources (MECW; Moore–Aveling and Fowkes for *Capital*; Nicolaus for the
  *Grundrisse*; Tudor for Bernstein). MIA texts are often old translations (Moore–Aveling, Aveling, Bohn, Harvey):
  wording differs from current scholarly translations, and two of them (Bernstein's *Evolutionary Socialism*, Kautsky's
  *Road to Power*) are abridged.
- **Secondary literature** is limited to well-known scholarly works checked against Open Library. Locators are
  chapters, sections, letters and dates — no page numbers were supplied by the corpus.

## Quotations

- **65 excerpts**, each matched verbatim against its archive transcription (`verification.json`), are marked *Needs
  review*: the wording matches the online transcription, not yet a printed edition. None is marked *Verified*.
- One corpus excerpt (Manifesto, “The history of all hitherto existing society…”) duplicated an existing sample excerpt
  and was not added; the sample record was left as it was and a note added instead.
- **Not quoted, deliberately:** Proudhon's “Property is theft!” (the MIA transcription has a typographical error);
  Marx's 1857 “deluge” letter (not found online); Lenin's 1905 remark that the working class is “instinctively”
  social-democratic (the archive page returned 404); the SPD's declaration of 4 August 1914 (no reliable online
  text). These points are paraphrased with secondary citations or omitted.
- **Short phrases quoted in prose** were matched against the archive pages during writing; several that did not match
  were corrected (Thesis III, the Brumaire, the 1859 Preface, “all that is solid melts into air”, the stomach/fancy
  passage in *Capital*, Engels's 1891 introduction to *Wage Labour and Capital*, “money which begets money”, the
  Augier quotation in *Capital* ch. 31, Lenin on Engels's “no longer a state in the proper sense”).

## Disputed or uncertain attributions (flagged on the entries)

- “Socialism or barbarism”: Luxemburg (1915) attributed it to Engels; no source in Engels has been found, and
  Kautsky's *The Class Struggle* (1892) has “we must either move forward into socialism or fall back into barbarism”.
  Both passages are excerpted with notes.
- “All I know is that I am not a Marxist” is Engels's report of Marx (letter to Schmidt, 1890).
- “From each according to his ability…” predates Marx; the note mentions Louis Blanc cautiously.
- “Dialectical materialism” is usually credited to Plekhanov (1891); Dietzgen's earlier usage is flagged.
- “False consciousness” is attributed to Engels's letter to Mehring (1893), but no source record exists yet.

## Points for specialist review

The queue lists 21 specialist-review flags. The most consequential:

- Kautsky's exact position in the SPD Reichstag group on 3–4 August 1914, and the group's internal vote (not stated).
- Luxemburg's attitude to the January 1919 rising, and responsibility for the murders (Gietinger).
- Casualty figures for the Paris Commune's “Bloody Week” (no figure given; older estimates have been revised).
- The reading of *What Is to Be Done?* (Lih's revisionist reading against the “textbook” interpretation) is presented
  as an open question, as are the character of October (revolution or coup) and continuity from Lenin to Stalin.
- Image provenance: Engels's photographer and date; the Luxemburg portrait's date; the Manifesto cover's holding
  library; the Commune barricade's location (the shop sign reads Boulevard du Prince-Eugène); the Marx portrait's
  date (embedded agency metadata said “circa 1865” and was stripped from the file).

## Missing sources

Seven entries carry a *Missing source* flag: e.g. the Cambridge capital controversy (concept *Capital*), Hilferding's
*Finance Capital* (cited via Kołakowski), Trotsky's 1904 critique of Lenin (mentioned under *Vanguard Party*).

## Catalogue discrepancies found during verification

Open Library's dates differ from the corpus records for Breckman (1998 vs 1999), Lih (2005 vs 2006), S. A. Smith's
*Russia in Revolution* (2018 vs 2017) and Rosdolsky (German original 1968; the catalogue's first-publication years
are for later editions). The Beecher (Fourier) lookup matched a different book; Collins & Abramsky is catalogued
under Collins only. The corpus records follow the title pages as cited in the scholarly literature; check before
publication.

## Overlap with sample content

54 existing sample entries were amended rather than duplicated. Their public versions are unchanged until published.
Older sample relationships and excerpts stay attached (the corpus never removes public rows), so reviewers should
check, for example:

- the sample concept *Capitalism* lists “Capital” as an alias, which now collides with the new concept *Capital*;
- the sample excerpt on *Commodity* gives a page locator (“Chapter 1, p. 125”) from the seed data;
- sample relationships on amended entries were not re-sourced.

## Incident during the import (resolved)

While importing batch 3 on the development database, the importer updated an existing **public** sample excerpt (the
Manifesto's opening sentence on *Class Struggle*), changing its note and verification status on the public site. It
was restored through the editorial library; the audit log recorded both edits. The importer now only updates excerpts
it created, and `npm run corpus -- check` reports any import edit to a record it did not create. The current database
was rebuilt from scratch (`db:reset` + full import) after the fix, and the check is clean.

## Entities the corpus mentions but does not define

People: Lassalle, Bebel, Wilhelm and Karl Liebknecht, Trotsky, Martov, Axelrod, Zasulich, Hilferding, Bukharin,
Labriola, Jaurès, Millerand, Bruno Bauer, Stirner, Moses Hess, Blanqui, Babeuf, Hobson, the Webbs. Texts: *The Holy
Family*, *The Poverty of Philosophy*, *Wage Labour and Capital*, *Anti-Dühring*, *Capital* II–III, *Theories of
Surplus-Value*, *Two Tactics*, *The Development of Capitalism in Russia*, *The Junius Pamphlet*, *Results and
Prospects*. Events: the founding of the RSDLP (1898), the Saint-Imier congress (1872), the German Revolution of
November 1918, Brest-Litovsk. Tendencies: Menshevism, Blanquism, Fabianism, Narodism. They are named in prose without
links and are good candidates for the next corpus.

## Architecture notes

- Lists, relationship labels and desk tables show the **published title** of a live entry that has a pending version
  (e.g. “First steps into Marxism”, “Social Democracy & Revisionism”) until it is published.
- Staged relationships are released with one context entry (`on`). If that entry is never published, the
  relationship stays hidden even when both endpoints are live.
- The collection scope applies to entry previews; the public timeline, map and search pages cannot yet be viewed with
  the collection's drafts included.
- There is no desk button to discard a staged debate or path structure; only the importer resets one.
- Debate positions and arguments are plain text and cannot carry citations, so attributions there are written out and
  the sources are cited in the debate's background.
- Inline citations in a live entry's working copy are synced into the citations table only when it is published (the
  desk checks read them from the prose in the meantime).
