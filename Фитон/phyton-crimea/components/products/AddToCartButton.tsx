'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import type { Product } from '@/types';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  function handleAdd() {
    if (!product.inStock) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  }

  return (
    <button
      onClick={handleAdd}
      disabled={!product.inStock || added}
      className={`flex items-center justify-center gap-3 w-full py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
        added
          ? 'bg-green-500 text-white'
          : product.inStock
          ? 'bg-brand-green text-white hover:bg-brand-green-dark'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
      }`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" />
          Добавлено в корзину
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          {product.inStock ? 'В корзину' : 'Нет в наличии'}
        </>
      )}
    </button>
  );
}
