import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

/** All hero artwork lives in `public/images/catalogue/assets/` — no remote fetches. */
const ASSETS = {
  bokeh: '/images/catalogue/assets/home/home-bokeh.png',
  sparkle: '/images/catalogue/assets/home/home-sparkle.png',
  heroCircle: '/images/catalogue/assets/home/hero-workplace-circle.png',
  sodexoWordmark: '/images/catalogue/assets/brand/sodexo-logotype-2021.jpg',
  phoneMockup: '/images/catalogue/assets/home/home-phone-myvillage.png',
  portrait: '/images/catalogue/assets/home/home-client-portrait.png',
  titleUnderline: '/images/catalogue/assets/home/home-title-underline.png',
} as const;

export default function HomePage() {
  return (
    <main
      id="main-content"
      className="relative min-h-screen overflow-hidden bg-[var(--home-hero-bg)]"
    >
      <HeroDecor />

      <header className="relative z-10 px-4 pt-10 text-center md:pt-14">
        <p
          className="motion-fade-up mx-auto max-w-[1100px] text-[clamp(1.125rem,2.6vw,3.125rem)] font-semibold leading-tight text-white"
          style={{ fontFamily: 'var(--font-heading)', animationDelay: '80ms' }}
        >
          Digital, AI &amp; Innovation Experience Catalogue
        </p>
        <div className="motion-fade-up mt-3 flex justify-center" style={{ animationDelay: '220ms' }}>
          <img
            src={ASSETS.titleUnderline}
            alt=""
            width={159}
            height={8}
            className="h-2 w-auto max-w-[min(159px,40vw)]"
          />
        </div>
      </header>

      <div className="relative z-10 mx-auto flex max-w-[1600px] flex-col items-center gap-10 px-6 pb-28 pt-8 md:px-12 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:pb-20 lg:pt-6">
        <div className="w-full max-w-[640px] shrink-0 lg:max-w-[46%]">
          <h1
            className="motion-fade-up text-[clamp(2.75rem,7vw,7.5rem)] font-extrabold leading-[1.02] tracking-tight text-white"
            style={{ fontFamily: 'var(--font-heading)', animationDelay: '340ms' }}
          >
            Explore
            <br />
            Digital &amp;
            <br />
            Innovative Experiences
          </h1>
          <p
            className="motion-fade-up mt-5 text-[clamp(1.125rem,2.2vw,2.5rem)] font-normal leading-snug text-white/95"
            style={{ fontFamily: 'var(--font-heading)', animationDelay: '460ms' }}
          >
            Discover and create your own experiences
          </p>
          <Link
            href="/areas"
            className="motion-fade-up mt-10 inline-flex items-center justify-center rounded-[72px] bg-white px-[58px] py-5 text-[clamp(1.25rem,2vw,2.5rem)] font-bold text-[#1a69ff] shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-transform duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.2)] active:scale-[0.98]"
            style={{ fontFamily: 'var(--font-heading)', animationDelay: '620ms' }}
          >
            Discover
          </Link>
        </div>

        <div className="motion-fade-up w-full max-w-[min(100%,720px)] shrink lg:max-w-[52%]" style={{ animationDelay: '540ms' }}>
          <HeroCollage />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 right-6 z-10 md:right-10">
        <img
          src={ASSETS.sodexoWordmark}
          alt="Sodexo"
          width={1024}
          height={576}
          className="h-8 w-auto max-w-[min(200px,42vw)] opacity-95 md:h-9"
        />
      </div>
    </main>
  );
}

function HeroDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -left-[40%] top-[18%] h-[min(120vh,900px)] w-[min(140vw,900px)] opacity-[0.55] mix-blend-screen md:-left-[25%] md:top-[22%]">
        <img src={ASSETS.bokeh} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="absolute -right-[35%] top-[8%] h-[min(120vh,900px)] w-[min(140vw,900px)] opacity-[0.5] mix-blend-screen md:-right-[20%]">
        <img src={ASSETS.bokeh} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="absolute -right-[20%] -top-[45%] hidden h-[min(90vh,700px)] w-[min(100vw,650px)] opacity-40 md:block">
        <img src={ASSETS.sparkle} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="absolute -left-[25%] -top-[55%] hidden h-[min(90vh,700px)] w-[min(100vw,650px)] opacity-35 md:block">
        <img src={ASSETS.sparkle} alt="" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}

function HeroCollage() {
  return (
    <div className={cn('relative aspect-[16/11] min-h-[280px] md:aspect-[16/10] lg:min-h-[420px]')}>
      {/* Isometric workplace — circular hero, roughly 645px diameter at the design breakpoint. */}
      <div
        className="absolute right-[4%] top-[8%] z-0 h-[min(58%,360px)] w-[min(58%,360px)] translate-x-0 overflow-hidden rounded-full shadow-[0_8px_40px_rgba(0,0,0,0.12)] md:right-[8%] md:top-[10%] md:h-[min(62%,400px)] md:w-[min(62%,400px)] lg:right-[12%] lg:top-1/2 lg:h-[min(72%,420px)] lg:w-[min(72%,420px)] lg:-translate-y-1/2"
      >
        <img
          src={ASSETS.heroCircle}
          alt=""
          className="h-full w-full object-cover object-[28%_center]"
        />
      </div>

      {/* Portrait — centered / slightly left of collage */}
      <div
        className="absolute bottom-0 left-1/2 z-[1] h-[92%] w-[55%] max-w-[380px] -translate-x-[58%] md:h-[94%] md:max-w-[420px] lg:left-[8%] lg:w-[48%] lg:max-w-none lg:translate-x-0 xl:max-w-[480px]"
      >
        <img
          src={ASSETS.portrait}
          alt=""
          className="h-full w-full object-cover object-[50%_15%]"
        />
      </div>

      {/* Phone mockup — far right */}
      <div
        className="absolute bottom-[2%] right-0 z-[2] w-[38%] max-w-[200px] overflow-hidden rounded-t-[20px] shadow-[-3px_4px_21px_rgba(0,0,0,0.25)] md:bottom-[4%] md:max-w-[240px] lg:max-w-[282px]"
      >
        <div className="relative aspect-[282/565] w-full">
          <img
            src={ASSETS.phoneMockup}
            alt="Mobile app preview"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}
