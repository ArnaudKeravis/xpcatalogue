import Link from 'next/link';
import { IFM_VALUE_CASE_PILLARS } from '@/lib/data/er';

export const revalidate = 3600;

export default function ErIfmPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10 md:px-12 md:py-14">
      <nav className="text-xs font-semibold text-[var(--blue)]/60">
        <Link href="/er" className="hover:underline">
          E&amp;R home
        </Link>
        <span className="px-1">/</span>
        <span className="text-[var(--blue)]">IFM value case</span>
      </nav>
      <h1
        className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--blue)] md:text-4xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        IFM pillars &amp; principles
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--blue)]/80">
        Module families and “key solution principles” from{' '}
        <em>Delivering the IFM Value Case — Through Service Optimisation Together</em> (short PDF). Use these
        labels as a second tagging axis on solutions and BoK levers (smart facilities, retail, governance…).
      </p>

      <div className="mt-10 space-y-8">
        {IFM_VALUE_CASE_PILLARS.map((pillar) => (
          <section
            key={pillar.id}
            id={pillar.id}
            className="rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-sm)]"
          >
            <h2 className="text-lg font-extrabold text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {pillar.label}
            </h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--blue)]/80">
              {pillar.principles.map((pr) => (
                <li key={pr}>{pr}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
