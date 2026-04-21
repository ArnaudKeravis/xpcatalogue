import { cn } from '@/lib/utils/cn';

/**
 * The three visual pillars of the catalogue, rendered as a single composite
 * artwork for the home hero. Three floating pill labels anchor the narrative:
 *
 *    Persona   — the portrait (who the day belongs to)
 *    Journey   — the workplace isometric (how the day unfolds)
 *    Solution  — the Sodexo WRX phone (what's delivered)
 *
 * Intentionally non-interactive: the EntryCards below are the CTAs. This
 * collage's job is to make the thesis ("experience first, solution second")
 * concrete in one glance.
 */

const HERO_IMAGE = '/images/catalogue/assets/home/hero-composite.png';

function TileLabel({
  children,
  className,
  delay,
}: {
  children: string;
  className?: string;
  delay: string;
}) {
  return (
    <span
      className={cn(
        'motion-fade-up absolute inline-flex items-center gap-1.5 rounded-pill border border-white/40 bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--blue)] shadow-[var(--shadow-popover)] backdrop-blur-sm',
        className,
      )}
      style={{ fontFamily: 'var(--font-body)', animationDelay: delay }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full bg-[var(--teal)]"
      />
      {children}
    </span>
  );
}

export function HeroCollage({ className }: { className?: string }) {
  return (
    <div
      className={cn('relative w-full', className)}
      role="img"
      aria-label="Three pillars of the catalogue: Lilly a Sodexo ambassador (persona), an isometric view of her workplace journey, and the Sodexo WRX mobile solution"
    >
      {/* Soft teal halo behind the artwork — binds the three pillars visually
          and lifts the collage off the dark hero background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[4%] -z-0 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 55% 55%, rgba(0, 209, 199, 0.35), rgba(26, 105, 255, 0.15) 55%, transparent 75%)',
        }}
      />

      <div className="motion-fade-up relative" style={{ animationDelay: '200ms' }}>
        <img
          src={HERO_IMAGE}
          alt=""
          className="h-auto w-full object-contain drop-shadow-[0_24px_60px_rgba(0,12,60,0.45)]"
          loading="eager"
          decoding="async"
        />

        {/* ── Labels anchored to the three regions ─────────────────────── */}
        {/* Persona — top-left, over Lilly */}
        <TileLabel
          delay="380ms"
          className="left-[1%] top-[6%] md:left-[2%] md:top-[8%]"
        >
          Persona
        </TileLabel>

        {/* Journey — top-center, floating above the workplace isometric */}
        <TileLabel
          delay="520ms"
          className="left-1/2 top-[2%] -translate-x-1/2 md:top-[3%]"
        >
          Journey
        </TileLabel>

        {/* Solution — mid-right, next to the phone UI */}
        <TileLabel
          delay="660ms"
          className="right-[1%] top-[18%] md:right-[2%] md:top-[20%]"
        >
          Solution
        </TileLabel>
      </div>
    </div>
  );
}
