import type { ErJourneyPhase } from './types';

/**
 * Generic home-to-home journey (BoK p.40) — same phase names for all profiles;
 * heatmaps in the PDF show which pains matter most per profile.
 */
export const ER_HOME_TO_HOME_JOURNEY: ErJourneyPhase[] = [
  {
    id: 'departure',
    title: 'Departure from home',
    steps: ['Notification to work on site', 'Transit'],
    painThemes: [
      'Socialization with close ones not facilitated (connectivity in rooms)',
      'Lack of support to prepare the stay',
      'Ease & efficiency gaps before arrival',
    ],
  },
  {
    id: 'arrival',
    title: 'Arrival on site',
    steps: ['Check-in', 'Briefing and settle-in'],
    painThemes: [
      'Check-in not seamless or quick',
      'Do not feel welcome; weak “real” front desk',
      'Briefing quality varies',
      'Bedding / room quality issues; feeling lost after arrival',
    ],
  },
  {
    id: 'prepare-work',
    title: 'Prepare and go to work',
    steps: [
      'Wake-up',
      'Breakfast at buffet and prepare lunch box',
      'Purchase snacks at retail store',
      'Commuting',
    ],
    painThemes: [
      'Tiredness; time pressure',
      'Coffee / breakfast quality',
      'Retail opening hours too restricted',
      'Waiting time; no phones where policies restrict',
      'Lunchbox cooling / prep facilities limited',
      'Unclean shared kitchens or bathrooms',
    ],
  },
  {
    id: 'work',
    title: 'Work',
    steps: ['Place lunch in the kitchen room to eat it later'],
    painThemes: ['Air conditioning on buses', 'Waiting time on logistics'],
  },
  {
    id: 'back-to-site',
    title: 'Back to site',
    steps: ['Commuting', 'Shower and change'],
    painThemes: [
      'Room cleanliness, size, amenities',
      'Night-shifters’ sleep issues',
      'Bus delays and poor communication on travel changes',
    ],
  },
  {
    id: 'leisure',
    title: 'Leisure / free time',
    steps: [
      'Free time in my room',
      'Socialize with others',
      'Sport activities',
      'Catch up on chores',
      'Go to the restaurant',
    ],
    painThemes: [
      'Lack of free connection and TVs in rooms',
      'Lack of activities',
      'Small or crowded gym; class quality varies',
      'Laundry quality issues',
      'Restaurant closes too early; inconsistent food quality and variety',
    ],
  },
  {
    id: 'bed',
    title: 'Bed time',
    steps: ['Go to sleep'],
    painThemes: ['Sleep disrupted by shifts, noise, or room conditions'],
  },
  {
    id: 'service-request',
    title: 'Complaint / service request',
    steps: [
      'Contact Sodexo for complaint or service request',
      'Information about request / complaint status',
    ],
    painThemes: [
      'Must use front desk instead of simple digital form',
      'Portal hard to use',
      'Slow response; status not trackable',
      'Requests take too long to fulfil',
    ],
  },
  {
    id: 'back-home',
    title: 'Back home',
    steps: ['Notification', 'Check-out', 'Transit', 'Arrive home'],
    painThemes: [
      'Lack of administrative / financial support and follow-up once back home',
      'Travel disruption communication',
    ],
  },
];
