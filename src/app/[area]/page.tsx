import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { Navbar } from '@/components/layout/Navbar';
import { getCatalogueData } from '@/lib/notion';
import { PERSONA_FIGMA_PORTRAIT_URL } from '@/lib/data/personaFigmaPortraits';
import type { Area, Persona } from '@/lib/data/types';

export const revalidate = 3600;

const AREA_KEYS = new Set<Area>(['work', 'learn', 'heal', 'play']);

interface Props {
  params: { area: string };
}

function PersonaPortraitCard({ persona, href }: { persona: Persona; href: string }) {
  const portraitSrc = persona.photo ?? PERSONA_FIGMA_PORTRAIT_URL[persona.id];
  const eyebrow = persona.profileEyebrow ?? '';

  return (
    <Link
      href={href}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[20px] bg-white transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl"
      style={{ boxShadow: '0 4px 20px rgba(41,56,150,0.10)' }}
    >
      {/* Portrait area */}
      <div
        className="relative overflow-hidden"
        style={{
          height: 220,
          background: portraitSrc
            ? `linear-gradient(180deg, ${persona.color}22 0%, ${persona.color}44 100%)`
            : persona.color,
        }}
      >
        {portraitSrc ? (
          <img
            src={portraitSrc}
            alt={persona.name}
            className="absolute bottom-0 left-1/2 h-full w-auto max-w-[200%] -translate-x-1/2 object-contain object-bottom transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-8xl">{persona.emoji}</span>
          </div>
        )}
        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-16"
          style={{ background: `linear-gradient(to top, ${persona.color}dd, transparent)` }}
        />
        {/* Eyebrow badge top-left */}
        {eyebrow && (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
            style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}
          >
            {eyebrow}
          </span>
        )}
      </div>

      {/* Name bar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: persona.color }}
      >
        <div>
          <p
            className="text-sm font-extrabold leading-tight text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {persona.name}
          </p>
          <p className="text-[11px] font-medium text-white/75" style={{ fontFamily: 'var(--font-body)' }}>
            {persona.role}
          </p>
        </div>
        <ArrowRight
          size={18}
          weight="bold"
          className="shrink-0 text-white/80 transition-transform duration-200 group-hover:translate-x-0.5"
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

      <main className="flex-1">
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

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {areaPersonas.map((persona) => (
              <PersonaPortraitCard
                key={persona.id}
                persona={persona}
                href={`/${params.area}/${persona.id}`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
