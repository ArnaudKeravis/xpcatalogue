/**
 * TDDI V2 catalogue merge — enriches the Excel-backed fallback with the
 * **Modules experiences TDDI DB (V2)** structure (module types, audience,
 * solution brand lists, external notes, associated moments) and wires
 * representative brands into the journey where no catalogue row exists yet.
 *
 * Source: Notion export / screenshots shared April 2026 (Sodexo World).
 */

import type { JourneyStep, Module, ModuleTddiMeta, Solution } from './types';
import { resolveSolutionId } from './xpFlowAdapter';

/** Public marker for UI / filtering on synthetic rows. */
export const TDDI_STUB_FLAG = 'TDDI reference';

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Maps verbatim Associated Moments (TDDI) labels → existing `JourneyStep` ids.
 * One label may touch both consumer white-collar steps and operator steps.
 */
export const TDDI_MOMENT_LABEL_TO_STEP_IDS: Record<string, string[]> = {
  'Welcome & Orientation': ['welcome-area'],
  'Kick Off & Daily Check': ['op-kick-off', 'workplace'],
  'Internal Meetings & Alignments': ['workplace', 'op-office-time'],
  Workplace: ['workplace'],
  'Focused Work': ['workplace'],
  'Food & Beverage Area': ['food-beverage-work'],
  'Lunch Break': ['food-beverage-work'],
  'Dinner & Late Stay': ['food-beverage-work'],
  'Snacks / Coffee / Sweet Breaks': ['food-beverage-work'],
  'Wellness & Socializing': ['wellbeing-break'],
  'Community Programs': ['wellbeing-break'],
  'Gym / Activity Area': ['wellbeing-break'],
  'Morning / Daily Routine': ['commute', 'welcome-area'],
  'Afterhours / Socialize': ['wellbeing-break'],
  'Evening / Night Out': ['wellbeing-break'],
  'Personal Space': ['workplace'],
  'External Meetings': ['workplace', 'welcome-area'],
  'Common Area': ['welcome-area'],
  Commute: ['commute'],
};

/** Known public homepages for stub CTAs (editorial, not partner commitments). */
const TDDI_BRAND_URL: Record<string, string> = {
  coursera: 'https://www.coursera.org/',
  udacity: 'https://www.udacity.com/',
  udemy: 'https://www.udemy.com/',
  linkedinlearning: 'https://www.linkedin.com/learning/',
  peloton: 'https://www.onepeloton.com/',
  mirror: 'https://www.lululemon.com/en-us/studio/mirror',
  applefitness: 'https://www.apple.com/apple-fitness-plus/',
  niketrainingclub: 'https://www.nike.com/ntc-app',
  chatgpt: 'https://chatgpt.com/',
  notion: 'https://www.notion.so/',
  amazongo: 'https://www.amazon.com/b?node=18017508011',
  standardai: 'https://standard.ai/',
  aifi: 'https://aifi.com/',
  trigo: 'https://www.trigoretail.com/',
  zippin: 'https://getzippin.com/',
  cafex: 'https://robot.cafe/',
  briggo: 'https://www.briggo.com/',
  artly: 'https://artly.coffee/',
  truebird: 'https://truebird.com/',
  belkin: 'https://www.belkin.com/',
  anker: 'https://www.anker.com/',
  freshbooks: 'https://www.freshbooks.com/',
  quickbooks: 'https://quickbooks.intuit.com/',
  xero: 'https://www.xero.com/',
  wework: 'https://www.wework.com/',
  regus: 'https://www.regus.com/',
  iwg: 'https://www.iwgplc.com/',
  cater2me: 'https://cater2.me/',
  ezcater: 'https://www.ezcater.com/',
  zerocater: 'https://zerocater.com/',
  sepa: 'https://www.europeanpaymentscouncil.eu/',
  cards: 'https://www.visa.com/',
  expensemanagementplatform: 'https://www.concur.com/',
  b2bplatforms: 'https://www.sap.com/products/financial-management.html',
};

function urlForListedName(name: string): string | undefined {
  const k = norm(name);
  return TDDI_BRAND_URL[k];
}

function makeTddiStubSolution(listedName: string, moduleName: string): Solution {
  const idBase = `tddi-${slugify(moduleName)}-${slugify(listedName)}`.replace(/-+/g, '-');
  const id = idBase.length <= 72 ? idBase : idBase.slice(0, 72);
  return {
    id,
    name: listedName,
    module: moduleName,
    type: 'Software',
    status: 'Study',
    hashtags: [TDDI_STUB_FLAG],
    flags: [],
    img: '',
    context:
      'Representative offering named in the Sodexo TDDI experience database (V2). Shown here as a reference link until a full catalogue sheet row exists.',
    description:
      'This entry is generated from the TDDI “Solutions (TDDI)” column so the module page stays navigable. Replace with a full Notion solution record when available.',
    kpis: [],
    contact: '',
    benefits: { client: '', consumer: '', sodexo: '' },
    url: urlForListedName(listedName),
    areas: ['work'],
  };
}

export interface TddiV2EnrichmentRow {
  catalogueModuleName: string;
  sourceTitle: string;
  moduleTypes: string[];
  userPresence: ModuleTddiMeta['userPresence'];
  isNew: boolean;
  solutionsListed: string[];
  externalSolutions?: string;
  associatedMomentLabels: string[];
  /** Optional richer description (TDDI / Notion prose). */
  enrichedDescription?: string;
}

/** Modules that exist only in TDDI V2 — inserted before enrichment rows run. */
export const TDDI_ONLY_MODULES: Module[] = [
  {
    id: 'accounts-card-and-management-corporate',
    name: 'Accounts, Card and Management (Corporate)',
    icon: '💳',
    gradient: 'linear-gradient(135deg,#1a3af0,#4d8aff)',
    description:
      'Corporate cards, SEPA flows, and expense platforms that keep client finance teams aligned with on-site Sodexo operations.',
    solutionIds: [],
  },
  {
    id: 'ai-personal-assistant',
    name: 'AI - Personal Assistant',
    icon: '✨',
    gradient: 'linear-gradient(135deg,#e55a1c,#7b2fa0)',
    description:
      'Generative assistants and knowledge workspaces that shorten everyday tasks for consumers at work.',
    solutionIds: [],
  },
  {
    id: 'billing-and-invoicing-tddi',
    name: 'Billing & Invoicing (TDDI)',
    icon: '📄',
    gradient: 'linear-gradient(135deg,#0e6da8,#293896)',
    description:
      'Cloud accounting and invoicing suites used alongside Sodexo contract and recharge workflows.',
    solutionIds: [],
  },
  {
    id: 'business-center',
    name: 'Business Center',
    icon: '🏢',
    gradient: 'linear-gradient(135deg,#293896,#6a74b6)',
    description:
      'Flexible workspace and business-centre networks that extend the workplace beyond the core Sodexo site.',
    solutionIds: [],
  },
];

/**
 * One row per enriched catalogue module (canonical `name` key in `modules`).
 * Aligns with the sample rows extracted from the TDDI V2 Notion table.
 */
export const TDDI_V2_ENRICHMENTS: TddiV2EnrichmentRow[] = [
  {
    catalogueModuleName: 'Accounts, Card and Management (Corporate)',
    sourceTitle: 'Accounts, Card and Management (Corporate)',
    moduleTypes: ['Digital'],
    userPresence: ['client'],
    isNew: false,
    solutionsListed: ['B2B Platforms', 'SEPA', 'Cards', 'Expense Management Platform'],
    associatedMomentLabels: [
      'Welcome & Orientation',
      'Kick Off & Daily Check',
      'Internal Meetings & Alignments',
    ],
  },
  {
    catalogueModuleName: 'Training',
    sourceTitle: '24/7 Learning',
    moduleTypes: ['Digital'],
    userPresence: ['consumer'],
    isNew: false,
    solutionsListed: ['Coursera', 'Udacity', 'Udemy', 'LinkedIn Learning'],
    associatedMomentLabels: [
      'Welcome & Orientation',
      'Focused Work',
      'Food & Beverage Area',
      'Wellness & Socializing',
      'Community Programs',
      'Lunch Break',
      'Dinner & Late Stay',
      'Snacks / Coffee / Sweet Breaks',
    ],
    enrichedDescription:
      'Always-on learning platforms that let employees upskill between meetings, breaks, and community moments — aligned with the TDDI “24/7 Learning” module.',
  },
  {
    catalogueModuleName: 'Gym',
    sourceTitle: 'Active Fit',
    moduleTypes: ['Physical', 'Wellness'],
    userPresence: ['consumer'],
    isNew: false,
    solutionsListed: ['Peloton', 'Mirror', 'Apple Fitness+', 'Nike Training Club'],
    associatedMomentLabels: [
      'Workplace',
      'Wellness & Socializing',
      'Gym / Activity Area',
      'Lunch Break',
      'Food & Beverage Area',
      'Morning / Daily Routine',
      'Afterhours / Socialize',
      'Evening / Night Out',
    ],
  },
  {
    catalogueModuleName: 'AI - Personal Assistant',
    sourceTitle: 'AI - Personal Assistant',
    moduleTypes: ['Productivity'],
    userPresence: ['consumer'],
    isNew: true,
    solutionsListed: ['ChatGPT', 'Notion'],
    associatedMomentLabels: [
      'Workplace',
      'Food & Beverage Area',
      'Lunch Break',
      'Focused Work',
      'Personal Space',
      'Morning / Daily Routine',
      'Internal Meetings & Alignments',
    ],
  },
  {
    catalogueModuleName: 'Store / micromarket',
    sourceTitle: 'Autonomous Shop',
    moduleTypes: ['Autonomous Store'],
    userPresence: ['consumer'],
    isNew: false,
    solutionsListed: ['Amazon Go', 'Standard AI', 'AiFi', 'Trigo', 'Zippin'],
    associatedMomentLabels: [
      'Workplace',
      'Food & Beverage Area',
      'Lunch Break',
      'Dinner & Late Stay',
      'Snacks / Coffee / Sweet Breaks',
      'Afterhours / Socialize',
    ],
  },
  {
    catalogueModuleName: 'Alternative F&B',
    sourceTitle: 'Autonomous Coffee / Refreshment Bar',
    moduleTypes: ['Physical', 'Digital'],
    userPresence: ['consumer'],
    isNew: false,
    solutionsListed: ['Cafe X', 'Briggo', 'Artly', 'Truebird', 'Costa Express'],
    associatedMomentLabels: [
      'Workplace',
      'Food & Beverage Area',
      'Lunch Break',
      'Snacks / Coffee / Sweet Breaks',
      'Dinner & Late Stay',
      'Afterhours / Socialize',
    ],
  },
  {
    catalogueModuleName: 'Battery charger',
    sourceTitle: 'Battery Charger',
    moduleTypes: ['Tech'],
    userPresence: ['consumer'],
    isNew: false,
    solutionsListed: ['Belkin', 'Anker'],
    associatedMomentLabels: [
      'Workplace',
      'Wellness & Socializing',
      'Common Area',
      'Focused Work',
      'External Meetings',
      'Dinner & Late Stay',
      'Lunch Break',
      'Snacks / Coffee / Sweet Breaks',
    ],
  },
  {
    catalogueModuleName: 'Billing & Invoicing (TDDI)',
    sourceTitle: 'Billing & Invoicing (TDDI)',
    moduleTypes: ['Digital'],
    userPresence: ['client', 'operator'],
    isNew: false,
    solutionsListed: ['FreshBooks', 'QuickBooks', 'Xero'],
    associatedMomentLabels: [
      'Welcome & Orientation',
      'Kick Off & Daily Check',
      'Internal Meetings & Alignments',
    ],
  },
  {
    catalogueModuleName: 'Business Center',
    sourceTitle: 'Business Center',
    moduleTypes: ['Physical'],
    userPresence: ['client', 'operator'],
    isNew: false,
    solutionsListed: ['WeWork', 'Regus', 'IWG'],
    associatedMomentLabels: [
      'Workplace',
      'Common Area',
      'Focused Work',
      'Wellness & Socializing',
      'Internal Meetings & Alignments',
      'External Meetings',
    ],
  },
  {
    catalogueModuleName: 'Catering',
    sourceTitle: 'Catering (TDDI)',
    moduleTypes: ['Food'],
    userPresence: ['client', 'operator'],
    isNew: false,
    solutionsListed: ['Cater2.me', 'ezCater', 'ZeroCater'],
    associatedMomentLabels: [
      'Workplace',
      'Food & Beverage Area',
      'Lunch Break',
      'Snacks / Coffee / Sweet Breaks',
      'External Meetings',
      'Afterhours / Socialize',
    ],
  },
];

function mergeTddiMeta(a: ModuleTddiMeta, b: ModuleTddiMeta): ModuleTddiMeta {
  const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));
  return {
    sourceTitle: b.sourceTitle,
    moduleTypes: uniq([...a.moduleTypes, ...b.moduleTypes]),
    userPresence: uniq([...a.userPresence, ...b.userPresence]),
    isNew: a.isNew || b.isNew,
    solutionsListed: uniq([...a.solutionsListed, ...b.solutionsListed]),
    externalSolutions: [a.externalSolutions, b.externalSolutions].filter(Boolean).join(' · ') || undefined,
    associatedMomentLabels: uniq([...a.associatedMomentLabels, ...b.associatedMomentLabels]),
  };
}

export interface TddiMergeResult {
  modules: Record<string, Module>;
  journeySteps: Record<string, JourneyStep>;
  extraSolutions: Solution[];
}

export function mergeTddiV2IntoCatalogue(
  modules: Record<string, Module>,
  journeySteps: Record<string, JourneyStep>,
  baseSolutions: Solution[],
): TddiMergeResult {
  const modulesOut: Record<string, Module> = { ...modules };
  for (const m of TDDI_ONLY_MODULES) {
    if (!modulesOut[m.name]) {
      modulesOut[m.name] = { ...m, solutionIds: [...(m.solutionIds ?? [])] };
    }
  }

  const stepsOut: Record<string, JourneyStep> = {};
  for (const [k, s] of Object.entries(journeySteps)) {
    stepsOut[k] = { ...s, modules: [...s.modules] };
  }

  const existingIds = new Set(baseSolutions.map((s) => s.id));
  const extraSolutions: Solution[] = [];

  for (const row of TDDI_V2_ENRICHMENTS) {
    const mod = modulesOut[row.catalogueModuleName];
    if (!mod) continue;

    const tddiNew: ModuleTddiMeta = {
      sourceTitle: row.sourceTitle,
      moduleTypes: row.moduleTypes,
      userPresence: row.userPresence,
      isNew: row.isNew,
      solutionsListed: row.solutionsListed,
      externalSolutions: row.externalSolutions,
      associatedMomentLabels: row.associatedMomentLabels,
    };
    const tddiMerged = mod.tddi ? mergeTddiMeta(mod.tddi, tddiNew) : tddiNew;

    const newIds: string[] = [];
    for (const listed of row.solutionsListed) {
      const resolved = resolveSolutionId(listed);
      if (resolved) {
        newIds.push(resolved);
        continue;
      }
      const stub = makeTddiStubSolution(listed, mod.name);
      if (!existingIds.has(stub.id)) {
        existingIds.add(stub.id);
        extraSolutions.push(stub);
      }
      newIds.push(stub.id);
    }

    const solutionIds = Array.from(new Set([...(mod.solutionIds ?? []), ...newIds]));
    modulesOut[row.catalogueModuleName] = {
      ...mod,
      tddi: tddiMerged,
      solutionIds,
      description: row.enrichedDescription ?? mod.description,
    };

    for (const label of row.associatedMomentLabels) {
      const stepIds = TDDI_MOMENT_LABEL_TO_STEP_IDS[label];
      if (!stepIds) continue;
      for (const sid of stepIds) {
        const step = stepsOut[sid];
        if (!step) continue;
        if (!step.modules.includes(mod.name)) {
          step.modules = [...step.modules, mod.name];
        }
      }
    }
  }

  return { modules: modulesOut, journeySteps: stepsOut, extraSolutions };
}
