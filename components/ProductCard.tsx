import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { CATEGORY_LABELS } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm card-hover group">
      <Link href={`/catalog/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-brand-beige">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {product.featured && (
            <span className="absolute top-3 left-3 bg-brand-gold text-white text-xs font-medium px-2.5 py-1 rounded-full">
              Хит
            </span>
          )}
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-brand-green text-xs font-medium px-2.5 py-1 rounded-full">
            {CATEGORY_LABELS[product.category]}
          </span>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/catalog/${product.slug}`}>
          <h3 className="font-serif text-lg text-brand-green-dark mb-1 leading-snug group-hover:text-brand-green transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.shortDescription}</p>

        <div className="flex items-center justify-between gap-2">
          <span className="text-brand-gold font-semibold text-lg">
            {product.price.toLocaleString("ru-RU")} ₽
          </span>
          <a
            href={product.ozonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs py-2 px-4"
          >
            Купить
          </a>
        </div>
      </div>
    </article>
  );
}
