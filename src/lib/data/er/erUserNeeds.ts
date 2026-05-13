import type { ErUserNeed } from './types';

/** Six needs from Sodexo Global Needs Based Segmentation BoK (long version). */
export const ER_USER_NEEDS: ErUserNeed[] = [
  {
    id: 'health-wellbeing',
    title: 'Health and wellbeing',
    shortLabel: 'Health & wellbeing',
    description:
      'I want options to stay fit and access to premium healthy food offers. Safety and a zero-harm culture underpin how services show up on site.',
    predominantProfiles: ['Pro-active achiever', 'Remote lifestyler'],
    solutionLevers: [
      'Health & wellbeing program',
      'Food preferences / customized menus',
      'Food transparency',
      'Healthy food meals & outlets',
      'Rewards program',
      'Smart facilities',
      'Shared services',
      'Smart rooms',
    ],
    catalogueHints: ['Map to Work “wellbeing” moments and FM + food modules.'],
  },
  {
    id: 'privacy',
    title: 'Privacy',
    shortLabel: 'Privacy',
    description:
      'I value respect for my privacy and moments to myself — to disconnect from community and work intensity.',
    predominantProfiles: ['Pro-active achiever', 'Privacy seeker', 'Optimizer', 'Family hero'],
    solutionLevers: [
      'Online check-in / check-out',
      'Digital maintenance request',
      'Concierge',
      'Hotel services',
      'Room booking',
      '24/7 retail outlet',
      'Smart rooms',
      'Space design for privacy',
      'Smart cleaning',
      'Expense management',
    ],
    catalogueHints: ['Tag moments “in room” and complaint / service flows.'],
  },
  {
    id: 'comfort',
    title: 'Comfort',
    shortLabel: 'Comfort',
    description:
      'I miss home comforts; on site I want a clean, cared-for environment that feels closer to my own place.',
    predominantProfiles: ['Privacy seeker', 'Family hero'],
    solutionLevers: [
      'Hotel services',
      'Concierge',
      'Health & wellbeing program',
      'Room extras',
      'Coffee shop',
      '24/7 retail',
      'Room service',
      'Loyalty program',
      'Smart rooms',
      'Smart cleaning',
    ],
    catalogueHints: ['Accommodation + cleaning + retail convergence.'],
  },
  {
    id: 'socialization',
    title: 'Socialization',
    shortLabel: 'Socialization',
    description:
      'I seek human contact — with colleagues on site and with family / friends when I am away — to counter isolation.',
    predominantProfiles: [
      'Pro-active achiever (family/friends)',
      'Optimizer (colleagues + family/friends)',
      'Family hero (family/friends)',
      'Social experiencer (colleagues + family/friends)',
      'Remote lifestyler (colleagues + family/friends)',
    ],
    solutionLevers: [
      'Social Hub',
      'Health & wellbeing program',
      'Space restyling',
      'Online calendar of events',
      'Social activities',
      'Healthy food outlet',
      'Café / snack outlet',
      'Coffee shop',
      'Cavern',
      'Theme nights',
      'Loyalty program (membership)',
      'Space design for socializing',
    ],
    catalogueHints: ['Strong fit with “food & beverage” and community retail moments.'],
  },
  {
    id: 'variety-of-choices',
    title: 'Variety of choices',
    shortLabel: 'Variety of choices',
    description:
      'I want more choice (food, sport, leisure) so I can get what I want when I want it — and avoid monotony.',
    predominantProfiles: ['Pro-active achiever', 'Privacy seeker', 'Social experiencer'],
    solutionLevers: [
      'Online calendar of events',
      'Travel management',
      'Digital maintenance request',
      'Hotel services',
      'Health & wellbeing program',
      'Café / snack outlet',
      '24/7 retail outlet',
      'Theme nights',
      'Healthy food',
      'Loyalty program',
      'Smart rooms',
      'Smart cleaning',
    ],
    catalogueHints: ['Bundle retail + wellbeing + scheduling in journey “leisure”.'],
  },
  {
    id: 'ease-efficiency',
    title: 'Ease and efficiency',
    shortLabel: 'Ease & efficiency',
    description:
      'I have little free time — I need seamless services so I do not lose time on friction, queues, or broken digital journeys.',
    predominantProfiles: ['Pro-active achiever', 'Privacy seeker', 'Optimizer', 'Remote lifestyler'],
    solutionLevers: [
      'Online check-in / check-out',
      'Digital maintenance request',
      'Concierge',
      'Hotel services',
      'Room booking',
      '24/7 retail outlet',
      'Rewards program',
      'Smart rooms',
      'Space design for privacy',
      'Smart cleaning',
      'Expense management',
    ],
    catalogueHints: ['Align with IFM “Systems & Governance” + digital guest journey.'],
  },
];

export function erUserNeedById(id: string): ErUserNeed | undefined {
  return ER_USER_NEEDS.find((n) => n.id === id);
}
