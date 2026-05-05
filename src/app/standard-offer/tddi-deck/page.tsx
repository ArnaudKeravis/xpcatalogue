import type { Metadata } from 'next';
import { TddiStandardOfferDeck } from '@/components/standard-offer/TddiStandardOfferDeck';

/** Full-motion mirror of *TDDI_Standard offer.pptx*. Linked from footer only — not surfaced in primary nav. */
export const metadata: Metadata = {
  title: 'TDDI Standard Offer — full deck',
  description:
    'Parallax storytelling experience synced to the TDDI Standard Offer PowerPoint — Spark narrative, Food, Hospitality, Workplace / FM, tech foundations, and innovation.',
  robots: { index: false, follow: true },
};

export default function TddiDeckPage() {
  return <TddiStandardOfferDeck />;
}
