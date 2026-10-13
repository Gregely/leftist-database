# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: curious newcomers to socialist thought who want a trustworthy way in. They arrive knowing a few names
(Marx, Lenin, Luxemburg) or a few words (alienation, the state), and need to be told where to start, what an idea
means at a depth they can manage, and how it connects to the rest. Guided journeys and the three-depth concept
reader exist for them.

Secondary: students, teachers and readers who already know the field and use the Atlas as a reference for sources,
chronology, relationships, debates and maps.

Editors: the contributors, reviewers, editors and administrators who write, review and publish every entry through
the Atlas Editorial Desk (`/admin`).

## Product Purpose

A map of socialist thought: thinkers, concepts, texts, tendencies, debates and events, and the sourced relationships
between them. It exists so that a newcomer can find a way in and keep going, and so that every claim they meet can be
traced to a source. Success is a reader who follows a route from a first question to the primary texts and the
arguments around them, and trusts what they read on the way.

## Positioning

Openly of the left and written for people within or near it, but held to scholarly standards of sourcing and
fairness: disagreements inside the tradition are presented with their holders and evidence, not resolved by fiat.
What sets it apart is that relationships and sources are first-class data. Influence, critique, response and
affinity are explicit, cited links. They drive the Theory Map, Geography, the timeline and Guided journeys, rather
than being prose on separate pages.

## Operating Context

- Public site: Guided journeys (step by step), Explore (the whole collection), section indexes, entry pages with a
  depth reader, debates with position comparison, the timeline, the Theory Map (intellectual relations) and
  Geography (where things happened), search, and Saved entries kept in the reader's browser.
- Readers use it on phones and desktops alike; long reading sessions on entry pages and journeys.
- Every entry is written, reviewed and published through the editorial desk; drafts are never public. Research
  corpora are imported for review and never published automatically.

## Capabilities and Constraints

- Next.js (App Router) with a libSQL/SQLite database through Drizzle; pages get content only through
  `src/lib/data/index.ts`.
- Content, routes, editorial workflow and data are fixed product behaviour: design work does not change them.
- Sample records are clearly marked as samples; the corpora are unpublished until reviewed.
- Undecided: the name. "Theory Atlas" is a working title; nothing should depend on it being final.

## Brand Commitments

- Working name "Theory / ATLAS" (configured in `src/lib/site.ts`), not settled.
- Voice: plain, specific and fair; attributes claims to sources and historians; avoids promotional or generic
  phrasing (see the writing rules in `CLAUDE.md`).
- The incumbent editorial idiom (rules, labels, serif display, restrained red) is documented in
  `docs/ARCHITECTURE.md` and carried by the tokens in `src/app/globals.css`.

## Evidence on Hand

- Content: sample records, the Initial Marx and Marx-to-Lenin research corpora, Guided journeys and the Geography
  gazetteer under `corpus/`, with sources in the shared bibliography.
- There are no testimonials, user numbers, press or endorsements, and none may be invented.
- Quotations must be verified against their sources; none may be invented (`docs/EDITORIAL.md`).

## Product Principles

1. A way in before a way through: every surface should tell a newcomer where to start and what to read next.
2. Show the evidence: sources, locators and the basis of each relationship stay visible and one step away.
3. Fair to disagreement: positions are presented with their holders and their critics.
4. One collection, many routes: Guided, Explore, the maps and the timeline are different ways through the same
   sourced data, and none of them is the only way.
5. Drafts never leak: what is public is what an editor published.

## Accessibility & Inclusion

Committed in `docs/ARCHITECTURE.md`: semantic landmarks and headings, a skip link, visible focus rings, keyboard
access to maps and timelines (with list alternatives), a modal search dialog with combobox/listbox semantics,
reduced motion respected, and colour never the only carrier of meaning.
