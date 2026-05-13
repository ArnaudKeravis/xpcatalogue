import type { ErBoKPersona } from './types';

/** Client / asset-owner lens — complements the six BoK worker profiles and the operator view. */
export const ER_CLIENT_BOK: ErBoKPersona = {
  id: 'client',
  profileKey: 'CLIENT EXECUTIVE',
  name: 'Jordan',
  role: 'IFM sponsor · Energy & Resources',
  age: 52,
  gender: 'Non-binary',
  relationship: 'Married',
  kids: 'Teen children',
  experience: '15+ years in facilities and services procurement',
  quote:
    'I need one accountable partner who can prove reliability, safety, and decarbonisation progress across my remote sites — not a patchwork of vendors.',
  generalDescription:
    'Jordan leads the IFM agenda for a global energy major. They balance capex discipline with workforce experience commitments, board-level ESG reporting, and operational resilience on harsh-environment sites. They expect transparent KPIs, audit-ready documentation, and a partner who can translate segmentation insight into a coherent service design.',
  emotionalProfile: [
    'Accountability for total cost and risk',
    'Pressure to demonstrate measurable ESG outcomes',
    'Need for a credible transformation narrative to the board',
    'Low tolerance for service variance across geographies',
  ],
  keyNeeds: [
    'Single governance model across sites',
    'Evidence-backed innovation roadmap',
    'Workforce experience metrics tied to retention',
    'Decarbonisation levers that scale operationally',
  ],
  painPoints: [
    'Fragmented reporting between regions',
    'Hard to compare site-to-site service quality',
    'Innovation pilots that never reach industrial scale',
    'Gaps between promised SLAs and frontline reality',
  ],
  howWeAddress: [
    'IFM value-case pillars mapped to measurable outcomes',
    'Segmentation (BoK) informing service design',
    'Digital thread from operations data to executive dashboards',
    'Home-to-home journey framing for workforce experience',
  ],
  moduleClusters: [
    'Systems & Governance (KPIs, audits, contracts)',
    'Smart facilities & multi-choice retailing at scale',
  ],
  whoTheyAre:
    'Senior client stakeholders who sponsor integrated facilities management — often procurement, real estate, or COO office; accountable for multi-site consistency and transformation narratives.',
};
