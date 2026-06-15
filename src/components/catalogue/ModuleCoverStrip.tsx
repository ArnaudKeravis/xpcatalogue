'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { pickModuleVisual } from '@/lib/data/moduleVisuals';
import type { Module } from '@/lib/data/types';

/** Sodexo module frame — source art is 4620×2000 (≈2.31:1). */
export const MODULE_COVER_ASPECT = 'aspect-[231/100]';

interface Props {
  module: Module;
  className?: string;
}

/**
 * Wide cover strip for module cards — shows the Excel-mapped tile image when
 * available, otherwise the catalogue-blue icon fallback used before assets shipped.
 */
export function ModuleCoverStrip({ module, className }: Props) {
  const { Icon, weight } = pickModuleVisual(module);
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(module.coverImage) && !failed;

  return (
    <div
      className={cn(
        'relative w-full shrink-0 overflow-hidden bg-[var(--blue)]',
        MODULE_COVER_ASPECT,
        className,
      )}
      aria-hidden
    >
      {showImage ? (
        <img
          src={module.coverImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon size={18} weight={weight} className="text-white/95" />
        </div>
      )}
    </div>
  );
}
