'use client';

import {
  Article,
  ChartBar,
  FileText,
  Info,
  LinkSimple,
  Phone,
  Rocket,
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

interface Props {
  solution: Solution;
  siblings: Solution[];
  module?: Module;
  /** Omit the left module summary rail (module page already shows it in the header). */
  hideModuleRail?: boolean;
}

function statusColor(s: string) {
  if (s === 'Scaled') return '#27ae60';
  if (s === 'Scaling') return '#e67e22';
  if (s === 'Pilot') return '#3498db';
  return '#95a5a6';
}

export function SolutionCard({ solution, siblings, module, hideModuleRail = false }: Props) {
  const [active, setActive] = useState(solution.id);
  const [exporting, startExport] = useTransition();
  const allSolutions = [solution, ...siblings];
  const current = allSolutions.find((s) => s.id === active) ?? solution;
  const sc = statusColor(current.status);
  const railVisual = hideModuleRail ? null : pickModuleVisual(module ?? undefined);

  const handleDownload = () => {
    startExport(async () => {
      const { exportSolutionToPptx } = await import('@/lib/export/pptSolution');
      await exportSolutionToPptx(current, {
        module,
        siblingCount: allSolutions.length,
      });
    });
  };

  return (
    <div className="flex min-h-0 flex-1">
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
            {module?.description}
            <div className="mt-2 text-gray-400">
              {allSolutions.length} solution{allSolutions.length !== 1 ? 's' : ''} available
            </div>
          </div>
        </aside>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
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
          <div className="flex h-full flex-1 items-center overflow-x-auto border-b-2 border-[var(--grey-border)]">
            {allSolutions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                className={`flex h-full items-center whitespace-nowrap border-b-[3px] px-4 text-sm font-semibold transition-colors -mb-0.5 ${
                  s.id === active
                    ? 'border-[var(--blue-solid)] font-bold text-[var(--blue-solid)]'
                    : 'border-transparent text-[var(--blue-solid)] hover:text-[var(--blue-solid)]'
                }`}
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

        <div className="flex min-h-0 flex-1 gap-5 overflow-y-auto p-6">
          <div className="min-w-0 flex-1 space-y-3">
            <h1 className="text-3xl font-extrabold text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {current.name}
            </h1>

            {current.collections && current.collections.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {current.collections.map((c) => {
                  const meta = COLLECTION_META[c];
                  const Icon = c === 'blockbuster' ? Rocket : Trophy;
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
                {current.type}
              </span>
              <span
                className="rounded-full border-2 px-3 py-1 text-xs font-bold"
                style={{ borderColor: sc, color: sc, fontFamily: 'var(--font-body)' }}
              >
                {current.status}
              </span>
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

            <Section icon={<Info size={20} weight="fill" color="var(--blue)" />} title="Context">
              <p className="text-xs leading-relaxed text-gray-600">{current.context}</p>
            </Section>

            <Section icon={<Article size={20} weight="fill" color="var(--blue)" />} title="Description">
              <p className="whitespace-pre-wrap text-xs leading-relaxed text-gray-600">{current.description}</p>
            </Section>

            <div className="grid grid-cols-2 gap-3">
              <Section icon={<ChartBar size={20} weight="fill" color="var(--blue)" />} title="Deployment & KPIs">
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {current.kpis.map((k, i) => (
                    <div key={i} className="rounded-lg bg-[#f0f4ff] p-2.5">
                      <div
                        className="tabular text-xl font-extrabold text-[var(--blue-primary)]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {k.v}
                      </div>
                      <div className="mt-0.5 text-[10px] text-gray-500">{k.l}</div>
                    </div>
                  ))}
                </div>
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
          </div>

          <aside className="w-72 flex-shrink-0 space-y-3">
            <SolutionHeroTile
              solution={current}
              module={module}
              alt={`${current.name} — ${module?.name ?? current.module}`}
            />

            <div
              className="rounded-[var(--radius-lg)] bg-white p-4"
              style={{ border: '1px solid rgba(0,0,0,.1)', boxShadow: 'var(--shadow-benefits)' }}
            >
              <h2 className="mb-3 text-base font-bold text-[var(--blue)]">Benefits</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Client', icon: <TrendUp size={22} weight="fill" color="var(--blue)" />, text: current.benefits.client },
                  { label: 'Consumer', icon: <User size={22} weight="fill" color="var(--blue)" />, text: current.benefits.consumer },
                  { label: 'Sodexo', icon: <FileText size={22} weight="fill" color="var(--blue)" />, text: current.benefits.sodexo },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-[#d9d9d9] p-2 text-center"
                  >
                    <span className="text-base font-bold text-[var(--blue)]">{b.label}</span>
                    <div className="flex h-8 w-8 items-center justify-center">{b.icon}</div>
                    <p className="text-[10px] leading-tight text-gray-500">{b.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <DownloadCta
              variant="block"
              label="Download PowerPoint"
              pending={exporting}
              onClick={handleDownload}
            />
            <p className="text-right text-xs text-gray-400" style={{ fontFamily: 'var(--font-body)' }}>
              ↻ Synced from Notion
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
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
