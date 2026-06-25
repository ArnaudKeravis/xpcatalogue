/**
 * Parse Excel **Regions and country** free-text into flag emoji arrays used by
 * filters, home country lens, footer counts, and solution cards.
 *
 * Regional Sodexo codes (APAC, COTU, UKI…) can also be represented as
 * `region:*` tokens — see {@link getFlagIcon} / {@link getFlagLabel}.
 */

export const REGIONAL_FLAG_PREFIX = 'region:';

/** Sodexo regional codes displayed as a single tag (not expanded to countries). */
const REGIONAL_FLAG_META: Record<string, { icon: string; label: string }> = {
  'region:uki': { icon: '🇬🇧', label: 'UKI' },
  'region:apac': { icon: '🌐', label: 'APAC' },
  'region:cotu': { icon: '🌐', label: 'COTU' },
};

export function isRegionalFlag(flag: string): boolean {
  return flag.startsWith(REGIONAL_FLAG_PREFIX);
}

export function getFlagIcon(flag: string): string {
  if (isRegionalFlag(flag)) {
    return REGIONAL_FLAG_META[flag]?.icon ?? '🌐';
  }
  return flag;
}

/** Human label for each flag emoji (filters, tags, aria). */
export const FLAG_LABELS: Record<string, string> = {
  '🇺🇸': 'USA',
  '🇫🇷': 'France',
  '🇬🇧': 'UK & Ireland',
  '🇧🇷': 'Brazil',
  '🇧🇪': 'Belgium',
  '🇳🇱': 'Netherlands',
  '🇩🇪': 'Germany',
  '🇦🇺': 'Australia',
  '🇨🇦': 'Canada',
  '🇮🇳': 'India',
  '🇨🇱': 'Chile',
  '🇨🇴': 'Colombia',
  '🇨🇭': 'Switzerland',
  '🇩🇰': 'Denmark',
  '🇪🇪': 'Estonia',
  '🇮🇹': 'Italy',
  '🇱🇺': 'Luxembourg',
  '🇸🇬': 'Singapore',
  '🇹🇷': 'Turkey',
  '🇺🇦': 'Ukraine',
  '🇮🇱': 'Israel',
  '🇨🇳': 'China',
  '🇯🇵': 'Japan',
  '🇰🇷': 'South Korea',
  '🇪🇸': 'Spain',
  '🇦🇹': 'Austria',
  '🇳🇴': 'Norway',
  '🇵🇱': 'Poland',
  '🇨🇿': 'Czechia',
  '🇸🇰': 'Slovakia',
  '🇭🇺': 'Hungary',
  '🌍': 'Worldwide',
};

/** Sodexo editorial tokens → one or more flag emojis. Keys are lowercase. */
const REGION_TO_FLAGS: Record<string, string[]> = {
  usa: ['🇺🇸'],
  us: ['🇺🇸'],
  'united states': ['🇺🇸'],
  france: ['🇫🇷'],
  'uk&i': ['🇬🇧'],
  uki: ['🇬🇧'],
  uk: ['🇬🇧'],
  'united kingdom': ['🇬🇧'],
  brazil: ['🇧🇷'],
  belgium: ['🇧🇪'],
  netherlands: ['🇳🇱'],
  germany: ['🇩🇪'],
  australia: ['🇦🇺'],
  canada: ['🇨🇦'],
  india: ['🇮🇳'],
  chile: ['🇨🇱'],
  colombia: ['🇨🇴'],
  switzerland: ['🇨🇭'],
  denmark: ['🇩🇰'],
  estonia: ['🇪🇪'],
  italy: ['🇮🇹'],
  italie: ['🇮🇹'],
  luxembourg: ['🇱🇺'],
  singapor: ['🇸🇬'],
  singapore: ['🇸🇬'],
  turkey: ['🇹🇷'],
  ukraine: ['🇺🇦'],
  israel: ['🇮🇱'],
  israël: ['🇮🇱'],
  'greater china': ['🇨🇳'],
  china: ['🇨🇳'],
  norway: ['🇳🇴'],
  austria: ['🇦🇹'],
  spain: ['🇪🇸'],
  japan: ['🇯🇵'],
  'south korea': ['🇰🇷'],
  korea: ['🇰🇷'],
  poland: ['🇵🇱'],
  'france germany': ['🇫🇷', '🇩🇪'],
  'usa? uk&i': ['🇺🇸', '🇬🇧'],
  apac: ['🇦🇺', '🇨🇳', '🇮🇳', '🇯🇵', '🇸🇬', '🇰🇷'],
  coeu: ['🇩🇪', '🇵🇱', '🇨🇿', '🇦🇹', '🇸🇰'],
  europe: ['🇫🇷', '🇩🇪', '🇬🇧', '🇪🇸', '🇮🇹', '🇳🇱', '🇧🇪'],
  worldwide: ['🌍'],
  wordlwide: ['🌍'],
  'aucun accès': [],
  'aucun acces': [],
};

function normalizeToken(raw: string): string {
  return raw
    .normalize('NFC')
    .replace(/\u00a0/g, ' ')
    .replace(/\s*[—–-].*$/, '')
    .replace(/\?/g, '')
    .trim()
    .toLowerCase();
}

function lookupRegion(token: string): string[] {
  const key = normalizeToken(token);
  if (!key) return [];
  if (key in REGION_TO_FLAGS) return REGION_TO_FLAGS[key];

  // "France Germany" without comma — try whole token, then split on spaces.
  const words = key.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const fromWords = words.flatMap((w) => REGION_TO_FLAGS[w] ?? []);
    if (fromWords.length) return fromWords;
  }

  return [];
}

export function dedupeFlags(flags: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const f of flags) {
    if (!f || seen.has(f)) continue;
    seen.add(f);
    out.push(f);
  }
  return out;
}

/** Parse a **Regions and country** cell into deduplicated flag emojis. */
export function parseRegionsToFlags(regionsAndCountry: string | null | undefined): string[] {
  if (!regionsAndCountry?.trim()) return [];

  const flags: string[] = [];
  for (const part of regionsAndCountry.split(/[,;]/)) {
    flags.push(...lookupRegion(part));
  }
  return dedupeFlags(flags);
}

export function getFlagLabel(flag: string): string {
  if (isRegionalFlag(flag)) {
    return (
      REGIONAL_FLAG_META[flag]?.label ??
      flag.slice(REGIONAL_FLAG_PREFIX.length).toUpperCase()
    );
  }
  return FLAG_LABELS[flag] ?? flag;
}

/** Prefer explicit `flags`; fall back to parsing `regionsAndCountry`. */
export function resolveSolutionFlags(solution: {
  flags: string[];
  regionsAndCountry?: string;
}): string[] {
  if (solution.flags.length > 0) return solution.flags;
  return parseRegionsToFlags(solution.regionsAndCountry);
}
