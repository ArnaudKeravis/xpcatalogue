'use client';

import { DownloadSimple } from '@phosphor-icons/react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Primary label, e.g. "Download persona". */
  label: string;
  /** Label shown while the export is running (disables the button). */
  pendingLabel?: string;
  /** When true, the button is disabled and shows the pending label. */
  pending?: boolean;
  /** Badge suffix shown after the label — format hint. Defaults to ".PPTX". */
  format?: string;
  /** "pill" (default) for floating placements, "block" for full-width. */
  variant?: 'pill' | 'block';
  /** Tone: "brand" (gradient) or "invert" (white on navy, for dark hero). */
  tone?: 'brand' | 'invert';
}

/**
 * The single download CTA primitive used everywhere the user can
 * grab a Sodexo-branded .pptx. Gradient fill, strong shadow,
 * subtle spotlight, uppercase heading type — unmistakably the
 * primary action without shouting.
 */
export function DownloadCta({
  label,
  pendingLabel = 'Preparing slide…',
  pending = false,
  format = '.PPTX',
  variant = 'pill',
  tone = 'brand',
  className,
  disabled,
  ...rest
}: Props) {
  const isPending = Boolean(pending);
  const isDisabled = isPending || disabled;

  const base =
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden font-extrabold uppercase tracking-[0.08em] shadow-[0_10px_24px_rgba(41,56,150,0.3)] transition-[transform,box-shadow] duration-[var(--motion-base)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(41,56,150,0.38)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)] disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_10px_24px_rgba(41,56,150,0.3)]';

  const shape =
    variant === 'block'
      ? 'w-full rounded-xl px-4 py-3 text-[13px]'
      : 'rounded-full px-5 py-2.5 text-[12px]';

  const fill =
    tone === 'invert'
      ? 'text-[var(--blue)]'
      : 'text-white';

  return (
    <button
      type="button"
      {...rest}
      disabled={isDisabled}
      aria-live="polite"
      aria-busy={isPending || undefined}
      className={cn(base, shape, fill, 'print:hidden', className)}
      style={{
        fontFamily: 'var(--font-heading)',
        backgroundImage:
          tone === 'invert'
            ? 'linear-gradient(135deg, #ffffff 0%, #f4f6fc 100%)'
            : 'linear-gradient(135deg, var(--blue) 0%, var(--blue-primary) 55%, var(--teal) 140%)',
        ...rest.style,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            tone === 'invert'
              ? 'radial-gradient(120% 100% at 15% 0%, rgba(41,56,150,0.12) 0%, rgba(41,56,150,0) 55%)'
              : 'radial-gradient(120% 100% at 15% 0%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 55%)',
        }}
      />
      <DownloadSimple
        size={variant === 'block' ? 16 : 15}
        weight="bold"
        aria-hidden
        className="relative"
      />
      <span className="relative">{isPending ? pendingLabel : label}</span>
      <span
        aria-hidden
        className={cn(
          'relative ml-0.5 text-[9px] font-bold tracking-normal',
          tone === 'invert' ? 'text-[var(--blue)]/70' : 'text-white/80',
        )}
      >
        {format}
      </span>
    </button>
  );
}
