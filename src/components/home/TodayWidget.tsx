'use client';

import { Clock, Compass, MapPin, SunHorizon, UsersThree, type Icon } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { pickJourneyStepVisual } from '@/lib/data/journeyStepVisuals';

export type BucketIconKey = 'morning' | 'midday' | 'afternoon' | 'evening';

const BUCKET_ICONS: Record<BucketIconKey, Icon> = {
  morning: SunHorizon,
  midday: MapPin,
  afternoon: Compass,
  evening: UsersThree,
};

export interface TodayBucket {
  key: BucketIconKey;
  label: string;
  time: string;
  items: {
    /** Moment label, e.g. "Morning rounds". */
    label: string;
    /** Journey step id — drives the Phosphor icon. */
    stepId: string;
    href: string;
    personaName: string;
    areaLabel: string;
  }[];
}

interface Props {
  buckets: TodayBucket[];
}

function resolveBucketIndex(hour: number): number {
  // Buckets are [morning 6–11, midday 11–14, afternoon 14–18, evening 18–22].
  if (hour < 11) return 0;
  if (hour < 14) return 1;
  if (hour < 18) return 2;
  return 3;
}

/**
 * "What's happening around the world right now" — shows the current-time-bucket
 * of moments from across all personas. Purely client-side (uses local time).
 */
export function TodayWidget({ buckets }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const iv = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(iv);
  }, []);

  const activeIdx = now ? resolveBucketIndex(now.getHours()) : 0;
  const active = buckets[activeIdx] ?? buckets[0];
  const ActiveIcon = active ? BUCKET_ICONS[active.key] : null;

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-sm)]">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {ActiveIcon ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--icon-bg)] text-[var(--blue)]">
              <ActiveIcon size={18} weight="duotone" />
            </span>
          ) : null}
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/60"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Happening right now
            </p>
            <h2
              className="text-xl font-extrabold leading-tight text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {active?.label ?? 'Across the day'}
            </h2>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--grey-border)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-semibold text-[var(--blue)]/70"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <Clock size={12} weight="duotone" aria-hidden />
          {active?.time ?? '--'}
        </span>
      </header>

      <p
        className="text-xs leading-relaxed text-[var(--blue)]/70"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        At this hour, these are the moments Sodexo shows up in across the four areas. Tap any to
        jump into that person&apos;s day.
      </p>

      <ul className="grid gap-2">
        {active?.items.map((it) => {
          const { Icon: StepIcon, weight } = pickJourneyStepVisual({ id: it.stepId, label: it.label });
          return (
          <li key={it.href}>
            <Link
              href={it.href}
              className="group flex items-center gap-3 rounded-xl border border-[var(--grey-border)] bg-[var(--surface)] px-3 py-2.5 transition-all hover:-translate-y-0.5 hover:border-[var(--blue-primary)] hover:shadow-[var(--shadow-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
            >
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--icon-bg)] text-[var(--blue-primary)]"
              >
                <StepIcon size={16} weight={weight} />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className="block truncate text-sm font-bold text-[var(--blue)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {it.label}
                </span>
                <span className="block truncate text-[11px] text-[var(--blue)]/60">
                  {it.personaName} · {it.areaLabel}
                </span>
              </span>
              <span className="shrink-0 rounded-full bg-[var(--icon-bg)] px-2 py-0.5 text-[10px] font-bold text-[var(--blue)] transition-colors group-hover:bg-[var(--blue-primary)] group-hover:text-white">
                Enter →
              </span>
            </Link>
          </li>
          );
        })}
      </ul>

      {/* Bucket switcher — subtle */}
      <div className="mt-2 flex gap-1 overflow-x-auto border-t border-[var(--grey-border)] pt-3">
        {buckets.map((b, i) => (
          <span
            key={b.key}
            aria-current={i === activeIdx ? 'true' : undefined}
            className={
              i === activeIdx
                ? 'rounded-full bg-[var(--blue-primary)] px-2.5 py-1 text-[10px] font-bold text-white'
                : 'rounded-full bg-[var(--icon-bg-muted)] px-2.5 py-1 text-[10px] font-semibold text-[var(--blue)]/50'
            }
          >
            {b.time}
          </span>
        ))}
      </div>
    </div>
  );
}
