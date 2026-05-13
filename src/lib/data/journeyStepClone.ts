import type { JourneyStep } from './types';

/** White-collar Excel journey step ids — cloned for demo persona `exemple-minor`. */
const WHITE_COLLAR_EXCEL_STEP_IDS = [
  'white-collar__commute',
  'white-collar__welcome-area',
  'white-collar__workplace',
  'white-collar__food-beverage-area',
  'white-collar__wellbeing-breaktime',
] as const;

/**
 * Duplicate white-collar journey steps under `exemple-minor__*` ids (same labels,
 * modules, descriptions) so a demo persona can reuse the same solutionning without
 * editing generated Excel files.
 */
export function cloneWhiteCollarJourneyStepsForExempleMinor(
  base: Record<string, JourneyStep>,
): Record<string, JourneyStep> {
  const out: Record<string, JourneyStep> = {};
  for (const id of WHITE_COLLAR_EXCEL_STEP_IDS) {
    const src = base[id];
    if (!src) continue;
    const nid = id.replace('white-collar', 'exemple-minor');
    out[nid] = { ...src, id: nid };
  }
  return out;
}
