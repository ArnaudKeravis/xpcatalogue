import Link from 'next/link';
import { Suspense } from 'react';
import { SolutionsFilterBar } from '@/components/catalogue/SolutionsFilterBar';
import { CountryFlagTags } from '@/components/catalogue/CountryFlagTags';
import { COLLECTION_META } from '@/lib/data/collections';
import {
  filterSolutions,
  rankedFlags,
  rankedHashtags,
  uniqueStatuses,
  uniqueTypes,
} from '@/lib/queries/filterSolutions';
import { pickModuleVisual } from '@/lib/data/moduleVisuals';
import type { Area, CatalogueData, SolutionCollection, SolutionStatus, SolutionType } from '@/lib/data/types';
import { cn } from '@/lib/utils/cn';

const AREA_KEYS = new Set<Area>(['work', 'learn', 'heal', 'play']);
const LOCKED_COLLECTION: SolutionCollection = 'standard-offer';
const BASE_PATH = '/standard-offer';

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

interface SparkSolutionsCatalogueProps {
  catalogue: CatalogueData;
  searchParams: Record<string, string | string[] | undefined>;
}

export function SparkSolutionsCatalogue({ catalogue, searchParams }: SparkSolutionsCatalogueProps) {
  const { solutions: allSolutions, areas, personas, journeySteps, modules: modulesByName } = catalogue;

  const sparkPool = allSolutions.filter((s) => (s.collections ?? []).includes(LOCKED_COLLECTION));

  const modules = Array.from(
    new Set(sparkPool.map((s) => s.module)),
  ).sort((a, b) => a.localeCompare(b));

  const statuses = uniqueStatuses(sparkPool);
  const types = uniqueTypes(sparkPool);
  const hashtags = rankedHashtags(sparkPool);
  const flags = rankedFlags(sparkPool);

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
      })),
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

  let moduleWhitelist: string[] | undefined;
  if (moment) {
    moduleWhitelist = moment.modules;
  } else if (persona) {
    const personaModules = persona.steps
      .map((sid) => journeySteps[sid])
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
      .flatMap((s) => s.modules);
    moduleWhitelist = Array.from(new Set(personaModules));
  }

  const hashtagFilter = many(searchParams.hashtag);
  const flagFilter = many(searchParams.flag);

  const filtered = filterSolutions(
    sparkPool,
    {
      q,
      module: mod,
      modules: moduleWhitelist,
      area,
      status,
      type,
      hashtags: hashtagFilter,
      flags: flagFilter,
      collections: [LOCKED_COLLECTION],
    },
    modulesByName,
  );

  const areaOptions = (['work', 'learn', 'heal', 'play'] as const).map((id) => ({
    value: id,
    label: areas[id].label,
  }));

  const meta = COLLECTION_META[LOCKED_COLLECTION];

  return (
    <section
      id="spark-solutions"
      className={cn('scroll-mt-28 px-4 pb-10 md:px-8', 'bg-[var(--surface)]')}
    >
      <div className="mx-auto max-w-[1600px] pt-8">
        <div className="mb-6">
          <span
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--blue)]/60"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <span aria-hidden className="h-px w-8 bg-[var(--teal)]" />
            {meta.label}
          </span>
          <h2
            className="mt-2 text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-tight text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {meta.label} solutions
          </h2>
          <p
            className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--blue)]/70 md:text-base"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {meta.description} Filter by module, area, persona or country to shortlist proof points for
            your next pitch.
          </p>
        </div>

        {persona && moment ? (
          <p className="mb-4 text-sm text-[var(--blue)]/70" style={{ fontFamily: 'var(--font-body)' }}>
            Filtered to solutions relevant during <strong>{moment.label}</strong> for{' '}
            <strong>{persona.name}</strong>.
          </p>
        ) : persona ? (
          <p className="mb-4 text-sm text-[var(--blue)]/70" style={{ fontFamily: 'var(--font-body)' }}>
            Filtered to solutions that apply to <strong>{persona.name}</strong>&apos;s journey.
          </p>
        ) : null}

        <Suspense fallback={<div className="mb-8 h-40 animate-pulse rounded-[var(--radius-lg)] bg-gray-100" />}>
          <SolutionsFilterBar
            basePath={BASE_PATH}
            lockedCollections={[LOCKED_COLLECTION]}
            modules={modules}
            areaOptions={areaOptions}
            statuses={statuses}
            types={types}
            personas={personaOptions}
            moments={momentOptions}
            hashtags={hashtags}
            flags={flags}
            totalCount={sparkPool.length}
            filteredCount={filtered.length}
          />
        </Suspense>

        {filtered.length === 0 ? (
          <p className="text-sm text-[var(--blue)]/60" style={{ fontFamily: 'var(--font-body)' }}>
            No Spark solutions match your filters. Try clearing filters or broadening your search.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <SolutionGridCard key={s.id} solution={s} areas={areas} modulesByName={modulesByName} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function SolutionGridCard({
  solution: s,
  areas,
  modulesByName,
}: {
  solution: SparkSolutionsCatalogueProps['catalogue']['solutions'][number];
  areas: SparkSolutionsCatalogueProps['catalogue']['areas'];
  modulesByName: SparkSolutionsCatalogueProps['catalogue']['modules'];
}) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    Scaled: { bg: '#e8f8ef', text: '#1a7a3c' },
    Scaling: { bg: '#fff4e6', text: '#b35900' },
    Pilot: { bg: '#e8f0ff', text: '#1a3af0' },
    Study: { bg: '#f5f5f5', text: '#666' },
  };
  const sc = statusColors[s.status] ?? statusColors.Study;
  const solMod = modulesByName[s.module];
  const { Icon: SolIcon, weight: solIconWeight } = pickModuleVisual(solMod);

  return (
    <li>
      <Link
        href={`/solutions/${s.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--grey-border)] bg-white shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div
          className="h-1.5 w-full"
          style={{
            background: solMod?.gradient ?? 'linear-gradient(90deg,var(--blue),var(--blue-primary))',
          }}
        />
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'var(--icon-bg)' }}
              aria-hidden
            >
              <SolIcon size={20} weight={solIconWeight} color="var(--blue)" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold leading-tight text-[var(--blue)]">{s.name}</p>
              <p className="mt-0.5 truncate text-xs text-gray-400">{s.module}</p>
            </div>
          </div>
          <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>
            {s.description}
          </p>
          <CountryFlagTags solution={s} size="sm" showLabel={false} linkable />
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white"
              style={{ backgroundImage: COLLECTION_META['standard-offer'].gradient }}
            >
              {COLLECTION_META['standard-offer'].shortLabel}
            </span>
            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ background: sc.bg, color: sc.text }}>
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
            {s.areas.length > 2 ? (
              <span className="text-[10px] text-gray-400">+{s.areas.length - 2}</span>
            ) : null}
          </div>
        </div>
      </Link>
    </li>
  );
}
