import { MOMENT_HERO_RASTER } from '@/lib/data/momentHeroRaster.generated';

/**
 * Per-moment hero art: Excel-synced rasters first (`momentHeroRaster.generated.ts`),
 * then legacy isometric SVGs under `public/images/catalogue/assets/journeys/moments/`.
 *
 * Personas that follow the shared WORK / HEAL / LEARN / PLAY step orders map
 * by step index → `{stem}-{n}.svg`. When `n` exceeds numbered assets, falls
 * back to `{stem}.svg` (used for the last PLAY step on airport VIP, which has
 * four numbered frames).
 */

const MOM = '/images/catalogue/assets/journeys/moments';

const WORK_ORDER = [
  'commute',
  'welcome-area',
  'workplace',
  'wellbeing-break',
  'food-beverage-work',
] as const;

const HEAL_ORDER = ['morning-rounds', 'meal-service', 'meal-distribution', 'kitchen-prep'] as const;

const LEARN_ORDER = ['arrival-campus', 'morning-class', 'lunch-break', 'study-session'] as const;

const PLAY_ORDER = [
  'pre-match',
  'peak-service',
  'half-time',
  'full-time',
  'networking-lunch',
] as const;

function pathForStemIndex(stem: string, indexZero: number, maxNumbered: number): string {
  const n = indexZero + 1;
  if (n >= 1 && n <= maxNumbered) return `${MOM}/${stem}-${n}.svg`;
  return `${MOM}/${stem}.svg`;
}

function resolveOrdered(
  personaId: string,
  stepId: string,
  order: readonly string[],
  table: Record<string, { stem: string; max: number }>,
): string | undefined {
  const row = table[personaId];
  if (!row || row.max < 1) return undefined;
  const idx = order.indexOf(stepId as (typeof order)[number]);
  if (idx < 0) return undefined;
  return pathForStemIndex(row.stem, idx, row.max);
}

/** Persona id → `{ stem, max }` for WORK_ORDER steps. */
const WORK_MOMENT_STEMS: Record<string, { stem: string; max: number }> = {
  military: { stem: 'work-army-officer', max: 5 },
  'client-work': { stem: 'client-operation-director', max: 5 },
};

const HEAL_MOMENT_STEMS: Record<string, { stem: string; max: number }> = {
  doctor: { stem: 'heal-doctor', max: 6 },
  nurse: { stem: 'heal-nurse', max: 5 },
  senior: { stem: 'heal-senior', max: 4 },
  patient: { stem: 'heal-patient', max: 6 },
  'client-heal': { stem: 'client-operation-director', max: 5 },
};

const LEARN_MOMENT_STEMS: Record<string, { stem: string; max: number }> = {
  student: { stem: 'learn-student', max: 4 },
  schoolchild: { stem: 'learn-schoolchild', max: 4 },
  teacher: { stem: 'learn-teacher', max: 5 },
  'client-learn': { stem: 'client-operation-director', max: 5 },
};

const PLAY_MOMENT_STEMS: Record<string, { stem: string; max: number }> = {
  'sport-fan': { stem: 'play-football-fan', max: 5 },
  participant: { stem: 'play-event-participant', max: 11 },
  'vip-guest': { stem: 'play-vip-guest-stadium', max: 5 },
  /** Persona label "VIP guest airport" — four numbered beats + closing SVG. */
  tourist: { stem: 'play-vip-guest-airport', max: 4 },
  'client-play': { stem: 'client-operation-director', max: 5 },
};

/**
 * Optional per-moment hero image (beat-specific iso art).
 * Returns `undefined` when only the full journey map should be shown.
 */
export function resolveJourneyMomentImage(personaId: string, stepId: string): string | undefined {
  const rasterPersona =
    personaId === 'exemple-minor' && stepId.startsWith('exemple-minor__') ? 'white-collar' : personaId;
  const rasterStep =
    personaId === 'exemple-minor' && stepId.startsWith('exemple-minor__')
      ? stepId.replace(/^exemple-minor__/, 'white-collar__')
      : stepId;
  const raster = MOMENT_HERO_RASTER[rasterPersona]?.[rasterStep];
  if (raster) return raster;

  const w = resolveOrdered(personaId, stepId, WORK_ORDER, WORK_MOMENT_STEMS);
  if (w) return w;

  const h = resolveOrdered(personaId, stepId, HEAL_ORDER, HEAL_MOMENT_STEMS);
  if (h) return h;

  const l = resolveOrdered(personaId, stepId, LEARN_ORDER, LEARN_MOMENT_STEMS);
  if (l) return l;

  const p = resolveOrdered(personaId, stepId, PLAY_ORDER, PLAY_MOMENT_STEMS);
  if (p) return p;

  return undefined;
}
