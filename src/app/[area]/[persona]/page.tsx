import { notFound } from 'next/navigation';
import { PersonaExperienceBody } from '@/components/catalogue/PersonaExperienceBody';
import { getCatalogueData } from '@/lib/notion';
import type { Area } from '@/lib/data/types';

export const revalidate = 3600;

const AREA_KEYS = new Set<Area>(['work', 'learn', 'heal', 'play']);

interface Props {
  params: { area: string; persona: string };
}

export default async function PersonaPage({ params }: Props) {
  const { personas, areas, modules, journeySteps } = await getCatalogueData();
  if (!AREA_KEYS.has(params.area as Area)) notFound();

  const areaConfig = areas[params.area as Area];
  if (!areaConfig) notFound();

  const persona = personas.find((p) => p.id === params.persona && p.area === params.area);
  if (!persona) notFound();

  const personaHref = `/${params.area}/${params.persona}`;

  return (
    <PersonaExperienceBody
      persona={persona}
      areaConfig={areaConfig}
      modules={modules}
      journeySteps={journeySteps}
      linkArea={params.area}
      linkPersonaId={params.persona}
      personaHref={personaHref}
    />
  );
}
