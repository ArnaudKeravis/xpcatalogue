import Link from 'next/link';
import { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SolutionsFilterBar } from '@/components/catalogue/SolutionsFilterBar';
import { getCatalogueData } from '@/lib/notion';
import {
  filterSolutions,
  uniqueModules,
  uniqueStatuses,
  uniqueTypes,
} from '@/lib/catalogue/filterSolutions';
import type { Area, SolutionStatus, SolutionType } from '@/lib/data/types';

export const revalidate = 3600;

const AREA_KEYS = new Set<Area>(['work', 'learn', 'heal', 'play']);

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

function first(param: string | string[] | undefined): string | undefined {
  if (Array.isArray(param)) return param[0];
  return param;
}

function parseArea(raw: string | undefined): Area | undefined {
  if (!raw || !AREA_KEYS.has(raw as Area)) return undefined;
  return raw as Area;
}

function parseStatus(raw: string | undefined, allowed: SolutionStatus[]): SolutionStatus | undefined {
  if (!raw) return undefined;
  return allowed.includes(raw as SolutionStatus) ? (raw as SolutionStatus) : undefined;
}

function parseType(raw: string | undefined, allowed: SolutionType[]): SolutionType | undefined {
  if (!raw) return undefined;
  return allowed.includes(raw as SolutionType) ? (raw as SolutionType) : undefined;
}

export default async function SolutionsPage({ searchParams }: Props) {
  const { solutions, areas } = await getCatalogueData();
  const modules = uniqueModules(solutions);
  const statuses = uniqueStatuses(solutions);
  const types = uniqueTypes(solutions);

  const rawMod = first(searchParams.module)?.trim();
  const mod = rawMod && modules.includes(rawMod) ? rawMod : undefined;
  const q = first(searchParams.q)?.trim();
  const momentLabel = first(searchParams.moment)?.trim();

  const area = parseArea(first(searchParams.area));
  const status = parseStatus(first(searchParams.status), statuses);
  const type = parseType(first(searchParams.type), types);

  const filtered = filterSolutions(solutions, {
    q,
    module: mod,
    area,
    status,
    type,
  });

  const titleParts: string[] = [];
  if (mod) titleParts.push(mod);
  if (area) titleParts.push(areas[area].label);
  if (status) titleParts.push(status);
  if (type) titleParts.push(type);
  if (q) titleParts.push(`“${q}”`);
  const title =
    titleParts.length > 0
      ? momentLabel
        ? `Solutions — ${titleParts.join(' · ')} · ${momentLabel}`
        : `Solutions — ${titleParts.join(' · ')}`
      : momentLabel
        ? `Solutions · ${momentLabel}`
        : 'All solutions';

  const areaOptions = (['work', 'learn', 'heal', 'play'] as const).map((id) => ({
    value: id,
    label: areas[id].label,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)]">
      <Navbar title={title} backHref="/areas" />

      <main className="flex-1 overflow-y-auto px-8 py-6">
        {mod && momentLabel ? (
          <p className="mb-4 text-sm text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
            Filtered by module <strong>{mod}</strong> in the context of moment <strong>{momentLabel}</strong>.
          </p>
        ) : null}

        <Suspense fallback={<div className="mb-8 h-40 animate-pulse rounded-[var(--radius-lg)] bg-gray-100" />}>
          <SolutionsFilterBar
            modules={modules}
            areaOptions={areaOptions}
            statuses={statuses}
            types={types}
            totalCount={solutions.length}
            filteredCount={filtered.length}
          />
        </Suspense>

        {filtered.length === 0 ? (
          <p className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
            No solutions match your filters. Try clearing filters or broadening your search.
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {filtered.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/solutions/${s.id}`}
                  className="flex flex-col gap-2 rounded-[var(--radius-lg)] border border-[var(--grey-border)] bg-white p-4 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-wrap items-start gap-2">
                    <span className="text-2xl leading-none">{s.img}</span>
                    <div className="min-w-0 flex-1">
                      <span className="font-extrabold text-[var(--blue)]">{s.name}</span>
                      <span className="ml-2 text-sm text-gray-500">{s.module}</span>
                    </div>
                  </div>
                  <p
                    className="line-clamp-2 text-sm text-gray-600"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {s.context}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-[#f0f4ff] px-2 py-0.5 text-xs font-semibold text-[var(--blue-primary)]">
                      {s.status}
                    </span>
                    <span className="rounded-md border border-[var(--grey-border)] px-2 py-0.5 text-xs text-gray-600">
                      {s.type}
                    </span>
                    {s.areas.map((a) => (
                      <span
                        key={a}
                        className="rounded-md px-2 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundImage: areas[a].gradient }}
                      >
                        {areas[a].label}
                      </span>
                    ))}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
