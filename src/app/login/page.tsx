'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export default function LoginPage() {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError('Incorrect password. Please try again.');
    }
  }

  return (
    <main
      style={{ background: 'linear-gradient(135deg, #1c63f3, #0e22a0)' }}
      className="flex min-h-screen items-center justify-center"
    >
      <div className="w-80 rounded-3xl bg-white p-12 text-center shadow-2xl">
        <div className="mb-4 text-5xl" aria-hidden>
          🔒
        </div>
        <h1 className="mb-1 text-2xl font-extrabold text-[var(--blue)]">Sodexo Catalogue</h1>
        <p className="mb-7 text-sm text-gray-500">Digital, AI & Innovation Experience</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            autoFocus
            className="w-full rounded-full border-2 border-gray-200 px-5 py-3 text-center text-sm outline-none transition-colors focus:border-[var(--blue-primary)]"
          />
          {error ? <p className="text-xs text-red-500">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-[var(--blue)] to-[var(--blue-primary)] py-3 text-base font-bold text-white"
          >
            Enter →
          </button>
        </form>
        <p className="mt-5 text-xs text-gray-300">Pilot — Internal use only</p>
      </div>
    </main>
  );
}
