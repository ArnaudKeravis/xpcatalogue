'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { SolutionCard, type SolutionCardLayoutVariant } from '@/components/catalogue/SolutionCard';
import type { Module, Solution } from '@/lib/data/types';

const VARIANTS: { id: SolutionCardLayoutVariant; title: string; blurb: string }[] = [
  {
    id: 'editorial',
    title: 'Proposition 1 — Editorial',
    blurb: 'Full-width hero under tabs, reading column with slightly larger body copy, sticky benefits + download.',
  },
  {
    id: 'bento',
    title: 'Proposition 2 — Bento',
    blurb: 'Pill-style solution switcher, Context + Description merged in one card, row-based Benefits, classic hero column.',
  },
  {
    id: 'quiet',
    title: 'Proposition 3 — Quiet system',
    blurb: 'Single soft main surface, overline-style sections, calmer borders; hero + benefits grouped in the rail.',
  },
];

interface Props {
  solution: Solution;
  siblings: Solution[];
  module?: Module;
  solutionOptions: readonly { id: string; name: string }[];
}

export function SolutionLayoutPreviewClient({
  solution,
  siblings,
  module,
  solutionOptions,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onPickSolution = useCallback(
    (id: string) => {
      const p = new URLSearchParams(searchParams.toString());
      p.set('id', id);
      router.push(`/dev/solution-layout-preview?${p.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="min-h-screen bg-neutral-100 pb-20 text-neutral-900">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white px-4 py-5 shadow-sm md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Dev only</p>
            <h1 className="mt-1 text-2xl font-extrabold text-neutral-900 md:text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
              Solution page — layout preview
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-neutral-700" style={{ fontFamily: 'var(--font-body)' }}>
              Same content as production; pick a solution below, then scroll inside each frame to read the full page.
              Production route{' '}
              <Link className="font-semibold text-[var(--blue-primary)] underline underline-offset-2" href="/solutions">
                /solutions
              </Link>{' '}
              is unchanged.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="preview-solution" className="text-xs font-bold uppercase tracking-wide text-neutral-600">
              Preview solution
            </label>
            <select
              id="preview-solution"
              className="min-w-[260px] rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-base font-semibold text-neutral-900 shadow-sm"
              value={solution.id}
              onChange={(e) => onPickSolution(e.target.value)}
            >
              {solutionOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <nav className="mx-auto mt-5 flex max-w-6xl flex-wrap gap-2" aria-label="Jump to proposition">
          {VARIANTS.map((v) => (
            <a
              key={v.id}
              href={`#preview-${v.id}`}
              className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-bold text-neutral-800 ring-1 ring-neutral-300 hover:bg-white"
            >
              {v.title}
            </a>
          ))}
        </nav>
      </header>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-14 px-4 md:px-8">
        {VARIANTS.map((v) => (
          <section
            key={v.id}
            id={`preview-${v.id}`}
            className="scroll-mt-32 flex h-[min(88vh,960px)] min-h-[560px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg"
          >
            <div className="shrink-0 border-b border-neutral-200 bg-neutral-50 px-4 py-4 md:px-6">
              <h2 className="text-lg font-extrabold text-neutral-900 md:text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
                {v.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700 md:text-base" style={{ fontFamily: 'var(--font-body)' }}>
                {v.blurb}
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--surface)]">
              <SolutionCard
                solution={solution}
                siblings={siblings}
                module={module}
                hideModuleRail
                layoutVariant={v.id}
              />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
