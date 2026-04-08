import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getProductBySlug, getProductsByCategory } from '@/lib/data/products';
import { getCategoryBySlug } from '@/lib/data/categories';
import { formatPrice } from '@/lib/utils';
import { ProductGrid } from '@/components/products/ProductGrid';
import { AddToCartButton } from '@/components/products/AddToCartButton';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: 'Товар не найден' };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.imageUrl }],
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.categorySlug);
  const related = getProductsByCategory(product.categorySlug)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8 flex-wrap">
        <Link href="/" className="hover:text-brand-green transition-colors">
          Главная
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/catalog" className="hover:text-brand-green transition-colors">
          Каталог
        </Link>
        {category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/catalog/${category.slug}`}
              className="hover:text-brand-green transition-colors"
            >
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-600 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Product detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-brand-beige">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {product.oldPrice && (
            <span className="absolute top-5 left-5 bg-red-500 text-white font-bold px-3 py-1.5 rounded-full text-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {category && (
            <Link
              href={`/catalog/${category.slug}`}
              className="text-sm text-brand-green font-medium mb-3 hover:underline"
            >
              {category.name}
            </Link>
          )}

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
            {product.name}
          </h1>

          <p className="text-gray-500 leading-relaxed mb-6">
            {product.shortDescription}
          </p>

          {/* Volume / Weight */}
          {(product.volume || product.weight) && (
            <div className="inline-flex bg-brand-beige rounded-full px-4 py-2 text-sm text-gray-600 font-medium mb-6 self-start">
              {product.volume ?? product.weight}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-serif font-bold text-4xl text-brand-green">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xl text-gray-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-8">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                product.inStock ? 'bg-green-400' : 'bg-red-400'
              }`}
            />
            <span className="text-sm text-gray-600">
              {product.inStock ? 'В наличии' : 'Нет в наличии'}
            </span>
          </div>

          {/* Add to cart */}
          <AddToCartButton product={product} />

          {/* SKU */}
          <p className="text-xs text-gray-400 mt-6">Артикул: {product.sku}</p>
        </div>
      </div>

      {/* Description & Ingredients tabs */}
      <div className="mb-20">
        <div className="border-b border-brand-beige-dark mb-8">
          <h2 className="font-serif text-2xl font-bold text-gray-800 pb-4 border-b-2 border-brand-green inline-block">
            О продукте
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Описание</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
          {product.ingredients && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Состав</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {product.ingredients}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="section-title mb-8">Из той же категории</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
