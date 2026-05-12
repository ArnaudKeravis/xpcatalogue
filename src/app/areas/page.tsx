import { AreaVillageCard } from '@/components/catalogue/AreaVillageCard';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { getCatalogueData } from '@/lib/notion';
import type { Area } from '@/lib/data/types';
import { cn } from '@/lib/utils/cn';

export const revalidate = 3600;

const ISOMETRIC_HERO = '/images/catalogue/assets/areas/areas-isometric.png';

/** Reading order: top row WORK | HEAL, bottom row LEARN | PLAY. */
const AREA_ORDER: Area[] = ['work', 'heal', 'learn', 'play'];

/** Inset slightly vs old % so smaller cards stay inside the art on common widths. */
const DESKTOP_PLACEMENT: Record<Area, string> = {
  work: 'left-[5%] top-[12%] lg:left-[6%] xl:left-[7%] xl:top-[14%]',
  heal: 'right-[5%] top-[8%] lg:right-[6%] xl:right-[7%] xl:top-[11%]',
  learn: 'left-[7%] bottom-[10%] lg:left-[8%] xl:left-[10%] xl:bottom-[11%]',
  play: 'right-[5%] bottom-[10%] lg:right-[6%] xl:right-[7%] xl:bottom-[11%]',
};

export default async function AreasPage() {
  const { areas } = await getCatalogueData();
  const ordered = AREA_ORDER.map((id) => areas[id]);

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="mx-auto w-full max-w-7xl flex-1 px-6 pb-12 pt-6 md:px-10">
        <h1
          className="max-w-3xl text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-none text-[var(--blue)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Areas Where We Operate
        </h1>

        {/*
          lg+: fixed aspect matches the hero asset so absolute % positions track the image.
          Cards use compact sizing (~228px) so they sit lighter on the art.
        */}
        <div className="relative mx-auto mt-6 w-full max-w-[min(100%,1280px)]">
          <div className="relative w-full lg:aspect-[1381/834]">
            <img
              src={ISOMETRIC_HERO}
              alt=""
              width={1381}
              height={834}
              className="relative z-0 mx-auto h-auto w-full max-h-[min(52vh,520px)] object-contain object-center sm:max-h-[min(56vh,560px)] lg:absolute lg:inset-0 lg:mx-0 lg:max-h-none lg:h-full lg:w-full"
              loading="eager"
            />

            <Stagger className="relative z-10 mt-6 grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 sm:justify-items-stretch sm:gap-x-5 sm:gap-y-4 lg:absolute lg:inset-0 lg:mt-0 lg:block lg:gap-0">
              {ordered.map((area) => (
                <StaggerItem
                  key={area.id}
                  className={cn(
                    'flex w-full justify-center sm:justify-center',
                    'lg:absolute lg:w-[min(228px,calc(36%-0.5rem))] lg:max-w-[228px] lg:justify-start',
                    DESKTOP_PLACEMENT[area.id]
                  )}
                >
                  <AreaVillageCard area={area} compact />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </div>
  );
}
