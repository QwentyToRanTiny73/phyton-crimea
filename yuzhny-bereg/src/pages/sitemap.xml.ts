import type { APIRoute } from 'astro';
import { getCatalog } from '@/lib/catalog';
import { isoDate } from '@/lib/format';
import { absoluteUrl, routes } from '@/lib/url';

/** Карта сайта: только индексируемые страницы — демо-записи и 404 исключены. */
export const GET: APIRoute = async ({ site }) => {
  const catalog = await getCatalog();
  const latest = (dates: Date[]) => isoDate(new Date(Math.max(...dates.map((d) => d.getTime()))));
  const allDates = [...catalog.listings, ...catalog.events].map((x) => x.updatedAt);

  const entries: { loc: string; lastmod?: string }[] = [
    { loc: routes.home(), lastmod: latest(allDates) },
    { loc: routes.catalog(), lastmod: latest(catalog.listings.map((l) => l.updatedAt)) },
    { loc: routes.categories() },
    { loc: routes.geography() },
    { loc: routes.events(), lastmod: latest(catalog.events.map((e) => e.updatedAt)) },
    { loc: routes.guides() },
    { loc: routes.suggest() },
    { loc: routes.about() },
    { loc: routes.sources() },
    ...catalog.categories.map((c) => ({ loc: routes.category(c.slug) })),
    ...catalog.settlements.map((s) => ({ loc: routes.settlement(s.slug) })),
    ...catalog.guides.map((g) => ({ loc: routes.guide(g.slug), lastmod: isoDate(g.updatedAt) })),
    ...catalog.listings.filter((l) => !l.demo).map((l) => ({ loc: routes.listing(l.slug), lastmod: isoDate(l.updatedAt) })),
    ...catalog.events.filter((e) => !e.demo).map((e) => ({ loc: routes.event(e.slug), lastmod: isoDate(e.updatedAt) })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map((e) => `  <url><loc>${absoluteUrl(e.loc, site)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</url>`)
  .join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
