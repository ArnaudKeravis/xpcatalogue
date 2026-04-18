'use client';

import Link from 'next/link';
import { type ComponentType } from 'react';
import {
  Car,
  Desktop,
  DoorOpen,
  ForkKnife,
  Heart,
  Knife,
  SoccerBall,
  Coffee,
  GraduationCap,
  Books,
  Stethoscope,
  Truck,
} from '@phosphor-icons/react';
import type { JourneyHotspot, JourneyStep } from '@/lib/data/types';
import { cn } from '@/lib/utils/cn';

type StepIconCmp = ComponentType<{ className?: string; weight?: string }>;

const STEP_ICONS: Record<string, StepIconCmp> = {
  commute: Car,
  'welcome-area': DoorOpen,
  workplace: Desktop,
  'wellbeing-break': Heart,
  'food-beverage-work': ForkKnife,
  'arrival-campus': Car,
  'morning-class': GraduationCap,
  'lunch-break': ForkKnife,
  'study-session': Books,
  'morning-rounds': Stethoscope,
  'meal-service': ForkKnife,
  'meal-distribution': Truck,
  'kitchen-prep': Knife,
  'pre-match': SoccerBall,
  'peak-service': ForkKnife,
  'half-time': Coffee,
  'full-time': SoccerBall,
  'networking-lunch': ForkKnife,
};

interface Props {
  steps: JourneyStep[];
  area: string;
  persona: string;
  journeyMapImage?: string;
  journeyHotspots?: JourneyHotspot[];
  /** Figma Labs — isometric journey frame (CSV “Personae journey”) */
  figmaJourneyUrl?: string;
}

function StepIcon({ stepId, className }: { stepId: string; className?: string }) {
  const Cmp = STEP_ICONS[stepId] ?? Car;
  return <Cmp className={className} weight="duotone" aria-hidden />;
}

function momentHref(area: string, persona: string, stepId: string) {
  return `/${area}/${persona}/moment/${stepId}`;
}

export function JourneyMap({
  steps,
  area,
  persona,
  journeyMapImage,
  journeyHotspots,
  figmaJourneyUrl,
}: Props) {
  const hotspotFor = (stepId: string) => journeyHotspots?.find((h) => h.stepId === stepId);

  const showHero = Boolean(journeyMapImage);
  const showHotspots = Boolean(journeyHotspots?.length);

  return (
    <div className="space-y-4" data-area={area} data-persona={persona}>
      <div
        className={cn(
          'overflow-hidden rounded-[25px] border border-white/80',
          'shadow-[var(--shadow-soft)]'
        )}
        style={{
          backgroundColor: '#E8EEFB',
          backgroundImage: `
            radial-gradient(ellipse 140% 80% at 20% 30%, rgba(255,255,255,0.45) 0%, transparent 55%),
            radial-gradient(ellipse 100% 60% at 80% 70%, rgba(213,223,245,0.6) 0%, transparent 50%)
          `,
        }}
        data-node-id="1667:44064"
      >
        {showHero ? (
          <div className="relative w-full">
            <div className="relative aspect-[16/10] w-full md:aspect-[1920/1080]">
              {/* Native img: reliable for local SVG + PNG; next/image can fail on some SVG layouts */}
              <img
                src={journeyMapImage!}
                alt="Isometric journey map — moments across the day"
                className="absolute inset-0 h-full w-full object-cover object-center"
                loading="eager"
                decoding="async"
              />
              {showHotspots ? (
                <div className="absolute inset-0" role="presentation">
                  {steps.map((step) => {
                    const box = hotspotFor(step.id);
                    if (!box) return null;
                    return (
                      <Link
                        key={step.id}
                        href={momentHref(area, persona, step.id)}
                        aria-label={`${step.label} — open moment`}
                        className={cn(
                          'group absolute flex items-start justify-center rounded-lg transition-[box-shadow,outline] duration-150',
                          'hover:shadow-[0_0_0_2px_rgba(41,56,150,0.35)]',
                          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]'
                        )}
                        style={{
                          left: `${box.left}%`,
                          top: `${box.top}%`,
                          width: `${box.w}%`,
                          height: `${box.h}%`,
                        }}
                      >
                        <span className="pointer-events-none mt-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold leading-tight text-[#001a72] opacity-0 shadow-sm transition-opacity group-hover:opacity-100 sm:text-[11px]">
                          {step.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <div
          className={cn(
            'flex flex-wrap justify-center gap-2 px-3 py-4 sm:gap-3 sm:px-5 sm:py-5',
            showHero && 'border-t border-white/40'
          )}
        >
          {steps.map((step) => (
            <Link
              key={step.id}
              href={momentHref(area, persona, step.id)}
              className={cn(
                'inline-flex min-h-[44px] items-center gap-2 rounded-[100px] border-2 border-transparent bg-white px-4 py-2 text-left shadow-[0_2px_10px_rgba(41,56,150,0.08)] transition-all',
                'font-bold text-[#001a72] hover:border-[var(--blue)] hover:ring-2 hover:ring-[var(--blue)]/25'
              )}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <StepIcon stepId={step.id} className="h-6 w-6 shrink-0 text-[var(--blue)]" />
              <span className="max-w-[220px] text-xs sm:text-sm">{step.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>
        Each moment opens a page with modules and links to solutions for that part of the journey.
        {figmaJourneyUrl ? (
          <>
            {' '}
            <a
              href={figmaJourneyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--blue-primary)] underline decoration-[var(--grey-border)] underline-offset-2 hover:decoration-[var(--blue)]"
            >
              Open journey map in Figma
            </a>
            <span className="text-gray-400"> (design source).</span>
          </>
        ) : null}
      </p>
    </div>
  );
}
