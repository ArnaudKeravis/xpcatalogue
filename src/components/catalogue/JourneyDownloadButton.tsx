'use client';

import { useTransition } from 'react';
import { DownloadCta } from '@/components/ui/DownloadCta';
import type { AreaConfig, JourneyHotspot, JourneyStep, Persona } from '@/lib/data/types';

interface Props {
  persona: Persona;
  area?: AreaConfig;
  steps: JourneyStep[];
  imageUrl: string;
  journeyHotspots?: JourneyHotspot[];
}

export function JourneyDownloadButton({
  persona,
  area,
  steps,
  imageUrl,
  journeyHotspots,
}: Props) {
  const [exporting, startExport] = useTransition();

  const handleDownload = () => {
    startExport(async () => {
      const { exportJourneyToPptx } = await import('@/lib/export/pptJourney');
      await exportJourneyToPptx({
        persona,
        area,
        steps,
        imageUrl,
        journeyHotspots,
      });
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
