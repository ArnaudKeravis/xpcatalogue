/**
 * Excel-backed journey steps use ids like `white-collar__commute`.
 * UI affordances keyed by short moment slugs (e.g. MOMENT_ICONS) need the suffix.
 */
export function momentSlugFromStepId(stepId: string): string {
  const i = stepId.indexOf('__');
  return i >= 0 ? stepId.slice(i + 2) : stepId;
}
