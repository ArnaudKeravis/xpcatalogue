import type { Persona } from '@/lib/data/types';
import type { ErBoKPersona } from './types';
import { ER_BOK_PERSONAS } from './erBoKPersonas';
import { ER_CLIENT_BOK } from './erClientPersona';

const BOK_COLORS: Record<string, string> = {
  'remote-lifestyler': '#2d6a8f',
  optimizer: '#5c6bc0',
  'proactive-achiever': '#00897b',
  'family-hero': '#c62828',
  'social-experiencer': '#f57c00',
  'privacy-seeker': '#546e7a',
  client: '#0b76b8',
};

/**
 * Map a BoK / client profile onto a catalogue `Persona` shape for shared UI
 * (`PersonaProfile`, favourites). Journey moments still resolve via `linkPersona`
 * (typically `white-collar`) so module and moment pages stay data-backed.
 */
export function erBoKAsPersona(bok: ErBoKPersona, journeyTemplate: Persona): Persona {
  const color = BOK_COLORS[bok.id] ?? journeyTemplate.color;
  return {
    ...journeyTemplate,
    id: bok.id,
    area: 'work',
    name: bok.name,
    fullName: `${bok.name} — ${bok.profileKey}`,
    role: bok.role,
    quote: bok.quote,
    color,
    photo: journeyTemplate.photo,
    profileEyebrow: 'E&R · BoK',
    platformSegmentLabel: 'Energy & Resources',
    workplaceStats: [
      `${bok.age} · ${bok.gender}`,
      bok.relationship + (bok.kids ? ` · ${bok.kids}` : ''),
      bok.experience,
      bok.whoTheyAre.slice(0, 360) + (bok.whoTheyAre.length > 360 ? '…' : ''),
    ],
    professionalGoals: bok.emotionalProfile,
    motivations: bok.keyNeeds,
    pains: bok.painPoints,
    needs: bok.howWeAddress,
    steps: journeyTemplate.steps,
    journeyMapImage: journeyTemplate.journeyMapImage,
    journeyHotspots: journeyTemplate.journeyHotspots,
    emoji: journeyTemplate.emoji,
  };
}

export function allErBoKAndClient(): ErBoKPersona[] {
  return [...ER_BOK_PERSONAS, ER_CLIENT_BOK];
}

export const ER_OPERATOR_SLUG = 'operator' as const;
export const ER_CLIENT_SLUG = 'client' as const;

export function erPersonaeDetailSlugs(): string[] {
  return [...ER_BOK_PERSONAS.map((p) => p.id), ER_CLIENT_SLUG, ER_OPERATOR_SLUG];
}

export function erBoKOrClientBySlug(slug: string): ErBoKPersona | undefined {
  if (slug === ER_CLIENT_SLUG) return ER_CLIENT_BOK;
  return ER_BOK_PERSONAS.find((p) => p.id === slug);
}
