import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CaretRight } from '@phosphor-icons/react/dist/ssr';
import { SolutionCard } from '@/components/catalogue/SolutionCard';
import { ModuleIcon } from '@/components/catalogue/ModuleIcon';
import { PillLink } from '@/components/ui/PillLink';
import { getCatalogueData } from '@/lib/notion';
import { solutionsForModule } from '@/lib/data/moduleSolutions';
import type { Area, Module, Solution } from '@/lib/data/types';

export const revalidate = 3600;

const AREA_KEYS = new Set<Area>(['work', 'learn', 'heal', 'play']);

interface Props {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

function first(param: string | string[] | undefined): string | undefined {
  if (Array.isArray(param)) return param[0];
  return param;
}

function findModuleBySlug(modules: Record<string, Module>, slug: string): Module | undefined {
  return Object.values(modules).find((m) => m.id === slug);
}

export async function generateStaticParams() {
  const { modules } = await getCatalogueData();
  return Object.values(modules).map((m) => ({ slug: m.id }));
}

export default async function ModulePage({ params, searchParams }: Props) {
  const { solutions, modules, areas, personas } = await getCatalogueData();

  const mod = findModuleBySlug(modules, params.slug);
  if (!mod) notFound();

  /** Solutions for this module: Modules sheet Column C only (`linkedSolutionsExcel` → exact `Solution.name`). */
  const moduleSolutions: Solution[] = solutionsForModule(mod, solutions);
  const resolvedCount = (m: Module) => solutionsForModule(m, solutions).length;

  // Optional back-context from query string — preserves the
  //  Area → Persona → Moment → Module breadcrumb the user came from.
  const areaParam = first(searchParams?.area);
  const personaParam = first(searchParams?.persona);
  const momentParam = first(searchParams?.momentId);

  const area = areaParam && AREA_KEYS.has(areaParam as Area) ? (areaParam as Area) : undefined;
  const persona =
    area && personaParam ? personas.find((p) => p.id === personaParam && p.area === area) : undefined;
  const moment = momentParam && persona && persona.steps.includes(momentParam) ? momentParam : undefined;

  const backHref = moment && persona
    ? `/${area}/${persona.id}/moment/${moment}`
    : persona
      ? `/${area}/${persona.id}`
      : area
        ? `/${area}`
        : '/areas';

  const breadcrumb: { label: string; href?: string }[] = [];
  if (area) breadcrumb.push({ label: areas[area].label, href: `/${area}` });
  if (persona) breadcrumb.push({ label: persona.name, href: `/${area}/${persona.id}` });
  if (moment && persona) {
    // Moment label lookup happens from journeySteps but keeping it lightweight here: use slug.
    breadcrumb.push({ label: 'Moment', href: `/${area}/${persona.id}/moment/${moment}` });
  }
  breadcrumb.push({ label: mod.name });

  // Primary solution: the first (preserves deep-link stability for now).
  const [primary, ...siblings] = moduleSolutions;
  const linkedExcel = mod.linkedSolutionsExcel ?? [];

  // Sibling modules: 4 others from the same catalogue, excluding this one.
  // We prefer modules with the highest solution count so the peek feels rich.
  const siblingModules = Object.values(modules)
    .filter((m) => m.id !== mod.id && resolvedCount(m) > 0)
    .sort((a, b) => resolvedCount(b) - resolvedCount(a))
    .slice(0, 4);

  return (
    <div className="flex flex-1 flex-col bg-[var(--surface)]">
      {/* Module header strip */}
      <header
        className="flex flex-col gap-3 border-b border-[var(--grey-border)] bg-[var(--surface-card)] px-6 py-5 md:px-8"
      >
        {/* Contextual breadcrumb — surfaces the journey the user took to land here */}
        {breadcrumb.length > 1 ? (
          <nav
            aria-label="Context"
            className="flex flex-wrap items-center gap-1 text-[11px] font-semibold text-[var(--blue)]/60"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {breadcrumb.map((b, i) => {
              const isLast = i === breadcrumb.length - 1;
              return (
                <span key={`${b.label}-${i}`} className="inline-flex items-center gap-1">
                  {b.href && !isLast ? (
                    <Link
                      href={b.href}
                      className="rounded px-1 text-[var(--blue)]/70 transition-colors duration-[var(--motion-base)] hover:text-[var(--blue-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--blue-primary)]"
                    >
                      {b.label}
                    </Link>
                  ) : (
                    <span className={isLast ? 'px-1 text-[var(--blue)]' : 'px-1'}>{b.label}</span>
                  )}
                  {!isLast ? (
                    <CaretRight
                      size={10}
                      weight="bold"
                      className="text-[var(--blue)]/30"
                      aria-hidden
                    />
                  ) : null}
                </span>
              );
            })}
          </nav>
        ) : null}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
          <ModuleIcon module={mod} size={56} />
          <div className="min-w-0 flex-1">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--blue)]/60"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Module · All solutions · {linkedExcel.length > 0 ? linkedExcel.length : moduleSolutions.length}
            </p>
            {mod.domain ? (
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--blue)]/50"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {mod.domain}
              </p>
            ) : null}
            <h1
              className="truncate text-2xl font-extrabold text-[var(--blue)] md:text-3xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {mod.name}
            </h1>
            <p
              className="mt-1 max-w-3xl text-sm leading-relaxed text-[var(--blue)]/70"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {mod.description}
            </p>
          </div>

          <PillLink
            href={backHref}
            className="shrink-0 self-start"
            leading={<ArrowLeft size={14} weight="bold" />}
          >
            Back
          </PillLink>
        </div>
      </header>

      <main id="main-content" className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {moduleSolutions.length > 0 ? (
          <SolutionCard solution={primary} siblings={siblings} module={mod} hideModuleRail />
        ) : (
          <section
            className="mx-auto w-full max-w-[960px] flex-1 px-6 py-10 md:px-10"
            aria-label="Solutions listed for this module"
          >
            <p
              className="text-sm font-semibold text-[var(--blue)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Solutions in the module
            </p>
            <ul
              className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--blue)]/80"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {linkedExcel.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {/* ── Sibling modules peek ───────────────────────────────────
         A "you might also look at" rail at the foot of the page, so
         a user landing on a specific module doesn't hit a dead-end. */}
      {siblingModules.length > 0 ? (
        <aside
          aria-label="Other modules"
          className="border-t border-[var(--grey-border)] bg-[var(--surface)] px-6 py-8 md:px-10 md:py-10 print:hidden"
        >
          <div className="mx-auto max-w-[1280px]">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--blue)]/60"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Other modules
                </p>
                <h2
                  className="text-xl font-extrabold text-[var(--blue)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Keep exploring
                </h2>
              </div>
              <Link
                href="/solutions"
                className="inline-flex items-center gap-1 text-xs font-bold text-[var(--blue-primary)] transition-transform duration-[var(--motion-base)] ease-[var(--ease-hover)] hover:translate-x-0.5 hover:underline"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                All solutions <ArrowRight size={11} weight="bold" aria-hidden />
              </Link>
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {siblingModules.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/modules/${m.id}`}
                    className="group flex h-full items-start gap-3 rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-4 transition-[transform,border-color,box-shadow] duration-[var(--motion-base)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-[var(--blue-primary)] hover:shadow-[var(--shadow-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
                  >
                    <ModuleIcon module={m} size={40} />
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-sm font-extrabold text-[var(--blue)]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {m.name}
                      </p>
                      <p
                        className="mt-0.5 tabular text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--blue)]/55"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {resolvedCount(m)} solution
                        {resolvedCount(m) === 1 ? '' : 's'}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
