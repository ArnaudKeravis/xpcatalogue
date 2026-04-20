import { NextResponse } from 'next/server';
import { getCatalogueData } from '@/lib/notion';
import { globalSearch } from '@/lib/queries/globalSearch';

export const revalidate = 3600;

/**
 * GET /api/search?q=<term>
 *
 * Runs a unified search across solutions, modules, personas, and journey moments.
 * The catalogue itself is cached via `getCatalogueData`'s ISR, so this handler
 * only pays the search cost per request.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') ?? '').trim();

  if (!q || q.length < 2) {
    return NextResponse.json({
      q,
      solutions: [],
      modules: [],
      personas: [],
      moments: [],
      total: 0,
    });
  }

  const data = await getCatalogueData();
  const result = globalSearch(data, q);

  // Cache aggressively at the edge — catalogue only changes hourly.
  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
    },
  });
}
