import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { PersonaPortraitCard } from '@/components/catalogue/PersonaPortraitCard';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { ER_BOK_PERSONAS, ER_CLIENT_BOK, erBoKAsPersona } from '@/lib/data/er';
import { getCatalogueData } from '@/lib/notion';
import { erPaths, readErLinkMode } from '@/lib/erNav';

export const revalidate = 3600;

export default async function ErPersonaePage() {
  const data = await getCatalogueData();
  const work = data.areas.work;
  if (!work) notFound();

  const erLinkMode = readErLinkMode(headers());
  const operator = data.personas.find((p) => p.id === 'operator-work' && p.area === 'work');
  const journeyTemplate = data.personas.find((p) => p.area === 'work' && p.id === 'white-collar');
  if (!journeyTemplate) notFound();

  return (
    <div className="flex flex-1 flex-col" style={{ background: '#f4f6fb' }}>
      <div className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(160deg, ${work.color}18 0%, #f4f6fb 60%)` }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col gap-6 px-6 py-6 md:px-10 md:py-8 lg:grid lg:grid-cols-[minmax(0,38%)_minmax(0,62%)] lg:gap-10">
          <section className="flex min-h-0 flex-col">
            <nav className="text-xs font-semibold text-[var(--blue)]/60">
              <Link href={erPaths.home(erLinkMode)} className="hover:underline">
                Home
              </Link>
              <span className="px-1">/</span>
              <span className="text-[var(--blue)]">E&amp;R personae</span>
            </nav>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <h1
                className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold leading-none tracking-tight"
                style={{ fontFamily: 'var(--font-heading)', color: work.color }}
              >
                Energy &amp; Resources
              </h1>
              <p
                className="mb-1 max-w-md text-[clamp(0.9rem,1.4vw,1.125rem)] font-semibold leading-snug text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {work.tagline}
              </p>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--blue)]/80">
              Eight profiles for IFM storytelling: six BoK Energy &amp; Mining archetypes from segmentation,
              one client sponsor lens, and one operator journey — each opens the same rich journey experience as
              the Work catalogue (moments, map, modules).
            </p>

            {/* E&R-specific isometric: open-pit mine site (overrides the Work area's
                building isometric so the visual matches the segment's stories). */}
            <div className="mt-4 flex min-h-0 flex-1 items-center justify-center lg:mt-6">
              <img
                src="/images/catalogue/assets/areas/er-area-info-iso.png"
                alt="Energy & Resources isometric illustration — industrial campus"
                className="max-h-full w-auto max-w-full object-contain"
                loading="eager"
              />
            </div>
          </section>

          <section className="flex min-h-0 flex-col">
            <div>
              <h2
                className="text-[clamp(1.125rem,2.2vw,1.5rem)] font-extrabold text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Key personae in <span style={{ color: work.color }}>Energy &amp; Resources</span>
              </h2>
              <p
                className="mt-1 text-xs text-gray-500 md:text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Select a profile to explore the journey — moments follow the E&amp;R deck structure mapped to the
                Work white-collar arc for catalogue depth.
              </p>
            </div>

            <Stagger className="mt-3 grid min-h-0 flex-1 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:mt-4 lg:grid-cols-4">
              {ER_BOK_PERSONAS.map((bp) => {
                const display = erBoKAsPersona(bp, journeyTemplate);
                return (
                  <StaggerItem key={bp.id} className="min-h-0">
                    <PersonaPortraitCard
                      persona={display}
                      href={erPaths.persona(erLinkMode, bp.id)}
                      areaConfig={work}
                    />
                  </StaggerItem>
                );
              })}
              <StaggerItem key="client" className="min-h-0">
                <PersonaPortraitCard
                  persona={{
                    ...erBoKAsPersona(ER_CLIENT_BOK, journeyTemplate),
                    profileEyebrow: 'E&R · Client',
                  }}
                  href={erPaths.persona(erLinkMode, 'client')}
                  areaConfig={work}
                />
              </StaggerItem>
              {operator ? (
                <StaggerItem key="operator" className="min-h-0">
                  <PersonaPortraitCard
                    persona={operator}
                    href={erPaths.persona(erLinkMode, 'operator')}
                    areaConfig={work}
                  />
                </StaggerItem>
              ) : null}
            </Stagger>
          </section>
        </div>
      </div>
    </div>
  );
}
