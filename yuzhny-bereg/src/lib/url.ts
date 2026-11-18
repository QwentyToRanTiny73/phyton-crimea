/**
 * Построение внутренних ссылок с учётом base path.
 * Сайт публикуется в подкаталоге GitHub Pages (/<репозиторий>/), поэтому любые внутренние ссылки
 * и пути к файлам из public/ нужно строить только через эти функции.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

export function url(path = '/'): string {
  if (EXTERNAL.test(path)) return path;
  const match = /^([^?#]*)(.*)$/.exec(path);
  let pathname = match?.[1] ?? '/';
  const suffix = match?.[2] ?? '';
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  const isFile = /\.[a-z0-9]{2,5}$/i.test(pathname);
  if (!isFile && !pathname.endsWith('/')) pathname += '/';
  return `${BASE}${pathname}${suffix}`;
}

type Query = Record<string, string | undefined>;

function withQuery(path: string, query?: Query): string {
  if (!query) return url(path);
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) if (v) params.set(k, v);
  const qs = params.toString();
  return url(qs ? `${path}?${qs}` : path);
}

export const routes = {
  home: () => url('/'),
  catalog: (query?: Query) => withQuery('/katalog/', query),
  listing: (slug: string) => url(`/obekty/${slug}/`),
  categories: () => url('/kategorii/'),
  category: (slug: string) => url(`/kategorii/${slug}/`),
  geography: () => url('/geografiya/'),
  settlement: (slug: string) => url(`/geografiya/${slug}/`),
  events: (query?: Query) => withQuery('/afisha/', query),
  event: (slug: string) => url(`/afisha/${slug}/`),
  guides: () => url('/podborki/'),
  guide: (slug: string) => url(`/podborki/${slug}/`),
  suggest: () => url('/predlozhit/'),
  about: () => url('/o-proekte/'),
  sources: () => url('/istochniki/'),
} as const;

/** Абсолютный URL для canonical, Open Graph и sitemap. */
export function absoluteUrl(pathOrUrl: string, site: URL | undefined): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  if (!site) throw new Error('В astro.config.mjs не задан site — абсолютные URL невозможны');
  return new URL(pathOrUrl, site).href;
}
