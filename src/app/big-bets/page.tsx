import Link from 'next/link';
import { ArrowLeft, ArrowSquareOut, Leaf, Pulse, Robot } from '@phosphor-icons/react/dist/ssr';
import { COLLECTION_META } from '@/lib/data/collections';

export const revalidate = 3600;

export default async function BigBetsPage() {
  const meta = COLLECTION_META['big-bets'];
  const catalogueHref = meta.catalogueHref!;

  return (
    <div className="flex flex-1 flex-col bg-[var(--surface)]">
      <header className="flex flex-wrap items-center gap-3 border-b border-[var(--grey-border)] bg-[var(--surface-card)] px-6 py-4 md:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--blue-primary)] hover:underline"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <ArrowLeft size={14} weight="bold" aria-hidden />
          Home
        </Link>
        <span className="hidden text-[var(--grey-border)] sm:inline" aria-hidden>
          ·
        </span>
        <Link
          href={catalogueHref}
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--blue-primary)] hover:underline"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <ArrowSquareOut size={14} weight="bold" aria-hidden />
          Catalogue grid
        </Link>
      </header>

      <main id="main-content" className="flex flex-1 flex-col">
        <section
          className="relative overflow-hidden border-b border-[var(--grey-border)] px-6 py-14 text-white md:px-12 md:py-20"
          style={{
            backgroundImage: `${meta.gradient}, radial-gradient(120% 90% at 15% 0%, rgba(255,255,255,0.18) 0%, transparent 50%)`,
          }}
        >
          <div className="mx-auto max-w-[900px] text-center">
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/85"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <Pulse size={14} weight="bold" aria-hidden />
              Sodexo Innovation Areas 2030
            </span>
            <h1
              className="mt-5 text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.05]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Big Bets 2026
            </h1>
            <p
              className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Innovation priorities anchored in three pillars — shaping how we invest, partner, and ship client value over
              the next decade. Below is the strategic framing from <em>Big Bets 2026</em>; use the catalogue view to browse
              solutions already mapped into this lens.
            </p>
            <Link
              href={catalogueHref}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[var(--blue)] shadow-[var(--shadow-sm)] transition-[transform] hover:-translate-y-0.5"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Open Big Bets in the catalogue
              <ArrowSquareOut size={16} weight="bold" aria-hidden />
            </Link>
          </div>
        </section>

        <section className="border-b border-[var(--grey-border)] bg-[var(--surface-card)] px-6 py-12 md:px-12">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--blue)]/55" style={{ fontFamily: 'var(--font-body)' }}>
              Why three areas
            </h2>
            <p className="mt-3 max-w-3xl text-lg font-semibold leading-relaxed text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Sodexo must invest in three core innovation areas to remain competitive and drive value creation: resilient food
              systems, workplace wellness aligned with population-health shifts, and automation that solves labour constraints
              while improving quality — with personalization and convenience woven through the consumer experience.
            </p>
          </div>
        </section>

        <section className="px-6 py-12 md:px-12 md:py-16">
          <div className="mx-auto grid max-w-[1100px] gap-10 md:grid-cols-3 md:gap-8">
            <article className="flex flex-col rounded-brand-2xl border border-[var(--grey-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-brand-xl text-white"
                style={{ backgroundImage: 'linear-gradient(135deg,#059669,#0d9488)' }}
              >
                <Leaf size={26} weight="duotone" aria-hidden />
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
                Food &amp; Beyond
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                Shaping the future of food by embedding sustainability across ingredients and food systems without compromising
                taste — climate-resilient and regenerative ingredients, next-gen production technologies, zero-waste culinary
                systems, next-gen convenience and snack formats, personalization at scale (including AI-driven nutrition), and
                experiential / sensory innovation.
              </p>
            </article>

            <article className="flex flex-col rounded-brand-2xl border border-[var(--grey-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-brand-xl text-white"
                style={{ backgroundImage: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
              >
                <Pulse size={26} weight="duotone" aria-hidden />
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
                Health &amp; Wellbeing
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                Wellness expectations are evolving — metabolic health, mental wellbeing, and holistic workplace wellness are
                central to client strategies. Big Bets include precision wellness ecosystems, mental health &amp;
                stress-relief environments (including restorative spaces), prevention-as-a-service, functional food &amp;
                beverage innovation, and integrated corporate wellness platforms with AI-enabled coaching and unified journeys.
              </p>
            </article>

            <article className="flex flex-col rounded-brand-2xl border border-[var(--grey-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-brand-xl text-white"
                style={{ backgroundImage: 'linear-gradient(135deg,#ea580c,#f59e0b)' }}
              >
                <Robot size={26} weight="duotone" aria-hidden />
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
                Automation &amp; Intelligent Operations
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                Robotics and AI transform service delivery from kitchens to facilities and front-of-house. Technology drives
                productivity, safety, and new client offerings: AI-powered services for guest engagement, workforce
                augmentation and training (including co-bots and digital twins), autonomous foodservice, and frictionless /
                robotic retail including autonomous stores and personalized robotic beverage or meal journeys.
              </p>
            </article>
          </div>
        </section>

        <section className="border-t border-[var(--grey-border)] bg-[var(--icon-bg-muted)] px-6 py-10 md:px-12">
          <div className="mx-auto max-w-[720px] text-center">
            <p className="text-sm leading-relaxed text-[var(--blue)]/80" style={{ fontFamily: 'var(--font-body)' }}>
              Exemplar initiatives span Labs pilots, robotics, frictionless formats, wellbeing devices, sustainable packaging,
              and digital platforms — the catalogue subset tagged <strong>#blockbuster</strong> continues to denote the legacy
              P&amp;L-impact AI shortlist, now folded into <strong>Standard Offer</strong> scope.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
