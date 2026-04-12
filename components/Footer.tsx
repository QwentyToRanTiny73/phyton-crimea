import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-green-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-serif font-semibold text-white">Фитон</span>
              <span className="text-2xl font-serif font-light text-brand-gold">Крым</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Натуральная косметика ручной работы из Крыма. Производим с любовью к природе с 2009 года.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-serif text-lg text-brand-gold mb-4">Навигация</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Главная" },
                { href: "/catalog", label: "Каталог" },
                { href: "/about", label: "О бренде" },
                { href: "/contacts", label: "Контакты" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-serif text-lg text-brand-gold mb-4">Контакты</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <span className="block text-white/50 text-xs uppercase tracking-wide mb-0.5">Email</span>
                <a href="mailto:crimean.soap@gmail.com" className="hover:text-white transition-colors">
                  crimean.soap@gmail.com
                </a>
              </li>
              <li>
                <span className="block text-white/50 text-xs uppercase tracking-wide mb-0.5">Купить</span>
                <a
                  href="https://www.ozon.ru/seller/fiton-krym"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Магазин на Ozon
                </a>
              </li>
              <li>
                <span className="block text-white/50 text-xs uppercase tracking-wide mb-0.5">Производство</span>
                <span>Республика Крым</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Фитон Крым. Все права защищены.</p>
          <a
            href="https://www.ozon.ru/seller/fiton-krym"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-xs py-1.5 px-4"
          >
            Перейти в магазин Ozon
          </a>
        </div>
      </div>
    </footer>
  );
}
