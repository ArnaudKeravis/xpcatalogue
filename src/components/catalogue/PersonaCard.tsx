'use client';

import { User } from '@phosphor-icons/react';
import Link from 'next/link';
import type { Persona } from '@/lib/data/types';
import { resolvePersonaImage } from '@/lib/data/personaImageResolve';

interface Props {
  persona: Persona;
  href: string;
}

export function PersonaCard({ persona, href }: Props) {
  const portraitSrc = resolvePersonaImage('listing', persona.id, persona.photo);

  return (
    <Link
      href={href}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--grey-border)] bg-white shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      {/* Portrait */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-b from-[#e8eefb] to-[#c5d2f0]">
        {portraitSrc ? (
          <img
            src={portraitSrc}
            alt={persona.name}
            className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain object-bottom transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center"
            style={{ background: `${persona.color}15` }}
          >
            <User size={72} weight="duotone" color={persona.color} aria-hidden />
          </div>
        )}
        {/* Gradient overlay at bottom */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-10"
          style={{ background: `linear-gradient(to top, ${persona.color}cc, transparent)` }}
        />
      </div>

      {/* Name bar */}
      <div
        className="flex items-center justify-between px-3 py-2.5"
        style={{ background: persona.color }}
      >
        <span
          className="text-sm font-bold leading-tight text-white"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {persona.name}
        </span>
        <span className="ml-1 shrink-0 text-white/80 transition-transform duration-200 group-hover:translate-x-0.5">
          →
        </span>
      </div>
    </Link>
  );
}
