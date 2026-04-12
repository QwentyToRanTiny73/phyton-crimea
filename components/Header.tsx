"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О бренде" },
  { href: "/contacts", label: "Контакты" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-brand-beige-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-serif font-semibold text-brand-green group-hover:text-brand-green-dark transition-colors">
              Фитон
            </span>
            <span className="text-2xl font-serif font-light text-brand-gold group-hover:text-brand-gold-light transition-colors">
              Крым
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-brand-green ${
                  pathname === link.href
                    ? "text-brand-green border-b-2 border-brand-gold pb-0.5"
                    : "text-gray-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://www.ozon.ru/seller/fiton-krym"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2 px-5"
            >
              Купить на Ozon
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-brand-green transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Меню"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-brand-beige-dark">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-base font-medium transition-colors hover:text-brand-green ${
                  pathname === link.href ? "text-brand-green" : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://www.ozon.ru/seller/fiton-krym"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm text-center"
              onClick={() => setMenuOpen(false)}
            >
              Купить на Ozon
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
