'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice, generateOrderId } from '@/lib/utils';
import type { CheckoutFormData } from '@/types';

const initialForm: CheckoutFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  comment: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const [form, setForm] = useState<CheckoutFormData>(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/cart');
    }
  }, [items.length, router]);

  if (items.length === 0) return null;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const orderId = generateOrderId();
    clearCart();
    router.push(`/order/success?orderId=${orderId}`);
  }

  const Field = ({
    label,
    name,
    type = 'text',
    required = false,
    placeholder = '',
  }: {
    label: string;
    name: keyof CheckoutFormData;
    type?: string;
    required?: boolean;
    placeholder?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-colors"
      />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-green transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Вернуться в корзину
        </Link>
        <h1 className="font-serif text-3xl font-bold text-gray-800 mt-4">
          Оформление заказа
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-beige-dark">
              <h2 className="font-semibold text-gray-800 mb-5 text-lg">
                Контактные данные
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Имя" name="firstName" required placeholder="Анна" />
                <Field label="Фамилия" name="lastName" required placeholder="Иванова" />
                <Field
                  label="E-mail"
                  name="email"
                  type="email"
                  required
                  placeholder="anna@example.com"
                />
                <Field
                  label="Телефон"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+7 (900) 000-00-00"
                />
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-beige-dark">
              <h2 className="font-semibold text-gray-800 mb-5 text-lg">
                Адрес доставки
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field
                    label="Улица, дом, квартира"
                    name="address"
                    required
                    placeholder="ул. Ленина, д. 10, кв. 5"
                  />
                </div>
                <Field label="Город" name="city" required placeholder="Москва" />
                <Field
                  label="Индекс"
                  name="postalCode"
                  required
                  placeholder="123456"
                />
              </div>
            </div>

            {/* Comment */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-beige-dark">
              <h2 className="font-semibold text-gray-800 mb-5 text-lg">
                Комментарий к заказу
              </h2>
              <textarea
                name="comment"
                value={form.comment}
                onChange={handleChange}
                rows={3}
                placeholder="Пожелания, уточнения..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-colors resize-none"
              />
            </div>

            {/* Demo notice */}
            <div className="bg-brand-beige rounded-2xl p-5 flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-brand-green shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  Демо-режим
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Это демонстрационная версия сайта. Оплата и реальная обработка
                  заказов временно недоступны. После нажатия кнопки вы увидите
                  страницу подтверждения заказа.
                </p>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-brand-beige rounded-2xl p-6 sticky top-24">
              <h2 className="font-serif font-semibold text-xl text-gray-800 mb-5">
                Ваш заказ
              </h2>

              <div className="space-y-3 mb-5">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400">&times; {quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 shrink-0">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-beige-dark pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Итого:</span>
                  <span className="font-serif font-bold text-2xl text-brand-green">
                    {formatPrice(total())}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full bg-brand-green text-white font-semibold py-4 rounded-full hover:bg-brand-green-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                {loading ? 'Оформление...' : 'Оформить заказ'}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Нажимая «Оформить заказ», вы соглашаетесь с условиями продажи
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
