import Link from 'next/link';
import { dedupeFlags, getFlagLabel, resolveSolutionFlags } from '@/lib/data/countryFlags';
import type { Solution } from '@/lib/data/types';
import { cn } from '@/lib/utils/cn';

interface Props {
  solution?: Pick<Solution, 'flags' | 'regionsAndCountry'>;
  flags?: string[];
  className?: string;
  /** Show a leading "Countries" label. */
  showLabel?: boolean;
  /** Link each tag to `/solutions?flag=…`. */
  linkable?: boolean;
  size?: 'sm' | 'md';
}

export function CountryFlagTags({
  solution,
  flags: flagsProp,
  className,
  showLabel = true,
  linkable = false,
  size = 'md',
}: Props) {
  const flags = dedupeFlags(
    flagsProp ?? (solution ? resolveSolutionFlags(solution) : []),
  );
  if (!flags.length) return null;

  const flagSize = size === 'sm' ? 'text-base' : 'text-xl';
  const tagPad = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1';

  return (
    <div
      className={cn('flex flex-wrap items-center gap-1.5', className)}
      role="group"
      aria-label={`Deployed in ${flags.length} countr${flags.length === 1 ? 'y' : 'ies'}`}
    >
      {showLabel ? (
        <span
          className="mr-0.5 text-xs font-bold text-[var(--blue)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Countries:
        </span>
      ) : null}
      {flags.map((flag) => {
        const label = getFlagLabel(flag);
        const inner = (
          <>
            <span className={cn(flagSize, 'leading-none')} aria-hidden>
              {flag}
            </span>
            <span
              className="text-[10px] font-semibold uppercase tracking-wide text-[var(--blue)]/75"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {label}
            </span>
          </>
        );

        const classNames = cn(
          'inline-flex items-center gap-1.5 rounded-full border border-[var(--grey-border)] bg-[var(--surface)]',
          tagPad,
          linkable &&
            'transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-[var(--blue-primary)] hover:shadow-[var(--shadow-sm)]',
        );

        return linkable ? (
          <Link
            key={flag}
            href={`/solutions?flag=${encodeURIComponent(flag)}`}
            className={classNames}
            title={`Filter solutions in ${label}`}
            aria-label={`${label} — filter solutions`}
          >
            {inner}
          </Link>
        ) : (
          <span key={flag} className={classNames} title={label}>
            {inner}
          </span>
        );
      })}
    </div>
  );
}
