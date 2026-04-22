'use client';

import { useTransition } from 'react';
import { DownloadCta } from '@/components/ui/DownloadCta';
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
    <DownloadCta
      label="Download journey"
      pending={exporting}
      onClick={handleDownload}
    />
  );
}
