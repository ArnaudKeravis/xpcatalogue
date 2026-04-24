/**
 * Curated collections — hand-tagged shortlists of catalogue solutions.
 *
 * Two collections are maintained here:
 *
 * 1. **Standard Offer** — Sodexo's scaled, matured, client-ready products as
 *    documented in the TDDI Standard Offer deck (Sodexo Spark). These are the
 *    solutions a sales / account team can safely propose today.
 *
 * 2. **Blockbuster** — the AI products explicitly called out as boosting Sodexo
 *    P&L in the TDDI AI portfolio slide (B2C / B2O / B2B AI, GenAI, AgenticAI).
 *
 * Source of truth lives here, not in each Solution record, so the two lists
 * can evolve independently of the catalogue data feed (Notion / fallback).
 */

import type { Solution, SolutionCollection } from './types';

/**
 * Solution IDs (matching `src/lib/data/solutionsCatalog.ts`) that belong to
 * the Standard Offer. Derived from the TDDI Standard Offer deck:
 *   - Spark IQ   : 4Site, B2B Platform, (FM Insights via DBFM)
 *   - Spark OS   : MenuAI, SEA (sustainability), DBFM (dynamic services / command centres)
 *   - Spark XP   : Everyday, Sodexo WRX (× 2 module entries), Circles, Autonomous /
 *                  frictionless stores (AiFi / JWO / Zippin / Totem / Mashgin / Trayvisor)
 */
export const STANDARD_OFFER_IDS: readonly string[] = [
  '4site',
  'b2bPlatform',
  'menuai',
  'sea',
  'dbfm',
  'everyday',
  'sodexoWrx',
  'sodexoWrxConciergerie',
  'circles',
  'aifi',
  'amazonJwo',
  'zippin',
  'totem',
  'mashgin',
  'trayvisor',
] as const;

/**
 * Solution IDs that belong to the AI Blockbuster shortlist (the P&L-impact slide).
 *
 * Mapping from slide labels to catalogue IDs:
 *   - 4Site         → `4site`
 *   - DBFM          → `dbfm`
 *   - ForeSight HR  → `foresightHr`
 *   - PowerChef     → `powerchef`
 *   - Power Pricing → `pricing`
 *   - Menu AI       → `menuai`
 *   - P Swap        → `productSwap`
 *   - Pegasus       → `pegasus`
 *   - SoProAI       → `soproAi`
 *   - Brand Perf    → `brandPerformance`
 *
 * Slide items without a catalogue match (SAM & Chatbots, Copilots for Ops/Supply/Sales/Mkt,
 * BridgeAI, C360, Meal Plan uni, RecipeAI, Pers. Recos.) are intentionally omitted until
 * they exist in the Notion source.
 */
export const BLOCKBUSTER_IDS: readonly string[] = [
  '4site',
  'dbfm',
  'foresightHr',
  'powerchef',
  'pricing',
  'menuai',
  'productSwap',
  'pegasus',
  'soproAi',
  'brandPerformance',
] as const;

/* ── Reverse index (id → collections[]) ─────────────────────────────────── */

const COLLECTION_INDEX: Map<string, SolutionCollection[]> = (() => {
  const m = new Map<string, SolutionCollection[]>();
  const push = (id: string, c: SolutionCollection) => {
    const cur = m.get(id);
    if (cur) {
      if (!cur.includes(c)) cur.push(c);
    } else {
      m.set(id, [c]);
    }
  };
  STANDARD_OFFER_IDS.forEach((id) => push(id, 'standard-offer'));
  BLOCKBUSTER_IDS.forEach((id) => push(id, 'blockbuster'));
  return m;
})();

/** Non-destructive: returns a new solution list with `collections` populated. */
export function enrichSolutionsWithCollections(solutions: Solution[]): Solution[] {
  return solutions.map((s) => {
    const hits = COLLECTION_INDEX.get(s.id);
    if (!hits || hits.length === 0) return s;
    return { ...s, collections: hits };
  });
}

/* ── Display metadata for the UI ────────────────────────────────────────── */

export interface CollectionMeta {
  key: SolutionCollection;
  label: string;
  shortLabel: string;
  tagline: string;
  description: string;
  /** CSS gradient used for badges / hero tiles. */
  gradient: string;
  /** Solid accent colour (matches gradient anchor). */
  accent: string;
  /** Phosphor icon name — resolved lazily in client components to keep SSR lean. */
  icon: 'Trophy' | 'Rocket';
  /** Primary editorial link (home tiles, header). */
  href: string;
  /** Filtered catalogue URL when it differs from `href` (e.g. Standard Offer story vs grid). */
  catalogueHref?: string;
}

export const COLLECTION_META: Record<SolutionCollection, CollectionMeta> = {
  'standard-offer': {
    key: 'standard-offer',
    label: 'Standard Offer',
    shortLabel: 'Standard',
    tagline: 'Scaled and ready to propose',
    description:
      'Our matured, client-ready products — the backbone of the Sodexo Spark offer. Each has been deployed at scale with proven impact.',
    gradient: 'linear-gradient(135deg, #0b76b8 0%, #14b8a6 100%)',
    accent: '#14b8a6',
    icon: 'Trophy',
    href: '/standard-offer',
    catalogueHref: '/solutions?collection=standard-offer',
  },
  blockbuster: {
    key: 'blockbuster',
    label: 'AI Blockbusters',
    shortLabel: 'Blockbuster',
    tagline: 'AI products driving Sodexo P&L',
    description:
      'The AI, GenAI and AgenticAI products explicitly built to boost revenue, retention and operational performance across B2C, B2O and B2B.',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f59e0b 100%)',
    accent: '#7c3aed',
    icon: 'Rocket',
    href: '/solutions?collection=blockbuster',
  },
};

export const COLLECTION_KEYS: SolutionCollection[] = ['standard-offer', 'blockbuster'];

/** Type-guard helper for URL params. */
export function parseCollectionKey(raw: string | undefined): SolutionCollection | undefined {
  if (!raw) return undefined;
  return COLLECTION_KEYS.includes(raw as SolutionCollection)
    ? (raw as SolutionCollection)
    : undefined;
}
