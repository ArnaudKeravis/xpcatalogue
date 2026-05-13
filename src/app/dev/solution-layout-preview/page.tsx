import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getCatalogueData } from '@/lib/notion';
import { SolutionLayoutPreviewClient } from '@/components/dev/SolutionLayoutPreviewClient';

export const metadata: Metadata = {
  title: 'Solution layout preview (dev)',
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function SolutionLayoutPreviewPage({ searchParams }: PageProps) {
  const { solutions, modules } = await getCatalogueData();
  const raw = searchParams.id;
  const requestedId = Array.isArray(raw) ? raw[0] : raw;
  const solution = solutions.find((s) => s.id === requestedId) ?? solutions[0];

  if (!solution) {
    return (
      <div className="p-10 text-sm text-gray-600">
        No solutions in catalogue — add Excel-generated solutions first.
      </div>
    );
  }

  const siblings = solutions.filter((s) => s.module === solution.module && s.id !== solution.id);
  const mod = modules[solution.module];

  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-500">Loading preview…</div>}>
      <SolutionLayoutPreviewClient
        solution={solution}
        siblings={siblings}
        module={mod}
        solutionOptions={solutions.map((s) => ({ id: s.id, name: s.name }))}
      />
    </Suspense>
  );
}
