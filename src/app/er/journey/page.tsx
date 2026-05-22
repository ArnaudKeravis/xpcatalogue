import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { PersonaExperienceBody } from '@/components/catalogue/PersonaExperienceBody';
import {
  ER_BOK_PERSONAS,
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

      <div className="mx-auto w-full max-w-[1600px] px-4 pb-16 md:px-10 lg:px-14">
        <details className="rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] shadow-[var(--shadow-sm)]">
          <summary
            className="cursor-pointer list-none px-5 py-4 text-sm font-extrabold text-[var(--blue)] marker:content-none [&::-webkit-details-marker]:hidden"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            BoK home-to-home phases (editorial reference)
          </summary>
          <ol className="space-y-6 border-t border-[var(--grey-border)] px-5 pb-5 pt-4">
            {ER_HOME_TO_HOME_JOURNEY.map((phase, idx) => (
              <li key={phase.id} className="flex gap-4">
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
                </div>
              </li>
            ))}
          </ol>
        </details>

        <p className="mt-6 text-sm text-[var(--blue)]/75">
          Profile-specific heatmaps:{' '}
          <Link href={erPaths.personae(erLinkMode)} className="font-semibold text-[var(--blue-primary)] hover:underline">
            browse personae
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
