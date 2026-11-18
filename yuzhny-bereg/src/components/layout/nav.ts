import { routes } from '@/lib/url';

export const NAV_ITEMS = [
  { href: routes.catalog(), label: 'Каталог', match: '/katalog/' },
  { href: routes.categories(), label: 'Категории', match: '/kategorii/' },
  { href: routes.geography(), label: 'География', match: '/geografiya/' },
  { href: routes.events(), label: 'Афиша', match: '/afisha/' },
  { href: routes.guides(), label: 'Подборки', match: '/podborki/' },
] as const;
