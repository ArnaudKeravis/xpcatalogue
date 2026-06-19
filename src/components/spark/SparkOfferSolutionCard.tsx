'use client';

import { ArrowLeft, Trophy } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState } from 'react';
import { SolutionHeroTile } from '@/components/catalogue/SolutionHeroTile';
import { CountryFlagTags } from '@/components/catalogue/CountryFlagTags';
import { SparkSharePointCallout } from '@/components/spark/SparkSharePointCallout';
import { FavouriteButton } from '@/components/ui/FavouriteButton';
import { ShareButton } from '@/components/ui/ShareButton';
import { COLLECTION_META } from '@/lib/data/collections';
import type { Module, Solution } from '@/lib/data/types';
import { emphasizeCatalogueText } from '@/lib/format/emphasizeCatalogueText';
import { cn } from '@/lib/utils/cn';

interface Props {
  solution: Solution;
  siblings: Solution[];
  module?: Module;
}

function statusColor(s: string) {
  if (s === 'Scaled') return '#27ae60';
  if (s === 'Scaling') return '#e67e22';
  if (s === 'Pilot') return '#3498db';
  return '#95a5a6';
}

/**
 * Minimal Spark Offer solution sheet — image, short description, SharePoint CTA only.
 * Full context, benefits and KPIs stay on SharePoint.
 */
export function SparkOfferSolutionCard({ solution, siblings, module }: Props) {
  const allSolutions = [solution, ...siblings];
  const [active, setActive] = useState(solution.id);
  const current = allSolutions.find((s) => s.id === active) ?? solution;
  const sc = statusColor(current.status);
  const sparkMeta = COLLECTION_META['standard-offer'];

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--surface)]">
      <header className="flex flex-wrap items-center gap-3 border-b border-[var(--grey-border)] bg-[var(--surface-card)] px-4 py-3 md:px-6">
        <Link
          href={sparkMeta.href}
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--blue-primary)] hover:underline"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <ArrowLeft size={14} weight="bold" aria-hidden />
          Spark Offer
        </Link>
        <span className="hidden text-[var(--grey-border)] sm:inline" aria-hidden>
          ·
        </span>
        <span className="text-xs text-[var(--blue)]/60" style={{ fontFamily: 'var(--font-body)' }}>
          {module?.name ?? current.module}
        </span>
        <div className="ml-auto flex items-center gap-2 print:hidden">
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
      </header>

      {allSolutions.length > 1 ? (
        <div
          className="flex flex-shrink-0 items-center gap-2 overflow-x-auto border-b border-[var(--grey-border)] bg-white px-4 py-2 md:px-6"
          role="tablist"
          aria-label="Solutions in this module"
        >
          <span
            className="mr-1 shrink-0 text-xs font-bold uppercase tracking-[0.12em] text-[var(--blue)]/50"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Module
          </span>
          {allSolutions.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={s.id === active}
              onClick={() => setActive(s.id)}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                s.id === active
                  ? 'bg-[var(--blue)] text-white shadow-[var(--shadow-sm)]'
                  : 'border border-[var(--grey-border)] bg-white text-[var(--blue)] hover:border-[var(--blue-primary)]',
              )}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {s.name}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 md:py-10">
        <article className="mx-auto flex max-w-3xl flex-col gap-6">
          <div className="space-y-3 text-center md:text-left">
            <Link
              href={sparkMeta.href}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-[var(--shadow-sm)] transition-transform hover:scale-[1.02]"
              style={{ backgroundImage: sparkMeta.gradient, fontFamily: 'var(--font-body)' }}
            >
              <Trophy size={13} weight="fill" aria-hidden />
              {sparkMeta.label}
            </Link>
            <h1
              className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-tight text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {current.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
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
              <CountryFlagTags solution={current} size="md" className="justify-center md:justify-start" />
            </div>
          </div>

          <SolutionHeroTile
            solution={current}
            module={module}
            heightClassName="h-56 md:h-72"
            alt={`${current.name} — ${module?.name ?? current.module}`}
            className="w-full"
          />

          <p
            className="text-center text-base leading-relaxed text-[var(--blue)]/80 md:text-left md:text-lg"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {emphasizeCatalogueText(current.description, current)}
          </p>

          <SparkSharePointCallout variant="inline" solutionName={current.name} />
        </article>
      </div>
    </div>
  );
}
