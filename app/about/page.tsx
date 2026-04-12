import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "О бренде — история и философия",
  description:
    "Узнайте историю бренда Фитон Крым. Натуральная косметика ручной работы с 2009 года. Крымские травы, авторские рецептуры биохимика, производство в Крыму.",
  openGraph: {
    title: "О бренде Фитон Крым",
    description: "История и философия натуральной косметики Фитон Крым с 2009 года.",
  },
};

const timeline = [
  {
    year: "2009",
    title: "Начало пути",
    desc: "Бренд основан в Крыму биохимиком, влюблённым в уникальную крымскую природу. Первые рецептуры разрабатывались исключительно для семьи и близких.",
  },
  {
    year: "2012",
    title: "Первые продажи",
    desc: "После многочисленных положительных отзывов от друзей и знакомых бренд начал официальные продажи. Первыми хитами стали бальзамы на крымских травах.",
  },
  {
    year: "2016",
    title: "Расширение ассортимента",
    desc: "В каталог добавлено натуральное мыло холодного отжима, бальзамы для губ и монастырские рецептуры. Производство по-прежнему остаётся ручным.",
  },
  {
    year: "2020",
    title: "Выход на Ozon",
    desc: "Продукция Фитон Крым появилась на маркетплейсе Ozon, открыв доступ к покупателям по всей России.",
  },
  {
    year: "2024",
    title: "Сегодня",
    desc: "Более 50 позиций в каталоге, тысячи довольных покупателей по всей стране, и неизменная преданность натуральным ингредиентам.",
  },
];

const values = [
  {
    title: "Крымская природа",
    desc: "Мы используем растения, выращенные или собранные в Крыму: горную лаванду, крымскую розу, можжевельник, аир, полынь и десятки других целебных трав.",
    icon: "🌿",
  },
  {
    title: "Научный подход",
    desc: "Каждая рецептура разработана дипломированным биохимиком. Мы изучаем свойства компонентов, их взаимодействие и биодоступность для кожи.",
    icon: "🧪",
  },
  {
    title: "Ручное производство",
    desc: "Небольшие партии, ручной труд, контроль качества на каждом этапе. Мы не гонимся за объёмами — нам важно качество каждого флакона.",
    icon: "🤲",
  },
  {
    title: "Честный состав",
    desc: "Никаких скрытых компонентов. В наших продуктах нет парабенов, SLS, синтетических отдушек и красителей. Только то, что указано на этикетке.",
    icon: "✅",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-brand-green py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 C22 0 0 22 0 50 C0 78 22 100 50 100 C78 100 100 78 100 50 C100 22 78 0 50 0 Z M50 80 C33 80 20 67 20 50 C20 33 33 20 50 20 C67 20 80 33 80 50 C80 67 67 80 50 80 Z' fill='%23ffffff'/%3E%3C/svg%3E")`,
            backgroundSize: "200px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="text-white/60 text-sm mb-8 flex items-center gap-2 justify-center">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <span className="text-white">О бренде</span>
          </nav>
          <p className="text-brand-gold font-medium tracking-widest text-sm uppercase mb-4">История и философия</p>
          <h1 className="font-serif text-5xl md:text-6xl text-white mb-6 leading-tight">
            О бренде
            <span className="block italic text-brand-gold">Фитон Крым</span>
          </h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto leading-relaxed">
            Мы создаём косметику, которая уважает природу и заботится о вашей коже. С 2009 года и по сей день.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-title">Наша история</h2>
              <div className="space-y-5 text-gray-600 leading-relaxed text-lg">
                <p>
                  Бренд «Фитон Крым» родился из искренней любви к крымской природе и желания создавать по-настоящему полезную косметику. Основатель бренда — дипломированный биохимик, который убеждён: лучшее, что может предложить современная косметика, уже давно создано самой природой.
                </p>
                <p>
                  Крым — уникальное место. Здесь горная лаванда соседствует с морским побережьем, степные травы — с реликтовыми лесами. Этот уникальный климат и разнообразие экосистем создают растения с исключительными свойствами.
                </p>
                <p>
                  Мы собираем травы в проверенных местах, используем эфирные масла холодного отжима и разрабатываем рецептуры так, чтобы каждый компонент работал на результат. Никаких наполнителей, никакой «воды».
                </p>
              </div>
            </div>

            <div className="bg-brand-beige rounded-3xl p-8">
              <blockquote className="text-brand-green-dark text-xl font-serif italic leading-relaxed mb-6">
                «Хорошая косметика не должна содержать то, что вы не можете произнести вслух. Наши составы — это то, что можно понять и объяснить ребёнку.»
              </blockquote>
              <p className="text-brand-gold font-medium">— Основатель Фитон Крым</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-brand-beige">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center">Наш путь</h2>
          <p className="section-subtitle text-center">Каждый год — новый шаг к совершенству</p>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-brand-gold/30 -translate-x-0.5" />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div
                  key={item.year}
                  className={`relative flex gap-6 md:gap-0 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Year bubble */}
                  <div className="relative z-10 flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2 w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-serif font-bold text-sm text-center leading-tight">
                      {item.year}
                    </span>
                  </div>

                  {/* Content */}
                  <div className={`md:w-5/12 ${i % 2 === 0 ? "md:pr-12" : "md:pl-12 md:ml-auto"} ml-8 md:ml-0`}>
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <h3 className="font-serif text-xl text-brand-green-dark mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Наши принципы</h2>
            <p className="section-subtitle">То, что не изменится никогда</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="bg-brand-beige rounded-2xl p-6 text-center">
                <div className="text-5xl mb-4">{v.icon}</div>
                <h3 className="font-serif text-xl text-brand-green-dark mb-3">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-green text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-serif text-4xl text-white mb-4">
            Убедитесь сами
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Попробуйте нашу косметику и почувствуйте разницу.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/catalog" className="btn-gold text-base px-8 py-4">
              Смотреть каталог
            </Link>
            <a
              href="https://www.ozon.ru/seller/fiton-krym"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline border-white text-white hover:bg-white hover:text-brand-green text-base px-8 py-4"
            >
              Купить на Ozon
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
