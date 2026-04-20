'use client';

import { Heart } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useStore, type FavouriteItem, type FavouriteKind } from '@/lib/store';

interface Props {
  kind: FavouriteKind;
  id: string;
  label: string;
  href: string;
  meta?: string;
  /** `compact` = icon-only round button, `pill` = icon+label pill. */
  variant?: 'compact' | 'pill';
  className?: string;
}

/**
 * Heart toggle backed by Zustand `favourites`. Renders an inert placeholder
 * until hydration to avoid SSR/client mismatch (persist middleware fills from
 * localStorage after mount).
 */
export function FavouriteButton({
  kind,
  id,
  label,
  href,
  meta,
  variant = 'compact',
  className,
}: Props) {
  const [hydrated, setHydrated] = useState(false);
  const toggleFavourite = useStore((s) => s.toggleFavourite);
  const active = useStore((s) => s.favourites.some((f) => f.kind === kind && f.id === id));

  useEffect(() => setHydrated(true), []);

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const payload: Omit<FavouriteItem, 'addedAt'> = { kind, id, label, href, meta };
    toggleFavourite(payload);
  }

  const stateActive = hydrated && active;
  const a11yLabel = stateActive ? `Remove ${label} from saved` : `Save ${label}`;

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={stateActive}
        aria-label={a11yLabel}
        title={a11yLabel}
        className={
          className ??
          `inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
            stateActive
              ? 'border-[var(--blue-primary)] bg-[var(--blue-primary)] text-white'
              : 'border-[var(--grey-border)] bg-[var(--surface-card)] text-[var(--blue)] hover:border-[var(--blue-primary)]'
          }`
        }
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <Heart size={14} weight={stateActive ? 'fill' : 'regular'} aria-hidden />
        {stateActive ? 'Saved' : 'Save'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={stateActive}
      aria-label={a11yLabel}
      title={a11yLabel}
      className={
        className ??
        `flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-[var(--motion-base)] ease-[var(--ease-out-quint)] ${
          stateActive
            ? 'border-[var(--blue-primary)] bg-[var(--blue-primary)] text-white scale-105'
            : 'border-[var(--grey-border)] bg-[var(--surface-card)] text-[var(--blue)] hover:border-[var(--blue-primary)] hover:text-[var(--blue-primary)]'
        }`
      }
    >
      <Heart size={16} weight={stateActive ? 'fill' : 'regular'} aria-hidden />
    </button>
  );
}
