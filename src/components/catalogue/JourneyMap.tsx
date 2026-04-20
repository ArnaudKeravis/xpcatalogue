'use client';

import Link from 'next/link';
import { useEffect, useState, type ComponentType } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
  type IconWeight,
} from '@phosphor-icons/react';
import type { JourneyHotspot, JourneyStep } from '@/lib/data/types';
import { cn } from '@/lib/utils/cn';

type StepIconCmp = ComponentType<{ className?: string; weight?: IconWeight }>;

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
}

function StepIcon({ stepId, className }: { stepId: string; className?: string }) {
  const Cmp = STEP_ICONS[stepId] ?? Car;
  return <Cmp className={className} weight="duotone" aria-hidden />;
}

function momentHref(area: string, persona: string, stepId: string) {
  return `/${area}/${persona}/moment/${stepId}`;
}

/**
 * Renders an isometric journey image with moment labels overlaid at each
 * hotspot position. No separate chip strip — moments live directly on the
 * map so the flow reads as a single, continuous journey.
 *
 * When `journeyHotspots` are missing we fall back to an evenly-spaced band
 * of pills along the bottom edge so the page still guides the user.
 */
export function JourneyMap({
  steps,
  area,
  persona,
  journeyMapImage,
  journeyHotspots,
}: Props) {
  const reduceMotion = useReducedMotion();
  const hotspotFor = (stepId: string) => journeyHotspots?.find((h) => h.stepId === stepId);
  const hasHotspots = Boolean(journeyHotspots?.length);

  // One-time discoverability cue: pills gently pulse for ~3s after first paint,
  // then settle. Skipped entirely if the user prefers reduced motion.
  const [pulsing, setPulsing] = useState(!reduceMotion);
  useEffect(() => {
    if (reduceMotion) return;
    const t = window.setTimeout(() => setPulsing(false), 3200);
    return () => window.clearTimeout(t);
  }, [reduceMotion]);

  return (
    <div className="space-y-0" data-area={area} data-persona={persona}>
      <div
        className={cn(
          'relative overflow-hidden rounded-[25px] border border-white/80 shadow-[var(--shadow-soft)]'
        )}
        style={{
          backgroundColor: '#E8EEFB',
          backgroundImage: `
            radial-gradient(ellipse 140% 80% at 20% 30%, rgba(255,255,255,0.45) 0%, transparent 55%),
            radial-gradient(ellipse 100% 60% at 80% 70%, rgba(213,223,245,0.6) 0%, transparent 50%)
          `,
        }}
      >
        {/* Journey canvas — image first, moments layered on top */}
        <div className="relative w-full">
          <div className="relative aspect-[16/10] w-full md:aspect-[1920/1080]">
            {journeyMapImage ? (
              <img
                src={journeyMapImage}
                alt="Isometric journey map — moments across the day"
                className="absolute inset-0 h-full w-full object-cover object-center"
                loading="eager"
                decoding="async"
              />
            ) : null}

            {/* Moment labels — positioned on hotspots, always visible, clickable.
                Cascade entry on mount + one-time 3s pulse ring for discoverability. */}
            <nav className="absolute inset-0" aria-label="Journey moments">
              {steps.map((step, i) => {
                const box = hotspotFor(step.id);
                // Fallback: distribute evenly along the bottom when no hotspots are known yet.
                const left = box
                  ? box.left + (box.w ?? 0) / 2
                  : 8 + (84 / Math.max(steps.length - 1, 1)) * i;
                const top = box ? Math.max(box.top - 6, 4) : 88;
                const Icon = STEP_ICONS[step.id] ?? Car;

                return (
                  <motion.div
                    key={step.id}
                    className="absolute z-[2] -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${left}%`, top: `${top}%` }}
                    initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.32,
                      ease: [0.23, 1, 0.32, 1],
                      delay: reduceMotion ? 0 : 0.15 + i * 0.08,
                    }}
                  >
                    {/* One-time pulse ring — fades out after first attention window. */}
                    {pulsing ? (
                      <span
                        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{
                          background: 'var(--blue-primary)',
                          animation: `hotspot-pulse 1.6s var(--ease-out-quint) ${0.4 + i * 0.08}s 2`,
                          opacity: 0,
                        }}
                        aria-hidden
                      />
                    ) : null}
                    <Link
                      href={momentHref(area, persona, step.id)}
                      aria-label={`${step.label} — open moment`}
                      className={cn(
                        'group relative inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold',
                        'text-[#001a72] shadow-[0_4px_14px_rgba(0,26,114,0.18)] ring-1 ring-black/5',
                        'transition-all duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)]',
                        'hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_22px_rgba(0,26,114,0.25)] hover:ring-2 hover:ring-[var(--blue-primary)]',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]',
                        'sm:text-xs md:text-sm md:px-4 md:py-2'
                      )}
                    >
                      <span
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold text-white md:h-5 md:w-5 md:text-[10px]"
                        style={{ background: 'var(--blue)' }}
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--blue)] md:h-4 md:w-4" weight="duotone" aria-hidden />
                      <span className="whitespace-nowrap">{step.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Legend (bottom-left) — physical/digital dots */}
            <div className="absolute bottom-3 left-3 z-[2] hidden items-center gap-3 rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold text-[var(--blue)] shadow-sm backdrop-blur-sm md:flex">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue)]" /> Physical
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal)]" /> Digital
              </span>
            </div>
          </div>
        </div>

        {/* Mobile secondary list — ensures moments are still reachable on small screens where overlapping pills can be tight */}
        <div className="flex gap-2 overflow-x-auto border-t border-white/40 bg-white/60 px-3 py-2 backdrop-blur-sm md:hidden">
          {steps.map((step, i) => (
            <Link
              key={step.id}
              href={momentHref(area, persona, step.id)}
              className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#001a72] shadow-sm"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-extrabold text-white"
                style={{ background: 'var(--blue)' }}
                aria-hidden
              >
                {i + 1}
              </span>
              <StepIcon stepId={step.id} className="h-3.5 w-3.5 shrink-0 text-[var(--blue)]" />
              <span className="whitespace-nowrap">{step.label}</span>
            </Link>
          ))}
          {!hasHotspots ? (
            <span className="shrink-0 self-center text-[10px] text-gray-400">
              (tap a moment)
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
