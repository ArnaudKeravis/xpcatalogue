/**
 * Build catalogue {@link Solution} objects strictly from `Classeur Solutions.xlsx`
 * (generated into {@link SOLUTIONS_EXCEL_SOT}).
 */

import type { Area, Benefits, KPI, Solution } from './types';
import { SOLUTIONS_EXCEL_SOT, type SolutionsExcelRow } from './solutionsExcelSoT.generated';

export function slugifySolutionId(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseHashtags(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw.split(/\s+/).map((t) => t.trim()).filter(Boolean);
}

/** Verbatim Excel **Benefits** cell — split Sodexo / Client / Consumer only when those prefixes appear. */
function parseBenefits(raw: string): Benefits {
  const text = raw.trim();
  let client = '';
  let consumer = '';
  let sodexo = '';
  const parts = text.split(/\s*[•\u2022]\s*/).map((p) => p.trim()).filter(Boolean);
  for (const p of parts) {
    if (/^clients?:/i.test(p)) client = p.replace(/^clients?:\s*/i, '').trim();
    else if (/^consumer:/i.test(p)) consumer = p.replace(/^consumer:\s*/i, '').trim();
    else if (/^customer:/i.test(p)) consumer = p.replace(/^customer:\s*/i, '').trim();
    else if (/^sodexo:/i.test(p)) sodexo = p.replace(/^sodexo:\s*/i, '').trim();
  }
  if (!client && !consumer && !sodexo && text) {
    sodexo = text;
  }
  return { client, consumer, sodexo };
}

export function solutionFromExcelRow(row: SolutionsExcelRow): Solution {
  const id = slugifySolutionId(row.name);
  const hashtags = parseHashtags(row.hashtagsRaw);
  const kpis: KPI[] = row.deploymentKpis.trim() ? [{ v: '', l: row.deploymentKpis }] : [];

  return {
    id,
    name: row.name,
    module: '',
    type: 'Application',
    catalogueTag: row.tagForCatalogue ?? undefined,
    status: 'Scaled',
    excelSolutionsSheet: true,
    hashtags,
    flags: [],
    img: '📦',
    heroImage: row.heroImageUrl ?? undefined,
    context: row.context,
    description: row.description,
    kpis,
    contact: row.contacts,
    benefits: parseBenefits(row.benefits),
    areas: [] as Area[],
    regionsAndCountry: row.regionsAndCountry ?? undefined,
  };
}

export function buildSolutionsCatalogueFromExcel(): Solution[] {
  return SOLUTIONS_EXCEL_SOT.map(solutionFromExcelRow);
}

export function solutionsIndexedByName(solutions: readonly Solution[]): Map<string, Solution> {
  const m = new Map<string, Solution>();
  for (const s of solutions) {
    m.set(s.name.trim(), s);
  }
  return m;
}
