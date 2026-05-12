import Link from 'next/link';
import { CaretRight } from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/lib/utils/cn';
import type { AreaConfig } from '@/lib/data/types';

/** Local line asset — see `public/images/catalogue/placeholder-line.svg`. */
const DIVIDER_SRC = '/images/catalogue/assets/ui/ui-card-divider-line.png';

interface Props {
  area: AreaConfig;
  className?: string;
  /** Smaller card for /areas hero overlays (narrower type, tighter padding). */
  compact?: boolean;
}

export function AreaVillageCard({ area, className, compact }: Props) {
  return (
    <Link
      href={`/${area.id}`}
      className={cn(
        'group flex flex-col rounded-brand-xl border border-white/40 bg-[rgba(255,255,255,0.38)] shadow-[0px_4px_25px_0px_rgba(0,0,128,0.15)] backdrop-blur-[7.9px] transition-transform hover:-translate-y-1 hover:shadow-[0px_8px_28px_0px_rgba(0,0,128,0.18)]',
        compact
          ? 'max-w-[228px] gap-1.5 px-3 py-2.5 sm:max-w-[240px]'
          : 'w-full max-w-[282px] gap-2.5 px-[18px] py-4',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center',
          compact ? 'gap-2 pl-0.5 pr-0.5' : 'gap-[15px] pl-2 pr-1'
        )}
      >
        <span
          className={cn(
            'whitespace-nowrap font-bold text-[var(--blue-primary)]',
            compact
              ? 'text-[clamp(0.9375rem,1.35vw,1.125rem)]'
              : 'text-[clamp(1.125rem,2vw,1.5rem)]'
          )}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {area.label}
        </span>
        <CaretRight
          size={compact ? 18 : 24}
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
        className={cn(
          'w-full break-words leading-relaxed text-[var(--blue)] [&_p]:mb-1.5 [&_p:last-child]:mb-0',
          compact
            ? 'text-[clamp(0.6875rem,1.05vw,0.8125rem)] leading-snug'
            : 'text-[clamp(0.875rem,1.2vw,1rem)]'
        )}
        style={{ fontFamily: 'var(--font-body)' }}
        dangerouslySetInnerHTML={{ __html: area.description }}
      />
    </Link>
  );
}
