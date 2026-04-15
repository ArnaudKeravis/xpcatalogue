'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useState, useTransition, type FormEvent } from 'react';

export function SearchBar() {
  const [q, setQ] = useState('');
  const [, startTransition] = useTransition();
  const router = useRouter();

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    startTransition(() => router.push(`/solutions?q=${encodeURIComponent(q)}`));
  }

  return (
    <form onSubmit={handleSearch} className="mb-2 mt-4 flex items-center gap-3">
      <div className="relative flex-1">
        <MagnifyingGlass size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search solutions, modules, personas…"
          className="w-full rounded-full border-2 border-[var(--grey-border)] bg-[#f8faff] py-2.5 pl-10 pr-4 text-sm text-[var(--blue)] outline-none transition-colors focus:border-[var(--blue-primary)]"
          style={{ fontFamily: 'var(--font-body)' }}
        />
      </div>
    </form>
  );
}
