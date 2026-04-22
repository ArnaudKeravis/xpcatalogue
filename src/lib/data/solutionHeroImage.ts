import type { Solution } from './types';

/**
 * Paths that are known placeholders (reused across every solution in
 * `solutionsCatalog.ts` until we get real per-solution art). Treat them as
 * "no hero image" so the UI falls back to the Phosphor starter tile.
 *
 * When real imagery lands — either user-provided under
 * `/images/catalogue/assets/solutions/…` or a full URL pointing at
 * Notion / Figma / the web — we automatically switch over.
 */
const PLACEHOLDER_HERO_PATHS = new Set<string>([
  '/images/catalogue/assets/areas/work-area-info-iso.png',
]);

/** Returns true only when `solution.heroImage` is a *real* hero (not the generic placeholder). */
export function hasRealHeroImage(solution: Pick<Solution, 'heroImage'> | null | undefined): boolean {
  const src = solution?.heroImage;
  if (!src) return false;
  return !PLACEHOLDER_HERO_PATHS.has(src);
}

/**
 * From a list of solutions, pick the first one that actually ships a real
 * hero image. Useful when we need "a representative image" for a group
 * (e.g. the module card on the moment page).
 */
export function pickFirstRealHero<T extends Pick<Solution, 'heroImage'>>(
  solutions: readonly T[],
): T | undefined {
  return solutions.find(hasRealHeroImage);
}
