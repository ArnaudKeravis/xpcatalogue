import { ArrowRight, Quotes, User } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

interface Props {
  personaName: string;
  fullName: string;
  role: string;
  quote: string;
  areaLabel: string;
  areaColor: string;
  color: string;
  photo?: string;
  href: string;
}

/**
 * "Persona of the day" tile — the right-hand partner to the TodayWidget. Rotates
 * deterministically by calendar day (chosen on the server page).
 */
export function FeaturedPersona({
  personaName,
  fullName,
  role,
  quote,
  areaLabel,
  areaColor,
  color,
  photo,
  href,
}: Props) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--grey-border)] shadow-[var(--shadow-sm)] transition-all duration-[var(--motion-base)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-panel)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
      style={{ background: `linear-gradient(160deg, ${color}22 0%, ${areaColor}15 60%, var(--surface-card) 100%)` }}
    >
      <div className="relative flex-1 overflow-hidden p-6 pb-0">
        <span
          className="absolute right-4 top-4 rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white"
        >
          Featured today
        </span>
        <div className="mb-5 flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white"
            style={{ background: areaColor }}
          >
            {areaLabel}
          </span>
          <span
            className="rounded-full border border-[var(--grey-border)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-semibold text-[var(--blue)]/70"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {role}
          </span>
        </div>

        <h2
          className="text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-tight text-[var(--blue)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Meet {fullName}.
        </h2>
        <p
          className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--blue)]/60"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {personaName} — {areaLabel}
        </p>

        {quote ? (
          <figure className="mt-4 flex items-start gap-2">
            <Quotes size={22} weight="fill" className="shrink-0 text-[var(--blue-primary)]" aria-hidden />
            <blockquote
              className="text-sm italic leading-relaxed text-[var(--blue)]/80"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              &ldquo;{quote}&rdquo;
            </blockquote>
          </figure>
        ) : null}
      </div>

      <div className="relative flex items-end justify-between gap-4 p-6 pt-6">
        <span
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--blue)] px-4 py-2 text-xs font-bold text-white transition-transform group-hover:translate-x-0.5"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Walk their day <ArrowRight size={14} weight="bold" aria-hidden />
        </span>
        <span
          className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[var(--shadow-sm)]"
          style={{ background: color, color: 'white' }}
          aria-hidden
        >
          {photo ? (
            <img
              src={photo}
              alt=""
              className="h-full w-full rounded-full object-cover object-top"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <User size={32} weight="duotone" color="#ffffff" />
          )}
        </span>
      </div>
    </Link>
  );
}
