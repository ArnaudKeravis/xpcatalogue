import Link from 'next/link';
import type { JourneyStep } from '@/lib/data/types';

interface Props {
  area: string;
  personaId: string;
  steps: JourneyStep[];
  accentColor: string;
}

/**
 * Horizontal scroll strip of moments — a "table of contents" for a persona's day
 * that shows *before* the journey map. Fast visual scan → drill in.
 */
export function MomentTimeline({ area, personaId, steps, accentColor }: Props) {
  if (steps.length === 0) return null;

  return (
    <section className="px-4 pb-0 pt-8 md:px-10 lg:px-14" aria-label="Day at a glance">
      <div className="mb-3 flex items-baseline gap-3">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--blue)]/60"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Day at a glance
        </p>
        <span
          className="text-[10px] font-semibold text-[var(--blue)]/40"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {steps.length} moments
        </span>
      </div>

      <ol
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3"
        style={{ scrollbarWidth: 'thin' }}
      >
        {steps.map((step, i) => {
          const href = `/${area}/${personaId}/moment/${step.id}`;
          return (
            <li
              key={step.id}
              className="relative shrink-0 snap-start"
              style={{ flexBasis: '180px' }}
            >
              <Link
                href={href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-3 transition-all duration-[var(--motion-base)] ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-[var(--blue-primary)] hover:shadow-[var(--shadow-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-lg"
                    style={{ background: `${accentColor}22` }}
                    aria-hidden
                  >
                    {step.icon}
                  </span>
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
    </section>
  );
}
