import { ArrowDown } from '@phosphor-icons/react/dist/ssr';
import { SparkMark } from '@/components/spark/SparkMark';

export function SodexoSparkHero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--grey-border)]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src="/images/catalogue/assets/spark/spark-hero-banner.png"
          alt=""
          className="h-full w-full object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/88 to-white/35 md:from-white/92 md:via-white/78 md:to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 py-10 md:px-8 md:py-12">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-4">
            <h1
              className="text-[clamp(2rem,4.5vw,3rem)] font-normal leading-none text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <span className="font-light">Sodexo</span>{' '}
              <span className="font-extrabold">Spark</span>
            </h1>
            <SparkMark className="h-11 w-11 shrink-0 md:h-12 md:w-12" />
          </div>

          <p
            className="mt-4 text-xl font-bold leading-snug text-[var(--blue)] md:text-2xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Technology designed for people.
          </p>
          <p
            className="mt-1 text-base text-[var(--blue)]/80 md:text-lg"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Intelligence built for scale.
          </p>
          <p
            className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--blue)]/75 md:text-base"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            A packaged set of digital &amp; AI capabilities built once, deployed across all segments,
            integrated into marketing and sales — the commercial backbone of every bid and renewal.
            Organised around three pillars —{' '}
            <strong className="text-[var(--blue)]">IQ</strong> (insight &amp; intelligence),{' '}
            <strong className="text-[var(--blue)]">OS</strong> (operations &amp; orchestration), and{' '}
            <strong className="text-[var(--blue)]">XP</strong> (guest &amp; employee experience).
          </p>

          <div className="mt-6">
            <a
              href="#spark-solutions"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--blue)] px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Browse Spark Offer solutions
              <ArrowDown size={16} weight="bold" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
