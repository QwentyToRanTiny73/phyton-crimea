import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { products } from "@/data/products";
import CatalogClient from "./CatalogClient";

export const metadata: Metadata = {
  title: "Каталог натуральной косметики",
  description:
    "Полный каталог натуральной косметики Фитон Крым: бальзамы, мыло, бальзамы для губ, монастырское мыло. Производство Крым.",
  openGraph: {
    title: "Каталог — Фитон Крым",
    description: "Натуральная косметика из Крыма: бальзамы, мыло и уходовые средства.",
  },
};

export default function CatalogPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://phyton-crimea.vercel.app" },
      { "@type": "ListItem", position: 2, name: "Каталог", item: "https://phyton-crimea.vercel.app/catalog" },
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

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 bg-brand-beige min-h-[50vh]">
            <div className="text-brand-green text-lg font-serif">Загрузка каталога...</div>
          </div>
        }
      >
        <CatalogClient />
      </Suspense>
    </>
  );
}
