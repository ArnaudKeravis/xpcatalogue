import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JourneyMap } from '@/components/catalogue/JourneyMap';
import { JourneyDownloadButton } from '@/components/catalogue/JourneyDownloadButton';
import { MomentTimeline } from '@/components/catalogue/MomentTimeline';
import { PersonaProfile } from '@/components/catalogue/PersonaProfile';
import { PersonaSideNav } from '@/components/catalogue/PersonaSideNav';
import { FavouriteButton } from '@/components/ui/FavouriteButton';
import { ShareButton } from '@/components/ui/ShareButton';
import { getMomentsForModuleName } from '@/lib/queries/journey';
import { getCatalogueData } from '@/lib/notion';
import { catalogueModuleForJourneyLabel } from '@/lib/data/moduleJourneyResolve';
import { pickModuleVisual } from '@/lib/data/moduleVisuals';
import type { Area, JourneyStep } from '@/lib/data/types';

export const revalidate = 3600;

const AREA_KEYS = new Set<Area>(['work', 'learn', 'heal', 'play']);

interface Props {
  params: { area: string; persona: string };
}

/**
 * Persona page. Three-section narrative anchored by a sticky side rail:
 *   01 · Who am I          → persona profile card
 *   02 · What I do         → moment timeline + isometric journey map
 *   03 · How Sodexo helps  → the subset of modules that actually touch the day
 *
 * The side rail lives at `lg+` widths; below that it collapses to a horizontal
 * chip row that sticks to the top of the viewport when scrolling.
 */
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

  // Only show modules that actually apply to this persona's journey.
  // Labels on steps come from XP flow / editorial maps; catalogue names come from Classeur Modules.xlsx — compare with normalization.
  const journeyModuleNames = new Set(steps.flatMap((s) => s.modules));
  const allModules = Object.values(modules);
  const seen = new Set<string>();
  const relevantModules = Array.from(journeyModuleNames)
    .map((label) => catalogueModuleForJourneyLabel(modules, label))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  const totalModuleCount = allModules.length;

  const personaHref = `/${params.area}/${params.persona}`;

  return (
    <div className="flex flex-1 flex-col bg-[var(--surface)]">
      <div className="mx-auto w-full max-w-[1600px] flex-1 px-4 pb-16 pt-4 md:px-10 lg:px-14">
        {/* ── Action strip ─────────────────────────────────────────────── */}
        <div
          className="flex flex-wrap items-center justify-end gap-2 pb-4 print:hidden"
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

        {/* ── Two-column shell: side rail + main column ────────────────── */}
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <PersonaSideNav accentColor={persona.color} />

          <div className="flex flex-col gap-14">
            {/* ─── 01 · Who am I ────────────────────────────────────── */}
            <section id="who" aria-labelledby="section-who-heading" className="scroll-mt-28">
              <SectionHeader
                number="01"
                eyebrow="Persona"
                title="Who am I"
                subtitle={`${persona.fullName} — ${persona.role}. ${areaConfig.label}.`}
                accentColor={persona.color}
                headingId="section-who-heading"
              />
              <PersonaProfile persona={persona} area={areaConfig} />
            </section>

            {/* ─── 02 · What I do ──────────────────────────────────── */}
            <section id="journey" aria-labelledby="section-journey-heading" className="scroll-mt-28">
              <SectionHeader
                number="02"
                eyebrow="Journey"
                title="What I do"
                subtitle={`A day in ${persona.name}'s shoes — ${steps.length} moments that shape the experience.`}
                accentColor={persona.color}
                headingId="section-journey-heading"
              />

              <MomentTimeline
                area={params.area}
                personaId={params.persona}
                steps={steps}
                accentColor={persona.color}
              />

              <div className="mt-6">
                <JourneyMap
                  steps={steps}
                  area={params.area}
                  persona={params.persona}
                  journeyMapImage={persona.journeyMapImage}
                  journeyHotspots={persona.journeyHotspots}
                />
                <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p
                    className="max-w-2xl text-sm leading-relaxed text-[var(--blue)]/60"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Tap a moment on the map to see the modules and solutions that
                    apply at that point of the day.
                  </p>
                  {persona.journeyMapImage ? (
                    <JourneyDownloadButton
                      persona={persona}
                      area={areaConfig}
                      steps={steps}
                      imageUrl={persona.journeyMapImage}
                      journeyHotspots={persona.journeyHotspots}
                    />
                  ) : null}
                </div>
              </div>
            </section>

            {/* ─── 03 · How Sodexo can help ────────────────────────── */}
            <section
              id="modules"
              aria-labelledby="section-modules-heading"
              className="scroll-mt-28"
            >
              <SectionHeader
                number="03"
                eyebrow="Modules"
                title="How Sodexo can help"
                subtitle={
                  relevantModules.length === 0
                    ? `No modules are currently mapped to ${persona.name}'s journey — browse the full catalogue to explore all ${totalModuleCount}.`
                    : `${relevantModules.length} of ${totalModuleCount} experience modules show up across ${persona.name}'s day.`
                }
                accentColor={persona.color}
                headingId="section-modules-heading"
                action={
                  <Link
                    href="/solutions"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--grey-border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--blue)] transition-colors hover:bg-[var(--icon-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
                  >
                    See all {totalModuleCount} modules
                  </Link>
                }
              />

              {relevantModules.length > 0 ? (
                <ul
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
                  aria-label={`Modules relevant to ${persona.name}'s journey`}
                >
                  {relevantModules.map((mod) => {
                    const momentLinks = getMomentsForModuleName(mod.name, steps);
                    const moduleHref = `/modules/${mod.id}?area=${params.area}&persona=${params.persona}`;
                    const { Icon: ModIcon, weight: modWeight } = pickModuleVisual(mod);
                    return (
                      <li key={mod.id}>
                        <div className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-white shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 hover:border-[var(--blue-primary)] hover:shadow-md">
                          <div
                            className="h-1.5 w-full"
                            style={{ background: mod.gradient }}
                            aria-hidden
                          />
                          <div className="flex flex-1 flex-col p-3">
                            <span className="mb-1.5 inline-flex" aria-hidden>
                              <ModIcon size={24} weight={modWeight} color="var(--blue)" />
                            </span>
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
      </div>
    </div>
  );
}

/* ── Section header ────────────────────────────────────────────────────── */

/**
 * Shared heading block that precedes each of the three persona page sections.
 * Matches the typographic language of the `PersonaSideNav` so the left rail
 * feels like a natural legend for the main column.
 */
function SectionHeader({
  number,
  eyebrow,
  title,
  subtitle,
  accentColor,
  headingId,
  action,
}: {
  number: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  accentColor: string;
  headingId: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-start gap-4">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-brand-md text-white text-sm font-black"
          style={{ background: accentColor, fontFamily: 'var(--font-heading)' }}
          aria-hidden
        >
          {number}
        </span>
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--blue)]/50"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {eyebrow}
          </p>
          <h2
            id={headingId}
            className="mt-0.5 text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold leading-tight text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h2>
          {subtitle ? (
            <p
              className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--blue)]/70"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
