import type { Module, Solution } from './types';

/**
 * Solutions shown for a module: **only** names listed on the Modules sheet (`linkedSolutionsExcel`),
 * in that order, matched exactly to the Solutions sheet catalogue (`name` === Excel token).
 */
export function solutionsForModule(mod: Module, solutions: readonly Solution[]): Solution[] {
  const byName = new Map<string, Solution>();
  for (const s of solutions) {
    byName.set(s.name.trim(), s);
  }
  const out: Solution[] = [];
  const seen = new Set<string>();
  for (const label of mod.linkedSolutionsExcel ?? []) {
    const sol = byName.get(label.trim());
    if (sol && !seen.has(sol.id)) {
      seen.add(sol.id);
      out.push(sol);
    }
  }
  return out;
}
