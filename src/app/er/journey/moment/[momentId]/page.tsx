import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Airplane,
  ArrowLeft,
  ArrowRight,
  Bed,
  Car,
  Desktop,
  DoorOpen,
  ForkKnife,
  Heart,
  User,
  X,
} from '@phosphor-icons/react/dist/ssr';
import type { Icon, IconWeight } from '@phosphor-icons/react';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { FavouriteButton } from '@/components/ui/FavouriteButton';
import { ShareButton } from '@/components/ui/ShareButton';
import { catalogueModuleForJourneyLabel } from '@/lib/data/moduleJourneyResolve';
import { resolvePersonaImage } from '@/lib/data/personaImageResolve';
import { pickModuleVisual } from '@/lib/data/moduleVisuals';
import { solutionsForModule } from '@/lib/data/moduleSolutions';
import {
  ER_BOK_MOMENT_EDITORIAL,
  ER_BOK_MOMENT_IMAGE,
  ER_BOK_STEPS,
  ER_BOK_STEP_IDS,
  allErBoKAndClient,
  erBoKAsPersona,
  isErBoKStepId,
  type ErBoKStepId,
} from '@/lib/data/er';
import { getCatalogueData } from '@/lib/notion';
import type { Module, Solution } from '@/lib/data/types';

export const revalidate = 3600;

interface Props {
  params: { momentId: string };
}

const MOMENT_ICONS: Record<ErBoKStepId, Icon> = {
  'er-bok__departure-from-home': Airplane,
  'er-bok__commute': Car,
  'er-bok__welcome-area': DoorOpen,
  'er-bok__workplace': Desktop,
  'er-bok__food-beverage-area': ForkKnife,
  'er-bok__wellbeing-breaktime': Heart,
  'er-bok__bed-time': Bed,
};

function MomentIcon({
  stepId,
  weight,
  className,
}: {
  stepId: ErBoKStepId;
  weight?: IconWeight;
  className?: string;
}) {
  const Cmp = MOMENT_ICONS[stepId] ?? Car;
  return <Cmp weight={weight ?? 'duotone'} className={className} aria-hidden />;
}

export function generateStaticParams() {
  return ER_BOK_STEP_IDS.map((momentId) => ({ momentId }));
}

export default async function ErJourneyMomentPage({ params }: Props) {
  const { personas, areas, modules, solutions } = await getCatalogueData();
  const workArea = areas.work;
  if (!workArea) notFound();

  const whiteCollar = personas.find((p) => p.area === 'work' && p.id === 'white-collar');
  if (!whiteCollar) notFound();

  if (!isErBoKStepId(params.momentId)) notFound();
  const step = ER_BOK_STEPS[params.momentId];

  const editorial = ER_BOK_MOMENT_EDITORIAL[params.momentId];
  const momentSubtitle = editorial.subtitle.trim();
  const momentBody = editorial.body.trim() || step.description || '';

  const stepIdx = ER_BOK_STEP_IDS.indexOf(params.momentId);
  const prevStepId = stepIdx > 0 ? ER_BOK_STEP_IDS[stepIdx - 1] : null;
  const nextStepId =
    stepIdx >= 0 && stepIdx < ER_BOK_STEP_IDS.length - 1 ? ER_BOK_STEP_IDS[stepIdx + 1] : null;
  const prevStep = prevStepId ? ER_BOK_STEPS[prevStepId] : null;
  const nextStep = nextStepId ? ER_BOK_STEPS[nextStepId] : null;

  const heroImageSrc = ER_BOK_MOMENT_IMAGE[params.momentId];
  const momentHref = `/er/journey/moment/${params.momentId}`;
  const journeyHref = '/er/journey';

  const moduleCards = step.modules
    .map((name) => catalogueModuleForJourneyLabel(modules, name))
    .filter((m): m is Module => Boolean(m));

  const solutionsByModule = (m: Module): Solution[] => solutionsForModule(m, solutions);

  const bokProfiles = allErBoKAndClient();

  return (
    <div className="relative flex flex-1 flex-col bg-[#E8EEFB]">
      <div className="relative z-0 h-[36vh] w-full overflow-hidden sm:h-[40vh] md:h-[44vh] lg:h-[46vh]">
        <img
          src={heroImageSrc}
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#E8EEFB]" />
      </div>

      <div className="relative z-10 -mt-16 flex-1 px-4 pb-10 md:-mt-24 md:px-8 lg:-mt-32 lg:px-12">
        <article className="mx-auto flex w-full max-w-[1280px] flex-col overflow-hidden rounded-brand-2xl bg-white shadow-[0_20px_60px_rgba(41,56,150,0.18)]">
          <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)] md:gap-8 md:p-7">
            <div className="flex min-w-0 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/60"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    E&amp;R · Home to home
                  </p>
                  <h1
                    className="mt-1 text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-none text-[var(--blue)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {step.label}
                  </h1>
                  <p
                    className="mt-2 max-w-3xl text-sm font-semibold text-[var(--blue)]/80 md:text-base"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {momentSubtitle}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2 print:hidden">
                  <FavouriteButton
                    kind="moment"
                    id={`er-journey/${params.momentId}`}
                    label={step.label}
                    href={momentHref}
                    meta={`E&R journey · ${workArea.label}`}
                  />
                  <ShareButton
                    title={`${step.label} — E&R journey`}
                    text={momentBody}
                    url={momentHref}
                    variant="icon"
                  />
                  <Link
                    href={journeyHref}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
                    aria-label="Close moment"
                  >
                    <X size={16} weight="bold" />
                  </Link>
                </div>
              </div>

              <p
                className="mt-2 text-sm font-bold text-[var(--blue)]/70"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Moment {stepIdx + 1} / {ER_BOK_STEP_IDS.length} · shared across all E&amp;R personae
              </p>

              {momentBody ? (
                <p
                  className="mt-3 max-w-3xl text-sm font-semibold leading-relaxed text-[var(--blue)]/80 md:text-base"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {momentBody}
                </p>
              ) : null}
            </div>
          </div>

          <div className="border-t border-[var(--grey-border)] bg-[#f8faff] px-5 py-6 md:px-7">
            <h2
              className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              View through each persona
            </h2>
            <p
              className="mt-1 text-xs text-[var(--blue)]/65"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Same moment, profile-specific portrait and BoK pains — open a persona to see their lens.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {bokProfiles.map((bok) => {
                const persona = erBoKAsPersona(bok, whiteCollar);
                const portraitSrc = resolvePersonaImage('face', persona.id, persona.photo);
                return (
                  <li key={bok.id}>
                    <Link
                      href={`/er/personae/${bok.id}/moment/${params.momentId}`}
                      className="group flex items-center gap-3 rounded-2xl border border-[var(--grey-border)] bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--blue-primary)] hover:shadow-[var(--shadow-sm)]"
                    >
                      <div
                        className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full"
                        style={{
                          background: `${persona.color}22`,
                          backgroundImage:
                            'radial-gradient(circle, rgba(41, 56, 150, 0.18) 1px, transparent 1px)',
                          backgroundSize: '5px 5px',
                        }}
                      >
                        {portraitSrc ? (
                          <img
                            src={portraitSrc}
                            alt=""
                            className="absolute bottom-0 left-1/2 h-[145%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom"
                          />
                        ) : (
                          <User size={22} weight="duotone" color={persona.color} aria-hidden />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-sm font-extrabold text-[var(--blue)] group-hover:text-[var(--blue-primary)]"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {persona.name}
                        </p>
                        <p
                          className="truncate text-xs font-semibold text-[var(--blue)]/60"
                          style={{ fontFamily: 'var(--font-body)' }}
                        >
                          {persona.role}
                        </p>
                      </div>
                      <ArrowRight
                        size={14}
                        weight="bold"
                        className="shrink-0 text-[var(--blue-primary)] opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col gap-4 border-t border-[var(--grey-border)] bg-[#f8faff] px-5 py-6 md:px-7 md:py-7">
            <div className="flex items-baseline justify-between gap-3">
              <h2
                className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Modules &amp; innovations
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
                  const href = `/modules/${mod.id}?area=work&momentId=${encodeURIComponent(params.momentId)}`;
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

          <div
            className="grid gap-px border-t border-[var(--grey-border)] bg-[var(--grey-border)] md:grid-cols-3"
            aria-label="Moment in context"
          >
            {[
              { tag: 'Before', role: 'Builds up to this moment', step: prevStep, id: prevStepId },
              { tag: 'During', role: 'What Sodexo changes right now', step, id: params.momentId },
              { tag: 'After', role: 'Opens up what comes next', step: nextStep, id: nextStepId },
            ].map(({ tag, role, step: s, id }, i) => {
              const isCurrent = i === 1;
              if (!s || !id) {
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
                  href={`/er/journey/moment/${id}`}
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
                      stepId={id as ErBoKStepId}
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

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--grey-border)] bg-white px-5 py-3 md:px-7 print:hidden">
            <Link
              href={journeyHref}
              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--blue-primary)] hover:text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <ArrowLeft size={13} weight="bold" />
              Back to journey map
            </Link>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/er/personae"
                className="text-xs font-semibold text-[var(--blue-primary)] hover:text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                All personae →
              </Link>
              <Link
                href="/solutions?collection=er"
                className="text-xs font-semibold text-[var(--blue-primary)] hover:text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                E&amp;R innovations →
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
