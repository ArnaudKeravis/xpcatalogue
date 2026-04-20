import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { SolutionCard } from '@/components/catalogue/SolutionCard';
import { Navbar } from '@/components/layout/Navbar';
import { getCatalogueData } from '@/lib/notion';
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

  // A solution belongs to a module when its `module` field matches by name
  // OR the module config explicitly lists it in `solutionIds` (Excel flow mapping).
  const mappedIds = new Set(mod.solutionIds ?? []);
  const moduleSolutions: Solution[] = solutions.filter(
    (s) => s.module === mod.name || mappedIds.has(s.id)
  );
  if (moduleSolutions.length === 0) notFound();

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

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)]">
      <Navbar title={mod.name} backHref={backHref} breadcrumb={breadcrumb} />

      {/* Module header strip */}
      <header
        className="flex flex-col gap-3 border-b border-[var(--grey-border)] bg-white px-6 py-5 md:flex-row md:items-center md:gap-5 md:px-8"
      >
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-3xl shadow-[var(--shadow-sm)]"
          style={{ background: mod.gradient }}
          aria-hidden
        >
          <span>{mod.icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--blue)]/60"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Module
          </p>
          <h1
            className="truncate text-2xl font-extrabold text-[var(--blue)] md:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {mod.name}
          </h1>
          <p
            className="mt-1 max-w-3xl text-sm leading-relaxed text-gray-600"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {mod.description}
          </p>
        </div>

        <Link
          href={backHref}
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-[var(--grey-border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--blue)] hover:bg-[#f0f4ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <ArrowLeft size={14} weight="bold" aria-hidden />
          Back
        </Link>
      </header>

      <main id="main-content" className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <SolutionCard solution={primary} siblings={siblings} module={mod} />
      </main>
    </div>
  );
}
