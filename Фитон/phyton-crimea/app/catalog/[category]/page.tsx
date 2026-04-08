import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGrid } from '@/components/products/ProductGrid';
import { CategoryNav } from '@/components/products/CategoryNav';
import { getCategoryBySlug } from '@/lib/data/categories';
import { getProductsByCategory } from '@/lib/data/products';

interface Props {
  params: { category: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.category);
  if (!category) return { title: 'Категория не найдена' };
  return {
    title: category.name,
    description: category.description,
  };
}

export default function CategoryPage({ params }: Props) {
  const category = getCategoryBySlug(params.category);
  if (!category) notFound();

  const products = getProductsByCategory(params.category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {category.name}
        </h1>
        <p className="text-gray-500">
          {category.description} · {products.length} товаров
        </p>
      </div>

      {/* Category filter */}
      <div className="mb-8">
        <CategoryNav />
      </div>

      {/* Products */}
      <ProductGrid
        products={products}
        emptyMessage={`В категории «${category.name}» пока нет товаров`}
      />
    </div>
  );
}
