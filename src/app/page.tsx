import { getCatalogueData } from '@/lib/notion';
import { CatalogueHome } from '@/components/home/CatalogueHome';

export const revalidate = 3600;

export default async function HomePage() {
  const data = await getCatalogueData();
  return <CatalogueHome data={data} erSegment={false} />;
}
