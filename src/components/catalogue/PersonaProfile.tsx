'use client';

import { useTransition, type ReactNode } from 'react';
import { Brain, ChatCircle, PushPin, Target, User, WarningCircle } from '@phosphor-icons/react';
import type { AreaConfig, Persona } from '@/lib/data/types';
import { resolvePersonaImage } from '@/lib/data/personaImageResolve';
import {
  formatPersonaIdentityLine,
  PERSONA_WHO_AMI_LEFT_FRAME_CLASS,
  PERSONA_WHO_AMI_LEFT_PLACEMENT,
} from '@/lib/data/personaWhoAmILeftFrame';
import { DownloadCta } from '@/components/ui/DownloadCta';
import { cn } from '@/lib/utils/cn';

/**
 * Persona “Who am I?” — two-panel layout (global, all personas).
 *
 * Left  : Excel identity line + full portrait (`personaWhoAmILeftFrame.ts`)
 * Right : insight quote, then workplace → goals → motivations → needs → pains
 */

interface Props {
  persona: Persona;
  area?: AreaConfig;
  className?: string;
}

function PanelLabel({ children }: { children: string }) {
  return (
    <p
      className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--blue)]/45"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {children}
    </p>
  );
}

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
        : 'bg-[var(--surface)] text-[var(--blue)] ring-1 ring-[var(--grey-border)]';
  const iconClasses =
    tone === 'navy'
      ? 'bg-white/15 text-white'
      : tone === 'amber'
        ? 'bg-white/60 text-[var(--blue)]'
        : 'bg-[var(--icon-bg)] text-[var(--blue)]';

  return (
    <article className={cn('flex flex-col rounded-brand-lg px-4 py-3.5', toneClasses)}>
      <div className="mb-2 flex items-center gap-2">
        <span
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-brand-md',
            iconClasses,
          )}
          aria-hidden
        >
          {icon}
        </span>
        <h4
          className="text-[13px] font-extrabold uppercase leading-tight tracking-[0.06em]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h4>
      </div>
      <ul
        className="list-disc space-y-1 pl-4 text-[13px] leading-snug marker:text-current"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

export function PersonaProfile({ persona, area, className }: Props) {
  const portraitSrc = resolvePersonaImage('full', persona.id, persona.photo);
  const placement = PERSONA_WHO_AMI_LEFT_PLACEMENT;
  const hasWorkplaceStats = (persona.workplaceStats?.length ?? 0) > 0;
  const hasProfessionalGoals = (persona.professionalGoals?.length ?? 0) > 0;
  const [exporting, startExport] = useTransition();

  const handleDownload = () => {
    startExport(async () => {
      const { exportPersonaToPptx } = await import('@/lib/export/pptPersona');
      await exportPersonaToPptx(persona, area);
    });
  };

  return (
    <div className={cn('relative', className)} data-persona={persona.id}>
      <div className="grid gap-4 lg:grid-cols-[minmax(260px,36%)_minmax(0,1fr)] lg:items-stretch lg:gap-5">
        {/* ── Left: identity + full portrait (Figma Who am I? gauche) ─── */}
        <aside
          className="overflow-hidden rounded-brand-xl border border-[var(--grey-border)] bg-white shadow-[var(--shadow-tile)]"
          aria-label={`${persona.fullName} profile`}
        >
          <div className={cn('relative w-full bg-[#f4f6fb]', PERSONA_WHO_AMI_LEFT_FRAME_CLASS)}>
            <p
              className="absolute z-[2] text-[clamp(1rem,2.2vw,1.5rem)] font-extrabold leading-[1.12] text-[var(--blue)]"
              style={{
                fontFamily: 'var(--font-heading)',
                left: placement.identity.left,
                top: placement.identity.top,
                maxWidth: placement.identity.maxWidth,
              }}
            >
              {formatPersonaIdentityLine(persona)}
            </p>

            <div
              className="absolute z-[1] overflow-hidden"
              style={{
                left: placement.fullImage.left,
                top: placement.fullImage.top,
                width: placement.fullImage.width,
                height: placement.fullImage.height,
              }}
            >
              {portraitSrc ? (
                <img
                  src={portraitSrc}
                  alt=""
                  className="h-full w-full object-contain object-bottom"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <div className="flex h-full items-end justify-center pb-4">
                  <User size={120} weight="duotone" color={persona.color} aria-hidden />
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ── Right: insight + workplace + drivers ────────────────────── */}
        <div
          className="flex flex-col gap-4 rounded-brand-xl border border-[var(--grey-border)] bg-white p-4 shadow-[var(--shadow-tile)] md:p-5"
          aria-label={`${persona.fullName} motivations and needs`}
        >
          <section aria-labelledby={`${persona.id}-insight`}>
            <PanelLabel>Insight</PanelLabel>
            <blockquote
              id={`${persona.id}-insight`}
              className="mt-2 flex gap-3 rounded-brand-lg bg-[#f0f4ff] px-4 py-3.5 text-[15px] italic leading-relaxed text-[var(--blue)] ring-1 ring-[var(--grey-border)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <ChatCircle
                size={22}
                weight="duotone"
                className="mt-0.5 shrink-0 text-[var(--blue-primary)]"
                aria-hidden
              />
              <span>&ldquo;{persona.quote}&rdquo;</span>
            </blockquote>
          </section>

          {hasWorkplaceStats ? (
            <section>
              <InfoCard
                title="Workplace"
                icon={<Target size={15} weight="fill" />}
                items={persona.workplaceStats!}
                tone="navy"
              />
            </section>
          ) : null}

          {hasProfessionalGoals ? (
            <section>
              <InfoCard
                title="Professional goals"
                icon={<Target size={15} weight="fill" />}
                items={persona.professionalGoals!}
                tone="amber"
              />
            </section>
          ) : null}

          <section
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
            aria-label="Motivations, needs and pain points"
          >
            <InfoCard
              title="Motivations"
              icon={<Brain size={15} weight="fill" />}
              items={persona.motivations}
            />
            <InfoCard
              title="Key needs"
              icon={<PushPin size={15} weight="fill" />}
              items={persona.needs}
            />
            <InfoCard
              title="Pain points"
              icon={<WarningCircle size={15} weight="fill" />}
              items={persona.pains}
            />
          </section>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <DownloadCta
          label="Download persona"
          pending={exporting}
          onClick={handleDownload}
        />
        <div className="overflow-hidden rounded-md shadow-sm">
          <img
            src="/images/catalogue/assets/brand/sodexo-logotype-2021.jpg"
            alt="Sodexo"
            width={1024}
            height={576}
            className="h-6 w-auto max-w-[min(160px,38vw)] md:h-7"
          />
        </div>
      </div>
    </div>
  );
}
