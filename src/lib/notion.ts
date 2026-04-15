import type { CatalogueData } from '@/lib/data/types';
import { FALLBACK_DATA } from '@/lib/data/fallback';

/**
 * Server-side catalogue loader. Wire Notion API here; falls back when env is missing or fetch fails.
 */
export async function getCatalogueData(): Promise<CatalogueData> {
  // TODO: if (process.env.NOTION_TOKEN && process.env.NOTION_SOLUTIONS_DB) { ... }
  return FALLBACK_DATA;
}
