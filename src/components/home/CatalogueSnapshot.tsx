import { ArrowRight, Globe } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

interface Stat {
  value: number;
  label: string;
}

interface Props {
  stats: Stat[];
  countries: { flag: string; count: number }[];
  totalCountries: number;
}

/**
 * Catalogue snapshot — replaces the previous "5 identical number cards" pattern
 * (hero-metric disease) with a single refined panel: stat strip across the top,
 * country lens below. One frame, one rhythm, one story.
 */
export function CatalogueSnapshot({ stats, countries, totalCountries }: Props) {
  return (
    <section
      aria-label="Catalogue snapshot"
      className="overflow-hidden rounded-3xl border border-[var(--grey-border)] bg-[var(--surface-card)] shadow-[var(--shadow-sm)]"
    >
      {/* ── Stat rail ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 divide-x divide-[var(--grey-border)] sm:grid-cols-5">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={
              // The last row on 2-col layouts needs a top-divider for the odd-row wrap
              'flex flex-col gap-1 px-5 py-5 ' +
              (i >= 2 ? 'border-t border-[var(--grey-border)] sm:border-t-0' : '')
            }
          >
            <p
              className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--blue)]/55"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {s.label}
            </p>
            <p
              className="tabular text-3xl font-extrabold leading-none text-[var(--blue)] md:text-4xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {countries.length > 0 ? (
        <>
          {/* Divider — 1px rule that doubles as a connector between stats and lens */}
          <div className="border-t border-[var(--grey-border)]" aria-hidden />

          {/* ── Country lens ─────────────────────────────────────── */}
          <div className="p-5 md:p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--icon-bg)] text-[var(--blue)]"
                >
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
                    Where innovation lives
                  </h2>
                </div>
              </div>
              <Link
                href="/solutions"
                className="inline-flex items-center gap-1 text-xs font-bold text-[var(--blue-primary)] transition-transform duration-[var(--motion-base)] ease-[var(--ease-hover)] hover:translate-x-0.5 hover:underline"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                All {totalCountries} countries{' '}
                <ArrowRight size={11} weight="bold" aria-hidden />
              </Link>
            </div>

            <ul className="mt-4 flex flex-wrap gap-2">
              {countries.map(({ flag, count }) => (
                <li key={flag}>
                  <Link
                    href={`/solutions?flag=${encodeURIComponent(flag)}`}
                    className="group flex items-center gap-2 rounded-2xl border border-[var(--grey-border)] bg-[var(--surface)] px-3 py-2 transition-[transform,border-color,box-shadow] duration-[var(--motion-base)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-[var(--blue-primary)] hover:shadow-[var(--shadow-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
                    aria-label={`Filter solutions by ${flag}`}
                  >
                    <span className="text-xl leading-none" aria-hidden>
                      {flag}
                    </span>
                    <span className="flex flex-col leading-tight">
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wider text-[var(--blue)]/60"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        Deployments
                      </span>
                      <span
                        className="tabular text-sm font-extrabold text-[var(--blue)]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {count}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
    </section>
  );
}
