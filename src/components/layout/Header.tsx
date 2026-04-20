'use client';

import { Heart, List, MapTrifold, SquaresFour, UsersThree, X } from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GlobalSearch } from '@/components/catalogue/GlobalSearch';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useStore } from '@/lib/store';

interface NavItem {
  href: string;
  label: string;
  Icon: typeof MapTrifold;
  matches: (pathname: string) => boolean;
}

const NAV: NavItem[] = [
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
    href: '/saved',
    label: 'Saved',
    Icon: Heart,
    matches: (p) => p.startsWith('/saved'),
  },
];

/**
 * Persistent global header. Sits above every page (driven by app layout).
 * Left: logo + brand. Centre: global search. Right: pillar nav + theme toggle.
 * On small screens the nav collapses into a sheet menu.
 */
export function Header() {
  const pathname = usePathname() ?? '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const favCount = useStore((s) => s.favourites.length);

  useEffect(() => setHydrated(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-[var(--grey-border)] bg-[var(--surface-card)] backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--surface-card)]"
      style={{ boxShadow: 'var(--shadow-nav)' }}
    >
      <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center gap-3 px-4 md:h-16 md:gap-4 md:px-8">
        {/* Logo + brand */}
        <Link
          href="/"
          aria-label="Experience Catalogue — home"
          className="group flex items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--blue-primary)]"
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white shadow-[var(--shadow-sm)] transition-transform group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--blue) 0%, var(--blue-primary) 100%)' }}
            aria-hidden
          >
            <span className="text-[13px] font-black tracking-tight">SDX</span>
          </span>
          <span className="hidden flex-col leading-tight md:flex">
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--blue)]/60"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Experience
            </span>
            <span
              className="-mt-0.5 text-sm font-extrabold text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Catalogue
            </span>
          </span>
        </Link>

        {/* Global search — takes centre space on desktop, right-aligned icon on mobile */}
        <div className="ml-2 hidden flex-1 justify-center md:flex">
          <GlobalSearch />
        </div>

        {/* Desktop nav + controls */}
        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
          {NAV.map(({ href, label, Icon, matches }) => {
            const active = matches(pathname);
            const isFav = href === '/saved';
            return (
              <Link
                key={href}
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
          <div className="mx-1 h-5 w-px bg-[var(--grey-border)]" aria-hidden />
          <ThemeToggle />
        </nav>

        {/* Mobile: compact search launcher + menu button */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <MobileSearchLauncher />
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="header-mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--grey-border)] bg-[var(--surface-card)] text-[var(--blue)] transition-colors"
          >
            {menuOpen ? <X size={16} weight="bold" /> : <List size={16} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {menuOpen ? (
        <div
          id="header-mobile-menu"
          className="border-t border-[var(--grey-border)] bg-[var(--surface-card)] md:hidden"
        >
          <nav className="flex flex-col gap-1 p-3" aria-label="Primary (mobile)">
            {NAV.map(({ href, label, Icon, matches }) => {
              const active = matches(pathname);
              return (
                <Link
                  key={href}
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
            <div className="mt-2 flex items-center justify-between gap-3 border-t border-[var(--grey-border)] pt-3">
              <span
                className="text-[11px] font-semibold uppercase tracking-wider text-[var(--blue)]/60"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Appearance
              </span>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

/** Tiny search icon on mobile — opens the full GlobalSearch in-place (full width below header). */
function MobileSearchLauncher() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <button
        type="button"
        aria-label="Open search"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--grey-border)] bg-[var(--surface-card)] text-[var(--blue)]"
      >
        <UsersThree size={16} weight="duotone" className="hidden" aria-hidden />
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
