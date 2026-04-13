'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
        <h1 className="font-serif text-3xl font-bold text-gray-800 mb-3">
          Корзина пуста
        </h1>
        <p className="text-gray-500 mb-8">
          Добавьте товары из нашего каталога
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 bg-brand-green text-white font-medium px-8 py-4 rounded-full hover:bg-brand-green-dark transition-colors"
        >
          Перейти в каталог
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-800">Корзина</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-400 hover:text-red-600 transition-colors"
        >
          Очистить корзину
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-5 bg-white rounded-2xl p-5 shadow-sm border border-brand-beige-dark"
            >
              <Link href={`/product/${product.slug}`} className="shrink-0">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-brand-beige">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${product.slug}`}
                  className="font-semibold text-gray-800 hover:text-brand-green transition-colors leading-snug"
                >
                  {product.name}
                </Link>
                {product.volume && (
                  <p className="text-sm text-gray-400 mt-0.5">{product.volume}</p>
                )}
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                  {product.shortDescription}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1 border border-brand-beige-dark rounded-full overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-2 hover:bg-brand-beige text-gray-600 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-2 hover:bg-brand-beige text-gray-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-brand-green">
                      {formatPrice(product.price * quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-brand-beige rounded-2xl p-6 sticky top-24">
            <h2 className="font-serif font-semibold text-xl text-gray-800 mb-5">
              Сводка заказа
            </h2>

            <div className="space-y-3 mb-6">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 line-clamp-1 flex-1 mr-4">
                    {product.name} × {quantity}
                  </span>
                  <span className="font-medium text-gray-800 shrink-0">
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
              <p className="text-xs text-gray-400 mt-1">
                Доставка рассчитывается при оформлении
              </p>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full bg-brand-green text-white font-semibold py-4 rounded-full hover:bg-brand-green-dark transition-colors"
            >
              Оформить заказ
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/catalog"
              className="block text-center text-sm text-gray-500 hover:text-brand-green mt-3 transition-colors"
            >
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
