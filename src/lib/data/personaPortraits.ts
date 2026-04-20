/**
 * Portrait image paths — local catalogue assets in `public/images/catalogue/assets/`.
 * Every image ships with the product; there are no remote fetches at runtime.
 */

const BASE = '/images/catalogue/assets';

export const PERSONA_PORTRAIT_URL: Record<string, string> = {
  // WORK
  'client-work':    `${BASE}/work-client.png`,
  'operator-work':  `${BASE}/work-operator.png`,
  'white-collar':   `${BASE}/work-white-collar.png`,
  'blue-collar':    `${BASE}/work-blue-collar.png`,
  'grey-collar':    `${BASE}/work-grey-collar.png`,
  military:         `${BASE}/work-military.png`,
  // HEAL
  'client-heal':    `${BASE}/heal-client.png`,
  'operator-heal':  `${BASE}/heal-operator.png`,
  doctor:           `${BASE}/heal-doctor.png`,
  senior:           `${BASE}/heal-senior.png`,
  patient:          `${BASE}/heal-patient.png`,
  nurse:            `${BASE}/heal-nurse.png`,
  // PLAY
  'client-play':    `${BASE}/play-client.png`,
  'operator-play':  `${BASE}/play-operator.png`,
  'sport-fan':      `${BASE}/play-sport-fan.png`,
  'vip-guest':      `${BASE}/play-vip-guest.png`,
  participant:      `${BASE}/play-participant.png`,
  tourist:          `${BASE}/play-tourist.png`,
  // LEARN
  'client-learn':   `${BASE}/learn-client.png`,
  'operator-learn': `${BASE}/learn-operator.png`,
  student:          `${BASE}/learn-student.png`,
  schoolchild:      `${BASE}/learn-schoolchild.png`,
  parent:           `${BASE}/learn-parent.png`,
  teacher:          `${BASE}/learn-teacher.png`,
};
