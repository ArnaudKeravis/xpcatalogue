import Link from 'next/link';
import { headers } from 'next/headers';
import { erPaths, readErSegment } from '@/lib/erNav';

export default async function ErSegmentLayout({ children }: { children: React.ReactNode }) {
  const erSegment = readErSegment(headers());

  return (
    <div className="min-h-0 flex-1 bg-[var(--surface)]">
      <div className="border-b border-[var(--grey-border)] bg-[var(--surface-card)] px-4 py-2 md:px-8">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[var(--blue)]/80">
          <span className="uppercase tracking-[0.12em] text-[var(--blue)]/60">Energy &amp; Resources</span>
          <nav className="flex flex-wrap items-center gap-2" aria-label="E&R segment">
            <Link href={erPaths.home(erSegment)} className="rounded-full px-2 py-1 hover:bg-[var(--icon-bg-muted)]">
              Segment home
            </Link>
            <span className="text-[var(--grey-border)]" aria-hidden>
              ·
            </span>
            <Link href={erPaths.operatorLens(erSegment)} className="rounded-full px-2 py-1 hover:bg-[var(--icon-bg-muted)]">
              Operator view
            </Link>
            <span className="text-[var(--grey-border)]" aria-hidden>
              ·
            </span>
            <Link
              href={process.env.NEXT_PUBLIC_CATALOGUE_ORIGIN?.trim() || '/areas'}
              className="rounded-full px-2 py-1 hover:bg-[var(--icon-bg-muted)]"
            >
              Global catalogue
            </Link>
            <span className="text-[var(--grey-border)]" aria-hidden>
              ·
            </span>
            <Link href={erPaths.personae(erSegment)} className="rounded-full px-2 py-1 hover:bg-[var(--icon-bg-muted)]">
              Personae
            </Link>
            <Link href={erPaths.journey(erSegment)} className="rounded-full px-2 py-1 hover:bg-[var(--icon-bg-muted)]">
              Journey
            </Link>
            <Link href={erPaths.needs(erSegment)} className="rounded-full px-2 py-1 hover:bg-[var(--icon-bg-muted)]">
              Needs
            </Link>
            <Link href={erPaths.ifm(erSegment)} className="rounded-full px-2 py-1 hover:bg-[var(--icon-bg-muted)]">
              IFM
            </Link>
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
