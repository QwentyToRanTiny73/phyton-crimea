'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Leaf } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/about', label: 'О бренде' },
  { href: '/contacts', label: 'Контакты' },
];

export function Header() {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.count());
  const openCart = useCartStore((s) => s.openCart);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-brand-beige-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-brand-green font-serif font-bold text-xl hover:text-brand-green-dark transition-colors"
          >
            <Leaf className="w-6 h-6" />
            <span>Фитон Крым</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-200',
                  pathname.startsWith(link.href)
                    ? 'text-brand-green'
                    : 'text-gray-600 hover:text-brand-green'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              className="relative p-2 text-gray-600 hover:text-brand-green transition-colors"
              aria-label="Корзина"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-brand-green transition-colors"
              aria-label="Меню"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-brand-beige-dark px-4 py-4">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'text-base font-medium py-1 border-b border-brand-beige-dark',
                  pathname.startsWith(link.href)
                    ? 'text-brand-green'
                    : 'text-gray-700'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
