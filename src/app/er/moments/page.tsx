import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCatalogueData } from '@/lib/notion';

export const revalidate = 3600;

export default async function ErMomentsPage() {
  const data = await getCatalogueData();
  const work = data.areas.work;
  if (!work) notFound();

  const personas = data.personas.filter((p) => p.area === 'work').sort((a, b) => a.name.localeCompare(b.name));

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
        Each row is one persona&apos;s journey. Links open the moment detail with modules and solutions. IFM
        value-case module names and user-needs ribbons will augment these pages after PDF ingest.
      </p>

      <div className="mt-10 space-y-10">
        {personas.map((p) => (
          <section key={p.id} className="rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-5 md:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-extrabold text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
                {p.name}
              </h2>
              <Link href={`/${p.area}/${p.id}`} className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--blue-primary)] hover:underline">
                Full journey
              </Link>
            </div>
            <ol className="mt-4 flex flex-wrap gap-2">
              {p.steps.map((sid) => {
                const step = data.journeySteps[sid];
                if (!step) return null;
                return (
                  <li key={sid}>
                    <Link
                      href={`/${p.area}/${p.id}/moment/${step.id}`}
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
