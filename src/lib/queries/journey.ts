import type { JourneyStep } from '@/lib/data/types';

/** Journey moments (steps) that include this module name, for the given persona journey. */
export function getMomentsForModuleName(
  moduleName: string,
  personaJourneySteps: JourneyStep[]
): { id: string; label: string }[] {
  return personaJourneySteps
    .filter((s) => s.modules.some((m) => m === moduleName))
    .map((s) => ({ id: s.id, label: s.label }));
}

export function resolvePersonaJourneySteps(
  stepIds: string[],
  journeySteps: Record<string, JourneyStep>
): JourneyStep[] {
  return stepIds.map((id) => journeySteps[id]).filter((s): s is JourneyStep => Boolean(s));
}
