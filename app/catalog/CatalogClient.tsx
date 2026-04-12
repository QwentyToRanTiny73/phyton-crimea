"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import {
  products,
  getAllCategories,
  getProductsByCategory,
  CATEGORY_LABELS,
} from "@/data/products";
import type { ProductCategory } from "@/data/products";

export default function CatalogClient() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") as ProductCategory | undefined;
  const categories = getAllCategories();

  const displayed =
    selectedCategory && categories.includes(selectedCategory)
      ? getProductsByCategory(selectedCategory)
      : products;

  return (
    <>
      {/* Category filter */}
      <section className="sticky top-16 z-40 bg-white border-b border-brand-beige-dark shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto">
            <Link
              href="/catalog"
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                !selectedCategory
                  ? "bg-brand-green text-white"
                  : "bg-brand-beige text-gray-600 hover:bg-brand-beige-dark"
              }`}
            >
              Все ({products.length})
            </Link>
            {categories.map((cat) => {
              const count = getProductsByCategory(cat).length;
              return (
                <Link
                  key={cat}
                  href={`/catalog?category=${cat}`}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-brand-green text-white"
                      : "bg-brand-beige text-gray-600 hover:bg-brand-beige-dark"
                  }`}
                >
                  {CATEGORY_LABELS[cat]} ({count})
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-12 bg-brand-beige min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedCategory && (
            <div className="mb-8">
              <h2 className="font-serif text-2xl text-brand-green-dark">
                {CATEGORY_LABELS[selectedCategory]}
              </h2>
              <p className="text-gray-500 text-sm mt-1">{displayed.length} товаров</p>
            </div>
          )}
          {displayed.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {displayed.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-2xl mb-2">Ничего не найдено</p>
              <Link href="/catalog" className="btn-outline mt-4 inline-block">
                Сбросить фильтр
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
