import { ArrowRight, Globe } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

interface Props {
  countries: { flag: string; count: number }[];
  totalCountries: number;
}

/**
 * Horizontal lens of the top-deploying countries. Each chip links into
 * /solutions with the corresponding flag filter pre-applied.
 */
export function CountryLens({ countries, totalCountries }: Props) {
  if (countries.length === 0) return null;

  return (
    <div className="rounded-3xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--icon-bg)] text-[var(--blue)]">
            <Globe size={18} weight="duotone" aria-hidden />
          </span>
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/60"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Country lens
            </p>
            <h2
              className="text-xl font-extrabold leading-tight text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Where Sodexo innovation lives
            </h2>
          </div>
        </div>
        <Link
          href="/solutions"
          className="inline-flex items-center gap-1 text-xs font-bold text-[var(--blue-primary)] hover:underline"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          All {totalCountries} countries <ArrowRight size={11} weight="bold" aria-hidden />
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {countries.map(({ flag, count }) => (
          <Link
            key={flag}
            href={`/solutions?flag=${encodeURIComponent(flag)}`}
            className="group flex items-center gap-2 rounded-2xl border border-[var(--grey-border)] bg-[var(--surface)] px-3 py-2 transition-all hover:-translate-y-0.5 hover:border-[var(--blue-primary)] hover:shadow-[var(--shadow-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
            aria-label={`Filter solutions by ${flag}`}
          >
            <span className="text-xl leading-none" aria-hidden>
              {flag}
            </span>
            <span className="flex flex-col">
              <span
                className="text-[10px] font-semibold uppercase tracking-wider text-[var(--blue)]/60"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Deployments
              </span>
              <span
                className="text-sm font-extrabold text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {count}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
