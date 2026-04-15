import type { ReactNode } from 'react';
import { Brain, PushPin, Target, WarningCircle } from '@phosphor-icons/react/dist/ssr';
import type { Persona } from '@/lib/data/types';
import { PERSONA_FIGMA_PORTRAIT_URL } from '@/lib/data/personaFigmaPortraits';
import { cn } from '@/lib/utils/cn';

const HERO_GRADIENT =
  'linear-gradient(90deg, rgb(255, 255, 255) 6.1%, rgba(223, 229, 251, 0.9) 66.28%, rgba(137, 160, 240, 0.631) 119%, rgba(0, 48, 222, 0.2) 123%)';

interface Props {
  persona: Persona;
  className?: string;
}

function ListCard({
  title,
  icon,
  items,
}: {
  title: string;
  icon: ReactNode;
  items: string[];
}) {
  return (
    <div
      className="flex flex-col rounded-[40px] bg-white px-6 py-5 text-[var(--blue)]"
      style={{ boxShadow: 'var(--shadow-benefits)' }}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--icon-bg)] text-[var(--blue)]">
          {icon}
        </span>
        <h3
          className="text-xl font-bold leading-tight text-[var(--blue)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h3>
      </div>
      <ul
        className="list-disc space-y-1.5 pl-6 text-base leading-normal text-[var(--blue)] marker:text-[var(--blue)]"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function PersonaProfileFigma({ persona, className }: Props) {
  const eyebrow = persona.profileEyebrow ?? persona.name;
  const hasRichLeft = (persona.workplaceStats?.length ?? 0) > 0 && (persona.professionalGoals?.length ?? 0) > 0;
  const portraitSrc = persona.photo ?? PERSONA_FIGMA_PORTRAIT_URL[persona.id];

  return (
    <section
      className={cn('relative overflow-hidden rounded-[25px] pb-16 md:pb-20', className)}
      data-persona={persona.id}
      data-layout={hasRichLeft ? 'figma-rich' : 'figma-simple'}
      style={{ background: HERO_GRADIENT }}
    >
      {/* Decorative dot field — Figma “Sans titre” layer */}
      <div
        className="pointer-events-none absolute -left-[20%] top-1/2 h-[min(140%,1200px)] w-[80%] -translate-y-1/2 rotate-[-75deg] opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(41, 56, 150, 0.22) 1.2px, transparent 1.2px)',
          backgroundSize: '14px 14px',
        }}
        aria-hidden
      />

      <div className="relative z-[1] px-4 pb-10 pt-6 md:px-8 lg:px-12">
        {/* Name row — Figma 1635:80136 */}
        <div className="mb-8 flex flex-col gap-1 md:mb-10">
          <p
            className="text-[clamp(1.25rem,3vw,2.5rem)] font-bold text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {eyebrow}
          </p>
          <h2
            className="text-[clamp(2rem,5vw,4rem)] font-extrabold leading-none text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {persona.fullName}
          </h2>
          <p
            className="text-[clamp(1.25rem,2.5vw,2.5rem)] font-semibold text-[var(--teal)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {persona.role}
          </p>
        </div>

        {hasRichLeft ? (
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Left: workplace + goals + quote */}
            <div className="flex flex-col gap-5 lg:col-span-3">
              <div
                className="rounded-[20px] px-4 py-5 text-white"
                style={{ background: 'var(--blue)', boxShadow: 'var(--shadow-benefits)' }}
              >
                <p className="mb-3 text-base font-bold leading-snug" style={{ fontFamily: 'var(--font-body)' }}>
                  {persona.workplaceStats![0]}
                </p>
                <ul className="space-y-1.5 text-base leading-snug" style={{ fontFamily: 'var(--font-body)' }}>
                  {persona.workplaceStats!.slice(1).map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
              <div
                className="rounded-[20px] px-4 py-5 text-[var(--blue)]"
                style={{ background: '#ffd05e', boxShadow: 'var(--shadow-benefits)' }}
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white/60 text-[var(--blue)]">
                    <Target size={22} weight="fill" />
                  </span>
                  <h3
                    className="text-lg font-bold leading-tight text-[var(--blue)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Professional goals
                  </h3>
                </div>
                <ul
                  className="list-disc space-y-1.5 pl-6 text-lg leading-normal marker:text-[var(--blue)]"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {persona.professionalGoals!.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
              <blockquote
                className="rounded-[40px] border border-[var(--grey-border)] bg-white px-7 py-8 text-xl italic leading-normal text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-body)', boxShadow: 'var(--shadow-benefits)' }}
              >
                &ldquo;{persona.quote}&rdquo;
              </blockquote>
            </div>

            {/* Center: portrait on dotted art */}
            <div className="relative flex min-h-[300px] items-end justify-center overflow-hidden rounded-[25px] lg:col-span-4">
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(41, 56, 150, 0.12) 1px, transparent 1px)',
                  backgroundSize: '12px 12px',
                }}
                aria-hidden
              />
              <div className="relative z-[1] flex w-full max-w-md items-end justify-center pb-1 pt-12">
                {portraitSrc ? (
                  <img
                    src={portraitSrc}
                    alt={persona.fullName}
                    className="max-h-[min(520px,58vh)] w-auto object-contain object-bottom"
                  />
                ) : (
                  <span className="text-[120px] leading-none">{persona.emoji}</span>
                )}
              </div>
            </div>

            {/* Right: motivations / pains / needs */}
            <div className="flex flex-col gap-5 lg:col-span-5">
              <ListCard title="Motivations" icon={<Brain size={22} weight="fill" />} items={persona.motivations} />
              <ListCard
                title="Pain points & frustrations"
                icon={<WarningCircle size={22} weight="fill" />}
                items={persona.pains}
              />
              <ListCard title="Key needs" icon={<PushPin size={22} weight="fill" />} items={persona.needs} />
            </div>
          </div>
        ) : (
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
            <div className="relative flex min-h-[260px] items-end justify-center overflow-hidden rounded-[25px]">
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(41, 56, 150, 0.12) 1px, transparent 1px)',
                  backgroundSize: '12px 12px',
                }}
                aria-hidden
              />
              <div className="relative z-[1] flex w-full items-end justify-center pb-2 pt-12">
                {portraitSrc ? (
                  <img
                    src={portraitSrc}
                    alt={persona.fullName}
                    className="max-h-[min(380px,50vh)] w-auto object-contain object-bottom"
                  />
                ) : (
                  <span className="text-[100px] leading-none">{persona.emoji}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <blockquote
                className="rounded-[40px] border border-[var(--grey-border)] bg-white px-6 py-6 text-lg italic leading-relaxed text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-body)', boxShadow: 'var(--shadow-benefits)' }}
              >
                &ldquo;{persona.quote}&rdquo;
              </blockquote>
              <ListCard title="Motivations" icon={<Brain size={22} weight="fill" />} items={persona.motivations} />
              <ListCard
                title="Pain points & frustrations"
                icon={<WarningCircle size={22} weight="fill" />}
                items={persona.pains}
              />
              <ListCard title="Key needs" icon={<PushPin size={22} weight="fill" />} items={persona.needs} />
            </div>
          </div>
        )}

      </div>

      {/* Sodexo mark — official logotype (local asset) */}
      <div className="pointer-events-none absolute bottom-4 right-4 z-[2] md:bottom-6 md:right-8">
        <div className="overflow-hidden rounded-md shadow-md">
          <img
            src="/images/catalogue/figma/sodexo-logotype-2021.jpg"
            alt="Sodexo"
            width={1024}
            height={576}
            className="h-7 w-auto max-w-[min(200px,42vw)] md:h-9"
          />
        </div>
      </div>
    </section>
  );
}
