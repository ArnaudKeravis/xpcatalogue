import type { Solution } from '@/lib/data/types';

/** Sodexo Digital, AI & Innovation — Spark SharePoint hub (single source of truth for links). */
export const SPARK_SHAREPOINT_URL =
  'https://sodexo.sharepoint.com/sites/GLB_DIG_Sodexo_Digital_AI?spStartSource=spappbar';

export const SPARK_SHAREPOINT_LABEL = 'Sodexo Digital, AI & Innovation';

/** True when the solution belongs to the Spark Offer (`standard-offer`) collection. */
export function isSparkOfferSolution(solution: Solution): boolean {
  return (solution.collections ?? []).includes('standard-offer');
}
