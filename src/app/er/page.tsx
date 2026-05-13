import { headers } from 'next/headers';
import { CatalogueHome } from '@/components/home/CatalogueHome';
import { readErLinkMode } from '@/lib/erNav';
import { getCatalogueData } from '@/lib/notion';

export const revalidate = 3600;

/** Canonical E&R entry on the main host: same experience as the dedicated subdomain home. */
export default async function ErPathRootPage() {
  const data = await getCatalogueData();
  return <CatalogueHome data={data} erLinkMode={readErLinkMode(headers())} />;
}
