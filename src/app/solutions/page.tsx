import Link from 'next/link';
import { Suspense } from 'react';
import { SolutionsFilterBar } from '@/components/catalogue/SolutionsFilterBar';
import { getCatalogueData } from '@/lib/notion';
import {
  filterSolutions,
  rankedFlags,
  rankedHashtags,
  uniqueModules,
  uniqueStatuses,
  uniqueTypes,
} from '@/lib/queries/filterSolutions';
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

function many(param: string | string[] | undefined): string[] {
  if (!param) return [];
  return Array.isArray(param) ? param.filter(Boolean) : [param];
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
  const catalogue = await getCatalogueData();
  const { solutions, areas, personas, journeySteps } = catalogue;

  const modules = uniqueModules(solutions);
  const statuses = uniqueStatuses(solutions);
  const types = uniqueTypes(solutions);
  const hashtags = rankedHashtags(solutions);
  const flags = rankedFlags(solutions);

  // Build persona + moment option lists from the catalogue graph.
  const personaOptions = personas.map((p) => ({
    value: p.id,
    label: p.name,
    area: p.area,
    areaLabel: areas[p.area].label,
  }));

  const momentOptions = personas.flatMap((p) =>
    p.steps
      .map((sid) => journeySteps[sid])
      .filter((step): step is NonNullable<typeof step> => Boolean(step))
      .map((step) => ({
        value: step.id,
        label: step.label,
        icon: step.icon,
        personaId: p.id,
      }))
  );

  const rawMod = first(searchParams.module)?.trim();
  const mod = rawMod && modules.includes(rawMod) ? rawMod : undefined;
  const q = first(searchParams.q)?.trim();

  const area = parseArea(first(searchParams.area));
  const status = parseStatus(first(searchParams.status), statuses);
  const type = parseType(first(searchParams.type), types);

  const personaId = first(searchParams.persona)?.trim();
  const persona = personaId ? personas.find((p) => p.id === personaId) : undefined;

  const momentId = first(searchParams.moment)?.trim();
  const moment = momentId ? journeySteps[momentId] : undefined;

  // A persona OR a moment narrows the eligible module set. If both are set and
  // the moment belongs to the selected persona, the moment wins (more specific).
  let moduleWhitelist: string[] | undefined;
  if (moment) {
    moduleWhitelist = moment.modules;
  } else if (persona) {
    const modules = persona.steps
      .map((sid) => journeySteps[sid])
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
      .flatMap((s) => s.modules);
    moduleWhitelist = Array.from(new Set(modules));
  }

  const hashtagFilter = many(searchParams.hashtag);
  const flagFilter = many(searchParams.flag);

  const filtered = filterSolutions(solutions, {
    q,
    module: mod,
    modules: moduleWhitelist,
    area,
    status,
    type,
    hashtags: hashtagFilter,
    flags: flagFilter,
  });

  const titleParts: string[] = [];
  if (mod) titleParts.push(mod);
  if (area) titleParts.push(areas[area].label);
  if (status) titleParts.push(status);
  if (type) titleParts.push(type);
  if (persona) titleParts.push(persona.name);
  if (moment) titleParts.push(`${moment.icon} ${moment.label}`);
  if (hashtagFilter.length > 0) titleParts.push(hashtagFilter.join(' · '));
  if (flagFilter.length > 0) titleParts.push(flagFilter.join(' '));
  if (q) titleParts.push(`“${q}”`);
  const title = titleParts.length > 0 ? `Solutions — ${titleParts.join(' · ')}` : 'All solutions';

  const areaOptions = (['work', 'learn', 'heal', 'play'] as const).map((id) => ({
    value: id,
    label: areas[id].label,
  }));

  return (
    <div className="flex flex-1 flex-col bg-[var(--surface)]">
      <div className="px-4 py-6 md:px-8">
        <h1
          className="mb-4 text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-tight text-[var(--blue)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h1>
      </div>
      <div className="flex-1 px-4 pb-10 md:px-8">
        {persona && moment ? (
          <p className="mb-4 text-sm text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
            Filtered to solutions relevant during <strong>{moment.icon} {moment.label}</strong> for <strong>{persona.name}</strong>.
          </p>
        ) : persona ? (
          <p className="mb-4 text-sm text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
            Filtered to solutions that apply to <strong>{persona.name}</strong>&apos;s journey.
          </p>
        ) : null}

        <Suspense fallback={<div className="mb-8 h-40 animate-pulse rounded-[var(--radius-lg)] bg-gray-100" />}>
          <SolutionsFilterBar
            modules={modules}
            areaOptions={areaOptions}
            statuses={statuses}
            types={types}
            personas={personaOptions}
            moments={momentOptions}
            hashtags={hashtags}
            flags={flags}
            totalCount={solutions.length}
            filteredCount={filtered.length}
          />
        </Suspense>

        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>
            No solutions match your filters. Try clearing filters or broadening your search.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => {
              const statusColors: Record<string, { bg: string; text: string }> = {
                Scaled: { bg: '#e8f8ef', text: '#1a7a3c' },
                Scaling: { bg: '#fff4e6', text: '#b35900' },
                Pilot: { bg: '#e8f0ff', text: '#1a3af0' },
                Study: { bg: '#f5f5f5', text: '#666' },
              };
              const sc = statusColors[s.status] ?? statusColors.Study;
              return (
                <li key={s.id}>
                  <Link
                    href={`/solutions/${s.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--grey-border)] bg-white shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* Module colour bar */}
                    <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg,var(--blue),var(--blue-primary))` }} />

                    <div className="flex flex-1 flex-col gap-3 p-4">
                      {/* Header */}
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl"
                          style={{ background: 'var(--icon-bg)' }}
                        >
                          {s.img}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-extrabold leading-tight text-[var(--blue)]">
                            {s.name}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-gray-400">{s.module}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        className="line-clamp-2 flex-1 text-xs leading-relaxed text-gray-500"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {s.description}
                      </p>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                          style={{ background: sc.bg, color: sc.text }}
                        >
                          {s.status}
                        </span>
                        {s.areas.slice(0, 2).map((a) => (
                          <span
                            key={a}
                            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white"
                            style={{ backgroundImage: areas[a].gradient }}
                          >
                            {areas[a].label}
                          </span>
                        ))}
                        {s.areas.length > 2 && (
                          <span className="text-[10px] text-gray-400">+{s.areas.length - 2}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
