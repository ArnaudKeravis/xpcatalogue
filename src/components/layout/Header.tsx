'use client';

import {
  Clock,
  Factory,
  FirstAid,
  Heart,
  House,
  LightbulbFilament,
  List,
  MapTrifold,
  SquaresFour,
  Trophy,
  TreeStructure,
  UsersThree,
  X,
} from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GlobalSearch } from '@/components/catalogue/GlobalSearch';
import { erPaths, type ErLinkMode } from '@/lib/erNav';
import { useStore } from '@/lib/store';

const XP_CATALOGUE_LOGO = '/images/catalogue/assets/brand/xp-catalogue-mark.svg';

interface NavItem {
  href: string;
  label: string;
  Icon: typeof MapTrifold;
  matches: (pathname: string) => boolean;
  gradient?: string;
}

const NAV_GLOBAL: NavItem[] = [
  {
    href: '/areas',
    label: 'Areas',
    Icon: MapTrifold,
    matches: (p) => p === '/areas' || /^\/(work|learn|heal|play)(\/|$)/.test(p),
  },
  {
    href: '/solutions',
    label: 'Solutions',
    Icon: SquaresFour,
    matches: (p) => p.startsWith('/solutions'),
  },
  {
    href: '/standard-offer',
    label: 'Standard Offer',
    Icon: Trophy,
    matches: (p) => p === '/standard-offer',
    gradient: 'linear-gradient(135deg, #0b76b8 0%, #14b8a6 100%)',
  },
  {
    href: '/big-bets',
    label: 'Big Bets',
    Icon: LightbulbFilament,
    matches: (p) => p === '/big-bets',
    gradient: 'linear-gradient(135deg, #0f766e 0%, #7c3aed 45%, #ea580c 100%)',
  },
  {
    href: '/saved',
    label: 'Saved',
    Icon: Heart,
    matches: (p) => p.startsWith('/saved'),
  },
];

function navErMiniSite(mode: ErLinkMode): NavItem[] {
  const homeHref = erPaths.home(mode);
  const personaeHref = erPaths.personae(mode);
  return [
    {
      href: homeHref,
      label: 'Home',
      Icon: House,
      matches: (p) =>
        p === homeHref ||
        p === '/er' ||
        p === '/er/segment-home' ||
        (mode === 'er-dedicated' && (p === '/' || p === '/er/segment-home')),
    },
    {
      href: personaeHref,
      label: 'Personae',
      Icon: UsersThree,
      matches: (p) =>
        p === personaeHref ||
        p === '/er/personae' ||
        /^\/personae(\/|$)/.test(p) ||
        p.startsWith('/er/personae/'),
    },
    {
      href: erPaths.needs(mode),
      label: 'Needs',
      Icon: FirstAid,
      matches: (p) => p === erPaths.needs(mode) || p === '/er/needs',
    },
    {
      href: erPaths.ifm(mode),
      label: 'IFM',
      Icon: TreeStructure,
      matches: (p) => p === erPaths.ifm(mode) || p === '/er/ifm',
    },
    {
      href: erPaths.journey(mode),
      label: 'Journey',
      Icon: MapTrifold,
      matches: (p) => p === erPaths.journey(mode) || p === '/er/journey',
    },
    {
      href: erPaths.moments(mode),
      label: 'Moments',
      Icon: Clock,
      matches: (p) => p === erPaths.moments(mode) || p === '/er/moments',
    },
    {
      href: erPaths.operatorLens(mode),
      label: 'Operator',
      Icon: Factory,
      matches: (p) => p === erPaths.operatorLens(mode) || p === '/er/operator',
    },
    {
      href: '/solutions',
      label: 'Solutions',
      Icon: SquaresFour,
      matches: (p) => p.startsWith('/solutions'),
    },
    {
      href: '/saved',
      label: 'Saved',
      Icon: Heart,
      matches: (p) => p.startsWith('/saved'),
    },
  ];
}

export function Header({ erLinkMode = 'global' }: { erLinkMode?: ErLinkMode }) {
  const pathname = usePathname() ?? '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const favCount = useStore((s) => s.favourites.length);
  const mini = erLinkMode !== 'global';
  const nav = mini ? navErMiniSite(erLinkMode) : NAV_GLOBAL;

  useEffect(() => setHydrated(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-[var(--grey-border)] bg-[var(--surface-card)] backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--surface-card)]"
      style={{ boxShadow: 'var(--shadow-nav)' }}
    >
      <div className="mx-auto flex h-14 w-full max-w-[1600px] flex-row items-center gap-3 px-4 md:h-16 md:gap-4 md:px-8">
        <Link
          href={mini ? erPaths.home(erLinkMode) : '/'}
          aria-label={mini ? 'Energy & Resources — home' : 'XP Catalogue — home'}
          className="group flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--blue-primary)]"
        >
          <Image
            src={XP_CATALOGUE_LOGO}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-lg shadow-[var(--shadow-sm)] ring-1 ring-[var(--grey-border)] md:h-10 md:w-10"
            unoptimized
          />
          <span className="hidden min-w-0 flex-col leading-tight md:flex">
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--blue)]/60"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {mini ? 'Energy & Resources' : 'Digital & AI · Innovation'}
            </span>
            <span
              className="-mt-0.5 truncate text-sm font-extrabold text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {mini ? 'IFM experience' : 'XP Catalogue'}
            </span>
          </span>
          <span
            className="truncate text-sm font-extrabold text-[var(--blue)] md:hidden"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {mini ? 'E&R' : 'XP Catalogue'}
          </span>
        </Link>

        <div className="ml-2 hidden flex-1 justify-center md:flex">
          <GlobalSearch />
        </div>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
          {nav.map(({ href, label, Icon, matches, gradient }) => {
            const active = matches(pathname);
            const isFav = href === '/saved';
            if (gradient) {
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-[var(--shadow-sm)] transition-transform hover:-translate-y-0.5"
                  style={{ backgroundImage: gradient, fontFamily: 'var(--font-body)' }}
                >
                  <Icon size={13} weight="fill" aria-hidden />
                  {label}
                </Link>
              );
            }
            return (
              <Link
                key={`${href}-${label}`}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={
                  active
                    ? 'relative inline-flex items-center gap-1.5 rounded-full bg-[var(--icon-bg)] px-3 py-1.5 text-xs font-bold text-[var(--blue)] transition-colors'
                    : 'relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--blue)]/70 transition-colors hover:bg-[var(--icon-bg-muted)] hover:text-[var(--blue)]'
                }
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <Icon size={14} weight={active ? 'fill' : 'regular'} aria-hidden />
                {label}
                {isFav && hydrated && favCount > 0 ? (
                  <span
                    className="ml-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--blue-primary)] px-1 text-[9px] font-bold text-white"
                    aria-label={`${favCount} saved`}
                  >
                    {favCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <MobileSearchLauncher />
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-controls="header-mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--grey-border)] bg-[var(--surface-card)] text-[var(--blue)] transition-colors"
          >
            {menuOpen ? <X size={16} weight="bold" /> : <List size={16} weight="bold" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="header-mobile-menu"
          className="border-t border-[var(--grey-border)] bg-[var(--surface-card)] md:hidden"
        >
          <nav className="flex flex-col gap-1 p-3" aria-label="Primary (mobile)">
            {nav.map(({ href, label, Icon, matches, gradient }) => {
              const active = matches(pathname);
              if (gradient) {
                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-sm)]"
                    style={{ backgroundImage: gradient, fontFamily: 'var(--font-body)' }}
                  >
                    <Icon size={18} weight="fill" aria-hidden />
                    {label}
                  </Link>
                );
              }
              return (
                <Link
                  key={`${href}-${label}`}
                  href={href}
                  className={
                    active
                      ? 'flex items-center gap-3 rounded-xl bg-[var(--icon-bg)] px-3 py-2.5 text-sm font-bold text-[var(--blue)]'
                      : 'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--blue)]/80 hover:bg-[var(--icon-bg-muted)]'
                  }
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  <Icon size={18} weight={active ? 'fill' : 'regular'} aria-hidden />
                  {label}
                  {href === '/saved' && hydrated && favCount > 0 ? (
                    <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--blue-primary)] px-1.5 text-[10px] font-bold text-white">
                      {favCount}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function MobileSearchLauncher() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <button
        type="button"
        aria-label="Open search"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--grey-border)] bg-[var(--surface-card)] text-[var(--blue)]"
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
          <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      {open ? (
        <div className="fixed inset-x-0 top-14 z-40 border-b border-[var(--grey-border)] bg-[var(--surface-card)] p-3 backdrop-blur-xl md:hidden">
          <GlobalSearch />
        </div>
      ) : null}
    </>
  );
}
