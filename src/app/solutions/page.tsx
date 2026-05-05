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
import { BigBetsCollectionIntro } from '@/components/catalogue/BigBetsCollectionIntro';
import { ScrollToStandardOfferCatalogue } from '@/components/catalogue/ScrollToStandardOfferCatalogue';
import { StandardOfferParallax } from '@/components/standard-offer/StandardOfferParallax';
import { COLLECTION_META, parseCollectionKey } from '@/lib/data/collections';
import { cn } from '@/lib/utils/cn';
import { pickModuleVisual } from '@/lib/data/moduleVisuals';
import type { Area, SolutionCollection, SolutionStatus, SolutionType } from '@/lib/data/types';

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
  const { solutions, areas, personas, journeySteps, modules: modulesByName } = catalogue;

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

  // Curated collection filter — accepts ?collection=standard-offer or ?collection=big-bets.
  // Multiple values are supported (OR semantics) to allow future cross-collection views.
  const collectionFilter = many(searchParams.collection)
    .map(parseCollectionKey)
    .filter((c): c is SolutionCollection => Boolean(c));

  const filtered = filterSolutions(solutions, {
    q,
    module: mod,
    modules: moduleWhitelist,
    area,
    status,
    type,
    hashtags: hashtagFilter,
    flags: flagFilter,
    collections: collectionFilter.length > 0 ? collectionFilter : undefined,
  });

  // When exactly one curated collection is selected and nothing else is filtering, we
  // promote the collection to an editorial hero instead of a generic "Solutions — …" title.
  const soloCollection =
    collectionFilter.length === 1 &&
    !mod && !area && !status && !type && !persona && !moment && !q &&
    hashtagFilter.length === 0 && flagFilter.length === 0
      ? COLLECTION_META[collectionFilter[0]]
      : null;

  const titleParts: string[] = [];
  if (mod) titleParts.push(mod);
  if (area) titleParts.push(areas[area].label);
  if (status) titleParts.push(status);
  if (type) titleParts.push(type);
  if (persona) titleParts.push(persona.name);
  if (moment) titleParts.push(moment.label);
  if (collectionFilter.length > 0)
    titleParts.push(collectionFilter.map((c) => COLLECTION_META[c].label).join(' · '));
  if (hashtagFilter.length > 0) titleParts.push(hashtagFilter.join(' · '));
  if (flagFilter.length > 0) titleParts.push(flagFilter.join(' '));
  if (q) titleParts.push(`“${q}”`);
  const title = titleParts.length > 0 ? `Solutions — ${titleParts.join(' · ')}` : 'All solutions';

  const catalogueAnchorId =
    soloCollection?.key === 'standard-offer' || soloCollection?.key === 'big-bets'
      ? 'solutions-catalogue'
      : undefined;

  const areaOptions = (['work', 'learn', 'heal', 'play'] as const).map((id) => ({
    value: id,
    label: areas[id].label,
  }));

  return (
    <main id="main-content" className="flex flex-1 flex-col bg-[var(--surface)]">
      {soloCollection?.key === 'standard-offer' ? (
        <>
          <Suspense fallback={null}>
            <ScrollToStandardOfferCatalogue />
          </Suspense>
          <StandardOfferParallax embedded />
        </>
      ) : (
        <div className="px-4 py-6 md:px-8">
          {soloCollection?.key === 'big-bets' ? (
            <BigBetsCollectionIntro solutionCount={filtered.length} />
          ) : soloCollection ? (
            <div
              className="mb-4 overflow-hidden rounded-brand-2xl p-6 text-white md:p-8"
              style={{ backgroundImage: soloCollection.gradient }}
            >
              <span
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/85"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <span aria-hidden className="h-px w-8 bg-white/70" />
                Curated collection
              </span>
              <h1
                className="mt-3 max-w-[22ch] text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.05]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {soloCollection.label}
              </h1>
              <p
                className="mt-2 max-w-2xl text-sm leading-relaxed text-white/90 md:text-base"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {soloCollection.description}
              </p>
              <p
                className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {filtered.length} {filtered.length === 1 ? 'solution' : 'solutions'} in this collection
              </p>
            </div>
          ) : (
            <h1
              className="mb-4 text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-tight text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {title}
            </h1>
          )}
        </div>
      )}
      <div
        id={catalogueAnchorId}
        className={cn('flex-1 px-4 pb-10 md:px-8', catalogueAnchorId && 'scroll-mt-28')}
      >
        {persona && moment ? (
          <p className="mb-4 text-sm text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
            Filtered to solutions relevant during <strong>{moment.label}</strong> for <strong>{persona.name}</strong>.
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
              const solMod = modulesByName[s.module];
              const { Icon: SolIcon, weight: solIconWeight } = pickModuleVisual(solMod);
              return (
                <li key={s.id}>
                  <Link
                    href={`/solutions/${s.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--grey-border)] bg-white shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* Module colour bar */}
                    <div
                      className="h-1.5 w-full"
                      style={{
                        background:
                          solMod?.gradient ?? 'linear-gradient(90deg,var(--blue),var(--blue-primary))',
                      }}
                    />

                    <div className="flex flex-1 flex-col gap-3 p-4">
                      {/* Header */}
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                          style={{ background: 'var(--icon-bg)' }}
                          aria-hidden
                        >
                          <SolIcon size={20} weight={solIconWeight} color="var(--blue)" />
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
                        {(s.collections ?? []).map((c) => {
                          const meta = COLLECTION_META[c];
                          return (
                            <span
                              key={c}
                              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white"
                              style={{ backgroundImage: meta.gradient }}
                              title={meta.tagline}
                            >
                              {meta.shortLabel}
                            </span>
                          );
                        })}
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
    </main>
  );
}
