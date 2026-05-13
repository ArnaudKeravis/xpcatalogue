import { notFound } from 'next/navigation';
import { AreaRoleStories } from '@/components/catalogue/AreaRoleStories';
import { PersonaPortraitCard } from '@/components/catalogue/PersonaPortraitCard';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
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
    <div className="flex flex-1 flex-col" style={{ background: '#f4f6fb' }}>
      <div className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(160deg, ${areaConfig.color}18 0%, #f4f6fb 60%)` }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col gap-6 px-6 py-6 md:px-10 md:py-8 lg:grid lg:grid-cols-[minmax(0,38%)_minmax(0,62%)] lg:gap-10">
          <section className="flex min-h-0 flex-col">
            <div className="flex flex-wrap items-end gap-3">
              <h1
                className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold leading-none tracking-tight"
                style={{ fontFamily: 'var(--font-heading)', color: areaConfig.color }}
              >
                {areaConfig.label}
              </h1>
              <p
                className="mb-1 max-w-md text-[clamp(0.9rem,1.4vw,1.125rem)] font-semibold leading-snug text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {areaConfig.tagline}
              </p>
            </div>

            {areaConfig.isometricUrl ? (
              <div className="mt-4 flex min-h-0 flex-1 items-center justify-center lg:mt-6">
                <img
                  src={areaConfig.isometricUrl}
                  alt={`${areaConfig.label} isometric illustration`}
                  className="max-h-full w-auto max-w-full object-contain"
                  loading="eager"
                />
              </div>
            ) : null}
          </section>

          <section className="flex min-h-0 flex-col">
            <div>
              <h2
                className="text-[clamp(1.125rem,2.2vw,1.5rem)] font-extrabold text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Key personas in <span style={{ color: areaConfig.color }}>{areaConfig.label}</span>
              </h2>
              <p
                className="mt-1 text-xs text-gray-500 md:text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Select a persona to explore their journey and discover tailored solutions.
              </p>
            </div>

            <Stagger className="mt-3 grid min-h-0 flex-1 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:mt-4 lg:grid-rows-2">
              {areaPersonas.map((persona) => (
                <StaggerItem key={persona.id} className="min-h-0">
                  <PersonaPortraitCard
                    persona={persona}
                    href={`/${params.area}/${persona.id}`}
                    areaConfig={areaConfig}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        </div>
      </div>

      {areaConfig.roleStories ? (
        <AreaRoleStories areaConfig={areaConfig} stories={areaConfig.roleStories} />
      ) : null}
    </div>
  );
}
