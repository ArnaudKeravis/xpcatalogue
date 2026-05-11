import type { CatalogueData } from '@/lib/data/types';

export interface GlobalSearchSolutionHit {
  id: string;
  name: string;
  module: string;
  /** Module id of this solution — used to pick a Phosphor icon client-side. */
  moduleId?: string;
  description: string;
  href: string;
  score: number;
}

export interface GlobalSearchModuleHit {
  id: string;
  name: string;
  description: string;
  solutionCount: number;
  href: string;
  score: number;
}

export interface GlobalSearchPersonaHit {
  id: string;
  name: string;
  fullName: string;
  role: string;
  area: string;
  areaLabel: string;
  /** Brand hex color for the persona pill. */
  color: string;
  href: string;
  score: number;
}

export interface GlobalSearchMomentHit {
  id: string;
  label: string;
  personaId: string;
  personaName: string;
  areaLabel: string;
  href: string;
  score: number;
}

export interface GlobalSearchResult {
  q: string;
  solutions: GlobalSearchSolutionHit[];
  modules: GlobalSearchModuleHit[];
  personas: GlobalSearchPersonaHit[];
  moments: GlobalSearchMomentHit[];
  total: number;
}

const MAX_PER_GROUP = 6;

/**
 * Very small, deterministic fuzzy-ish ranker. We don't need fuse.js for <300 items.
 *
 *  - exact match               → 100
 *  - prefix match              → 60
 *  - substring (word boundary) → 30
 *  - substring anywhere        → 15
 *  - no match                  → 0
 *
 * Weighted per field; caller sums them up.
 */
function scoreField(haystack: string | undefined | null, needle: string): number {
  if (!haystack) return 0;
  const h = haystack.toLowerCase();
  if (h === needle) return 100;
  if (h.startsWith(needle)) return 60;
  const idx = h.indexOf(needle);
  if (idx === -1) return 0;
  const prev = idx === 0 ? ' ' : h.charAt(idx - 1);
  return /\s|[-/,.·#]/.test(prev) ? 30 : 15;
}

export function globalSearch(data: CatalogueData, rawQuery: string): GlobalSearchResult {
  const q = rawQuery.trim().toLowerCase();
  const empty: GlobalSearchResult = { q: rawQuery, solutions: [], modules: [], personas: [], moments: [], total: 0 };
  if (!q || q.length < 2) return empty;

  /* Solutions ─ name (x3) + module (x2) + description (x1) + hashtag (x2) */
  const solutions: GlobalSearchSolutionHit[] = [];
  for (const s of data.solutions) {
    const score =
      scoreField(s.name, q) * 3 +
      scoreField(s.module, q) * 2 +
      scoreField(s.description, q) +
      Math.max(0, ...s.hashtags.map((h) => scoreField(h, q))) * 2;
    if (score > 0) {
      const moduleConfig = Object.values(data.modules).find((m) => m.name === s.module);
      solutions.push({
        id: s.id,
        name: s.name,
        module: s.module,
        moduleId: moduleConfig?.id,
        description: s.description,
        href: `/solutions/${s.id}`,
        score,
      });
    }
  }
  solutions.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  /* Modules ─ name (x3) + description (x1) */
  const modules: GlobalSearchModuleHit[] = [];
  for (const m of Object.values(data.modules)) {
    const score = scoreField(m.name, q) * 3 + scoreField(m.description, q);
    if (score > 0) {
      modules.push({
        id: m.id,
        name: m.name,
        description: m.description,
        solutionCount: m.linkedSolutionsExcel?.length ?? m.solutionIds.length,
        href: `/solutions?module=${encodeURIComponent(m.name)}`,
        score,
      });
    }
  }
  modules.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  /* Personas ─ name (x3) + fullName (x2) + role (x1) */
  const personas: GlobalSearchPersonaHit[] = [];
  for (const p of data.personas) {
    const score =
      scoreField(p.name, q) * 3 + scoreField(p.fullName, q) * 2 + scoreField(p.role, q);
    if (score > 0) {
      personas.push({
        id: p.id,
        name: p.name,
        fullName: p.fullName,
        role: p.role,
        area: p.area,
        areaLabel: data.areas[p.area].label,
        color: p.color,
        href: `/${p.area}/${p.id}`,
        score,
      });
    }
  }
  personas.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  /* Moments ─ enumerate (persona × step) pairs, score on step.label */
  const moments: GlobalSearchMomentHit[] = [];
  const seen = new Set<string>();
  for (const p of data.personas) {
    for (const sid of p.steps) {
      const step = data.journeySteps[sid];
      if (!step) continue;
      const key = `${p.id}::${step.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const score = scoreField(step.label, q) * 3 + scoreField(step.description ?? '', q);
      if (score > 0) {
        moments.push({
          id: step.id,
          label: step.label,
          personaId: p.id,
          personaName: p.name,
          areaLabel: data.areas[p.area].label,
          href: `/${p.area}/${p.id}/moment/${step.id}`,
          score,
        });
      }
    }
  }
  moments.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));

  const truncatedSolutions = solutions.slice(0, MAX_PER_GROUP);
  const truncatedModules = modules.slice(0, MAX_PER_GROUP);
  const truncatedPersonas = personas.slice(0, MAX_PER_GROUP);
  const truncatedMoments = moments.slice(0, MAX_PER_GROUP);

  return {
    q: rawQuery,
    solutions: truncatedSolutions,
    modules: truncatedModules,
    personas: truncatedPersonas,
    moments: truncatedMoments,
    total:
      solutions.length +
      modules.length +
      personas.length +
      moments.length,
  };
}
