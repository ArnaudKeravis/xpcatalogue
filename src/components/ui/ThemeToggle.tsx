'use client';

import { Moon, Sun, Desktop } from '@phosphor-icons/react';
import { useEffect } from 'react';
import { useStore, type Theme } from '@/lib/store';

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Desktop },
];

/** Applies the current theme as `data-theme` on <html>. Resolves `system` via matchMedia. */
function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePref = theme;
}

/**
 * Compact 3-way toggle (Light / System / Dark). Hydration-safe:
 *   1. Pre-render renders the buttons inert (no active ring) so SSR markup matches.
 *   2. An inline <script> in layout.tsx sets `data-theme` before paint from localStorage.
 *   3. After mount, this component keeps React state in sync + listens for OS changes
 *      when pref === 'system'.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={
        className ??
        'inline-flex items-center rounded-full border border-[var(--grey-border)] bg-[var(--surface-card)] p-0.5'
      }
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={`${label} theme`}
            onClick={() => setTheme(value)}
            className={
              active
                ? 'flex h-7 w-7 items-center justify-center rounded-full bg-[var(--blue-primary)] text-white transition-all'
                : 'flex h-7 w-7 items-center justify-center rounded-full text-[var(--blue)]/60 transition-all hover:text-[var(--blue)]'
            }
          >
            <Icon size={14} weight={active ? 'fill' : 'regular'} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}

/** No-flash theme init — stringified for direct injection into <head>.
 *  Runs BEFORE React hydrates, reads localStorage, sets data-theme on <html>. */
export const themeInitScript = `
(function(){
  try{
    var raw = localStorage.getItem('sodexo-xp-catalogue');
    var pref = 'system';
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.state && parsed.state.theme) pref = parsed.state.theme;
    }
    var resolved = pref;
    if (pref === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themePref = pref;
  } catch(e) {
    document.documentElement.dataset.theme = 'light';
  }
})();
`.trim();
