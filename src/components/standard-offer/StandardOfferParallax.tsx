'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowRight, ChartLine, Lightning, Sparkle, Trophy } from '@phosphor-icons/react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils/cn';
import type { Solution } from '@/lib/data/types';

interface ParallaxBandProps {
  children: React.ReactNode;
  className?: string;
  /** Parallax intensity in px (ignored when reduced motion). */
  drift?: number;
}

function ParallaxBand({ children, className, drift = 48 }: ParallaxBandProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [drift, 0, -drift]);

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div className="will-change-transform" style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

interface TripleParallaxBandProps {
  children: React.ReactNode;
  className?: string;
  drift?: number;
  variant?: 'iq' | 'os' | 'xp';
}

/** Background / mid / foreground drift — reads as stacked depth without heavy animation. */
function TripleParallaxBand({ children, className, drift = 56, variant = 'iq' }: TripleParallaxBandProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const yBack = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [drift * 0.4, 0, -drift * 0.4]);
  const yMid = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [drift * 0.65, 0, -drift * 0.65]);
  const yFore = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [drift, 0, -drift]);

  const blobA =
    variant === 'iq'
      ? 'var(--blue-primary)'
      : variant === 'os'
        ? 'var(--teal)'
        : 'var(--blue)';

  return (
    <div ref={ref} className={cn('relative overflow-hidden border-b border-[var(--grey-border)]', className)}>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-28 top-8 h-80 w-80 rounded-full opacity-[0.11] blur-3xl"
        style={{ y: yBack, background: `radial-gradient(circle, ${blobA}, transparent 68%)` }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-4 h-72 w-72 rounded-full opacity-[0.09] blur-3xl"
        style={{ y: yMid, background: 'radial-gradient(circle, var(--teal), transparent 70%)' }}
      />
      <motion.div className="relative z-10 will-change-transform" style={{ y: yFore }}>
        {children}
      </motion.div>
    </div>
  );
}

function HeroParallaxScene({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [18, -18]);
  const yMid = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [28, -28]);
  const yContent = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [10, -10]);

  return (
    <div ref={ref} className={cn('relative overflow-hidden border-b border-[var(--grey-border)] bg-[var(--surface-card)]', className)}>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-36 top-0 h-72 w-72 rounded-full bg-[var(--blue-primary)]/[0.09] blur-3xl"
        style={{ y: yBg }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-[var(--teal)]/[0.08] blur-3xl"
        style={{ y: yMid }}
      />
      <motion.div className="relative z-10" style={{ y: yContent }}>
        {children}
      </motion.div>
    </div>
  );
}

function FeaturedStrip({
  solutions,
  label,
  compact = false,
}: {
  solutions: Solution[];
  label: string;
  compact?: boolean;
}) {
  if (solutions.length === 0) return null;

  return (
    <div
      className={cn(
        'w-full border-t border-[var(--grey-border)]',
        compact ? 'mt-4 border-[var(--grey-border)]/70 pt-4' : 'mt-6 pt-6',
      )}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--blue)]/50 md:text-[11px]"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {label}
      </p>
      <ul className={cn('grid sm:grid-cols-3', compact ? 'mt-2.5 gap-2.5' : 'mt-3 gap-3')}>
        {solutions.map((s) => (
          <li key={s.id}>
            <Link
              href={`/solutions/${s.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--grey-border)] bg-[var(--surface-card)] shadow-[var(--shadow-sm)] transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={cn(
                  'relative w-full overflow-hidden bg-[var(--icon-bg)]',
                  compact ? 'aspect-[16/10]' : 'aspect-[4/3]',
                )}
              >
                {s.heroImage ? (
                  <Image
                    src={s.heroImage}
                    alt=""
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl" aria-hidden>
                    {s.img}
                  </div>
                )}
              </div>
              <div className={cn('flex flex-1 flex-col gap-1', compact ? 'p-3' : 'p-4')}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--blue)]/45">{s.module}</p>
                <p className="text-sm font-extrabold leading-snug text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {s.name}
                </p>
                <p className="line-clamp-2 text-[11px] leading-snug text-[var(--blue)]/70 md:text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                  {s.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface StandardOfferFeaturedGroups {
  iq: Solution[];
  os: Solution[];
  xp: Solution[];
}

interface StandardOfferParallaxProps {
  /**
   * When true, CTAs scroll to `#solutions-catalogue` on the same page (used on
   * `/solutions?collection=standard-offer`). When false, links open the filtered catalogue URL.
   */
  embedded?: boolean;
  /** Catalogue-backed picks — only passed from `/standard-offer` (not the embedded solutions story). */
  featured?: StandardOfferFeaturedGroups;
}

const FILTERED_CATALOGUE_HREF = '/solutions?collection=standard-offer#solutions-catalogue';

export function StandardOfferParallax({ embedded = false, featured }: StandardOfferParallaxProps) {
  const catalogueHref = embedded ? '#solutions-catalogue' : FILTERED_CATALOGUE_HREF;
  const primaryCtaLabel = embedded ? 'Jump to solutions below' : 'Browse Standard Offer solutions';
  const closingCtaLabel = embedded ? 'Jump to filters & grid' : 'Open filtered catalogue';
  const showFeatured = Boolean(featured) && !embedded;

  return (
    <div className="bg-[var(--surface)]">
      {/* Hero — three soft depth layers */}
      <HeroParallaxScene>
        <div className="mx-auto max-w-[960px] px-6 py-12 text-center md:py-16">
          <span
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--icon-bg)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--blue)]/70"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <Trophy size={14} weight="duotone" className="text-[var(--teal)]" aria-hidden />
            TDDI · Standard Offer
          </span>
          <h1
            className="mt-5 text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.05] text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Standard Offer — the backbone you can sell with confidence
          </h1>
          <p
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--blue)]/75 md:text-lg"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            The TDDI Standard Offer packages our most mature, scaled products: the ones already deployed with clients,
            with clear outcomes and runbooks. It is organised around three pillars —{' '}
            <strong className="text-[var(--blue)]">IQ</strong> (insight &amp; intelligence),{' '}
            <strong className="text-[var(--blue)]">OS</strong> (operations &amp; orchestration), and{' '}
            <strong className="text-[var(--blue)]">XP</strong> (guest &amp; employee experience) — so teams can move from signal to
            operations to signature moments.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {embedded ? (
              <a
                href={catalogueHref}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--blue)] px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition-transform hover:-translate-y-0.5"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {primaryCtaLabel}
                <ArrowDown size={16} weight="bold" aria-hidden />
              </a>
            ) : (
              <Link
                href={catalogueHref}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--blue)] px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition-transform hover:-translate-y-0.5"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {primaryCtaLabel}
                <ArrowRight size={16} weight="bold" aria-hidden />
              </Link>
            )}
            <Link
              href="/search-guide"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--grey-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--blue)] transition-colors hover:bg-[var(--icon-bg)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              How to search the catalogue
            </Link>
          </div>
        </div>
      </HeroParallaxScene>

      {/* IQ — intelligence (copy → three solutions → tip) */}
      <TripleParallaxBand drift={56} variant="iq">
        <div className="relative mx-auto max-w-[1100px] px-6 py-12 md:py-16">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--icon-bg)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/70">
                <ChartLine size={16} weight="duotone" className="text-[var(--blue-primary)]" aria-hidden />
                IQ
              </span>
              <h2 className="text-3xl font-extrabold text-[var(--blue)] md:text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>
                Intelligence that makes the invisible visible
              </h2>
              <p className="text-sm leading-snug text-[var(--blue)]/75 md:text-base md:leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                The IQ pillar groups analytics, client portals and decision-grade signals — from performance dashboards to B2B
                platforms — so account teams can prove value, spot drift early, and steer programmes with facts, not anecdotes.
              </p>
              <ul className="list-inside list-disc space-y-1.5 text-sm text-[var(--blue)]/80" style={{ fontFamily: 'var(--font-body)' }}>
                <li>4Site and connected insight layers for commercial conversations</li>
                <li>B2B digital touchpoints that keep clients aligned with live operations</li>
              </ul>
              {showFeatured && featured ? (
                <FeaturedStrip solutions={featured.iq} label="Featured · IQ" compact />
              ) : null}
            </div>
            <div
              className="w-full shrink-0 rounded-brand-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-card)] md:max-w-[300px] md:p-5"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--blue)]/55">In the catalogue</p>
              <p className="mt-2 text-sm leading-snug text-[var(--blue)]/75">
                Look for solutions tagged <strong className="text-[var(--blue)]">Standard Offer</strong> in the intelligence lane — they are curated for scale and repeatability across accounts.
              </p>
            </div>
          </div>
        </div>
      </TripleParallaxBand>

      {/* OS — operations */}
      <TripleParallaxBand drift={44} variant="os" className="bg-[var(--surface-card)]/60">
        <div className="relative mx-auto max-w-[1100px] px-6 py-12 md:py-16">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--icon-bg)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/70">
                <Lightning size={16} weight="duotone" className="text-[var(--teal)]" aria-hidden />
                OS
              </span>
              <h2 className="text-3xl font-extrabold text-[var(--blue)] md:text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>
                Operating systems for resilient sites
              </h2>
              <p className="text-sm leading-snug text-[var(--blue)]/75 md:text-base md:leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                The OS pillar is where menus, sustainability telemetry, and dynamic FM command centres meet — the digital layer that keeps kitchens, frontline teams and assets orchestrated day after day.
              </p>
              <ul className="list-inside list-disc space-y-1.5 text-sm text-[var(--blue)]/80" style={{ fontFamily: 'var(--font-body)' }}>
                <li>MenuAI, SEA, DBFM — the operational stack Sodexo runs at depth</li>
                <li>Designed for repeat deployment, not one-off pilots</li>
              </ul>
              {showFeatured && featured ? (
                <FeaturedStrip solutions={featured.os} label="Featured · OS" compact />
              ) : null}
            </div>
            <div
              className="w-full shrink-0 rounded-brand-2xl border border-[var(--grey-border)] bg-white p-5 shadow-[var(--shadow-card)] md:max-w-[300px]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--blue)]/55">Why it matters</p>
              <p className="mt-2 text-sm leading-snug text-[var(--blue)]/75">
                Standard Offer here means procurement-safe patterns: pricing, SLAs, and implementation paths that sales and delivery already know how to land.
              </p>
            </div>
          </div>
        </div>
      </TripleParallaxBand>

      {/* XP — experience */}
      <TripleParallaxBand drift={52} variant="xp">
        <div className="relative mx-auto max-w-[1100px] px-6 py-12 md:py-16">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--icon-bg)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/70">
                <Sparkle size={16} weight="duotone" className="text-[var(--blue-primary)]" aria-hidden />
                XP
              </span>
              <h2 className="text-3xl font-extrabold text-[var(--blue)] md:text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>
                Signature experiences guests feel on day one
              </h2>
              <p className="text-sm leading-snug text-[var(--blue)]/75 md:text-base md:leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                The XP pillar covers Everyday, WRX, Circles, and frictionless formats — autonomous stores and checkout innovation that shorten queues, lift satisfaction, and create premium moments without adding chaos for operators.
              </p>
              <ul className="list-inside list-disc space-y-1.5 text-sm text-[var(--blue)]/80" style={{ fontFamily: 'var(--font-body)' }}>
                <li>Consumer-grade journeys wired to Sodexo operations</li>
                <li>Composable with the rest of the Standard Offer stack — not isolated gadgets</li>
              </ul>
              {showFeatured && featured ? (
                <FeaturedStrip solutions={featured.xp} label="Featured · XP" compact />
              ) : null}
            </div>
            <div
              className="w-full shrink-0 rounded-brand-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-card)] md:max-w-[300px]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--blue)]/55">From deck to demo</p>
              <p className="mt-2 text-sm leading-snug text-[var(--blue)]/75">
                {embedded
                  ? 'Use the story above, then scroll to the grid to shortlist proof points, logos, and geographies for your next client workshop.'
                  : 'Use this page as the narrative wrapper; jump into the catalogue to shortlist proof points, logos, and geographies for your next client workshop.'}
              </p>
            </div>
          </div>
        </div>
      </TripleParallaxBand>

      {/* Closing CTA */}
      <ParallaxBand drift={28} className="border-t border-[var(--grey-border)] bg-[var(--surface-card)]/40">
        <section className="mx-auto max-w-[960px] px-6 py-12 text-center md:py-14">
          <h2 className="text-2xl font-extrabold text-[var(--blue)] md:text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
            Ready to assemble a client-ready basket?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--blue)]/70 md:text-base" style={{ fontFamily: 'var(--font-body)' }}>
            Filter the full catalogue to Standard Offer, combine with areas and personas, then save favourites for your pitch.
          </p>
          {embedded ? (
            <a
              href={catalogueHref}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--teal)] px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition-transform hover:-translate-y-0.5"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {closingCtaLabel}
              <ArrowDown size={18} weight="bold" aria-hidden />
            </a>
          ) : (
            <Link
              href={catalogueHref}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--teal)] px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition-transform hover:-translate-y-0.5"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {closingCtaLabel}
              <ArrowRight size={18} weight="bold" aria-hidden />
            </Link>
          )}
        </section>
      </ParallaxBand>
    </div>
  );
}
