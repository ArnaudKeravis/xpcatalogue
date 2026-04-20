import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { MobileTabBar } from '@/components/layout/MobileTabBar';

interface Props {
  children: ReactNode;
  /** Hide the footer on hero pages (home, areas). */
  hideFooter?: boolean;
  /** Hide the breadcrumb row (home). */
  hideBreadcrumb?: boolean;
}

/**
 * App chrome wrapper. Header is always present (it's the nav spine); breadcrumb
 * and footer are shown by default but can be hidden on marketing/full-bleed pages.
 * On mobile, a persistent tab bar replaces the need for the back-heavy navbar.
 */
export function AppShell({ children, hideFooter, hideBreadcrumb }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)]">
      <Header />
      {hideBreadcrumb ? null : <Breadcrumb />}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      {hideFooter ? null : <Footer />}
      <MobileTabBar />
    </div>
  );
}
