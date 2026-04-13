import type { Metadata } from 'next';
import { ProductGrid } from '@/components/products/ProductGrid';
import { CategoryNav } from '@/components/products/CategoryNav';
import { products } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'Каталог',
  description:
    'Полный каталог натуральной косметики Фитон Крым: кремы, масла, мыло, эфирные масла и подарочные наборы.',
};

export default function CatalogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Каталог
        </h1>
        <p className="text-gray-500">
          {products.length} товаров — вся натуральная косметика Фитон Крым
        </p>
      </div>

      {/* Category filter */}
      <div className="mb-8">
        <CategoryNav />
      </div>

      {/* Products */}
      <ProductGrid products={products} />
    </div>
  );
}
