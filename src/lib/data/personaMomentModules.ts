/**
 * Curated module lists for **persona-specific** journey moment ids.
 *
 * White-collar work moments (`commute`, `welcome-area`, …) and operator
 * Excel moments (`op-*`) already receive modules from `xpCatalogueFlow.ts`
 * + `tddiV2CatalogueMerge.ts`. Every other pill id from `personaJourneys.ts`
 * is created as a stub step with `modules: []` — this map fills those gaps
 * using editorially sensible Sodexo catalogue module names.
 *
 * Unknown names (typos / renames) are dropped at runtime against the live
 * `modules` record from `getCatalogueData()`.
 */

import type { JourneyStep, Module } from './types';
import { EXCEL_JOURNEY_STEP_IDS } from './journeyStepsFromExcel.generated';

/** Journey step ids that already get rich module wiring elsewhere — do not override. */
export const MOMENT_IDS_WITH_BUILTIN_MODULE_WIRING = new Set<string>([
  'commute',
  'welcome-area',
  'workplace',
  'wellbeing-break',
  'food-beverage-work',
  'op-fm-round',
  'op-kick-off',
  'op-order-planning',
  'op-office-time',
  'op-food-service',
]);

const commute: readonly string[] = [
  'Parking Management',
  'Wayfinding',
  'Battery charger',
  'Delivery Robots',
  'Display',
  'Sustainability awareness',
];

const welcome: readonly string[] = [
  'Digital reception',
  'Visitor Management & Access control',
  'Reception',
  'Wayfinding',
  'Display',
  'Footfall & Space analytics',
  'Conciergerie',
];

const workplace: readonly string[] = [
  'Room booking',
  'Service Request',
  'Feedback',
  'Analytics',
  'Digital XP',
  'Training',
  'Digital Apps',
  'IOT',
  'Space planning',
  'Air quality',
  'HR & Staff management',
  'Safety & Compliance',
];

const fnb: readonly string[] = [
  'Catering',
  'Snacking',
  'Alternative F&B',
  'Advanced / smart vending',
  'Store / micromarket',
  'AI tray scanning',
  'Food Safety',
  'Self-Checkout AI',
  'Digital Apps',
  'Menu planning',
  'Food delivery / serving',
  'Food Waste',
];

const wellbeing: readonly string[] = [
  'Gym',
  'Mental health',
  'Physical health',
  'Hydration / Water',
  'Hydration',
  'Health & Wellness',
  'Snacking',
  'Alternative F&B',
];

const healClinical: readonly string[] = [
  'Food Safety',
  'Hygiene & Sanitation',
  'Cleaning efficiency',
  'Service Robots',
  'Food delivery / serving',
  'IOT',
  'Feedback',
  'Digital XP',
];

const healKitchen: readonly string[] = [
  'Food Safety',
  'Food Waste',
  'AI Tools',
  'Waste management',
  'Menu planning',
  'Inventory management',
  'Quality',
  'Robot cooking',
  'Automated food processing',
  'Kitchen Robots',
];

const playVenue: readonly string[] = [
  'Autonomous Stores',
  'Self-Checkout AI',
  'Delivery Robots',
  'Service Robots',
  'Smart Vending',
  'Digital Apps',
  'Feedback',
  'Gamification',
  'Advanced / smart vending',
  'Store / micromarket',
];

const playSocial: readonly string[] = [
  'Catering',
  'Snacking',
  'Alternative F&B',
  'Feedback',
  'Digital XP',
  'Hydration / Water',
];

const learnStudy: readonly string[] = [
  'Training',
  'Digital XP',
  'Digital Apps',
  'Display',
  'Room booking',
  'Feedback',
  'Accessibility',
];

const clientGovernance: readonly string[] = [
  'Real time insights',
  'Analytics',
  'Training',
  'Billing & Invoicing (TDDI)',
  'Accounts, Card and Management (Corporate)',
  'Business Center',
  'FM Operations',
  'Sustainability measured',
  'Visitor Management & Access control',
];

const clientOps: readonly string[] = [
  'Work Order Management',
  'Maintenance & Asset mgmt',
  'Price management',
  'Inventory management',
  'Quality',
  'Feedback',
  'Digital XP',
];

const parentHome: readonly string[] = [
  'Digital Apps',
  'Training',
  'Feedback',
  'Catering',
  'Snacking',
  'Menu planning',
];

const militaryOps: readonly string[] = [
  'Catering',
  'Food delivery / serving',
  'Menu planning',
  'Food Safety',
  'Feedback',
  'Training',
];

const militaryDay: readonly string[] = [
  'Safety & Compliance',
  'FM Operations',
  'Service Request',
  'Room booking',
  'Work Order Management',
  'Cleaning efficiency',
];

/**
 * Extra modules per persona moment id (unioned with any existing `step.modules`).
 */
export const PERSONA_MOMENT_EXTRA_MODULES: Record<string, readonly string[]> = {
  // ── WORK: blue & grey collar (parallel to white-collar arc) ──
  'bc-commute': commute,
  'bc-welcome': welcome,
  'bc-workplace': [...workplace, 'Maintenance & Asset mgmt', 'Cleaning efficiency'],
  'bc-wellbeing': [...wellbeing, 'Cleaning & Hygiene'],
  'bc-fnb': [...fnb, 'Kitchen Robots'],

  'gc-commute': commute,
  'gc-welcome': welcome,
  'gc-workplace': workplace,
  'gc-wellbeing': wellbeing,
  'gc-fnb': fnb,

  // ── WORK: military ──
  'mil-evening': [...wellbeing, 'Snacking', 'Mental health'],
  'mil-morning': ['Catering', 'Alternative F&B', 'Training', 'Hydration / Water'],
  'mil-work': militaryDay,
  'mil-diner': militaryOps,
  'mil-after-work': [...wellbeing, 'Catering', 'Feedback'],
  'mil-lunch': [...fnb, 'Food Safety'],

  // ── HEAL ──
  'doc-commute': commute,
  'doc-end-shift': ['Training', 'Feedback', 'Mental health', 'Workforce management'],
  'doc-consult': [...healClinical, 'Analytics', 'Digital XP'],
  'doc-rounds': [...healClinical, 'Real time insights'],
  'doc-meetings': ['Room booking', 'Digital XP', 'Training', 'Real time insights'],
  'doc-break': ['Snacking', 'Hydration / Water', 'Mental health', 'Gym'],
  'doc-fnb': fnb,

  'nur-commute': commute,
  'nur-freetime': ['Mental health', 'Physical health', 'Gym', 'Training', 'Health & Wellness'],
  'nur-welcome': welcome,
  'nur-break': ['Snacking', 'Hydration / Water', 'Mental health', 'Physical health'],
  'nur-care': [...healClinical, 'Physical health'],
  'nur-fnb': fnb,

  'sen-welcome': [...welcome, 'Accessibility'],
  'sen-activities': ['Gym', 'Physical health', 'Mental health', 'Gamification', 'Feedback'],
  'sen-breakfast': fnb,
  'sen-dinner': fnb,
  'sen-lunch': fnb,
  'sen-break': [...wellbeing, 'Snacking'],

  'pat-rest': ['Mental health', 'Physical health', 'Hydration / Water', 'Accessibility'],
  'pat-commute': commute,
  'pat-leave': ['Visitor Management & Access control', 'Digital reception', 'Feedback'],
  'pat-admission': [...welcome, 'Accessibility'],
  'pat-care': healClinical,
  'pat-lunch': fnb,
  'pat-snack': ['Snacking', 'Advanced / smart vending', 'Hydration / Water'],

  // ── PLAY ──
  'sf-commute': commute,
  'sf-waiting': playVenue,
  'sf-welcome': welcome,
  'sf-halftime': [...playVenue, 'Hydration / Water'],
  'sf-after': playSocial,
  'sf-match': playVenue,

  'par-commute': commute,
  'par-arrival': welcome,
  'par-nav': ['Wayfinding', 'Display', 'Digital XP', 'Digital Apps'],
  'par-after': playSocial,
  'par-talk': ['Training', 'Digital XP', 'Display', 'Feedback'],
  'par-net': [...playSocial, 'Room booking'],

  'vip-commute': commute,
  'vip-lounge': ['Conciergerie', 'Catering', 'Feedback', 'Digital Apps'],
  'vip-arrival': welcome,
  'vip-eat': fnb,
  'vip-networking': [...playSocial, 'Catering', 'Room booking'],
  'vip-after': playSocial,

  'tou-commute': commute,
  'tou-welcome': welcome,
  'tou-depart': ['Visitor Management & Access control', 'Feedback', 'Digital Apps'],
  'tou-visit': ['Wayfinding', 'Display', 'Digital XP', 'Footfall & Space analytics'],
  'tou-snack': ['Snacking', 'Advanced / smart vending', 'Hydration / Water'],
  'tou-eat': fnb,

  // ── LEARN ──
  'stu-commute': commute,
  'stu-welcome': welcome,
  'stu-freetime': [...wellbeing, 'Training', 'Mental health'],
  'stu-studies': learnStudy,
  'stu-fnb': fnb,

  'sch-commute': commute,
  'sch-welcome': welcome,
  'sch-freetime': ['Snacking', 'Gamification', 'Hydration / Water'],
  'sch-class': learnStudy,
  'sch-fnb': fnb,

  'lp-weekly': parentHome,
  'lp-prep': commute,
  'lp-evening': parentHome,
  'lp-school': ['Digital Apps', 'Training', 'Feedback', 'Menu planning'],
  'lp-pickup': ['Visitor Management & Access control', 'Digital Apps', 'Feedback'],
  'lp-meals': ['Menu planning', 'Catering', 'Snacking', 'Digital Apps'],

  'tea-commute': commute,
  'tea-freetime': [...wellbeing, 'Training'],
  'tea-arrival': welcome,
  'tea-teaching': learnStudy,
  'tea-fnb': fnb,
  'tea-break': ['Snacking', 'Hydration / Water', 'Mental health'],

  // ── CLIENT (all areas) ──
  'cli-welcome': [...welcome, 'Business Center', 'Accounts, Card and Management (Corporate)'],
  'cli-meetings': [...clientGovernance, 'Room booking', 'Digital XP'],
  'cli-kickoff': [...clientOps, 'Training', 'Work Order Management', 'Food Safety'],
  'cli-improvement': [
    ...clientGovernance,
    'Sustainability measured',
    'Circular economy',
    'Energy management',
  ],
  'cli-review': ['Footfall & Space analytics', 'Real time insights', 'Feedback', 'Quality', 'FM Operations'],
  'cli-lunch': [...fnb, 'Catering', 'Business Center'],
};

/** Legacy area steps (not on persona maps today) — keep populated for deep links. */
export const LEGACY_AREA_MOMENT_EXTRA_MODULES: Record<string, readonly string[]> = {
  'arrival-campus': welcome,
  'morning-class': learnStudy,
  'lunch-break': fnb,
  'study-session': [...learnStudy, 'Hydration / Water', 'Snacking'],
  'morning-rounds': [...healClinical, 'Analytics'],
  'meal-service': [...healClinical, 'Menu planning'],
  'meal-distribution': [...healClinical, 'Service Robots'],
  'kitchen-prep': healKitchen,
  'pre-match': playVenue,
  'peak-service': playVenue,
  'half-time': [...playVenue, 'Hydration / Water'],
  'full-time': playSocial,
  'networking-lunch': [...fnb, 'Room booking'],
};

function mergeExtra(
  steps: Record<string, JourneyStep>,
  extra: Record<string, readonly string[]>,
  validModuleNames: Set<string>,
  skipMomentId?: (id: string) => boolean,
): Record<string, JourneyStep> {
  const out: Record<string, JourneyStep> = {};
  for (const [id, step] of Object.entries(steps)) {
    out[id] = { ...step, modules: [...step.modules] };
  }
  for (const [momentId, names] of Object.entries(extra)) {
    if (skipMomentId?.(momentId)) continue;
    const step = out[momentId];
    if (!step) continue;
    const filtered = names.filter((n) => validModuleNames.has(n));
    out[momentId] = {
      ...step,
      modules: Array.from(new Set([...step.modules, ...filtered])),
    };
  }
  return out;
}

/**
 * Union curated modules into journey steps for persona-specific moment ids.
 * Skips ids in `MOMENT_IDS_WITH_BUILTIN_MODULE_WIRING` so Excel/TDDI stays authoritative.
 */
export function applyPersonaMomentModuleFill(
  steps: Record<string, JourneyStep>,
  modules: Record<string, Module>,
): Record<string, JourneyStep> {
  const valid = new Set(Object.keys(modules));
  const skipExcel = (id: string) => EXCEL_JOURNEY_STEP_IDS.has(id);
  let merged = mergeExtra(steps, PERSONA_MOMENT_EXTRA_MODULES, valid, skipExcel);
  merged = mergeExtra(merged, LEGACY_AREA_MOMENT_EXTRA_MODULES, valid, skipExcel);

  for (const id of Array.from(MOMENT_IDS_WITH_BUILTIN_MODULE_WIRING)) {
    const original = steps[id];
    if (!original || !merged[id]) continue;
    merged[id] = { ...merged[id], modules: [...original.modules] };
  }

  return merged;
}
