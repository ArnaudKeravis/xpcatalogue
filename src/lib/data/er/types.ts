/** Energy & Resources segment — BoK + IFM reference content (not Notion-backed). */

export interface ErIfmPillar {
  id: string;
  label: string;
  principles: string[];
}

export interface ErUserNeed {
  id: string;
  title: string;
  shortLabel: string;
  description: string;
  predominantProfiles: string[];
  solutionLevers: string[];
  catalogueHints?: string[];
}

export interface ErBoKPersona {
  id: string;
  profileKey: string;
  name: string;
  role: string;
  age: number;
  gender: string;
  relationship: string;
  kids?: string;
  experience: string;
  quote: string;
  generalDescription: string;
  emotionalProfile: string[];
  keyNeeds: string[];
  painPoints: string[];
  howWeAddress: string[];
  /** IFM / BoK “smart facilities” & retail levers named in the BoK. */
  moduleClusters: string[];
  /** Short demographic / skills note from the BoK. */
  whoTheyAre: string;
}

export interface ErJourneyPhase {
  id: string;
  title: string;
  steps: string[];
  /** Generic pain themes from the BoK home-to-home map (shared baseline). */
  painThemes: string[];
}
