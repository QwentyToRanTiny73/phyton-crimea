/**
 * Ozon Seller API — интеграция для синхронизации товаров с маркетплейсом Ozon.
 *
 * Документация: https://docs.ozon.ru/api/seller/
 *
 * Для подключения необходимо:
 * 1. Зарегистрироваться как продавец на https://seller.ozon.ru/
 * 2. Получить OZON_CLIENT_ID и OZON_API_KEY в личном кабинете (Настройки → API-ключи)
 * 3. Создать категорию товаров и получить category_id
 */

import type { Product } from '@/types';

const OZON_API_BASE = 'https://api-seller.ozon.ru';

function getHeaders() {
  const clientId = process.env.OZON_CLIENT_ID;
  const apiKey = process.env.OZON_API_KEY;
  if (!clientId || !apiKey) {
    throw new Error('Ozon API credentials not configured');
  }
  return {
    'Client-Id': clientId,
    'Api-Key': apiKey,
    'Content-Type': 'application/json',
  };
}

interface OzonProductItem {
  name: string;
  offer_id: string;
  price: string;
  old_price: string;
  category_id: number;
  images: string[];
  attributes: OzonAttribute[];
  description?: string;
  barcode?: string;
  height?: number;
  width?: number;
  depth?: number;
  weight?: number;
  vat: string;
}

interface OzonAttribute {
  complex_id: number;
  id: number;
  values: Array<{ value: string; dictionary_value_id?: number }>;
}

/**
 * Преобразовать товар нашего сайта в формат Ozon API
 */
function mapProductToOzon(product: Product): OzonProductItem {
  const categoryId = Number(process.env.OZON_CATEGORY_ID ?? 6396);

  return {
    name: product.name,
    offer_id: product.sku,
    price: product.price.toString(),
    old_price: (product.oldPrice ?? product.price).toString(),
    category_id: categoryId,
    images: [product.imageUrl, ...(product.images ?? [])].filter(Boolean),
    vat: '0',
    description: product.description,
    attributes: [
      {
        complex_id: 0,
        id: 85, // Бренд
        values: [{ value: 'Фитон Крым' }],
      },
      {
        complex_id: 0,
        id: 10096, // Страна изготовитель
        values: [{ value: 'Россия' }],
      },
    ],
  };
}

export interface OzonSyncResult {
  taskId: string;
  synced: number;
  errors: string[];
}

/**
 * Синхронизировать товары с Ozon
 */
export async function syncProductsToOzon(
  products: Product[]
): Promise<OzonSyncResult> {
  const items = products.map(mapProductToOzon);
  const errors: string[] = [];

  // Разбиваем на пакеты по 100 товаров (лимит API)
  const BATCH_SIZE = 100;
  let taskId = '';

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);

    try {
      const response = await fetch(`${OZON_API_BASE}/v3/product/import`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ items: batch }),
      });

      if (!response.ok) {
        const errText = await response.text();
        errors.push(`Batch ${i / BATCH_SIZE + 1}: ${response.status} — ${errText}`);
        continue;
      }

      const data = (await response.json()) as { result: { task_id: number } };
      taskId = data.result.task_id.toString();
    } catch (err) {
      errors.push(`Batch ${i / BATCH_SIZE + 1}: ${String(err)}`);
    }
  }

  return {
    taskId,
    synced: items.length - errors.length,
    errors,
  };
}

/**
 * Получить статус задачи импорта
 */
export async function getImportStatus(taskId: string): Promise<unknown> {
  const response = await fetch(`${OZON_API_BASE}/v1/product/import/info`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ task_id: Number(taskId) }),
  });

  if (!response.ok) {
    throw new Error(`Ozon API error ${response.status}`);
  }

  return response.json();
}

/**
 * Получить список товаров с Ozon (для синхронизации цен и остатков)
 */
export async function getOzonProducts(
  page = 1,
  pageSize = 100
): Promise<unknown> {
  const response = await fetch(`${OZON_API_BASE}/v2/product/list`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      filter: {},
      last_id: '',
      limit: pageSize,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ozon API error ${response.status}`);
  }

  return response.json();
}
