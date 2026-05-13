import { isErSegmentHost } from '@/lib/erSegmentHost';

/** Set by middleware for E&R segment: dedicated host and/or any `/er/*` path. */
export const ER_SEGMENT_HEADER = 'x-sodexo-er-segment';

export function readErSegment(headersList: { get(name: string): string | null }): boolean {
  return headersList.get(ER_SEGMENT_HEADER) === '1';
}

/**
 * How to build outbound links for the E&R mini-site.
 * - `global`: main XP catalogue (default header/footer).
 * - `er-path`: same host, paths under `/er/...` (e.g. `experience-catalogue.vercel.app/er/...`).
 * - `er-dedicated`: hostname listed in `ER_APP_HOSTNAMES` — short public paths (`/personae`, `/needs`, …) are rewritten by middleware.
 */
export type ErLinkMode = 'global' | 'er-path' | 'er-dedicated';

export function readErLinkMode(headersList: { get(name: string): string | null }): ErLinkMode {
  if (!readErSegment(headersList)) return 'global';
  const host = headersList.get('host');
  return isErSegmentHost(host) ? 'er-dedicated' : 'er-path';
}

function short(mode: ErLinkMode): mode is 'er-dedicated' {
  return mode === 'er-dedicated';
}

/** URL helpers for E&R navigation (pass `readErLinkMode(headers)` from server components). */
export const erPaths = {
  home: (mode: ErLinkMode) => (short(mode) ? '/' : '/er'),
  personae: (mode: ErLinkMode) => (short(mode) ? '/personae' : '/er/personae'),
  persona: (mode: ErLinkMode, slug: string) =>
    short(mode) ? `/personae/${slug}` : `/er/personae/${slug}`,
  needs: (mode: ErLinkMode) => (short(mode) ? '/needs' : '/er/needs'),
  ifm: (mode: ErLinkMode) => (short(mode) ? '/ifm' : '/er/ifm'),
  journey: (mode: ErLinkMode) => (short(mode) ? '/journey' : '/er/journey'),
  moments: (mode: ErLinkMode) => (short(mode) ? '/moments' : '/er/moments'),
  operatorLens: (mode: ErLinkMode) => (short(mode) ? '/operator' : '/er/operator'),
};
