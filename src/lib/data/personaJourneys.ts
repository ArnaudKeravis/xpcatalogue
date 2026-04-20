/**
 * Per-persona journey maps + clickable moment hotspots.
 *
 * Single source of truth for all 24 personas. Each persona points at a local
 * PNG/JPG under `public/images/catalogue/assets/journeys/` and declares its
 * moment pills with percent-based bounding boxes (0–100) over the image.
 *
 * Hotspot ids are JourneyStep ids — they must exist in the catalogue's
 * `journeySteps` (see `fallback.ts`, which synthesises stub steps for any
 * id declared here that the app doesn't otherwise define).
 *
 * Coordinates are eyeballed from the 1024×576 isometric artwork and can
 * be fine-tuned in isolation without touching any other module.
 *
 * Public API (used by `personaDefinitions.ts` + `fallback.ts`):
 *   - `PERSONA_JOURNEYS` — the record of all 24 persona journey defs
 *   - `resolveJourneyMapImage(personaId)` — image path for a persona
 *   - `resolveJourneyHotspots(personaId)` — clickable hotspots for a persona
 *   - `hotspotsFromJourney(def)` — low-level helper
 */

import type { JourneyHotspot } from './types';

const BASE = '/images/catalogue/assets/journeys';

export interface PersonaJourneyMoment {
  /** JourneyStep id — used for routing + data lookup. */
  id: string;
  /** Pill label shown on the map (matches the artwork copy). */
  label: string;
  /** Percent coordinates of the clickable box over the image (0–100). */
  left: number;
  top: number;
  w: number;
  h: number;
}

export interface PersonaJourneyDef {
  /** Image path (local). */
  image: string;
  /** Ordered moment pills shown on the artwork. */
  moments: PersonaJourneyMoment[];
}

/** Hotspot size — tuned to comfortably cover a moment pill without overlapping neighbours. */
const PILL_W = 16;
const PILL_H = 10;

/** Build a hotspot by centre-point rather than top-left, to match how pills look on the art. */
function pill(id: string, label: string, cx: number, cy: number, w = PILL_W, h = PILL_H): PersonaJourneyMoment {
  return { id, label, left: Math.max(0, cx - w / 2), top: Math.max(0, cy - h / 2), w, h };
}

/* ─────────────────────────────────────────────────────────────────────────
 * WORK
 * ─────────────────────────────────────────────────────────────────────── */

const WHITE_COLLAR: PersonaJourneyDef = {
  image: `${BASE}/white-collar.jpg`,
  moments: [
    pill('commute', 'Commute', 19, 51),
    pill('welcome-area', 'Welcome Area', 27, 77),
    pill('workplace', 'Workplace', 47, 8),
    pill('wellbeing-break', 'Wellbeing & Breaktime', 53, 60),
    pill('food-beverage-work', 'Food & Beverage Area', 77, 18),
  ],
};

const BLUE_COLLAR: PersonaJourneyDef = {
  image: `${BASE}/blue-collar.jpg`,
  moments: [
    pill('bc-commute', 'Commute', 18, 50),
    pill('bc-welcome', 'Welcome Area', 29, 76),
    pill('bc-workplace', 'Workplace', 47, 46),
    pill('bc-wellbeing', 'Wellbeing & Breaktime', 55, 56),
    pill('bc-fnb', 'Food and Beverage Area', 82, 16),
  ],
};

const GREY_COLLAR: PersonaJourneyDef = {
  image: `${BASE}/grey-collar.jpg`,
  moments: [
    pill('gc-commute', 'Commute', 21, 52),
    pill('gc-welcome', 'Welcome Area', 13, 79),
    pill('gc-workplace', 'Workplace', 68, 18),
    pill('gc-wellbeing', 'Wellbeing & Breaktime', 50, 87),
    pill('gc-fnb', 'Food & Beverage Area', 83, 58),
  ],
};

const MILITARY: PersonaJourneyDef = {
  image: `${BASE}/military.jpg`,
  moments: [
    pill('mil-evening', 'Evening Routine', 11, 88),
    pill('mil-morning', 'Morning Routine', 26, 33),
    pill('mil-work', 'Work / Activities', 45, 11),
    pill('mil-diner', 'Diner with Regiment', 46, 58),
    pill('mil-after-work', 'After Work', 67, 74),
    pill('mil-lunch', 'Lunch Break', 85, 45),
  ],
};

/* ─────────────────────────────────────────────────────────────────────────
 * HEAL
 * ─────────────────────────────────────────────────────────────────────── */

const DOCTOR: PersonaJourneyDef = {
  image: `${BASE}/doctor.jpg`,
  moments: [
    pill('doc-commute', 'Commute', 22, 43),
    pill('doc-end-shift', 'End of Shift', 27, 73),
    pill('doc-consult', 'Patient Consultations', 37, 16),
    pill('doc-rounds', 'Afternoon Rounds', 50, 78),
    pill('doc-meetings', 'Team Meetings', 59, 13),
    pill('doc-break', 'Breaktime', 73, 73),
    pill('doc-fnb', 'Food & Beverage Area', 84, 22),
  ],
};

const NURSE: PersonaJourneyDef = {
  image: `${BASE}/nurse.jpg`,
  moments: [
    pill('nur-commute', 'Commute', 21, 47),
    pill('nur-freetime', 'Freetime & Work/Life Balance', 22, 66, 22),
    pill('nur-welcome', 'Welcome', 42, 40),
    pill('nur-break', 'Breaktime', 55, 63),
    pill('nur-care', 'Nursing Care', 59, 28),
    pill('nur-fnb', 'Food & Beverage Area', 80, 78),
  ],
};

const SENIOR: PersonaJourneyDef = {
  image: `${BASE}/senior.jpg`,
  moments: [
    pill('sen-welcome', 'Welcome Residents', 20, 50, 18),
    pill('sen-activities', 'Activities', 37, 15),
    pill('sen-breakfast', 'Breakfast', 43, 43),
    pill('sen-dinner', 'Dinner', 49, 77),
    pill('sen-lunch', 'Lunch Break', 64, 43),
    pill('sen-break', 'Breaktime', 88, 66),
  ],
};

const PATIENT: PersonaJourneyDef = {
  image: `${BASE}/patient.jpg`,
  moments: [
    pill('pat-rest', 'Rest & Personal Balance', 13, 88, 22),
    pill('pat-commute', 'Commute', 22, 47),
    pill('pat-leave', 'Leaving the Hospital', 39, 77, 18),
    pill('pat-admission', 'Welcome and Admission', 58, 22, 18),
    pill('pat-care', 'Care and Daily Routine', 71, 50, 18),
    pill('pat-lunch', 'Lunch Break', 68, 84),
    pill('pat-snack', 'Snack', 89, 66),
  ],
};

/* ─────────────────────────────────────────────────────────────────────────
 * PLAY
 * ─────────────────────────────────────────────────────────────────────── */

const SPORT_FAN: PersonaJourneyDef = {
  image: `${BASE}/sport-fan.jpg`,
  moments: [
    pill('sf-commute', 'Commute', 10, 32),
    pill('sf-waiting', 'Waiting for the Game', 38, 14, 18),
    pill('sf-welcome', 'Welcome Area', 42, 37),
    pill('sf-halftime', 'Halftime Activities', 62, 63, 18),
    pill('sf-after', 'After Event', 38, 79),
    pill('sf-match', 'Social Time / Match Time', 83, 18, 20),
  ],
};

const PARTICIPANT: PersonaJourneyDef = {
  image: `${BASE}/participant.jpg`,
  moments: [
    pill('par-commute', 'Commute', 11, 33),
    pill('par-arrival', 'Arrival & Access', 40, 24),
    pill('par-nav', 'Navigating the Show', 65, 11, 18),
    pill('par-after', 'After Event', 43, 79),
    pill('par-talk', 'Attending a Talk or a Demo', 88, 55, 22),
    pill('par-net', 'Networking & Breaktime', 70, 86, 20),
  ],
};

const VIP_GUEST: PersonaJourneyDef = {
  image: `${BASE}/vip-guest.jpg`,
  moments: [
    pill('vip-commute', 'Prep & Commute', 19, 33),
    pill('vip-lounge', 'Private Lounge Entry', 30, 13, 18),
    pill('vip-arrival', 'Arrival & Access', 41, 40),
    pill('vip-eat', 'Eat & Drink', 51, 75),
    pill('vip-networking', 'Networking & Event Time', 66, 43, 20),
    pill('vip-after', 'After Event', 25, 79),
  ],
};

const TOURIST: PersonaJourneyDef = {
  image: `${BASE}/tourist.jpg`,
  moments: [
    pill('tou-commute', 'Prep & Commute', 9, 40),
    pill('tou-welcome', 'Welcome & Orientation', 34, 27, 20),
    pill('tou-depart', 'Departure', 57, 77),
    pill('tou-visit', 'Visit', 72, 20),
    pill('tou-snack', 'Snack', 86, 35),
    pill('tou-eat', 'Eat & Drink', 89, 73),
  ],
};

/* ─────────────────────────────────────────────────────────────────────────
 * LEARN
 * ─────────────────────────────────────────────────────────────────────── */

const STUDENT: PersonaJourneyDef = {
  image: `${BASE}/student.jpg`,
  moments: [
    pill('stu-commute', 'Commute', 8, 33),
    pill('stu-welcome', 'Welcome Area', 43, 35),
    pill('stu-freetime', 'Freetime & Studies/Life Balance', 48, 89, 26),
    pill('stu-studies', 'Studies', 59, 12),
    pill('stu-fnb', 'Food & Beverage Area', 75, 67),
  ],
};

const SCHOOLCHILD: PersonaJourneyDef = {
  image: `${BASE}/schoolchild.jpg`,
  moments: [
    pill('sch-commute', 'Commute', 10, 30),
    pill('sch-welcome', 'Welcome Area', 35, 34),
    pill('sch-freetime', 'Freetime', 44, 92),
    pill('sch-class', 'In class', 63, 33),
    pill('sch-fnb', 'Food & Beverage Area', 73, 67),
  ],
};

const PARENT_LEARN: PersonaJourneyDef = {
  image: `${BASE}/parent.jpg`,
  moments: [
    pill('lp-weekly', 'Weekly Preparation', 17, 88),
    pill('lp-prep', 'Prep & Commute', 26, 27),
    pill('lp-evening', 'Evening Routine', 37, 91),
    pill('lp-school', 'During School Day', 41, 17),
    pill('lp-pickup', 'Pick-up Time', 64, 71),
    pill('lp-meals', 'Meal Visibility', 88, 45),
  ],
};

const TEACHER: PersonaJourneyDef = {
  image: `${BASE}/teacher.jpg`,
  moments: [
    pill('tea-commute', 'Commute', 10, 28),
    pill('tea-freetime', 'Freetime & Work/Life Balance', 31, 93, 24),
    pill('tea-arrival', 'Arrival to the School/Campus', 46, 60, 22),
    pill('tea-teaching', 'Teaching', 63, 30),
    pill('tea-fnb', 'Food & Beverage Area', 68, 67),
    pill('tea-break', 'Breaktime', 83, 10),
  ],
};

/* ─────────────────────────────────────────────────────────────────────────
 * OPERATOR (one artwork — reused across all areas)
 * ─────────────────────────────────────────────────────────────────────── */

const OPERATOR: PersonaJourneyDef = {
  image: `${BASE}/operator.jpg`,
  moments: [
    pill('op-fm-round', 'Kitchen / Back Kitchen: FM Checking Round', 31, 8, 22),
    pill('op-kick-off', 'Kick-off & Early Check', 46, 44, 18),
    pill('op-order-planning', 'Order, Planning & Maintenance Management', 52, 71, 26),
    pill('op-office-time', 'Office Time', 68, 32),
    pill('op-food-service', 'Food & Beverage Area', 82, 55),
  ],
};

/* ─────────────────────────────────────────────────────────────────────────
 * CLIENT (one artwork — reused across all areas)
 * ─────────────────────────────────────────────────────────────────────── */

const CLIENT: PersonaJourneyDef = {
  image: `${BASE}/client.jpg`,
  moments: [
    pill('cli-welcome', 'Welcome & Admission', 23, 77),
    pill('cli-meetings', 'Internal Meetings & Alignment', 34, 14, 18),
    pill('cli-kickoff', 'Kick off & Early Check', 45, 35, 18),
    pill('cli-improvement', 'Improvement Sessions & Forward Planning', 48, 92, 26),
    pill('cli-review', 'Service Review & Site Rounds', 75, 27, 20),
    pill('cli-lunch', 'Lunch & Stakeholder Engagement', 82, 89, 22),
  ],
};

/* ───────────────────────────────────────────────────────────────────────── */

export const PERSONA_JOURNEYS: Record<string, PersonaJourneyDef> = {
  // WORK
  'white-collar': WHITE_COLLAR,
  'blue-collar': BLUE_COLLAR,
  'grey-collar': GREY_COLLAR,
  military: MILITARY,
  'operator-work': OPERATOR,
  'client-work': CLIENT,
  // HEAL
  doctor: DOCTOR,
  nurse: NURSE,
  senior: SENIOR,
  patient: PATIENT,
  'operator-heal': OPERATOR,
  'client-heal': CLIENT,
  // PLAY
  'sport-fan': SPORT_FAN,
  participant: PARTICIPANT,
  'vip-guest': VIP_GUEST,
  tourist: TOURIST,
  'operator-play': OPERATOR,
  'client-play': CLIENT,
  // LEARN
  student: STUDENT,
  schoolchild: SCHOOLCHILD,
  parent: PARENT_LEARN,
  teacher: TEACHER,
  'operator-learn': OPERATOR,
  'client-learn': CLIENT,
};

/** Convert a journey def's moments into the app's JourneyHotspot shape. */
export function hotspotsFromJourney(def: PersonaJourneyDef): JourneyHotspot[] {
  return def.moments.map((m) => ({ stepId: m.id, left: m.left, top: m.top, w: m.w, h: m.h }));
}

/**
 * Resolve the journey map image for a persona.
 * Returns `undefined` if the persona has no artwork (caller should handle).
 */
export function resolveJourneyMapImage(personaId: string): string | undefined {
  return PERSONA_JOURNEYS[personaId]?.image;
}

/**
 * Resolve clickable hotspots for a persona.
 * Returns an empty array if the persona has no journey defined.
 */
export function resolveJourneyHotspots(personaId: string): JourneyHotspot[] {
  const def = PERSONA_JOURNEYS[personaId];
  return def ? hotspotsFromJourney(def) : [];
}
