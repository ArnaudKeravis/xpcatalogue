export type Area = 'work' | 'learn' | 'heal' | 'play';

export type SolutionStatus = 'Scaled' | 'Scaling' | 'Pilot' | 'Study';

/**
 * Curated collections — hand-tagged groupings surfaced as first-class nav entries
 * and discovery lenses on the home page. Distinct from `hashtags` (free-form, editorial)
 * because collections are finite, institutionally-blessed shortlists used to answer
 * "what's our scaled, client-ready standard offer?" and "what are our AI blockbusters?".
 *
 * Source of truth: TDDI Standard Offer deck (Sodexo Spark) + the P&L-impact AI slide.
 */
export type SolutionCollection = 'standard-offer' | 'blockbuster';

export type SolutionType =
  | 'Application'
  | 'Device'
  | 'Machine'
  | 'Software'
  | 'Service'
  | 'Dashboard'
  | 'App'
  | 'Packaging'
  | 'Consumable';

export interface KPI {
  v: string;
  l: string;
}

export interface Benefits {
  client: string;
  consumer: string;
  sodexo: string;
}

export interface Solution {
  id: string;
  name: string;
  module: string;
  type: SolutionType;
  status: SolutionStatus;
  hashtags: string[];
  flags: string[];
  img: string;            // emoji fallback (module tile)
  /** Optional hero visual (local catalogue asset). */
  heroImage?: string;
  context: string;
  description: string;
  kpis: KPI[];
  contact: string;
  benefits: Benefits;
  url?: string;
  areas: Area[];
  notionId?: string;
  /**
   * Curated groupings this solution belongs to (`standard-offer`, `blockbuster`).
   * Enriched at load time from `src/lib/data/collections.ts`, not authored per-solution.
   */
  collections?: SolutionCollection[];
}

export interface JourneyStep {
  id: string;
  label: string;
  icon: string;           // emoji
  modules: string[];      // module names relevant to this step
  description?: string;
  touchpoints?: {
    physical: string[];
    digital: string[];
  };
}

/** Percent positions on the isometric journey image. */
export interface JourneyHotspot {
  stepId: string;
  left: number;
  top: number;
  w: number;
  h: number;
}

export interface Persona {
  id: string;
  area: Area;
  name: string;
  fullName: string;
  role: string;
  quote: string;
  emoji: string;
  color: string;
  /** Local portrait path under `/images/catalogue/assets/` (falls back to Notion URL). */
  photo?: string;
  /** Profile strip eyebrow — e.g. "Consumer" */
  profileEyebrow?: string;
  /** Teal segment in "Modular Experience Platform: …" (defaults to profileEyebrow or name) */
  platformSegmentLabel?: string;
  /** Dark blue workplace / context stats (left column) */
  workplaceStats?: string[];
  /** Yellow goals panel (left column) */
  professionalGoals?: string[];
  /** Full-bleed isometric map stored locally under `/images/catalogue/assets/`. */
  journeyMapImage?: string;
  /** Click targets on `journeyMapImage` — same order as journey steps. */
  journeyHotspots?: JourneyHotspot[];
  motivations: string[];
  pains: string[];
  needs: string[];
  steps: string[]; // JourneyStep ids
  notionId?: string;
  /** Rich HTML under "Our Modular Experience Platform" (optional) */
  modularPlatformIntroHtml?: string;
  /** Optional puzzle / diagram above journey (export into `public/images/…`) */
  modularPuzzleImage?: string;
}

export interface Module {
  id: string;
  name: string;
  icon: string;           // emoji
  description: string;
  gradient: string;       // CSS gradient string
  solutionIds: string[];
}

/**
 * Three-role narrative for a given area. Each voice is written in first person
 * ("As a client, I see…") and renders on the single-area page below the
 * persona grid. Optional — when absent, the section is simply not shown.
 *
 * The role *keys* are abstract (client / employee / operator) so the data
 * model stays uniform across areas. The *labels* can be overridden per area
 * because the end-user isn't always an "employee" — it's a patient or resident
 * in HEAL, a student in LEARN, a guest in PLAY.
 */
export interface AreaRoleStories {
  /** One-sentence thesis for the whole area, editorial tone. */
  intro: string;
  /** The decision-maker who commissions the experience. */
  client: string;
  /** The end-user who lives it every day (employee / patient / student / guest). */
  employee: string;
  /** The Sodexo person who delivers it. */
  operator: string;
  /** Optional per-role label overrides; default to "As a Client / Employee / Operator". */
  labels?: Partial<{
    client: string;
    employee: string;
    operator: string;
  }>;
}

export interface AreaConfig {
  id: Area;
  label: string;
  color: string;
  gradient: string;
  tagline: string;
  description: string;
  isometricUrl?: string;
  personaIds: string[];
  roleStories?: AreaRoleStories;
}

export interface CatalogueData {
  solutions: Solution[];
  personas: Persona[];
  modules: Record<string, Module>;
  areas: Record<Area, AreaConfig>;
  journeySteps: Record<string, JourneyStep>;
  lastUpdated: string;
}
