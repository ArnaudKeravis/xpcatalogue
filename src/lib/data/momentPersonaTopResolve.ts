import { momentPersonaTopUrl as momentPersonaTopUrlGenerated } from '@/lib/data/momentPersonaTop.generated';

/**
 * `exemple-minor` reuses white-collar moment persona-top rasters until dedicated
 * assets exist (same geometry in the journey map).
 */
export function momentPersonaTopUrl(personaId: string, stepId: string): string | undefined {
  const direct = momentPersonaTopUrlGenerated(personaId, stepId);
  if (direct) return direct;
  if (personaId === 'exemple-minor' && stepId.startsWith('exemple-minor__')) {
    const wcStep = stepId.replace(/^exemple-minor__/, 'white-collar__');
    return momentPersonaTopUrlGenerated('white-collar', wcStep);
  }
  return undefined;
}
