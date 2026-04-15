import { Fragment } from 'react';
import { CaretRight } from '@phosphor-icons/react/dist/ssr';
import type { PersonaFigmaLinks } from '@/lib/data/types';
import { cn } from '@/lib/utils/cn';

interface Props {
  links: PersonaFigmaLinks;
  className?: string;
}

const STEPS: { key: keyof PersonaFigmaLinks; label: string; step: number }[] = [
  { step: 1, key: 'personaDescription', label: 'Persona' },
  { step: 2, key: 'journeyBridge', label: 'Bridge' },
  { step: 3, key: 'personaJourney', label: 'Journey' },
  { step: 4, key: 'modularApproach', label: 'Modules' },
];

export function PersonaCatalogueFlow({ links, className }: Props) {
  return (
    <div
      className={cn(
        'mb-8 rounded-2xl border border-[var(--grey-border)] bg-[var(--surface)] px-4 py-5 md:px-6',
        className,
      )}
      data-section="catalogue-flow"
    >
      <p
        className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--grey-subtle)]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Catalogue flow (Figma)
      </p>
      <div
        className="flex flex-wrap items-center justify-center gap-y-3 md:flex-nowrap md:justify-between md:gap-x-1"
        role="list"
        aria-label="Persona page flow in Figma"
      >
        {STEPS.map((s, i) => (
          <Fragment key={s.key}>
            <a
              href={links[s.key]}
              target="_blank"
              rel="noopener noreferrer"
              role="listitem"
              className={cn(
                'flex w-[calc(50%-0.25rem)] cursor-pointer flex-col rounded-xl border border-[var(--grey-border)] bg-white px-3 py-3 text-center shadow-[var(--shadow-sm)] transition hover:border-[var(--blue-primary)] hover:bg-[var(--blue-primary)]/5 sm:w-auto sm:min-w-[112px] md:flex-1 md:max-w-[200px]',
              )}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--grey-subtle)]">
                Step {s.step}
              </span>
              <span className="truncate text-sm font-semibold text-[var(--blue)]">{s.label}</span>
            </a>
            {i < STEPS.length - 1 ? (
              <span className="hidden text-[var(--grey-subtle)] md:inline-flex md:shrink-0" aria-hidden>
                <CaretRight className="h-5 w-5" weight="bold" />
              </span>
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
