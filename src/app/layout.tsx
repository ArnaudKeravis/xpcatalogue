import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';
import '../styles/tokens.css';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { FooterSlot } from '@/components/layout/ChromeSlot';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { themeInitScript } from '@/components/ui/ThemeToggle';

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'Sodexo Digital & AI Innovation Experience Catalogue',
    template: '%s · Sodexo Experience Catalogue',
  },
  description:
    "Discover Sodexo's digital and innovative experiences — through the moments of real people's days.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={openSans.variable} suppressHydrationWarning>
      <head>
        {/* Run BEFORE paint to set data-theme from localStorage — prevents FOUC flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-[var(--surface)] font-body antialiased">
        <a
          href="#main-content"
          className="sr-only z-[100] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--blue)] focus:shadow-lg focus:outline focus:outline-2 focus:outline-[var(--blue-primary)]"
        >
          Skip to main content
        </a>

        <Header />
        <Breadcrumb />
        <div className="flex flex-1 flex-col" id="main-content">
          {children}
        </div>
        <FooterSlot>
          <Footer />
        </FooterSlot>
        <MobileTabBar />
      </body>
    </html>
  );
}
