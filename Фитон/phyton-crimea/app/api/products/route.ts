import { NextResponse } from 'next/server';
import { products, searchProducts } from '@/lib/data/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q');
  const bestseller = searchParams.get('bestseller');

  let result = products;

  if (category) {
    result = result.filter((p) => p.categorySlug === category);
  }
  if (query) {
    result = searchProducts(query);
  }
  if (bestseller === 'true') {
    result = result.filter((p) => p.isBestseller);
  }

  return NextResponse.json(result);
}
