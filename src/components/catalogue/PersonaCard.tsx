'use client';

import Link from 'next/link';
import type { Persona } from '@/lib/data/types';

interface Props {
  persona: Persona;
  href: string;
}

export function PersonaCard({ persona, href }: Props) {
  return (
    <Link
      href={href}
      className="group block cursor-pointer overflow-hidden rounded-[var(--radius-xl)] transition-transform hover:-translate-y-1"
      style={{ boxShadow: 'var(--shadow-panel)' }}
    >
      {persona.photo ? (
        <div className="h-48 overflow-hidden">
          <img
            src={persona.photo}
            alt={persona.name}
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div
          className="flex h-48 items-center justify-center text-8xl"
          style={{ background: `${persona.color}18` }}
        >
          {persona.emoji}
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3" style={{ background: persona.color }}>
        <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          {persona.name}
        </span>
        <span
          className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[var(--blue-primary)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          GO →
        </span>
      </div>
    </Link>
  );
}
