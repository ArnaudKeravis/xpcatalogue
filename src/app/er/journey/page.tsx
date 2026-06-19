import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { PersonaExperienceBody } from '@/components/catalogue/PersonaExperienceBody';
import {
  ER_BOK_PERSONAS,
  ER_BOK_MOMENT_EDITORIAL,
  ER_BOK_STEP_IDS,
  ER_BOK_STEPS,
  ER_HOME_TO_HOME_JOURNEY,
  erBoKAsPersona,
} from '@/lib/data/er';
import { getCatalogueData } from '@/lib/notion';
import { erPaths, readErLinkMode } from '@/lib/erNav';

export const revalidate = 3600;

const JOURNEY_MOMENT_BASE = '/er/journey/moment/';

export default async function ErJourneyPage() {
  const { personas, areas, modules, journeySteps } = await getCatalogueData();
  const workArea = areas.work;
  if (!workArea) notFound();

  const whiteCollar = personas.find((p) => p.area === 'work' && p.id === 'white-collar');
  if (!whiteCollar) notFound();

  const erLinkMode = readErLinkMode(headers());
  const journeyHref = erPaths.journey(erLinkMode);

  // Synthetic persona carrying BoK map + hotspots; links go to segment moment pages.
  const bokTemplate = erBoKAsPersona(ER_BOK_PERSONAS[0], whiteCollar);
  const segmentPersona = {
    ...bokTemplate,
    name: 'FIFO residents',
    fullName: 'Employees — home to home',
    role: 'Shared BoK journey across E&R personae',
    profileEyebrow: 'E&R · BoK',
    photo: '',
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-[var(--grey-border)] bg-[var(--surface)] px-4 py-3 md:px-10 lg:px-14">
        <nav className="mx-auto max-w-[1600px] text-xs font-semibold text-[var(--blue)]/60">
          <Link href={erPaths.home(erLinkMode)} className="hover:underline">
            E&amp;R home
          </Link>
          <span className="px-1">/</span>
          <span className="text-[var(--blue)]">Home-to-home journey</span>
        </nav>
      </div>

      <PersonaExperienceBody
        persona={segmentPersona}
        areaConfig={workArea}
        modules={modules}
        journeySteps={journeySteps}
        linkArea="work"
        linkPersonaId="white-collar"
        personaHref={journeyHref}
        favouriteId="er/journey"
        extraStepLookup={ER_BOK_STEPS}
        momentHrefBase={JOURNEY_MOMENT_BASE}
        hideWhoSection
        hideHeaderActions
        journeyTitle="What we do"
        journeySubtitle={`The canonical BoK arc — ${bokTemplate.steps.length} moments from departure from home to bed time. Tap the map or timeline to see modules and innovations for all personae; open a profile for BoK-specific pains.`}
      />

      <div className="mx-auto w-full max-w-[1600px] space-y-10 px-4 pb-16 md:px-10 lg:px-14">
        <section aria-labelledby="er-journey-moments-heading">
          <h2
            id="er-journey-moments-heading"
            className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Each moment
          </h2>
          <p
            className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--blue)]/80"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Seven shared beats on the BoK map — click through for modules, innovations, and persona-specific
            context.
          </p>
          <ol className="mt-6 space-y-4">
            {ER_BOK_STEP_IDS.map((momentId, idx) => {
              const step = ER_BOK_STEPS[momentId];
              const editorial = ER_BOK_MOMENT_EDITORIAL[momentId];
              const body = editorial.body.trim() || step.description || '';
              return (
                <li
                  key={momentId}
                  className="flex gap-4 rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-sm)]"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--blue-primary)] text-sm font-extrabold text-white"
                    aria-hidden
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`${JOURNEY_MOMENT_BASE}${momentId}`}
                      className="group inline-flex flex-wrap items-baseline gap-2"
                    >
                      <h3
                        className="text-lg font-extrabold text-[var(--blue)] group-hover:text-[var(--blue-primary)]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {step.label}
                      </h3>
                      <span className="text-xs font-bold text-[var(--blue-primary)] opacity-0 transition-opacity group-hover:opacity-100">
                        Open moment →
                      </span>
                    </Link>
                    {editorial.subtitle ? (
                      <p
                        className="mt-1 text-sm font-semibold text-[var(--blue)]/75"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {editorial.subtitle}
                      </p>
                    ) : null}
                    {body ? (
                      <p
                        className="mt-2 text-sm leading-relaxed text-[var(--blue)]/80"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {body}
                      </p>
                    ) : null}
                    {step.modules.length > 0 ? (
                      <p
                        className="mt-3 text-[11px] font-semibold text-[var(--blue)]/55"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {step.modules.length} module{step.modules.length === 1 ? '' : 's'} mapped
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section aria-labelledby="er-journey-phases-heading">
          <h2
            id="er-journey-phases-heading"
            className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Home-to-home phases
          </h2>
          <p
            className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--blue)]/80"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Canonical journey structure from the BoK (section 4). Persona heatmaps in the PDF colour which pains
            matter most per profile — the phases below follow the same home-to-home arc shown on the isometric
            map.
          </p>
          <ol className="mt-6 space-y-6">
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
                  <h3
                    className="text-lg font-extrabold text-[var(--blue)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {phase.title}
                  </h3>
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
        </section>

        <p className="text-sm text-[var(--blue)]/75">
          Profile-specific heatmaps: see BoK PDF pages 41+ or{' '}
          <Link href={erPaths.personae(erLinkMode)} className="font-semibold text-[var(--blue-primary)] hover:underline">
            browse personae
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
