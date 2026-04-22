'use client';

import { Compass, UserCircle, Wrench } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';

/**
 * Three-step anchor rail for the persona page. On wide screens it sits sticky
 * at the side; on narrower viewports it collapses to a horizontal sticky chip
 * row just below the header so it never crowds the portrait.
 *
 * Active state is driven by an IntersectionObserver keyed on the section id.
 * We deliberately *don't* bind to the URL hash so a scroll doesn't rewrite the
 * browser history — clicks still set the hash for deep-linking.
 */
interface StepDef {
  id: string;
  number: string;
  eyebrow: string;
  label: string;
  Icon: typeof UserCircle;
}

const STEPS: StepDef[] = [
  {
    id: 'who',
    number: '01',
    eyebrow: 'Persona',
    label: 'Who am I',
    Icon: UserCircle,
  },
  {
    id: 'journey',
    number: '02',
    eyebrow: 'Journey',
    label: 'What I do',
    Icon: Compass,
  },
  {
    id: 'modules',
    number: '03',
    eyebrow: 'Modules',
    label: 'How Sodexo can help',
    Icon: Wrench,
  },
];

interface Props {
  accentColor: string;
}

export function PersonaSideNav({ accentColor }: Props) {
  const [activeId, setActiveId] = useState<string>('who');
  const lastScrolledRef = useRef<string | null>(null);

  useEffect(() => {
    // Observe each section; mark whichever one is mostly in the viewport.
    const elements = STEPS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry closest to the top of the viewport that is visible.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Trigger as a section crosses the upper third of the viewport — feels
        // natural when a user scrolls, while still reacting predictably to
        // anchor jumps.
        rootMargin: '-30% 0px -55% 0px',
        threshold: 0,
      },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => (ev: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(id);
    if (!el) return;
    ev.preventDefault();
    lastScrolledRef.current = id;
    setActiveId(id);
    // Scroll with an offset so the section heading clears the sticky header.
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top - 88;
    window.scrollTo({ top: scrollTop, behavior: 'smooth' });
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <>
      {/* ── Desktop sticky rail ─────────────────────────────────────────── */}
      <nav
        aria-label="Persona page sections"
        className="hidden lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-1.5 lg:self-start lg:pr-2"
      >
        {STEPS.map(({ id, number, eyebrow, label, Icon }) => {
          const isActive = activeId === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={handleClick(id)}
              aria-current={isActive ? 'true' : undefined}
              className={
                isActive
                  ? 'group relative flex items-start gap-3 overflow-hidden rounded-brand-lg border border-transparent bg-white px-3 py-3.5 shadow-[var(--shadow-sm)]'
                  : 'group relative flex items-start gap-3 overflow-hidden rounded-brand-lg border border-transparent px-3 py-3.5 hover:bg-white/60'
              }
            >
              <span
                aria-hidden
                className={
                  isActive
                    ? 'absolute left-0 top-0 h-full w-1 rounded-r-full'
                    : 'absolute left-0 top-0 h-full w-1 rounded-r-full opacity-0 transition-opacity group-hover:opacity-60'
                }
                style={{ background: accentColor }}
              />
              <span
                className={
                  isActive
                    ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-brand-md text-white'
                    : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-brand-md bg-[var(--icon-bg)] text-[var(--blue)] transition-colors group-hover:bg-white'
                }
                style={isActive ? { background: accentColor } : undefined}
              >
                <Icon size={18} weight={isActive ? 'fill' : 'regular'} aria-hidden />
              </span>
              <span className="flex flex-col leading-tight">
                <span
                  className={
                    isActive
                      ? 'text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--blue)]/80'
                      : 'text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--blue)]/45 transition-colors group-hover:text-[var(--blue)]/70'
                  }
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {number} · {eyebrow}
                </span>
                <span
                  className={
                    isActive
                      ? 'mt-1 text-[15px] font-extrabold text-[var(--blue)]'
                      : 'mt-1 text-[15px] font-bold text-[var(--blue)]/70 transition-colors group-hover:text-[var(--blue)]'
                  }
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {label}
                </span>
              </span>
            </a>
          );
        })}
      </nav>

      {/* ── Mobile / tablet horizontal chip row ─────────────────────────── */}
      <nav
        aria-label="Persona page sections (mobile)"
        className="sticky top-14 z-20 -mx-4 flex gap-2 overflow-x-auto border-b border-[var(--grey-border)] bg-[var(--surface)]/95 px-4 py-2 backdrop-blur md:-mx-10 md:px-10 lg:hidden"
        style={{ scrollbarWidth: 'thin' }}
      >
        {STEPS.map(({ id, number, label, Icon }) => {
          const isActive = activeId === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={handleClick(id)}
              aria-current={isActive ? 'true' : undefined}
              className={
                isActive
                  ? 'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white'
                  : 'inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[var(--blue)]/80 ring-1 ring-[var(--grey-border)]'
              }
              style={isActive ? { background: accentColor } : undefined}
            >
              <Icon size={13} weight={isActive ? 'fill' : 'regular'} aria-hidden />
              <span
                className={
                  isActive
                    ? 'text-[9px] font-bold uppercase tracking-[0.18em] text-white/80'
                    : 'text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/50'
                }
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {number}
              </span>
              {label}
            </a>
          );
        })}
      </nav>
    </>
  );
}
