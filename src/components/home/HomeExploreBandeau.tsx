import type { ReactNode } from 'react';
import { ArrowRight, Briefcase, MapTrifold } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface ChoiceCardProps {
  index: number;
  href: string;
  external?: boolean;
  variant: 'light' | 'dark';
  icon: ReactNode;
  title: string;
  body: string;
  tag: string;
  cta: string;
}

function ChoiceCard({
  index,
  href,
  external,
  variant,
  icon,
  title,
  body,
  tag,
  cta,
}: ChoiceCardProps) {
  const isDark = variant === 'dark';
  const className = cn(
    'group relative flex min-h-0 flex-col rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-panel)] transition-[transform,box-shadow] duration-[var(--motion-base)] ease-[var(--ease-hover)] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    isDark
      ? 'bg-[var(--blue)] text-white focus-visible:outline-white'
      : 'border border-[var(--grey-border)] bg-white text-[var(--blue)] focus-visible:outline-[var(--blue-primary)]',
  );

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold',
            isDark ? 'bg-white/15 text-white' : 'bg-[var(--icon-bg)] text-[var(--blue)]',
          )}
          aria-hidden
        >
          {index}
        </span>
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)]',
            isDark ? 'bg-white/10 text-white' : 'bg-[var(--icon-bg)] text-[var(--blue-primary)]',
          )}
          aria-hidden
        >
          {icon}
        </span>
      </div>
      <h2
        className="mt-4 text-lg font-extrabold leading-snug md:text-xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {title}
      </h2>
      <p
        className={cn(
          'mt-2 text-sm leading-relaxed',
          isDark ? 'text-white/85' : 'text-[var(--grey-subtle)]',
        )}
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {body}
      </p>
      <p
        className={cn(
          'mt-3 text-[10px] font-bold uppercase tracking-[0.16em]',
          isDark ? 'text-[var(--teal)]' : 'text-[var(--blue-primary)]',
        )}
      >
        {tag}
      </p>
      <span
        className={cn(
          'mt-4 inline-flex items-center gap-1.5 text-sm font-bold transition-transform duration-[var(--motion-base)] group-hover:translate-x-0.5',
          isDark ? 'text-white' : 'text-[var(--blue)]',
        )}
      >
        {cta}
        <ArrowRight size={16} weight="bold" aria-hidden />
      </span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

/** Compact two-path bandeau — Spark (business) vs XP catalogue (experience). */
export function HomeExploreBandeau({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'motion-fade-up grid gap-3 sm:grid-cols-2',
        className,
      )}
      style={{ animationDelay: '200ms' }}
      aria-label="Two ways to explore the portfolio"
    >
      <ChoiceCard
        index={1}
        href="/standard-offer"
        variant="light"
        icon={<Briefcase size={20} weight="duotone" />}
        title="Start from business objectives"
        body="Explore Spark Offer — packaged digital & AI capabilities mapped to client and business goals."
        tag="Spark Offer · Business first"
        cta="Browse Spark Offer"
      />
      <ChoiceCard
        index={2}
        href="/#explore"
        variant="dark"
        icon={<MapTrifold size={20} weight="duotone" />}
        title="Start from the experience (XP)"
        body="Browse the experience catalogue — places, personas, moments and 90+ solutions in one human-centred view."
        tag="XP catalogue · Experience first"
        cta="Explore the catalogue"
      />
    </div>
  );
}
