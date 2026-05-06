import Link from 'next/link';
import { pickModuleVisual } from '@/lib/data/moduleVisuals';
import type { Module } from '@/lib/data/types';

interface MomentLink {
  href: string;
  label: string;
}

interface Props {
  module: Module;
  href: string;
  compact?: boolean;
  /** Journey moments that use this module — shown as small links under the title (persona page). */
  momentLinks?: MomentLink[];
}

export function ModuleCard({ module, href, compact, momentLinks }: Props) {
  const { Icon, weight } = pickModuleVisual(module);
  if (compact) {
    return (
      <div
        className="overflow-hidden rounded-2xl border-2 border-[var(--grey-border)] bg-white text-center transition-all hover:-translate-y-0.5 hover:border-[var(--blue-primary)]"
        style={{ boxShadow: 'var(--shadow-sm)' }}
      >
        <Link href={href} className="block p-3">
          <div className="mb-1 flex items-center justify-center">
            <Icon size={24} weight={weight} color="var(--blue)" aria-hidden />
          </div>
          <div
            className="text-[11px] font-bold leading-tight text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {module.name}
          </div>
        </Link>
        {momentLinks && momentLinks.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-1 border-t border-[var(--grey-border)] bg-[#f8faff] px-2 py-2">
            {momentLinks.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="rounded-full bg-white px-2 py-0.5 text-[9px] font-semibold text-[var(--blue-solid)] shadow-sm ring-1 ring-[var(--grey-border)] hover:ring-[var(--blue-primary)]"
              >
                {m.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
  return (
    <Link
      href={href}
      className="block cursor-pointer overflow-hidden rounded-[18px] bg-white transition-all hover:-translate-y-1"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div
        className="relative flex h-24 items-center justify-center overflow-hidden"
        style={{ background: module.gradient }}
        aria-hidden
      >
        {module.coverImage ? (
          <>
            <img
              src={module.coverImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%)',
              }}
            />
            <Icon size={44} weight={weight} color="#ffffff" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.35))' }} />
          </>
        ) : (
          <>
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(120% 90% at 20% 10%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 60%)',
              }}
            />
            <Icon size={44} weight={weight} color="#ffffff" />
          </>
        )}
      </div>
      <div className="p-3">
        <div className="mb-1 text-base font-bold text-[var(--blue)]">{module.name}</div>
        <p className="mb-2 text-xs leading-tight text-gray-500">{module.description}</p>
        <span className="inline-block rounded-full bg-[rgba(137,160,240,.2)] px-3 py-1 text-xs font-bold text-[var(--blue-solid)]">
          View solutions →
        </span>
      </div>
    </Link>
  );
}
