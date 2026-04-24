import { ArrowRight, Rocket, Trophy } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { COLLECTION_META } from '@/lib/data/collections';
import type { Solution, SolutionCollection } from '@/lib/data/types';

/**
 * Home-page band that surfaces the two curated collections — Standard Offer
 * and AI Blockbusters. Each tile becomes an editorial
 * shortcut into `COLLECTION_META.href` (Standard Offer story vs Blockbuster grid),
 * with a live count and a few representative solution names so the band is never empty-feeling.
 *
 * Rendered as a server component: counts + previews are derived from the
 * already-fetched solution list, so no extra round-trip is needed.
 */
export function CuratedCollectionsBand({ solutions }: { solutions: Solution[] }) {
  const previews = buildPreviews(solutions);
  return (
    <section
      aria-labelledby="curated-collections-heading"
      className="relative z-10 px-6 pb-16 pt-4 md:px-12"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--blue)]/60"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <span aria-hidden className="h-px w-8 bg-[var(--blue-primary)]" />
              Curated
            </span>
            <h2
              id="curated-collections-heading"
              className="mt-2 text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-tight text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Institutionally-blessed shortcuts
            </h2>
            <p
              className="mt-1 max-w-2xl text-sm text-[var(--blue)]/70"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Two shortlists to cut through 91 solutions —{' '}
              <strong className="text-[var(--blue)]">Standard Offer</strong> for scaled, client-ready
              products, and the <strong className="text-[var(--blue)]">AI Blockbusters</strong> driving
              Sodexo P&amp;L.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <CollectionTile
            collectionKey="standard-offer"
            count={previews['standard-offer'].count}
            previews={previews['standard-offer'].names}
          />
          <CollectionTile
            collectionKey="blockbuster"
            count={previews.blockbuster.count}
            previews={previews.blockbuster.names}
          />
        </div>
      </div>
    </section>
  );
}

/* ── Tile ────────────────────────────────────────────────────────────────── */

function CollectionTile({
  collectionKey,
  count,
  previews,
}: {
  collectionKey: SolutionCollection;
  count: number;
  previews: string[];
}) {
  const meta = COLLECTION_META[collectionKey];
  const Icon = meta.icon === 'Trophy' ? Trophy : Rocket;

  return (
    <Link
      href={meta.href}
      className="group relative flex flex-col overflow-hidden rounded-brand-2xl p-7 text-white shadow-[var(--shadow-panel)] transition-[transform,box-shadow] duration-[var(--motion-base)] ease-[var(--ease-out-quint)] hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:p-8"
      style={{ backgroundImage: meta.gradient }}
    >
      {/* Ambient texture — a soft radial + grain so the gradient doesn't feel flat. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 85% 15%, rgba(255,255,255,0.28) 0%, transparent 55%)',
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-white/10 blur-2xl"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-brand-xl border border-white/25 text-white backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.14)' }}
        >
          <Icon size={28} weight="fill" aria-hidden />
        </div>
        <div className="flex flex-col items-end">
          <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
            {meta.shortLabel}
          </span>
          <span
            className="mt-2 text-[clamp(2.25rem,4vw,3rem)] font-black leading-none text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.2)]"
            style={{ fontFamily: 'var(--font-heading)' }}
            aria-label={`${count} solutions`}
          >
            {count}
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
            Solutions
          </span>
        </div>
      </div>

      <h3
        className="relative mt-6 text-[clamp(1.5rem,2.4vw,2.125rem)] font-extrabold leading-tight"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {meta.label}
      </h3>
      <p
        className="relative mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-white/85"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {meta.tagline}
      </p>
      <p
        className="relative mt-3 max-w-xl text-[0.95rem] leading-relaxed text-white/90"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {meta.description}
      </p>

      {previews.length > 0 ? (
        <ul className="relative mt-5 flex flex-wrap gap-1.5" aria-label="Highlighted solutions">
          {previews.slice(0, 6).map((name) => (
            <li
              key={name}
              className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/95 backdrop-blur-sm"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {name}
            </li>
          ))}
          {count > previews.slice(0, 6).length ? (
            <li
              className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              +{count - Math.min(previews.length, 6)} more
            </li>
          ) : null}
        </ul>
      ) : null}

      <div className="relative mt-6 flex items-center justify-between">
        <span
          className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/80"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Discover the {meta.label.toLowerCase()}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[var(--blue)] shadow-[var(--shadow-sm)] transition-transform duration-[var(--motion-base)] ease-[var(--ease-hover)] group-hover:translate-x-0.5">
          Explore <ArrowRight size={14} weight="bold" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

/* ── Data helpers ────────────────────────────────────────────────────────── */

function buildPreviews(solutions: Solution[]): Record<
  SolutionCollection,
  { count: number; names: string[] }
> {
  const init: Record<SolutionCollection, { count: number; names: string[] }> = {
    'standard-offer': { count: 0, names: [] },
    blockbuster: { count: 0, names: [] },
  };

  for (const s of solutions) {
    if (!s.collections) continue;
    for (const c of s.collections) {
      init[c].count += 1;
      if (init[c].names.length < 8) {
        init[c].names.push(s.name);
      }
    }
  }

  return init;
}
