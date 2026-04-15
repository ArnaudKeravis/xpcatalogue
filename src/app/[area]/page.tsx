import { notFound } from 'next/navigation';
import { PersonaCard } from '@/components/catalogue/PersonaCard';
import { Navbar } from '@/components/layout/Navbar';
import { getCatalogueData } from '@/lib/notion';
import type { Area } from '@/lib/data/types';

export const revalidate = 3600;

const AREA_KEYS = new Set<Area>(['work', 'learn', 'heal', 'play']);

interface Props {
  params: { area: string };
}

export default async function AreaPage({ params }: Props) {
  const { personas, areas } = await getCatalogueData();
  if (!AREA_KEYS.has(params.area as Area)) notFound();

  const areaConfig = areas[params.area as Area];
  if (!areaConfig) notFound();

  const areaPersonas = personas.filter((p) => p.area === params.area);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar
        title={`Here are our key personae in the ${areaConfig.label.toLowerCase()} context`}
        backHref="/areas"
        breadcrumb={[{ label: areaConfig.label, href: '/areas' }, { label: 'Personae' }]}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="flex w-80 shrink-0 flex-col gap-4 overflow-y-auto border-r border-[var(--grey-border)] bg-white p-6">
          {areaConfig.isometricUrl ? (
            <img src={areaConfig.isometricUrl} alt="" className="mb-2 w-full rounded-xl" />
          ) : null}
          <div
            className="rounded-[var(--radius-lg)] bg-[#f0f4ff] p-5 text-sm leading-relaxed text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-body)' }}
            dangerouslySetInnerHTML={{ __html: areaConfig.description }}
          />
        </aside>

        <main className="grid flex-1 grid-cols-3 content-start gap-5 overflow-y-auto p-6">
          {areaPersonas.map((persona) => (
            <PersonaCard key={persona.id} persona={persona} href={`/${params.area}/${persona.id}`} />
          ))}
        </main>
      </div>
    </div>
  );
}
