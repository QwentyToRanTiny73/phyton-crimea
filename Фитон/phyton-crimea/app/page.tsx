import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Award, MapPin, Clock } from 'lucide-react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { getBestsellers } from '@/lib/data/products';
import { categories } from '@/lib/data/categories';

export default function HomePage() {
  const bestsellers = getBestsellers();

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1400&q=85"
            alt="Натуральная косметика Фитон Крым"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/85 via-brand-green-dark/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white text-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <Leaf className="w-4 h-4 text-brand-gold" />
              <span>100% натуральные ингредиенты</span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Крымская
              <span className="block text-brand-gold">природа</span>
              для вашей кожи
            </h1>

            <p className="text-lg text-gray-200 leading-relaxed mb-10 max-w-xl">
              Натуральная косметика из трав и растений Крымского полуострова. Создаём
              с 2009 года. Без парабенов, SLS и синтетических ароматизаторов.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="bg-brand-gold text-white font-medium px-8 py-4 rounded-full hover:bg-brand-gold-light transition-colors text-lg"
              >
                Перейти в каталог
              </Link>
              <Link
                href="/about"
                className="border-2 border-white text-white font-medium px-8 py-4 rounded-full hover:bg-white hover:text-brand-green-dark transition-colors text-lg"
              >
                О бренде
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS STRIP ───────────────────────────────────────────────── */}
      <section className="bg-brand-beige py-10 border-y border-brand-beige-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: '100% Натуральные', sub: 'Только природные компоненты' },
              { icon: Award, title: 'Без вредных добавок', sub: 'Без парабенов и SLS' },
              { icon: MapPin, title: 'Сделано в Крыму', sub: 'Собственное производство' },
              { icon: Clock, title: 'С 2009 года', sub: 'Проверено временем' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="bg-brand-green/10 rounded-xl p-3 shrink-0">
                  <Icon className="w-6 h-6 text-brand-green" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Категории</h2>
            <p className="section-subtitle">
              Найдите идеальные средства для вашего типа кожи и волос
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog/${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
              >
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="font-serif font-semibold text-white text-lg leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-gray-300 text-xs mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BESTSELLERS ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-brand-beige/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Хиты продаж</h2>
              <p className="text-gray-500 mt-2">Самые популярные средства нашего бренда</p>
            </div>
            <Link
              href="/catalog"
              className="hidden md:block text-brand-green font-medium hover:text-brand-green-dark transition-colors text-sm"
            >
              Все товары →
            </Link>
          </div>
          <ProductGrid products={bestsellers} />
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/catalog"
              className="text-brand-green font-medium hover:text-brand-green-dark transition-colors"
            >
              Все товары →
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT BRAND ──────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=85"
                  alt="Производство Фитон Крым"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-brand-gold text-white rounded-2xl p-6 shadow-lg">
                <p className="text-4xl font-serif font-bold">15+</p>
                <p className="text-sm mt-1 opacity-90">лет на рынке</p>
              </div>
            </div>

            <div>
              <span className="inline-block text-brand-green text-sm font-semibold uppercase tracking-widest mb-4">
                О бренде
              </span>
              <h2 className="section-title mb-6">
                Крымская природа — наш главный ингредиент
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                С 2009 года компания «Фитон Крым» создаёт натуральную косметику на
                основе уникальной крымской флоры. Мы самостоятельно собираем и
                перерабатываем лаванду, розу, чабрец, мяту и другие ароматические
                растения.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Вся продукция изготавливается на собственном производстве в Крыму
                без использования парабенов, SLS, синтетических красителей и
                ароматизаторов. Мы верим, что природа знает лучше.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { value: '50+', label: 'видов продукции' },
                  { value: '100%', label: 'натуральный состав' },
                  { value: '10 000+', label: 'довольных клиентов' },
                  { value: '0', label: 'вредных добавок' },
                ].map(({ value, label }) => (
                  <div key={label} className="bg-brand-beige rounded-xl p-4">
                    <p className="font-serif font-bold text-2xl text-brand-green">
                      {value}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-brand-green text-white font-medium px-8 py-3.5 rounded-full hover:bg-brand-green-dark transition-colors"
              >
                Подробнее о нас
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="bg-brand-green py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Также доступны на Ozon
          </h2>
          <p className="text-gray-200 mb-8 text-lg leading-relaxed">
            Заказывайте нашу продукцию через любимый маркетплейс с быстрой доставкой
            по всей России
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/catalog"
              className="bg-white text-brand-green font-medium px-8 py-4 rounded-full hover:bg-brand-beige transition-colors text-lg"
            >
              Купить на нашем сайте
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
