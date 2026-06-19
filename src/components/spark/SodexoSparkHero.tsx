import { ArrowDown } from '@phosphor-icons/react/dist/ssr';
import { SparkMark } from '@/components/spark/SparkMark';

export function SodexoSparkHero() {
  return (
    <section className="border-b border-[var(--grey-border)] bg-[var(--surface-card)]">
      <div className="mx-auto max-w-[880px] px-6 py-12 text-center md:px-8 md:py-16">
        <div className="flex flex-wrap items-center justify-center gap-4">
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
          className="mt-5 text-xl font-bold leading-snug text-[var(--blue)] md:text-2xl"
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
          className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--blue)]/75 md:text-base"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          A packaged set of digital &amp; AI capabilities built once, deployed across all segments,
          integrated into marketing and sales — the commercial backbone of every bid and renewal.
          Organised around three pillars —{' '}
          <strong className="text-[var(--blue)]">IQ</strong> (insight &amp; intelligence),{' '}
          <strong className="text-[var(--blue)]">OS</strong> (operations &amp; orchestration), and{' '}
          <strong className="text-[var(--blue)]">XP</strong> (guest &amp; employee experience).
        </p>

        <div className="mt-8 flex justify-center">
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
    </section>
  );
}
