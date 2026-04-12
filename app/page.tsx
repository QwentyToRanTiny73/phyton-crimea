import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "Фитон Крым — натуральная косметика из Крыма",
  description:
    "Натуральная косметика ручной работы из Крыма. Бальзамы, мыло, бальзамы для губ на основе крымских трав. Производство с 2009 года.",
};

const benefits = [
  {
    icon: "🌿",
    title: "100% натуральный состав",
    desc: "Только крымские травы, эфирные масла и природные компоненты. Без парабенов, SLS и синтетических отдушек.",
  },
  {
    icon: "🤲",
    title: "Ручное производство",
    desc: "Каждый продукт изготавливается вручную небольшими партиями, чтобы сохранить качество и пользу.",
  },
  {
    icon: "🌱",
    title: "С 2009 года",
    desc: "Более 15 лет мы изучаем силу крымских растений и создаём косметику, которая действительно работает.",
  },
  {
    icon: "🧪",
    title: "Научный подход",
    desc: "Рецептуры разрабатывает дипломированный биохимик с учётом свойств каждого компонента.",
  },
];

export default function HomePage() {
  const featured = getFeaturedProducts(6);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-brand-beige via-white to-brand-beige overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232E5E4E' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-up">
            <p className="text-brand-gold font-medium tracking-widest text-sm uppercase mb-4">
              Натуральная косметика из Крыма
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-brand-green-dark leading-tight mb-6">
              Сила крымской
              <span className="block text-brand-gold italic">природы</span>
              для вашей кожи
            </h1>
            <p className="text-gray-600 text-xl leading-relaxed mb-10 max-w-lg">
              Бальзамы, мыло и уходовая косметика ручной работы на основе крымских трав, эфирных масел и природных экстрактов.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/catalog" className="btn-primary text-base px-8 py-4">
                Смотреть каталог
              </Link>
              <a
                href="https://www.ozon.ru/seller/fiton-krym"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-base px-8 py-4"
              >
                Купить на Ozon
              </a>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-in">
            {featured.slice(0, 4).map((product, i) => (
              <Link
                key={product.id}
                href={`/catalog/${product.slug}`}
                className={`group relative rounded-2xl overflow-hidden aspect-square shadow-lg card-hover ${
                  i === 1 || i === 2 ? "mt-8" : ""
                }`}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 1024px) 0vw, 20vw"
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-medium text-sm">{product.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-brand-green/40">
          <span className="text-xs tracking-widest uppercase">Листать</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Почему Фитон Крым?</h2>
            <p className="section-subtitle">
              Мы создаём косметику, которой доверяем сами
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="text-center group">
                <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110 inline-block">
                  {b.icon}
                </div>
                <h3 className="font-serif text-lg text-brand-green-dark mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-brand-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Хиты продаж</h2>
            <p className="section-subtitle">
              Самые любимые средства наших покупателей
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/catalog" className="btn-outline text-base px-10 py-4">
              Весь каталог
            </Link>
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="py-20 bg-brand-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <p className="text-brand-gold font-medium tracking-widest text-sm uppercase mb-4">
                История бренда
              </p>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
                Крымская природа
                <span className="block italic text-brand-gold">в каждом флаконе</span>
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                С 2009 года мы изучаем уникальные свойства крымских растений и создаём косметику, которая работает. Наши рецептуры разработаны дипломированным биохимиком и основаны на многолетних исследованиях.
              </p>
              <p className="text-white/80 text-lg leading-relaxed mb-10">
                Каждый продукт — это маленькая история о Крыме: его горах, степях, морском побережье и целебных травах.
              </p>
              <Link href="/about" className="btn-gold text-base px-8 py-4">
                Узнать больше
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white/10 rounded-2xl p-6 text-white text-center">
                  <div className="font-serif text-5xl font-bold text-brand-gold">15+</div>
                  <div className="text-white/70 text-sm mt-1">лет опыта</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-6 text-white text-center">
                  <div className="font-serif text-5xl font-bold text-brand-gold">50+</div>
                  <div className="text-white/70 text-sm mt-1">позиций в каталоге</div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-white/10 rounded-2xl p-6 text-white text-center">
                  <div className="font-serif text-5xl font-bold text-brand-gold">100%</div>
                  <div className="text-white/70 text-sm mt-1">натуральный состав</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-6 text-white text-center">
                  <div className="font-serif text-5xl font-bold text-brand-gold">ручная</div>
                  <div className="text-white/70 text-sm mt-1">работа</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-beige-dark text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-serif text-4xl text-brand-green-dark mb-4">
            Готовы попробовать?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Вся наша продукция доступна на Ozon с быстрой доставкой по всей России.
          </p>
          <a
            href="https://www.ozon.ru/seller/fiton-krym"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-lg px-10 py-4"
          >
            Открыть магазин на Ozon
          </a>
        </div>
      </section>
    </>
  );
}
