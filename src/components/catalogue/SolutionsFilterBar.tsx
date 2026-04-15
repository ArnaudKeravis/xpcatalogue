'use client';

import { FunnelSimple, X } from '@phosphor-icons/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import type { Area, SolutionStatus, SolutionType } from '@/lib/data/types';

type AreaOption = { value: Area; label: string };

interface Props {
  modules: string[];
  areaOptions: AreaOption[];
  statuses: SolutionStatus[];
  types: SolutionType[];
  totalCount: number;
  filteredCount: number;
}

/** URL-driven filters (shareable). Preserves `moment` / `momentId` when present. */
export function SolutionsFilterBar({
  modules,
  areaOptions,
  statuses,
  types,
  totalCount,
  filteredCount,
}: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [qInput, setQInput] = useState(sp.get('q') ?? '');

  useEffect(() => {
    setQInput(sp.get('q') ?? '');
  }, [sp]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (sp.get('q')?.trim()) n++;
    if (sp.get('module')) n++;
    if (sp.get('area')) n++;
    if (sp.get('status')) n++;
    if (sp.get('type')) n++;
    return n;
  }, [sp]);

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
      const moment = sp.get('moment');
      const momentId = sp.get('momentId');
      if (moment) next.set('moment', moment);
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

  return (
    <div className="mb-8 rounded-[var(--radius-lg)] border border-[var(--grey-border)] bg-white p-4 shadow-[var(--shadow-sm)]">
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
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

        <div className="flex flex-col justify-end">
          <button
            type="button"
            onClick={clearFilters}
            disabled={activeFilterCount === 0 && !qInput.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--grey-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--blue)] transition-colors hover:bg-[#f8faff] disabled:pointer-events-none disabled:opacity-40"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <X size={18} aria-hidden />
            Clear filters
          </button>
        </div>
      </div>
      {pending ? (
        <p className="mt-3 text-xs text-gray-400" style={{ fontFamily: 'var(--font-body)' }}>
          Updating…
        </p>
      ) : null}
    </div>
  );
}

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
        className="rounded-lg border border-[var(--grey-border)] bg-white px-3 py-2 text-sm font-normal normal-case text-[var(--blue)] outline-none transition-colors focus:border-[var(--blue-primary)]"
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

function useDebounce<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}
