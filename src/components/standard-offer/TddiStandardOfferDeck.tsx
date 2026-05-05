'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CaretCircleDown,
  List,
  RocketLaunch,
  Sparkle,
} from '@phosphor-icons/react';
import { AnimatePresence, motion, type MotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { COLLECTION_META } from '@/lib/data/collections';
import {
  type DeckPillar,
  TDDI_STANDARD_OFFER_DECK_CHAPTERS,
} from '@/lib/data/tddiStandardOfferDeck.generated';
import { pickMomentImage, TDDI_DECK_CHAPTER_VISUALS } from '@/lib/data/tddiDeckVisuals';
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

function pillarStyles(p: DeckPillar): { chip: string; glow: string; ring: string } {
  if (p === 'iq')
    return {
      chip: 'bg-[var(--blue-primary)]/14 text-[var(--blue-primary)] ring-[var(--blue-primary)]/22',
      glow: 'radial-gradient(ellipse at 30% 20%, rgba(11,118,184,0.35), transparent 55%)',
      ring: 'ring-[var(--blue-primary)]/20',
    };
  if (p === 'os')
    return {
      chip: 'bg-[var(--teal)]/14 text-[var(--teal)] ring-[var(--teal)]/25',
      glow: 'radial-gradient(ellipse at 70% 30%, rgba(20,184,166,0.32), transparent 58%)',
      ring: 'ring-[var(--teal)]/20',
    };
  if (p === 'xp')
    return {
      chip: 'bg-[var(--blue)]/14 text-[var(--blue)] ring-[var(--blue)]/22',
      glow: 'radial-gradient(ellipse at 40% 60%, rgba(59,130,246,0.28), transparent 52%)',
      ring: 'ring-[var(--blue)]/18',
    };
  return {
    chip: 'bg-[var(--icon-bg)] text-[var(--blue)]/72 ring-[var(--grey-border)]',
    glow: 'radial-gradient(circle at 50% 0%, rgba(11,118,184,0.12), transparent 50%)',
    ring: 'ring-[var(--grey-border)]',
  };
}

/** Full transcript blocks for expandable “speaker notes”. */
function bodyToDetailParagraphs(raw: string, slideNumber: number): string[] {
  let t = slideNumber === 2 ? raw.replace(/^\s*2\s+/, '') : raw;
  t = t
    .replace(/\bBUSINESS IMPACT\b/gi, '\n\nBUSINESS IMPACT\n\n')
    .trim();
  return t
    .split(/\n\s*\n+/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .filter((p) => !/^business impact$/i.test(p));
}

function stripStructuralNoise(raw: string): string {
  return raw
    .replace(/\b(TDDI Standard Offer[^.]*\.)/gi, '')
    .replace(/\b(How to use this document)\b/gi, '')
    .replace(/\b(Case studies|Product video)\b/gi, '')
    .replace(/\bFOOD SERVICES I\b/gi, '')
    .replace(/\bWORKPLACE\/\s*FM SERVICES I\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Pull a short headline + lead from noisy deck prose. */
function narrativeTeaser(raw: string, slideNumber: number): { headline: string; lead: string } {
  let t = slideNumber === 2 ? raw.replace(/^\s*2\s+/, '') : raw;
  t = stripStructuralNoise(t);
  const sentences = t
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 24 && !/^[\d%\s]+$/.test(s));

  function clip(s: string, max: number): string {
    if (s.length <= max) return s;
    const cut = s.slice(0, max);
    const sp = cut.lastIndexOf(' ');
    return `${(sp > 40 ? cut.slice(0, sp) : cut).trim()}…`;
  }

  let headline = sentences[0] ?? t.slice(0, 120);
  headline = headline.replace(/^[^a-zA-Z]+/, '').trim();
  headline = clip(headline.replace(/\s+/g, ' '), 92);

  let lead = sentences[1] ?? sentences[0]?.split('.').slice(1).join('.').trim() ?? '';
  if (!lead || lead === headline) {
    lead = sentences[2] ?? '';
  }
  lead = clip(lead.replace(/\s+/g, ' '), 190);

  if (!lead)
    lead = clip(
      t
        .replace(headline, '')
        .replace(/\s+/g, ' ')
        .trim(),
      190,
    );

  return { headline, lead };
}

function FloatingOrbs({
  pillar,
  scrollYProgress,
}: {
  pillar: DeckPillar;
  scrollYProgress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const ps = pillarStyles(pillar);
  const ySlow = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [42, -42]);
  const yFast = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [72, -88]);
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], reduce ? [1, 1, 1] : [1.12, 1, 0.94]);

  return (
    <>
      <motion.div
        aria-hidden
        style={{ y: ySlow, scale, background: ps.glow }}
        className={cn(
          'pointer-events-none absolute -left-24 top-[-10%] h-[min(520px,52vw)] w-[min(520px,52vw)] rounded-[40%]',
          'blur-3xl opacity-[0.11]',
          'mix-blend-multiply dark:opacity-[0.18] dark:mix-blend-soft-light',
        )}
      />
      <motion.div
        aria-hidden
        style={{ y: yFast }}
        className="pointer-events-none absolute -right-20 bottom-[-12%] h-80 w-80 rounded-full bg-[var(--teal)]/[0.08] blur-[100px]"
      />
    </>
  );
}

function ChapterParallaxHero({
  chapterId,
  displayTitle,
  kicker,
  pillar,
}: {
  chapterId: string;
  displayTitle: string;
  kicker: string;
  pillar: DeckPillar;
}) {
  const meta = TDDI_DECK_CHAPTER_VISUALS[chapterId];
  const src = meta?.heroImage ?? '/images/catalogue/assets/brand/xp-catalogue-mark.svg';
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const yImg = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [54, -64]);
  const yText = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [28, -22]);
  const scale = useTransform(scrollYProgress, [0, 0.55, 1], reduce ? [1, 1, 1] : [1.14, 1.06, 1]);
  const ps = pillarStyles(pillar);

  return (
    <section ref={ref} className="relative mb-10 overflow-hidden rounded-[clamp(1.5rem,3vw,2.75rem)] border border-[var(--grey-border)] bg-[var(--surface-card)] shadow-[var(--shadow-card)]">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-card)] via-[var(--surface)]/95 to-transparent" aria-hidden />
      <FloatingOrbs pillar={pillar} scrollYProgress={scrollYProgress} />

      <div className="relative grid min-h-[min(460px,68vh)] grid-cols-1 md:grid-cols-[minmax(0,1.08fr)_minmax(260px,0.92fr)] md:items-stretch">
        <motion.div
          className="relative flex flex-col justify-end px-8 pb-10 pt-28 md:px-14 md:pb-14 md:pt-20"
          style={{ y: yText }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.38em] text-[var(--blue)]/50" style={{ fontFamily: 'var(--font-body)' }}>
            Spark narrative
          </p>
          <h2 className="mt-2 text-[clamp(1.85rem,3.8vw,3.1rem)] font-extrabold leading-[1.05] text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
            {displayTitle}
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--blue)]/72 md:text-base" style={{ fontFamily: 'var(--font-body)' }}>
            {kicker}
          </p>
        </motion.div>

        <motion.div className="relative min-h-[220px] md:min-h-0 overflow-hidden md:rounded-br-[clamp(1.5rem,3vw,2.75rem)]" style={{ y: yImg }}>
          <motion.div style={{ scale }} className="absolute inset-[8%_-4%_-8%_-4%] md:inset-[6%_-12%_-10%_-4%]">
            <Image
              src={src}
              alt=""
              fill
              className="object-contain object-bottom md:object-right-bottom drop-shadow-xl"
              sizes="(max-width:768px) 100vw, 42vw"
              priority={chapterId === 'cover'}
            />
          </motion.div>
          <div
            aria-hidden
            className={cn(
              'absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[var(--surface-card)] via-[var(--surface-card)]/80 to-transparent md:hidden',
            )}
          />
        </motion.div>
      </div>
    </section>
  );
}

function MomentPanel({
  chapterId,
  pillar,
  indexInChapter,
  slideNumber,
  rawBody,
}: {
  chapterId: string;
  pillar: DeckPillar;
  indexInChapter: number;
  slideNumber: number;
  rawBody: string;
}) {
  const img = pickMomentImage(chapterId, indexInChapter + slideNumber);
  const reverse = indexInChapter % 2 === 1;
  const { headline, lead } = narrativeTeaser(rawBody, slideNumber);
  const detailBlocks = bodyToDetailParagraphs(rawBody, slideNumber);
  const ps = pillarStyles(pillar);

  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [48, -40]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [1.1, 1.04, 0.98]);

  return (
    <motion.article
      ref={ref}
      layout
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.55, ease: EASE }}
      className={cn(
        'relative overflow-hidden rounded-[1.85rem] border bg-[var(--surface-card)]/90 shadow-[var(--shadow-sm)] backdrop-blur-md',
        'ring-1',
        ps.ring,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.55]" style={{ background: ps.glow }} />

      <div className={cn('relative grid gap-0 md:gap-10 md:p-10', reverse ? 'md:grid-flow-dense' : '', 'grid-cols-1 md:grid-cols-2 md:items-center')}>
        <div className={cn('relative z-10 p-8 md:p-0', reverse ? 'md:col-start-2' : '')}>
          <span
            className={cn(
              'inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.26em] ring-1',
              ps.chip,
            )}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {pillar === 'neutral'
              ? 'Story'
              : pillar === 'iq'
                ? 'IQ · insight'
                : pillar === 'os'
                  ? 'OS · ops'
                  : 'XP · experience'}
          </span>
          <h3 className="mt-4 text-xl font-extrabold leading-snug text-[var(--blue)] md:text-[1.65rem]" style={{ fontFamily: 'var(--font-heading)' }}>
            {headline}
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--blue)]/74 md:text-base" style={{ fontFamily: 'var(--font-body)' }}>
            {lead}
          </p>

          <details className="group mt-6 rounded-2xl border border-[var(--grey-border)] bg-white/65 p-4 dark:bg-black/15">
            <summary className="cursor-pointer select-none text-xs font-bold text-[var(--blue-primary)] transition-colors hover:text-[var(--blue)]">
              <span className="inline-flex items-center gap-2">
                Speaker notes · full excerpt from deck
                <CaretCircleDown
                  weight="bold"
                  size={16}
                  className="transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </span>
            </summary>
            <div className="mt-4 max-h-[min(340px,50vh)] space-y-3 overflow-y-auto text-sm leading-relaxed text-[var(--blue)]/80" style={{ fontFamily: 'var(--font-body)' }}>
              {detailBlocks.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </details>
        </div>

        <div className={cn('relative min-h-[220px] md:min-h-[320px]', reverse ? 'md:col-start-1 md:row-start-1' : '')}>
          <motion.div className="absolute inset-6 rounded-3xl md:inset-y-10 md:left-4 md:right-4" style={{ y: imgY, scale: imgScale }}>
            <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/70 bg-[var(--icon-bg)] shadow-inner dark:border-white/10">
              <Image src={img} alt="" fill className="object-contain p-4 md:p-6" sizes="(max-width:768px) 100vw, 36vw" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

function DeckOpeningHero({ reduce }: { reduce: boolean | null }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const blob = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-30, 80]);
  const lift = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -36]);

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[clamp(1.75rem,3vw,2.85rem)] border border-[var(--grey-border)] bg-[var(--surface-card)] shadow-[var(--shadow-card)]">
      <motion.div aria-hidden style={{ y: blob }} className="absolute -left-28 top-0 h-72 w-72 rounded-full bg-[var(--blue-primary)]/[0.11] blur-3xl" />
      <motion.div aria-hidden style={{ y: blob }} className="absolute -right-20 bottom-[-20%] h-64 w-64 rounded-full bg-[var(--teal)]/[0.1] blur-3xl" />

      <div className="relative grid gap-10 p-10 md:grid-cols-[1.05fr_minmax(0,0.75fr)] md:items-center md:p-14">
        <motion.div style={{ y: lift }}>
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--icon-bg)] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.34em] text-[var(--blue)]/62 ring-1 ring-[var(--grey-border)]">
            <Sparkle size={14} weight="duotone" className="text-[var(--teal)]" aria-hidden />
            Standard Offer narrative
          </span>
          <h1 className="mt-4 text-[clamp(2.05rem,4.8vw,3.55rem)] font-extrabold leading-[1.02] text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
            One Spark orbit — IQ, OS, XP in motion.
          </h1>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-[var(--blue)]/75 md:text-lg" style={{ fontFamily: 'var(--font-body)' }}>
            Scroll like a cinematic brief: visuals carry the storyline, typography keeps the heartbeat, and the full deck wording stays one tap away whenever you present live.
          </p>
          <Link
            href={COLLECTION_META['standard-offer'].catalogueHref!}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--blue)] px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition-transform hover:-translate-y-0.5"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Solutions behind the stories
            <ArrowRight size={18} weight="bold" aria-hidden />
          </Link>
        </motion.div>

        <div className="relative mx-auto flex aspect-square w-full max-w-[320px] items-center md:mx-0 md:max-w-none">
          <motion.div className="relative h-full min-h-[220px] w-full" style={{ y: lift, rotate: reduce ? 0 : 0 }}>
            <Image
              src="/images/catalogue/assets/journeys/moments/play-event-participant-3.svg"
              alt=""
              fill
              priority
              className="object-contain drop-shadow-2xl"
              sizes="320px"
            />
          </motion.div>
        </div>
      </div>
    </div>
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

  const chapterLabel = (id: string) => TDDI_DECK_CHAPTER_VISUALS[id]?.navLabel ?? id;

  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="relative min-h-screen bg-[var(--surface)]">
      <motion.div aria-hidden className="pointer-events-none fixed left-0 right-0 top-0 z-40 h-1 bg-[var(--grey-border)]/35">
        <motion.div className="h-full bg-gradient-to-r from-[var(--blue-primary)] via-[var(--teal)] to-[var(--blue)]" style={{ width: progressWidth }} />
      </motion.div>

      <header className="sticky top-0 z-30 border-b border-[var(--grey-border)] bg-[var(--surface-card)]/90 backdrop-blur-xl">
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
              className="hidden rounded-full bg-[var(--icon-bg)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--blue)]/62 md:inline"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Cinematic Spark brief
            </span>
            <button
              type="button"
              onClick={() => setNavOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--blue)] px-3.5 py-2 text-xs font-bold text-white shadow-[var(--shadow-sm)] transition-transform hover:-translate-y-px lg:hidden"
              style={{ fontFamily: 'var(--font-body)' }}
              aria-expanded={navOpen ? 'true' : 'false'}
            >
              <List size={16} weight="bold" aria-hidden />
              Chapters
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

      <div className="mx-auto flex w-full max-w-[1600px] gap-8 px-4 pb-24 pt-6 md:px-8">
        <aside className="hidden w-[220px] shrink-0 lg:block">
          <div className="sticky top-[88px] space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--blue)]/48" style={{ fontFamily: 'var(--font-body)' }}>
              Chapters
            </p>
            <nav aria-label="Story chapters" className="space-y-1">
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
                    <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-[var(--blue-primary)] to-[var(--teal)]" aria-hidden />
                    <span className="leading-snug">{chapterLabel(ch.id)}</span>
                  </button>
                );
              })}
            </nav>
            <p className="text-[11px] leading-relaxed text-[var(--blue)]/52" style={{ fontFamily: 'var(--font-body)' }}>
              Visual-forward telling — open “Speaker notes” when you want the verbatim lines.
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
              <p className="px-1 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/50">Go to</p>
              <div className="grid gap-1">
                {TDDI_STANDARD_OFFER_DECK_CHAPTERS.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => scrollToChapter(ch.id)}
                    className="rounded-xl px-3 py-2 text-left text-sm font-bold text-[var(--blue)] hover:bg-[var(--icon-bg)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {chapterLabel(ch.id)}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="min-w-0 flex-1 space-y-14 md:space-y-[4.25rem]">
          <Reveal>
            <DeckOpeningHero reduce={reduce} />
          </Reveal>

          {TDDI_STANDARD_OFFER_DECK_CHAPTERS.map((chapter) => {
            const dominantPillar = backdropPillarForChapter(chapter.slides);
            const vis = TDDI_DECK_CHAPTER_VISUALS[chapter.id];
            const displayTitle = vis?.navLabel ?? chapter.navLabel;

            return (
              <DeckChapterScrollLayer key={chapter.id} pillar={dominantPillar}>
                <div id={`deck-${chapter.id}`} className="scroll-mt-[88px] space-y-8 md:space-y-11">
                  <ChapterParallaxHero
                    chapterId={chapter.id}
                    displayTitle={displayTitle}
                    kicker={
                      vis?.kicker ??
                      'Continuing the Sodexo Spark storyline with momentum and modular depth.'
                    }
                    pillar={dominantPillar}
                  />

                  <div className="space-y-10 md:space-y-14">
                    {chapter.slides.map((s, i) => (
                      <MomentPanel
                        key={`${chapter.id}-${s.slideNumber}-${i}`}
                        chapterId={chapter.id}
                        pillar={s.pillar}
                        indexInChapter={i}
                        slideNumber={s.slideNumber}
                        rawBody={s.body}
                      />
                    ))}
                  </div>
                </div>
              </DeckChapterScrollLayer>
            );
          })}

          <Reveal>
            <section className="relative overflow-hidden rounded-[2rem] border border-[var(--grey-border)] bg-gradient-to-br from-[var(--surface-card)] to-[var(--icon-bg)] p-10 text-center shadow-[var(--shadow-sm)] md:p-14">
              <div aria-hidden className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[var(--teal)]/[0.12] blur-3xl" />
              <div aria-hidden className="absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-[var(--blue-primary)]/[0.1] blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-2xl font-extrabold text-[var(--blue)] md:text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
                  Land the narrative in proof
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-[var(--blue)]/72 md:text-base" style={{ fontFamily: 'var(--font-body)' }}>
                  Bridge from story to artefacts your teams can inspect: live solutions, geographies, and proof points tuned for bids.
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <Link
                    href={catalogueHref}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--teal)] px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition-transform hover:-translate-y-0.5"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Browse Standard Offer
                    <ArrowRight size={18} weight="bold" aria-hidden />
                  </Link>
                  <Link
                    href="/standard-offer"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--grey-border)] bg-white px-6 py-3 text-sm font-bold text-[var(--blue)] transition-colors hover:bg-[var(--icon-bg)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Short snapshot page
                  </Link>
                </div>
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function DeckChapterScrollLayer({ pillar, children }: { pillar: DeckPillar; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [56, -44]);

  const ps = pillarStyles(pillar);

  return (
    <div ref={ref} className="relative overflow-visible pb-8">
      <motion.div
        aria-hidden
        style={{ y: yBg, background: ps.glow }}
        className="pointer-events-none absolute inset-x-[5%] -top-24 -z-10 h-[120%] rounded-[3rem] opacity-[0.55] blur-3xl"
      />
      {children}
    </div>
  );
}
