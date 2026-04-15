import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ModuleCard } from '@/components/catalogue/ModuleCard';
import { Navbar } from '@/components/layout/Navbar';
import { getCatalogueData } from '@/lib/notion';
import type { Area, Module } from '@/lib/data/types';

export const revalidate = 3600;

const AREA_KEYS = new Set<Area>(['work', 'learn', 'heal', 'play']);

interface Props {
  params: { area: string; persona: string; momentId: string };
}

function moduleByName(modules: Record<string, Module>, name: string): Module | undefined {
  return Object.values(modules).find((m) => m.name === name);
}

export default async function MomentPage({ params }: Props) {
  const { personas, areas, modules, journeySteps } = await getCatalogueData();
  if (!AREA_KEYS.has(params.area as Area)) notFound();

  const areaConfig = areas[params.area as Area];
  if (!areaConfig) notFound();

  const persona = personas.find((p) => p.id === params.persona && p.area === params.area);
  if (!persona) notFound();

  if (!persona.steps.includes(params.momentId)) notFound();

  const step = journeySteps[params.momentId];
  if (!step) notFound();

  const moduleCards = step.modules
    .map((name) => moduleByName(modules, name))
    .filter((m): m is Module => Boolean(m));

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar
        hideTitle
        title="Digital, AI & Innovation Experience Catalogue"
        backHref={`/${params.area}/${params.persona}`}
        breadcrumb={[
          { label: areaConfig.label, href: `/${params.area}` },
          { label: persona.name, href: `/${params.area}/${params.persona}` },
          { label: step.label },
        ]}
      />

      <main className="flex-1 overflow-y-auto px-4 pb-16 pt-6 md:px-10 lg:px-14">
        <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wide text-[var(--teal)]">
          Moment
        </p>
        <h1
          className="mb-4 text-center text-[clamp(1.5rem,4vw,2.5rem)] font-extrabold text-[var(--blue)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {step.label}
        </h1>
        {step.description ? (
          <p
            className="mx-auto mb-10 max-w-2xl text-center text-[1.05rem] leading-relaxed text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {step.description}
          </p>
        ) : null}

        {step.touchpoints ? (
          <div className="mx-auto mb-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            {[
              { label: 'Physical touchpoints', items: step.touchpoints.physical ?? [], tone: 'blue' as const },
              { label: 'Digital touchpoints', items: step.touchpoints.digital ?? [], tone: 'teal' as const },
            ].map(({ label, items, tone }) => (
              <div
                key={label}
                className="rounded-[var(--radius-xl)] border border-[var(--grey-border)] bg-[var(--surface)] p-5"
              >
                <p className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--blue)]">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: tone === 'blue' ? 'var(--blue)' : 'var(--teal)' }}
                  />
                  {label}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {items.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[var(--blue)]">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}

        <section>
          <h2
            className="mb-2 text-xl font-extrabold text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Modules for this moment
          </h2>
          <p className="mb-6 max-w-2xl text-sm text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
            Each module groups related solutions. Open a module to browse implementations, or jump straight to
            the solution catalogue filtered by module.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {moduleCards.map((mod) => (
              <ModuleCard
                key={mod.id}
                module={mod}
                href={`/solutions?module=${encodeURIComponent(mod.name)}&moment=${encodeURIComponent(step.label)}&momentId=${encodeURIComponent(step.id)}`}
              />
            ))}
          </div>
        </section>

        <p className="mt-10 text-center text-sm text-gray-500">
          <Link href="/solutions" className="font-semibold text-[var(--blue-primary)] underline">
            Browse all solutions
          </Link>
        </p>
      </main>
    </div>
  );
}
