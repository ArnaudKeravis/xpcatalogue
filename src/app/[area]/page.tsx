import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { Navbar } from '@/components/layout/Navbar';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { getCatalogueData } from '@/lib/notion';
import { PERSONA_PORTRAIT_URL } from '@/lib/data/personaPortraits';
import type { Area, Persona } from '@/lib/data/types';

export const revalidate = 3600;

const AREA_KEYS = new Set<Area>(['work', 'learn', 'heal', 'play']);

interface Props {
  params: { area: string };
}

function PersonaPortraitCard({ persona, href }: { persona: Persona; href: string }) {
  const portraitSrc = persona.photo ?? PERSONA_PORTRAIT_URL[persona.id];
  const eyebrow = persona.profileEyebrow ?? '';

  return (
    <Link
      href={href}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[20px] bg-white transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl"
      style={{ boxShadow: '0 4px 20px rgba(41,56,150,0.10)' }}
    >
      {/* Portrait area — dotted art background, portrait fills from bottom */}
      <div
        className="relative aspect-[3/4] overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${persona.color}1a 0%, ${persona.color}33 100%)`,
        }}
      >
        {/* Dotted pattern, matches persona profile hero */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(41, 56, 150, 0.18) 1px, transparent 1px)',
            backgroundSize: '10px 10px',
          }}
          aria-hidden
        />

        <img
          src={portraitSrc}
          alt={persona.fullName}
          className="absolute bottom-0 left-1/2 h-[108%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
        />

        {/* Eyebrow badge top-left */}
        {eyebrow && (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
            style={{ background: 'rgba(0, 26, 114, 0.55)', backdropFilter: 'blur(4px)' }}
          >
            {eyebrow}
          </span>
        )}

        {/* Soft bottom fade to accent bar */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-20"
          style={{ background: `linear-gradient(to top, ${persona.color}dd, transparent)` }}
        />
      </div>

      {/* Name bar */}
      <div
        className="flex items-center justify-between gap-2 px-4 py-3"
        style={{ background: persona.color }}
      >
        <div className="min-w-0">
          <p
            className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-white/75"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {persona.name}
          </p>
          <p
            className="truncate text-sm font-extrabold leading-tight text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {persona.fullName}
          </p>
          <p className="truncate text-[11px] font-medium text-white/80" style={{ fontFamily: 'var(--font-body)' }}>
            {persona.role}
          </p>
        </div>
        <ArrowRight
          size={18}
          weight="bold"
          className="shrink-0 text-white/85 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>
    </Link>
  );
}

export default async function AreaPage({ params }: Props) {
  const { personas, areas } = await getCatalogueData();
  if (!AREA_KEYS.has(params.area as Area)) notFound();

  const areaConfig = areas[params.area as Area];
  if (!areaConfig) notFound();

  const areaPersonas = personas.filter((p) => p.area === params.area);

  return (
    <div className="flex min-h-screen flex-col" style={{ background: '#f4f6fb' }}>
      <Navbar
        hideTitle
        title={areaConfig.label}
        backHref="/areas"
        breadcrumb={[{ label: 'Areas', href: '/areas' }, { label: areaConfig.label }]}
      />

      <main id="main-content" className="flex-1">
        {/* ── Hero: large isometric + area label ─────────────────── */}
        <div className="relative overflow-hidden">
          {/* Gradient background */}
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(160deg, ${areaConfig.color}18 0%, #f4f6fb 60%)` }}
            aria-hidden
          />

          <div className="relative z-10 px-6 pb-0 pt-8 md:px-12 md:pt-10">
            {/* Area label + tagline */}
            <div className="mb-4 flex flex-wrap items-end gap-3">
              <h1
                className="text-[clamp(3rem,8vw,6rem)] font-extrabold leading-none tracking-tight"
                style={{ fontFamily: 'var(--font-heading)', color: areaConfig.color }}
              >
                {areaConfig.label}
              </h1>
              <p
                className="mb-2 max-w-lg text-[clamp(1rem,2vw,1.25rem)] font-semibold leading-snug text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {areaConfig.tagline}
              </p>
            </div>

            {/* Isometric illustration */}
            {areaConfig.isometricUrl ? (
              <div className="mx-auto max-w-5xl">
                <img
                  src={areaConfig.isometricUrl}
                  alt={`${areaConfig.label} isometric illustration`}
                  className="h-auto w-full object-contain"
                  loading="eager"
                />
              </div>
            ) : null}
          </div>
        </div>

        {/* ── Persona grid ─────────────────────────────────────────── */}
        <div className="px-6 pb-16 pt-8 md:px-12">
          <h2
            className="mb-2 text-[clamp(1.25rem,3vw,1.75rem)] font-extrabold text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Key personas in{' '}
            <span style={{ color: areaConfig.color }}>{areaConfig.label}</span>
          </h2>
          <p
            className="mb-8 text-sm text-gray-500"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Select a persona to explore their journey and discover tailored solutions.
          </p>

          <Stagger className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {areaPersonas.map((persona) => (
              <StaggerItem key={persona.id}>
                <PersonaPortraitCard
                  persona={persona}
                  href={`/${params.area}/${persona.id}`}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </main>
    </div>
  );
}
