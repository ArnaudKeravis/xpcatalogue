import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { FavouriteButton } from '@/components/ui/FavouriteButton';
import { resolvePersonaImage } from '@/lib/data/personaImageResolve';
import type { AreaConfig, Persona } from '@/lib/data/types';

/**
 * Card is flex-column so the portrait grows to fill the grid cell height
 * (needed for the 3×2 no-scroll layout) while the coloured name bar stays fixed.
 */
export function PersonaPortraitCard({
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
