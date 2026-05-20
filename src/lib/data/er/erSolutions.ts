/**
 * Energy & Resources innovations — authored from country benchmark decks
 * (Canada, India, Chile, UK & Ireland — May 2026).
 *
 * Each entry is surfaced in the global `/solutions` catalogue and carries the
 * `'er'` collection (assigned via `ER_SOLUTION_IDS` in
 * `src/lib/data/collections.ts`). The country is encoded twice on purpose:
 *
 * - `regionsAndCountry` — display string on the solution card,
 * - `flags`             — emoji used by the Countries filter chip on
 *                          `/solutions`.
 *
 * Source decks (Design Community Hub → Forward Thinking / SoAppro / Benchmark):
 *   • 2026 ER innovations template Canada.pptx
 *   • ER innovations - India.pptx
 *   • ER_innovations_template_Chile.pptx
 *   • Government & E&R innovations template May 2026 UK&I.pptx
 */

import type { Solution } from '@/lib/data/types';

const ER_CATALOGUE_TAG = 'E&R innovation';

export const ER_SOLUTIONS: Solution[] = [
  /* ── Canada ─────────────────────────────────────────────────────────── */
  {
    id: 'wastewatch-cedar-valley-lodge',
    name: 'WasteWatch by Leanpath — Cedar Valley Lodge',
    module: '',
    type: 'Software',
    catalogueTag: ER_CATALOGUE_TAG,
    status: 'Scaled',
    hashtags: ['#FoodWaste', '#Sustainability', '#RemoteCamps', '#AI'],
    flags: ['🇨🇦'],
    img: '♻️',
    context:
      'Cedar Valley Lodge (Kitimat, BC) is the largest remote work-site food service operation in North America — 4,500 residents, 18,500 meals/day across 11 serving lines, operated by Sodexo Canada for JGC Fluor / LNG Canada.',
    description:
      'WasteWatch by Leanpath combines AI-enabled smart scales, cameras and real-time analytics to track pre-consumer food waste at every meal service. Data-driven production adjustments continuously reduce waste at scale. Deployed Dec 2019, full operations Jul 2021 → Nov 2025 with 500 Sodexo staff.',
    kpis: [
      { v: '21.72%', l: 'Food waste reduction' },
      { v: '449,294 kg', l: 'Waste avoided (5 yrs)' },
      { v: '$1.16M', l: 'Cost avoidance' },
      { v: '97–99%', l: 'Quality & guest satisfaction' },
    ],
    contact: 'Sodexo Canada — E&R',
    benefits: {
      client:
        'Reduced food costs, lower waste-disposal spend and improved menu yield flowing back through the LNG Canada / JGC Fluor contract.',
      consumer:
        '97–99% food quality and consumer satisfaction over 2+ years, average 3.5–4.5 min service wait (target ≤5 min).',
      sodexo:
        'Operational investment absorbed into the contract — no separate client line item — with audit-grade waste evidence and live Power BI KPIs.',
    },
    regionsAndCountry: 'Canada — Kitimat, BC',
    areas: ['work'],
  },
  {
    id: 'cheap-and-cheerful-labour-model',
    name: 'Cheap & Cheerful — Standardized Camp Labour Model',
    module: '',
    type: 'Service',
    catalogueTag: ER_CATALOGUE_TAG,
    status: 'Scaled',
    hashtags: ['#RemoteCamps', '#Operations', '#Bids'],
    flags: ['🇨🇦'],
    img: '🛠️',
    context:
      'A Sodexo Canada–developed internal labour benchmark for remote camp housekeeping and food services, built from operational experience across Canadian E&R sites and applied across remote-camp bids of every occupancy tier.',
    description:
      'Defines base cleaning standards, janitorial scope and staffing levels by camp occupancy tier (351–850+ beds) — independent of what any individual RFP specifies. Allocates defined times-to-task for every room type and service rotation so proposals are consistent, competitive and auditable every time.',
    kpis: [
      { v: '10+', l: 'Occupancy tiers benchmarked (351 → 850+ beds)' },
      { v: '19–26', l: 'Housekeepers staffed per tier' },
      { v: 'More', l: 'Bids shortlisted, more frequently' },
    ],
    contact: 'Sodexo Canada — E&R',
    benefits: {
      client:
        'Pre-validated cleaning and housekeeping standards with transparent, auditable staffing levels for every camp tier.',
      consumer:
        'Consistent on-site service quality regardless of camp size or location.',
      sodexo:
        'Removes subjectivity from RFP costing — operations and sales teams compete on price without compromising service delivery or audit compliance.',
    },
    regionsAndCountry: 'Canada — applied across remote camp bids',
    areas: ['work'],
  },
  {
    id: 'bronze-menu-camp-food-program',
    name: 'Bronze Menu — Value-Engineered Camp Food Program',
    module: '',
    type: 'Service',
    catalogueTag: ER_CATALOGUE_TAG,
    status: 'Scaled',
    hashtags: ['#FoodCost', '#RemoteCamps', '#Menu'],
    flags: ['🇨🇦'],
    img: '🍽️',
    context:
      'Developed December 2024 with Sodexo Canada’s culinary and operations teams — a streamlined, interchangeable menu framework purpose-built for remote camp environments where pricing is the deciding factor.',
    description:
      'Interchangeable proteins and vegetables across the weekly cycle reduce SKUs and food cost without sacrificing nutrition or quality. Simplified daily rotations with batch-cook production. Paired with the Cheap & Cheerful labour model — fewer stations and lower culinary complexity translate into a more competitive bid price.',
    kpis: [
      { v: 'Dec 2024', l: 'Developed & launched' },
      { v: '2 sites', l: 'Active deployments — Arctic Gateway (MB), Toronto Camp (QC)' },
      { v: 'Pipeline', l: 'Expanding across Canadian E&R in 2025' },
    ],
    contact: 'Sodexo Canada — E&R',
    benefits: {
      client:
        'Lower food cost and fewer SKUs while maintaining nutritional standards and audit compliance — Sodexo Canada’s most price-competitive E&R remote-camp offering.',
      consumer:
        'A nutritious, varied weekly menu cycle with consistent quality across rotations.',
      sodexo:
        'Simplified operations, batch-cook production, lower skilled-labour requirements and stronger bid economics.',
    },
    regionsAndCountry: 'Canada — Arctic Gateway (MB), Toronto Camp (QC)',
    areas: ['work'],
  },
  {
    id: 'qr-hazard-id-ohs',
    name: 'QR Hazard ID — In-House OHS Innovation',
    module: '',
    type: 'Application',
    catalogueTag: ER_CATALOGUE_TAG,
    status: 'Scaled',
    hashtags: ['#Safety', '#OHS', '#InHouse'],
    flags: ['🇨🇦'],
    img: '⚠️',
    context:
      'Built entirely in-house by the Sodexo Canada E&R team — a QR code poster gives frontline workers a fast, anonymous way to report OHS hazards directly from their phone. No app download, no login, no paperwork. First deployed: Fermont, QC.',
    description:
      'Workers scan an on-site poster, complete a 6-question Microsoft Forms report in under 60 seconds and submit instantly. Reports go straight to site management for immediate corrective action — replacing paper-based reporting and dramatically lowering the friction to raise a hazard.',
    kpis: [
      { v: '< 60 sec', l: 'Time to submit a hazard report' },
      { v: '100%', l: 'Anonymous — no login required' },
      { v: '$0', l: 'Zero cost to client or site' },
    ],
    contact: 'Sodexo Canada — E&R',
    benefits: {
      client:
        '24/7 anonymous hazard reporting that strengthens OHS posture and audit readiness with zero additional spend.',
      consumer:
        'Frontline workers can flag risks safely and instantly from any mobile device, without paperwork or supervisor friction.',
      sodexo:
        'Replicable at any Sodexo E&R site within days — no software licence, no vendor, no IT project. Built on Microsoft Forms + a printed QR poster.',
    },
    regionsAndCountry: 'Canada — Fermont, QC',
    areas: ['work'],
  },

  /* ── India ──────────────────────────────────────────────────────────── */
  {
    id: 'socampus-fuel-ops-hse',
    name: 'SoCampus — Retail Fuel Ops & HSE Management',
    module: '',
    type: 'Application',
    catalogueTag: ER_CATALOGUE_TAG,
    status: 'Scaled',
    hashtags: ['#HSE', '#Operations', '#Mobile'],
    flags: ['🇮🇳'],
    img: '⛽',
    context:
      'A mobile and web-based operations management platform designed for retail fuel operations across India, addressing the need for unified checklist audits, preventive maintenance and HSE governance at scale.',
    description:
      'SoCampus integrates checklist-based audits, GPS-enabled field tracking, preventive maintenance workflows, actionable task management and real-time reporting to ensure operational efficiency, compliance and Health-Safety-Environment implementation across sites.',
    kpis: [
      { v: 'End-to-end', l: 'Preventive maintenance & field operations workflow' },
      { v: 'OTP', l: 'Work-order closure for improved governance' },
      { v: 'Real-time', l: 'Checklist submission with photo evidence' },
    ],
    contact: 'Sodexo India — E&R',
    benefits: {
      client:
        'Centralized dashboards for outlet-wise performance monitoring, with automated SMS / email alerts and SLA escalation.',
      consumer:
        'Faster resolution of safety and maintenance observations at every retail fuel outlet.',
      sodexo:
        'Digital backbone for fuel retail operations — automated work-order creation, assignment, tracking and closure with photo evidence.',
    },
    regionsAndCountry: 'India',
    areas: ['work'],
  },
  {
    id: 'asset-light-branded-kiosk',
    name: 'Asset-Light Branded Kiosk Partnership Model',
    module: '',
    type: 'Service',
    catalogueTag: ER_CATALOGUE_TAG,
    status: 'Pilot',
    hashtags: ['#Retail', '#Partnerships', '#FoodAndBeyond'],
    flags: ['🇮🇳'],
    img: '🏪',
    context:
      'A low-risk, high-scalability food retail model where branded food partners such as MAGGI (Nestlé) deploy and invest in kiosk infrastructure within client cafeterias operated by Sodexo.',
    description:
      'Unlike traditional brand-activation models where kiosk investments were funded by Sodexo or the client, this model transfers the entire capital investment and operational set-up to the brand partner, while Sodexo earns a royalty-based revenue share from sales.',
    kpis: [
      { v: 'CapEx-free', l: 'Cafeteria monetization' },
      { v: '~10%', l: 'Royalty on sales revenue' },
      { v: 'Scalable', l: 'Framework for future branded retail partnerships' },
    ],
    contact: 'Sodexo India — E&R',
    benefits: {
      client:
        'Recognized branded food experiences inside the cafeteria without capital deployment.',
      consumer:
        'Improved consumer engagement through recognized food brands at the workplace.',
      sodexo:
        'Incremental non-core revenue with no operational risk and no infrastructure-ownership liability.',
    },
    regionsAndCountry: 'India',
    areas: ['work'],
  },

  /* ── Chile ──────────────────────────────────────────────────────────── */
  {
    id: 'so-stay-camp-management',
    name: 'So Stay — Camp Management Platform',
    module: '',
    type: 'Software',
    catalogueTag: ER_CATALOGUE_TAG,
    status: 'Scaled',
    hashtags: ['#RemoteCamps', '#Hospitality', '#RealTimeData'],
    flags: ['🇨🇱'],
    img: '🏕️',
    context:
      'Web platform supporting hotel-style management of remote mining camps in Chile, giving operators a more comprehensive view of camp activity by capturing data in real time.',
    description:
      'So Stay provides daily-operations support for camp management — bookings, occupancy, cleaning, F&B and incident handling — in a single browser-based interface designed to be unique to Sodexo E&R operations in Chile.',
    kpis: [
      { v: '>80%', l: 'Occupancy run-rate' },
      { v: 'Real-time', l: 'Data capture across the camp' },
      { v: 'Unique', l: 'Industry-specific software' },
    ],
    contact: 'Sodexo Chile — E&R',
    benefits: {
      client:
        'Efficient camp management with live visibility on occupancy and service delivery.',
      consumer:
        'Smoother stays for camp residents with faster, data-led service responses.',
      sodexo:
        'Annual implementation charge indexed to the FM-Soft service price — a recurring software-style revenue stream tied to E&R operations.',
    },
    regionsAndCountry: 'Chile',
    areas: ['work'],
  },
  {
    id: 'simply-to-go-chile',
    name: 'Simply To Go — Smart Cooler',
    module: '',
    type: 'Device',
    catalogueTag: ER_CATALOGUE_TAG,
    status: 'Scaled',
    hashtags: ['#Frictionless', '#Retail', '#SmartCooler'],
    flags: ['🇨🇱'],
    img: '🥤',
    context:
      'Low-friction smart cooler / vending equipment deployed across Sodexo Chile E&R sites, designed to extend service hours without additional staffing.',
    description:
      'A fully autonomous smart cooler that automatically recognizes and charges for products without additional validation. The frictionless flow boosts average transaction value and keeps food and beverage available outside traditional service windows.',
    kpis: [
      { v: '+30%', l: 'Average transaction value vs. traditional model' },
      { v: '24/7', l: 'Service availability' },
      { v: 'Autonomous', l: 'No staffing required at the point of sale' },
    ],
    contact: 'Sodexo Chile — E&R',
    benefits: {
      client:
        'Extended F&B availability across shifts with implementation cost assumed by the client.',
      consumer:
        'Frictionless, faster purchase experience — grab, go and get charged automatically.',
      sodexo:
        'Per-transaction charge per user — a usage-based revenue model on top of contracted services.',
    },
    regionsAndCountry: 'Chile',
    areas: ['work'],
  },

  /* ── United Kingdom & Ireland ───────────────────────────────────────── */
  {
    id: 'brand-alignment-checklist-uki',
    name: 'Brand Alignment Checklist — Defence Dining',
    module: '',
    type: 'Application',
    catalogueTag: ER_CATALOGUE_TAG,
    status: 'Scaled',
    hashtags: ['#Brand', '#Audit', '#DefenceDining'],
    flags: ['🇬🇧'],
    img: '✅',
    context:
      'A digital monthly brand-standards audit completed via SMS in the Neo app, designed to measure the implementation of Defence Dining brand standards across UK Government & Energy sites.',
    description:
      'Captures real-time imagery to assess the customer journey and drive improvements in customer satisfaction, footfall, brand equity and average transaction value. Embedded within monthly site-management routines with no additional resource required, supported centrally by marketing, retail and operations teams.',
    kpis: [
      { v: '85%+', l: 'Brand standards compliance across sites' },
      { v: '+50%', l: 'RPG daily sales uplift at one site' },
      { v: '+123%', l: 'Revenue uplift on the same site' },
    ],
    contact: 'Lauren Goehler — Marketing Manager, Government & Energy UK',
    benefits: {
      client:
        'Consistent achievement of brand standards at scale, improved customer satisfaction and stronger brand equity / trust.',
      consumer:
        'A more consistent, higher-quality experience across Defence Dining sites — measurable through repeat visits and ATV.',
      sodexo:
        'Data-led, real-time performance improvement using an existing global licensed tool — no additional headcount.',
    },
    regionsAndCountry: 'United Kingdom',
    areas: ['work'],
  },
  {
    id: 'instarinse',
    name: 'InstaRinse — Rapid Reusable-Cup Rinse System',
    module: '',
    type: 'Device',
    catalogueTag: ER_CATALOGUE_TAG,
    status: 'Scaled',
    hashtags: ['#BetterTomorrow', '#Reusable', '#Sustainability'],
    flags: ['🇬🇧'],
    img: '☕',
    context:
      'Deployed in Scottish Parliament, HM Naval Base Portsmouth and Colchester Garrison within Defence Dining environments, aligned with Sodexo’s Better Tomorrow commitments.',
    description:
      'InstaRinse is a rapid rinse system that removes the barrier to reusable-cup usage by delivering a quick, hygienic 15-second clean, using up to 95% less water than hand washing. Drives behaviour change at scale and pairs well with incentives such as reusable discounts or single-use levies.',
    kpis: [
      { v: '2,700', l: 'Disposable cups eliminated (Scottish Parliament, May ’25–’26)' },
      { v: '2,565 L', l: 'Water saved' },
      { v: '248 kWh', l: 'Energy saved (~89% reduction)' },
      { v: '51%', l: 'Reusable adoption — growing' },
    ],
    contact: 'Lauren Goehler — Marketing Manager, Government & Energy UK',
    benefits: {
      client:
        'Measurable ESG reporting (water, energy, single-use cups), capital-light at ~£4k per unit with scalable rollout.',
      consumer:
        'Reusable-cup adoption made easy — a 15-second hygienic clean rather than hand washing or carrying soiled cups.',
      sodexo:
        'Reduces ongoing water, energy and labour costs while supporting Better Tomorrow commitments. ROI driven by lower disposable-cup spend.',
    },
    regionsAndCountry: 'United Kingdom — Scottish Parliament, HM Naval Base Portsmouth, Colchester Garrison',
    areas: ['work'],
  },
  {
    id: 'digital-messing-uki',
    name: 'Digital Messing — Defence Dining',
    module: '',
    type: 'App',
    catalogueTag: ER_CATALOGUE_TAG,
    status: 'Scaled',
    hashtags: ['#Digital', '#DefenceDining', '#Everyday'],
    flags: ['🇬🇧'],
    img: '📱',
    context:
      'A project to digitise dining in mess facilities across UK Defence & Government Agency locations, enhancing the customer experience while reducing paper-based administration.',
    description:
      'Powered by Everyday — Sodexo’s food and drink ordering app, currently live across 41 Defence and Government Agency locations. Customers place orders on the go via their mobile devices or use on-site digital kiosks, and can access order history and view menu / calorie information at any time.',
    kpis: [
      { v: '41', l: 'Defence & Government Agency locations live' },
      { v: '90%', l: 'Approval rating from test sites' },
      { v: '~£4k', l: 'Capital cost per unit — scalable rollout' },
    ],
    contact: 'Matthew Watkinson — Digital Marketing Manager, Government & Energy UK',
    benefits: {
      client:
        'Reduced paper-based administration, real-time bill visibility and the ability to up-sell retail through the app.',
      consumer:
        'Order on the go, see calorie info, view order history and bills in real time — a modern, frictionless mess experience.',
      sodexo:
        'Streamlined local operations, labour efficiencies, lower food waste and a strong fit for low-to-medium volume sites.',
    },
    regionsAndCountry: 'United Kingdom — Defence & Government Agency network',
    areas: ['work'],
  },
];

/** Stable list of IDs — consumed by `collections.ts` to tag membership. */
export const ER_SOLUTION_IDS: readonly string[] = ER_SOLUTIONS.map((s) => s.id);
