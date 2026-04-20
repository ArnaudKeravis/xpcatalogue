'use client';

import { ArrowClockwise, House, WarningCircle } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[catalogue] unhandled route error', error);
    }
  }, [error]);

  return (
    <div
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--surface)] px-6 text-center"
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--icon-bg)]"
        aria-hidden
      >
        <WarningCircle size={28} weight="duotone" color="var(--blue)" />
      </div>
      <div className="max-w-md space-y-2">
        <h1
          className="text-3xl font-extrabold text-[var(--blue)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Something went wrong loading this page
        </h1>
        <p className="text-sm leading-relaxed text-[var(--grey-subtle)]">
          The catalogue hit an unexpected error. You can retry the page, or
          head back to the home screen and try again from there. If the
          problem keeps happening, email{' '}
          <a
            href="mailto:innovation@sodexo.com"
            className="font-semibold text-[var(--blue-primary)] underline"
          >
            innovation@sodexo.com
          </a>
          {error.digest ? (
            <>
              {' '}with this reference:{' '}
              <code className="rounded bg-[var(--icon-bg)] px-1.5 py-0.5 text-[11px] text-[var(--blue)]">
                {error.digest}
              </code>
            </>
          ) : null}
          .
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--blue)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--blue-solid)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
        >
          <ArrowClockwise size={16} weight="bold" aria-hidden />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--grey-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--blue)] transition-colors hover:bg-[var(--icon-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
        >
          <House size={16} weight="bold" aria-hidden />
          Back to home
        </Link>
      </div>
    </div>
  );
}
