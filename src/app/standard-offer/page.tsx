import Link from 'next/link';
import { ArrowLeft, ArrowSquareOut } from '@phosphor-icons/react/dist/ssr';
import { StandardOfferParallax } from '@/components/standard-offer/StandardOfferParallax';
import { COLLECTION_META } from '@/lib/data/collections';
import { getCatalogueData } from '@/lib/notion';
import type { Solution } from '@/lib/data/types';

export const revalidate = 3600;

export default async function StandardOfferPage() {
  const catalogueHref = COLLECTION_META['standard-offer'].catalogueHref!;
  const data = await getCatalogueData().catch(() => null);

  const byId = data ? new Map(data.solutions.map((s) => [s.id, s])) : null;

  function pick(ids: readonly string[]): Solution[] {
    if (!byId) return [];
    return ids.map((id) => byId.get(id)).filter((s): s is Solution => Boolean(s));
  }

  const featured = data
    ? {
        iq: pick(['4site', 'b2bPlatform', 'dbfm']),
        os: pick(['menuai', 'sea', 'sodexoWrx']),
        xp: pick(['everyday', 'circles', 'aifi']),
      }
    : undefined;

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
          href={catalogueHref}
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--blue-primary)] hover:underline"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <ArrowSquareOut size={14} weight="bold" aria-hidden />
          Catalogue + grid
        </Link>
      </header>
      <main id="main-content">
        <StandardOfferParallax featured={featured} />
      </main>
    </div>
  );
}
