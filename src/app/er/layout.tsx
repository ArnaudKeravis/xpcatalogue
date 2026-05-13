import Link from 'next/link';

export default function ErSegmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-0 flex-1 bg-[var(--surface)]">
      <div className="border-b border-[var(--grey-border)] bg-[var(--surface-card)] px-4 py-2 md:px-8">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[var(--blue)]/80">
          <span className="uppercase tracking-[0.12em] text-[var(--blue)]/60">Energy &amp; Resources</span>
          <nav className="flex flex-wrap items-center gap-2" aria-label="E&R segment">
            <Link href="/er" className="rounded-full px-2 py-1 hover:bg-[var(--icon-bg-muted)]">
              Client view
            </Link>
            <span className="text-[var(--grey-border)]" aria-hidden>
              ·
            </span>
            <Link href="/er/operator" className="rounded-full px-2 py-1 hover:bg-[var(--icon-bg-muted)]">
              Operator view
            </Link>
            <span className="text-[var(--grey-border)]" aria-hidden>
              ·
            </span>
            <Link href="/" className="rounded-full px-2 py-1 hover:bg-[var(--icon-bg-muted)]">
              Global catalogue
            </Link>
            <span className="text-[var(--grey-border)]" aria-hidden>
              ·
            </span>
            <Link href="/er/personae" className="rounded-full px-2 py-1 hover:bg-[var(--icon-bg-muted)]">
              Personae
            </Link>
            <Link href="/er/journey" className="rounded-full px-2 py-1 hover:bg-[var(--icon-bg-muted)]">
              Journey
            </Link>
            <Link href="/er/needs" className="rounded-full px-2 py-1 hover:bg-[var(--icon-bg-muted)]">
              Needs
            </Link>
            <Link href="/er/ifm" className="rounded-full px-2 py-1 hover:bg-[var(--icon-bg-muted)]">
              IFM
            </Link>
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
