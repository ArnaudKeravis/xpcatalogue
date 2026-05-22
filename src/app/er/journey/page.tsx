import Link from 'next/link';
import { JourneyMap } from '@/components/catalogue/JourneyMap';
import { MomentTimeline } from '@/components/catalogue/MomentTimeline';
import {
  ER_BOK_HOTSPOTS,
  ER_BOK_JOURNEY_MAP_IMAGE,
  ER_BOK_STEP_IDS,
  ER_BOK_STEPS,
  ER_HOME_TO_HOME_JOURNEY,
} from '@/lib/data/er';
import { getCatalogueData } from '@/lib/notion';

export const revalidate = 3600;

const JOURNEY_MOMENT_BASE = '/er/journey/moment/';
/** Any BoK slug works for moment thumbnails — step ids drive E&R art. */
const TIMELINE_PERSONA_ID = 'remote-lifestyler';

export default async function ErJourneyPage() {
  const { areas } = await getCatalogueData();
  const workArea = areas.work;
  const accentColor = workArea?.color ?? '#293896';
  const steps = ER_BOK_STEP_IDS.map((id) => ER_BOK_STEPS[id]);

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
        Canonical BoK journey — seven moments from departure from home to bed time. Click a hotspot on
        the map or a card below to see modules and innovations for that moment across all E&amp;R
        personae, or open a persona to see profile-specific pains.
      </p>

      <section className="mt-8" aria-labelledby="er-journey-timeline-heading">
        <h2 id="er-journey-timeline-heading" className="sr-only">
          Moments at a glance
        </h2>
        <MomentTimeline
          area="work"
          personaId={TIMELINE_PERSONA_ID}
          steps={steps}
          accentColor={accentColor}
          momentHrefBase={JOURNEY_MOMENT_BASE}
        />
      </section>

      <section className="mt-2" aria-labelledby="er-journey-map-heading">
        <h2
          id="er-journey-map-heading"
          className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--blue)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Interactive journey map
        </h2>
        <JourneyMap
          steps={steps}
          area="work"
          persona={TIMELINE_PERSONA_ID}
          journeyMapImage={ER_BOK_JOURNEY_MAP_IMAGE}
          journeyHotspots={ER_BOK_HOTSPOTS}
          momentHrefBase={JOURNEY_MOMENT_BASE}
        />
        <p
          className="mt-3 text-center text-[11px] font-medium text-[var(--blue)]/65"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Tap a numbered hotspot — modules and solutions are shared; persona pages add BoK profile context.
        </p>
      </section>

      <details className="mt-10 rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] shadow-[var(--shadow-sm)]">
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
                <h3 className="text-lg font-extrabold text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
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
      </details>

      <p className="mt-8 text-sm text-[var(--blue)]/75">
        Profile-specific heatmaps: see BoK PDF pages 41+ or{' '}
        <Link href="/er/personae" className="font-semibold text-[var(--blue-primary)] hover:underline">
          browse personae
        </Link>
        .
      </p>
    </div>
  );
}
