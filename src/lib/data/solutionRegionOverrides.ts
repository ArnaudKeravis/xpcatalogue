/**
 * Notion-authoritative **Regions and countries** for solutions where the Excel
 * workbook expands regional clusters (APAC, COEU…) into individual countries.
 * Keys are solution slugs (`slugifySolutionId`).
 */
export type NotionRegionOverride = {
  regionsAndCountry: string;
  flags: readonly string[];
};

export const NOTION_REGION_OVERRIDES: Record<string, NotionRegionOverride> = {
  '4site': {
    regionsAndCountry: 'USA, France, UKI, APAC, COTU',
    flags: ['🇺🇸', '🇫🇷', 'region:uki', 'region:apac', 'region:cotu'],
  },
};

export function getNotionRegionOverride(
  solutionId: string,
): NotionRegionOverride | undefined {
  return NOTION_REGION_OVERRIDES[solutionId];
}
