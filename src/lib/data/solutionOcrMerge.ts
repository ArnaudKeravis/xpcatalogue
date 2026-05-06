import type { Solution } from './types';
import { SOLUTION_OCR_OVERRIDES } from './solutionOcrOverrides.generated';

/** Applies OCR-derived copy from Solution_Descriptions PNGs onto catalogue rows (text only). */
export function applySolutionOcrOverrides(s: Solution): Solution {
  const o = SOLUTION_OCR_OVERRIDES[s.id];
  if (!o) return s;

  const benefits = {
    client: o.benefits.client.trim() ? o.benefits.client : s.benefits.client,
    consumer: o.benefits.consumer.trim() ? o.benefits.consumer : s.benefits.consumer,
    sodexo: o.benefits.sodexo.trim() ? o.benefits.sodexo : s.benefits.sodexo,
  };

  return {
    ...s,
    context: o.context.trim() ? o.context : s.context,
    description: o.description.trim() ? o.description : s.description,
    benefits,
    kpis: o.kpis.length > 0 ? o.kpis : s.kpis,
    contact: o.contact.trim() ? o.contact : s.contact,
  };
}
