'use client';

import { Check, ShareNetwork } from '@phosphor-icons/react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  title: string;
  text?: string;
  /** Relative URL; absolute is computed from window.location.origin on click. */
  url?: string;
  variant?: 'pill' | 'icon';
  className?: string;
}

/**
 * Uses the Web Share API when available (mobile), otherwise copies a shareable
 * URL to clipboard and flashes a short "Copied!" state.
 */
export function ShareButton({ title, text, url, variant = 'pill', className }: Props) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const onShare = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const absoluteUrl = new URL(url ?? window.location.pathname, window.location.origin).toString();

    // Try native share first
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url: absoluteUrl });
        return;
      } catch {
        // user cancelled or failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // swallow — no further UX beyond the button
    }
  }, [title, text, url]);

  const label = copied ? 'Link copied' : 'Share';

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={onShare}
        aria-label={label}
        title={label}
        className={
          className ??
          'flex h-9 w-9 items-center justify-center rounded-full border border-[var(--grey-border)] bg-[var(--surface-card)] text-[var(--blue)] transition-colors hover:border-[var(--blue-primary)] hover:text-[var(--blue-primary)]'
        }
      >
        {copied ? (
          <Check size={16} weight="bold" aria-hidden />
        ) : (
          <ShareNetwork size={16} weight="regular" aria-hidden />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onShare}
      aria-label={label}
      className={
        className ??
        'inline-flex items-center gap-1.5 rounded-full border border-[var(--grey-border)] bg-[var(--surface-card)] px-3 py-1.5 text-xs font-semibold text-[var(--blue)] transition-colors hover:border-[var(--blue-primary)] hover:text-[var(--blue-primary)]'
      }
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {copied ? (
        <>
          <Check size={14} weight="bold" aria-hidden /> Copied!
        </>
      ) : (
        <>
          <ShareNetwork size={14} aria-hidden /> Share
        </>
      )}
    </button>
  );
}
