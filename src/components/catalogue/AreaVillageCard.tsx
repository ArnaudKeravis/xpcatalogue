import Link from 'next/link';
import { CaretRight } from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/lib/utils/cn';
import type { AreaConfig } from '@/lib/data/types';

/** Local line asset — see `public/images/catalogue/placeholder-line.svg`. */
const DIVIDER_SRC = '/images/catalogue/assets/ui/ui-card-divider-line.png';

interface Props {
  area: AreaConfig;
  className?: string;
}

export function AreaVillageCard({ area, className }: Props) {
  return (
    <Link
      href={`/${area.id}`}
      className={cn(
        'group flex max-w-[282px] flex-col gap-2.5 rounded-brand-xl border border-white/40 bg-[rgba(255,255,255,0.3)] px-[18px] py-4 shadow-[0px_4px_25px_0px_rgba(0,0,128,0.15)] backdrop-blur-[7.9px] transition-transform hover:-translate-y-1 hover:shadow-[0px_8px_28px_0px_rgba(0,0,128,0.18)]',
        className
      )}
    >
      <div className="flex items-center justify-center gap-[15px] pl-2 pr-1">
        <span
          className="whitespace-nowrap text-[clamp(1.25rem,2.2vw,2rem)] font-bold text-[var(--blue-primary)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {area.label}
        </span>
        <CaretRight
          size={26}
          weight="bold"
          className="shrink-0 text-[var(--blue-primary)] transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>
      <div className="relative h-px w-full overflow-hidden">
        <img
          src={DIVIDER_SRC}
          alt=""
          width={400}
          height={4}
          className="h-px w-full object-cover object-center"
        />
      </div>
      <div
        className="w-full text-[clamp(1rem,1.6vw,1.25rem)] leading-normal text-[var(--blue)]"
        style={{ fontFamily: 'var(--font-body)' }}
        dangerouslySetInnerHTML={{ __html: area.description }}
      />
    </Link>
  );
}
