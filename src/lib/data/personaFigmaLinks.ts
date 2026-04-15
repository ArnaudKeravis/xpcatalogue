/**
 * Figma URLs — canonical table: `src/lib/data/XP-catalogue-journey.csv` — columns:
 * Personae Description, Bridge (→ journey), Personae journey (map), Modular approach mini bloc.
 * Labs file: Fv4jcBErywa8gpH97BIMh0 · Master: JW5MGQvB3itG9AXBKVVnuO
 */

import type { Persona, PersonaFigmaLinks } from './types';

/** Labs file key (persona frames + journey maps). */
const LABS_KEY = 'Fv4jcBErywa8gpH97BIMh0';
/** Master Catalogue — bridge screens & some shared references. */
const MASTER_KEY = 'JW5MGQvB3itG9AXBKVVnuO';

const FIGMA_LINK_KEYS: (keyof PersonaFigmaLinks)[] = [
  'personaDescription',
  'journeyBridge',
  'personaJourney',
  'modularApproach',
];

/**
 * Build a stable Figma design deep link. Node id uses hyphen form (e.g. `1635-80131`).
 * Use file key only (no title slug) so renames in Figma do not break URLs.
 * Omit session `t=` params — they expire and can prevent the correct frame from opening.
 */
function designDeepLink(fileKey: string, node: string) {
  const id = node.replace(/:/g, '-');
  return `https://www.figma.com/design/${fileKey}?node-id=${encodeURIComponent(id)}`;
}

function labs(node: string) {
  return designDeepLink(LABS_KEY, node);
}

function master(node: string) {
  return designDeepLink(MASTER_KEY, node);
}

const L = labs;
const M = master;

/** CSV rows 2–25 → persona `id` */
export const PERSONA_FIGMA_LINKS: Record<string, PersonaFigmaLinks> = {
  'client-work': {
    personaDescription: L('1635-80247'),
    journeyBridge: M('5246-305051'),
    personaJourney: L('2140-53489'),
    modularApproach: L('2140-44002'),
  },
  'operator-work': {
    personaDescription: L('1635-80155'),
    journeyBridge: M('2021-20169'),
    personaJourney: L('2058-166458'),
    modularApproach: L('2058-166458'),
  },
  'white-collar': {
    personaDescription: L('1635-80131'),
    journeyBridge: M('2021-19771'),
    personaJourney: L('1667-44064'),
    modularApproach: L('2057-148649'),
  },
  'blue-collar': {
    personaDescription: L('1635-133254'),
    journeyBridge: M('2580-322062'),
    personaJourney: L('2067-297533'),
    modularApproach: L('2067-297533'),
  },
  'grey-collar': {
    personaDescription: L('1635-80343'),
    journeyBridge: M('2021-19574'),
    personaJourney: L('1667-58780'),
    modularApproach: L('2057-137359'),
  },
  military: {
    personaDescription: L('1635-133281'),
    journeyBridge: M('5248-305407'),
    personaJourney: L('1412-44020'),
    modularApproach: L('2057-128399'),
  },
  'client-heal': {
    personaDescription: L('1635-80271'),
    journeyBridge: M('5246-304783'),
    personaJourney: L('2140-53489'),
    modularApproach: L('2140-44002'),
  },
  'operator-heal': {
    personaDescription: L('1635-80178'),
    journeyBridge: M('2593-333289'),
    personaJourney: L('2058-166458'),
    modularApproach: L('2058-166458'),
  },
  doctor: {
    personaDescription: L('1635-133580'),
    journeyBridge: M('5224-301054'),
    personaJourney: L('1710-44040'),
    modularApproach: L('2057-120670'),
  },
  senior: {
    personaDescription: L('1635-133511'),
    journeyBridge: M('5246-301116'),
    personaJourney: L('1748-72531'),
    modularApproach: L('2057-108261'),
  },
  patient: {
    personaDescription: L('1635-133534'),
    journeyBridge: M('5224-301870'),
    personaJourney: L('1748-44772'),
    modularApproach: L('2057-44000'),
  },
  nurse: {
    personaDescription: L('1635-133557'),
    journeyBridge: M('5246-300200'),
    personaJourney: L('1748-60721'),
    modularApproach: L('2057-113707'),
  },
  'client-play': {
    personaDescription: L('1635-80295'),
    journeyBridge: M('5246-304247'),
    personaJourney: L('2140-53489'),
    modularApproach: L('2140-44002'),
  },
  'operator-play': {
    personaDescription: L('1635-80201'),
    journeyBridge: M('2593-333078'),
    personaJourney: L('2058-166458'),
    modularApproach: L('2058-166458'),
  },
  'sport-fan': {
    personaDescription: L('1635-133304'),
    journeyBridge: M('5256-306050'),
    personaJourney: L('229-415020'),
    modularApproach: L('2057-101116'),
  },
  'vip-guest': {
    personaDescription: L('1635-133488'),
    journeyBridge: M('5246-302284'),
    personaJourney: L('1428-61642'),
    modularApproach: L('2057-86648'),
  },
  participant: {
    personaDescription: L('1635-133327'),
    journeyBridge: M('5246-302004'),
    personaJourney: L('1428-61667'),
    modularApproach: L('2057-92475'),
  },
  tourist: {
    personaDescription: L('1635-133350'),
    journeyBridge: M('5246-302563'),
    personaJourney: L('1441-46112'),
    modularApproach: L('2057-80143'),
  },
  'client-learn': {
    personaDescription: L('1635-80319'),
    journeyBridge: M('5246-304515'),
    personaJourney: L('2140-53489'),
    modularApproach: L('2140-44002'),
  },
  'operator-learn': {
    personaDescription: L('1635-80224'),
    journeyBridge: M('2593-332867'),
    personaJourney: L('2058-166458'),
    modularApproach: L('2058-166458'),
  },
  student: {
    personaDescription: L('1635-133396'),
    journeyBridge: M('5246-303120'),
    personaJourney: L('223-355745'),
    modularApproach: L('2057-61265'),
  },
  schoolchild: {
    personaDescription: L('1635-133419'),
    journeyBridge: M('5246-303400'),
    personaJourney: L('1321-44016'),
    modularApproach: L('2057-68355'),
  },
  parent: {
    /** Figma Labs: Parent copy lives on node `1635:133442` (frame title “Teacher”); `133465` holds Teacher copy — swapped in file. */
    personaDescription: L('1635-133442'),
    journeyBridge: M('5246-303689'),
    personaJourney: L('1454-44040'),
    modularApproach: L('2057-56477'),
  },
  teacher: {
    personaDescription: L('1635-133465'),
    journeyBridge: M('5246-303968'),
    personaJourney: L('1746-58549'),
    modularApproach: L('2057-49328'),
  },
};

function isUsableFigmaUrl(value: string | undefined): value is string {
  const t = value?.trim();
  return Boolean(t && /^https?:\/\/(www\.)?figma\.com\//i.test(t));
}

/** Resolve Figma hand-off links: merge Notion overrides with the static map (per key). */
export function resolvePersonaFigmaLinks(persona: Pick<Persona, 'id' | 'figmaLinks'>): PersonaFigmaLinks | undefined {
  const fallback = PERSONA_FIGMA_LINKS[persona.id];
  const fromPersona = persona.figmaLinks;

  if (!fromPersona) return fallback;

  if (!fallback) {
    return FIGMA_LINK_KEYS.every((k) => isUsableFigmaUrl(fromPersona[k])) ? fromPersona : undefined;
  }

  const merged: PersonaFigmaLinks = { ...fallback };
  for (const k of FIGMA_LINK_KEYS) {
    if (isUsableFigmaUrl(fromPersona[k])) {
      merged[k] = fromPersona[k]!;
    }
  }
  return merged;
}
