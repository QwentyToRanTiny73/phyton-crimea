import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { products, getAllCategories, getProductsByCategory, CATEGORY_LABELS } from "@/data/products";
import type { ProductCategory } from "@/data/products";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Каталог натуральной косметики",
  description:
    "Полный каталог натуральной косметики Фитон Крым: бальзамы, мыло, бальзамы для губ, монастырское мыло. Производство Крым.",
  openGraph: {
    title: "Каталог — Фитон Крым",
    description: "Натуральная косметика из Крыма: бальзамы, мыло и уходовые средства.",
  },
};

export default function CatalogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const selectedCategory = searchParams.category as ProductCategory | undefined;
  const categories = getAllCategories();

  const displayed =
    selectedCategory && categories.includes(selectedCategory)
      ? getProductsByCategory(selectedCategory)
      : products;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://phyton-crimea.ru" },
      { "@type": "ListItem", position: 2, name: "Каталог", item: "https://phyton-crimea.ru/catalog" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="bg-brand-green py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-white/60 text-sm mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <span className="text-white">Каталог</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Каталог</h1>
          <p className="text-white/70 text-lg max-w-xl">
            Натуральная косметика ручной работы из Крыма — {products.length} позиций
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="sticky top-16 z-40 bg-white border-b border-brand-beige-dark shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
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
