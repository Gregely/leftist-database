/**
 * The content API. Pages and route handlers import from here and nowhere
 * else; nothing in the UI reads the database or hard-codes content.
 *
 * Every function is server-only, async and safe to call from React Server
 * Components, route handlers and server actions.
 */
export {
  countByKind,
  getArchiveStats,
  getEntitiesByIds,
  getRelations,
  lettersFor,
  listEntities,
  resolveMovedSlug,
  getMediaFor,
} from "./core";
export { getThinker, withTendencies } from "./thinkers";
export { getConcept, getRelatedConcepts, getConceptBriefs } from "./concepts";
export { getText, listTexts, type TextAggregate } from "./texts";
export { getTendency, getTendencyColors, getTendencyMemberIds, type TendencyAggregate } from "./tendencies";
export { getDebate, getDebatePositionLabels } from "./debates";
export { getEvent, getTimeline, getPreview, type EventAggregate } from "./events";
export { getPath, getStepDetours, listPaths } from "./paths";
export { getGuidedJourney, getGuidedStepContent, isGuidedPath, listGuidedJourneys } from "./guided";
export { search, lookupEntities } from "./search";
export { listSources, getSource } from "./sources";
export { ATLAS_KINDS, getAtlasGraph, getGraph, getNeighborhood } from "./graph";
export { getHomeData } from "./home";
export { getGeography, type Geography, type GeoPlace, type GeoEntry, type GeoLink } from "./geography";
export type * from "./types";
export type { TimelineItem, TimelineLane, Preview } from "./events";
export type { DebatePosition, DebateArgument, DebateAggregate } from "./debates";
export type { PathStep, PathAggregate, PathListing } from "./paths";
export type { GuidedJourney, GuidedListing, GuidedStep, GuidedStepContent, GuidedLevel } from "./guided";
export type { SearchResults, SearchHit } from "./search";
export type { ThinkerAggregate } from "./thinkers";
export type { ConceptAggregate } from "./concepts";
