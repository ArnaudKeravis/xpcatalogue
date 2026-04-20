import { AreaVillageCard } from '@/components/catalogue/AreaVillageCard';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { getCatalogueData } from '@/lib/notion';
import type { Area } from '@/lib/data/types';
import { cn } from '@/lib/utils/cn';

export const revalidate = 3600;

const ISOMETRIC_HERO = '/images/catalogue/assets/areas/areas-isometric.png';

/** Reading order: top row WORK | HEAL, bottom row LEARN | PLAY. */
const AREA_ORDER: Area[] = ['work', 'heal', 'learn', 'play'];

const DESKTOP_PLACEMENT: Record<Area, string> = {
  work: 'left-[2%] top-[10%] xl:left-[4%] xl:top-[16%]',
  heal: 'right-[2%] top-[6%] xl:right-[5%] xl:top-[10%]',
  learn: 'left-[6%] bottom-[8%] xl:left-[10%] xl:bottom-[10%]',
  play: 'right-[2%] bottom-[8%] xl:right-[4%] xl:bottom-[10%]',
};

export default async function AreasPage() {
  const { areas } = await getCatalogueData();
  const ordered = AREA_ORDER.map((id) => areas[id]);

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="flex-1 px-6 pb-12 pt-6 md:px-10">
        <h1
          className="max-w-[1100px] text-[clamp(2rem,6vw,4.375rem)] font-extrabold leading-none text-[var(--blue)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Areas Where We Operate
        </h1>

        <div className="relative mx-auto mt-6 max-w-[1380px]">
          <img
            src={ISOMETRIC_HERO}
            alt=""
            width={1381}
            height={834}
            className="relative z-0 h-auto w-full object-contain object-center"
          />

          <Stagger className="relative z-10 mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:absolute lg:inset-0 lg:mt-0 lg:block lg:gap-0">
            {ordered.map((area) => (
              <StaggerItem
                key={area.id}
                className={cn(
                  'mx-auto w-full max-w-[282px] sm:mx-0',
                  'lg:absolute lg:w-[min(282px,calc(50%-1.5rem))]',
                  DESKTOP_PLACEMENT[area.id]
                )}
              >
                <AreaVillageCard area={area} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </div>
  );
}
