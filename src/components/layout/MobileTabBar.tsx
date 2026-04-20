'use client';

import {
  Heart,
  House,
  MagnifyingGlass,
  MapTrifold,
  SquaresFour,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';

interface Tab {
  href: string;
  label: string;
  Icon: typeof House;
  match: (p: string) => boolean;
  openSearch?: boolean;
}

const TABS: Tab[] = [
  { href: '/', label: 'Home', Icon: House, match: (p) => p === '/' },
  {
    href: '/areas',
    label: 'Areas',
    Icon: MapTrifold,
    match: (p) => p === '/areas' || /^\/(work|learn|heal|play)(\/|$)/.test(p),
  },
  {
    href: '#search',
    label: 'Search',
    Icon: MagnifyingGlass,
    match: () => false,
    openSearch: true,
  },
  {
    href: '/solutions',
    label: 'Catalogue',
    Icon: SquaresFour,
    match: (p) => p.startsWith('/solutions'),
  },
  {
    href: '/saved',
    label: 'Saved',
    Icon: Heart,
    match: (p) => p.startsWith('/saved'),
  },
];

/**
 * Persistent bottom tab bar on < md viewports. Fires a custom `sdx:open-search`
 * event so the Header's global search can pop open (keeps single-source search).
 */
export function MobileTabBar() {
  const pathname = usePathname() ?? '/';
  const [hydrated, setHydrated] = useState(false);
  const favCount = useStore((s) => s.favourites.length);
  useEffect(() => setHydrated(true), []);

  function onClick(tab: Tab) {
    if (tab.openSearch) {
      // Focus the existing global search input if present.
      const input = document.querySelector<HTMLInputElement>('input[aria-label="Search the catalogue"]');
      input?.focus();
      input?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  return (
    <nav
      aria-label="Quick navigation"
      className="sticky bottom-0 z-30 border-t border-[var(--grey-border)] bg-[var(--surface-card)] backdrop-blur-xl md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex items-stretch justify-around">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          const isFav = tab.href === '/saved';

          const inner = (
            <div
              className={
                active
                  ? 'flex flex-col items-center gap-0.5 py-2 text-[var(--blue-primary)]'
                  : 'flex flex-col items-center gap-0.5 py-2 text-[var(--blue)]/60'
              }
            >
              <span className="relative">
                <tab.Icon size={20} weight={active ? 'fill' : 'regular'} aria-hidden />
                {isFav && hydrated && favCount > 0 ? (
                  <span
                    className="absolute -right-2 -top-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--blue-primary)] px-1 text-[9px] font-bold text-white"
                    aria-label={`${favCount} saved`}
                  >
                    {favCount}
                  </span>
                ) : null}
              </span>
              <span
                className={`text-[10px] font-semibold ${active ? '' : 'opacity-70'}`}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {tab.label}
              </span>
            </div>
          );

          return (
            <li key={tab.label} className="flex-1">
              {tab.openSearch ? (
                <button
                  type="button"
                  onClick={() => onClick(tab)}
                  className="w-full"
                  aria-label={tab.label}
                >
                  {inner}
                </button>
              ) : (
                <Link href={tab.href} aria-current={active ? 'page' : undefined} className="block">
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
