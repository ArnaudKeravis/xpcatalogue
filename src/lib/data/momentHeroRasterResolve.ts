import { MOMENT_HERO_RASTER } from '@/lib/data/momentHeroRaster.generated';

/**
 * Moment image from the **Personae Journey** Excel sheet only:
 * header **"Image left moment"** (ingest: Column K–style “moment image” cell per row),
 * resolved at build time to `public/.../moments-raster/{personaId}/{stepId}.*` and
 * emitted as `MOMENT_HERO_RASTER` by `scripts/ingest_personae_journey_excel.py`.
 *
 * No legacy SVGs, no persona-top portraits, no inferred assets — only this map.
 */
export function momentHeroRasterFromExcel(personaId: string, stepId: string): string | undefined {
  const rasterPersona =
    personaId === 'exemple-minor' && stepId.startsWith('exemple-minor__') ? 'white-collar' : personaId;
  const rasterStep =
    personaId === 'exemple-minor' && stepId.startsWith('exemple-minor__')
      ? stepId.replace(/^exemple-minor__/, 'white-collar__')
      : stepId;
  return MOMENT_HERO_RASTER[rasterPersona]?.[rasterStep];
}
