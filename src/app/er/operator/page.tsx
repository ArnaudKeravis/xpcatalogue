import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Clock,
  Compass,
  Heart,
  Lightning,
  MapTrifold,
  TreeStructure,
  UsersThree,
} from '@phosphor-icons/react/dist/ssr';
import { getCatalogueData } from '@/lib/notion';

export const revalidate = 3600;

export default async function ErOperatorHomePage() {
  const data = await getCatalogueData();
  const workPersonas = data.personas.filter((p) => p.area === 'work');
  const featured =
    workPersonas.find((p) => p.id === 'operator-work') ?? workPersonas.find((p) => p.id === 'blue-collar');

  return (
    <div className="relative flex flex-1 flex-col">
      <section className="border-b border-[var(--grey-border)] bg-gradient-to-br from-[#1a2f24] via-[#143d32] to-[#0f2744] px-6 py-14 text-white md:px-12 md:py-20">
        <div className="mx-auto max-w-[1600px]">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/65">Operator lens</p>
          <h1
            className="mt-3 max-w-[20ch] text-[clamp(2rem,4.5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Frontline IFM on industrial sites
          </h1>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-white/88">
            For operations managers and contract leads: shift moments, crew wellbeing, compliance touchpoints,
            and the same solution catalogue — framed for how services are delivered, not procured.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-white/75">
            The same BoK profiles, home-to-home journey, IFM pillars, and six user needs as the client view — use
            them in pre-shift briefings and crew comms; link into the catalogue for proof points.
          </p>
        </div>
      </section>

      <section className="px-6 py-10 md:px-12">
        <div className="mx-auto grid max-w-[1600px] gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ErCard
            href="/er/personae"
            tag="Personae"
            icon={<UsersThree size={26} weight="duotone" aria-hidden />}
            title="Start with a persona"
            body="Same six BoK profiles — read pains through a delivery lens (camp, bus, mess, laundry)."
            footer={`BoK + Work (${workPersonas.length})`}
          />
          <ErCard
            href="/er/moments"
            tag="Moments"
            icon={<Clock size={26} weight="duotone" aria-hidden />}
            title="Start with a moment"
            body="Handover, rounds, meal breaks — aligned to catalogue moments per Work persona."
            footer="Per persona"
          />
          <ErCard
            href="/solutions"
            tag="Solutions"
            icon={<Compass size={26} weight="duotone" aria-hidden />}
            title="Jump into solutions"
            body="Same solution IDs as global catalogue; IFM + user-needs tags will help filter what crews run daily."
            footer={`${data.solutions.length} solutions`}
          />
          <ErCard
            href="/er/needs"
            tag="User needs"
            icon={<Heart size={26} weight="duotone" aria-hidden />}
            title="User needs hub"
            body="Comfort, privacy, ease &amp; efficiency — what frontline teams hear in verbatims."
            footer="6 needs"
          />
          <ErCard
            href="/er/ifm"
            tag="IFM"
            icon={<TreeStructure size={26} weight="duotone" aria-hidden />}
            title="IFM value case pillars"
            body="Cleaning, catering, transport, governance — principles you operationalise on contract."
            footer="12 pillars"
          />
          <ErCard
            href="/er/journey"
            tag="Journey"
            icon={<MapTrifold size={26} weight="duotone" aria-hidden />}
            title="Home-to-home journey"
            body="Shared journey steps from the BoK — baseline pain themes for gap analysis with crews."
            footer="9 phases"
          />
        </div>
      </section>

      <section className="border-t border-[var(--grey-border)] px-6 py-10 md:px-12">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Suggested entry persona
            </h2>
            <p className="mt-1 max-w-xl text-sm text-[var(--blue)]/75">
              Open an operator-facing profile, then step through moments into modules and solutions.
            </p>
          </div>
          {featured ? (
            <Link
              href={`/${featured.area}/${featured.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--blue-primary)] px-4 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition-transform hover:-translate-y-0.5"
            >
              Open {featured.name}
              <Lightning size={18} weight="duotone" aria-hidden />
            </Link>
          ) : null}
          <Link
            href="/work/exemple-minor"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--grey-border)] bg-[var(--surface-card)] px-4 py-2.5 text-sm font-bold text-[var(--blue)]"
          >
            Exemple Minor (demo)
            <ArrowRight size={16} weight="bold" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}

function ErCard({
  href,
  tag,
  icon,
  title,
  body,
  footer,
}: {
  href: string;
  tag: string;
  icon: ReactNode;
  title: string;
  body: string;
  footer: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-sm)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-panel)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--icon-bg-muted)] text-[var(--blue-primary)]">
          {icon}
        </div>
        <span className="rounded-full border border-[var(--grey-border)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--blue)]/70">
          {tag}
        </span>
      </div>
      <h2
        className="mt-4 text-lg font-extrabold leading-snug text-[var(--blue)]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {title}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--blue)]/75">{body}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--blue-primary)]">
        {footer}
        <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
