import { notFound } from 'next/navigation';
import { SolutionCard } from '@/components/catalogue/SolutionCard';
import { SparkOfferSolutionCard } from '@/components/spark/SparkOfferSolutionCard';
import { getCatalogueData } from '@/lib/notion';
import { isSparkOfferSolution } from '@/lib/sparkSharePoint';

export const revalidate = 3600;

interface Props {
  params: { id: string };
}

export default async function SolutionPage({ params }: Props) {
  const { solutions, modules } = await getCatalogueData();
  const solution = solutions.find((s) => s.id === params.id);
  if (!solution) notFound();

  const mod = modules[solution.module];
  const siblings = mod
    ? solutions.filter((s) => s.module === solution.module && s.id !== solution.id)
    : [];

  if (isSparkOfferSolution(solution)) {
    const sparkSiblings = siblings.filter(isSparkOfferSolution);
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-[var(--surface)]">
        <SparkOfferSolutionCard solution={solution} siblings={sparkSiblings} module={mod} />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--surface)]">
      <div className="flex min-h-0 flex-1 flex-col">
        <SolutionCard solution={solution} siblings={siblings} module={mod} />
      </div>
    </div>
  );
}
