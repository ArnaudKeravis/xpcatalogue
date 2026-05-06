/**
 * XP Flow Adapter — merges the Excel-sourced flow from `xpCatalogueFlow.ts`
 * into the app's canonical types (`Module`, `JourneyStep`).
 *
 * This is an *additive* adapter:
 *  - Adds Excel modules that do not exist in `MODULE_CONFIGS`, populating
 *    `solutionIds` by fuzzy-matching Excel solution names to app solution IDs.
 *  - Exposes Excel moments (Consumer White Collar + Operator) as
 *    journey-step augmentations so `fallback.ts` can wire them in without
 *    rewriting existing step definitions.
 */

import type { Module, JourneyStep } from './types';
import { XP_CATALOGUE_FLOW, type XpFlowModule, type XpFlowMoment } from './xpCatalogueFlow';
import { SOLUTIONS_CATALOG } from './solutionsCatalog';

const norm = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Normalize Excel module names that have minor typos / casing drift. Anything
 * not in this map passes through unchanged. This ensures the module catalogue
 * and journey-step references use consistent labels.
 */
const MODULE_NAME_ALIASES: Record<string, string> = {
  Concierge: 'Conciergerie',
  'store/ micromarket': 'Store / micromarket',
  'advanced/ smart vending': 'Advanced / smart vending',
  'sustainability measured': 'Sustainability measured',
  'Visitor Management & Accesscontrol': 'Visitor Management & Access control',
  'Food delivery /serving': 'Food delivery / serving',
  FMChecking: 'FM Checking',
};

/** Normalizes Excel / editorial module labels so catalogue keys stay consistent. */
export function canonModuleName(name: string): string {
  const trimmed = name.trim();
  return MODULE_NAME_ALIASES[trimmed] ?? trimmed;
}

/**
 * Manual aliases for Excel → app solutions that neither exact-match nor the
 * loose substring match can resolve. Keys are the Excel name (lower-cased,
 * trimmed); values are the **canonical catalogue solution id** in
 * `solutionsCatalog.ts`. The runtime `SOLUTION_IDS` set validates every value
 * at module load, so a typo here becomes a build-time error — not a silent
 * `undefined` returned from `resolveSolutionId`.
 */
const SOLUTION_ALIASES: Record<string, string> = {
  // Wording variants in the Excel
  'nespresso intervallo': 'intervalloNespresso',
  'intervallo- nespresso': 'intervalloNespresso',
  'neat frame': 'neatFrame',
  neatframe: 'neatFrame',
  'neat frame- digital reception': 'neatFrame',
  bootingkit: 'botinkit',
  botinkit: 'botinkit',
  bluefrog: 'blueFrog',
  'blue frog': 'blueFrog',
  coolroof: 'coolRoof',
  'cool roof': 'coolRoof',
  'bear robotic': 'bearRobotics',
  'bear robotics': 'bearRobotics',
  'bear robotic (hc)': 'bearRobotics',
  userve: 'userveRobot',
  'userve robot': 'userveRobot',
  'zebra smart gloves': 'zebraSmartgloves',
  'zebra smartgloves': 'zebraSmartgloves',
  'goospot check': 'gospoCheck',
  'gospot check': 'gospoCheck',
  gospotcheck: 'gospoCheck',
  handtalk: 'handTalk',
  absurizap: 'absUrizap',
  'abs urizap': 'absUrizap',
  'abs- urizap': 'absUrizap',
  'ebar beerwall ( live!)': 'eBarBeerwall',
  'ebar beerwall': 'eBarBeerwall',
  'foodini ( health )': 'foodini',
  salus: 'salus',
  'vr kitchen training': 'visionaries777',
  'vr kitchen': 'visionaries777',
  'visionaries 77': 'visionaries777',
  visionaries777: 'visionaries777',
  placerai: 'placerAi',
  'placer.ai': 'placerAi',
  'brand performance': 'brandPerformance',
  circularplace: 'circularPlace',
  'circular place': 'circularPlace',
  'sensio air': 'sensioAir',
  'sensio air ltd': 'sensioAir',
  'oxygen  at work': 'oxygenAtWork',
  'oxygen at work': 'oxygenAtWork',
  menuai: 'menuai',
  'menu ai': 'menuai',
  'pret-a-generer - menu ai': 'menuai',
  'sodexo wrx': 'sodexoWrx',
  sodexowrx: 'sodexoWrx',
  'wando app': 'wandoAnalytics',
  leanpath: 'leanpath',
  'my village': 'myVillage',
  'my village ': 'myVillage',
  icertainty: 'icertainty',
  sea: 'sea',
  adialpizzador: 'adialPizzador',
  'adial pizzador': 'adialPizzador',
  // Gaps surfaced by the post-ingest audit
  alberts: 'albertsSmoothie',
  'alberts smoothie and soups vending': 'albertsSmoothie',
  'greese to goodness': 'greaseToGoodness',
  'grease to goodness': 'greaseToGoodness',
  wando: 'wandoAnalytics',
  'wando analytics': 'wandoAnalytics',
  'wando d&i': 'wandoDi',
  // Normalised duplicates that we want to keep addressable
  'blue ocean': 'blueOceanUvd',
  'blue ocean- uvd robots': 'blueOceanUvd',
  'vusion group': 'vusionGroup',
  'vusiongroup': 'vusionGroup',
  'so campus': 'soCampus',
  'socampus': 'soCampus',
  'airomas- air freshener': 'airomas',
  airomas: 'airomas',
  'starship technologies': 'starship',
  starship: 'starship',
  'costa express': 'costaCoffeeMachine',
  'amazon go': 'amazonJwo',
  'in reach (a sodexo brand)': 'inReach',
  inreach: 'inReach',
  'pavegen': 'pavegen',
  'instarinse (through bunzl)': 'instarinse',
  instarinse: 'instarinse',
  'relearn (nando) ih': 'relearn',
  'aquablu (ih)': 'aquablu',
  aquablu: 'aquablu',
  // Solutions referenced by the Excel but not present in the catalogue are
  // intentionally omitted — `resolveSolutionId` returns undefined so the
  // adapter drops them (Arsene, K1nect, Kiwibot, Lesieur, MyApps, Toqla,
  // SoEze, SoPro AI, B2B Platform, Pegasus, Product Swap, Ecoloop, Releaf
  // Paper, Zeroimpack, Somatic, Smoodi, DishTracker, VisioLab, Costa coffee
  // machine, Noponto, Bibak, Beyond Oil, Keystone, Aqualibra, BOXXTECH,
  // Pricing, Powerchef, Qualipad, Toolsense, Notpla, Foresight HR, SEA,
  // Inspekly, SoCampus, SALUS, Cluix, Hivebotics, KTV working drone, REPG,
  // DBFM, Gausium, Sormac, Kikleo, Goodbytz, Eatch, Emoticonnect, Tawny,
  // Qualtrics, Metronaps, Neurabody, Nono, Ottonomy, Sodexo Direct, Everyday,
  // Eat Curious, Kumulus, Cubo, Foodini, SavorEat, Totem, Selecta, Solato,
  // Mashgin, Trayvisor, Deligo, Aifi, Amazon JWO, Zippin by Fujitsu, TAQT,
  // Lionsbot, Bioteos, Orbital Bloom, Circles). Most of those DO live in the
  // catalogue and resolve via `SOLUTION_INDEX` (exact normalized-name match),
  // so no alias is needed.
};

/** Build a lookup: normalized solution name → canonical app solution id. */
function buildSolutionIndex(): Map<string, string> {
  const index = new Map<string, string>();
  for (const sol of SOLUTIONS_CATALOG) {
    const key = norm(sol.name);
    if (!index.has(key)) index.set(key, sol.id);
  }
  return index;
}

const SOLUTION_INDEX = buildSolutionIndex();
const SOLUTION_IDS = new Set(SOLUTIONS_CATALOG.map((s) => s.id));

// Self-test: every alias target must point at a real catalogue id. If someone
// typoes an alias value, the dev build will surface it immediately instead of
// silently dropping the module-solution link. We log to stderr only in dev.
if (process.env.NODE_ENV !== 'production') {
  const missing = Object.entries(SOLUTION_ALIASES)
    .filter(([, id]) => !SOLUTION_IDS.has(id))
    .map(([k, id]) => `${k} → ${id}`);
  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.warn('[xpFlowAdapter] SOLUTION_ALIASES target(s) not in catalogue:', missing);
  }
}

/**
 * Excel **Solutions** tab copy keyed by catalogue `solution.id`.
 * Matches each Excel solution name → id via {@link resolveSolutionId}; prefers the
 * longest non-empty description when several Excel rows resolve to one id.
 */
export function excelDescriptionBySolutionId(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [excelName, meta] of Object.entries(XP_CATALOGUE_FLOW.solutions)) {
    const id = resolveSolutionId(excelName);
    const text = meta.description?.trim();
    if (!id || !text) continue;
    const prev = out[id];
    if (!prev || text.length > prev.length) out[id] = text;
  }
  return out;
}

/** Resolve an Excel solution name to an app solution id, or undefined. */
export function resolveSolutionId(excelName: string): string | undefined {
  const key = norm(excelName);
  // 1. Exact normalized-name match against the catalogue.
  if (SOLUTION_INDEX.has(key)) return SOLUTION_INDEX.get(key);
  // 2. Manual alias → catalogue id (validated above).
  const aliasId = SOLUTION_ALIASES[excelName.toLowerCase().trim()];
  if (aliasId && SOLUTION_IDS.has(aliasId)) return aliasId;
  // 3. Loose substring match as last resort (6+ char keys to avoid bad hits).
  if (key.length >= 6) {
    const entries = Array.from(SOLUTION_INDEX.entries());
    for (let i = 0; i < entries.length; i++) {
      const [k, v] = entries[i];
      if (k.length >= 4 && (k.includes(key) || key.includes(k))) {
        if (Math.abs(k.length - key.length) <= 12) return v;
      }
    }
  }
  return undefined;
}

/** Emoji + gradient defaults for Excel modules (semantic best-guess). */
const MODULE_STYLE_DEFAULTS: Record<string, { icon: string; gradient: string }> = {
  Consumer: { icon: '👤', gradient: 'linear-gradient(135deg,#1a3af0,#4d8aff)' },
  Operator: { icon: '🛠️', gradient: 'linear-gradient(135deg,#293896,#0e6da8)' },
};

const MODULE_ICON_BY_NAME: Record<string, string> = {
  'Parking Management': '🅿️',
  Wayfinding: '🧭',
  Conciergerie: '🛎️',
  Concierge: '🛎️',
  'Sustainability awareness': '🌱',
  Display: '📺',
  'Digital reception': '🛎️',
  'Battery charger': '🔋',
  'Alternative F&B': '🥗',
  Robots: '🤖',
  'Store / micromarket': '🏪',
  'AI tray scanning': '📷',
  'Advanced / smart vending': '🥫',
  'Delivery Robots': '🚚',
  'Digital XP': '📱',
  'Robot cooking': '🍳',
  'Hydration / Water': '💧',
  'Room booking': '📅',
  'Service Request': '🔧',
  Feedback: '⭐',
  Catering: '🍽️',
  'Circular economy': '♻️',
  Gym: '🏋️',
  'Air quality': '🌬️',
  Snacking: '🍿',
  'Physical health': '💪',
  'Mental health': '🧘',
  'Cleaning efficiency': '🧹',
  IOT: '📡',
  'Energy management': '⚡',
  'Maintenance & Asset mgmt': '🛠️',
  Reception: '🛎️',
  Training: '🎓',
  'Work Order Management': '📋',
  'Sustainability measured': '📉',
  'Real time insights': '📊',
  'Space planning': '📐',
  'Visitor Management & Access control': '🚪',
  'Footfall & Space analytics': '📍',
  'Workforce management': '👥',
  'Price management': '💲',
  'Food Safety': '🌡️',
  'HR & Staff management': '👔',
  '3D Printing': '🖨️',
  'Automated food processing': '⚙️',
  'Waste management': '🗑️',
  'Menu planning': '📝',
  'Food delivery / serving': '🍱',
  'Inventory management': '📦',
  Quality: '✅',
  'Hygiene & Sanitation': '🧽',
  'Circular & Upcycling': '🔁',
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Deterministic gradient based on persona. */
function gradientFor(persona: string | null | undefined): string {
  if (persona === 'Operator') return 'linear-gradient(135deg,#293896,#0e6da8)';
  return 'linear-gradient(135deg,#1a3af0,#4d8aff)';
}

/**
 * Build Module configs from the Excel flow. Excel module names keyed directly,
 * `solutionIds` populated from fuzzy-matched Excel solution names.
 *
 * Note on dedup: the Excel contains two "Alternative F&B", two "Real time insights"
 * and two "Circular economy" entries (different moments, same module name). We
 * merge their solution lists so the module page shows the union.
 */
export function buildExcelModules(): Record<string, Module> {
  const byName = new Map<string, XpFlowModule[]>();
  for (const m of XP_CATALOGUE_FLOW.modules) {
    const canonical = canonModuleName(m.name);
    const list = byName.get(canonical) ?? [];
    list.push({ ...m, name: canonical });
    byName.set(canonical, list);
  }

  const out: Record<string, Module> = {};
  const allEntries = Array.from(byName.entries());
  for (let i = 0; i < allEntries.length; i++) {
    const [name, entries] = allEntries[i];
    const unionSolutions = new Set<string>();
    for (const e of entries) for (const s of e.solutions) unionSolutions.add(s);
    const solutionIds = Array.from(unionSolutions)
      .map((s) => resolveSolutionId(s))
      .filter((v): v is string => !!v);

    const primary = entries[0];
    out[name] = {
      id: slugify(name),
      name,
      icon: MODULE_ICON_BY_NAME[name] ?? MODULE_STYLE_DEFAULTS[primary.persona ?? 'Consumer']?.icon ?? '📦',
      description: primary.description || `${name} module — ${primary.persona ?? 'Consumer'} journey.`,
      gradient: gradientFor(primary.persona),
      solutionIds,
    };
  }
  return out;
}

/**
 * For a Consumer White Collar moment, return the list of module names
 * (matching keys in `buildExcelModules()`).
 */
export function consumerModuleNamesByMoment(): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const moment of XP_CATALOGUE_FLOW.consumerWorkMoments) {
    result[moment.name] = Array.from(
      new Set(moment.modules.map((m) => canonModuleName(m.module)))
    ).filter(Boolean);
  }
  return result;
}

/** Same shape, but for Operator moments. */
export function operatorModuleNamesByMoment(): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const moment of XP_CATALOGUE_FLOW.operatorMoments) {
    result[moment.name] = Array.from(
      new Set(moment.modules.map((m) => canonModuleName(m.module)))
    ).filter(Boolean);
  }
  return result;
}

function lookupModuleDescriptionExcel(moduleName: string, persona: 'Consumer' | 'Operator'): string {
  const target = norm(canonModuleName(moduleName));
  for (const mod of XP_CATALOGUE_FLOW.modules) {
    if (mod.persona !== persona) continue;
    if (norm(canonModuleName(mod.name)) === target) return mod.description.trim();
  }
  return '';
}

/**
 * Build a readable moment blurb from Excel **Modules** tab descriptions for all
 * modules listed under that moment (deduped). Used when no explicit **Description**
 * column is filled on the moment row.
 */
export function synthesizeMomentDescriptionFromModules(
  moment: XpFlowMoment,
  persona: 'Consumer' | 'Operator',
): string {
  const chunks: string[] = [];
  const seen = new Set<string>();
  for (const row of moment.modules) {
    const d = lookupModuleDescriptionExcel(row.module, persona);
    if (!d) continue;
    const key = norm(d);
    if (seen.has(key)) continue;
    seen.add(key);
    chunks.push(d);
    if (chunks.length >= 8) break;
  }
  const text = chunks.join(' ').replace(/\s+/g, ' ').trim();
  return text.length > 1600 ? `${text.slice(0, 1597)}…` : text;
}

/** Prefer explicit Excel moment cell; otherwise module-description synthesis from the workbook. */
export function effectiveConsumerMomentDescription(momentName: string): string {
  const moment = XP_CATALOGUE_FLOW.consumerWorkMoments.find((m) => m.name === momentName);
  if (!moment) return '';
  const ex = moment.description?.trim();
  if (ex) return ex;
  return synthesizeMomentDescriptionFromModules(moment, 'Consumer');
}

/** Operator sheet moment name must match Excel `moment.name`. */
export function effectiveOperatorMomentDescription(excelMomentName: string): string {
  const name = excelMomentName.trim();
  const moment = XP_CATALOGUE_FLOW.operatorMoments.find((m) => m.name.trim() === name);
  if (!moment) return '';
  const ex = moment.description?.trim();
  if (ex) return ex;
  return synthesizeMomentDescriptionFromModules(moment, 'Operator');
}

/**
 * Map Excel Consumer moment names → existing app `JourneyStep` ids.
 * (The app already defines these 5 Work-Consumer steps; we just reuse them.)
 */
export const CONSUMER_MOMENT_TO_STEP: Record<string, string> = {
  Commute: 'commute',
  'Welcome Area': 'welcome-area',
  'F&B': 'food-beverage-work',
  WP: 'workplace',
  Wellbeing: 'wellbeing-break',
};

/**
 * For the Operator persona, Excel defines a distinct set of moments that do
 * not yet exist in `JOURNEY_STEPS`. We expose them here so `fallback.ts` can
 * create dedicated journey steps for the `operator-work` persona.
 */
export const OPERATOR_MOMENTS: Array<{ id: string; label: string; icon: string; excelName: string }> = [
  { id: 'op-fm-round', label: 'FM Checking round', icon: '🧹', excelName: 'FMChecking round' },
  { id: 'op-kick-off', label: 'Kick off & early check', icon: '📋', excelName: 'Kick off & early check' },
  { id: 'op-office-time', label: 'Office time', icon: '💼', excelName: 'Office time' },
  {
    id: 'op-order-planning',
    label: 'Order, planning & maintenance',
    icon: '🗂️',
    excelName: 'Order, planning & maintenance management',
  },
  { id: 'op-food-service', label: 'F&B operations', icon: '🍽️', excelName: 'F&B' },
];

/**
 * Build `JourneyStep` entries for the Operator moments. `modules` points to
 * Excel module names so they resolve against `buildExcelModules()`.
 */
export function buildOperatorJourneySteps(): Record<string, JourneyStep> {
  const byExcelName = new Map<string, string[]>();
  for (const moment of XP_CATALOGUE_FLOW.operatorMoments) {
    const list = byExcelName.get(moment.name) ?? [];
    const names = moment.modules.map((m) => canonModuleName(m.module)).filter(Boolean);
    byExcelName.set(moment.name, Array.from(new Set([...list, ...names])));
  }

  const steps: Record<string, JourneyStep> = {};
  for (const m of OPERATOR_MOMENTS) {
    const fromExcel = effectiveOperatorMomentDescription(m.excelName);
    steps[m.id] = {
      id: m.id,
      label: m.label,
      icon: m.icon,
      modules: byExcelName.get(m.excelName) ?? [],
      description: fromExcel || `Operator moment — ${m.label}.`,
    };
  }
  return steps;
}
