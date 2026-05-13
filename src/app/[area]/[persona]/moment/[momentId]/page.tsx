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
  SoccerBall,
  Stethoscope,
  Truck,
  User,
  X,
} from '@phosphor-icons/react/dist/ssr';
import type { Icon, IconWeight } from '@phosphor-icons/react';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { FavouriteButton } from '@/components/ui/FavouriteButton';
import { ShareButton } from '@/components/ui/ShareButton';
import { MomentScene } from '@/components/catalogue/MomentScene';
import { getCatalogueData } from '@/lib/notion';
import { catalogueModuleForJourneyLabel } from '@/lib/data/moduleJourneyResolve';
import { resolvePersonaImage } from '@/lib/data/personaImageResolve';
import { pickModuleVisual } from '@/lib/data/moduleVisuals';
import { solutionsForModule } from '@/lib/data/moduleSolutions';
import { MOMENT_EDITORIAL } from '@/lib/data/momentEditorial.generated';
import { resolveJourneyMomentImage } from '@/lib/data/journeyMomentVisuals';
import { momentSlugFromStepId } from '@/lib/data/stepIdMomentSlug';
import type { Area, Module, Solution } from '@/lib/data/types';

export const revalidate = 3600;

const AREA_KEYS = new Set<Area>(['work', 'learn', 'heal', 'play']);

const MOMENT_ICONS: Record<string, Icon> = {
  commute: Car,
  'welcome-area': DoorOpen,
  workplace: Desktop,
  'wellbeing-break': Heart,
  'wellbeing-breaktime': Heart,
  'food-beverage-work': ForkKnife,
  'food-beverage-area': ForkKnife,
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

function MomentIcon({
  momentId,
  weight,
  className,
}: {
  momentId: string;
  weight?: IconWeight;
  className?: string;
}) {
  const slug = momentSlugFromStepId(momentId);
  const Cmp = MOMENT_ICONS[slug] ?? Car;
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
    .map((name) => catalogueModuleForJourneyLabel(modules, name))
    .filter((m): m is Module => Boolean(m));

  const mapImage = persona.journeyMapImage;
  const momentIsoImage = resolveJourneyMomentImage(persona.id, step.id);
  const heroImageSrc = momentIsoImage ?? mapImage;
  const heroIsVector = Boolean(heroImageSrc?.endsWith('.svg'));
  const portraitSrc = resolvePersonaImage('face', persona.id, persona.photo);
  const editorialFromWhiteCollar =
    persona.id === 'exemple-minor' && step.id.startsWith('exemple-minor__')
      ? MOMENT_EDITORIAL['white-collar']?.[step.id.replace(/^exemple-minor__/, 'white-collar__')]
      : undefined;
  const editorial = MOMENT_EDITORIAL[persona.id]?.[step.id] ?? editorialFromWhiteCollar;
  const momentSubtitle = editorial?.subtitle?.trim();
  const momentBody = editorial?.body?.trim() || step.description;
  const eyebrow = persona.profileEyebrow ?? 'Consumer';

  // Locate this moment's hotspot on the journey artwork. We use it to (a) draw
  // a focus ring on the full-width journey hero and (b) feed a zoomed crop
  // into the persona mini-card so each moment gets its own "scene" from the
  // same source art, without needing per-moment assets.
  const hotspot = persona.journeyHotspots?.find((h) => h.stepId === step.id);
  const hotspotCenter = hotspot
    ? { left: hotspot.left + (hotspot.w ?? 0) / 2, top: hotspot.top + (hotspot.h ?? 0) / 2 }
    : null;

  const solutionsByModule = (m: Module): Solution[] => solutionsForModule(m, solutions);

  // Position in journey → Before / During / After framing
  const stepIdx = persona.steps.indexOf(step.id);
  const prevStep = stepIdx > 0 ? journeySteps[persona.steps[stepIdx - 1]] : null;
  const nextStep =
    stepIdx < persona.steps.length - 1 ? journeySteps[persona.steps[stepIdx + 1]] : null;

  // Cross-persona — which other personas also have a step called `step.label`?
  const crossPersonas = personas.filter(
    (p) => p.id !== persona.id && p.steps.some((sid) => journeySteps[sid]?.label === step.label)
  );

  const momentHref = `/${params.area}/${params.persona}/moment/${step.id}`;

  return (
    <div className="relative flex flex-1 flex-col bg-[#E8EEFB]">
      {/* ── Journey image (background) ─────────────────────────────
          The full isometric sets context; a soft focus-halo centered on the
          current moment's hotspot tells the eye "you are here". A thin white
          ring plus an accent bloom reads as a cinematographer's spotlight
          rather than a UI hotspot pin. */}
      <div className="relative z-0 h-[36vh] w-full overflow-hidden sm:h-[40vh] md:h-[44vh] lg:h-[46vh]">
        {heroImageSrc ? (
          <img
            src={heroImageSrc}
            alt=""
            className={
              heroIsVector
                ? 'h-full w-full object-contain object-center bg-[#E8EEFB]'
                : 'h-full w-full object-cover object-center'
            }
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ background: `linear-gradient(135deg, ${areaConfig.color}22 0%, #E8EEFB 70%)` }}
          />
        )}

        {/* Focus halo — radial spotlight centered on the moment hotspot.
            Darkens the periphery, brightens the moment's region. */}
        {heroImageSrc && hotspotCenter ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${hotspotCenter.left}% ${hotspotCenter.top}%, transparent 0%, transparent 12%, rgba(0, 12, 60, 0.18) 38%, rgba(0, 12, 60, 0.32) 70%)`,
            }}
          />
        ) : null}

        {/* Accent bloom — a soft colored glow in the moment's neighbourhood */}
        {heroImageSrc && hotspotCenter ? (
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              left: `calc(${hotspotCenter.left}% - 80px)`,
              top: `calc(${hotspotCenter.top}% - 80px)`,
              width: 160,
              height: 160,
              borderRadius: '9999px',
              background: `radial-gradient(circle, ${areaConfig.color}55, transparent 65%)`,
              filter: 'blur(8px)',
            }}
          />
        ) : null}

        {/* Fade out toward the card to keep focus below */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#E8EEFB]" />
      </div>

      {/* ── Moment overlay card ─────────────────────────────────── */}
      <div className="relative z-10 -mt-16 flex-1 px-4 pb-10 md:-mt-24 md:px-8 lg:-mt-32 lg:px-12">
        <article
          className="mx-auto flex w-full max-w-[1280px] flex-col overflow-hidden rounded-brand-2xl bg-white shadow-[0_20px_60px_rgba(41,56,150,0.18)]"
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
                    <User size={26} weight="duotone" color={persona.color} aria-hidden />
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
              {momentSubtitle ? (
                <p
                  className="text-xs font-semibold leading-snug text-[var(--blue)]/75"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {momentSubtitle}
                </p>
              ) : null}

              {/* Moment scene — a zoomed crop of the journey artwork at this
                  moment's hotspot. Gives every moment a bespoke illustration
                  derived from the same isometric source, keeping thematic
                  continuity with the journey map. Falls back to the plain
                  tinted icon tile when we don't have a journey image or
                  hotspot for this moment. */}
              {momentIsoImage ? (
                <div className="mt-1 w-full overflow-hidden rounded-brand-lg ring-1 ring-[var(--grey-border)]">
                  <div className="relative aspect-[4/3] w-full bg-[var(--surface)]">
                    {/* Dedicated moment SVG — already framed; no journey hotspot crop. */}
                    <img
                      src={momentIsoImage}
                      alt=""
                      className="absolute inset-0 h-full w-full object-contain object-center p-2"
                    />
                  </div>
                </div>
              ) : mapImage && hotspotCenter ? (
                <div className="mt-1 w-full">
                  <MomentScene
                    imageSrc={mapImage}
                    hotspotLeftPct={hotspotCenter.left}
                    hotspotTopPct={hotspotCenter.top}
                    accent={areaConfig.color}
                    label={step.label}
                    aspect="4 / 3"
                  />
                </div>
              ) : (
                <div
                  className="mt-1 flex aspect-[4/3] w-full items-center justify-center rounded-xl"
                  style={{ background: `${areaConfig.color}1a` }}
                  aria-hidden
                >
                  <MomentIcon momentId={step.id} weight="duotone" className="h-20 w-20" />
                </div>
              )}
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
                  {momentSubtitle ? (
                    <p
                      className="mt-2 max-w-3xl text-sm font-semibold text-[var(--blue)]/80 md:text-base"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {momentSubtitle}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2 print:hidden">
                  <FavouriteButton
                    kind="moment"
                    id={`${persona.area}/${persona.id}/${step.id}`}
                    label={step.label}
                    href={momentHref}
                    meta={`${persona.name} · ${areaConfig.label}`}
                  />
                  <ShareButton
                    title={`${step.label} — ${persona.fullName}`}
                    text={momentBody}
                    url={momentHref}
                    variant="icon"
                  />
                  <Link
                    href={`/${params.area}/${params.persona}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
                    aria-label="Close moment"
                  >
                    <X size={16} weight="bold" />
                  </Link>
                </div>
              </div>

              {momentBody ? (
                <p
                  className="mt-3 max-w-3xl text-sm font-semibold leading-relaxed text-[var(--blue)]/80 md:text-base"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {momentBody}
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
                  const modSolutions = solutionsByModule(mod);
                  const count = modSolutions.length;
                  const { Icon: ModIcon, weight: modWeight } = pickModuleVisual(mod);
                  return (
                    <StaggerItem key={mod.id}>
                      <Link
                        href={href}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--grey-border)] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(41,56,150,0.14)]"
                      >
                        <div
                          className="relative flex h-12 w-full shrink-0 items-center justify-center bg-[var(--blue)]"
                          aria-hidden
                        >
                          <ModIcon size={18} weight={modWeight} className="text-white/95" />
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

          {/* ── Before / During / After framing ─────────────────── */}
          <div
            className="grid gap-px border-t border-[var(--grey-border)] bg-[var(--grey-border)] md:grid-cols-3"
            aria-label="Moment in context"
          >
            {[
              {
                tag: 'Before',
                role: 'Builds up to this moment',
                step: prevStep,
              },
              {
                tag: 'During',
                role: 'What Sodexo changes right now',
                step,
              },
              {
                tag: 'After',
                role: 'Opens up what comes next',
                step: nextStep,
              },
            ].map(({ tag, role, step: s }, i) => {
              const isCurrent = i === 1;
              if (!s) {
                return (
                  <div
                    key={tag}
                    className="flex flex-col gap-2 bg-white px-5 py-5 md:px-7 opacity-60"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/50">
                      {tag}
                    </span>
                    <p className="text-sm text-[var(--blue)]/50" style={{ fontFamily: 'var(--font-body)' }}>
                      {tag === 'Before' ? 'Start of day' : 'End of day'}
                    </p>
                  </div>
                );
              }
              return (
                <Link
                  key={tag}
                  href={`/${params.area}/${params.persona}/moment/${s.id}`}
                  className={
                    isCurrent
                      ? 'flex flex-col gap-2 bg-[var(--icon-bg)] px-5 py-5 md:px-7'
                      : 'group flex flex-col gap-2 bg-white px-5 py-5 md:px-7 transition-colors hover:bg-[#f8faff]'
                  }
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <span
                    className={
                      isCurrent
                        ? 'text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--blue-primary)]'
                        : 'text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/50'
                    }
                  >
                    {tag}
                  </span>
                  <div className="flex items-center gap-2">
                    <MomentIcon
                      momentId={s.id}
                      weight="duotone"
                      className="h-5 w-5 text-[var(--blue-primary)]"
                    />
                    <h3
                      className="text-base font-extrabold leading-tight text-[var(--blue)]"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {s.label}
                    </h3>
                  </div>
                  <p
                    className="text-xs leading-snug text-[var(--blue)]/70"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {role}
                  </p>
                </Link>
              );
            })}
          </div>

          {/* ── Cross-persona "same moment, other lives" ───────── */}
          {crossPersonas.length > 0 ? (
            <div className="border-t border-[var(--grey-border)] bg-white px-5 py-5 md:px-7">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--blue)]/60"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                This moment also happens for
              </p>
              <p
                className="mt-1 text-xs text-[var(--blue)]/70"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Same label, different life — switch perspectives without losing the moment.
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {crossPersonas.map((p) => {
                  const matchingStep = p.steps
                    .map((sid) => journeySteps[sid])
                    .find((s): s is NonNullable<typeof s> => Boolean(s && s.label === step.label));
                  if (!matchingStep) return null;
                  return (
                    <li key={p.id}>
                      <Link
                        href={`/${p.area}/${p.id}/moment/${matchingStep.id}`}
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--grey-border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--blue)] transition-colors hover:border-[var(--blue-primary)] hover:text-[var(--blue-primary)]"
                      >
                        <span
                          aria-hidden
                          className="inline-flex h-5 w-5 items-center justify-center rounded-full"
                          style={{ background: `${p.color}22`, color: p.color }}
                        >
                          <User size={12} weight="fill" />
                        </span>
                        {p.name}
                        <span className="rounded-full bg-[var(--icon-bg)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--blue)]/70">
                          {areas[p.area].label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {/* Footer quick-nav */}
          <div
            className="flex items-center justify-between border-t border-[var(--grey-border)] bg-white px-5 py-3 md:px-7 print:hidden"
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
      </div>
    </div>
  );
}
