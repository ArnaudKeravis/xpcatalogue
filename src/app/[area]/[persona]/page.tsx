import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JourneyMap } from '@/components/catalogue/JourneyMap';
import { PersonaCatalogueFlow } from '@/components/catalogue/PersonaCatalogueFlow';
import { PersonaFigmaReferenceStrip } from '@/components/catalogue/PersonaFigmaReferenceStrip';
import { PersonaProfileFigma } from '@/components/catalogue/PersonaProfileFigma';
import { Navbar } from '@/components/layout/Navbar';
import { getMomentsForModuleName } from '@/lib/catalogue/journey';
import {
  DEFAULT_MODULAR_PLATFORM_INTRO_HTML,
  DEFAULT_MODULAR_PUZZLE_IMAGE,
} from '@/lib/data/personaPageDefaults';
import { resolvePersonaFigmaLinks } from '@/lib/data/personaFigmaLinks';
import { getCatalogueData } from '@/lib/notion';
import { cn } from '@/lib/utils/cn';
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

  const figmaLinks = resolvePersonaFigmaLinks(persona);

  const platformSegment = persona.platformSegmentLabel ?? persona.profileEyebrow ?? persona.name;

  const steps = persona.steps
    .map((sid) => journeySteps[sid])
    .filter((s): s is JourneyStep => Boolean(s));

  const modulesSorted = [...Object.values(modules)].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar
        hideTitle
        title="Digital, AI & Innovation Experience Catalogue"
        backHref={`/${params.area}`}
        breadcrumb={[{ label: areaConfig.label }, { label: persona.name }, { label: 'Profile' }]}
      />

      <main className="flex-1 overflow-y-auto px-4 pb-16 pt-6 md:px-10 lg:px-14">
        <p
          className="mb-10 text-center text-[clamp(1.25rem,3vw,2.5rem)] font-bold text-[var(--blue-primary)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Digital, AI &amp; Innovation Experience Catalogue
        </p>

        <PersonaProfileFigma persona={persona} className="mb-10" />

        {figmaLinks ? (
          <>
            <PersonaCatalogueFlow links={figmaLinks} />
            <PersonaFigmaReferenceStrip links={figmaLinks} />
          </>
        ) : null}

        {/* 1 — Modular approach (explanation before journey) */}
        <section className="mb-12" data-section="modular-platform">
          <h2
            className="mb-4 max-w-4xl text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-tight text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Our Modular Experience Platform:{' '}
            <span className="text-[var(--teal)]">{platformSegment}</span>
          </h2>
          <div
            className="max-w-3xl space-y-4 text-[1.05rem] leading-relaxed text-[var(--blue)] md:text-[1.1rem]"
            style={{ fontFamily: 'var(--font-body)' }}
            dangerouslySetInnerHTML={{
              __html: persona.modularPlatformIntroHtml ?? DEFAULT_MODULAR_PLATFORM_INTRO_HTML,
            }}
          />
          {figmaLinks ? (
            <p className="mt-4 text-sm text-[var(--grey-subtle)]" style={{ fontFamily: 'var(--font-body)' }}>
              <a
                href={figmaLinks.modularApproach}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--blue-primary)] underline underline-offset-2 hover:text-[var(--blue)]"
              >
                Modular approach — Figma frame
              </a>
            </p>
          ) : null}
          <div className="relative mt-8 max-w-4xl overflow-hidden rounded-[20px] border border-[var(--grey-border)] bg-white/80 shadow-[var(--shadow-sm)]">
            {/* Add `public/images/catalogue/figma/wc-platform-puzzle.png` (see static-home handoff). */}
            <img
              src={persona.modularPuzzleImage ?? DEFAULT_MODULAR_PUZZLE_IMAGE}
              alt="Modular platform — how modules connect across the experience"
              className="h-auto w-full object-contain"
              loading="lazy"
            />
          </div>
        </section>

        {/* 2 — Consumer journey (clickable moments → moment pages) */}
        <section className="mb-12 space-y-4">
          <div className="flex flex-wrap items-center gap-3 md:gap-6">
            <span
              className="text-[clamp(1.5rem,5vw,3.5rem)] font-extrabold leading-none text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {platformSegment}
            </span>
            <span
              className="text-[clamp(1.5rem,5vw,3.5rem)] font-extrabold leading-none text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {areaConfig.label}
            </span>
            <span
              className="text-[clamp(1.5rem,5vw,3.5rem)] font-extrabold leading-none text-[var(--teal)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {persona.name}
            </span>
          </div>
          <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>
            Consumer journey — tap a moment on the map or a pill to open that moment’s modules and solution paths.
          </p>
          <JourneyMap
            steps={steps}
            area={params.area}
            persona={params.persona}
            journeyMapImage={persona.journeyMapImage}
            journeyHotspots={persona.journeyHotspots}
            figmaJourneyUrl={figmaLinks?.personaJourney}
          />
        </section>

        {/* 3 — Experience modules (static-home #section-modules; last on page — journey is above) */}
        <section
          className="rounded-[25px] px-4 py-8 md:px-8 md:py-10"
          style={{ background: '#e0e6f9', boxShadow: 'var(--shadow-soft)' }}
          data-node-id="2021:19815"
          aria-labelledby="section-experience-modules"
        >
          <h3
            id="section-experience-modules"
            className="mb-3 text-[1.1rem] font-extrabold text-[var(--blue)] md:text-[1.15rem]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Experience modules
          </h3>
          <p
            className="mb-8 max-w-2xl text-[0.95rem] leading-relaxed text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Pick a module to open a solution detail (where linked). The journey map above shows how moments connect
            across the day.
            {figmaLinks ? (
              <>
                {' '}
                <a
                  href={figmaLinks.personaDescription}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--blue-primary)] underline underline-offset-2"
                >
                  Persona description
                </a>
                ,{' '}
                <a
                  href={figmaLinks.modularApproach}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--blue-primary)] underline underline-offset-2"
                >
                  modular approach
                </a>
                , and{' '}
                <a
                  href={figmaLinks.personaJourney}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--blue-primary)] underline underline-offset-2"
                >
                  journey map
                </a>{' '}
                frames in Figma map to this catalogue structure; moment-to-module-to-solution wiring can be refined in
                design.
              </>
            ) : null}
          </p>

          <ul
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-label="Experience modules"
          >
            {modulesSorted.map((mod) => {
              const momentLinks = getMomentsForModuleName(mod.name, steps);
              return (
                <li key={mod.id}>
                  <div
                    className={cn(
                      'flex h-full flex-col rounded-2xl border-2 border-[var(--grey-border)] bg-white p-4',
                      'transition-all hover:border-[var(--blue-primary)] hover:shadow-[var(--shadow-sm)]'
                    )}
                  >
                    <p
                      className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--teal)]"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      MODULES
                    </p>
                    <Link
                      href={`/solutions?module=${encodeURIComponent(mod.name)}`}
                      className="mb-2 text-lg font-extrabold leading-tight text-[var(--blue)] hover:underline"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      <span className="mr-2 text-2xl align-middle" aria-hidden>
                        {mod.icon}
                      </span>
                      {mod.name}
                    </Link>
                    {momentLinks.length > 0 ? (
                      <div className="mt-auto flex flex-wrap gap-1 border-t border-[var(--grey-border)] pt-3">
                        {momentLinks.map((m) => (
                          <Link
                            key={m.id}
                            href={`/${params.area}/${params.persona}/moment/${m.id}`}
                            className="rounded-full bg-[#f0f4ff] px-2 py-0.5 text-[10px] font-semibold text-[var(--blue-solid)] ring-1 ring-[var(--grey-border)] hover:ring-[var(--blue-primary)]"
                          >
                            {m.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
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
