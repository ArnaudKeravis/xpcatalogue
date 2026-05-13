import { CatalogueHome } from '@/components/home/CatalogueHome';
import { readErLinkMode } from '@/lib/erNav';
import { getCatalogueData } from '@/lib/notion';

export const revalidate = 3600;

export default async function HomePage() {
  const data = await getCatalogueData();
  return <CatalogueHome data={data} erLinkMode="global" />;
}
