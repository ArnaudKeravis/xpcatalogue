import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCatalogueData } from '@/lib/notion';
import { resolvePersonaImage } from '@/lib/data/personaImageResolve';
import { ER_BOK_PERSONAS } from '@/lib/data/er';

export const revalidate = 3600;

export default async function ErPersonaePage() {
  const data = await getCatalogueData();
  const work = data.areas.work;
  if (!work) notFound();

  const personas = data.personas.filter((p) => p.area === 'work').sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10 md:px-12 md:py-14">
      <nav className="text-xs font-semibold text-[var(--blue)]/60">
        <Link href="/er" className="hover:underline">
          E&amp;R home
        </Link>
        <span className="px-1">/</span>
        <span className="text-[var(--blue)]">Personae</span>
      </nav>
      <h1
        className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--blue)] md:text-4xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Personae
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--blue)]/80">
        Energy &amp; Mining segmentation from the Sodexo Book of Knowledge (Ipsos), plus the interactive Work personas
        already in the XP catalogue. BoK portrait photography from the PDF is not bundled here — add assets under{' '}
        <code className="rounded bg-[var(--icon-bg-muted)] px-1 text-xs">public/images/…</code> when ready.
      </p>

      <h2
        className="mt-12 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--blue)]/55"
        id="bok"
      >
        BoK — six global profiles
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ER_BOK_PERSONAS.map((bp) => (
          <li key={bp.id}>
            <Link
              href={`/er/personae/${bp.id}`}
              className="flex h-full flex-col rounded-2xl border border-[var(--grey-border)] bg-gradient-to-br from-[var(--surface-card)] to-[#f0f6ff] p-5 shadow-[var(--shadow-sm)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-panel)]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-extrabold text-white shadow-[var(--shadow-sm)]"
                  style={{ background: 'linear-gradient(135deg, #0b76b8, #14b8a6)' }}
                  aria-hidden
                >
                  {bp.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--blue)]/50">
                    {bp.profileKey}
                  </p>
                  <p className="truncate text-lg font-extrabold text-[var(--blue)]">{bp.name}</p>
                  <p className="truncate text-xs text-[var(--blue)]/70">{bp.role}</p>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--blue)]/78">
                {bp.generalDescription}
              </p>
              <span className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[var(--blue-primary)]">
                Open profile →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <h2
        className="mt-14 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--blue)]/55"
        id="work"
      >
        XP catalogue — Work area
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {personas.map((p) => {
          const face = resolvePersonaImage('face', p.id, p.photo);
          return (
            <li key={p.id}>
              <Link
                href={`/${p.area}/${p.id}`}
                className="flex gap-4 rounded-2xl border border-[var(--grey-border)] bg-[var(--surface-card)] p-4 shadow-[var(--shadow-sm)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-panel)]"
              >
                <div
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-[var(--grey-border)]"
                  style={{ background: p.color }}
                >
                  {face ? (
                    <img src={face} alt="" className="h-full w-full object-cover object-top" loading="lazy" />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--blue)]/55">
                    {work.label}
                  </p>
                  <p className="truncate text-base font-extrabold text-[var(--blue)]">{p.name}</p>
                  <p className="truncate text-xs text-[var(--blue)]/70">{p.role}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
