/** Set by middleware for requests on an E&R segment hostname. */
export const ER_SEGMENT_HEADER = 'x-sodexo-er-segment';

export function readErSegment(headersList: { get(name: string): string | null }): boolean {
  return headersList.get(ER_SEGMENT_HEADER) === '1';
}

/** URL helpers: short paths on the E&R host (rewritten to `/er/...`), `/er/...` on the main catalogue host. */
export const erPaths = {
  home: (segment: boolean) => (segment ? '/' : '/er'),
  personae: (segment: boolean) => (segment ? '/personae' : '/er/personae'),
  persona: (segment: boolean, slug: string) =>
    segment ? `/personae/${slug}` : `/er/personae/${slug}`,
  needs: (segment: boolean) => (segment ? '/needs' : '/er/needs'),
  ifm: (segment: boolean) => (segment ? '/ifm' : '/er/ifm'),
  journey: (segment: boolean) => (segment ? '/journey' : '/er/journey'),
  moments: (segment: boolean) => (segment ? '/moments' : '/er/moments'),
  operatorLens: (segment: boolean) => (segment ? '/operator' : '/er/operator'),
};
