import { resolveSolutionId } from './xpFlowAdapter';
import { SOLUTIONS_CATALOG } from './solutionsCatalog';
import type { Module, Solution } from './types';

const norm = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]/g, '');

type SolutionMaps = {
  byId: Map<string, Solution>;
  byName: Map<string, Solution>;
  byNormName: Map<string, Solution>;
};

function buildSolutionMaps(solutions: readonly Solution[]): SolutionMaps {
  const byId = new Map<string, Solution>();
  const byName = new Map<string, Solution>();
  const byNormName = new Map<string, Solution>();
  for (const s of solutions) {
    byId.set(s.id, s);
    byName.set(s.name.trim(), s);
    const n = norm(s.name);
    if (!byNormName.has(n)) byNormName.set(n, s);
  }
  return { byId, byName, byNormName };
}

/**
 * Resolves a Modules-sheet label (Column C) to a catalogue {@link Solution}.
 * 1. Exact `Solution.name`
 * 2. Normalized name (spacing / casing / punctuation)
 * 3. {@link resolveSolutionId} + id or editorial catalogue name bridge (Excel slug ids vs camelCase ids)
 */
export function solutionForExcelLabel(
  label: string,
  solutions: readonly Solution[],
  maps?: SolutionMaps,
): Solution | undefined {
  const trimmed = label.trim();
  if (!trimmed) return undefined;

  const { byId, byName, byNormName } = maps ?? buildSolutionMaps(solutions);

  const exact = byName.get(trimmed);
  if (exact) return exact;

  const byNorm = byNormName.get(norm(trimmed));
  if (byNorm) return byNorm;

  const id = resolveSolutionId(trimmed);
  if (id) {
    const direct = byId.get(id);
    if (direct) return direct;

    const catEntry = SOLUTIONS_CATALOG.find((s) => s.id === id);
    if (catEntry) {
      const fromCatName = byNormName.get(norm(catEntry.name));
      if (fromCatName) return fromCatName;

      // Excel may use a shorter label (e.g. "Blue Ocean" in Solutions sheet vs "Blue Ocean - UVD Robots" in Modules).
      const key = norm(trimmed);
      if (key.length >= 6) {
        const normEntries = Array.from(byNormName.entries());
        for (let i = 0; i < normEntries.length; i++) {
          const [k, sol] = normEntries[i];
          if (k.length >= 4 && (key.includes(k) || k.includes(key))) return sol;
        }
      }
    }
  }

  return undefined;
}

/**
 * Solutions shown for a module: names listed on the Modules sheet (`linkedSolutionsExcel`),
 * in that order, matched to the Solutions catalogue.
 */
export function solutionsForModule(mod: Module, solutions: readonly Solution[]): Solution[] {
  const maps = buildSolutionMaps(solutions);
  const out: Solution[] = [];
  const seen = new Set<string>();
  for (const label of mod.linkedSolutionsExcel ?? []) {
    const sol = solutionForExcelLabel(label, solutions, maps);
    if (sol && !seen.has(sol.id)) {
      seen.add(sol.id);
      out.push(sol);
    }
  }
  return out;
}
