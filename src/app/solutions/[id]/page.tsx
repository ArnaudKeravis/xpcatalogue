import { notFound } from 'next/navigation';
import { SolutionCard } from '@/components/catalogue/SolutionCard';
import { Navbar } from '@/components/layout/Navbar';
import { getCatalogueData } from '@/lib/notion';

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

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)]">
      <Navbar
        title={solution.name}
        backHref="/areas"
        breadcrumb={[{ label: solution.module }, { label: solution.name }]}
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <SolutionCard solution={solution} siblings={siblings} module={mod} />
      </main>
    </div>
  );
}
