'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { categories } from '@/lib/data/categories';

export function CategoryNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      <Link
        href="/catalog"
        className={cn(
          'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
          pathname === '/catalog'
            ? 'bg-brand-green text-white'
            : 'bg-brand-beige text-gray-600 hover:bg-brand-beige-dark'
        )}
      >
        Все товары
      </Link>
      {categories.map((cat) => {
        const href = `/catalog/${cat.slug}`;
        const active = pathname === href;
        return (
          <Link
            key={cat.id}
            href={href}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
              active
                ? 'bg-brand-green text-white'
                : 'bg-brand-beige text-gray-600 hover:bg-brand-beige-dark'
            )}
          >
            {cat.name}
          </Link>
        );
      })}
    </nav>
  );
}
