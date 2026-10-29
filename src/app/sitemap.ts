import type { MetadataRoute } from 'next';
import { NAV, SITE } from '@/config/site';
import { getAllGuides, getAllRaces } from '@/lib/content';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ['/', ...NAV.map(item => item.href)].map(path => ({ url: `${SITE.url}${path}` }));
  const races = getAllRaces().map(r => ({
    url: `${SITE.url}/races/${r.slug}/`,
    lastModified: r.date,
  }));
  const guides = getAllGuides().map(g => ({ url: `${SITE.url}/guides/${g.slug}/` }));
  return [...fixed, ...races, ...guides];
}
