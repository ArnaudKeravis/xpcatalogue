import Link from 'next/link';
import { getCatalogueData } from '@/lib/notion';
import { COLLECTION_META } from '@/lib/data/collections';

/**
 * Global footer. Async server component so we can show live counts from
 * the catalogue without client-side fetching. Rendered on every non-hero page.
 */
export async function Footer() {
  const data = await getCatalogueData().catch(() => null);

  const counts = data
    ? {
        solutions: data.solutions.length,
        personas: data.personas.length,
        modules: Object.keys(data.modules).length,
        countries: new Set(data.solutions.flatMap((s) => s.flags)).size,
      }
    : null;

  const lastUpdated = data?.lastUpdated
    ? formatRelative(new Date(data.lastUpdated))
    : null;

  return (
    <footer
      className="mt-12 border-t border-[var(--grey-border)] bg-[var(--surface-card)] backdrop-blur"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="mx-auto grid w-full max-w-[1600px] gap-8 px-4 py-10 md:grid-cols-3 md:px-8">
        {/* Trust */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/50">
            Curated by
          </p>
          <p className="mt-2 text-sm font-extrabold leading-tight text-[var(--blue)]">
            Sodexo Digital, AI &amp; Innovation
          </p>
          <p className="mt-1 text-xs text-[var(--blue)]/60">
            Designed to surface the human experience behind every solution.
          </p>
          {counts ? (
            <dl className="mt-4 grid grid-cols-4 gap-2 text-center">
              {[
                { v: counts.solutions, l: 'Solutions' },
                { v: counts.modules, l: 'Modules' },
                { v: counts.personas, l: 'Personas' },
                { v: counts.countries, l: 'Countries' },
              ].map(({ v, l }) => (
                <div
                  key={l}
                  className="rounded-lg border border-[var(--grey-border)] bg-[var(--surface)] px-2 py-2"
                >
                  <dd className="tabular text-base font-extrabold text-[var(--blue)]">{v}</dd>
                  <dt className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--blue)]/60">
                    {l}
                  </dt>
                </div>
              ))}
            </dl>
          ) : null}
          {lastUpdated ? (
            <p className="mt-3 text-[11px] text-[var(--blue)]/50">
              Content refreshed {lastUpdated}
            </p>
          ) : null}
        </div>

        {/* Browse */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/50">
            Browse
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs font-semibold">
            {[
              { href: '/areas', label: 'All areas' },
              { href: '/work', label: 'Work' },
              { href: '/learn', label: 'Learn' },
              { href: '/heal', label: 'Heal' },
              { href: '/play', label: 'Play' },
              { href: '/solutions', label: 'All solutions' },
              { href: COLLECTION_META['standard-offer'].href, label: 'Standard Offer' },
              {
                href: COLLECTION_META['standard-offer'].catalogueHref!,
                label: 'Standard Offer + grid',
              },
              { href: '/standard-offer/tddi-deck', label: 'TDDI · interactive story' },
              { href: COLLECTION_META['big-bets'].href, label: 'Big Bets' },
              { href: COLLECTION_META['big-bets'].catalogueHref!, label: 'Big Bets + grid' },
              { href: '/search-guide', label: 'Search guide' },
              { href: '/saved', label: 'My saved' },
              { href: '/login', label: 'Sign in' },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[var(--blue)]/70 transition-colors hover:text-[var(--blue)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Act */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/50">
            Contribute
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[var(--blue)]/70">
            Missing a solution, a persona, or a moment? The catalogue is curated in Notion and
            updated hourly.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="https://www.notion.so"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--grey-border)] bg-[var(--surface)] px-3 py-1.5 text-[11px] font-bold text-[var(--blue)] transition-colors hover:border-[var(--blue-primary)] hover:text-[var(--blue-primary)]"
            >
              Suggest a solution
            </a>
            <a
              href="mailto:digital.innovation@sodexo.com?subject=Experience%20Catalogue%20feedback"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--grey-border)] bg-[var(--surface)] px-3 py-1.5 text-[11px] font-bold text-[var(--blue)] transition-colors hover:border-[var(--blue-primary)] hover:text-[var(--blue-primary)]"
            >
              Share feedback
            </a>
          </div>
        </div>
      </div>

      {/* Fine print */}
      <div className="border-t border-[var(--grey-border)]">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-start justify-between gap-2 px-4 py-4 text-[11px] text-[var(--blue)]/50 md:flex-row md:items-center md:px-8">
          <p className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
            <span>© {new Date().getFullYear()} Sodexo — internal showcase. Data sourced from Notion.</span>
            <Link
              href="/standard-offer/tddi-deck"
              className="text-[var(--blue)]/60 underline-offset-4 transition-colors hover:text-[var(--blue-primary)] hover:underline"
            >
              TDDI Standard Offer — immersive story
            </Link>
          </p>
          <p>
            Built with Next.js, Tailwind, Phosphor &amp; love for humans who live the moments.
          </p>
        </div>
      </div>
    </footer>
  );
}

function formatRelative(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
