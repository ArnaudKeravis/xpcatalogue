import Link from 'next/link';
import { ER_USER_NEEDS } from '@/lib/data/er';
import { findModuleForLever, indexModulesForLevers } from '@/lib/data/er/leverModuleMatch';
import { getCatalogueData } from '@/lib/notion';

export const revalidate = 3600;

export default async function ErUserNeedsPage() {
  const { modules } = await getCatalogueData();
  const moduleIndex = indexModulesForLevers(Object.values(modules));

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10 md:px-12 md:py-14">
      <nav className="text-xs font-semibold text-[var(--blue)]/60">
        <Link href="/er" className="hover:underline">
          E&amp;R home
        </Link>
        <span className="px-1">/</span>
        <span className="text-[var(--blue)]">User needs</span>
      </nav>
      <h1
        className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--blue)] md:text-4xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        User needs
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--blue)]/80">
        Six needs from the Sodexo Energy &amp; Mining Book of Knowledge (Ipsos consolidation). Each need
        links predominant employee profiles and the solution levers named in the BoK — click a lever
        to jump to the closest catalogue module.
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--blue)]/55">
        Source: Sodexo Global Needs Based Segmentation — BoK long version (May 2019)
      </p>

      <ul className="mt-10 grid gap-5 lg:grid-cols-2">
        {ER_USER_NEEDS.map((c) => (
          <li
            key={c.id}
            className="rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-sm)]"
          >
            <h2 className="text-xl font-extrabold text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {c.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--blue)]/80">{c.description}</p>
            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--blue)]/55">
                Predominant profiles
              </p>
              <ul className="mt-1.5 list-inside list-disc text-sm text-[var(--blue)]/75">
                {c.predominantProfiles.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--blue)]/55">
                BoK solution levers
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {c.solutionLevers.map((s) => {
                  const match = findModuleForLever(s, moduleIndex);
                  if (match) {
                    return (
                      <li key={s}>
                        <Link
                          href={`/modules/${match.module.id}`}
                          title={`Open module: ${match.module.name}`}
                          className="inline-flex items-center rounded-full border border-[var(--grey-border)] bg-[var(--surface)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--blue)]/85 transition-[transform,border-color,background-color,color] duration-150 hover:-translate-y-0.5 hover:border-[var(--blue-primary)] hover:bg-[var(--icon-bg-muted)] hover:text-[var(--blue)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--blue-primary)]"
                        >
                          {s}
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li
                      key={s}
                      className="rounded-full border border-dashed border-[var(--grey-border)] bg-[var(--surface)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--blue)]/55"
                      title="No matching catalogue module yet"
                    >
                      {s}
                    </li>
                  );
                })}
              </ul>
            </div>
            {c.catalogueHints?.length ? (
              <p className="mt-4 border-t border-[var(--grey-border)] pt-3 text-xs italic text-[var(--blue)]/65">
                {c.catalogueHints.join(' ')}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-[var(--blue)]/70">
        Safety / zero harm appears in the BoK needs overview as a cross-cutting expectation alongside these six
        dimensions — wire it as a global tag across moments when you extend the schema.
      </p>
    </div>
  );
}
