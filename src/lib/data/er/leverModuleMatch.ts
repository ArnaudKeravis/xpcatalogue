import type { Module } from '@/lib/data/types';

/**
 * Fuzzy match a BoK "solution lever" string (e.g. "Health & wellbeing program",
 * "Smart cleaning", "Concierge") against the catalogue's modules.
 *
 * The user-needs hub on `/er/needs` is hand-authored from the BoK long version
 * — its lever names will rarely match a module slug exactly. We do best-effort
 * token-overlap matching against `module.name` + `module.id` and only return a
 * link when we're reasonably confident (default threshold 0.5).
 *
 * Trade-off: false negatives (no link) are much better than false positives
 * (link to an unrelated module), so we keep the threshold strict and ignore
 * `module.description` (too noisy → many spurious matches).
 */

const STOPWORDS = new Set([
  // structural / grammar
  'the', 'a', 'an', 'and', 'or', 'of', 'in', 'on', 'for', 'to', 'with', 'by', 'at',
  'is', 'are', 'be', 'as', 'into', 'over', 'per', 'via',
  // domain-generic words that don't help disambiguate modules
  'program', 'programs', 'service', 'services', 'system', 'systems',
  'tool', 'tools', 'app', 'apps', 'solution', 'solutions', 'platform',
  'experience', 'experiences', 'product', 'products', 'offer', 'offers',
  'lever', 'levers',
]);

function tokenize(input: string): string[] {
  const cleaned = input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\//g, ' ')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]+/g, ' ');

  const seen = new Set<string>();
  const out: string[] = [];
  for (const tok of cleaned.split(/\s+/)) {
    if (tok.length < 3) continue;
    if (STOPWORDS.has(tok)) continue;
    if (seen.has(tok)) continue;
    seen.add(tok);
    out.push(tok);
  }
  return out;
}

/**
 * Two tokens match if equal OR if they share a 4+ character prefix.
 * The prefix rule lets "wellbeing" ↔ "wellness" and "cleaning" ↔ "clean"
 * match without pulling in a full stemmer.
 */
function tokenMatches(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length < 4 || b.length < 4) return false;
  return a.slice(0, 4) === b.slice(0, 4);
}

interface ModuleTokenIndex {
  module: Module;
  tokens: string[];
}

/** Pre-tokenise modules once per request — re-used across every lever on the page. */
export function indexModulesForLevers(modules: readonly Module[]): ModuleTokenIndex[] {
  const out: ModuleTokenIndex[] = [];
  for (const mod of modules) {
    const nameTokens = tokenize(mod.name);
    const idTokens = tokenize(mod.id.replace(/-/g, ' '));
    const tokens: string[] = [];
    const seen = new Set<string>();
    for (const t of [...nameTokens, ...idTokens]) {
      if (seen.has(t)) continue;
      seen.add(t);
      tokens.push(t);
    }
    if (tokens.length > 0) out.push({ module: mod, tokens });
  }
  return out;
}

export interface LeverModuleMatch {
  module: Module;
  /** 0-1 confidence — average of lever-side and module-side token-match fractions. */
  score: number;
}

/**
 * Return the best-matching module for a given lever, or `undefined` if no module
 * scores above `threshold`. Score averages lever-side and module-side coverage so
 * that, given two equally-matching modules, the more *specific* one wins.
 */
export function findModuleForLever(
  lever: string,
  index: ModuleTokenIndex[],
  threshold = 0.5,
): LeverModuleMatch | undefined {
  const leverTokens = tokenize(lever);
  if (leverTokens.length === 0) return undefined;

  let best: LeverModuleMatch | undefined;
  for (const { module, tokens: modTokens } of index) {
    let matched = 0;
    for (const lt of leverTokens) {
      if (modTokens.some((mt) => tokenMatches(lt, mt))) matched += 1;
    }
    if (matched === 0) continue;
    const leverFraction = matched / leverTokens.length;
    const moduleFraction = matched / modTokens.length;
    const score = (leverFraction + moduleFraction) / 2;
    if (!best || score > best.score) {
      best = { module, score };
    }
  }
  return best && best.score >= threshold ? best : undefined;
}
