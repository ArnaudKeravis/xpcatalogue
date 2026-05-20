import { MOMENT_HERO_RASTER } from '@/lib/data/momentHeroRaster.generated';
import { ER_BOK_MOMENT_IMAGE, isErBoKStepId } from '@/lib/data/er/erBoKJourney';

/**
 * Per-moment hero art: **legacy isometric SVGs first** (under `journeys/moments/`), then
 * Excel-synced rasters (`momentHeroRaster.generated.ts`) when no illustration is available.
 *
 * Excel "Image left moment" often points at persona portraits; those must not override
 * beat-specific iso art when we can resolve a numbered `{stem}-{n}.svg`.
 *
 * Step ids from ingest look like `white-collar__commute`. Legacy tables use short slugs
 * (`commute`, …) or are aligned by **step index** in the persona's journey when slugs
 * do not match the old `*_ORDER` tuples.
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

/** Map Excel journey slug → canonical WORK_ORDER key (order matches journey beats). */
const WORK_SLUG_TO_ORDER: Record<string, (typeof WORK_ORDER)[number]> = {
  commute: 'commute',
  'welcome-area': 'welcome-area',
  workplace: 'workplace',
  'food-beverage-area': 'food-beverage-work',
  'food-beverage-work': 'food-beverage-work',
  'wellbeing-breaktime': 'wellbeing-break',
  'wellbeing-break': 'wellbeing-break',
};

function pathForStemIndex(stem: string, indexZero: number, maxNumbered: number): string {
  const n = indexZero + 1;
  if (n >= 1 && n <= maxNumbered) return `${MOM}/${stem}-${n}.svg`;
  return `${MOM}/${stem}.svg`;
}

/** Part after first `__` in `personaId__slug` ingest ids; otherwise returns `stepId`. */
export function excelJourneyStepSlug(stepId: string): string {
  const i = stepId.indexOf('__');
  return i >= 0 ? stepId.slice(i + 2) : stepId;
}

function resolveWorkLegacySvg(personaId: string, slug: string): string | undefined {
  const row = WORK_MOMENT_STEMS[personaId];
  if (!row || row.max < 1) return undefined;
  const key: (typeof WORK_ORDER)[number] | undefined =
    WORK_SLUG_TO_ORDER[slug] ??
    ((WORK_ORDER as readonly string[]).includes(slug) ? (slug as (typeof WORK_ORDER)[number]) : undefined);
  if (!key) return undefined;
  const idx = WORK_ORDER.indexOf(key);
  if (idx < 0) return undefined;
  return pathForStemIndex(row.stem, idx, row.max);
}

function resolveIndexedLegacy(
  personaId: string,
  slug: string,
  stepIndex: number,
  order: readonly string[],
  table: Record<string, { stem: string; max: number }>,
): string | undefined {
  const row = table[personaId];
  if (!row || row.max < 1) return undefined;
  let idx = order.indexOf(slug as (typeof order)[number]);
  if (idx < 0 && stepIndex >= 0 && stepIndex < row.max) idx = stepIndex;
  if (idx < 0) return undefined;
  return pathForStemIndex(row.stem, idx, row.max);
}

/** Persona id → `{ stem, max }` for WORK_ORDER steps (office + army + client work). */
const WORK_MOMENT_STEMS: Record<string, { stem: string; max: number }> = {
  military: { stem: 'work-army-officer', max: 5 },
  'client-work': { stem: 'client-operation-director', max: 5 },
  /** Excel work admin / site / lab / line — share office iso beats (same 5-step arc). */
  'white-collar': { stem: 'client-operation-director', max: 5 },
  'blue-collar': { stem: 'client-operation-director', max: 5 },
  'grey-collar': { stem: 'client-operation-director', max: 5 },
  'operator-work': { stem: 'client-operation-director', max: 5 },
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

function remapExempleMinor(personaId: string, stepId: string): { pid: string; sid: string } {
  if (personaId === 'exemple-minor' && stepId.startsWith('exemple-minor__')) {
    return {
      pid: 'white-collar',
      sid: stepId.replace(/^exemple-minor__/, 'white-collar__'),
    };
  }
  return { pid: personaId, sid: stepId };
}

/**
 * Beat-specific iso SVG when available (never a PNG/JPEG from Excel).
 * `stepIndex` is this moment's index in `persona.steps` (0-based); required for Excel
 * slugs that do not match legacy `*_ORDER` ids.
 */
export function resolveJourneyMomentLegacySvg(
  personaId: string,
  stepId: string,
  stepIndex: number,
): string | undefined {
  const { pid, sid } = remapExempleMinor(personaId, stepId);
  const slug = excelJourneyStepSlug(sid);

  const w = resolveWorkLegacySvg(pid, slug);
  if (w) return w;

  const h = resolveIndexedLegacy(pid, slug, stepIndex, HEAL_ORDER, HEAL_MOMENT_STEMS);
  if (h) return h;

  const l = resolveIndexedLegacy(pid, slug, stepIndex, LEARN_ORDER, LEARN_MOMENT_STEMS);
  if (l) return l;

  const p = resolveIndexedLegacy(pid, slug, stepIndex, PLAY_ORDER, PLAY_MOMENT_STEMS);
  if (p) return p;

  return undefined;
}

/**
 * Hero image for a moment: **legacy iso SVG first**, then Excel raster.
 * Pass `stepIndex` = `persona.steps.indexOf(step.id)` (or strip index) so heal/learn/play
 * beats align to numbered assets when Excel slugs differ from legacy ids.
 */
export function resolveJourneyMomentImage(
  personaId: string,
  stepId: string,
  stepIndex: number,
): string | undefined {
  // E&R BoK journey owns its own moment art (PNG, not SVG, full-bleed crop).
  // Resolve first so MomentTimeline thumbnails and the moment hero pick up
  // the editorial assets regardless of which persona id is in scope.
  if (isErBoKStepId(stepId)) return ER_BOK_MOMENT_IMAGE[stepId];

  const { pid, sid } = remapExempleMinor(personaId, stepId);
  const legacy = resolveJourneyMomentLegacySvg(pid, sid, stepIndex);
  if (legacy) return legacy;

  const raster = MOMENT_HERO_RASTER[pid]?.[sid];
  if (raster) return raster;

  return undefined;
}
