import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  title: string;
  backHref?: string;
  breadcrumb?: Crumb[];
  /** Hide the title row (e.g. Areas screen — Figma 3023:34538 shows back only). */
  hideTitle?: boolean;
}

export function Navbar({ title, backHref, breadcrumb, hideTitle }: Props) {
  return (
    <header
      className="flex h-16 flex-shrink-0 items-center gap-4 bg-white px-8"
      style={{ boxShadow: 'var(--shadow-nav)' }}
    >
      {backHref ? (
        <Link
          href={backHref}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[var(--icon-bg-muted)] bg-[#f0f4ff] transition-colors hover:bg-[var(--icon-bg)]"
        >
          <ArrowLeft size={18} weight="bold" color="var(--blue)" />
        </Link>
      ) : null}
      {hideTitle ? (
        <span className="sr-only">{title}</span>
      ) : (
        <span
          className="flex-1 truncate text-base font-bold text-[var(--blue-primary)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {title}
        </span>
      )}
      {breadcrumb ? (
        <nav
          className="flex flex-shrink-0 items-center gap-1 text-xs text-gray-400"
          style={{ fontFamily: 'var(--font-body)' }}
          aria-label="Breadcrumb"
        >
          {breadcrumb.map((crumb, i) => (
            <span key={`${crumb.label}-${i}`} className="flex items-center gap-1">
              {i > 0 ? <span>›</span> : null}
              {crumb.href ? (
                <Link href={crumb.href} className="font-semibold text-[var(--blue)] hover:text-[var(--blue)]">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-semibold text-[var(--blue)]">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
