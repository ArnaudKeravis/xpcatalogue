import type { Area, Solution, SolutionStatus, SolutionType } from '@/lib/data/types';

export interface SolutionFilterParams {
  q?: string;
  /** Exact module name match (backwards-compatible single select). */
  module?: string;
  /**
   * Whitelist of module names. A solution passes when its module is in this set.
   * Computed by the caller from persona / moment selections so filterSolutions
   * stays a pure function over the Solutions list.
   */
  modules?: string[];
  area?: Area;
  status?: SolutionStatus;
  type?: SolutionType;
  /** Solution must carry ANY of these hashtags (OR semantics). */
  hashtags?: string[];
  /** Solution must carry ANY of these country flags (OR semantics). */
  flags?: string[];
}

export function filterSolutions(solutions: Solution[], p: SolutionFilterParams): Solution[] {
  let list = solutions;

  const q = p.q?.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.module.toLowerCase().includes(q) ||
        s.context.toLowerCase().includes(q) ||
        s.hashtags.some((h) => h.toLowerCase().includes(q))
    );
  }
  if (p.module) {
    list = list.filter((s) => s.module === p.module);
  }
  if (p.modules && p.modules.length > 0) {
    const allowed = new Set(p.modules);
    list = list.filter((s) => allowed.has(s.module));
  }
  if (p.area) {
    list = list.filter((s) => s.areas.includes(p.area!));
  }
  if (p.status) {
    list = list.filter((s) => s.status === p.status);
  }
  if (p.type) {
    list = list.filter((s) => s.type === p.type);
  }
  if (p.hashtags && p.hashtags.length > 0) {
    const wanted = new Set(p.hashtags.map((h) => h.toLowerCase()));
    list = list.filter((s) =>
      s.hashtags.some((h) => wanted.has(h.toLowerCase()))
    );
  }
  if (p.flags && p.flags.length > 0) {
    const wanted = new Set(p.flags);
    list = list.filter((s) => s.flags.some((f) => wanted.has(f)));
  }

  return list;
}

export function uniqueModules(solutions: Solution[]): string[] {
  return Array.from(new Set(solutions.map((s) => s.module))).sort((a, b) => a.localeCompare(b));
}

export function uniqueStatuses(solutions: Solution[]): SolutionStatus[] {
  return Array.from(new Set(solutions.map((s) => s.status))).sort((a, b) => a.localeCompare(b));
}

export function uniqueTypes(solutions: Solution[]): SolutionType[] {
  return Array.from(new Set(solutions.map((s) => s.type))).sort((a, b) => a.localeCompare(b));
}

/** Hashtags sorted by usage frequency (most used first). 153 unique — UI should truncate. */
export function rankedHashtags(solutions: Solution[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const s of solutions) {
    for (const h of s.hashtags) {
      counts.set(h, (counts.get(h) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag, count]) => ({ tag, count }));
}

/**
 * Country flags (emoji) used as deployment markers. Sorted by usage (most deployed first),
 * alphabetical tiebreak via the emoji's code points — good enough as a stable order.
 */
export function rankedFlags(solutions: Solution[]): { flag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const s of solutions) {
    for (const f of s.flags) {
      counts.set(f, (counts.get(f) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([flag, count]) => ({ flag, count }));
}
