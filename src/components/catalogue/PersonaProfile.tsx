'use client';

import type { ReactNode } from 'react';
import { Brain, DownloadSimple, PushPin, Target, WarningCircle } from '@phosphor-icons/react';
import type { Persona } from '@/lib/data/types';
import { PERSONA_PORTRAIT_URL } from '@/lib/data/personaPortraits';
import { cn } from '@/lib/utils/cn';

/**
 * Persona hero — compact, two-column layout.
 *
 * Left  : portrait (≤ 420px) on a soft dotted field, with a pinned quote card
 *         hanging off its bottom edge so the quote is always visually linked to
 *         the face, not floating somewhere on the page.
 * Right : a flowing grid of focused cards (workplace stats, goals, motivations,
 *         pains, needs). Each card is typographically smaller than before so
 *         the band can breathe at two-thirds its previous height.
 */

const HERO_GRADIENT =
  'linear-gradient(90deg, rgb(255, 255, 255) 6.1%, rgba(223, 229, 251, 0.9) 66.28%, rgba(137, 160, 240, 0.631) 119%, rgba(0, 48, 222, 0.2) 123%)';

interface Props {
  persona: Persona;
  className?: string;
}

/* ── Card primitives ─────────────────────────────────────────────────────── */

function InfoCard({
  title,
  icon,
  items,
  tone = 'white',
}: {
  title: string;
  icon: ReactNode;
  items: string[];
  tone?: 'white' | 'navy' | 'amber';
}) {
  const toneClasses =
    tone === 'navy'
      ? 'bg-[var(--blue)] text-white [&_li]:text-white'
      : tone === 'amber'
        ? 'bg-[#ffd05e] text-[var(--blue)]'
        : 'bg-white text-[var(--blue)]';
  const iconClasses =
    tone === 'navy'
      ? 'bg-white/15 text-white'
      : tone === 'amber'
        ? 'bg-white/60 text-[var(--blue)]'
        : 'bg-[var(--icon-bg)] text-[var(--blue)]';

  return (
    <div
      className={cn(
        'flex flex-col rounded-brand-xl px-5 py-4',
        toneClasses,
      )}
      style={{ boxShadow: 'var(--shadow-benefits)' }}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-brand-md',
            iconClasses,
          )}
        >
          {icon}
        </span>
        <h3
          className="text-[15px] font-extrabold uppercase leading-tight tracking-[0.06em]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h3>
      </div>
      <ul
        className="list-disc space-y-1 pl-5 text-[14px] leading-snug marker:text-current"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/* ── Component ──────────────────────────────────────────────────────────── */

export function PersonaProfile({ persona, className }: Props) {
  const eyebrow = persona.profileEyebrow ?? persona.name;
  const portraitSrc = persona.photo ?? PERSONA_PORTRAIT_URL[persona.id];
  const hasWorkplaceStats = (persona.workplaceStats?.length ?? 0) > 0;
  const hasProfessionalGoals = (persona.professionalGoals?.length ?? 0) > 0;

  return (
    <section
      className={cn('relative overflow-hidden rounded-brand-xl pb-10 md:pb-12', className)}
      data-persona={persona.id}
      style={{ background: HERO_GRADIENT }}
    >
      {/* Decorative dot field */}
      <div
        className="pointer-events-none absolute -left-[20%] top-1/2 h-[min(140%,1000px)] w-[80%] -translate-y-1/2 rotate-[-75deg] opacity-[0.3]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(41, 56, 150, 0.22) 1.2px, transparent 1.2px)',
          backgroundSize: '14px 14px',
        }}
        aria-hidden
      />

      <div className="relative z-[1] px-4 pb-6 pt-5 md:px-8 md:pt-6">
        {/* ── Name row ─────────────────────────────────────────────────── */}
        <div className="mb-5 flex flex-col gap-0.5 md:mb-6">
          <p
            className="text-[clamp(0.95rem,1.6vw,1.25rem)] font-bold uppercase tracking-[0.14em] text-[var(--blue)]/70"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {eyebrow}
          </p>
          <h2
            className="text-[clamp(1.875rem,4vw,3rem)] font-extrabold leading-[1.05] text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {persona.fullName}
          </h2>
          <p
            className="text-[clamp(1rem,1.8vw,1.5rem)] font-semibold text-[var(--teal)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {persona.role}
          </p>
        </div>

        {/* ── Main grid: portrait column + card grid ───────────────────── */}
        <div className="grid gap-5 lg:grid-cols-[minmax(260px,1fr)_minmax(0,1.8fr)] lg:gap-7">
          {/* Portrait pane */}
          <div className="relative flex flex-col gap-3">
            <div className="relative overflow-hidden rounded-brand-xl">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(41, 56, 150, 0.12) 1px, transparent 1px)',
                  backgroundSize: '14px 14px',
                }}
                aria-hidden
              />
              <div className="relative z-[1] flex min-h-[280px] items-end justify-center pt-3 md:min-h-[360px] lg:min-h-[420px]">
                {portraitSrc ? (
                  <img
                    src={portraitSrc}
                    alt={persona.fullName}
                    className="h-auto w-full max-w-[380px] object-contain object-bottom md:max-w-[420px]"
                  />
                ) : (
                  <span className="text-[min(22vw,180px)] leading-none">{persona.emoji}</span>
                )}
              </div>
            </div>

            {/* Quote — sits under portrait so it's tied to the face, not floating */}
            <blockquote
              className="rounded-brand-xl border border-[var(--grey-border)] bg-white px-5 py-4 text-[15px] italic leading-relaxed text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-body)', boxShadow: 'var(--shadow-benefits)' }}
            >
              &ldquo;{persona.quote}&rdquo;
            </blockquote>
          </div>

          {/* Card grid — 1 col on narrow, 2 cols at md+, density tuned so
              5 cards fit a ~420px-tall portrait column without stretching. */}
          <div className="grid gap-4 md:grid-cols-2">
            {hasWorkplaceStats ? (
              <InfoCard
                title="Workplace"
                icon={<Target size={16} weight="fill" />}
                items={persona.workplaceStats!}
                tone="navy"
              />
            ) : null}
            {hasProfessionalGoals ? (
              <InfoCard
                title="Professional goals"
                icon={<Target size={16} weight="fill" />}
                items={persona.professionalGoals!}
                tone="amber"
              />
            ) : null}
            <InfoCard
              title="Motivations"
              icon={<Brain size={16} weight="fill" />}
              items={persona.motivations}
            />
            <InfoCard
              title="Pain points"
              icon={<WarningCircle size={16} weight="fill" />}
              items={persona.pains}
            />
            <InfoCard
              title="Key needs"
              icon={<PushPin size={16} weight="fill" />}
              items={persona.needs}
            />
          </div>
        </div>
      </div>

      {/* ── Download button ────────────────────────────────────────────── */}
      <div className="absolute bottom-3 left-4 z-[2] md:bottom-4 md:left-8">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-[var(--blue)] shadow-sm backdrop-blur-sm transition-colors hover:bg-white print:hidden"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <DownloadSimple size={14} weight="bold" aria-hidden />
          Download persona card
        </button>
      </div>

      {/* ── Sodexo mark ─────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute bottom-3 right-4 z-[2] md:bottom-4 md:right-8">
        <div className="overflow-hidden rounded-md shadow-md">
          <img
            src="/images/catalogue/assets/brand/sodexo-logotype-2021.jpg"
            alt="Sodexo"
            width={1024}
            height={576}
            className="h-6 w-auto max-w-[min(160px,38vw)] md:h-7"
          />
        </div>
      </div>
    </section>
  );
}
