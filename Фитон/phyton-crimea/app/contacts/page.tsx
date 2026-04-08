import type { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Свяжитесь с нами: адрес, телефон, email. Фитон Крым — натуральная косметика.',
};

export default function ContactsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="section-title">Контакты</h1>
        <p className="section-subtitle">Мы рады ответить на любые вопросы</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact info */}
        <div className="space-y-6">
          {[
            {
              icon: MapPin,
              title: 'Адрес производства',
              lines: ['Республика Крым, г. Симферополь', 'ул. Производственная, д. 1'],
            },
            {
              icon: Phone,
              title: 'Телефон',
              lines: ['+7 (978) 000-00-00', 'Пн–Пт: 9:00 – 18:00'],
            },
            {
              icon: Mail,
              title: 'E-mail',
              lines: ['info@phytoncrimea.ru', 'Ответим в течение 24 часов'],
            },
            {
              icon: Clock,
              title: 'Режим работы',
              lines: ['Понедельник – Пятница: 9:00 – 18:00', 'Суббота – Воскресенье: выходной'],
            },
          ].map(({ icon: Icon, title, lines }) => (
            <div
              key={title}
              className="flex items-start gap-5 bg-brand-beige rounded-2xl p-5"
            >
              <div className="bg-brand-green/10 rounded-xl p-3 shrink-0">
                <Icon className="w-6 h-6 text-brand-green" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                {lines.map((line) => (
                  <p key={line} className="text-sm text-gray-600">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-brand-beige-dark">
          <h2 className="font-serif font-semibold text-xl text-gray-800 mb-6">
            Написать нам
          </h2>
          <form
            action="mailto:info@phytoncrimea.ru"
            method="GET"
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Ваше имя
              </label>
              <input
                type="text"
                name="name"
                placeholder="Анна Иванова"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                placeholder="anna@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Сообщение
              </label>
              <textarea
                name="body"
                rows={5}
                placeholder="Ваш вопрос или предложение..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-green text-white font-medium py-3.5 rounded-full hover:bg-brand-green-dark transition-colors"
            >
              Отправить сообщение
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
