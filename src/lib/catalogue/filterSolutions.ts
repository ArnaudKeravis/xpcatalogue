import type { Area, Solution, SolutionStatus, SolutionType } from '@/lib/data/types';

export interface SolutionFilterParams {
  q?: string;
  module?: string;
  area?: Area;
  status?: SolutionStatus;
  type?: SolutionType;
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
  if (p.area) {
    list = list.filter((s) => s.areas.includes(p.area!));
  }
  if (p.status) {
    list = list.filter((s) => s.status === p.status);
  }
  if (p.type) {
    list = list.filter((s) => s.type === p.type);
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
