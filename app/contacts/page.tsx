import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Свяжитесь с Фитон Крым. Вопросы о продукции, оптовые заказы, обратная связь. Email: crimean.soap@gmail.com",
};

export default function ContactsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-green py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-white/60 text-sm mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <span className="text-white">Контакты</span>
          </nav>
          <h1 className="font-serif text-5xl md:text-6xl text-white mb-4">Контакты</h1>
          <p className="text-white/70 text-xl max-w-xl">
            Мы рады ответить на ваши вопросы о продукции, составе, применении и доставке.
          </p>
        </div>
      </section>

      {/* Contact info + links */}
      <section className="py-20 bg-brand-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Email */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm card-hover">
              <div className="text-5xl mb-4">✉️</div>
              <h3 className="font-serif text-xl text-brand-green-dark mb-2">Email</h3>
              <p className="text-gray-500 text-sm mb-4">Для вопросов о продукции и оптовых заказов</p>
              <a
                href="mailto:crimean.soap@gmail.com"
                className="text-brand-green font-medium hover:text-brand-gold transition-colors"
              >
                crimean.soap@gmail.com
              </a>
            </div>

            {/* Ozon */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm card-hover">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="font-serif text-xl text-brand-green-dark mb-2">Магазин Ozon</h3>
              <p className="text-gray-500 text-sm mb-4">Покупки, отзывы и вопросы продавцу</p>
              <a
                href="https://www.ozon.ru/seller/fiton-krym"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm py-2 px-6 inline-block"
              >
                Перейти в магазин
              </a>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm card-hover">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="font-serif text-xl text-brand-green-dark mb-2">Производство</h3>
              <p className="text-gray-500 text-sm mb-4">Крым, Россия</p>
              <p className="text-brand-green font-medium">Доставка по всей России</p>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl text-brand-green-dark mb-10 text-center">
              Часто задаваемые вопросы
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Где можно купить вашу продукцию?",
                  a: "Вся наша продукция доступна в официальном магазине на Ozon. Там же вы найдёте отзывы покупателей и сможете задать вопрос продавцу.",
                },
                {
                  q: "Есть ли срок годности у ваших продуктов?",
                  a: "Да, все наши продукты имеют указанный срок годности на упаковке. Как правило, 12–24 месяца с даты изготовления. Хранить рекомендуем в прохладном тёмном месте.",
                },
                {
                  q: "Подходит ли ваша косметика для чувствительной кожи?",
                  a: "Большинство наших продуктов подходит для чувствительной кожи, так как мы не используем синтетических отдушек и раздражающих компонентов. Тем не менее рекомендуем провести тест на внутренней стороне запястья перед первым применением.",
                },
                {
                  q: "Возможен ли оптовый заказ?",
                  a: "Да, мы работаем с оптовыми покупателями. Пишите нам на email с описанием вашего запроса, и мы ответим в течение 1–2 рабочих дней.",
                },
                {
                  q: "Используете ли вы животные компоненты?",
                  a: "В некоторых продуктах присутствует пчелиный воск и мёд — натуральные продукты пчеловодства. Мы не используем компоненты животного происхождения, связанные с жестоким обращением с животными.",
                },
              ].map((item) => (
                <details key={item.q} className="bg-white rounded-2xl p-6 shadow-sm group">
                  <summary className="font-serif text-lg text-brand-green-dark cursor-pointer list-none flex justify-between items-center">
                    {item.q}
                    <span className="text-brand-gold transition-transform group-open:rotate-45 flex-shrink-0 ml-4">+</span>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-green-dark text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-serif text-3xl text-white mb-4">
            Не нашли ответ?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Напишите нам на email и мы ответим на любой вопрос.
          </p>
          <a
            href="mailto:crimean.soap@gmail.com"
            className="btn-gold text-base px-8 py-4 inline-block"
          >
            Написать письмо
          </a>
        </div>
      </section>
    </>
  );
}
