import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { AreaRoleStories } from '@/components/catalogue/AreaRoleStories';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { FavouriteButton } from '@/components/ui/FavouriteButton';
import { getCatalogueData } from '@/lib/notion';
import { resolvePersonaImage } from '@/lib/data/personaImageResolve';
import type { Area, AreaConfig, Persona } from '@/lib/data/types';

export const revalidate = 3600;

const AREA_KEYS = new Set<Area>(['work', 'learn', 'heal', 'play']);

interface Props {
  params: { area: string };
}

/**
 * Card is flex-column so the portrait grows to fill the grid cell height
 * (needed for the 3×2 no-scroll layout) while the coloured name bar stays fixed.
 */
function PersonaPortraitCard({
  persona,
  href,
  areaConfig,
}: {
  persona: Persona;
  href: string;
  areaConfig: AreaConfig;
}) {
  const portraitSrc = resolvePersonaImage('listing', persona.id, persona.photo);
  const eyebrow = persona.profileEyebrow ?? '';

  return (
    <div
      className="group relative flex h-full min-h-0 flex-col overflow-hidden rounded-3xl bg-[var(--surface-card)] transition-[transform,box-shadow] duration-[var(--motion-base)] ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
      style={{ boxShadow: 'var(--shadow-tile)' }}
    >
      <Link
        href={href}
        className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--blue-primary)]"
        aria-label={`Open ${persona.fullName} journey`}
      />
      <div
        className="relative min-h-0 flex-1 overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${persona.color}1a 0%, ${persona.color}33 100%)`,
        }}
      >
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

        {eyebrow && (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
            style={{ background: 'rgba(0, 26, 114, 0.55)', backdropFilter: 'blur(4px)' }}
          >
            {eyebrow}
          </span>
        )}

        <div className="absolute right-2 top-2 z-20">
          <FavouriteButton
            kind="persona"
            id={`${persona.area}/${persona.id}`}
            label={persona.fullName}
            href={href}
            meta={`${areaConfig.label} · ${persona.role}`}
          />
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-20"
          style={{ background: `linear-gradient(to top, ${persona.color}dd, transparent)` }}
        />
      </div>

      <div
        className="flex flex-shrink-0 items-center justify-between gap-2 px-4 py-2.5"
        style={{ background: persona.color }}
      >
        <div className="min-w-0">
          <p
            className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-white/75"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {persona.name}
          </p>
          <p
            className="truncate text-[13px] font-extrabold leading-tight text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {persona.fullName}
          </p>
          <p
            className="truncate text-[10px] font-medium text-white/80"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {persona.role}
          </p>
        </div>
        <ArrowRight
          size={16}
          weight="bold"
          className="shrink-0 text-white/85 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>
    </div>
  );
}

export default async function AreaPage({ params }: Props) {
  const { personas, areas } = await getCatalogueData();
  if (!AREA_KEYS.has(params.area as Area)) notFound();

  const areaConfig = areas[params.area as Area];
  if (!areaConfig) notFound();

  const areaPersonas = personas.filter((p) => p.area === params.area);

  return (
    <div
      className="flex flex-1 flex-col"
      style={{ background: '#f4f6fb' }}
    >
      <div className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(160deg, ${areaConfig.color}18 0%, #f4f6fb 60%)` }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col gap-6 px-6 py-6 md:px-10 md:py-8 lg:grid lg:grid-cols-[minmax(0,38%)_minmax(0,62%)] lg:gap-10 lg:items-start">
          {/* ── Left column: area identity + iso illustration ──────── */}
          <section className="flex min-h-0 w-full min-w-0 flex-col">
            <div className="flex max-w-2xl flex-wrap items-end gap-3">
              <h1
                className="text-[clamp(2.25rem,4vw,3.25rem)] font-extrabold leading-none tracking-tight"
                style={{ fontFamily: 'var(--font-heading)', color: areaConfig.color }}
              >
                {areaConfig.label}
              </h1>
              <p
                className="mb-1 max-w-md text-[clamp(0.9rem,1.25vw,1.0625rem)] font-semibold leading-snug text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {areaConfig.tagline}
              </p>
            </div>

            {areaConfig.isometricUrl ? (
              <div className="mt-4 flex w-full items-center justify-center lg:mt-6 lg:max-h-[min(52vh,520px)]">
                <img
                  src={areaConfig.isometricUrl}
                  alt={`${areaConfig.label} isometric illustration`}
                  className="h-auto w-full max-h-[min(48vh,420px)] max-w-md object-contain sm:max-h-[min(50vh,460px)] sm:max-w-lg lg:max-h-[min(52vh,500px)] lg:max-w-xl"
                  loading="eager"
                />
              </div>
            ) : null}
          </section>

          {/* ── Right column: personas 3×2 ─────────────────────────── */}
          <section className="flex min-h-0 w-full min-w-0 flex-col">
            <div className="max-w-3xl">
              <h2
                className="text-[clamp(1.125rem,1.75vw,1.375rem)] font-extrabold text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Key personas in{' '}
                <span style={{ color: areaConfig.color }}>{areaConfig.label}</span>
              </h2>
              <p
                className="mt-1 text-xs text-gray-500 md:text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Select a persona to explore their journey and discover tailored solutions.
              </p>
            </div>

            <Stagger className="mt-3 grid min-h-0 flex-1 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-rows-2 md:mt-4">
              {areaPersonas.map((persona) => (
                <StaggerItem key={persona.id} className="min-h-0">
                  <PersonaPortraitCard
                    persona={persona}
                    href={`/${params.area}/${persona.id}`}
                    areaConfig={areaConfig}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        </div>
      </div>

      {/* ── Three voices · one experience ─────────────────────────
         Editorial band that tells the area's story from three perspectives
         (client · employee · operator). Renders only when the area has copy
         — other areas stay clean until the content is provided. */}
      {areaConfig.roleStories ? (
        <AreaRoleStories areaConfig={areaConfig} stories={areaConfig.roleStories} />
      ) : null}
    </div>
  );
}
