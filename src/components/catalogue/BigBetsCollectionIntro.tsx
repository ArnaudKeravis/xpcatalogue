import Link from 'next/link';
import { ArrowRight, Brain, Leaf, LightbulbFilament, Robot } from '@phosphor-icons/react/dist/ssr';
import { COLLECTION_META } from '@/lib/data/collections';

interface Props {
  solutionCount: number;
}

/**
 * Editorial opening for the Big Bets collection view — aligned with *Big Bets 2026*
 * (three innovation areas and strategic intent) before the solutions grid.
 */
export function BigBetsCollectionIntro({ solutionCount }: Props) {
  const meta = COLLECTION_META['big-bets'];

  return (
    <div className="mb-6 overflow-hidden rounded-brand-2xl text-white shadow-[var(--shadow-card)]">
      <div
        className="relative px-6 py-10 md:px-10 md:py-14"
        style={{
          backgroundImage: `${meta.gradient}, radial-gradient(120% 80% at 10% 0%, rgba(255,255,255,0.2) 0%, transparent 55%)`,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full opacity-25 blur-3xl"
          style={{ background: 'rgba(255,255,255,0.5)' }}
        />
        <div className="relative mx-auto max-w-[1100px]">
          <span
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/85"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <span className="h-px w-8 bg-white/70" aria-hidden />
            Innovation · Big Bets FY26
          </span>
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
            <div>
              <h1
                className="text-[clamp(1.85rem,4vw,3rem)] font-extrabold leading-[1.05]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {meta.label}
              </h1>
              <p
                className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-base"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {meta.description}{' '}
                Across these areas, the strategic intent is to build resilient and sustainable food systems, lead workplace
                wellness, reduce costs and labour constraints through automation, and elevate experience through personalization
                and convenience — per the Sodexo Labs innovation narrative.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/big-bets"
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white ring-1 ring-white/40 backdrop-blur-sm transition-colors hover:bg-white/25"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Full Big Bets story
                </Link>
                <Link
                  href="/solutions?hashtag=%23blockbuster"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-[var(--blue)] shadow-sm transition-transform hover:-translate-y-0.5"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Standard-offer #blockbuster tag
                  <ArrowRight size={14} weight="bold" aria-hidden />
                </Link>
              </div>
            </div>

            <aside
              className="rounded-2xl bg-black/20 p-5 ring-1 ring-white/25 backdrop-blur-md md:p-6"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">Three innovation areas</p>
              <ul className="mt-4 space-y-3 text-sm text-white/95">
                <li className="flex gap-3">
                  <Leaf size={20} weight="duotone" className="shrink-0 text-emerald-200" aria-hidden />
                  <span>
                    <strong className="font-extrabold">Food &amp; Beyond</strong> — climate-resilient ingredients,
                    next-gen production, zero-waste models, and indulgent food at scale.
                  </span>
                </li>
                <li className="flex gap-3">
                  <Brain size={20} weight="duotone" className="shrink-0 text-violet-200" aria-hidden />
                  <span>
                    <strong className="font-extrabold">Health &amp; Wellbeing</strong> — precision wellness, mental health
                    and stress relief, prevention-as-a-service, and integrated corporate wellness platforms.
                  </span>
                </li>
                <li className="flex gap-3">
                  <Robot size={20} weight="duotone" className="shrink-0 text-amber-200" aria-hidden />
                  <span>
                    <strong className="font-extrabold">Automation &amp; Intelligent Ops</strong> — AI-powered guest engagement,
                    frictionless and robotic retail, autonomous foodservice, and workforce augmentation.
                  </span>
                </li>
              </ul>
              <p className="mt-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
                <LightbulbFilament size={14} weight="duotone" aria-hidden />
                {solutionCount} {solutionCount === 1 ? 'solution' : 'solutions'} mapped to Big Bets
              </p>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
