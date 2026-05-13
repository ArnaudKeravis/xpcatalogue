import Link from 'next/link';
import { momentHeroRasterFromExcel } from '@/lib/data/momentHeroRasterResolve';
import type { JourneyStep } from '@/lib/data/types';
import { JourneyStepIcon } from './JourneyStepIcon';

interface Props {
  area: string;
  personaId: string;
  steps: JourneyStep[];
  accentColor: string;
}

/**
 * Horizontal strip of moments above the journey map. Thumbnails come **only** from the
 * Personae Journey Excel sheet (**Image left moment** → `MOMENT_HERO_RASTER` via ingest).
 * If a row has no copied raster yet, shows gradient + `JourneyStepIcon` (no other image source).
 */
export function MomentTimeline({ area, personaId, steps, accentColor }: Props) {
  if (steps.length === 0) return null;

  return (
    <div aria-label="Day at a glance" className="relative">
      <ol
        className="flex snap-x snap-mandatory items-start gap-3 overflow-x-auto py-3 pb-3"
        style={{ scrollbarWidth: 'thin' }}
      >
        {steps.map((step, i) => {
          const href = `/${area}/${personaId}/moment/${step.id}`;
          const thumb = momentHeroRasterFromExcel(personaId, step.id);
          return (
            <li
              key={step.id}
              className="relative shrink-0 snap-start"
              style={{ flexBasis: '200px' }}
            >
              <Link
                href={href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-3 transition-all duration-[var(--motion-base)] ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-[var(--blue-primary)] hover:shadow-[var(--shadow-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
              >
                <div
                  className="relative -mx-3 -mt-3 mb-3 h-[5.25rem] overflow-hidden rounded-t-2xl border-b border-[var(--grey-border)] bg-[#eef3ff]"
                  aria-hidden
                >
                  {thumb ? (
                    <>
                      <img
                        src={thumb}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover object-top"
                        loading="lazy"
                        decoding="async"
                      />
                      <span
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#001a72]/25 via-transparent to-transparent"
                        aria-hidden
                      />
                    </>
                  ) : (
                    <>
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(135deg, ${accentColor}2e 0%, rgba(255,255,255,0.96) 48%, #eef3ff 100%)`,
                        }}
                      />
                      <div
                        className="absolute inset-0 opacity-[0.45]"
                        style={{
                          backgroundImage:
                            'radial-gradient(circle, rgba(41, 56, 150, 0.12) 1px, transparent 1px)',
                          backgroundSize: '11px 11px',
                        }}
                      />
                      <div className="relative flex h-full items-center justify-center">
                        <JourneyStepIcon step={step} accent={accentColor} size={52} />
                      </div>
                    </>
                  )}
                  <span
                    className="absolute right-2 top-2 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm ring-1 ring-black/5"
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
