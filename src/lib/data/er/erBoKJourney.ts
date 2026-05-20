import type { JourneyHotspot, JourneyStep } from '@/lib/data/types';

/**
 * E&R-scoped journey override.
 *
 * The catalogue's BoK personae used to *reuse* the Work white-collar journey
 * (5 moments). The E&R editorial team asked for a different arc — 7 moments
 * starting at home before the rotation and ending at bed time — so we provide
 * a fully E&R-scoped journey here (steps, ordered IDs, hotspots on the new
 * mining isometric, per-moment editorial and per-moment imagery).
 *
 * Step IDs use the `er-bok__*` prefix so they never collide with white-collar
 * step IDs (`white-collar__commute` etc.) — the catalogue's Work pages stay
 * exactly as they were.
 */

export const ER_BOK_JOURNEY_MAP_IMAGE =
  '/images/catalogue/assets/journeys/excel-maps/er-bok.png';

const MOM_BASE = '/images/catalogue/assets/journeys/moments/er';

/** Ordered IDs — drives both the journey-map numbering and the before/during/after nav. */
export const ER_BOK_STEP_IDS = [
  'er-bok__departure-from-home',
  'er-bok__commute',
  'er-bok__welcome-area',
  'er-bok__workplace',
  'er-bok__food-beverage-area',
  'er-bok__wellbeing-breaktime',
  'er-bok__bed-time',
] as const;

export type ErBoKStepId = (typeof ER_BOK_STEP_IDS)[number];

/**
 * Step definitions — labels, descriptions, modules.
 * Modules are referenced by their *journey label* (matched at runtime via
 * `catalogueModuleForJourneyLabel`), so they map to whatever the Notion / Excel
 * source happens to call them. For the 5 reused moments we copy the labels
 * straight from the Excel-ingested white-collar steps to keep solution coverage
 * identical; the two new moments use a sensible default set.
 */
export const ER_BOK_STEPS: Record<ErBoKStepId, JourneyStep> = {
  'er-bok__departure-from-home': {
    id: 'er-bok__departure-from-home',
    label: 'Departure from home',
    icon: '🏠',
    modules: ['Conciergerie', 'Digital Reception', 'Service Request'],
    description:
      'I want to leave home fully prepared and confident for my on-site assignment, knowing that transportation, schedules, accommodation arrangements and safety requirements are all coordinated in advance. I need reliable information and digital services that help me manage travel logistics, stay connected with my family and ensure a smooth transition from home to the mining site — so I can begin my rotation focused, stress-free and ready to work, even for extended periods away from home.',
  },
  'er-bok__commute': {
    id: 'er-bok__commute',
    label: 'Commute',
    icon: '📍',
    modules: ['Parking Management', 'Digital Reception', 'Wayfinding'],
    description:
      'I want to plan my commute with confidence, knowing that parking, routes and last-mile guidance are all taken care of. I need real-time information and digital services that get me to the office on time, without traffic surprises or searching endlessly for a spot.',
  },
  'er-bok__welcome-area': {
    id: 'er-bok__welcome-area',
    label: 'Welcome Area',
    icon: '📍',
    modules: [
      'Digital Reception',
      'Conciergerie',
      'Wayfinding',
      'Service Request',
      'Sustainability Awareness',
    ],
    description:
      'When I arrive on site, I want to pass security, find my way and welcome my guests without queues, confusion or awkward waiting. I need smart reception, clear signage and concierge-like support so that every visit feels simple, professional and even a bit memorable and sustainable.',
  },
  'er-bok__workplace': {
    id: 'er-bok__workplace',
    label: 'Workplace',
    icon: '📍',
    modules: [
      'Autonomous Fridge',
      'F&B Experience',
      'Hydration / Water',
      'Air Quality',
      'Battery Charger',
      'Service Request',
    ],
    description:
      'As my day fills up with meetings and focus time, I need to quickly see where my team is, find an available desk or room, and adapt to changing schedules. I want intuitive tools that show occupancy in real time, simplify bookings and keep my work environment comfortable and well-serviced in the background.',
  },
  'er-bok__food-beverage-area': {
    id: 'er-bok__food-beverage-area',
    label: 'Food & Beverage Area',
    icon: '📍',
    modules: [
      'Digital Food Ordering',
      'Delivery robots',
      'AI Tray Scanning',
      'Service Robots',
      'Robotic Cooking',
      'Sustainable Packaging & Reusable Management',
      'Alternative Protein',
      'Food 3D printing',
      'Autonomous Store / Micro-market',
      'Autonomous Fridge',
      'F&B Experience',
      'Hydration / Water',
    ],
    description:
      'At meal time, I head to the cafeteria looking for my go-to healthy options without endless queues. I need to fuel up efficiently before afternoon calls, so I want a streamlined payment process that remembers my food preferences automatically without repeatedly inputting details.',
  },
  'er-bok__wellbeing-breaktime': {
    id: 'er-bok__wellbeing-breaktime',
    label: 'Wellbeing & Breaktime',
    icon: '📍',
    modules: [
      'Air Quality',
      'F&B Experience',
      'Gym',
      'Physical Health',
      'Mental Health',
      'Service Request',
    ],
    description:
      'Between intense work blocks, I want easy ways to pause, move, breathe and look after my physical and mental health. I need simple access to healthy breaks, wellbeing activities and nudges that help me disconnect for a moment and come back focused and energized.',
  },
  'er-bok__bed-time': {
    id: 'er-bok__bed-time',
    label: 'Bed Time',
    icon: '🛏️',
    modules: ['Service Request', 'Air Quality', 'Mental Health', 'Physical Health'],
    description:
      'I want to rest and recover properly after long shifts on site, knowing that accommodation, safety, meals and communication services are all taken care of. I need a comfortable and reliable living environment that helps me disconnect from work, maintain contact with home and recharge physically and mentally — so I can stay healthy, focused and ready for the next day, even during extended periods away from my family and daily routine.',
  },
};

/**
 * Per-moment editorial copy (subtitle + body).
 * For the 2 new moments the copy comes verbatim from the BoK editorial PDF;
 * the 5 reused moments inherit subtitles consistent with the catalogue's
 * existing white-collar editorial.
 */
export const ER_BOK_MOMENT_EDITORIAL: Record<ErBoKStepId, { subtitle: string; body: string }> = {
  'er-bok__departure-from-home': {
    subtitle: 'Safe, organized departure for extended mining assignments',
    body: ER_BOK_STEPS['er-bok__departure-from-home'].description ?? '',
  },
  'er-bok__commute': {
    subtitle: 'Getting to site with confidence — transport, ID and last-mile guidance',
    body: ER_BOK_STEPS['er-bok__commute'].description ?? '',
  },
  'er-bok__welcome-area': {
    subtitle: 'A frictionless arrival — security, wayfinding and concierge support',
    body: ER_BOK_STEPS['er-bok__welcome-area'].description ?? '',
  },
  'er-bok__workplace': {
    subtitle: 'Productive workdays — comfort, occupancy and on-the-go services',
    body: ER_BOK_STEPS['er-bok__workplace'].description ?? '',
  },
  'er-bok__food-beverage-area': {
    subtitle: 'Healthy fuel without the queues — personalised, fast, sustainable',
    body: ER_BOK_STEPS['er-bok__food-beverage-area'].description ?? '',
  },
  'er-bok__wellbeing-breaktime': {
    subtitle: 'Mind and body breaks — wellbeing built into the day',
    body: ER_BOK_STEPS['er-bok__wellbeing-breaktime'].description ?? '',
  },
  'er-bok__bed-time': {
    subtitle: 'Comfortable rest and recovery during extended on-site missions',
    body: ER_BOK_STEPS['er-bok__bed-time'].description ?? '',
  },
};

/** Hero illustration per moment (PNG, full-bleed crop). */
export const ER_BOK_MOMENT_IMAGE: Record<ErBoKStepId, string> = {
  'er-bok__departure-from-home': `${MOM_BASE}/departure-from-home.png`,
  'er-bok__commute': `${MOM_BASE}/commute.png`,
  'er-bok__welcome-area': `${MOM_BASE}/welcome-area.png`,
  'er-bok__workplace': `${MOM_BASE}/workplace.png`,
  'er-bok__food-beverage-area': `${MOM_BASE}/food-beverage-area.png`,
  'er-bok__wellbeing-breaktime': `${MOM_BASE}/wellbeing-breaktime.png`,
  'er-bok__bed-time': `${MOM_BASE}/bed-time.png`,
};

/**
 * Hotspot positions on the new isometric (percentages, top-left corner + w/h).
 * Approximate first-pass — fine-tune visually if needed. The journey-map
 * component centers the numbered pill on `left + w/2`, `top + h/2`, so think
 * of these as bounding boxes whose center lands where the moment happens on
 * the mining site illustration.
 */
export const ER_BOK_HOTSPOTS: JourneyHotspot[] = [
  { stepId: 'er-bok__departure-from-home', left: 4, top: 14, w: 12, h: 14 },
  { stepId: 'er-bok__commute', left: 14, top: 38, w: 12, h: 14 },
  { stepId: 'er-bok__welcome-area', left: 24, top: 60, w: 12, h: 14 },
  { stepId: 'er-bok__workplace', left: 42, top: 30, w: 12, h: 14 },
  { stepId: 'er-bok__food-beverage-area', left: 56, top: 58, w: 12, h: 14 },
  { stepId: 'er-bok__wellbeing-breaktime', left: 70, top: 32, w: 12, h: 14 },
  { stepId: 'er-bok__bed-time', left: 82, top: 62, w: 12, h: 14 },
];

export function isErBoKStepId(id: string): id is ErBoKStepId {
  return (ER_BOK_STEP_IDS as readonly string[]).includes(id);
}
