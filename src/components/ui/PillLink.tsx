import Link, { type LinkProps } from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type Tone = 'neutral' | 'primary' | 'onHero';
type Size = 'sm' | 'md';

interface Props extends Omit<LinkProps, 'className'> {
  children: ReactNode;
  /**
   * Visual tone.
   *  - `neutral` (default): outlined white/surface pill, blue text.
   *  - `primary`: filled accent, white text.
   *  - `onHero`: translucent over a dark hero background.
   */
  tone?: Tone;
  size?: Size;
  className?: string;
  /** Optional leading glyph. `aria-hidden` added automatically. */
  leading?: ReactNode;
  /** Optional trailing glyph — typically an arrow. */
  trailing?: ReactNode;
  /** Expose a screen-reader-only label when the visible content is an icon only. */
  'aria-label'?: string;
}

const BASE =
  'group inline-flex items-center font-semibold transition-[transform,color,background-color,border-color,box-shadow] ' +
  'duration-[var(--motion-base)] ease-[var(--ease-out-quint)] ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]';

const SIZES: Record<Size, string> = {
  sm: 'gap-1.5 rounded-pill px-3 py-1.5 text-xs',
  md: 'gap-2 rounded-pill px-4 py-2 text-sm',
};

const TONES: Record<Tone, string> = {
  neutral:
    'border border-[var(--grey-border)] bg-[var(--surface-card)] text-[var(--blue)] ' +
    'hover:-translate-y-0.5 hover:border-[var(--blue-primary)] hover:text-[var(--blue-primary)]',
  primary:
    'border border-transparent bg-[var(--blue-primary)] text-white shadow-[var(--shadow-sm)] ' +
    'hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]',
  onHero:
    'border border-white/20 bg-white/5 text-white backdrop-blur-md ' +
    'hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10',
};

/**
 * Canonical pill-button styling for every link that looks like a button in the
 * catalogue. Replaces the ~15 hand-rolled `inline-flex items-center gap-1.5 rounded-full
 * …` blocks that were drifting apart across the codebase.
 *
 * Keep the surface area small: tone + size cover every current case. Resist
 * adding props for one-off customisation — if a site needs it, it should become
 * a named variant here.
 */
export function PillLink({
  children,
  tone = 'neutral',
  size = 'sm',
  className,
  leading,
  trailing,
  ...linkProps
}: Props) {
  return (
    <Link {...linkProps} className={cn(BASE, SIZES[size], TONES[tone], className)}>
      {leading ? (
        <span aria-hidden className="-ml-0.5 flex items-center">
          {leading}
        </span>
      ) : null}
      <span className="min-w-0">{children}</span>
      {trailing ? (
        <span
          aria-hidden
          className="-mr-0.5 flex items-center transition-transform duration-[var(--motion-base)] ease-[var(--ease-hover)] group-hover:translate-x-0.5"
        >
          {trailing}
        </span>
      ) : null}
    </Link>
  );
}
