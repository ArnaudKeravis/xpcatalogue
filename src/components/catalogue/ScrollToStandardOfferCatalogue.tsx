'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const ANCHOR_ID = 'solutions-catalogue';

/**
 * When landing on `/solutions?collection=standard-offer`, scroll past the embedded
 * Standard Offer story so filters + grid appear first (option B: narrative stays,
 * catalogue is where the eye lands).
 */
export function ScrollToStandardOfferCatalogue() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const collection = searchParams.get('collection');

  useEffect(() => {
    if (pathname !== '/solutions') return;
    if (collection !== 'standard-offer') return;

    const el = document.getElementById(ANCHOR_ID);
    if (!el) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const timer = window.setTimeout(() => {
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }, 16);

    return () => window.clearTimeout(timer);
  }, [pathname, collection]);

  return null;
}
