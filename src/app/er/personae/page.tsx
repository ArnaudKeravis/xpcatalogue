import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { PersonaPortraitCard } from '@/components/catalogue/PersonaPortraitCard';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { ER_BOK_PERSONAS } from '@/lib/data/er';
import { ER_CLIENT_BOK } from '@/lib/data/er';
import { getCatalogueData } from '@/lib/notion';
import { erPaths, readErSegment } from '@/lib/erNav';

export const revalidate = 3600;

export default async function ErPersonaePage() {
  const data = await getCatalogueData();
  const work = data.areas.work;
  if (!work) notFound();

  const erSegment = readErSegment(headers());
  const operator = data.personas.find((p) => p.id === 'operator-work' && p.area === 'work');

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
              <Link href={erPaths.home(erSegment)} className="hover:underline">
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

            {work.isometricUrl ? (
              <div className="mt-4 flex min-h-0 flex-1 items-center justify-center lg:mt-6">
                <img
                  src={work.isometricUrl}
                  alt={`${work.label} isometric illustration`}
                  className="max-h-full w-auto max-w-full object-contain"
                  loading="eager"
                />
              </div>
            ) : null}
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
              {ER_BOK_PERSONAS.map((bp) => (
                <StaggerItem key={bp.id} className="min-h-0">
                  <BoKPortraitCard
                    href={erPaths.persona(erSegment, bp.id)}
                    profileKey={bp.profileKey}
                    name={bp.name}
                    role={bp.role}
                    teaser={bp.generalDescription}
                  />
                </StaggerItem>
              ))}
              <StaggerItem key="client" className="min-h-0">
                <BoKPortraitCard
                  href={erPaths.persona(erSegment, 'client')}
                  profileKey={ER_CLIENT_BOK.profileKey}
                  name={ER_CLIENT_BOK.name}
                  role={ER_CLIENT_BOK.role}
                  teaser={ER_CLIENT_BOK.generalDescription}
                />
              </StaggerItem>
              {operator ? (
                <StaggerItem key="operator" className="min-h-0">
                  <PersonaPortraitCard
                    persona={operator}
                    href={erPaths.persona(erSegment, 'operator')}
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

function BoKPortraitCard({
  href,
  profileKey,
  name,
  role,
  teaser,
}: {
  href: string;
  profileKey: string;
  name: string;
  role: string;
  teaser: string;
}) {
  return (
    <div
      className="group relative flex h-full min-h-0 flex-col overflow-hidden rounded-3xl bg-[var(--surface-card)] transition-[transform,box-shadow] duration-[var(--motion-base)] ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
      style={{ boxShadow: 'var(--shadow-tile)' }}
    >
      <Link
        href={href}
        className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--blue-primary)]"
        aria-label={`Open ${name} profile`}
      />
      <div className="relative min-h-0 flex-1 overflow-hidden bg-gradient-to-br from-[#0f2744] via-[#123a5c] to-[#0d3d35] p-4">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)',
            backgroundSize: '10px 10px',
          }}
          aria-hidden
        />
        <span className="relative z-[1] rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white/85">
          {profileKey}
        </span>
        <div className="relative z-[1] mt-6 flex h-16 w-16 items-center justify-center rounded-full text-xl font-extrabold text-white shadow-lg ring-2 ring-white/30">
          {name[0]}
        </div>
        <p className="relative z-[1] mt-4 truncate text-lg font-extrabold text-white">{name}</p>
        <p className="relative z-[1] truncate text-xs font-medium text-white/80">{role}</p>
        <p className="relative z-[1] mt-2 line-clamp-3 text-xs leading-relaxed text-white/75">{teaser}</p>
      </div>
      <div className="flex flex-shrink-0 items-center justify-between gap-2 border-t border-[var(--grey-border)] bg-white px-4 py-2.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--blue-primary)]">
          Open journey
        </span>
        <span className="text-[var(--blue)]/50 transition-transform group-hover:translate-x-0.5" aria-hidden>
          →
        </span>
      </div>
    </div>
  );
}
