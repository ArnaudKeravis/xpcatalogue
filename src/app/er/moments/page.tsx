import Link from 'next/link';
import { ER_BOK_STEP_IDS, ER_BOK_STEPS, allErBoKAndClient } from '@/lib/data/er';

export const revalidate = 3600;

export default function ErMomentsPage() {
  const bokProfiles = allErBoKAndClient();

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10 md:px-12 md:py-14">
      <nav className="text-xs font-semibold text-[var(--blue)]/60">
        <Link href="/er" className="hover:underline">
          E&amp;R home
        </Link>
        <span className="px-1">/</span>
        <span className="text-[var(--blue)]">Moments</span>
      </nav>
      <h1
        className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--blue)] md:text-4xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Moments of the day
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--blue)]/80">
        Seven BoK moments shared across E&amp;R personae. Open a moment once for modules and innovations, or
        pick a persona for profile-specific context.
      </p>

      <section className="mt-8 rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-5 md:p-6">
        <h2 className="text-lg font-extrabold text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
          All personae — one journey
        </h2>
        <ol className="mt-4 flex flex-wrap gap-2">
          {ER_BOK_STEP_IDS.map((momentId) => {
            const step = ER_BOK_STEPS[momentId];
            return (
              <li key={momentId}>
                <Link
                  href={`/er/journey/moment/${momentId}`}
                  className="inline-flex rounded-full border border-[var(--grey-border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--blue)] transition-colors hover:border-[var(--blue-primary)] hover:text-[var(--blue-primary)]"
                >
                  {step.label}
                </Link>
              </li>
            );
          })}
        </ol>
        <Link
          href="/er/journey"
          className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.12em] text-[var(--blue-primary)] hover:underline"
        >
          Interactive journey map →
        </Link>
      </section>

      <div className="mt-10 space-y-10">
        {bokProfiles.map((bok) => (
          <section
            key={bok.id}
            className="rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-5 md:p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-extrabold text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
                {bok.name}
              </h2>
              <Link
                href={`/er/personae/${bok.id}`}
                className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--blue-primary)] hover:underline"
              >
                Full journey
              </Link>
            </div>
            <ol className="mt-4 flex flex-wrap gap-2">
              {ER_BOK_STEP_IDS.map((momentId) => {
                const step = ER_BOK_STEPS[momentId];
                return (
                  <li key={momentId}>
                    <Link
                      href={`/er/personae/${bok.id}/moment/${momentId}`}
                      className="inline-flex rounded-full border border-[var(--grey-border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--blue)] transition-colors hover:border-[var(--blue-primary)] hover:text-[var(--blue-primary)]"
                    >
                      {step.label}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
