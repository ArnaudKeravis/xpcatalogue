import { ArrowSquareOut } from '@phosphor-icons/react/dist/ssr';
import type { PersonaFigmaLinks } from '@/lib/data/types';
import { cn } from '@/lib/utils/cn';

interface Props {
  links: PersonaFigmaLinks;
  className?: string;
}

const ITEMS: { key: keyof PersonaFigmaLinks; label: string }[] = [
  { key: 'personaDescription', label: 'Persona description' },
  { key: 'journeyBridge', label: 'Profile → journey' },
  { key: 'personaJourney', label: 'Journey map' },
  { key: 'modularApproach', label: 'Modular approach' },
];

export function PersonaFigmaReferenceStrip({ links, className }: Props) {
  return (
    <nav
      className={cn(
        'mb-10 flex flex-wrap gap-2 border-b border-[var(--grey-border)] pb-6',
        className
      )}
      aria-label="Figma design references"
    >
      <span
        className="w-full text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--grey-subtle)]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Figma — this flow
      </span>
      {ITEMS.map(({ key, label }) => (
        <a
          key={key}
          href={links[key]}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--grey-border)] bg-[var(--surface)] px-3 py-1.5',
            'text-xs font-semibold text-[var(--blue)] transition-colors hover:border-[var(--blue-primary)] hover:bg-white'
          )}
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {label}
          <ArrowSquareOut className="h-3.5 w-3.5 shrink-0 opacity-80" weight="bold" aria-hidden />
        </a>
      ))}
    </nav>
  );
}
