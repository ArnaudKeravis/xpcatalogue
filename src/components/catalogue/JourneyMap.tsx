'use client';

import Link from 'next/link';
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
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

const journeyImgClass = (src: string) =>
  src.endsWith('.svg')
    ? 'h-full w-full object-contain object-center bg-[#E8EEFB]'
    : 'h-full w-full object-cover object-center';

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
 * Journey canvas with three layered motion systems, each doing one job well:
 *
 * 1. **Ken Burns** on the image layer — a slow, imperceptible zoom+drift that
 *    keeps the isometric feeling alive instead of a flat still. ~2% scale
 *    over 20s, looping. Never crosses the threshold of distraction.
 *
 * 2. **Cursor parallax** on two depth planes — image drifts ~0.6% with the
 *    cursor, hotspots drift ~1.4%. The differential creates an isometric 3D
 *    feel without any real 3D transforms, and never fights the click target.
 *
 * 3. **Route reveal + travelling dot** on the SVG overlay — a dashed path
 *    connects the hotspots in journey order, drawing itself on mount, with a
 *    small glow dot travelling along it afterwards. This makes the *sequence*
 *    of moments (morning → evening) legible at a glance.
 *
 * Plus the pre-existing one-time pulse ring on each hotspot, which stays as
 * the "discoverability cue" — it fires once after the route has revealed.
 *
 * All motion honors `prefers-reduced-motion` and degrades gracefully.
 */
export function JourneyMap({
  steps,
  area,
  persona,
  journeyMapImage,
  journeyHotspots,
}: Props) {
  const reduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLDivElement>(null);

  const hotspotFor = (stepId: string) => journeyHotspots?.find((h) => h.stepId === stepId);
  const hasHotspots = Boolean(journeyHotspots?.length);

  /** % vertical offset on map pins: middle → high → low → middle → high → middle (rhythm lives on the journey canvas, not the strip). */
  const MAP_PIN_WAVE_TOP_PCT = [0, -2.8, 3.6, 0, -2.8, 0] as const;
  const pinWaveTopPct = (i: number) => MAP_PIN_WAVE_TOP_PCT[i % MAP_PIN_WAVE_TOP_PCT.length];

  const pinPercentCoords = (step: JourneyStep, index: number) => {
    const box = hotspotFor(step.id);
    const wave = pinWaveTopPct(index);
    if (box) {
      const left = box.left + (box.w ?? 0) / 2;
      const baseTop = Math.max(box.top - 6, 4);
      const top = Math.min(Math.max(baseTop + wave, 2), 96);
      return { left, top };
    }
    const n = Math.max(steps.length - 1, 1);
    const left = 8 + (84 / n) * index;
    const top = Math.min(Math.max(88 + wave, 6), 95);
    return { left, top };
  };

  // ── Cursor parallax: two depth planes ──────────────────────────────────
  // Raw mouse offsets from the canvas center, mapped to a small drift range.
  // Springs smooth the motion so the image feels dampened rather than twitchy.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 90, damping: 20, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 90, damping: 20, mass: 0.6 });

  // Image drifts a little; hotspots drift a bit more. Values are in % of the
  // canvas (so they scale with container size) and stay subtle enough to
  // never obstruct reading a moment label.
  const imgX = useTransform(smx, (v) => `${v * 0.6}%`);
  const imgY = useTransform(smy, (v) => `${v * 0.4}%`);
  const pinsX = useTransform(smx, (v) => `${v * 1.4}%`);
  const pinsY = useTransform(smy, (v) => `${v * 1.0}%`);

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    // Normalise to [-1, 1] from center, then scale to % drift units.
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mx.set(nx);
    my.set(ny);
  };

  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  // ── One-time pulse ring after initial reveal ──────────────────────────
  // Starts after the connecting path has mostly drawn, so the pulse feels like
  // a follow-up "here are the stops" accent rather than arriving alongside it.
  const [pulsing, setPulsing] = useState(false);
  useEffect(() => {
    if (reduceMotion) return;
    const onTimer = window.setTimeout(() => setPulsing(true), 900);
    const offTimer = window.setTimeout(() => setPulsing(false), 900 + 3200);
    return () => {
      window.clearTimeout(onTimer);
      window.clearTimeout(offTimer);
    };
  }, [reduceMotion]);

  // ── Build the ordered route through hotspots ──────────────────────────
  // We need pixel-percentage points for the SVG path. Hotspots are positioned
  // by their top-left corner and width/height — compute the center for the
  // route so the line threads through the middle of each scene pin.
  const routePoints = steps
    .map((step, i) => {
      const box = hotspotFor(step.id);
      if (!box) return null;
      const { left, top } = pinPercentCoords(step, i);
      return { id: step.id, x: left, y: top };
    })
    .filter((p): p is { id: string; x: number; y: number } => p !== null);

  // Smooth cubic-Bezier path through the route points. Each segment's control
  // points are offset along the direction of travel so the curve eases
  // naturally into the next moment instead of elbowing sharply.
  const routePathD = buildSmoothPath(routePoints.map((p) => [p.x, p.y]));

  return (
    <div className="space-y-0" data-area={area} data-persona={persona}>
      <div
        className={cn(
          'relative overflow-hidden rounded-brand-xl border border-white/80 shadow-[var(--shadow-soft)]',
        )}
        style={{
          backgroundColor: '#E8EEFB',
          backgroundImage: `
            radial-gradient(ellipse 140% 80% at 20% 30%, rgba(255,255,255,0.45) 0%, transparent 55%),
            radial-gradient(ellipse 100% 60% at 80% 70%, rgba(213,223,245,0.6) 0%, transparent 50%)
          `,
        }}
      >
        <div
          ref={canvasRef}
          className="relative w-full"
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          <div className="relative aspect-[16/10] w-full md:aspect-[1920/1080]">
            {/* ── Layer 1: Image with Ken Burns + parallax drift ───────── */}
            {journeyMapImage ? (
              <motion.div
                className="absolute inset-0"
                style={{ x: imgX, y: imgY }}
              >
                <motion.img
                  src={journeyMapImage}
                  alt="Isometric journey map — moments across the day"
                  className={journeyImgClass(journeyMapImage)}
                  loading="eager"
                  decoding="async"
                  initial={reduceMotion ? false : { scale: 1.04, opacity: 0 }}
                  animate={
                    reduceMotion
                      ? { opacity: 1 }
                      : { scale: [1.04, 1.01, 1.035, 1.01], opacity: 1 }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0.4 }
                      : {
                          opacity: { duration: 0.6, ease: 'easeOut' },
                          scale: {
                            duration: 22,
                            ease: 'easeInOut',
                            repeat: Infinity,
                            repeatType: 'mirror',
                          },
                        }
                  }
                  style={{ transformOrigin: '50% 45%' }}
                />
              </motion.div>
            ) : null}

            {/* ── Layer 2: Route overlay (SVG, drawn on mount) ─────────── */}
            {routePathD ? (
              <svg
                className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden
              >
                {/* Soft outer glow on the route — sits behind the main stroke */}
                <motion.path
                  d={routePathD}
                  fill="none"
                  stroke="var(--blue-primary)"
                  strokeOpacity="0.25"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 1.4, ease: 'easeInOut' }}
                  style={{ filter: 'blur(2px)' }}
                />
                {/* Main dashed stroke — the route line itself */}
                <motion.path
                  d={routePathD}
                  fill="none"
                  stroke="var(--blue-primary)"
                  strokeOpacity="0.9"
                  strokeWidth="0.5"
                  strokeDasharray="1.2 1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 1.4, ease: 'easeInOut' }}
                />
                {/* Route endpoint markers — small dots at the start and end
                    of the journey make the sequence legible once the path
                    has drawn. Start = teal (day begins), end = blue (day
                    ends). These appear *after* the path completes. */}
                {routePoints.length >= 2 ? (
                  <>
                    <motion.circle
                      cx={routePoints[0].x}
                      cy={routePoints[0].y}
                      r="0.8"
                      fill="var(--teal)"
                      vectorEffect="non-scaling-stroke"
                      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: reduceMotion ? 0 : 1.2, duration: 0.4 }}
                      style={{ filter: 'drop-shadow(0 0 2px var(--teal))' }}
                    />
                    <motion.circle
                      cx={routePoints[routePoints.length - 1].x}
                      cy={routePoints[routePoints.length - 1].y}
                      r="0.8"
                      fill="var(--blue-primary)"
                      vectorEffect="non-scaling-stroke"
                      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: reduceMotion ? 0 : 1.35, duration: 0.4 }}
                      style={{ filter: 'drop-shadow(0 0 2px var(--blue-primary))' }}
                    />
                  </>
                ) : null}
              </svg>
            ) : null}

            {/* ── Layer 3: Hotspot pins (parallax deeper) ──────────────── */}
            <motion.nav
              className="absolute inset-0 z-[2]"
              aria-label="Journey moments"
              style={{ x: pinsX, y: pinsY }}
            >
              {steps.map((step, i) => {
                const { left, top } = pinPercentCoords(step, i);
                const Icon = STEP_ICONS[step.id] ?? Car;

                return (
                  <motion.div
                    key={step.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${left}%`, top: `${top}%` }}
                    initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.34,
                      ease: [0.23, 1, 0.32, 1],
                      // Stagger the pins AFTER the route has mostly drawn, so
                      // each moment appears at the end of its route segment.
                      delay: reduceMotion ? 0 : 0.7 + i * 0.12,
                    }}
                  >
                    {/* One-time pulse ring — fires after pins have appeared. */}
                    {pulsing ? (
                      <span
                        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{
                          background: 'var(--blue-primary)',
                          animation: `hotspot-pulse 1.6s var(--ease-out-quint) ${0.1 + i * 0.08}s 2`,
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
                        'transition-[transform,box-shadow,background-color] duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)]',
                        'hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_22px_rgba(0,26,114,0.25)] hover:ring-2 hover:ring-[var(--blue-primary)]',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]',
                        'sm:text-xs md:text-sm md:px-4 md:py-2',
                      )}
                    >
                      <span
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold text-white md:h-5 md:w-5 md:text-[10px]"
                        style={{ background: 'var(--blue)' }}
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <Icon
                        className="h-3.5 w-3.5 shrink-0 text-[var(--blue)] md:h-4 md:w-4"
                        weight="duotone"
                        aria-hidden
                      />
                      <span className="whitespace-nowrap">{step.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>

            {/* Legend (bottom-left) — physical/digital dots */}
            <div className="absolute bottom-3 left-3 z-[3] hidden items-center gap-3 rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold text-[var(--blue)] shadow-sm backdrop-blur-sm md:flex">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue)]" /> Physical
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal)]" /> Digital
              </span>
              <span className="mx-1 h-3 w-px bg-[var(--grey-border)]" aria-hidden />
              <span className="flex items-center gap-1.5" aria-label="Journey route">
                <span className="h-px w-4 bg-[var(--blue-primary)]" />
                Route
              </span>
            </div>
          </div>
        </div>

        {/* Mobile secondary list — ensures moments are reachable on small
            screens where overlapping pills can be tight. */}
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
            <span className="shrink-0 self-center text-[10px] text-gray-400">(tap a moment)</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── Smooth path helper ──────────────────────────────────────────────────
// Builds a Catmull-Rom spline approximated as cubic Beziers through the given
// points. Produces a "hand-drawn" feel that curves naturally between moments
// rather than zig-zagging with straight lines. Returns `null` for <2 points.
function buildSmoothPath(points: [number, number][]): string | null {
  if (points.length < 2) return null;

  const [first, ...rest] = points;
  let d = `M ${first[0]} ${first[1]}`;

  // Tension controls how tight the curve hugs each point. 0.5 is standard
  // Catmull-Rom; lower values (0.35) make the route feel a touch more
  // relaxed and less whiplash-y through tight moment clusters.
  const tension = 0.35;

  for (let i = 0; i < rest.length; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1[0] + ((p2[0] - p0[0]) * tension) / 2;
    const cp1y = p1[1] + ((p2[1] - p0[1]) * tension) / 2;
    const cp2x = p2[0] - ((p3[0] - p1[0]) * tension) / 2;
    const cp2y = p2[1] - ((p3[1] - p1[1]) * tension) / 2;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
  }

  return d;
}
