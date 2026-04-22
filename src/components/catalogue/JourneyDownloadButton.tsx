'use client';

import { useTransition } from 'react';
import { DownloadSimple } from '@phosphor-icons/react';
import type { AreaConfig, JourneyStep, Persona } from '@/lib/data/types';

interface Props {
  persona: Persona;
  area?: AreaConfig;
  steps: JourneyStep[];
  imageUrl: string;
}

export function JourneyDownloadButton({ persona, area, steps, imageUrl }: Props) {
  const [exporting, startExport] = useTransition();

  const handleDownload = () => {
    startExport(async () => {
      const { exportJourneyToPptx } = await import('@/lib/export/pptJourney');
      await exportJourneyToPptx({ persona, area, steps, imageUrl });
    });
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={exporting}
      aria-live="polite"
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--grey-border)] bg-white px-4 py-2 text-xs font-semibold text-[var(--blue)] shadow-[var(--shadow-sm)] transition-[transform,border-color,background-color] duration-[var(--motion-base)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-[var(--blue-primary)] hover:bg-[var(--icon-bg)] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-primary)]"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <DownloadSimple size={14} weight="bold" aria-hidden />
      {exporting ? 'Preparing slide…' : 'Download journey (.pptx)'}
    </button>
  );
}
