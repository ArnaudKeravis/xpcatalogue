'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const HERO_PATHS = ['/', '/login', '/er', '/er/segment-home'];

/** Hides its children on hero paths (home, login). Pass the Footer in. */
export function FooterSlot({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/';
  if (HERO_PATHS.includes(pathname)) return null;
  // Also skip on /areas — the isometric hero needs the full viewport.
  if (pathname === '/areas') return null;
  return <>{children}</>;
}
