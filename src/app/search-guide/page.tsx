import Link from 'next/link';
import {
  ArrowRight,
  MagnifyingGlass,
  MapTrifold,
  Sliders,
  Sparkle,
  Trophy,
  UsersThree,
} from '@phosphor-icons/react/dist/ssr';
import { COLLECTION_META } from '@/lib/data/collections';

export const revalidate = 3600;

export default function SearchGuidePage() {
  const so = COLLECTION_META['standard-offer'];
  const bb = COLLECTION_META['big-bets'];

  return (
    <div className="flex flex-1 flex-col bg-[var(--surface)]">
      <main id="main-content" className="mx-auto w-full max-w-[880px] px-6 py-12 md:py-16">
        <p
          className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--blue)]/55"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Catalogue
        </p>
        <h1
          className="mt-2 text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-tight text-[var(--blue)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          How to search this experience catalogue
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--blue)]/75" style={{ fontFamily: 'var(--font-body)' }}>
          The header search sends you straight to <strong className="text-[var(--blue)]">Solutions</strong> with your
          query. The solutions page adds structured filters so you can pivot from a keyword to a journey, an area, or a
          curated shortlist — without losing context.
        </p>

        <ul className="mt-10 space-y-6">
          <li className="flex gap-4 rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--icon-bg)] text-[var(--blue)]">
              <MagnifyingGlass size={22} weight="duotone" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
                Global search
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--blue)]/75" style={{ fontFamily: 'var(--font-body)' }}>
                Type a solution name, module, or keyword. Results open on the solutions grid with your text prefilled;
                refine using chips and dropdowns in the filter bar.
              </p>
            </div>
          </li>

          <li className="flex gap-4 rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--icon-bg)] text-[var(--blue)]">
              <Sliders size={22} weight="duotone" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
                Filter bar
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--blue)]/75" style={{ fontFamily: 'var(--font-body)' }}>
                Combine <strong className="text-[var(--blue)]">area</strong>, <strong className="text-[var(--blue)]">module</strong>,{' '}
                <strong className="text-[var(--blue)]">persona</strong>, <strong className="text-[var(--blue)]">moment</strong>, hashtags, flags, status and type. Selecting a persona (and optionally a moment) narrows modules to what matters for that part of the day.
              </p>
            </div>
          </li>

          <li className="flex gap-4 rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--icon-bg)] text-[var(--blue)]">
              <Trophy size={22} weight="duotone" className="text-[var(--teal)]" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
                Standard Offer &amp; Big Bets
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--blue)]/75" style={{ fontFamily: 'var(--font-body)' }}>
                Use collection chips for TDDI-aligned shortlists. The{' '}
                <Link href={so.href} className="font-bold text-[var(--blue-primary)] underline-offset-2 hover:underline">
                  Standard Offer story
                </Link>{' '}
                explains the IQ / OS / XP framing on a dedicated page; the{' '}
                <Link
                  href={so.catalogueHref!}
                  className="font-bold text-[var(--blue-primary)] underline-offset-2 hover:underline"
                >
                  Standard Offer catalogue view
                </Link>{' '}
                stacks that narrative with the filtered grid. Legacy P&amp;L-impact AI products from the blockbuster slide
                remain in Standard Offer scope and carry the{' '}
                <Link
                  href="/solutions?hashtag=%23blockbuster"
                  className="font-bold text-[var(--blue-primary)] underline-offset-2 hover:underline"
                >
                  #blockbuster
                </Link>{' '}
                hashtag.{' '}
                <Link href={bb.href} className="font-bold text-[var(--blue-primary)] underline-offset-2 hover:underline">
                  Big Bets
                </Link>{' '}
                covers FY26 innovation priorities (Food & Beyond, Health & Wellbeing, Automation); open the{' '}
                <Link href={bb.catalogueHref!} className="font-bold text-[var(--blue-primary)] underline-offset-2 hover:underline">
                  Big Bets catalogue view
                </Link>{' '}
                for the mapped solution shortlist.
              </p>
            </div>
          </li>

          <li className="flex gap-4 rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--icon-bg)] text-[var(--blue)]">
              <MapTrifold size={22} weight="duotone" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
                Areas &amp; journeys
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--blue)]/75" style={{ fontFamily: 'var(--font-body)' }}>
                Start from <strong className="text-[var(--blue)]">Areas</strong> when you want persona context first; open a moment to see modules, then jump into solutions pre-filtered for that slice of the day.
              </p>
            </div>
          </li>

          <li className="flex gap-4 rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--icon-bg)] text-[var(--blue)]">
              <UsersThree size={22} weight="duotone" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
                Saved &amp; sharing
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--blue)]/75" style={{ fontFamily: 'var(--font-body)' }}>
                Favourite solutions from detail pages; use the Saved area to rebuild a workshop list. Share links preserve filters when you copy the URL from the solutions page.
              </p>
            </div>
          </li>
        </ul>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--blue)] px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition-transform hover:-translate-y-0.5"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Open solutions
            <ArrowRight size={16} weight="bold" aria-hidden />
          </Link>
          <Link
            href={so.href}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--grey-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--blue)] hover:bg-[var(--icon-bg)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <Trophy size={16} weight="duotone" className="text-[var(--teal)]" aria-hidden />
            Standard Offer story
          </Link>
          <Link
            href={so.catalogueHref!}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--grey-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--blue)] hover:bg-[var(--icon-bg)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <Sparkle size={16} weight="duotone" className="text-[var(--teal)]" aria-hidden />
            Standard Offer + grid
          </Link>
        </div>
      </main>
    </div>
  );
}
