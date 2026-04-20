import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JourneyMap } from '@/components/catalogue/JourneyMap';
import { PersonaProfileFigma } from '@/components/catalogue/PersonaProfileFigma';
import { Navbar } from '@/components/layout/Navbar';
import { getMomentsForModuleName } from '@/lib/catalogue/journey';
import { getCatalogueData } from '@/lib/notion';
import type { Area, JourneyStep } from '@/lib/data/types';

export const revalidate = 3600;

const AREA_KEYS = new Set<Area>(['work', 'learn', 'heal', 'play']);

interface Props {
  params: { area: string; persona: string };
}

export default async function PersonaPage({ params }: Props) {
  const { personas, areas, modules, journeySteps } = await getCatalogueData();
  if (!AREA_KEYS.has(params.area as Area)) notFound();

  const areaConfig = areas[params.area as Area];
  if (!areaConfig) notFound();

  const persona = personas.find((p) => p.id === params.persona && p.area === params.area);
  if (!persona) notFound();

  const steps = persona.steps
    .map((sid) => journeySteps[sid])
    .filter((s): s is JourneyStep => Boolean(s));

  const modulesSorted = [...Object.values(modules)].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f6fb]">
      <Navbar
        hideTitle
        title={persona.name}
        backHref={`/${params.area}`}
        breadcrumb={[
          { label: areaConfig.label, href: `/${params.area}` },
          { label: persona.name },
        ]}
      />

      <main className="flex-1">

        {/* ── Persona profile hero ──────────────────────────────────── */}
        <PersonaProfileFigma persona={persona} />

        {/* ── Journey map section ───────────────────────────────────── */}
        <section className="px-4 pb-0 pt-10 md:px-10 lg:px-14" aria-label="Consumer journey">
          {/* Section heading */}
          <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2
              className="text-[clamp(1.5rem,4vw,2.75rem)] font-extrabold leading-none"
              style={{ fontFamily: 'var(--font-heading)', color: areaConfig.color }}
            >
              {areaConfig.label}
            </h2>
            <span
              className="text-[clamp(1.5rem,4vw,2.75rem)] font-extrabold leading-none text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {persona.name}
            </span>
            <span
              className="text-base font-semibold text-gray-400"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              — Day journey
            </span>
          </div>
          <p
            className="mb-6 max-w-2xl text-sm leading-relaxed text-gray-500"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Tap a moment to explore modules and solutions for that step of the day.
          </p>
          <JourneyMap
            steps={steps}
            area={params.area}
            persona={params.persona}
            journeyMapImage={persona.journeyMapImage}
            journeyHotspots={persona.journeyHotspots}
          />
        </section>

        {/* ── Experience modules ────────────────────────────────────── */}
        <section
          className="mx-4 mb-10 mt-10 rounded-[25px] px-4 py-8 md:mx-10 md:px-8 md:py-10 lg:mx-14"
          style={{ background: '#e0e6f9' }}
          aria-labelledby="section-experience-modules"
        >
          <h3
            id="section-experience-modules"
            className="mb-1 text-xl font-extrabold text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Experience Modules
          </h3>
          <p
            className="mb-6 max-w-2xl text-sm leading-relaxed text-[var(--blue)]/70"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Each module groups related solutions. Select a module to browse all implementations.
          </p>

          <ul
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            aria-label="Experience modules"
          >
            {modulesSorted.map((mod) => {
              const momentLinks = getMomentsForModuleName(mod.name, steps);
              return (
                <li key={mod.id}>
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-white shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 hover:border-[var(--blue-primary)] hover:shadow-md">
                    {/* Gradient top bar */}
                    <div className="h-1.5 w-full" style={{ background: mod.gradient }} />
                    <div className="flex flex-1 flex-col p-3">
                      <span className="mb-1.5 text-2xl" aria-hidden>{mod.icon}</span>
                      <Link
                        href={`/solutions?module=${encodeURIComponent(mod.name)}`}
                        className="mb-2 text-sm font-extrabold leading-tight text-[var(--blue)] hover:text-[var(--blue-primary)]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {mod.name}
                      </Link>
                      {momentLinks.length > 0 ? (
                        <div className="mt-auto flex flex-wrap gap-1 border-t border-[var(--grey-border)] pt-2">
                          {momentLinks.map((m) => (
                            <Link
                              key={m.id}
                              href={`/${params.area}/${params.persona}/moment/${m.id}`}
                              className="rounded-full bg-[#f0f4ff] px-2 py-0.5 text-[9px] font-semibold text-[var(--blue-solid)] ring-1 ring-[var(--grey-border)] transition-colors hover:bg-[var(--blue)] hover:text-white hover:ring-[var(--blue)]"
                            >
                              {m.label}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
