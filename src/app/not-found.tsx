import { Compass, House } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--surface)] px-6 text-center"
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--icon-bg)]"
        aria-hidden
      >
        <Compass size={28} weight="duotone" color="var(--blue)" />
      </div>
      <div className="max-w-md space-y-2">
        <h1
          className="text-3xl font-extrabold text-[var(--blue)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          We couldn&rsquo;t find that page
        </h1>
        <p className="text-sm leading-relaxed text-[var(--grey-subtle)]">
          The link may be out of date, or the persona/moment/solution may have
          been renamed. Start from the catalogue home and pick up the journey
          again.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--blue)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--blue-solid)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
        >
          <House size={16} weight="bold" aria-hidden />
          Back to home
        </Link>
        <Link
          href="/areas"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--grey-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--blue)] transition-colors hover:bg-[var(--icon-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
        >
          Browse areas
        </Link>
      </div>
    </div>
  );
}
