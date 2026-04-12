import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  products,
  CATEGORY_LABELS,
} from "@/data/products";
import ProductCard from "@/components/ProductCard";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | Фитон Крым`,
      description: product.shortDescription,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.image,
    brand: { "@type": "Brand", name: "Фитон Крым" },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
      url: product.ozonUrl,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://phyton-crimea.ru" },
      { "@type": "ListItem", position: 2, name: "Каталог", item: "https://phyton-crimea.ru/catalog" },
      { "@type": "ListItem", position: 3, name: product.name, item: `https://phyton-crimea.ru/catalog/${product.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-beige-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-brand-green transition-colors">Главная</Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-brand-green transition-colors">Каталог</Link>
            <span>/</span>
            <Link
              href={`/catalog?category=${product.category}`}
              className="hover:text-brand-green transition-colors"
            >
              {CATEGORY_LABELS[product.category]}
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-brand-beige shadow-xl">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {product.featured && (
                <span className="absolute top-6 left-6 bg-brand-gold text-white text-sm font-medium px-4 py-1.5 rounded-full shadow">
                  Хит продаж
                </span>
              )}
            </div>

            {/* Info */}
            <div className="lg:sticky lg:top-24">
              <p className="text-brand-gold font-medium text-sm uppercase tracking-widest mb-3">
                {CATEGORY_LABELS[product.category]}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl text-brand-green-dark mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {product.shortDescription}
              </p>

              <div className="flex items-center gap-6 mb-8">
                <span className="font-serif text-4xl text-brand-gold font-semibold">
                  {product.price.toLocaleString("ru-RU")} ₽
                </span>
              </div>

              <a
                href={product.ozonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg px-10 py-4 w-full text-center block mb-4"
              >
                Купить на Ozon
              </a>
              <p className="text-gray-400 text-sm text-center">
                Быстрая доставка по всей России
              </p>

              {/* Divider */}
              <div className="divider-leaf my-8" />

              {/* Details */}
              <div className="space-y-6">
                {product.effect && (
                  <div>
                    <h3 className="font-serif text-lg text-brand-green-dark mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-gold inline-block" />
                      Действие
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{product.effect}</p>
                  </div>
                )}

                {product.composition && product.composition.length > 0 && (
                  <div>
                    <h3 className="font-serif text-lg text-brand-green-dark mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-gold inline-block" />
                      Состав
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                      {product.composition.map((item) => (
                        <li
                          key={item}
                          className="bg-brand-beige text-brand-green-dark text-sm px-3 py-1 rounded-full"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.application && (
                  <div>
                    <h3 className="font-serif text-lg text-brand-green-dark mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-gold inline-block" />
                      Применение
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{product.application}</p>
                  </div>
                )}

                {product.contraindications && (
                  <div>
                    <h3 className="font-serif text-lg text-brand-green-dark mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-gold inline-block" />
                      Противопоказания
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{product.contraindications}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="py-16 bg-brand-beige">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl text-brand-green-dark mb-10 text-center">
              Вам также может понравиться
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
