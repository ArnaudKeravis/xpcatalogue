'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CaretCircleDown,
  List,
  Presentation,
  RocketLaunch,
} from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { COLLECTION_META } from '@/lib/data/collections';
import {
  type DeckPillar,
  TDDI_STANDARD_OFFER_DECK_CHAPTERS,
} from '@/lib/data/tddiStandardOfferDeck.generated';
import { cn } from '@/lib/utils/cn';

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

function backdropPillarForChapter(slides: { pillar: DeckPillar }[]): DeckPillar {
  const hits = slides.map((s) => s.pillar).filter((p) => p !== 'neutral');
  if (hits.length === 0) return 'neutral';
  const tally: Record<Exclude<DeckPillar, 'neutral'>, number> = { iq: 0, os: 0, xp: 0 };
  for (const p of hits) {
    if (p === 'iq') tally.iq++;
    else if (p === 'os') tally.os++;
    else if (p === 'xp') tally.xp++;
  }
  const top = (
    ['iq', 'os', 'xp'] as const
  ).reduce((best, cur) => (tally[cur] > tally[best] ? cur : best), 'iq');
  return tally[top] >= 2 ? top : 'neutral';
}

function pillarStyles(p: DeckPillar): { bar: string; chip: string; glow: string } {
  if (p === 'iq')
    return {
      bar: 'from-[var(--blue-primary)] to-[var(--blue)]',
      chip: 'bg-[var(--blue-primary)]/12 text-[var(--blue-primary)] ring-[var(--blue-primary)]/25',
      glow: 'radial-gradient(circle, var(--blue-primary), transparent 72%)',
    };
  if (p === 'os')
    return {
      bar: 'from-[var(--teal)] to-[var(--blue)]',
      chip: 'bg-[var(--teal)]/14 text-[var(--teal)] ring-[var(--teal)]/28',
      glow: 'radial-gradient(circle, var(--teal), transparent 72%)',
    };
  if (p === 'xp')
    return {
      bar: 'from-[var(--blue)] via-[var(--blue-primary)] to-[var(--teal)]',
      chip: 'bg-[var(--blue)]/12 text-[var(--blue)] ring-[var(--blue)]/25',
      glow: 'radial-gradient(circle, var(--blue), transparent 70%)',
    };
  return {
    bar: 'from-[var(--grey-border)] via-[var(--blue)]/30 to-[var(--teal)]/40',
    chip: 'bg-[var(--icon-bg)] text-[var(--blue)]/70 ring-[var(--grey-border)]',
    glow: 'radial-gradient(circle, var(--blue-primary)/0.4, transparent 70%)',
  };
}

/** Turn flat deck copy into readable blocks while preserving wording. */
function bodyToParagraphs(raw: string, slideNumber: number): string[] {
  let t = slideNumber === 2 ? raw.replace(/^\s*2\s+/, '') : raw;
  t = t
    .replace(/\bBUSINESS IMPACT\b/gi, '\n\nBUSINESS IMPACT\n\n')
    .replace(/\b(SODEXO SPARK IQ|SPARK IQ)\b/gi, '\n\n$1')
    .replace(/\b(SODEXO SPARK XP|SPARK XP)\b/gi, '\n\n$1')
    .replace(/\b(SODEXO SPARK OS|SPARK OS)\b/gi, '\n\n$1')
    .replace(/\b(Case studies)\b/gi, '\n$1 ')
    .replace(/\b(Product video)\b/gi, '$1 ')
    .trim();

  return t
    .split(/\n\s*\n+/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function DeckChapterBackdrop({ pillar, children }: { pillar: DeckPillar; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const drift = pillar === 'neutral' ? 40 : 56;
  const y1 = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [drift * 0.45, 0, -drift * 0.45]);
  const y2 = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [drift * 0.8, 0, -drift * 0.8]);
  const ps = pillarStyles(pillar);

  return (
    <section ref={ref} className="relative overflow-hidden scroll-mt-[88px]">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full opacity-[0.085] blur-3xl"
        style={{ y: y1, background: ps.glow }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-28 bottom-0 h-[22rem] w-[22rem] rounded-full opacity-[0.07] blur-3xl"
        style={{ y: y2, background: 'radial-gradient(circle, var(--teal), transparent 70%)' }}
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

function SlideCard({
  slideNumber,
  pillar,
  paragraphs,
}: {
  slideNumber: number;
  pillar: DeckPillar;
  paragraphs: string[];
}) {
  const reduce = useReducedMotion();
  const ps = pillarStyles(pillar);

  return (
    <motion.article
      layout
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.52, ease: EASE }}
      className={cn(
        'relative overflow-hidden rounded-[1.75rem] border border-[var(--grey-border)] bg-[var(--surface-card)] shadow-[var(--shadow-sm)] backdrop-blur',
        'hover:shadow-[var(--shadow-card)] transition-shadow duration-300',
      )}
    >
      <div className={cn('h-1.5 bg-gradient-to-r opacity-95', ps.bar)} />
      <div className="flex flex-wrap items-start justify-between gap-3 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex tabular rounded-full bg-[var(--surface)] px-3 py-1 text-[11px] font-black tracking-[0.16em] text-[var(--blue)]/65 ring-1 ring-[var(--grey-border)]">
            SLIDE · {slideNumber.toString().padStart(2, '0')} / 44
          </span>
          <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ring-1', ps.chip)}>
            {pillar === 'neutral'
              ? 'Narrative'
              : pillar === 'iq'
                ? 'Spark IQ'
                : pillar === 'os'
                  ? 'Spark OS'
                  : 'Spark XP'}
          </span>
        </div>
      </div>
      <div className="border-t border-[var(--grey-border)]/75 px-6 pb-8 pt-0 md:px-8 md:pb-10">
        <div className="space-y-3.5" style={{ fontFamily: 'var(--font-body)' }}>
          {paragraphs.map((p, i) => {
            const isImpact = /^BUSINESS IMPACT$/i.test(p);
            if (isImpact)
              return (
                <p
                  key={i}
                  className="pt-4 text-[11px] font-black uppercase tracking-[0.32em] text-[var(--teal)] md:text-[12px]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  BUSINESS IMPACT
                </p>
              );
            return (
              <p
                key={i}
                className={cn(
                  'text-[15px] leading-relaxed text-[var(--blue)]/85 md:text-base md:leading-relaxed',
                  /^[A-Z0-9 &–—%/,.+]+$/.test(p) && p.length >= 18 && !/\s/.test(p)
                    ? 'font-extrabold tracking-[0.06em]'
                    : '',
                )}
                style={{
                  wordBreak: 'break-word',
                }}
              >
                {p}
              </p>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}

export function TddiStandardOfferDeck() {
  const catalogueHref = COLLECTION_META['standard-offer'].catalogueHref!;
  const reduce = useReducedMotion();
  const [activeChapter, setActiveChapter] = useState(TDDI_STANDARD_OFFER_DECK_CHAPTERS[0]!.id);
  const [navOpen, setNavOpen] = useState(false);
  const rafClear = useRef<number | undefined>(undefined);

  const chapterAnchorIds = useMemo(
    () => TDDI_STANDARD_OFFER_DECK_CHAPTERS.map((c) => ({ id: c.id, anchor: `deck-${c.id}` })),
    [],
  );

  useEffect(() => {
    const spy = () => {
      const focusLine = Math.round(window.innerHeight * 0.28);
      let bestId = chapterAnchorIds[0]?.id ?? 'cover';
      let best = Number.POSITIVE_INFINITY;

      for (const row of chapterAnchorIds) {
        const el = document.getElementById(row.anchor);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 120) continue;
        const d = Math.abs(rect.top - focusLine);
        if (d < best) {
          best = d;
          bestId = row.id;
        }
      }
      setActiveChapter(bestId);
    };

    const onScroll = () => {
      if (rafClear.current !== undefined) cancelAnimationFrame(rafClear.current);
      rafClear.current = requestAnimationFrame(spy);
    };

    spy();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafClear.current !== undefined) cancelAnimationFrame(rafClear.current);
    };
  }, [chapterAnchorIds]);

  const scrollToChapter = (id: string) => {
    const el = document.getElementById(`deck-${id}`);
    el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    setNavOpen(false);
  };

  const totalSlides = useMemo(
    () => TDDI_STANDARD_OFFER_DECK_CHAPTERS.reduce((n, c) => n + c.slides.length, 0),
    [],
  );

  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="relative min-h-screen bg-[var(--surface)]">
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 right-0 top-0 z-40 h-[3px] bg-[var(--grey-border)]/40"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--blue-primary)] via-[var(--teal)] to-[var(--blue)]"
          style={{ width: progressWidth }}
        />
      </motion.div>

      <header className="sticky top-0 z-30 border-b border-[var(--grey-border)] bg-[var(--surface-card)]/92 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
          <div className="flex min-w-0 flex-wrap items-center gap-2 md:gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--grey-border)] bg-[var(--surface)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--blue-primary)] transition-colors hover:border-[var(--blue-primary)]/40"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <ArrowLeft size={14} weight="bold" aria-hidden />
              Catalogue
            </Link>
            <Link
              href="/standard-offer"
              className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-[var(--blue)]/60 hover:text-[var(--blue)] sm:inline-flex"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Standard Offer
              <ArrowRight size={12} weight="bold" aria-hidden />
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="hidden rounded-full bg-[var(--icon-bg)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--blue)]/65 md:inline"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              TDDI · Full deck ({totalSlides} slides)
            </span>
            <button
              type="button"
              onClick={() => setNavOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--blue)] px-3.5 py-2 text-xs font-bold text-white shadow-[var(--shadow-sm)] transition-transform hover:-translate-y-px lg:hidden"
              style={{ fontFamily: 'var(--font-body)' }}
              aria-expanded={navOpen ? 'true' : 'false'}
            >
              <List size={16} weight="bold" aria-hidden />
              Sections
              <CaretCircleDown size={16} weight="bold" className={cn('transition-transform', navOpen ? 'rotate-180' : '')} aria-hidden />
            </button>
            <Link
              href={catalogueHref}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--grey-border)] bg-white px-3.5 py-2 text-xs font-bold text-[var(--blue)] transition-colors hover:bg-[var(--icon-bg)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Open grid
              <RocketLaunch size={16} weight="duotone" className="text-[var(--teal)]" aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1600px] gap-8 px-4 pb-20 pt-6 md:px-8">
        {/* Lateral navigation — desktop */}
        <aside className="hidden w-[240px] shrink-0 lg:block">
          <div className="sticky top-[88px] space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--blue)]/50" style={{ fontFamily: 'var(--font-body)' }}>
              Journey
            </p>
            <nav aria-label="Deck chapters" className="space-y-1">
              {TDDI_STANDARD_OFFER_DECK_CHAPTERS.map((ch) => {
                const active = activeChapter === ch.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => scrollToChapter(ch.id)}
                    className={cn(
                      'flex w-full items-start gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition-all',
                      active
                        ? 'border-[var(--blue-primary)]/35 bg-[var(--blue-primary)]/10 text-[var(--blue)] shadow-[var(--shadow-sm)]'
                        : 'border-transparent text-[var(--blue)]/70 hover:border-[var(--grey-border)] hover:bg-[var(--surface-card)]',
                    )}
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--teal)]" aria-hidden />
                    <span className="leading-snug">{ch.navLabel}</span>
                  </button>
                );
              })}
            </nav>
            <p className="text-[11px] leading-relaxed text-[var(--blue)]/55" style={{ fontFamily: 'var(--font-body)' }}>
              Scroll the story or jump between chapters. This page mirrors the official PowerPoint flow — built for screen, not print.
            </p>
          </div>
        </aside>

        <AnimatePresence>
          {navOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="fixed inset-x-3 top-[120px] z-50 max-h-[70vh] overflow-auto rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-3 shadow-[var(--shadow-popover)] lg:hidden"
            >
              <p className="px-1 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/50">Jump to</p>
              <div className="grid gap-1">
                {TDDI_STANDARD_OFFER_DECK_CHAPTERS.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => scrollToChapter(ch.id)}
                    className="rounded-xl px-3 py-2 text-left text-sm font-bold text-[var(--blue)] hover:bg-[var(--icon-bg)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {ch.navLabel}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="min-w-0 flex-1 space-y-6 md:space-y-16">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-[var(--grey-border)] bg-gradient-to-br from-[var(--surface-card)] via-[var(--surface)] to-[var(--icon-bg)] p-8 shadow-[var(--shadow-card)] md:p-12">
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[var(--blue-primary)]/[0.12] blur-3xl"
                animate={reduce ? undefined : { y: [0, 10, 0], opacity: [0.12, 0.2, 0.12] }}
                transition={reduce ? undefined : { duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative z-10 max-w-3xl space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-[var(--blue)]/60 ring-1 ring-[var(--grey-border)] backdrop-blur">
                  <Presentation size={14} weight="bold" className="text-[var(--teal)]" aria-hidden />
                  Internal narrative surface
                </span>
                <h1
                  className="text-[clamp(2.1rem,4.5vw,3.4rem)] font-extrabold leading-[1.02] text-[var(--blue)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  TDDI Standard Offer — full deck experience
                </h1>
                <p className="text-base leading-relaxed text-[var(--blue)]/75 md:text-lg" style={{ fontFamily: 'var(--font-body)' }}>
                  The same story as the PowerPoint: Spark as the synchronized experience engine, segment deep-dives for Food, Hospitality, and Workplace / FM, then the technology foundations and innovation muscle. Parallax layers, motion, and chapter navigation help you present it live from a browser.
                </p>
              </div>
            </div>
          </Reveal>

          {TDDI_STANDARD_OFFER_DECK_CHAPTERS.map((chapter) => {
            const dominantPillar = backdropPillarForChapter(chapter.slides);

            return (
              <DeckChapterBackdrop key={chapter.id} pillar={dominantPillar}>
                <div id={`deck-${chapter.id}`} className="space-y-5 md:space-y-7">
                  <Reveal>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--blue)]/50" style={{ fontFamily: 'var(--font-body)' }}>
                          Chapter
                        </p>
                        <h2
                          className="mt-1 text-2xl font-extrabold text-[var(--blue)] md:text-4xl"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {chapter.navLabel}
                        </h2>
                      </div>
                      <p className="max-w-sm text-xs font-semibold leading-relaxed text-[var(--blue)]/60" style={{ fontFamily: 'var(--font-body)' }}>
                        {chapter.slides.length} slide{chapter.slides.length === 1 ? '' : 's'} · original sequence preserved
                      </p>
                    </div>
                  </Reveal>

                  <div className="space-y-5 md:space-y-6">
                    {chapter.slides.map((s) => (
                      <SlideCard
                        key={s.slideNumber}
                        slideNumber={s.slideNumber}
                        pillar={s.pillar}
                        paragraphs={bodyToParagraphs(s.body, s.slideNumber)}
                      />
                    ))}
                  </div>
                </div>
              </DeckChapterBackdrop>
            );
          })}

          <Reveal>
            <section className="rounded-[2rem] border border-[var(--grey-border)] bg-[var(--surface-card)] p-8 text-center shadow-[var(--shadow-sm)] md:p-12">
              <h2 className="text-2xl font-extrabold text-[var(--blue)] md:text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
                From story to shortlist
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--blue)]/70 md:text-base" style={{ fontFamily: 'var(--font-body)' }}>
                Use the filtered catalogue to map these narratives to live solutions, proof points, and geographies for your next workshop.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href={catalogueHref}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--teal)] px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition-transform hover:-translate-y-0.5"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Browse Standard Offer grid
                  <ArrowRight size={18} weight="bold" aria-hidden />
                </Link>
                <Link
                  href="/standard-offer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--grey-border)] bg-white px-6 py-3 text-sm font-bold text-[var(--blue)] transition-colors hover:bg-[var(--icon-bg)]"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Compact story page
                </Link>
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
