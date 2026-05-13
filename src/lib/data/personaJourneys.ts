/**
 * Per-persona journey maps + clickable moment hotspots.
 *
 * **Source of truth:** `Classeur Journey.xlsx` sheet *Personae Journey*, ingested by
 * `scripts/ingest_personae_journey_excel.py` into `personaeJourneyExcel.generated.ts`
 * (moment order, labels, hotspot geometry) and `journeyStepsFromExcel.generated.ts`
 * (per-moment module lists).
 */

import type { JourneyHotspot } from './types';
import { PERSONA_JOURNEYS_EXCEL } from './personaeJourneyExcel.generated';

export interface PersonaJourneyMoment {
  /** JourneyStep id — used for routing + data lookup. */
  id: string;
  /** Pill label shown on the map. */
  label: string;
  /** Percent coordinates of the clickable box over the image (0–100). */
  left: number;
  top: number;
  w: number;
  h: number;
}

export interface PersonaJourneyDef {
  /** Image path (local). */
  image: string;
  /** Ordered moment pills shown on the artwork (Excel row order). */
  moments: PersonaJourneyMoment[];
}

/** Manual journey maps not yet in Classeur Journey.xlsx (demo / pilot personas). */
const PERSONA_JOURNEYS_MANUAL: Record<string, PersonaJourneyDef> = {
  'exemple-minor': {
    image: '/images/catalogue/assets/journeys/iso-journey-work-white-collar.svg',
    moments: [
      { id: 'exemple-minor__commute', label: 'Commute', left: 2.0, top: 77.0, w: 16.0, h: 10.0 },
      { id: 'exemple-minor__welcome-area', label: 'Welcome Area', left: 22.0, top: 77.0, w: 16.0, h: 10.0 },
      { id: 'exemple-minor__workplace', label: 'Workplace', left: 42.0, top: 77.0, w: 16.0, h: 10.0 },
      {
        id: 'exemple-minor__food-beverage-area',
        label: 'Food & Beverage Area',
        left: 62.0,
        top: 77.0,
        w: 16.0,
        h: 10.0,
      },
      {
        id: 'exemple-minor__wellbeing-breaktime',
        label: 'Wellbeing & Breaktime',
        left: 82.0,
        top: 77.0,
        w: 16.0,
        h: 10.0,
      },
    ],
  },
};

export const PERSONA_JOURNEYS: Record<string, PersonaJourneyDef> = {
  ...(PERSONA_JOURNEYS_EXCEL as Record<string, PersonaJourneyDef>),
  ...PERSONA_JOURNEYS_MANUAL,
};

/** Convert a journey def's moments into the app's JourneyHotspot shape. */
export function hotspotsFromJourney(def: PersonaJourneyDef): JourneyHotspot[] {
  return def.moments.map((m) => ({ stepId: m.id, left: m.left, top: m.top, w: m.w, h: m.h }));
}

/** Resolve the journey map image for a persona. */
export function resolveJourneyMapImage(personaId: string): string | undefined {
  return PERSONA_JOURNEYS[personaId]?.image;
}

/** Resolve clickable hotspots for a persona. */
export function resolveJourneyHotspots(personaId: string): JourneyHotspot[] {
  const def = PERSONA_JOURNEYS[personaId];
  return def ? hotspotsFromJourney(def) : [];
}
