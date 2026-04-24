'use client';

import { CircleNotch, MagnifyingGlass, User, X } from '@phosphor-icons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import type { GlobalSearchResult } from '@/lib/queries/globalSearch';
import { pickJourneyStepVisual } from '@/lib/data/journeyStepVisuals';
import { pickModuleVisual } from '@/lib/data/moduleVisuals';

/** Flat hit used for keyboard navigation through all groups. */
interface FlatHit {
  key: string;
  href: string;
  group: 'solutions' | 'modules' | 'personas' | 'moments';
  primary: string;
  secondary?: string;
}

const EMPTY: GlobalSearchResult = {
  q: '',
  solutions: [],
  modules: [],
  personas: [],
  moments: [],
  total: 0,
};

export function GlobalSearch() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [result, setResult] = useState<GlobalSearchResult>(EMPTY);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  /* ⌘K / Ctrl+K hotkey to focus the search. Escape to close and blur. */
  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setOpen(true);
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Close on outside click. */
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', onClick);
      return () => document.removeEventListener('mousedown', onClick);
    }
  }, [open]);

  /* Debounced fetch */
  useEffect(() => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setResult(EMPTY);
      setLoading(false);
      return;
    }
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`search ${res.status}`);
        const data = (await res.json()) as GlobalSearchResult;
        setResult(data);
        setActiveIdx(0);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          // eslint-disable-next-line no-console -- surface network hiccups in dev
          console.error('[GlobalSearch]', err);
          setResult(EMPTY);
        }
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => clearTimeout(timer);
  }, [q]);

  const flatHits = useMemo<FlatHit[]>(() => {
    const arr: FlatHit[] = [];
    result.solutions.forEach((h) =>
      arr.push({
        key: `sol-${h.id}`,
        href: h.href,
        group: 'solutions',
        primary: h.name,
        secondary: h.module,
      })
    );
    result.modules.forEach((h) =>
      arr.push({
        key: `mod-${h.id}`,
        href: h.href,
        group: 'modules',
        primary: h.name,
        secondary: `${h.solutionCount} solution${h.solutionCount === 1 ? '' : 's'}`,
      })
    );
    result.personas.forEach((h) =>
      arr.push({
        key: `per-${h.id}`,
        href: h.href,
        group: 'personas',
        primary: h.name,
        secondary: `${h.role} · ${h.areaLabel}`,
      })
    );
    result.moments.forEach((h) =>
      arr.push({
        key: `mom-${h.personaId}-${h.id}`,
        href: h.href,
        group: 'moments',
        primary: h.label,
        secondary: `${h.personaName} · ${h.areaLabel}`,
      })
    );
    return arr;
  }, [result]);

  /* Keep the active item visible as arrow keys move the selection. */
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      setQ('');
      router.push(href);
    },
    [router]
  );

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) setOpen(true);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.max(0, flatHits.length - 1)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      const hit = flatHits[activeIdx];
      if (hit) {
        e.preventDefault();
        go(hit.href);
      } else if (q.trim()) {
        e.preventDefault();
        go(`/solutions?q=${encodeURIComponent(q.trim())}`);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showPanel = open && q.trim().length >= 2;
  const noResults =
    showPanel && !loading && flatHits.length === 0 && result.total === 0;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <div className="group relative flex items-center">
        <MagnifyingGlass
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[var(--blue-primary)]"
          aria-hidden
        />
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onInputKey}
          placeholder="Search solutions, modules, personas, moments…"
          aria-label="Search the catalogue"
          aria-expanded={showPanel}
          aria-controls="global-search-results"
          autoComplete="off"
          className="w-full rounded-full border border-[var(--grey-border)] bg-[#f8faff] py-2 pl-9 pr-24 text-sm text-[var(--blue)] outline-none transition-colors focus:border-[var(--blue-primary)] focus:bg-white"
          style={{ fontFamily: 'var(--font-body)' }}
        />
        <div className="pointer-events-none absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
          {loading ? (
            <CircleNotch size={14} className="animate-spin text-[var(--blue-primary)]" aria-hidden />
          ) : null}
          {q ? (
            <button
              type="button"
              onClick={() => {
                setQ('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="pointer-events-auto flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-[var(--blue)]"
            >
              <X size={12} weight="bold" aria-hidden />
            </button>
          ) : (
            <kbd
              className="pointer-events-none hidden items-center gap-0.5 rounded border border-[var(--grey-border)] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 sm:inline-flex"
              aria-hidden
            >
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {showPanel ? (
        <div
          id="global-search-results"
          ref={listRef}
          role="listbox"
          aria-label="Search results"
          className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] shadow-[var(--shadow-popover)] backdrop-blur-xl"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {noResults ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No match for <strong className="text-[var(--blue)]">{q}</strong>. Try fewer letters or different words.
            </div>
          ) : (
            <>
              <ResultGroup title="Solutions" count={result.solutions.length}>
                {result.solutions.map((h) => {
                  const idx = flatHits.findIndex((f) => f.key === `sol-${h.id}`);
                  const { Icon: SolIcon, weight } = pickModuleVisual({
                    id: h.moduleId ?? '',
                    name: h.module,
                  });
                  return (
                    <ResultRow
                      key={h.id}
                      idx={idx}
                      active={idx === activeIdx}
                      glyph={<SolIcon size={16} weight={weight} />}
                      primary={h.name}
                      secondary={h.module}
                      onHover={() => setActiveIdx(idx)}
                      onSelect={() => go(h.href)}
                    />
                  );
                })}
              </ResultGroup>

              <ResultGroup title="Modules" count={result.modules.length}>
                {result.modules.map((h) => {
                  const idx = flatHits.findIndex((f) => f.key === `mod-${h.id}`);
                  const { Icon: ModIcon, weight } = pickModuleVisual({ id: h.id, name: h.name });
                  return (
                    <ResultRow
                      key={h.id}
                      idx={idx}
                      active={idx === activeIdx}
                      glyph={<ModIcon size={16} weight={weight} />}
                      primary={h.name}
                      secondary={`${h.solutionCount} solution${h.solutionCount === 1 ? '' : 's'}`}
                      onHover={() => setActiveIdx(idx)}
                      onSelect={() => go(h.href)}
                    />
                  );
                })}
              </ResultGroup>

              <ResultGroup title="Personas" count={result.personas.length}>
                {result.personas.map((h) => {
                  const idx = flatHits.findIndex((f) => f.key === `per-${h.id}`);
                  return (
                    <ResultRow
                      key={h.id}
                      idx={idx}
                      active={idx === activeIdx}
                      glyph={<User size={16} weight="fill" color={h.color} />}
                      glyphTint={h.color}
                      primary={h.name}
                      secondary={`${h.role} · ${h.areaLabel}`}
                      onHover={() => setActiveIdx(idx)}
                      onSelect={() => go(h.href)}
                    />
                  );
                })}
              </ResultGroup>

              <ResultGroup title="Moments" count={result.moments.length}>
                {result.moments.map((h) => {
                  const idx = flatHits.findIndex(
                    (f) => f.key === `mom-${h.personaId}-${h.id}`
                  );
                  const { Icon: StepIcon, weight } = pickJourneyStepVisual({ id: h.id, label: h.label });
                  return (
                    <ResultRow
                      key={`${h.personaId}-${h.id}`}
                      idx={idx}
                      active={idx === activeIdx}
                      glyph={<StepIcon size={16} weight={weight} />}
                      primary={h.label}
                      secondary={`${h.personaName} · ${h.areaLabel}`}
                      onHover={() => setActiveIdx(idx)}
                      onSelect={() => go(h.href)}
                    />
                  );
                })}
              </ResultGroup>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--grey-border)] bg-[#f8faff] px-4 py-2 text-[11px] text-gray-500">
                <span>
                  <kbd className="rounded border border-[var(--grey-border)] bg-white px-1 py-0.5 font-semibold">↑</kbd>{' '}
                  <kbd className="rounded border border-[var(--grey-border)] bg-white px-1 py-0.5 font-semibold">↓</kbd>{' '}
                  navigate ·{' '}
                  <kbd className="rounded border border-[var(--grey-border)] bg-white px-1 py-0.5 font-semibold">↵</kbd>{' '}
                  open ·{' '}
                  <kbd className="rounded border border-[var(--grey-border)] bg-white px-1 py-0.5 font-semibold">esc</kbd>{' '}
                  close
                </span>
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Link href="/search-guide" className="font-semibold text-[var(--blue)]/80 hover:underline">
                    Search guide
                  </Link>
                  <button
                    type="button"
                    onClick={() => go(`/solutions?q=${encodeURIComponent(q.trim())}`)}
                    className="font-semibold text-[var(--blue-primary)] hover:underline"
                  >
                    See all solutions matching “{q.trim()}”
                  </button>
                </span>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

/* ── Presentational sub-parts ────────────────────────────────────── */

function ResultGroup({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  if (count === 0) return null;
  return (
    <div className="border-b border-[var(--grey-border)] last:border-b-0">
      <div className="flex items-center justify-between px-4 pb-1.5 pt-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          {title}
        </span>
        <span className="text-[10px] text-gray-400">{count}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function ResultRow({
  idx,
  active,
  glyph,
  glyphTint,
  primary,
  secondary,
  onHover,
  onSelect,
}: {
  idx: number;
  active: boolean;
  glyph: ReactNode;
  /** Optional accent hex — softens the icon tile with a 14% alpha wash. */
  glyphTint?: string;
  primary: string;
  secondary?: string;
  onHover: () => void;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      data-idx={idx}
      role="option"
      aria-selected={active}
      onMouseEnter={onHover}
      onClick={onSelect}
      className={
        active
          ? 'flex w-full items-center gap-3 bg-[#f0f4ff] px-4 py-2 text-left transition-colors'
          : 'flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-[#f8faff]'
      }
    >
      <span
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[var(--blue-primary)]"
        style={{ background: glyphTint ? `${glyphTint}22` : 'var(--icon-bg)' }}
        aria-hidden
      >
        {glyph}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-[var(--blue)]">{primary}</span>
        {secondary ? (
          <span className="block truncate text-xs text-gray-500">{secondary}</span>
        ) : null}
      </span>
    </button>
  );
}
