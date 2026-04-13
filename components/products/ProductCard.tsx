'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openCart();
  }

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-brand-beige">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Badges */}
          {product.isNew && <Badge label="Новинка" variant="new" />}
          {product.isBestseller && !product.isNew && (
            <Badge label="Хит продаж" variant="bestseller" />
          )}
          {product.oldPrice && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
              -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </span>
          )}

          {/* Add to cart overlay */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-0 inset-x-0 bg-brand-green text-white py-3 flex items-center justify-center gap-2 text-sm font-medium translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          >
            <ShoppingCart className="w-4 h-4" />
            В корзину
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
            {product.volume ?? product.weight ?? ''}
          </p>
          <h3 className="font-serif text-gray-800 font-semibold leading-snug mb-2 group-hover:text-brand-green transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
            {product.shortDescription}
          </p>
          <div className="flex items-center gap-2">
            <span className="font-bold text-brand-green text-lg">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
