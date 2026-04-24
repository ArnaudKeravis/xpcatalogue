import Link from 'next/link';
import { ArrowLeft, ArrowSquareOut } from '@phosphor-icons/react/dist/ssr';
import { StandardOfferParallax } from '@/components/standard-offer/StandardOfferParallax';
import { COLLECTION_META } from '@/lib/data/collections';

export const revalidate = 3600;

export default function StandardOfferPage() {
  const catalogue = COLLECTION_META['standard-offer'].catalogueHref!;

  return (
    <div className="flex flex-1 flex-col bg-[var(--surface)]">
      <header className="flex flex-wrap items-center gap-3 border-b border-[var(--grey-border)] bg-[var(--surface-card)] px-6 py-4 md:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--blue-primary)] hover:underline"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <ArrowLeft size={14} weight="bold" aria-hidden />
          Home
        </Link>
        <span className="hidden text-[var(--grey-border)] sm:inline" aria-hidden>
          ·
        </span>
        <Link
          href={catalogue}
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--blue-primary)] hover:underline"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <ArrowSquareOut size={14} weight="bold" aria-hidden />
          Catalogue + grid
        </Link>
      </header>
      <main id="main-content">
        <StandardOfferParallax />
      </main>
    </div>
  );
}
