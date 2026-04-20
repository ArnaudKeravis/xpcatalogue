import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Books,
  Car,
  Coffee,
  Desktop,
  DoorOpen,
  ForkKnife,
  GraduationCap,
  Heart,
  Knife,
  Play,
  SoccerBall,
  Stethoscope,
  Truck,
  X,
} from '@phosphor-icons/react/dist/ssr';
import type { Icon, IconWeight } from '@phosphor-icons/react';
import { Navbar } from '@/components/layout/Navbar';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { getCatalogueData } from '@/lib/notion';
import { PERSONA_PORTRAIT_URL } from '@/lib/data/personaPortraits';
import type { Area, Module } from '@/lib/data/types';

export const revalidate = 3600;

const AREA_KEYS = new Set<Area>(['work', 'learn', 'heal', 'play']);

const MOMENT_ICONS: Record<string, Icon> = {
  commute: Car,
  'welcome-area': DoorOpen,
  workplace: Desktop,
  'wellbeing-break': Heart,
  'food-beverage-work': ForkKnife,
  'arrival-campus': Car,
  'morning-class': GraduationCap,
  'lunch-break': ForkKnife,
  'study-session': Books,
  'morning-rounds': Stethoscope,
  'meal-service': ForkKnife,
  'meal-distribution': Truck,
  'kitchen-prep': Knife,
  'pre-match': SoccerBall,
  'peak-service': ForkKnife,
  'half-time': Coffee,
  'full-time': SoccerBall,
  'networking-lunch': ForkKnife,
};

interface Props {
  params: { area: string; persona: string; momentId: string };
}

function moduleByName(modules: Record<string, Module>, name: string): Module | undefined {
  return Object.values(modules).find((m) => m.name === name);
}

function MomentIcon({
  momentId,
  weight,
  className,
}: {
  momentId: string;
  weight?: IconWeight;
  className?: string;
}) {
  const Cmp = MOMENT_ICONS[momentId] ?? Car;
  return <Cmp weight={weight ?? 'duotone'} className={className} aria-hidden />;
}

export default async function MomentPage({ params }: Props) {
  const { personas, areas, modules, journeySteps, solutions } = await getCatalogueData();
  if (!AREA_KEYS.has(params.area as Area)) notFound();

  const areaConfig = areas[params.area as Area];
  if (!areaConfig) notFound();

  const persona = personas.find((p) => p.id === params.persona && p.area === params.area);
  if (!persona) notFound();

  if (!persona.steps.includes(params.momentId)) notFound();

  const step = journeySteps[params.momentId];
  if (!step) notFound();

  const moduleCards = step.modules
    .map((name) => moduleByName(modules, name))
    .filter((m): m is Module => Boolean(m));

  const mapImage = persona.journeyMapImage;
  const portraitSrc = persona.photo ?? PERSONA_PORTRAIT_URL[persona.id];
  const eyebrow = persona.profileEyebrow ?? 'Consumer';

  const solutionsCountFor = (moduleName: string) =>
    solutions.filter((s) => s.module === moduleName).length;

  return (
    <div className="relative flex min-h-screen flex-col bg-[#E8EEFB]">
      <Navbar
        hideTitle
        title={`${areaConfig.label} · ${persona.name} · ${step.label}`}
        backHref={`/${params.area}/${params.persona}`}
        breadcrumb={[
          { label: areaConfig.label, href: `/${params.area}` },
          { label: persona.name, href: `/${params.area}/${params.persona}` },
          { label: step.label },
        ]}
      />

      {/* ── Journey image (background) ───────────────────────────── */}
      <div className="relative z-0 h-[36vh] w-full overflow-hidden sm:h-[40vh] md:h-[44vh] lg:h-[46vh]">
        {mapImage ? (
          <img
            src={mapImage}
            alt="Journey map"
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ background: `linear-gradient(135deg, ${areaConfig.color}22 0%, #E8EEFB 70%)` }}
          />
        )}
        {/* Fade out toward the card to keep focus below */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#E8EEFB]" />
      </div>

      {/* ── Moment overlay card ─────────────────────────────────── */}
      <main id="main-content" className="relative z-10 -mt-16 flex-1 px-4 pb-10 md:-mt-24 md:px-8 lg:-mt-32 lg:px-12">
        <article
          className="mx-auto flex w-full max-w-[1280px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_rgba(41,56,150,0.18)]"
        >
          {/* ── Top: persona mini-card + moment description ─────── */}
          <div className="grid gap-6 p-5 md:grid-cols-[260px_minmax(0,1fr)] md:gap-8 md:p-7 lg:grid-cols-[300px_minmax(0,1fr)]">
            {/* Persona mini-card */}
            <aside
              className="flex flex-col items-start gap-3 rounded-2xl border border-[var(--grey-border)] bg-white p-4 md:p-5"
              style={{ boxShadow: '0 4px 14px rgba(41,56,150,0.06)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full"
                  style={{
                    background: `${persona.color}22`,
                    backgroundImage:
                      'radial-gradient(circle, rgba(41, 56, 150, 0.22) 1px, transparent 1px)',
                    backgroundSize: '6px 6px',
                  }}
                >
                  {portraitSrc ? (
                    <img
                      src={portraitSrc}
                      alt={persona.fullName}
                      className="absolute bottom-0 left-1/2 h-[150%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom"
                    />
                  ) : (
                    <span className="text-2xl">{persona.emoji}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/60"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {eyebrow}
                  </p>
                  <p
                    className="text-lg font-extrabold leading-tight text-[var(--blue)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {areaConfig.label}
                  </p>
                  <p
                    className="text-sm font-semibold leading-tight"
                    style={{ color: 'var(--teal)', fontFamily: 'var(--font-heading)' }}
                  >
                    {persona.role}
                  </p>
                </div>
              </div>

              <div className="my-1 h-px w-full bg-[var(--grey-border)]" aria-hidden />

              <p
                className="text-sm font-bold text-[var(--blue)]/70"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Moment
              </p>
              <p
                className="-mt-2 text-base font-extrabold leading-tight text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {step.label}
              </p>

              {/* Moment isometric tile — Phosphor icon on tinted tile (placeholder until per-moment art exists) */}
              <div
                className="mt-1 flex aspect-[4/3] w-full items-center justify-center rounded-xl"
                style={{ background: `${areaConfig.color}1a` }}
                aria-hidden
              >
                <MomentIcon
                  momentId={step.id}
                  weight="duotone"
                  className="h-20 w-20"
                />
              </div>
            </aside>

            {/* Moment description */}
            <div className="flex min-w-0 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1
                    className="text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-none text-[var(--blue)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {step.label}
                  </h1>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--grey-border)] bg-white px-3 py-1.5 text-xs font-bold text-[var(--blue)] transition-colors hover:bg-[#f0f4ff]"
                    style={{ fontFamily: 'var(--font-body)' }}
                    aria-label="Listen to this moment"
                  >
                    Listen
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--blue)] text-white">
                      <Play size={10} weight="fill" />
                    </span>
                  </button>
                  <Link
                    href={`/${params.area}/${params.persona}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
                    aria-label="Close moment"
                  >
                    <X size={16} weight="bold" />
                  </Link>
                </div>
              </div>

              {step.description ? (
                <p
                  className="mt-3 max-w-3xl text-sm font-semibold leading-relaxed text-[var(--blue)]/80 md:text-base"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {step.description}
                </p>
              ) : null}

              {/* Touchpoints (optional) */}
              {step.touchpoints &&
              ((step.touchpoints.physical ?? []).length > 0 ||
                (step.touchpoints.digital ?? []).length > 0) ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: 'Physical', items: step.touchpoints.physical ?? [], color: 'var(--blue)' },
                    { label: 'Digital', items: step.touchpoints.digital ?? [], color: 'var(--teal)' },
                  ].map(({ label, items, color }) =>
                    items.length > 0 ? (
                      <div
                        key={label}
                        className="rounded-xl border border-[var(--grey-border)] bg-[#f8faff] px-4 py-3"
                      >
                        <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[var(--blue)]/70">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                          {label} touchpoints
                        </p>
                        <ul
                          className="space-y-1 text-xs leading-relaxed text-gray-600"
                          style={{ fontFamily: 'var(--font-body)' }}
                        >
                          {items.map((item, i) => (
                            <li key={i} className="flex gap-1.5">
                              <span className="mt-0.5 shrink-0 font-bold" style={{ color }}>·</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* ── Bottom: modules row ────────────────────────────── */}
          <div
            className="flex flex-col gap-4 border-t border-[var(--grey-border)] bg-[#f8faff] px-5 py-6 md:px-7 md:py-7"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2
                className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Modules
              </h2>
              <p
                className="text-[11px] font-semibold text-gray-500"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {moduleCards.length} module{moduleCards.length !== 1 ? 's' : ''} for this moment
              </p>
            </div>

            {moduleCards.length > 0 ? (
              <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {moduleCards.map((mod) => {
                  const href = `/modules/${mod.id}?area=${params.area}&persona=${params.persona}&momentId=${encodeURIComponent(step.id)}`;
                  const count = solutionsCountFor(mod.name);
                  return (
                    <StaggerItem key={mod.id}>
                      <Link
                        href={href}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--grey-border)] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(41,56,150,0.14)]"
                      >
                        <div
                          className="flex h-28 items-center justify-center text-5xl"
                          style={{ background: mod.gradient }}
                          aria-hidden
                        >
                          <span className="drop-shadow-sm">{mod.icon}</span>
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <h3
                            className="mb-1 text-sm font-extrabold leading-tight text-[var(--blue)]"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
                            {mod.name}
                          </h3>
                          <p
                            className="mb-3 flex-1 text-xs leading-relaxed text-gray-500 line-clamp-2"
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            {mod.description}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--blue-primary)] group-hover:gap-2 transition-all"
                              style={{ fontFamily: 'var(--font-body)' }}
                            >
                              View solutions
                              <ArrowRight size={12} weight="bold" />
                            </span>
                            {count > 0 ? (
                              <span
                                className="rounded-full bg-[#f0f4ff] px-2 py-0.5 text-[10px] font-bold text-[var(--blue)]"
                                style={{ fontFamily: 'var(--font-body)' }}
                              >
                                {count} solution{count !== 1 ? 's' : ''}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </Link>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            ) : (
              <div className="rounded-2xl bg-white p-8 text-center">
                <p className="text-sm text-gray-400" style={{ fontFamily: 'var(--font-body)' }}>
                  No modules are mapped to this moment yet.
                </p>
              </div>
            )}
          </div>

          {/* Footer quick-nav */}
          <div
            className="flex items-center justify-between border-t border-[var(--grey-border)] bg-white px-5 py-3 md:px-7"
          >
            <Link
              href={`/${params.area}/${params.persona}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--blue-primary)] hover:text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <ArrowLeft size={13} weight="bold" />
              Back to journey
            </Link>
            <Link
              href="/solutions"
              className="text-xs font-semibold text-[var(--blue-primary)] hover:text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Browse all solutions →
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
