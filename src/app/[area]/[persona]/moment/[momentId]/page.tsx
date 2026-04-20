import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, X } from '@phosphor-icons/react/dist/ssr';
import { getCatalogueData } from '@/lib/notion';
import type { Area, Module } from '@/lib/data/types';

export const revalidate = 3600;

const AREA_KEYS = new Set<Area>(['work', 'learn', 'heal', 'play']);

interface Props {
  params: { area: string; persona: string; momentId: string };
}

function moduleByName(modules: Record<string, Module>, name: string): Module | undefined {
  return Object.values(modules).find((m) => m.name === name);
}

export default async function MomentPage({ params }: Props) {
  const { personas, areas, modules, journeySteps } = await getCatalogueData();
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
  const eyebrow = persona.profileEyebrow ?? 'Consumer';

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#E8EEFB] lg:flex-row lg:overflow-hidden lg:h-screen">

      {/* ── DESKTOP BACKGROUND: isometric journey map ─────────────── */}
      {mapImage ? (
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
          <img
            src={mapImage}
            alt=""
            className="h-full w-full object-cover object-center"
          />
          {/* right-to-white fade behind the white panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent from-50% to-white/60" />
        </div>
      ) : (
        <div
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{ background: `linear-gradient(135deg, ${areaConfig.color}22 0%, #E8EEFB 60%)` }}
          aria-hidden
        />
      )}

      {/* ── MOBILE: journey map banner ─────────────────────────────── */}
      <div className="relative z-10 lg:hidden">
        {mapImage ? (
          <div className="relative h-52 w-full overflow-hidden">
            <img src={mapImage} alt="" className="h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#E8EEFB]" />
            {/* Mobile breadcrumb overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <p
                  className="text-[11px] font-bold uppercase tracking-widest text-white/80"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {eyebrow}
                </p>
                <p
                  className="text-base font-extrabold leading-tight text-white"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {areaConfig.label} · {persona.name}
                </p>
              </div>
              <Link
                href={`/${params.area}/${params.persona}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-sm hover:bg-white/40"
                aria-label="Back to journey"
              >
                <X size={16} weight="bold" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between px-4 py-4">
            <Link
              href={`/${params.area}/${params.persona}`}
              className="flex items-center gap-1.5 text-sm font-semibold text-[var(--blue)]"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
          </div>
        )}
      </div>

      {/* ── DESKTOP LEFT: breadcrumb + persona context ─────────────── */}
      <div className="relative z-10 hidden w-[260px] flex-shrink-0 flex-col justify-between p-8 xl:w-[300px] lg:flex">
        {/* Back link */}
        <div>
          <Link
            href={`/${params.area}/${params.persona}`}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/30 px-3 py-1.5 text-xs font-bold text-[var(--blue)] backdrop-blur-sm transition-colors hover:bg-white/50"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <ArrowLeft size={12} weight="bold" />
            Back to journey
          </Link>

          {/* Persona info hierarchy */}
          <p
            className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--blue)]/60"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {eyebrow}
          </p>
          <p
            className="mt-1 text-xl font-extrabold leading-tight text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {areaConfig.label}
          </p>
          <p
            className="text-lg font-bold leading-tight"
            style={{ color: areaConfig.color, fontFamily: 'var(--font-heading)' }}
          >
            {persona.name}
          </p>
        </div>

        {/* Current step badge */}
        <div
          className="rounded-2xl bg-white/60 p-4 backdrop-blur-sm"
          style={{ boxShadow: '0 4px 20px rgba(41,56,150,0.10)' }}
        >
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--blue)]/50">
            Current moment
          </p>
          <p
            className="text-sm font-extrabold text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {step.label}
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL: white card with moment content ─────────────── */}
      <div className="relative z-10 mx-0 flex flex-1 flex-col bg-white lg:my-4 lg:mr-4 lg:overflow-y-auto lg:rounded-[24px] lg:shadow-2xl">

        {/* Panel header */}
        <div
          className="flex items-start justify-between gap-4 px-6 py-6 md:px-8 md:py-7"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
        >
          <div className="min-w-0 flex-1">
            <p
              className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ color: areaConfig.color, fontFamily: 'var(--font-heading)' }}
            >
              Moment
            </p>
            <h1
              className="text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-tight text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {step.label}
            </h1>
            {step.description ? (
              <p
                className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {step.description}
              </p>
            ) : null}
          </div>
          {/* Close button — desktop */}
          <Link
            href={`/${params.area}/${params.persona}`}
            className="hidden shrink-0 items-center justify-center rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 lg:flex"
            aria-label="Close"
          >
            <X size={18} weight="bold" />
          </Link>
        </div>

        {/* Touchpoints (if any) */}
        {step.touchpoints ? (
          <div className="grid gap-3 px-6 pt-5 sm:grid-cols-2 md:px-8">
            {[
              { label: 'Physical touchpoints', items: step.touchpoints.physical ?? [], color: 'var(--blue)' },
              { label: 'Digital touchpoints', items: step.touchpoints.digital ?? [], color: 'var(--teal)' },
            ].map(({ label, items, color }) => (
              items.length > 0 ? (
                <div
                  key={label}
                  className="rounded-xl border border-[var(--grey-border)] bg-[#f8faff] px-4 py-3"
                >
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[var(--blue)]">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
                    {label}
                  </p>
                  <ul className="space-y-1 text-xs text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>
                    {items.map((item, i) => (
                      <li key={i} className="flex gap-1.5">
                        <span className="mt-0.5 font-bold" style={{ color }}>·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null
            ))}
          </div>
        ) : null}

        {/* Modules section */}
        <div className="flex-1 px-6 pb-10 pt-6 md:px-8">
          <h2
            className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.2em] text-gray-400"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Modules
          </h2>

          {moduleCards.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {moduleCards.map((mod) => {
                const href = `/solutions?module=${encodeURIComponent(mod.name)}&moment=${encodeURIComponent(step.label)}&momentId=${encodeURIComponent(step.id)}`;
                return (
                  <Link
                    key={mod.id}
                    href={href}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--grey-border)] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                    style={{ boxShadow: '0 2px 8px rgba(41,56,150,0.06)' }}
                  >
                    {/* Image / gradient area */}
                    <div
                      className="flex h-28 items-center justify-center text-5xl"
                      style={{ background: mod.gradient }}
                    >
                      <span className="drop-shadow-sm">{mod.icon}</span>
                    </div>
                    {/* Content */}
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
                      <span
                        className="inline-flex items-center gap-1 text-xs font-bold text-[var(--blue-primary)] group-hover:gap-2 transition-all"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        View solutions
                        <span aria-hidden>→</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-[#f8faff] p-8 text-center">
              <p className="text-sm text-gray-400" style={{ fontFamily: 'var(--font-body)' }}>
                No modules are mapped to this moment yet.
              </p>
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div
          className="flex items-center justify-between px-6 py-4 md:px-8"
          style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
        >
          <Link
            href={`/${params.area}/${params.persona}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--blue-primary)] hover:text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <ArrowLeft size={13} />
            Back to journey
          </Link>
          <Link
            href="/solutions"
            className="text-xs font-semibold text-[var(--blue-primary)] hover:text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            All solutions →
          </Link>
        </div>
      </div>
    </div>
  );
}
