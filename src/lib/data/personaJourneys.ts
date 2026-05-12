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

export const PERSONA_JOURNEYS: Record<string, PersonaJourneyDef> =
  PERSONA_JOURNEYS_EXCEL as Record<string, PersonaJourneyDef>;

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
