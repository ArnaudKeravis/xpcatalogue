/**
 * Sodexo `Modules.xlsx` (generated into {@link MODULES_EXCEL_SOT}) drives the catalogue
 * module list: names, domains, descriptions, tile images, and solution wiring.
 */

import type { Module } from './types';
import { MODULES_EXCEL_SOT, type ModulesExcelRow } from './modulesExcelSoT.generated';
import { canonModuleName } from './xpFlowAdapter';

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function gradientForDomain(domain: string): string {
  const d = domain.toLowerCase();
  if (d.includes('client')) return 'linear-gradient(135deg,#293896,#6a74b6)';
  if (d.includes('operator')) return 'linear-gradient(135deg,#293896,#0e6da8)';
  return 'linear-gradient(135deg,#1a3af0,#4d8aff)';
}

/**
 * Public URL for the module tile image. Drop PNG files under `public/images/catalogue/modules/`
 * using the slug derived from the Excel `Module Image` key (see `moduleCoverImageSlug`).
 */
export function moduleCoverImagePublicPath(imageKey: string): string {
  return `/images/catalogue/modules/${moduleCoverImageSlug(imageKey)}.png`;
}

export function moduleCoverImageSlug(imageKey: string): string {
  const tail = imageKey.replace(/^module_image_/i, '').trim();
  return tail
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Maps Excel **Name of the Module** → existing catalogue `Record` key (`module.name`).
 * Used where spelling differs slightly from the XP-flow workbook while referring to the same module.
 */
const EXCEL_TO_CATALOGUE_KEY: Record<string, string> = {
  'Account & Contract Management': 'Accounts, Card and Management (Corporate)',
  'AI Tray Scanning': 'AI tray scanning',
  'Air Quality': 'Air quality',
  'Autonomous Store / Micro-market': 'Store / micromarket',
  'Battery Charger': 'Battery charger',
  'Delivery robots': 'Delivery Robots',
  'Digital Reception': 'Digital reception',
  'Energy Management': 'Energy management',
  'Food 3D printing': '3D Printing',
  'Food Safety': 'Food Safety',
  Gym: 'Gym',
  'Hydration / Water': 'Hydration / Water',
  'Mental Health': 'Mental health',
  'Parking Management': 'Parking Management',
  'Physical Health': 'Physical health',
  'Room Booking': 'Room booking',
  'Service Request': 'Service Request',
  'Service Robots': 'Service Robots',
  'Sustainability Awareness': 'Sustainability awareness',
  'Waste Management': 'Waste management',
  'Wayfinding': 'Wayfinding',
  Conciergerie: 'Conciergerie',
  'Feedback & behavioral analysis': 'Feedback',
  'Robotic Cooking': 'Robot cooking',
  'Maintenance Management': 'Maintenance & Asset mgmt',
  'Performance & KPI Cockpit': 'Real time insights',
  'Pricing Assistant': 'Price management',
  'Run the Site (Ops Cockpit)': 'FM Operations',
  'Safety & Compliance Monitoring': 'Safety & Compliance',
  'Sustainability & CSR Dashboarding': 'Sustainability measured',
  'Sustainable Packaging & Reusable Management': 'Circular & Upcycling',
  'Waste & Resource Performance': 'Waste management',
  'Workforce Analytics & Retention': 'Workforce management',
  'Footfall & Flow Intelligence': 'Footfall & Space analytics',
  'Footfall & Market Intelligence': 'Footfall & Space analytics',
  'Disinfection in Healthcare': 'Hygiene & Sanitation',
};

function parseSolutionNames(raw: string): string[] {
  return raw
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function makeModuleFromExcelRow(
  row: ModulesExcelRow,
  coverImage: string | undefined,
): Module {
  const name = row.name.trim();
  const linkedSolutionsExcel = parseSolutionNames(row.solutionNamesRaw);
  return {
    id: slugify(name),
    name,
    icon: '📦',
    gradient: gradientForDomain(row.domain),
    description: row.description.trim(),
    solutionIds: [],
    coverImage,
    domain: row.domain.trim(),
    linkedSolutionsExcel,
  };
}

/** Catalogue modules keyed by Excel **Name of the Module** — one row per sheet entry, no merge with legacy lists. */
export function modulesRecordFromExcelSoT(): Record<string, Module> {
  const out: Record<string, Module> = {};
  for (const row of MODULES_EXCEL_SOT) {
    const name = row.name.trim();
    if (!name) continue;
    const coverImage = row.imageKey.trim()
      ? moduleCoverImagePublicPath(row.imageKey.trim())
      : undefined;
    out[name] = makeModuleFromExcelRow(row, coverImage);
  }
  return out;
}

function resolveMergeTarget(
  modules: Record<string, Module>,
  excelName: string,
): { mode: 'update'; key: string } | { mode: 'create'; displayName: string } {
  const trimmed = excelName.trim();
  const mapped = EXCEL_TO_CATALOGUE_KEY[trimmed];
  if (mapped && modules[mapped]) return { mode: 'update', key: mapped };
  if (modules[trimmed]) return { mode: 'update', key: trimmed };
  const c = canonModuleName(trimmed);
  if (modules[c]) return { mode: 'update', key: c };
  const n = norm(trimmed);
  for (const k of Object.keys(modules)) {
    if (norm(k) === n) return { mode: 'update', key: k };
  }
  return { mode: 'create', displayName: trimmed };
}

/** Applies Excel rows onto merged catalogue modules (adds missing modules, merges duplicates). */
export function mergeModulesExcelSoT(modules: Record<string, Module>): Record<string, Module> {
  const out: Record<string, Module> = { ...modules };

  for (const row of MODULES_EXCEL_SOT) {
    const coverImage = row.imageKey.trim()
      ? moduleCoverImagePublicPath(row.imageKey.trim())
      : undefined;

    const target = resolveMergeTarget(out, row.name);
    if (target.mode === 'update') {
      const prev = out[target.key];
      if (!prev) {
        const name = row.name.trim();
        if (!out[name]) out[name] = makeModuleFromExcelRow(row, coverImage);
        continue;
      }
      const description = row.description.trim() || prev.description;
      const linkedSolutionsExcel = parseSolutionNames(row.solutionNamesRaw);
      out[target.key] = {
        ...prev,
        description,
        solutionIds: [],
        linkedSolutionsExcel,
        coverImage: coverImage ?? prev.coverImage,
      };
    } else {
      const name = target.displayName;
      if (out[name]) continue;
      out[name] = makeModuleFromExcelRow(row, coverImage);
    }
  }

  return out;
}
