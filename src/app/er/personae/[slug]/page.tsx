import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { PersonaExperienceBody } from '@/components/catalogue/PersonaExperienceBody';
import { erBoKAsPersona, erBoKOrClientBySlug, ER_OPERATOR_SLUG } from '@/lib/data/er';
import { getCatalogueData } from '@/lib/notion';
import { erPaths, readErSegment } from '@/lib/erNav';

export const revalidate = 3600;

export function generateStaticParams() {
  return [
    { slug: 'remote-lifestyler' },
    { slug: 'optimizer' },
    { slug: 'proactive-achiever' },
    { slug: 'family-hero' },
    { slug: 'social-experiencer' },
    { slug: 'privacy-seeker' },
    { slug: 'client' },
    { slug: ER_OPERATOR_SLUG },
  ];
}

interface Props {
  params: { slug: string };
}

export default async function ErPersonaDetailPage({ params }: Props) {
  const { personas, areas, modules, journeySteps } = await getCatalogueData();
  const workArea = areas.work;
  if (!workArea) notFound();

  const wc = personas.find((p) => p.area === 'work' && p.id === 'white-collar');
  if (!wc) notFound();

  const erSegment = readErSegment(headers());
  const personaHref = erPaths.persona(erSegment, params.slug);

  if (params.slug === ER_OPERATOR_SLUG) {
    const op = personas.find((p) => p.area === 'work' && p.id === 'operator-work');
    if (!op) notFound();
    return (
      <PersonaExperienceBody
        persona={op}
        areaConfig={workArea}
        modules={modules}
        journeySteps={journeySteps}
        linkArea="work"
        linkPersonaId="operator-work"
        personaHref={personaHref}
      />
    );
  }

  const bok = erBoKOrClientBySlug(params.slug);
  if (!bok) notFound();

  const display = erBoKAsPersona(bok, wc);
  return (
    <PersonaExperienceBody
      persona={display}
      areaConfig={workArea}
      modules={modules}
      journeySteps={journeySteps}
      linkArea="work"
      linkPersonaId="white-collar"
      personaHref={personaHref}
      favouriteId={`er-personae/${params.slug}`}
    />
  );
}
