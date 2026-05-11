/**
 * Journey steps reference modules by **free-text labels** (XP flow, TDDI, editorial maps).
 * Catalogue modules use **Classeur Modules.xlsx** names. Align the two with normalized
 * matching so moments still resolve to the correct module records.
 */

import type { JourneyStep, Module } from './types';

function normKey(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Map a label appearing in `JourneyStep.modules` to the live catalogue `Module`.
 */
export function catalogueModuleForJourneyLabel(
  modules: Record<string, Module>,
  label: string,
): Module | undefined {
  const t = label.trim();
  if (!t) return undefined;
  const keyed = modules[t];
  if (keyed) return keyed;
  for (const m of Object.values(modules)) {
    if (m.name === t) return m;
  }
  const nt = normKey(t);
  for (const m of Object.values(modules)) {
    if (normKey(m.name) === nt) return m;
  }
  return undefined;
}

/** Whether a journey step lists this catalogue module (by exact or normalized name). */
export function journeyStepReferencesModule(step: JourneyStep, catalogueModuleName: string): boolean {
  const nc = normKey(catalogueModuleName);
  return step.modules.some((label) => label === catalogueModuleName || normKey(label) === nc);
}
