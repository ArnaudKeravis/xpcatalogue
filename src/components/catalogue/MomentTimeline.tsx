import Link from 'next/link';
import type { JourneyStep } from '@/lib/data/types';
import { resolveJourneyMomentImage } from '@/lib/data/journeyMomentVisuals';
import { JourneyStepIcon } from './JourneyStepIcon';

/** Vertical rhythm: middle → high → low → middle → high → middle (px `margin-top` from row baseline). */
const TIMELINE_WAVE_MT = [12, 0, 28, 12, 0, 12] as const;

interface Props {
  area: string;
  personaId: string;
  steps: JourneyStep[];
  accentColor: string;
  /**
   * Per-step hero for the strip — prefer first journey module’s `coverImage` from the parent.
   * When omitted, falls back to moment raster/SVG only (no persona face crop).
   */
  stepPreviewImages?: (string | undefined)[];
}

/**
 * Horizontal scroll strip of moments — a "table of contents" for a persona's day
 * that shows *before* the journey map. Fast visual scan → drill in.
 *
 * The parent (persona page) owns padding + the section heading, so this
 * component renders only the scrollable list to avoid duplicated chrome.
 */
export function MomentTimeline({ area, personaId, steps, accentColor, stepPreviewImages }: Props) {
  if (steps.length === 0) return null;

  return (
    <div aria-label="Day at a glance" className="relative">
      <ol
        className="flex snap-x snap-mandatory items-start gap-3 overflow-x-auto py-4 pb-3"
        style={{ scrollbarWidth: 'thin' }}
      >
        {steps.map((step, i) => {
          const href = `/${area}/${personaId}/moment/${step.id}`;
          const fromParent = stepPreviewImages?.[i];
          const heroSrc = fromParent ?? resolveJourneyMomentImage(personaId, step.id);
          const waveMt = TIMELINE_WAVE_MT[i % TIMELINE_WAVE_MT.length];
          return (
            <li
              key={step.id}
              className="relative shrink-0 snap-start"
              style={{ flexBasis: heroSrc ? '196px' : '180px', marginTop: waveMt }}
            >
              <Link
                href={href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-3 transition-all duration-[var(--motion-base)] ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-[var(--blue-primary)] hover:shadow-[var(--shadow-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
              >
                {heroSrc ? (
                  <div className="-mx-3 -mt-3 mb-2 overflow-hidden rounded-t-2xl border-b border-[var(--grey-border)] bg-[var(--surface)]">
                    <img
                      src={heroSrc}
                      alt=""
                      width={400}
                      height={160}
                      className="h-[4.5rem] w-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : null}
                <div className="mb-2 flex items-center justify-between gap-2">
                  <JourneyStepIcon step={step} accent={accentColor} size={32} />
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white"
                    style={{ background: accentColor }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3
                  className="text-sm font-extrabold leading-tight text-[var(--blue)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {step.label}
                </h3>
                {step.description ? (
                  <p
                    className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-[var(--blue)]/60"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {step.description}
                  </p>
                ) : null}
                <div className="mt-auto flex items-center justify-between pt-2 text-[10px]">
                  <span className="font-semibold text-[var(--blue)]/50">
                    {step.modules.length} module{step.modules.length === 1 ? '' : 's'}
                  </span>
                  <span className="font-bold text-[var(--blue-primary)] group-hover:underline">
                    Open →
                  </span>
                </div>
              </Link>

              {/* Connector line to next */}
              {i < steps.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute right-[-10px] top-[30%] hidden h-px w-[10px] md:block"
                  style={{ background: `${accentColor}55` }}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
