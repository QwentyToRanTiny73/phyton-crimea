import Link from 'next/link';
import { Leaf, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-green-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-brand-gold" />
              <span className="font-serif font-bold text-xl">Фитон Крым</span>
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              Натуральная косметика из крымских трав и растений. Производим с 2009 года
              с любовью к природе и человеку.
            </p>
          </div>

          {/* Catalog */}
          <div>
            <h3 className="font-semibold text-brand-gold mb-4 text-sm uppercase tracking-wide">
              Каталог
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {[
                { href: '/catalog/face', label: 'Уход за лицом' },
                { href: '/catalog/body', label: 'Уход за телом' },
                { href: '/catalog/hair', label: 'Уход за волосами' },
                { href: '/catalog/soap', label: 'Натуральное мыло' },
                { href: '/catalog/oils', label: 'Эфирные масла' },
                { href: '/catalog/sets', label: 'Подарочные наборы' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-brand-gold mb-4 text-sm uppercase tracking-wide">
              Информация
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {[
                { href: '/about', label: 'О бренде' },
                { href: '/contacts', label: 'Контакты' },
                { href: '/catalog', label: 'Все товары' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-semibold text-brand-gold mb-4 text-sm uppercase tracking-wide">
              Контакты
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-gold shrink-0" />
                <span>Республика Крым, г. Симферополь</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <a href="tel:+79780000000" className="hover:text-brand-gold transition-colors">
                  +7 (978) 000-00-00
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <a
                  href="mailto:info@phytoncrimea.ru"
                  className="hover:text-brand-gold transition-colors"
                >
                  info@phytoncrimea.ru
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2009–2026 Фитон Крым. Все права защищены.</p>
          <p>ИНН 9102XXXXXX | ОГРН 10901XXXXXXX</p>
        </div>
      </div>
    </footer>
  );
}
