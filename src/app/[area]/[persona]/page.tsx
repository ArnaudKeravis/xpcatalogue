import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JourneyMap } from '@/components/catalogue/JourneyMap';
import { MomentTimeline } from '@/components/catalogue/MomentTimeline';
import { PersonaProfile } from '@/components/catalogue/PersonaProfile';
import { FavouriteButton } from '@/components/ui/FavouriteButton';
import { ShareButton } from '@/components/ui/ShareButton';
import { getMomentsForModuleName } from '@/lib/queries/journey';
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

  // Only show modules that actually apply to this persona's journey — not the full 25.
  // A module is "relevant" when at least one moment in the persona's day references it.
  const journeyModuleNames = new Set(steps.flatMap((s) => s.modules));
  const allModules = Object.values(modules);
  const relevantModules = allModules
    .filter((m) => journeyModuleNames.has(m.name))
    .sort((a, b) => a.name.localeCompare(b.name));
  const totalModuleCount = allModules.length;

  const personaHref = `/${params.area}/${params.persona}`;

  return (
    <div className="flex flex-1 flex-col bg-[var(--surface)]">
      <div className="flex-1">
        {/* ── 0. Action strip (Save / Share) ──────────────────────── */}
        <div
          className="flex flex-wrap items-center justify-end gap-2 px-4 pb-0 pt-4 md:px-10 lg:px-14 print:hidden"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <FavouriteButton
            kind="persona"
            id={`${persona.area}/${persona.id}`}
            label={persona.fullName}
            href={personaHref}
            meta={`${areaConfig.label} · ${persona.role}`}
            variant="pill"
          />
          <ShareButton
            title={`${persona.fullName} — ${areaConfig.label}`}
            text={`${persona.role} · ${persona.name}`}
            url={personaHref}
          />
        </div>

        {/* ── 1. Persona profile hero ────────────────────────────────── */}
        <PersonaProfile persona={persona} />

        {/* ── 1b. Moment timeline strip ─────────────────────────────── */}
        <MomentTimeline
          area={params.area}
          personaId={params.persona}
          steps={steps}
          accentColor={persona.color}
        />

        {/* ── 2. Consumer journey map ────────────────────────────────── */}
        <section className="px-4 pb-6 pt-10 md:px-10 lg:px-14" aria-label="Consumer journey">
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
            Each moment below represents a key step in {persona.name}&apos;s day. Tap a moment to
            see the modules and solutions that apply.
          </p>
          <JourneyMap
            steps={steps}
            area={params.area}
            persona={params.persona}
            journeyMapImage={persona.journeyMapImage}
            journeyHotspots={persona.journeyHotspots}
          />
        </section>

        {/* ── 3. Experience Modules (filtered to this persona's journey)
              Parked at the bottom for now — we're still evaluating whether
              this grid earns its space alongside the journey + moment pages. */}
        <section
          className="mx-4 mb-16 mt-6 rounded-brand-xl px-4 py-8 md:mx-10 md:px-8 md:py-10 lg:mx-14"
          style={{ background: '#e0e6f9' }}
          aria-labelledby="section-experience-modules"
        >
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <div>
              <h2
                id="section-experience-modules"
                className="mb-1 text-xl font-extrabold text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Modules that apply to {persona.name}&rsquo;s day
              </h2>
              <p
                className="max-w-2xl text-sm leading-relaxed text-[var(--blue)]/70"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {relevantModules.length === 0
                  ? `No modules are currently mapped to ${persona.name}'s journey. Browse the full catalogue to explore all ${totalModuleCount} modules.`
                  : `${relevantModules.length} of ${totalModuleCount} modules in the catalogue show up across ${persona.name}'s day. Tap a module to see every solution inside it, or revisit the journey above for a moment-by-moment view.`}
              </p>
            </div>
            {relevantModules.length > 0 ? (
              <Link
                href="/solutions"
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--grey-border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--blue)] transition-colors hover:bg-[var(--icon-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
              >
                See all {totalModuleCount} modules
              </Link>
            ) : null}
          </div>

          {relevantModules.length > 0 ? (
            <ul
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
              aria-label={`Modules relevant to ${persona.name}'s journey`}
            >
              {relevantModules.map((mod) => {
                const momentLinks = getMomentsForModuleName(mod.name, steps);
                const moduleHref = `/modules/${mod.id}?area=${params.area}&persona=${params.persona}`;
                return (
                  <li key={mod.id}>
                    <div className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-white shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 hover:border-[var(--blue-primary)] hover:shadow-md">
                      <div className="h-1.5 w-full" style={{ background: mod.gradient }} aria-hidden />
                      <div className="flex flex-1 flex-col p-3">
                        <span className="mb-1.5 text-2xl" aria-hidden>{mod.icon}</span>
                        <Link
                          href={moduleHref}
                          className="mb-2 text-sm font-extrabold leading-tight text-[var(--blue)] hover:text-[var(--blue-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {mod.name}
                        </Link>
                        {momentLinks.length > 0 ? (
                          <div
                            className="mt-auto flex flex-wrap gap-1 border-t border-[var(--grey-border)] pt-2"
                            aria-label={`Applies at ${momentLinks.length} moment${momentLinks.length === 1 ? '' : 's'} of the day`}
                          >
                            {momentLinks.map((m) => (
                              <Link
                                key={m.id}
                                href={`/${params.area}/${params.persona}/moment/${m.id}`}
                                className="rounded-full bg-[#f0f4ff] px-2 py-0.5 text-[9px] font-semibold text-[var(--blue-solid)] ring-1 ring-[var(--grey-border)] transition-colors hover:bg-[var(--blue)] hover:text-white hover:ring-[var(--blue)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
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
          ) : null}
        </section>
      </div>
    </div>
  );
}
