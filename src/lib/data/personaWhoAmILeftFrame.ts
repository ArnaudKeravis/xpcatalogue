import type { Persona } from '@/lib/data/types';

/**
 * Sodexo Master Catalogue — “Persona – Who am I?” left panel (Figma px).
 * Identity line and full portrait positions are the single layout reference.
 */
export const PERSONA_WHO_AMI_LEFT_FRAME = {
  width: 620,
  height: 1004,
  identity: { x: 80, y: 40 },
  fullImage: { x: 1, y: 244 },
} as const;

/** Excel **Personae Name** + **Personae** — e.g. “David Miller – Admin Function”. */
export function formatPersonaIdentityLine(
  persona: Pick<Persona, 'fullName' | 'role'>,
): string {
  return `${persona.fullName} – ${persona.role}`;
}

const { width, height, identity, fullImage } = PERSONA_WHO_AMI_LEFT_FRAME;

/** Percent positions for a responsive box that preserves the Figma frame ratio. */
export const PERSONA_WHO_AMI_LEFT_PLACEMENT = {
  identity: {
    left: `${(identity.x / width) * 100}%`,
    top: `${(identity.y / height) * 100}%`,
    maxWidth: `${((width - identity.x) / width) * 100}%`,
  },
  fullImage: {
    left: `${(fullImage.x / width) * 100}%`,
    top: `${(fullImage.y / height) * 100}%`,
    width: `${((width - fullImage.x) / width) * 100}%`,
    height: `${((height - fullImage.y) / height) * 100}%`,
  },
} as const;

export const PERSONA_WHO_AMI_LEFT_ASPECT = `${width}/${height}` as const;

/** Preserves Figma frame ratio on small screens; stretches with the right column on desktop. */
export const PERSONA_WHO_AMI_LEFT_FRAME_CLASS =
  'aspect-[620/1004] lg:aspect-auto lg:h-full lg:min-h-[420px]' as const;
