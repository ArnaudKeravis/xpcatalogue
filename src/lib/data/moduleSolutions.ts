import type { Module, Solution } from './types';

/** Solutions tied to a module via catalogue `module` name or explicit `solutionIds` from Excel SoT. */
export function solutionsForModule(mod: Module, solutions: readonly Solution[]): Solution[] {
  const ids = new Set(mod.solutionIds ?? []);
  return solutions.filter((s) => s.module === mod.name || ids.has(s.id));
}
