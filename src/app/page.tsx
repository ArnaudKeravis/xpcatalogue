import { ArrowRight, Buildings, Compass, UsersThree } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { getCatalogueData } from '@/lib/notion';
import { TodayWidget, type BucketIconKey } from '@/components/home/TodayWidget';
import { CatalogueSnapshot } from '@/components/home/CatalogueSnapshot';
import { FeaturedPersona } from '@/components/home/FeaturedPersona';
import { HeroCollage } from '@/components/home/HeroCollage';
import type { Area } from '@/lib/data/types';

export const revalidate = 3600;

const ASSETS = {
  bokeh: '/images/catalogue/assets/home/home-bokeh.png',
  sparkle: '/images/catalogue/assets/home/home-sparkle.png',
} as const;

const AREAS: Area[] = ['work', 'learn', 'heal', 'play'];

export default async function HomePage() {
  const data = await getCatalogueData();

  const counts = {
    solutions: data.solutions.length,
    personas: data.personas.length,
    modules: Object.keys(data.modules).length,
    areas: AREAS.length,
    countries: new Set(data.solutions.flatMap((s) => s.flags)).size,
  };

  // Country flags sorted by deployment count, top 8.
  const flagCounts = new Map<string, number>();
  data.solutions.forEach((s) => s.flags.forEach((f) => flagCounts.set(f, (flagCounts.get(f) ?? 0) + 1)));
  const topCountries = Array.from(flagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([flag, count]) => ({ flag, count }));

  // Deterministic "featured persona of the day" (rotates by calendar day).
  const dayIdx = Math.floor(Date.now() / 86400000) % Math.max(1, data.personas.length);
  const featured = data.personas[dayIdx];
  const featuredArea = featured ? data.areas[featured.area] : null;

  // Moments across the day (bucketed by position in a persona's journey). We don't have
  // timestamps, so we use position in each persona's `steps` array as a proxy for
  // morning (0) → midday → afternoon → evening.
  const bucketLabels: { key: BucketIconKey; label: string; time: string }[] = [
    { key: 'morning', label: 'Morning rhythm', time: '06–11' },
    { key: 'midday', label: 'Midday surge', time: '11–14' },
    { key: 'afternoon', label: 'Afternoon focus', time: '14–18' },
    { key: 'evening', label: 'Evening wind-down', time: '18–22' },
  ];
  const buckets = bucketLabels.map((b, i) => {
    const items: { label: string; icon: string; href: string; personaName: string; areaLabel: string }[] = [];
    for (const p of data.personas) {
      const stepIdx = Math.min(i, p.steps.length - 1);
      const stepId = p.steps[stepIdx];
      const step = stepId ? data.journeySteps[stepId] : null;
      if (step) {
        items.push({
          label: step.label,
          icon: step.icon,
          href: `/${p.area}/${p.id}/moment/${step.id}`,
          personaName: p.name,
          areaLabel: data.areas[p.area].label,
        });
      }
    }
    return { ...b, items: items.slice(0, 4) };
  });

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[var(--home-hero-bg)]">
      <HeroDecor />

      {/* ── Hero band ─────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-12 pt-14 md:px-12 md:pt-20 lg:pt-24">
        {/*
         * Two-column hero at lg+: editorial text on the left, illustrative
         * collage (Persona · Journey · Solution) on the right. At smaller
         * widths the collage flows below the paragraph so it never crowds
         * the headline on mobile.
         */}
        <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
          <div className="flex flex-col items-start gap-5 text-white">
            <span
              className="motion-fade-up inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/70"
              style={{ animationDelay: '60ms' }}
            >
              <span
                aria-hidden
                className="h-px w-8 bg-[var(--teal)]"
              />
              Digital · AI · Innovation
            </span>
            <h1
              className="motion-fade-up max-w-[16ch] text-[clamp(2.5rem,5.5vw,5.5rem)] font-extrabold leading-[0.98] tracking-tight"
              style={{ fontFamily: 'var(--font-heading)', animationDelay: '160ms' }}
            >
              Where does tomorrow&rsquo;s day{' '}
              <span
                className="relative inline-block not-italic text-[var(--teal)]"
              >
                change?
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-1 h-[6px] rounded-full bg-[var(--teal)]/30"
                />
              </span>
            </h1>
            <p
              className="motion-fade-up max-w-xl text-[clamp(1rem,1.4vw,1.125rem)] font-medium leading-relaxed text-white/85"
              style={{ animationDelay: '280ms' }}
            >
              Every Sodexo solution sits inside someone&rsquo;s real day — a nurse on morning rounds, a
              white-collar worker hunting for lunch, a learner arriving on campus. Start with a{' '}
              <strong className="text-white">place</strong>, a <strong className="text-white">person</strong>, or a{' '}
              <strong className="text-white">moment</strong>.
            </p>
          </div>

          <HeroCollage className="w-full" />
        </div>

        {/* Three entry points */}
        <div
          className="motion-fade-up mx-auto mt-12 grid max-w-[1600px] gap-4 md:grid-cols-3"
          style={{ animationDelay: '560ms' }}
        >
          <EntryCard
            href="/areas"
            tag="Place"
            icon={<Buildings size={28} weight="duotone" aria-hidden />}
            title="Start with a place"
            body="Four worlds — Work, Learn, Heal, Play. Each with its own personas and daily rhythms."
            footer="4 areas"
          />
          <EntryCard
            href={featured ? `/${featured.area}/${featured.id}` : '/areas'}
            tag="Person"
            icon={
              featured ? (
                <span className="text-3xl leading-none" aria-hidden>{featured.emoji}</span>
              ) : (
                <UsersThree size={28} weight="duotone" aria-hidden />
              )
            }
            title={featured ? `Meet ${featured.fullName.split(' ')[0]}` : 'Meet a persona'}
            body={
              featured
                ? `${featured.role} · ${featuredArea?.label}. See how ${featured.fullName.split(' ')[0]}\u2019s day unfolds.`
                : `${counts.personas} personas across the four areas — each with a documented journey.`
            }
            footer={`${counts.personas} personas`}
            hint="Featured today"
          />
          <EntryCard
            href="/solutions"
            tag="Tool"
            icon={<Compass size={28} weight="duotone" aria-hidden />}
            title="Jump into a solution"
            body="Power users only — 91 solutions with filters for module, persona, moment, hashtag and country."
            footer={`${counts.solutions} solutions`}
          />
        </div>
      </section>

      {/* ── Today + Featured + Countries band ─────────────────── */}
      <section className="relative z-10 bg-[var(--surface)] px-6 pb-12 pt-12 md:px-12 md:pt-16">
        <div className="mx-auto grid max-w-[1600px] gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <TodayWidget buckets={buckets} />
          {featured && featuredArea ? (
            <FeaturedPersona
              personaName={featured.name}
              fullName={featured.fullName}
              role={featured.role}
              quote={featured.quote}
              areaLabel={featuredArea.label}
              areaColor={featuredArea.color}
              color={featured.color}
              emoji={featured.emoji}
              photo={featured.photo}
              href={`/${featured.area}/${featured.id}`}
            />
          ) : null}
        </div>
      </section>

      {/* ── Catalogue snapshot (stats + country lens, unified) ─── */}
      <section className="relative z-10 bg-[var(--surface)] px-6 pb-16 md:px-12">
        <div className="mx-auto max-w-[1600px]">
          <CatalogueSnapshot
            stats={[
              { value: counts.areas, label: 'Areas of life' },
              { value: counts.personas, label: 'Personas' },
              { value: counts.modules, label: 'Experience modules' },
              { value: counts.solutions, label: 'Solutions' },
              { value: counts.countries, label: 'Countries' },
            ]}
            countries={topCountries}
            totalCountries={counts.countries}
          />
        </div>
      </section>
    </div>
  );
}

/* ── Sub-parts ──────────────────────────────────────────────── */

function EntryCard({
  href,
  tag,
  icon,
  title,
  body,
  footer,
  hint,
}: {
  href: string;
  tag: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  footer: string;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[var(--surface-on-hero)] p-6 text-white shadow-[var(--shadow-panel)] transition-[transform,box-shadow,border-color] duration-[var(--motion-base)] ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {/* Brand accent rail — replaces decorative glass tint with a purposeful signal */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--teal)] via-[var(--blue-primary)] to-[var(--teal)] opacity-80"
      />
      <div className="flex items-start justify-between gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-white"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          {icon}
        </div>
        <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
          {tag}
        </span>
      </div>
      <h2
        className="mt-6 text-[clamp(1.5rem,2.2vw,2rem)] font-extrabold leading-tight"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-white/85" style={{ fontFamily: 'var(--font-body)' }}>
        {body}
      </p>
      <div className="mt-6 flex items-center justify-between text-[11px]">
        <span className="font-semibold uppercase tracking-[0.14em] text-white/70">
          {hint ?? footer}
        </span>
        <span className="inline-flex items-center gap-1.5 font-bold text-white transition-transform duration-[var(--motion-base)] ease-[var(--ease-hover)] group-hover:translate-x-0.5">
          Explore <ArrowRight size={14} weight="bold" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

function HeroDecor() {
  /*
   * Decor restraint: two bokeh layers + a single soft sparkle. Four overlapping
   * images was too busy; the catalogue is about clarity, not smoke. The bokeh
   * is anchored to the lower half so it doesn't fight the headline.
   */
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -right-[20%] top-[35%] h-[min(90vh,720px)] w-[min(120vw,720px)] opacity-50 mix-blend-screen md:-right-[10%] md:top-[28%]">
        <img src={ASSETS.bokeh} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="absolute -left-[25%] top-[55%] hidden h-[min(80vh,640px)] w-[min(110vw,640px)] opacity-35 mix-blend-screen md:block">
        <img src={ASSETS.bokeh} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="absolute -right-[25%] -top-[30%] hidden h-[min(70vh,560px)] w-[min(80vw,520px)] opacity-25 md:block">
        <img src={ASSETS.sparkle} alt="" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
