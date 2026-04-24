'use client';

import Link from 'next/link';
import { ArrowDown, ArrowRight, ChartLine, Lightning, Sparkle, Trophy } from '@phosphor-icons/react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils/cn';

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

interface StandardOfferParallaxProps {
  /**
   * When true, CTAs scroll to `#solutions-catalogue` on the same page (used on
   * `/solutions?collection=standard-offer`). When false, links open the filtered catalogue URL.
   */
  embedded?: boolean;
}

export function StandardOfferParallax({ embedded = false }: StandardOfferParallaxProps) {
  const catalogueHref = embedded ? '#solutions-catalogue' : '/solutions?collection=standard-offer';
  const primaryCtaLabel = embedded ? 'Jump to solutions below' : 'Browse Standard Offer solutions';
  const closingCtaLabel = embedded ? 'Jump to filters & grid' : 'Open filtered catalogue';

  return (
    <div className="bg-[var(--surface)]">
      {/* Hero */}
      <ParallaxBand drift={32} className="border-b border-[var(--grey-border)] bg-[var(--surface-card)]">
        <div className="mx-auto max-w-[960px] px-6 py-16 md:py-24 md:text-center">
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
            The TDDI Standard Offer packages our most mature, scaled products: the ones already deployed with
            clients, with clear outcomes and runbooks. It is organised around three pillars —{' '}
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
      </ParallaxBand>

      {/* IQ — intelligence */}
      <ParallaxBand drift={56} className="relative min-h-[72vh] border-b border-[var(--grey-border)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, var(--blue-primary), transparent 65%)' }}
        />
        <div className="relative mx-auto grid max-w-[1100px] gap-10 px-6 py-20 md:grid-cols-[1fr_1.1fr] md:items-center md:py-28">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--icon-bg)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/70">
              <ChartLine size={16} weight="duotone" className="text-[var(--blue-primary)]" aria-hidden />
              IQ
            </span>
            <h2 className="text-3xl font-extrabold text-[var(--blue)] md:text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>
              Intelligence that makes the invisible visible
            </h2>
            <p className="text-sm leading-relaxed text-[var(--blue)]/75 md:text-base" style={{ fontFamily: 'var(--font-body)' }}>
              The IQ pillar groups analytics, client portals and decision-grade signals — from performance dashboards to
              B2B platforms — so account teams can prove value, spot drift early, and steer programmes with facts, not
              anecdotes.
            </p>
            <ul className="list-inside list-disc space-y-2 text-sm text-[var(--blue)]/80" style={{ fontFamily: 'var(--font-body)' }}>
              <li>4Site and connected insight layers for commercial conversations</li>
              <li>B2B digital touchpoints that keep clients aligned with live operations</li>
            </ul>
          </div>
          <div
            className="rounded-brand-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-card)] md:p-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--blue)]/55">In the catalogue</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--blue)]/75">
              Look for solutions tagged <strong className="text-[var(--blue)]">Standard Offer</strong> in the intelligence lane — they are curated for scale and repeatability across accounts.
            </p>
          </div>
        </div>
      </ParallaxBand>

      {/* OS — operations */}
      <ParallaxBand drift={44} className="relative min-h-[72vh] border-b border-[var(--grey-border)] bg-[var(--surface-card)]/60">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full opacity-[0.1]"
          style={{ background: 'radial-gradient(circle, var(--teal), transparent 70%)' }}
        />
        <div className="relative mx-auto grid max-w-[1100px] gap-10 px-6 py-20 md:grid-cols-[1.1fr_1fr] md:items-center md:py-28">
          <div className="order-2 flex flex-col gap-4 md:order-1">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--icon-bg)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/70">
              <Lightning size={16} weight="duotone" className="text-[var(--teal)]" aria-hidden />
              OS
            </span>
            <h2 className="text-3xl font-extrabold text-[var(--blue)] md:text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>
              Operating systems for resilient sites
            </h2>
            <p className="text-sm leading-relaxed text-[var(--blue)]/75 md:text-base" style={{ fontFamily: 'var(--font-body)' }}>
              The OS pillar is where menus, sustainability telemetry, and dynamic FM command centres meet — the digital
              layer that keeps kitchens, frontline teams and assets orchestrated day after day.
            </p>
            <ul className="list-inside list-disc space-y-2 text-sm text-[var(--blue)]/80" style={{ fontFamily: 'var(--font-body)' }}>
              <li>MenuAI, SEA, DBFM — the operational stack Sodexo runs at depth</li>
              <li>Designed for repeat deployment, not one-off pilots</li>
            </ul>
          </div>
          <div
            className="order-1 rounded-brand-2xl border border-[var(--grey-border)] bg-white p-6 shadow-[var(--shadow-card)] md:order-2 md:p-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--blue)]/55">Why it matters</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--blue)]/75">
              Standard Offer here means procurement-safe patterns: pricing, SLAs, and implementation paths that sales
              and delivery already know how to land.
            </p>
          </div>
        </div>
      </ParallaxBand>

      {/* XP — experience */}
      <ParallaxBand drift={52} className="relative min-h-[72vh] border-b border-[var(--grey-border)]">
        <div className="relative mx-auto grid max-w-[1100px] gap-10 px-6 py-20 md:grid-cols-[1fr_1.1fr] md:items-center md:py-28">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--icon-bg)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/70">
              <Sparkle size={16} weight="duotone" className="text-[var(--blue-primary)]" aria-hidden />
              XP
            </span>
            <h2 className="text-3xl font-extrabold text-[var(--blue)] md:text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>
              Signature experiences guests feel on day one
            </h2>
            <p className="text-sm leading-relaxed text-[var(--blue)]/75 md:text-base" style={{ fontFamily: 'var(--font-body)' }}>
              The XP pillar covers Everyday, WRX, Circles, and frictionless formats — autonomous stores and checkout
              innovation that shorten queues, lift satisfaction, and create premium moments without adding chaos for
              operators.
            </p>
            <ul className="list-inside list-disc space-y-2 text-sm text-[var(--blue)]/80" style={{ fontFamily: 'var(--font-body)' }}>
              <li>Consumer-grade journeys wired to Sodexo operations</li>
              <li>Composable with the rest of the Standard Offer stack — not isolated gadgets</li>
            </ul>
          </div>
          <div
            className="rounded-brand-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-card)] md:p-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--blue)]/55">From deck to demo</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--blue)]/75">
              {embedded
                ? 'Use the story above, then scroll to the grid to shortlist proof points, logos, and geographies for your next client workshop.'
                : 'Use this page as the narrative wrapper; jump into the catalogue to shortlist proof points, logos, and geographies for your next client workshop.'}
            </p>
          </div>
        </div>
      </ParallaxBand>

      {/* Closing CTA */}
      <section className="mx-auto max-w-[960px] px-6 py-16 text-center md:py-20">
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
    </div>
  );
}
