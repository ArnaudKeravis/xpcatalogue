import { headers } from 'next/headers';
import { CatalogueHome } from '@/components/home/CatalogueHome';
import { readErSegment } from '@/lib/erNav';
import { getCatalogueData } from '@/lib/notion';

export const revalidate = 3600;

export default async function ErSegmentHomePage() {
  const data = await getCatalogueData();
  const erSegment = readErSegment(headers());
  return <CatalogueHome data={data} erSegment={erSegment} />;
}
