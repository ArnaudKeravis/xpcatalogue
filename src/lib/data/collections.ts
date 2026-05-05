/**
 * Curated collections — hand-tagged shortlists of catalogue solutions.
 *
 * 1. **Standard Offer** — Sodexo’s scaled, client-ready backbone (TDDI Standard Offer deck).
 *    Former “AI blockbuster” catalogue entries are folded in here and additionally carry
 *    the `#blockbuster` hashtag for filtering (replacing the old standalone collection).
 *
 * 2. **Big Bets** — Sodexo’s FY26 innovation priorities across three strategic areas:
 *    Food & Beyond, Health & Wellbeing, Automation & Intelligent Operations
 *    (*Big Bets 2026* deck). The shortlist maps deck examples + platforms to catalogue IDs.
 *
 * Source of truth lives here, not per-Solution authoring, so lists can evolve with decks.
 */

import type { Solution, SolutionCollection } from './types';

const BLOCKBUSTER_HASHTAG = '#blockbuster';

/**
 * Solutions that historically sat on the AI “blockbuster” P&L-impact slide —
 * surfaced today as **Standard Offer** plus the `#blockbuster` hashtag (not a collection).
 */
export const BLOCKBUSTER_TAG_IDS: readonly string[] = [
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

/**
 * Solution IDs (matching `src/lib/data/solutionsCatalog.ts`) that belong to
 * the Standard Offer. Derived from the TDDI Standard Offer deck, **union** the
 * former AI blockbuster shortlist so every blockbuster-tagged solution is standard-offer scoped.
 */
export const STANDARD_OFFER_IDS: readonly string[] = Array.from(
  new Set([
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
    ...BLOCKBUSTER_TAG_IDS,
  ])
) as unknown as readonly string[];

const BLOCKBUSTER_TAG_SET = new Set<string>(BLOCKBUSTER_TAG_IDS);

/**
 * Solutions aligned with *Big Bets 2026* (slide 15–19 + initiative examples on slide 16):
 * platforms, frictionless / autonomous retail, food & sustainability innovation,
 * workplace wellbeing, and robotics / automation where they exist in this catalogue.
 */
export const BIG_BETS_IDS: readonly string[] = [
  '4site',
  'b2bPlatform',
  'dbfm',
  'foresightHr',
  'powerchef',
  'pricing',
  'productSwap',
  'pegasus',
  'soproAi',
  'brandPerformance',
  'aifi',
  'amazonJwo',
  'zippin',
  'totem',
  'mashgin',
  'trayvisor',
  'everyday',
  'menuai',
  'sea',
  'kikleo',
  'leanpath',
  'notpla',
  'goodBytz',
  'foodini',
  'eatch',
  'kumulus',
  'eatCurious',
  'nudj',
  'bibak',
  'cubo',
  'bioteos',
  'metronaps',
  'bearRobotics',
  'userveRobot',
  'somatic',
  'botinkit',
  'starship',
  'myVillage',
  'soeze',
  'wandoAnalytics',
  'wandoDi',
  'blueOceanUvd',
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
  BIG_BETS_IDS.forEach((id) => push(id, 'big-bets'));
  return m;
})();

/** Non-destructive: returns a new solution list with `collections` + blockbuster hashtag. */
export function enrichSolutionsWithCollections(solutions: Solution[]): Solution[] {
  return solutions.map((s) => {
    const hits = COLLECTION_INDEX.get(s.id);
    let next: Solution = hits && hits.length > 0 ? { ...s, collections: hits } : { ...s };

    if (BLOCKBUSTER_TAG_SET.has(s.id)) {
      const tags = next.hashtags ?? [];
      const hasBlockbuster = tags.some((t) => t.toLowerCase() === BLOCKBUSTER_HASHTAG.toLowerCase());
      if (!hasBlockbuster) {
        next = { ...next, hashtags: [...tags, BLOCKBUSTER_HASHTAG] };
      }
    }

    return next;
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
  icon: 'Trophy' | 'Lightbulb';
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
      'Our matured, client-ready products — the backbone of the Standard Offer. Each has been deployed at scale with proven impact.',
    gradient: 'linear-gradient(135deg, #0b76b8 0%, #14b8a6 100%)',
    accent: '#14b8a6',
    icon: 'Trophy',
    href: '/standard-offer',
    catalogueHref: '/solutions?collection=standard-offer#solutions-catalogue',
  },
  'big-bets': {
    key: 'big-bets',
    label: 'Big Bets',
    shortLabel: 'Big Bets',
    tagline: 'FY26 innovation priorities',
    description:
      'Sodexo’s three innovation areas for 2030 — Food & Beyond, Health & Wellbeing, and Automation & Intelligent Operations — and the catalogue solutions that exemplify those Big Bets today.',
    gradient: 'linear-gradient(135deg, #0f766e 0%, #7c3aed 45%, #ea580c 100%)',
    accent: '#7c3aed',
    icon: 'Lightbulb',
    href: '/big-bets',
    catalogueHref: '/solutions?collection=big-bets#solutions-catalogue',
  },
};

export const COLLECTION_KEYS: SolutionCollection[] = ['standard-offer', 'big-bets'];

/** Type-guard helper for URL params. */
export function parseCollectionKey(raw: string | undefined): SolutionCollection | undefined {
  if (!raw) return undefined;
  return COLLECTION_KEYS.includes(raw as SolutionCollection)
    ? (raw as SolutionCollection)
    : undefined;
}
