import Link from 'next/link';
import { ER_HOME_TO_HOME_JOURNEY } from '@/lib/data/er';

export const revalidate = 3600;

export default function ErJourneyPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10 md:px-12 md:py-14">
      <nav className="text-xs font-semibold text-[var(--blue)]/60">
        <Link href="/er" className="hover:underline">
          E&amp;R home
        </Link>
        <span className="px-1">/</span>
        <span className="text-[var(--blue)]">Home-to-home journey</span>
      </nav>
      <h1
        className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--blue)] md:text-4xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Employees: home to home
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--blue)]/80">
        Canonical journey structure from the BoK (section 4). Persona heatmaps in the PDF colour which pains
        matter most per profile — use this list as shared steps; drop in exported journey artwork per persona
        when ready.
      </p>

      <ol className="mt-10 space-y-6">
        {ER_HOME_TO_HOME_JOURNEY.map((phase, idx) => (
          <li
            key={phase.id}
            className="flex gap-4 rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-sm)]"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--blue-primary)] text-sm font-extrabold text-white"
              aria-hidden
            >
              {idx + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-extrabold text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
                {phase.title}
              </h2>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[var(--blue)]/80">
                {phase.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <div className="mt-3 border-t border-[var(--grey-border)] pt-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--blue)]/55">
                  Typical pain themes (BoK baseline)
                </p>
                <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-[var(--blue)]/70">
                  {phase.painThemes.map((t) => (
                    <li key={t}>— {t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-sm text-[var(--blue)]/75">
        Profile-specific heatmaps: see BoK PDF pages 41+ (Remote lifestyler, Optimizer, Pro-active achiever,
        etc.).
      </p>
    </div>
  );
}
