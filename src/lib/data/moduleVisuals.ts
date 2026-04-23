/**
 * Module visuals — maps a `Module` to a Phosphor icon so the catalogue can
 * drop emoji tiles in favour of consistent, crisp vector marks.
 *
 * Priority:
 *   1. explicit id override (BY_ID)
 *   2. keyword match on module name
 *   3. safe default (Buildings)
 *
 * Icons are imported through the SSR-safe entry (`dist/ssr`) so this helper
 * is usable from both server and client components.
 */

import type { Icon, IconWeight } from '@phosphor-icons/react';
import {
  Barbell,
  Basket,
  Bell,
  Brain,
  Broom,
  Buildings,
  Calendar,
  Car,
  ChartBar,
  ChartLine,
  ChatCentered,
  ClipboardText,
  Cookie,
  CookingPot,
  CreditCard,
  Cube,
  DeviceMobile,
  Drop,
  Factory,
  ForkKnife,
  GameController,
  GraduationCap,
  HandHeart,
  Heart,
  IdentificationBadge,
  Leaf,
  Lightning,
  Medal,
  Monitor,
  Package,
  Receipt,
  Recycle,
  Robot,
  Scan,
  ShieldCheck,
  ShoppingBag,
  Signpost,
  Sparkle,
  SquaresFour,
  Star,
  Storefront,
  Tag,
  Television,
  Thermometer,
  Trash,
  UserCircle,
  UsersThree,
  WifiHigh,
  Wind,
  Wrench,
} from '@phosphor-icons/react/dist/ssr';
import type { Module } from './types';

export interface ModuleVisual {
  Icon: Icon;
  /** Phosphor weight — `duotone` reads best on gradient backgrounds. */
  weight: IconWeight;
}

const DUO = (Icon: Icon): ModuleVisual => ({ Icon, weight: 'duotone' });
const FILL = (Icon: Icon): ModuleVisual => ({ Icon, weight: 'fill' });

/** Explicit overrides keyed on the module `id` (kebab-case). */
const BY_ID: Record<string, ModuleVisual> = {
  conciergerie: DUO(Bell),
  'service-request': DUO(Bell),
  'autonomous-stores': DUO(Storefront),
  'store-micromarket': DUO(ShoppingBag),
  'smart-vending': DUO(Basket),
  'advanced-smart-vending': DUO(Basket),
  'self-checkout-ai': DUO(Scan),
  'digital-apps': DUO(DeviceMobile),
  'food-waste': DUO(Recycle),
  'ai-tools': DUO(Brain),
  'safety-compliance': DUO(ShieldCheck),
  'food-safety': DUO(Thermometer),
  'delivery-robots': DUO(Package),
  'service-robots': DUO(Robot),
  'cleaning-robots': DUO(Robot),
  'kitchen-robots': DUO(CookingPot),
  robots: DUO(Robot),
  'robot-cooking': DUO(CookingPot),
  'automated-food-processing': DUO(Factory),
  'circular-economy': DUO(Recycle),
  'circular-and-upcycling': DUO(Recycle),
  feedback: FILL(Star),
  analytics: DUO(ChartBar),
  'real-time-insights': DUO(ChartLine),
  hydration: DUO(Drop),
  'fm-operations': DUO(Buildings),
  'health-wellness': FILL(Heart),
  'physical-health': DUO(Barbell),
  'mental-health': DUO(HandHeart),
  gym: DUO(Barbell),
  'cleaning-hygiene': DUO(Broom),
  'cleaning-efficiency': DUO(Broom),
  'hygiene-and-sanitation': DUO(Broom),
  'energy-environment': DUO(Leaf),
  'energy-management': DUO(Lightning),
  'sustainability-awareness': DUO(Leaf),
  'sustainability-measured': DUO(Leaf),
  accessibility: FILL(HandHeart),
  gamification: DUO(GameController),
  'training-learning': DUO(GraduationCap),
  training: DUO(GraduationCap),
  'digital-signage': DUO(Television),
  display: DUO(Monitor),
  wayfinding: DUO(Signpost),
  'parking-management': DUO(Car),
  'maintenance-and-asset-mgmt': DUO(Wrench),
  'work-order-management': DUO(ClipboardText),
  'inventory-management': DUO(Package),
  'price-management': DUO(Tag),
  quality: DUO(Medal),
  'room-booking': DUO(Calendar),
  'space-planning': DUO(SquaresFour),
  'footfall-and-space-analytics': DUO(UsersThree),
  'workforce-management': DUO(UsersThree),
  'hr-and-staff-management': DUO(UsersThree),
  'digital-reception': DUO(UserCircle),
  reception: DUO(UserCircle),
  'visitor-management-and-access-control': DUO(IdentificationBadge),
  iot: DUO(WifiHigh),
  'air-quality': DUO(Wind),
  'waste-management': DUO(Trash),
  catering: DUO(ForkKnife),
  'menu-planning': DUO(ForkKnife),
  'alternative-fandb': DUO(ForkKnife),
  snacking: DUO(Cookie),
  'food-delivery-serving': DUO(Package),
  'battery-charger': DUO(Lightning),
  '3d-printing': DUO(Cube),
  'digital-xp': DUO(Sparkle),
  'accounts-card-and-management-corporate': DUO(CreditCard),
  'ai-personal-assistant': DUO(Sparkle),
  'billing-and-invoicing-tddi': DUO(Receipt),
  'business-center': DUO(Buildings),
};

/** Tuples of [regex, visual] — first match wins. Used when BY_ID doesn't hit. */
const BY_KEYWORD: Array<[RegExp, ModuleVisual]> = [
  [/\brobots?\b/i, DUO(Robot)],
  [/\bvending|micromarket|store|retail\b/i, DUO(Storefront)],
  [/\bkitchen|cook|chef|cuisine|oven\b/i, DUO(CookingPot)],
  [/\bfood|meal|dining|menu|catering|restaurant\b/i, DUO(ForkKnife)],
  [/\bsnack|candy|biscuit\b/i, DUO(Cookie)],
  [/\bclean|hygien|broom|sanit\b/i, DUO(Broom)],
  [/\bwaste|trash|garbage\b/i, DUO(Trash)],
  [/\bcircular|recycl|upcycl\b/i, DUO(Recycle)],
  [/\bsafety|compliance|audit|hse\b/i, DUO(ShieldCheck)],
  [/\banalytic|insight|dashboard|metric|measur\b/i, DUO(ChartBar)],
  [/\bfeedback|rating|review\b/i, FILL(Star)],
  [/\bai|intelligence|ml|machine\s?learning|cognitive\b/i, DUO(Brain)],
  [/\bapp|mobile|smartphone\b/i, DUO(DeviceMobile)],
  [/\benerg|power|electric\b/i, DUO(Lightning)],
  [/\benvironment|sustain|eco|green|carbon\b/i, DUO(Leaf)],
  [/\bhealth|wellbeing|wellness|care\b/i, FILL(Heart)],
  [/\bfitness|sport|gym|training|exercise\b/i, DUO(Barbell)],
  [/\baccess|inclusion|inclus\b/i, DUO(HandHeart)],
  [/\bgame|play|interactive\b/i, DUO(GameController)],
  [/\blearn|education|course|study|school\b/i, DUO(GraduationCap)],
  [/\bsignage|screen|display|monitor\b/i, DUO(Monitor)],
  [/\bway\s?find|direction|navigation\b/i, DUO(Signpost)],
  [/\bpark|garage\b/i, DUO(Car)],
  [/\bmaintenance|repair|tool|wrench\b/i, DUO(Wrench)],
  [/\border|ticket|request|task\b/i, DUO(ClipboardText)],
  [/\binventor|stock|warehouse|package\b/i, DUO(Package)],
  [/\bprice|tariff|pricing\b/i, DUO(Tag)],
  [/\bquality|excellence|award\b/i, DUO(Medal)],
  [/\bbook|reservation|schedul|calend\b/i, DUO(Calendar)],
  [/\bspace|room|layout|floor\b/i, DUO(SquaresFour)],
  [/\bpeople|staff|team|crew|workforce|hr\b/i, DUO(UsersThree)],
  [/\breception|visitor|guest|welcome\b/i, DUO(UserCircle)],
  [/\bbadge|identific|access\s?card\b/i, DUO(IdentificationBadge)],
  [/\biot|sensor|connected|network|wifi\b/i, DUO(WifiHigh)],
  [/\bair|ventilation|breath\b/i, DUO(Wind)],
  [/\bchat|conversation|message\b/i, DUO(ChatCentered)],
  [/\bwater|drink|hydrat\b/i, DUO(Drop)],
  [/\bthermo|temperature|heat\b/i, DUO(Thermometer)],
  [/\bconcierge|hospitality|service\b/i, DUO(Bell)],
  [/\bbuilding|facility|workplace|office\b/i, DUO(Buildings)],
];

/** Keyword-aware resolver — use everywhere the codebase currently prints `mod.icon`. */
export function pickModuleVisual(
  mod: Pick<Module, 'id' | 'name'> | null | undefined,
): ModuleVisual {
  if (!mod) return DUO(Buildings);
  const override = BY_ID[mod.id];
  if (override) return override;
  const name = mod.name ?? '';
  for (const [re, visual] of BY_KEYWORD) {
    if (re.test(name)) return visual;
  }
  return DUO(Buildings);
}
