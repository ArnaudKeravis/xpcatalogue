/**
 * Visual + editorial layer for the TDDI Standard Offer immersive page.
 * Images are existing catalogue illustration assets — no remote fetch.
 */

export interface ChapterPresentation {
  /** Short nav label shown in lateral rail */
  navLabel: string;
  /** One-line vibe under chapter title */
  kicker: string;
  /** Large hero illustration for the chapter opener */
  heroImage: string;
  /** Pool to rotate through for individual moments */
  momentPool: string[];
}

const brandMark = '/images/catalogue/assets/brand/xp-catalogue-mark.svg';

export const TDDI_DECK_CHAPTER_VISUALS: Record<string, ChapterPresentation> = {
  cover: {
    navLabel: 'Opening',
    kicker: 'Why Spark exists — and how this story flows.',
    heroImage: brandMark,
    momentPool: [brandMark, '/images/catalogue/assets/journeys/moments/learn-student-2.svg'],
  },
  introduction: {
    navLabel: 'Momentum',
    kicker: 'Context, ambition, IQ · XP · OS in one orbit.',
    heroImage: '/images/catalogue/assets/journeys/moments/learn-student-3.svg',
    momentPool: [
      '/images/catalogue/assets/journeys/moments/learn-student-1.svg',
      '/images/catalogue/assets/journeys/moments/play-event-participant-2.svg',
      '/images/catalogue/assets/journeys/moments/heal-patient-2.svg',
    ],
  },
  'food-services': {
    navLabel: 'Food',
    kicker: 'Strategy-linked food services portfolio.',
    heroImage: '/images/catalogue/assets/journeys/moments/learn-teacher-2.svg',
    momentPool: [
      '/images/catalogue/assets/journeys/moments/learn-schoolchild-2.svg',
      '/images/catalogue/assets/journeys/moments/heal-patient-3.svg',
    ],
  },
  'food-solutions': {
    navLabel: 'Food depth',
    kicker: 'Insight, kitchens, journeys that scale.',
    heroImage: '/images/catalogue/assets/journeys/moments/play-football-fan-2.svg',
    momentPool: [
      '/images/catalogue/assets/journeys/moments/play-vip-guest-airport-2.svg',
      '/images/catalogue/assets/journeys/moments/learn-student-4.svg',
      '/images/catalogue/assets/journeys/moments/heal-nurse-2.svg',
    ],
  },
  hospitality: {
    navLabel: 'Hospitality',
    kicker: 'Places where teams and guests flourish.',
    heroImage: '/images/catalogue/assets/journeys/moments/play-event-participant-4.svg',
    momentPool: [
      '/images/catalogue/assets/journeys/moments/play-cultural-destination-visitor-2.svg',
      '/images/catalogue/assets/journeys/moments/work-army-officer-2.svg',
    ],
  },
  workplace: {
    navLabel: 'Workplace & FM',
    kicker: 'Command, floors, telemetry, resolution.',
    heroImage: '/images/catalogue/assets/journeys/moments/work-army-officer-3.svg',
    momentPool: [
      '/images/catalogue/assets/journeys/moments/work-army-officer-4.svg',
      '/images/catalogue/assets/journeys/moments/play-event-participant-6.svg',
    ],
  },
  foundations: {
    navLabel: 'Foundations',
    kicker: 'Data, platforms, talent at scale.',
    heroImage: '/images/catalogue/assets/journeys/moments/learn-teacher-4.svg',
    momentPool: [
      '/images/catalogue/assets/journeys/moments/learn-teacher-1.svg',
      '/images/catalogue/assets/journeys/moments/work-army-officer-5.svg',
    ],
  },
  beyond: {
    navLabel: 'Innovation',
    kicker: 'Co-design and the innovation ecosystem.',
    heroImage: '/images/catalogue/assets/journeys/moments/play-vip-guest-stadium-2.svg',
    momentPool: [
      '/images/catalogue/assets/journeys/moments/play-event-participant-8.svg',
      '/images/catalogue/assets/journeys/moments/heal-patient-1.svg',
    ],
  },
};

export function pickMomentImage(chapterId: string, index: number): string {
  const meta = TDDI_DECK_CHAPTER_VISUALS[chapterId];
  if (!meta || meta.momentPool.length === 0) return brandMark;
  return meta.momentPool[index % meta.momentPool.length]!;
}
