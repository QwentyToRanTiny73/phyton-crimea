import { NextResponse } from 'next/server';
import { syncProductsToOzon } from '@/lib/ozon/client';
import { products } from '@/lib/data/products';

/**
 * POST /api/ozon/sync
 *
 * Синхронизирует товары сайта с маркетплейсом Ozon.
 * Защищено ключом API_SYNC_SECRET (задайте в .env).
 *
 * Пример вызова:
 *   curl -X POST https://your-domain.ru/api/ozon/sync \
 *     -H "Authorization: Bearer YOUR_SYNC_SECRET"
 */
export async function POST(request: Request) {
  // Auth check
  const authHeader = request.headers.get('authorization') ?? '';
  const syncSecret = process.env.API_SYNC_SECRET;

  if (syncSecret && authHeader !== `Bearer ${syncSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const categorySlug = body.category as string | undefined;

    const toSync = categorySlug
      ? products.filter((p) => p.categorySlug === categorySlug)
      : products;

    if (toSync.length === 0) {
      return NextResponse.json({ message: 'Нет товаров для синхронизации' });
    }

    const result = await syncProductsToOzon(toSync);

    return NextResponse.json({
      success: result.errors.length === 0,
      synced: result.synced,
      taskId: result.taskId,
      errors: result.errors,
      message: `Синхронизировано ${result.synced} из ${toSync.length} товаров`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ошибка синхронизации';
    console.error('Ozon sync error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
