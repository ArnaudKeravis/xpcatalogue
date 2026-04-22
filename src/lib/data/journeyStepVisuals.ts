/**
 * Journey step visuals — maps a `JourneyStep` (or any `{id, label}` lookalike)
 * to a Phosphor icon, so we can drop emoji chips in favour of consistent
 * vector marks across timelines, moment pages and search.
 *
 * Priority:
 *   1. explicit id override (BY_ID)
 *   2. keyword match on the human label
 *   3. safe default (Clock — a moment in time)
 */

import type { Icon, IconWeight } from '@phosphor-icons/react';
import {
  Armchair,
  BeerStein,
  BookOpen,
  BowlFood,
  Car,
  ChefHat,
  Clock,
  Coffee,
  DoorOpen,
  Flag,
  ForkKnife,
  GraduationCap,
  Handshake,
  HeartStraight,
  Laptop,
  Lightning,
  Moon,
  PencilSimple,
  SoccerBall,
  Stethoscope,
  SunHorizon,
  Tray,
  Trophy,
  Users,
} from '@phosphor-icons/react/dist/ssr';

export interface JourneyStepVisual {
  Icon: Icon;
  weight: IconWeight;
}

const DUO = (Icon: Icon): JourneyStepVisual => ({ Icon, weight: 'duotone' });
const FILL = (Icon: Icon): JourneyStepVisual => ({ Icon, weight: 'fill' });

/** Explicit overrides keyed on `step.id` (kebab-case from the data layer). */
const BY_ID: Record<string, JourneyStepVisual> = {
  // WORK
  commute: DUO(Car),
  'welcome-area': DUO(DoorOpen),
  workplace: DUO(Laptop),
  'food-beverage-work': DUO(ForkKnife),
  'wellbeing-break': DUO(Armchair),
  // LEARN
  'arrival-campus': DUO(GraduationCap),
  'morning-class': DUO(PencilSimple),
  'lunch-break': DUO(BowlFood),
  'study-session': DUO(BookOpen),
  // HEAL
  'morning-rounds': DUO(Stethoscope),
  'meal-service': DUO(Tray),
  'meal-distribution': DUO(Tray),
  'kitchen-prep': DUO(ChefHat),
  // PLAY
  'pre-match': DUO(SoccerBall),
  'peak-service': FILL(Lightning),
  'half-time': DUO(BeerStein),
  'full-time': FILL(Trophy),
  'networking-lunch': DUO(Handshake),
};

/** First match wins — used when `id` isn't in the override table. */
const BY_KEYWORD: Array<[RegExp, JourneyStepVisual]> = [
  [/\b(commut|travel|drive|transport|arriv)\b/i, DUO(Car)],
  [/\b(welcome|reception|entrance|door|check.?in)\b/i, DUO(DoorOpen)],
  [/\b(office|desk|workspace|workplace|meeting)\b/i, DUO(Laptop)],
  [/\b(kitchen|prep|chef|cook)\b/i, DUO(ChefHat)],
  [/\b(lunch|dinner|meal|dining|breakfast|food)\b/i, DUO(ForkKnife)],
  [/\b(coffee|break|snack)\b/i, DUO(Coffee)],
  [/\b(wellbeing|relax|rest|pause|chill|nap)\b/i, DUO(Armchair)],
  [/\b(class|lesson|lecture|morning\s?class)\b/i, DUO(PencilSimple)],
  [/\b(study|library|reading|book)\b/i, DUO(BookOpen)],
  [/\b(campus|school|university|learn)\b/i, DUO(GraduationCap)],
  [/\b(round|ward|care|patient|nurse|doctor|clinic)\b/i, DUO(Stethoscope)],
  [/\b(tray|distribution|delivery)\b/i, DUO(Tray)],
  [/\b(pre.?match|kick.?off|warm.?up)\b/i, DUO(SoccerBall)],
  [/\b(peak|rush|surge|crunch)\b/i, FILL(Lightning)],
  [/\b(half.?time|intermission|interval)\b/i, DUO(BeerStein)],
  [/\b(full.?time|final|finish|post.?match|closing)\b/i, FILL(Trophy)],
  [/\b(networking|social|gathering|party|reception)\b/i, DUO(Handshake)],
  [/\b(morning|sunrise|dawn)\b/i, DUO(SunHorizon)],
  [/\b(evening|night|wind.?down|closing\s?time)\b/i, DUO(Moon)],
  [/\b(wellness|health|care)\b/i, FILL(HeartStraight)],
  [/\b(team|crew|staff|people|group)\b/i, DUO(Users)],
  [/\b(flag|milestone|checkpoint)\b/i, DUO(Flag)],
];

export function pickJourneyStepVisual(
  step: { id?: string; label?: string } | null | undefined,
): JourneyStepVisual {
  if (!step) return DUO(Clock);
  if (step.id && BY_ID[step.id]) return BY_ID[step.id]!;
  const label = step.label ?? '';
  for (const [re, visual] of BY_KEYWORD) {
    if (re.test(label)) return visual;
  }
  return DUO(Clock);
}
