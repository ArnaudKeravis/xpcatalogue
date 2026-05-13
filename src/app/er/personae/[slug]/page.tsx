import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ER_BOK_PERSONAS, erBoKPersonaById } from '@/lib/data/er';

export const revalidate = 3600;

export function generateStaticParams() {
  return ER_BOK_PERSONAS.map((p) => ({ slug: p.id }));
}

interface Props {
  params: { slug: string };
}

export default function ErBoKPersonaPage({ params }: Props) {
  const persona = erBoKPersonaById(params.slug);
  if (!persona) notFound();

  return (
    <div className="mx-auto max-w-[900px] px-6 py-10 md:px-12 md:py-14">
      <nav className="text-xs font-semibold text-[var(--blue)]/60">
        <Link href="/er" className="hover:underline">
          E&amp;R home
        </Link>
        <span className="px-1">/</span>
        <Link href="/er/personae" className="hover:underline">
          Personae
        </Link>
        <span className="px-1">/</span>
        <span className="text-[var(--blue)]">{persona.name}</span>
      </nav>

      <header className="mt-6 border-b border-[var(--grey-border)] pb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--blue)]/55">{persona.profileKey}</p>
        <h1
          className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--blue)] md:text-4xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {persona.name}, the {persona.profileKey.toLowerCase().replace(/-/g, ' ')}
        </h1>
        <p className="mt-1 text-lg font-semibold text-[var(--blue)]/80">
          {persona.role} · {persona.age} · {persona.gender}
        </p>
        <p className="mt-1 text-sm text-[var(--blue)]/65">
          {persona.relationship}
          {persona.kids ? ` · ${persona.kids}` : ''} · {persona.experience}
        </p>
        <blockquote className="mt-6 border-l-4 border-[var(--teal)] pl-4 text-base font-medium italic leading-relaxed text-[var(--blue)]/90">
          &ldquo;{persona.quote}&rdquo;
        </blockquote>
      </header>

      <section className="mt-8">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--blue)]/55">General description</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--blue)]/85">{persona.generalDescription}</p>
      </section>

      <section className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--blue)]/55">
            Emotional / psychological profile
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--blue)]/80">
            {persona.emotionalProfile.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--blue)]/55">Who they are (BoK)</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--blue)]/80">{persona.whoTheyAre}</p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--blue)]/55">Key needs &amp; drivers</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {persona.keyNeeds.map((n) => (
            <li
              key={n}
              className="rounded-full bg-[var(--icon-bg-muted)] px-3 py-1 text-xs font-semibold text-[var(--blue)]"
            >
              {n}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--blue)]/55">Pain points</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--blue)]/80">
          {persona.painPoints.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--blue)]/55">How Sodexo addresses their needs</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--blue)]/80">
          {persona.howWeAddress.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-5">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--blue)]/55">BoK module clusters</h2>
        <ul className="mt-2 space-y-2 text-sm text-[var(--blue)]/80">
          {persona.moduleClusters.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-[var(--blue)]/60">
          Cross-walk these clusters to{' '}
          <Link href="/er/ifm" className="font-semibold text-[var(--blue-primary)] underline-offset-2 hover:underline">
            IFM pillars
          </Link>{' '}
          and{' '}
          <Link href="/solutions" className="font-semibold text-[var(--blue-primary)] underline-offset-2 hover:underline">
            catalogue solutions
          </Link>
          .
        </p>
      </section>

      <p className="mt-8 text-center text-sm text-[var(--blue)]/65">
        <Link href="/er/journey" className="font-bold text-[var(--blue-primary)] hover:underline">
          Home-to-home journey (shared steps)
        </Link>
        {' · '}
        <Link href="/er/personae" className="font-bold text-[var(--blue-primary)] hover:underline">
          All personae
        </Link>
      </p>
    </div>
  );
}
