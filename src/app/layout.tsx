import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import '../styles/tokens.css';

export const metadata: Metadata = {
  title: 'Sodexo Digital & AI Innovation Experience Catalogue',
  description: 'Discover Sodexo digital and innovative experiences',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--blue-solid)]">{children}</body>
    </html>
  );
}
