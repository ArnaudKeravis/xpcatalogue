import { cn } from '@/lib/utils/cn';
import { pickModuleVisual } from '@/lib/data/moduleVisuals';
import { hasRealHeroImage } from '@/lib/data/solutionHeroImage';
import type { Module, Solution } from '@/lib/data/types';

interface Props {
  solution: Solution;
  module?: Module;
  className?: string;
  /** Height of the tile — keeps existing layouts stable. */
  heightClassName?: string;
  /** Accessible description announced to screen-readers. */
  alt?: string;
}

/**
 * The large illustrative tile shown beside a solution in the detail pane.
 *
 * Priority, from richest to simplest:
 *   1. `solution.heroImage` (a real photograph — typically sourced from
 *      Notion or the Figma export) is rendered edge-to-edge.
 *   2. Otherwise we compose an "illustration": the module's gradient, a
 *      soft spotlight, a faint dot grid, and the Phosphor icon as a huge
 *      centred mark. Consistent across all 90+ solutions and never feels
 *      like a missing asset.
 */
export function SolutionHeroTile({
  solution,
  module,
  className,
  heightClassName = 'h-48',
  alt,
}: Props) {
  const { Icon, weight } = pickModuleVisual(module ?? undefined);
  const gradient =
    module?.gradient ?? 'linear-gradient(135deg, var(--blue), var(--blue-primary))';
  const hasImage = hasRealHeroImage(solution);

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl shadow-[var(--shadow-card)]',
        heightClassName,
        className,
      )}
      style={{ background: gradient }}
    >
      {hasImage ? (
        <img
          src={solution.heroImage!}
          alt={alt ?? ''}
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
        />
      ) : (
        <>
          {/* Spotlight — lifts the icon off the flat gradient */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 90% at 25% 15%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 55%)',
            }}
          />
          {/* Dot grid — adds texture without branding noise */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-screen"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1.4px)',
              backgroundSize: '14px 14px',
            }}
          />
          {/* Bottom fade — keeps any overlay legible */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.18) 100%)',
            }}
          />
          <div className="relative flex h-full w-full items-center justify-center">
            <Icon
              size={108}
              weight={weight}
              color="#ffffff"
              style={{ filter: 'drop-shadow(0 6px 18px rgba(0, 0, 0, 0.22))' }}
              aria-hidden
            />
          </div>
        </>
      )}
    </div>
  );
}
