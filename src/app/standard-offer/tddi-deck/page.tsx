import type { Metadata } from 'next';
import { TddiStandardOfferDeck } from '@/components/standard-offer/TddiStandardOfferDeck';

/** Full-motion mirror of *TDDI_Standard offer.pptx*. Linked from footer only — not surfaced in primary nav. */
export const metadata: Metadata = {
  title: 'TDDI Standard Offer — immersive story',
  description:
    'Visual, parallax-forward Spark narrative covering Food, Hospitality, Workplace / FM, foundations, and innovation — distilled on screen with full speaker notes available on demand.',
  robots: { index: false, follow: true },
};

export default function TddiDeckPage() {
  return <TddiStandardOfferDeck />;
}
