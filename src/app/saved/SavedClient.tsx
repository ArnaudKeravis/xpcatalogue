'use client';

import { ArrowRight, Clock, Heart, Trash } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useStore, type FavouriteKind } from '@/lib/store';

const LABELS: Record<FavouriteKind, { title: string; emoji: string; blurb: string }> = {
  persona: {
    title: 'Personas',
    emoji: '👤',
    blurb: "The lives you're following — their full day, with every moment of care.",
  },
  moment: {
    title: 'Moments',
    emoji: '⏱️',
    blurb: 'Specific moments of a persona\u2019s day, bookmarked for the workshop.',
  },
  solution: {
    title: 'Solutions',
    emoji: '🧩',
    blurb: 'The concrete tools that power those moments.',
  },
};

const ORDER: FavouriteKind[] = ['persona', 'moment', 'solution'];

export function SavedClient() {
  const [hydrated, setHydrated] = useState(false);
  const favourites = useStore((s) => s.favourites);
  const toggleFavourite = useStore((s) => s.toggleFavourite);
  const clearFavourites = useStore((s) => s.clearFavourites);

  useEffect(() => setHydrated(true), []);

  const grouped = useMemo(() => {
    const out: Record<FavouriteKind, typeof favourites> = {
      persona: [],
      moment: [],
      solution: [],
    };
    for (const f of favourites) out[f.kind].push(f);
    for (const k of ORDER) out[k].sort((a, b) => b.addedAt - a.addedAt);
    return out;
  }, [favourites]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-[var(--icon-bg-muted)]" />
      </div>
    );
  }

  const total = favourites.length;

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8 md:px-10 md:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--blue-primary)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Your collection
          </p>
          <h1
            className="mt-1 text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-none text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Saved
            {total > 0 ? (
              <span className="ml-3 align-middle text-[var(--blue-primary)] text-[0.5em]">{total}</span>
            ) : null}
          </h1>
          <p
            className="mt-3 max-w-xl text-sm text-[var(--blue)]/70"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            A private shortlist for the personas, moments and solutions you want to come back to.
            Stored on this device only.
          </p>
        </div>

        {total > 0 ? (
          <button
            type="button"
            onClick={() => {
              if (confirm('Clear all saved items?')) clearFavourites();
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--grey-border)] bg-[var(--surface-card)] px-3 py-1.5 text-xs font-semibold text-[var(--blue)]/70 transition-colors hover:border-[var(--blue-primary)] hover:text-[var(--blue-primary)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <Trash size={13} aria-hidden /> Clear all
          </button>
        ) : null}
      </div>

      {total === 0 ? <EmptyState /> : null}

      <div className="flex flex-col gap-10">
        {ORDER.filter((k) => grouped[k].length > 0).map((kind) => (
          <section key={kind} aria-labelledby={`saved-${kind}`}>
            <div className="mb-3 flex items-baseline gap-3">
              <h2
                id={`saved-${kind}`}
                className="text-lg font-extrabold text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                <span className="mr-2" aria-hidden>{LABELS[kind].emoji}</span>
                {LABELS[kind].title}
              </h2>
              <span className="text-[11px] text-[var(--blue)]/50">
                {grouped[kind].length}
              </span>
            </div>
            <p
              className="mb-4 text-xs text-[var(--blue)]/60"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {LABELS[kind].blurb}
            </p>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[kind].map((f) => (
                <li key={`${f.kind}-${f.id}`}>
                  <div className="group relative flex h-full flex-col gap-2 rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-4 shadow-[var(--shadow-sm)] transition-[transform,box-shadow] duration-[var(--motion-base)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]">
                    <Link
                      href={f.href}
                      className="absolute inset-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--blue-primary)]"
                      aria-label={`Open ${f.label}`}
                    />
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p
                          className="truncate text-sm font-extrabold text-[var(--blue)]"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {f.label}
                        </p>
                        {f.meta ? (
                          <p className="truncate text-xs text-[var(--blue)]/60">{f.meta}</p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavourite({
                            kind: f.kind,
                            id: f.id,
                            label: f.label,
                            href: f.href,
                            meta: f.meta,
                          });
                        }}
                        aria-label={`Remove ${f.label}`}
                        className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-[var(--blue)]/40 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Heart size={14} weight="fill" aria-hidden />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-[11px]">
                      <span className="inline-flex items-center gap-1 text-[var(--blue)]/50">
                        <Clock size={11} aria-hidden /> {formatAddedAt(f.addedAt)}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[var(--blue-primary)] group-hover:gap-1.5 transition-all">
                        Open <ArrowRight size={11} weight="bold" aria-hidden />
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-[var(--grey-border)] bg-[var(--surface-card)] p-12 text-center">
      <span
        aria-hidden
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--icon-bg)] text-2xl"
      >
        ♥
      </span>
      <div className="max-w-md">
        <h2
          className="text-xl font-extrabold text-[var(--blue)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Nothing saved yet
        </h2>
        <p
          className="mt-2 text-sm text-[var(--blue)]/70"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Tap the heart on any persona, moment or solution to build your personal shortlist. Perfect
          for workshop prep — or coming back to that one idea at 11pm.
        </p>
      </div>
      <Link
        href="/areas"
        className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--blue-primary)] px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        Explore by area <ArrowRight size={14} weight="bold" aria-hidden />
      </Link>
    </div>
  );
}

function formatAddedAt(ts: number): string {
  const diffS = Math.round((Date.now() - ts) / 1000);
  if (diffS < 60) return 'just now';
  if (diffS < 3600) return `${Math.round(diffS / 60)}m`;
  if (diffS < 86400) return `${Math.round(diffS / 3600)}h`;
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
