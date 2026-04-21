// Static fallback used when Notion is unavailable + static area/module/journey config

import type { Area, AreaConfig, CatalogueData, JourneyStep, Module, Persona } from './types';
import { CATALOGUE_PERSONAS } from './personaDefinitions';
import { SOLUTIONS_CATALOG } from './solutionsCatalog';
import { PERSONA_JOURNEYS, hotspotsFromJourney } from './personaJourneys';
import {
  buildExcelModules,
  buildOperatorJourneySteps,
  consumerModuleNamesByMoment,
  CONSUMER_MOMENT_TO_STEP,
} from './xpFlowAdapter';

export const AREA_CONFIGS: Record<Area, AreaConfig> = {
  work: {
    id: 'work',
    label: 'WORK',
    color: '#293896',
    gradient: 'linear-gradient(135deg, #293896, #1a69ff)',
    tagline: 'Every workday more inspiring and fulfilling',
    description:
      'Sodexo makes <strong>every workday more inspiring and fulfilling</strong>, with spaces & services that support your well-being, connection & productivity.',
    isometricUrl: '/images/catalogue/assets/areas/work-area-info-iso.png',
    personaIds: ['client-work', 'white-collar', 'blue-collar', 'grey-collar', 'military', 'operator-work'],
    roleStories: {
      intro: 'In every workplace, Sodexo transforms routine into experience.',
      client:
        'I see how well-being and productivity grow side by side — spaces are alive, employees connect, ideas flow.',
      employee:
        'I feel energized, valued, and cared for — enjoying healthy food, inspiring spaces, and digital simplicity that supports my day.',
      operator:
        'I take pride in delivering a human, seamless rhythm in every service — every interaction designed to make work feel better, smarter, and more meaningful.',
    },
  },
  learn: {
    id: 'learn',
    label: 'LEARN',
    color: '#00a096',
    gradient: 'linear-gradient(135deg, #00a096, #00d1c7)',
    tagline: 'Helping students thrive',
    description:
      'Sodexo helps <strong>students thrive</strong> by creating healthy, welcoming, and motivating places to learn, grow, and connect.',
    isometricUrl: '/images/catalogue/assets/areas/learn-area-info-iso.png',
    personaIds: ['client-learn', 'student', 'parent', 'schoolchild', 'teacher', 'operator-learn'],
  },
  heal: {
    id: 'heal',
    label: 'HEAL',
    color: '#5a64a6',
    gradient: 'linear-gradient(135deg, #5a64a6, #8f9ace)',
    tagline: 'Care for every moment of life',
    description:
      'Sodexo <strong>cares for every moment of life</strong>, ensuring comfort, nutrition, and safety for patients, residents, and caregivers alike.',
    isometricUrl: '/images/catalogue/assets/areas/heal-area-info-iso.png',
    personaIds: ['client-heal', 'doctor', 'nurse', 'patient', 'senior', 'operator-heal'],
    roleStories: {
      intro:
        'Across hospitals and care homes, Sodexo brings comfort, dignity, and trust to every touchpoint.',
      client:
        'I see a partner who understands the delicate balance between efficiency and empathy — ensuring safety, hygiene, and emotional care coexist.',
      employee:
        'I feel nurtured and respected, my recovery supported by comforting meals, warm words, and reassuring routines.',
      operator:
        'I am proud to stand behind a service that heals beyond the clinical, creating environments where every act of care becomes a gesture of humanity.',
      labels: {
        employee: 'As a Patient or Resident',
      },
    },
  },
  play: {
    id: 'play',
    label: 'PLAY',
    color: '#1a3af0',
    gradient: 'linear-gradient(135deg, #1a3af0, #4d8aff)',
    tagline: 'Unforgettable experiences',
    description:
      'Sodexo Live! transforms every event into an <strong>unforgettable experience</strong>, where great food, hospitality, and emotion come together.',
    isometricUrl: '/images/catalogue/assets/areas/play-area-info-iso.png',
    personaIds: ['client-play', 'sport-fan', 'participant', 'vip-guest', 'tourist', 'operator-play'],
    roleStories: {
      intro: 'From stadiums to museums, Sodexo Live! turns emotion into experience.',
      client:
        'I see my venue transformed — food, service, and storytelling merging into a living brand experience.',
      employee:
        'I feel the thrill of belonging, tasting creativity, joy, and excellence in every moment — from the first bite to the final applause.',
      operator:
        'I am part of the magic, orchestrating the unseen details that make every event vibrant, memorable, and unforgettable.',
      labels: {
        employee: 'As a Guest',
      },
    },
  },
};

export const MODULE_CONFIGS: Record<string, Module> = {
  Conciergerie: {
    id: 'conciergerie',
    name: 'Conciergerie',
    icon: '🛎️',
    gradient: 'linear-gradient(135deg,#293896,#6a74b6)',
    description: 'Personalized concierge services for workplace lifestyle.',
    solutionIds: [],
  },
  'Autonomous Stores': {
    id: 'autonomous-stores',
    name: 'Autonomous Stores',
    icon: '🏪',
    gradient: 'linear-gradient(135deg,#1a3af0,#4d8aff)',
    description: 'AI-powered cashierless stores for 24/7 frictionless retail.',
    solutionIds: [],
  },
  'Smart Vending': {
    id: 'smart-vending',
    name: 'Smart Vending',
    icon: '🥗',
    gradient: 'linear-gradient(135deg,#293896,#4d6ecc)',
    description: 'Connected vending with fresh healthy products.',
    solutionIds: [],
  },
  'Self-Checkout AI': {
    id: 'self-checkout-ai',
    name: 'Self-Checkout AI',
    icon: '🤖',
    gradient: 'linear-gradient(135deg,#6a74b6,#9ba3d4)',
    description: 'AI computer vision for fast, queue-free checkout.',
    solutionIds: [],
  },
  'Digital Apps': {
    id: 'digital-apps',
    name: 'Digital Apps',
    icon: '📱',
    gradient: 'linear-gradient(135deg,#1a69ff,#4d8aff)',
    description: 'Mobile platforms for seamless food and service ordering.',
    solutionIds: [],
  },
  'Food Waste': {
    id: 'food-waste',
    name: 'Food Waste',
    icon: '⚖️',
    gradient: 'linear-gradient(135deg,#1a7a3c,#27ae60)',
    description: 'AI-powered food waste measurement and reduction.',
    solutionIds: [],
  },
  'AI Tools': {
    id: 'ai-tools',
    name: 'AI Tools',
    icon: '🧠',
    gradient: 'linear-gradient(135deg,#e55a1c,#ff8c5a)',
    description: 'AI for operations, bids, menus, and supply chain.',
    solutionIds: [],
  },
  'Safety & Compliance': {
    id: 'safety-compliance',
    name: 'Safety & Compliance',
    icon: '🛡️',
    gradient: 'linear-gradient(135deg,#c0392b,#e74c3c)',
    description: 'Global HSE incident management and analytics.',
    solutionIds: [],
  },
  'Delivery Robots': {
    id: 'delivery-robots',
    name: 'Delivery Robots',
    icon: '🤖',
    gradient: 'linear-gradient(135deg,#7b2fa0,#b05fd3)',
    description: 'Autonomous robotic delivery for campuses.',
    solutionIds: [],
  },
  'Service Robots': {
    id: 'service-robots',
    name: 'Service Robots',
    icon: '🦾',
    gradient: 'linear-gradient(135deg,#7b2fa0,#b05fd3)',
    description: 'Robots for table bussing and kitchen ops.',
    solutionIds: [],
  },
  'Circular Economy': {
    id: 'circular-economy',
    name: 'Circular Economy',
    icon: '♻️',
    gradient: 'linear-gradient(135deg,#1a7a3c,#3ec76b)',
    description: 'Zero-waste: packaging, reuse, asset lifecycle.',
    solutionIds: [],
  },
  Feedback: {
    id: 'feedback',
    name: 'Feedback',
    icon: '⭐',
    gradient: 'linear-gradient(135deg,#00a096,#00d1c7)',
    description: 'Continuous feedback and experience management.',
    solutionIds: [],
  },
  'Food Safety': {
    id: 'food-safety',
    name: 'Food Safety',
    icon: '🌡️',
    gradient: 'linear-gradient(135deg,#c0392b,#e74c3c)',
    description: 'Temperature monitoring and safety compliance.',
    solutionIds: [],
  },
  Analytics: {
    id: 'analytics',
    name: 'Analytics',
    icon: '📊',
    gradient: 'linear-gradient(135deg,#0e6da8,#293896)',
    description: 'Data analytics and predictive insights.',
    solutionIds: [],
  },
  Hydration: {
    id: 'hydration',
    name: 'Hydration',
    icon: '💧',
    gradient: 'linear-gradient(135deg,#0e6da8,#3498db)',
    description: 'Eco-friendly alternatives to bottled water.',
    solutionIds: [],
  },
  'FM Operations': {
    id: 'fm-operations',
    name: 'FM Operations',
    icon: '🏢',
    gradient: 'linear-gradient(135deg,#0e6da8,#3498db)',
    description: 'Facility management digital platforms.',
    solutionIds: [],
  },
  'Cleaning Robots': {
    id: 'cleaning-robots',
    name: 'Cleaning Robots',
    icon: '🤖',
    gradient: 'linear-gradient(135deg,#7b2fa0,#b05fd3)',
    description: 'Autonomous floor and surface cleaning robots.',
    solutionIds: [],
  },
  'Kitchen Robots': {
    id: 'kitchen-robots',
    name: 'Kitchen Robots',
    icon: '🍳',
    gradient: 'linear-gradient(135deg,#e55a1c,#ff8c5a)',
    description: 'Automated food preparation and cooking systems.',
    solutionIds: [],
  },
  'Health & Wellness': {
    id: 'health-wellness',
    name: 'Health & Wellness',
    icon: '💪',
    gradient: 'linear-gradient(135deg,#00a096,#00d1c7)',
    description: 'Digital and physical wellbeing solutions for employees.',
    solutionIds: [],
  },
  'Cleaning & Hygiene': {
    id: 'cleaning-hygiene',
    name: 'Cleaning & Hygiene',
    icon: '🧹',
    gradient: 'linear-gradient(135deg,#0e6da8,#4d8aff)',
    description: 'Professional hygiene products and systems.',
    solutionIds: [],
  },
  'Energy & Environment': {
    id: 'energy-environment',
    name: 'Energy & Environment',
    icon: '🌿',
    gradient: 'linear-gradient(135deg,#1a7a3c,#27ae60)',
    description: 'Sustainable energy and environmental solutions.',
    solutionIds: [],
  },
  Accessibility: {
    id: 'accessibility',
    name: 'Accessibility',
    icon: '♿',
    gradient: 'linear-gradient(135deg,#293896,#6a74b6)',
    description: 'Inclusive tools for all abilities and needs.',
    solutionIds: [],
  },
  Gamification: {
    id: 'gamification',
    name: 'Gamification',
    icon: '🎮',
    gradient: 'linear-gradient(135deg,#1a3af0,#7b2fa0)',
    description: 'Interactive and gamified guest experiences.',
    solutionIds: [],
  },
  'Training & Learning': {
    id: 'training-learning',
    name: 'Training & Learning',
    icon: '📚',
    gradient: 'linear-gradient(135deg,#00a096,#293896)',
    description: 'Digital learning and upskilling platforms.',
    solutionIds: [],
  },
  'Digital Signage': {
    id: 'digital-signage',
    name: 'Digital Signage',
    icon: '📺',
    gradient: 'linear-gradient(135deg,#0e6da8,#293896)',
    description: 'Dynamic screens, menus and communication displays.',
    solutionIds: [],
  },
};

export const JOURNEY_STEPS: Record<string, JourneyStep> = {
  // ── WORK ──
  commute: {
    id: 'commute',
    label: 'Commute',
    icon: '🚗',
    modules: ['Autonomous Stores', 'Digital Apps', 'Delivery Robots'],
    description: 'Starting the day on the right foot, from home to the workplace.',
    touchpoints: {
      physical: ['Parking', 'Shuttle', 'Entrance'],
      digital: ['Transport app', 'Timetables', 'Tracking'],
    },
  },
  'welcome-area': {
    id: 'welcome-area',
    label: 'Welcome area',
    icon: '🚪',
    modules: ['FM Operations', 'Digital Apps'],
    description: 'The first impression that sets the tone for the whole day.',
    touchpoints: {
      physical: ['Reception desk', 'Visitor badge', 'Signage'],
      digital: ['Digital reception', 'Room finder', 'Wayfinding'],
    },
  },
  workplace: {
    id: 'workplace',
    label: 'Workplace',
    icon: '💻',
    modules: ['Conciergerie', 'Analytics', 'Safety & Compliance'],
    description: 'Finding the right workspace, right now — desk booking, room management, connectivity.',
    touchpoints: {
      physical: ['Open space', 'Meeting rooms', 'Focus rooms'],
      digital: ['Room booking', 'Space analytics', 'Incident reporting'],
    },
  },
  'food-beverage-work': {
    id: 'food-beverage-work',
    label: 'Food & Beverage area',
    icon: '🍽️',
    modules: ['Self-Checkout AI', 'Smart Vending', 'Food Safety', 'Food Waste', 'Digital Apps'],
    description: 'Nourishing body and mind for peak performance — speed, quality, choice.',
    touchpoints: {
      physical: ['Restaurant', 'Cafeteria', 'Break room', 'Vending'],
      digital: ['Pre-order app', 'Menu display', 'Allergen info'],
    },
  },
  'wellbeing-break': {
    id: 'wellbeing-break',
    label: 'Wellbeing & Break time',
    icon: '🧘',
    modules: ['Hydration', 'Smart Vending'],
    description: 'Recharging to stay productive and balanced throughout the day.',
    touchpoints: {
      physical: ['Break room', 'Nap pods', 'Outdoor areas'],
      digital: ['Wellness programs', 'Smart fridge', 'Booking'],
    },
  },
  // ── LEARN ──
  'arrival-campus': {
    id: 'arrival-campus',
    label: 'Campus Arrival',
    icon: '🎓',
    modules: ['FM Operations', 'Digital Apps'],
    description: 'Welcome to campus — orientation, services discovery, first meal.',
    touchpoints: {
      physical: ['Campus entrance', 'Orientation desk'],
      digital: ['Campus app', 'Map'],
    },
  },
  'morning-class': {
    id: 'morning-class',
    label: 'Morning Class',
    icon: '✏️',
    modules: ['Digital Apps'],
    description: 'Focused learning energized by a good breakfast.',
    touchpoints: {
      physical: ['Classroom', 'Library'],
      digital: ['Learning platform'],
    },
  },
  'lunch-break': {
    id: 'lunch-break',
    label: 'Lunch Break',
    icon: '🥗',
    modules: ['Self-Checkout AI', 'Food Waste', 'Digital Apps', 'Smart Vending'],
    description: 'Social, healthy, fast — the campus lunch experience.',
    touchpoints: {
      physical: ['Restaurant', 'Cafeteria', 'Outdoor seating'],
      digital: ['Pre-order', 'Menu', 'Allergens'],
    },
  },
  'study-session': {
    id: 'study-session',
    label: 'Study Session',
    icon: '📖',
    modules: ['Hydration', 'Smart Vending'],
    description: 'Sustained focus with healthy snacks and hydration nearby.',
    touchpoints: {
      physical: ['Library', 'Study rooms', 'Vending area'],
      digital: ['Smart fridge', 'Hydration station'],
    },
  },
  // ── HEAL ──
  'morning-rounds': {
    id: 'morning-rounds',
    label: 'Morning Rounds',
    icon: '🩺',
    modules: ['Food Safety', 'Analytics', 'Digital Apps'],
    description: 'Starting the day with care — patient checks, meal planning, staff briefing.',
    touchpoints: {
      physical: ['Ward', 'Patient rooms', 'Staff area'],
      digital: ['Patient records', 'Meal orders', 'Safety checks'],
    },
  },
  'meal-service': {
    id: 'meal-service',
    label: 'Meal Service',
    icon: '🍲',
    modules: ['Digital Apps', 'Service Robots', 'Food Safety'],
    description: 'Delivering dignity at mealtimes — tailored nutrition, warm service.',
    touchpoints: {
      physical: ['Kitchen', 'Tray preparation', 'Ward delivery'],
      digital: ['Order management', 'Allergen control'],
    },
  },
  'meal-distribution': {
    id: 'meal-distribution',
    label: 'Meal Distribution',
    icon: '🍱',
    modules: ['Service Robots', 'Food Safety', 'Feedback'],
    description: 'Getting the right meal to the right patient at the right time.',
    touchpoints: {
      physical: ['Service robots', 'Food trolleys'],
      digital: ['Distribution tracking', 'Patient feedback'],
    },
  },
  'kitchen-prep': {
    id: 'kitchen-prep',
    label: 'Kitchen Prep',
    icon: '🔪',
    modules: ['Food Safety', 'Food Waste', 'AI Tools'],
    description: 'Behind the scenes — precision, hygiene, zero waste.',
    touchpoints: {
      physical: ['Central kitchen', 'Temperature control'],
      digital: ['Recipe management', 'Waste tracking', 'AI menu'],
    },
  },
  // ── PLAY ──
  'pre-match': {
    id: 'pre-match',
    label: 'Pre-Match',
    icon: '⚽',
    modules: ['Autonomous Stores', 'Service Robots', 'Digital Apps'],
    description: 'Building excitement — food, drinks, atmosphere before kick-off.',
    touchpoints: {
      physical: ['Concourse', 'Kiosks', 'Fan zones'],
      digital: ['Pre-order', 'Queueing', 'Map'],
    },
  },
  'peak-service': {
    id: 'peak-service',
    label: 'Peak Service',
    icon: '🍴',
    modules: ['Self-Checkout AI', 'Service Robots', 'Autonomous Stores'],
    description: 'Thousands of guests, zero margin for error — speed is everything.',
    touchpoints: {
      physical: ['Concession stands', 'Pop-up kiosks'],
      digital: ['Self-checkout', 'Real-time stock'],
    },
  },
  'half-time': {
    id: 'half-time',
    label: 'Half Time',
    icon: '🍺',
    modules: ['Autonomous Stores', 'Self-Checkout AI'],
    description: 'The 15-minute rush — maximum throughput, minimum queuing.',
    touchpoints: {
      physical: ['Concourse bars', 'Express stations'],
      digital: ['JWO stores', 'Pre-order pickup'],
    },
  },
  'full-time': {
    id: 'full-time',
    label: 'Full Time',
    icon: '🏆',
    modules: ['Feedback', 'Digital Apps'],
    description: 'Closing the loop — feedback, loyalty, next visit.',
    touchpoints: {
      physical: ['Exit areas', 'Feedback kiosks'],
      digital: ['Post-event survey', 'Loyalty app'],
    },
  },
  'networking-lunch': {
    id: 'networking-lunch',
    label: 'Networking Lunch',
    icon: '🤝',
    modules: ['Digital Apps', 'Self-Checkout AI', 'Feedback'],
    description: 'Where connections are made over good food.',
    touchpoints: {
      physical: ['Buffet area', 'Round tables'],
      digital: ['Dietary registration', 'Feedback'],
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Excel-sourced flow enrichment (`Catalogue_XP_solutions.xlsx` → xpCatalogueFlow.ts)
// Adds the authoritative module catalogue + wires the operator journey steps.
// `MODULE_CONFIGS_WITH_FLOW` keeps existing modules, backfills solutionIds from
// the Excel mapping, then adds any Excel module missing from the app.
// ─────────────────────────────────────────────────────────────────────────────
const EXCEL_MODULES = buildExcelModules();
const OPERATOR_JOURNEY_STEPS = buildOperatorJourneySteps();
const CONSUMER_MOMENT_MODULES = consumerModuleNamesByMoment();

// Merge Excel solutionIds into existing app modules; then add any Excel
// modules the app doesn't yet have (Parking Management, Display, Gym, …).
const MERGED_MODULES: Record<string, Module> = { ...MODULE_CONFIGS };
for (const [name, excelModule] of Object.entries(EXCEL_MODULES)) {
  if (MERGED_MODULES[name]) {
    const existing = MERGED_MODULES[name];
    const unionIds = Array.from(new Set([...(existing.solutionIds ?? []), ...excelModule.solutionIds]));
    MERGED_MODULES[name] = { ...existing, solutionIds: unionIds };
  } else {
    MERGED_MODULES[name] = excelModule;
  }
}

// Update existing Work-Consumer journey steps with Excel-aligned module lists
// (Commute / Welcome Area / F&B / WP / Wellbeing). Keeps all other steps as-is.
const MERGED_JOURNEY_STEPS: Record<string, JourneyStep> = { ...JOURNEY_STEPS };
for (const [momentName, stepId] of Object.entries(CONSUMER_MOMENT_TO_STEP)) {
  const step = MERGED_JOURNEY_STEPS[stepId];
  const excelModules = CONSUMER_MOMENT_MODULES[momentName] ?? [];
  if (step && excelModules.length > 0) {
    const merged = Array.from(new Set([...excelModules, ...step.modules]));
    MERGED_JOURNEY_STEPS[stepId] = { ...step, modules: merged };
  }
}
// Add operator-specific moments (FM round / Kick off / Office time / Order / F&B ops).
for (const [id, step] of Object.entries(OPERATOR_JOURNEY_STEPS)) {
  MERGED_JOURNEY_STEPS[id] = step;
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-persona journey artwork (`personaJourneys.ts`). For every pill declared
// on a persona's map we ensure a matching JourneyStep exists and override the
// persona's `steps` + `journeyHotspots` so the click-through routes correctly.
// ─────────────────────────────────────────────────────────────────────────────
for (const [, def] of Object.entries(PERSONA_JOURNEYS)) {
  for (const moment of def.moments) {
    if (!MERGED_JOURNEY_STEPS[moment.id]) {
      MERGED_JOURNEY_STEPS[moment.id] = {
        id: moment.id,
        label: moment.label,
        icon: '📍',
        modules: [],
      };
    }
  }
}

const MERGED_PERSONAS: Persona[] = CATALOGUE_PERSONAS.map((p) => {
  const def = PERSONA_JOURNEYS[p.id];
  if (!def) return p;
  return {
    ...p,
    journeyMapImage: def.image,
    journeyHotspots: hotspotsFromJourney(def),
    steps: def.moments.map((m) => m.id),
  };
});

// Map step id → step label for display
export const STEP_LABEL: Record<string, string> = Object.fromEntries(
  Object.values(MERGED_JOURNEY_STEPS).map((s) => [s.id, s.label])
);

// Solutions mirror `reference/static-home/catalog-solutions.js` (see `solutionsCatalog.ts`).
export const FALLBACK_DATA: CatalogueData = {
  solutions: SOLUTIONS_CATALOG,
  personas: MERGED_PERSONAS,
  modules: MERGED_MODULES,
  areas: AREA_CONFIGS,
  journeySteps: MERGED_JOURNEY_STEPS,
  lastUpdated: new Date().toISOString(),
};
