'use client';

import { ArrowRight, LockKey } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';

export default function LoginPage() {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const pwId = useId();
  const errorId = useId();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError(
          "That's not the right password. If you need access, email innovation@sodexo.com."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-[var(--blue-solid)] px-4"
    >
      <div
        className="w-full max-w-[360px] rounded-3xl bg-white p-10 text-center"
        style={{ boxShadow: 'var(--shadow-panel)' }}
      >
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--icon-bg)]"
          aria-hidden
        >
          <LockKey size={26} weight="duotone" color="var(--blue)" />
        </div>
        <h1
          className="mb-1 text-2xl font-extrabold text-[var(--blue)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Sodexo Catalogue
        </h1>
        <p className="mb-7 text-sm text-[var(--grey-subtle)]">
          Digital, AI &amp; Innovation Experience
        </p>
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <label htmlFor={pwId} className="sr-only">
            Password
          </label>
          <input
            id={pwId}
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            autoFocus
            required
            {...(error ? { 'aria-invalid': true as const, 'aria-describedby': errorId } : null)}
            className="w-full rounded-full border-2 border-[var(--grey-border)] px-5 py-3 text-center text-sm text-[var(--blue)] outline-none transition-colors focus:border-[var(--blue-primary)]"
          />
          {error ? (
            <p
              id={errorId}
              role="alert"
              className="text-xs leading-snug text-red-600"
            >
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={submitting || pw.length === 0}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--blue)] py-3 text-base font-bold text-white transition-colors hover:bg-[var(--blue-solid)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Checking…' : 'Enter'}
            <ArrowRight
              size={18}
              weight="bold"
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </button>
        </form>
        <p className="mt-5 text-xs text-[var(--grey-subtle)]">
          Pilot — Internal use only
        </p>
      </div>
    </main>
  );
}
