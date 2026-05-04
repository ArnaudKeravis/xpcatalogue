import {
  PERSONA_FACE_URL,
  PERSONA_FULL_URL,
  PERSONA_LISTING_URL,
} from '@/lib/data/personaAssetUrls';
import { PERSONA_PORTRAIT_URL } from '@/lib/data/personaPortraits';

export type PersonaImageKind = 'face' | 'full' | 'listing';

/**
 * Synced pack assets first (`scripts/sync-personae-images-from-zips.py`), then optional
 * data `photo` override, then legacy portrait fallbacks.
 */
export function resolvePersonaImage(
  kind: PersonaImageKind,
  personaId: string,
  photo?: string,
): string {
  const pack =
    kind === 'face'
      ? PERSONA_FACE_URL[personaId]
      : kind === 'full'
        ? PERSONA_FULL_URL[personaId]
        : PERSONA_LISTING_URL[personaId];
  return pack ?? photo ?? PERSONA_PORTRAIT_URL[personaId] ?? '';
}
