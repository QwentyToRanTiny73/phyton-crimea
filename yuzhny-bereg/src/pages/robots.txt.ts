import type { APIRoute } from 'astro';
import { absoluteUrl, url } from '@/lib/url';

/**
 * Для сайта в подкаталоге GitHub Pages поисковики читают robots.txt только в корне домена,
 * поэтому файл начинает действовать после подключения собственного домена (BASE_PATH=/).
 */
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl(url('/sitemap.xml'), site)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
