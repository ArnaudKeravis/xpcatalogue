import type { ErBoKPersona } from './types';

export const ER_BOK_PERSONAS: ErBoKPersona[] = [
  {
    id: 'remote-lifestyler',
    profileKey: 'REMOTE LIFESTYLER',
    name: 'Raul',
    role: 'Deck foreman',
    age: 48,
    gender: 'Male',
    relationship: 'Married with grown children',
    kids: 'Grown children',
    experience: '20 years on remote sites',
    quote: "I've been on remote sites for years and know how things work there",
    generalDescription:
      'Raul has worked in the industry for a long time across various remote sites and continuously looks to improve his skills, including through online courses. He is focused on work and does not seek entertainment on site. He expects efficient services on demand. He enjoys colleagues in moderation as long as it does not hurt his performance.',
    emotionalProfile: [
      'Pay close attention to professional opportunities',
      'Want to provide their family with a good financial situation',
      'Willing to learn and improve knowledge and skills',
      'Very committed to the site',
    ],
    keyNeeds: ['Ease and efficiency', 'Healthy food options', 'Socialization (colleagues and family / friends)'],
    painPoints: [
      'Services on site are not seamless (waiting for the bus, in line at the cafeteria…)',
      'No real follow-up before and after rotation',
      'Lack of healthy food; quality inconsistent',
      'Perception of downgraded quality of services on site',
      'Not much to do except go to the bar for socializing',
    ],
    howWeAddress: [
      'Healthy food meals, 24/7 retail',
      'Rewards program, shared services',
      'End-to-end guest / resident experience',
      'Recognition program',
      'Smart rooms, smart laundry, smart maintenance, smart cleaning',
      'Expense management',
    ],
    moduleClusters: [
      'Smart facilities (online check-in/out, Social Hub, H&W program, digital maintenance, travel management, contactless payment and ID)',
      'Multi-choice retailing',
    ],
    whoTheyAre:
      'Mostly male, middle-aged (~half over 45). Mainly married or living with a partner, mainly with children. Veterans with several years on site or skilled juniors.',
  },
  {
    id: 'optimizer',
    profileKey: 'OPTIMIZER',
    name: 'Olivia',
    role: 'Crane operator',
    age: 33,
    gender: 'Female',
    relationship: 'Single',
    kids: '—',
    experience: '1.5 years in the industry',
    quote: 'I want to progress and perform well in my career without sacrificing my personal life',
    generalDescription:
      'Olivia takes her work seriously and uses productivity apps to stay efficient. She is not willing to sacrifice personal life and expects a real work/life balance. She enjoys coworkers but tries to separate professional and personal circles clearly.',
    emotionalProfile: [
      'Career progress is very important',
      'Want to provide family with a good financial situation',
      'Willing to learn and improve',
      'Want to earn a better living',
    ],
    keyNeeds: ['Ease and efficiency', 'Privacy', 'Socialization (colleagues and family / friends)'],
    painPoints: [
      'Hard to separate pro and personal circles on a remote site',
      'Services on site are not seamless',
      'Not much to do except go to the bar for socializing',
    ],
    howWeAddress: [
      '24/7 retail, café/snack, coffee shop, room service',
      'Rewards program, shared services',
      'End-to-end guest / resident experience',
      'Loyalty program',
      'Smart rooms, smart laundry, smart maintenance, smart cleaning',
      'Expense management',
    ],
    moduleClusters: [
      'Smart facilities (check-in/out, Social Hub, digital maintenance, travel management, contactless payment and ID, Concierge)',
      'Multi-choice retailing',
    ],
    whoTheyAre:
      'Mainly male but more than a quarter women. Millennials — almost half under 36. Majority in couple but more than a third singles; mainly with child. Mostly skilled juniors.',
  },
  {
    id: 'proactive-achiever',
    profileKey: 'PRO-ACTIVE ACHIEVER',
    name: 'Pei',
    role: 'Project engineer',
    age: 36,
    gender: 'Female',
    relationship: 'Living with a partner',
    kids: 'No child',
    experience: '4 years in the industry',
    quote: 'I have plans and am willing to work hard to achieve them',
    generalDescription:
      'Pei is proactive and works hard to fund a long-standing personal project with her partner. Outside work she invests in herself — sport and healthy eating — using apps and wearables to track activity.',
    emotionalProfile: [
      'Want to fund projects they have',
      'Take care of health and practice sport',
      'Very hedonistic',
      'Want to provide family with a comfortable life',
    ],
    keyNeeds: [
      'Health and wellbeing',
      'Variety of choices',
      'Privacy',
      'Ease and efficiency',
      'Socialization (with family / friends)',
    ],
    painPoints: [
      'Hard to separate pro and personal circles on a remote site',
      'Services on site are not seamless',
      'Not much to do except go to the bar for socializing',
    ],
    howWeAddress: [
      'Healthy food outlet, café/snack outlet',
      'Rewards program, shared services',
      'End-to-end guest / resident experience',
      'Loyalty program',
      'Smart rooms, space design',
      'Expense management',
    ],
    moduleClusters: [
      'Smart facilities (H&W program, digital maintenance, travel management, space re-styling)',
      'Multi-choice retailing',
    ],
    whoTheyAre:
      'Profile with the most women (~⅓). Half aged 36–45. More than half with middle experience on the current site.',
  },
  {
    id: 'family-hero',
    profileKey: 'FAMILY HERO',
    name: 'Frank',
    role: 'Chief electrician',
    age: 43,
    gender: 'Male',
    relationship: 'Married with children',
    experience: '13 years in the industry',
    quote: 'My family means everything to me',
    generalDescription:
      'Frank values work rhythms that give long stretches at home. On site he stays in touch constantly — WhatsApp with his partner, Facetime with kids before bed. They motivate him to provide a comfortable lifestyle. He wants clear separation of pro and personal circles; work/life balance matters to protect time with loved ones.',
    emotionalProfile: [
      'Want to earn a better living for family comfort',
      'Essential to stay connected with family and friends',
      'Family is the most important thing in life',
      'Many years in the industry',
    ],
    keyNeeds: ['Comfort', 'Socialization (with family / friends)', 'Privacy'],
    painPoints: [
      'Misses home and family',
      'Poor connectivity — often pays out of pocket to stay in touch',
      'Lack of comfortable spaces to isolate for family calls',
    ],
    howWeAddress: [
      'Healthy food meals, healthy food outlets, 24/7 retail',
      'Rewards program, shared services',
      'End-to-end guest / resident experience',
      'Loyalty program',
      'Smart rooms, space design for privacy, smart cleaning',
      'Expense management',
    ],
    moduleClusters: [
      'Smart facilities (H&W program, travel management, hotel services, Concierge, rotation calendar)',
      'Multi-choice retailing',
    ],
    whoTheyAre:
      'Majority married or living with partner. Mostly male, mainly over 36. More than a quarter highly skilled; many with 11+ years experience; more than half veterans on current site.',
  },
  {
    id: 'social-experiencer',
    profileKey: 'SOCIAL EXPERIENCER',
    name: 'Sam',
    role: 'Driller',
    age: 27,
    gender: 'Male',
    relationship: 'Single',
    kids: 'Mostly without kids',
    experience: 'Less than a year in the industry',
    quote: 'I love spending time with my mates at work, we have so much fun together',
    generalDescription:
      'Sam is new to the industry and loves it — long holidays and strong wages. On site he lives for the bar with coworkers; community matters and he does not worry about separating professional and personal life. Social media keeps him in the loop.',
    emotionalProfile: [
      'Love socializing with colleagues',
      'Seek good money to enjoy life',
      'Do not separate pro and personal circles much',
      'Want fun and good times',
    ],
    keyNeeds: ['Socialization (with colleagues)', 'Variety of choices'],
    painPoints: [
      'When the bar closes there is nowhere else to socialize',
      'Not enough outdoor activities',
      'Wants more organised social activities',
    ],
    howWeAddress: [
      'Coffee shop',
      'Rewards program, shared services',
      'Space design for socializing',
      'End-to-end guest / resident experience',
    ],
    moduleClusters: [
      'Smart facilities (Social Hub, online calendar of events, social activities)',
      'Multi-choice retailing',
    ],
    whoTheyAre:
      'Mostly blue collar. More than half newcomers on site (<1 year). Majority single, mostly male; more than a quarter under 25.',
  },
  {
    id: 'privacy-seeker',
    profileKey: 'PRIVACY SEEKER',
    name: 'Paul',
    role: 'Pipefitter',
    age: 40,
    gender: 'Male',
    relationship: 'Divorced with child',
    kids: 'With child',
    experience: '7 years in the industry',
    quote: 'Well, one needs a job to get the bills paid…',
    generalDescription:
      'Remote life is not easy for Paul but it pays better than alternatives. He is private, not the most talkative, yet highly committed. After hours he wants to be alone in his room.',
    emotionalProfile: [
      'Do it for the money',
      'High commitment to the site',
      'Very recluse',
      'Like having time alone on site',
    ],
    keyNeeds: ['Privacy', 'Comfort', 'Variety of choices', 'Ease and efficiency'],
    painPoints: [
      'Wants more space to be alone',
      'Hard to be confined with so many people for long periods',
      'Misses home and its comfort',
    ],
    howWeAddress: [
      '24/7 retail, click & collect',
      'Rewards program, shared services',
      'End-to-end guest / resident experience',
      'Smart rooms, space design for privacy, smart cleaning',
    ],
    moduleClusters: [
      'Smart facilities (hotel services, room booking, rotation calendar, digital maintenance, online check-in/out)',
      'Multi-choice retailing',
    ],
    whoTheyAre:
      'Mostly blue collar. Almost a third with 6–10 years experience. Mainly with child; mostly male but almost a quarter women; mostly 36–45.',
  },
];

export function erBoKPersonaById(id: string): ErBoKPersona | undefined {
  return ER_BOK_PERSONAS.find((p) => p.id === id);
}
