import { cn } from '@/lib/utils/cn';

/**
 * The three visual pillars of the catalogue, composed as a single illustrative
 * collage for the home hero. Each tile carries a label so it reads as a
 * narrative, not decoration:
 *
 *    Persona    — the portrait (who)
 *    Journey    — the MyVillage phone UI (when · how)
 *    Solution   — the workplace isometric (where · what)
 *
 * Intentionally non-interactive: the CTAs below (EntryCards) handle navigation.
 * This collage's job is to make the abstract thesis ("experience first, solution
 * second") concrete in one glance.
 */

const ASSETS = {
  circle: '/images/catalogue/assets/home/hero-workplace-circle.png',
  portrait: '/images/catalogue/assets/home/home-client-portrait.png',
  phone: '/images/catalogue/assets/home/home-phone-myvillage.png',
} as const;

function TileLabel({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        'absolute inline-flex items-center gap-1.5 rounded-pill border border-white/40 bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--blue)] shadow-[var(--shadow-sm)] backdrop-blur-sm',
        className,
      )}
      style={{ fontFamily: 'var(--font-body)' }}
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
      className={cn(
        'relative aspect-[16/11] min-h-[320px] md:aspect-[16/10] lg:min-h-[460px]',
        className,
      )}
      role="img"
      aria-label="Three pillars of the catalogue: a persona, a daily journey, and a physical solution"
    >
      {/* ── Solution: workplace isometric circle (back layer) ─────── */}
      <div
        className="motion-fade-up absolute right-[2%] top-[4%] z-0 h-[min(60%,400px)] w-[min(60%,400px)] overflow-hidden rounded-full shadow-[var(--shadow-panel)] md:right-[6%] md:top-[6%] md:h-[min(66%,440px)] md:w-[min(66%,440px)] lg:right-[8%] lg:top-1/2 lg:h-[min(74%,460px)] lg:w-[min(74%,460px)] lg:-translate-y-1/2"
        style={{ animationDelay: '200ms' }}
      >
        <img
          src={ASSETS.circle}
          alt=""
          className="h-full w-full object-cover object-[28%_center]"
          loading="eager"
        />
        <TileLabel className="right-3 top-3">Solution</TileLabel>
      </div>

      {/* ── Persona: client portrait (focal, front-left) ──────────── */}
      <div
        className="motion-fade-up absolute bottom-0 left-1/2 z-[1] h-[94%] w-[56%] max-w-[400px] -translate-x-[58%] md:h-[96%] md:max-w-[440px] lg:left-[6%] lg:w-[50%] lg:max-w-none lg:translate-x-0 xl:max-w-[500px]"
        style={{ animationDelay: '320ms' }}
      >
        <img
          src={ASSETS.portrait}
          alt=""
          className="h-full w-full object-cover object-[50%_15%]"
          loading="eager"
        />
        <TileLabel className="left-3 top-3">Persona</TileLabel>
      </div>

      {/* ── Journey: MyVillage phone mockup (front-right) ─────────── */}
      <div
        className="motion-fade-up absolute bottom-[2%] right-0 z-[2] w-[40%] max-w-[220px] overflow-hidden rounded-t-brand-lg shadow-[-3px_4px_21px_rgba(0,0,0,0.28)] md:bottom-[4%] md:max-w-[260px] lg:max-w-[300px]"
        style={{ animationDelay: '440ms' }}
      >
        <div className="relative aspect-[282/565] w-full">
          <img
            src={ASSETS.phone}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top"
            loading="eager"
          />
          <TileLabel className="left-1/2 top-3 -translate-x-1/2">Journey</TileLabel>
        </div>
      </div>

      {/* ── Connecting accent ruler (subtle teal cue) ───────────────
         A 1px teal line diagonally behind the collage to suggest the
         three pillars are a system, not three loose images. */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-[8%] right-[8%] top-1/2 z-0 h-px origin-center -rotate-[6deg] bg-gradient-to-r from-transparent via-[var(--teal)]/40 to-transparent"
      />
    </div>
  );
}
