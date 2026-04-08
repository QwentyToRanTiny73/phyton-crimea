import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Award, Heart, Sprout } from 'lucide-react';

export const metadata: Metadata = {
  title: 'О бренде',
  description:
    'История бренда Фитон Крым — натуральная косметика из крымских трав с 2009 года. Узнайте о наших ценностях и производстве.',
};

const values = [
  {
    icon: Leaf,
    title: 'Натуральность',
    text: 'Только природные ингредиенты из экологически чистых районов Крыма. Никаких искусственных красителей, парабенов и SLS.',
  },
  {
    icon: Sprout,
    title: 'Экологичность',
    text: 'Бережное отношение к природе на каждом этапе: от сбора трав до экологичной упаковки.',
  },
  {
    icon: Heart,
    title: 'Забота о коже',
    text: 'Каждое средство разрабатывается с учётом потребностей кожи, подтверждено дерматологическими тестами.',
  },
  {
    icon: Award,
    title: 'Качество',
    text: 'Строгий контроль на всех этапах производства. Сертифицированная продукция, соответствующая ГОСТ.',
  },
];

const milestones = [
  { year: '2009', text: 'Основание компании, первые эфирные масла крымской лаванды' },
  { year: '2012', text: 'Расширение линейки — уход за лицом и телом' },
  { year: '2015', text: 'Собственное производство в Симферополе' },
  { year: '2018', text: 'Запуск линейки мыла ручной работы' },
  { year: '2021', text: 'Выход на федеральные маркетплейсы — Ozon и Wildberries' },
  { year: '2024', text: 'Более 50 наименований продукции, 10 000+ клиентов' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85"
          alt="Крымские травы — основа Фитон Крым"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-green-dark/70" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
            О бренде Фитон Крым
          </h1>
          <p className="text-gray-200 text-lg max-w-xl">
            Натуральная косметика из Крыма с 2009 года
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-brand-green text-sm font-semibold uppercase tracking-widest">
                Наша история
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mt-3 mb-6">
                Рождённые природой Крыма
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Компания «Фитон Крым» основана в 2009 году группой энтузиастов,
                  влюблённых в уникальную природу Крымского полуострова. Всё началось
                  с маленькой мастерской по перегонке эфирного масла лаванды из
                  собственного поля в предгорье Крыма.
                </p>
                <p>
                  За эти годы мы выросли в полноценное косметическое производство, не
                  изменив главному принципу: использовать только то, что даёт нам
                  крымская природа. Лаванда, роза, мята, чабрец, шалфей, виноград —
                  это не просто ингредиенты, это история каждого флакона.
                </p>
                <p>
                  Сегодня в нашем ассортименте более 50 наименований: кремы и сыворотки
                  для лица, масла и молочко для тела, шампуни и маски для волос,
                  натуральное мыло ручной работы, чистые эфирные масла. Вся продукция
                  сертифицирована и прошла дерматологические тесты.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80"
                  alt="Продукция Фитон Крым"
                  width={300}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden mt-8">
                <Image
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80"
                  alt="Уход за лицом Фитон Крым"
                  width={300}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-brand-beige/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Наши ценности</h2>
            <p className="section-subtitle">То, что делает нашу косметику особенной</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-brand-green" />
                </div>
                <h3 className="font-serif font-semibold text-gray-800 text-lg mb-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Наш путь</h2>
            <p className="section-subtitle">15 лет навстречу природной красоте</p>
          </div>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-brand-beige-dark hidden sm:block" />
            <div className="space-y-8">
              {milestones.map(({ year, text }) => (
                <div key={year} className="flex gap-6 items-start">
                  <div className="w-14 shrink-0 text-right">
                    <span className="font-serif font-bold text-brand-green text-lg">
                      {year}
                    </span>
                  </div>
                  <div className="hidden sm:flex w-4 h-4 rounded-full bg-brand-green border-4 border-white shadow-md mt-1 shrink-0 relative z-10" />
                  <div className="flex-1 bg-brand-beige rounded-xl px-5 py-4">
                    <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-green py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Откройте для себя крымскую природу
          </h2>
          <p className="text-gray-200 mb-8">
            Попробуйте нашу натуральную косметику и почувствуйте разницу
          </p>
          <Link
            href="/catalog"
            className="inline-block bg-brand-gold text-white font-medium px-10 py-4 rounded-full hover:bg-brand-gold-light transition-colors text-lg"
          >
            Перейти в каталог
          </Link>
        </div>
      </section>
    </div>
  );
}
