'use client';

import {
  Article,
  ChartBar,
  FileText,
  Info,
  LinkSimple,
  Phone,
  LightbulbFilament,
  TrendUp,
  Trophy,
  User,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { useState, useTransition, type ReactNode } from 'react';
import { FavouriteButton } from '@/components/ui/FavouriteButton';
import { ShareButton } from '@/components/ui/ShareButton';
import { DownloadCta } from '@/components/ui/DownloadCta';
import { SolutionHeroTile } from '@/components/catalogue/SolutionHeroTile';
import { COLLECTION_META } from '@/lib/data/collections';
import { pickModuleVisual } from '@/lib/data/moduleVisuals';
import type { Module, Solution } from '@/lib/data/types';
import { emphasizeCatalogueText } from '@/lib/format/emphasizeCatalogueText';
import { cn } from '@/lib/utils/cn';

export type SolutionCardLayoutVariant = 'classic' | 'editorial' | 'bento' | 'quiet';

interface Props {
  solution: Solution;
  siblings: Solution[];
  module?: Module;
  /** Omit the left module summary rail (module page already shows it in the header). */
  hideModuleRail?: boolean;
  /**
   * Visual layout preset. Defaults to `bento` (production).
   * `/dev/solution-layout-preview` passes other values to compare directions.
   */
  layoutVariant?: SolutionCardLayoutVariant;
}

function statusColor(s: string) {
  if (s === 'Scaled') return '#27ae60';
  if (s === 'Scaling') return '#e67e22';
  if (s === 'Pilot') return '#3498db';
  return '#95a5a6';
}

function Section({
  icon,
  title,
  children,
  quiet,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  quiet?: boolean;
}) {
  if (quiet) {
    return (
      <div className="border-b border-[var(--grey-border)]/80 py-5 last:border-b-0 last:pb-0">
        <div className="mb-2 flex items-baseline gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-600">
            {title}
          </span>
        </div>
        <div className="flex gap-3">
          <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--icon-bg)]/60">
            {icon}
          </div>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl bg-white p-4" style={{ boxShadow: 'var(--shadow-sm)' }}>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-[var(--icon-bg)]">
          {icon}
        </div>
        <h2 className="text-base font-bold text-[var(--blue)]" style={{ fontFamily: 'var(--font-body)' }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function TitleAndMeta({
  current,
  sc,
  titleClassName,
  metaTextSize,
}: {
  current: Solution;
  sc: string;
  titleClassName?: string;
  metaTextSize?: 'xs' | 'sm';
}) {
  const bodyMeta = metaTextSize === 'sm' ? 'text-sm leading-relaxed' : 'text-xs leading-relaxed';
  return (
    <>
      <h1
        className={cn('text-3xl font-extrabold text-[var(--blue)]', titleClassName)}
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {current.name}
      </h1>

      {current.collections && current.collections.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {current.collections.map((c) => {
            const meta = COLLECTION_META[c];
            const Icon = c === 'big-bets' ? LightbulbFilament : Trophy;
            return (
              <Link
                key={c}
                href={meta.catalogueHref ?? meta.href}
                className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-[var(--shadow-sm)] transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
                style={{ backgroundImage: meta.gradient, fontFamily: 'var(--font-body)' }}
                aria-label={`${meta.label} — ${meta.tagline}`}
              >
                <Icon size={13} weight="fill" aria-hidden />
                {meta.label}
                <span
                  aria-hidden
                  className="text-[10px] font-normal text-white/80 transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            );
          })}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <span
          className="rounded-full border-2 border-[var(--blue)] px-3 py-1 text-xs font-bold text-[var(--teal)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {current.catalogueTag ?? current.type}
        </span>
        {!current.excelSolutionsSheet ? (
          <span
            className="rounded-full border-2 px-3 py-1 text-xs font-bold"
            style={{ borderColor: sc, color: sc, fontFamily: 'var(--font-body)' }}
          >
            {current.status}
          </span>
        ) : null}
        {current.hashtags.map((h) => (
          <span
            key={h}
            className="rounded-full border border-[var(--icon-bg-muted)] px-3 py-1 text-xs text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {h}
          </span>
        ))}
      </div>

      {current.regionsAndCountry ? (
        <p className={cn('text-neutral-700', bodyMeta)} style={{ fontFamily: 'var(--font-body)' }}>
          <span className="font-bold text-[var(--blue)]">Regions and country:</span>{' '}
          {emphasizeCatalogueText(current.regionsAndCountry, current)}
        </p>
      ) : (
        <div
          className="flex flex-wrap items-center gap-1"
          role="group"
          aria-label={`Deployed in ${current.flags.length} Sodexo region${current.flags.length === 1 ? '' : 's'}`}
        >
          <span className="mr-1 text-xs font-bold text-[var(--blue)]">Sodexo Regions:</span>
          {current.flags.map((f) => (
            <span key={f} className="text-xl" aria-hidden>
              {f}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

function BenefitsPanel({
  current,
  variant,
}: {
  current: Solution;
  variant: SolutionCardLayoutVariant;
}) {
  const rows = [
    { label: 'Client', icon: <TrendUp size={22} weight="fill" color="var(--blue)" />, text: current.benefits.client },
    { label: 'Consumer', icon: <User size={22} weight="fill" color="var(--blue)" />, text: current.benefits.consumer },
    { label: 'Sodexo', icon: <FileText size={22} weight="fill" color="var(--blue)" />, text: current.benefits.sodexo },
  ];

  if (variant === 'classic') {
    return (
      <div
        className="rounded-[var(--radius-lg)] bg-white p-4"
        style={{ border: '1px solid rgba(0,0,0,.1)', boxShadow: 'var(--shadow-benefits)' }}
      >
        <h2 className="mb-3 text-base font-bold text-[var(--blue)]">Benefits</h2>
        <div className="grid grid-cols-3 gap-2">
          {rows.map((b) => (
            <div
              key={b.label}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-[#d9d9d9] p-2 text-center"
            >
              <span className="text-base font-bold text-[var(--blue)]">{b.label}</span>
              <div className="flex h-8 w-8 items-center justify-center">{b.icon}</div>
              <p className="text-xs leading-snug text-neutral-700">{emphasizeCatalogueText(b.text, current)}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const wrapClass =
    variant === 'quiet'
      ? 'rounded-2xl border border-[var(--grey-border)] bg-white/90 p-4'
      : 'rounded-[var(--radius-lg)] border border-[var(--grey-border)] bg-white p-4 shadow-[var(--shadow-sm)]';

  return (
    <div className={wrapClass}>
      <h2 className="mb-3 text-base font-bold text-[var(--blue)]">Benefits</h2>
      <div className="flex flex-col gap-3">
        {rows.map((b) => (
          <div
            key={b.label}
            className="flex gap-3 rounded-xl border border-[var(--grey-border)]/90 bg-[#fafbff] p-3"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--icon-bg)]">
              {b.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[var(--blue)]">{b.label}</p>
              <div className="mt-1 text-sm leading-snug text-neutral-800">
                {emphasizeCatalogueText(b.text, current)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KpiDeploymentContent({ current }: { current: Solution }) {
  const singleProse = current.kpis.length === 1 && !String(current.kpis[0].v ?? '').trim();
  if (singleProse) {
    return (
      <div className="rounded-xl border border-[var(--grey-border)]/80 bg-gradient-to-b from-[#f8f9ff] to-[#eef2ff] p-4">
        <p
          className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--blue)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Deployment & metrics
        </p>
        <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-neutral-800">
          {emphasizeCatalogueText(current.kpis[0].l, current)}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-[var(--grey-border)]/80 bg-gradient-to-b from-[#f8f9ff] to-[#eef2ff] p-4">
      <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
        {current.kpis.map((k, i) => (
          <li
            key={i}
            className="rounded-lg border border-white/90 bg-white/95 p-4 text-center shadow-sm"
          >
            <p
              className="text-xs font-extrabold leading-snug text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {k.l}
            </p>
            <p
              className="mt-2 break-words tabular-nums text-2xl font-extrabold tracking-tight text-[var(--blue-primary)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {String(k.v ?? '').trim() || '—'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function KpisContactBlock({ current }: { current: Solution }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Section icon={<ChartBar size={20} weight="fill" color="var(--blue)" />} title="Deployment & KPIs">
        <KpiDeploymentContent current={current} />
      </Section>

      <Section icon={<Phone size={20} weight="fill" color="var(--blue)" />} title="Contact">
        <p className="text-sm font-bold text-[var(--blue)]">{current.contact}</p>
        {current.url ? (
          <a
            href={current.url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[var(--blue-primary)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
          >
            <LinkSimple size={12} weight="bold" aria-hidden />
            {current.url.replace('https://', '')}
          </a>
        ) : null}
      </Section>
    </div>
  );
}

function KpisContactQuiet({ current }: { current: Solution }) {
  return (
    <div className="grid gap-6 border-t border-[var(--grey-border)]/80 pt-6 md:grid-cols-2">
      <Section quiet icon={<ChartBar size={18} weight="fill" color="var(--blue)" />} title="Deployment & KPIs">
        <KpiDeploymentContent current={current} />
      </Section>

      <Section quiet icon={<Phone size={18} weight="fill" color="var(--blue)" />} title="Contact">
        <p className="text-sm font-bold text-[var(--blue)]">{current.contact}</p>
        {current.url ? (
          <a
            href={current.url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[var(--blue-primary)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
          >
            <LinkSimple size={12} weight="bold" aria-hidden />
            {current.url.replace('https://', '')}
          </a>
        ) : null}
      </Section>
    </div>
  );
}

export function SolutionCard({
  solution,
  siblings,
  module,
  hideModuleRail = false,
  layoutVariant = 'bento',
}: Props) {
  const [active, setActive] = useState(solution.id);
  const [exporting, startExport] = useTransition();
  const allSolutions = [solution, ...siblings];
  const current = allSolutions.find((s) => s.id === active) ?? solution;
  const sc = statusColor(current.status);
  const railVisual = hideModuleRail ? null : pickModuleVisual(module ?? undefined);
  const variant = layoutVariant;

  const handleDownload = () => {
    startExport(async () => {
      const { exportSolutionToPptx } = await import('@/lib/export/pptSolution');
      await exportSolutionToPptx(current, {
        module,
        siblingCount: allSolutions.length,
      });
    });
  };

  const tabBar = (
    <div
      className="flex h-14 flex-shrink-0 items-center gap-2 bg-white px-6"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      <span
        className="mr-2 flex-shrink-0 text-lg font-extrabold text-[var(--blue)]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        All solutions:
      </span>
      <div
        className={cn(
          'flex h-full flex-1 items-center overflow-x-auto',
          variant === 'bento'
            ? 'gap-1 rounded-xl border border-[var(--grey-border)]/70 bg-[#eef2fa] p-1'
            : 'border-b-2 border-[var(--grey-border)]',
        )}
      >
        {allSolutions.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(s.id)}
            className={cn(
              'flex items-center whitespace-nowrap px-4 text-sm font-semibold transition-colors',
              variant === 'bento'
                ? cn(
                    'h-9 rounded-lg',
                    s.id === active
                      ? 'bg-white font-bold text-[var(--blue-solid)] shadow-sm'
                      : 'text-[var(--blue-solid)]/85 hover:bg-white/70',
                  )
                : cn(
                    'h-full -mb-0.5 border-b-[3px]',
                    s.id === active
                      ? 'border-[var(--blue-solid)] font-bold text-[var(--blue-solid)]'
                      : 'border-transparent text-[var(--blue-solid)] hover:text-[var(--blue-solid)]',
                  ),
            )}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {s.name}
          </button>
        ))}
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-2 pl-2 print:hidden">
        <FavouriteButton
          kind="solution"
          id={current.id}
          label={current.name}
          href={`/solutions/${current.id}`}
          meta={current.module}
        />
        <ShareButton
          title={current.name}
          text={current.description}
          url={`/solutions/${current.id}`}
          variant="icon"
        />
      </div>
    </div>
  );

  const downloadBlock = (
    <>
      <DownloadCta variant="block" label="Download PowerPoint" pending={exporting} onClick={handleDownload} />
      <p className="text-right text-xs text-neutral-500" style={{ fontFamily: 'var(--font-body)' }}>
        {current.excelSolutionsSheet ? '↻ Classeur Solutions.xlsx' : '↻ Synced from Notion'}
      </p>
    </>
  );

  const contextDescriptionClassic = (
    <>
      <Section icon={<Info size={20} weight="fill" color="var(--blue)" />} title="Context">
        <p className="text-sm leading-relaxed text-neutral-800">{emphasizeCatalogueText(current.context, current)}</p>
      </Section>
      <Section icon={<Article size={20} weight="fill" color="var(--blue)" />} title="Description">
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-800">
          {emphasizeCatalogueText(current.description, current)}
        </div>
      </Section>
    </>
  );

  const contextDescriptionBento = (
    <div className="rounded-2xl bg-white p-4" style={{ boxShadow: 'var(--shadow-sm)' }}>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-[var(--icon-bg)]">
          <Info size={20} weight="fill" color="var(--blue)" />
        </div>
        <h2 className="text-base font-bold text-[var(--blue)]" style={{ fontFamily: 'var(--font-body)' }}>
          Context
        </h2>
      </div>
      <p className="text-sm leading-relaxed text-neutral-800">{emphasizeCatalogueText(current.context, current)}</p>
      <hr className="my-4 border-[var(--grey-border)]/80" />
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-[var(--icon-bg)]">
          <Article size={20} weight="fill" color="var(--blue)" />
        </div>
        <h2 className="text-base font-bold text-[var(--blue)]" style={{ fontFamily: 'var(--font-body)' }}>
          Description
        </h2>
      </div>
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-800">
        {emphasizeCatalogueText(current.description, current)}
      </div>
    </div>
  );

  const contextDescriptionQuiet = (
    <>
      <Section quiet icon={<Info size={18} weight="fill" color="var(--blue)" />} title="Context">
        <p className="text-sm leading-relaxed text-neutral-800">{emphasizeCatalogueText(current.context, current)}</p>
      </Section>
      <Section quiet icon={<Article size={18} weight="fill" color="var(--blue)" />} title="Description">
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-800">
          {emphasizeCatalogueText(current.description, current)}
        </div>
      </Section>
    </>
  );

  let mainScroll: ReactNode;

  if (variant === 'editorial') {
    mainScroll = (
      <div className="flex min-h-0 flex-1 overflow-y-auto bg-[var(--surface)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 space-y-5 lg:max-w-[min(100%,42rem)]">
            <SolutionHeroTile
              solution={current}
              module={module}
              heightClassName="h-52 md:h-64"
              alt={`${current.name} — ${module?.name ?? current.module}`}
              className="w-full"
            />
            <TitleAndMeta current={current} sc={sc} metaTextSize="sm" />
            <Section icon={<Info size={20} weight="fill" color="var(--blue)" />} title="Context">
              <p className="text-sm leading-relaxed text-neutral-800">{emphasizeCatalogueText(current.context, current)}</p>
            </Section>
            <Section icon={<Article size={20} weight="fill" color="var(--blue)" />} title="Description">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-800">
                {emphasizeCatalogueText(current.description, current)}
              </div>
            </Section>
            <KpisContactBlock current={current} />
          </div>
          <aside className="flex w-full flex-shrink-0 flex-col gap-4 lg:sticky lg:top-4 lg:w-72 lg:self-start">
            <BenefitsPanel current={current} variant="editorial" />
            {downloadBlock}
          </aside>
        </div>
      </div>
    );
  } else if (variant === 'bento') {
    mainScroll = (
      <div className="flex min-h-0 flex-1 gap-5 overflow-y-auto p-6">
        <div className="min-w-0 flex-1 space-y-3">
          <TitleAndMeta current={current} sc={sc} />
          {contextDescriptionBento}
          <KpisContactBlock current={current} />
        </div>
        <aside className="w-72 flex-shrink-0 space-y-3">
          <SolutionHeroTile
            solution={current}
            module={module}
            alt={`${current.name} — ${module?.name ?? current.module}`}
          />
          <BenefitsPanel current={current} variant="bento" />
          {downloadBlock}
        </aside>
      </div>
    );
  } else if (variant === 'quiet') {
    mainScroll = (
      <div className="flex min-h-0 flex-1 overflow-y-auto p-6">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 lg:flex-row">
          <div
            className="min-w-0 flex-1 rounded-2xl border border-[var(--grey-border)] bg-[#fafbff] px-6 py-8 md:px-10"
            style={{ boxShadow: '0 1px 0 rgba(255,255,255,.8) inset' }}
          >
            <div className="space-y-6 border-b border-[var(--grey-border)]/80 pb-8">
              <TitleAndMeta current={current} sc={sc} titleClassName="text-[1.65rem] md:text-3xl" metaTextSize="sm" />
            </div>
            <div className="pt-2">{contextDescriptionQuiet}</div>
            <KpisContactQuiet current={current} />
          </div>
          <aside className="flex w-full flex-shrink-0 flex-col gap-4 lg:w-72">
            <SolutionHeroTile
              solution={current}
              module={module}
              heightClassName="h-56"
              alt={`${current.name} — ${module?.name ?? current.module}`}
            />
            <BenefitsPanel current={current} variant="quiet" />
            {downloadBlock}
          </aside>
        </div>
      </div>
    );
  } else {
    mainScroll = (
      <div className="flex min-h-0 flex-1 gap-5 overflow-y-auto p-6">
        <div className="min-w-0 flex-1 space-y-3">
          <TitleAndMeta current={current} sc={sc} />
          {contextDescriptionClassic}
          <KpisContactBlock current={current} />
        </div>
        <aside className="w-72 flex-shrink-0 space-y-3">
          <SolutionHeroTile
            solution={current}
            module={module}
            alt={`${current.name} — ${module?.name ?? current.module}`}
          />
          <BenefitsPanel current={current} variant="classic" />
          {downloadBlock}
        </aside>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1">
      {railVisual ? (
        <aside className="flex w-64 flex-shrink-0 flex-col gap-3 border-r border-[var(--grey-border)] bg-white p-4">
          <div
            className="relative flex h-24 items-center justify-center overflow-hidden rounded-2xl"
            style={{
              background: module?.gradient ?? 'linear-gradient(135deg,#293896,#1a69ff)',
              boxShadow: 'var(--shadow-card)',
            }}
            aria-hidden
          >
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(120% 90% at 20% 10%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 60%)',
              }}
            />
            <railVisual.Icon size={44} weight={railVisual.weight} color="#ffffff" />
          </div>
          <div
            className="rounded-2xl bg-white p-3 text-xs leading-relaxed"
            style={{ boxShadow: 'var(--shadow-sm)', fontFamily: 'var(--font-body)', color: 'var(--blue)' }}
          >
            <strong className="mb-1 block">{module?.name ?? current.module}</strong>
            {module?.description ? (
              <span>{emphasizeCatalogueText(module.description, current)}</span>
            ) : null}
            <div className="mt-2 text-gray-400">
              {allSolutions.length} solution{allSolutions.length !== 1 ? 's' : ''} available
            </div>
          </div>
        </aside>
      ) : null}

      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {tabBar}
        {mainScroll}
      </div>
    </div>
  );
}
