// Static fallback used when Notion is unavailable + static area/module/journey config

import type { Area, AreaConfig, CatalogueData, JourneyStep, Module } from './types';
import { CATALOGUE_PERSONAS } from './personaDefinitions';
import { SOLUTIONS_CATALOG } from './solutionsCatalog';

export const AREA_CONFIGS: Record<Area, AreaConfig> = {
  work: {
    id: 'work',
    label: 'WORK',
    color: '#293896',
    gradient: 'linear-gradient(135deg, #293896, #1a69ff)',
    tagline: 'Every workday more inspiring and fulfilling',
    description:
      'Sodexo makes <strong>every workday more inspiring and fulfilling</strong>, with spaces & services that support your well-being, connection & productivity.',
    isometricUrl: '/images/catalogue/figma/work-area-info-iso.png',
    personaIds: ['client-work', 'white-collar', 'blue-collar', 'grey-collar', 'military', 'operator-work'],
  },
  learn: {
    id: 'learn',
    label: 'LEARN',
    color: '#00a096',
    gradient: 'linear-gradient(135deg, #00a096, #00d1c7)',
    tagline: 'Helping students thrive',
    description:
      'Sodexo helps <strong>students thrive</strong> by creating healthy, welcoming, and motivating places to learn, grow, and connect.',
    isometricUrl: '/images/catalogue/figma/learn-area-info-iso.png',
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
    isometricUrl: '/images/catalogue/figma/heal-area-info-iso.png',
    personaIds: ['client-heal', 'doctor', 'nurse', 'patient', 'senior', 'operator-heal'],
  },
  play: {
    id: 'play',
    label: 'PLAY',
    color: '#1a3af0',
    gradient: 'linear-gradient(135deg, #1a3af0, #4d8aff)',
    tagline: 'Unforgettable experiences',
    description:
      'Sodexo Live! transforms every event into an <strong>unforgettable experience</strong>, where great food, hospitality, and emotion come together.',
    isometricUrl: '/images/catalogue/figma/play-area-info-iso.png',
    personaIds: ['client-play', 'sport-fan', 'participant', 'vip-guest', 'tourist', 'operator-play'],
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

// Map step id → step label for display
export const STEP_LABEL: Record<string, string> = Object.fromEntries(
  Object.values(JOURNEY_STEPS).map((s) => [s.id, s.label])
);

// Solutions mirror `static-home/catalog-solutions.js` (see `solutionsCatalog.ts`).
export const FALLBACK_DATA: CatalogueData = {
  solutions: SOLUTIONS_CATALOG,
  personas: CATALOGUE_PERSONAS,
  modules: MODULE_CONFIGS,
  areas: AREA_CONFIGS,
  journeySteps: JOURNEY_STEPS,
  lastUpdated: new Date().toISOString(),
};
