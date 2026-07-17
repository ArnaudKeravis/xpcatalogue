'use client';

import { CaretRight, House } from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Minimal auto-computed breadcrumb based on URL. Consumers can override via `items`. */
export function Breadcrumb({ items }: { items?: BreadcrumbItem[] }) {
  const pathname = usePathname() ?? '/';
  const computed = items ?? computeFromPath(pathname);

  // Don't render on the marketing home — noisy.
  if (!computed.length || pathname === '/') return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-[var(--grey-border)] bg-[var(--surface-card)]/60 backdrop-blur supports-[backdrop-filter]:bg-[var(--surface-card)]/40"
    >
      <ol
        className="mx-auto flex w-full max-w-[1600px] items-center gap-1.5 overflow-x-auto px-4 py-2 text-xs md:px-8"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <li className="shrink-0">
          <Link
            href="/"
            className="flex items-center gap-1 rounded-md px-1 py-0.5 text-[var(--blue)]/60 transition-colors hover:text-[var(--blue)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
            aria-label="Home"
          >
            <House size={12} weight="duotone" aria-hidden />
          </Link>
        </li>
        {computed.map((c, i) => {
          const last = i === computed.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex shrink-0 items-center gap-1.5">
              <CaretRight size={10} weight="bold" className="text-[var(--blue)]/30" aria-hidden />
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className="rounded-md px-1 py-0.5 font-semibold text-[var(--blue)]/70 transition-colors hover:text-[var(--blue)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
                >
                  {c.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? 'page' : undefined}
                  className="px-1 py-0.5 font-bold text-[var(--blue)]"
                >
                  {c.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const AREA_LABELS: Record<string, string> = {
  work: 'Work',
  learn: 'Learn',
  heal: 'Heal',
  play: 'Play',
};

function computeFromPath(pathname: string): BreadcrumbItem[] {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return [];

  if (parts[0] === 'areas') {
    return [{ label: 'Areas' }];
  }
  if (parts[0] === 'solutions') {
    if (parts.length === 1) return [{ label: 'Solutions' }];
    return [{ label: 'Solutions', href: '/solutions' }, { label: 'Detail' }];
  }
  if (parts[0] === 'modules') {
    return [{ label: 'Modules', href: '/solutions' }, { label: 'Module' }];
  }
  if (parts[0] === 'saved') {
    return [{ label: 'Saved' }];
  }
  if (parts[0] === 'login') {
    return [{ label: 'Sign in' }];
  }

  const area = parts[0];
  if (area in AREA_LABELS) {
    const crumbs: BreadcrumbItem[] = [
      { label: 'Areas', href: '/areas' },
      { label: AREA_LABELS[area], href: `/${area}` },
    ];
    if (parts[1]) {
      crumbs.push({
        label: prettyPersona(parts[1]),
        href: `/${area}/${parts[1]}`,
      });
    }
    if (parts[2] === 'moment' && parts[3]) {
      crumbs.push({ label: prettyMoment(parts[3]) });
    }
    // Strip the trailing href from the last crumb so it's marked current.
    if (crumbs.length > 0) delete crumbs[crumbs.length - 1].href;
    return crumbs;
  }

  return parts.map((p) => ({ label: p.replace(/-/g, ' ') }));
}

function prettyPersona(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
function prettyMoment(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
