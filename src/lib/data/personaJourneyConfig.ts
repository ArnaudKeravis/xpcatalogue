/**
 * Journey map image + hotspot defaults by area / persona.
 * Kept in sync with `XP-catalogue-journey.csv` (Figma nodes + local asset keys).
 */

import type { Area, JourneyHotspot } from './types';

export const JOURNEY_MAP_WORK = '/images/catalogue/figma/journey-work-white-collar.svg';
export const JOURNEY_MAP_WORK_BLUE_COLLAR = '/images/catalogue/figma/journey-work-blue-collar.svg';
export const JOURNEY_MAP_LEARN = '/images/catalogue/figma/journey-learn.svg';
export const JOURNEY_MAP_HEAL = '/images/catalogue/figma/journey-heal.svg';
export const JOURNEY_MAP_PLAY = '/images/catalogue/figma/journey-play.svg';

/** Optional per-persona map override (e.g. Blue Collar Figma `2067:297533`). */
const JOURNEY_MAP_BY_PERSONA: Record<string, string> = {
  'blue-collar': JOURNEY_MAP_WORK_BLUE_COLLAR,
};

export function resolveJourneyMapImage(personaId: string, area: Area): string {
  return JOURNEY_MAP_BY_PERSONA[personaId] ?? resolveJourneyMapImageByArea(area);
}

export function resolveJourneyMapImageByArea(area: Area): string {
  switch (area) {
    case 'learn':
      return JOURNEY_MAP_LEARN;
    case 'heal':
      return JOURNEY_MAP_HEAL;
    case 'play':
      return JOURNEY_MAP_PLAY;
    default:
      return JOURNEY_MAP_WORK;
  }
}

/** Hotspot layout matches the simplified SVG for each area (Figma isometric ellipses where available). */
export function resolveJourneyHotspots(
  personaId: string,
  area: Area,
  work: JourneyHotspot[],
  workBlue: JourneyHotspot[],
  learn: JourneyHotspot[],
  heal: JourneyHotspot[],
  play: JourneyHotspot[]
): JourneyHotspot[] {
  if (personaId === 'blue-collar') return workBlue;
  switch (area) {
    case 'learn':
      return learn;
    case 'heal':
      return heal;
    case 'play':
      return play;
    default:
      return work;
  }
}
