import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { SodexoSparkHero } from '@/components/spark/SodexoSparkHero';
import { SparkSharePointBanner } from '@/components/spark/SparkSharePointBanner';
import { SparkSolutionsCatalogue } from '@/components/spark/SparkSolutionsCatalogue';
import { getCatalogueData } from '@/lib/notion';

export const revalidate = 3600;

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function StandardOfferPage({ searchParams }: Props) {
  const data = await getCatalogueData().catch(() => null);

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
      </header>
      <main id="main-content" className="flex flex-1 flex-col">
        <SodexoSparkHero />
        <SparkSharePointBanner />
        {data ? (
          <Suspense fallback={<div className="mx-auto h-40 max-w-[1600px] animate-pulse rounded-[var(--radius-lg)] bg-gray-100 px-8" />}>
            <SparkSolutionsCatalogue catalogue={data} searchParams={searchParams} />
          </Suspense>
        ) : (
          <p className="px-8 py-10 text-sm text-[var(--blue)]/60" style={{ fontFamily: 'var(--font-body)' }}>
            Catalogue data is temporarily unavailable. Please try again shortly.
          </p>
        )}
      </main>
    </div>
  );
}
