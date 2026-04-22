import { cn } from '@/lib/utils/cn';
import { pickModuleVisual } from '@/lib/data/moduleVisuals';
import type { Module } from '@/lib/data/types';

interface Props {
  module: Pick<Module, 'id' | 'name' | 'gradient'> | null | undefined;
  /** Outer tile size in px — the icon is sized to ~55% of this value. */
  size?: number;
  /** Tailwind utilities for the outer tile (overrides default radius / shadow). */
  className?: string;
  /** Disable the subtle radial highlight (used where extra flair isn't wanted). */
  flat?: boolean;
}

/**
 * Small gradient tile with the module's Phosphor icon centred on top.
 *
 * Replaces the emoji-on-gradient tiles that previously shipped next to
 * module titles, in the "Keep exploring" rail and on solution cards.
 */
export function ModuleIcon({ module, size = 56, className, flat = false }: Props) {
  const { Icon, weight } = pickModuleVisual(module ?? undefined);
  const iconSize = Math.round(size * 0.55);
  const radius = Math.max(10, Math.round(size * 0.28));

  return (
    <span
      aria-hidden
      className={cn(
        'relative inline-flex flex-shrink-0 items-center justify-center overflow-hidden text-white shadow-[var(--shadow-sm)]',
        className,
      )}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background:
          module?.gradient ?? 'linear-gradient(135deg, var(--blue), var(--blue-primary))',
      }}
    >
      {!flat ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 100% at 20% 10%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 55%)',
          }}
        />
      ) : null}
      <Icon size={iconSize} weight={weight} color="#ffffff" />
    </span>
  );
}
