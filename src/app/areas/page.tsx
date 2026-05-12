import { AreaVillageCard } from '@/components/catalogue/AreaVillageCard';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { getCatalogueData } from '@/lib/notion';
import type { Area } from '@/lib/data/types';

export const revalidate = 3600;

const ISOMETRIC_HERO = '/images/catalogue/assets/areas/areas-isometric.png';

/** Reading order: top row WORK | HEAL, bottom row LEARN | PLAY. */
const AREA_ORDER: Area[] = ['work', 'heal', 'learn', 'play'];

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

        {/* Illustration and cards are stacked — absolute overlays broke alignment when the
            hero scaled and clipped cards at narrow desktop widths. */}
        <div className="mx-auto mt-8 flex w-full max-w-[1200px] flex-col gap-8 md:mt-10 md:gap-10 lg:gap-12">
          <div className="w-full shrink-0">
            <img
              src={ISOMETRIC_HERO}
              alt=""
              width={1381}
              height={834}
              className="mx-auto h-auto w-full max-h-[min(48vh,480px)] object-contain object-center sm:max-h-[min(52vh,520px)] md:max-h-none"
              loading="eager"
            />
          </div>

          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5 lg:mx-auto lg:max-w-[920px] lg:gap-x-8 lg:gap-y-6">
            {ordered.map((area) => (
              <StaggerItem key={area.id} className="flex w-full justify-center sm:block">
                <AreaVillageCard area={area} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </div>
  );
}
