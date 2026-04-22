'use client';

import { CaretDown, FunnelSimple, Rocket, Trophy, X } from '@phosphor-icons/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { COLLECTION_META, COLLECTION_KEYS } from '@/lib/data/collections';
import type { Area, SolutionCollection, SolutionStatus, SolutionType } from '@/lib/data/types';

type AreaOption = { value: Area; label: string };
type PersonaOption = { value: string; label: string; area: Area; areaLabel: string };
type MomentOption = { value: string; label: string; icon: string; personaId: string };

interface Props {
  modules: string[];
  areaOptions: AreaOption[];
  statuses: SolutionStatus[];
  types: SolutionType[];
  personas: PersonaOption[];
  moments: MomentOption[];
  hashtags: { tag: string; count: number }[];
  flags: { flag: string; count: number }[];
  totalCount: number;
  filteredCount: number;
}

const MULTI_KEYS = ['hashtag', 'flag', 'collection'] as const;
const HASHTAG_COLLAPSED_COUNT = 14;

/**
 * URL-driven filter bar for /solutions.
 *
 * All state lives in `?q=&module=&area=&status=&type=&persona=&moment=&hashtag=A&hashtag=B&flag=🇫🇷`
 * so every filtered view is shareable. Multi-value filters (hashtag / flag) use repeated params.
 *
 * Preserves `moment` / `momentId` passthrough params that might arrive from the moment page.
 */
export function SolutionsFilterBar({
  modules,
  areaOptions,
  statuses,
  types,
  personas,
  moments,
  hashtags,
  flags,
  totalCount,
  filteredCount,
}: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [qInput, setQInput] = useState(sp.get('q') ?? '');
  const [showAllHashtags, setShowAllHashtags] = useState(false);

  useEffect(() => {
    setQInput(sp.get('q') ?? '');
  }, [sp]);

  const selectedHashtags = useMemo(() => sp.getAll('hashtag'), [sp]);
  const selectedFlags = useMemo(() => sp.getAll('flag'), [sp]);
  const selectedCollections = useMemo(
    () => sp.getAll('collection').filter((v): v is SolutionCollection => COLLECTION_KEYS.includes(v as SolutionCollection)),
    [sp]
  );
  const selectedPersona = sp.get('persona') ?? '';

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (sp.get('q')?.trim()) n++;
    if (sp.get('module')) n++;
    if (sp.get('area')) n++;
    if (sp.get('status')) n++;
    if (sp.get('type')) n++;
    if (sp.get('persona')) n++;
    if (sp.get('moment')) n++;
    n += selectedHashtags.length;
    n += selectedFlags.length;
    n += selectedCollections.length;
    return n;
  }, [sp, selectedHashtags.length, selectedFlags.length, selectedCollections.length]);

  const pushParams = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const next = new URLSearchParams(sp.toString());
      mutate(next);
      const qs = next.toString();
      startTransition(() => router.push(qs ? `/solutions?${qs}` : '/solutions'));
    },
    [router, sp]
  );

  const clearFilters = () => {
    setQInput('');
    startTransition(() => {
      const next = new URLSearchParams();
      const momentId = sp.get('momentId');
      if (momentId) next.set('momentId', momentId);
      const qs = next.toString();
      router.push(qs ? `/solutions?${qs}` : '/solutions');
    });
  };

  const debouncedQ = useDebounce(qInput, 350);
  useEffect(() => {
    const current = sp.get('q') ?? '';
    if (debouncedQ.trim() === current.trim()) return;
    pushParams((p) => {
      if (debouncedQ.trim()) p.set('q', debouncedQ.trim());
      else p.delete('q');
    });
  }, [debouncedQ, pushParams, sp]);

  const toggleMulti = (key: (typeof MULTI_KEYS)[number], value: string) => {
    pushParams((p) => {
      const current = p.getAll(key);
      p.delete(key);
      if (current.includes(value)) {
        current.filter((v) => v !== value).forEach((v) => p.append(key, v));
      } else {
        [...current, value].forEach((v) => p.append(key, v));
      }
    });
  };

  const personaOptions = useMemo(() => {
    const byArea = new Map<string, PersonaOption[]>();
    for (const p of personas) {
      const arr = byArea.get(p.areaLabel) ?? [];
      arr.push(p);
      byArea.set(p.areaLabel, arr);
    }
    return Array.from(byArea.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [personas]);

  const availableMoments = useMemo(() => {
    if (!selectedPersona) return moments;
    return moments.filter((m) => m.personaId === selectedPersona);
  }, [moments, selectedPersona]);

  const visibleHashtags = showAllHashtags ? hashtags : hashtags.slice(0, HASHTAG_COLLAPSED_COUNT);

  return (
    <div className="mb-8 rounded-[var(--radius-lg)] border border-[var(--grey-border)] bg-white p-4 shadow-[var(--shadow-sm)]">
      {/* Header row — title + result count */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[var(--blue)]">
          <FunnelSimple size={22} weight="duotone" aria-hidden />
          <span className="font-bold" style={{ fontFamily: 'var(--font-body)' }}>
            Filter solutions
          </span>
          {activeFilterCount > 0 ? (
            <span className="rounded-full bg-[#f0f4ff] px-2 py-0.5 text-xs font-semibold text-[var(--blue-primary)]">
              {activeFilterCount} active
            </span>
          ) : null}
        </div>
        <div className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong>
        </div>
      </div>

      {/* Row 0: curated collections — high-signal shortcuts to scaled / AI-P&L shortlists */}
      <div
        className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-[var(--grey-border)] bg-[var(--icon-bg-muted)] px-3 py-2.5"
        role="group"
        aria-label="Curated collections"
      >
        <span
          className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--blue)]/70"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Curated
        </span>
        {COLLECTION_KEYS.map((key) => {
          const meta = COLLECTION_META[key];
          const active = selectedCollections.includes(key);
          const Icon = key === 'blockbuster' ? Rocket : Trophy;
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleMulti('collection', key)}
              aria-pressed={active}
              title={meta.tagline}
              className={
                active
                  ? 'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-[var(--shadow-sm)] transition-transform hover:scale-[1.02]'
                  : 'inline-flex items-center gap-1.5 rounded-full border border-[var(--grey-border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--blue)] transition-colors hover:bg-[var(--icon-bg)]'
              }
              style={{
                fontFamily: 'var(--font-body)',
                ...(active ? { backgroundImage: meta.gradient } : {}),
              }}
            >
              <Icon size={13} weight={active ? 'fill' : 'regular'} aria-hidden />
              {meta.label}
            </button>
          );
        })}
        {selectedCollections.length > 0 ? (
          <span
            className="ml-auto text-[11px] text-[var(--blue)]/60"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {selectedCollections.length === 1
              ? COLLECTION_META[selectedCollections[0]].tagline
              : `${selectedCollections.length} collections active`}
          </span>
        ) : null}
      </div>

      {/* Row A: free-text search + clear */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Search
          <input
            type="search"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder="Name, module, keywords…"
            className="rounded-lg border border-[var(--grey-border)] bg-[#f8faff] px-3 py-2 text-sm font-normal normal-case text-[var(--blue)] outline-none transition-colors focus:border-[var(--blue-primary)]"
            style={{ fontFamily: 'var(--font-body)' }}
            autoComplete="off"
          />
        </label>
        <button
          type="button"
          onClick={clearFilters}
          disabled={activeFilterCount === 0 && !qInput.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--grey-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--blue)] transition-colors hover:bg-[#f8faff] disabled:pointer-events-none disabled:opacity-40 sm:self-end"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <X size={18} aria-hidden />
          Clear filters
        </button>
      </div>

      {/* Row B: scope selects */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <FilterSelect
          label="Module"
          value={sp.get('module') ?? ''}
          options={[{ value: '', label: 'All modules' }, ...modules.map((m) => ({ value: m, label: m }))]}
          onChange={(v) =>
            pushParams((p) => {
              if (v) p.set('module', v);
              else p.delete('module');
            })
          }
          disabled={pending}
        />
        <FilterSelect
          label="Area"
          value={sp.get('area') ?? ''}
          options={[{ value: '', label: 'All areas' }, ...areaOptions.map((a) => ({ value: a.value, label: a.label }))]}
          onChange={(v) =>
            pushParams((p) => {
              if (v) p.set('area', v);
              else p.delete('area');
            })
          }
          disabled={pending}
        />
        <FilterSelect
          label="Status"
          value={sp.get('status') ?? ''}
          options={[{ value: '', label: 'All statuses' }, ...statuses.map((s) => ({ value: s, label: s }))]}
          onChange={(v) =>
            pushParams((p) => {
              if (v) p.set('status', v);
              else p.delete('status');
            })
          }
          disabled={pending}
        />
        <FilterSelect
          label="Type"
          value={sp.get('type') ?? ''}
          options={[{ value: '', label: 'All types' }, ...types.map((t) => ({ value: t, label: t }))]}
          onChange={(v) =>
            pushParams((p) => {
              if (v) p.set('type', v);
              else p.delete('type');
            })
          }
          disabled={pending}
        />
        <FilterSelectGrouped
          label="Persona"
          value={selectedPersona}
          groups={[
            { label: 'All personas', options: [{ value: '', label: 'All personas' }] },
            ...personaOptions.map(([group, opts]) => ({
              label: group,
              options: opts.map((p) => ({ value: p.value, label: p.label })),
            })),
          ]}
          onChange={(v) =>
            pushParams((p) => {
              if (v) p.set('persona', v);
              else p.delete('persona');
              // A persona change invalidates a previously-selected moment that doesn't belong to them.
              const mom = p.get('moment');
              if (mom && !moments.some((m) => m.value === mom && m.personaId === v)) {
                p.delete('moment');
              }
            })
          }
          disabled={pending}
        />
        <FilterSelect
          label={selectedPersona ? 'Moment (persona day)' : 'Moment of day'}
          value={sp.get('moment') ?? ''}
          options={[
            { value: '', label: selectedPersona ? 'All moments' : 'All moments (any persona)' },
            ...availableMoments.map((m) => ({
              value: m.value,
              label: `${m.icon} ${m.label}`,
            })),
          ]}
          onChange={(v) =>
            pushParams((p) => {
              if (v) p.set('moment', v);
              else p.delete('moment');
            })
          }
          disabled={pending || availableMoments.length === 0}
        />
      </div>

      {/* Row C: hashtag chips (top-N with expand) */}
      {hashtags.length > 0 ? (
        <ChipGroup
          label="Hashtags"
          suffix={
            hashtags.length > HASHTAG_COLLAPSED_COUNT ? (
              <button
                type="button"
                onClick={() => setShowAllHashtags((v) => !v)}
                className="ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold text-[var(--blue-primary)] transition-colors hover:bg-[#f0f4ff]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {showAllHashtags ? 'Show fewer' : `Show all ${hashtags.length}`}
                <CaretDown size={12} weight="bold" className={showAllHashtags ? 'rotate-180' : ''} aria-hidden />
              </button>
            ) : null
          }
        >
          {visibleHashtags.map(({ tag, count }) => {
            const active = selectedHashtags.includes(tag);
            return (
              <Chip
                key={tag}
                active={active}
                onClick={() => toggleMulti('hashtag', tag)}
                disabled={pending}
                title={`${count} solution${count === 1 ? '' : 's'}`}
              >
                {tag}
                <span className="ml-1 text-[10px] opacity-60">{count}</span>
              </Chip>
            );
          })}
        </ChipGroup>
      ) : null}

      {/* Row D: country chips (flags) */}
      {flags.length > 0 ? (
        <ChipGroup label="Countries">
          {flags.map(({ flag, count }) => {
            const active = selectedFlags.includes(flag);
            return (
              <Chip
                key={flag}
                active={active}
                onClick={() => toggleMulti('flag', flag)}
                disabled={pending}
                title={`${count} solution${count === 1 ? '' : 's'}`}
              >
                <span className="text-base leading-none">{flag}</span>
                <span className="ml-1 text-[10px] opacity-60">{count}</span>
              </Chip>
            );
          })}
        </ChipGroup>
      ) : null}

      {pending ? (
        <p className="mt-3 text-xs text-gray-400" style={{ fontFamily: 'var(--font-body)' }}>
          Updating…
        </p>
      ) : null}
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────── */

function FilterSelect({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="rounded-lg border border-[var(--grey-border)] bg-white px-3 py-2 text-sm font-normal normal-case text-[var(--blue)] outline-none transition-colors focus:border-[var(--blue-primary)] disabled:cursor-not-allowed disabled:opacity-50"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {options.map((o, i) => (
          <option key={`${label}-${i}-${o.value}`} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilterSelectGrouped({
  label,
  value,
  groups,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  groups: { label: string; options: { value: string; label: string }[] }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="rounded-lg border border-[var(--grey-border)] bg-white px-3 py-2 text-sm font-normal normal-case text-[var(--blue)] outline-none transition-colors focus:border-[var(--blue-primary)] disabled:cursor-not-allowed disabled:opacity-50"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {groups.map((g, gi) =>
          g.options.length === 1 && g.options[0].value === '' ? (
            <option key={`g-${gi}`} value="">
              {g.options[0].label}
            </option>
          ) : (
            <optgroup key={`g-${gi}`} label={g.label}>
              {g.options.map((o, i) => (
                <option key={`${g.label}-${i}-${o.value}`} value={o.value}>
                  {o.label}
                </option>
              ))}
            </optgroup>
          )
        )}
      </select>
    </label>
  );
}

function ChipGroup({
  label,
  suffix,
  children,
}: {
  label: string;
  suffix?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1.5 flex items-center">
        <span
          className="text-[11px] font-semibold uppercase tracking-wide text-gray-500"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {label}
        </span>
        {suffix}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  disabled,
  children,
  title,
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      title={title}
      className={
        active
          ? 'inline-flex items-center rounded-full bg-[var(--blue-primary)] px-3 py-1 text-xs font-semibold text-white shadow-sm transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)] disabled:opacity-50'
          : 'inline-flex items-center rounded-full border border-[var(--grey-border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--blue)] transition-colors hover:border-[var(--blue-primary)] hover:bg-[#f8faff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)] disabled:opacity-50'
      }
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {children}
    </button>
  );
}

function useDebounce<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}
